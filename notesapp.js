/* FILE: notesapp.js — Notes management app with IndexedDB persistent storage */
(function() {
  let notesList = [];
  let currentEditingNote = null;

  async function loadNotes() {
    try {
      notesList = await window.store.getAll(window.CONSTANTS.STORES.NOTES);
      notesList.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
    } catch {
      notesList = [];
    }
  }

  function renderListView(container) {
    const listHtml = notesList.length === 0
      ? `<div style="text-align: center; color: var(--text-muted); padding: 40px 0;">No notes yet. Tap "+" to create one!</div>`
      : notesList.map(n => `
          <div class="notes-item" data-id="${n.id}">
            <div style="font-weight: 600; font-size: 15px; margin-bottom: 4px;">${n.title || 'Untitled Note'}</div>
            <div style="font-size: 13px; color: var(--text-muted);">${(n.content || '').slice(0, 20) || 'Empty note'}...</div>
          </div>
        `).join('');

    container.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
        <span style="font-size: 14px; color: var(--text-muted);">${notesList.length} Notes</span>
        <button id="notes-add-btn" class="btn-primary" style="padding: 0 14px; font-size: 14px;">+ New Note</button>
      </div>
      <div id="notes-items-container">${listHtml}</div>
    `;

    container.querySelector('#notes-add-btn').onclick = () => {
      openEditor(container, { id: 'note_' + Date.now(), title: '', content: '' });
    };

    container.querySelectorAll('.notes-item').forEach(item => {
      item.onclick = () => {
        const id = item.dataset.id;
        const note = notesList.find(n => n.id === id);
        if (note) openEditor(container, note);
      };
    });
  }

  function openEditor(container, note) {
    currentEditingNote = note;
    container.innerHTML = `
      <div style="display: flex; flex-direction: column; height: 100%; gap: 10px;">
        <input id="note-title-input" type="text" placeholder="Title" value="${note.title || ''}" 
               style="background: var(--card-bg); color: var(--text-main); border: 1px solid var(--border-color); border-radius: 8px; padding: 10px; font-size: 16px; font-weight: 600; outline: none;">
        <textarea id="note-content-input" placeholder="Write your note here..." 
                  style="flex: 1; background: var(--card-bg); color: var(--text-main); border: 1px solid var(--border-color); border-radius: 8px; padding: 12px; font-size: 14px; line-height: 1.5; resize: none; outline: none;">${note.content || ''}</textarea>
        <div style="display: flex; gap: 10px;">
          <button id="note-save-btn" class="btn-primary" style="flex: 1;">Save Note</button>
          <button id="note-delete-btn" style="min-height: 44px; padding: 0 16px; border-radius: var(--btn-radius); background: #ef4444; color: #fff; border: none; font-weight: 600; cursor: pointer;">Delete</button>
        </div>
      </div>
    `;

    container.querySelector('#note-save-btn').onclick = async () => {
      const title = container.querySelector('#note-title-input').value.trim();
      const content = container.querySelector('#note-content-input').value.trim();
      currentEditingNote.title = title || 'Untitled Note';
      currentEditingNote.content = content;
      currentEditingNote.updatedAt = Date.now();
      await window.store.put(window.CONSTANTS.STORES.NOTES, currentEditingNote);
      window.animations.showToast('Note saved to IndexedDB');
      await loadNotes();
      renderListView(container);
    };

    container.querySelector('#note-delete-btn').onclick = async () => {
      await window.store.delete(window.CONSTANTS.STORES.NOTES, currentEditingNote.id);
      window.animations.showToast('Note deleted');
      await loadNotes();
      renderListView(container);
    };
  }

  window.notesApp = {
    async mount(container) {
      await loadNotes();
      renderListView(container);
    },

    unmount() {
      notesList = [];
      currentEditingNote = null;
    }
  };
})();
