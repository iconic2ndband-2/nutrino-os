/* FILE: confirmmodal.js — In-OS native custom confirmation dialog (iframe friendly, non-blocking) */
(function() {
  let modalEl = null;

  function ensureModalContainer() {
    if (modalEl && document.body.contains(modalEl)) return modalEl;
    modalEl = document.createElement('div');
    modalEl.id = 'os-confirm-modal';
    modalEl.className = 'confirm-modal-backdrop';
    modalEl.style.display = 'none';
    const root = document.getElementById('os-root') || document.body;
    root.appendChild(modalEl);
    return modalEl;
  }

  window.confirmModal = {
    show({ title = 'Uninstall App', message = 'Are you sure you want to delete this application and free up storage?', icon = '🗑️', confirmText = 'Uninstall', cancelText = 'Cancel', isDestructive = true, onConfirm = null, onCancel = null }) {
      const container = ensureModalContainer();

      container.innerHTML = `
        <div class="confirm-modal-card">
          <div class="confirm-modal-icon">${icon}</div>
          <div class="confirm-modal-title">${title}</div>
          <div class="confirm-modal-msg">${message}</div>
          <div class="confirm-modal-actions">
            <button id="cm-cancel-btn" class="btn-secondary" style="flex:1;">${cancelText}</button>
            <button id="cm-confirm-btn" class="btn-primary" style="flex:1; background:${isDestructive ? '#ef4444' : '#6366f1'};">${confirmText}</button>
          </div>
        </div>
      `;

      container.style.display = 'flex';

      const cancelBtn = container.querySelector('#cm-cancel-btn');
      const confirmBtn = container.querySelector('#cm-confirm-btn');

      const cleanup = () => {
        container.style.display = 'none';
        container.innerHTML = '';
      };

      if (cancelBtn) {
        cancelBtn.onclick = (e) => {
          e.stopPropagation();
          cleanup();
          if (typeof onCancel === 'function') onCancel();
        };
      }

      if (confirmBtn) {
        confirmBtn.onclick = (e) => {
          e.stopPropagation();
          cleanup();
          if (typeof onConfirm === 'function') onConfirm();
        };
      }
    }
  };
})();
