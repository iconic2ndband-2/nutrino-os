/* FILE: whitegames.nos.js — Company website for WhiteGames (Gamesafe developer) */
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
          <div style="font-size:36px;margin-bottom:6px;">🛡️</div>
          <div style="font-size:18px;font-weight:800;color:#1a1a2e;letter-spacing:0.5px;">WHITE GAMES</div>
          <div style="font-size:13px;font-weight:600;color:#64748b;margin:6px 0 12px;font-style:italic;">"Your Progress, Protected"</div>
          <p style="font-size:12px;color:#475569;line-height:1.5;margin-bottom:16px;">
            WhiteGames develops military-grade cloud synchronization, anti-corruption vaults, and cross-title progress backup engines for Nutrino OS gamers and creators.
          </p>
          <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:12px;text-align:left;box-shadow:0 1px 3px rgba(0,0,0,0.05);">
            <div style="font-size:11px;font-weight:700;color:#0284c7;margin-bottom:4px;">🔒 ZERO DATA LOSS GUARANTEE</div>
            <div style="font-size:11px;color:#334155;line-height:1.4;">Automated snapshot backups, multi-account security keys, and instant restoration across factory wipes.</div>
          </div>
        </div>`;
    }
    if (activeTab === 'about') {
      return `
        <div style="padding:14px;display:flex;flex-direction:column;gap:10px;">
          <div style="font-size:14px;font-weight:700;color:#1a1a2e;">🛡️ About WhiteGames Studios</div>
          <div style="font-size:11px;color:#475569;line-height:1.5;">
            Established in 2026, WhiteGames builds trust between players and their digital achievements through unbreakable save data architectures.
          </div>
          <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:10px;">
            <div style="font-size:12px;font-weight:700;color:#1e293b;">🎯 Core Purpose</div>
            <div style="font-size:11px;color:#64748b;margin-top:2px;">Protect hundreds of hours of gameplay progress, high scores, and customizations from accidental loss.</div>
          </div>
          <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:10px;">
            <div style="font-size:12px;font-weight:700;color:#1e293b;">👥 Team Leaders</div>
            <div style="font-size:11px;color:#64748b;margin-top:2px;">Klaus Weber (Security Cryptographer), Maya Patel (Database Architect), Kenji Sato (SDK Lead).</div>
          </div>
        </div>`;
    }
    if (activeTab === 'products') {
      const isInst = window.os?.isAppInstalled('gamesafe');
      return `
        <div style="padding:14px;display:flex;flex-direction:column;gap:12px;">
          <div style="font-size:14px;font-weight:700;color:#1a1a2e;">📦 Featured Products</div>
          <div style="background:#ffffff;border:1px solid #cbd5e1;border-radius:10px;padding:12px;box-shadow:0 2px 4px rgba(0,0,0,0.04);">
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
              <div style="width:40px;height:40px;border-radius:10px;background:#38bdf8;display:flex;align-items:center;justify-content:center;font-size:20px;color:#fff;">🛡️</div>
              <div style="flex:1;">
                <div style="font-size:13px;font-weight:700;color:#0f172a;">Gamesafe</div>
                <div style="font-size:10px;color:#0284c7;">Developer: WhiteGames • Utilities • v1.0.0</div>
              </div>
            </div>
            <div style="font-size:11px;color:#475569;line-height:1.4;margin-bottom:10px;">
              Comprehensive progress locker and multi-app save sync hub. Saves your progress across Nitro Race, 3DPapers, and more.
            </div>
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <span style="font-size:11px;font-weight:700;color:#059669;">$1.99 ($0.99/mo)</span>
              <button id="wg-open-softstore-btn" class="btn-primary" style="background:#0284c7;color:#fff;font-weight:700;min-height:28px;padding:0 12px;font-size:11px;">
                ${isInst ? 'Open in SoftStore' : 'Get on SoftStore'}
              </button>
            </div>
          </div>
        </div>`;
    }
    if (activeTab === 'support') {
      return `
        <div style="padding:14px;display:flex;flex-direction:column;gap:10px;">
          <div style="font-size:14px;font-weight:700;color:#1a1a2e;">🛠️ Customer Support & FAQ</div>
          <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:10px;">
            <div style="font-size:11px;font-weight:700;color:#1e293b;">Q: Can I restore my saves after an OS wipe?</div>
            <div style="font-size:11px;color:#64748b;margin-top:3px;">A: Yes! Simply log back into your Gamesafe account to restore all title saves instantly.</div>
          </div>
          <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:10px;">
            <div style="font-size:11px;font-weight:700;color:#1e293b;">Q: Contact WhiteGames Support</div>
            <div style="font-size:11px;color:#0284c7;margin-top:3px;">support@whitegames.nos • 24/7 automated ticketing</div>
          </div>
        </div>`;
    }
    return `
      <div style="padding:14px;display:flex;flex-direction:column;gap:10px;">
        <div style="font-size:14px;font-weight:700;color:#1a1a2e;">📰 WhiteGames Security Bulletin</div>
        <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:10px;">
          <div style="font-size:12px;font-weight:700;color:#0f172a;">Gamesafe v1.0 Cloud Architecture Overview</div>
          <div style="font-size:10px;color:#0284c7;margin:2px 0 4px;">August 22, 2026 • Security Update</div>
          <div style="font-size:11px;color:#475569;line-height:1.4;">How our distributed snapshot storage safeguards player profiles against corruption.</div>
        </div>
        <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:10px;">
          <div style="font-size:12px;font-weight:700;color:#0f172a;">3DPapers Integration & Multi-Profile Support</div>
          <div style="font-size:10px;color:#0284c7;margin:2px 0 4px;">August 28, 2026 • Developer Notes</div>
          <div style="font-size:11px;color:#475569;line-height:1.4;">WhiteGames and CoolFrost partner to bring unified cloud credentials to 3D wallpapers.</div>
        </div>
      </div>`;
  }

  window.whitegamesNos = {
    getHtml() {
      return `
        <div style="background:#ffffff;color:#1e293b;min-height:100%;font-family:system-ui,-apple-system,sans-serif;">
          <header style="background:#f1f5f9;border-bottom:1px solid #cbd5e1;padding:10px 14px;display:flex;flex-direction:column;gap:8px;">
            <div style="display:flex;align-items:center;justify-content:space-between;">
              <div style="display:flex;align-items:center;gap:6px;"><span style="font-size:18px;">🛡️</span><span style="font-size:14px;font-weight:800;color:#1a1a2e;letter-spacing:1px;">WHITE GAMES</span></div>
              <span style="font-size:10px;background:#e2e8f0;color:#475569;padding:2px 6px;border-radius:4px;font-weight:600;">STUDIOS</span>
            </div>
            <nav style="display:flex;gap:4px;overflow-x:auto;">
              ${TABS.map(t => `<button class="wg-tab-btn" data-tab="${t.id}" style="background:${activeTab === t.id ? '#1a1a2e' : '#e2e8f0'};color:${activeTab === t.id ? '#ffffff' : '#475569'};border:none;border-radius:6px;padding:4px 10px;font-size:11px;font-weight:700;cursor:pointer;white-space:nowrap;">${t.label}</button>`).join('')}
            </nav>
          </header>
          <div id="wg-body">${renderContent()}</div>
        </div>`;
    },
    bindEvents(container, refresh) {
      if (!container) return;
      container.querySelectorAll('.wg-tab-btn').forEach(btn => {
        btn.onclick = () => {
          activeTab = btn.dataset.tab;
          window.os?.addDataUsage(0.3);
          if (refresh) refresh();
        };
      });
      const dlBtn = container.querySelector('#wg-open-softstore-btn');
      if (dlBtn) dlBtn.onclick = () => window.os?.launchApp('softstore');
    }
  };
})();
