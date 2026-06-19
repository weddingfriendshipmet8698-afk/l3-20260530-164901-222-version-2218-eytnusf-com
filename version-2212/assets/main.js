(function () {
    function normalize(value) {
        return (value || '').toString().trim().toLowerCase();
    }

    function initMenu() {
        var toggle = document.querySelector('[data-menu-toggle]');
        var panel = document.querySelector('[data-mobile-panel]');
        if (!toggle || !panel) {
            return;
        }
        toggle.addEventListener('click', function () {
            panel.classList.toggle('is-open');
        });
    }

    function initHero() {
        var hero = document.querySelector('[data-hero]');
        if (!hero) {
            return;
        }
        var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
        if (slides.length < 2) {
            return;
        }
        var current = 0;
        var timer = null;

        function show(index) {
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('active', slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('active', dotIndex === current);
            });
        }

        function start() {
            timer = window.setInterval(function () {
                show(current + 1);
            }, 5200);
        }

        dots.forEach(function (dot, dotIndex) {
            dot.addEventListener('click', function () {
                window.clearInterval(timer);
                show(dotIndex);
                start();
            });
        });
        start();
    }

    function initLocalFilter() {
        var input = document.querySelector('[data-local-search]');
        var cards = Array.prototype.slice.call(document.querySelectorAll('[data-card]'));
        var buttons = Array.prototype.slice.call(document.querySelectorAll('[data-filter-value]'));
        if (!input && !buttons.length) {
            return;
        }
        var activeFilter = 'all';

        if (input && input.hasAttribute('data-url-query')) {
            var params = new URLSearchParams(window.location.search);
            var q = params.get('q') || '';
            input.value = q;
        }

        function apply() {
            var term = normalize(input ? input.value : '');
            cards.forEach(function (card) {
                var text = normalize(card.getAttribute('data-search'));
                var category = card.getAttribute('data-category') || '';
                var matchedText = !term || text.indexOf(term) !== -1;
                var matchedFilter = activeFilter === 'all' || category === activeFilter || text.indexOf(normalize(activeFilter)) !== -1;
                card.classList.toggle('is-hidden', !(matchedText && matchedFilter));
            });
        }

        if (input) {
            input.addEventListener('input', apply);
        }
        buttons.forEach(function (button) {
            button.addEventListener('click', function () {
                buttons.forEach(function (item) {
                    item.classList.remove('active');
                });
                button.classList.add('active');
                activeFilter = button.getAttribute('data-filter-value') || 'all';
                apply();
            });
        });
        apply();
    }

    document.addEventListener('DOMContentLoaded', function () {
        initMenu();
        initHero();
        initLocalFilter();
    });
})();
