/* FILE: musicapp.js — Music player using Web Audio API and local audio loader */
(function() {
  let audioCtx = null;
  let audioBuffer = null;
  let sourceNode = null;
  let gainNode = null;
  let startTime = 0;
  let pauseOffset = 0;
  let isPlaying = false;
  let trackTitle = 'No track loaded';
  let progressInterval = null;

  function initAudioCtx() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContextClass();
      gainNode = audioCtx.createGain();
      gainNode.connect(audioCtx.destination);
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function play() {
    if (!audioBuffer) return;
    initAudioCtx();
    if (sourceNode) {
      try { sourceNode.stop(); } catch {}
    }
    sourceNode = audioCtx.createBufferSource();
    sourceNode.buffer = audioBuffer;
    sourceNode.connect(gainNode);
    startTime = audioCtx.currentTime - pauseOffset;
    sourceNode.start(0, pauseOffset % audioBuffer.duration);
    isPlaying = true;
    sourceNode.onended = () => {
      if (audioCtx.currentTime - startTime >= audioBuffer.duration) {
        pauseOffset = 0;
        isPlaying = false;
      }
    };
  }

  function pause() {
    if (!isPlaying || !sourceNode) return;
    pauseOffset = audioCtx.currentTime - startTime;
    try { sourceNode.stop(); } catch {}
    sourceNode = null;
    isPlaying = false;
  }

  window.musicApp = {
    mount(container) {
      container.innerHTML = `
        <div style="display: flex; flex-direction: column; height: 100%; gap: 16px; align-items: center; justify-content: center;">
          <div style="width: 130px; height: 130px; border-radius: 50%; background: linear-gradient(135deg, #ec4899, #8b5cf6); display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 25px rgba(236,72,153,0.3);">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
          </div>
          <div style="text-align: center; max-width: 90%;">
            <div id="music-filename" style="font-weight: 600; font-size: 16px; word-break: break-word;">${trackTitle}</div>
            <div style="font-size: 12px; color: var(--text-muted); margin-top: 4px;">Web Audio API Engine</div>
          </div>
          <input type="file" id="music-file-input" accept="audio/*" style="display: none;">
          <button id="music-load-btn" class="btn-primary" style="padding: 0 16px;">📂 Choose Audio File</button>
          
          <div style="width: 100%; max-width: 280px;">
            <input type="range" id="music-seek-bar" min="0" max="100" value="0" style="width: 100%; height: 24px; cursor: pointer;">
          </div>
          <div style="display: flex; gap: 16px; align-items: center;">
            <button id="music-play-btn" class="btn-primary" style="width: 56px; height: 56px; border-radius: 50%; font-size: 20px; padding: 0;">▶</button>
          </div>
          <div style="width: 100%; max-width: 200px; display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 12px; color: var(--text-muted);">Vol</span>
            <input type="range" id="music-vol-slider" min="0" max="100" value="80" style="flex: 1; height: 24px; cursor: pointer;">
          </div>
        </div>
      `;

      const fileInput = container.querySelector('#music-file-input');
      const loadBtn = container.querySelector('#music-load-btn');
      const playBtn = container.querySelector('#music-play-btn');
      const seekBar = container.querySelector('#music-seek-bar');
      const volSlider = container.querySelector('#music-vol-slider');
      const nameEl = container.querySelector('#music-filename');

      loadBtn.onclick = () => fileInput.click();

      fileInput.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        trackTitle = file.name;
        nameEl.textContent = trackTitle;
        initAudioCtx();
        const arrayBuf = await file.arrayBuffer();
        audioBuffer = await audioCtx.decodeAudioData(arrayBuf);
        pauseOffset = 0;
        play();
        playBtn.textContent = '⏸';
      };

      playBtn.onclick = () => {
        if (!audioBuffer) {
          window.animations.showToast('Please load an audio file first');
          return;
        }
        if (isPlaying) {
          pause();
          playBtn.textContent = '▶';
        } else {
          play();
          playBtn.textContent = '⏸';
        }
      };

      volSlider.oninput = (e) => {
        if (gainNode) gainNode.gain.value = Number(e.target.value) / 100;
      };

      progressInterval = setInterval(() => {
        if (isPlaying && audioBuffer && audioCtx) {
          const cur = (audioCtx.currentTime - startTime) % audioBuffer.duration;
          seekBar.value = (cur / audioBuffer.duration) * 100;
        }
      }, 250);
    },

    unmount() {
      if (progressInterval) clearInterval(progressInterval);
      pause();
    }
  };
})();
