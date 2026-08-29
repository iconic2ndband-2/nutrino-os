/* FILE: softstore.updates.js — SoftStore v2.0 Updates Tab & Update-All engine */
(function() {
  window.softstoreUpdates = {
    render(updates) {
      if (!updates || updates.length === 0) {
        return `
          <div class="store-updates-empty" style="text-align:center;padding:40px 16px;">
            <div style="font-size:44px;margin-bottom:12px;">✨</div>
            <div style="font-size:15px;font-weight:700;margin-bottom:6px;">All Apps Up to Date</div>
            <div style="font-size:12px;color:var(--text-muted);max-width:280px;margin:0 auto;">
              No updates available. All your installed applications are running the latest versions.
            </div>
          </div>`;
      }

      const listHtml = updates.map(item => {
        const app = item.app;
        const sizeMB = item.latestInfo?.size || app.sizeMB || 10;
        const sizeFormatted = sizeMB >= 1000 ? `${(sizeMB / 1000).toFixed(1)} GB` : `${sizeMB} MB`;
        const changesHtml = (item.latestInfo?.changes || ['Bug fixes & improvements'])
          .map(c => `<li>• ${c}</li>`).join('');

        return `
          <div class="store-update-card" style="background:var(--card-bg);border:1px solid var(--border-color);border-radius:12px;padding:12px;margin-bottom:10px;" data-appid="${item.appId}">
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
              <div class="store-app-icon-sm" style="background:${app.color};width:42px;height:42px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:20px;">
                ${app.icon}
              </div>
              <div style="flex:1;">
                <div style="font-weight:700;font-size:14px;">${app.name}</div>
                <div style="font-size:11px;color:var(--text-muted);">
                  v${item.currentVersion} <span style="color:#10b981;font-weight:700;">➔ v${item.latestVersion}</span> • ${sizeFormatted}
                </div>
              </div>
              <button class="btn-primary btn-update-single" data-appid="${item.appId}" data-ver="${item.latestVersion}" data-size="${sizeMB}" style="background:#10b981;min-height:30px;padding:0 12px;font-size:11px;">
                Update
              </button>
            </div>
            <div class="store-update-changes" style="font-size:11px;color:var(--text-muted);background:rgba(255,255,255,0.03);padding:6px 10px;border-radius:6px;">
              <ul style="list-style:none;margin:0;padding:0;">${changesHtml}</ul>
            </div>
            <div class="store-update-prog-box" id="prog-box-${item.appId}" style="display:none;margin-top:8px;">
              <div style="display:flex;justify-content:space-between;font-size:10px;margin-bottom:3px;">
                <span class="prog-status" id="prog-status-${item.appId}">Downloading...</span>
                <span class="prog-pct" id="prog-pct-${item.appId}">0%</span>
              </div>
              <div style="width:100%;height:4px;background:var(--border-color);border-radius:2px;overflow:hidden;">
                <div class="prog-bar-fill" id="prog-fill-${item.appId}" style="width:0%;height:100%;background:#10b981;transition:width 0.1s linear;"></div>
              </div>
            </div>
          </div>`;
      }).join('');

      return `
        <div class="store-updates-container">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
            <div>
              <div style="font-size:14px;font-weight:700;">App Updates (${updates.length})</div>
              <div style="font-size:11px;color:var(--text-muted);">Latest versions ready to install</div>
            </div>
            <button id="store-update-all-btn" class="btn-primary" style="background:#10b981;min-height:32px;padding:0 12px;font-size:11px;font-weight:700;">
              Update All
            </button>
          </div>
          <div class="store-updates-list">${listHtml}</div>
        </div>`;
    },

    bindEvents(container, onComplete) {
      if (!container) return;

      const performUpdate = (appId, ver, sizeMB, callback) => {
        const progBox = container.querySelector(`#prog-box-${appId}`);
        const statusEl = container.querySelector(`#prog-status-${appId}`);
        const pctEl = container.querySelector(`#prog-pct-${appId}`);
        const fillEl = container.querySelector(`#prog-fill-${appId}`);
        const btn = container.querySelector(`.btn-update-single[data-appid="${appId}"]`);

        if (btn) btn.disabled = true;
        if (progBox) progBox.style.display = 'block';

        const speed = window.os?.getEffectiveSpeed ? window.os.getEffectiveSpeed() : 1;
        const totalDuration = Math.max(800, (sizeMB / speed) * 800);
        const startTime = Date.now();

        const timer = setInterval(() => {
          const elapsed = Date.now() - startTime;
          const pct = Math.min(100, Math.floor((elapsed / totalDuration) * 100));
          if (pctEl) pctEl.innerText = pct + '%';
          if (fillEl) fillEl.style.width = pct + '%';

          if (pct >= 100) {
            clearInterval(timer);
            if (statusEl) statusEl.innerText = 'Installing update...';
            setTimeout(() => {
              window.os?.installVersion(appId, ver);
              window.animations?.showToast?.(`Updated ${appId} to v${ver}!`);
              if (callback) callback();
              else if (onComplete) onComplete();
            }, 500);
          }
        }, 60);
      };

      container.querySelectorAll('.btn-update-single').forEach(b => {
        b.onclick = (e) => {
          e.stopPropagation();
          const appId = b.dataset.appid;
          const ver = b.dataset.ver;
          const sizeMB = parseFloat(b.dataset.size) || 10;
          performUpdate(appId, ver, sizeMB);
        };
      });

      const updateAllBtn = container.querySelector('#store-update-all-btn');
      if (updateAllBtn) {
        updateAllBtn.onclick = () => {
          updateAllBtn.disabled = true;
          const singleBtns = Array.from(container.querySelectorAll('.btn-update-single'));
          if (singleBtns.length === 0) return;

          let index = 0;
          const runNext = () => {
            if (index >= singleBtns.length) {
              if (onComplete) onComplete();
              return;
            }
            const b = singleBtns[index++];
            const appId = b.dataset.appid;
            const ver = b.dataset.ver;
            const sizeMB = parseFloat(b.dataset.size) || 10;
            performUpdate(appId, ver, sizeMB, runNext);
          };
          runNext();
        };
      }
    }
  };
})();
