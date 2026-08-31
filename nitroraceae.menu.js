/* FILE: nitroraceae.menu.js — NRAE 2-Second Loading Screen, 3D Rotating Car Menu & UI Views */
(function() {
  let menuScene = null, menuCamera = null, menuRenderer = null, menuCarGroup = null, menuAnimId = null;
  let selectedCarId = 'cr1', selectedMapId = 'default';

  window.nitroraceAeMenu = {
    selectedCarId, selectedMapId,

    showLoading(container, onComplete) {
      container.innerHTML = `
        <div class="nrae-loading-screen" style="position:absolute;inset:0;background:#090514;display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:50;">
          <div style="font-size:32px;font-weight:900;color:#f59e0b;letter-spacing:1px;text-shadow:0 0 20px rgba(245,158,11,0.5);">NITRO RACE</div>
          <div style="font-size:13px;font-weight:800;color:#ef4444;letter-spacing:4px;margin-bottom:24px;">ANNIVERSARY EDITION</div>
          <div style="width:220px;height:6px;background:rgba(255,255,255,0.1);border-radius:3px;overflow:hidden;margin-bottom:10px;">
            <div id="nrae-load-bar" style="width:0%;height:100%;background:linear-gradient(90deg, #ef4444, #f59e0b);transition:width 2000ms ease-out;"></div>
          </div>
          <div style="font-size:11px;color:#94a3b8;font-family:monospace;">INITIALIZING 3D ENGINE (30 FPS)...</div>
        </div>`;

      setTimeout(() => {
        const bar = container.querySelector('#nrae-load-bar');
        if (bar) bar.style.width = '100%';
      }, 50);

      setTimeout(() => {
        onComplete();
      }, 2050);
    },

    mountMenu(container, onStartPlay) {
      this.selectedCarId = selectedCarId;
      this.selectedMapId = selectedMapId;

      container.innerHTML = `
        <div class="nrae-menu-root" style="position:relative;width:100%;height:100%;overflow:hidden;background:#05020a;">
          <canvas id="nrae-menu-3d-canvas" style="position:absolute;inset:0;width:100%;height:100%;z-index:1;"></canvas>
          <div id="nrae-menu-ui" style="position:relative;z-index:10;width:100%;height:100%;display:flex;flex-direction:column;justify-content:space-between;padding:16px;">
            ${this.renderMainOverlay()}
          </div>
        </div>`;

      this.init3DBackground(container.querySelector('#nrae-menu-3d-canvas'));
      this.bindMenuEvents(container, onStartPlay);
    },

    renderMainOverlay() {
      const car = window.nitroraceAeCars.getCar(this.selectedCarId);
      const map = window.nitroraceAeMaps.getMap(this.selectedMapId);
      return `
        <div style="display:flex;justify-content:space-between;align-items:flex-start;">
          <div>
            <div style="font-size:24px;font-weight:900;color:#f59e0b;text-shadow:0 0 12px rgba(245,158,11,0.5);">NITRO RACE AE</div>
            <div style="font-size:10px;font-weight:700;color:#ef4444;letter-spacing:2px;">ANNIVERSARY EXCLUSIVE • 30 FPS LOCK</div>
          </div>
          <div style="background:rgba(0,0,0,0.6);padding:6px 12px;border-radius:8px;border:1px solid #f59e0b;font-size:11px;color:#fbbf24;">
            Active: <strong>${car.name}</strong> (${car.rarity}) | <strong>${map.name}</strong>
          </div>
        </div>
        <div style="display:flex;gap:10px;margin-bottom:8px;">
          <button id="nrae-play-btn" class="btn-primary" style="background:#10b981;font-size:14px;font-weight:800;padding:10px 24px;box-shadow:0 0 15px rgba(16,185,129,0.4);">START RACE ▶</button>
          <button id="nrae-garage-btn" class="btn-secondary" style="padding:10px 18px;font-size:12px;">🏎️ Garage (${car.name})</button>
          <button id="nrae-map-btn" class="btn-secondary" style="padding:10px 18px;font-size:12px;">🗺️ Map (${map.name})</button>
          <button id="nrae-credits-btn" class="btn-secondary" style="padding:10px 14px;font-size:12px;">ℹ️ Info</button>
        </div>`;
    },

    bindMenuEvents(container, onStartPlay) {
      const ui = container.querySelector('#nrae-menu-ui');
      const pBtn = container.querySelector('#nrae-play-btn');
      if (pBtn) pBtn.onclick = () => {
        this.stop3D();
        onStartPlay(this.selectedMapId, this.selectedCarId);
      };

      const gBtn = container.querySelector('#nrae-garage-btn');
      if (gBtn) gBtn.onclick = () => this.showGarage(ui, container, onStartPlay);

      const mBtn = container.querySelector('#nrae-map-btn');
      if (mBtn) mBtn.onclick = () => this.showMapSelect(ui, container, onStartPlay);

      const cBtn = container.querySelector('#nrae-credits-btn');
      if (cBtn) cBtn.onclick = () => this.showCredits(ui, container, onStartPlay);
    },

    showGarage(ui, container, onStartPlay) {
      const cars = window.nitroraceAeCars.list;
      ui.innerHTML = `
        <div style="background:rgba(9,5,20,0.92);border:1px solid #f59e0b;border-radius:12px;padding:16px;max-width:540px;margin:auto;">
          <h3 style="font-size:16px;font-weight:900;color:#f59e0b;margin-bottom:10px;">GARAGE — CHOOSE VEHICLE</h3>
          <div style="display:grid;grid-template-columns:repeat(3, 1fr);gap:10px;margin-bottom:14px;">
            ${cars.map(c => `
              <div class="nrae-car-card" data-car="${c.id}" style="background:${this.selectedCarId === c.id ? 'rgba(239,68,68,0.3)' : 'rgba(255,255,255,0.05)'};border:1px solid ${this.selectedCarId === c.id ? '#ef4444' : 'rgba(255,255,255,0.1)'};border-radius:8px;padding:10px;cursor:pointer;text-align:center;">
                <div style="color:${c.rarityColor};font-size:9px;font-weight:800;">${c.rarity.toUpperCase()}</div>
                <div style="font-size:14px;font-weight:800;color:#fff;margin:4px 0;">${c.name}</div>
                <div style="font-size:10px;color:#94a3b8;">${c.topSpeed} KM/H</div>
              </div>
            `).join('')}
          </div>
          <button id="nrae-garage-back" class="btn-primary" style="width:100%;background:#ef4444;">Done</button>
        </div>`;

      ui.querySelectorAll('.nrae-car-card').forEach(el => {
        el.onclick = () => {
          this.selectedCarId = el.dataset.car;
          selectedCarId = this.selectedCarId;
          this.update3DCarMesh();
          this.showGarage(ui, container, onStartPlay);
        };
      });
      ui.querySelector('#nrae-garage-back').onclick = () => this.mountMenu(container, onStartPlay);
    },

    showMapSelect(ui, container, onStartPlay) {
      const maps = window.nitroraceAeMaps.list;
      ui.innerHTML = `
        <div style="background:rgba(9,5,20,0.92);border:1px solid #38bdf8;border-radius:12px;padding:16px;max-width:540px;margin:auto;">
          <h3 style="font-size:16px;font-weight:900;color:#38bdf8;margin-bottom:10px;">TRACK & WORLD SELECTION</h3>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px;">
            ${maps.map(m => `
              <div class="nrae-map-card" data-map="${m.id}" style="background:${this.selectedMapId === m.id ? 'rgba(56,189,248,0.3)' : 'rgba(255,255,255,0.05)'};border:1px solid ${this.selectedMapId === m.id ? '#38bdf8' : 'rgba(255,255,255,0.1)'};border-radius:8px;padding:12px;cursor:pointer;">
                <div style="font-size:16px;font-weight:800;color:#fff;">${m.icon} ${m.name}</div>
                <div style="font-size:10px;color:#38bdf8;margin-top:2px;">${m.type}</div>
                <div style="font-size:11px;color:#94a3b8;margin-top:6px;">${m.desc}</div>
              </div>
            `).join('')}
          </div>
          <button id="nrae-map-back" class="btn-primary" style="width:100%;background:#38bdf8;">Done</button>
        </div>`;

      ui.querySelectorAll('.nrae-map-card').forEach(el => {
        el.onclick = () => {
          this.selectedMapId = el.dataset.map;
          selectedMapId = this.selectedMapId;
          this.showMapSelect(ui, container, onStartPlay);
        };
      });
      ui.querySelector('#nrae-map-back').onclick = () => this.mountMenu(container, onStartPlay);
    },

    showCredits(ui, container, onStartPlay) {
      ui.innerHTML = `
        <div style="background:rgba(9,5,20,0.92);border:1px solid #a855f7;border-radius:12px;padding:16px;max-width:500px;margin:auto;">
          <h3 style="font-size:16px;font-weight:900;color:#c084fc;margin-bottom:8px;">NITRO RACE AE — CREDITS</h3>
          <p style="font-size:12px;color:#cbd5e1;line-height:1.5;">Developed exclusively for Nutrino OS by RaceMakingStudio. Featuring 300x300 Roamable Open World, 3 Anniversary Vehicles, and 30 FPS Lock.</p>
          <div style="font-size:11px;color:#94a3b8;margin:10px 0;">⚡ Silent Pay: $5.00/sec runtime metering via SuperBank.</div>
          <button id="nrae-credits-back" class="btn-primary" style="width:100%;background:#a855f7;">Back to Menu</button>
        </div>`;
      ui.querySelector('#nrae-credits-back').onclick = () => this.mountMenu(container, onStartPlay);
    },

    init3DBackground(canvas) {
      if (!canvas || typeof THREE === 'undefined') return;
      const w = Math.max(200, canvas.parentElement?.clientWidth || canvas.clientWidth || 640);
      const h = Math.max(200, canvas.parentElement?.clientHeight || canvas.clientHeight || 360);
      menuScene = new THREE.Scene();
      menuCamera = new THREE.PerspectiveCamera(50, w / h, 0.1, 100);
      menuCamera.position.set(0, 2.2, 5.5);
      menuCamera.lookAt(0, 0.3, 0);

      menuRenderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
      menuRenderer.setSize(w, h);

      const light1 = new THREE.DirectionalLight(0xfbbf24, 1.2); light1.position.set(5, 10, 7);
      const light2 = new THREE.HemisphereLight(0xffffff, 0x1e1b4b, 0.8);
      menuScene.add(light1); menuScene.add(light2);

      // Rotating Pedestal Grid
      const grid = new THREE.GridHelper(12, 16, 0xef4444, 0x334155);
      grid.position.y = -0.1;
      menuScene.add(grid);

      this.update3DCarMesh();

      const animate = () => {
        menuAnimId = requestAnimationFrame(animate);
        if (menuCarGroup) menuCarGroup.rotation.y += 0.015;
        if (menuRenderer && menuScene && menuCamera) {
          menuRenderer.render(menuScene, menuCamera);
        }
      };
      animate();
    },

    update3DCarMesh() {
      if (!menuScene) return;
      if (menuCarGroup) menuScene.remove(menuCarGroup);
      const car = window.nitroraceAeCars.getCar(this.selectedCarId);
      menuCarGroup = window.nitroraceAeCars.create3DCar(car);
      menuScene.add(menuCarGroup);
    },

    stop3D() {
      if (menuAnimId) { cancelAnimationFrame(menuAnimId); menuAnimId = null; }
      if (menuRenderer) { menuRenderer.dispose(); menuRenderer = null; }
      menuScene = null; menuCamera = null; menuCarGroup = null;
    }
  };
})();
