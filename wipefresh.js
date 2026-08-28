/* FILE: wipefresh.js — Factory Reset and System Rejuvenation tool */
(function() {
  let currentContainer = null;
  let resetTimer = null;

  function renderConfirmation() {
    return `
      <div class="wipe-container">
        <div class="wipe-icon">⚠️</div>
        <h2 class="wipe-title">Factory Reset</h2>
        <div class="wipe-warning-card">
          <p><strong>Warning:</strong> This action will erase all user data permanently:</p>
          <ul class="wipe-list">
            <li>IndexedDB storage (Notes & Photos)</li>
            <li>Custom Theme, Wallpaper & Brightness</li>
            <li>SuperBank balance & transaction history</li>
            <li>Internet plan subscriptions & data stats</li>
            <li>Downloaded user applications</li>
          </ul>
        </div>
        <p class="wipe-prompt">Are you sure you want to continue?</p>
        <div class="wipe-actions">
          <button id="wipe-cancel-btn" class="btn-primary" style="background:#475569;">Cancel</button>
          <button id="wipe-confirm-btn" class="btn-primary" style="background:#ef4444;">Erase Everything</button>
        </div>
      </div>
    `;
  }

  function renderResettingProgress() {
    return `
      <div class="wipe-container" style="justify-content:center; gap: 20px;">
        <div class="wipe-spinner"></div>
        <h2 class="wipe-title" id="wipe-status-text">Erasing storage partitions...</h2>
        <div style="font-size: 13px; color: var(--text-muted);">Please wait while Nutrino OS restores factory state</div>
      </div>
    `;
  }

  function renderWelcomeScreen() {
    return `
      <div class="wipe-container" style="justify-content:center; gap: 16px;">
        <div style="font-size: 48px;">✨</div>
        <h2 class="wipe-title" style="color: #10b981;">Welcome to Nutrino OS v1.1</h2>
        <div style="font-size: 14px; color: var(--text-muted); text-align:center;">Factory reset complete. Your device is refreshed.</div>
      </div>
    `;
  }

  async function executeFactoryReset() {
    currentContainer.innerHTML = renderResettingProgress();
    const statusText = currentContainer.querySelector('#wipe-status-text');

    setTimeout(async () => {
      if (statusText) statusText.textContent = 'Clearing database stores...';
      if (window.store && typeof window.store.clearAll === 'function') {
        try { await window.store.clearAll(); } catch (e) { console.warn(e); }
      }

      setTimeout(() => {
        if (statusText) statusText.textContent = 'Resetting system preferences...';
        if (window.os && typeof window.os.resetFactory === 'function') {
          window.os.resetFactory();
        }

        setTimeout(() => {
          currentContainer.innerHTML = renderWelcomeScreen();
          resetTimer = setTimeout(() => {
            window.os.boot();
          }, 1500);
        }, 800);
      }, 700);
    }, 600);
  }

  window.wipefreshApp = {
    mount(container) {
      currentContainer = container;
      container.innerHTML = renderConfirmation();

      const cancelBtn = container.querySelector('#wipe-cancel-btn');
      const confirmBtn = container.querySelector('#wipe-confirm-btn');

      if (cancelBtn) {
        cancelBtn.onclick = () => window.os.goBack();
      }

      if (confirmBtn) {
        confirmBtn.onclick = () => executeFactoryReset();
      }
    },

    unmount() {
      if (resetTimer) clearTimeout(resetTimer);
      currentContainer = null;
    }
  };
})();
