/* FILE: os.js — Core operating system kernel powered by osdb unified storage */
(function() {
  window.os = {
    state: {
      screen: 'lockscreen', app: null, history: [], settings: { theme: 'dark', wallpaper: 'gradient-1', brightness: 100 },
      internetSpeed: 1, currentPlan: 'free', dataUsage: 0, bankBalance: 100, bankTransactions: [], installedApps: []
    },

    async boot() {
      if (window.osdb?.init) try { await window.osdb.init(); } catch (e) {}
      if (window.store?.init) try { await window.store.init(); } catch (e) {}
      if (window.gamesafeDB?.init) try { await window.gamesafeDB.init(); } catch (e) {}
      if (window.deviceInfo?.init) window.deviceInfo.init();
      if (window.theme?.init) { await window.theme.init(); this.state.settings = window.theme.getSettings(); }
      
      try {
        const plan = await window.osdb?.get('internet', 'plan'), speed = await window.osdb?.get('internet', 'speed');
        const dataUsed = await window.osdb?.get('internet', 'data_used'), bal = await window.osdb?.get('bank', 'balance');
        const tx = await window.osdb?.get('bank', 'transactions'), apps = await window.osdb?.get('installed', 'apps');
        this.state.currentPlan = plan || 'free'; this.state.internetSpeed = typeof speed === 'number' ? speed : 1;
        this.state.dataUsage = typeof dataUsed === 'number' ? dataUsed : 0; this.state.bankBalance = typeof bal === 'number' ? bal : 100;
        this.state.bankTransactions = Array.isArray(tx) ? tx : []; this.state.installedApps = Array.isArray(apps) ? apps : [];
      } catch (e) {}

      const statusEl = document.getElementById('os-statusbar-container'), vp = document.getElementById('os-viewport');
      if (statusEl && window.statusbar) window.statusbar.mount(statusEl);
      if (vp && window.router) { window.router.init(vp); window.router.navigate('lockscreen'); this.state.screen = 'lockscreen'; }
      (this.state.installedApps || []).forEach(id => this.scheduleUpdateCheck(id));
    },

    launchApp(n) { this.state.screen = 'app'; this.state.app = n; window.router?.navigate('app', n); },
    goBack() { if (window.router) { window.router.goBack(); this.state.screen = window.router.getCurrentScreen(); } },
    setTheme(m) { this.state.settings.theme = m; window.theme?.setTheme(m); },
    setWallpaper(id) { this.state.settings.wallpaper = id; window.theme?.setWallpaper(id); },
    setBrightness(lvl) { this.state.settings.brightness = lvl; window.theme?.setBrightness(lvl); },
    getDeviceInfo() { return window.deviceInfo ? window.deviceInfo.getSpecs() : (window.CONSTANTS?.DEVICE_SPECS || {}); },
    async getStorageStats() { return window.deviceInfo ? await window.deviceInfo.getStorageStats() : null; },

    getCPUUsage() { return window.osData?.getCPUUsage?.() ?? 35; }, getGPUUsage() { return window.osData?.getGPUUsage?.() ?? 25; },
    getRAMUsage() { return window.osData?.getRAMUsage?.() ?? { used: 1.8, free: 2.2, total: 4.0, percentage: 45 }; },
    getStorageBreakdown() { return window.osData?.getStorageBreakdown?.() ?? null; },
    getCPUTemp() { return window.osData?.getCPUTemp?.() ?? 48; }, getGPUTemp() { return window.osData?.getGPUTemp?.() ?? 42; },
    getBatteryTemp() { return window.osData?.getBatteryTemp?.() ?? 32; }, getUptime() { return window.osData?.getUptime?.() ?? 120; },
    getDeviceAge() { return window.osData?.getDeviceAge?.() ?? 42; },
    getBatteryStatus() { return window.osData?.getBatteryStatus?.() ?? { percentage: 85, charging: false, health: 'Good' }; },
    getSignalStrength() { return window.osData?.getSignalStrength?.() ?? 90; }, getWiFiSignal() { return window.osData?.getWiFiSignal?.() ?? 95; },
    getBrightness() { return window.osData?.getBrightness?.() ?? (this.state.settings.brightness || 100); },

    isWebGLSupported() { return window.osGpu?.isWebGLSupported() ?? true; }, isWebGL2Supported() { return window.osGpu?.isWebGL2Supported() ?? true; },
    isWebGPUSupported() { return window.osGpu?.isWebGPUSupported() ?? false; }, getGPUInfo() { return window.osGpu?.getGPUInfo() || '2T-PEX'; },
    canRun3D() { return window.osGpu ? window.osGpu.canRun3D() : true; },

    checkForUpdates() { return window.osVersions?.checkForUpdates() || []; }, getAppVersions(id) { return window.osVersions?.getAppVersions(id) || []; },
    getLatestVersion(id) { return window.osVersions?.getLatestVersion(id) || { version: '1.0.0' }; },
    isUpdateAvailable(id) { return window.osVersions?.isUpdateAvailable(id) || false; }, getActiveVersion(id) { return window.osVersions?.getActiveVersion(id) || '1.0.0'; },
    setActiveVersion(id, ver) { return window.osVersions?.setActiveVersion(id, ver) || false; }, getInstalledVersion(id) { return window.osVersions?.getInstalledVersion(id) || '1.0.0'; },
    installVersion(id, ver) { return window.osVersions?.installVersion(id, ver) || this.installApp(id); },
    rollbackApp(id, ver) { return window.osVersions?.rollbackApp(id, ver) || this.installVersion(id, ver); },
    scheduleUpdateCheck(id) { window.osVersions?.scheduleUpdateCheck?.(id); }, startUpdate(id) { return window.osVersions?.startUpdate(id) ?? true; },
    addUpdateBadge(id) { window.osVersions?.addUpdateBadge?.(id); },

    applyWallpaper(screen, wpData) {
      const wpId = typeof wpData === 'object' ? (wpData.id || 'nebula') : (wpData || 'nebula');
      if (screen === 'home' || screen === 'both') window.osdb?.put('appdata', { id: 'wp_home_3d', val: wpId });
      if (screen === 'lock' || screen === 'both') window.osdb?.put('appdata', { id: 'wp_lock_3d', val: wpId });
      window.animations?.showToast?.(`3D Wallpaper applied to ${screen === 'both' ? 'Home & Lock' : (screen === 'home' ? 'Home' : 'Lock')}!`);
      return true;
    },
    getWallpaper3D(screen) {
      const v = this.getActiveVersion('3dpapers') || '1.0.0';
      if (screen === 'lock' && !v.startsWith('2')) return null;
      return window.osdb?.cache?.[screen === 'lock' ? 'wp_lock_3d' : 'wp_home_3d'] || null;
    },

    setInternetPlan(planId) {
      const plan = (window.CONSTANTS.NETWORK_PLANS || []).find(p => p.id === planId);
      if (!plan) return { success: false, message: 'Invalid plan selected' };
      this.state.currentPlan = plan.id; this.state.internetSpeed = plan.speed;
      window.osdb?.put('internet', { id: 'plan', val: plan.id });
      window.osdb?.put('internet', { id: 'speed', val: plan.speed });
      window.statusbar?.updateSpeed?.();
      return { success: true, message: `Subscribed to ${plan.name} (${plan.speed} Mbps)` };
    },
    getDataLimitMB() { const p = (window.CONSTANTS.NETWORK_PLANS || []).find(x => x.id === this.state.currentPlan); return (p ? p.dataLimitGB : 1) * 1024; },
    isDataExceeded() { return this.state.dataUsage >= this.getDataLimitMB(); }, getEffectiveSpeed() { return this.isDataExceeded() ? 1 : (this.state.internetSpeed || 1); },
    addDataUsage(mb) { this.state.dataUsage += mb; window.osdb?.put('internet', { id: 'data_used', val: this.state.dataUsage }); },
    getDownloadTime(sizeMB) { return Math.max(0.1, sizeMB / this.getEffectiveSpeed()); },

    installApp(appId) {
      if (!Array.isArray(this.state.installedApps)) this.state.installedApps = [];
      if (!this.state.installedApps.includes(appId)) {
        this.state.installedApps.push(appId);
        window.osdb?.put('installed', { id: 'apps', val: this.state.installedApps });
      }
      this.scheduleUpdateCheck(appId);
    },
    uninstallApp(appId) {
      if (!Array.isArray(this.state.installedApps)) this.state.installedApps = [];
      const idx = this.state.installedApps.indexOf(appId);
      if (idx !== -1) {
        this.state.installedApps.splice(idx, 1);
        window.osdb?.put('installed', { id: 'apps', val: this.state.installedApps });
      }
      return true;
    },
    isAppInstalled(appId) { return Array.isArray(this.state.installedApps) && this.state.installedApps.includes(appId); },

    deductBank(amount, desc) {
      const num = Math.abs(parseFloat(amount)) || 0;
      if (isNaN(this.state.bankBalance) || typeof this.state.bankBalance !== 'number') this.state.bankBalance = 100;
      if (this.state.bankBalance < num || num <= 0) return false;
      this.state.bankBalance = Math.round((this.state.bankBalance - num) * 100) / 100;
      this.state.bankTransactions.unshift({ type: 'Debit', amount: num, desc, date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) });
      window.osdb?.put('bank', { id: 'balance', val: this.state.bankBalance });
      window.osdb?.put('bank', { id: 'transactions', val: this.state.bankTransactions });
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
      this.state.bankTransactions.unshift({ type: 'Deposit', amount: num, desc: desc || 'ATM Cash Deposit', date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) });
      window.osdb?.put('bank', { id: 'balance', val: (this.state.bankBalance = Math.round((this.state.bankBalance + num) * 100) / 100) });
      window.osdb?.put('bank', { id: 'transactions', val: this.state.bankTransactions });
      return this.state.bankBalance;
    },
    async checkGamesafeSubscription() {
      try {
        if (!this.isAppInstalled('gamesafe')) return false;
        return Boolean((await window.osdb?.get('gamesafe', 'sub'))?.isActive);
      } catch (e) { return false; }
    },
    async resetFactory(keepGamesafe = false) {
      if (window.osFactory?.reset) await window.osFactory.reset(this, keepGamesafe);
    }
  };
})();
