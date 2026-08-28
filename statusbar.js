/* FILE: statusbar.js — System status bar for time, battery, signal, and network speed */
(function() {
  let timerId = null;
  let batteryLevel = 88;

  function formatTime(date) {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  function getSignalSvg() {
    return `<svg width="15" height="11" viewBox="0 0 18 14" fill="currentColor">
      <rect x="1" y="10" width="2.5" height="4" rx="0.5"/>
      <rect x="5" y="7" width="2.5" height="7" rx="0.5"/>
      <rect x="9" y="4" width="2.5" height="10" rx="0.5"/>
      <rect x="13" y="1" width="2.5" height="13" rx="0.5"/>
    </svg>`;
  }

  window.statusbar = {
    mount(container) {
      if (!container) return;
      const speed = window.os.state.internetSpeed || 1;
      container.innerHTML = `
        <div id="status-time" class="status-time">00:00</div>
        <div class="status-network-speed" id="status-speed-badge" title="Simulated Broadband Speed">
          ⚡ ${speed} Mbps
        </div>
        <div style="display:flex; align-items:center; gap:8px;">
          <div class="status-signal" title="5G Cellular Signal">
            ${getSignalSvg()}
          </div>
          <div class="status-battery">
            <span id="status-battery-text">${batteryLevel}%</span>
            <div class="battery-icon">
              <div id="status-battery-fill" class="battery-fill" style="width: ${batteryLevel}%"></div>
            </div>
          </div>
        </div>
      `;

      function update() {
        const timeEl = document.getElementById('status-time');
        if (timeEl) timeEl.textContent = formatTime(new Date());
      }

      update();
      timerId = setInterval(update, 1000);

      if (navigator.getBattery) {
        navigator.getBattery().then(battery => {
          function setBat() {
            batteryLevel = Math.round(battery.level * 100);
            const textEl = document.getElementById('status-battery-text');
            const fillEl = document.getElementById('status-battery-fill');
            if (textEl) textEl.textContent = `${batteryLevel}%`;
            if (fillEl) fillEl.style.width = `${batteryLevel}%`;
          }
          setBat();
          battery.addEventListener('levelchange', setBat);
        }).catch(() => {});
      }
    },

    updateSpeed() {
      const speedBadge = document.getElementById('status-speed-badge');
      if (speedBadge && window.os) {
        const speed = window.os.state.internetSpeed || 1;
        speedBadge.textContent = `⚡ ${speed} Mbps`;
      }
    },

    unmount() {
      if (timerId) {
        clearInterval(timerId);
        timerId = null;
      }
    }
  };
})();
