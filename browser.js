/* FILE: browser.js — Local Sandbox Web Browser application */
(function() {
  let navHistory = ['home'], historyIdx = 0, currentContainer = null, activeTimer = null;

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
        <p class="browser-start-desc">Local Offline Sandbox Network</p>
        <div class="browser-bookmarks-grid">
          <div class="browser-bookmark-card" data-url="network.nos">
            <div class="bookmark-icon">📶</div>
            <div class="bookmark-details">
              <div class="bookmark-name">network.nos</div>
              <div class="bookmark-desc">ISP plans & broadband speed manager</div>
            </div>
          </div>
          <div class="browser-bookmark-card" data-url="superbank.nos">
            <div class="bookmark-icon">🏛️</div>
            <div class="bookmark-details">
              <div class="bookmark-name">superbank.nos</div>
              <div class="bookmark-desc">Checking account, deposits & transfers</div>
            </div>
          </div>
          <div class="browser-bookmark-card" data-url="makeracingstudio.nos">
            <div class="bookmark-icon">🏎️</div>
            <div class="bookmark-details">
              <div class="bookmark-name">makeracingstudio.nos</div>
              <div class="bookmark-desc">Nutrino Games developer portal & SE</div>
            </div>
          </div>
        </div>
      </div>`;
  }

  function renderNotFound(url) {
    return `
      <div class="browser-error-page">
        <div class="browser-error-icon">⚠️</div>
        <h3>Site Not Found</h3>
        <p>The address <strong>${url}</strong> could not be resolved on the local network.</p>
        <p style="margin-top:8px;font-size:12px;color:var(--text-muted);">Available: network.nos, superbank.nos, makeracingstudio.nos</p>
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
        contentArea.querySelectorAll('.browser-bookmark-card').forEach(c => {
          c.onclick = () => loadPage(c.dataset.url);
        });
      } else if (norm === 'network.nos') {
        contentArea.innerHTML = window.networkNos.getHtml();
        window.networkNos.bindEvents(contentArea, () => loadPage('network.nos', false));
      } else if (norm === 'superbank.nos') {
        contentArea.innerHTML = window.superbankNos.getHtml();
        window.superbankNos.bindEvents(contentArea, () => loadPage('superbank.nos', false));
      } else if (norm === 'makeracingstudio.nos') {
        contentArea.innerHTML = window.makeRacingStudioNos.getHtml();
        window.makeRacingStudioNos.bindEvents(contentArea, () => loadPage('makeracingstudio.nos', false));
      } else {
        contentArea.innerHTML = renderNotFound(norm);
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
            <input type="text" id="browser-url-input" class="browser-address-bar" placeholder="Enter .nos URL (e.g. network.nos)">
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
