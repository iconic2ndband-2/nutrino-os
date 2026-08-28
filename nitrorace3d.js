/* FILE: nitrorace3d.js — 3D Three.js scene & smooth Canvas 2D fallback renderer */
(function() {
  const LANES = [-2.2, 0, 2.2];

  function isWebGLSupported() {
    try {
      const c = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && (c.getContext('webgl') || c.getContext('experimental-webgl')));
    } catch (e) { return false; }
  }

  function initWebGL(mountEl) {
    try {
      if (!isWebGLSupported() || typeof THREE === 'undefined') return null;
      const w = mountEl.clientWidth || 360, h = mountEl.clientHeight || 480;
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
      renderer.setSize(w, h);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      mountEl.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x0a0e1a);
      scene.fog = new THREE.FogExp2(0x0a0e1a, 0.018);

      const camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 200);
      camera.position.set(0, 3.5, 7.5); camera.lookAt(0, 1.2, -10);

      const hemi = new THREE.HemisphereLight(0xffffff, 0x444444, 1.2); scene.add(hemi);
      const dir = new THREE.DirectionalLight(0xffffff, 1.5);
      dir.position.set(10, 20, 10); scene.add(dir);

      const roadSegments = [];
      for (let i = 0; i < 20; i++) {
        const road = new THREE.Mesh(new THREE.PlaneGeometry(7.5, 20), new THREE.MeshLambertMaterial({ color: 0x1f2430 }));
        road.rotation.x = -Math.PI / 2; road.position.z = -i * 20;
        scene.add(road); roadSegments.push(road);
      }

      const playerCar = new THREE.Group();
      const body = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.5, 2.6), new THREE.MeshLambertMaterial({ color: 0xf43f5e }));
      body.position.y = 0.4; playerCar.add(body);
      const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.4, 1.3), new THREE.MeshLambertMaterial({ color: 0x1e293b }));
      cabin.position.set(0, 0.75, -0.1); playerCar.add(cabin);
      const spoiler = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.08, 0.3), new THREE.MeshLambertMaterial({ color: 0x000000 }));
      spoiler.position.set(0, 0.85, 1.1); playerCar.add(spoiler);
      scene.add(playerCar);

      return { is2D: false, scene, camera, renderer, roadSegments, playerCar };
    } catch (e) {
      console.warn('WebGL init failed, switching to 2D Fallback:', e);
      return null;
    }
  }

  function initCanvas2D(mountEl) {
    const canvas = document.createElement('canvas');
    const w = mountEl.clientWidth || 360, h = mountEl.clientHeight || 480;
    canvas.width = w; canvas.height = h;
    canvas.style.width = '100%'; canvas.style.height = '100%';
    mountEl.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    const playerCar = { position: { x: 0, y: 0, z: 0 } };
    const roadSegments = [];
    for (let i = 0; i < 20; i++) roadSegments.push({ position: { z: -i * 20 } });

    return {
      is2D: true, canvas, ctx, width: w, height: h, playerCar, roadSegments,
      renderer: {
        render(scene, camera, obstacles, coinsList, currentX) {
          ctx.fillStyle = '#0a0e1a'; ctx.fillRect(0, 0, w, h);
          // Horizon & Road
          const hy = h * 0.38;
          ctx.fillStyle = '#0f172a'; ctx.fillRect(0, 0, w, hy);
          ctx.fillStyle = '#1e1b4b';
          ctx.beginPath(); ctx.moveTo(0, hy); ctx.lineTo(w * 0.25, hy - 25); ctx.lineTo(w * 0.5, hy); ctx.lineTo(w * 0.75, hy - 30); ctx.lineTo(w, hy); ctx.fill();
          // Road perspective
          ctx.fillStyle = '#18181b';
          ctx.beginPath(); ctx.moveTo(w * 0.38, hy); ctx.lineTo(w * 0.62, hy); ctx.lineTo(w * 0.95, h); ctx.lineTo(w * 0.05, h); ctx.closePath(); ctx.fill();
          // Road borders
          ctx.strokeStyle = '#f43f5e'; ctx.lineWidth = 3;
          ctx.beginPath(); ctx.moveTo(w * 0.38, hy); ctx.lineTo(w * 0.05, h); ctx.moveTo(w * 0.62, hy); ctx.lineTo(w * 0.95, h); ctx.stroke();
          // Obstacles & Coins
          const getScreenPos = (itemX, itemZ) => {
            const relZ = Math.max(0.01, (-itemZ + 5) / 95);
            const scale = Math.max(0.1, 1 - relZ);
            const sy = hy + (h - hy) * scale;
            const sx = (w * 0.5) + (itemX * 28) * scale * 2.2;
            return { sx, sy, scale };
          };

          (obstacles || []).forEach(o => {
            const p = getScreenPos(o.position.x, o.position.z);
            if (p.sy >= hy && p.sy <= h + 30) {
              const ow = 36 * p.scale, oh = 24 * p.scale;
              ctx.fillStyle = '#3b82f6'; ctx.fillRect(p.sx - ow / 2, p.sy - oh, ow, oh);
              ctx.strokeStyle = '#60a5fa'; ctx.strokeRect(p.sx - ow / 2, p.sy - oh, ow, oh);
            }
          });

          (coinsList || []).forEach(c => {
            const p = getScreenPos(c.position.x, c.position.z);
            if (p.sy >= hy && p.sy <= h + 30) {
              const r = 10 * p.scale;
              ctx.fillStyle = '#fbbf24'; ctx.beginPath(); ctx.arc(p.sx, p.sy - r, r, 0, Math.PI * 2); ctx.fill();
              ctx.fillStyle = '#d97706'; ctx.beginPath(); ctx.arc(p.sx, p.sy - r, r * 0.5, 0, Math.PI * 2); ctx.fill();
            }
          });

          // Player Car
          const cx = (w * 0.5) + (currentX * 28) * 2.2;
          const cy = h * 0.86;
          ctx.fillStyle = '#f43f5e';
          ctx.beginPath(); ctx.roundRect(cx - 24, cy - 20, 48, 28, 6); ctx.fill();
          ctx.fillStyle = '#0f172a'; ctx.fillRect(cx - 16, cy - 14, 32, 12);
          ctx.fillStyle = '#38bdf8'; ctx.fillRect(cx - 20, cy - 18, 8, 4); ctx.fillRect(cx + 12, cy - 18, 8, 4);
        }
      }
    };
  }

  window.nitroRace3D = {
    LANES,
    initScene(mountEl) {
      const gl = initWebGL(mountEl);
      return gl || initCanvas2D(mountEl);
    },
    spawnObstacle(scene, obstacles, coinsList) {
      const lane = LANES[Math.floor(Math.random() * LANES.length)];
      const isCoin = Math.random() > 0.65;
      if (scene && typeof THREE !== 'undefined') {
        if (isCoin) {
          const cMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.1, 16), new THREE.MeshLambertMaterial({ color: 0xfbbf24 }));
          cMesh.rotation.z = Math.PI / 2; cMesh.position.set(lane, 0.6, -90);
          scene.add(cMesh); coinsList.push(cMesh);
        } else {
          const obs = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.9, 2.0), new THREE.MeshLambertMaterial({ color: 0x3b82f6 }));
          obs.position.set(lane, 0.5, -90);
          scene.add(obs); obstacles.push(obs);
        }
      } else {
        const item = { position: { x: lane, y: 0.5, z: -90 }, rotation: { y: 0 } };
        if (isCoin) coinsList.push(item); else obstacles.push(item);
      }
    }
  };
})();
