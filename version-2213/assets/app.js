
(function () {
  function qs(selector, scope) {
    return (scope || document).querySelector(selector);
  }

  function qsa(selector, scope) {
    return Array.from((scope || document).querySelectorAll(selector));
  }

  function normalize(value) {
    return String(value || '').toLowerCase().trim();
  }

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function setupHeader() {
    var header = qs('[data-site-header]');
    var toggle = qs('[data-nav-toggle]');
    var mobileNav = qs('[data-mobile-nav]');

    function updateHeaderState() {
      if (!header) {
        return;
      }
      header.classList.toggle('is-scrolled', window.scrollY > 12);
    }

    updateHeaderState();
    window.addEventListener('scroll', updateHeaderState, { passive: true });

    if (toggle && mobileNav) {
      toggle.addEventListener('click', function () {
        var isOpen = mobileNav.classList.toggle('is-open');
        toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      });
    }
  }

  function setupImageFallbacks() {
    qsa('img[data-cover-fallback]').forEach(function (img) {
      img.addEventListener('error', function () {
        var shell = img.closest('.image-shell') || img.closest('.hero-bg');
        if (shell) {
          shell.classList.add('image-missing');
        }
        img.remove();
      }, { once: true });
    });
  }

  function setupPageFilter() {
    var input = qs('[data-card-filter]');
    var scope = qs('[data-filter-scope]');
    var empty = qs('[data-filter-empty]');

    if (!input || !scope) {
      return;
    }

    var cards = qsa('.movie-card', scope);

    input.addEventListener('input', function () {
      var query = normalize(input.value);
      var visibleCount = 0;

      cards.forEach(function (card) {
        var haystack = normalize([
          card.dataset.title,
          card.dataset.tags,
          card.dataset.region,
          card.dataset.year,
          card.dataset.type,
          card.dataset.genre
        ].join(' '));
        var matched = !query || haystack.indexOf(query) !== -1;
        card.hidden = !matched;
        if (matched) {
          visibleCount += 1;
        }
      });

      if (empty) {
        empty.hidden = visibleCount !== 0;
      }
    });
  }

  function movieCardHtml(movie) {
    var tags = Array.isArray(movie.tags) ? movie.tags.join(' ') : '';
    return [
      '<article class="movie-card" data-title="', escapeHtml(movie.title), '" data-tags="', escapeHtml(tags), '" data-region="', escapeHtml(movie.region), '" data-year="', escapeHtml(movie.year), '" data-type="', escapeHtml(movie.type), '" data-genre="', escapeHtml(movie.genreRaw), '">',
      '  <a href="', escapeHtml(movie.detailUrl), '" class="card-link" aria-label="观看 ', escapeHtml(movie.title), '">',
      '    <div class="card-media">',
      '      <div class="image-shell"><img src="./', escapeHtml(movie.coverIndex), '.jpg" alt="', escapeHtml(movie.title), '" loading="lazy" data-cover-fallback></div>',
      '      <span class="type-badge">', escapeHtml(movie.type), '</span>',
      '      <span class="duration-badge">', escapeHtml(movie.duration), '</span>',
      '    </div>',
      '    <div class="card-body">',
      '      <h3>', escapeHtml(movie.title), '</h3>',
      '      <p>', escapeHtml(movie.oneLine), '</p>',
      '      <div class="card-meta">',
      '        <span>', escapeHtml(movie.region), '</span>',
      '        <span>', escapeHtml(movie.year), '</span>',
      '        <span>', escapeHtml(movie.genreRaw), '</span>',
      '      </div>',
      '    </div>',
      '  </a>',
      '</article>'
    ].join('');
  }

  function setupSearchPage() {
    var results = qs('#search-results');
    var form = qs('[data-search-form]');
    var input = qs('[data-search-input]');
    var summary = qs('[data-search-summary]');

    if (!results || !window.MOVIE_DATA) {
      return;
    }

    var params = new URLSearchParams(window.location.search);
    var initialQuery = params.get('q') || '';

    if (input) {
      input.value = initialQuery;
    }

    function render(query) {
      var normalizedQuery = normalize(query);
      var movies = window.MOVIE_DATA;
      var matched;

      if (!normalizedQuery) {
        matched = movies.slice(0, 24);
        if (summary) {
          summary.textContent = '请输入关键词搜索，当前先展示前 24 部推荐影片。';
        }
      } else {
        matched = movies.filter(function (movie) {
          var haystack = normalize([
            movie.title,
            movie.region,
            movie.type,
            movie.year,
            movie.genreRaw,
            movie.oneLine,
            movie.summary,
            Array.isArray(movie.tags) ? movie.tags.join(' ') : ''
          ].join(' '));
          return haystack.indexOf(normalizedQuery) !== -1;
        });
        if (summary) {
          summary.textContent = '搜索“' + query + '”找到 ' + matched.length + ' 部影片。';
        }
      }

      results.innerHTML = matched.map(movieCardHtml).join('') || '<p class="empty-state">没有找到匹配影片。</p>';
      setupImageFallbacks();
    }

    render(initialQuery);

    if (form && input) {
      form.addEventListener('submit', function (event) {
        event.preventDefault();
        var query = input.value.trim();
        var nextUrl = query ? 'search.html?q=' + encodeURIComponent(query) : 'search.html';
        window.history.pushState({}, '', nextUrl);
        render(query);
      });
    }
  }

  function setupCopyLinks() {
    qsa('[data-copy-link]').forEach(function (button) {
      button.addEventListener('click', function () {
        var value = window.location.href;
        var original = button.textContent;

        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(value).then(function () {
            button.textContent = '已复制';
            window.setTimeout(function () {
              button.textContent = original;
            }, 1800);
          });
        } else {
          button.textContent = '复制当前地址';
          window.prompt('复制链接', value);
          window.setTimeout(function () {
            button.textContent = original;
          }, 1800);
        }
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    setupHeader();
    setupImageFallbacks();
    setupPageFilter();
    setupSearchPage();
    setupCopyLinks();
  });
}());
