/* FILE: cameraapp.js — Camera viewfinder, photo capture, and gallery persistence */
(function() {
  let mediaStream = null;
  let lastCapturedDataUrl = null;

  window.cameraApp = {
    async mount(container) {
      lastCapturedDataUrl = null;
      container.innerHTML = `
        <div style="display: flex; flex-direction: column; height: 100%; gap: 14px; align-items: center;">
          <div class="camera-preview-box" id="camera-box">
            <video id="camera-video" autoplay playsinline muted style="width: 100%; height: 100%; object-fit: cover;"></video>
            <div id="camera-status" style="position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 14px; background: rgba(0,0,0,0.8);">Starting camera...</div>
          </div>
          <canvas id="camera-capture-canvas" style="display: none;"></canvas>

          <div style="display: flex; gap: 12px; width: 100%;">
            <button id="camera-snap-btn" class="btn-primary" style="flex: 1;">📸 Capture</button>
            <button id="camera-save-btn" class="btn-primary" style="flex: 1; background: #10b981; display: none;">💾 Save to Gallery</button>
          </div>

          <div id="camera-thumb-container" style="width: 100%; display: none; flex-direction: column; align-items: center; gap: 6px;">
            <span style="font-size: 12px; color: var(--text-muted);">Captured Preview</span>
            <img id="camera-thumb-img" style="width: 100px; height: 100px; object-fit: cover; border-radius: 10px; border: 2px solid var(--accent);">
          </div>
        </div>
      `;

      const video = container.querySelector('#camera-video');
      const statusEl = container.querySelector('#camera-status');
      const snapBtn = container.querySelector('#camera-snap-btn');
      const saveBtn = container.querySelector('#camera-save-btn');
      const thumbContainer = container.querySelector('#camera-thumb-container');
      const thumbImg = container.querySelector('#camera-thumb-img');
      const canvas = container.querySelector('#camera-capture-canvas');

      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error('MediaDevices not supported');
        }
        mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false });
        video.srcObject = mediaStream;
        statusEl.style.display = 'none';
      } catch {
        statusEl.textContent = 'No camera found or access denied';
        snapBtn.disabled = true;
        snapBtn.style.opacity = '0.5';
      }

      snapBtn.onclick = () => {
        if (!mediaStream) return;
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        lastCapturedDataUrl = canvas.toDataURL('image/jpeg', 0.85);

        thumbImg.src = lastCapturedDataUrl;
        thumbContainer.style.display = 'flex';
        saveBtn.style.display = 'inline-flex';
        window.animations.showToast('Photo captured!');
      };

      saveBtn.onclick = async () => {
        if (!lastCapturedDataUrl) return;
        const item = {
          id: 'photo_' + Date.now(),
          dataUrl: lastCapturedDataUrl,
          createdAt: Date.now()
        };
        await window.store.put(window.CONSTANTS.STORES.GALLERY, item);
        window.animations.showToast('Photo saved to Gallery!');
        saveBtn.style.display = 'none';
      };
    },

    unmount() {
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
        mediaStream = null;
      }
      lastCapturedDataUrl = null;
    }
  };
})();
