/* FILE: aboutdevice.js — About Device section with hardware specs and real-time storage metrics */
(function() {
  window.aboutDevice = {
    async render(container) {
      if (!container) return;
      const specs = window.os ? window.os.getDeviceInfo() : (window.CONSTANTS?.DEVICE_SPECS || {});
      const storage = window.os ? await window.os.getStorageStats() : {
        totalCapacityGB: 128, totalUsedGB: 8.5, freeGB: 119.5, usedPercentage: 6.6,
        systemGB: 8.5, userStats: { notesCount: 0, photosCount: 0, notesKB: 0, photosMB: 0 }, appsMB: 0,
        appsList: [], installedAppsCount: 0
      };

      const formatAppSize = (mb) => {
        if (!mb) return '0 MB';
        if (mb >= 1000) return `${(mb / 1000).toFixed(1)} GB (${mb} MB)`;
        return `${mb} MB`;
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
                <span>📝 Notes Database (${storage.userStats?.notesCount || 0} items)</span>
                <span>${storage.userStats?.notesKB || 0} KB</span>
              </div>
              <div class="breakdown-item">
                <span>🖼️ Gallery Photos (${storage.userStats?.photosCount || 0} photos)</span>
                <span>${storage.userStats?.photosMB || 0} MB</span>
              </div>
              <div class="breakdown-item">
                <span>📦 Downloaded Apps (${storage.installedAppsCount || 0})</span>
                <span>${formatAppSize(storage.appsMB)}</span>
              </div>
            </div>

            ${storage.appsList && storage.appsList.length > 0 ? `
              <div style="margin-top:10px;padding-top:8px;border-top:1px dashed var(--border-color);font-size:11px;color:var(--text-muted);">
                <div style="font-weight:700;color:var(--text-main);margin-bottom:6px;">Installed Apps (${storage.appsList.length})</div>
                ${storage.appsList.map(a => `
                  <div style="display:flex;justify-content:space-between;align-items:center;padding:4px 0;">
                    <span>• ${a.name}</span>
                    <div style="display:flex;align-items:center;gap:6px;">
                      <span style="font-weight:600;">${a.sizeMB >= 1000 ? (a.sizeMB / 1000).toFixed(1) + ' GB' : a.sizeMB + ' MB'}</span>
                      <button class="settings-app-del-btn" data-delid="${a.id}" style="background:rgba(239,68,68,0.15);border:1px solid rgba(239,68,68,0.4);color:#f87171;border-radius:6px;padding:2px 8px;font-size:11px;font-weight:600;cursor:pointer;">Uninstall</button>
                    </div>
                  </div>
                `).join('')}
              </div>
            ` : ''}
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

      container.querySelectorAll('.settings-app-del-btn').forEach(btn => {
        btn.onclick = (e) => {
          e.stopPropagation();
          const appId = btn.dataset.delid;
          const app = (window.CONSTANTS.APPS || []).find(a => a.id === appId);
          const name = app ? app.name : appId;
          const sizeMB = app ? app.sizeMB : 10;
          const sizeFormatted = sizeMB >= 1000 ? `${(sizeMB / 1000).toFixed(1)} GB` : `${sizeMB} MB`;

          const performUninstall = () => {
            window.os?.uninstallApp(appId);
            window.animations?.showToast?.(`Uninstalled "${name}" (Freed ${sizeFormatted})`);
            window.aboutDevice.render(container);
          };

          if (window.confirmModal) {
            window.confirmModal.show({
              title: `Uninstall ${name}?`,
              message: `Deleting "${name}" will remove all app data and reclaim ${sizeFormatted} of storage.`,
              icon: '💾',
              confirmText: 'Uninstall',
              cancelText: 'Cancel',
              isDestructive: true,
              onConfirm: performUninstall
            });
          } else {
            performUninstall();
          }
        };
      });
    }
  };
})();
