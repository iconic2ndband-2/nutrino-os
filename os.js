/* FILE: os.js — Core operating system kernel, state manager, and lifecycle coordinator */
(function() {
  const K = { PLAN: 'nos_plan', SPEED: 'nos_speed', DATA: 'nos_data', BAL: 'nos_bank_bal', TX: 'nos_bank_tx', APPS: 'nos_installed_apps' };

  window.os = {
    state: {
      screen: 'lockscreen', app: null, history: [],
      settings: { theme: 'dark', wallpaper: 'gradient-1', brightness: 100 },
      internetSpeed: 1, currentPlan: 'free', dataUsage: 0,
      bankBalance: 100, bankTransactions: [], installedApps: []
    },

    async boot() {
      if (window.store?.init) try { await window.store.init(); } catch (e) { console.warn(e); }
      if (window.deviceInfo?.init) window.deviceInfo.init();
      if (window.theme?.init) { window.theme.init(); this.state.settings = window.theme.getSettings(); }

      this.state.currentPlan = localStorage.getItem(K.PLAN) || 'free';
      this.state.internetSpeed = parseInt(localStorage.getItem(K.SPEED), 10) || 1;
      this.state.dataUsage = parseFloat(localStorage.getItem(K.DATA)) || 0;
      const rawBal = localStorage.getItem(K.BAL);
      const parsedBal = parseFloat(rawBal);
      this.state.bankBalance = (rawBal !== null && !isNaN(parsedBal)) ? parsedBal : 100;
      this.state.bankTransactions = JSON.parse(localStorage.getItem(K.TX) || '[]');
      
      try {
        const storedApps = localStorage.getItem(K.APPS);
        this.state.installedApps = storedApps ? JSON.parse(storedApps) : [];
        if (!Array.isArray(this.state.installedApps)) this.state.installedApps = [];
      } catch (e) {
        this.state.installedApps = [];
      }

      const statusEl = document.getElementById('os-statusbar-container');
      if (statusEl && window.statusbar) window.statusbar.mount(statusEl);

      const viewport = document.getElementById('os-viewport');
      if (viewport && window.router) { window.router.init(viewport); window.router.navigate('lockscreen'); this.state.screen = 'lockscreen'; }
    },

    launchApp(name) { this.state.screen = 'app'; this.state.app = name; window.router?.navigate('app', name); },
    goBack() { if (window.router) { window.router.goBack(); this.state.screen = window.router.getCurrentScreen(); } },
    setTheme(m) { this.state.settings.theme = m; window.theme?.setTheme(m); },
    setWallpaper(id) { this.state.settings.wallpaper = id; window.theme?.setWallpaper(id); },
    setBrightness(lvl) { this.state.settings.brightness = lvl; window.theme?.setBrightness(lvl); },

    getDeviceInfo() {
      return window.deviceInfo ? window.deviceInfo.getSpecs() : (window.CONSTANTS?.DEVICE_SPECS || {});
    },
    async getStorageStats() {
      return window.deviceInfo ? await window.deviceInfo.getStorageStats() : {
        totalCapacityGB: 128, totalUsedGB: 8.5, freeGB: 119.5, usedPercentage: 6.6,
        systemGB: 8.5, userStats: { notesCount: 0, photosCount: 0, notesKB: 0, photosMB: 0 }, appsMB: 0
      };
    },

    purchase(itemName, price, onSuccess, onCancel) {
      if (window.purchaseModal) window.purchaseModal.open(itemName, price, onSuccess, onCancel);
      else if (this.deductBank(price, `Purchase: ${itemName}`)) { onSuccess?.(); } else { onCancel?.(); }
    },

    setInternetPlan(planId) {
      const plan = (window.CONSTANTS.NETWORK_PLANS || []).find(p => p.id === planId);
      if (!plan) return { success: false, message: 'Invalid plan selected' };
      this.state.currentPlan = plan.id; this.state.internetSpeed = plan.speed;
      localStorage.setItem(K.PLAN, plan.id); localStorage.setItem(K.SPEED, plan.speed.toString());
      window.statusbar?.updateSpeed?.();
      return { success: true, message: `Subscribed to ${plan.name} (${plan.speed} Mbps)` };
    },

    getDataLimitMB() {
      const plan = (window.CONSTANTS.NETWORK_PLANS || []).find(p => p.id === this.state.currentPlan);
      return (plan ? plan.dataLimitGB : 1) * 1024;
    },

    isDataExceeded() { return this.state.dataUsage >= this.getDataLimitMB(); },
    getEffectiveSpeed() { return this.isDataExceeded() ? 1 : (this.state.internetSpeed || 1); },
    addDataUsage(mb) { this.state.dataUsage += mb; localStorage.setItem(K.DATA, this.state.dataUsage.toString()); },
    getDownloadTime(sizeInMB) { return Math.max(0.1, sizeInMB / this.getEffectiveSpeed()); },

    installApp(appId) {
      if (!Array.isArray(this.state.installedApps)) this.state.installedApps = [];
      if (!this.state.installedApps.includes(appId)) {
        this.state.installedApps.push(appId);
        localStorage.setItem(K.APPS, JSON.stringify(this.state.installedApps));
      }
    },

    uninstallApp(appId) {
      if (!Array.isArray(this.state.installedApps)) {
        try { this.state.installedApps = JSON.parse(localStorage.getItem(K.APPS) || '[]'); }
        catch (e) { this.state.installedApps = []; }
      }
      
      const idx = this.state.installedApps.indexOf(appId);
      if (idx !== -1) {
        this.state.installedApps.splice(idx, 1);
        localStorage.setItem(K.APPS, JSON.stringify(this.state.installedApps));
      }

      // Deep clean app-specific sandbox states & connections
      try {
        if (appId === 'gamesafe') {
          localStorage.removeItem('gamesafe_user');
          localStorage.removeItem('gamesafe_sub');
          localStorage.removeItem('gamesafe_connections');
        } else {
          const conns = JSON.parse(localStorage.getItem('gamesafe_connections') || '[]');
          const cIdx = conns.indexOf(appId);
          if (cIdx !== -1) {
            conns.splice(cIdx, 1);
            localStorage.setItem('gamesafe_connections', JSON.stringify(conns));
          }
        }
      } catch (e) {
        console.warn('Sandbox cleanup warning:', e);
      }

      return true;
    },

    isAppInstalled(appId) {
      if (!Array.isArray(this.state.installedApps)) return false;
      return this.state.installedApps.includes(appId);
    },

    deductBank(amount, desc) {
      const num = Math.abs(parseFloat(amount)) || 0;
      if (isNaN(this.state.bankBalance) || typeof this.state.bankBalance !== 'number') this.state.bankBalance = 100;
      if (this.state.bankBalance < num || num <= 0) return false;
      this.state.bankBalance = Math.round((this.state.bankBalance - num) * 100) / 100;
      this.state.bankTransactions.unshift({ type: 'Debit', amount: num, desc, date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) });
      localStorage.setItem(K.BAL, this.state.bankBalance.toString());
      localStorage.setItem(K.TX, JSON.stringify(this.state.bankTransactions));
      return true;
    },

    addBank(amount, desc) {
      const num = Math.abs(parseFloat(amount)) || 0;
      if (isNaN(this.state.bankBalance) || typeof this.state.bankBalance !== 'number') this.state.bankBalance = 100;
      this.state.bankBalance = Math.round((this.state.bankBalance + num) * 100) / 100;
      this.state.bankTransactions.unshift({ type: 'Deposit', amount: num, desc: desc || 'ATM Cash Deposit', date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) });
      localStorage.setItem(K.BAL, this.state.bankBalance.toString());
      localStorage.setItem(K.TX, JSON.stringify(this.state.bankTransactions));
      return this.state.bankBalance;
    },

    checkGamesafeSubscription() {
      try {
        if (!this.isAppInstalled('gamesafe')) return false;
        const subData = JSON.parse(localStorage.getItem('gamesafe_sub') || '{}');
        return Boolean(subData && subData.isActive);
      } catch (e) { return false; }
    },

    resetFactory(keepGamesafe = false) {
      let savedGsUser = null, savedGsSub = null, savedGsSaves = null, savedGsConn = null;
      if (keepGamesafe) {
        savedGsUser = localStorage.getItem('gamesafe_user');
        savedGsSub = localStorage.getItem('gamesafe_sub');
        savedGsSaves = localStorage.getItem('gamesafe_saves');
        savedGsConn = localStorage.getItem('gamesafe_connections');
      }
      localStorage.clear();
      if (keepGamesafe) {
        if (savedGsUser) localStorage.setItem('gamesafe_user', savedGsUser);
        if (savedGsSub) localStorage.setItem('gamesafe_sub', savedGsSub);
        if (savedGsSaves) localStorage.setItem('gamesafe_saves', savedGsSaves);
        if (savedGsConn) localStorage.setItem('gamesafe_connections', savedGsConn);
        this.state.installedApps = ['gamesafe'];
        localStorage.setItem(K.APPS, JSON.stringify(['gamesafe']));
      } else {
        this.state.installedApps = [];
      }
      this.state.currentPlan = 'free'; this.state.internetSpeed = 1; this.state.dataUsage = 0;
      this.state.bankBalance = 100; this.state.bankTransactions = [];
      this.state.settings = { theme: 'dark', wallpaper: 'gradient-1', brightness: 100 };
    }
  };
})();
