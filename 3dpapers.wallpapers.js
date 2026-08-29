/* FILE: 3dpapers.wallpapers.js — 3D Three.js animation engine for live wallpapers */
(function() {
  function createNebula(s) {
    const group = new THREE.Group(), count = 600, geo = new THREE.BufferGeometry(), pos = [], col = [];
    const colors = [new THREE.Color(0xa855f7), new THREE.Color(0x3b82f6), new THREE.Color(0xec4899)];
    for (let i = 0; i < count; i++) {
      const r = (Math.random() * 12) + 2, theta = Math.random() * Math.PI * 2;
      pos.push(Math.cos(theta) * r, (Math.random() - 0.5) * 4, Math.sin(theta) * r);
      const c = colors[i % 3]; col.push(c.r, c.g, c.b);
    }
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
    group.add(new THREE.Points(geo, new THREE.PointsMaterial({ size: 0.35, vertexColors: true, transparent: true, opacity: 0.85 })));
    const core = new THREE.Mesh(new THREE.SphereGeometry(1.8, 16, 16), new THREE.MeshBasicMaterial({ color: 0xc084fc, wireframe: true }));
    group.add(core); s.add(group);
    return (t) => { group.rotation.y = t * 0.2; group.rotation.x = Math.sin(t * 0.1) * 0.15; core.rotation.z = t * 0.4; };
  }

  function createOcean(s) {
    const group = new THREE.Group();
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(24, 24, 16, 16), new THREE.MeshBasicMaterial({ color: 0x0369a1, wireframe: true, transparent: true, opacity: 0.5 }));
    floor.rotation.x = -Math.PI / 2.3; floor.position.y = -4; group.add(floor);
    const bGeo = new THREE.SphereGeometry(0.15, 8, 8), bMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 }), bubbles = [];
    for (let i = 0; i < 35; i++) {
      const b = new THREE.Mesh(bGeo, bMat);
      b.position.set((Math.random() - 0.5) * 16, (Math.random() - 0.5) * 10 - 2, (Math.random() - 0.5) * 8);
      b.userData = { speed: 0.03 + Math.random() * 0.04 }; group.add(b); bubbles.push(b);
    }
    s.add(group);
    return (t) => {
      bubbles.forEach(b => { b.position.y += b.userData.speed; if (b.position.y > 6) b.position.y = -5; b.position.x += Math.sin(t + b.position.y) * 0.01; });
      floor.rotation.z = Math.sin(t * 0.2) * 0.05;
    };
  }

  function createNeon(s) {
    const group = new THREE.Group();
    for (let i = 0; i < 20; i++) {
      const h = 2 + Math.random() * 7, w = 1 + Math.random() * 1.5;
      const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, w), new THREE.MeshBasicMaterial({ color: (i % 2 === 0 ? 0x06b6d4 : 0xec4899), wireframe: true }));
      b.position.set((Math.random() - 0.5) * 18, (h / 2) - 5, (Math.random() - 0.5) * 14); group.add(b);
    }
    s.add(group);
    return (t) => { group.position.z = (t * 2) % 6; group.rotation.y = Math.sin(t * 0.15) * 0.08; };
  }

  function createVolcano(s) {
    const group = new THREE.Group();
    const cone = new THREE.Mesh(new THREE.ConeGeometry(5, 7, 18, 4, true), new THREE.MeshBasicMaterial({ color: 0x7f1d1d, wireframe: true }));
    cone.position.y = -2; group.add(cone);
    const count = 100, geo = new THREE.BufferGeometry(), pos = [];
    for (let i = 0; i < count; i++) pos.push((Math.random() - 0.5) * 3, 1.5 + Math.random() * 8, (Math.random() - 0.5) * 3);
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    group.add(new THREE.Points(geo, new THREE.PointsMaterial({ color: 0xf97316, size: 0.4 }))); s.add(group);
    return (t) => {
      cone.rotation.y = t * 0.1; const arr = geo.attributes.position.array;
      for (let i = 1; i < arr.length; i += 3) {
        arr[i] += 0.08; arr[i - 1] += Math.sin(t * 2 + i) * 0.02;
        if (arr[i] > 8) { arr[i] = 1.5; arr[i - 1] = (Math.random() - 0.5) * 1.5; }
      }
      geo.attributes.position.needsUpdate = true;
    };
  }

  function createAurora(s) {
    const group = new THREE.Group(), count = 250, geo = new THREE.BufferGeometry(), pos = [], col = [];
    const c1 = new THREE.Color(0x10b981), c2 = new THREE.Color(0x06b6d4);
    for (let i = 0; i < count; i++) {
      pos.push((Math.random() - 0.5) * 20, 1 + Math.random() * 5, (Math.random() - 0.5) * 10);
      const c = (i % 2 === 0 ? c1 : c2); col.push(c.r, c.g, c.b);
    }
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
    group.add(new THREE.Points(geo, new THREE.PointsMaterial({ size: 0.45, vertexColors: true, transparent: true, opacity: 0.8 }))); s.add(group);
    return (t) => {
      const arr = geo.attributes.position.array;
      for (let i = 0; i < arr.length; i += 3) arr[i + 1] += Math.sin(t * 1.5 + arr[i] * 0.5) * 0.02;
      geo.attributes.position.needsUpdate = true; group.rotation.y = Math.sin(t * 0.1) * 0.1;
    };
  }

  let defaultInst = null;

  window.threeDPapersWallpapers = {
    createInstance(canvas, wallpaperId) {
      if (!window.THREE || !canvas) return null;
      const w = canvas.clientWidth || 320, h = canvas.clientHeight || 180;
      const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
      renderer.setSize(w, h, false);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      const scene = new THREE.Scene(), camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 1000);
      camera.position.z = 15;

      let onTick = null;
      if (wallpaperId === 'ocean') onTick = createOcean(scene);
      else if (wallpaperId === 'neon') onTick = createNeon(scene);
      else if (wallpaperId === 'volcano') onTick = createVolcano(scene);
      else if (wallpaperId === 'aurora') onTick = createAurora(scene);
      else onTick = createNebula(scene);

      let animId = null, isPaused = false, start = performance.now();
      const loop = (now) => {
        if (!isPaused) {
          const t = (now - start) * 0.001;
          if (onTick) onTick(t);
          if (renderer && scene && camera) renderer.render(scene, camera);
        }
        animId = requestAnimationFrame(loop);
      };
      animId = requestAnimationFrame(loop);

      return {
        pause() { isPaused = true; },
        resume() { isPaused = false; start = performance.now(); },
        stop() { if (animId) cancelAnimationFrame(animId); if (renderer) renderer.dispose(); }
      };
    },

    renderToCanvas(canvas, wallpaperId) {
      if (defaultInst) { defaultInst.stop(); defaultInst = null; }
      defaultInst = this.createInstance(canvas, wallpaperId);
      return defaultInst;
    },

    stop() { if (defaultInst) { defaultInst.stop(); defaultInst = null; } }
  };
})();
