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
      if (window.store?.init) try { await window.store.init(); } catch (e) {}
      if (window.deviceInfo?.init) window.deviceInfo.init();
      if (window.theme?.init) { window.theme.init(); this.state.settings = window.theme.getSettings(); }
      this.state.currentPlan = localStorage.getItem(K.PLAN) || 'free';
      this.state.internetSpeed = parseInt(localStorage.getItem(K.SPEED), 10) || 1;
      this.state.dataUsage = parseFloat(localStorage.getItem(K.DATA)) || 0;
      const rawBal = localStorage.getItem(K.BAL), parsedBal = parseFloat(rawBal);
      this.state.bankBalance = (rawBal !== null && !isNaN(parsedBal)) ? parsedBal : 100;
      this.state.bankTransactions = JSON.parse(localStorage.getItem(K.TX) || '[]');
      try { const s = localStorage.getItem(K.APPS); this.state.installedApps = s ? JSON.parse(s) : []; } catch (e) { this.state.installedApps = []; }
      const statusEl = document.getElementById('os-statusbar-container');
      if (statusEl && window.statusbar) window.statusbar.mount(statusEl);
      const vp = document.getElementById('os-viewport');
      if (vp && window.router) { window.router.init(vp); window.router.navigate('lockscreen'); this.state.screen = 'lockscreen'; }
    },

    launchApp(name) { this.state.screen = 'app'; this.state.app = name; window.router?.navigate('app', name); },
    goBack() { if (window.router) { window.router.goBack(); this.state.screen = window.router.getCurrentScreen(); } },
    setTheme(m) { this.state.settings.theme = m; window.theme?.setTheme(m); },
    setWallpaper(id) { this.state.settings.wallpaper = id; window.theme?.setWallpaper(id); },
    setBrightness(lvl) { this.state.settings.brightness = lvl; window.theme?.setBrightness(lvl); },
    getDeviceInfo() { return window.deviceInfo ? window.deviceInfo.getSpecs() : (window.CONSTANTS?.DEVICE_SPECS || {}); },
    async getStorageStats() {
      return window.deviceInfo ? await window.deviceInfo.getStorageStats() : {
        totalCapacityGB: 128, totalUsedGB: 8.5, freeGB: 119.5, usedPercentage: 6.6, systemGB: 8.5,
        userStats: { notesCount: 0, photosCount: 0, notesKB: 0, photosMB: 0 }, appsMB: 0
      };
    },

    getCPUUsage() { return window.osData ? window.osData.getCPUUsage() : 35; },
    getGPUUsage() { return window.osData ? window.osData.getGPUUsage() : 25; },
    getRAMUsage() { return window.osData ? window.osData.getRAMUsage() : { used: 1.8, free: 2.2, total: 4.0, percentage: 45 }; },
    getStorageBreakdown() { return window.osData ? window.osData.getStorageBreakdown() : null; },
    getCPUTemp() { return window.osData ? window.osData.getCPUTemp() : 48; },
    getGPUTemp() { return window.osData ? window.osData.getGPUTemp() : 42; },
    getBatteryTemp() { return window.osData ? window.osData.getBatteryTemp() : 32; },
    getUptime() { return window.osData ? window.osData.getUptime() : 120; },
    getDeviceAge() { return window.osData ? window.osData.getDeviceAge() : 42; },
    getBatteryStatus() { return window.osData ? window.osData.getBatteryStatus() : { percentage: 85, charging: false, health: 'Good' }; },
    getSignalStrength() { return window.osData ? window.osData.getSignalStrength() : 90; },
    getWiFiSignal() { return window.osData ? window.osData.getWiFiSignal() : 95; },
    getBrightness() { return window.osData ? window.osData.getBrightness() : (this.state.settings.brightness || 100); },

    isWebGLSupported() { return window.osGpu?.isWebGLSupported() ?? true; },
    isWebGL2Supported() { return window.osGpu?.isWebGL2Supported() ?? true; },
    isWebGPUSupported() { return window.osGpu?.isWebGPUSupported() ?? false; },
    getGPUInfo() { return window.osGpu?.getGPUInfo() || (this.getDeviceInfo().gpu || '2T-PEX'); },
    canRun3D() { return window.osGpu ? window.osGpu.canRun3D() : true; },

    checkForUpdates() { return window.osVersions ? window.osVersions.checkForUpdates() : []; },
    getAppVersions(id) { return window.osVersions ? window.osVersions.getAppVersions(id) : []; },
    getLatestVersion(id) { return window.osVersions ? window.osVersions.getLatestVersion(id) : { version: '1.0.0' }; },
    isUpdateAvailable(id) { return window.osVersions ? window.osVersions.isUpdateAvailable(id) : false; },
    getInstalledVersion(id) { return window.osVersions ? window.osVersions.getInstalledVersion(id) : '1.0.0'; },
    installVersion(id, ver) { return window.osVersions ? window.osVersions.installVersion(id, ver) : this.installApp(id); },

    setInternetPlan(planId) {
      const plan = (window.CONSTANTS.NETWORK_PLANS || []).find(p => p.id === planId);
      if (!plan) return { success: false, message: 'Invalid plan selected' };
      this.state.currentPlan = plan.id; this.state.internetSpeed = plan.speed;
      localStorage.setItem(K.PLAN, plan.id); localStorage.setItem(K.SPEED, plan.speed.toString());
      window.statusbar?.updateSpeed?.();
      return { success: true, message: `Subscribed to ${plan.name} (${plan.speed} Mbps)` };
    },

    getDataLimitMB() { const p = (window.CONSTANTS.NETWORK_PLANS || []).find(x => x.id === this.state.currentPlan); return (p ? p.dataLimitGB : 1) * 1024; },
    isDataExceeded() { return this.state.dataUsage >= this.getDataLimitMB(); },
    getEffectiveSpeed() { return this.isDataExceeded() ? 1 : (this.state.internetSpeed || 1); },
    addDataUsage(mb) { this.state.dataUsage += mb; localStorage.setItem(K.DATA, this.state.dataUsage.toString()); },
    getDownloadTime(sizeMB) { return Math.max(0.1, sizeMB / this.getEffectiveSpeed()); },

    installApp(appId) {
      if (!Array.isArray(this.state.installedApps)) this.state.installedApps = [];
      if (!this.state.installedApps.includes(appId)) { this.state.installedApps.push(appId); localStorage.setItem(K.APPS, JSON.stringify(this.state.installedApps)); }
    },
    uninstallApp(appId) {
      if (!Array.isArray(this.state.installedApps)) try { this.state.installedApps = JSON.parse(localStorage.getItem(K.APPS) || '[]'); } catch (e) { this.state.installedApps = []; }
      const idx = this.state.installedApps.indexOf(appId);
      if (idx !== -1) { this.state.installedApps.splice(idx, 1); localStorage.setItem(K.APPS, JSON.stringify(this.state.installedApps)); }
      return true;
    },
    isAppInstalled(appId) { return Array.isArray(this.state.installedApps) && this.state.installedApps.includes(appId); },

    deductBank(amount, desc) {
      const num = Math.abs(parseFloat(amount)) || 0;
      if (isNaN(this.state.bankBalance) || typeof this.state.bankBalance !== 'number') this.state.bankBalance = 100;
      if (this.state.bankBalance < num || num <= 0) return false;
      this.state.bankBalance = Math.round((this.state.bankBalance - num) * 100) / 100;
      this.state.bankTransactions.unshift({ type: 'Debit', amount: num, desc, date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) });
      localStorage.setItem(K.BAL, this.state.bankBalance.toString()); localStorage.setItem(K.TX, JSON.stringify(this.state.bankTransactions));
      return true;
    },
    chargeForReLogin() {
      if (this.state.bankBalance < 50) return { success: false, message: 'Insufficient funds. Re-login fee: $50' };
      const ok = this.deductBank(50, '3DPapers Account Re-login Fee');
      return ok ? { success: true, message: 'Re-login fee charged ($50)' } : { success: false, message: 'Insufficient funds. Re-login fee: $50' };
    },
    purchase(itemName, price, onSuccess, onCancel) {
      if (window.purchaseModal?.open) window.purchaseModal.open(itemName, price, onSuccess, onCancel);
      else { const ok = this.deductBank(price, itemName); if (ok && onSuccess) onSuccess({ itemName, price }); else if (onCancel) onCancel(); }
    },
    addBank(amount, desc) {
      const num = Math.abs(parseFloat(amount)) || 0;
      if (isNaN(this.state.bankBalance) || typeof this.state.bankBalance !== 'number') this.state.bankBalance = 100;
      this.state.bankBalance = Math.round((this.state.bankBalance + num) * 100) / 100;
      this.state.bankTransactions.unshift({ type: 'Deposit', amount: num, desc: desc || 'ATM Cash Deposit', date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) });
      localStorage.setItem(K.BAL, this.state.bankBalance.toString()); localStorage.setItem(K.TX, JSON.stringify(this.state.bankTransactions));
      return this.state.bankBalance;
    },
    checkGamesafeSubscription() {
      try { return this.isAppInstalled('gamesafe') && Boolean(JSON.parse(localStorage.getItem('gamesafe_sub') || '{}')?.isActive); }
      catch (e) { return false; }
    },
    resetFactory(keepGamesafe = false) {
      const gKeys = ['gamesafe_user', 'gamesafe_users', 'gamesafe_sub', 'gamesafe_saves', 'gamesafe_connections', 'gamesafe_db'];
      const saved = {};
      if (keepGamesafe) gKeys.forEach(k => { const v = localStorage.getItem(k); if (v) saved[k] = v; });
      localStorage.clear();
      if (keepGamesafe) {
        Object.entries(saved).forEach(([k, v]) => localStorage.setItem(k, v));
        this.state.installedApps = ['gamesafe']; localStorage.setItem(K.APPS, JSON.stringify(['gamesafe']));
      } else { this.state.installedApps = []; }
      this.state.currentPlan = 'free'; this.state.internetSpeed = 1; this.state.dataUsage = 0;
      this.state.bankBalance = 100; this.state.bankTransactions = [];
      this.state.settings = { theme: 'dark', wallpaper: 'gradient-1', brightness: 100 };
    }
  };
})();
