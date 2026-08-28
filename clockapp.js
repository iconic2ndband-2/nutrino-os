/* FILE: clockapp.js — Clock application with real-time digital and canvas analog display */
(function() {
  let animFrameId = null;

  function drawClock(ctx, radius, date) {
    ctx.clearRect(-radius, -radius, radius * 2, radius * 2);

    ctx.beginPath();
    ctx.arc(0, 0, radius - 4, 0, 2 * Math.PI);
    ctx.fillStyle = document.body.classList.contains('light-theme') ? '#ffffff' : '#1e2029';
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = document.body.classList.contains('light-theme') ? '#cbd5e1' : '#334155';
    ctx.stroke();

    for (let num = 1; num <= 12; num++) {
      const ang = (num * Math.PI) / 6;
      ctx.rotate(ang);
      ctx.translate(0, -radius * 0.78);
      ctx.rotate(-ang);
      ctx.font = '600 13px -apple-system, sans-serif';
      ctx.fillStyle = document.body.classList.contains('light-theme') ? '#334155' : '#e2e8f0';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(num.toString(), 0, 0);
      ctx.rotate(ang);
      ctx.translate(0, radius * 0.78);
      ctx.rotate(-ang);
    }

    const hr = date.getHours() % 12;
    const min = date.getMinutes();
    const sec = date.getSeconds();
    const ms = date.getMilliseconds();

    const hrAngle = ((hr + min / 60 + sec / 3600) * Math.PI) / 6;
    drawHand(ctx, hrAngle, radius * 0.45, 4, document.body.classList.contains('light-theme') ? '#0f172a' : '#f8fafc');

    const minAngle = ((min + sec / 60) * Math.PI) / 30;
    drawHand(ctx, minAngle, radius * 0.65, 3, document.body.classList.contains('light-theme') ? '#475569' : '#cbd5e1');

    const secAngle = ((sec + ms / 1000) * Math.PI) / 30;
    drawHand(ctx, secAngle, radius * 0.75, 1.5, '#ef4444');

    ctx.beginPath();
    ctx.arc(0, 0, 4, 0, 2 * Math.PI);
    ctx.fillStyle = '#ef4444';
    ctx.fill();
  }

  function drawHand(ctx, pos, length, width, color) {
    ctx.beginPath();
    ctx.lineWidth = width;
    ctx.lineCap = 'round';
    ctx.strokeStyle = color;
    ctx.moveTo(0, 0);
    ctx.rotate(pos);
    ctx.lineTo(0, -length);
    ctx.stroke();
    ctx.rotate(-pos);
  }

  window.clockApp = {
    mount(container) {
      container.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; gap: 20px;">
          <canvas id="clock-canvas" width="220" height="220" style="width: 220px; height: 220px;"></canvas>
          <div style="text-align: center;">
            <div id="clock-digital-time" style="font-size: 38px; font-weight: 300; letter-spacing: -1px;">00:00:00</div>
            <div id="clock-digital-date" style="font-size: 14px; color: var(--text-muted); margin-top: 4px;">Loading...</div>
          </div>
        </div>
      `;

      const canvas = document.getElementById('clock-canvas');
      const timeEl = document.getElementById('clock-digital-time');
      const dateEl = document.getElementById('clock-digital-date');
      const ctx = canvas.getContext('2d');
      const radius = canvas.height / 2;
      ctx.translate(radius, radius);

      function loop() {
        const now = new Date();
        drawClock(ctx, radius, now);

        if (timeEl) {
          const h = String(now.getHours()).padStart(2, '0');
          const m = String(now.getMinutes()).padStart(2, '0');
          const s = String(now.getSeconds()).padStart(2, '0');
          timeEl.textContent = `${h}:${m}:${s}`;
        }
        if (dateEl) {
          dateEl.textContent = now.toLocaleDateString(undefined, {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          });
        }
        animFrameId = requestAnimationFrame(loop);
      }

      loop();
    },

    unmount() {
      if (animFrameId) {
        cancelAnimationFrame(animFrameId);
        animFrameId = null;
      }
    }
  };
})();
