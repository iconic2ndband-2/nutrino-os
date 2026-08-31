/* FILE: deviceinfo.js — Device identity, hardware specifications, and dynamic real-time storage metrics with osdb */
(function() {
  let cachedIdentity = { serial: 'NOS-11-8942-X', imei: '35-920148-739102-4' };

  function generateSerial() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = 'NOS-';
    for (let i = 0; i < 8; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
    return code;
  }

  function generateIMEI() {
    let imei = '35';
    for (let i = 0; i < 13; i++) imei += Math.floor(Math.random() * 10);
    return imei;
  }

  window.deviceInfo = {
    async init() {
      if (window.osdb) {
        try {
          let s = await window.osdb.get('device', 'serial');
          let m = await window.osdb.get('device', 'imei');
          if (!s) { s = generateSerial(); await window.osdb.put('device', { id: 'serial', val: s }); }
          if (!m) { m = generateIMEI(); await window.osdb.put('device', { id: 'imei', val: m }); }
          cachedIdentity = { serial: s, imei: m };
        } catch (e) {}
      }
    },

    getSpecs() {
      const base = (window.CONSTANTS && window.CONSTANTS.DEVICE_SPECS) || {};
      return {
        deviceName: base.deviceName || 'Nutrino N1',
        model: base.model || 'NOS-11',
        osVersion: base.osVersion || 'Nutrino OS v1.5.1',
        buildNumber: base.buildNumber || 'NOS-1.5.1-20260829',
        processor: base.processor || '10-Core, 600MHz - 1.3GHz',
        gpu: base.gpu || '2T-PEX (4-core, 600MHz)',
        ram: base.ram || '4GB LPDDR4',
        totalStorageGB: base.totalStorageGB || 128,
        storageType: base.storageType || '128GB UFS 2.1',
        systemStorageGB: base.systemStorageGB || 8.5,
        display: base.display || '6.7" AMOLED, 2400×1080, 120Hz',
        battery: base.battery || '4500mAh',
        cameraRear: base.cameraRear || '64MP + 12MP + 5MP',
        cameraFront: base.cameraFront || '32MP',
        flash: base.flash || 'Dual LED',
        network: base.network || '5G capable',
        wifi: base.wifi || '802.11 a/b/g/n/ac/ax',
        bluetooth: base.bluetooth || '5.2',
        securityPatch: base.securityPatch || 'August 1, 2026',
        kernelVersion: base.kernelVersion || '6.1.0-nutrino+',
        buildDate: base.buildDate || 'August 29, 2026',
        serialNumber: cachedIdentity.serial,
        imei: cachedIdentity.imei
      };
    },

    async getStorageStats() {
      const specs = this.getSpecs();
      let userStats = { notesCount: 0, photosCount: 0, notesKB: 0, photosMB: 0, totalUserMB: 0 };
      if (window.store && typeof window.store.getTotalStorageUsed === 'function') {
        userStats = await window.store.getTotalStorageUsed();
      }

      const installedApps = (window.os && window.os.state && window.os.state.installedApps) || [];
      const allStoreApps = (window.CONSTANTS && window.CONSTANTS.APPS) || [];

      let appsMB = 0;
      const appsList = [];
      installedApps.forEach(appId => {
        const appMeta = allStoreApps.find(a => a.id === appId);
        const size = appMeta && appMeta.sizeMB ? appMeta.sizeMB : 10;
        appsMB += size;
        appsList.push({ id: appId, name: appMeta ? appMeta.name : appId, sizeMB: size });
      });

      const systemGB = specs.systemStorageGB || 8.5;
      const userTotalMB = (userStats.totalUserMB || 0) + appsMB;
      const userTotalGB = parseFloat((userTotalMB / 1024).toFixed(3));
      const totalUsedGB = parseFloat((systemGB + userTotalGB).toFixed(2));
      const totalCapacityGB = specs.totalStorageGB || 128;
      const freeGB = parseFloat(Math.max(0, totalCapacityGB - totalUsedGB).toFixed(2));
      const usedPercentage = parseFloat(Math.min(100, (totalUsedGB / totalCapacityGB) * 100).toFixed(1));

      return {
        totalCapacityGB, totalUsedGB, freeGB, usedPercentage,
        systemGB, userStats, appsMB, appsList, installedAppsCount: installedApps.length
      };
    }
  };
})();
