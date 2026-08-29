/* FILE: gamesafe.db.js — Multi-account database store and cloud save manager */
(function() {
  const DB_KEY = 'gamesafe_db';

  function getDB() {
    try { return JSON.parse(localStorage.getItem(DB_KEY) || '{}'); }
    catch (e) { return {}; }
  }
  function setDB(db) {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
  }

  window.gamesafeDB = {
    save(appKey, username, data) {
      if (!appKey || !username) return false;
      const db = getDB();
      if (!db[appKey]) db[appKey] = {};
      db[appKey][username] = {
        ...data,
        username,
        updatedAt: new Date().toISOString()
      };
      setDB(db);
      return true;
    },

    load(appKey, username) {
      if (!appKey || !username) return null;
      const db = getDB();
      return (db[appKey] && db[appKey][username]) ? db[appKey][username] : null;
    },

    exists(appKey, username) {
      if (!appKey || !username) return false;
      const db = getDB();
      return Boolean(db[appKey] && db[appKey][username]);
    },

    getAllAccounts(appKey) {
      if (!appKey) return [];
      const db = getDB();
      return db[appKey] ? Object.keys(db[appKey]) : [];
    },

    delete(appKey, username) {
      if (!appKey || !username) return false;
      const db = getDB();
      if (db[appKey] && db[appKey][username]) {
        delete db[appKey][username];
        setDB(db);
        return true;
      }
      return false;
    },

    getRawDB() { return getDB(); },
    restoreDB(raw) { if (raw && typeof raw === 'object') setDB(raw); }
  };
})();
