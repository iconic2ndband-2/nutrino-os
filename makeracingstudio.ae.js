/* FILE: makeracingstudio.ae.js — NRAE Anniversary Edition Tab, 3 Screenshots, and $200 Purchase/Download */
(function() {
  let downloadTimer = null;

  function renderScreenshots(container) {
    for (let i = 0; i < 3; i++) {
      const c = container.querySelector(`#mrs-ss-canvas-${i}`);
      if (c && window.nitroraceAeScreenshots?.render) {
        window.nitroraceAeScreenshots.render(i, c);
      }
    }
  }

  window.mrsAeTab = {
    render(container, onRefresh) {
      if (downloadTimer) { clearInterval(downloadTimer); downloadTimer = null; }
      const isInstalled = window.os?.isAppInstalled('nitroraceae');
      const meta = window.CONSTANTS.NRAE_GAME || {
        name: 'Nitro Race Anniversary Edition', version: '1.0.0', sizeMB: 12500, price: 200.00,
        developer: 'RaceMakingStudio', rating: 5.0,
        description: 'Celebrate the anniversary of Nitro Race with this exclusive edition.'
      };

      container.innerHTML = `
        <div class="mrs-se-view">
          <div class="mrs-se-badge" style="background:linear-gradient(90deg, #ef4444, #f59e0b);color:#fff;font-weight:900;padding:4px 10px;border-radius:20px;display:inline-block;font-size:10px;letter-spacing:1px;margin-bottom:8px;">🏆 EXCLUSIVE ANNIVERSARY EDITION</div>
          <div style="display:flex;align-items:center;gap:12px;margin:4px 0 12px 0;">
            <div style="background:linear-gradient(135deg, #e11d48, #f59e0b);width:54px;height:54px;border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:28px;box-shadow:0 4px 14px rgba(225,29,72,0.4);">🏎️</div>
            <div>
              <div style="font-size:17px;font-weight:900;color:#fff;">${meta.name}</div>
              <div style="font-size:11px;color:#f59e0b;">v${meta.version} • ${meta.developer} • 30 FPS Lock</div>
            </div>
          </div>

          <div class="store-stat-grid" style="display:grid;grid-template-columns:repeat(4, 1fr);gap:6px;margin-bottom:12px;">
            <div class="store-stat-card"><span class="label">SIZE</span><span class="val">12.5 GB</span></div>
            <div class="store-stat-card"><span class="label">PRICE</span><span class="val" style="color:#34d399;">$200.00</span></div>
            <div class="store-stat-card"><span class="label">PAY</span><span class="val" style="color:#ef4444;">$5.00/s</span></div>
            <div class="store-stat-card"><span class="label">STATUS</span><span class="val" style="color:${isInstalled ? '#34d399' : '#f59e0b'}">${isInstalled ? 'Installed' : 'New'}</span></div>
          </div>

          <div style="font-size:11px;font-weight:800;color:#94a3b8;margin-bottom:6px;">📸 OFFICIAL SCREENSHOTS (3 VIEWS)</div>
          <div style="display:flex;gap:8px;overflow-x:auto;padding-bottom:6px;margin-bottom:12px;">
            <div style="flex:0 0 220px;height:120px;border-radius:8px;overflow:hidden;border:1px solid rgba(255,255,255,0.15);">
              <canvas id="mrs-ss-canvas-0" width="220" height="120" style="width:100%;height:100%;display:block;"></canvas>
            </div>
            <div style="flex:0 0 220px;height:120px;border-radius:8px;overflow:hidden;border:1px solid rgba(255,255,255,0.15);">
              <canvas id="mrs-ss-canvas-1" width="220" height="120" style="width:100%;height:100%;display:block;"></canvas>
            </div>
            <div style="flex:0 0 220px;height:120px;border-radius:8px;overflow:hidden;border:1px solid rgba(255,255,255,0.15);">
              <canvas id="mrs-ss-canvas-2" width="220" height="120" style="width:100%;height:100%;display:block;"></canvas>
            </div>
          </div>

          <p style="font-size:12px;line-height:1.4;margin-bottom:12px;color:var(--text-muted);">${meta.description}</p>

          <div style="background:#18181b;border:1px solid var(--border-color);border-radius:10px;padding:10px;margin-bottom:12px;font-size:11px;">
            <div style="font-weight:700;color:#f59e0b;margin-bottom:4px;">✨ Anniversary Edition Features:</div>
            <div style="color:#cbd5e1;line-height:1.5;">• <strong>3 Anniversary Cars</strong>: CR-1 (Common), FR-322 (Epic), 456JJ (Legendary)<br>• <strong>2 Map Modes</strong>: Default 3D Track + 300×300 Roamable Open World<br>• <strong>Silent Pay System</strong>: $5.00/second runtime balance metering<br>• <strong>Orientation Lock</strong>: Landscape Mode required with 30 FPS Lock</div>
          </div>

          <div id="mrs-ae-action-area" style="margin-top:8px;">
            ${isInstalled ? `
              <button id="mrs-play-ae-btn" class="btn-primary" style="background:#10b981;width:100%;font-weight:800;padding:10px;">Play Nitro Race AE ▶</button>
            ` : `
              <button id="mrs-install-ae-btn" class="btn-primary" style="background:linear-gradient(90deg, #ef4444, #f59e0b);width:100%;font-weight:800;padding:10px;">Purchase & Install ($200.00)</button>
            `}
          </div>
        </div>`;

      renderScreenshots(container);

      const playBtn = container.querySelector('#mrs-play-ae-btn');
      if (playBtn) playBtn.onclick = () => window.os.launchApp('nitroraceae');

      const installBtn = container.querySelector('#mrs-install-ae-btn');
      if (installBtn) {
        installBtn.onclick = () => {
          window.os?.purchase('Nitro Race Anniversary Edition', 200.00, () => {
            this.startDownload(container, onRefresh);
          });
        };
      }
    },

    startDownload(container, onRefresh) {
      const area = container.querySelector('#mrs-ae-action-area');
      if (!area) return;
      const sizeMB = 12500.00;
      const estSec = window.os?.getDownloadTime(sizeMB) || 6;
      const totalMs = Math.max(1800, estSec * 1000);
      window.os?.addDataUsage(sizeMB);
      let elapsed = 0;
      area.innerHTML = `
        <div class="store-dl-box" style="background:rgba(239,68,68,0.15);border:1px solid #ef4444;border-radius:10px;padding:10px;">
          <div style="display:flex;justify-content:space-between;font-size:11px;font-weight:700;color:#fca5a5;">
            <span id="mrs-dl-status">Downloading Nitro Race AE...</span>
            <span id="mrs-dl-pct">0%</span>
          </div>
          <div class="browser-progress-track" style="margin:6px 0;height:6px;background:rgba(255,255,255,0.1);"><div id="mrs-dl-bar" class="browser-progress-fill" style="background:linear-gradient(90deg, #ef4444, #f59e0b);width:0%;transition:none;"></div></div>
          <div style="display:flex;justify-content:space-between;font-size:10px;color:var(--text-muted);">
            <span id="mrs-dl-bytes">0.00 GB / 12.50 GB</span>
            <span id="mrs-dl-eta">ETA: ${Math.ceil(estSec)}s</span>
          </div>
        </div>`;

      if (downloadTimer) clearInterval(downloadTimer);
      const startTime = performance.now();
      downloadTimer = setInterval(() => {
        elapsed = performance.now() - startTime;
        const pct = Math.min(100, Math.round((elapsed / totalMs) * 100));
        const downloadedGb = ((elapsed / totalMs) * 12.50).toFixed(2);
        const remSec = Math.max(0, Math.ceil((totalMs - elapsed) / 1000));
        const bar = area.querySelector('#mrs-dl-bar');
        const pctEl = area.querySelector('#mrs-dl-pct');
        const bytesEl = area.querySelector('#mrs-dl-bytes');
        const etaEl = area.querySelector('#mrs-dl-eta');
        if (bar) bar.style.width = `${pct}%`;
        if (pctEl) pctEl.textContent = `${pct}%`;
        if (bytesEl) bytesEl.textContent = `${downloadedGb} GB / 12.50 GB`;
        if (etaEl) etaEl.textContent = `ETA: ${remSec}s`;

        if (elapsed >= totalMs) {
          clearInterval(downloadTimer);
          const statusEl = area.querySelector('#mrs-dl-status');
          if (statusEl) statusEl.textContent = 'Installing on Home Screen...';
          setTimeout(() => {
            window.os?.installApp('nitroraceae');
            window.animations?.showToast?.('Nitro Race Anniversary Edition installed on Home Screen!');
            this.render(container, onRefresh);
          }, 800);
        }
      }, 100);
    }
  };
})();
