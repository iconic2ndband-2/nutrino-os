/* FILE: gamesafe.js — Game cloud progress vault and multi-account sync */
(function() {
  let timerInterval = null, currentContainer = null;
  const K = { USER: 'gamesafe_user', USERS: 'gamesafe_users', SUB: 'gamesafe_sub', SAVES: 'gamesafe_saves', CONN: 'gamesafe_connections' };

  function getSub() {
    try { return JSON.parse(localStorage.getItem(K.SUB) || '{"isActive":false,"autoRenew":true,"secondsRemaining":20}'); }
    catch (e) { return { isActive: false, autoRenew: true, secondsRemaining: 20 }; }
  }
  function saveSub(s) { localStorage.setItem(K.SUB, JSON.stringify(s)); }

  function startSubTimer() {
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      const sub = getSub();
      if (!sub.isActive) return;
      sub.secondsRemaining = (sub.secondsRemaining || 20) - 1;
      if (sub.secondsRemaining <= 0) {
        if (sub.autoRenew && window.os?.deductBank(0.99, 'Gamesafe Subscription Renewal')) {
          sub.secondsRemaining = 20; sub.isActive = true;
          window.animations?.showToast?.('Gamesafe renewed ($0.99 / 20s)');
        } else {
          sub.isActive = false; sub.secondsRemaining = 0;
          window.animations?.showToast?.('Gamesafe subscription lapsed');
        }
      }
      saveSub(sub);
      const timerEl = document.getElementById('gs-timer-badge');
      if (timerEl) timerEl.textContent = sub.isActive ? `⏱️ Active (${sub.secondsRemaining}s)` : '❌ Inactive';
    }, 1000);
  }

  function render(container) {
    currentContainer = container;
    const user = localStorage.getItem(K.USER);
    if (!user) { renderAuth(container); return; }
    renderDashboard(container, user);
  }

  function renderAuth(c) {
    c.innerHTML = `
      <div class="gs-card gs-auth-card">
        <div class="gs-logo">🛡️</div>
        <h2 style="font-size:18px;font-weight:700;margin-bottom:4px;">Welcome to Gamesafe</h2>
        <p style="font-size:12px;color:var(--text-muted);margin-bottom:16px;">Cloud progress backup & multi-account vault</p>
        <input type="text" id="gs-user-input" class="bank-input" placeholder="Enter Username" style="margin-bottom:8px;">
        <input type="password" id="gs-pass-input" class="bank-input" placeholder="Enter Password" style="margin-bottom:12px;">
        <button id="gs-auth-btn" class="btn-primary" style="width:100%;">Sign In / Sign Up</button>
      </div>`;
    c.querySelector('#gs-auth-btn').onclick = () => {
      const u = c.querySelector('#gs-user-input').value.trim(), p = c.querySelector('#gs-pass-input').value.trim();
      if (!u || !p) { window.animations?.showToast?.('Please enter username & password'); return; }
      const users = JSON.parse(localStorage.getItem(K.USERS) || '{}');
      if (!users[u]) users[u] = p;
      localStorage.setItem(K.USERS, JSON.stringify(users));
      localStorage.setItem(K.USER, u);
      const sub = getSub();
      if (!sub.isActive && window.os?.deductBank(0.99, 'Gamesafe 20s Initial Sub')) {
        sub.isActive = true; sub.secondsRemaining = 20; saveSub(sub);
      }
      startSubTimer(); render(c);
    };
  }

  function renderDashboard(c, user) {
    const sub = getSub(), conns = JSON.parse(localStorage.getItem(K.CONN) || '[]');
    const saves = JSON.parse(localStorage.getItem(K.SAVES) || '{}');
    const isNitroInstalled = window.os?.isAppInstalled('nitrorace');
    const isNitroConn = conns.includes('nitrorace'), nrSave = saves.nitrorace;
    const is3dInstalled = window.os?.isAppInstalled('3dpapers');
    const dpAccounts = window.gamesafeDB?.getAllAccounts('3dpapers') || [];

    c.innerHTML = `
      <div class="gs-dash">
        <div class="gs-header-row">
          <div><div style="font-weight:700;font-size:15px;">🛡️ Gamesafe Vault</div><div style="font-size:11px;color:var(--text-muted);">User: ${user}</div></div>
          <div id="gs-timer-badge" class="gs-badge ${sub.isActive ? 'active' : 'inactive'}">${sub.isActive ? `⏱️ Active (${sub.secondsRemaining || 20}s)` : '❌ Inactive'}</div>
        </div>
        <div class="gs-card">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
            <span style="font-weight:600;font-size:13px;">Auto-Renew ($0.99 / 20s)</span>
            <input type="checkbox" id="gs-autorenew-toggle" ${sub.autoRenew ? 'checked' : ''}>
          </div>
          <button id="gs-renew-btn" class="btn-primary" style="width:100%;min-height:34px;font-size:12px;background:#0ea5e9;">${sub.isActive ? 'Add 20s ($0.99)' : 'Subscribe ($0.99 / 20s)'}</button>
        </div>
        <div style="font-size:13px;font-weight:700;margin:6px 0;">🎮 Cloud Saves & Apps</div>
        <div class="gs-card">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <div style="display:flex;align-items:center;gap:8px;"><span style="font-size:22px;">🏎️</span><div><div style="font-weight:600;font-size:13px;">Nitro Race</div><div style="font-size:11px;color:var(--text-muted);">${isNitroInstalled ? (isNitroConn ? 'Connected' : 'Installed') : 'Not Installed'}</div></div></div>
            ${isNitroInstalled ? `<button id="gs-conn-nr" class="btn-primary" style="min-height:32px;padding:0 12px;font-size:12px;background:${isNitroConn ? '#10b981' : '#6366f1'}">${isNitroConn ? 'Linked ✓' : 'Connect'}</button>` : '<span style="font-size:11px;color:var(--text-muted);">Store App</span>'}
          </div>
          ${nrSave ? `<div class="gs-save-preview"><strong>Saved Progress:</strong> Best: ${nrSave.highScore}m • Coins: ${nrSave.coins}</div>` : ''}
        </div>
        ${is3dInstalled ? `
        <div class="gs-card">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <div style="display:flex;align-items:center;gap:8px;"><span style="font-size:22px;">🌌</span><div><div style="font-weight:600;font-size:13px;">3DPapers Cloud</div><div style="font-size:11px;color:var(--text-muted);">${dpAccounts.length} Account(s) Synced</div></div></div>
            <span style="font-size:11px;color:#34d399;font-weight:700;">Multi-Vault ✓</span>
          </div>
          ${dpAccounts.length > 0 ? `<div class="gs-save-preview" style="margin-top:6px;"><strong>Accounts:</strong> ${dpAccounts.join(', ')}</div>` : ''}
        </div>` : ''}
        <button id="gs-logout-btn" class="btn-secondary" style="width:100%;margin-top:auto;">Log Out</button>
      </div>`;

    c.querySelector('#gs-autorenew-toggle').onchange = (e) => { const s = getSub(); s.autoRenew = e.target.checked; saveSub(s); };
    c.querySelector('#gs-renew-btn').onclick = () => {
      if (window.os?.deductBank(0.99, 'Gamesafe Manual Sub')) {
        const s = getSub(); s.isActive = true; s.secondsRemaining = (s.secondsRemaining || 0) + 20; saveSub(s);
        startSubTimer(); render(c); window.animations?.showToast?.('Subscribed to Gamesafe (+20s)');
      } else { window.animations?.showToast?.('Insufficient bank funds'); }
    };
    const connBtn = c.querySelector('#gs-conn-nr');
    if (connBtn) {
      connBtn.onclick = () => {
        let cn = JSON.parse(localStorage.getItem(K.CONN) || '[]');
        if (!cn.includes('nitrorace')) { cn.push('nitrorace'); localStorage.setItem(K.CONN, JSON.stringify(cn)); }
        window.animations?.showToast?.('Nitro Race connected to Gamesafe!');
        render(c);
      };
    }
    c.querySelector('#gs-logout-btn').onclick = () => { localStorage.removeItem(K.USER); render(c); };
  }

  window.gamesafe = {
    isSubscribed() { return getSub().isActive; },
    isConnected(gameId) { return (JSON.parse(localStorage.getItem(K.CONN) || '[]')).includes(gameId); },
    save(appKey, username, data) { return window.gamesafeDB ? window.gamesafeDB.save(appKey, username, data) : false; },
    load(appKey, username) { return window.gamesafeDB ? window.gamesafeDB.load(appKey, username) : null; },
    exists(appKey, username) { return window.gamesafeDB ? window.gamesafeDB.exists(appKey, username) : false; },
    getAllAccounts(appKey) { return window.gamesafeDB ? window.gamesafeDB.getAllAccounts(appKey) : []; },
    delete(appKey, username) { return window.gamesafeDB ? window.gamesafeDB.delete(appKey, username) : false; },
    saveGame(gameId, data) {
      if (gameId === 'nitroracese') return { success: false, message: 'Nitro Race SE is not supported yet.' };
      if (!this.isSubscribed()) return { success: false, message: 'Gamesafe subscription is inactive or expired.' };
      const saves = JSON.parse(localStorage.getItem(K.SAVES) || '{}');
      saves[gameId] = { ...data, savedAt: new Date().toISOString() };
      localStorage.setItem(K.SAVES, JSON.stringify(saves));
      return { success: true, message: 'Game progress safely backed up to Gamesafe Vault!' };
    },
    loadGame(gameId) { return (JSON.parse(localStorage.getItem(K.SAVES) || '{}'))[gameId] || null; },
    mount(container) { startSubTimer(); render(container); },
    unmount() { currentContainer = null; }
  };
})();
