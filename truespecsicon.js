/* FILE: truespecsicon.js — Live rotating 2D Canvas icon for Truespecs app */
(function() {
  let activeCanvas = null;
  let animId = null;
  let angle = 0;

  function drawChip(ctx, x, y, size, label) {
    ctx.save();
    ctx.translate(x, y);

    // Chip square base
    ctx.fillStyle = 'rgba(26, 10, 15, 0.85)';
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(-size / 2, -size / 2, size, size, 3);
    ctx.fill();
    ctx.stroke();

    // Chip connector pins
    ctx.strokeStyle = '#FFD1DC';
    ctx.lineWidth = 1;
    const pinLen = size * 0.22;
    const offsets = [-size * 0.25, 0, size * 0.25];
    offsets.forEach(off => {
      // Top pins
      ctx.beginPath(); ctx.moveTo(off, -size / 2); ctx.lineTo(off, -size / 2 - pinLen); ctx.stroke();
      // Bottom pins
      ctx.beginPath(); ctx.moveTo(off, size / 2); ctx.lineTo(off, size / 2 + pinLen); ctx.stroke();
      // Left pins
      ctx.beginPath(); ctx.moveTo(-size / 2, off); ctx.lineTo(-size / 2 - pinLen, off); ctx.stroke();
      // Right pins
      ctx.beginPath(); ctx.moveTo(size / 2, off); ctx.lineTo(size / 2 + pinLen, off); ctx.stroke();
    });

    // Label
    ctx.fillStyle = '#FFFFFF';
    ctx.font = `bold ${Math.max(6, Math.floor(size * 0.42))}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, 0, 0);

    ctx.restore();
  }

  function drawRam(ctx, x, y, w, h) {
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = '#1a0a0f';
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.roundRect(-w / 2, -h / 2, w, h, 2);
    ctx.fill();
    ctx.stroke();

    // RAM chips along the stick
    ctx.fillStyle = '#FFD1DC';
    const chipW = w * 0.2;
    const chipH = h * 0.55;
    [-w * 0.28, 0, w * 0.28].forEach(cx => {
      ctx.fillRect(cx - chipW / 2, -chipH / 2, chipW, chipH);
    });

    ctx.restore();
  }

  function animate() {
    if (!activeCanvas) return;
    const ctx = activeCanvas.getContext('2d');
    if (!ctx) return;

    const w = activeCanvas.width;
    const h = activeCanvas.height;
    const cx = w / 2;
    const cy = h / 2;
    const r = Math.min(w, h) / 2;

    ctx.clearRect(0, 0, w, h);

    // Rounded background with pink glow
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(0, 0, w, h, Math.floor(w * 0.25));
    ctx.clip();

    const bgGrad = ctx.createLinearGradient(0, 0, w, h);
    bgGrad.addColorStop(0, '#FF1493');
    bgGrad.addColorStop(1, '#FF69B4');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    // Subtle inner shadow / border
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, w - 2, h - 2);

    // Rotating elements container
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);

    // Subtle orbital ring
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.55, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.setLineDash([3, 3]);
    ctx.stroke();
    ctx.setLineDash([]);

    // 1. CPU in Center
    drawChip(ctx, 0, 0, r * 0.48, 'CPU');

    // 2. GPU Chip (Top-Right orbital position)
    drawChip(ctx, r * 0.42, -r * 0.38, r * 0.34, 'GPU');

    // 3. RAM Module (Bottom-Left orbital position)
    drawRam(ctx, -r * 0.38, r * 0.38, r * 0.55, r * 0.22);

    ctx.restore();
    ctx.restore();

    // 4-6 seconds per full rotation (0.015 rad/frame ≈ 5.5s at 60fps)
    angle += 0.014;
    if (angle >= Math.PI * 2) angle -= Math.PI * 2;

    animId = requestAnimationFrame(animate);
  }

  window.truespecsIcon = {
    mount(canvasEl) {
      if (!canvasEl) return;
      activeCanvas = canvasEl;
      if (animId) cancelAnimationFrame(animId);
      animId = requestAnimationFrame(animate);
    },
    unmount() {
      if (animId) { cancelAnimationFrame(animId); animId = null; }
      activeCanvas = null;
    }
  };
})();
