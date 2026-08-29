/* FILE: os.versions.js — App versioning, update check engine, and multi-version installer */
(function() {
  const VER_PREFIX = 'nos_app_ver_';
  const scheduledTimers = {};

  function compareVersions(v1, v2) {
    if (!v1 || !v2) return 0;
    const p1 = v1.replace(/^v/, '').split('.').map(n => parseInt(n, 10) || 0);
    const p2 = v2.replace(/^v/, '').split('.').map(n => parseInt(n, 10) || 0);
    const len = Math.max(p1.length, p2.length);
    for (let i = 0; i < len; i++) {
      const a = p1[i] || 0, b = p2[i] || 0;
      if (a > b) return 1;
      if (a < b) return -1;
    }
    return 0;
  }

  window.osVersions = {
    getAppVersions(appId) {
      const all = window.CONSTANTS?.APP_VERSIONS || {};
      if (all[appId] && Array.isArray(all[appId])) return all[appId];
      const app = (window.CONSTANTS?.APPS || []).find(a => a.id === appId);
      return [{ version: app?.version || '1.0.0', date: 'Aug 2026', size: app?.sizeMB || 10, totalSize: app?.totalSizeMB || app?.sizeMB || 10, file: appId + '.js', changes: ['Initial release'] }];
    },

    getLatestVersion(appId) {
      const versions = this.getAppVersions(appId);
      return versions[0] || { version: '1.0.0', date: 'Aug 2026', size: 10, totalSize: 10, file: appId + '.js', changes: ['Initial release'] };
    },

    getActiveVersion(appId) {
      return this.getInstalledVersion(appId);
    },

    setActiveVersion(appId, version) {
      localStorage.setItem(VER_PREFIX + appId, version);
      return true;
    },

    getInstalledVersion(appId) {
      const stored = localStorage.getItem(VER_PREFIX + appId);
      if (stored) return stored;
      const app = (window.CONSTANTS?.APPS || []).find(a => a.id === appId);
      return app?.version || '1.0.0';
    },

    isUpdateAvailable(appId) {
      if (!window.os?.isAppInstalled?.(appId)) return false;
      const installed = this.getInstalledVersion(appId), latestObj = this.getLatestVersion(appId);
      return compareVersions(latestObj?.version || '1.0.0', installed) > 0;
    },

    checkForUpdates() {
      const installed = window.os?.state?.installedApps || [], updates = [];
      installed.forEach(appId => {
        if (this.isUpdateAvailable(appId)) {
          const appMeta = (window.CONSTANTS?.APPS || []).find(a => a.id === appId);
          const latest = this.getLatestVersion(appId);
          updates.push({
            appId, app: appMeta || { id: appId, name: appId, color: '#6366f1' },
            currentVersion: this.getInstalledVersion(appId),
            latestVersion: latest.version, latestInfo: latest
          });
        }
      });
      return updates;
    },

    scheduleUpdateCheck(appId) {
      if (scheduledTimers[appId]) clearTimeout(scheduledTimers[appId]);
      scheduledTimers[appId] = setTimeout(() => {
        if (this.isUpdateAvailable(appId)) {
          this.addUpdateBadge(appId);
          const appMeta = (window.CONSTANTS?.APPS || []).find(a => a.id === appId);
          const name = appMeta ? appMeta.name : appId;
          const latest = this.getLatestVersion(appId);
          window.animations?.showToast?.(`Update available for ${name} (v${latest.version})`);
        }
      }, 5000);
    },

    installVersion(appId, version) {
      this.setActiveVersion(appId, version);
      if (window.os?.installApp) window.os.installApp(appId);
      this.scheduleUpdateCheck(appId);
      return true;
    },

    rollbackApp(appId, version = '1.0.0') {
      if (appId !== '3dpapers') return false;
      this.installVersion(appId, version);
      return true;
    },

    startUpdate(appId) {
      const latest = this.getLatestVersion(appId);
      if (latest && latest.version) {
        this.installVersion(appId, latest.version);
        return true;
      }
      return false;
    },

    addUpdateBadge(appId) {
      localStorage.setItem('nos_update_notified_' + appId, '1');
    }
  };
})();
