/* FILE: lockscreen.js — Lock screen interface with interactive swipe-to-unlock */
(function() {
  let timerId = null;
  let removeTouchListeners = null;

  function updateClock(container) {
    const timeEl = container.querySelector('#lock-time-text');
    const dateEl = container.querySelector('#lock-date-text');
    const now = new Date();

    if (timeEl) {
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      timeEl.textContent = `${h}:${m}`;
    }

    if (dateEl) {
      dateEl.textContent = now.toLocaleDateString(undefined, {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });
    }
  }

  window.lockscreen = {
    mount(container) {
      container.innerHTML = `
        <div id="lockscreen-root" class="screen-view lockscreen-root" style="transition: transform 0.1s ease-out;">
          <div style="text-align: center; margin-top: 40px;">
            <div id="lock-time-text" class="lock-time">00:00</div>
            <div id="lock-date-text" class="lock-date">Loading...</div>
          </div>
          
          <div id="lock-swipe-area" class="lock-swipe-area">
            <div style="font-size: 13px; font-weight: 500; opacity: 0.9; letter-spacing: 0.5px;">Swipe up to unlock</div>
            <div class="lock-handle"></div>
          </div>
        </div>
      `;

      updateClock(container);
      timerId = setInterval(() => updateClock(container), 1000);

      const rootEl = container.querySelector('#lockscreen-root');
      const swipeArea = container.querySelector('#lock-swipe-area');

      removeTouchListeners = window.touch.enableSwipeUp(
        swipeArea,
        (deltaY) => {
          if (rootEl) {
            rootEl.style.transform = `translateY(${deltaY}px)`;
          }
        },
        () => {
          if (rootEl) {
            rootEl.style.transition = 'transform 0.25s ease-in, opacity 0.25s ease-in';
            rootEl.style.transform = 'translateY(-100%)';
            rootEl.style.opacity = '0';
          }
          setTimeout(() => {
            window.router.navigate('homescreen');
          }, 200);
        }
      );
    },

    unmount() {
      if (timerId) {
        clearInterval(timerId);
        timerId = null;
      }
      if (removeTouchListeners) {
        removeTouchListeners();
        removeTouchListeners = null;
      }
    }
  };
})();
