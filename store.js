/* FILE: store.js — IndexedDB local storage engine for persistent apps */
(function() {
  const DB_NAME = window.CONSTANTS.DB_NAME || 'NutrinoOS_DB';
  const DB_VERSION = window.CONSTANTS.DB_VERSION || 1;
  let dbInstance = null;

  async function getDB() {
    if (dbInstance) return dbInstance;
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains('notes')) {
          db.createObjectStore('notes', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('gallery')) {
          db.createObjectStore('gallery', { keyPath: 'id' });
        }
      };
      request.onsuccess = (event) => {
        dbInstance = event.target.result;
        resolve(dbInstance);
      };
      request.onerror = (event) => {
        reject(event.target.error);
      };
    });
  }

  window.store = {
    async init() {
      return getDB();
    },

    async put(storeName, item) {
      const db = await getDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        const req = store.put(item);
        req.onsuccess = () => resolve(item);
        req.onerror = (e) => reject(e.target.error);
      });
    },

    async get(storeName, id) {
      const db = await getDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, 'readonly');
        const store = tx.objectStore(storeName);
        const req = store.get(id);
        req.onsuccess = () => resolve(req.result);
        req.onerror = (e) => reject(e.target.error);
      });
    },

    async getAll(storeName) {
      const db = await getDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, 'readonly');
        const store = tx.objectStore(storeName);
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = (e) => reject(e.target.error);
      });
    },

    async delete(storeName, id) {
      const db = await getDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        const req = store.delete(id);
        req.onsuccess = () => resolve(true);
        req.onerror = (e) => reject(e.target.error);
      });
    },

    async clearAll() {
      const db = await getDB();
      return new Promise((resolve, reject) => {
        const stores = ['notes', 'gallery'];
        const tx = db.transaction(stores, 'readwrite');
        stores.forEach(s => {
          if (db.objectStoreNames.contains(s)) {
            tx.objectStore(s).clear();
          }
        });
        tx.oncomplete = () => resolve(true);
        tx.onerror = (e) => reject(e.target.error);
      });
    },

    async getTotalStorageUsed() {
      try {
        const notes = await this.getAll('notes');
        const photos = await this.getAll('gallery');
        const notesCount = notes ? notes.length : 0;
        const photosCount = photos ? photos.length : 0;
        const notesKB = notesCount * 1; // 1 KB each
        const photosMB = photosCount * 2; // 2 MB each
        const totalUserMB = (notesKB / 1024) + photosMB;
        return {
          notesCount,
          photosCount,
          notesKB,
          photosMB,
          totalUserMB: parseFloat(totalUserMB.toFixed(2))
        };
      } catch (err) {
        return { notesCount: 0, photosCount: 0, notesKB: 0, photosMB: 0, totalUserMB: 0 };
      }
    }
  };
})();
