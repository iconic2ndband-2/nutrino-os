/* FILE: constants.js — App metadata, configurations, and icon definitions */
window.CONSTANTS = {
  OS_VERSION: 'Nutrino OS v1.1.2.1',
  DB_NAME: 'NutrinoOS_DB',
  DB_VERSION: 1,
  STORES: { NOTES: 'notes', GALLERY: 'gallery' },
  DEVICE_SPECS: {
    deviceName: 'Nutrino N1',
    model: 'NOS-N1-2026',
    osVersion: 'Nutrino OS v1.1.2.1',
    totalStorageGB: 128,
    systemStorageGB: 8.5,
    ram: '8 GB LPDDR5',
    processor: 'Nutrino Octa-Core 2.8 GHz',
    battery: '4500 mAh (Li-Po)',
    display: '6.1" AMOLED (1080 x 2400, 120Hz)'
  },
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
  SE_GAME: {
    id: 'nitroracese', name: 'Nitro Race SE', version: '1.0.0', sizeMB: 9840.64, price: 100.00,
    developer: 'Nutrino Games', category: 'Games', rating: 4.9, downloads: '0',
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
    { id: 'wipefresh', name: 'Wipe Fresh', color: '#ef4444', isDownloadable: true, sizeMB: 10, price: 0, version: '1.0.0', developer: 'Nutrino Labs', category: 'Utilities', rating: 4.9, downloads: '3.4K', description: 'Factory reset and system rejuvenator for Nutrino OS.', icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>' },
    { id: 'nitrorace', name: 'Nitro Race', color: '#f43f5e', isDownloadable: true, sizeMB: 7000, price: 20.00, version: '1.0.0', developer: 'Nutrino Games', category: 'Games', rating: 4.5, downloads: '1.2K', description: 'High-speed racing action. Download now and hit the track!', icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C2.1 11.2 2 11.6 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>' },
    { id: 'gamesafe', name: 'Gamesafe', color: '#38bdf8', isDownloadable: true, sizeMB: 200, price: 1.99, subPrice: 0.99, subIntervalSec: 20, version: '1.0.0', developer: 'Nutrino Labs', category: 'Utilities', rating: 4.8, downloads: '856', description: 'Save your game progress. Never lose your achievements again.', icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>' },
    { id: 'nitroracese', name: 'Nitro Race SE', color: '#8b5cf6', isDownloadable: true, hideFromStore: true, sizeMB: 9840.64, price: 100.00, version: '1.0.0', developer: 'Nutrino Games', category: 'Games', rating: 4.9, downloads: '0', description: 'The ultimate Nitro Race experience. 3 maps, 2 cars, and more!', icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>' }
  ],
  DOCK_APPS: [
    { id: 'phone', name: 'Phone', color: '#22c55e', icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>' },
    { id: 'messages', name: 'Messages', color: '#3b82f6', icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>' },
    { id: 'browser', name: 'Browser', color: '#6366f1', icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>' }
  ]
};
