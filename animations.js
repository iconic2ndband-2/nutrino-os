/* FILE: animations.js — Animation helpers and view transition utilities */
(function() {
  window.animations = {
    fadeIn(elem, duration = 200) {
      if (!elem) return Promise.resolve();
      return new Promise(resolve => {
        elem.style.opacity = '0';
        elem.style.transition = `opacity ${duration}ms ease-out`;
        requestAnimationFrame(() => {
          elem.style.opacity = '1';
          setTimeout(resolve, duration);
        });
      });
    },

    fadeOut(elem, duration = 150) {
      if (!elem) return Promise.resolve();
      return new Promise(resolve => {
        elem.style.opacity = '1';
        elem.style.transition = `opacity ${duration}ms ease-in`;
        requestAnimationFrame(() => {
          elem.style.opacity = '0';
          setTimeout(resolve, duration);
        });
      });
    },

    slideUp(elem, distance = 40, duration = 220) {
      if (!elem) return Promise.resolve();
      return new Promise(resolve => {
        elem.style.transform = `translateY(${distance}px)`;
        elem.style.opacity = '0';
        elem.style.transition = `transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1), opacity ${duration}ms ease-out`;
        requestAnimationFrame(() => {
          elem.style.transform = 'translateY(0)';
          elem.style.opacity = '1';
          setTimeout(resolve, duration);
        });
      });
    },

    showToast(message, duration = 2000) {
      const toast = document.getElementById('os-toast');
      if (!toast) return;
      toast.textContent = message;
      toast.classList.add('show');
      if (toast._timer) clearTimeout(toast._timer);
      toast._timer = setTimeout(() => {
        toast.classList.remove('show');
      }, duration);
    }
  };
})();
