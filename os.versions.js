/* FILE: os.versions.js — App versioning, update check engine, and multi-version installer */
(function() {
  const VER_PREFIX = 'nos_app_ver_';

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
      if (all[appId] && Array.isArray(all[appId])) {
        return all[appId];
      }
      const app = (window.CONSTANTS?.APPS || []).find(a => a.id === appId);
      const defVer = app?.version || '1.0.0';
      const defSize = app?.sizeMB || 10;
      return [{ version: defVer, date: 'Aug 2026', size: defSize, changes: ['Initial release'] }];
    },

    getLatestVersion(appId) {
      const versions = this.getAppVersions(appId);
      return versions[0] || { version: '1.0.0', date: 'Aug 2026', size: 10, changes: ['Initial release'] };
    },

    getInstalledVersion(appId) {
      const stored = localStorage.getItem(VER_PREFIX + appId);
      if (stored) return stored;
      const app = (window.CONSTANTS?.APPS || []).find(a => a.id === appId);
      return app?.version || '1.0.0';
    },

    isUpdateAvailable(appId) {
      if (!window.os?.isAppInstalled?.(appId)) return false;
      const installed = this.getInstalledVersion(appId);
      const latestObj = this.getLatestVersion(appId);
      const latest = latestObj?.version || '1.0.0';
      return compareVersions(latest, installed) > 0;
    },

    checkForUpdates() {
      const installed = window.os?.state?.installedApps || [];
      const updates = [];
      installed.forEach(appId => {
        if (this.isUpdateAvailable(appId)) {
          const appMeta = (window.CONSTANTS?.APPS || []).find(a => a.id === appId);
          const latest = this.getLatestVersion(appId);
          updates.push({
            appId,
            app: appMeta || { id: appId, name: appId, color: '#6366f1' },
            currentVersion: this.getInstalledVersion(appId),
            latestVersion: latest.version,
            latestInfo: latest
          });
        }
      });
      return updates;
    },

    installVersion(appId, version) {
      localStorage.setItem(VER_PREFIX + appId, version);
      if (window.os?.installApp) {
        window.os.installApp(appId);
      }
      return true;
    }
  };
})();
