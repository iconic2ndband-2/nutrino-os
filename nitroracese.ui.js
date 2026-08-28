/* FILE: nitroracese.ui.js — UI Overlay and Menu Screen renderer for Nitro Race SE */
(function() {
  window.nrSeUI = {
    render(body, state, actions) {
      if (!body) return;
      const { currentScreen, selectedMap, selectedCar, controls, score } = state;

      if (currentScreen === 'menu') {
        body.innerHTML = `
          <div class="nr-se-menu-card">
            <div class="mrs-badge-tag" style="background:#8b5cf6;margin-bottom:6px;">SPECIAL EDITION</div>
            <h1 style="font-size:24px;font-weight:900;color:#fff;margin-bottom:12px;">NITRO RACE SE</h1>
            <div style="display:flex;flex-direction:column;gap:8px;width:100%;max-width:240px;">
              <button id="nr-se-play-btn" class="btn-primary" style="background:#8b5cf6;">Play Race</button>
              <button id="nr-se-settings-btn" class="btn-secondary">Settings</button>
              <button id="nr-se-credits-btn" class="btn-secondary">Credits</button>
            </div>
          </div>`;
        body.querySelector('#nr-se-play-btn').onclick = () => actions.setScreen('map_select');
        body.querySelector('#nr-se-settings-btn').onclick = () => actions.setScreen('settings');
        body.querySelector('#nr-se-credits-btn').onclick = () => actions.setScreen('credits');
      } else if (currentScreen === 'map_select') {
        const maps = window.CONSTANTS.SE_MAPS;
        body.innerHTML = `
          <div class="nr-se-modal-screen">
            <h3 style="font-size:18px;font-weight:800;margin-bottom:10px;">Select Track</h3>
            <div style="display:flex;flex-direction:column;gap:8px;width:100%;margin-bottom:14px;">
              ${maps.map(m => `
                <div class="nr-se-opt-card ${selectedMap === m.id ? 'active' : ''}" data-map="${m.id}" style="border-left:4px solid ${m.border};">
                  <div style="font-weight:700;">${m.name}</div><div style="font-size:11px;color:var(--text-muted);">${m.desc}</div>
                </div>`).join('')}
            </div>
            <div style="display:flex;gap:8px;width:100%;">
              <button id="nr-map-back" class="btn-secondary" style="flex:1;">Back</button>
              <button id="nr-map-next" class="btn-primary" style="flex:1;background:#8b5cf6;">Next: Car</button>
            </div>
          </div>`;
        body.querySelectorAll('.nr-se-opt-card').forEach(c => { c.onclick = () => actions.setMap(c.dataset.map); });
        body.querySelector('#nr-map-back').onclick = () => actions.setScreen('menu');
        body.querySelector('#nr-map-next').onclick = () => actions.setScreen('car_select');
      } else if (currentScreen === 'car_select') {
        const cars = window.CONSTANTS.SE_CARS;
        body.innerHTML = `
          <div class="nr-se-modal-screen">
            <h3 style="font-size:18px;font-weight:800;margin-bottom:10px;">Choose Vehicle</h3>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;width:100%;margin-bottom:14px;">
              ${cars.map(c => `
                <div class="nr-se-car-card ${selectedCar === c.id ? 'active' : ''}" data-car="${c.id}">
                  <div style="font-weight:700;font-size:13px;color:${c.color};">${c.name}</div>
                  <div style="font-size:10px;margin:4px 0;color:var(--text-muted);">Top Speed: ${c.topSpeed}<br>Accel: ${c.accel}<br>Handling: ${c.handling}</div>
                </div>`).join('')}
            </div>
            <div style="display:flex;gap:8px;width:100%;">
              <button id="nr-car-back" class="btn-secondary" style="flex:1;">Back</button>
              <button id="nr-car-start" class="btn-primary" style="flex:1;background:#10b981;">Start Race 🏁</button>
            </div>
          </div>`;
        body.querySelectorAll('.nr-se-car-card').forEach(c => { c.onclick = () => actions.setCar(c.dataset.car); });
        body.querySelector('#nr-car-back').onclick = () => actions.setScreen('map_select');
        body.querySelector('#nr-car-start').onclick = () => actions.startRace();
      } else if (currentScreen === 'settings') {
        body.innerHTML = `
          <div class="nr-se-modal-screen">
            <h3 style="font-size:18px;font-weight:800;margin-bottom:10px;">SE Settings</h3>
            <div style="width:100%;margin-bottom:14px;font-size:12px;">
              <label style="display:block;margin-bottom:4px;">Volume (${controls.volume}%)</label>
              <input type="range" id="nr-vol-range" min="0" max="100" value="${controls.volume}" style="width:100%;margin-bottom:10px;">
              <label style="display:block;margin-bottom:4px;">Controls: <strong>${controls.scheme === 'arrows' ? 'Arrow Keys / Touch' : 'WASD / Touch'}</strong></label>
              <button id="nr-ctrl-toggle" class="btn-secondary" style="width:100%;">Toggle Controls</button>
            </div>
            <button id="nr-set-back" class="btn-primary" style="width:100%;">Save & Back</button>
          </div>`;
        body.querySelector('#nr-vol-range').oninput = (e) => { controls.volume = e.target.value; };
        body.querySelector('#nr-ctrl-toggle').onclick = () => actions.toggleControlScheme();
        body.querySelector('#nr-set-back').onclick = () => actions.setScreen('menu');
      } else if (currentScreen === 'credits') {
        body.innerHTML = `
          <div class="nr-se-modal-screen">
            <h3 style="font-size:18px;font-weight:800;margin-bottom:6px;">Credits</h3>
            <div style="font-size:12px;color:var(--text-muted);margin-bottom:12px;line-height:1.6;">
              <strong>Nutrino Games Studio</strong><br>CEO: Alex Vance<br>Lead Dev: Marcus Speed<br>Artist: Elena Shift<br>Platform: Nutrino OS v1.1.2.1
            </div>
            <button id="nr-cred-back" class="btn-primary" style="width:100%;">Back to Menu</button>
          </div>`;
        body.querySelector('#nr-cred-back').onclick = () => actions.setScreen('menu');
      } else if (currentScreen === 'gameover') {
        body.innerHTML = `
          <div class="nr-modal">
            <div style="font-size:36px;margin-bottom:6px;">💥</div>
            <h2 style="color:#f43f5e;font-weight:800;font-size:22px;margin-bottom:4px;">CRASHED!</h2>
            <div style="font-size:13px;color:var(--text-muted);margin-bottom:14px;">Distance: <strong>${score}m</strong> • Map: <strong>${selectedMap}</strong></div>
            <div style="display:flex;gap:8px;width:100%;">
              <button id="nr-se-retry" class="btn-primary" style="flex:1;">Restart Race</button>
              <button id="nr-se-menu" class="btn-secondary" style="flex:1;">Main Menu</button>
            </div>
          </div>`;
        body.querySelector('#nr-se-retry').onclick = () => actions.startRace();
        body.querySelector('#nr-se-menu').onclick = () => actions.setScreen('menu');
      } else {
        body.innerHTML = '';
      }
    }
  };
})();
