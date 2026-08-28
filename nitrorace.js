/* FILE: nitrorace.js — 3D Nitro Race Game controller, lifecycle, and HUD */
(function() {
  let animId = null, world = null, obstacles = [], coinsList = [], isPlaying = false;
  let score = 0, distance = 0, coins = 0, speed = 40, level = 1, targetX = 0, currentX = 0, lastTime = 0, containerEl = null;

  function gameLoop(time) {
    if (!isPlaying || !world) return;
    const dt = Math.min((time - (lastTime || time)) / 1000, 0.1); lastTime = time;
    distance += speed * dt; score = Math.floor(distance);
    speed = Math.min(120, 40 + Math.floor(distance / 50) * 2);
    level = 1 + Math.floor(distance / 200);

    currentX += (targetX - currentX) * 0.15;
    if (world.playerCar) world.playerCar.position.x = currentX;

    world.roadSegments.forEach(r => {
      r.position.z += speed * dt;
      if (r.position.z > 20) r.position.z -= 400;
    });

    if (Math.random() < 0.035) window.nitroRace3D.spawnObstacle(world.scene, obstacles, coinsList);

    for (let i = obstacles.length - 1; i >= 0; i--) {
      const obs = obstacles[i]; obs.position.z += (speed * 0.6) * dt;
      if (Math.abs(obs.position.z - (world.playerCar?.position?.z || 0)) < 1.8 && Math.abs(obs.position.x - currentX) < 1.2) {
        endGame(); return;
      }
      if (obs.position.z > 10) {
        if (world.scene?.remove) world.scene.remove(obs);
        obstacles.splice(i, 1);
      }
    }

    for (let i = coinsList.length - 1; i >= 0; i--) {
      const c = coinsList[i]; c.position.z += speed * dt;
      if (c.rotation) c.rotation.y += 0.05;
      if (Math.abs(c.position.z - (world.playerCar?.position?.z || 0)) < 1.5 && Math.abs(c.position.x - currentX) < 1.1) {
        coins += 1;
        if (world.scene?.remove) world.scene.remove(c);
        coinsList.splice(i, 1);
      } else if (c.position.z > 10) {
        if (world.scene?.remove) world.scene.remove(c);
        coinsList.splice(i, 1);
      }
    }

    updateHUD();
    world.renderer.render(world.scene, world.camera, obstacles, coinsList, currentX);
    animId = requestAnimationFrame(gameLoop);
  }

  function updateHUD() {
    const hud = containerEl?.querySelector('#nr-hud');
    if (hud) hud.innerHTML = `<span>⚡ ${Math.round(speed * 2.2)} KM/H</span><span>🏁 ${score}M</span><span>🪙 ${coins}</span><span>Lv.${level}</span>`;
  }

  function onKeyDown(e) {
    const lanes = window.nitroRace3D.LANES;
    if (e.key === 'ArrowLeft' || e.key === 'a') targetX = Math.max(lanes[0], targetX - 2.2);
    if (e.key === 'ArrowRight' || e.key === 'd') targetX = Math.min(lanes[2], targetX + 2.2);
  }

  function startGame() {
    isPlaying = true; distance = 0; score = 0; coins = 0; speed = 40; targetX = 0; currentX = 0;
    obstacles.forEach(o => { if (world?.scene?.remove) world.scene.remove(o); }); obstacles = [];
    coinsList.forEach(c => { if (world?.scene?.remove) world.scene.remove(c); }); coinsList = [];
    const overlay = containerEl?.querySelector('#nr-overlay');
    if (overlay) overlay.style.display = 'none';
    lastTime = performance.now();
    animId = requestAnimationFrame(gameLoop);
  }

  function endGame() {
    isPlaying = false;
    if (animId) cancelAnimationFrame(animId);
    const overlay = containerEl?.querySelector('#nr-overlay');
    if (overlay) {
      overlay.style.display = 'flex';
      overlay.innerHTML = `
        <div class="nr-modal">
          <div style="font-size:36px;margin-bottom:6px;">💥</div>
          <h2 style="color:#f43f5e;font-weight:800;font-size:22px;margin-bottom:4px;">GAME OVER</h2>
          <div style="font-size:14px;color:var(--text-muted);margin-bottom:12px;">Distance: <strong>${score}m</strong> • Coins: <strong>${coins}</strong></div>
          <div style="display:flex;gap:8px;width:100%;">
            <button id="nr-restart-btn" class="btn-primary" style="flex:1;">Restart</button>
            <button id="nr-save-btn" class="btn-primary" style="flex:1;background:#38bdf8;">Save Progress</button>
          </div>
        </div>`;
      overlay.querySelector('#nr-restart-btn').onclick = startGame;
      overlay.querySelector('#nr-save-btn').onclick = saveProgress;
    }
  }

  function saveProgress() {
    if (!window.os?.isAppInstalled('gamesafe')) {
      window.animations?.showToast?.('Gamesafe is not installed! Download it from SoftStore.'); return;
    }
    if (!window.gamesafe?.isSubscribed()) {
      window.animations?.showToast?.('Gamesafe subscription is inactive or expired.'); return;
    }
    const res = window.gamesafe.saveGame('nitrorace', { score, highScore: score, coins, level });
    window.animations?.showToast?.(res.message);
  }

  window.nitroraceApp = {
    mount(container) {
      containerEl = container;
      container.innerHTML = `
        <div class="nr-root">
          <div id="nr-hud" class="nr-hud"></div>
          <div id="nr-canvas-box" class="nr-canvas-box"></div>
          <div class="nr-touch-controls">
            <button id="nr-left-btn" class="nr-ctrl-btn">◀</button>
            <button id="nr-right-btn" class="nr-ctrl-btn">▶</button>
          </div>
          <div id="nr-overlay" class="nr-overlay">
            <div class="nr-modal">
              <div style="font-size:36px;margin-bottom:6px;">🏎️</div>
              <h2 style="font-size:20px;font-weight:800;">NITRO RACE 3D</h2>
              <p style="font-size:12px;color:var(--text-muted);margin-bottom:16px;">Dodge obstacles, collect coins, conquer the highway!</p>
              <button id="nr-start-btn" class="btn-primary" style="width:100%;">Start Race</button>
            </div>
          </div>
        </div>`;
      world = window.nitroRace3D.initScene(container.querySelector('#nr-canvas-box'));
      window.addEventListener('keydown', onKeyDown);
      container.querySelector('#nr-start-btn').onclick = startGame;
      container.querySelector('#nr-left-btn').onclick = () => { targetX = Math.max(window.nitroRace3D.LANES[0], targetX - 2.2); };
      container.querySelector('#nr-right-btn').onclick = () => { targetX = Math.min(window.nitroRace3D.LANES[2], targetX + 2.2); };
    },
    unmount() {
      isPlaying = false; if (animId) cancelAnimationFrame(animId);
      window.removeEventListener('keydown', onKeyDown);
      containerEl = null; world = null;
    }
  };
})();
