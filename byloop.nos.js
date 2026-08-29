/* FILE: byloop.nos.js — Company website for Byloop (Wipe Fresh developer) */
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
          <div style="font-size:36px;margin-bottom:6px;">🔄</div>
          <div style="font-size:18px;font-weight:800;color:#00d4ff;letter-spacing:0.5px;">BYLOOP</div>
          <div style="font-size:13px;font-weight:600;color:#e2e8f0;margin:6px 0 12px;font-style:italic;">"Reset. Refresh. Rejuvenate."</div>
          <p style="font-size:12px;color:#94a3b8;line-height:1.5;margin-bottom:16px;">
            Byloop develops mission-critical system optimization, recovery utilities, and factory rejuvenation tools for Nutrino OS devices.
          </p>
          <div style="background:rgba(0,212,255,0.08);border:1px solid rgba(0,212,255,0.25);border-radius:10px;padding:12px;text-align:left;">
            <div style="font-size:11px;font-weight:700;color:#00d4ff;margin-bottom:4px;">✨ OUR PROMISE</div>
            <div style="font-size:11px;color:#cbd5e1;line-height:1.4;">Zero system bloat, verified safety routines, and instant factory restore execution.</div>
          </div>
        </div>`;
    }
    if (activeTab === 'about') {
      return `
        <div style="padding:14px;display:flex;flex-direction:column;gap:10px;">
          <div style="font-size:14px;font-weight:700;color:#00d4ff;">🏢 About Byloop Labs</div>
          <div style="font-size:11px;color:#cbd5e1;line-height:1.5;">
            Founded in 2026 by system kernel engineers, Byloop is dedicated to creating effortless system recovery tools for mobile and embedded operating systems.
          </div>
          <div style="background:rgba(26,58,92,0.4);border:1px solid rgba(0,212,255,0.2);border-radius:8px;padding:10px;">
            <div style="font-size:12px;font-weight:700;color:#fff;">🎯 Mission</div>
            <div style="font-size:11px;color:#94a3b8;margin-top:2px;">To keep every Nutrino device running as fast and pristine as the day it unboxed.</div>
          </div>
          <div style="background:rgba(26,58,92,0.4);border:1px solid rgba(0,212,255,0.2);border-radius:8px;padding:10px;">
            <div style="font-size:12px;font-weight:700;color:#fff;">👥 Core Team</div>
            <div style="font-size:11px;color:#94a3b8;margin-top:2px;">Alex Chen (Kernel Architect), Sarah Vance (Safety QA Lead), Ray Miller (UI/UX).</div>
          </div>
        </div>`;
    }
    if (activeTab === 'products') {
      const isInst = window.os?.isAppInstalled('wipefresh');
      return `
        <div style="padding:14px;display:flex;flex-direction:column;gap:12px;">
          <div style="font-size:14px;font-weight:700;color:#00d4ff;">📦 Featured Products</div>
          <div style="background:rgba(26,58,92,0.6);border:1px solid rgba(0,212,255,0.3);border-radius:10px;padding:12px;">
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
              <div style="width:40px;height:40px;border-radius:10px;background:#ef4444;display:flex;align-items:center;justify-content:center;font-size:20px;">🧹</div>
              <div style="flex:1;">
                <div style="font-size:13px;font-weight:700;color:#fff;">Wipe Fresh</div>
                <div style="font-size:10px;color:#00d4ff;">Developer: Byloop • System Utility • v1.0.0</div>
              </div>
            </div>
            <div style="font-size:11px;color:#cbd5e1;line-height:1.4;margin-bottom:10px;">
              The premier factory reset and system rejuvenator for Nutrino OS. Deep storage wiper with optional Gamesafe cloud backup retention.
            </div>
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <span style="font-size:11px;font-weight:700;color:#34d399;">Free (10 MB)</span>
              <button id="byloop-open-softstore-btn" class="btn-primary" style="background:#00d4ff;color:#0a1628;font-weight:700;min-height:28px;padding:0 12px;font-size:11px;">
                ${isInst ? 'Open in SoftStore' : 'Get on SoftStore'}
              </button>
            </div>
          </div>
        </div>`;
    }
    if (activeTab === 'support') {
      return `
        <div style="padding:14px;display:flex;flex-direction:column;gap:10px;">
          <div style="font-size:14px;font-weight:700;color:#00d4ff;">🛠️ Technical Support & FAQ</div>
          <div style="background:rgba(26,58,92,0.4);border:1px solid rgba(0,212,255,0.15);border-radius:8px;padding:10px;">
            <div style="font-size:11px;font-weight:700;color:#fff;">Q: Does Wipe Fresh delete my Gamesafe vault?</div>
            <div style="font-size:11px;color:#94a3b8;margin-top:3px;">A: You can choose to preserve Gamesafe data during the reset configuration screen.</div>
          </div>
          <div style="background:rgba(26,58,92,0.4);border:1px solid rgba(0,212,255,0.15);border-radius:8px;padding:10px;">
            <div style="font-size:11px;font-weight:700;color:#fff;">Q: Contact Byloop Support</div>
            <div style="font-size:11px;color:#00d4ff;margin-top:3px;">support@byloop.nos • Response time &lt; 2 hours</div>
          </div>
        </div>`;
    }
    return `
      <div style="padding:14px;display:flex;flex-direction:column;gap:10px;">
        <div style="font-size:14px;font-weight:700;color:#00d4ff;">📰 Byloop Engineering Blog</div>
        <div style="background:rgba(26,58,92,0.4);border:1px solid rgba(0,212,255,0.2);border-radius:8px;padding:10px;">
          <div style="font-size:12px;font-weight:700;color:#fff;">Wipe Fresh v1.0 Released for Nutrino OS</div>
          <div style="font-size:10px;color:#00d4ff;margin:2px 0 4px;">August 15, 2026 • Announcements</div>
          <div style="font-size:11px;color:#94a3b8;line-height:1.4;">Introducing our multi-stage clean wipe engine with animated reboot and diagnostic logs.</div>
        </div>
        <div style="background:rgba(26,58,92,0.4);border:1px solid rgba(0,212,255,0.2);border-radius:8px;padding:10px;">
          <div style="font-size:12px;font-weight:700;color:#fff;">Top 5 Reasons to Reset Your Device Storage</div>
          <div style="font-size:10px;color:#00d4ff;margin:2px 0 4px;">August 22, 2026 • Tips & Tricks</div>
          <div style="font-size:11px;color:#94a3b8;line-height:1.4;">Reclaim up to 100+ GB of cache fragmentation and restore factory-smooth 120Hz UI responsiveness.</div>
        </div>
      </div>`;
  }

  window.byloopNos = {
    getHtml() {
      return `
        <div style="background:#0a1628;color:#f8fafc;min-height:100%;font-family:system-ui,-apple-system,sans-serif;">
          <header style="background:#1a3a5c;border-bottom:1px solid rgba(0,212,255,0.3);padding:10px 14px;display:flex;flex-direction:column;gap:8px;">
            <div style="display:flex;align-items:center;justify-content:space-between;">
              <div style="display:flex;align-items:center;gap:6px;"><span style="font-size:18px;">🔄</span><span style="font-size:14px;font-weight:800;color:#00d4ff;letter-spacing:1px;">BYLOOP</span></div>
              <span style="font-size:10px;background:rgba(0,212,255,0.2);color:#00d4ff;padding:2px 6px;border-radius:4px;font-weight:600;">OFFICIAL DEVELOPER</span>
            </div>
            <nav style="display:flex;gap:4px;overflow-x:auto;">
              ${TABS.map(t => `<button class="byloop-tab-btn" data-tab="${t.id}" style="background:${activeTab === t.id ? '#00d4ff' : 'rgba(255,255,255,0.06)'};color:${activeTab === t.id ? '#0a1628' : '#cbd5e1'};border:none;border-radius:6px;padding:4px 10px;font-size:11px;font-weight:700;cursor:pointer;white-space:nowrap;">${t.label}</button>`).join('')}
            </nav>
          </header>
          <div id="byloop-body">${renderContent()}</div>
        </div>`;
    },
    bindEvents(container, refresh) {
      if (!container) return;
      container.querySelectorAll('.byloop-tab-btn').forEach(btn => {
        btn.onclick = () => {
          activeTab = btn.dataset.tab;
          window.os?.addDataUsage(0.3);
          if (refresh) refresh();
        };
      });
      const dlBtn = container.querySelector('#byloop-open-softstore-btn');
      if (dlBtn) dlBtn.onclick = () => window.os?.launchApp('softstore');
    }
  };
})();
