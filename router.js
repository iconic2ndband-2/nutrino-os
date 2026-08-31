/* FILE: router.js — Screen navigation manager and view transition router */
(function() {
  let viewportEl = null, currentScreen = null, currentAppModule = null, historyStack = [];

  const appMap = {
    clock: () => window.clockApp,
    calculator: () => window.calculatorApp,
    settings: () => window.settingsApp,
    notes: () => window.notesApp,
    camera: () => window.cameraApp,
    music: () => window.musicApp,
    gallery: () => window.galleryApp,
    weather: () => window.weatherApp,
    browser: () => window.browserApp,
    softstore: () => window.softstoreApp,
    wipefresh: () => window.wipefreshApp,
    truespecs: () => window.truespecsApp,
    nitrorace: () => window.nitroraceApp,
    nitroracese: () => window.nitroraceSeApp,
    nitroraceae: () => window.nitroraceAeApp,
    gamesafe: () => window.gamesafe,
    '3dpapers': () => window.threeDPapersApp,
    realosdb: () => window.realosdbApp
  };

  window.router = {
    init(viewport) {
      viewportEl = viewport;
      historyStack = [];
    },

    async navigate(screen, appName = null) {
      if (!viewportEl) return;

      if (currentAppModule && typeof currentAppModule.unmount === 'function') {
        currentAppModule.unmount();
        currentAppModule = null;
      }

      await window.animations.fadeOut(viewportEl, 120);
      viewportEl.innerHTML = '';
      currentScreen = screen;
      historyStack.push({ screen, appName });

      if (screen === 'lockscreen') {
        currentAppModule = window.lockscreen;
        window.lockscreen.mount(viewportEl);
      } else if (screen === 'homescreen') {
        currentAppModule = window.homescreen;
        window.homescreen.mount(viewportEl);
      } else if (screen === 'app' && appName) {
        const appMeta = window.CONSTANTS.APPS.find(a => a.id === appName) || { name: appName };
        const appScreenEl = document.createElement('div');
        appScreenEl.className = 'screen-view app-screen';
        appScreenEl.innerHTML = `
          <div class="app-header">
            <button id="app-back-btn" class="back-btn" aria-label="Back">‹ Back</button>
            <div class="app-title">${appMeta.name}</div>
            <div style="width: 44px;"></div>
          </div>
          <div id="app-content-body" class="app-content"></div>`;
        viewportEl.appendChild(appScreenEl);

        const backBtn = appScreenEl.querySelector('#app-back-btn');
        if (backBtn) backBtn.onclick = () => window.os.goBack();

        const bodyContainer = appScreenEl.querySelector('#app-content-body');
        const getModule = appMap[appName];
        if (getModule) {
          currentAppModule = getModule();
          if (currentAppModule && typeof currentAppModule.mount === 'function') {
            currentAppModule.mount(bodyContainer);
          }
        }
      }

      await window.animations.fadeIn(viewportEl, 150);
    },

    goBack() {
      if (historyStack.length > 1) {
        historyStack.pop();
        const prev = historyStack.pop();
        if (prev) this.navigate(prev.screen, prev.appName);
        else this.navigate('homescreen');
      } else {
        this.navigate('homescreen');
      }
    },

    getCurrentScreen() {
      return currentScreen;
    }
  };
})();
