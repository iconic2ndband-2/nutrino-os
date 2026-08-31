/* FILE: nitroraceae.openworld.js — 300x300 3D Open World roaming engine with collision and mini-map */
(function() {
  window.nitroraceAeOpenWorld = {
    scene: null, obstacles: [], buildings: [],

    init(scene) {
      this.scene = scene;
      this.obstacles = [];
      this.buildings = [];
      if (!scene || typeof THREE === 'undefined') return;

      // 300x300 Grass Ground Plane
      const groundGeom = new THREE.PlaneGeometry(300, 300, 30, 30);
      groundGeom.rotateX(-Math.PI / 2);
      const groundMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.8 });
      const ground = new THREE.Mesh(groundGeom, groundMat);
      ground.position.y = 0;
      scene.add(ground);

      // Main Crossroads (300 units long asphalt roads)
      const roadMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.7 });
      const roadNS = new THREE.Mesh(new THREE.PlaneGeometry(16, 300), roadMat);
      roadNS.rotateX(-Math.PI / 2); roadNS.position.y = 0.02;
      scene.add(roadNS);
      const roadEW = new THREE.Mesh(new THREE.PlaneGeometry(300, 16), roadMat);
      roadEW.rotateX(-Math.PI / 2); roadEW.position.y = 0.02;
      scene.add(roadEW);

      // Outer Ring Road
      const ringRoad = new THREE.Mesh(new THREE.RingGeometry(85, 100, 32), roadMat);
      ringRoad.rotateX(-Math.PI / 2); ringRoad.position.y = 0.03;
      scene.add(ringRoad);

      // City Center Skyscrapers & Buildings
      const bldgColors = [0x1e293b, 0x334155, 0x475569, 0x0f172a, 0x64748b];
      for (let i = 0; i < 24; i++) {
        const h = 15 + (i % 5) * 8;
        const bw = 8 + (i % 3) * 4;
        const bldgMat = new THREE.MeshStandardMaterial({ color: bldgColors[i % bldgColors.length], roughness: 0.3, metalness: 0.6 });
        const bldg = new THREE.Mesh(new THREE.BoxGeometry(bw, h, bw), bldgMat);
        const bx = 35 + (i % 5) * 16 + (Math.floor(i / 5) % 2) * 5;
        const bz = -35 - Math.floor(i / 5) * 18;
        bldg.position.set(bx, h / 2, bz);
        scene.add(bldg);
        this.obstacles.push({ x: bx, z: bz, radius: bw * 0.7 });
      }

      // Mountain / Hill formation in NW quadrant
      const hillMat = new THREE.MeshStandardMaterial({ color: 0x854d0e, roughness: 0.9 });
      for (let j = 0; j < 8; j++) {
        const cone = new THREE.Mesh(new THREE.ConeGeometry(12 + j * 2, 20 + j * 3, 8), hillMat);
        const hx = -60 - (j % 3) * 20;
        const hz = 50 + Math.floor(j / 3) * 25;
        cone.position.set(hx, (20 + j * 3) / 2, hz);
        scene.add(cone);
        this.obstacles.push({ x: hx, z: hz, radius: 10 + j * 1.5 });
      }

      // Trees scattered around the open world
      const trunkMat = new THREE.MeshStandardMaterial({ color: 0x78350f });
      const foliageMat = new THREE.MeshStandardMaterial({ color: 0x166534 });
      for (let k = 0; k < 60; k++) {
        const tx = ((k * 37) % 260) - 130;
        const tz = ((k * 61) % 260) - 130;
        if (Math.abs(tx) < 14 || Math.abs(tz) < 14) continue; // Keep roads clear
        const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.5, 4, 6), trunkMat);
        trunk.position.set(tx, 2, tz);
        const leaves = new THREE.Mesh(new THREE.ConeGeometry(3.5, 7, 7), foliageMat);
        leaves.position.set(tx, 6, tz);
        scene.add(trunk); scene.add(leaves);
        this.obstacles.push({ x: tx, z: tz, radius: 2.2 });
      }

      // Speed Trap gate at [75, 75]
      const gateMat = new THREE.MeshStandardMaterial({ color: 0xef4444, metalness: 0.8 });
      const gL = new THREE.Mesh(new THREE.BoxGeometry(1, 6, 1), gateMat); gL.position.set(70, 3, 75);
      const gR = new THREE.Mesh(new THREE.BoxGeometry(1, 6, 1), gateMat); gR.position.set(80, 3, 75);
      const gTop = new THREE.Mesh(new THREE.BoxGeometry(11, 0.8, 1), gateMat); gTop.position.set(75, 6, 75);
      scene.add(gL); scene.add(gR); scene.add(gTop);
    },

    checkCollision(x, z, carRadius = 1.2) {
      // Invisible world boundaries (-150 to +150)
      let clampedX = Math.max(-147, Math.min(147, x));
      let clampedZ = Math.max(-147, Math.min(147, z));
      let hit = clampedX !== x || clampedZ !== z;

      for (let i = 0; i < this.obstacles.length; i++) {
        const obs = this.obstacles[i];
        const dx = clampedX - obs.x, dz = clampedZ - obs.z;
        const dist = Math.hypot(dx, dz);
        const minDist = obs.radius + carRadius;
        if (dist < minDist) {
          hit = true;
          const angle = Math.atan2(dz, dx);
          clampedX = obs.x + Math.cos(angle) * (minDist + 0.1);
          clampedZ = obs.z + Math.sin(angle) * (minDist + 0.1);
        }
      }
      return { x: clampedX, z: clampedZ, hit };
    },

    drawMiniMap(canvas, playerX, playerZ, playerYaw) {
      if (!canvas) return;
      const ctx = canvas.getContext('2d'), w = canvas.width, h = canvas.height;
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)'; ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 1.5; ctx.strokeRect(0, 0, w, h);

      // Scale 300 units to canvas width/height
      const toPxX = (worldX) => ((worldX + 150) / 300) * w;
      const toPxZ = (worldZ) => ((worldZ + 150) / 300) * h;

      // Roads
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(toPxX(0), 0); ctx.lineTo(toPxX(0), h); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, toPxZ(0)); ctx.lineTo(w, toPxZ(0)); ctx.stroke();

      // Points of interest
      (window.nitroraceAeMaps?.pois || []).forEach(p => {
        ctx.fillStyle = p.color;
        ctx.beginPath(); ctx.arc(toPxX(p.x), toPxZ(p.z), 3, 0, Math.PI * 2); ctx.fill();
      });

      // Player Arrow
      const px = toPxX(playerX), pz = toPxZ(playerZ);
      ctx.save();
      ctx.translate(px, pz);
      ctx.rotate(-playerYaw);
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.moveTo(0, -6); ctx.lineTo(4, 4); ctx.lineTo(-4, 4); ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
  };
})();
