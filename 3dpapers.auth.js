/* FILE: 3dpapers.auth.js — 2-step Login/Signup and Gamesafe multi-account auth manager */
(function() {
  let containerEl = null, onAuthCallback = null, pendingUser = '', pendingPass = '';

  function renderStep1() {
    containerEl.innerHTML = `
      <div class="p3d-modal-backdrop">
        <div class="p3d-modal-card">
          <div style="text-align:center;margin-bottom:4px;">
            <span style="font-size:32px;">🌌</span>
            <h3 style="font-size:17px;font-weight:800;color:#fff;margin-top:6px;">3DPapers Cloud Login</h3>
            <p style="font-size:11px;color:#94a3b8;">Enter credentials to connect to Gamesafe Vault</p>
          </div>
          <div style="display:flex;flex-direction:column;gap:8px;">
            <input type="text" id="p3d-user-in" class="bank-input" placeholder="Username (e.g. nova_pilot)" value="${pendingUser}">
            <input type="password" id="p3d-pass-in" class="bank-input" placeholder="Password">
            <div id="p3d-auth-err" style="font-size:11px;color:#f87171;min-height:16px;"></div>
            <button id="p3d-step1-btn" class="btn-primary" style="background:#8b5cf6;min-height:36px;width:100%;">Continue →</button>
          </div>
          <div style="font-size:10px;color:#64748b;text-align:center;line-height:1.4;">
            Existing accounts subject to $50 Re-login Fee.<br>New accounts are 100% Free!
          </div>
        </div>
      </div>`;

    const errEl = containerEl.querySelector('#p3d-auth-err');
    containerEl.querySelector('#p3d-step1-btn').onclick = () => {
      const u = containerEl.querySelector('#p3d-user-in').value.trim();
      const p = containerEl.querySelector('#p3d-pass-in').value.trim();
      if (!u || !p) { errEl.textContent = 'Please enter both username and password'; return; }
      pendingUser = u; pendingPass = p;

      const exists = window.gamesafe?.exists?.('3dpapers', u);
      if (exists) {
        const savedData = window.gamesafe?.load?.('3dpapers', u);
        if (savedData && savedData.password && savedData.password !== p) {
          errEl.textContent = 'Incorrect password for existing account';
          return;
        }
        // Existing account -> Charge $50 re-login fee
        const chargeRes = window.os?.chargeForReLogin?.();
        if (!chargeRes?.success) {
          errEl.textContent = chargeRes?.message || 'Insufficient funds. Re-login fee: $50';
          return;
        }
        window.animations?.showToast?.('Re-login fee: $50 deducted');
        savedData.loginCount = (savedData.loginCount || 0) + 1;
        savedData.lastLoginDate = new Date().toISOString();
        window.gamesafe?.save?.('3dpapers', u, savedData);
        if (onAuthCallback) onAuthCallback(savedData);
      } else {
        // New Account -> Go to Step 2
        renderStep2();
      }
    };
  }

  function renderStep2() {
    containerEl.innerHTML = `
      <div class="p3d-modal-backdrop">
        <div class="p3d-modal-card">
          <div style="text-align:center;margin-bottom:4px;">
            <span style="font-size:28px;">✨</span>
            <h3 style="font-size:16px;font-weight:800;color:#fff;margin-top:4px;">New Account Detected</h3>
            <p style="font-size:11px;color:#34d399;font-weight:600;">Welcome! First-time registration is FREE</p>
          </div>
          <div style="display:flex;flex-direction:column;gap:8px;">
            <div style="font-size:12px;color:#cbd5e1;background:rgba(255,255,255,0.05);padding:6px 10px;border-radius:8px;">
              Username: <strong>${pendingUser}</strong>
            </div>
            <input type="password" id="p3d-confirm-pass" class="bank-input" placeholder="Confirm Password">
            <div id="p3d-auth-err2" style="font-size:11px;color:#f87171;min-height:16px;"></div>
            <div style="display:flex;gap:8px;">
              <button id="p3d-back-step1" class="btn-secondary" style="flex:1;">Back</button>
              <button id="p3d-create-acc-btn" class="btn-primary" style="flex:2;background:#10b981;">Create Account (Free)</button>
            </div>
          </div>
        </div>
      </div>`;

    const errEl = containerEl.querySelector('#p3d-auth-err2');
    containerEl.querySelector('#p3d-back-step1').onclick = () => renderStep1();
    containerEl.querySelector('#p3d-create-acc-btn').onclick = () => {
      const confirmP = containerEl.querySelector('#p3d-confirm-pass').value.trim();
      if (!confirmP) { errEl.textContent = 'Please confirm your password'; return; }
      if (confirmP !== pendingPass) { errEl.textContent = 'Passwords do not match'; return; }

      const newAccount = {
        username: pendingUser,
        password: pendingPass,
        purchasedWallpapers: [],
        totalSpending: 0,
        activeWallpaperId: 'nebula',
        subscription: { autoRenew: true, active: false, expiresAt: null, secondsRemaining: 0 },
        loginCount: 1,
        createdAt: new Date().toISOString(),
        lastLoginDate: new Date().toISOString()
      };
      window.gamesafe?.save?.('3dpapers', pendingUser, newAccount);
      window.animations?.showToast?.(`Account "${pendingUser}" created!`);
      if (onAuthCallback) onAuthCallback(newAccount);
    };
  }

  window.threeDPapersAuth = {
    render(container, onAuth) {
      containerEl = container;
      onAuthCallback = onAuth;
      pendingUser = ''; pendingPass = '';
      renderStep1();
    }
  };
})();
