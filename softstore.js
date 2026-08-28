/* FILE: softstore.js — Steam-inspired App Store application */
(function() {
  let currentContainer = null, activeInterval = null, activeTab = 'featured';

  function renderUI() {
    if (!currentContainer) return;
    const isInstalled = window.os.isAppInstalled('wipefresh');
    const speed = window.os.state.internetSpeed || 1;
    const estTime = window.os.getDownloadTime(10).toFixed(1);

    currentContainer.innerHTML = `
      <div class="store-root">
        <div class="store-header">
          <div class="store-brand">⚡ SOFTSTORE</div>
          <div class="store-tabs">
            <button class="store-tab ${activeTab === 'featured' ? 'active' : ''}" data-tab="featured">Featured</button>
            <button class="store-tab ${activeTab === 'library' ? 'active' : ''}" data-tab="library">Library</button>
          </div>
        </div>
        <div class="store-content">
          ${activeTab === 'featured' ? renderFeatured(isInstalled, speed, estTime) : renderLibrary(isInstalled)}
        </div>
      </div>`;
    bindTabEvents();
    bindInstallEvents();
  }

  function renderFeatured(isInstalled, speed, estTime) {
    return `
      <div class="store-featured-banner">
        <div class="store-banner-tag">FEATURED APP</div>
        <div class="store-banner-title">Wipe Fresh v1.0.0</div>
        <div class="store-banner-desc">Factory reset and system rejuvenator for Nutrino OS.</div>
      </div>
      <div class="store-app-card">
        <div class="store-app-icon" style="background:#ef4444;">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
        </div>
        <div class="store-app-meta">
          <div class="store-app-name">Wipe Fresh</div>
          <div class="store-app-specs">10 MB • Free • System Utility</div>
          <div class="store-app-desc">Give your Nutrino OS a fresh start. Reset everything to factory settings.</div>
          <div id="store-install-section" style="margin-top:8px;">
            ${isInstalled 
              ? `<button id="store-open-btn" class="btn-primary" style="background:#10b981;">Open App</button>`
              : `<button id="store-install-btn" class="btn-primary">Install (10 MB ~${estTime}s @ ${speed} Mbps)</button>`}
          </div>
          <div id="store-progress-box" class="store-progress-box" style="display:none;">
            <div class="store-progress-label">
              <span id="store-progress-text">Downloading... 0%</span>
              <span id="store-progress-eta">ETA: ${estTime}s</span>
            </div>
            <div class="store-progress-bar-wrap">
              <div id="store-dl-fill" class="store-progress-fill" style="width: 0%;"></div>
            </div>
          </div>
        </div>
      </div>`;
  }

  function renderLibrary(isInstalled) {
    return `
      <div class="store-lib-list">
        <div class="store-section-title">My Installed Applications</div>
        ${isInstalled ? `
          <div class="store-lib-item">
            <div style="display:flex;align-items:center;gap:10px;">
              <div class="store-app-icon-sm" style="background:#ef4444;">🗑️</div>
              <div><div style="font-weight:600;">Wipe Fresh</div><div style="font-size:11px;color:var(--text-muted);">10 MB • v1.0.0</div></div>
            </div>
            <button class="btn-primary" style="min-height:36px;padding:0 14px;background:#10b981;" onclick="window.os.launchApp('wipefresh')">Open</button>
          </div>` : `<div class="bank-empty-tx">No downloaded apps yet. Check Featured!</div>`}
      </div>`;
  }

  function bindTabEvents() {
    currentContainer.querySelectorAll('.store-tab').forEach(t => {
      t.onclick = () => { activeTab = t.dataset.tab; renderUI(); };
    });
  }

  function bindInstallEvents() {
    const installBtn = currentContainer.querySelector('#store-install-btn');
    const openBtn = currentContainer.querySelector('#store-open-btn');
    const progBox = currentContainer.querySelector('#store-progress-box');
    const fillBar = currentContainer.querySelector('#store-dl-fill');
    const progText = currentContainer.querySelector('#store-progress-text');
    const progEta = currentContainer.querySelector('#store-progress-eta');

    if (openBtn) openBtn.onclick = () => window.os.launchApp('wipefresh');
    if (installBtn && progBox) {
      installBtn.onclick = () => {
        installBtn.style.display = 'none';
        progBox.style.display = 'block';
        const sizeMB = 10, totalMs = Math.max(800, window.os.getDownloadTime(sizeMB) * 1000);
        let elapsed = 0;
        window.os.addDataUsage(sizeMB);

        activeInterval = setInterval(() => {
          elapsed += 100;
          const pct = Math.min(100, Math.round((elapsed / totalMs) * 100));
          const remSec = Math.max(0, ((totalMs - elapsed) / 1000)).toFixed(1);
          if (fillBar) fillBar.style.width = `${pct}%`;
          if (progText) progText.textContent = pct < 100 ? `Downloading... ${pct}%` : 'Installing...';
          if (progEta) progEta.textContent = `ETA: ${remSec}s`;

          if (elapsed >= totalMs) {
            clearInterval(activeInterval);
            activeInterval = null;
            setTimeout(() => {
              window.os.installApp('wipefresh');
              window.animations.showToast('Wipe Fresh installed successfully!');
              renderUI();
            }, 400);
          }
        }, 100);
      };
    }
  }

  window.softstoreApp = {
    mount(container) { currentContainer = container; renderUI(); },
    unmount() {
      if (activeInterval) { clearInterval(activeInterval); activeInterval = null; }
      currentContainer = null;
    }
  };
})();
