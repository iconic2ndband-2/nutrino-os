/* FILE: aboutdevice.js — About Device section with hardware specs and storage metrics */
(function() {
  window.aboutDevice = {
    async render(container) {
      if (!container) return;
      const specs = window.os ? window.os.getDeviceInfo() : (window.CONSTANTS.DEVICE_SPECS || {});
      const storage = window.os ? await window.os.getStorageStats() : {
        totalCapacityGB: 128, totalUsedGB: 8.5, freeGB: 119.5, usedPercentage: 6.6,
        systemGB: 8.5, userStats: { notesCount: 0, photosCount: 0, notesKB: 0, photosMB: 0 }, appsMB: 0
      };

      container.innerHTML = `
        <div class="about-device-root">
          <div class="settings-group">
            <div class="settings-group-header">📱 Device Identity</div>
            <div class="spec-row"><span class="spec-label">Device Name</span><span class="spec-val font-bold">${specs.deviceName}</span></div>
            <div class="spec-row"><span class="spec-label">Model</span><span class="spec-val">${specs.model}</span></div>
            <div class="spec-row"><span class="spec-label">OS Version</span><span class="spec-val text-brand">${specs.osVersion}</span></div>
            <div class="spec-row"><span class="spec-label">Serial Number</span><span class="spec-val font-mono">${specs.serialNumber}</span></div>
            <div class="spec-row"><span class="spec-label">IMEI</span><span class="spec-val font-mono">${specs.imei}</span></div>
          </div>

          <div class="settings-group">
            <div class="settings-group-header">💾 Storage Capacity & Usage</div>
            <div class="storage-summary-row">
              <div>
                <span class="storage-used-lg">${storage.totalUsedGB} GB</span>
                <span class="storage-total-sm">used of ${storage.totalCapacityGB} GB</span>
              </div>
              <div class="storage-free-badge">${storage.freeGB} GB Free</div>
            </div>
            <div class="storage-bar-wrap">
              <div class="storage-bar-fill" style="width: ${Math.max(2, storage.usedPercentage)}%;"></div>
            </div>
            <div class="storage-breakdown-list">
              <div class="breakdown-item">
                <span>⚙️ System OS & Core</span>
                <span>${storage.systemGB} GB</span>
              </div>
              <div class="breakdown-item">
                <span>📝 Notes Database (${storage.userStats.notesCount} items)</span>
                <span>${storage.userStats.notesKB} KB</span>
              </div>
              <div class="breakdown-item">
                <span>🖼️ Gallery Photos (${storage.userStats.photosCount} photos)</span>
                <span>${storage.userStats.photosMB} MB</span>
              </div>
              <div class="breakdown-item">
                <span>📦 Downloaded Apps (${storage.installedAppsCount || 0})</span>
                <span>${storage.appsMB || 0} MB</span>
              </div>
            </div>
          </div>

          <div class="settings-group">
            <div class="settings-group-header">⚡ Hardware Specifications</div>
            <div class="spec-row"><span class="spec-label">Processor</span><span class="spec-val">${specs.processor}</span></div>
            <div class="spec-row"><span class="spec-label">Memory (RAM)</span><span class="spec-val">${specs.ram}</span></div>
            <div class="spec-row"><span class="spec-label">Display</span><span class="spec-val">${specs.display}</span></div>
            <div class="spec-row"><span class="spec-label">Battery</span><span class="spec-val">${specs.battery}</span></div>
          </div>
        </div>
      `;
    }
  };
})();
