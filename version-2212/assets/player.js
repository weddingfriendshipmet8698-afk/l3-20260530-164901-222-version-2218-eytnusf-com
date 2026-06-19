import { H as Hls } from './hls-vendor.js';

function attachStream(video, src, holder) {
    if (video.dataset.streamReady === 'true') {
        return;
    }

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = src;
    } else if (Hls && Hls.isSupported()) {
        var hls = new Hls({
            enableWorker: true,
            lowLatencyMode: true,
            backBufferLength: 90
        });
        hls.loadSource(src);
        hls.attachMedia(video);
        holder.hlsInstance = hls;
    } else {
        video.src = src;
    }

    video.dataset.streamReady = 'true';
}

function initPlayer(holder) {
    var video = holder.querySelector('video');
    var overlay = holder.querySelector('[data-play]');
    var src = holder.getAttribute('data-src');

    if (!video || !overlay || !src) {
        return;
    }

    function startPlayback() {
        attachStream(video, src, holder);
        overlay.classList.add('is-hidden');
        video.controls = true;
        var playPromise = video.play();
        if (playPromise && typeof playPromise.catch === 'function') {
            playPromise.catch(function () {
                video.controls = true;
            });
        }
    }

    overlay.addEventListener('click', function (event) {
        event.preventDefault();
        startPlayback();
    });

    holder.addEventListener('click', function (event) {
        if (event.target === video || event.target.closest('[data-play]')) {
            return;
        }
        startPlayback();
    });
}

document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('[data-player]').forEach(initPlayer);
});
