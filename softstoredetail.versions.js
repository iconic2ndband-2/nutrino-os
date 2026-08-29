/* FILE: softstoredetail.versions.js — Version history list & rollback UI for app details */
(function() {
  window.softstoreDetailVersions = {
    render(appId) {
      const versions = window.os?.getAppVersions ? window.os.getAppVersions(appId) : [];
      const installedVer = window.os?.getInstalledVersion ? window.os.getInstalledVersion(appId) : null;
      const isInstalled = window.os?.isAppInstalled ? window.os.isAppInstalled(appId) : false;

      if (!versions || versions.length === 0) return '';

      const itemsHtml = versions.map(v => {
        const isCurrent = isInstalled && installedVer === v.version;
        const isOlder = isInstalled && installedVer && (v.version === '1.0.0' && installedVer === '2.0.0');
        const sizeFormatted = (v.size || 10) >= 1000 ? `${(v.size / 1000).toFixed(1)} GB` : `${v.size || 10} MB`;
        const changesHtml = (v.changes || ['Initial release']).map(c => `<li>• ${c}</li>`).join('');

        let actionBtn = '';
        if (isCurrent) {
          actionBtn = `<span class="store-ver-installed-badge" style="background:rgba(16,185,129,0.15);color:#10b981;padding:2px 8px;border-radius:6px;font-size:10px;font-weight:700;">Installed</span>`;
        } else if (isOlder && appId === '3dpapers') {
          actionBtn = `<button class="btn-ver-rollback" data-appid="${appId}" data-ver="${v.version}" data-size="${v.size || 10}" style="background:#f59e0b;color:#fff;border:none;padding:3px 10px;border-radius:6px;font-size:10px;font-weight:700;cursor:pointer;">Rollback</button>`;
        } else {
          actionBtn = `<button class="btn-ver-install" data-appid="${appId}" data-ver="${v.version}" data-size="${v.size || 10}" style="background:var(--accent-color);color:#fff;border:none;padding:3px 10px;border-radius:6px;font-size:10px;font-weight:600;cursor:pointer;">Install v${v.version}</button>`;
        }

        return `
          <div class="store-version-item" style="background:rgba(255,255,255,0.03);border:1px solid var(--border-color);border-radius:10px;padding:10px;margin-bottom:8px;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
              <div>
                <span style="font-weight:700;font-size:13px;color:var(--text-primary);">v${v.version}</span>
                <span style="font-size:11px;color:var(--text-muted);margin-left:6px;">${v.date || ''} • ${sizeFormatted}</span>
              </div>
              <div>${actionBtn}</div>
            </div>
            <div style="font-size:10px;font-weight:700;color:var(--text-muted);margin-bottom:2px;">What's New:</div>
            <ul style="list-style:none;margin:0;padding:0;font-size:11px;color:var(--text-muted);line-height:1.4;">
              ${changesHtml}
            </ul>
          </div>`;
      }).join('');

      return `
        <div class="store-section-box" style="margin-top:16px;">
          <div style="font-size:12px;font-weight:700;color:var(--text-muted);text-transform:uppercase;margin-bottom:8px;letter-spacing:0.5px;">
            Version History & Release Notes
          </div>
          <div class="store-version-list">${itemsHtml}</div>
        </div>`;
    },

    bindEvents(container, appId, onDone) {
      if (!container) return;

      container.querySelectorAll('.btn-ver-rollback').forEach(btn => {
        btn.onclick = (e) => {
          e.stopPropagation();
          const targetVer = btn.dataset.ver;
          const targetSize = parseFloat(btn.dataset.size) || 2300;
          if (window.softstoreRollback) {
            window.softstoreRollback.start(container, appId, { version: targetVer, size: targetSize }, onDone);
          }
        };
      });

      container.querySelectorAll('.btn-ver-install').forEach(btn => {
        btn.onclick = (e) => {
          e.stopPropagation();
          const targetVer = btn.dataset.ver;
          const targetSize = parseFloat(btn.dataset.size) || 10;
          btn.innerText = 'Installing...';
          btn.disabled = true;

          const speed = window.os?.getEffectiveSpeed ? window.os.getEffectiveSpeed() : 1;
          const duration = Math.max(600, (targetSize / speed) * 400);

          setTimeout(() => {
            window.os?.installVersion(appId, targetVer);
            window.animations?.showToast?.(`Installed ${appId} v${targetVer}`);
            if (onDone) onDone();
          }, duration);
        };
      });
    }
  };
})();
