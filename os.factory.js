/* FILE: os.factory.js — Factory reset partition cleaner and state restoration */
(function() {
  window.osFactory = {
    async reset(osInstance, keepGamesafe = false) {
      if (!window.osdb) return;
      const stores = window.osdb.stores || [];
      for (const s of stores) {
        if (keepGamesafe && s === 'gamesafe') continue;
        await window.osdb.clear(s);
      }
      osInstance.state.installedApps = keepGamesafe ? ['gamesafe'] : [];
      osInstance.state.currentPlan = 'free';
      osInstance.state.internetSpeed = 1;
      osInstance.state.dataUsage = 0;
      osInstance.state.bankBalance = 100;
      osInstance.state.bankTransactions = [];
      osInstance.state.settings = { theme: 'dark', wallpaper: 'gradient-1', brightness: 100 };

      await window.osdb.put('installed', { id: 'apps', val: osInstance.state.installedApps });
      await window.osdb.put('bank', { id: 'balance', val: 100 });
      await window.osdb.put('bank', { id: 'transactions', val: [] });
      await window.osdb.put('internet', { id: 'plan', val: 'free' });
      await window.osdb.put('internet', { id: 'speed', val: 1 });
      await window.osdb.put('internet', { id: 'data_used', val: 0 });
      await window.osdb.put('settings', { id: 'theme', val: 'dark' });
      await window.osdb.put('settings', { id: 'wallpaper', val: 'gradient-1' });
      await window.osdb.put('settings', { id: 'brightness', val: 100 });
    }
  };
})();
