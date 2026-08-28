/* FILE: nitroracese.canvas.js — 2D Canvas graphics engine for Nitro Race SE (Tracks, Cars, Scenery) */
(function() {
  function drawCarBody(ctx, x, y, w, h, color) {
    ctx.save();
    ctx.translate(x, y);
    // Wheels
    ctx.fillStyle = '#09090b';
    ctx.fillRect(-w * 0.55, -h * 0.35, w * 0.2, h * 0.22);
    ctx.fillRect(w * 0.35, -h * 0.35, w * 0.2, h * 0.22);
    ctx.fillRect(-w * 0.55, h * 0.15, w * 0.2, h * 0.22);
    ctx.fillRect(w * 0.35, h * 0.15, w * 0.2, h * 0.22);
    // Main Body Chassis
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.roundRect(-w * 0.45, -h * 0.45, w * 0.9, h * 0.9, 8);
    ctx.fill();
    // Windshield & Cabin
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.roundRect(-w * 0.3, -h * 0.2, w * 0.6, h * 0.45, 4);
    ctx.fill();
    // Headlights (top-facing)
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(-w * 0.35, -h * 0.48, w * 0.2, 4);
    ctx.fillRect(w * 0.15, -h * 0.48, w * 0.2, 4);
    // Rear Spoiler
    ctx.fillStyle = '#000000';
    ctx.fillRect(-w * 0.48, h * 0.4, w * 0.96, 5);
    ctx.restore();
  }

  window.nrSeCanvas = {
    drawRotatingMenuCar(ctx, w, h, angle, color = '#f43f5e') {
      ctx.clearRect(0, 0, w, h);
      ctx.save();
      ctx.translate(w / 2, h / 2);
      ctx.rotate(angle);
      drawCarBody(ctx, 0, 0, 55, 95, color);
      ctx.restore();
    },

    drawCarPreview(ctx, x, y, carId) {
      const color = carId === 'new' ? '#0ea5e9' : '#f43f5e';
      drawCarBody(ctx, x, y, 42, 70, color);
    },

    drawTrack(ctx, w, h, mapId, scrollY) {
      const mapMeta = (window.CONSTANTS.SE_MAPS || []).find(m => m.id === mapId) || { bg: '#ca8a04', road: '#78350f', border: '#eab308' };
      // Off-road background
      ctx.fillStyle = mapMeta.bg;
      ctx.fillRect(0, 0, w, h);

      // Scenery decoration
      if (mapId === 'desert') {
        ctx.fillStyle = '#a16207';
        for (let i = 0; i < 6; i++) {
          const dy = ((scrollY * 0.5 + i * 90) % (h + 60)) - 30;
          ctx.beginPath(); ctx.arc(20, dy, 18, 0, Math.PI); ctx.fill();
          ctx.beginPath(); ctx.arc(w - 20, dy + 40, 22, 0, Math.PI); ctx.fill();
        }
      } else if (mapId === 'city') {
        ctx.fillStyle = '#0f172a';
        for (let i = 0; i < 5; i++) {
          const dy = ((scrollY * 0.8 + i * 110) % (h + 80)) - 40;
          ctx.fillRect(4, dy, 32, 60);
          ctx.fillRect(w - 36, dy + 30, 32, 60);
          ctx.fillStyle = '#38bdf8'; ctx.fillRect(10, dy + 10, 8, 8); ctx.fillRect(w - 24, dy + 40, 8, 8);
          ctx.fillStyle = '#0f172a';
        }
      } else if (mapId === 'snow') {
        ctx.fillStyle = '#ffffff';
        for (let i = 0; i < 15; i++) {
          const dy = ((scrollY * 1.2 + i * 45) % h);
          const dx = (i * 27 + (i % 2 === 0 ? 10 : w - 20)) % w;
          ctx.beginPath(); ctx.arc(dx, dy, 3, 0, Math.PI * 2); ctx.fill();
        }
      }

      // Asphalt Road
      const roadW = w * 0.72;
      const roadX = (w - roadW) / 2;
      ctx.fillStyle = mapMeta.road;
      ctx.fillRect(roadX, 0, roadW, h);

      // Road Borders
      ctx.strokeStyle = mapMeta.border;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(roadX, 0); ctx.lineTo(roadX, h);
      ctx.moveTo(roadX + roadW, 0); ctx.lineTo(roadX + roadW, h);
      ctx.stroke();

      // Dashed lane lines
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.setLineDash([24, 20]);
      ctx.lineDashOffset = -scrollY;
      const lane1 = roadX + roadW * 0.33;
      const lane2 = roadX + roadW * 0.66;
      ctx.beginPath();
      ctx.moveTo(lane1, 0); ctx.lineTo(lane1, h);
      ctx.moveTo(lane2, 0); ctx.lineTo(lane2, h);
      ctx.stroke();
      ctx.setLineDash([]);
    },

    drawObstacle(ctx, obs) {
      const col = obs.type === 'truck' ? '#e11d48' : '#3b82f6';
      drawCarBody(ctx, obs.x, obs.y, obs.w, obs.h, col);
    },

    drawPlayerCar(ctx, x, y, carId) {
      const col = carId === 'new' ? '#0ea5e9' : '#f43f5e';
      drawCarBody(ctx, x, y, 36, 62, col);
    }
  };
})();
