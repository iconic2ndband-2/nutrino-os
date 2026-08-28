/* FILE: nitroracese.pay.js — Silent Pay System ($2.99/s) runtime billing & crash handler */
(function() {
  let payInterval = null, isHalted = false;

  function showCrashPopup(onCrashDone) {
    const root = document.getElementById('os-viewport') || document.body;
    const crashEl = document.createElement('div');
    crashEl.className = 'nr-overlay';
    crashEl.id = 'nr-se-crash-dialog';
    crashEl.innerHTML = `
      <div class="nr-modal" style="border:2px solid #ef4444;">
        <div style="font-size:36px;margin-bottom:8px;">⚠️</div>
        <h3 style="font-size:18px;font-weight:900;color:#ef4444;margin-bottom:6px;">Nitro Race SE has stopped.</h3>
        <p style="font-size:12px;color:var(--text-muted);margin-bottom:16px;">Runtime billing failed due to insufficient funds ($2.99/s required).</p>
        <button id="nr-crash-close-btn" class="btn-primary" style="background:#ef4444;width:100%;">Return to Home Screen</button>
      </div>`;
    root.appendChild(crashEl);

    crashEl.querySelector('#nr-crash-close-btn').onclick = () => {
      crashEl.remove();
      if (typeof onCrashDone === 'function') onCrashDone();
      window.os?.launchApp('homescreen');
    };
  }

  function showWarningDialog(onProceedToCrash) {
    const root = document.getElementById('os-viewport') || document.body;
    const warnEl = document.createElement('div');
    warnEl.className = 'nr-overlay';
    warnEl.id = 'nr-se-warn-dialog';
    warnEl.innerHTML = `
      <div class="nr-modal" style="border:2px solid #f59e0b;">
        <div style="font-size:36px;margin-bottom:8px;">⚠️</div>
        <h3 style="font-size:17px;font-weight:800;color:#f59e0b;margin-bottom:6px;">Insufficient Funds</h3>
        <p style="font-size:12px;color:var(--text-muted);margin-bottom:16px;">Please add money to continue playing.</p>
        <button id="nr-warn-ok-btn" class="btn-primary" style="background:#f59e0b;width:100%;">OK</button>
      </div>`;
    root.appendChild(warnEl);

    warnEl.querySelector('#nr-warn-ok-btn').onclick = () => {
      warnEl.remove();
      if (typeof onProceedToCrash === 'function') onProceedToCrash();
    };
  }

  window.nrSePay = {
    start(onHalt) {
      this.stop();
      isHalted = false;
      payInterval = setInterval(() => {
        if (isHalted) return;
        const currentBal = window.os?.state?.bankBalance ?? 100;
        if (currentBal < 2.99) {
          this.triggerHalt(onHalt);
          return;
        }

        const success = window.os?.deductBank(2.99, 'Nitro Race SE: Runtime Billing ($2.99/s)');
        if (!success) {
          this.triggerHalt(onHalt);
        }
      }, 1000);
    },

    triggerHalt(onHalt) {
      if (isHalted) return;
      isHalted = true;
      this.stop();
      if (typeof onHalt === 'function') onHalt();

      showWarningDialog(() => {
        showCrashPopup(() => {
          if (typeof onHalt === 'function') onHalt();
        });
      });
    },

    stop() {
      if (payInterval) {
        clearInterval(payInterval);
        payInterval = null;
      }
    }
  };
})();
