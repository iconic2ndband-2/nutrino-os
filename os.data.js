/* FILE: os.data.js — Real-time telemetry, hardware monitoring and simulated system metrics */
(function() {
  const BOOT_KEY = 'nos_first_boot_ts';
  const sessionBootTime = Date.now();

  function getFirstBoot() {
    let ts = localStorage.getItem(BOOT_KEY);
    if (!ts) {
      ts = (Date.now() - (42 * 24 * 3600 * 1000)).toString(); // 42 days ago default
      localStorage.setItem(BOOT_KEY, ts);
    }
    return parseInt(ts, 10);
  }

  window.osData = {
    sessionBootTime,

    getCPUUsage() {
      const base = 25 + Math.floor(Math.sin(Date.now() / 3000) * 15 + (Math.random() * 15));
      return Math.max(8, Math.min(96, base));
    },

    getCoreUsages() {
      const cores = [];
      const now = Date.now();
      for (let i = 1; i <= 10; i++) {
        const val = Math.max(5, Math.min(98, Math.floor(20 + Math.sin(now / (2000 + i * 400) + i) * 20 + Math.random() * 25)));
        cores.push({ core: i, usage: val });
      }
      return cores;
    },

    getGPUUsage() {
      const base = 18 + Math.floor(Math.cos(Date.now() / 4000) * 12 + (Math.random() * 20));
      return Math.max(4, Math.min(92, base));
    },

    getRAMUsage() {
      const totalGB = 4.0;
      const baseUsed = 1.65 + (Math.sin(Date.now() / 8000) * 0.25) + (Math.random() * 0.1);
      const used = parseFloat(Math.max(1.2, Math.min(3.6, baseUsed)).toFixed(2));
      const free = parseFloat((totalGB - used).toFixed(2));
      const percentage = parseFloat(((used / totalGB) * 100).toFixed(1));
      return { used, free, total: totalGB, percentage };
    },

    async getStorageBreakdown() {
      const stats = window.os?.getStorageStats ? await window.os.getStorageStats() : {
        totalCapacityGB: 128, totalUsedGB: 8.5, freeGB: 119.5, systemGB: 8.5,
        userStats: { notesKB: 0, photosMB: 0 }, appsMB: 0
      };

      const total = stats.totalCapacityGB || 128;
      const used = stats.totalUsedGB || 8.5;
      const free = stats.freeGB || (total - used);
      const system = stats.systemGB || 8.5;
      const apps = parseFloat(((stats.appsMB || 0) / 1024).toFixed(3));
      const notes = parseFloat(((stats.userStats?.notesKB || 0) / (1024 * 1024)).toFixed(4));
      const gallery = parseFloat(((stats.userStats?.photosMB || 0) / 1024).toFixed(3));

      return {
        total, used, free,
        system, apps, notes, gallery,
        systemPct: parseFloat(((system / total) * 100).toFixed(1)),
        appsPct: parseFloat(((apps / total) * 100).toFixed(1)),
        notesPct: parseFloat(((notes / total) * 100).toFixed(2)),
        galleryPct: parseFloat(((gallery / total) * 100).toFixed(1))
      };
    },

    getCPUTemp() {
      const base = 48 + Math.sin(Date.now() / 5000) * 8 + (Math.random() * 4);
      return Math.max(40, Math.min(70, Math.round(base)));
    },

    getGPUTemp() {
      const base = 42 + Math.cos(Date.now() / 6000) * 6 + (Math.random() * 3);
      return Math.max(35, Math.min(60, Math.round(base)));
    },

    getBatteryTemp() {
      const base = 31 + Math.sin(Date.now() / 10000) * 4 + (Math.random() * 2);
      return Math.max(25, Math.min(45, Math.round(base)));
    },

    getUptime() {
      return Math.floor((Date.now() - sessionBootTime) / 1000);
    },

    getFormattedUptime() {
      const sec = this.getUptime();
      const days = Math.floor(sec / 86400);
      const hours = Math.floor((sec % 86400) / 3600);
      const mins = Math.floor((sec % 3600) / 60);
      const secs = sec % 60;
      if (days > 0) return `${days}d ${hours}h ${mins}m`;
      if (hours > 0) return `${hours}h ${mins}m ${secs}s`;
      return `${mins}m ${secs}s`;
    },

    getDeviceAge() {
      const diffMs = Date.now() - getFirstBoot();
      const days = Math.max(1, Math.floor(diffMs / (24 * 3600 * 1000)));
      return days;
    },

    getBatteryStatus() {
      const basePct = 88 - Math.min(15, Math.floor((Date.now() - sessionBootTime) / 60000));
      return {
        percentage: Math.max(10, Math.min(100, basePct)),
        charging: false,
        health: 'Good'
      };
    },

    getSignalStrength() {
      const base = 85 + Math.floor(Math.sin(Date.now() / 7000) * 10);
      return Math.max(40, Math.min(100, base));
    },

    getWiFiSignal() {
      const base = 90 + Math.floor(Math.cos(Date.now() / 9000) * 8);
      return Math.max(50, Math.min(100, base));
    },

    getBrightness() {
      return window.os?.state?.settings?.brightness || 100;
    }
  };
})();
