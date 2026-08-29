/* FILE: coolfrost.nos.js — Company website for CoolFrost (3DPapers developer) */
(function() {
  let activeTab = 'home';
  const TABS = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'products', label: 'Products' },
    { id: 'support', label: 'Support' },
    { id: 'blog', label: 'Blog' }
  ];

  function renderContent() {
    if (activeTab === 'home') {
      return `
        <div style="padding:16px;text-align:center;">
          <div style="font-size:36px;margin-bottom:6px;">❄️</div>
          <div style="font-size:18px;font-weight:800;color:#a29bfe;letter-spacing:0.5px;">COOL FROST</div>
          <div style="font-size:13px;font-weight:600;color:#e2e8f0;margin:6px 0 12px;font-style:italic;">"Bring Your Screen to Life"</div>
          <p style="font-size:12px;color:#cbd5e1;line-height:1.5;margin-bottom:16px;">
            CoolFrost is the cutting-edge interactive graphics and spatial visual studio behind 3DPapers for Nutrino OS.
          </p>
          <div style="background:rgba(108,92,231,0.15);border:1px solid rgba(162,155,254,0.3);border-radius:10px;padding:12px;text-align:left;">
            <div style="font-size:11px;font-weight:700;color:#a29bfe;margin-bottom:4px;">✨ REAL-TIME RENDERING</div>
            <div style="font-size:11px;color:#e2e8f0;line-height:1.4;">Custom WebGL shaders, zero battery drain background pausing, and dynamic physics simulations.</div>
          </div>
        </div>`;
    }
    if (activeTab === 'about') {
      return `
        <div style="padding:14px;display:flex;flex-direction:column;gap:10px;">
          <div style="font-size:14px;font-weight:700;color:#a29bfe;">🌌 About CoolFrost Studio</div>
          <div style="font-size:11px;color:#cbd5e1;line-height:1.5;">
            Founded in 2026 by digital artists and graphics engineers, CoolFrost reimagines mobile personalization through photorealistic real-time 3D environments.
          </div>
          <div style="background:rgba(26,26,62,0.6);border:1px solid rgba(108,92,231,0.3);border-radius:8px;padding:10px;">
            <div style="font-size:12px;font-weight:700;color:#fff;">🎨 Vision</div>
            <div style="font-size:11px;color:#cbd5e1;margin-top:2px;">Transform static smartphone displays into breathing, living portals of art and technology.</div>
          </div>
          <div style="background:rgba(26,26,62,0.6);border:1px solid rgba(108,92,231,0.3);border-radius:8px;padding:10px;">
            <div style="font-size:12px;font-weight:700;color:#fff;">👥 Core Team</div>
            <div style="font-size:11px;color:#cbd5e1;margin-top:2px;">Elena Rostova (Lead Graphics Programmer), Marcus Vega (Technical Artist), Liam Thorne (Shader Engineer).</div>
          </div>
        </div>`;
    }
    if (activeTab === 'products') {
      const isInst = window.os?.isAppInstalled('3dpapers');
      return `
        <div style="padding:14px;display:flex;flex-direction:column;gap:12px;">
          <div style="font-size:14px;font-weight:700;color:#a29bfe;">📦 Featured Products</div>
          <div style="background:rgba(26,26,62,0.8);border:1px solid rgba(108,92,231,0.4);border-radius:10px;padding:12px;">
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
              <div style="width:40px;height:40px;border-radius:10px;background:#8b5cf6;display:flex;align-items:center;justify-content:center;font-size:20px;">🌌</div>
              <div style="flex:1;">
                <div style="font-size:13px;font-weight:700;color:#fff;">3DPapers</div>
                <div style="font-size:10px;color:#a29bfe;">Developer: CoolFrost • Personalization • v2.0.0</div>
              </div>
            </div>
            <div style="font-size:11px;color:#cbd5e1;line-height:1.4;margin-bottom:10px;">
              Live 3D WebGL wallpaper suite featuring multi-screen wallpaper assignment (Home & Lock screen), silent billing, and 5 interactive worlds.
            </div>
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <span style="font-size:11px;font-weight:700;color:#34d399;">Free Engine (2.7 GB)</span>
              <button id="cf-open-softstore-btn" class="btn-primary" style="background:#6c5ce7;color:#fff;font-weight:700;min-height:28px;padding:0 12px;font-size:11px;">
                ${isInst ? 'Open in SoftStore' : 'Get on SoftStore'}
              </button>
            </div>
          </div>
        </div>`;
    }
    if (activeTab === 'support') {
      return `
        <div style="padding:14px;display:flex;flex-direction:column;gap:10px;">
          <div style="font-size:14px;font-weight:700;color:#a29bfe;">🛠️ Support & FAQ</div>
          <div style="background:rgba(26,26,62,0.5);border:1px solid rgba(108,92,231,0.25);border-radius:8px;padding:10px;">
            <div style="font-size:11px;font-weight:700;color:#fff;">Q: How does 3DPapers prevent battery drain?</div>
            <div style="font-size:11px;color:#cbd5e1;margin-top:3px;">A: Our engine pauses the WebGL rendering loop whenever you launch an app or turn off the screen.</div>
          </div>
          <div style="background:rgba(26,26,62,0.5);border:1px solid rgba(108,92,231,0.25);border-radius:8px;padding:10px;">
            <div style="font-size:11px;font-weight:700;color:#fff;">Q: Contact CoolFrost Support</div>
            <div style="font-size:11px;color:#a29bfe;margin-top:3px;">support@coolfrost.nos • Direct community support</div>
          </div>
        </div>`;
    }
    return `
      <div style="padding:14px;display:flex;flex-direction:column;gap:10px;">
        <div style="font-size:14px;font-weight:700;color:#a29bfe;">📰 CoolFrost Devlog & News</div>
        <div style="background:rgba(26,26,62,0.6);border:1px solid rgba(108,92,231,0.3);border-radius:8px;padding:10px;">
          <div style="font-size:12px;font-weight:700;color:#fff;">3DPapers v2.0 Released: Multi-Screen Wallpapers</div>
          <div style="font-size:10px;color:#a29bfe;margin:2px 0 4px;">August 29, 2026 • Major Release</div>
          <div style="font-size:11px;color:#cbd5e1;line-height:1.4;">Now supporting individual 3D live wallpapers for your Home Screen and Lock Screen with automatic background pausing.</div>
        </div>
        <div style="background:rgba(26,26,62,0.6);border:1px solid rgba(108,92,231,0.3);border-radius:8px;padding:10px;">
          <div style="font-size:12px;font-weight:700;color:#fff;">Optimizing Shaders for the 2T-PEX GPU</div>
          <div style="font-size:10px;color:#a29bfe;margin:2px 0 4px;">August 28, 2026 • Deep Dive</div>
          <div style="font-size:11px;color:#cbd5e1;line-height:1.4;">How we achieve locked 60 FPS particle simulations with sub-1% CPU overhead on Nutrino N1 hardware.</div>
        </div>
      </div>`;
  }

  window.coolfrostNos = {
    getHtml() {
      return `
        <div style="background:#0a0a1a;color:#f8fafc;min-height:100%;font-family:system-ui,-apple-system,sans-serif;">
          <header style="background:#1a1a3e;border-bottom:1px solid rgba(108,92,231,0.4);padding:10px 14px;display:flex;flex-direction:column;gap:8px;">
            <div style="display:flex;align-items:center;justify-content:space-between;">
              <div style="display:flex;align-items:center;gap:6px;"><span style="font-size:18px;">❄️</span><span style="font-size:14px;font-weight:800;color:#a29bfe;letter-spacing:1px;">COOL FROST</span></div>
              <span style="font-size:10px;background:rgba(108,92,231,0.3);color:#c4b5fd;padding:2px 6px;border-radius:4px;font-weight:600;">STUDIO</span>
            </div>
            <nav style="display:flex;gap:4px;overflow-x:auto;">
              ${TABS.map(t => `<button class="cf-tab-btn" data-tab="${t.id}" style="background:${activeTab === t.id ? '#6c5ce7' : 'rgba(255,255,255,0.06)'};color:${activeTab === t.id ? '#fff' : '#cbd5e1'};border:none;border-radius:6px;padding:4px 10px;font-size:11px;font-weight:700;cursor:pointer;white-space:nowrap;">${t.label}</button>`).join('')}
            </nav>
          </header>
          <div id="cf-body">${renderContent()}</div>
        </div>`;
    },
    bindEvents(container, refresh) {
      if (!container) return;
      container.querySelectorAll('.cf-tab-btn').forEach(btn => {
        btn.onclick = () => {
          activeTab = btn.dataset.tab;
          window.os?.addDataUsage(0.3);
          if (refresh) refresh();
        };
      });
      const dlBtn = container.querySelector('#cf-open-softstore-btn');
      if (dlBtn) dlBtn.onclick = () => window.os?.launchApp('softstore');
    }
  };
})();
