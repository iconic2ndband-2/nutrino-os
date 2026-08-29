/* FILE: softstore.js — SoftStore v2.0 Application Catalog, Library & Updates */
(function() {
  let currentContainer = null, activeTab = 'featured', selectedAppId = null;

  function renderUI() {
    if (!currentContainer) return;
    if (selectedAppId) {
      window.softstoreDetail?.show(currentContainer, selectedAppId, () => {
        selectedAppId = null; renderUI();
      });
      return;
    }

    const downloadableApps = (window.CONSTANTS.APPS || []).filter(a => a.isDownloadable && !a.hideFromStore);
    const installedApps = downloadableApps.filter(a => window.os?.isAppInstalled(a.id));
    const updates = window.os?.checkForUpdates ? window.os.checkForUpdates() : [];

    currentContainer.innerHTML = `
      <div class="store-root">
        <div class="store-header">
          <div class="store-brand">⚡ SOFTSTORE <span style="font-size:10px;color:var(--accent-color);font-weight:700;">v2.0</span></div>
          <div class="store-tabs">
            <button class="store-tab ${activeTab === 'featured' ? 'active' : ''}" data-tab="featured">Featured</button>
            <button class="store-tab ${activeTab === 'library' ? 'active' : ''}" data-tab="library">Library (${installedApps.length})</button>
            <button class="store-tab ${activeTab === 'updates' ? 'active' : ''}" data-tab="updates">
              Updates ${updates.length > 0 ? `<span class="store-tab-badge">${updates.length}</span>` : ''}
            </button>
          </div>
        </div>
        <div class="store-content">
          ${activeTab === 'featured' ? renderFeaturedList(downloadableApps) : (activeTab === 'library' ? renderLibraryList(installedApps) : window.softstoreUpdates?.render(updates))}
        </div>
      </div>`;
    bindEvents(updates);
  }

  function renderFeaturedList(apps) {
    const cards = apps.map(app => {
      const isInstalled = window.os?.isAppInstalled(app.id);
      const priceText = app.price === 0 ? 'Free' : `$${app.price.toFixed(2)}`;
      const sizeText = (app.sizeMB || 10) >= 1000 ? `${(app.sizeMB / 1000).toFixed(0)} GB` : `${app.sizeMB} MB`;
      return `
        <div class="store-app-card store-clickable-card" data-appid="${app.id}">
          <div class="store-app-icon" style="background:${app.color};width:46px;height:46px;border-radius:12px;">${app.icon}</div>
          <div class="store-app-meta" style="flex:1;">
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <span class="store-app-name">${app.name}</span>
              <span style="font-size:12px;font-weight:700;color:#34d399;">${priceText}</span>
            </div>
            <div class="store-app-specs">${sizeText} • ⭐ ${app.rating || '4.5'} • ${app.category || 'App'}</div>
            <div class="store-app-desc">${app.description || ''}</div>
          </div>
          <div style="align-self:center;margin-left:8px;">
            <button class="btn-primary" style="min-height:32px;padding:0 10px;font-size:11px;background:${isInstalled ? '#10b981' : '#6366f1'};">${isInstalled ? 'Installed' : 'View'}</button>
          </div>
        </div>`;
    }).join('');

    return `
      <div class="store-featured-banner">
        <div class="store-banner-tag">NEW RELEASE</div>
        <div class="store-banner-title">🏎️ Nitro Race 3D</div>
        <div class="store-banner-desc">Next-gen high-speed 3D racing simulator on Nutrino OS!</div>
      </div>
      <div style="font-size:13px;font-weight:700;margin:4px 0 8px;">Explore SoftStore Catalog</div>
      <div style="display:flex;flex-direction:column;gap:10px;">${cards}</div>`;
  }

  function renderLibraryList(installedApps) {
    if (installedApps.length === 0) {
      return `<div class="bank-empty-tx" style="margin-top:24px;">No downloaded apps yet. Check Featured!</div>`;
    }
    const items = installedApps.map(app => `
      <div class="store-lib-item" style="display:flex;justify-content:space-between;align-items:center;padding:10px;background:var(--card-bg);border:1px solid var(--border-color);border-radius:12px;margin-bottom:8px;">
        <div style="display:flex;align-items:center;gap:10px;">
          <div class="store-app-icon-sm" style="background:${app.color};width:38px;height:38px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:18px;">${app.icon}</div>
          <div>
            <div style="font-weight:600;font-size:13px;">${app.name}</div>
            <div style="font-size:11px;color:var(--text-muted);">${app.sizeMB >= 1000 ? (app.sizeMB / 1000) + ' GB' : app.sizeMB + ' MB'} • v${window.os?.getInstalledVersion?.(app.id) || app.version || '1.0.0'}</div>
          </div>
        </div>
        <div style="display:flex;gap:6px;">
          <button class="btn-primary store-lib-launch" data-launchid="${app.id}" style="min-height:32px;padding:0 10px;background:#10b981;font-size:11px;">Launch</button>
          <button class="btn-secondary store-lib-del" data-delid="${app.id}" style="min-height:32px;padding:0 8px;font-size:11px;color:#f87171;border-color:rgba(239,68,68,0.4);">Delete</button>
        </div>
      </div>`).join('');
    return `<div class="store-lib-list"><div class="store-section-title" style="font-size:12px;font-weight:700;color:var(--text-muted);text-transform:uppercase;margin-bottom:8px;">Installed Applications (${installedApps.length})</div>${items}</div>`;
  }

  function bindEvents(updates) {
    currentContainer.querySelectorAll('.store-tab').forEach(t => {
      t.onclick = () => { activeTab = t.dataset.tab; renderUI(); };
    });
    currentContainer.querySelectorAll('.store-clickable-card').forEach(card => {
      card.onclick = () => { selectedAppId = card.dataset.appid; renderUI(); };
    });
    currentContainer.querySelectorAll('.store-lib-launch').forEach(btn => {
      btn.onclick = () => window.os?.launchApp(btn.dataset.launchid);
    });
    currentContainer.querySelectorAll('.store-lib-del').forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const appId = btn.dataset.delid;
        const app = (window.CONSTANTS.APPS || []).find(a => a.id === appId);
        const name = app ? app.name : appId;
        const sizeMB = app ? app.sizeMB : 10;
        const sizeFormatted = sizeMB >= 1000 ? `${(sizeMB / 1000).toFixed(1)} GB` : `${sizeMB} MB`;

        const performUninstall = () => {
          window.os?.uninstallApp(appId);
          window.animations?.showToast?.(`Uninstalled "${name}" (Freed ${sizeFormatted})`);
          renderUI();
        };

        if (window.confirmModal) {
          window.confirmModal.show({
            title: `Uninstall ${name}?`, message: `Are you sure you want to delete ${name} from your device? This frees up ${sizeFormatted}.`,
            icon: '📦', confirmText: 'Uninstall', cancelText: 'Keep', isDestructive: true, onConfirm: performUninstall
          });
        } else { performUninstall(); }
      };
    });

    if (activeTab === 'updates') {
      window.softstoreUpdates?.bindEvents(currentContainer, () => renderUI());
    }
  }

  window.softstoreApp = {
    mount(container) { currentContainer = container; selectedAppId = null; renderUI(); },
    unmount() { window.softstoreDetail?.unmount?.(); currentContainer = null; }
  };
})();
