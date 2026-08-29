/* FILE: 3dpapers.v1.js — 3DPapers v1.0.0 full codebase (Initial Release) */
(function() {
  let currentContainer = null, currentUser = null, renewInterval = null;
  const K_SESSION = '3dpapers_active_user';
  const getWps = () => window.CONSTANTS?.WALLPAPERS_3D || [];

  function saveUser(user) {
    if (!user || !user.username) return;
    currentUser = user; localStorage.setItem(K_SESSION, user.username);
    window.gamesafe?.save?.('3dpapers', user.username, user);
  }

  function startDurationTimer() {
    if (renewInterval) clearInterval(renewInterval);
    renewInterval = setInterval(() => {
      if (!currentUser || !currentUser.subscription?.active) return;
      const sub = currentUser.subscription;
      sub.secondsRemaining = (sub.secondsRemaining || 10) - 1;
      if (sub.secondsRemaining <= 0) {
        const wallpapers = getWps(), activeWp = wallpapers.find(w => w.id === currentUser.activeWallpaperId) || wallpapers[0];
        if (sub.autoRenew && activeWp && window.os?.deductBank?.(activeWp.price, `3DPapers Auto-Renew: ${activeWp.name}`)) {
          currentUser.totalSpending = (currentUser.totalSpending || 0) + activeWp.price;
          sub.secondsRemaining = activeWp.duration; saveUser(currentUser);
          if (currentContainer && currentUser) renderMain();
        } else { sub.active = false; sub.secondsRemaining = 0; saveUser(currentUser); }
      }
    }, 1000);
  }

  function renderV1UI(container, user, wallpapers) {
    const totalSpent = (user.totalSpending || 0).toFixed(2), activeId = user.activeWallpaperId || 'nebula';
    const activeWp = wallpapers.find(w => w.id === activeId) || wallpapers[0];

    const cardsHtml = wallpapers.map(w => `
      <div class="p3d-card ${w.id === activeId ? 'active' : ''}">
        <div class="p3d-card-header">
          <div style="display:flex;align-items:center;gap:8px;"><span style="font-size:24px;">${w.icon || '🌌'}</span>
            <div><div style="font-size:13px;font-weight:700;color:#fff;">${w.name}</div><div style="font-size:10px;color:#cbd5e1;">Rate: $${w.costPerSec.toFixed(3)}/sec</div></div>
          </div>
          <span class="p3d-card-price">$${w.price.toFixed(2)} / ${w.duration}s</span>
        </div>
        <div class="p3d-card-desc">${w.desc}</div>
        <div class="p3d-card-actions">
          <button class="btn-secondary p3d-preview-btn" data-id="${w.id}" style="min-height:30px;font-size:11px;">👁️ Preview</button>
          <button class="btn-primary p3d-buy-btn" data-id="${w.id}" style="flex:1;min-height:30px;font-size:11px;background:${w.id === activeId ? '#10b981' : '#8b5cf6'};">
            ${w.id === activeId ? '✓ Active (Desktop)' : 'Buy ($' + w.price.toFixed(2) + ')'}
          </button>
        </div>
      </div>`).join('');

    container.innerHTML = `
      <div class="p3d-root">
        <div class="p3d-header">
          <div style="display:flex;align-items:center;gap:8px;"><span style="font-size:18px;">🌌</span>
            <div><div style="font-size:13px;font-weight:800;color:#fff;">3DPapers <span style="font-size:10px;color:#c4b5fd;font-weight:600;">v1.0.0</span></div><div style="font-size:10px;color:#94a3b8;">${user.username}</div></div>
          </div>
          <div style="display:flex;align-items:center;gap:6px;">
            <div class="p3d-spend-badge" title="Total Spent"><span>💳</span><span>$${totalSpent}</span></div>
            <button id="p3d-set-btn" class="btn-secondary" style="padding:4px 8px;min-height:26px;font-size:11px;">⚙️</button>
            <button id="p3d-logout-btn" class="btn-secondary" style="padding:4px 8px;min-height:26px;font-size:11px;">Logout</button>
          </div>
        </div>
        <div class="p3d-stage"><canvas id="p3d-live-canvas"></canvas>
          <div class="p3d-stage-overlay">
            <div class="p3d-stage-tag"><span style="color:#34d399;">● LIVE</span> ${activeWp?.name || 'Nebula Drift'}</div>
            <div style="font-size:10px;color:#e2e8f0;background:rgba(0,0,0,0.4);padding:2px 6px;border-radius:4px;">Desktop Wallpaper</div>
          </div>
        </div>
        <div class="p3d-list">${cardsHtml}</div>
        <div id="p3d-modal-host"></div>
      </div>`;

    const canvas = container.querySelector('#p3d-live-canvas');
    if (canvas && window.threeDPapersWallpapers) window.threeDPapersWallpapers.renderToCanvas(canvas, activeWp.id);

    container.querySelector('#p3d-set-btn').onclick = () => window.threeDPapersSettings?.open(container, user, (u) => { saveUser(u); renderMain(); });
    container.querySelector('#p3d-logout-btn').onclick = () => {
      currentUser = null; localStorage.removeItem(K_SESSION);
      if (renewInterval) { clearInterval(renewInterval); renewInterval = null; }
      if (window.threeDPapersWallpapers) window.threeDPapersWallpapers.stop();
      window.threeDPapersUpdate?.clearTimer?.();
      window.threeDPapersAuth.render(container, (u) => { currentUser = u; saveUser(u); renderMain(); });
    };

    container.querySelectorAll('.p3d-preview-btn').forEach(btn => {
      btn.onclick = () => {
        const wId = btn.dataset.id;
        if (canvas && window.threeDPapersWallpapers) window.threeDPapersWallpapers.renderToCanvas(canvas, wId);
        const tag = container.querySelector('.p3d-stage-tag');
        if (tag) tag.innerHTML = `<span style="color:#f59e0b;">● PREVIEW</span> ${wallpapers.find(x => x.id === wId)?.name}`;
      };
    });

    container.querySelectorAll('.p3d-buy-btn').forEach(btn => {
      btn.onclick = () => {
        const wp = wallpapers.find(x => x.id === btn.dataset.id), host = container.querySelector('#p3d-modal-host');
        if (wp && host) {
          window.threeDPapersPay.open(host, wp, currentUser, (payRes) => {
            currentUser.totalSpending = (currentUser.totalSpending || 0) + payRes.cost;
            currentUser.activeWallpaperId = wp.id;
            currentUser.subscription = { autoRenew: true, active: true, secondsRemaining: payRes.duration };
            window.os?.applyWallpaper?.('home', wp.id);
            saveUser(currentUser); startDurationTimer(); renderMain();
          });
        }
      };
    });
  }

  function renderMain() {
    if (currentContainer && currentUser) renderV1UI(currentContainer, currentUser, getWps());
  }

  window.threeDPapersV1 = {
    mount(container) {
      currentContainer = container;
      const sessionUser = localStorage.getItem(K_SESSION);
      if (sessionUser && window.gamesafe?.exists?.('3dpapers', sessionUser)) {
        currentUser = window.gamesafe?.load?.('3dpapers', sessionUser);
        startDurationTimer(); renderMain();
        window.threeDPapersUpdate?.check?.(container, () => renderMain());
      } else {
        window.threeDPapersAuth.render(container, (u) => {
          currentUser = u; saveUser(u); startDurationTimer(); renderMain();
          window.threeDPapersUpdate?.check?.(container, () => renderMain());
        });
      }
    },
    unmount() {
      if (renewInterval) { clearInterval(renewInterval); renewInterval = null; }
      if (window.threeDPapersWallpapers) window.threeDPapersWallpapers.stop();
      window.threeDPapersUpdate?.clearTimer?.();
      currentContainer = null;
    }
  };
})();
