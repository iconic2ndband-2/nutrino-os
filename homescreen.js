/* FILE: homescreen.js — Home screen application grid, dock launcher, and navigation */
(function() {
  window.homescreen = {
    mount(container) {
      const allApps = window.CONSTANTS.APPS;
      const dockApps = window.CONSTANTS.DOCK_APPS;

      // Filter out uninstalled downloadable apps (e.g. Wipe Fresh appears only after installation)
      const visibleApps = allApps.filter(app => {
        if (!app.isDownloadable) return true;
        return window.os.isAppInstalled(app.id);
      });

      const gridHtml = visibleApps.map(app => `
        <div class="app-icon-item" data-appid="${app.id}">
          <div class="app-icon-badge" style="background: ${app.color};">
            ${app.icon}
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
          <div class="app-grid">
            ${gridHtml}
          </div>
          <div class="home-dock">
            ${dockHtml}
          </div>
        </div>
      `;

      container.querySelectorAll('.app-icon-item[data-appid]').forEach(item => {
        item.addEventListener('click', () => {
          const appId = item.dataset.appid;
          window.os.launchApp(appId);
        });
      });

      container.querySelectorAll('.app-icon-item[data-dockid]').forEach(item => {
        item.addEventListener('click', () => {
          const dockId = item.dataset.dockid;
          if (dockId === 'browser') {
            window.os.launchApp('browser');
          } else if (dockId === 'phone') {
            window.animations.showToast('Phone: Local Dialer Ready (Simulated)');
          } else if (dockId === 'messages') {
            window.animations.showToast('Messages: Offline Sandbox Ready');
          }
        });
      });
    },

    unmount() {}
  };
})();
