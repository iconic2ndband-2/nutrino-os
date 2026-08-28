/* FILE: network.nos.js — Internet Service Provider site (network.nos) */
window.networkNos = {
  getHtml() {
    const plans = window.CONSTANTS.NETWORK_PLANS;
    const currentPlanId = (window.os.state.currentPlan || 'free').toLowerCase();
    const currentPlan = plans.find(p => p.id === currentPlanId) || plans[0];
    const dataUsedMB = window.os.state.dataUsage || 0;
    const dataLimitMB = (currentPlan.dataLimitGB || 1) * 1024;
    const pctUsed = Math.min(100, Math.round((dataUsedMB / dataLimitMB) * 100));
    const isExceeded = window.os.isDataExceeded ? window.os.isDataExceeded() : false;
    const effectiveSpeed = window.os.getEffectiveSpeed ? window.os.getEffectiveSpeed() : currentPlan.speed;

    const plansHtml = plans.map(p => {
      const isCurrent = p.id === currentPlan.id;
      return `
        <div class="net-plan-card ${isCurrent ? 'active-plan' : ''}">
          <div class="net-plan-info">
            <div class="net-plan-name">${p.name}</div>
            <div class="net-plan-speed">⚡ ${p.speed} Mbps • ${p.dataLimitGB} GB Limit</div>
            <div class="net-plan-price">${p.price === 0 ? 'Free' : `$${p.price}/mo`}</div>
          </div>
          <button class="btn-primary net-sub-btn" data-plan="${p.id}" ${isCurrent ? 'disabled' : ''}>
            ${isCurrent ? 'Active' : 'Subscribe'}
          </button>
        </div>
      `;
    }).join('');

    return `
      <div class="site-network-container">
        <div class="net-header">
          <div class="net-logo">🌐 Nutrino Telecom (network.nos)</div>
          <div class="net-tagline">High-speed simulated broadband provider</div>
        </div>

        <div class="net-status-banner">
          <div class="net-stat-box">
            <span class="net-stat-label">Current Plan</span>
            <span class="net-stat-val" id="net-current-name">${currentPlan.name} (${currentPlan.speed} Mbps)</span>
          </div>
          <div class="net-stat-box">
            <span class="net-stat-label">Effective Speed</span>
            <span class="net-stat-val" style="color:${isExceeded ? '#f43f5e' : '#34d399'};">${effectiveSpeed} Mbps ${isExceeded ? '(Throttled)' : ''}</span>
          </div>
          <div class="net-stat-box">
            <span class="net-stat-label">SuperBank Balance</span>
            <span class="net-stat-val" id="net-bank-bal">$${(Number(window.os.state.bankBalance) || 0).toFixed(2)}</span>
          </div>
        </div>

        <div class="net-calc-box">
          <div style="display:flex;justify-content:space-between;font-size:12px;font-weight:600;margin-bottom:6px;">
            <span>Data Usage: ${dataUsedMB.toFixed(1)} MB / ${(dataLimitMB / 1024).toFixed(0)} GB</span>
            <span style="color:${pctUsed > 90 ? '#ef4444' : '#38bdf8'};">${pctUsed}%</span>
          </div>
          <div class="store-progress-bar-wrap" style="height:8px;background:rgba(255,255,255,0.1);border-radius:4px;overflow:hidden;">
            <div style="width:${pctUsed}%;height:100%;background:${isExceeded ? '#ef4444' : '#38bdf8'};transition:width 0.3s;"></div>
          </div>
          ${isExceeded ? '<div style="color:#ef4444;font-size:11px;margin-top:6px;font-weight:600;">⚠️ Monthly limit reached! Speed throttled to 1 Mbps. Upgrade plan to restore speeds.</div>' : ''}
        </div>

        <div class="net-calc-box" style="margin-top:10px;">
          <div class="net-section-title">⏱️ Transfer Time Calculator</div>
          <div class="net-calc-row">
            <input type="number" id="net-calc-size" value="10" min="1" max="10000" class="net-input" placeholder="File size (MB)">
            <button id="net-calc-btn" class="btn-primary" style="min-height: 38px; padding: 0 14px;">Calculate</button>
          </div>
          <div id="net-calc-result" class="net-calc-res">10 MB on ${currentPlan.name} takes ${(10 / effectiveSpeed).toFixed(1)}s</div>
        </div>

        <div class="net-section-title" style="margin-top: 14px;">Available ISP Tiers</div>
        <div class="net-plans-grid">${plansHtml}</div>
      </div>
    `;
  },

  bindEvents(container, refreshSite) {
    if (!container) return;

    container.querySelectorAll('.net-sub-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const planId = btn.dataset.plan;
        const plan = (window.CONSTANTS.NETWORK_PLANS || []).find(p => p.id === planId);
        if (!plan) return;
        if (plan.price === 0) {
          const res = window.os.setInternetPlan(planId);
          if (res.success) {
            window.animations.showToast(res.message);
            if (typeof refreshSite === 'function') refreshSite();
          }
        } else {
          window.os.purchase(`ISP: ${plan.name} (${plan.speed} Mbps)`, plan.price, () => {
            window.os.setInternetPlan(planId);
            window.animations.showToast(`Active: ${plan.name} (${plan.speed} Mbps)`);
            if (typeof refreshSite === 'function') refreshSite();
          });
        }
      });
    });

    const calcBtn = container.querySelector('#net-calc-btn');
    const calcInput = container.querySelector('#net-calc-size');
    const calcRes = container.querySelector('#net-calc-result');
    if (calcBtn && calcInput && calcRes) {
      calcBtn.addEventListener('click', () => {
        const size = parseFloat(calcInput.value) || 0;
        const currentSpeed = window.os.getEffectiveSpeed ? window.os.getEffectiveSpeed() : (window.os.state.internetSpeed || 1);
        const time = window.os.getDownloadTime(size);
        calcRes.textContent = `${size} MB at ${currentSpeed} Mbps = ${time.toFixed(1)}s (${time < 60 ? time.toFixed(1) + ' seconds' : (time/60).toFixed(1) + ' min'})`;
      });
    }
  }
};
