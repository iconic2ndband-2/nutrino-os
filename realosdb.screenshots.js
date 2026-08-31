/* FILE: realosdb.screenshots.js — 4 realistic canvas screenshots for real-osdb store preview */
(function() {
  function drawOverview(ctx, w, h) {
    ctx.fillStyle = '#0f0505'; ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#2a0a0a'; ctx.fillRect(0, 0, w, 28);
    ctx.fillStyle = '#ff4444'; ctx.font = 'bold 10px monospace'; ctx.fillText('🔬 real-osdb — Store Monitor', 10, 18);
    ctx.fillStyle = 'rgba(255,68,68,0.2)'; ctx.roundRect(10, 36, w - 20, 38, 6); ctx.fill();
    ctx.fillStyle = '#ff6666'; ctx.font = 'bold 9px monospace'; ctx.fillText('DATABASE: osdb (v1) • STORES: 9', 16, 50);
    ctx.fillStyle = '#fff'; ctx.font = '10px monospace'; ctx.fillText('ENTRIES: 34 • REAL USAGE: 0.18 MB', 16, 64);
    const stores = ['settings (3)', 'bank (2)', 'internet (3)', 'installed (4)', 'notes (6)', 'gallery (2)'];
    stores.forEach((s, idx) => {
      const col = idx % 2, row = Math.floor(idx / 2);
      const x = 10 + col * ((w - 26) / 2 + 6), y = 80 + row * 20;
      ctx.fillStyle = '#1c0808'; ctx.strokeStyle = '#4a1515'; ctx.lineWidth = 1;
      ctx.roundRect(x, y, (w - 26) / 2, 16, 4); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#ff9999'; ctx.font = '8px monospace'; ctx.fillText('📦 ' + s, x + 6, y + 11);
    });
  }

  function drawExpanded(ctx, w, h) {
    ctx.fillStyle = '#0f0505'; ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#2a0a0a'; ctx.fillRect(0, 0, w, 28);
    ctx.fillStyle = '#ff4444'; ctx.font = 'bold 10px monospace'; ctx.fillText('🔬 real-osdb — Store: [bank]', 10, 18);
    ctx.fillStyle = '#1c0808'; ctx.strokeStyle = '#661a1a'; ctx.lineWidth = 1;
    ctx.roundRect(10, 34, w - 20, 48, 6); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#34d399'; ctx.font = 'bold 9px monospace'; ctx.fillText('KEY: "balance" -> 100.00 USD', 18, 48);
    ctx.fillStyle = '#cbd5e1'; ctx.font = '8px monospace'; ctx.fillText('KEY: "transactions" -> [Array(4)]', 18, 62);
    ctx.fillStyle = '#888'; ctx.fillText('{ type: "Debit", amount: 20, desc: "Nitro..." }', 18, 74);
    ctx.fillStyle = '#1c0808'; ctx.strokeStyle = '#661a1a';
    ctx.roundRect(10, 88, w - 20, 52, 6); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#38bdf8'; ctx.font = 'bold 9px monospace'; ctx.fillText('KEY: "internet.plan" -> "ultra"', 18, 102);
    ctx.fillStyle = '#cbd5e1'; ctx.font = '8px monospace'; ctx.fillText('KEY: "internet.speed" -> 500 Mbps', 18, 116);
    ctx.fillText('KEY: "internet.data_used" -> 142.5 MB', 18, 128);
  }

  function drawSearch(ctx, w, h) {
    ctx.fillStyle = '#0f0505'; ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#2a0a0a'; ctx.fillRect(0, 0, w, 28);
    ctx.fillStyle = '#ff4444'; ctx.font = 'bold 10px monospace'; ctx.fillText('🔬 real-osdb — Filter & Search', 10, 18);
    ctx.fillStyle = '#1c0808'; ctx.strokeStyle = '#ff4444'; ctx.lineWidth = 1;
    ctx.roundRect(10, 34, w - 20, 22, 4); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#ffaaaa'; ctx.font = '9px monospace'; ctx.fillText('🔍 Query: "wallpaper"', 18, 48);
    ctx.fillStyle = 'rgba(255,68,68,0.15)'; ctx.roundRect(10, 62, w - 20, 36, 6); ctx.fill();
    ctx.fillStyle = '#ff6666'; ctx.font = 'bold 8px monospace'; ctx.fillText('MATCH: [settings] id: "wallpaper"', 18, 76);
    ctx.fillStyle = '#fff'; ctx.font = '8px monospace'; ctx.fillText('val: "gradient-1" (IndexedDB Record)', 18, 88);
    ctx.fillStyle = 'rgba(255,68,68,0.15)'; ctx.roundRect(10, 104, w - 20, 36, 6); ctx.fill();
    ctx.fillStyle = '#ff6666'; ctx.font = 'bold 8px monospace'; ctx.fillText('MATCH: [appdata] id: "wp_home_3d"', 18, 118);
    ctx.fillStyle = '#fff'; ctx.font = '8px monospace'; ctx.fillText('val: "nebula" (Live 3D Instance)', 18, 130);
  }

  function drawExport(ctx, w, h) {
    ctx.fillStyle = '#0f0505'; ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#2a0a0a'; ctx.fillRect(0, 0, w, 28);
    ctx.fillStyle = '#ff4444'; ctx.font = 'bold 10px monospace'; ctx.fillText('🔬 real-osdb — Export / Backup', 10, 18);
    ctx.fillStyle = '#1c0808'; ctx.strokeStyle = '#ff4444'; ctx.lineWidth = 1;
    ctx.roundRect(14, 38, w - 28, 64, 8); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#fff'; ctx.font = 'bold 11px monospace'; ctx.textAlign = 'center';
    ctx.fillText('📥 Export osdb_backup.json', w * 0.5, 58);
    ctx.fillStyle = '#888'; ctx.font = '9px monospace';
    ctx.fillText('9 Stores • Pure JSON format', w * 0.5, 74);
    ctx.fillText('100% Offline & Local Export', w * 0.5, 88);
    ctx.fillStyle = '#ff3333'; ctx.roundRect(24, 110, w - 48, 26, 6); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.font = 'bold 10px monospace'; ctx.fillText('DOWNLOAD BACKUP (.JSON)', w * 0.5, 126);
    ctx.textAlign = 'left';
  }

  window.realOsdbScreenshots = {
    render(index, canvas) {
      if (!canvas) return;
      const ctx = canvas.getContext('2d'), w = canvas.width, h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      if (index === 0) drawOverview(ctx, w, h);
      else if (index === 1) drawExpanded(ctx, w, h);
      else if (index === 2) drawSearch(ctx, w, h);
      else if (index === 3) drawExport(ctx, w, h);
    }
  };
})();
