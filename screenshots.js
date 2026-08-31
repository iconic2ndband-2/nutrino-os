/* FILE: screenshots.js — Realistic canvas-generated app preview screenshots */
(function() {
  function drawNitroRace(ctx, w, h) {
    const sky = ctx.createLinearGradient(0, 0, 0, h * 0.45);
    sky.addColorStop(0, '#0f172a'); sky.addColorStop(1, '#312e81');
    ctx.fillStyle = sky; ctx.fillRect(0, 0, w, h * 0.45);
    ctx.fillStyle = '#1e1b4b';
    ctx.beginPath(); ctx.moveTo(0, h * 0.45); ctx.lineTo(w * 0.2, h * 0.3); ctx.lineTo(w * 0.45, h * 0.42);
    ctx.lineTo(w * 0.7, h * 0.25); ctx.lineTo(w, h * 0.45); ctx.fill();
    ctx.fillStyle = '#f43f5e'; ctx.beginPath(); ctx.arc(w * 0.5, h * 0.38, 22, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#064e3b'; ctx.fillRect(0, h * 0.45, w, h * 0.55);
    ctx.fillStyle = '#18181b';
    ctx.beginPath(); ctx.moveTo(w * 0.42, h * 0.45); ctx.lineTo(w * 0.58, h * 0.45);
    ctx.lineTo(w * 0.92, h); ctx.lineTo(w * 0.08, h); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = '#eab308'; ctx.lineWidth = 3; ctx.setLineDash([8, 10]);
    ctx.beginPath(); ctx.moveTo(w * 0.5, h * 0.45); ctx.lineTo(w * 0.5, h); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#ef4444'; ctx.beginPath(); ctx.roundRect(w * 0.42, h * 0.72, w * 0.16, h * 0.18, 6); ctx.fill();
    ctx.fillStyle = '#0f172a'; ctx.fillRect(w * 0.45, h * 0.75, w * 0.1, h * 0.08);
    ctx.fillStyle = '#38bdf8'; ctx.fillRect(w * 0.43, h * 0.72, 5, 4); ctx.fillRect(w * 0.55, h * 0.72, 5, 4);
    ctx.fillStyle = 'rgba(0,0,0,0.6)'; ctx.roundRect(10, 10, w - 20, 26, 6); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.font = 'bold 10px sans-serif'; ctx.fillText('SPEED: 184 KM/H', 16, 26);
    ctx.fillStyle = '#34d399'; ctx.fillText('DIST: 1,420M', w - 85, 26);
  }

  function drawGamesafe(ctx, w, h) {
    ctx.fillStyle = '#0b0f19'; ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#1e293b'; ctx.fillRect(0, 0, w, 36);
    ctx.fillStyle = '#38bdf8'; ctx.font = 'bold 12px sans-serif'; ctx.fillText('🛡️ GAMESAFE CLOUD', 12, 22);
    ctx.fillStyle = 'rgba(52,211,153,0.2)'; ctx.roundRect(w - 76, 8, 66, 20, 10); ctx.fill();
    ctx.fillStyle = '#34d399'; ctx.font = 'bold 9px sans-serif'; ctx.fillText('● ACTIVE', w - 64, 21);
    ctx.fillStyle = '#1e293b'; ctx.roundRect(10, 46, w - 20, 52, 8); ctx.fill();
    ctx.fillStyle = '#f43f5e'; ctx.fillRect(18, 54, 36, 36);
    ctx.fillStyle = '#fff'; ctx.font = '16px sans-serif'; ctx.fillText('🏎️', 26, 78);
    ctx.fillStyle = '#fff'; ctx.font = 'bold 11px sans-serif'; ctx.fillText('Nitro Race', 62, 65);
    ctx.fillStyle = '#94a3b8'; ctx.font = '10px sans-serif'; ctx.fillText('Score: 12,450m • Lv.4', 62, 80);
    ctx.fillStyle = '#38bdf8'; ctx.fillText('Synced 2m ago ✓', 62, 92);
    ctx.fillStyle = 'rgba(56,189,248,0.1)'; ctx.roundRect(10, 106, w - 20, 36, 8); ctx.fill();
    ctx.fillStyle = '#38bdf8'; ctx.font = 'bold 10px sans-serif'; ctx.fillText('🔒 Wipe Fresh Protection: ON', 18, 128);
  }

  function drawWipeFresh(ctx, w, h) {
    ctx.fillStyle = '#18181b'; ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#27272a'; ctx.strokeStyle = 'rgba(239,68,68,0.4)'; ctx.lineWidth = 1.5;
    ctx.roundRect(12, 14, w - 24, h - 28, 12); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#ef4444'; ctx.font = '24px sans-serif'; ctx.fillText('⚠️', w * 0.5 - 12, 44);
    ctx.fillStyle = '#fff'; ctx.font = 'bold 13px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('Factory Reset Ready', w * 0.5, 66);
    ctx.fillStyle = '#94a3b8'; ctx.font = '10px sans-serif';
    ctx.fillText('Clean system partitions & cache', w * 0.5, 82);
    ctx.fillText('Protect Gamesafe save files', w * 0.5, 96);
    ctx.fillStyle = '#475569'; ctx.roundRect(22, h - 42, (w - 52) * 0.48, 22, 6); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.font = 'bold 9px sans-serif'; ctx.fillText('Cancel', 22 + (w - 52) * 0.24, h - 28);
    ctx.fillStyle = '#ef4444'; ctx.roundRect(w - 22 - (w - 52) * 0.48, h - 42, (w - 52) * 0.48, 22, 6); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.fillText('Reset', w - 22 - (w - 52) * 0.24, h - 28);
    ctx.textAlign = 'left';
  }

  window.screenshots = {
    render(appId, canvas, shotIndex = 0) {
      if (!canvas) return;
      const ctx = canvas.getContext('2d'), w = canvas.width, h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      if (appId === 'realosdb' && window.realOsdbScreenshots) window.realOsdbScreenshots.render(shotIndex, canvas);
      else if (appId === 'nitrorace') drawNitroRace(ctx, w, h);
      else if (appId === 'gamesafe') drawGamesafe(ctx, w, h);
      else if (appId === 'wipefresh') drawWipeFresh(ctx, w, h);
    }
  };
})();
