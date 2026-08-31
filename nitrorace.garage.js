/* FILE: nitrorace.garage.js — Garage assets, car models, paints, neon underglow, and trails for Season 1 */
(function() {
  const CARS = {
    'default': {
      id: 'default',
      name: 'Vulcan GT',
      rarity: 'Common',
      tier: 'Base',
      desc: 'The classic balanced aerodynamic highway racer.',
      topSpeedBonus: 0,
      accelBonus: 0,
      color: '#f43f5e'
    },
    'venom_gtx': {
      id: 'venom_gtx',
      name: 'Venom GT-X',
      rarity: 'Epic',
      tier: 'Season 1 Pass (Tier 1)',
      desc: 'Sleek carbon-fiber hypercar with dual vortex rear spoilers and aggressive front splitter.',
      topSpeedBonus: 10,
      accelBonus: 15,
      color: '#ef4444'
    },
    'cyber_interceptor': {
      id: 'cyber_interceptor',
      name: 'Cyber Interceptor S1',
      rarity: 'Epic',
      tier: 'Season 1 Pass (Tier 10)',
      desc: 'Reinforced pursuit cruiser with emergency LED roof strobes and heavy armor plating.',
      topSpeedBonus: 15,
      accelBonus: 10,
      color: '#3b82f6'
    },
    'apex_valkyrie': {
      id: 'apex_valkyrie',
      name: 'Apex Valkyrie S1',
      rarity: 'Legendary',
      tier: 'Season 1 Pass (Tier 20 Grand Prize)',
      desc: 'The ultimate Season 1 masterpiece. Widebody golden hypercar with quad jet exhausts and quantum downforce aero.',
      topSpeedBonus: 25,
      accelBonus: 25,
      color: '#eab308'
    }
  };

  const PAINTS = {
    'crimson': { id: 'crimson', name: 'Crimson Red', hex: '#f43f5e', metal: 0.2, rough: 0.4, rarity: 'Common' },
    'cobalt_frost': { id: 'cobalt_frost', name: 'Cobalt Frost', hex: '#38bdf8', metal: 0.5, rough: 0.3, rarity: 'Rare' },
    'solar_amber': { id: 'solar_amber', name: 'Solar Amber', hex: '#f59e0b', metal: 0.6, rough: 0.3, rarity: 'Rare' },
    'midnight_obsidian': { id: 'midnight_obsidian', name: 'Midnight Obsidian', hex: '#18181b', metal: 0.8, rough: 0.2, rarity: 'Epic' },
    'hyper_purple': { id: 'hyper_purple', name: 'Hyper Violet', hex: '#a855f7', metal: 0.7, rough: 0.2, rarity: 'Epic' },
    'gold_chrome': { id: 'gold_chrome', name: '24K Gold Plated', hex: '#eab308', metal: 0.95, rough: 0.1, rarity: 'Legendary' },
    'quantum_holo': { id: 'quantum_holo', name: 'Quantum Hologram', hex: '#06b6d4', metal: 0.9, rough: 0.1, rarity: 'Legendary', animated: true }
  };

  const UNDERGLOWS = {
    'none': { id: 'none', name: 'None', hex: 'transparent', color: 0x000000 },
    'cyan': { id: 'cyan', name: 'Cyan Electric', hex: '#00f0ff', color: 0x00f0ff, rarity: 'Rare' },
    'acid_green': { id: 'acid_green', name: 'Acid Green', hex: '#39ff14', color: 0x39ff14, rarity: 'Epic' },
    'ultra_violet': { id: 'ultra_violet', name: 'Ultra Violet', hex: '#bf00ff', color: 0xbf00ff, rarity: 'Epic' },
    'rgb_pulse': { id: 'rgb_pulse', name: 'Rainbow RGB Spectrum', hex: '#ec4899', color: 0xff007f, dynamic: true, rarity: 'Legendary' }
  };

  const TRAILS = {
    'none': { id: 'none', name: 'Standard Smoke', icon: '💨', color: '#94a3b8' },
    'sparks': { id: 'sparks', name: 'Plasma Sparks', icon: '✨', color: '#ffffff', rarity: 'Rare' },
    'flame': { id: 'flame', name: 'Afterburner Flame', icon: '🔥', color: '#f97316', rarity: 'Epic' },
    'lightning': { id: 'lightning', name: 'Electric Arc', icon: '⚡', color: '#38bdf8', rarity: 'Legendary' }
  };

  function create3DCarGroup(carId, paintId, underglowId) {
    if (typeof THREE === 'undefined') return null;
    const group = new THREE.Group();
    const paint = PAINTS[paintId] || PAINTS['crimson'];
    const carMat = new THREE.MeshStandardMaterial({
      color: parseInt(paint.hex.replace('#', '0x'), 16),
      metalness: paint.metal || 0.4,
      roughness: paint.rough || 0.4
    });
    const darkMat = new THREE.MeshLambertMaterial({ color: 0x0f172a });
    const glassMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.1, metalness: 0.8 });
    const wheelMat = new THREE.MeshLambertMaterial({ color: 0x111827 });
    const rimMat = new THREE.MeshLambertMaterial({ color: 0xcbd5e1 });
    const lightMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const tailMat = new THREE.MeshBasicMaterial({ color: 0xff0033 });

    if (carId === 'venom_gtx') {
      // Venom GT-X: Low-slung aggressive aero body
      const main = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.42, 2.8), carMat);
      main.position.y = 0.38; group.add(main);

      const nose = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.25, 0.8), carMat);
      nose.position.set(0, 0.3, -1.4); group.add(nose);

      const cabin = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.35, 1.2), glassMat);
      cabin.position.set(0, 0.65, -0.1); group.add(cabin);

      const spoilerPostL = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.35, 0.1), darkMat);
      spoilerPostL.position.set(-0.55, 0.72, 1.25); group.add(spoilerPostL);
      const spoilerPostR = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.35, 0.1), darkMat);
      spoilerPostR.position.set(0.55, 0.72, 1.25); group.add(spoilerPostR);
      const wing = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.06, 0.4), darkMat);
      wing.position.set(0, 0.9, 1.25); group.add(wing);

      // Dual exhaust pipes
      const ex1 = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.2, 8), darkMat);
      ex1.rotation.x = Math.PI / 2; ex1.position.set(-0.3, 0.3, 1.42); group.add(ex1);
      const ex2 = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.2, 8), darkMat);
      ex2.rotation.x = Math.PI / 2; ex2.position.set(0.3, 0.3, 1.42); group.add(ex2);

    } else if (carId === 'cyber_interceptor') {
      // Cyber Interceptor S1: High-tech police cruiser
      const main = new THREE.Mesh(new THREE.BoxGeometry(1.45, 0.55, 2.7), carMat);
      main.position.y = 0.42; group.add(main);

      const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.05, 0.42, 1.3), glassMat);
      cabin.position.set(0, 0.82, -0.05); group.add(cabin);

      const pushBar = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.3, 0.15), darkMat);
      pushBar.position.set(0, 0.35, -1.4); group.add(pushBar);

      // Strobe Lightbar on roof
      const strobeBase = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.08, 0.15), darkMat);
      strobeBase.position.set(0, 1.06, -0.05); group.add(strobeBase);

      const strobeL = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.08, 0.12), new THREE.MeshBasicMaterial({ color: 0xef4444 }));
      strobeL.position.set(-0.18, 1.1, -0.05); strobeL.name = 'strobe_red'; group.add(strobeL);
      const strobeR = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.08, 0.12), new THREE.MeshBasicMaterial({ color: 0x3b82f6 }));
      strobeR.position.set(0.18, 1.1, -0.05); strobeR.name = 'strobe_blue'; group.add(strobeR);

    } else if (carId === 'apex_valkyrie') {
      // Apex Valkyrie S1: Legendary Widebody Jet-Hypercar
      const main = new THREE.Mesh(new THREE.BoxGeometry(1.65, 0.4, 3.0), carMat);
      main.position.y = 0.35; group.add(main);

      const wideFlaresL = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.35, 1.6), carMat);
      wideFlaresL.position.set(-0.9, 0.35, 0.1); group.add(wideFlaresL);
      const wideFlaresR = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.35, 1.6), carMat);
      wideFlaresR.position.set(0.9, 0.35, 0.1); group.add(wideFlaresR);

      const cabin = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.32, 1.1), glassMat);
      cabin.position.set(0, 0.62, -0.2); group.add(cabin);

      const fin = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.35, 0.8), darkMat);
      fin.position.set(0, 0.72, 0.6); group.add(fin);

      const wing = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.06, 0.45), carMat);
      wing.position.set(0, 0.92, 1.35); group.add(wing);

      // Gold Trim Highlights
      const goldTrim = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.04, 0.1), new THREE.MeshBasicMaterial({ color: 0xf59e0b }));
      goldTrim.position.set(0, 0.45, -1.48); group.add(goldTrim);

      // Quad Jet Thrusters
      for (let x of [-0.4, -0.15, 0.15, 0.4]) {
        const jet = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.09, 0.18, 8), darkMat);
        jet.rotation.x = Math.PI / 2; jet.position.set(x, 0.3, 1.52); group.add(jet);
      }

    } else {
      // Default: Vulcan GT
      const body = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.5, 2.6), carMat);
      body.position.y = 0.4; group.add(body);
      const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.4, 1.3), glassMat);
      cabin.position.set(0, 0.75, -0.1); group.add(cabin);
      const spoiler = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.08, 0.3), darkMat);
      spoiler.position.set(0, 0.85, 1.1); group.add(spoiler);
    }

    // 4 Sport Wheels with Metallic Rims
    const wGeom = new THREE.CylinderGeometry(0.32, 0.32, 0.22, 16);
    wGeom.rotateZ(Math.PI / 2);
    const rimGeom = new THREE.CylinderGeometry(0.18, 0.18, 0.24, 8);
    rimGeom.rotateZ(Math.PI / 2);

    const wheelPositions = [
      [-0.75, 0.32, -0.9], [0.75, 0.32, -0.9],
      [-0.75, 0.32, 0.9], [0.75, 0.32, 0.9]
    ];
    wheelPositions.forEach(pos => {
      const wGroup = new THREE.Group();
      const tire = new THREE.Mesh(wGeom, wheelMat);
      const rim = new THREE.Mesh(rimGeom, rimMat);
      wGroup.add(tire); wGroup.add(rim);
      wGroup.position.set(pos[0], pos[1], pos[2]);
      group.add(wGroup);
    });

    // Headlights and Taillights
    const hlL = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.12, 0.05), lightMat);
    hlL.position.set(-0.5, 0.38, -1.35); group.add(hlL);
    const hlR = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.12, 0.05), lightMat);
    hlR.position.set(0.5, 0.38, -1.35); group.add(hlR);

    const tlL = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.1, 0.05), tailMat);
    tlL.position.set(-0.5, 0.45, 1.35); group.add(tlL);
    const tlR = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.1, 0.05), tailMat);
    tlR.position.set(0.5, 0.45, 1.35); group.add(tlR);

    // Neon Underglow (if equipped)
    if (underglowId && underglowId !== 'none') {
      const ug = UNDERGLOWS[underglowId];
      if (ug) {
        const glowPlane = new THREE.Mesh(
          new THREE.PlaneGeometry(1.6, 2.6),
          new THREE.MeshBasicMaterial({
            color: ug.color,
            transparent: true,
            opacity: 0.85,
            side: THREE.DoubleSide
          })
        );
        glowPlane.rotation.x = -Math.PI / 2;
        glowPlane.position.y = 0.08;
        glowPlane.name = 'underglow_mesh';
        glowPlane.userData = { isUnderglow: true, ugId: underglowId };
        group.add(glowPlane);
      }
    }

    return group;
  }

  window.nitroraceGarage = {
    CARS,
    PAINTS,
    UNDERGLOWS,
    TRAILS,
    create3DCarGroup,
    getCar(id) { return CARS[id] || CARS['default']; },
    getPaint(id) { return PAINTS[id] || PAINTS['crimson']; },
    getUnderglow(id) { return UNDERGLOWS[id] || UNDERGLOWS['none']; },
    getTrail(id) { return TRAILS[id] || TRAILS['none']; }
  };
})();
