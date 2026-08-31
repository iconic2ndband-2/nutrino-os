/* FILE: browser.js — Local Sandbox Web Browser application with developer portals */
(function() {
  let navHistory = ['home'], historyIdx = 0, currentContainer = null, activeTimer = null;

  const SITES = [
    { url: 'truespecs.nos', icon: '⚡', bg: '#ff1493', name: 'truespecs.nos', desc: 'Hardware specs companion & app portal', render: (c) => { c.innerHTML = window.truespecsNos.getHtml(); window.truespecsNos.bindEvents(c, () => loadPage('truespecs.nos', false)); } },
    { url: 'byloop.nos', icon: '🔄', bg: '#00d4ff', name: 'byloop.nos', desc: 'Wipe Fresh developer & recovery tools', render: (c) => { c.innerHTML = window.byloopNos.getHtml(); window.byloopNos.bindEvents(c, () => loadPage('byloop.nos', false)); } },
    { url: 'coolfrost.nos', icon: '❄️', bg: '#6c5ce7', name: 'coolfrost.nos', desc: '3DPapers studio & WebGL wallpapers', render: (c) => { c.innerHTML = window.coolfrostNos.getHtml(); window.coolfrostNos.bindEvents(c, () => loadPage('coolfrost.nos', false)); } },
    { url: 'whitegames.nos', icon: '🛡️', bg: '#38bdf8', name: 'whitegames.nos', desc: 'Gamesafe cloud backup & save locker', render: (c) => { c.innerHTML = window.whitegamesNos.getHtml(); window.whitegamesNos.bindEvents(c, () => loadPage('whitegames.nos', false)); } },
    { url: 'rampage-report.nos', icon: '🔬', bg: '#ff3333', name: 'rampage-report.nos', desc: 'real-osdb developer & storage telemetry', render: (c) => window.rampageReportNos?.render(c) },
    { url: 'makeracingstudio.nos', icon: '🏎️', bg: '#f43f5e', name: 'makeracingstudio.nos', desc: 'Nutrino Games developer portal & SE', render: (c) => { c.innerHTML = window.makeRacingStudioNos.getHtml(); window.makeRacingStudioNos.bindEvents(c, () => loadPage('makeracingstudio.nos', false)); } },
    { url: 'network.nos', icon: '📶', bg: '#3b82f6', name: 'network.nos', desc: 'ISP plans & broadband speed manager', render: (c) => { c.innerHTML = window.networkNos.getHtml(); window.networkNos.bindEvents(c, () => loadPage('network.nos', false)); } },
    { url: 'superbank.nos', icon: '🏛️', bg: '#10b981', name: 'superbank.nos', desc: 'Checking account, deposits & transfers', render: (c) => { c.innerHTML = window.superbankNos.getHtml(); window.superbankNos.bindEvents(c, () => loadPage('superbank.nos', false)); } }
  ];

  function normalizeUrl(input) {
    if (!input) return 'home';
    let url = input.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/$/, '');
    return (!url || url === 'about:blank') ? 'home' : url;
  }

  function renderStartPage() {
    return `
      <div class="browser-start-page">
        <div class="browser-hero-icon">🌐</div>
        <h2 class="browser-start-title">Nutrino Web Explorer</h2>
        <p class="browser-start-desc">Local Offline Sandbox Network (v1.5.1)</p>
        <div class="browser-bookmarks-grid">
          ${SITES.map(s => `
            <div class="browser-bookmark-card" data-url="${s.url}">
              <div class="bookmark-icon" style="background:${s.bg};color:#fff;border-radius:10px;display:flex;align-items:center;justify-content:center;">${s.icon}</div>
              <div class="bookmark-details">
                <div class="bookmark-name" style="font-weight:700;">${s.name}</div>
                <div class="bookmark-desc">${s.desc}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>`;
  }

  function loadPage(url, push = true) {
    const norm = normalizeUrl(url);
    if (push) {
      if (historyIdx < navHistory.length - 1) navHistory = navHistory.slice(0, historyIdx + 1);
      navHistory.push(norm);
      historyIdx = navHistory.length - 1;
    }
    const urlInput = currentContainer.querySelector('#browser-url-input');
    if (urlInput) urlInput.value = norm === 'home' ? '' : norm;
    const contentArea = currentContainer.querySelector('#browser-page-viewport');
    const loadingBar = currentContainer.querySelector('#browser-progress-bar');
    if (!contentArea) return;

    if (loadingBar) { loadingBar.style.width = '20%'; loadingBar.style.opacity = '1'; }
    const speed = window.os?.getEffectiveSpeed ? window.os.getEffectiveSpeed() : 1;
    const delay = Math.max(150, Math.min(1200, Math.round(350 + (250 / speed))));

    if (activeTimer) clearTimeout(activeTimer);
    activeTimer = setTimeout(() => {
      if (loadingBar) {
        loadingBar.style.width = '100%';
        setTimeout(() => { loadingBar.style.opacity = '0'; loadingBar.style.width = '0%'; }, 150);
      }
      window.os?.addDataUsage(0.2);
      if (norm === 'home') {
        contentArea.innerHTML = renderStartPage();
        contentArea.querySelectorAll('.browser-bookmark-card').forEach(c => { c.onclick = () => loadPage(c.dataset.url); });
      } else {
        const site = SITES.find(s => s.url === norm);
        if (site && site.render) site.render(contentArea);
        else contentArea.innerHTML = `<div class="browser-error-page"><div class="browser-error-icon">⚠️</div><h3>Site Not Found</h3><p>The address <strong>${norm}</strong> could not be resolved.</p></div>`;
      }
    }, delay);
  }

  window.browserApp = {
    mount(container) {
      currentContainer = container;
      container.innerHTML = `
        <div class="browser-app-root">
          <div class="browser-nav-toolbar">
            <button id="browser-btn-back" class="browser-nav-btn" title="Back">‹</button>
            <button id="browser-btn-fwd" class="browser-nav-btn" title="Forward">›</button>
            <button id="browser-btn-reload" class="browser-nav-btn" title="Reload">↻</button>
            <button id="browser-btn-home" class="browser-nav-btn" title="Home">🏠</button>
            <input type="text" id="browser-url-input" class="browser-address-bar" placeholder="Enter .nos URL (e.g. rampage-report.nos)">
            <button id="browser-btn-go" class="browser-nav-btn" title="Go" style="font-size:13px;">Go</button>
          </div>
          <div class="browser-progress-track"><div id="browser-progress-bar" class="browser-progress-fill"></div></div>
          <div id="browser-page-viewport" class="browser-page-viewport"></div>
        </div>`;

      const input = container.querySelector('#browser-url-input');
      const goBtn = container.querySelector('#browser-btn-go');
      const triggerGo = () => { if (input.value.trim()) loadPage(input.value); };
      goBtn.onclick = triggerGo;
      input.onkeydown = (e) => { if (e.key === 'Enter') triggerGo(); };

      container.querySelector('#browser-btn-back').onclick = () => {
        if (historyIdx > 0) { historyIdx--; loadPage(navHistory[historyIdx], false); }
      };
      container.querySelector('#browser-btn-fwd').onclick = () => {
        if (historyIdx < navHistory.length - 1) { historyIdx++; loadPage(navHistory[historyIdx], false); }
      };
      container.querySelector('#browser-btn-reload').onclick = () => loadPage(navHistory[historyIdx], false);
      container.querySelector('#browser-btn-home').onclick = () => loadPage('home');
      loadPage(navHistory[historyIdx] || 'home', false);
    },
    unmount() {
      if (activeTimer) clearTimeout(activeTimer);
      currentContainer = null;
    }
  };
})();
