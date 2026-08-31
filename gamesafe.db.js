/* FILE: gamesafe.db.js — Gamesafe cloud save vault powered by osdb (IndexedDB) */
(function() {
  let inMemoryDB = {};

  async function syncFromOSDB() {
    if (!window.osdb) return;
    try {
      const entry = await window.osdb.get('gamesafe', 'db');
      if (entry && typeof entry === 'object') inMemoryDB = entry;
    } catch (e) {}
  }

  function persistToOSDB() {
    if (window.osdb) {
      window.osdb.put('gamesafe', { id: 'db', val: inMemoryDB });
    }
  }

  window.gamesafeDB = {
    async init() {
      await syncFromOSDB();
    },

    save(appKey, username, data) {
      if (!appKey || !username) return false;
      if (!inMemoryDB[appKey]) inMemoryDB[appKey] = {};
      inMemoryDB[appKey][username] = {
        ...data,
        username,
        updatedAt: new Date().toISOString()
      };
      persistToOSDB();
      return true;
    },

    load(appKey, username) {
      if (!appKey || !username) return null;
      return (inMemoryDB[appKey] && inMemoryDB[appKey][username]) ? inMemoryDB[appKey][username] : null;
    },

    exists(appKey, username) {
      if (!appKey || !username) return false;
      return Boolean(inMemoryDB[appKey] && inMemoryDB[appKey][username]);
    },

    getAllAccounts(appKey) {
      if (!appKey) return [];
      return inMemoryDB[appKey] ? Object.keys(inMemoryDB[appKey]) : [];
    },

    delete(appKey, username) {
      if (!appKey || !username) return false;
      if (inMemoryDB[appKey] && inMemoryDB[appKey][username]) {
        delete inMemoryDB[appKey][username];
        persistToOSDB();
        return true;
      }
      return false;
    },

    getRawDB() { return inMemoryDB; },
    restoreDB(raw) {
      if (raw && typeof raw === 'object') {
        inMemoryDB = raw;
        persistToOSDB();
      }
    }
  };
})();
