/* FILE: nitroraceae.cars.js — Car specifications (CR-1, FR-322, 456JJ) and 3D car mesh builders */
(function() {
  window.nitroraceAeCars = {
    list: [
      {
        id: 'cr1', name: 'CR-1', rarity: 'Common', rarityColor: '#94a3b8',
        topSpeed: 130, accel: 70, handling: 75,
        color: '#e11d48', accent: '#fca5a5',
        desc: 'Balanced speed, acceleration, handling. The reliable anniversary classic.'
      },
      {
        id: 'fr322', name: 'FR-322', rarity: 'Epic', rarityColor: '#c084fc',
        topSpeed: 170, accel: 85, handling: 80,
        color: '#9333ea', accent: '#f0abfc',
        desc: 'High speed, medium acceleration, good handling. Tuned for intense drift lines.'
      },
      {
        id: '456jj', name: '456JJ', rarity: 'Legendary', rarityColor: '#fbbf24',
        topSpeed: 210, accel: 98, handling: 95,
        color: '#f59e0b', accent: '#fde68a',
        desc: 'Max speed, hyper acceleration, excellent handling. The gold pinnacle of racing.'
      }
    ],

    getCar(id) {
      return this.list.find(c => c.id === id) || this.list[0];
    },

    create3DCar(carData) {
      if (typeof THREE === 'undefined') return null;
      const group = new THREE.Group();
      const bodyMat = new THREE.MeshStandardMaterial({
        color: carData.color || '#e11d48', roughness: 0.25, metalness: 0.7
      });
      const accentMatPort = new THREE.MeshStandardMaterial({
        color: carData.accent || '#fbbf24', roughness: 0.3, metalness: 0.5
      });
      const glassMat = new THREE.MeshStandardMaterial({
        color: 0x0284c7, roughness: 0.1, metalness: 0.9
      });
      const wheelMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.8 });

      // Lower Chassis
      const chassis = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.45, 3.2), bodyMat);
      chassis.position.y = 0.35;
      group.add(chassis);

      // Cabin / Cockpit
      const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.4, 1.4), glassMat);
      cabin.position.set(0, 0.7, -0.1);
      group.add(cabin);

      // Hood / Stripe
      const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.05, 1.8), accentMatPort);
      stripe.position.set(0, 0.59, 0.6);
      group.add(stripe);

      // Spoiler
      const wing = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.08, 0.35), bodyMat);
      wing.position.set(0, 0.85, -1.35);
      const postL = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.25, 0.08), wheelMat);
      postL.position.set(-0.5, 0.7, -1.35);
      const postR = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.25, 0.08), wheelMat);
      postR.position.set(0.5, 0.7, -1.35);
      group.add(wing); group.add(postL); group.add(postR);

      // Headlights & Taillights
      const lightMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const hlL = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.12, 0.05), lightMat);
      hlL.position.set(-0.55, 0.4, 1.6);
      const hlR = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.12, 0.05), lightMat);
      hlR.position.set(0.55, 0.4, 1.6);
      group.add(hlL); group.add(hlR);

      // 4 Wheels
      const wGeom = new THREE.CylinderGeometry(0.3, 0.3, 0.25, 12);
      wGeom.rotateZ(Math.PI / 2);
      const wPos = [
        [-0.85, 0.3, 0.95], [0.85, 0.3, 0.95],
        [-0.85, 0.3, -0.95], [0.85, 0.3, -0.95]
      ];
      wPos.forEach(p => {
        const wMesh = new THREE.Mesh(wGeom, wheelMat);
        wMesh.position.set(p[0], p[1], p[2]);
        group.add(wMesh);
      });

      return group;
    }
  };
})();
