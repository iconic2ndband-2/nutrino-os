/* FILE: makeracingstudio.se.js — Special Edition tab, Canvas previews, and purchase/download flow */
(function() {
  let downloadTimer = null;

  function drawCanvasPreviews(container) {
    const c = container.querySelector('#mrs-se-preview-canvas');
    if (!c) return;
    const ctx = c.getContext('2d');
    const w = c.width, h = c.height;
    ctx.fillStyle = '#0f172a'; ctx.fillRect(0, 0, w, h);
    // Draw 3 mini map stripes
    const mw = w / 3;
    // Desert
    ctx.fillStyle = '#ca8a04'; ctx.fillRect(0, 0, mw, h);
    ctx.fillStyle = '#78350f'; ctx.fillRect(15, 0, mw - 30, h);
    ctx.fillStyle = '#fef08a'; ctx.font = '10px sans-serif'; ctx.fillText('DESERT', 28, 20);
    // City
    ctx.fillStyle = '#1e293b'; ctx.fillRect(mw, 0, mw, h);
    ctx.fillStyle = '#0f172a'; ctx.fillRect(mw + 15, 0, mw - 30, h);
    ctx.fillStyle = '#38bdf8'; ctx.fillText('CITY', mw + 38, 20);
    // Snow
    ctx.fillStyle = '#93c5fd'; ctx.fillRect(mw * 2, 0, mw, h);
    ctx.fillStyle = '#334155'; ctx.fillRect(mw * 2 + 15, 0, mw - 30, h);
    ctx.fillStyle = '#ffffff'; ctx.fillText('SNOW', mw * 2 + 34, 20);
    // Draw 2 cars preview
    // Red Vulcan GT
    ctx.fillStyle = '#f43f5e'; ctx.fillRect(38, 55, 24, 42);
    ctx.fillStyle = '#0f172a'; ctx.fillRect(42, 65, 16, 18);
    // Blue Cobalt Surge
    ctx.fillStyle = '#0ea5e9'; ctx.fillRect(mw + 38, 55, 24, 42);
    ctx.fillStyle = '#0f172a'; ctx.fillRect(mw + 42, 65, 16, 18);
  }

  window.mrsSeTab = {
    render(container, onRefresh) {
      if (downloadTimer) { clearInterval(downloadTimer); downloadTimer = null; }
      const isOgInstalled = window.os?.isAppInstalled('nitrorace');
      const isSeInstalled = window.os?.isAppInstalled('nitroracese');
      const meta = window.CONSTANTS.SE_GAME;

      if (!isOgInstalled) {
        container.innerHTML = `
          <div class="mrs-se-locked-card">
            <div style="font-size:40px;margin-bottom:8px;">⚠️</div>
            <h3 style="font-size:17px;font-weight:800;color:#f43f5e;">You must install Nitro Race first</h3>
            <p style="font-size:12px;color:var(--text-muted);margin:8px 0 16px 0;">Nitro Race SE is an advanced expansion pack requiring the base Nitro Race installation.</p>
            <button id="mrs-go-store-og" class="btn-primary" style="background:#f43f5e;width:100%;">Open SoftStore to Install OG</button>
          </div>`;
        container.querySelector('#mrs-go-store-og').onclick = () => window.os.launchApp('softstore');
        return;
      }

      container.innerHTML = `
        <div class="mrs-se-view">
          <div class="mrs-se-badge">🌟 SPECIAL EDITION EXCLUSIVE</div>
          <div style="display:flex;align-items:center;gap:12px;margin:8px 0 12px 0;">
            <div style="background:#8b5cf6;width:52px;height:52px;border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:26px;">⭐</div>
            <div><div style="font-size:18px;font-weight:900;color:#fff;">${meta.name}</div><div style="font-size:12px;color:#c084fc;">v${meta.version} • ${meta.developer}</div></div>
          </div>
          <div class="store-stat-grid" style="margin-bottom:10px;">
            <div class="store-stat-card"><span class="label">SIZE</span><span class="val">9.61 GB</span></div>
            <div class="store-stat-card"><span class="label">PRICE</span><span class="val" style="color:#34d399;">$100.00</span></div>
            <div class="store-stat-card"><span class="label">RATING</span><span class="val">⭐ ${meta.rating}</span></div>
            <div class="store-stat-card"><span class="label">STATUS</span><span class="val" style="color:${isSeInstalled ? '#34d399' : '#f59e0b'}">${isSeInstalled ? 'Installed' : 'New'}</span></div>
          </div>
          <div class="store-screenshot-wrap" style="height:115px;margin-bottom:10px;"><canvas id="mrs-se-preview-canvas" width="300" height="115"></canvas></div>
          <p style="font-size:12px;line-height:1.4;margin-bottom:10px;color:var(--text-muted);">${meta.description}</p>
          ${window.mrsSeInfo ? window.mrsSeInfo.renderWhatsNew() : ''}
          ${window.mrsSeInfo ? window.mrsSeInfo.renderComparison() : ''}
          <div id="mrs-se-action-area" style="margin-top:10px;">
            ${isSeInstalled ? `
              <button id="mrs-play-se-btn" class="btn-primary" style="background:#10b981;width:100%;">Play Nitro Race SE ▶</button>
            ` : `
              <button id="mrs-install-se-btn" class="btn-primary" style="background:#8b5cf6;width:100%;">Install Nitro Race SE ($100.00)</button>
            `}
          </div>
        </div>`;

      drawCanvasPreviews(container);

      const playBtn = container.querySelector('#mrs-play-se-btn');
      if (playBtn) playBtn.onclick = () => window.os.launchApp('nitroracese');

      const installBtn = container.querySelector('#mrs-install-se-btn');
      if (installBtn) {
        installBtn.onclick = () => {
          window.os?.purchase('Nitro Race SE Expansion', 100.00, () => {
            this.startDownload(container, onRefresh);
          });
        };
      }
    },

    startDownload(container, onRefresh) {
      const area = container.querySelector('#mrs-se-action-area');
      if (!area) return;
      const sizeMB = 9840.64;
      const estSec = window.os?.getDownloadTime(sizeMB) || 5;
      const totalMs = Math.max(1500, estSec * 1000);
      window.os?.addDataUsage(sizeMB);
      let elapsed = 0;
      area.innerHTML = `
        <div class="store-dl-box" style="background:rgba(139,92,246,0.15);border:1px solid #8b5cf6;border-radius:10px;padding:10px;">
          <div style="display:flex;justify-content:space-between;font-size:11px;font-weight:700;color:#c084fc;">
            <span id="mrs-dl-status">Downloading Nitro Race SE...</span>
            <span id="mrs-dl-pct">0%</span>
          </div>
          <div class="browser-progress-track" style="margin:6px 0;height:6px;background:rgba(255,255,255,0.1);"><div id="mrs-dl-bar" class="browser-progress-fill" style="background:#8b5cf6;width:0%;transition:none;"></div></div>
          <div style="display:flex;justify-content:space-between;font-size:10px;color:var(--text-muted);">
            <span id="mrs-dl-bytes">0.00 GB / 9.61 GB</span>
            <span id="mrs-dl-eta">ETA: ${Math.ceil(estSec)}s</span>
          </div>
        </div>`;

      if (downloadTimer) clearInterval(downloadTimer);
      const startTime = performance.now();
      downloadTimer = setInterval(() => {
        elapsed = performance.now() - startTime;
        const pct = Math.min(100, Math.round((elapsed / totalMs) * 100));
        const downloadedGb = ((elapsed / totalMs) * 9.61).toFixed(2);
        const remSec = Math.max(0, Math.ceil((totalMs - elapsed) / 1000));
        const bar = area.querySelector('#mrs-dl-bar');
        const pctEl = area.querySelector('#mrs-dl-pct');
        const bytesEl = area.querySelector('#mrs-dl-bytes');
        const etaEl = area.querySelector('#mrs-dl-eta');
        if (bar) bar.style.width = `${pct}%`;
        if (pctEl) pctEl.textContent = `${pct}%`;
        if (bytesEl) bytesEl.textContent = `${downloadedGb} GB / 9.61 GB`;
        if (etaEl) etaEl.textContent = `ETA: ${remSec}s`;

        if (elapsed >= totalMs) {
          clearInterval(downloadTimer);
          downloadTimer = null;
          const statusEl = area.querySelector('#mrs-dl-status');
          if (statusEl) statusEl.textContent = 'Installing on Home Screen...';
          setTimeout(() => {
            window.os?.installApp('nitroracese');
            window.animations?.showToast?.('Nitro Race SE installed on Home Screen!');
            this.render(container, onRefresh);
          }, 800);
        }
      }, 100);
    }
  };
})();
