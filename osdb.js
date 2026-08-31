/* FILE: osdb.js — Unified IndexedDB Storage Engine (osdb) with 9 Object Stores */
class OSDB {
  constructor() {
    this.db = null;
    this.dbName = 'osdb';
    this.version = 1;
    this.stores = ['settings', 'bank', 'internet', 'installed', 'notes', 'gallery', 'gamesafe', 'device', 'appdata'];
  }

  async init() {
    if (this.db) return this.db;
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(this.dbName, this.version);
      req.onupgradeneeded = (e) => {
        const db = e.target.result;
        this.stores.forEach(s => {
          if (!db.objectStoreNames.contains(s)) db.createObjectStore(s, { keyPath: 'id' });
        });
      };
      req.onsuccess = async (e) => {
        this.db = e.target.result;
        if (window.osdbMigrate) await window.osdbMigrate(this);
        resolve(this.db);
      };
      req.onerror = (e) => reject(e.target.error);
    });
  }

  async get(store, id) {
    await this.init();
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(store, 'readonly');
      const req = tx.objectStore(store).get(id);
      req.onsuccess = () => resolve(req.result ? (req.result.val !== undefined ? req.result.val : req.result) : null);
      req.onerror = (e) => reject(e.target.error);
    });
  }

  async put(store, data) {
    await this.init();
    const payload = (typeof data === 'object' && data !== null && 'id' in data) ? data : { id: String(data?.id || 'default'), val: data };
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(store, 'readwrite');
      const req = tx.objectStore(store).put(payload);
      req.onsuccess = () => resolve(payload);
      req.onerror = (e) => reject(e.target.error);
    });
  }

  async getAll(store) {
    await this.init();
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(store, 'readonly');
      const req = tx.objectStore(store).getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = (e) => reject(e.target.error);
    });
  }

  async delete(store, id) {
    await this.init();
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(store, 'readwrite');
      const req = tx.objectStore(store).delete(id);
      req.onsuccess = () => resolve(true);
      req.onerror = (e) => reject(e.target.error);
    });
  }

  async clear(store) {
    await this.init();
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(store, 'readwrite');
      const req = tx.objectStore(store).clear();
      req.onsuccess = () => resolve(true);
      req.onerror = (e) => reject(e.target.error);
    });
  }

  async getAllStores() {
    await this.init();
    const result = {};
    for (const store of this.stores) result[store] = await this.getAll(store);
    return result;
  }

  async exportAll() {
    const data = await this.getAllStores();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'osdb_backup.json';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 500);
    return true;
  }

  async importAll(data) {
    if (!data || typeof data !== 'object') return false;
    for (const store of this.stores) {
      if (Array.isArray(data[store])) {
        await this.clear(store);
        for (const item of data[store]) await this.put(store, item);
      }
    }
    return true;
  }

  async getStats() {
    const all = await this.getAllStores();
    let totalEntries = 0, totalBytes = 0;
    const storeCounts = {};
    for (const [store, items] of Object.entries(all)) {
      storeCounts[store] = items.length;
      totalEntries += items.length;
      totalBytes += JSON.stringify(items).length * 2;
    }
    const sizeMB = (totalBytes / (1024 * 1024)).toFixed(2);
    return { totalEntries, storeCounts, totalBytes, sizeMB: parseFloat(sizeMB) || 0.01, stores: this.stores.length };
  }
}

window.osdb = new OSDB();
