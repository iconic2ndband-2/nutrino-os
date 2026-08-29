/* FILE: makeracingstudio.se.info.js — What's New changelog & feature breakdown for Nitro Race SE */
(function() {
  const WHATS_NEW_ITEMS = [
    {
      icon: '🗺️',
      title: '3 Dynamic Biome Tracks',
      badge: 'NEW MAPS',
      desc: 'Race across Desert Highway (heat haze), Neon Metropolis (rain-slicked glow), and Frozen Tundra (low-grip ice).'
    },
    {
      icon: '🏎️',
      title: '2 Exclusive Vehicle Classes',
      badge: 'NEW CARS',
      desc: 'Take the wheel of the high-velocity Vulcan GT (Top Speed) or the twin-motor Cobalt Surge (Instant Torque).'
    },
    {
      icon: '⚡',
      title: '60 FPS 2D Canvas Physics',
      badge: 'ENGINE UPGRADE',
      desc: 'Precision collision boundaries, smooth lane steering, particle trails, and responsive mobile-first touch controls.'
    },
    {
      icon: '🛡️',
      title: 'Gamesafe Cloud Backup',
      badge: 'CLOUD SYNC',
      desc: 'Automated telemetry synchronization for high scores, best distances, and unlock milestones.'
    },
    {
      icon: '💳',
      title: 'Silent Pay Micro-Billing',
      badge: 'SUPERBANK',
      desc: 'Seamless in-session $2.99/sec runtime billing automatically linked to your SuperBank checking account.'
    }
  ];

  window.mrsSeInfo = {
    renderWhatsNew() {
      return `
        <div class="mrs-whats-new-wrap" style="margin:12px 0;">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
            <div style="font-size:12px;font-weight:800;color:#c084fc;letter-spacing:0.5px;">✨ WHAT'S NEW IN SPECIAL EDITION</div>
            <span style="font-size:9px;background:rgba(139,92,246,0.2);color:#c084fc;padding:2px 6px;border-radius:6px;border:1px solid rgba(139,92,246,0.3);font-weight:700;">v1.0.0 EXPANSION</span>
          </div>
          <div style="display:flex;flex-direction:column;gap:8px;">
            ${WHATS_NEW_ITEMS.map(item => `
              <div class="mrs-wn-card" style="background:rgba(24,24,27,0.85);border:1px solid rgba(139,92,246,0.25);border-radius:10px;padding:9px 10px;display:flex;gap:10px;align-items:flex-start;">
                <div style="font-size:20px;line-height:1;margin-top:2px;">${item.icon}</div>
                <div style="flex:1;">
                  <div style="display:flex;align-items:center;justify-content:space-between;gap:6px;">
                    <div style="font-size:12px;font-weight:700;color:#fff;">${item.title}</div>
                    <span style="font-size:8px;font-weight:800;background:#8b5cf6;color:#fff;padding:1px 5px;border-radius:4px;">${item.badge}</span>
                  </div>
                  <div style="font-size:11px;color:var(--text-muted);margin-top:3px;line-height:1.4;">${item.desc}</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>`;
    },

    renderComparison() {
      return `
        <div class="mrs-comp-card" style="background:#18181b;border:1px solid var(--border-color);border-radius:10px;padding:10px;margin-bottom:12px;">
          <div style="font-size:11px;font-weight:700;color:#94a3b8;margin-bottom:6px;">📊 Base Edition vs Special Edition</div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;font-size:11px;">
            <div style="background:rgba(255,255,255,0.03);padding:6px;border-radius:6px;border-left:2px solid #f43f5e;">
              <div style="font-weight:700;color:#f43f5e;font-size:10px;">NITRO RACE (BASE)</div>
              <div style="color:var(--text-muted);margin-top:2px;">• 1 Highway Track<br>• Standard Vehicle<br>• 3D Tunnel Cam</div>
            </div>
            <div style="background:rgba(139,92,246,0.1);padding:6px;border-radius:6px;border-left:2px solid #8b5cf6;">
              <div style="font-weight:700;color:#c084fc;font-size:10px;">NITRO RACE SE</div>
              <div style="color:#e2e8f0;margin-top:2px;">• 3 Custom Biomes<br>• 2 Hypercar Classes<br>• Silent Pay Metering</div>
            </div>
          </div>
        </div>`;
    }
  };
})();
