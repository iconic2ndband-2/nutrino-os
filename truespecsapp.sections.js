/* FILE: truespecsapp.sections.js — Section markup renderers for Truespecs Premium Pink Edition */
(function() {
  window.truespecsSections = {
    renderOverview(specs, uptime, deviceAge) {
      return `
        <div class="tsapp-group">
          <div class="tsapp-group-header">📱 System Overview</div>
          <div class="tsapp-row"><span class="lbl">Device Name</span><span class="val font-bold">${specs.deviceName}</span></div>
          <div class="tsapp-row"><span class="lbl">Model</span><span class="val">${specs.model}</span></div>
          <div class="tsapp-row"><span class="lbl">OS Version</span><span class="val text-pink font-bold">${specs.osVersion}</span></div>
          <div class="tsapp-row"><span class="lbl">Build Number</span><span class="val font-mono">${specs.buildNumber}</span></div>
          <div class="tsapp-row"><span class="lbl">Serial Number</span><span class="val font-mono">${specs.serialNumber}</span></div>
          <div class="tsapp-row"><span class="lbl">IMEI</span><span class="val font-mono">${specs.imei}</span></div>
          <div class="tsapp-row"><span class="lbl">Boot Time / Uptime</span><span class="val">${uptime}</span></div>
          <div class="tsapp-row"><span class="lbl">Device Age</span><span class="val">${deviceAge} days</span></div>
        </div>`;
    },

    renderPerformance(cpuPct, cores, cpuTemp, gpuPct, gpuTemp, ram) {
      return `
        <div class="tsapp-group">
          <div class="tsapp-group-header">⚡ CPU: 10-Core (600MHz - 1.3GHz)</div>
          <div class="tsapp-gauge-row">
            <div><span class="tsapp-val-lg">${cpuPct}%</span><span class="tsapp-sub-lbl">Overall Load</span></div>
            <div class="tsapp-temp-pill">🌡️ ${cpuTemp}°C</div>
          </div>
          <div class="tsapp-bar-track"><div class="tsapp-bar-fill" style="width:${cpuPct}%;"></div></div>
          
          <div class="tsapp-core-grid">
            ${cores.map(c => `
              <div class="tsapp-core-item">
                <div class="c-head"><span>C${c.core}</span><span>${c.usage}%</span></div>
                <div class="c-track"><div class="c-fill" style="width:${c.usage}%;"></div></div>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="tsapp-group">
          <div class="tsapp-group-header">🎮 GPU: 2T-PEX (4-Core, 600MHz)</div>
          <div class="tsapp-gauge-row">
            <div><span class="tsapp-val-lg">${gpuPct}%</span><span class="tsapp-sub-lbl">Render Pipeline</span></div>
            <div class="tsapp-temp-pill">🌡️ ${gpuTemp}°C</div>
          </div>
          <div class="tsapp-bar-track"><div class="tsapp-bar-fill" style="width:${gpuPct}%;"></div></div>
        </div>

        <div class="tsapp-group">
          <div class="tsapp-group-header">🧠 RAM: 4GB LPDDR4</div>
          <div class="tsapp-gauge-row">
            <div><span class="tsapp-val-lg">${ram.used} GB</span><span class="tsapp-sub-lbl">Used of ${ram.total} GB (${ram.percentage}%)</span></div>
            <div class="tsapp-temp-pill" style="color:#FFD1DC;">${ram.free} GB Free</div>
          </div>
          <div class="tsapp-bar-track"><div class="tsapp-bar-fill" style="width:${ram.percentage}%;"></div></div>
        </div>`;
    },

    renderStorage(storage) {
      return `
        <div class="tsapp-group">
          <div class="tsapp-group-header">💾 Storage: 128GB UFS 2.1</div>
          <div class="tsapp-gauge-row">
            <div><span class="tsapp-val-lg">${storage.used} GB</span><span class="tsapp-sub-lbl">Used of ${storage.total} GB</span></div>
            <div class="tsapp-temp-pill" style="color:#FFD1DC;">${storage.free} GB Free</div>
          </div>
          <div class="tsapp-bar-track"><div class="tsapp-bar-fill" style="width:${Math.max(3, (storage.used / storage.total) * 100)}%;"></div></div>

          <div class="tsapp-breakdown-list">
            <div class="tsapp-breakdown-item"><span>⚙️ System</span><span>${storage.system} GB (${storage.systemPct}%)</span></div>
            <div class="tsapp-breakdown-item"><span>📦 Downloaded Apps</span><span>${storage.apps} GB (${storage.appsPct}%)</span></div>
            <div class="tsapp-breakdown-item"><span>🖼️ Gallery Media</span><span>${storage.gallery} GB (${storage.galleryPct}%)</span></div>
            <div class="tsapp-breakdown-item"><span>📝 Notes Database</span><span>${storage.notes} GB (${storage.notesPct}%)</span></div>
          </div>
        </div>`;
    },

    renderDisplayCamera(specs, brightness) {
      return `
        <div class="tsapp-group">
          <div class="tsapp-group-header">🖥️ Display Panel</div>
          <div class="tsapp-row"><span class="lbl">Screen Spec</span><span class="val font-bold">6.7" AMOLED, 2400×1080</span></div>
          <div class="tsapp-row"><span class="lbl">Refresh Rate</span><span class="val text-pink font-bold">120Hz Ultra Smooth</span></div>
          <div class="tsapp-row"><span class="lbl">Brightness Level</span><span class="val">${brightness}%</span></div>
          <div class="tsapp-bar-track"><div class="tsapp-bar-fill" style="width:${brightness}%;"></div></div>
        </div>

        <div class="tsapp-group">
          <div class="tsapp-group-header">📷 Camera & Optics</div>
          <div class="tsapp-row"><span class="lbl">Rear Sensors</span><span class="val font-bold">64MP + 12MP + 5MP</span></div>
          <div class="tsapp-row"><span class="lbl">Front Sensor</span><span class="val">32MP Wide Selfie</span></div>
          <div class="tsapp-row"><span class="lbl">Flash Unit</span><span class="val">Dual LED Tone</span></div>
        </div>`;
    },

    renderBatteryNetwork(bat, batTemp, planName, speed, signal, wifiSignal) {
      return `
        <div class="tsapp-group">
          <div class="tsapp-group-header">🔋 Battery (4500mAh)</div>
          <div class="tsapp-gauge-row">
            <div><span class="tsapp-val-lg">${bat.percentage}%</span><span class="tsapp-sub-lbl">${bat.charging ? 'Charging' : 'Discharging'} • Health: ${bat.health}</span></div>
            <div class="tsapp-temp-pill">🌡️ ${batTemp}°C</div>
          </div>
          <div class="tsapp-bar-track"><div class="tsapp-bar-fill" style="width:${bat.percentage}%;"></div></div>
        </div>

        <div class="tsapp-group">
          <div class="tsapp-group-header">📶 Network & Wireless</div>
          <div class="tsapp-row"><span class="lbl">Cellular Modem</span><span class="val font-bold text-pink">5G Capable</span></div>
          <div class="tsapp-row"><span class="lbl">Active ISP Tier</span><span class="val">${planName} (${speed} Mbps)</span></div>
          <div class="tsapp-row"><span class="lbl">5G Signal Strength</span><span class="val">${signal}%</span></div>
          <div class="tsapp-row"><span class="lbl">Wi-Fi (802.11 ax)</span><span class="val">Connected (${wifiSignal}%)</span></div>
          <div class="tsapp-row"><span class="lbl">Bluetooth 5.2</span><span class="val">Active • 2 Paired</span></div>
        </div>`;
    },

    renderSoftware(specs, uptime, installedApps) {
      return `
        <div class="tsapp-group">
          <div class="tsapp-group-header">💿 Software & Kernel</div>
          <div class="tsapp-row"><span class="lbl">OS Version</span><span class="val font-bold text-pink">${specs.osVersion}</span></div>
          <div class="tsapp-row"><span class="lbl">Security Patch</span><span class="val">August 1, 2026</span></div>
          <div class="tsapp-row"><span class="lbl">Kernel Version</span><span class="val font-mono">6.1.0-nutrino+</span></div>
          <div class="tsapp-row"><span class="lbl">Build Date</span><span class="val">August 27, 2026</span></div>
          <div class="tsapp-row"><span class="lbl">System Uptime</span><span class="val">${uptime}</span></div>
          <div class="tsapp-row"><span class="lbl">Truespecs App</span><span class="val text-pink font-bold">v1.0.0 (Pink Edition)</span></div>
          <div class="tsapp-installed-list">
            <div style="font-weight:700;color:#FFFFFF;margin-bottom:6px;">Installed Apps (${installedApps.length}):</div>
            ${installedApps.map(a => `<span class="tsapp-app-chip">• ${a}</span>`).join(' ')}
          </div>
        </div>`;
    }
  };
})();
