/* FILE: realosdb.js — Real-time IndexedDB telemetry monitor app for osdb */
(function() {
  let timer = null, rootContainer = null, expandedStores = { settings: true, bank: true }, searchQuery = '';

  async function render() {
    if (!rootContainer || !window.osdb) return;
    const stats = await window.osdb.getStats();
    const storesData = await window.osdb.getAllStores();

    const storesHtml = Object.keys(storesData).map(s => {
      const isExp = Boolean(expandedStores[s]);
      return window.realOsdbRender.renderCard(s, storesData[s] || [], isExp, searchQuery);
    }).join('');

    rootContainer.innerHTML = `
      <div class="screen-view" style="display:flex;flex-direction:column;height:100%;background:#0d0303;color:#fff;overflow:hidden;">
        <div style="background:#1f0606;padding:12px 14px;border-bottom:1px solid #4a1515;display:flex;justify-content:space-between;align-items:center;">
          <div style="display:flex;align-items:center;gap:8px;">
            <span style="font-size:18px;">🔬</span>
            <div>
              <div style="font-size:14px;font-weight:800;color:#ff4444;font-family:monospace;">real-osdb v1.0.0</div>
              <div style="font-size:10px;color:#94a3b8;">Live IndexedDB Telemetry (osdb)</div>
            </div>
          </div>
          <button id="osdb-export-btn" class="btn-primary" style="background:#ff3333;font-size:11px;min-height:28px;padding:0 10px;font-family:monospace;">📥 Export JSON</button>
        </div>

        <div style="padding:8px 12px;background:#150505;border-bottom:1px solid #330c0c;display:flex;gap:8px;font-size:11px;font-family:monospace;color:#cbd5e1;overflow-x:auto;">
          <span>📦 <strong style="color:#ff6666;">${stats.stores}</strong> Stores</span> •
          <span>📝 <strong style="color:#ff6666;">${stats.totalEntries}</strong> Records</span> •
          <span>💾 <strong style="color:#34d399;">${stats.sizeMB} MB</strong> Used</span> •
          <span style="color:#38bdf8;">⚡ Live (1s)</span>
        </div>

        <div style="padding:8px 12px;background:#0d0303;">
          <input type="text" id="osdb-search-input" placeholder="🔍 Search keys or values across all stores..." value="${searchQuery}"
                 style="width:100%;box-sizing:border-box;background:#1a0707;border:1px solid #4a1515;border-radius:6px;padding:6px 10px;color:#fff;font-size:11px;font-family:monospace;outline:none;">
        </div>

        <div id="osdb-stores-list" style="flex:1;overflow-y:auto;padding:4px 12px 14px;">
          ${storesHtml}
        </div>
      </div>`;

    const searchIn = rootContainer.querySelector('#osdb-search-input');
    if (searchIn) {
      searchIn.oninput = (e) => { searchQuery = e.target.value; render(); };
      if (searchQuery) searchIn.focus();
    }

    const expBtn = rootContainer.querySelector('#osdb-export-btn');
    if (expBtn) {
      expBtn.onclick = async () => {
        await window.osdb.exportAll();
        window.animations?.showToast?.('Exported osdb_backup.json');
      };
    }

    rootContainer.querySelectorAll('.osdb-store-header').forEach(hdr => {
      hdr.onclick = () => {
        const store = hdr.dataset.store;
        expandedStores[store] = !expandedStores[store];
        render();
      };
    });
  }

  window.realosdbApp = {
    mount(container) {
      rootContainer = container;
      render();
      if (timer) clearInterval(timer);
      timer = setInterval(async () => {
        if (!searchQuery && rootContainer) {
          const activeEl = document.activeElement;
          if (activeEl && activeEl.id === 'osdb-search-input') return;
          render();
        }
      }, 1000);
    },
    unmount() {
      if (timer) { clearInterval(timer); timer = null; }
      rootContainer = null;
    }
  };
})();
