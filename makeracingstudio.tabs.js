/* FILE: makeracingstudio.tabs.js — HTML generators for Tabs 1 through 6 on makeracingstudio.nos */
(function() {
  window.mrsTabs = {
    renderHome() {
      return `
        <div class="mrs-home">
          <div class="mrs-hero-card">
            <div class="mrs-badge-tag">FEATURED RACER</div>
            <h2 style="font-size:22px;font-weight:900;letter-spacing:-0.5px;color:#fff;">🏎️ Nitro Race 3D</h2>
            <p style="font-size:13px;color:var(--text-muted);margin:4px 0 12px 0;">Ultra-fast highway velocity, coins, obstacles, and pure arcade racing.</p>
            <div class="mrs-banner-canvas-wrap"><canvas id="mrs-home-banner-canvas" width="320" height="120"></canvas></div>
            <div style="display:flex;gap:10px;margin-top:12px;">
              <button id="mrs-dl-og-btn" class="btn-primary" style="background:#f43f5e;flex:1;">Download Nitro Race</button>
              <button id="mrs-view-se-home-btn" class="btn-secondary" style="flex:1;">Explore SE Edition ✨</button>
            </div>
          </div>
          <div class="mrs-section-title">📰 Studio News & Announcements</div>
          <div class="mrs-news-list">
            <div class="mrs-news-card">
              <div class="mrs-news-date">August 28, 2026</div>
              <div class="mrs-news-head">Nitro Race SE Announced!</div>
              <div class="mrs-news-body">The Special Edition brings 3 new hand-crafted maps, dynamic vehicle classes, and the next-gen runtime engine.</div>
            </div>
            <div class="mrs-news-card">
              <div class="mrs-news-date">August 24, 2026</div>
              <div class="mrs-news-head">Nitro Race Patch v1.0.2 Released</div>
              <div class="mrs-news-body">Performance improvements for lower tier hardware, improved canvas renderers, and Gamesafe cloud synchronization fixes.</div>
            </div>
          </div>
        </div>`;
    },

    renderGames() {
      return `
        <div class="mrs-games-view">
          <div class="mrs-section-title">🎮 Our Game Catalog</div>
          <div class="mrs-game-card">
            <div class="mrs-game-icon" style="background:#f43f5e;">🏎️</div>
            <div style="flex:1;">
              <div style="font-weight:700;font-size:14px;color:#fff;">Nitro Race (Original)</div>
              <div style="font-size:11px;color:var(--text-muted);">7.0 GB • $20.00 • Released</div>
              <p style="font-size:12px;margin-top:4px;">The highway classic with procedural obstacles and speed tiers.</p>
            </div>
            <button id="mrs-games-og-btn" class="btn-primary" style="font-size:11px;padding:0 12px;min-height:30px;">View in Store</button>
          </div>
          <div class="mrs-game-card" style="border-color:rgba(139,92,246,0.4);background:rgba(139,92,246,0.08);">
            <div class="mrs-game-icon" style="background:#8b5cf6;">⭐</div>
            <div style="flex:1;">
              <div style="font-weight:700;font-size:14px;color:#c084fc;">Nitro Race SE</div>
              <div style="font-size:11px;color:var(--text-muted);">9.61 GB • $100.00 • Special Edition</div>
              <p style="font-size:12px;margin-top:4px;">3 Maps (Desert, City, Snow), 2 unique cars, and silent pay runtime.</p>
            </div>
            <button id="mrs-games-se-btn" class="btn-primary" style="background:#8b5cf6;font-size:11px;padding:0 12px;min-height:30px;">View SE Tab</button>
          </div>
          <div class="mrs-game-card" style="opacity:0.6;border-style:dashed;">
            <div class="mrs-game-icon" style="background:#334155;">⏳</div>
            <div><div style="font-weight:700;font-size:13px;">More games coming soon...</div><div style="font-size:11px;color:var(--text-muted);">Project CyberDrift & RallyX currently in pre-production.</div></div>
          </div>
        </div>`;
    },

    renderAbout() {
      return `
        <div class="mrs-about-view">
          <div class="mrs-section-title">🏢 About Nutrino Games</div>
          <div class="mrs-card"><p style="font-size:13px;line-height:1.5;">Founded in 2025, Nutrino Games is dedicated to high-speed racing experiences, physics precision, and arcade thrills tailored for the Nutrino OS platform.</p><p style="font-size:11px;color:var(--text-muted);margin-top:8px;">📍 Location: <strong>Nutrino City, NOS-11</strong></p></div>
          <div class="mrs-section-title" style="margin-top:14px;">👥 Core Development Team</div>
          <div class="mrs-team-grid">
            <div class="mrs-team-card"><div class="mrs-avatar">👨‍💼</div><div class="name">Alex Vance</div><div class="role">Chief Executive Officer</div></div>
            <div class="mrs-team-card"><div class="mrs-avatar">👨‍💻</div><div class="name">Marcus Speed</div><div class="role">Lead Game Developer</div></div>
            <div class="mrs-team-card"><div class="mrs-avatar">👩‍🎨</div><div class="name">Elena Shift</div><div class="role">Principal 2D/3D Artist</div></div>
          </div>
        </div>`;
    },

    renderSupport() {
      return `
        <div class="mrs-support-view">
          <div class="mrs-section-title">❓ Frequently Asked Questions</div>
          <div class="mrs-faq-item"><div class="q">How to install games?</div><div class="a">Install OG Nitro Race directly via SoftStore. Special Edition games are downloaded directly via this studio portal.</div></div>
          <div class="mrs-faq-item"><div class="q">Why is my download slow?</div><div class="a">Check network.nos in the browser to upgrade your broadband ISP plan (e.g. Ultra 500 Mbps).</div></div>
          <div class="mrs-faq-item"><div class="q">What is Silent Pay?</div><div class="a">Nitro Race SE uses real-time runtime metering ($2.99/s) deducted from your SuperBank checking balance while playing.</div></div>
          <div class="mrs-section-title" style="margin-top:14px;">📬 Contact & Feedback Form</div>
          <form id="mrs-feedback-form" class="mrs-card" style="display:flex;flex-direction:column;gap:8px;">
            <input type="text" id="mrs-fb-name" class="bank-input" placeholder="Your Name" required>
            <input type="email" id="mrs-fb-email" class="bank-input" placeholder="Your Email (or @nos)" required>
            <textarea id="mrs-fb-msg" class="bank-input" rows="3" placeholder="Write feedback or bug reports..." required style="resize:none;"></textarea>
            <button type="submit" class="btn-primary" style="width:100%;">Submit Feedback</button>
            <div style="font-size:10px;color:var(--text-muted);text-align:center;">Direct: support@nutrinogames.nos</div>
          </form>
        </div>`;
    },

    renderCareers() {
      return `
        <div class="mrs-careers-view">
          <div class="mrs-section-title">💼 Open Positions at Nutrino Games</div>
          <div class="mrs-job-card">
            <div class="mrs-job-header"><span class="title">Game Developer (Canvas 2D/Physics)</span><span class="loc">Nutrino City</span></div>
            <p class="desc">Develop 60 FPS top-down gameplay mechanics, obstacle generators, and collision systems.</p>
            <button class="btn-secondary mrs-apply-btn" data-job="Game Developer">Apply Now</button>
          </div>
          <div class="mrs-job-card">
            <div class="mrs-job-header"><span class="title">2D Vehicle & Environment Artist</span><span class="loc">Remote (NOS)</span></div>
            <p class="desc">Create vehicles, desert tracks, neon metropolis horizons, and snowscapes.</p>
            <button class="btn-secondary mrs-apply-btn" data-job="2D Artist">Apply Now</button>
          </div>
          <div class="mrs-job-card">
            <div class="mrs-job-header"><span class="title">QA Tester & Speed Enthusiast</span><span class="loc">Nutrino City</span></div>
            <p class="desc">Test vehicle handling, frame stability, and silent billing metering.</p>
            <button class="btn-secondary mrs-apply-btn" data-job="QA Tester">Apply Now</button>
          </div>
        </div>`;
    },

    renderCommunity() {
      return `
        <div class="mrs-community-view">
          <div class="mrs-card" style="display:flex;justify-content:space-between;align-items:center;">
            <div><div style="font-weight:700;font-size:14px;">🏁 Racer Community Hub</div><div style="font-size:11px;color:var(--text-muted);">Share records, tips, and mod setups</div></div>
            <div class="mrs-stat-badge">🟢 1.2K members • 50 online</div>
          </div>
          <div class="mrs-section-title" style="margin-top:12px;">💬 Recent Forum Threads</div>
          <div class="mrs-forum-list">
            <div class="mrs-post-card"><div class="user">@User123 • 2 hours ago</div><div class="head">Nitro Race is awesome! Hit 1,450m on high speed!</div><div class="stats">💬 24 replies • ❤️ 89 likes</div></div>
            <div class="mrs-post-card"><div class="user">@RacerFan • 5 hours ago</div><div class="head">When is SE coming? Can't wait for the Desert map!</div><div class="stats">💬 41 replies • ❤️ 120 likes</div></div>
            <div class="mrs-post-card"><div class="user">@SpeedDemon • Yesterday</div><div class="head">Cobalt Surge acceleration is unmatched on neon tracks</div><div class="stats">💬 15 replies • ❤️ 56 likes</div></div>
          </div>
        </div>`;
    }
  };
})();
