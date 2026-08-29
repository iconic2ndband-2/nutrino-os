/* FILE: wipefresh.reboot.js — 3-Second Cinematic Godrays Reboot Engine for Clean Sessions */
(function() {
  let activeRebootAnim = null;

  window.wipefreshReboot = {
    launch(version = 'v1.1.2.2') {
      const rootEl = document.getElementById('os-root') || document.body;
      let rebootOverlay = document.getElementById('os-godrays-reboot');
      if (!rebootOverlay) {
        rebootOverlay = document.createElement('div');
        rebootOverlay.id = 'os-godrays-reboot';
        rebootOverlay.className = 'godrays-reboot-overlay';
        rootEl.appendChild(rebootOverlay);
      }

      rebootOverlay.innerHTML = `
        <canvas id="godrays-canvas" class="godrays-canvas"></canvas>
        <div class="godrays-content">
          <div class="godrays-core-badge"><div class="godrays-logo-glow">⚡</div></div>
          <div class="godrays-title">NUTRINO OS</div>
          <div class="godrays-version">${version}</div>
          <div class="godrays-status-bar"><div class="godrays-status-fill"></div></div>
          <div class="godrays-subtitle" id="godrays-sub-text">INITIALIZING CLEAN SESSION...</div>
        </div>`;
      rebootOverlay.style.display = 'flex';

      const canvas = rebootOverlay.querySelector('#godrays-canvas');
      const subText = rebootOverlay.querySelector('#godrays-sub-text');
      let ctx = null;
      if (canvas) {
        canvas.width = rootEl.clientWidth || 360;
        canvas.height = rootEl.clientHeight || 700;
        ctx = canvas.getContext('2d');
      }

      let angle = 0;
      const rebootStart = Date.now();
      const duration = 3000;

      function drawGodrays() {
        if (!ctx || !canvas) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const cx = canvas.width / 2;
        const cy = canvas.height / 2 - 30;
        const maxRadius = Math.max(canvas.width, canvas.height) * 1.2;

        const bgGrad = ctx.createRadialGradient(cx, cy, 20, cx, cy, maxRadius);
        bgGrad.addColorStop(0, '#1e1b4b');
        bgGrad.addColorStop(0.5, '#09090b');
        bgGrad.addColorStop(1, '#000000');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const rayCount = 18;
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(angle);

        for (let i = 0; i < rayCount; i++) {
          const rayAngle = (i * (Math.PI * 2)) / rayCount;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.arc(0, 0, maxRadius, rayAngle - 0.08, rayAngle + 0.08);
          ctx.closePath();

          const rayGrad = ctx.createRadialGradient(0, 0, 10, 0, 0, maxRadius);
          rayGrad.addColorStop(0, 'rgba(99, 102, 241, 0.45)');
          rayGrad.addColorStop(0.4, 'rgba(168, 85, 247, 0.25)');
          rayGrad.addColorStop(0.8, 'rgba(14, 165, 233, 0.1)');
          rayGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = rayGrad;
          ctx.fill();
        }
        ctx.restore();

        ctx.beginPath();
        ctx.arc(cx, cy, 70 + Math.sin(angle * 4) * 8, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(129, 140, 248, 0.35)';
        ctx.lineWidth = 3;
        ctx.stroke();

        angle += 0.035;
        const elapsed = Date.now() - rebootStart;
        if (subText) {
          if (elapsed < 1000) subText.textContent = 'BOOTING CLEAN KERNEL...';
          else if (elapsed < 2000) subText.textContent = 'STARTING COMPOSITOR & UI SHELL...';
          else subText.textContent = 'WELCOME TO NUTRINO OS';
        }

        if (elapsed < duration) {
          activeRebootAnim = requestAnimationFrame(drawGodrays);
        } else {
          if (activeRebootAnim) cancelAnimationFrame(activeRebootAnim);
          rebootOverlay.classList.add('fade-out');
          setTimeout(async () => {
            rebootOverlay.style.display = 'none';
            rebootOverlay.classList.remove('fade-out');
            if (window.os?.boot) {
              await window.os.boot();
              window.animations?.showToast?.(`✨ Clean session started with ${version}`);
            }
          }, 350);
        }
      }

      drawGodrays();
    },

    cancel() {
      if (activeRebootAnim) { cancelAnimationFrame(activeRebootAnim); activeRebootAnim = null; }
    }
  };
})();
