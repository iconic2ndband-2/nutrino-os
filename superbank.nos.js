/* FILE: superbank.nos.js — Local Digital Banking Portal (superbank.nos) */
window.superbankNos = {
  getTxHtml(txs) {
    if (!txs || txs.length === 0) return '<div class="bank-empty-tx">No transaction history recorded yet.</div>';
    return txs.slice(0, 10).map(t => {
      const isCredit = t.type === 'Deposit';
      return `
        <div class="bank-tx-row">
          <div class="bank-tx-info">
            <span class="bank-tx-type">${t.type}</span>
            <span class="bank-tx-desc">${t.desc || ''}</span>
            <span class="bank-tx-date">${t.date || ''}</span>
          </div>
          <div class="bank-tx-amount ${isCredit ? 'bank-tx-credit' : 'bank-tx-debit'}">${isCredit ? '+' : '-'}$${Math.abs(t.amount).toFixed(2)}</div>
        </div>`;
    }).join('');
  },

  getHtml() {
    const balance = Number(window.os.state.bankBalance) || 0;
    const txs = window.os.state.bankTransactions || [];

    return `
      <div class="site-bank-container">
        <div class="bank-header">
          <div class="bank-logo">🏛️ SuperBank Online</div>
          <div class="bank-tagline">Secure Decentralized Local Banking Portal</div>
        </div>

        <div class="bank-balance-card">
          <span class="bank-bal-label">Available Checking Balance</span>
          <span class="bank-bal-value" id="bank-current-bal">$${balance.toFixed(2)}</span>
          <span class="bank-acct-no">Account: #NOS-8849-3012 (Active)</span>
        </div>

        <div class="bank-actions-group">
          <div class="bank-tabs-nav">
            <button class="bank-tab-btn active" data-tab="deposit">Deposit Funds</button>
            <button class="bank-tab-btn" data-tab="withdraw">Withdraw</button>
            <button class="bank-tab-btn" data-tab="transfer">Transfer</button>
          </div>

          <div id="bank-tab-panel" class="bank-panel">
            <div class="bank-quick-chips" id="bank-quick-chips">
              <button type="button" class="bank-chip-btn" data-val="25">+$25</button>
              <button type="button" class="bank-chip-btn" data-val="50">+$50</button>
              <button type="button" class="bank-chip-btn" data-val="100">+$100</button>
              <button type="button" class="bank-chip-btn" data-val="500">+$500</button>
            </div>
            <div class="bank-input-row">
              <input type="number" id="bank-amount-input" class="bank-input" placeholder="Enter amount ($)" min="1" step="1">
              <input type="text" id="bank-recipient-input" class="bank-input" placeholder="Recipient Acct #" style="display:none;">
            </div>
            <button id="bank-submit-action" class="btn-primary bank-exec-btn">Confirm Deposit</button>
          </div>
        </div>

        <div class="bank-section-title">Recent Activity</div>
        <div class="bank-tx-list" id="bank-tx-list">${this.getTxHtml(txs)}</div>
      </div>
    `;
  },

  bindEvents(container, refreshSite) {
    if (!container) return;
    let activeTab = 'deposit';

    const tabBtns = container.querySelectorAll('.bank-tab-btn');
    const amtInput = container.querySelector('#bank-amount-input');
    const recipInput = container.querySelector('#bank-recipient-input');
    const submitBtn = container.querySelector('#bank-submit-action');
    const quickChips = container.querySelector('#bank-quick-chips');
    const balEl = container.querySelector('#bank-current-bal');
    const txListEl = container.querySelector('#bank-tx-list');

    const updateDom = () => {
      const curBal = Number(window.os.state.bankBalance) || 0;
      if (balEl) balEl.textContent = `$${curBal.toFixed(2)}`;
      if (txListEl) txListEl.innerHTML = this.getTxHtml(window.os.state.bankTransactions);
    };

    container.querySelectorAll('.bank-chip-btn').forEach(btn => {
      btn.onclick = () => { if (amtInput) amtInput.value = btn.dataset.val; };
    });

    tabBtns.forEach(btn => {
      btn.onclick = () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeTab = btn.dataset.tab;
        if (quickChips) quickChips.style.display = activeTab === 'deposit' ? 'grid' : 'none';
        if (recipInput) recipInput.style.display = activeTab === 'transfer' ? 'block' : 'none';
        submitBtn.textContent = activeTab === 'deposit' ? 'Confirm Deposit' : activeTab === 'withdraw' ? 'Confirm Withdrawal' : 'Send Wire Transfer';
      };
    });

    if (submitBtn && amtInput) {
      submitBtn.onclick = () => {
        const val = parseFloat(amtInput.value);
        if (!val || isNaN(val) || val <= 0) {
          window.animations?.showToast?.('Please enter a valid positive dollar amount.');
          return;
        }

        if (activeTab === 'deposit') {
          window.os.addBank(val, 'ATM Cash Deposit');
          updateDom();
          amtInput.value = '';
          window.animations?.showToast?.(`Deposited $${val.toFixed(2)} to checking account.`);
          if (typeof refreshSite === 'function') refreshSite();
        } else if (activeTab === 'withdraw') {
          const ok = window.os.deductBank(val, 'ATM Withdrawal');
          if (ok) {
            updateDom();
            amtInput.value = '';
            window.animations?.showToast?.(`Withdrew $${val.toFixed(2)}.`);
            if (typeof refreshSite === 'function') refreshSite();
          } else {
            window.animations?.showToast?.('SuperBank Error: Insufficient available funds.');
          }
        } else if (activeTab === 'transfer') {
          const recip = (recipInput?.value || '').trim() || 'Beneficiary #NOS-9921';
          const ok = window.os.deductBank(val, `Transfer to ${recip}`);
          if (ok) {
            updateDom();
            amtInput.value = '';
            if (recipInput) recipInput.value = '';
            window.animations?.showToast?.(`Transferred $${val.toFixed(2)} to ${recip}.`);
            if (typeof refreshSite === 'function') refreshSite();
          } else {
            window.animations?.showToast?.('SuperBank Error: Insufficient funds for transfer.');
          }
        }
      };
    }
  }
};
