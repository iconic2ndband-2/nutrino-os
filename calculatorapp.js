/* FILE: calculatorapp.js — Calculator with expression evaluation and operator precedence */
(function() {
  let expr = '';
  let result = '0';

  function evaluateExpression(s) {
    if (!s) return '0';
    try {
      const sanitized = s.replace(/×/g, '*').replace(/÷/g, '/');
      if (!/^[\d+\-*/.() ]+$/.test(sanitized)) return 'Error';
      const fn = new Function(`return (${sanitized})`);
      const val = fn();
      if (!isFinite(val)) return 'Error';
      return String(Math.round(val * 100000000) / 100000000);
    } catch {
      return 'Error';
    }
  }

  function renderCalc(container) {
    const exprEl = container.querySelector('#calc-expr');
    const resEl = container.querySelector('#calc-result');
    if (exprEl) exprEl.textContent = expr || ' ';
    if (resEl) resEl.textContent = result || '0';
  }

  window.calculatorApp = {
    mount(container) {
      expr = '';
      result = '0';

      container.innerHTML = `
        <div style="display: flex; flex-direction: column; height: 100%; justify-content: space-between;">
          <div class="calc-display">
            <div id="calc-expr" style="font-size: 14px; color: var(--text-muted); min-height: 20px; word-break: break-all;"></div>
            <div id="calc-result" style="font-size: 36px; font-weight: 600; color: var(--text-main); word-break: break-all;">0</div>
          </div>
          <div class="calc-grid">
            <button class="calc-btn action" data-key="C">C</button>
            <button class="calc-btn action" data-key="DEL">⌫</button>
            <button class="calc-btn op" data-key="÷">÷</button>
            <button class="calc-btn op" data-key="×">×</button>

            <button class="calc-btn" data-key="7">7</button>
            <button class="calc-btn" data-key="8">8</button>
            <button class="calc-btn" data-key="9">9</button>
            <button class="calc-btn op" data-key="-">-</button>

            <button class="calc-btn" data-key="4">4</button>
            <button class="calc-btn" data-key="5">5</button>
            <button class="calc-btn" data-key="6">6</button>
            <button class="calc-btn op" data-key="+">+</button>

            <button class="calc-btn" data-key="1">1</button>
            <button class="calc-btn" data-key="2">2</button>
            <button class="calc-btn" data-key="3">3</button>
            <button class="calc-btn" data-key=".">.</button>

            <button class="calc-btn" data-key="0" style="grid-column: span 2;">0</button>
            <button class="calc-btn equal" data-key="=">=</button>
          </div>
        </div>
      `;

      container.addEventListener('click', (e) => {
        const btn = e.target.closest('button[data-key]');
        if (!btn) return;
        const key = btn.dataset.key;

        if (key === 'C') {
          expr = '';
          result = '0';
        } else if (key === 'DEL') {
          expr = expr.slice(0, -1);
          result = expr ? evaluateExpression(expr) : '0';
        } else if (key === '=') {
          if (expr) {
            result = evaluateExpression(expr);
            expr = result !== 'Error' ? result : '';
          }
        } else if (['+', '-', '×', '÷'].includes(key)) {
          const lastChar = expr.slice(-1);
          if (['+', '-', '×', '÷'].includes(lastChar)) {
            expr = expr.slice(0, -1) + key;
          } else if (expr || result !== '0') {
            expr = (expr || result) + key;
          }
        } else if (key === '.') {
          const tokens = expr.split(/[+\-×÷]/);
          const currentToken = tokens[tokens.length - 1];
          if (!currentToken.includes('.')) {
            expr += currentToken === '' ? '0.' : '.';
          }
        } else {
          expr += key;
          const liveRes = evaluateExpression(expr);
          if (liveRes !== 'Error') result = liveRes;
        }

        renderCalc(container);
      });

      renderCalc(container);
    },

    unmount() {}
  };
})();
