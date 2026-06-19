(function () {
  function selectAll(selector, scope) {
    return Array.prototype.slice.call((scope || document).querySelectorAll(selector));
  }

  function initMenu() {
    var button = document.querySelector('[data-menu-toggle]');
    var menu = document.querySelector('[data-mobile-menu]');
    if (!button || !menu) {
      return;
    }
    button.addEventListener('click', function () {
      menu.classList.toggle('is-open');
    });
  }

  function initHero() {
    var slider = document.querySelector('[data-hero-slider]');
    if (!slider) {
      return;
    }
    var slides = selectAll('[data-hero-slide]', slider);
    var dots = selectAll('[data-hero-dot]', slider);
    var prev = slider.querySelector('[data-hero-prev]');
    var next = slider.querySelector('[data-hero-next]');
    var index = 0;
    var timer = null;

    function show(target) {
      if (!slides.length) {
        return;
      }
      index = (target + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === index);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        show(i);
        start();
      });
    });

    if (prev) {
      prev.addEventListener('click', function () {
        show(index - 1);
        start();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        show(index + 1);
        start();
      });
    }

    slider.addEventListener('mouseenter', stop);
    slider.addEventListener('mouseleave', start);
    show(0);
    start();
  }

  function initFilters() {
    selectAll('[data-filter-scope]').forEach(function (scope) {
      var input = scope.querySelector('[data-filter-input]');
      var type = scope.querySelector('[data-filter-type]');
      var year = scope.querySelector('[data-filter-year]');
      var region = scope.querySelector('[data-filter-region]');
      var category = scope.querySelector('[data-filter-category]');
      var sort = scope.querySelector('[data-sort-select]');
      var grid = scope.parentElement.querySelector('.filterable-grid');
      if (!grid) {
        return;
      }
      var cards = selectAll('.movie-card', grid);
      var params = new URLSearchParams(window.location.search);
      var initial = params.get('q');
      if (input && initial) {
        input.value = initial;
      }

      function apply() {
        var q = input ? input.value.trim().toLowerCase() : '';
        var selectedType = type ? type.value : '';
        var selectedYear = year ? year.value : '';
        var selectedRegion = region ? region.value : '';
        var selectedCategory = category ? category.value : '';
        cards.forEach(function (card) {
          var text = (card.getAttribute('data-search') || '').toLowerCase();
          var ok = true;
          if (q && text.indexOf(q) === -1) {
            ok = false;
          }
          if (selectedType && card.getAttribute('data-type') !== selectedType) {
            ok = false;
          }
          if (selectedYear && card.getAttribute('data-year') !== selectedYear) {
            ok = false;
          }
          if (selectedRegion && card.getAttribute('data-region') !== selectedRegion) {
            ok = false;
          }
          if (selectedCategory && card.getAttribute('data-category') !== selectedCategory) {
            ok = false;
          }
          card.classList.toggle('is-hidden', !ok);
        });
      }

      function applySort() {
        if (!sort) {
          return;
        }
        var value = sort.value;
        var sorted = cards.slice().sort(function (a, b) {
          if (value === 'title') {
            return (a.getAttribute('data-search') || '').localeCompare(b.getAttribute('data-search') || '', 'zh-CN');
          }
          if (value === 'date') {
            return (b.getAttribute('data-date') || '').localeCompare(a.getAttribute('data-date') || '');
          }
          return Number(b.getAttribute('data-score') || 0) - Number(a.getAttribute('data-score') || 0);
        });
        sorted.forEach(function (card) {
          grid.appendChild(card);
        });
        cards = sorted;
      }

      [input, type, year, region, category].forEach(function (el) {
        if (el) {
          el.addEventListener('input', apply);
          el.addEventListener('change', apply);
        }
      });
      if (sort) {
        sort.addEventListener('change', function () {
          applySort();
          apply();
        });
        applySort();
      }
      apply();
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initMenu();
    initHero();
    initFilters();
  });
})();
