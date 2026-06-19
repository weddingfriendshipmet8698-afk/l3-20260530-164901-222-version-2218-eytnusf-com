(function () {
    function ready(callback) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', callback);
        } else {
            callback();
        }
    }

    ready(function () {
        var players = Array.prototype.slice.call(document.querySelectorAll('[data-player]'));
        players.forEach(function (shell) {
            var video = shell.querySelector('video');
            var button = shell.querySelector('[data-play-button]');
            var status = shell.querySelector('[data-player-status]');
            var source = shell.dataset.source;
            var hlsInstance = null;

            function setStatus(message) {
                if (status) {
                    status.textContent = message;
                }
            }

            function startPlayback() {
                if (!video || !source) {
                    setStatus('没有可用播放源。');
                    return;
                }

                if (window.Hls && window.Hls.isSupported()) {
                    if (!hlsInstance) {
                        hlsInstance = new window.Hls({ enableWorker: true });
                        hlsInstance.loadSource(source);
                        hlsInstance.attachMedia(video);
                        hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, function () {
                            video.play().then(function () {
                                shell.classList.add('is-playing');
                                setStatus('正在播放：' + (shell.dataset.title || '影片'));
                            }).catch(function () {
                                setStatus('浏览器阻止了自动播放，请再次点击播放按钮。');
                            });
                        });
                        hlsInstance.on(window.Hls.Events.ERROR, function (event, data) {
                            if (data && data.fatal) {
                                setStatus('播放源加载失败，请稍后重试。');
                            }
                        });
                    } else {
                        video.play();
                        shell.classList.add('is-playing');
                    }
                } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                    video.src = source;
                    video.play().then(function () {
                        shell.classList.add('is-playing');
                        setStatus('正在播放：' + (shell.dataset.title || '影片'));
                    }).catch(function () {
                        setStatus('浏览器阻止了自动播放，请再次点击播放按钮。');
                    });
                } else {
                    setStatus('当前浏览器不支持 HLS 播放。');
                }
            }

            if (button) {
                button.addEventListener('click', startPlayback);
            }

            if (video) {
                video.addEventListener('play', function () {
                    shell.classList.add('is-playing');
                });
                video.addEventListener('pause', function () {
                    shell.classList.remove('is-playing');
                });
            }
        });
    });
})();
