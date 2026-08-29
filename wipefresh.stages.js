/* FILE: wipefresh.stages.js — Target OS version detection, wipe stage metadata & markup renderers */
(function() {
  const LATEST_BUILD = {
    version: 'v1.1.2.2',
    channel: 'Stable Release',
    kernel: 'Linux NOS 6.1.0-nutrino+',
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

  window.wipefreshStages = {
    LATEST_BUILD,
    WIPE_STAGES,

    renderDashboard() {
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
            <div class="wipe-ver-title"><span>🎯 Target Build Detection</span><span class="wipe-ver-pill">LATEST</span></div>
            <div class="wipe-ver-row"><span class="lbl">Detected Build:</span><span class="val font-bold text-brand">${osVer}</span></div>
            <div class="wipe-ver-row"><span class="lbl">Channel / Kernel:</span><span class="val">${LATEST_BUILD.channel} • ${LATEST_BUILD.kernel}</span></div>
            <div class="wipe-ver-row"><span class="lbl">Image Integrity:</span><span class="val" style="color:#34d399;">✓ ${LATEST_BUILD.status}</span></div>
            <div class="wipe-ver-row"><span class="lbl">Build Checksum:</span><span class="val font-mono" style="font-size:10px;">${LATEST_BUILD.checksum}</span></div>
          </div>

          <div class="wipe-warning-card">
            <div style="font-weight:700;color:#f87171;margin-bottom:6px;display:flex;align-items:center;gap:6px;"><span>⚠️</span> What happens during Full Clean Wipe:</div>
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
              <div style="font-size:11px;color:#bae6fd;"><strong>Gamesafe Vault Detected:</strong> You have an active Gamesafe cloud subscription. You can preserve game progress during this factory reset.</div>
            </div>
            <div class="wipe-actions" style="flex-direction:column;gap:8px;width:100%;margin-top:auto;">
              <button id="wipe-keep-btn" class="btn-primary" style="background:#0ea5e9;min-height:38px;">🛡️ Keep Savegame & Fresh Wipe</button>
              <button id="wipe-all-btn" class="btn-primary" style="background:#ef4444;min-height:38px;">💥 Full Wipe (Clean Start All)</button>
              <button id="wipe-cancel-btn" class="btn-secondary" style="width:100%;min-height:34px;">Cancel</button>
            </div>` : `
            <div class="wipe-actions" style="margin-top:auto;display:flex;gap:10px;width:100%;">
              <button id="wipe-cancel-btn" class="btn-secondary" style="flex:1;min-height:38px;">Cancel</button>
              <button id="wipe-confirm-btn" class="btn-primary" style="flex:1;background:#ef4444;min-height:38px;">💥 Full Wipe & Reboot</button>
            </div>`}
        </div>`;
    },

    renderWipeAnimation(stageIndex, pct, logLines) {
      const stage = WIPE_STAGES[stageIndex] || WIPE_STAGES[0];
      const logHtml = logLines.map(l => `<div class="wipe-log-row"><span class="wipe-log-time">${l.time}</span> <span class="wipe-log-text">${l.text}</span></div>`).join('');

      return `
        <div class="wipe-exec-root">
          <div class="wipe-exec-scanline"></div>
          <div class="wipe-exec-top"><div class="wipe-exec-logo">⚡ NUTRINO RECOVERY ENGINE</div><div class="wipe-exec-ver">${LATEST_BUILD.version} CLEAN RE-FLASH</div></div>
          <div class="wipe-stage-card" style="border-color:${stage.color}88;"><div class="wipe-stage-badge" style="background:${stage.color};">${stage.title}</div><div class="wipe-stage-desc">${stage.desc}</div></div>
          <div class="wipe-step-row">${WIPE_STAGES.map((s, i) => `<div class="wipe-step-pip ${i < stageIndex ? 'done' : (i === stageIndex ? 'active' : '')}" style="${i === stageIndex ? `border-color:${stage.color};box-shadow:0 0 10px ${stage.color};` : ''}">${i < stageIndex ? '✓' : i + 1}</div>`).join('')}</div>
          <div class="wipe-prog-container"><div class="wipe-prog-meta"><span id="wipe-exec-pct">${pct}% Completed</span><span style="color:${stage.color};font-weight:700;">ACTIVE</span></div><div class="wipe-prog-track"><div class="wipe-prog-bar" style="width:${pct}%;background:${stage.color};"></div></div></div>
          <div class="wipe-term-box"><div class="wipe-term-header"><span>● ● ● KERNEL CONSOLE</span><span>ttyS0 • 115200</span></div><div class="wipe-term-logs" id="wipe-term-scroll">${logHtml}</div></div>
        </div>`;
    }
  };
})();
