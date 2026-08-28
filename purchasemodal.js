/* FILE: purchasemodal.js — 3-Step interactive OS purchase modal flow */
(function() {
  let modalEl = null;

  function createModalContainer() {
    if (modalEl) return modalEl;
    modalEl = document.createElement('div');
    modalEl.id = 'os-purchase-modal';
    modalEl.className = 'purchase-modal-backdrop';
    modalEl.style.display = 'none';
    const root = document.getElementById('os-root') || document.body;
    root.appendChild(modalEl);
    return modalEl;
  }

  function renderStep(container, step, data) {
    const { itemName, price, onSuccess, onCancel, stepData } = data;
    const balance = window.os ? window.os.state.bankBalance : 0;
    const txId = stepData?.txId || ('TX-' + Math.random().toString(36).substring(2, 9).toUpperCase());

    if (step === 1) {
      container.innerHTML = `
        <div class="purchase-modal-card">
          <div class="purchase-step-indicator">Step 1 of 3 • Confirmation</div>
          <div class="purchase-item-icon">🛍️</div>
          <div class="purchase-title">Confirm Purchase</div>
          <div class="purchase-item-name">${itemName}</div>
          <div class="purchase-price-tag">$${price.toFixed(2)}</div>
          <div class="purchase-notice">Review details before selecting payment method.</div>
          <div class="purchase-actions">
            <button id="pmodal-cancel-btn" class="btn-secondary">Cancel</button>
            <button id="pmodal-confirm-btn" class="btn-primary">Proceed to Payment</button>
          </div>
        </div>`;
      container.querySelector('#pmodal-cancel-btn').onclick = () => close(onCancel);
      container.querySelector('#pmodal-confirm-btn').onclick = () => renderStep(container, 2, data);
    } else if (step === 2) {
      container.innerHTML = `
        <div class="purchase-modal-card">
          <div class="purchase-step-indicator">Step 2 of 3 • Payment Method</div>
          <div class="purchase-title">Select Payment Source</div>
          <div class="purchase-method-card active">
            <div class="p-method-icon">🏦</div>
            <div class="p-method-info">
              <div class="p-method-title">SuperBank Checking</div>
              <div class="p-method-balance">Available Balance: $${balance.toFixed(2)}</div>
            </div>
            <div class="p-method-check">✓</div>
          </div>
          <div class="purchase-summary-row">
            <span>Total Due:</span>
            <span style="font-weight: 700; color: var(--text-primary);">$${price.toFixed(2)}</span>
          </div>
          <div class="purchase-actions">
            <button id="pmodal-back-btn" class="btn-secondary">Back</button>
            <button id="pmodal-pay-btn" class="btn-primary" style="background: #10b981;">Pay $${price.toFixed(2)}</button>
          </div>
        </div>`;
      container.querySelector('#pmodal-back-btn').onclick = () => renderStep(container, 1, data);
      container.querySelector('#pmodal-pay-btn').onclick = () => {
        if (balance >= price) {
          const success = window.os.deductBank(price, `Purchase: ${itemName}`);
          if (success) {
            data.stepData = { txId };
            renderStep(container, 3, { ...data, isSuccess: true });
          } else {
            renderStep(container, 3, { ...data, isSuccess: false, reason: 'Deduction failed' });
          }
        } else {
          renderStep(container, 3, { ...data, isSuccess: false, reason: 'Insufficient funds' });
        }
      };
    } else if (step === 3) {
      if (data.isSuccess) {
        container.innerHTML = `
          <div class="purchase-modal-card">
            <div class="purchase-step-indicator" style="color: #10b981;">Step 3 of 3 • Completed</div>
            <div class="purchase-item-icon" style="background: rgba(16,185,129,0.15); color: #10b981;">✓</div>
            <div class="purchase-title">Payment Successful!</div>
            <div class="purchase-item-name">${itemName}</div>
            <div class="purchase-receipt-box">
              <div class="receipt-row"><span>Amount Paid:</span><strong>$${price.toFixed(2)}</strong></div>
              <div class="receipt-row"><span>Reference:</span><code>${data.stepData.txId}</code></div>
              <div class="receipt-row"><span>Remaining Bal:</span><span>$${(window.os.state.bankBalance).toFixed(2)}</span></div>
            </div>
            <div class="purchase-actions">
              <button id="pmodal-done-btn" class="btn-primary" style="background: #10b981; width: 100%;">Done</button>
            </div>
          </div>`;
        container.querySelector('#pmodal-done-btn').onclick = () => {
          close();
          if (typeof onSuccess === 'function') onSuccess({ txId: data.stepData.txId, itemName, price });
        };
      } else {
        container.innerHTML = `
          <div class="purchase-modal-card">
            <div class="purchase-step-indicator" style="color: #ef4444;">Step 3 of 3 • Failed</div>
            <div class="purchase-item-icon" style="background: rgba(239,68,68,0.15); color: #ef4444;">✕</div>
            <div class="purchase-title">Payment Failed</div>
            <div class="purchase-notice" style="color: #ef4444; margin-top: 4px;">
              ${data.reason === 'Insufficient funds' ? `Insufficient funds ($${price.toFixed(2)} required, balance is $${balance.toFixed(2)}).` : data.reason}
            </div>
            <div class="purchase-actions">
              <button id="pmodal-retry-btn" class="btn-secondary">Cancel</button>
              <button id="pmodal-deposit-btn" class="btn-primary">Go to Bank</button>
            </div>
          </div>`;
        container.querySelector('#pmodal-retry-btn').onclick = () => close(onCancel);
        container.querySelector('#pmodal-deposit-btn').onclick = () => {
          close(onCancel);
          if (window.os) window.os.launchApp('browser');
        };
      }
    }
  }

  function close(cb) {
    if (modalEl) {
      modalEl.style.display = 'none';
      modalEl.innerHTML = '';
    }
    if (typeof cb === 'function') cb();
  }

  window.purchaseModal = {
    open(itemName, price, onSuccess, onCancel) {
      const container = createModalContainer();
      container.style.display = 'flex';
      renderStep(container, 1, { itemName, price: Number(price) || 0, onSuccess, onCancel, stepData: {} });
    },
    close
  };
})();
