/* FILE: nitroraceae.screenshots.js — 3 Canvas-generated screenshots for website showcase */
(function() {
  function drawCarPreview(ctx, x, y, car, isSelected) {
    ctx.save();
    ctx.translate(x, y);
    // Background card
    ctx.fillStyle = isSelected ? 'rgba(239, 68, 68, 0.25)' : 'rgba(255, 255, 255, 0.06)';
    ctx.strokeStyle = isSelected ? '#ef4444' : 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = isSelected ? 2 : 1;
    ctx.beginPath();
    ctx.roundRect ? ctx.roundRect(-42, -50, 84, 100, 6) : ctx.fillRect(-42, -50, 84, 100);
    ctx.fill(); ctx.stroke();

    // Rarity Badge
    ctx.fillStyle = car.rarityColor;
    ctx.font = 'bold 8px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(car.rarity.toUpperCase(), 0, -36);

    // Car Top-down Visual
    ctx.fillStyle = car.color;
    ctx.fillRect(-12, -26, 24, 40);
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(-8, -12, 16, 12);
    ctx.fillStyle = car.accent;
    ctx.fillRect(-4, -26, 8, 38);
    // Wheels
    ctx.fillStyle = '#18181b';
    ctx.fillRect(-15, -22, 3, 10); ctx.fillRect(12, -22, 3, 10);
    ctx.fillRect(-15, 4, 3, 10); ctx.fillRect(12, 4, 3, 10);

    // Name
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 10px sans-serif';
    ctx.fillText(car.name, 0, 24);

    // Stats summary bar
    const barW = 60, barH = 3;
    const stats = [
      { v: car.topSpeed / 220, c: '#ef4444', y: 30 },
      { v: car.accel / 100, c: '#38bdf8', y: 36 },
      { v: car.handling / 100, c: '#10b981', y: 42 }
    ];
    stats.forEach(s => {
      ctx.fillStyle = 'rgba(255,255,255,0.15)';
      ctx.fillRect(-barW / 2, s.y, barW, barH);
      ctx.fillStyle = s.c;
      ctx.fillRect(-barW / 2, s.y, barW * s.v, barH);
    });
    ctx.restore();
  }

  window.nitroraceAeScreenshots = {
    drawSelection(canvas) {
      if (!canvas) return;
      const ctx = canvas.getContext('2d'), w = canvas.width, h = canvas.height;
      ctx.fillStyle = '#0b0816'; ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = '#fff'; ctx.font = 'bold 11px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('GARAGE — SELECT ANNIVERSARY VEHICLE', w / 2, 16);
      const cars = window.nitroraceAeCars?.list || [];
      const spacing = w / 3;
      cars.forEach((car, i) => {
        drawCarPreview(ctx, spacing * (i + 0.5), h * 0.58, car, i === 2);
      });
    },

    drawRace(canvas) {
      if (!canvas) return;
      const ctx = canvas.getContext('2d'), w = canvas.width, h = canvas.height;
      // Sky & road perspective
      const skyGrad = ctx.createLinearGradient(0, 0, 0, h * 0.5);
      skyGrad.addColorStop(0, '#0f172a'); skyGrad.addColorStop(1, '#312e81');
      ctx.fillStyle = skyGrad; ctx.fillRect(0, 0, w, h * 0.5);
      ctx.fillStyle = '#1e293b'; ctx.beginPath();
      ctx.moveTo(w * 0.4, h * 0.5); ctx.lineTo(w * 0.6, h * 0.5);
      ctx.lineTo(w * 0.95, h); ctx.lineTo(w * 0.05, h); ctx.closePath(); ctx.fill();
      // Curbs & lane markings
      ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(w * 0.4, h * 0.5); ctx.lineTo(w * 0.05, h); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(w * 0.6, h * 0.5); ctx.lineTo(w * 0.95, h); ctx.stroke();
      ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 2; ctx.setLineDash([8, 8]);
      ctx.beginPath(); ctx.moveTo(w * 0.5, h * 0.5); ctx.lineTo(w * 0.5, h); ctx.stroke();
      ctx.setLineDash([]);
      // Player car
      ctx.fillStyle = '#f59e0b'; ctx.fillRect(w * 0.5 - 16, h * 0.72, 32, 20);
      ctx.fillStyle = '#0284c7'; ctx.fillRect(w * 0.5 - 10, h * 0.74, 20, 8);
      // HUD
      ctx.fillStyle = 'rgba(0,0,0,0.6)'; ctx.fillRect(6, 6, 80, 32);
      ctx.fillStyle = '#38bdf8'; ctx.font = 'bold 12px monospace'; ctx.textAlign = 'left';
      ctx.fillText('184 KM/H', 10, 20);
      ctx.fillStyle = '#fbbf24'; ctx.font = '9px sans-serif';
      ctx.fillText('LAP 2/3 • POS 1/8', 10, 32);
    },

    drawOpenWorld(canvas) {
      if (!canvas) return;
      const ctx = canvas.getContext('2d'), w = canvas.width, h = canvas.height;
      // Sky & 3D ground
      const sky = ctx.createLinearGradient(0, 0, 0, h * 0.45);
      sky.addColorStop(0, '#0284c7'); sky.addColorStop(1, '#7dd3fc');
      ctx.fillStyle = sky; ctx.fillRect(0, 0, w, h * 0.45);
      ctx.fillStyle = '#15803d'; ctx.fillRect(0, h * 0.45, w, h * 0.55);
      // Distant mountains & skyline
      ctx.fillStyle = '#0369a1'; ctx.beginPath();
      ctx.moveTo(0, h * 0.45); ctx.lineTo(60, h * 0.32); ctx.lineTo(130, h * 0.45);
      ctx.lineTo(210, h * 0.28); ctx.lineTo(w, h * 0.45); ctx.fill();
      // Buildings & Trees
      ctx.fillStyle = '#334155'; ctx.fillRect(30, h * 0.42, 28, 40);
      ctx.fillRect(w - 70, h * 0.38, 35, 55);
      ctx.fillStyle = '#166534';
      ctx.beginPath(); ctx.arc(100, h * 0.48, 14, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(w - 120, h * 0.52, 16, 0, Math.PI * 2); ctx.fill();
      // Asphalt Crossroad
      ctx.fillStyle = '#374151'; ctx.beginPath();
      ctx.moveTo(w * 0.3, h * 0.45); ctx.lineTo(w * 0.7, h * 0.45);
      ctx.lineTo(w * 0.85, h); ctx.lineTo(w * 0.15, h); ctx.fill();
      // Roaming Car
      ctx.fillStyle = '#9333ea'; ctx.fillRect(w * 0.5 - 14, h * 0.68, 28, 18);
      ctx.fillStyle = '#0284c7'; ctx.fillRect(w * 0.5 - 8, h * 0.70, 16, 7);
      // Mini-map HUD
      ctx.fillStyle = 'rgba(0,0,0,0.7)'; ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 1.5;
      ctx.fillRect(w - 55, 8, 48, 48); ctx.strokeRect(w - 55, 8, 48, 48);
      ctx.fillStyle = '#ef4444'; ctx.beginPath();
      ctx.arc(w - 31, 32, 3, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#fbbf24'; ctx.font = 'bold 8px sans-serif'; ctx.textAlign = 'right';
      ctx.fillText('300×300 ROAM', w - 10, h - 8);
    },

    render(idx, canvas) {
      if (idx === 0) this.drawSelection(canvas);
      else if (idx === 1) this.drawRace(canvas);
      else if (idx === 2) this.drawOpenWorld(canvas);
    }
  };
})();
