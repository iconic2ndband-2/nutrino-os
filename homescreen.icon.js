/* FILE: homescreen.icon.js — Render app icon HTML with update indicator */
(function() {
  window.homescreenIcon = {
    render(app, isEdit) {
      const hasUpdate = window.os?.isUpdateAvailable ? window.os.isUpdateAvailable(app.id) : false;
      const latestObj = window.os?.getLatestVersion ? window.os.getLatestVersion(app.id) : null;
      const latestVer = latestObj?.version || '1.0.0';

      const updateBadgeHtml = hasUpdate ? `
        <span class="app-update-badge" title="Update Available: v${latestVer}">Update</span>
      ` : '';

      if (app.id === 'truespecs') {
        return `
          <div class="app-icon-item ${isEdit ? 'jiggle' : ''}" data-appid="${app.id}">
            <div style="position:relative;width:56px;height:56px;margin:0 auto 4px;">
              <canvas id="hs-truespecs-canvas" width="56" height="56" class="app-icon-badge" style="width:56px;height:56px;padding:0;border:none;box-shadow:0 4px 15px rgba(255,20,147,0.35);"></canvas>
              ${isEdit ? `<button class="app-delete-badge" data-delid="${app.id}" title="Uninstall">✕</button>` : ''}
              ${updateBadgeHtml}
            </div>
            <div class="app-icon-label" style="color:#ff69b4;font-weight:700;">${app.name}</div>
          </div>`;
      }

      return `
        <div class="app-icon-item ${isEdit && app.isDownloadable ? 'jiggle' : ''}" data-appid="${app.id}">
          <div class="app-icon-badge" style="background: ${app.color};">
            ${app.icon}
            ${isEdit && app.isDownloadable ? `<button class="app-delete-badge" data-delid="${app.id}" title="Uninstall">✕</button>` : ''}
            ${updateBadgeHtml}
          </div>
          <div class="app-icon-label">${app.name}</div>
        </div>`;
    }
  };
})();
