/* FILE: truespecs.tabs.js — Tab content definitions for truespecs.nos website */
(function() {
  window.truespecsTabs = {
    renderHome() {
      return `
        <div class="ts-tab-content">
          <div class="ts-hero-card">
            <div class="ts-hero-tag">Official Portal</div>
            <h3 class="ts-hero-title">Welcome to Truespecs — Your Device Specs Companion</h3>
            <p class="ts-hero-desc">Discover everything under your screen. Monitor real-time 10-Core CPU thermals, GPU compute pipelines, LPDDR4 memory saturation, and granular UFS storage partitions with microsecond precision.</p>
          </div>
          <div class="ts-section-title">Latest Headlines & Firmware News</div>
          <div class="ts-card">
            <div class="ts-card-date">August 28, 2026</div>
            <div class="ts-card-head">Truespecs v1.0.0 Pink Edition Released</div>
            <div class="ts-card-body">We are thrilled to unveil the signature Pink Edition for Nutrino OS v1.1.2.2 featuring live rotating 2D canvas telemetry.</div>
          </div>
          <div class="ts-card">
            <div class="ts-card-date">August 26, 2026</div>
            <div class="ts-card-head">2T-PEX GPU Architecture Deep Dive</div>
            <div class="ts-card-body">How 4 cores at 600MHz deliver blazing frame rates while keeping thermal dissipation under 55°C.</div>
          </div>
        </div>`;
    },

    renderAbout() {
      return `
        <div class="ts-tab-content">
          <div class="ts-card">
            <div class="ts-card-head">About Truespecs Technologies</div>
            <div class="ts-card-body">Founded with a singular mission: to provide power users, engineers, and enthusiasts with uncompromising transparency into mobile hardware performance.</div>
          </div>
          <div class="ts-card">
            <div class="ts-card-head">Our Mission</div>
            <div class="ts-card-body">Empower every user to understand their hardware limits, thermal thresholds, and memory allocations through intuitive, high-refresh diagnostics.</div>
          </div>
          <div class="ts-card">
            <div class="ts-card-head">Our Vision</div>
            <div class="ts-card-body">Build the world's most responsive, aesthetically pleasing telemetry suite for next-generation mobile silicon.</div>
          </div>
        </div>`;
    },

    renderFeatures() {
      return `
        <div class="ts-tab-content">
          <div class="ts-feat-grid">
            <div class="ts-feat-card"><div class="icon">⚡</div><div class="title">10-Core CPU Monitor</div><div class="desc">Per-core load tracking & real-time thermal sensors (40-70°C).</div></div>
            <div class="ts-feat-card"><div class="icon">🎮</div><div class="title">2T-PEX GPU Telemetry</div><div class="desc">4-Core clock monitoring & dynamic render load inspection.</div></div>
            <div class="ts-feat-card"><div class="icon">🧠</div><div class="title">4GB LPDDR4 Metrics</div><div class="desc">Active memory pressure, cache allocations, and free headroom.</div></div>
            <div class="ts-feat-card"><div class="icon">💾</div><div class="title">Storage Partitioning</div><div class="desc">Real-time breakdown of apps, notes database, and media.</div></div>
            <div class="ts-feat-card"><div class="icon">🔋</div><div class="title">Battery & Thermals</div><div class="desc">Live discharge telemetry, cell health, and 5G network speeds.</div></div>
            <div class="ts-feat-card"><div class="icon">🎨</div><div class="title">Signature Pink UI</div><div class="desc">Exquisite hot-pink visuals with live rotating 2D canvas icon.</div></div>
          </div>
        </div>`;
    },

    renderSupport() {
      return `
        <div class="ts-tab-content">
          <div class="ts-card">
            <div class="ts-card-head">Frequently Asked Questions</div>
            <div class="ts-faq-q">Q: How accurate are the thermal sensors?</div>
            <div class="ts-faq-a">A: Truespecs polls the internal NOS thermal bus at 1Hz, providing millidegree precision across all 10 cores.</div>
            <div class="ts-faq-q">Q: Does background telemetry drain battery?</div>
            <div class="ts-faq-a">A: No. When minimized or backgrounded, Truespecs goes into ultralow power sleep mode.</div>
          </div>
          <div class="ts-card">
            <div class="ts-card-head">Contact Support & Engineering</div>
            <div class="ts-card-body">Email: support@truespecs.nos<br>Portal: community.truespecs.nos<br>Hours: 24/7 Sandbox Support</div>
          </div>
        </div>`;
    },

    renderBlog() {
      return `
        <div class="ts-tab-content">
          <div class="ts-card">
            <div class="ts-card-date">August 27, 2026 • By Chief Architect</div>
            <div class="ts-card-head">Benchmarking the 10-Core Nutrino Processor</div>
            <div class="ts-card-body">We ran synthetic stress tests across all 10 cores ranging from 600MHz to 1.3GHz. Here is how dynamic thermal scaling performs under load.</div>
          </div>
          <div class="ts-card">
            <div class="ts-card-date">August 24, 2026 • Engineering Blog</div>
            <div class="ts-card-head">Optimizing LPDDR4 Bandwidth for 120Hz Displays</div>
            <div class="ts-card-body">A technical breakdown of how the 2400x1080 AMOLED panel synchronizes with 4GB RAM without frame stutter.</div>
          </div>
        </div>`;
    }
  };
})();
