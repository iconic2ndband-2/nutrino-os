/* FILE: truespecsapp.js — Premium Pink Edition Hardware Monitor application */
(function() {
  let currentContainer = null;
  let activeTab = 'overview';
  let liveInterval = null;

  async function renderContent() {
    if (!currentContainer) return;
    const bodyEl = currentContainer.querySelector('#tsapp-body');
    if (!bodyEl) return;

    const specs = window.os?.getDeviceInfo?.() || {};
    const uptime = window.osData?.getFormattedUptime?.() || '0m 0s';
    const deviceAge = window.os?.getDeviceAge?.() || 42;
    const cpuPct = window.os?.getCPUUsage?.() || 30;
    const cores = window.osData?.getCoreUsages?.() || [];
    const cpuTemp = window.os?.getCPUTemp?.() || 48;
    const gpuPct = window.os?.getGPUUsage?.() || 22;
    const gpuTemp = window.os?.getGPUTemp?.() || 40;
    const ram = window.os?.getRAMUsage?.() || { used: 1.8, free: 2.2, total: 4.0, percentage: 45 };
    const storage = await (window.osData?.getStorageBreakdown?.() || Promise.resolve({ used: 8.5, total: 128, free: 119.5, system: 8.5, apps: 0, notes: 0, gallery: 0, systemPct: 6.6, appsPct: 0, notesPct: 0, galleryPct: 0 }));
    const brightness = window.os?.getBrightness?.() || 100;
    const bat = window.os?.getBatteryStatus?.() || { percentage: 85, charging: false, health: 'Good' };
    const batTemp = window.os?.getBatteryTemp?.() || 31;
    const planName = window.os?.state?.currentPlan || 'Free';
    const speed = window.os?.getEffectiveSpeed?.() || 1;
    const signal = window.os?.getSignalStrength?.() || 90;
    const wifiSignal = window.os?.getWiFiSignal?.() || 95;
    const installedApps = (window.os?.state?.installedApps || []).concat(['truespecs']);

    if (activeTab === 'overview') {
      bodyEl.innerHTML = window.truespecsSections.renderOverview(specs, uptime, deviceAge);
    } else if (activeTab === 'performance') {
      bodyEl.innerHTML = window.truespecsSections.renderPerformance(cpuPct, cores, cpuTemp, gpuPct, gpuTemp, ram);
    } else if (activeTab === 'storage') {
      bodyEl.innerHTML = window.truespecsSections.renderStorage(storage);
    } else if (activeTab === 'display') {
      bodyEl.innerHTML = window.truespecsSections.renderDisplayCamera(specs, brightness);
    } else if (activeTab === 'battery') {
      bodyEl.innerHTML = window.truespecsSections.renderBatteryNetwork(bat, batTemp, planName, speed, signal, wifiSignal);
    } else if (activeTab === 'software') {
      bodyEl.innerHTML = window.truespecsSections.renderSoftware(specs, uptime, installedApps);
    }
  }

  window.truespecsApp = {
    mount(container) {
      currentContainer = container;
      activeTab = 'overview';

      const tabs = [
        { id: 'overview', label: 'Overview' },
        { id: 'performance', label: '⚡ Performance' },
        { id: 'storage', label: '💾 Storage' },
        { id: 'display', label: '🖥️ Display' },
        { id: 'battery', label: '🔋 Battery' },
        { id: 'software', label: '💿 Software' }
      ];

      container.innerHTML = `
        <div class="tsapp-root">
          <div class="tsapp-header">
            <div class="tsapp-brand">
              <span class="tsapp-badge">TRUESPECS</span>
              <span class="tsapp-ver">v1.0.0 PINK EDITION</span>
            </div>
            <div class="tsapp-tabs-scroll">
              ${tabs.map(t => `<button class="tsapp-tab-btn ${activeTab === t.id ? 'active' : ''}" data-tab="${t.id}">${t.label}</button>`).join('')}
            </div>
          </div>
          <div class="tsapp-body" id="tsapp-body"></div>
        </div>`;

      container.querySelectorAll('.tsapp-tab-btn').forEach(btn => {
        btn.onclick = () => {
          activeTab = btn.dataset.tab;
          container.querySelectorAll('.tsapp-tab-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          renderContent();
        };
      });

      renderContent();

      // Real-time 1-second update loop
      if (liveInterval) clearInterval(liveInterval);
      liveInterval = setInterval(() => {
        renderContent();
      }, 1000);
    },

    unmount() {
      if (liveInterval) { clearInterval(liveInterval); liveInterval = null; }
      currentContainer = null;
    }
  };
})();
