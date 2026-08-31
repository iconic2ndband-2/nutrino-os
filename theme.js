/* FILE: theme.js — System theme, wallpaper, and display brightness controller with osdb */
(function() {
  let currentSettings = { theme: 'dark', wallpaper: 'gradient-1', brightness: 100 };

  function applyTheme(theme) {
    currentSettings.theme = theme;
    if (theme === 'light') document.body.classList.add('light-theme');
    else document.body.classList.remove('light-theme');
    if (window.osdb) window.osdb.put('settings', { id: 'theme', val: theme });
  }

  function applyWallpaper(wallpaperId) {
    const wp = window.CONSTANTS.WALLPAPERS.find(w => w.id === wallpaperId) || window.CONSTANTS.WALLPAPERS[0];
    currentSettings.wallpaper = wp.id;
    document.documentElement.style.setProperty('--wallpaper-bg', wp.css);
    const osDevice = document.getElementById('os-root');
    if (osDevice) osDevice.style.backgroundImage = wp.css;
    if (window.osdb) window.osdb.put('settings', { id: 'wallpaper', val: wp.id });
  }

  function applyBrightness(level) {
    const val = Math.max(10, Math.min(100, Number(level) || 100));
    currentSettings.brightness = val;
    const overlay = document.getElementById('os-brightness-overlay');
    if (overlay) overlay.style.opacity = (((100 - val) / 100) * 0.85).toFixed(3);
    if (window.osdb) window.osdb.put('settings', { id: 'brightness', val });
  }

  window.theme = {
    async init() {
      let savedTheme = 'dark', savedWp = 'gradient-1', savedBrightness = 100;
      if (window.osdb) {
        try {
          const t = await window.osdb.get('settings', 'theme');
          const w = await window.osdb.get('settings', 'wallpaper');
          const b = await window.osdb.get('settings', 'brightness');
          if (t) savedTheme = t;
          if (w) savedWp = w;
          if (b !== null && b !== undefined) savedBrightness = Number(b);
        } catch (e) {}
      }
      applyTheme(savedTheme);
      applyWallpaper(savedWp);
      applyBrightness(savedBrightness);
    },
    setTheme(mode) { applyTheme(mode); },
    setWallpaper(id) { applyWallpaper(id); },
    setBrightness(level) { applyBrightness(level); },
    getSettings() { return { ...currentSettings }; }
  };
})();
