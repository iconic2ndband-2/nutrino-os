/* FILE: softstore.rollback.js — SoftStore Rollback engine for 3DPapers v1.0.0 */
(function() {
  window.softstoreRollback = {
    start(container, appId, versionObj, onDone) {
      const sizeMB = versionObj.size || 2300;
      const sizeFormatted = sizeMB >= 1000 ? `${(sizeMB / 1000).toFixed(1)} GB` : `${sizeMB} MB`;
      const targetVer = versionObj.version || '1.0.0';

      const performRollback = () => {
        const modalHost = container.querySelector('.store-detail-root') || container;
        const progModal = document.createElement('div');
        progModal.className = 'p3d-modal-backdrop';
        progModal.style.zIndex = '9999';

        progModal.innerHTML = `
          <div class="p3d-modal-card" style="max-width:320px;">
            <div style="font-size:14px;font-weight:700;color:#fff;margin-bottom:4px;">Rolling back to v${targetVer}...</div>
            <div style="font-size:11px;color:#94a3b8;margin-bottom:10px;">Downloading full package (${sizeFormatted})</div>
            <div style="display:flex;justify-content:space-between;font-size:10px;margin-bottom:3px;">
              <span id="rb-status">Downloading...</span>
              <span id="rb-pct">0%</span>
            </div>
            <div style="width:100%;height:6px;background:rgba(255,255,255,0.1);border-radius:3px;overflow:hidden;">
              <div id="rb-fill" style="width:0%;height:100%;background:#f59e0b;transition:width 0.1s linear;"></div>
            </div>
          </div>`;

        modalHost.appendChild(progModal);
        const fill = progModal.querySelector('#rb-fill');
        const pctEl = progModal.querySelector('#rb-pct');
        const statusEl = progModal.querySelector('#rb-status');

        const speed = window.os?.getEffectiveSpeed ? window.os.getEffectiveSpeed() : 1;
        const duration = Math.max(1200, (sizeMB / speed) * 350);
        const startTime = Date.now();
        window.os?.addDataUsage?.(sizeMB);

        const iv = setInterval(() => {
          const elapsed = Date.now() - startTime;
          const pct = Math.min(100, Math.floor((elapsed / duration) * 100));
          if (pctEl) pctEl.innerText = pct + '%';
          if (fill) fill.style.width = pct + '%';

          if (pct >= 100) {
            clearInterval(iv);
            if (statusEl) statusEl.innerText = 'Reverting files...';
            setTimeout(() => {
              window.os?.rollbackApp?.(appId, targetVer);
              progModal.remove();
              window.animations?.showToast?.(`Rolled back 3DPapers to v${targetVer} (Gamesafe data preserved)`);
              if (onDone) onDone();
            }, 600);
          }
        }, 60);
      };

      if (window.confirmModal) {
        window.confirmModal.show({
          title: `Rollback to v${targetVer}?`,
          message: `Reverting to v${targetVer} requires downloading ${sizeFormatted}. All your Gamesafe account cloud saves and settings will remain completely intact.`,
          icon: '⏪', confirmText: `Rollback (${sizeFormatted})`, cancelText: 'Cancel', isDestructive: false,
          onConfirm: performRollback
        });
      } else {
        performRollback();
      }
    }
  };
})();
