/* FILE: softstoredetail.js — SoftStore App Detail page view, versioning, & download flow */
(function() {
  let activeInterval = null, currentContainer = null, selectedShotIdx = 0;

  function renderDetail(appId, backCallback) {
    const app = (window.CONSTANTS.APPS || []).find(a => a.id === appId);
    if (!app || !currentContainer) return;

    const isInstalled = window.os?.isAppInstalled(appId);
    const installedVer = window.os?.getInstalledVersion ? window.os.getInstalledVersion(appId) : (app.version || '1.0.0');
    const hasUpdate = window.os?.isUpdateAvailable ? window.os.isUpdateAvailable(appId) : false;
    const latestObj = window.os?.getLatestVersion ? window.os.getLatestVersion(appId) : null;
    const latestVer = latestObj?.version || '1.0.0';
    const totalSizeMB = window.CONSTANTS.APP_TOTAL_SIZE?.[appId] || app.totalSizeMB || app.sizeMB || 10;
    const dlSizeMB = isInstalled ? (latestObj?.size || app.sizeMB || 10) : totalSizeMB;
    const estTimeSec = window.os?.getDownloadTime(dlSizeMB) || 1;
    const estFormatted = estTimeSec < 60 ? `${estTimeSec.toFixed(1)}s` : `${(estTimeSec / 60).toFixed(1)}m`;
    const priceLabel = app.price === 0 ? 'Free' : `$${app.price.toFixed(2)}`;
    const sizeFormatted = totalSizeMB >= 1000 ? `${(totalSizeMB / 1000).toFixed(1)} GB` : `${totalSizeMB} MB`;
    const isMultiShot = appId === 'realosdb';
    const shotTabsHtml = isMultiShot ? `
      <div style="display:flex;gap:6px;margin:4px 0 6px;">
        ${['Overview', 'Stores', 'Search', 'Export'].map((name, i) => `<button class="store-shot-tab ${i === selectedShotIdx ? 'active' : ''}" data-idx="${i}" style="flex:1;background:${i === selectedShotIdx ? '#ff3333' : '#27272a'};color:#fff;border:none;border-radius:4px;padding:4px 0;font-size:10px;cursor:pointer;">${name}</button>`).join('')}
      </div>` : '';

    currentContainer.innerHTML = `
      <div class="store-detail-root">
        <button id="store-detail-back" class="btn-secondary" style="align-self:flex-start;min-height:32px;padding:0 10px;font-size:12px;margin-bottom:8px;">‹ All Apps</button>
        <div class="store-detail-header">
          <div class="store-app-icon" style="background:${app.color};width:54px;height:54px;border-radius:14px;">${app.icon}</div>
          <div style="flex:1;">
            <div style="font-size:17px;font-weight:700;">${app.name}</div>
            <div style="font-size:12px;color:var(--text-muted);">Developer: <span style="color:var(--text-primary);font-weight:600;">${app.developer || 'Nutrino Dev'}</span> • v${isInstalled ? installedVer : latestVer}</div>
            <div style="font-size:13px;font-weight:700;color:#34d399;margin-top:2px;">${priceLabel}</div>
          </div>
        </div>
        <div class="store-stat-grid">
          <div class="store-stat-card"><span class="label">RATING</span><span class="val">⭐ ${app.rating || '4.5'}</span></div>
          <div class="store-stat-card"><span class="label">DOWNLOADS</span><span class="val">${app.downloads || '1K+'}</span></div>
          <div class="store-stat-card"><span class="label">SIZE</span><span class="val">${sizeFormatted}</span></div>
          <div class="store-stat-card"><span class="label">CATEGORY</span><span class="val">${app.category || 'Utility'}</span></div>
        </div>
        <div style="font-size:12px;font-weight:700;margin:6px 0 2px;">PREVIEW SCREENSHOT ${isMultiShot ? `(${selectedShotIdx + 1}/4)` : ''}</div>
        ${shotTabsHtml}
        <div class="store-screenshot-wrap"><canvas id="store-app-canvas" width="280" height="150" class="store-app-canvas"></canvas></div>
        <div style="font-size:12px;font-weight:700;margin:8px 0 4px;">ABOUT THIS APP</div>
        <div style="font-size:12px;color:var(--text-muted);line-height:1.4;margin-bottom:12px;">${app.description || ''}</div>
        ${window.softstoreDetailVersions?.render ? window.softstoreDetailVersions.render(appId) : ''}
        <div id="store-action-zone" style="margin-top:16px;">
          ${isInstalled ? `
            <div style="display:flex;flex-direction:column;gap:8px;">
              ${hasUpdate ? `<button id="store-update-action-btn" class="btn-primary" style="background:#10b981;">Update Available (v${latestVer})</button>` : ''}
              <div style="display:flex;gap:8px;">
                <button id="store-launch-btn" class="btn-primary" style="flex:2;background:#6366f1;">Open App</button>
                <button id="store-uninstall-btn" class="btn-secondary" style="flex:1;color:#f87171;border-color:rgba(239,68,68,0.4);">Uninstall</button>
              </div>
            </div>` : `<button id="store-buy-btn" class="btn-primary" style="width:100%;">${app.price > 0 ? `Buy for $${app.price.toFixed(2)}` : 'Install (Free)'}</button>`}
          <div id="store-dl-progress-box" class="store-progress-box" style="display:none;margin-top:8px;">
            <div class="store-progress-label"><span id="store-dl-text">Downloading... 0%</span><span id="store-dl-eta">ETA: ${estFormatted}</span></div>
            <div class="store-progress-bar-wrap"><div id="store-dl-fill-bar" class="store-progress-fill" style="width:0%;"></div></div>
          </div>
        </div>
      </div>`;

    const canvas = currentContainer.querySelector('#store-app-canvas');
    if (canvas && window.screenshots) window.screenshots.render(appId, canvas, selectedShotIdx);
    currentContainer.querySelectorAll('.store-shot-tab').forEach(t => {
      t.onclick = () => { selectedShotIdx = parseInt(t.dataset.idx, 10); renderDetail(appId, backCallback); };
    });
    currentContainer.querySelector('#store-detail-back').onclick = backCallback;
    const launchBtn = currentContainer.querySelector('#store-launch-btn');
    if (launchBtn) launchBtn.onclick = () => window.os?.launchApp(appId);
    const updateActionBtn = currentContainer.querySelector('#store-update-action-btn');
    if (updateActionBtn) updateActionBtn.onclick = () => startDownload(appId, latestObj?.size || totalSizeMB, backCallback, latestVer);

    const uninstallBtn = currentContainer.querySelector('#store-uninstall-btn');
    if (uninstallBtn) {
      uninstallBtn.onclick = () => {
        const performUninstall = () => {
          window.os?.uninstallApp(appId);
          window.animations?.showToast?.(`Uninstalled "${app.name}" (Freed ${sizeFormatted})`);
          renderDetail(appId, backCallback);
        };
        if (window.confirmModal) {
          window.confirmModal.show({
            title: `Uninstall ${app.name}?`, message: `Remove ${app.name} from your device and reclaim ${sizeFormatted} storage?`,
            icon: '📦', confirmText: 'Uninstall', cancelText: 'Keep', isDestructive: true, onConfirm: performUninstall
          });
        } else { performUninstall(); }
      };
    }

    const buyBtn = currentContainer.querySelector('#store-buy-btn');
    if (buyBtn) {
      buyBtn.onclick = () => {
        if (app.price > 0) window.os?.purchase(`SoftStore: ${app.name}`, app.price, () => startDownload(appId, dlSizeMB, backCallback, latestVer));
        else startDownload(appId, dlSizeMB, backCallback, latestVer);
      };
    }
    window.softstoreDetailVersions?.bindEvents(currentContainer, appId, () => renderDetail(appId, backCallback));
  }

  function startDownload(appId, sizeMB, backCallback, targetVersion) {
    const buyBtn = currentContainer.querySelector('#store-buy-btn'), updateBtn = currentContainer.querySelector('#store-update-action-btn');
    const progBox = currentContainer.querySelector('#store-dl-progress-box'), fillBar = currentContainer.querySelector('#store-dl-fill-bar');
    const progText = currentContainer.querySelector('#store-dl-text'), progEta = currentContainer.querySelector('#store-dl-eta');
    if (buyBtn) buyBtn.style.display = 'none';
    if (updateBtn) updateBtn.style.display = 'none';
    if (progBox) progBox.style.display = 'block';

    const estSec = window.os?.getDownloadTime(sizeMB) || 1;
    const totalMs = Math.max(900, Math.min(60000, estSec * 1000));
    let elapsed = 0;
    window.os?.addDataUsage(sizeMB);

    if (activeInterval) clearInterval(activeInterval);
    activeInterval = setInterval(() => {
      elapsed += 100;
      const pct = Math.min(100, Math.round((elapsed / totalMs) * 100));
      const downloadedUnits = sizeMB >= 1000
        ? `${((elapsed / totalMs) * (sizeMB / 1000)).toFixed(2)} GB / ${(sizeMB / 1000).toFixed(0)} GB`
        : `${Math.round((elapsed / totalMs) * sizeMB)} MB / ${sizeMB} MB`;
      if (fillBar) fillBar.style.width = `${pct}%`;
      if (progText) progText.textContent = pct < 100 ? `${downloadedUnits} (${pct}%)` : 'Installing...';
      if (progEta) progEta.textContent = `ETA: ${Math.max(0, ((totalMs - elapsed) / 1000)).toFixed(1)}s`;

      if (elapsed >= totalMs) {
        clearInterval(activeInterval); activeInterval = null;
        setTimeout(() => {
          if (targetVersion) window.os?.installVersion(appId, targetVersion);
          else window.os?.installApp(appId);
          window.animations?.showToast?.(`${appId} installed successfully!`);
          renderDetail(appId, backCallback);
        }, 400);
      }
    }, 100);
  }

  window.softstoreDetail = {
    show(container, appId, onBack) { selectedShotIdx = 0; currentContainer = container; renderDetail(appId, onBack); },
    unmount() { if (activeInterval) { clearInterval(activeInterval); activeInterval = null; } currentContainer = null; }
  };
})();
