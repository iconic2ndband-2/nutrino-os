/* FILE: wipefresh.js — Factory Reset execution manager & modal triggers */
(function() {
  let currentContainer = null;
  let activeInterval = null;

  async function executeWipeSequence(keepGamesafe = false) {
    if (!currentContainer) return;
    if (activeInterval) clearInterval(activeInterval);

    let stageIdx = 0, overallPct = 0;
    const logs = [];
    const build = window.wipefreshStages.LATEST_BUILD;

    const addLog = (text) => {
      const now = new Date();
      const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}.${String(Math.floor(now.getMilliseconds() / 10)).padStart(2, '0')}`;
      logs.push({ time, text });
      if (logs.length > 25) logs.shift();
    };

    addLog('System reset requested by user.');
    addLog(`Target OS: ${build.version} (${build.channel})`);
    if (keepGamesafe) addLog('[Vault] Preserving Gamesafe cloud tokens and game save payloads.');

    currentContainer.innerHTML = window.wipefreshStages.renderWipeAnimation(stageIdx, overallPct, logs);
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
          if (window.store && typeof window.store.clearAll === 'function') try { await window.store.clearAll(); } catch (e) {}
        } else if (stageIdx === 2) {
          addLog(`Verifying SHA256 integrity of clean kernel image ${build.version}...`);
          addLog('Checksum matched: OK (0 errors detected)');
        } else if (stageIdx === 3) {
          addLog('Restoring clean factory state & SuperBank balances...');
          if (window.os?.resetFactory) window.os.resetFactory(keepGamesafe);
        } else if (stageIdx === 4) {
          addLog('Flashing completed. Synchronizing hardware clock and file tables.');
          addLog('Triggering cold restart sequence...');
        }
      }

      currentContainer.innerHTML = window.wipefreshStages.renderWipeAnimation(stageIdx, overallPct, logs);
      const termScroll = currentContainer.querySelector('#wipe-term-scroll');
      if (termScroll) termScroll.scrollTop = termScroll.scrollHeight;

      if (elapsed >= totalDurationMs) {
        clearInterval(activeInterval);
        activeInterval = null;
        window.wipefreshReboot?.launch(build.version);
      }
    }, 120);
  }

  window.wipefreshApp = {
    mount(container) {
      currentContainer = container;
      container.innerHTML = window.wipefreshStages.renderDashboard();
      const build = window.wipefreshStages.LATEST_BUILD;

      const cancelBtn = container.querySelector('#wipe-cancel-btn');
      if (cancelBtn) cancelBtn.onclick = () => window.os?.goBack?.();

      const confirmBtn = container.querySelector('#wipe-confirm-btn');
      if (confirmBtn) {
        confirmBtn.onclick = () => {
          if (window.confirmModal) {
            window.confirmModal.show({
              title: 'Confirm Full Wipe & Reinstall',
              message: `This will erase all user content and restart a clean session on ${build.version}. Proceed?`,
              icon: '💥', confirmText: 'Wipe & Clean Reboot', cancelText: 'Cancel', isDestructive: true,
              onConfirm: () => executeWipeSequence(false)
            });
          } else { executeWipeSequence(false); }
        };
      }

      const keepBtn = container.querySelector('#wipe-keep-btn');
      if (keepBtn) {
        keepBtn.onclick = () => {
          if (window.confirmModal) {
            window.confirmModal.show({
              title: 'Preserve Gamesafe & Wipe OS',
              message: 'Factory reset will erase user files but retain your Gamesafe cloud credentials and saves.',
              icon: '🛡️', confirmText: 'Wipe & Keep Saves', cancelText: 'Cancel', isDestructive: false,
              onConfirm: () => executeWipeSequence(true)
            });
          } else { executeWipeSequence(true); }
        };
      }

      const allBtn = container.querySelector('#wipe-all-btn');
      if (allBtn) {
        allBtn.onclick = () => {
          if (window.confirmModal) {
            window.confirmModal.show({
              title: 'Full Erase All (Including Saves)',
              message: 'Are you sure? This will wipe EVERYTHING, including Gamesafe saves and all data.',
              icon: '⚠️', confirmText: 'Erase Everything', cancelText: 'Cancel', isDestructive: true,
              onConfirm: () => executeWipeSequence(false)
            });
          } else { executeWipeSequence(false); }
        };
      }
    },

    unmount() {
      if (activeInterval) { clearInterval(activeInterval); activeInterval = null; }
      if (window.wipefreshReboot?.cancel) window.wipefreshReboot.cancel();
      currentContainer = null;
    }
  };
})();
