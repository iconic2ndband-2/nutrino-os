/* FILE: makeracingstudio.nos.js — Website controller for makeracingstudio.nos (Nutrino Games) */
(function() {
  let activeTab = 'home';
  const TABS = [
    { id: 'home', label: 'Home' }, { id: 'games', label: 'Games' }, { id: 'about', label: 'About' },
    { id: 'support', label: 'Support' }, { id: 'careers', label: 'Careers' },
    { id: 'community', label: 'Community' }, { id: 'se', label: 'Special Edition ⭐' }
  ];

  function drawHomeBanner(container) {
    const c = container.querySelector('#mrs-home-banner-canvas');
    if (!c) return;
    const ctx = c.getContext('2d');
    const w = c.width, h = c.height;
    // Neon sunset racing background
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, '#312e81'); grad.addColorStop(0.6, '#f43f5e'); grad.addColorStop(1, '#0f172a');
    ctx.fillStyle = grad; ctx.fillRect(0, 0, w, h);
    // Sun
    ctx.fillStyle = '#fbbf24'; ctx.beginPath(); ctx.arc(w / 2, h * 0.45, 24, 0, Math.PI * 2); ctx.fill();
    // Perspective Road
    ctx.fillStyle = '#18181b'; ctx.beginPath();
    ctx.moveTo(w * 0.42, h * 0.5); ctx.lineTo(w * 0.58, h * 0.5);
    ctx.lineTo(w * 0.9, h); ctx.lineTo(w * 0.1, h); ctx.closePath(); ctx.fill();
    // Speed lines
    ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(w * 0.5, h * 0.5); ctx.lineTo(w * 0.5, h); ctx.stroke();
    // Sports car silhouette
    ctx.fillStyle = '#f43f5e'; ctx.fillRect(w * 0.5 - 12, h * 0.75, 24, 14);
    ctx.fillStyle = '#38bdf8'; ctx.fillRect(w * 0.5 - 8, h * 0.77, 16, 5);
  }

  window.makeRacingStudioNos = {
    getHtml() {
      return `
        <div class="mrs-website-root">
          <header class="mrs-site-header">
            <div class="mrs-logo-box"><span class="mrs-logo-text">⚡ NUTRINO GAMES</span><span class="mrs-tagline">Making Racing Games Since 2025</span></div>
            <nav class="mrs-nav-tabs">
              ${TABS.map(t => `<button class="mrs-nav-btn ${activeTab === t.id ? 'active' : ''}" data-tab="${t.id}">${t.label}</button>`).join('')}
            </nav>
          </header>
          <div id="mrs-tab-body" class="mrs-tab-body"></div>
        </div>`;
    },

    bindEvents(container, refresh) {
      if (!container) return;
      const tabBody = container.querySelector('#mrs-tab-body');
      const navBtns = container.querySelectorAll('.mrs-nav-btn');

      const switchTab = (tabId) => {
        activeTab = tabId;
        window.os?.addDataUsage(3.5);
        navBtns.forEach(b => b.classList.toggle('active', b.dataset.tab === tabId));
        this.renderCurrentTab(tabBody, refresh);
      };

      navBtns.forEach(btn => {
        btn.onclick = () => switchTab(btn.dataset.tab);
      });

      this.renderCurrentTab(tabBody, refresh);
    },

    renderCurrentTab(tabBody, refresh) {
      if (!tabBody) return;
      if (activeTab === 'home') {
        tabBody.innerHTML = window.mrsTabs.renderHome();
        drawHomeBanner(tabBody);
        const dlOg = tabBody.querySelector('#mrs-dl-og-btn');
        if (dlOg) dlOg.onclick = () => window.os.launchApp('softstore');
        const viewSe = tabBody.querySelector('#mrs-view-se-home-btn');
        if (viewSe) viewSe.onclick = () => {
          activeTab = 'se';
          const header = tabBody.closest('.mrs-website-root');
          if (header) this.bindEvents(header.parentElement, refresh);
        };
      } else if (activeTab === 'games') {
        tabBody.innerHTML = window.mrsTabs.renderGames();
        tabBody.querySelector('#mrs-games-og-btn').onclick = () => window.os.launchApp('softstore');
        tabBody.querySelector('#mrs-games-se-btn').onclick = () => {
          activeTab = 'se';
          const header = tabBody.closest('.mrs-website-root');
          if (header) this.bindEvents(header.parentElement, refresh);
        };
      } else if (activeTab === 'about') {
        tabBody.innerHTML = window.mrsTabs.renderAbout();
      } else if (activeTab === 'support') {
        tabBody.innerHTML = window.mrsTabs.renderSupport();
        const form = tabBody.querySelector('#mrs-feedback-form');
        if (form) {
          form.onsubmit = (e) => {
            e.preventDefault();
            const name = tabBody.querySelector('#mrs-fb-name').value;
            const email = tabBody.querySelector('#mrs-fb-email').value;
            const msg = tabBody.querySelector('#mrs-fb-msg').value;
            const fbList = JSON.parse(localStorage.getItem('mrs_feedback') || '[]');
            fbList.push({ name, email, msg, date: new Date().toISOString() });
            localStorage.setItem('mrs_feedback', JSON.stringify(fbList));
            window.animations?.showToast?.('Feedback submitted to Nutrino Games!');
            form.reset();
          };
        }
      } else if (activeTab === 'careers') {
        tabBody.innerHTML = window.mrsTabs.renderCareers();
        tabBody.querySelectorAll('.mrs-apply-btn').forEach(btn => {
          btn.onclick = () => {
            const job = btn.dataset.job;
            const apps = JSON.parse(localStorage.getItem('mrs_applications') || '[]');
            apps.push({ job, appliedAt: new Date().toISOString() });
            localStorage.setItem('mrs_applications', JSON.stringify(apps));
            window.animations?.showToast?.(`Application submitted for ${job}!`);
          };
        });
      } else if (activeTab === 'community') {
        tabBody.innerHTML = window.mrsTabs.renderCommunity();
      } else if (activeTab === 'se') {
        window.mrsSeTab.render(tabBody, () => this.renderCurrentTab(tabBody, refresh));
      }
    }
  };
})();
