/* FILE: touch.js — Gesture interactions and touch drag tracker */
(function() {
  window.touch = {
    enableSwipeUp(container, onDrag, onUnlock) {
      let startY = 0;
      let currentY = 0;
      let isDragging = false;
      const threshold = 90;

      function handleStart(e) {
        isDragging = true;
        startY = e.touches ? e.touches[0].clientY : e.clientY;
        currentY = startY;
      }

      function handleMove(e) {
        if (!isDragging) return;
        currentY = e.touches ? e.touches[0].clientY : e.clientY;
        const deltaY = Math.min(0, currentY - startY);
        if (typeof onDrag === 'function') {
          onDrag(deltaY);
        }
      }

      function handleEnd() {
        if (!isDragging) return;
        isDragging = false;
        const deltaY = startY - currentY;
        if (deltaY > threshold) {
          if (typeof onUnlock === 'function') {
            onUnlock();
          }
        } else {
          if (typeof onDrag === 'function') {
            onDrag(0);
          }
        }
      }

      container.addEventListener('touchstart', handleStart, { passive: true });
      container.addEventListener('touchmove', handleMove, { passive: true });
      container.addEventListener('touchend', handleEnd);

      container.addEventListener('mousedown', handleStart);
      window.addEventListener('mousemove', handleMove);
      window.addEventListener('mouseup', handleEnd);

      return function cleanup() {
        container.removeEventListener('touchstart', handleStart);
        container.removeEventListener('touchmove', handleMove);
        container.removeEventListener('touchend', handleEnd);

        container.removeEventListener('mousedown', handleStart);
        window.removeEventListener('mousemove', handleMove);
        window.removeEventListener('mouseup', handleEnd);
      };
    }
  };
})();
