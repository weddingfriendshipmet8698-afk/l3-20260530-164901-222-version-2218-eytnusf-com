
(function () {
  var toggle = document.querySelector('.nav-toggle');
  if (toggle) {
    toggle.addEventListener('click', function () {
      document.body.classList.toggle('nav-open');
    });
  }

  var hero = document.querySelector('[data-hero]');
  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var prev = hero.querySelector('[data-hero-prev]');
    var next = hero.querySelector('[data-hero-next]');
    var current = 0;

    function show(index) {
      if (!slides.length) {
        return;
      }
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('active', i === current);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('active', i === current);
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        show(Number(dot.getAttribute('data-hero-dot')) || 0);
      });
    });

    if (prev) {
      prev.addEventListener('click', function () {
        show(current - 1);
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        show(current + 1);
      });
    }

    window.setInterval(function () {
      show(current + 1);
    }, 5200);
  }

  var searchInput = document.querySelector('[data-search-input]');
  if (searchInput) {
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-card]'));
    searchInput.addEventListener('input', function () {
      var query = searchInput.value.trim().toLowerCase();
      cards.forEach(function (card) {
        var text = card.getAttribute('data-search') || '';
        card.style.display = !query || text.indexOf(query) !== -1 ? '' : 'none';
      });
    });
  }
})();
