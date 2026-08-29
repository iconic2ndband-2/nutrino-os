/* FILE: 3dpapers.update.js — 5-second in-app update detector, modal, and downloader for v2.0.0 */
(function() {
  let updateTimer = null;

  window.threeDPapersUpdate = {
    check(container, onUpdated) {
      if (updateTimer) clearTimeout(updateTimer);
      const isInstalled = window.os?.isAppInstalled('3dpapers');
      const curVer = window.os?.getInstalledVersion ? window.os.getInstalledVersion('3dpapers') : '1.0.0';
      const hasUpdate = window.os?.isUpdateAvailable ? window.os.isUpdateAvailable('3dpapers') : false;

      if (!isInstalled || !hasUpdate || curVer !== '1.0.0') return;

      // 5-second delay before update prompt
      updateTimer = setTimeout(() => {
        if (!container || !document.body.contains(container)) return;
        window.os?.addUpdateBadge?.('3dpapers');
        this.showModal(container, onUpdated);
      }, 5000);
    },

    showModal(container, onUpdated) {
      const modalHost = container.querySelector('#p3d-modal-host') || container;
      const modalEl = document.createElement('div');
      modalEl.className = 'p3d-modal-backdrop';
      modalEl.id = 'p3d-update-modal';

      modalEl.innerHTML = `
        <div class="p3d-modal-card" style="max-width:320px;border:1px solid #8b5cf6;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
            <div style="display:flex;align-items:center;gap:6px;">
              <span style="font-size:20px;">🚀</span>
              <span style="font-size:14px;font-weight:800;color:#fff;">Update Available!</span>
            </div>
            <span style="font-size:10px;background:#8b5cf6;color:#fff;padding:2px 6px;border-radius:4px;font-weight:700;">v2.0.0</span>
          </div>
          <div style="font-size:11px;color:#94a3b8;margin-bottom:8px;">A major upgrade (400 MB) is ready for 3DPapers.</div>
          <div style="background:rgba(255,255,255,0.05);padding:8px;border-radius:8px;margin-bottom:10px;">
            <div style="font-size:11px;font-weight:700;color:#38bdf8;margin-bottom:4px;">✨ What's New in v2.0.0:</div>
            <ul style="margin:0;padding-left:14px;font-size:10px;color:#cbd5e1;line-height:1.4;">
              <li>Wallpaper assignment (Home / Lock / Both)</li>
              <li>Multi-buy & Multi-assign functionality</li>
              <li>Lock Screen 3D wallpaper engine</li>
              <li>Smart pausing when screen is not visible</li>
            </ul>
          </div>
          <div id="p3d-upd-progress-zone" style="display:none;margin-bottom:10px;">
            <div style="display:flex;justify-content:space-between;font-size:10px;margin-bottom:3px;">
              <span id="p3d-upd-status">Downloading update...</span>
              <span id="p3d-upd-pct">0%</span>
            </div>
            <div style="width:100%;height:5px;background:rgba(255,255,255,0.1);border-radius:3px;overflow:hidden;">
              <div id="p3d-upd-fill" style="width:0%;height:100%;background:#8b5cf6;transition:width 0.1s linear;"></div>
            </div>
          </div>
          <div id="p3d-upd-actions" style="display:flex;flex-direction:column;gap:6px;">
            <button id="p3d-btn-download-update" class="btn-primary" style="background:#8b5cf6;min-height:34px;font-size:12px;font-weight:700;">
              Download Update (400 MB)
            </button>
            <div style="display:flex;gap:6px;">
              <button id="p3d-btn-remind-later" class="btn-secondary" style="flex:1;min-height:28px;font-size:10px;">Remind Later</button>
              <button id="p3d-btn-ignore" class="btn-secondary" style="flex:1;min-height:28px;font-size:10px;color:#94a3b8;">Ignore</button>
            </div>
          </div>
        </div>`;

      modalEl.querySelector('#p3d-btn-remind-later').onclick = () => {
        window.animations?.showToast?.('Update postponed. Added to SoftStore updates.');
        modalEl.remove();
      };
      modalEl.querySelector('#p3d-btn-ignore').onclick = () => modalEl.remove();

      modalEl.querySelector('#p3d-btn-download-update').onclick = () => {
        const actBox = modalEl.querySelector('#p3d-upd-actions');
        const progZone = modalEl.querySelector('#p3d-upd-progress-zone');
        const fill = modalEl.querySelector('#p3d-upd-fill');
        const pctEl = modalEl.querySelector('#p3d-upd-pct');
        const statusEl = modalEl.querySelector('#p3d-upd-status');

        if (actBox) actBox.style.display = 'none';
        if (progZone) progZone.style.display = 'block';

        const sizeMB = 400;
        const speed = window.os?.getEffectiveSpeed ? window.os.getEffectiveSpeed() : 1;
        const duration = Math.max(1000, (sizeMB / speed) * 400);
        const startTime = Date.now();
        window.os?.addDataUsage?.(sizeMB);

        const iv = setInterval(() => {
          const elapsed = Date.now() - startTime;
          const pct = Math.min(100, Math.floor((elapsed / duration) * 100));
          if (pctEl) pctEl.innerText = pct + '%';
          if (fill) fill.style.width = pct + '%';

          if (pct >= 100) {
            clearInterval(iv);
            if (statusEl) statusEl.innerText = 'Installing v2.0.0...';
            setTimeout(() => {
              window.os?.installVersion?.('3dpapers', '2.0.0');
              window.animations?.showToast?.('3DPapers updated to v2.0.0!');
              modalEl.remove();
              if (onUpdated) onUpdated();
            }, 600);
          }
        }, 60);
      };

      modalHost.appendChild(modalEl);
    },

    clearTimer() {
      if (updateTimer) { clearTimeout(updateTimer); updateTimer = null; }
    }
  };
})();
