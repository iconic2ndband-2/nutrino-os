/* FILE: nitroraceae.maps.js — Map definitions for Track (Default) and 300x300 Open World */
(function() {
  window.nitroraceAeMaps = {
    list: [
      {
        id: 'default', name: 'Default Map', type: 'Track',
        desc: 'Original Nitro Race 3D track. Fast straightaways and obstacles.',
        icon: '🏁', theme: 'circuit',
        ambientColor: 0x2e1065, skyColor: 0x0f172a, roadColor: 0x1e293b
      },
      {
        id: 'openworld', name: 'Open World', type: '3D Roamable',
        desc: '300×300 unit open world. Free-roam exploration with hills, cities, and landmarks.',
        icon: '🌐', theme: 'roam',
        bounds: { minX: -150, maxX: 150, minZ: -150, maxZ: 150 },
        ambientColor: 0x38bdf8, skyColor: 0x0284c7, groundColor: 0x15803d
      }
    ],

    getMap(id) {
      return this.list.find(m => m.id === id) || this.list[0];
    },

    // Points of interest for Open World Mini-map
    pois: [
      { id: 'spawn', name: 'Starting Garage', x: 0, z: 0, color: '#fbbf24', icon: '🏠' },
      { id: 'city', name: 'Neon City Center', x: 60, z: -70, color: '#ec4899', icon: '🏙️' },
      { id: 'airport', name: 'Airstrip Strip', x: -80, z: -80, color: '#38bdf8', icon: '✈️' },
      { id: 'mountain', name: 'Sunset Mountain', x: -70, z: 70, color: '#f97316', icon: '⛰️' },
      { id: 'speedtrap', name: 'Radar Trap', x: 75, z: 75, color: '#ef4444', icon: '⚡' }
    ]
  };
})();
