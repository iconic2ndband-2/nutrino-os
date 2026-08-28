/* FILE: deviceinfo.js — Device identity, hardware specifications, and dynamic real-time storage metrics */
(function() {
  const STORAGE_KEYS = {
    SERIAL: 'nos_serial_number',
    IMEI: 'nos_imei'
  };

  function generateSerial() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = 'NOS-';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  function generateIMEI() {
    let imei = '35';
    for (let i = 0; i < 13; i++) {
      imei += Math.floor(Math.random() * 10);
    }
    return imei;
  }

  function ensureIdentity() {
    let serial = localStorage.getItem(STORAGE_KEYS.SERIAL);
    if (!serial) {
      serial = generateSerial();
      localStorage.setItem(STORAGE_KEYS.SERIAL, serial);
    }
    let imei = localStorage.getItem(STORAGE_KEYS.IMEI);
    if (!imei) {
      imei = generateIMEI();
      localStorage.setItem(STORAGE_KEYS.IMEI, imei);
    }
    return { serial, imei };
  }

  window.deviceInfo = {
    init() {
      ensureIdentity();
    },

    getSpecs() {
      const identity = ensureIdentity();
      const base = (window.CONSTANTS && window.CONSTANTS.DEVICE_SPECS) || {
        deviceName: 'Nutrino N1',
        model: 'NOS-N1-2026',
        osVersion: 'Nutrino OS v1.1.2',
        totalStorageGB: 128,
        systemStorageGB: 8.5,
        ram: '8 GB LPDDR5',
        processor: 'Nutrino Octa-Core 2.8 GHz',
        battery: '4500 mAh (Li-Po)',
        display: '6.1" AMOLED (1080 x 2400, 120Hz)'
      };
      return {
        ...base,
        serialNumber: identity.serial,
        imei: identity.imei
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

      // Calculate actual total MB by summing each installed app's declared sizeMB
      let appsMB = 0;
      const appsList = [];
      installedApps.forEach(appId => {
        const appMeta = allStoreApps.find(a => a.id === appId);
        const size = appMeta && appMeta.sizeMB ? appMeta.sizeMB : 10;
        appsMB += size;
        appsList.push({
          id: appId,
          name: appMeta ? appMeta.name : appId,
          sizeMB: size
        });
      });

      const systemGB = specs.systemStorageGB || 8.5;
      const userTotalMB = (userStats.totalUserMB || 0) + appsMB;
      const userTotalGB = parseFloat((userTotalMB / 1024).toFixed(3));
      const totalUsedGB = parseFloat((systemGB + userTotalGB).toFixed(2));
      const totalCapacityGB = specs.totalStorageGB || 128;
      const freeGB = parseFloat(Math.max(0, totalCapacityGB - totalUsedGB).toFixed(2));
      const usedPercentage = parseFloat(Math.min(100, (totalUsedGB / totalCapacityGB) * 100).toFixed(1));

      return {
        totalCapacityGB,
        totalUsedGB,
        freeGB,
        usedPercentage,
        systemGB,
        userStats,
        appsMB,
        appsList,
        installedAppsCount: installedApps.length
      };
    }
  };
})();
