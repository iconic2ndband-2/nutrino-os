/* FILE: theme.js — System theme, wallpaper, and display brightness controller */
(function() {
  const PREFS_KEY_THEME = 'nutrino_theme';
  const PREFS_KEY_WALLPAPER = 'nutrino_wallpaper';
  const PREFS_KEY_BRIGHTNESS = 'nutrino_brightness';

  let currentSettings = {
    theme: 'dark',
    wallpaper: 'gradient-1',
    brightness: 100
  };

  function applyTheme(theme) {
    currentSettings.theme = theme;
    if (theme === 'light') {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }
    localStorage.setItem(PREFS_KEY_THEME, theme);
  }

  function applyWallpaper(wallpaperId) {
    const wp = window.CONSTANTS.WALLPAPERS.find(w => w.id === wallpaperId) || window.CONSTANTS.WALLPAPERS[0];
    currentSettings.wallpaper = wp.id;
    document.documentElement.style.setProperty('--wallpaper-bg', wp.css);
    const osDevice = document.getElementById('os-root');
    if (osDevice) {
      osDevice.style.backgroundImage = wp.css;
    }
    localStorage.setItem(PREFS_KEY_WALLPAPER, wp.id);
  }

  function applyBrightness(level) {
    const val = Math.max(10, Math.min(100, Number(level) || 100));
    currentSettings.brightness = val;
    const overlay = document.getElementById('os-brightness-overlay');
    if (overlay) {
      const dimOpacity = ((100 - val) / 100) * 0.85;
      overlay.style.opacity = dimOpacity.toFixed(3);
    }
    localStorage.setItem(PREFS_KEY_BRIGHTNESS, val.toString());
  }

  window.theme = {
    init() {
      const savedTheme = localStorage.getItem(PREFS_KEY_THEME) || 'dark';
      const savedWp = localStorage.getItem(PREFS_KEY_WALLPAPER) || 'gradient-1';
      const savedBrightness = localStorage.getItem(PREFS_KEY_BRIGHTNESS) || '100';

      applyTheme(savedTheme);
      applyWallpaper(savedWp);
      applyBrightness(Number(savedBrightness));
    },

    setTheme(mode) {
      applyTheme(mode);
    },

    setWallpaper(id) {
      applyWallpaper(id);
    },

    setBrightness(level) {
      applyBrightness(level);
    },

    getSettings() {
      return { ...currentSettings };
    }
  };
})();
