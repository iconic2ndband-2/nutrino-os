/* FILE: 3dpapers.pay.js — 5-step payment flow with silent SuperBank billing */
(function() {
  let modalContainer = null, onPaymentComplete = null;

  function renderModal(wallpaper, currentAccount, step = 1, state = {}) {
    const dur = state.duration || wallpaper.duration;
    const cost = Math.round(((dur / wallpaper.duration) * wallpaper.price) * 100) / 100;
    const bankBal = window.os?.state?.bankBalance || 100;
    const remainingBal = Math.max(0, Math.round((bankBal - cost) * 100) / 100);

    const stepPips = [1, 2, 3, 4, 5].map(i => `<div class="p3d-step-pip ${i === step ? 'active' : (i < step ? 'done' : '')}">${i < step ? '✓' : i}</div>`).join('');

    let bodyHtml = '';
    if (step === 1) {
      bodyHtml = `
        <div style="text-align:center;">
          <div style="font-size:36px;margin-bottom:4px;">${wallpaper.icon || '🌌'}</div>
          <div style="font-weight:800;font-size:16px;color:#fff;">${wallpaper.name}</div>
          <div style="font-size:11px;color:#94a3b8;margin-top:4px;">${wallpaper.desc}</div>
        </div>
        <button id="p3d-next-1" class="btn-primary" style="background:#8b5cf6;width:100%;margin-top:8px;">Step 2: Choose Duration →</button>`;
    } else if (step === 2) {
      bodyHtml = `
        <div style="font-size:13px;font-weight:700;color:#fff;">⏱️ Select Live Duration:</div>
        <div style="display:flex;gap:6px;margin:8px 0;">
          <button class="btn-secondary p3d-dur-btn ${dur === wallpaper.duration ? 'btn-primary' : ''}" data-d="${wallpaper.duration}" style="flex:1;font-size:11px;">${wallpaper.duration}s (1x)</button>
          <button class="btn-secondary p3d-dur-btn ${dur === wallpaper.duration * 2 ? 'btn-primary' : ''}" data-d="${wallpaper.duration * 2}" style="flex:1;font-size:11px;">${wallpaper.duration * 2}s (2x)</button>
          <button class="btn-secondary p3d-dur-btn ${dur === wallpaper.duration * 5 ? 'btn-primary' : ''}" data-d="${wallpaper.duration * 5}" style="flex:1;font-size:11px;">${wallpaper.duration * 5}s (5x)</button>
        </div>
        <div style="font-size:12px;color:#38bdf8;font-weight:700;text-align:center;">Calculated Cost: $${cost.toFixed(2)}</div>
        <div style="display:flex;gap:8px;margin-top:8px;"><button id="p3d-prev-2" class="btn-secondary" style="flex:1;">Back</button><button id="p3d-next-2" class="btn-primary" style="flex:2;background:#8b5cf6;">Step 3: Payment Method →</button></div>`;
    } else if (step === 3) {
      bodyHtml = `
        <div style="font-size:13px;font-weight:700;color:#fff;">💳 Payment Method:</div>
        <div style="background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);padding:10px;border-radius:10px;margin:8px 0;">
          <div style="font-size:12px;font-weight:700;color:#38bdf8;">🏦 SuperBank Account</div>
          <div style="font-size:11px;color:#94a3b8;">Available Balance: <strong style="color:#34d399;">$${bankBal.toFixed(2)}</strong></div>
          <div style="font-size:10px;color:#cbd5e1;margin-top:4px;">Silent automated billing active</div>
        </div>
        <div style="display:flex;gap:8px;"><button id="p3d-prev-3" class="btn-secondary" style="flex:1;">Back</button><button id="p3d-next-3" class="btn-primary" style="flex:2;background:#8b5cf6;">Step 4: Cost Breakdown →</button></div>`;
    } else if (step === 4) {
      bodyHtml = `
        <div style="font-size:13px;font-weight:700;color:#fff;">🧾 Order Summary:</div>
        <div style="display:flex;flex-direction:column;gap:6px;font-size:11px;background:rgba(255,255,255,0.04);padding:10px;border-radius:10px;margin:6px 0;">
          <div style="display:flex;justify-content:space-between;"><span style="color:#94a3b8;">Item:</span><span style="font-weight:700;color:#fff;">${wallpaper.name}</span></div>
          <div style="display:flex;justify-content:space-between;"><span style="color:#94a3b8;">Duration:</span><span style="font-weight:700;color:#fff;">${dur} seconds</span></div>
          <div style="display:flex;justify-content:space-between;"><span style="color:#94a3b8;">Rate:</span><span>$${wallpaper.costPerSec.toFixed(3)}/sec</span></div>
          <div style="border-top:1px solid rgba(255,255,255,0.08);padding-top:4px;display:flex;justify-content:space-between;font-size:12px;font-weight:800;color:#38bdf8;"><span>Total:</span><span>$${cost.toFixed(2)}</span></div>
          <div style="display:flex;justify-content:space-between;color:#94a3b8;font-size:10px;"><span>Post-Payment Balance:</span><span>$${remainingBal.toFixed(2)}</span></div>
        </div>
        <div style="display:flex;gap:8px;"><button id="p3d-prev-4" class="btn-secondary" style="flex:1;">Back</button><button id="p3d-next-4" class="btn-primary" style="flex:2;background:#8b5cf6;">Step 5: Confirm & Apply →</button></div>`;
    } else if (step === 5) {
      bodyHtml = `
        <div style="text-align:center;">
          <div style="font-size:32px;">⚡</div>
          <div style="font-weight:800;font-size:15px;color:#fff;margin:4px 0;">Final Confirmation</div>
          <div style="font-size:11px;color:#94a3b8;margin-bottom:8px;">Ready to deduct <strong style="color:#38bdf8;">$${cost.toFixed(2)}</strong> from SuperBank and activate 3D wallpaper.</div>
        </div>
        <div style="display:flex;gap:8px;"><button id="p3d-cancel-pay" class="btn-secondary" style="flex:1;">Cancel</button><button id="p3d-final-pay" class="btn-primary" style="flex:2;background:#10b981;">Confirm & Apply ($${cost.toFixed(2)})</button></div>`;
    }

    modalContainer.innerHTML = `
      <div class="p3d-modal-backdrop">
        <div class="p3d-modal-card">
          <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid rgba(255,255,255,0.08);padding-bottom:8px;">
            <span style="font-size:12px;font-weight:700;color:#c4b5fd;">Step ${step} of 5</span>
            <button id="p3d-close-pay" style="background:none;border:none;color:#94a3b8;cursor:pointer;font-size:16px;">✕</button>
          </div>
          <div class="p3d-step-pip-row">${stepPips}</div>
          ${bodyHtml}
        </div>
      </div>`;

    modalContainer.querySelector('#p3d-close-pay').onclick = () => { modalContainer.innerHTML = ''; };
    if (step === 1) modalContainer.querySelector('#p3d-next-1').onclick = () => renderModal(wallpaper, currentAccount, 2, { duration: dur });
    else if (step === 2) {
      modalContainer.querySelectorAll('.p3d-dur-btn').forEach(btn => {
        btn.onclick = () => renderModal(wallpaper, currentAccount, 2, { duration: parseInt(btn.dataset.d, 10) });
      });
      modalContainer.querySelector('#p3d-prev-2').onclick = () => renderModal(wallpaper, currentAccount, 1, state);
      modalContainer.querySelector('#p3d-next-2').onclick = () => renderModal(wallpaper, currentAccount, 3, { duration: dur });
    } else if (step === 3) {
      modalContainer.querySelector('#p3d-prev-3').onclick = () => renderModal(wallpaper, currentAccount, 2, state);
      modalContainer.querySelector('#p3d-next-3').onclick = () => renderModal(wallpaper, currentAccount, 4, state);
    } else if (step === 4) {
      modalContainer.querySelector('#p3d-prev-4').onclick = () => renderModal(wallpaper, currentAccount, 3, state);
      modalContainer.querySelector('#p3d-next-4').onclick = () => renderModal(wallpaper, currentAccount, 5, state);
    } else if (step === 5) {
      modalContainer.querySelector('#p3d-cancel-pay').onclick = () => { modalContainer.innerHTML = ''; };
      modalContainer.querySelector('#p3d-final-pay').onclick = () => {
        if (bankBal < cost) {
          window.animations?.showToast?.('Insufficient SuperBank funds');
          return;
        }
        // SILENT PAY: Deduct silently from SuperBank without toast
        window.os?.deductBank?.(cost, `3DPapers: ${wallpaper.name} (${dur}s)`);
        modalContainer.innerHTML = '';
        if (onPaymentComplete) onPaymentComplete({ wallpaper, duration: dur, cost });
      };
    }
  }

  window.threeDPapersPay = {
    open(container, wallpaper, currentAccount, onComplete) {
      modalContainer = container;
      onPaymentComplete = onComplete;
      renderModal(wallpaper, currentAccount, 1, { duration: wallpaper.duration });
    }
  };
})();
