/* FILE: nitroraceae.game.js — 30 FPS Game Engine, Three.js 3D Racing & Open World Runtime */
(function() {
  let isRunning = false, animFrameId = null, lastFrameTime = 0;
  let scene = null, camera = null, renderer = null, carMesh = null;
  let carState = { x: 0, y: 0, z: 0, yaw: 0, speed: 0, maxSpeed: 130 };
  let currentMapId = 'default', selectedCar = null, miniMapCanvas = null;

  window.nitroraceAeGame = {
    start(canvas, mapId, carId, onExit, onCrash) {
      if (isRunning) this.stop();
      isRunning = true;
      currentMapId = mapId;
      selectedCar = window.nitroraceAeCars.getCar(carId);

      const w = Math.max(200, canvas.parentElement?.clientWidth || canvas.clientWidth || 640);
      const h = Math.max(200, canvas.parentElement?.clientHeight || canvas.clientHeight || 360);

      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 1000);
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
      renderer.setSize(w, h);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));

      // Lighting
      const hemi = new THREE.HemisphereLight(0xffffff, 0x444444, 1.2);
      scene.add(hemi);
      const dirLight = new THREE.DirectionalLight(0xffedd5, 1.0);
      dirLight.position.set(40, 80, 50);
      scene.add(dirLight);

      // Add Selected Car
      carMesh = window.nitroraceAeCars.create3DCar(selectedCar);
      scene.add(carMesh);
      carState = { x: 0, y: 0, z: 0, yaw: 0, speed: 0, maxSpeed: selectedCar.topSpeed * 0.28 };

      if (mapId === 'openworld') {
        scene.background = new THREE.Color(0x0284c7);
        window.nitroraceAeOpenWorld.init(scene);
      } else {
        scene.background = new THREE.Color(0x0f172a);
        this.buildTrackScene(scene);
      }

      this.loop(onCrash);
    },

    buildTrackScene(sc) {
      const roadMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.7 });
      const road = new THREE.Mesh(new THREE.PlaneGeometry(18, 1200), roadMat);
      road.rotateX(-Math.PI / 2); road.position.set(0, 0, -500);
      sc.add(road);

      const grassMat = new THREE.MeshStandardMaterial({ color: 0x064e3b });
      const ground = new THREE.Mesh(new THREE.PlaneGeometry(300, 1200), grassMat);
      ground.rotateX(-Math.PI / 2); ground.position.set(0, -0.05, -500);
      sc.add(ground);

      // Track barriers
      const bMat = new THREE.MeshStandardMaterial({ color: 0xef4444 });
      const bL = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1, 1200), bMat);
      bL.position.set(-9.4, 0.5, -500);
      const bR = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1, 1200), bMat);
      bR.position.set(9.4, 0.5, -500);
      sc.add(bL); sc.add(bR);
    },

    loop(onCrash) {
      const targetDelta = 1000 / 30; // 30 FPS LOCK

      const step = (timestamp) => {
        if (!isRunning) return;
        animFrameId = requestAnimationFrame(step);

        const delta = timestamp - lastFrameTime;
        if (delta < targetDelta) return;
        lastFrameTime = timestamp - (delta % targetDelta);

        this.updatePhysics();
        if (renderer && scene && camera) {
          renderer.render(scene, camera);
        }

        if (miniMapCanvas && currentMapId === 'openworld' && window.nitroraceAeOpenWorld?.drawMiniMap) {
          window.nitroraceAeOpenWorld.drawMiniMap(miniMapCanvas, carState.x, carState.z, carState.yaw);
        }
      };

      lastFrameTime = performance.now();
      animFrameId = requestAnimationFrame(step);
    },

    updatePhysics() {
      const ctrl = window.nitroraceAeControls.state;
      const accel = (selectedCar?.accel || 70) * 0.003;
      const drag = 0.96;

      if (ctrl.forward > 0) carState.speed = Math.min(carState.maxSpeed, carState.speed + accel);
      else if (ctrl.forward < 0) carState.speed = Math.max(-carState.maxSpeed * 0.4, carState.speed - accel * 0.8);
      else carState.speed *= drag;

      if (Math.abs(carState.speed) > 0.02) {
        const turnSpeed = ((selectedCar?.handling || 75) * 0.00045) * Math.sign(carState.speed);
        carState.yaw += ctrl.steer * turnSpeed;
      }

      const nextX = carState.x - Math.sin(carState.yaw) * carState.speed;
      const nextZ = carState.z - Math.cos(carState.yaw) * carState.speed;

      if (currentMapId === 'openworld') {
        const res = window.nitroraceAeOpenWorld.checkCollision(nextX, nextZ, 1.2);
        carState.x = res.x;
        carState.z = res.z;
        if (res.hit) carState.speed *= 0.5;
      } else {
        carState.x = Math.max(-8, Math.min(8, nextX));
        carState.z = nextZ < -1000 ? 0 : nextZ; // Loop track
      }

      if (carMesh) {
        carMesh.position.set(carState.x, 0.1, carState.z);
        carMesh.rotation.y = carState.yaw;
      }

      // Camera Follow
      const camDist = 6.5, camH = 3.2;
      const cx = carState.x + Math.sin(carState.yaw) * camDist;
      const cz = carState.z + Math.cos(carState.yaw) * camDist;
      camera.position.set(cx, camH, cz);
      camera.lookAt(carState.x, 1.0, carState.z);

      this.updateHud();
    },

    updateHud() {
      const speedKmH = Math.round(Math.abs(carState.speed * 3.6 * 10));
      const spEl = document.getElementById('nrae-hud-speed');
      if (spEl) spEl.textContent = `${speedKmH} KM/H`;
    },

    setMiniMap(canvas) { miniMapCanvas = canvas; },

    stop() {
      isRunning = false;
      if (animFrameId) { cancelAnimationFrame(animFrameId); animFrameId = null; }
      if (renderer) { renderer.dispose(); renderer = null; }
      scene = null; camera = null; carMesh = null;
    }
  };
})();
