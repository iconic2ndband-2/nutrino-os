/* FILE: 3dpapers.ui.js — 3DPapers view renderer, catalog cards, and screen assignments */
(function() {
  function renderHeader(user) {
    const totalSpent = (user.totalSpending || 0).toFixed(2);
    const ver = window.os?.getInstalledVersion ? window.os.getInstalledVersion('3dpapers') : '1.0.0';
    return `
      <div class="p3d-header">
        <div style="display:flex;align-items:center;gap:8px;">
          <span style="font-size:18px;">🌌</span>
          <div>
            <div style="font-size:13px;font-weight:800;color:#fff;">3DPapers <span style="font-size:10px;color:#c4b5fd;font-weight:600;">v${ver}</span></div>
            <div style="font-size:10px;color:#94a3b8;">${user.username}</div>
          </div>
        </div>
        <div style="display:flex;align-items:center;gap:6px;">
          <div class="p3d-spend-badge" title="Total Money Spent"><span>💳</span><span>$${totalSpent}</span></div>
          <button id="p3d-set-btn" class="btn-secondary" style="padding:4px 8px;min-height:26px;font-size:11px;">⚙️</button>
          <button id="p3d-logout-btn" class="btn-secondary" style="padding:4px 8px;min-height:26px;font-size:11px;">Logout</button>
        </div>
      </div>`;
  }

  function renderStage(activeWp, user) {
    const assignHome = user.assignments?.home || window.os?.getWallpaper3D?.('home') || 'nebula';
    const assignLock = user.assignments?.lock || window.os?.getWallpaper3D?.('lock') || 'nebula';
    return `
      <div class="p3d-stage">
        <canvas id="p3d-live-canvas"></canvas>
        <div class="p3d-stage-overlay">
          <div class="p3d-stage-tag"><span style="color:#34d399;">● LIVE</span> ${activeWp?.name || 'Nebula Drift'}</div>
          <div style="font-size:10px;color:#e2e8f0;background:rgba(0,0,0,0.4);padding:2px 6px;border-radius:4px;">
            🏠 ${assignHome} • 🔒 ${assignLock}
          </div>
        </div>
      </div>`;
  }

  function renderList(wallpapers, user) {
    const activeId = user.activeWallpaperId || 'nebula';
    const homeWp = user.assignments?.home || window.os?.getWallpaper3D?.('home');
    const lockWp = user.assignments?.lock || window.os?.getWallpaper3D?.('lock');

    const items = wallpapers.map(w => {
      const isActive = (w.id === activeId);
      const isHome = (homeWp === w.id), isLock = (lockWp === w.id);
      const assignBadge = (isHome && isLock) ? '📱 Both' : (isHome ? '🏠 Home' : (isLock ? '🔒 Lock' : ''));

      return `
        <div class="p3d-card ${isActive ? 'active' : ''}">
          <div class="p3d-card-header">
            <div style="display:flex;align-items:center;gap:8px;">
              <span style="font-size:24px;">${w.icon || '🌌'}</span>
              <div>
                <div style="font-size:13px;font-weight:700;color:#fff;">
                  ${w.name} ${assignBadge ? `<span style="font-size:9px;background:#6366f1;color:#fff;padding:1px 5px;border-radius:4px;margin-left:4px;">${assignBadge}</span>` : ''}
                </div>
                <div style="font-size:10px;color:#cbd5e1;">Rate: $${w.costPerSec.toFixed(3)}/sec</div>
              </div>
            </div>
            <span class="p3d-card-price">$${w.price.toFixed(2)} / ${w.duration}s</span>
          </div>
          <div class="p3d-card-desc">${w.desc}</div>
          <div class="p3d-card-actions">
            <button class="btn-secondary p3d-preview-btn" data-id="${w.id}" style="min-height:30px;font-size:11px;">👁️ Preview</button>
            <button class="btn-secondary p3d-assign-trigger-btn" data-id="${w.id}" style="min-height:30px;font-size:11px;color:#38bdf8;border-color:rgba(56,189,248,0.4);">
              🎯 Assign
            </button>
            <button class="btn-primary p3d-buy-btn" data-id="${w.id}" style="flex:1;min-height:30px;font-size:11px;background:${isActive ? '#10b981' : '#8b5cf6'};">
              ${isActive ? '✓ Active' : 'Buy ($' + w.price.toFixed(2) + ')'}
            </button>
          </div>
        </div>`;
    }).join('');
    return `<div class="p3d-list">${items}</div>`;
  }

  window.threeDPapersUI = {
    render(container, user, wallpapers, cb) {
      const activeWp = wallpapers.find(w => w.id === (user.activeWallpaperId || 'nebula')) || wallpapers[0];
      container.innerHTML = `<div class="p3d-root">${renderHeader(user)}${renderStage(activeWp, user)}${renderList(wallpapers, user)}<div id="p3d-modal-host"></div></div>`;

      const canvas = container.querySelector('#p3d-live-canvas');
      if (canvas && window.threeDPapersWallpapers) window.threeDPapersWallpapers.renderToCanvas(canvas, activeWp.id);

      container.querySelector('#p3d-set-btn').onclick = () => window.threeDPapersSettings?.open(container, user, cb.onSave);
      container.querySelector('#p3d-logout-btn').onclick = () => cb.onLogout();
      container.querySelectorAll('.p3d-preview-btn').forEach(btn => {
        btn.onclick = () => {
          const wId = btn.dataset.id;
          if (canvas && window.threeDPapersWallpapers) window.threeDPapersWallpapers.renderToCanvas(canvas, wId);
          const tag = container.querySelector('.p3d-stage-tag');
          if (tag) tag.innerHTML = `<span style="color:#f59e0b;">● PREVIEW</span> ${wallpapers.find(x => x.id === wId)?.name}`;
        };
      });
      container.querySelectorAll('.p3d-assign-trigger-btn').forEach(btn => {
        btn.onclick = () => {
          const w = wallpapers.find(x => x.id === btn.dataset.id);
          if (w && cb.onAssignRequest) cb.onAssignRequest(w);
        };
      });
      container.querySelectorAll('.p3d-buy-btn').forEach(btn => {
        btn.onclick = () => {
          const w = wallpapers.find(x => x.id === btn.dataset.id);
          const host = container.querySelector('#p3d-modal-host');
          if (w && host) cb.onPurchaseRequest(w, host);
        };
      });
    }
  };
})();
