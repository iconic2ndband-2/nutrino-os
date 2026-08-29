/* FILE: 3dpapers.js — 3DPapers core application coordinator and session manager */
(function() {
  let currentContainer = null, currentUser = null, renewInterval = null;
  const K_SESSION = '3dpapers_active_user';

  function getWallpapers() { return window.CONSTANTS?.WALLPAPERS_3D || []; }

  function saveUser(user) {
    if (!user || !user.username) return;
    currentUser = user;
    localStorage.setItem(K_SESSION, user.username);
    window.gamesafe?.save?.('3dpapers', user.username, user);
  }

  function startDurationTimer() {
    if (renewInterval) clearInterval(renewInterval);
    renewInterval = setInterval(() => {
      if (!currentUser || !currentUser.subscription?.active) return;
      const sub = currentUser.subscription;
      sub.secondsRemaining = (sub.secondsRemaining || 10) - 1;
      if (sub.secondsRemaining <= 0) {
        const wallpapers = getWallpapers();
        const activeWp = wallpapers.find(w => w.id === currentUser.activeWallpaperId) || wallpapers[0];
        if (sub.autoRenew && activeWp) {
          const cost = activeWp.price;
          const ok = window.os?.deductBank?.(cost, `3DPapers Auto-Renew: ${activeWp.name}`);
          if (ok) {
            currentUser.totalSpending = (currentUser.totalSpending || 0) + cost;
            sub.secondsRemaining = activeWp.duration;
            saveUser(currentUser);
            if (currentContainer && currentUser) renderMain();
          } else { sub.active = false; sub.secondsRemaining = 0; saveUser(currentUser); }
        } else { sub.active = false; sub.secondsRemaining = 0; saveUser(currentUser); }
      }
    }, 1000);
  }

  function renderMain() {
    if (!currentContainer || !currentUser) return;
    window.threeDPapersUI.render(currentContainer, currentUser, getWallpapers(), {
      onSave: (u) => { saveUser(u); renderMain(); },
      onLogout: () => {
        currentUser = null; localStorage.removeItem(K_SESSION);
        if (renewInterval) { clearInterval(renewInterval); renewInterval = null; }
        if (window.threeDPapersWallpapers) window.threeDPapersWallpapers.stop();
        window.threeDPapersUpdate?.clearTimer?.();
        window.threeDPapersAuth.render(currentContainer, (u) => { currentUser = u; saveUser(u); renderMain(); });
      },
      onPurchaseRequest: (wp, host) => {
        window.threeDPapersPay.open(host, wp, currentUser, (payRes) => {
          currentUser.totalSpending = (currentUser.totalSpending || 0) + payRes.cost;
          if (!currentUser.purchasedWallpapers.includes(wp.id)) currentUser.purchasedWallpapers.push(wp.id);
          currentUser.activeWallpaperId = wp.id;
          currentUser.subscription = { autoRenew: true, active: true, secondsRemaining: payRes.duration };
          saveUser(currentUser);
          startDurationTimer();
          // Open assignment dialog
          if (window.threeDPapersAssign) {
            window.threeDPapersAssign.open(currentContainer, wp, currentUser, (u) => {
              saveUser(u); renderMain();
            });
          } else {
            renderMain();
          }
        });
      },
      onAssignRequest: (wp) => {
        if (window.threeDPapersAssign) {
          window.threeDPapersAssign.open(currentContainer, wp, currentUser, (u) => {
            saveUser(u); renderMain();
          });
        }
      }
    });
  }

  window.threeDPapersApp = {
    mount(container) {
      currentContainer = container;
      const sessionUser = localStorage.getItem(K_SESSION);
      if (sessionUser && window.gamesafe?.exists?.('3dpapers', sessionUser)) {
        currentUser = window.gamesafe?.load?.('3dpapers', sessionUser);
        startDurationTimer();
        renderMain();
        window.threeDPapersUpdate?.check?.(container, () => renderMain());
      } else {
        window.threeDPapersAuth.render(container, (u) => {
          currentUser = u;
          saveUser(u);
          startDurationTimer();
          renderMain();
          window.threeDPapersUpdate?.check?.(container, () => renderMain());
        });
      }
    },

    unmount() {
      if (renewInterval) { clearInterval(renewInterval); renewInterval = null; }
      if (window.threeDPapersWallpapers) window.threeDPapersWallpapers.stop();
      window.threeDPapersUpdate?.clearTimer?.();
      currentContainer = null;
    }
  };
})();
