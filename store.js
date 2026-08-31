/* FILE: store.js — Unified Storage Bridge for Notes & Gallery powered by osdb */
(function() {
  window.store = {
    async init() {
      if (window.osdb) return window.osdb.init();
    },

    async put(storeName, item) {
      if (!window.osdb) return item;
      return window.osdb.put(storeName, item);
    },

    async get(storeName, id) {
      if (!window.osdb) return null;
      return window.osdb.get(storeName, id);
    },

    async getAll(storeName) {
      if (!window.osdb) return [];
      return window.osdb.getAll(storeName);
    },

    async delete(storeName, id) {
      if (!window.osdb) return false;
      return window.osdb.delete(storeName, id);
    },

    async clear(storeName) {
      if (!window.osdb) return false;
      return window.osdb.clear(storeName);
    },

    async clearAll() {
      if (!window.osdb) return false;
      for (const s of ['notes', 'gallery']) {
        await window.osdb.clear(s);
      }
      return true;
    },

    async getTotalStorageUsed() {
      try {
        const notes = await this.getAll('notes');
        const photos = await this.getAll('gallery');
        const notesCount = notes ? notes.length : 0;
        const photosCount = photos ? photos.length : 0;
        let photosBytes = 0;
        (photos || []).forEach(p => { photosBytes += (p.dataUrl || '').length; });
        const photosMB = parseFloat((photosBytes / (1024 * 1024)).toFixed(2)) || (photosCount * 1.5);
        const notesKB = parseFloat(((JSON.stringify(notes || []).length * 2) / 1024).toFixed(2)) || (notesCount * 0.5);
        const totalUserMB = parseFloat(((notesKB / 1024) + photosMB).toFixed(2));
        return { notesCount, photosCount, notesKB, photosMB, totalUserMB };
      } catch (err) {
        return { notesCount: 0, photosCount: 0, notesKB: 0, photosMB: 0, totalUserMB: 0 };
      }
    }
  };
})();
