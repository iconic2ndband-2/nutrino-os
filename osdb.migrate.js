/* FILE: osdb.migrate.js — One-time legacy localStorage to osdb migration engine */
(function() {
  window.osdbMigrate = async function(osdb) {
    if (typeof localStorage === 'undefined' || localStorage.length === 0) return;
    try {
      const theme = localStorage.getItem('nutrino_theme') || 'dark';
      const wp = localStorage.getItem('nutrino_wallpaper') || 'gradient-1';
      const bright = parseInt(localStorage.getItem('nutrino_brightness') || '100', 10);
      await osdb.put('settings', { id: 'theme', val: theme });
      await osdb.put('settings', { id: 'wallpaper', val: wp });
      await osdb.put('settings', { id: 'brightness', val: bright });

      const bal = parseFloat(localStorage.getItem('nos_bank_bal')) || 100;
      const tx = JSON.parse(localStorage.getItem('nos_bank_tx') || '[]');
      await osdb.put('bank', { id: 'balance', val: bal });
      await osdb.put('bank', { id: 'transactions', val: tx });

      const plan = localStorage.getItem('nos_plan') || 'free';
      const speed = parseInt(localStorage.getItem('nos_speed') || '1', 10);
      const dataUsed = parseFloat(localStorage.getItem('nos_data') || '0');
      await osdb.put('internet', { id: 'plan', val: plan });
      await osdb.put('internet', { id: 'speed', val: speed });
      await osdb.put('internet', { id: 'data_used', val: dataUsed });

      const apps = JSON.parse(localStorage.getItem('nos_installed_apps') || '[]');
      const actVers = JSON.parse(localStorage.getItem('nos_active_versions') || '{}');
      await osdb.put('installed', { id: 'apps', val: apps });
      await osdb.put('installed', { id: 'active_versions', val: actVers });

      const gsDb = JSON.parse(localStorage.getItem('gamesafe_db') || '{}');
      const gsSub = JSON.parse(localStorage.getItem('gamesafe_sub') || '{}');
      const gsUser = localStorage.getItem('gamesafe_user') || '';
      await osdb.put('gamesafe', { id: 'db', val: gsDb });
      await osdb.put('gamesafe', { id: 'sub', val: gsSub });
      if (gsUser) await osdb.put('gamesafe', { id: 'current_user', val: gsUser });

      const serial = localStorage.getItem('nos_device_serial') || 'NOS-11-8942-X';
      const imei = localStorage.getItem('nos_device_imei') || '35-920148-739102-4';
      await osdb.put('device', { id: 'serial', val: serial });
      await osdb.put('device', { id: 'imei', val: imei });

      const home3d = localStorage.getItem('nos_wp_home_3d');
      const lock3d = localStorage.getItem('nos_wp_lock_3d');
      if (home3d) await osdb.put('appdata', { id: 'wp_home_3d', val: home3d });
      if (lock3d) await osdb.put('appdata', { id: 'wp_lock_3d', val: lock3d });

      localStorage.clear();
    } catch (e) {
      console.warn('osdb migration warning:', e);
    }
  };
})();
