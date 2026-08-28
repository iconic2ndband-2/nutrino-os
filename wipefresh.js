/* FILE: wipefresh.js — Factory Reset, Version Detection, 5-stage Animated Wipe & Godrays Reboot */
(function() {
  let currentContainer = null;
  let activeInterval = null;
  let activeRebootAnim = null;

  const LATEST_BUILD = {
    version: 'v1.1.2.1',
    channel: 'Stable Release',
    kernel: 'Linux NOS 6.9.1-nutrino-arm64',
    buildDate: 'August 28, 2026',
    checksum: 'SHA256:7f8a91c0e84b23...d91a',
    status: 'Verified Clean Image Ready'
  };

  const WIPE_STAGES = [
    { title: 'Stage 1/5: Unmounting Storage & Services', desc: 'Closing background daemons, unlinking installed applications and killing sandbox locks...', color: '#f59e0b' },
    { title: 'Stage 2/5: Cryptographic Data & Partition Purge', desc: 'Securely overwriting user sectors (IndexedDB, notes, gallery, tokens, credentials)...', color: '#ef4444' },
    { title: 'Stage 3/5: Verifying Target Firmware Build', desc: `Validating kernel payload for ${LATEST_BUILD.version} against cryptographic checksums...`, color: '#38bdf8' },
    { title: 'Stage 4/5: Restoring Factory OS Manifest', desc: 'Writing clean default registries, SuperBank core database, and default themes...', color: '#a855f7' },
    { title: 'Stage 5/5: Finalizing Storage & Clean State', desc: 'Compacting virtual system partitions and preparing clean bootstrap sequence...', color: '#10b981' }
  ];

  function renderDashboard() {
    const isGamesafeActive = window.os?.checkGamesafeSubscription?.() || false;
    const installedApps = window.os?.state?.installedApps || [];
    const osVer = window.CONSTANTS?.OS_VERSION || LATEST_BUILD.version;

    return `
      <div class="wipe-container" style="overflow-y:auto;text-align:left;padding:12px 10px;">
        <div class="wipe-dash-header">
          <div style="display:flex;align-items:center;gap:10px;">
            <div class="wipe-dash-icon">⚡</div>
            <div>
              <div style="font-size:16px;font-weight:800;color:#fff;">Wipe Fresh & Rejuvenate</div>
              <div style="font-size:11px;color:var(--text-muted);">Nutrino OS Recovery & Clean Installation Engine</div>
            </div>
          </div>
          <span class="wipe-status-badge">RECOVERY READY</span>
        </div>

        <div class="wipe-ver-card">
          <div class="wipe-ver-title">
            <span>🎯 Target Build Detection</span>
            <span class="wipe-ver-pill">LATEST</span>
          </div>
          <div class="wipe-ver-row">
            <span class="lbl">Detected Build:</span>
            <span class="val font-bold text-brand">${osVer}</span>
          </div>
          <div class="wipe-ver-row">
            <span class="lbl">Channel / Kernel:</span>
            <span class="val">${LATEST_BUILD.channel} • ${LATEST_BUILD.kernel}</span>
          </div>
          <div class="wipe-ver-row">
            <span class="lbl">Image Integrity:</span>
            <span class="val" style="color:#34d399;">✓ ${LATEST_BUILD.status}</span>
          </div>
          <div class="wipe-ver-row">
            <span class="lbl">Build Checksum:</span>
            <span class="val font-mono" style="font-size:10px;">${LATEST_BUILD.checksum}</span>
          </div>
        </div>

        <div class="wipe-warning-card">
          <div style="font-weight:700;color:#f87171;margin-bottom:6px;display:flex;align-items:center;gap:6px;">
            <span>⚠️</span> What happens during Full Clean Wipe:
          </div>
          <ul class="wipe-list" style="margin-left:16px;color:#cbd5e1;font-size:11px;line-height:1.6;">
            <li>All user documents, notes and camera photos erased</li>
            <li>All downloaded apps (${installedApps.length} installed) uninstalled</li>
            <li>SuperBank balance restored to initial $100 starting funds</li>
            <li>Internet subscriptions reset to Free standard tier</li>
            <li>System flashes clean kernel image (${LATEST_BUILD.version}) & reboots</li>
          </ul>
        </div>

        ${isGamesafeActive ? `
          <div class="wipe-gs-notice" style="display:flex;gap:10px;align-items:center;background:rgba(56,189,248,0.12);border:1px solid rgba(56,189,248,0.3);border-radius:12px;padding:10px;margin-bottom:12px;">
            <span style="font-size:24px;">🛡️</span>
            <div style="font-size:11px;color:#bae6fd;">
              <strong>Gamesafe Vault Detected:</strong> You have an active Gamesafe cloud subscription. You can preserve game progress during this factory reset.
            </div>
          </div>
          <div class="wipe-actions" style="flex-direction:column;gap:8px;width:100%;margin-top:auto;">
            <button id="wipe-keep-btn" class="btn-primary" style="background:#0ea5e9;min-height:38px;">🛡️ Keep Savegame & Fresh Wipe</button>
            <button id="wipe-all-btn" class="btn-primary" style="background:#ef4444;min-height:38px;">💥 Full Wipe (Clean Start All)</button>
            <button id="wipe-cancel-btn" class="btn-secondary" style="width:100%;min-height:34px;">Cancel</button>
          </div>
        ` : `
          <div class="wipe-actions" style="margin-top:auto;display:flex;gap:10px;width:100%;">
            <button id="wipe-cancel-btn" class="btn-secondary" style="flex:1;min-height:38px;">Cancel</button>
            <button id="wipe-confirm-btn" class="btn-primary" style="flex:1;background:#ef4444;min-height:38px;">💥 Full Wipe & Reboot</button>
          </div>
        `}
      </div>
    `;
  }

  function renderWipeAnimation(stageIndex, pct, logLines) {
    const stage = WIPE_STAGES[stageIndex] || WIPE_STAGES[0];
    const logHtml = logLines.map(l => `<div class="wipe-log-row"><span class="wipe-log-time">${l.time}</span> <span class="wipe-log-text">${l.text}</span></div>`).join('');

    return `
      <div class="wipe-exec-root">
        <div class="wipe-exec-scanline"></div>
        <div class="wipe-exec-top">
          <div class="wipe-exec-logo">⚡ NUTRINO RECOVERY ENGINE</div>
          <div class="wipe-exec-ver">${LATEST_BUILD.version} CLEAN RE-FLASH</div>
        </div>

        <div class="wipe-stage-card" style="border-color:${stage.color}88;">
          <div class="wipe-stage-badge" style="background:${stage.color};">${stage.title}</div>
          <div class="wipe-stage-desc">${stage.desc}</div>
        </div>

        <!-- 5-Stage Step Indicators -->
        <div class="wipe-step-row">
          ${WIPE_STAGES.map((s, i) => `
            <div class="wipe-step-pip ${i < stageIndex ? 'done' : (i === stageIndex ? 'active' : '')}" style="${i === stageIndex ? `border-color:${stage.color};box-shadow:0 0 10px ${stage.color};` : ''}">
              ${i < stageIndex ? '✓' : i + 1}
            </div>
          `).join('')}
        </div>

        <!-- Progress Bar -->
        <div class="wipe-prog-container">
          <div class="wipe-prog-meta">
            <span id="wipe-exec-pct">${pct}% Completed</span>
            <span style="color:${stage.color};font-weight:700;">ACTIVE</span>
          </div>
          <div class="wipe-prog-track">
            <div class="wipe-prog-bar" style="width:${pct}%;background:${stage.color};"></div>
          </div>
        </div>

        <!-- Terminal Output Window -->
        <div class="wipe-term-box">
          <div class="wipe-term-header">
            <span>● ● ● KERNEL CONSOLE</span>
            <span>ttyS0 • 115200</span>
          </div>
          <div class="wipe-term-logs" id="wipe-term-scroll">
            ${logHtml}
          </div>
        </div>
      </div>
    `;
  }

  async function executeWipeSequence(keepGamesafe = false) {
    if (!currentContainer) return;
    if (activeInterval) clearInterval(activeInterval);

    let stageIdx = 0;
    let overallPct = 0;
    const logs = [];

    const addLog = (text) => {
      const now = new Date();
      const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}.${String(Math.floor(now.getMilliseconds() / 10)).padStart(2, '0')}`;
      logs.push({ time, text });
      if (logs.length > 25) logs.shift();
    };

    addLog('System reset requested by user.');
    addLog(`Target OS: ${LATEST_BUILD.version} (${LATEST_BUILD.channel})`);
    if (keepGamesafe) addLog('[Vault] Preserving Gamesafe cloud tokens and game save payloads.');

    currentContainer.innerHTML = renderWipeAnimation(stageIdx, overallPct, logs);

    // Total wipe animation runs through 5 distinct timed phases (approx ~3.5s)
    const totalDurationMs = 3600;
    const startTime = Date.now();

    activeInterval = setInterval(async () => {
      const elapsed = Date.now() - startTime;
      overallPct = Math.min(100, Math.round((elapsed / totalDurationMs) * 100));

      const newStageIdx = Math.min(4, Math.floor((overallPct / 100) * 5));
      if (newStageIdx !== stageIdx) {
        stageIdx = newStageIdx;
        if (stageIdx === 1) {
          addLog('Wiping partitions: /data /cache /system_state');
          if (window.store && typeof window.store.clearAll === 'function') {
            try { await window.store.clearAll(); } catch (e) {}
          }
        } else if (stageIdx === 2) {
          addLog(`Verifying SHA256 integrity of clean kernel image ${LATEST_BUILD.version}...`);
          addLog('Checksum matched: OK (0 errors detected)');
        } else if (stageIdx === 3) {
          addLog('Restoring clean factory state & SuperBank balances...');
          if (window.os?.resetFactory) window.os.resetFactory(keepGamesafe);
        } else if (stageIdx === 4) {
          addLog('Flashing completed. Synchronizing hardware clock and file tables.');
          addLog('Triggering cold restart sequence...');
        }
      }

      currentContainer.innerHTML = renderWipeAnimation(stageIdx, overallPct, logs);
      const termScroll = currentContainer.querySelector('#wipe-term-scroll');
      if (termScroll) termScroll.scrollTop = termScroll.scrollHeight;

      if (elapsed >= totalDurationMs) {
        clearInterval(activeInterval);
        activeInterval = null;
        launchGodraysRebootSequence();
      }
    }, 120);
  }

  // 3-Second Cinematic Godrays Reboot Animation
  function launchGodraysRebootSequence() {
    const rootEl = document.getElementById('os-root') || document.body;
    let rebootOverlay = document.getElementById('os-godrays-reboot');
    if (!rebootOverlay) {
      rebootOverlay = document.createElement('div');
      rebootOverlay.id = 'os-godrays-reboot';
      rebootOverlay.className = 'godrays-reboot-overlay';
      rootEl.appendChild(rebootOverlay);
    }

    rebootOverlay.innerHTML = `
      <canvas id="godrays-canvas" class="godrays-canvas"></canvas>
      <div class="godrays-content">
        <div class="godrays-core-badge">
          <div class="godrays-logo-glow">⚡</div>
        </div>
        <div class="godrays-title">NUTRINO OS</div>
        <div class="godrays-version">${LATEST_BUILD.version}</div>
        <div class="godrays-status-bar">
          <div class="godrays-status-fill"></div>
        </div>
        <div class="godrays-subtitle" id="godrays-sub-text">INITIALIZING CLEAN SESSION...</div>
      </div>
    `;
    rebootOverlay.style.display = 'flex';

    const canvas = rebootOverlay.querySelector('#godrays-canvas');
    const subText = rebootOverlay.querySelector('#godrays-sub-text');
    let ctx = null;
    if (canvas) {
      canvas.width = rootEl.clientWidth || 360;
      canvas.height = rootEl.clientHeight || 700;
      ctx = canvas.getContext('2d');
    }

    let angle = 0;
    const rebootStart = Date.now();
    const duration = 3000; // Exact 3-second reboot sequence

    function drawGodrays() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2 - 30;
      const maxRadius = Math.max(canvas.width, canvas.height) * 1.2;

      // Dark futuristic radial background
      const bgGrad = ctx.createRadialGradient(cx, cy, 20, cx, cy, maxRadius);
      bgGrad.addColorStop(0, '#1e1b4b');
      bgGrad.addColorStop(0.5, '#09090b');
      bgGrad.addColorStop(1, '#000000');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw rotating Volumetric Godrays
      const rayCount = 18;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle);

      for (let i = 0; i < rayCount; i++) {
        const rayAngle = (i * (Math.PI * 2)) / rayCount;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, maxRadius, rayAngle - 0.08, rayAngle + 0.08);
        ctx.closePath();

        const rayGrad = ctx.createRadialGradient(0, 0, 10, 0, 0, maxRadius);
        rayGrad.addColorStop(0, 'rgba(99, 102, 241, 0.45)');
        rayGrad.addColorStop(0.4, 'rgba(168, 85, 247, 0.25)');
        rayGrad.addColorStop(0.8, 'rgba(14, 165, 233, 0.1)');
        rayGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = rayGrad;
        ctx.fill();
      }
      ctx.restore();

      // Outer light shimmer ring
      ctx.beginPath();
      ctx.arc(cx, cy, 70 + Math.sin(angle * 4) * 8, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(129, 140, 248, 0.35)';
      ctx.lineWidth = 3;
      ctx.stroke();

      angle += 0.035;

      const elapsed = Date.now() - rebootStart;
      if (subText) {
        if (elapsed < 1000) subText.textContent = 'BOOTING CLEAN KERNEL...';
        else if (elapsed < 2000) subText.textContent = 'STARTING COMPOSITOR & UI SHELL...';
        else subText.textContent = 'WELCOME TO NUTRINO OS';
      }

      if (elapsed < duration) {
        activeRebootAnim = requestAnimationFrame(drawGodrays);
      } else {
        // Complete reboot
        if (activeRebootAnim) cancelAnimationFrame(activeRebootAnim);
        rebootOverlay.classList.add('fade-out');
        setTimeout(async () => {
          rebootOverlay.style.display = 'none';
          rebootOverlay.classList.remove('fade-out');
          if (window.os?.boot) {
            await window.os.boot();
            window.animations?.showToast?.(`✨ Clean session started with ${LATEST_BUILD.version}`);
          }
        }, 350);
      }
    }

    drawGodrays();
  }

  window.wipefreshApp = {
    mount(container) {
      currentContainer = container;
      container.innerHTML = renderDashboard();

      const cancelBtn = container.querySelector('#wipe-cancel-btn');
      if (cancelBtn) cancelBtn.onclick = () => window.os?.goBack?.();

      const confirmBtn = container.querySelector('#wipe-confirm-btn');
      if (confirmBtn) {
        confirmBtn.onclick = () => {
          if (window.confirmModal) {
            window.confirmModal.show({
              title: 'Confirm Full Wipe & Reinstall',
              message: `This will erase all user content and restart a clean session on ${LATEST_BUILD.version}. Proceed?`,
              icon: '💥',
              confirmText: 'Wipe & Clean Reboot',
              cancelText: 'Cancel',
              isDestructive: true,
              onConfirm: () => executeWipeSequence(false)
            });
          } else {
            executeWipeSequence(false);
          }
        };
      }

      const keepBtn = container.querySelector('#wipe-keep-btn');
      if (keepBtn) {
        keepBtn.onclick = () => {
          if (window.confirmModal) {
            window.confirmModal.show({
              title: 'Preserve Gamesafe & Wipe OS',
              message: 'Factory reset will erase user files but retain your Gamesafe cloud credentials and saves.',
              icon: '🛡️',
              confirmText: 'Wipe & Keep Saves',
              cancelText: 'Cancel',
              isDestructive: false,
              onConfirm: () => executeWipeSequence(true)
            });
          } else {
            executeWipeSequence(true);
          }
        };
      }

      const allBtn = container.querySelector('#wipe-all-btn');
      if (allBtn) {
        allBtn.onclick = () => {
          if (window.confirmModal) {
            window.confirmModal.show({
              title: 'Full Erase All (Including Saves)',
              message: 'Are you sure? This will wipe EVERYTHING, including Gamesafe saves and all data.',
              icon: '⚠️',
              confirmText: 'Erase Everything',
              cancelText: 'Cancel',
              isDestructive: true,
              onConfirm: () => executeWipeSequence(false)
            });
          } else {
            executeWipeSequence(false);
          }
        };
      }
    },

    unmount() {
      if (activeInterval) { clearInterval(activeInterval); activeInterval = null; }
      if (activeRebootAnim) { cancelAnimationFrame(activeRebootAnim); activeRebootAnim = null; }
      currentContainer = null;
    }
  };
})();
