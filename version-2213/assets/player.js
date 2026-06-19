
var Hls = window.Hls;

function setupPlayer(video) {
  const source = video.dataset.hlsSrc;
  const card = video.closest('.player-card');
  const status = card ? card.querySelector('[data-player-status]') : null;

  if (!source) {
    if (status) {
      status.textContent = '未找到播放源';
    }
    return;
  }

  function setStatus(text) {
    if (status) {
      status.textContent = text;
    }
  }

  if (Hls && Hls.isSupported()) {
    const hls = new Hls({
      enableWorker: true,
      lowLatencyMode: true,
      backBufferLength: 90
    });

    hls.loadSource(source);
    hls.attachMedia(video);
    hls.on(Hls.Events.MANIFEST_PARSED, function () {
      setStatus('播放源已就绪，点击播放');
    });
    hls.on(Hls.Events.ERROR, function (_, data) {
      if (!data || !data.fatal) {
        return;
      }
      if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
        setStatus('网络波动，正在重试播放源');
        hls.startLoad();
      } else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
        setStatus('媒体解析异常，正在恢复');
        hls.recoverMediaError();
      } else {
        setStatus('播放源暂时不可用');
        hls.destroy();
      }
    });
    window.addEventListener('beforeunload', function () {
      hls.destroy();
    }, { once: true });
  } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = source;
    setStatus('播放源已就绪，点击播放');
  } else {
    setStatus('当前浏览器不支持 HLS 播放');
  }
}

function setupPlayButtons() {
  document.querySelectorAll('[data-play-target]').forEach(function (button) {
    button.addEventListener('click', function () {
      const targetId = button.getAttribute('data-play-target');
      const video = document.getElementById(targetId);

      if (!video) {
        return;
      }

      video.play().catch(function () {
        const card = video.closest('.player-card');
        const status = card ? card.querySelector('[data-player-status]') : null;
        if (status) {
          status.textContent = '请在播放器控件中手动点击播放';
        }
      });
    });
  });
}

document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('video[data-hls-src]').forEach(setupPlayer);
  setupPlayButtons();
});
