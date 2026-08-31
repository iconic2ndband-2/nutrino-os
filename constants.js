/* FILE: constants.js — App metadata, configurations, and icon definitions */
window.CONSTANTS = {
  OS_VERSION: 'Nutrino OS v1.5.2',
  DB_NAME: 'osdb',
  DB_VERSION: 1,
  STORES: { NOTES: 'notes', GALLERY: 'gallery' },
  DEVICE_SPECS: {
    deviceName: 'Nutrino N1', model: 'NOS-11', osVersion: 'Nutrino OS v1.5.2',
    buildNumber: 'NOS-1.5.2-20260830', processor: '10-Core, 600MHz - 1.3GHz', gpu: '2T-PEX (4-core, 600MHz)',
    ram: '4GB LPDDR4', totalStorageGB: 128, storageType: '128GB UFS 2.1', systemStorageGB: 8.5,
    display: '6.7" AMOLED, 2400×1080, 120Hz', battery: '4500mAh', cameraRear: '64MP + 12MP + 5MP', cameraFront: '32MP',
    flash: 'Dual LED', network: '5G capable', wifi: '802.11 a/b/g/n/ac/ax', bluetooth: '5.2', securityPatch: 'August 1, 2026',
    kernelVersion: '6.1.0-nutrino+', buildDate: 'August 30, 2026'
  },
  APP_METADATA: {
    'wipefresh': { name: 'Wipe Fresh', developer: 'Byloop', category: 'System' },
    'nitrorace': { name: 'Nitro Race', developer: 'RaceMakingStudio', category: 'Games' },
    'nitroracese': { name: 'Nitro Race SE', developer: 'RaceMakingStudio', category: 'Games' },
    'nitroraceae': { name: 'Nitro Race Anniversary Edition', developer: 'RaceMakingStudio', category: 'Games' },
    '3dpapers': { name: '3DPapers', developer: 'CoolFrost', category: 'Personalization' },
    'gamesafe': { name: 'Gamesafe', developer: 'WhiteGames', category: 'Utilities' },
    'truespecs': { name: 'Truespecs', developer: 'Truespecs Technologies', category: 'Utilities' },
    'realosdb': { name: 'real-osdb', developer: 'Rampage Report', category: 'System / Developer Tools' }
  },
  APP_VERSIONS: {
    'wipefresh': [{ version: '1.0.0', date: 'Aug 15, 2026', size: 10.0, totalSize: 10.0, file: 'wipefresh.js', changes: ['Initial release'] }],
    'nitrorace': [{ version: '1.0.0', date: 'Aug 20, 2026', size: 7.0, totalSize: 7000.0, file: 'nitrorace.js', changes: ['Initial release'] }],
    'nitroracese': [{ version: '1.0.0', date: 'Aug 27, 2026', size: 9.61, totalSize: 9840.64, file: 'nitroracese.js', changes: ['Initial release'] }],
    'nitroraceae': [{ version: '1.0.0', date: 'Aug 30, 2026', size: 12.5, totalSize: 12500.0, file: 'nitroraceae.js', changes: ['Initial release', 'Anniversary Edition Exclusive', '300x300 Open World', '3 Anniversary Cars', '30 FPS Lock'] }],
    'gamesafe': [{ version: '1.0.0', date: 'Aug 22, 2026', size: 200.0, totalSize: 200.0, file: 'gamesafe.js', changes: ['Initial release'] }],
    'truespecs': [{ version: '1.0.0', date: 'Aug 28, 2026', size: 800.0, totalSize: 800.0, file: 'truespecsapp.js', changes: ['Initial release'] }],
    'realosdb': [{ version: '1.0.0', date: 'Aug 29, 2026', size: 10000.0, totalSize: 10000.0, file: 'realosdb.js', changes: ['Initial release', 'Real-time 9-store osdb monitor', 'Live key-value inspector', 'JSON export tool'] }],
    '3dpapers': [
      {
        version: '2.0.0', date: 'Aug 29, 2026', size: 400.0, totalSize: 2700.0, file: '3dpapers.v2.js',
        changes: ['Wallpaper assignment system (Home/Lock/Both)', 'Multi-buy / Multi-assign', 'Lock screen 3D wallpaper', 'Background pausing'],
        rollbackAvailable: true, rollbackTo: '1.0.0'
      },
      {
        version: '1.0.0', date: 'Aug 28, 2026', size: 2300.0, totalSize: 2300.0, file: '3dpapers.v1.js',
        changes: ['Initial release', '5 premium 3D wallpapers', 'Silent pay system', 'Gamesafe integration'],
        rollbackAvailable: false
      }
    ]
  },
  APP_TOTAL_SIZE: { '3dpapers': 2700, 'realosdb': 10000, 'nitroraceae': 12500 },
  NETWORK_PLANS: [
    { id: 'free', name: 'Free', speed: 1, price: 0, dataLimitGB: 1 },
    { id: 'basic', name: 'Basic', speed: 10, price: 5, dataLimitGB: 50 },
    { id: 'standard', name: 'Standard', speed: 50, price: 10, dataLimitGB: 200 },
    { id: 'premium', name: 'Premium', speed: 100, price: 20, dataLimitGB: 500 },
    { id: 'ultra', name: 'Ultra', speed: 500, price: 50, dataLimitGB: 1000 }
  ],
  WALLPAPERS: [
    { id: 'gradient-1', name: 'Midnight Indigo', css: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e1b4b 100%)' },
    { id: 'gradient-2', name: 'Obsidian Slate', css: 'linear-gradient(135deg, #09090b 0%, #18181b 50%, #27272a 100%)' },
    { id: 'gradient-3', name: 'Emerald Abyss', css: 'linear-gradient(135deg, #022c22 0%, #064e3b 50%, #022c22 100%)' }
  ],
  WALLPAPERS_3D: [
    { id: 'nebula', name: 'Nebula Drift', price: 5.00, duration: 60, costPerSec: 0.083, color: '#a855f7', icon: '🌌', desc: 'Floating through a colorful nebula with drifting stars and glowing gas clouds.' },
    { id: 'ocean', name: 'Ocean Depths', price: 4.50, duration: 45, costPerSec: 0.10, color: '#06b6d4', icon: '🌊', desc: 'Underwater scene with sunlight rays piercing through, floating plankton, and bubbles.' },
    { id: 'neon', name: 'Neon Cityscape', price: 4.00, duration: 30, costPerSec: 0.133, color: '#ec4899', icon: '🏙️', desc: 'Cyberpunk city at night with rain, animated neon signs, and moving traffic flow.' },
    { id: 'volcano', name: 'Volcano Eruption', price: 3.00, duration: 15, costPerSec: 0.20, color: '#ef4444', icon: '🌋', desc: 'Active volcano with flowing lava, ash clouds, smoke effects, and embers.' },
    { id: 'aurora', name: 'Aurora Borealis', price: 10.00, duration: 1, costPerSec: 10.00, color: '#10b981', icon: '✨', desc: 'Northern lights dancing across the sky with starfield and falling snow.' }
  ],
  NRAE_GAME: {
    id: 'nitroraceae', name: 'Nitro Race Anniversary Edition', version: '1.0.0', sizeMB: 12500, price: 200.00,
    silentPay: 5.00, developer: 'RaceMakingStudio', category: 'Games', rating: 5.0, downloads: '0',
    description: 'Celebrate the anniversary of Nitro Race with this exclusive edition. New cars, new maps, and a whole new experience.'
  },
  SE_GAME: {
    id: 'nitroracese', name: 'Nitro Race SE', version: '1.0.0', sizeMB: 9840.64, price: 100.00,
    developer: 'RaceMakingStudio', category: 'Games', rating: 4.9, downloads: '0',
    description: 'The ultimate Nitro Race experience. 3 maps, 2 cars, and more!'
  },
  SE_MAPS: [
    { id: 'desert', name: 'Desert Highway', bg: '#ca8a04', road: '#78350f', border: '#eab308', desc: 'Arid dunes and hot sun' },
    { id: 'city', name: 'Neon Metropolis', bg: '#1e293b', road: '#0f172a', border: '#38bdf8', desc: 'Urban asphalt & neon glow' },
    { id: 'snow', name: 'Frozen Tundra', bg: '#93c5fd', road: '#334155', border: '#e0f2fe', desc: 'Icy slick mountain curves' }
  ],
  SE_CARS: [
    { id: 'default', name: 'Vulcan GT', color: '#f43f5e', topSpeed: 140, accel: 75, handling: 80, desc: 'Balanced high-velocity racer' },
    { id: 'new', name: 'Cobalt Surge', color: '#0ea5e9', topSpeed: 125, accel: 95, handling: 85, desc: 'Ultra-fast launch acceleration' }
  ],
  APPS: [
    { id: 'phone', name: 'Phone', color: '#22c55e', icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>' },
    { id: 'messages', name: 'Messages', color: '#3b82f6', icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>' },
    { id: 'clock', name: 'Clock', color: '#3b82f6', icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>' },
    { id: 'calculator', name: 'Calculator', color: '#f59e0b', icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="16" height="20" x="4" y="2" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/><line x1="16" x2="16" y1="14" y2="18"/><path d="M16 10h.01"/><path d="M12 10h.01"/><path d="M8 10h.01"/><path d="M12 14h.01"/><path d="M8 14h.01"/><path d="M12 18h.01"/><path d="M8 18h.01"/></svg>' },
    { id: 'settings', name: 'Settings', color: '#64748b', icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>' },
    { id: 'notes', name: 'Notes', color: '#eab308', icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8Z"/><path d="M15 3v5h5"/><path d="M9 13h6"/><path d="M9 17h4"/></svg>' },
    { id: 'camera', name: 'Camera', color: '#ef4444', icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>' },
    { id: 'music', name: 'Music', color: '#ec4899', icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>' },
    { id: 'gallery', name: 'Gallery', color: '#8b5cf6', icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>' },
    { id: 'weather', name: 'Weather', color: '#06b6d4', icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg>' },
    { id: 'browser', name: 'Browser', color: '#6366f1', icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>' },
    { id: 'softstore', name: 'SoftStore', color: '#10b981', icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/><circle cx="12" cy="11" r="1.5"/></svg>' },
    { id: 'wipefresh', name: 'Wipe Fresh', color: '#ef4444', isDownloadable: true, sizeMB: 10, price: 0, version: '1.0.0', developer: 'Byloop', category: 'System', rating: 4.9, downloads: '3.4K', description: 'Factory reset and system rejuvenator for Nutrino OS.', icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>' },
    { id: 'nitrorace', name: 'Nitro Race', color: '#f43f5e', isDownloadable: true, sizeMB: 7000, price: 20.00, version: '1.0.0', developer: 'RaceMakingStudio', category: 'Games', rating: 4.5, downloads: '1.2K', description: 'High-speed racing action. Download now and hit the track!', icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C2.1 11.2 2 11.6 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>' },
    { id: 'gamesafe', name: 'Gamesafe', color: '#38bdf8', isDownloadable: true, sizeMB: 200, price: 1.99, subPrice: 0.99, subIntervalSec: 20, version: '1.0.0', developer: 'WhiteGames', category: 'Utilities', rating: 4.8, downloads: '856', description: 'Save your game progress. Never lose your achievements again.', icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>' },
    { id: '3dpapers', name: '3DPapers', color: '#8b5cf6', isDownloadable: true, sizeMB: 2300, totalSizeMB: 2700, price: 0, version: '1.0.0', developer: 'CoolFrost', category: 'Personalization', rating: 4.9, downloads: '5.8K', description: 'Premium live 3D wallpaper engine with dynamic physics and lighting effects.', icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72Z"/><path d="m14 7 3 3"/><path d="M5 6v4"/><path d="M19 14v4"/><path d="M10 2v2"/><path d="M7 8H3"/><path d="M21 16h-4"/><path d="M11 3H9"/></svg>' },
    { id: 'truespecs', name: 'Truespecs', color: '#ff1493', isDownloadable: true, hideFromStore: true, sizeMB: 800, price: 0, version: '1.0.0', developer: 'Truespecs Technologies', category: 'Utilities', rating: 5.0, downloads: '14.2K', description: 'Get detailed device specs right on your home screen.', icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18M15 3v18M3 9h18M3 15h18"/></svg>' },
    { id: 'realosdb', name: 'real-osdb', color: '#ff3333', isDownloadable: true, sizeMB: 10000, price: 0, version: '1.0.0', developer: 'Rampage Report', category: 'System / Developer Tools', rating: 5.0, downloads: '7.2K', description: 'Real-time IndexedDB monitor for Nutrino OS. See all osdb data live.', icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 7h10M7 12h10M7 17h10"/><circle cx="17" cy="12" r="1.5"/></svg>' },
    { id: 'nitroracese', name: 'Nitro Race SE', color: '#8b5cf6', isDownloadable: true, hideFromStore: true, sizeMB: 9840.64, price: 100.00, version: '1.0.0', developer: 'RaceMakingStudio', category: 'Games', rating: 4.9, downloads: '0', description: 'The ultimate Nitro Race experience. 3 maps, 2 cars, and more!', icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>' },
    { id: 'nitroraceae', name: 'Nitro Race AE', color: '#e11d48', isDownloadable: true, hideFromStore: true, sizeMB: 12500, price: 200.00, version: '1.0.0', developer: 'RaceMakingStudio', category: 'Games', rating: 5.0, downloads: '0', description: 'Celebrate the anniversary of Nitro Race with this exclusive edition. 3 cars, 2 maps (including 300x300 Open World), 30 FPS lock, and more!', icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>' }
  ]
};
