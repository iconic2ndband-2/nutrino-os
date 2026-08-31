/* FILE: nitroraceae.js — NRAE Main App Controller, Orientation Lock, GPU Check, Silent Pay */
(function() {
  let rootContainer = null, silentPayTimer = null, isPlaying = false, isLandscapeMode = false;
  let totalCostAcc = 0, currentView = 'none';

  function isLandscape() {
    if (isLandscapeMode) return true;
    if (rootContainer && rootContainer.clientWidth > 0 && rootContainer.clientHeight > 0) {
      return rootContainer.clientWidth > rootContainer.clientHeight;
    }
    return window.innerWidth > window.innerHeight;
  }

  window.nitroraceAeApp = {
    mount(container) {
      rootContainer = container;
      totalCostAcc = 0;
      isPlaying = false;
      this.bindOrientation();

      // GPU WebGL Check
      if (!window.os?.canRun3D?.()) {
        window.osGpu?.showCrashScreen(container, 'Nitro Race AE', '1.0.0', () => window.os.goBack());
        return;
      }

      if (!isLandscape()) {
        this.renderOrientationWarning();
        return;
      }

      this.startAppFlow();
    },

    bindOrientation() {
      window.addEventListener('resize', this.onResize);
    },

    onResize: () => {
      if (!rootContainer) return;
      if (!isLandscape() && isPlaying && !isLandscapeMode) {
        window.nitroraceAeApp?.renderOrientationWarning();
      } else if (isLandscape() && currentView === 'portrait_warn') {
        window.nitroraceAeApp?.startAppFlow();
      }
    },

    renderOrientationWarning() {
      currentView = 'portrait_warn';
      this.stopSilentPay();
      if (window.nitroraceAeGame) window.nitroraceAeGame.stop();
      if (window.nitroraceAeMenu) window.nitroraceAeMenu.stop3D();

      rootContainer.innerHTML = `
        <div class="nrae-portrait-warning" style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;background:#090514;color:#fff;text-align:center;padding:24px;">
          <div style="font-size:48px;animation:spin 3s linear infinite;margin-bottom:12px;">🔄</div>
          <h2 style="font-size:18px;font-weight:900;color:#ef4444;margin-bottom:8px;">RECOMMENDED: ROTATE TO LANDSCAPE</h2>
          <p style="font-size:13px;color:#f59e0b;font-weight:700;margin-bottom:4px;">Nitro Race Anniversary Edition</p>
          <p style="font-size:11px;color:#94a3b8;max-width:280px;line-height:1.4;margin-bottom:16px;">This exclusive 3D game is optimized for landscape orientation with high-speed 30 FPS racing.</p>
          <div style="display:flex;flex-direction:column;gap:8px;width:100%;max-width:260px;">
            <button id="nrae-force-land" class="btn-primary" style="background:linear-gradient(90deg,#ef4444,#f59e0b);font-size:12px;font-weight:800;padding:10px 16px;">Play Game (Adaptive Fit) ▶</button>
            <button id="nrae-exit-home" class="btn-secondary" style="font-size:11px;padding:8px 16px;">Exit to Home</button>
          </div>
        </div>`;

      const fBtn = rootContainer.querySelector('#nrae-force-land');
      if (fBtn) fBtn.onclick = () => {
        isLandscapeMode = true;
        this.startAppFlow();
      };
      const eBtn = rootContainer.querySelector('#nrae-exit-home');
      if (eBtn) eBtn.onclick = () => window.os.goHome();
    },

    startAppFlow() {
      currentView = 'loading';
      window.nitroraceAeMenu.showLoading(rootContainer, () => {
        this.showMenu();
      });
    },

    showMenu() {
      currentView = 'menu';
      this.stopSilentPay();
      window.nitroraceAeMenu.mountMenu(rootContainer, (mapId, carId) => {
        this.launchRace(mapId, carId);
      });
    },

    launchRace(mapId, carId) {
      currentView = 'game';
      isPlaying = true;
      const map = window.nitroraceAeMaps.getMap(mapId);
      const car = window.nitroraceAeCars.getCar(carId);

      rootContainer.innerHTML = `
        <div class="nrae-game-viewport" style="position:relative;width:100%;height:100%;background:#000;overflow:hidden;">
          <canvas id="nrae-game-canvas" style="width:100%;height:100%;display:block;"></canvas>
          <div class="nrae-hud-top" style="position:absolute;top:10px;left:12px;right:12px;display:flex;justify-content:space-between;align-items:center;z-index:25;pointer-events:none;">
            <div style="background:rgba(0,0,0,0.65);padding:4px 10px;border-radius:6px;border:1px solid #ef4444;pointer-events:auto;">
              <span style="font-size:11px;font-weight:900;color:#f59e0b;">${car.name}</span>
              <span style="font-size:10px;color:#94a3b8;margin-left:6px;">(${map.name})</span>
            </div>
            <div style="background:rgba(0,0,0,0.65);padding:4px 10px;border-radius:6px;border:1px solid #10b981;font-size:11px;font-weight:800;color:#34d399;">
              ⚡ SILENT PAY: <span id="nrae-cost-ticker">$5.00/s</span>
            </div>
            <button id="nrae-exit-btn" class="btn-primary" style="background:#ef4444;min-height:26px;padding:0 10px;font-size:10px;pointer-events:auto;">Exit Menu</button>
          </div>
          <div id="nrae-hud-speed" style="position:absolute;bottom:18px;left:50%;transform:translateX(-50%);font-family:monospace;font-size:22px;font-weight:900;color:#38bdf8;background:rgba(0,0,0,0.7);padding:4px 16px;border-radius:20px;border:1px solid #38bdf8;z-index:25;pointer-events:none;">0 KM/H</div>
          ${mapId === 'openworld' ? '<canvas id="nrae-minimap-canvas" width="100" height="100" style="position:absolute;top:44px;right:12px;width:90px;height:90px;z-index:25;border-radius:6px;box-shadow:0 0 10px rgba(0,0,0,0.5);"></canvas>' : ''}
        </div>`;

      const canvas = rootContainer.querySelector('#nrae-game-canvas');
      const mmCanvas = rootContainer.querySelector('#nrae-minimap-canvas');
      if (mmCanvas) window.nitroraceAeGame.setMiniMap(mmCanvas);

      window.nitroraceAeControls.init(rootContainer);
      window.nitroraceAeGame.start(canvas, mapId, carId, () => this.showMenu(), () => this.handleInsufficientFunds());

      const exitBtn = rootContainer.querySelector('#nrae-exit-btn');
      if (exitBtn) exitBtn.onclick = () => {
        this.stopGame();
        this.showMenu();
      };

      this.startSilentPay();
    },

    startSilentPay() {
      this.stopSilentPay();
      silentPayTimer = setInterval(() => {
        const bal = window.os?.state?.bankBalance ?? 0;
        if (bal < 5.00) {
          this.handleInsufficientFunds();
          return;
        }
        window.os?.deductBank?.(5.00, 'NRAE Runtime ($5/s)');
        totalCostAcc += 5.00;
        const tick = rootContainer?.querySelector('#nrae-cost-ticker');
        if (tick) tick.textContent = `-$${totalCostAcc.toFixed(2)}`;
      }, 1000);
    },

    stopSilentPay() {
      if (silentPayTimer) { clearInterval(silentPayTimer); silentPayTimer = null; }
    },

    handleInsufficientFunds() {
      this.stopGame();
      this.stopSilentPay();
      if (window.confirmModal) {
        window.confirmModal.show({
          title: '⚠️ Insufficient Funds',
          message: 'Nitro Race Anniversary Edition has stopped. Real-time balance dropped below $5.00/s.',
          icon: '💸', confirmText: 'Return to Home', cancelText: 'OK', isDestructive: true,
          onConfirm: () => window.os.goHome()
        });
      } else {
        window.animations?.showToast?.('NRAE stopped: Insufficient funds ($5.00/s required)');
        window.os.goHome();
      }
    },

    stopGame() {
      isPlaying = false;
      this.stopSilentPay();
      if (window.nitroraceAeControls) window.nitroraceAeControls.destroy();
      if (window.nitroraceAeGame) window.nitroraceAeGame.stop();
    },

    unmount() {
      this.stopGame();
      if (window.nitroraceAeMenu) window.nitroraceAeMenu.stop3D();
      window.removeEventListener('resize', this.onResize);
      rootContainer = null;
    }
  };
})();
