/* FILE: truespecs.nos.js — Website for truespecs.nos in Browser with 5 tabs + App download */
(function() {
  let currentTab = 'home', isDownloading = false, downloadProgress = 0, downloadInterval = null;

  function renderAppTab() {
    const isInstalled = window.os?.isAppInstalled?.('truespecs') || false;
    const speed = window.os?.getEffectiveSpeed ? window.os.getEffectiveSpeed() : 1;
    const totalMB = 800;

    if (isInstalled) {
      return `
        <div class="ts-tab-content">
          <div class="ts-app-meta-card">
            <div class="ts-app-icon-preview">⚡</div>
            <div class="ts-app-details">
              <div class="ts-app-title">Truespecs <span class="ts-app-badge-free">FREE</span></div>
              <div class="ts-app-sub">Version 1.0.0 • 800 MB • Utilities</div>
              <div class="ts-app-desc">Get detailed device specs right on your home screen.</div>
            </div>
          </div>
          <div class="ts-installed-box">
            <div style="font-size:24px;margin-bottom:6px;">✓</div>
            <div style="font-size:13px;font-weight:800;color:#34d399;">Truespecs is Installed</div>
            <div style="font-size:11px;color:var(--text-muted);margin-bottom:12px;">The live rotating 2D canvas icon is active on your home screen.</div>
            <button id="ts-launch-app-btn" class="btn-primary" style="background:#ff1493;min-height:36px;font-weight:700;">Open Truespecs App</button>
          </div>
        </div>`;
    }

    if (isDownloading) {
      const downloadedMB = Math.min(totalMB, Math.round((downloadProgress / 100) * totalMB));
      const etaSec = Math.max(1, Math.ceil((totalMB - downloadedMB) / speed));
      return `
        <div class="ts-tab-content">
          <div class="ts-app-meta-card">
            <div class="ts-app-icon-preview">⚡</div>
            <div class="ts-app-details"><div class="ts-app-title">Truespecs <span class="ts-app-badge-free">FREE</span></div><div class="ts-app-sub">Version 1.0.0 • 800 MB</div></div>
          </div>
          <div class="ts-card" style="padding:14px;text-align:center;">
            <div style="font-size:12px;font-weight:800;color:#ff69b4;margin-bottom:6px;">Downloading Truespecs (${downloadProgress}%)</div>
            <div class="ts-prog-track"><div class="ts-prog-bar" style="width:${downloadProgress}%;"></div></div>
            <div style="display:flex;justify-content:space-between;font-size:10px;color:var(--text-muted);margin-top:8px;">
              <span>${downloadedMB} / ${totalMB} MB</span><span>Speed: ${speed} Mbps</span><span>ETA: ~${etaSec}s</span>
            </div>
          </div>
        </div>`;
    }

    return `
      <div class="ts-tab-content">
        <div class="ts-app-meta-card">
          <div class="ts-app-icon-preview">⚡</div>
          <div class="ts-app-details">
            <div class="ts-app-title">Truespecs <span class="ts-app-badge-free">FREE</span></div>
            <div class="ts-app-sub">Version 1.0.0 • 800 MB • Utilities</div>
            <div class="ts-app-desc">Get detailed device specs right on your home screen.</div>
          </div>
        </div>
        <div class="ts-spec-card">
          <div style="font-size:11px;font-weight:700;color:#ff69b4;margin-bottom:8px;">⚡ Highlights of Truespecs App:</div>
          <ul style="font-size:11px;color:#cbd5e1;margin-left:14px;line-height:1.6;">
            <li>Live 10-Core CPU frequency & core load gauges</li>
            <li>Real-time 2T-PEX GPU memory & thermal sensors</li>
            <li>4GB LPDDR4 active headroom & cache tracking</li>
            <li>Interactive live rotating 2D canvas icon on home screen</li>
          </ul>
        </div>
        <button id="ts-install-btn" class="btn-primary" style="background:#ff1493;min-height:40px;width:100%;font-weight:800;margin-top:10px;">⬇️ Download & Install (800 MB)</button>
      </div>`;
  }

  window.truespecsNos = {
    getHtml() {
      const tabs = [{ id: 'home', label: 'Home' }, { id: 'about', label: 'About' }, { id: 'features', label: 'Features' }, { id: 'support', label: 'Support' }, { id: 'blog', label: 'Blog' }, { id: 'app', label: '📱 App' }];
      return `
        <div class="ts-site-root">
          <div class="ts-site-header">
            <div class="ts-brand-row"><div class="ts-brand-logo">⚡ TRUESPECS</div><div class="ts-brand-tag">Precision Hardware Intelligence</div></div>
            <div class="ts-nav-tabs">${tabs.map(t => `<button class="ts-nav-btn ${currentTab === t.id ? 'active' : ''}" data-tstab="${t.id}">${t.label}</button>`).join('')}</div>
          </div>
          <div class="ts-site-body" id="ts-site-body">
            ${currentTab === 'home' ? window.truespecsTabs.renderHome() : currentTab === 'about' ? window.truespecsTabs.renderAbout() : currentTab === 'features' ? window.truespecsTabs.renderFeatures() : currentTab === 'support' ? window.truespecsTabs.renderSupport() : currentTab === 'blog' ? window.truespecsTabs.renderBlog() : renderAppTab()}
          </div>
        </div>`;
    },

    bindEvents(container, refresh) {
      container.querySelectorAll('.ts-nav-btn').forEach(btn => {
        btn.onclick = () => { currentTab = btn.dataset.tstab; refresh(); };
      });
      const launchBtn = container.querySelector('#ts-launch-app-btn');
      if (launchBtn) launchBtn.onclick = () => window.os?.launchApp?.('truespecs');

      const installBtn = container.querySelector('#ts-install-btn');
      if (installBtn) {
        installBtn.onclick = () => {
          if (isDownloading) return;
          isDownloading = true; downloadProgress = 0; refresh();
          const speed = window.os?.getEffectiveSpeed ? window.os.getEffectiveSpeed() : 1;
          const totalMB = 800, stepMB = Math.max(15, speed * 2.5);
          if (downloadInterval) clearInterval(downloadInterval);
          downloadInterval = setInterval(() => {
            downloadProgress = Math.min(100, Math.round(downloadProgress + (stepMB / totalMB) * 100));
            window.os?.addDataUsage?.(0.5);
            if (downloadProgress >= 100) {
              clearInterval(downloadInterval); downloadInterval = null; isDownloading = false;
              window.os?.installApp?.('truespecs');
              window.animations?.showToast?.('🎉 Truespecs installed successfully!');
              refresh();
            } else {
              const body = container.querySelector('#ts-site-body');
              if (body && currentTab === 'app') body.innerHTML = renderAppTab();
            }
          }, 100);
        };
      }
    }
  };
})();
