/* FILE: network.nos.js — Internet Service Provider site (network.nos) */
window.networkNos = {
  getHtml() {
    const plans = window.CONSTANTS.NETWORK_PLANS;
    const currentPlanId = (window.os.state.currentPlan || 'free').toLowerCase();
    const currentPlan = plans.find(p => p.id === currentPlanId) || plans[0];
    const dataUsed = (window.os.state.dataUsage || 0).toFixed(1);

    const plansHtml = plans.map(p => {
      const isCurrent = p.id === currentPlan.id;
      return `
        <div class="net-plan-card ${isCurrent ? 'active-plan' : ''}">
          <div class="net-plan-info">
            <div class="net-plan-name">${p.name}</div>
            <div class="net-plan-speed">⚡ ${p.speed} Mbps</div>
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
            <span class="net-stat-label">Data Consumed</span>
            <span class="net-stat-val" id="net-data-usage">${dataUsed} MB / Unlimited</span>
          </div>
          <div class="net-stat-box">
            <span class="net-stat-label">SuperBank Balance</span>
            <span class="net-stat-val" id="net-bank-bal">$${window.os.state.bankBalance}</span>
          </div>
        </div>

        <div class="net-calc-box">
          <div class="net-section-title">⏱️ Transfer Time Calculator</div>
          <div class="net-calc-row">
            <input type="number" id="net-calc-size" value="10" min="1" max="10000" class="net-input" placeholder="File size (MB)">
            <button id="net-calc-btn" class="btn-primary" style="min-height: 38px; padding: 0 14px;">Calculate</button>
          </div>
          <div id="net-calc-result" class="net-calc-res">10 MB on ${currentPlan.name} (${currentPlan.speed} Mbps) takes ${(10 / currentPlan.speed).toFixed(1)}s</div>
        </div>

        <div class="net-section-title" style="margin-top: 14px;">Available ISP Tiers</div>
        <div class="net-plans-grid">${plansHtml}</div>
      </div>
    `;
  },

  bindEvents(container, refreshSite) {
    if (!container) return;

    // Plan subscription handler
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

    // Speed calculation handler
    const calcBtn = container.querySelector('#net-calc-btn');
    const calcInput = container.querySelector('#net-calc-size');
    const calcRes = container.querySelector('#net-calc-result');
    if (calcBtn && calcInput && calcRes) {
      calcBtn.addEventListener('click', () => {
        const size = parseFloat(calcInput.value) || 0;
        const currentSpeed = window.os.state.internetSpeed || 1;
        const time = window.os.getDownloadTime(size);
        calcRes.textContent = `${size} MB at ${currentSpeed} Mbps = ${time.toFixed(1)}s (${time < 60 ? time.toFixed(1) + ' seconds' : (time/60).toFixed(1) + ' min'})`;
      });
    }
  }
};
