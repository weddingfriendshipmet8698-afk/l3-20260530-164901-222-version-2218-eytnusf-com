
(function () {
  var shells = Array.prototype.slice.call(document.querySelectorAll('[data-player]'));

  shells.forEach(function (shell) {
    var video = shell.querySelector('video');
    var button = shell.querySelector('[data-play-button]');
    var stream = video ? video.getAttribute('data-stream') : '';
    var started = false;
    var hlsInstance = null;

    function begin() {
      if (!video || !stream) {
        return;
      }

      shell.classList.add('is-playing');

      if (!started) {
        started = true;
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = stream;
          video.play();
          return;
        }

        if (window.Hls && window.Hls.isSupported()) {
          hlsInstance = new window.Hls({ enableWorker: true });
          hlsInstance.loadSource(stream);
          hlsInstance.attachMedia(video);
          hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, function () {
            video.play();
          });
          return;
        }

        video.src = stream;
      }

      video.play();
    }

    if (button) {
      button.addEventListener('click', function (event) {
        event.preventDefault();
        begin();
      });
    }

    shell.addEventListener('click', function (event) {
      if (event.target === video) {
        begin();
      }
    });

    window.addEventListener('beforeunload', function () {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    });
  });
})();
