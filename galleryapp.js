/* FILE: galleryapp.js — Photo gallery with full-screen viewer and photo deletion */
(function() {
  let photos = [];

  async function loadPhotos() {
    try {
      photos = await window.store.getAll(window.CONSTANTS.STORES.GALLERY);
      photos.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    } catch {
      photos = [];
    }
  }

  function renderGallery(container) {
    if (photos.length === 0) {
      container.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: var(--text-muted); gap: 10px;">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
          <p>No photos yet</p>
          <span style="font-size: 12px;">Take a photo using the Camera app!</span>
        </div>
      `;
      return;
    }

    const gridHtml = photos.map(p => `
      <img src="${p.dataUrl}" class="gallery-thumb" data-id="${p.id}" alt="Photo">
    `).join('');

    container.innerHTML = `
      <div class="gallery-grid">${gridHtml}</div>
      <div id="gallery-modal" style="display: none; position: absolute; inset: 0; background: rgba(0,0,0,0.92); z-index: 200; flex-direction: column; align-items: center; justify-content: space-between; padding: 20px;">
        <div style="width: 100%; display: flex; justify-content: flex-end;">
          <button id="gallery-close-modal" style="background: none; border: none; color: #fff; font-size: 24px; cursor: pointer; min-width: 44px; min-height: 44px;">✕</button>
        </div>
        <img id="gallery-modal-img" style="max-width: 100%; max-height: 70%; object-fit: contain; border-radius: 8px;">
        <button id="gallery-delete-btn" style="min-height: 44px; padding: 0 20px; border-radius: var(--btn-radius); background: #ef4444; color: #fff; font-weight: 600; border: none; cursor: pointer;">Delete Photo</button>
      </div>
    `;

    const modal = container.querySelector('#gallery-modal');
    const modalImg = container.querySelector('#gallery-modal-img');
    const closeBtn = container.querySelector('#gallery-close-modal');
    const delBtn = container.querySelector('#gallery-delete-btn');
    let currentPhotoId = null;

    container.querySelectorAll('.gallery-thumb').forEach(thumb => {
      thumb.onclick = () => {
        currentPhotoId = thumb.dataset.id;
        const photo = photos.find(p => p.id === currentPhotoId);
        if (photo) {
          modalImg.src = photo.dataUrl;
          modal.style.display = 'flex';
        }
      };
    });

    closeBtn.onclick = () => {
      modal.style.display = 'none';
      currentPhotoId = null;
    };

    delBtn.onclick = async () => {
      if (!currentPhotoId) return;
      await window.store.delete(window.CONSTANTS.STORES.GALLERY, currentPhotoId);
      modal.style.display = 'none';
      window.animations.showToast('Photo deleted');
      await loadPhotos();
      renderGallery(container);
    };
  }

  window.galleryApp = {
    async mount(container) {
      await loadPhotos();
      renderGallery(container);
    },

    unmount() {
      photos = [];
    }
  };
})();
