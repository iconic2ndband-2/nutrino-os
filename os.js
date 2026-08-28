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
      if (window.theme?.init) {
        window.theme.init();
        this.state.settings = window.theme.getSettings();
      }

      this.state.currentPlan = localStorage.getItem(K.PLAN) || 'free';
      this.state.internetSpeed = parseInt(localStorage.getItem(K.SPEED), 10) || 1;
      this.state.dataUsage = parseFloat(localStorage.getItem(K.DATA)) || 0;
      this.state.bankBalance = parseFloat(localStorage.getItem(K.BAL)) ?? 100;
      this.state.bankTransactions = JSON.parse(localStorage.getItem(K.TX) || '[]');
      this.state.installedApps = JSON.parse(localStorage.getItem(K.APPS) || '[]');

      const statusbarContainer = document.getElementById('os-statusbar-container');
      if (statusbarContainer && window.statusbar) window.statusbar.mount(statusbarContainer);

      const viewport = document.getElementById('os-viewport');
      if (viewport && window.router) {
        window.router.init(viewport);
        window.router.navigate('lockscreen');
        this.state.screen = 'lockscreen';
      }
    },

    launchApp(name) {
      this.state.screen = 'app';
      this.state.app = name;
      if (window.router) window.router.navigate('app', name);
    },

    goBack() {
      if (window.router) {
        window.router.goBack();
        this.state.screen = window.router.getCurrentScreen();
      }
    },

    setTheme(mode) {
      this.state.settings.theme = mode;
      if (window.theme) window.theme.setTheme(mode);
    },

    setWallpaper(id) {
      this.state.settings.wallpaper = id;
      if (window.theme) window.theme.setWallpaper(id);
    },

    setBrightness(level) {
      this.state.settings.brightness = level;
      if (window.theme) window.theme.setBrightness(level);
    },

    purchase(itemName, price, onSuccess, onCancel) {
      if (window.purchaseModal) {
        window.purchaseModal.open(itemName, price, onSuccess, onCancel);
      } else if (this.deductBank(price, `Purchase: ${itemName}`)) {
        if (typeof onSuccess === 'function') onSuccess();
      } else if (typeof onCancel === 'function') onCancel();
    },

    setInternetPlan(planId) {
      const plan = (window.CONSTANTS.NETWORK_PLANS || []).find(p => p.id === planId);
      if (!plan) return { success: false, message: 'Invalid plan selected' };
      this.state.currentPlan = plan.id;
      this.state.internetSpeed = plan.speed;
      localStorage.setItem(K.PLAN, plan.id);
      localStorage.setItem(K.SPEED, plan.speed.toString());
      if (window.statusbar?.updateSpeed) window.statusbar.updateSpeed();
      return { success: true, message: `Subscribed to ${plan.name} (${plan.speed} Mbps)` };
    },

    getDeviceInfo() {
      return window.deviceInfo ? window.deviceInfo.getSpecs() : window.CONSTANTS.DEVICE_SPECS;
    },

    async getStorageStats() {
      return window.deviceInfo ? window.deviceInfo.getStorageStats() : { totalCapacityGB: 128, totalUsedGB: 8.5 };
    },

    getDownloadTime(sizeInMB) {
      return Math.max(0.1, sizeInMB / (this.state.internetSpeed || 1));
    },

    installApp(appId) {
      if (!this.state.installedApps.includes(appId)) {
        this.state.installedApps.push(appId);
        localStorage.setItem(K.APPS, JSON.stringify(this.state.installedApps));
      }
    },

    isAppInstalled(appId) {
      return this.state.installedApps.includes(appId);
    },

    deductBank(amount, desc) {
      if (this.state.bankBalance < amount) return false;
      this.state.bankBalance -= amount;
      this.state.bankTransactions.unshift({
        type: 'Debit', amount, desc,
        date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
      localStorage.setItem(K.BAL, this.state.bankBalance.toString());
      localStorage.setItem(K.TX, JSON.stringify(this.state.bankTransactions));
      return true;
    },

    addBank(amount, desc) {
      this.state.bankBalance += amount;
      this.state.bankTransactions.unshift({
        type: 'Deposit', amount, desc,
        date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
      localStorage.setItem(K.BAL, this.state.bankBalance.toString());
      localStorage.setItem(K.TX, JSON.stringify(this.state.bankTransactions));
    },

    addDataUsage(mb) {
      this.state.dataUsage += mb;
      localStorage.setItem(K.DATA, this.state.dataUsage.toString());
    },

    resetFactory() {
      localStorage.clear();
      this.state.currentPlan = 'free';
      this.state.internetSpeed = 1;
      this.state.dataUsage = 0;
      this.state.bankBalance = 100;
      this.state.bankTransactions = [];
      this.state.installedApps = [];
      this.state.settings = { theme: 'dark', wallpaper: 'gradient-1', brightness: 100 };
    }
  };
})();
