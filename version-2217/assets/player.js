(function () {
  function attachPlayer(video, source) {
    if (!video || !source) {
      return;
    }

    if (video.dataset.ready === "true") {
      return;
    }

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = source;
      video.dataset.ready = "true";
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      var hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(source);
      hls.attachMedia(video);
      video.hlsInstance = hls;
      video.dataset.ready = "true";
      return;
    }

    video.src = source;
    video.dataset.ready = "true";
  }

  function playVideo(video, button, source) {
    attachPlayer(video, source);

    if (button) {
      button.classList.add("is-hidden");
    }

    var promise = video.play();
    if (promise && typeof promise.catch === "function") {
      promise.catch(function () {
        if (button) {
          button.classList.remove("is-hidden");
        }
      });
    }
  }

  window.initMoviePlayer = function (options) {
    var config = options || {};

    function setup() {
      var video = document.getElementById(config.videoId);
      var button = document.getElementById(config.buttonId);
      var source = config.source;

      if (!video) {
        return;
      }

      attachPlayer(video, source);

      if (button) {
        button.addEventListener("click", function () {
          playVideo(video, button, source);
        });
      }

      video.addEventListener("play", function () {
        if (button) {
          button.classList.add("is-hidden");
        }
      });

      video.addEventListener("pause", function () {
        if (button && video.currentTime === 0) {
          button.classList.remove("is-hidden");
        }
      });
    }

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", setup);
    } else {
      setup();
    }
  };
})();
