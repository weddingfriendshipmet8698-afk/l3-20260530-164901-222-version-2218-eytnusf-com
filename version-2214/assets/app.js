(function() {
  function ready(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  }

  ready(function() {
    var toggle = document.querySelector('.nav-toggle');
    var mobileNav = document.querySelector('.mobile-nav');

    if (toggle && mobileNav) {
      toggle.addEventListener('click', function() {
        var open = mobileNav.classList.toggle('is-open');
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(document.querySelectorAll('.hero-dot'));
    var slideIndex = 0;

    function showSlide(index) {
      if (!slides.length) {
        return;
      }

      slideIndex = (index + slides.length) % slides.length;
      slides.forEach(function(slide, current) {
        slide.classList.toggle('is-active', current === slideIndex);
      });
      dots.forEach(function(dot, current) {
        dot.classList.toggle('is-active', current === slideIndex);
      });
    }

    dots.forEach(function(dot) {
      dot.addEventListener('click', function() {
        showSlide(Number(dot.getAttribute('data-slide')) || 0);
      });
    });

    if (slides.length > 1) {
      window.setInterval(function() {
        showSlide(slideIndex + 1);
      }, 6500);
    }

    var lists = Array.prototype.slice.call(document.querySelectorAll('[data-movie-list]'));

    lists.forEach(function(list) {
      var scope = list.closest('.section') || document;
      var input = scope.querySelector('.movie-search');
      var yearSelect = scope.querySelector('.movie-year-filter');
      var genreSelect = scope.querySelector('.movie-genre-filter');
      var empty = scope.querySelector('.empty-state');
      var cards = Array.prototype.slice.call(list.querySelectorAll('.movie-card'));

      function normalize(value) {
        return String(value || '').toLowerCase().trim();
      }

      function applyFilter() {
        var query = normalize(input ? input.value : '');
        var year = normalize(yearSelect ? yearSelect.value : '');
        var genre = normalize(genreSelect ? genreSelect.value : '');
        var visible = 0;

        cards.forEach(function(card) {
          var haystack = normalize([
            card.getAttribute('data-title'),
            card.getAttribute('data-tags'),
            card.getAttribute('data-genre'),
            card.getAttribute('data-region'),
            card.getAttribute('data-year')
          ].join(' '));
          var matchedQuery = !query || haystack.indexOf(query) !== -1;
          var matchedYear = !year || normalize(card.getAttribute('data-year')) === year;
          var matchedGenre = !genre || normalize(card.getAttribute('data-genre')).indexOf(genre) !== -1;
          var show = matchedQuery && matchedYear && matchedGenre;

          card.classList.toggle('is-hidden', !show);
          if (show) {
            visible += 1;
          }
        });

        if (empty) {
          empty.hidden = visible !== 0;
        }
      }

      if (input) {
        input.addEventListener('input', applyFilter);
      }
      if (yearSelect) {
        yearSelect.addEventListener('change', applyFilter);
      }
      if (genreSelect) {
        genreSelect.addEventListener('change', applyFilter);
      }
    });
  });
}());
