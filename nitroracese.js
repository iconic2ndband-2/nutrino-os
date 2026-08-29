/* FILE: nitroracese.js — Nitro Race SE 2D Game Controller, Physics & Loop */
(function() {
  let animId = null, currentScreen = 'menu', selectedMap = 'desert', selectedCar = 'default';
  let isRacing = false, score = 0, speed = 60, carX = 0.5, targetCarX = 0.5, scrollY = 0;
  let obstacles = [], lastSpawn = 0, containerEl = null, menuAngle = 0;
  const controls = { scheme: 'arrows', volume: 80 };

  const actions = {
    setScreen(s) { currentScreen = s; render(); },
    setMap(m) { selectedMap = m; render(); },
    setCar(c) { selectedCar = c; render(); },
    toggleControlScheme() { controls.scheme = controls.scheme === 'arrows' ? 'wasd' : 'arrows'; render(); },
    startRace() {
      currentScreen = 'race'; isRacing = true; score = 0; speed = selectedCar === 'new' ? 70 : 60;
      carX = 0.5; targetCarX = 0.5; scrollY = 0; obstacles = []; lastSpawn = performance.now();
      render();
    }
  };

  function loop(time) {
    const canvas = containerEl?.querySelector('#nr-se-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d'), w = canvas.width, h = canvas.height;

    if (currentScreen === 'menu') {
      menuAngle += 0.02;
      window.nrSeCanvas?.drawRotatingMenuCar(ctx, w, h, menuAngle, selectedCar === 'new' ? '#0ea5e9' : '#f43f5e');
    } else if (currentScreen === 'race' && isRacing) {
      const dt = 0.016;
      scrollY += speed * 4 * dt;
      score += Math.floor(speed * 0.1);
      speed = Math.min(selectedCar === 'new' ? 125 : 140, speed + dt * 1.5);
      carX += (targetCarX - carX) * (selectedCar === 'new' ? 0.22 : 0.16);

      window.nrSeCanvas?.drawTrack(ctx, w, h, selectedMap, scrollY);
      if (time - lastSpawn > Math.max(900, 2200 - speed * 10)) {
        lastSpawn = time;
        const laneX = w * (0.24 + Math.random() * 0.52);
        obstacles.push({ x: laneX, y: -50, w: 32, h: 54, type: Math.random() > 0.7 ? 'truck' : 'car', speed: speed * 0.4 });
      }

      const px = w * carX, py = h * 0.82;
      for (let i = obstacles.length - 1; i >= 0; i--) {
        const o = obstacles[i];
        o.y += (speed - o.speed) * 4 * dt;
        window.nrSeCanvas?.drawObstacle(ctx, o);
        if (Math.abs(o.x - px) < 26 && Math.abs(o.y - py) < 42) {
          isRacing = false; currentScreen = 'gameover'; render(); return;
        }
        if (o.y > h + 60) obstacles.splice(i, 1);
      }

      window.nrSeCanvas?.drawPlayerCar(ctx, px, py, selectedCar);
      const hud = containerEl?.querySelector('#nr-se-hud');
      if (hud) hud.innerHTML = `<span>⚡ ${Math.round(speed * 2)} KM/H</span><span>🏁 ${score}M</span><span>📍 ${selectedMap.toUpperCase()}</span>`;
    }
    animId = requestAnimationFrame(loop);
  }

  function render() {
    const body = containerEl?.querySelector('#nr-se-ui-overlay');
    if (!body) return;
    window.nrSeUI?.render(body, { currentScreen, selectedMap, selectedCar, controls, score }, actions);
  }

  function onKeyDown(e) {
    if (!isRacing) return;
    const isLeft = controls.scheme === 'arrows' ? e.key === 'ArrowLeft' : (e.key === 'a' || e.key === 'A');
    const isRight = controls.scheme === 'arrows' ? e.key === 'ArrowRight' : (e.key === 'd' || e.key === 'D');
    if (isLeft) targetCarX = Math.max(0.24, targetCarX - 0.12);
    if (isRight) targetCarX = Math.min(0.76, targetCarX + 0.12);
  }

  window.nitroraceSeApp = {
    mount(container) {
      containerEl = container;
      if (!window.os?.canRun3D?.()) {
        window.osGpu?.showCrashScreen(container, 'Nitro Race SE', window.os?.getInstalledVersion('nitroracese'), () => window.os?.goBack?.());
        return;
      }
      currentScreen = 'menu'; isRacing = false;
      container.innerHTML = `
        <div class="nr-root" style="background:#000;">
          <div id="nr-se-hud" class="nr-hud"></div>
          <canvas id="nr-se-canvas" width="340" height="480" style="width:100%;height:100%;display:block;"></canvas>
          <div class="nr-touch-controls">
            <button id="nr-se-left" class="nr-ctrl-btn">◀</button>
            <button id="nr-se-right" class="nr-ctrl-btn">▶</button>
          </div>
          <div id="nr-se-ui-overlay" class="nr-overlay" style="background:transparent;pointer-events:none;"></div>
        </div>`;

      container.querySelector('#nr-se-left').onclick = () => { if (isRacing) targetCarX = Math.max(0.24, targetCarX - 0.12); };
      container.querySelector('#nr-se-right').onclick = () => { if (isRacing) targetCarX = Math.min(0.76, targetCarX + 0.12); };
      window.addEventListener('keydown', onKeyDown);

      render();
      animId = requestAnimationFrame(loop);
      window.nrSePay?.start(() => {
        isRacing = false; if (animId) cancelAnimationFrame(animId);
      });
    },
    unmount() {
      isRacing = false; if (animId) cancelAnimationFrame(animId);
      window.removeEventListener('keydown', onKeyDown);
      window.nrSePay?.stop();
      containerEl = null;
    }
  };
})();
