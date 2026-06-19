
import { H as Hls } from "../source/video-vendor-dru42stk.js";

function initMobileNav() {
  const btn = document.querySelector('[data-nav-toggle]');
  const nav = document.querySelector('[data-nav]');
  if (!btn || !nav) return;
  btn.addEventListener('click', () => {
    nav.classList.toggle('open');
  });
}

function initHeroCarousel() {
  const slides = Array.from(document.querySelectorAll('[data-hero-slide]'));
  const dots = Array.from(document.querySelectorAll('[data-hero-dot]'));
  const prev = document.querySelector('[data-hero-prev]');
  const next = document.querySelector('[data-hero-next]');
  if (!slides.length) return;

  let index = 0;
  let timer = null;

  const show = (i) => {
    index = (i + slides.length) % slides.length;
    slides.forEach((slide, idx) => slide.classList.toggle('active', idx === index));
    dots.forEach((dot, idx) => dot.classList.toggle('active', idx === index));
  };

  const start = () => {
    stop();
    timer = window.setInterval(() => show(index + 1), 5000);
  };

  const stop = () => {
    if (timer) window.clearInterval(timer);
    timer = null;
  };

  prev?.addEventListener('click', () => { show(index - 1); start(); });
  next?.addEventListener('click', () => { show(index + 1); start(); });
  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const target = Number(dot.getAttribute('data-hero-dot')) || 0;
      show(target);
      start();
    });
  });

  show(0);
  start();
}

function initCategoryFilter() {
  const panel = document.querySelector('[data-filter-panel]');
  if (!panel) return;

  const searchInput = panel.querySelector('[data-filter-search]');
  const typeSelect = panel.querySelector('[data-filter-type]');
  const regionSelect = panel.querySelector('[data-filter-region]');
  const yearSelect = panel.querySelector('[data-filter-year]');
  const cards = Array.from(document.querySelectorAll('[data-filter-card]'));
  const empty = document.querySelector('[data-filter-empty]');

  const apply = () => {
    const q = (searchInput?.value || '').trim().toLowerCase();
    const type = (typeSelect?.value || '').trim();
    const region = (regionSelect?.value || '').trim();
    const year = (yearSelect?.value || '').trim();

    let visible = 0;
    cards.forEach((card) => {
      const text = (card.getAttribute('data-filter-text') || '').toLowerCase();
      const cardType = card.getAttribute('data-filter-type') || '';
      const cardRegion = card.getAttribute('data-filter-region') || '';
      const cardYear = card.getAttribute('data-filter-year') || '';
      const ok = (!q || text.includes(q)) && (!type || type === cardType) && (!region || region === cardRegion) && (!year || year === cardYear);
      card.style.display = ok ? '' : 'none';
      if (ok) visible += 1;
    });
    if (empty) empty.style.display = visible ? 'none' : 'block';
  };

  [searchInput, typeSelect, regionSelect, yearSelect].forEach((el) => {
    el?.addEventListener('input', apply);
    el?.addEventListener('change', apply);
  });
  apply();
}

function initScrollToPlayer() {
  const btn = document.querySelector('[data-scroll-player]');
  const target = document.querySelector('[data-player-anchor]');
  if (!btn || !target) return;
  btn.addEventListener('click', () => {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}

function initPlayers() {
  const shells = Array.from(document.querySelectorAll('[data-player-src]'));
  if (!shells.length) return;

  shells.forEach((shell) => {
    const video = shell.querySelector('video');
    const src = shell.getAttribute('data-player-src');
    if (!video || !src) return;

    const attach = () => {
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = src;
        return;
      }
      if (Hls && Hls.isSupported()) {
        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
        });
        hls.loadSource(src);
        hls.attachMedia(video);
        shell.__hls = hls;
      } else {
        video.src = src;
      }
    };

    if (!video.src) attach();

    shell.querySelector('[data-play-now]')?.addEventListener('click', () => {
      video.play().catch(() => {});
    });
  });
}

function initClipboard() {
  document.querySelectorAll('[data-copy-link]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const text = btn.getAttribute('data-copy-link');
      if (!text) return;
      try {
        await navigator.clipboard.writeText(text);
        const origin = btn.textContent;
        btn.textContent = '已复制';
        window.setTimeout(() => { btn.textContent = origin; }, 1400);
      } catch {
        window.prompt('复制链接', text);
      }
    });
  });
}

window.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initHeroCarousel();
  initCategoryFilter();
  initScrollToPlayer();
  initPlayers();
  initClipboard();
});
