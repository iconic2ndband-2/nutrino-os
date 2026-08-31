/* FILE: nitroraceae.icon.js — Static 2D Canvas Icon with Motion Blur Car Effect */
(function() {
  window.nitroraceAeIcon = {
    draw(canvas) {
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const w = canvas.width, h = canvas.height;

      // Dark gradient background
      const bg = ctx.createLinearGradient(0, 0, w, h);
      bg.addColorStop(0, '#0f051d');
      bg.addColorStop(0.5, '#1e0a2d');
      bg.addColorStop(1, '#05020a');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      // Speed lines behind car
      ctx.lineWidth = 1.5;
      const lines = [
        { y: h * 0.35, x1: 4, x2: 24, c: 'rgba(239,68,68,0.7)' },
        { y: h * 0.48, x1: 2, x2: 30, c: 'rgba(244,63,94,0.9)' },
        { y: h * 0.62, x1: 6, x2: 22, c: 'rgba(239,68,68,0.6)' },
        { y: h * 0.74, x1: 3, x2: 20, c: 'rgba(251,191,36,0.8)' }
      ];
      lines.forEach(l => {
        ctx.strokeStyle = l.c;
        ctx.beginPath();
        ctx.moveTo(l.x1, l.y);
        ctx.lineTo(l.x2, l.y);
        ctx.stroke();
      });

      // Draw racing car with motion blur ghost layers
      const ghosts = [
        { x: w * 0.32, y: h * 0.42, alpha: 0.15, scale: 0.82 },
        { x: w * 0.42, y: h * 0.45, alpha: 0.35, scale: 0.90 },
        { x: w * 0.52, y: h * 0.48, alpha: 0.60, scale: 0.96 },
        { x: w * 0.62, y: h * 0.50, alpha: 1.00, scale: 1.00 }
      ];

      ghosts.forEach(g => {
        ctx.save();
        ctx.globalAlpha = g.alpha;
        ctx.translate(g.x, g.y);
        ctx.scale(g.scale, g.scale);

        // Car chassis (Ruby / Gold Anniversary color)
        ctx.fillStyle = '#e11d48';
        ctx.beginPath();
        ctx.roundRect ? ctx.roundRect(-16, -9, 32, 18, 4) : ctx.fillRect(-16, -9, 32, 18);
        ctx.fill();

        // Cockpit / Windshield
        ctx.fillStyle = '#0284c7';
        ctx.fillRect(-4, -6, 12, 12);

        // Spoiler
        ctx.fillStyle = '#991b1b';
        ctx.fillRect(-18, -10, 4, 20);

        // Gold Anniversary stripe
        ctx.fillStyle = '#fbbf24';
        ctx.fillRect(-12, -2, 24, 4);

        // Wheels
        ctx.fillStyle = '#18181b';
        ctx.fillRect(-12, -11, 8, 3);
        ctx.fillRect(6, -11, 8, 3);
        ctx.fillRect(-12, 8, 8, 3);
        ctx.fillRect(6, 8, 8, 3);

        ctx.restore();
      });

      // Glowing red border
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2.5;
      ctx.strokeRect(1, 1, w - 2, h - 2);

      // Gold AE Badge in corner
      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 9px sans-serif';
      ctx.fillText('AE', w - 16, 12);
    },

    mount(canvas) {
      if (!canvas) return;
      this.draw(canvas);
    }
  };
})();
