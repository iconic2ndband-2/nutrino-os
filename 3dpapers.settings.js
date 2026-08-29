/* FILE: 3dpapers.settings.js — 3DPapers settings modal and multi-account inspector */
(function() {
  window.threeDPapersSettings = {
    open(container, user, onSave) {
      const modalHost = container.querySelector('#p3d-modal-host') || container;
      const modalEl = document.createElement('div');
      modalEl.className = 'p3d-modal-backdrop';
      const autoRenew = user.subscription?.autoRenew ?? true;
      const accounts = window.gamesafeDB?.getAllAccounts('3dpapers') || [];

      modalEl.innerHTML = `
        <div class="p3d-modal-card">
          <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid rgba(255,255,255,0.08);padding-bottom:6px;">
            <span style="font-size:13px;font-weight:700;color:#fff;">⚙️ 3DPapers Settings</span>
            <button id="p3d-close-settings" style="background:none;border:none;color:#94a3b8;cursor:pointer;font-size:16px;">✕</button>
          </div>
          <div style="display:flex;flex-direction:column;gap:10px;">
            <div style="display:flex;justify-content:space-between;align-items:center;background:rgba(255,255,255,0.05);padding:8px 10px;border-radius:8px;">
              <div><div style="font-size:12px;font-weight:700;">Auto-Renew Wallpaper</div><div style="font-size:10px;color:#94a3b8;">Silent renewal via SuperBank</div></div>
              <input type="checkbox" id="p3d-toggle-renew" ${autoRenew ? 'checked' : ''}>
            </div>
            <div style="background:rgba(255,255,255,0.05);padding:8px 10px;border-radius:8px;">
              <div style="font-size:12px;font-weight:700;color:#38bdf8;">👥 Multi-Account Vault</div>
              <div style="font-size:10px;color:#cbd5e1;margin-top:2px;">Accounts: ${accounts.join(', ') || user.username}</div>
            </div>
            <button id="p3d-opt-out-btn" class="btn-secondary" style="font-size:11px;color:#f87171;border-color:rgba(239,68,68,0.3);">Opt-Out of Live Subscriptions</button>
          </div>
        </div>`;

      modalEl.querySelector('#p3d-close-settings').onclick = () => modalEl.remove();
      modalEl.querySelector('#p3d-toggle-renew').onchange = (e) => {
        user.subscription = user.subscription || {};
        user.subscription.autoRenew = e.target.checked;
        onSave(user);
      };
      modalEl.querySelector('#p3d-opt-out-btn').onclick = () => {
        user.subscription = user.subscription || {};
        user.subscription.autoRenew = false; user.subscription.active = false;
        onSave(user);
        window.animations?.showToast?.('Opted out of live auto-renewals');
        modalEl.remove();
      };
      modalHost.appendChild(modalEl);
    }
  };
})();
