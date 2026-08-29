/* FILE: 3dpapers.js — 3DPapers active version loader & lifecycle dispatcher */
(function() {
  window.threeDPapersApp = {
    mount(container) {
      const activeVer = window.os?.getActiveVersion ? window.os.getActiveVersion('3dpapers') : (window.os?.getInstalledVersion ? window.os.getInstalledVersion('3dpapers') : '1.0.0');
      
      if (activeVer.startsWith('2') && window.threeDPapersV2?.mount) {
        window.threeDPapersV2.mount(container);
      } else if (window.threeDPapersV1?.mount) {
        window.threeDPapersV1.mount(container);
      } else if (window.threeDPapersV2?.mount) {
        window.threeDPapersV2.mount(container);
      }
    },

    unmount() {
      if (window.threeDPapersV1?.unmount) window.threeDPapersV1.unmount();
      if (window.threeDPapersV2?.unmount) window.threeDPapersV2.unmount();
    }
  };
})();
