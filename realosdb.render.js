/* FILE: realosdb.render.js — UI render templates and store formatter for real-osdb */
(function() {
  function escapeHtml(str) {
    if (typeof str !== 'string') str = JSON.stringify(str);
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  window.realOsdbRender = {
    renderCard(storeName, items, isExpanded, searchQuery) {
      let filtered = items;
      if (searchQuery) {
        filtered = items.filter(it => JSON.stringify(it).toLowerCase().includes(searchQuery.toLowerCase()));
      }
      const count = items.length;
      const badgeColor = count > 0 ? '#34d399' : '#94a3b8';

      let itemsHtml = '';
      if (isExpanded) {
        if (filtered.length === 0) {
          itemsHtml = `<div style="padding:8px 12px;font-size:11px;color:#94a3b8;font-style:italic;">No records found in "${storeName}"</div>`;
        } else {
          itemsHtml = filtered.map(it => {
            let specialPreview = '';
            if (storeName === 'gallery' && it.dataUrl) {
              specialPreview = `<img src="${it.dataUrl}" style="width:48px;height:48px;object-fit:cover;border-radius:4px;margin-top:4px;border:1px solid #4a1515;" alt="thumb">`;
            } else if (storeName === 'notes' && it.content) {
              specialPreview = `<div style="font-size:10px;color:#ffaaaa;margin-top:2px;">"${escapeHtml(it.content.slice(0, 60))}"</div>`;
            }
            return `
              <div style="background:#150505;border:1px solid rgba(255,68,68,0.2);border-radius:6px;padding:6px 8px;margin-bottom:4px;font-family:monospace;font-size:10px;">
                <div style="display:flex;justify-content:space-between;color:#ff6666;font-weight:700;">
                  <span>ID: ${escapeHtml(it.id || 'record')}</span>
                  <span style="color:#64748b;font-size:9px;">${typeof it.val !== 'undefined' ? typeof it.val : 'object'}</span>
                </div>
                <pre style="margin:4px 0 0;color:#cbd5e1;white-space:pre-wrap;word-break:break-all;max-height:90px;overflow-y:auto;">${escapeHtml(JSON.stringify(it.val !== undefined ? it.val : it, null, 2))}</pre>
                ${specialPreview}
              </div>`;
          }).join('');
        }
      }

      return `
        <div class="osdb-store-card" data-store="${storeName}" style="background:#1e0808;border:1px solid #4a1515;border-radius:8px;margin-bottom:8px;overflow:hidden;">
          <div class="osdb-store-header" data-store="${storeName}" style="display:flex;justify-content:space-between;align-items:center;padding:10px 12px;cursor:pointer;user-select:none;background:#240a0a;">
            <div style="display:flex;align-items:center;gap:8px;">
              <span style="font-size:13px;color:#ff4444;">${isExpanded ? '▼' : '▶'}</span>
              <span style="font-weight:700;font-size:13px;color:#fff;font-family:monospace;">${storeName}</span>
            </div>
            <span style="background:${badgeColor}22;color:${badgeColor};border:1px solid ${badgeColor}44;padding:2px 8px;border-radius:10px;font-size:10px;font-weight:700;font-family:monospace;">${count} items</span>
          </div>
          ${isExpanded ? `<div style="padding:8px 10px;border-top:1px solid #3a1010;">${itemsHtml}</div>` : ''}
        </div>`;
    }
  };
})();
