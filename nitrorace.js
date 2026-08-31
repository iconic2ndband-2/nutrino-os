/* FILE: nitrorace.js — 3D Nitro Race Game controller with Full Season 1 Pass Integration */
(function() {
  let animId = null, world = null, obstacles = [], coinsList = [], isPlaying = false;
  let score = 0, distance = 0, coins = 0, totalCoinsBank = 0, speed = 40, maxSpeedReached = 40, level = 1, targetX = 0, currentX = 0, lastTime = 0, containerEl = null;
  let obstaclesPassed = 0;

  function loadCoins() {
    try {
      const saved = localStorage.getItem('nitrorace_coins');
      totalCoinsBank = saved ? parseInt(saved) || 0 : 0;
    } catch (e) { totalCoinsBank = 0; }
  }

  function saveCoins() {
    try {
      localStorage.setItem('nitrorace_coins', totalCoinsBank.toString());
    } catch (e) {}
  }

  loadCoins();

  function gameLoop(time) {
    if (!isPlaying || !world) return;
    const dt = Math.min((time - (lastTime || time)) / 1000, 0.1); lastTime = time;
    distance += speed * dt; score = Math.floor(distance);
    speed = Math.min(130, 40 + Math.floor(distance / 45) * 2.5);
    const kmh = Math.round(speed * 2.2);
    if (kmh > maxSpeedReached) maxSpeedReached = kmh;
    level = 1 + Math.floor(distance / 200);

    currentX += (targetX - currentX) * 0.18;
    if (world.playerCar) world.playerCar.position.x = currentX;

    world.roadSegments.forEach(r => {
      r.position.z += speed * dt;
      if (r.position.z > 20) r.position.z -= 400;
    });

    if (Math.random() < 0.038) window.nitroRace3D.spawnObstacle(world.scene, obstacles, coinsList);

    // Update 3D visual effects (RGB underglow, police strobe lights, exhaust flame/lightning/sparks trail particles)
    if (world.updateEffects) {
      world.updateEffects(time, speed);
    }

    for (let i = obstacles.length - 1; i >= 0; i--) {
      const obs = obstacles[i]; obs.position.z += (speed * 0.65) * dt;
      if (Math.abs(obs.position.z - (world.playerCar?.position?.z || 0)) < 1.8 && Math.abs(obs.position.x - currentX) < 1.2) {
        endGame(); return;
      }
      if (obs.position.z > 10) {
        obstaclesPassed += 1;
        if (world.scene?.remove) world.scene.remove(obs);
        obstacles.splice(i, 1);
      }
    }

    for (let i = coinsList.length - 1; i >= 0; i--) {
      const c = coinsList[i]; c.position.z += speed * dt;
      if (c.rotation) c.rotation.y += 0.08;
      if (Math.abs(c.position.z - (world.playerCar?.position?.z || 0)) < 1.6 && Math.abs(c.position.x - currentX) < 1.2) {
        coins += 1;
        totalCoinsBank += 1;
        saveCoins();
        if (world.scene?.remove) world.scene.remove(c);
        coinsList.splice(i, 1);
      } else if (c.position.z > 10) {
        if (world.scene?.remove) world.scene.remove(c);
        coinsList.splice(i, 1);
      }
    }

    updateHUD();
    if (world?.renderer?.render && world?.scene && world?.camera) {
      world.renderer.render(world.scene, world.camera, obstacles, coinsList, currentX);
    }
    animId = requestAnimationFrame(gameLoop);
  }

  function updateHUD() {
    const hud = containerEl?.querySelector('#nr-hud');
    if (!hud) return;
    const pState = window.nitroracePass?.getState();
    const tierBadge = pState ? `S1 T${pState.tier}` : 'S1';
    hud.innerHTML = `
      <div style="display:flex;gap:8px;align-items:center;">
        <span>⚡ ${Math.round(speed * 2.2)} KM/H</span>
        <span>🏁 ${score}M</span>
      </div>
      <div style="display:flex;gap:8px;align-items:center;">
        <span>🪙 ${coins} (${totalCoinsBank})</span>
        <span style="background:rgba(236,72,153,0.3);border:1px solid #ec4899;padding:1px 6px;border-radius:10px;font-size:9px;color:#fbcfe8;">🏆 ${tierBadge}</span>
      </div>
    `;
  }

  function onKeyDown(e) {
    const lanes = window.nitroRace3D.LANES;
    if (e.key === 'ArrowLeft' || e.key === 'a') targetX = Math.max(lanes[0], targetX - 2.2);
    if (e.key === 'ArrowRight' || e.key === 'd') targetX = Math.min(lanes[2], targetX + 2.2);
  }

  function startGame() {
    // Re-initialize scene so equipped car/paint/underglow/trail changes take effect
    if (containerEl) {
      const canvasBox = containerEl.querySelector('#nr-canvas-box');
      if (canvasBox) {
        canvasBox.innerHTML = '';
        world = window.nitroRace3D.initScene(canvasBox);
      }
    }

    isPlaying = true; distance = 0; score = 0; coins = 0; speed = 40; maxSpeedReached = 40; obstaclesPassed = 0; targetX = 0; currentX = 0;
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

    // Calculate Season 1 XP Earned
    const earnedDistXp = Math.floor(score / 15);
    const earnedCoinXp = coins * 6;
    const baseRunXp = 20;
    const rawTotalXp = earnedDistXp + earnedCoinXp + baseRunXp;

    // Update Missions in Season 1 Pass
    if (window.nitroracePass?.updateMissionProgress) {
      window.nitroracePass.updateMissionProgress('distance', score);
      window.nitroracePass.updateMissionProgress('coins', coins);
      window.nitroracePass.updateMissionProgress('speed', maxSpeedReached);
      window.nitroracePass.updateMissionProgress('dodge', obstaclesPassed);
      window.nitroracePass.updateMissionProgress('runs', 1);
      window.nitroracePass.updateMissionProgress('singledist', score);
    }

    // Award XP to Season 1 Pass
    const xpResult = window.nitroracePass?.addXP(rawTotalXp, 'Race Finish') || { leveledUp: false, newTier: 1, gainedXp: rawTotalXp };
    const pState = window.nitroracePass?.getState() || { tier: 1, xp: 0, isPremium: false };
    const info = window.nitroracePass?.SEASON_INFO || { xpPerTier: 100, totalTiers: 20 };

    const overlay = containerEl?.querySelector('#nr-overlay');
    if (overlay) {
      overlay.style.display = 'flex';
      overlay.innerHTML = `
        <div class="nr-modal" style="max-width:320px;padding:20px 16px;">
          <div style="font-size:32px;margin-bottom:2px;">💥</div>
          <h2 style="color:#f43f5e;font-weight:900;font-size:20px;margin-bottom:2px;letter-spacing:0.5px;">RACE CRASHED</h2>
          <div style="font-size:12px;color:#94a3b8;margin-bottom:10px;">Distance: <strong style="color:#fff;">${score}m</strong> • Coins: <strong style="color:#fbbf24;">+${coins}</strong></div>

          <!-- Season 1 XP Breakdown Card -->
          <div style="width:100%;background:radial-gradient(circle at top, #1e1b4b 0%, #0f172a 100%);border:1px solid rgba(56,189,248,0.3);border-radius:12px;padding:10px;margin-bottom:14px;box-shadow:0 0 12px rgba(56,189,248,0.15);">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
              <span style="font-size:10px;font-weight:900;color:#38bdf8;letter-spacing:0.5px;">🏆 SEASON 1 XP GAINED</span>
              <span style="font-size:12px;font-weight:900;color:#10b981;">+${xpResult.gainedXp} XP</span>
            </div>
            <div style="font-size:9px;color:#94a3b8;display:flex;justify-content:space-between;margin-bottom:6px;">
              <span>Dist: +${earnedDistXp}</span>
              <span>Coins: +${earnedCoinXp}</span>
              <span>Finish: +${baseRunXp}</span>
              ${pState.isPremium ? '<span style="color:#f59e0b;font-weight:700;">★ +25% VIP</span>' : ''}
            </div>

            <!-- Tier Bar -->
            <div style="display:flex;justify-content:space-between;font-size:9px;font-weight:800;color:#cbd5e1;margin-bottom:3px;">
              <span>Tier ${pState.tier}</span>
              <span>${pState.tier >= info.totalTiers ? 'MAX TIER' : `${pState.xp} / ${info.xpPerTier} XP`}</span>
            </div>
            <div style="width:100%;height:6px;background:rgba(255,255,255,0.12);border-radius:3px;overflow:hidden;">
              <div style="width:${pState.tier >= info.totalTiers ? 100 : Math.min(100, Math.round((pState.xp / info.xpPerTier) * 100))}%;height:100%;background:linear-gradient(90deg,#06b6d4,#ec4899);border-radius:3px;"></div>
            </div>
            ${xpResult.leveledUp ? `
              <div style="margin-top:6px;background:rgba(236,72,153,0.25);border:1px solid #ec4899;color:#fbcfe8;font-size:10px;font-weight:900;padding:3px;border-radius:6px;text-align:center;">
                🎉 TIER UP! UNLOCKED TIER ${pState.tier} REWARDS!
              </div>
            ` : ''}
          </div>

          <div style="display:flex;flex-direction:column;gap:6px;width:100%;">
            <div style="display:flex;gap:6px;width:100%;">
              <button id="nr-restart-btn" class="btn-primary" style="flex:1;padding:8px;font-size:12px;font-weight:800;">🏎️ Restart</button>
              <button id="nr-save-btn" class="btn-primary" style="flex:1;padding:8px;font-size:12px;font-weight:800;background:#38bdf8;color:#0f172a;">💾 Save</button>
            </div>
            <button id="nr-view-pass-btn" style="background:linear-gradient(90deg,#ec4899,#8b5cf6);color:#fff;border:none;padding:8px;border-radius:8px;font-size:11px;font-weight:900;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px;box-shadow:0 0 10px rgba(236,72,153,0.4);">
              <span>🏆 View Season 1 Pass & Rewards</span>
            </button>
          </div>
        </div>`;

      overlay.querySelector('#nr-restart-btn').onclick = startGame;
      overlay.querySelector('#nr-save-btn').onclick = saveProgress;
      overlay.querySelector('#nr-view-pass-btn').onclick = openSeasonPass;
    }
  }

  function renderMainMenu() {
    const overlay = containerEl?.querySelector('#nr-overlay');
    if (!overlay) return;
    const pState = window.nitroracePass?.getState() || { tier: 1, xp: 0, isPremium: false };
    const info = window.nitroracePass?.SEASON_INFO || { xpPerTier: 100, totalTiers: 20 };
    const garageCar = window.nitroraceGarage?.getCar(pState.equipped?.car)?.name || 'Vulcan GT';

    overlay.style.display = 'flex';
    overlay.innerHTML = `
      <div class="nr-modal" style="max-width:320px;padding:20px 16px;">
        <div style="font-size:36px;margin-bottom:4px;">🏎️</div>
        <h2 style="font-size:20px;font-weight:900;letter-spacing:0.5px;margin-bottom:2px;">NITRO RACE 3D</h2>
        <div style="font-size:11px;color:#94a3b8;margin-bottom:12px;">Dodge traffic, collect coins, level up Season 1!</div>

        <!-- Season 1 Pass Interactive Hub Widget -->
        <div id="nr-menu-pass-card" style="width:100%;background:radial-gradient(circle at top, #1e1b4b 0%, #0f172a 100%);border:1px solid rgba(236,72,153,0.3);border-radius:12px;padding:10px;margin-bottom:14px;cursor:pointer;text-align:left;box-shadow:0 0 12px rgba(236,72,153,0.2);">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
            <div style="display:flex;align-items:center;gap:6px;">
              <span style="font-size:14px;">🏆</span>
              <span style="font-size:11px;font-weight:900;color:#fbcfe8;">SEASON 1 PASS</span>
            </div>
            <span style="font-size:9px;font-weight:800;color:${pState.isPremium ? '#fbbf24' : '#38bdf8'};background:rgba(255,255,255,0.08);padding:2px 6px;border-radius:4px;">
              ${pState.isPremium ? '★ VIP PASS' : 'FREE PASS'}
            </span>
          </div>

          <div style="display:flex;justify-content:space-between;align-items:center;font-size:10px;font-weight:700;color:#cbd5e1;margin-bottom:4px;">
            <span>Current Tier: <strong style="color:#38bdf8;">${pState.tier} / ${info.totalTiers}</strong></span>
            <span>Car: <strong style="color:#ec4899;">${garageCar}</strong></span>
          </div>

          <div style="width:100%;height:6px;background:rgba(255,255,255,0.12);border-radius:3px;overflow:hidden;margin-bottom:6px;">
            <div style="width:${pState.tier >= info.totalTiers ? 100 : Math.min(100, Math.round((pState.xp / info.xpPerTier) * 100))}%;height:100%;background:linear-gradient(90deg,#06b6d4,#ec4899);border-radius:3px;"></div>
          </div>
          <div style="font-size:9px;color:#38bdf8;text-align:center;font-weight:800;">Tap to View Rewards & Garage ➔</div>
        </div>

        <div style="display:flex;flex-direction:column;gap:8px;width:100%;">
          <button id="nr-start-btn" class="btn-primary" style="width:100%;padding:10px;font-size:14px;font-weight:900;background:linear-gradient(90deg,#ef4444,#f43f5e);">🏁 START RACE</button>
          <div style="display:flex;gap:6px;width:100%;">
            <button id="nr-menu-pass-btn" style="flex:1;background:rgba(236,72,153,0.15);border:1px solid #ec4899;color:#fbcfe8;padding:8px 4px;border-radius:8px;font-size:11px;font-weight:800;cursor:pointer;">
              🏆 Season Pass
            </button>
            <button id="nr-menu-garage-btn" style="flex:1;background:rgba(56,189,248,0.15);border:1px solid #38bdf8;color:#38bdf8;padding:8px 4px;border-radius:8px;font-size:11px;font-weight:800;cursor:pointer;">
              🚗 Garage
            </button>
          </div>
        </div>
      </div>
    `;

    overlay.querySelector('#nr-start-btn').onclick = startGame;
    overlay.querySelector('#nr-menu-pass-card').onclick = openSeasonPass;
    overlay.querySelector('#nr-menu-pass-btn').onclick = openSeasonPass;
    overlay.querySelector('#nr-menu-garage-btn').onclick = () => {
      openSeasonPass('garage');
    };
  }

  function openSeasonPass(initialTab = 'pass') {
    if (!containerEl) return;
    let passModal = containerEl.querySelector('#nr-pass-modal-container');
    if (!passModal) {
      passModal = document.createElement('div');
      passModal.id = 'nr-pass-modal-container';
      passModal.style.position = 'absolute';
      passModal.style.inset = '0';
      passModal.style.zIndex = '40';
      containerEl.querySelector('.nr-root').appendChild(passModal);
    }
    passModal.style.display = 'block';

    window.nitroracePassUI?.open(passModal, () => {
      passModal.style.display = 'none';
      renderMainMenu();
    });
  }

  function saveProgress() {
    if (!window.os?.isAppInstalled('gamesafe')) {
      window.animations?.showToast?.('Gamesafe is not installed! Download it from SoftStore.'); return;
    }
    if (!window.gamesafe?.isSubscribed()) {
      window.animations?.showToast?.('Gamesafe subscription is inactive or expired.'); return;
    }
    const pState = window.nitroracePass?.getState();
    const res = window.gamesafe.saveGame('nitrorace', {
      score,
      highScore: score,
      coins: totalCoinsBank,
      level,
      season1Tier: pState?.tier || 1,
      season1XP: pState?.xp || 0,
      season1Premium: pState?.isPremium || false
    });
    window.animations?.showToast?.(res.message);
  }

  window.nitroraceApp = {
    addCoins(amount) {
      totalCoinsBank += amount;
      saveCoins();
      window.animations?.showToast?.(`🪙 +${amount} Nitro Coins! (Total: ${totalCoinsBank})`);
    },
    getCoins() { return totalCoinsBank; },
    openPass(tab = 'pass') { openSeasonPass(tab); },
    mount(container) {
      containerEl = container;
      if (!window.os?.canRun3D?.()) {
        window.osGpu?.showCrashScreen(container, 'Nitro Race 3D', window.os?.getInstalledVersion('nitrorace'), () => window.os?.goBack?.());
        return;
      }
      container.innerHTML = `
        <div class="nr-root">
          <div id="nr-hud" class="nr-hud"></div>
          <div id="nr-canvas-box" class="nr-canvas-box"></div>
          <div class="nr-touch-controls">
            <button id="nr-left-btn" class="nr-ctrl-btn">◀</button>
            <button id="nr-right-btn" class="nr-ctrl-btn">▶</button>
          </div>
          <div id="nr-overlay" class="nr-overlay"></div>
        </div>`;
      world = window.nitroRace3D.initScene(container.querySelector('#nr-canvas-box'));
      window.addEventListener('keydown', onKeyDown);
      container.querySelector('#nr-left-btn').onclick = () => { targetX = Math.max(window.nitroRace3D.LANES[0], targetX - 2.2); };
      container.querySelector('#nr-right-btn').onclick = () => { targetX = Math.min(window.nitroRace3D.LANES[2], targetX + 2.2); };

      renderMainMenu();
      updateHUD();
    },
    unmount() {
      isPlaying = false; if (animId) cancelAnimationFrame(animId);
      window.removeEventListener('keydown', onKeyDown);
      window.nitroracePassUI?.close();
      containerEl = null; world = null;
    }
  };
})();
