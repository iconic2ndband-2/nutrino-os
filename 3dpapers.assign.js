/* FILE: 3dpapers.assign.js — Multi-screen wallpaper assignment modal & Gamesafe sync */
(function() {
  window.threeDPapersAssign = {
    open(container, wallpaper, currentUser, onComplete) {
      const modalHost = container.querySelector('#p3d-modal-host') || container;
      const modalEl = document.createElement('div');
      modalEl.className = 'p3d-modal-backdrop';
      modalEl.id = 'p3d-assign-modal';

      const assignments = currentUser.assignments || {
        home: window.os?.getWallpaper3D?.('home') || 'nebula',
        lock: window.os?.getWallpaper3D?.('lock') || 'nebula'
      };

      const wallpapers = window.CONSTANTS?.WALLPAPERS_3D || [];
      const homeWpName = wallpapers.find(w => w.id === assignments.home)?.name || assignments.home || 'Nebula Drift';
      const lockWpName = wallpapers.find(w => w.id === assignments.lock)?.name || assignments.lock || 'Nebula Drift';

      modalEl.innerHTML = `
        <div class="p3d-modal-card" style="max-width:320px;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
            <div style="display:flex;align-items:center;gap:6px;">
              <span style="font-size:20px;">${wallpaper.icon || '🌌'}</span>
              <div>
                <div style="font-size:13px;font-weight:800;color:#fff;">Assign Wallpaper</div>
                <div style="font-size:10px;color:#94a3b8;">${wallpaper.name}</div>
              </div>
            </div>
            <button id="p3d-assign-close" style="background:none;border:none;color:#94a3b8;cursor:pointer;font-size:16px;">✕</button>
          </div>

          <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);padding:8px 10px;border-radius:8px;margin-bottom:12px;font-size:11px;">
            <div style="font-size:10px;font-weight:700;color:#38bdf8;text-transform:uppercase;margin-bottom:4px;">Current Assignments</div>
            <div style="display:flex;justify-content:space-between;margin-bottom:2px;"><span style="color:#94a3b8;">🏠 Home Screen:</span><span style="font-weight:700;color:#fff;">${homeWpName}</span></div>
            <div style="display:flex;justify-content:space-between;"><span style="color:#94a3b8;">🔒 Lock Screen:</span><span style="font-weight:700;color:#fff;">${lockWpName}</span></div>
          </div>

          <div style="font-size:11px;font-weight:700;color:#cbd5e1;margin-bottom:8px;">Choose Target Screen:</div>
          <div style="display:flex;flex-direction:column;gap:8px;">
            <button class="btn-primary p3d-assign-btn" data-target="home" style="background:#6366f1;display:flex;align-items:center;justify-content:space-between;padding:10px 14px;">
              <span>🏠 Home Screen Only</span><span style="font-size:10px;opacity:0.8;">Set Desktop</span>
            </button>
            <button class="btn-primary p3d-assign-btn" data-target="lock" style="background:#0ea5e9;display:flex;align-items:center;justify-content:space-between;padding:10px 14px;">
              <span>🔒 Lock Screen Only</span><span style="font-size:10px;opacity:0.8;">Set Lock</span>
            </button>
            <button class="btn-primary p3d-assign-btn" data-target="both" style="background:#8b5cf6;display:flex;align-items:center;justify-content:space-between;padding:10px 14px;">
              <span>📱 Both Screens</span><span style="font-size:10px;opacity:0.8;">Home & Lock</span>
            </button>
          </div>
        </div>`;

      modalEl.querySelector('#p3d-assign-close').onclick = () => modalEl.remove();

      modalEl.querySelectorAll('.p3d-assign-btn').forEach(btn => {
        btn.onclick = () => {
          const target = btn.dataset.target;
          currentUser.assignments = currentUser.assignments || {};
          if (target === 'home' || target === 'both') currentUser.assignments.home = wallpaper.id;
          if (target === 'lock' || target === 'both') currentUser.assignments.lock = wallpaper.id;
          currentUser.activeWallpaperId = wallpaper.id;

          window.os?.applyWallpaper?.(target, wallpaper.id);
          modalEl.remove();
          if (onComplete) onComplete(currentUser);
        };
      });

      modalHost.appendChild(modalEl);
    }
  };
})();
