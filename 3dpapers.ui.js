/* FILE: 3dpapers.ui.js — 3DPapers view renderer, catalog cards, and settings modal */
(function() {
  let rootEl = null, callbacks = null;

  function renderHeader(user) {
    const totalSpent = (user.totalSpending || 0).toFixed(2);
    return `
      <div class="p3d-header">
        <div style="display:flex;align-items:center;gap:8px;">
          <span style="font-size:18px;">🌌</span>
          <div><div style="font-size:13px;font-weight:800;color:#fff;">3DPapers</div><div style="font-size:10px;color:#94a3b8;">${user.username}</div></div>
        </div>
        <div style="display:flex;align-items:center;gap:6px;">
          <div class="p3d-spend-badge" title="Total Money Spent"><span>💳</span><span>$${totalSpent}</span></div>
          <button id="p3d-set-btn" class="btn-secondary" style="padding:4px 8px;min-height:26px;font-size:11px;">⚙️</button>
          <button id="p3d-logout-btn" class="btn-secondary" style="padding:4px 8px;min-height:26px;font-size:11px;">Logout</button>
        </div>
      </div>`;
  }

  function renderStage(activeWp) {
    return `
      <div class="p3d-stage">
        <canvas id="p3d-live-canvas"></canvas>
        <div class="p3d-stage-overlay">
          <div class="p3d-stage-tag"><span style="color:#34d399;">● LIVE</span> ${activeWp?.name || 'Nebula Drift'}</div>
          <button id="p3d-toggle-fs" class="p3d-stage-tag" style="cursor:pointer;pointer-events:auto;color:#c4b5fd;">3D View</button>
        </div>
      </div>`;
  }

  function renderList(wallpapers, user) {
    const activeId = user.activeWallpaperId || 'nebula';
    const items = wallpapers.map(w => {
      const isActive = (w.id === activeId);
      const isOwned = (user.purchasedWallpapers || []).includes(w.id);
      return `
        <div class="p3d-card ${isActive ? 'active' : ''}">
          <div class="p3d-card-header">
            <div style="display:flex;align-items:center;gap:8px;">
              <span style="font-size:24px;">${w.icon || '🌌'}</span>
              <div>
                <div style="font-size:13px;font-weight:700;color:#fff;">${w.name}</div>
                <div style="font-size:10px;color:#cbd5e1;">Rate: $${w.costPerSec.toFixed(3)}/sec</div>
              </div>
            </div>
            <span class="p3d-card-price">$${w.price.toFixed(2)} / ${w.duration}s</span>
          </div>
          <div class="p3d-card-desc">${w.desc}</div>
          <div class="p3d-card-actions">
            <button class="btn-secondary p3d-preview-btn" data-id="${w.id}" style="flex:1;min-height:30px;font-size:11px;">👁️ Preview 3D</button>
            <button class="btn-primary p3d-buy-btn" data-id="${w.id}" style="flex:2;min-height:30px;font-size:11px;background:${isActive ? '#10b981' : '#8b5cf6'};">
              ${isActive ? '✓ Active Live' : 'Apply Wallpaper ($' + w.price.toFixed(2) + ')'}
            </button>
          </div>
        </div>`;
    }).join('');
    return `<div class="p3d-list">${items}</div>`;
  }

  function renderSettingsModal(user, onSave) {
    const modalEl = document.createElement('div');
    modalEl.className = 'p3d-modal-backdrop';
    const autoRenew = user.subscription?.autoRenew ?? true;
    const accounts = window.gamesafeDB?.getAllAccounts('3dpapers') || [];

    modalEl.innerHTML = `
      <div class="p3d-modal-card">
        <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid rgba(255,255,255,0.08);padding-bottom:6px;">
          <span style="font-size:13px;font-weight:700;color:#fff;">⚙️ 3DPapers Settings</span>
          <button id="p3d-close-settings" style="background:none;border:none;color:#94a3b8;cursor:pointer;font-size:16px;">✕</button>
        </div>
        <div style="display:flex;flex-direction:column;gap:10px;">
          <div style="display:flex;justify-content:space-between;align-items:center;background:rgba(255,255,255,0.05);padding:8px 10px;border-radius:8px;">
            <div><div style="font-size:12px;font-weight:700;">Auto-Renew Wallpaper</div><div style="font-size:10px;color:#94a3b8;">Silent renewal via SuperBank</div></div>
            <input type="checkbox" id="p3d-toggle-renew" ${autoRenew ? 'checked' : ''}>
          </div>
          <div style="background:rgba(255,255,255,0.05);padding:8px 10px;border-radius:8px;">
            <div style="font-size:12px;font-weight:700;color:#38bdf8;">👥 Multi-Account Vault</div>
            <div style="font-size:10px;color:#cbd5e1;margin-top:2px;">Accounts: ${accounts.join(', ') || user.username}</div>
          </div>
          <button id="p3d-opt-out-btn" class="btn-secondary" style="font-size:11px;color:#f87171;border-color:rgba(239,68,68,0.3);">Opt-Out of Live Subscriptions</button>
        </div>
      </div>`;

    modalEl.querySelector('#p3d-close-settings').onclick = () => modalEl.remove();
    modalEl.querySelector('#p3d-toggle-renew').onchange = (e) => {
      user.subscription = user.subscription || {};
      user.subscription.autoRenew = e.target.checked;
      onSave(user);
    };
    modalEl.querySelector('#p3d-opt-out-btn').onclick = () => {
      user.subscription = user.subscription || {};
      user.subscription.autoRenew = false;
      user.subscription.active = false;
      onSave(user);
      window.animations?.showToast?.('Opted out of live auto-renewals');
      modalEl.remove();
    };
    rootEl.appendChild(modalEl);
  }

  window.threeDPapersUI = {
    render(container, user, wallpapers, cb) {
      rootEl = container;
      callbacks = cb;
      const activeWp = wallpapers.find(w => w.id === (user.activeWallpaperId || 'nebula')) || wallpapers[0];
      container.innerHTML = `<div class="p3d-root">${renderHeader(user)}${renderStage(activeWp)}${renderList(wallpapers, user)}<div id="p3d-modal-host"></div></div>`;

      const canvas = container.querySelector('#p3d-live-canvas');
      if (canvas && window.threeDPapersWallpapers) {
        window.threeDPapersWallpapers.renderToCanvas(canvas, activeWp.id);
      }

      container.querySelector('#p3d-set-btn').onclick = () => renderSettingsModal(user, cb.onSave);
      container.querySelector('#p3d-logout-btn').onclick = () => cb.onLogout();
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
          const w = wallpapers.find(x => x.id === btn.dataset.id);
          const host = container.querySelector('#p3d-modal-host');
          if (w && host) cb.onPurchaseRequest(w, host);
        };
      });
    }
  };
})();
