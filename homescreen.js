/* FILE: homescreen.js — Paginated Home Screen with swipe navigation and 4x3 app grid */
(function() {
  let isEditMode = false, pressTimer = null, isDragging = false, active3dInst = null;
  let currentPage = 0, startX = 0, startY = 0, currentX = 0, currentY = 0;

  function getSortedApps() {
    const all = window.CONSTANTS.APPS || [];
    const sys = all.filter(a => !a.isDownloadable).sort((a, b) => a.name.localeCompare(b.name));
    const user = all.filter(a => a.isDownloadable && window.os.isAppInstalled(a.id)).sort((a, b) => a.name.localeCompare(b.name));
    return [...sys, ...user];
  }

  window.homescreen = {
    mount(container) {
      isEditMode = false;
      const render = () => {
        if (window.truespecsIcon?.unmount) window.truespecsIcon.unmount();
        if (active3dInst) { active3dInst.stop(); active3dInst = null; }

        const apps = getSortedApps(), pageSize = 12;
        const totalPages = Math.max(1, Math.ceil(apps.length / pageSize));
        if (currentPage >= totalPages) currentPage = totalPages - 1;
        if (currentPage < 0) currentPage = 0;

        const pageApps = apps.slice(currentPage * pageSize, (currentPage + 1) * pageSize);
        const home3d = window.os?.getWallpaper3D?.('home');
        const gridHtml = pageApps.map(app => window.homescreenIcon?.render(app, isEditMode)).join('');
        const dotsHtml = totalPages > 1 ? Array.from({ length: totalPages }, (_, i) => `
          <div class="hs-page-dot ${i === currentPage ? 'active' : ''}" data-page="${i}" title="Page ${i + 1}"></div>
        `).join('') : '';

        container.innerHTML = `
          <div class="screen-view homescreen-root" id="hs-swipe-zone" style="position:relative;overflow:hidden;">
            <canvas id="hs-3d-bg-canvas" style="position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:0;display:${home3d ? 'block' : 'none'};"></canvas>
            <div style="position:relative;z-index:1;display:flex;flex-direction:column;height:100%;justify-content:space-between;">
              ${isEditMode ? `<div class="homescreen-edit-bar"><span style="font-size:12px;font-weight:700;color:#fff;">Delete Applications</span><button id="hs-done-edit-btn" class="btn-primary" style="min-height:28px;padding:0 12px;font-size:11px;background:#10b981;">Done</button></div>` : '<div style="height:6px;"></div>'}
              <div class="app-grid-container" style="flex:1;display:flex;align-items:flex-start;justify-content:center;padding-top:4px;">
                <div class="app-grid">${gridHtml}</div>
              </div>
              <div class="hs-pagination-bar"><div class="hs-dots-container" style="display:${totalPages > 1 ? 'flex' : 'none'};">${dotsHtml}</div></div>
            </div>
          </div>`;

        if (home3d && window.threeDPapersWallpapers?.createInstance) {
          const bgCanvas = container.querySelector('#hs-3d-bg-canvas');
          if (bgCanvas) active3dInst = window.threeDPapersWallpapers.createInstance(bgCanvas, home3d);
        }
        const tsCanvas = container.querySelector('#hs-truespecs-canvas');
        if (tsCanvas && window.truespecsIcon?.mount) window.truespecsIcon.mount(tsCanvas);

        if (isEditMode) {
          const doneBtn = container.querySelector('#hs-done-edit-btn');
          if (doneBtn) doneBtn.onclick = (e) => { e.stopPropagation(); isEditMode = false; render(); };
        }

        container.querySelectorAll('.hs-page-dot').forEach(dot => {
          dot.onclick = (e) => { e.stopPropagation(); currentPage = parseInt(dot.dataset.page, 10); render(); };
        });

        const triggerDeleteApp = (appId) => {
          const app = (window.CONSTANTS.APPS || []).find(a => a.id === appId);
          const appName = app ? app.name : appId, sizeMB = app ? (app.totalSizeMB || app.sizeMB) : 10;
          const sizeFormatted = sizeMB >= 1000 ? `${(sizeMB / 1000).toFixed(1)} GB` : `${sizeMB} MB`;
          const performDeletion = () => {
            window.os.uninstallApp(appId); window.animations?.showToast?.(`Deleted "${appName}" (Freed ${sizeFormatted})`); render();
          };
          if (window.confirmModal) {
            window.confirmModal.show({
              title: `Delete ${appName}?`, message: `Deleting "${appName}" will remove the application and free up ${sizeFormatted} of storage.`,
              icon: '🗑️', confirmText: 'Delete App', cancelText: 'Cancel', isDestructive: true, onConfirm: performDeletion
            });
          } else { performDeletion(); }
        };

        container.querySelectorAll('.app-delete-badge').forEach(delBtn => {
          delBtn.onclick = (e) => { e.stopPropagation(); e.preventDefault(); triggerDeleteApp(delBtn.dataset.delid); };
        });

        container.querySelectorAll('.app-icon-item[data-appid]').forEach(item => {
          const startPress = () => {
            isDragging = false; if (pressTimer) clearTimeout(pressTimer);
            pressTimer = setTimeout(() => { if (!isDragging) { isEditMode = true; render(); } }, 550);
          };
          const cancelPress = () => { if (pressTimer) { clearTimeout(pressTimer); pressTimer = null; } };

          item.addEventListener('mousedown', startPress); item.addEventListener('mouseup', cancelPress);
          item.addEventListener('mouseleave', cancelPress); item.addEventListener('touchstart', startPress, { passive: true });
          item.addEventListener('touchmove', () => { isDragging = true; cancelPress(); }, { passive: true });
          item.addEventListener('touchend', cancelPress); item.addEventListener('touchcancel', cancelPress);

          item.onclick = (e) => {
            if (e.target.classList.contains('app-delete-badge') || e.target.closest('.app-delete-badge')) return;
            const appId = item.dataset.appid;
            if (isEditMode) {
              const app = (window.CONSTANTS.APPS || []).find(a => a.id === appId);
              if (app && app.isDownloadable) triggerDeleteApp(appId);
              return;
            }
            if (appId === 'phone') { window.animations?.showToast?.('Phone: Local Dialer Ready (Simulated)'); return; }
            if (appId === 'messages') { window.animations?.showToast?.('Messages: Offline Sandbox Ready'); return; }
            if ((appId === 'nitrorace' || appId === 'nitroracese' || appId === '3dpapers') && !window.os?.canRun3D?.()) {
              const app = (window.CONSTANTS.APPS || []).find(a => a.id === appId);
              window.osGpu?.showCrashScreen(container, app?.name || '3D Wallpaper Engine', window.os?.getInstalledVersion(appId), () => render());
              return;
            }
            window.os.launchApp(appId);
          };
        });

        const swipeZone = container.querySelector('#hs-swipe-zone');
        if (swipeZone) {
          const onTouchStart = (e) => { const t = e.touches ? e.touches[0] : e; startX = t.clientX; startY = t.clientY; currentX = startX; currentY = startY; };
          const onTouchMove = (e) => { const t = e.touches ? e.touches[0] : e; currentX = t.clientX; currentY = t.clientY; };
          const onTouchEnd = () => {
            const dx = currentX - startX, dy = currentY - startY;
            if (Math.abs(dx) >= 50 && Math.abs(dx) > Math.abs(dy)) {
              if (dx < 0 && currentPage < totalPages - 1) { currentPage++; render(); }
              else if (dx > 0 && currentPage > 0) { currentPage--; render(); }
            }
          };
          swipeZone.addEventListener('touchstart', onTouchStart, { passive: true });
          swipeZone.addEventListener('touchmove', onTouchMove, { passive: true });
          swipeZone.addEventListener('touchend', onTouchEnd);
          swipeZone.addEventListener('mousedown', onTouchStart);
          swipeZone.addEventListener('mousemove', onTouchMove);
          swipeZone.addEventListener('mouseup', onTouchEnd);
        }
      };

      render();
    },

    unmount() {
      if (pressTimer) { clearTimeout(pressTimer); pressTimer = null; }
      if (window.truespecsIcon?.unmount) window.truespecsIcon.unmount();
      if (active3dInst) { active3dInst.stop(); active3dInst = null; }
      isEditMode = false;
    }
  };
})();
