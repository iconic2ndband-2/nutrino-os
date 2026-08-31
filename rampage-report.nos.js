/* FILE: rampage-report.nos.js — Rampage Report developer & telemetry tools portal */
(function() {
  let currentTab = 'home';

  function renderTabContent() {
    if (currentTab === 'home') {
      return `
        <div style="padding:14px;">
          <div style="background:linear-gradient(135deg, #2b0808 0%, #150303 100%);border:1px solid #5a1414;border-radius:10px;padding:14px;text-align:center;margin-bottom:12px;">
            <span style="font-size:32px;">🔬</span>
            <h3 style="font-size:16px;font-weight:800;color:#ff4444;margin:6px 0 2px;">RAMPAGE REPORT</h3>
            <p style="font-size:11px;color:#ff9999;font-weight:600;">See Your Data, Live.</p>
            <p style="font-size:11px;color:#cbd5e1;line-height:1.4;margin:8px 0 10px;">Precision telemetry and low-overhead storage inspection tools built specifically for the Nutrino OS kernel ecosystem.</p>
            <button id="rr-launch-store-btn" class="btn-primary" style="background:#ff3333;font-size:12px;padding:0 16px;min-height:34px;">Get real-osdb (Free)</button>
          </div>
          <div style="background:#1a0505;border:1px solid #3d0e0e;border-radius:8px;padding:10px;margin-bottom:8px;">
            <div style="font-size:12px;font-weight:700;color:#ff6666;margin-bottom:4px;">⚡ Real-Time Engine</div>
            <div style="font-size:11px;color:#94a3b8;line-height:1.4;">Zero polling latency. Direct bidirectional link to IndexedDB osdb storage with live 1s updates.</div>
          </div>
          <div style="background:#1a0505;border:1px solid #3d0e0e;border-radius:8px;padding:10px;">
            <div style="font-size:12px;font-weight:700;color:#34d399;margin-bottom:4px;">🛡️ 100% Offline & Private</div>
            <div style="font-size:11px;color:#94a3b8;line-height:1.4;">Never phones home. All diagnostics, database exports, and stats run completely inside your browser sandbox.</div>
          </div>
        </div>`;
    } else if (currentTab === 'products') {
      return `
        <div style="padding:14px;">
          <div style="background:#1a0505;border:1px solid #5a1414;border-radius:8px;padding:12px;margin-bottom:10px;">
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <div style="font-size:14px;font-weight:700;color:#fff;">🔬 real-osdb</div>
              <span style="background:#34d39922;color:#34d399;border:1px solid #34d39944;padding:2px 6px;border-radius:4px;font-size:9px;font-weight:700;">v1.0.0</span>
            </div>
            <div style="font-size:11px;color:#94a3b8;margin:6px 0 8px;">Full 9-store IndexedDB inspector with JSON export, record deletion, and search filter.</div>
            <div style="font-size:10px;color:#ff6666;font-family:monospace;margin-bottom:8px;">Size: 10,000 MB • Price: $0.00 (Free)</div>
            <button id="rr-dl-product-btn" class="btn-primary" style="background:#ff3333;width:100%;font-size:11px;min-height:30px;">Open in SoftStore</button>
          </div>
        </div>`;
    } else if (currentTab === 'about') {
      return `
        <div style="padding:14px;font-size:12px;line-height:1.5;color:#cbd5e1;">
          <h4 style="color:#ff4444;font-size:14px;margin-bottom:6px;">About Rampage Report</h4>
          <p style="margin-bottom:8px;">Founded by developer systems researchers, Rampage Report creates diagnostic and deep telemetry tooling for next-gen sandboxed operating systems.</p>
          <p style="color:#94a3b8;font-size:11px;">Headquarters: Sector 7 Offline Matrix • Partner: Nutrino Dev Network</p>
        </div>`;
    } else {
      return `
        <div style="padding:14px;font-size:12px;color:#cbd5e1;">
          <h4 style="color:#ff4444;margin-bottom:6px;">Developer Support</h4>
          <p style="font-size:11px;color:#94a3b8;margin-bottom:10px;">Encountering an IndexedDB schema conflict or storage quota warning? Submit a local diagnostic ticket.</p>
          <button class="btn-secondary" style="width:100%;font-size:11px;" onclick="window.animations?.showToast?.('Diagnostic Report Logged Locally');">Generate Diagnostics Bundle</button>
        </div>`;
    }
  }

  window.rampageReportNos = {
    render(container) {
      container.innerHTML = `
        <div style="display:flex;flex-direction:column;height:100%;background:#0a0202;color:#fff;">
          <div style="background:#1c0606;border-bottom:1px solid #4a1515;padding:8px 12px;display:flex;justify-content:space-between;align-items:center;">
            <div style="display:flex;align-items:center;gap:6px;">
              <span style="font-size:16px;">🔬</span>
              <span style="font-weight:800;font-size:13px;color:#ff4444;letter-spacing:0.5px;">RAMPAGE REPORT</span>
            </div>
            <span style="font-size:9px;background:#ff444422;color:#ff6666;border:1px solid #ff444455;padding:2px 6px;border-radius:4px;">VERIFIED DEVELOPER</span>
          </div>
          <div style="display:flex;background:#140404;border-bottom:1px solid #330c0c;">
            ${['home', 'products', 'about', 'support'].map(tab => `
              <button class="rr-nav-tab" data-tab="${tab}" style="flex:1;background:none;border:none;color:${currentTab === tab ? '#ff4444' : '#94a3b8'};border-bottom:${currentTab === tab ? '2px solid #ff4444' : 'none'};padding:8px 0;font-size:11px;font-weight:700;text-transform:capitalize;cursor:pointer;">${tab}</button>
            `).join('')}
          </div>
          <div id="rr-tab-viewport" style="flex:1;overflow-y:auto;">${renderTabContent()}</div>
        </div>`;

      container.querySelectorAll('.rr-nav-tab').forEach(b => {
        b.onclick = () => { currentTab = b.dataset.tab; this.render(container); };
      });
      const pBtn = container.querySelector('#rr-launch-store-btn') || container.querySelector('#rr-dl-product-btn');
      if (pBtn) pBtn.onclick = () => window.os?.launchApp?.('softstore');
    }
  };
})();
