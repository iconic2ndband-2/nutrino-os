/* FILE: os.gpu.js — GPU hardware detection, 3D capability verification, and Crash screen */
(function() {
  function testCanvasContext(type) {
    try {
      const c = document.createElement('canvas');
      return Boolean(window.WebGLRenderingContext && (c.getContext(type) || c.getContext('experimental-' + type)));
    } catch (e) {
      return false;
    }
  }

  function testWebGL2() {
    try {
      const c = document.createElement('canvas');
      return Boolean(window.WebGL2RenderingContext && c.getContext('webgl2'));
    } catch (e) {
      return false;
    }
  }

  window.osGpu = {
    isWebGLSupported() {
      return testCanvasContext('webgl');
    },

    isWebGL2Supported() {
      return testWebGL2();
    },

    isWebGPUSupported() {
      return typeof navigator !== 'undefined' && Boolean(navigator.gpu);
    },

    getGPUInfo() {
      try {
        const c = document.createElement('canvas');
        const gl = c.getContext('webgl') || c.getContext('experimental-webgl');
        if (gl) {
          const dbg = gl.getExtension('WEBGL_debug_renderer_info');
          if (dbg) {
            const renderer = gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL);
            if (renderer) return renderer;
          }
        }
      } catch (e) {}
      const fallback = window.CONSTANTS?.DEVICE_SPECS?.gpu || '2T-PEX (4-core, 600MHz)';
      return fallback;
    },

    canRun3D() {
      // Returns true if WebGL 2.0 or WebGPU is supported, or WebGL fallback
      return this.isWebGL2Supported() || this.isWebGPUSupported() || this.isWebGLSupported();
    },

    showCrashScreen(container, appName, appVersion, onBack) {
      if (!container) return;
      const gpuName = this.getGPUInfo();
      const webglSupported = this.isWebGLSupported();
      const webgl2Supported = this.isWebGL2Supported();

      container.innerHTML = `
        <div class="os-crash-overlay">
          <div class="os-crash-box">
            <div class="os-crash-header">
              <span class="os-crash-icon">❌</span>
              <span class="os-crash-title">APP CRASHED</span>
            </div>
            
            <div class="os-crash-app-meta">
              <div class="os-crash-app-name">${appName || 'Unknown Application'}</div>
              <div class="os-crash-app-ver">v${appVersion || '1.0.0'}</div>
            </div>

            <div class="os-crash-reason">
              This app requires 3D graphics.<br>
              Your GPU does not support it.
            </div>

            <div class="os-crash-divider"></div>

            <div class="os-crash-specs">
              <div class="os-crash-row">
                <span class="os-crash-label">GPU:</span>
                <span class="os-crash-val">${gpuName || 'Unknown'}</span>
              </div>
              <div class="os-crash-row">
                <span class="os-crash-label">WebGL:</span>
                <span class="os-crash-val ${webglSupported ? 'status-ok' : 'status-err'}">
                  ${webglSupported ? 'Supported' : 'Not Supported'}
                </span>
              </div>
              <div class="os-crash-row">
                <span class="os-crash-label">WebGL 2.0:</span>
                <span class="os-crash-val ${webgl2Supported ? 'status-ok' : 'status-err'}">
                  ${webgl2Supported ? 'Supported' : 'Not Supported'}
                </span>
              </div>
            </div>

            <div class="os-crash-divider"></div>

            <button id="os-crash-close-btn" class="os-crash-btn">Close App</button>
          </div>
        </div>`;

      const btn = container.querySelector('#os-crash-close-btn');
      if (btn) {
        btn.onclick = () => {
          if (typeof onBack === 'function') onBack();
          else if (window.os?.goBack) window.os.goBack();
        };
      }
    }
  };
})();
