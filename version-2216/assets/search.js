
import { MOVIES } from './movies-data.js';

const perPage = 32;
let currentPage = 1;
let filtered = [...MOVIES].sort((a, b) => b.score - a.score || a.title.localeCompare(b.title, 'zh-Hans-CN'));

function card(movie) {
  return `
  <a class="movie-card" href="movie-${movie.id}.html">
    <div class="poster poster-card" style="${movie.posterStyle}">
      <div class="poster-glow"></div>
      <div class="poster-badge">${movie.type || '影片'}</div>
      <div class="poster-copy">
        <h3>${movie.title}</h3>
        <p>${movie.year || ''} · ${movie.region || ''}</p>
        <span>${movie.genre || ''}</span>
      </div>
    </div>
    <div class="movie-card-body">
      <div class="movie-card-top">
        <h3>${movie.title}</h3>
        <span>${movie.year || ''}</span>
      </div>
      <p>${movie.one_line || ''}</p>
      <div class="chip-row">
        ${(movie.tags || []).slice(0, 3).map((t) => `<span class="chip">${t}</span>`).join('')}
      </div>
    </div>
  </a>`;
}

function render() {
  const list = document.querySelector('[data-search-list]');
  const pager = document.querySelector('[data-search-pager]');
  const total = document.querySelector('[data-search-total]');
  if (!list || !pager) return;

  const maxPage = Math.max(1, Math.ceil(filtered.length / perPage));
  currentPage = Math.min(currentPage, maxPage);
  const start = (currentPage - 1) * perPage;
  const pageItems = filtered.slice(start, start + perPage);

  total && (total.textContent = `${filtered.length} 部影片`);
  list.innerHTML = pageItems.map(card).join('') || '<div class="empty-state">没有找到匹配结果</div>';

  const buttons = [];
  const pushButton = (text, page, active = false, disabled = false) => {
    buttons.push(`<button ${disabled ? 'disabled' : ''} class="${active ? 'active' : ''}" data-page="${page}">${text}</button>`);
  };

  pushButton('上一页', Math.max(1, currentPage - 1), false, currentPage === 1);
  const windowSize = 5;
  let left = Math.max(1, currentPage - 2);
  let right = Math.min(maxPage, left + windowSize - 1);
  left = Math.max(1, right - windowSize + 1);
  if (left > 1) pushButton('1', 1, currentPage === 1);
  if (left > 2) buttons.push('<span class="muted" style="align-self:center;">…</span>');
  for (let i = left; i <= right; i++) pushButton(String(i), i, i === currentPage);
  if (right < maxPage - 1) buttons.push('<span class="muted" style="align-self:center;">…</span>');
  if (right < maxPage) pushButton(String(maxPage), maxPage, currentPage === maxPage);
  pushButton('下一页', Math.min(maxPage, currentPage + 1), false, currentPage === maxPage);

  pager.innerHTML = buttons.join('');
  pager.querySelectorAll('button[data-page]').forEach((btn) => {
    btn.addEventListener('click', () => {
      currentPage = Number(btn.getAttribute('data-page')) || 1;
      render();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
}

function applyFilters() {
  const q = document.querySelector('[data-search-q]')?.value.trim().toLowerCase() || '';
  const region = document.querySelector('[data-search-region]')?.value || '';
  const type = document.querySelector('[data-search-type]')?.value || '';
  const year = document.querySelector('[data-search-year]')?.value || '';
  const sort = document.querySelector('[data-search-sort]')?.value || 'score';

  filtered = MOVIES.filter((m) => {
    const text = `${m.title} ${m.region} ${m.type} ${m.genre} ${(m.tags || []).join(' ')} ${m.one_line} ${m.summary}`.toLowerCase();
    return (!q || text.includes(q)) && (!region || m.region === region) && (!type || m.type === type) && (!year || String(m.year) === year);
  });

  filtered.sort((a, b) => {
    if (sort === 'year') return (b.year - a.year) || (b.score - a.score);
    if (sort === 'title') return a.title.localeCompare(b.title, 'zh-Hans-CN');
    return b.score - a.score || b.year - a.year;
  });
  currentPage = 1;
  render();
}

window.addEventListener('DOMContentLoaded', () => {
  const q = new URLSearchParams(window.location.search).get('q');
  const input = document.querySelector('[data-search-q]');
  if (q && input) input.value = q;
  ['input', 'change'].forEach((ev) => {
    document.querySelectorAll('[data-search-q], [data-search-region], [data-search-type], [data-search-year], [data-search-sort]').forEach((el) => {
      el.addEventListener(ev, applyFilters);
    });
  });
  applyFilters();
});
