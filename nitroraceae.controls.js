/* FILE: nitroraceae.controls.js — Keyboard and Virtual Touch Joystick controls */
(function() {
  window.nitroraceAeControls = {
    state: { forward: 0, steer: 0, brake: false, boost: false },
    activeKeys: {},
    boundKeydown: null,
    boundKeyup: null,
    touchContainer: null,

    init(container) {
      this.reset();
      this.boundKeydown = (e) => {
        this.activeKeys[e.code] = true;
        this.updateStateFromKeyboard();
      };
      this.boundKeyup = (e) => {
        this.activeKeys[e.code] = false;
        this.updateStateFromKeyboard();
      };
      window.addEventListener('keydown', this.boundKeydown);
      window.addEventListener('keyup', this.boundKeyup);
      if (container) this.mountTouchControls(container);
    },

    updateStateFromKeyboard() {
      const k = this.activeKeys;
      let f = 0, s = 0;
      if (k['KeyW'] || k['ArrowUp']) f += 1;
      if (k['KeyS'] || k['ArrowDown']) f -= 1;
      if (k['KeyA'] || k['ArrowLeft']) s += 1;
      if (k['KeyD'] || k['ArrowRight']) s -= 1;
      this.state.forward = f;
      this.state.steer = s;
      this.state.brake = Boolean(k['Space']);
      this.state.boost = Boolean(k['ShiftLeft'] || k['ShiftRight']);
    },

    mountTouchControls(container) {
      const el = document.createElement('div');
      el.className = 'nrae-touch-overlay';
      el.innerHTML = `
        <div class="nrae-touch-left" style="position:absolute;bottom:16px;left:16px;display:flex;gap:10px;z-index:20;">
          <button id="nrae-btn-left" class="nrae-ctrl-btn" style="width:50px;height:50px;border-radius:25px;background:rgba(255,255,255,0.2);border:1px solid rgba(255,255,255,0.4);color:#fff;font-size:18px;">◀</button>
          <button id="nrae-btn-right" class="nrae-ctrl-btn" style="width:50px;height:50px;border-radius:25px;background:rgba(255,255,255,0.2);border:1px solid rgba(255,255,255,0.4);color:#fff;font-size:18px;">▶</button>
        </div>
        <div class="nrae-touch-right" style="position:absolute;bottom:16px;right:16px;display:flex;gap:10px;z-index:20;">
          <button id="nrae-btn-gas" class="nrae-ctrl-btn" style="width:54px;height:54px;border-radius:27px;background:rgba(34,197,94,0.4);border:2px solid #22c55e;color:#fff;font-size:14px;font-weight:bold;">GAS</button>
          <button id="nrae-btn-brake" class="nrae-ctrl-btn" style="width:50px;height:50px;border-radius:25px;background:rgba(239,68,68,0.4);border:2px solid #ef4444;color:#fff;font-size:12px;font-weight:bold;">BRAKE</button>
        </div>`;
      container.appendChild(el);
      this.touchContainer = el;

      const bindTouch = (btnId, onDown, onUp) => {
        const btn = el.querySelector(btnId);
        if (!btn) return;
        btn.addEventListener('touchstart', (e) => { e.preventDefault(); onDown(); });
        btn.addEventListener('touchend', (e) => { e.preventDefault(); onUp(); });
        btn.addEventListener('mousedown', (e) => { e.preventDefault(); onDown(); });
        btn.addEventListener('mouseup', (e) => { e.preventDefault(); onUp(); });
        btn.addEventListener('mouseleave', (e) => { e.preventDefault(); onUp(); });
      };

      bindTouch('#nrae-btn-left', () => { this.state.steer = 1; }, () => { if (this.state.steer === 1) this.state.steer = 0; });
      bindTouch('#nrae-btn-right', () => { this.state.steer = -1; }, () => { if (this.state.steer === -1) this.state.steer = 0; });
      bindTouch('#nrae-btn-gas', () => { this.state.forward = 1; }, () => { if (this.state.forward === 1) this.state.forward = 0; });
      bindTouch('#nrae-btn-brake', () => { this.state.forward = -1; this.state.brake = true; }, () => { if (this.state.forward === -1) this.state.forward = 0; this.state.brake = false; });
    },

    reset() {
      this.state = { forward: 0, steer: 0, brake: false, boost: false };
      this.activeKeys = {};
    },

    destroy() {
      if (this.boundKeydown) window.removeEventListener('keydown', this.boundKeydown);
      if (this.boundKeyup) window.removeEventListener('keyup', this.boundKeyup);
      if (this.touchContainer && this.touchContainer.parentElement) {
        this.touchContainer.parentElement.removeChild(this.touchContainer);
      }
      this.reset();
    }
  };
})();
