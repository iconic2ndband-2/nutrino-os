/* FILE: homescreen.js — Home screen application grid, jiggle delete mode, dock launcher */
(function() {
  let isEditMode = false;
  let pressTimer = null;
  let isDragging = false;

  window.homescreen = {
    mount(container) {
      isEditMode = false;
      const render = () => {
        const allApps = window.CONSTANTS.APPS || [];
        const dockApps = window.CONSTANTS.DOCK_APPS || [];

        const visibleApps = allApps.filter(app => {
          if (!app.isDownloadable) return true;
          return window.os.isAppInstalled(app.id);
        });

        const gridHtml = visibleApps.map(app => `
          <div class="app-icon-item ${isEditMode && app.isDownloadable ? 'jiggle' : ''}" data-appid="${app.id}">
            <div class="app-icon-badge" style="background: ${app.color};">
              ${app.icon}
              ${isEditMode && app.isDownloadable ? `<button class="app-delete-badge" data-delid="${app.id}" title="Uninstall">✕</button>` : ''}
            </div>
            <div class="app-icon-label">${app.name}</div>
          </div>
        `).join('');

        const dockHtml = dockApps.map(app => `
          <div class="app-icon-item" data-dockid="${app.id}">
            <div class="app-icon-badge" style="background: ${app.color}; width: 48px; height: 48px; border-radius: 14px;">
              ${app.icon}
            </div>
            <div class="app-icon-label" style="font-size: 10px;">${app.name}</div>
          </div>
        `).join('');

        container.innerHTML = `
          <div class="screen-view homescreen-root">
            ${isEditMode ? `
              <div class="homescreen-edit-bar">
                <span style="font-size:12px;font-weight:700;color:#fff;">Delete Applications</span>
                <button id="hs-done-edit-btn" class="btn-primary" style="min-height:28px;padding:0 12px;font-size:11px;background:#10b981;">Done</button>
              </div>` : ''}
            <div class="app-grid">
              ${gridHtml}
            </div>
            <div class="home-dock">
              ${dockHtml}
            </div>
          </div>
        `;

        if (isEditMode) {
          const doneBtn = container.querySelector('#hs-done-edit-btn');
          if (doneBtn) {
            doneBtn.onclick = (e) => {
              e.stopPropagation();
              isEditMode = false;
              render();
            };
          }
        }

        const triggerDeleteApp = (appId) => {
          const app = (window.CONSTANTS.APPS || []).find(a => a.id === appId);
          const appName = app ? app.name : appId;
          const sizeMB = app ? app.sizeMB : 10;
          const sizeFormatted = sizeMB >= 1000 ? `${(sizeMB / 1000).toFixed(1)} GB` : `${sizeMB} MB`;

          const performDeletion = () => {
            window.os.uninstallApp(appId);
            window.animations?.showToast?.(`Deleted "${appName}" (Freed ${sizeFormatted})`);
            render();
          };

          if (window.confirmModal) {
            window.confirmModal.show({
              title: `Delete ${appName}?`,
              message: `Deleting "${appName}" will remove the application and free up ${sizeFormatted} of storage.`,
              icon: '🗑️',
              confirmText: 'Delete App',
              cancelText: 'Cancel',
              isDestructive: true,
              onConfirm: performDeletion
            });
          } else {
            performDeletion();
          }
        };

        // Delete badge direct click
        container.querySelectorAll('.app-delete-badge').forEach(delBtn => {
          delBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            const appId = delBtn.dataset.delid;
            triggerDeleteApp(appId);
          });
        });

        // App icons press & long press handlers
        container.querySelectorAll('.app-icon-item[data-appid]').forEach(item => {
          const startPress = (e) => {
            isDragging = false;
            if (pressTimer) clearTimeout(pressTimer);
            pressTimer = setTimeout(() => {
              if (!isDragging) {
                isEditMode = true;
                render();
              }
            }, 550);
          };

          const cancelPress = () => {
            if (pressTimer) {
              clearTimeout(pressTimer);
              pressTimer = null;
            }
          };

          item.addEventListener('mousedown', startPress);
          item.addEventListener('mouseup', cancelPress);
          item.addEventListener('mouseleave', cancelPress);
          item.addEventListener('touchstart', startPress, { passive: true });
          item.addEventListener('touchmove', () => { isDragging = true; cancelPress(); }, { passive: true });
          item.addEventListener('touchend', cancelPress);
          item.addEventListener('touchcancel', cancelPress);

          item.addEventListener('click', (e) => {
            if (e.target.classList.contains('app-delete-badge') || e.target.closest('.app-delete-badge')) {
              return;
            }

            const appId = item.dataset.appid;
            if (isEditMode) {
              const app = (window.CONSTANTS.APPS || []).find(a => a.id === appId);
              if (app && app.isDownloadable) {
                triggerDeleteApp(appId);
              }
              return;
            }

            window.os.launchApp(appId);
          });
        });

        container.querySelectorAll('.app-icon-item[data-dockid]').forEach(item => {
          item.addEventListener('click', () => {
            if (isEditMode) { isEditMode = false; render(); return; }
            const dockId = item.dataset.dockid;
            if (dockId === 'browser') window.os.launchApp('browser');
            else if (dockId === 'phone') window.animations?.showToast?.('Phone: Local Dialer Ready (Simulated)');
            else if (dockId === 'messages') window.animations?.showToast?.('Messages: Offline Sandbox Ready');
          });
        });
      };

      render();
    },

    unmount() {
      if (pressTimer) { clearTimeout(pressTimer); pressTimer = null; }
      isEditMode = false;
    }
  };
})();
