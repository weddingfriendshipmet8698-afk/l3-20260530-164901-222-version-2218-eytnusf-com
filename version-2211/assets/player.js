(function () {
  var hlsPromise = null;

  function loadHls() {
    if (window.Hls) {
      return Promise.resolve(window.Hls);
    }
    if (hlsPromise) {
      return hlsPromise;
    }
    hlsPromise = new Promise(function (resolve, reject) {
      var script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/hls.js@1.5.17/dist/hls.min.js';
      script.async = true;
      script.onload = function () {
        resolve(window.Hls);
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });
    return hlsPromise;
  }

  function attachSource(video, source) {
    if (video.dataset.bound === '1') {
      return Promise.resolve();
    }
    video.dataset.bound = '1';
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
      return Promise.resolve();
    }
    return loadHls().then(function (Hls) {
      if (Hls && Hls.isSupported()) {
        var hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90
        });
        hls.loadSource(source);
        hls.attachMedia(video);
        video._hlsInstance = hls;
      } else {
        video.src = source;
      }
    }).catch(function () {
      video.src = source;
    });
  }

  function initPlayer(shell) {
    var video = shell.querySelector('video');
    var button = shell.querySelector('[data-play-button]');
    var source = shell.getAttribute('data-source');
    if (!video || !source) {
      return;
    }

    function play() {
      attachSource(video, source).then(function () {
        var promise = video.play();
        if (promise && promise.catch) {
          promise.catch(function () {
            shell.classList.remove('is-playing');
          });
        }
        shell.classList.add('is-playing');
      });
    }

    if (button) {
      button.addEventListener('click', play);
    }
    video.addEventListener('play', function () {
      shell.classList.add('is-playing');
    });
    video.addEventListener('pause', function () {
      if (!video.ended) {
        shell.classList.remove('is-playing');
      }
    });
    video.addEventListener('ended', function () {
      shell.classList.remove('is-playing');
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    Array.prototype.slice.call(document.querySelectorAll('[data-player]')).forEach(initPlayer);
  });
})();
