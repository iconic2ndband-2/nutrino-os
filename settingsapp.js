/* FILE: settingsapp.js — OS settings for theme, wallpaper, brightness, apps, and device info */
(function() {
  let activeTab = 'general';

  function render(container) {
    const current = window.theme ? window.theme.getSettings() : { theme: 'dark', wallpaper: 'gradient-1', brightness: 100 };
    const wallpapers = window.CONSTANTS.WALLPAPERS;

    const wpCards = wallpapers.map(wp => `
      <div class="wallpaper-card ${current.wallpaper === wp.id ? 'active' : ''}" 
           data-wpid="${wp.id}" 
           style="background: ${wp.css};">
      </div>
    `).join('');

    container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 12px; height: 100%;">
        <div class="settings-tab-bar">
          <button class="settings-tab-btn ${activeTab === 'general' ? 'active' : ''}" data-tab="general">General</button>
          <button class="settings-tab-btn ${activeTab === 'apps' ? 'active' : ''}" data-tab="apps">Apps</button>
          <button class="settings-tab-btn ${activeTab === 'about' ? 'active' : ''}" data-tab="about">About Device</button>
        </div>

        <div id="settings-tab-content" style="flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 14px;">
          ${activeTab === 'general' ? `
            <div class="settings-group">
              <div class="settings-group-header">Display & Appearance</div>
              <div style="display: flex; align-items: center; justify-content: space-between; min-height: 44px;">
                <span>Dark Mode</span>
                <input type="checkbox" id="settings-dark-toggle" ${current.theme === 'dark' ? 'checked' : ''} style="width: 22px; height: 22px; cursor: pointer;">
              </div>
              <div style="margin-top: 14px;">
                <div style="display: flex; justify-content: space-between; font-size: 13px; color: var(--text-muted); margin-bottom: 6px;">
                  <span>Brightness</span>
                  <span id="settings-brightness-val">${current.brightness}%</span>
                </div>
                <input type="range" id="settings-brightness-slider" min="10" max="100" value="${current.brightness}" style="width: 100%; height: 28px; cursor: pointer;">
              </div>
            </div>

            <div class="settings-group">
              <div class="settings-group-header">Wallpaper</div>
              <div class="wallpaper-grid">
                ${wpCards}
              </div>
            </div>
          ` : activeTab === 'apps' ? `
            <div class="settings-group">
              <div class="settings-group-header">Installed Applications & Developers</div>
              <div style="display: flex; flex-direction: column; gap: 8px;">
                ${(window.CONSTANTS.APPS || []).map(a => {
                  const isInst = window.os?.isAppInstalled(a.id);
                  const dev = a.developer || 'Nutrino Core';
                  const ver = window.os?.getInstalledVersion ? window.os.getInstalledVersion(a.id) : (a.version || '1.0.0');
                  return `
                    <div style="display: flex; align-items: center; justify-content: space-between; padding: 8px 10px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px;">
                      <div style="display: flex; align-items: center; gap: 10px;">
                        <div style="width: 32px; height: 32px; border-radius: 8px; background: ${a.color}; display: flex; align-items: center; justify-content: center; font-size: 16px; color: #fff;">${a.icon}</div>
                        <div>
                          <div style="font-size: 13px; font-weight: 700;">${a.name}</div>
                          <div style="font-size: 11px; color: var(--text-muted);">Developer: <span style="color:var(--text-primary);font-weight:600;">${dev}</span> • v${ver}</div>
                        </div>
                      </div>
                      <span style="font-size: 10px; padding: 2px 6px; border-radius: 4px; background: ${isInst ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.06)'}; color: ${isInst ? '#34d399' : 'var(--text-muted)'}; font-weight: 600;">
                        ${isInst ? 'Installed' : 'Store'}
                      </span>
                    </div>`;
                }).join('')}
              </div>
            </div>
          ` : `<div id="about-device-mount">Loading Device Specs...</div>`}
        </div>
      </div>
    `;

    bindEvents(container);

    if (activeTab === 'about') {
      const mount = container.querySelector('#about-device-mount');
      if (mount && window.aboutDevice) {
        window.aboutDevice.render(mount);
      }
    }
  }

  function bindEvents(container) {
    container.querySelectorAll('.settings-tab-btn').forEach(btn => {
      btn.onclick = () => {
        activeTab = btn.dataset.tab;
        render(container);
      };
    });

    const darkToggle = container.querySelector('#settings-dark-toggle');
    if (darkToggle) {
      darkToggle.addEventListener('change', (e) => {
        window.os.setTheme(e.target.checked ? 'dark' : 'light');
      });
    }

    const brightnessSlider = container.querySelector('#settings-brightness-slider');
    const brightnessVal = container.querySelector('#settings-brightness-val');
    if (brightnessSlider) {
      brightnessSlider.addEventListener('input', (e) => {
        const val = Number(e.target.value);
        if (brightnessVal) brightnessVal.textContent = `${val}%`;
        window.os.setBrightness(val);
      });
    }

    const wpGrid = container.querySelector('.wallpaper-grid');
    if (wpGrid) {
      wpGrid.addEventListener('click', (e) => {
        const card = e.target.closest('.wallpaper-card');
        if (!card) return;
        window.os.setWallpaper(card.dataset.wpid);
        container.querySelectorAll('.wallpaper-card').forEach(c => c.classList.remove('active'));
        card.classList.add('active');
      });
    }
  }

  window.settingsApp = {
    mount(container) {
      render(container);
    },
    unmount() {}
  };
})();
