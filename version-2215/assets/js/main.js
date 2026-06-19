(function () {
    function ready(callback) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', callback);
        } else {
            callback();
        }
    }

    ready(function () {
        var menuButton = document.querySelector('[data-menu-toggle]');
        var mainNav = document.querySelector('[data-main-nav]');
        if (menuButton && mainNav) {
            menuButton.addEventListener('click', function () {
                mainNav.classList.toggle('open');
            });
        }

        var backTop = document.querySelector('[data-back-top]');
        if (backTop) {
            window.addEventListener('scroll', function () {
                backTop.classList.toggle('visible', window.scrollY > 500);
            });
            backTop.addEventListener('click', function () {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }

        var carousel = document.querySelector('[data-hero-carousel]');
        if (carousel) {
            var slides = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-slide]'));
            var dots = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-dot]'));
            var prev = carousel.querySelector('[data-hero-prev]');
            var next = carousel.querySelector('[data-hero-next]');
            var index = 0;
            var timer = null;

            function show(nextIndex) {
                index = (nextIndex + slides.length) % slides.length;
                slides.forEach(function (slide, i) {
                    slide.classList.toggle('active', i === index);
                });
                dots.forEach(function (dot, i) {
                    dot.classList.toggle('active', i === index);
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

            dots.forEach(function (dot, i) {
                dot.addEventListener('click', function () {
                    show(i);
                    start();
                });
            });

            carousel.addEventListener('mouseenter', stop);
            carousel.addEventListener('mouseleave', start);
            show(0);
            start();
        }

        var filterScopes = Array.prototype.slice.call(document.querySelectorAll('[data-filter-scope]'));
        filterScopes.forEach(function (scope) {
            var input = scope.querySelector('[data-filter-input]');
            var year = scope.querySelector('[data-filter-year]');
            var region = scope.querySelector('[data-filter-region]');
            var type = scope.querySelector('[data-filter-type]');
            var count = scope.querySelector('[data-filter-count]');
            var cardsContainer = scope.nextElementSibling;
            var cards = [];

            while (cardsContainer && cards.length === 0) {
                cards = Array.prototype.slice.call(cardsContainer.querySelectorAll('.movie-card'));
                cardsContainer = cardsContainer.nextElementSibling;
            }

            function textOf(card) {
                return [
                    card.dataset.title,
                    card.dataset.year,
                    card.dataset.region,
                    card.dataset.type,
                    card.dataset.category,
                    card.dataset.genre,
                    card.dataset.tags,
                    card.textContent
                ].join(' ').toLowerCase();
            }

            function applyFilter() {
                var keyword = input ? input.value.trim().toLowerCase() : '';
                var yearValue = year ? year.value : '';
                var regionValue = region ? region.value : '';
                var typeValue = type ? type.value : '';
                var visible = 0;

                cards.forEach(function (card) {
                    var matched = true;
                    if (keyword && textOf(card).indexOf(keyword) === -1) {
                        matched = false;
                    }
                    if (yearValue && card.dataset.year !== yearValue) {
                        matched = false;
                    }
                    if (regionValue && card.dataset.region !== regionValue) {
                        matched = false;
                    }
                    if (typeValue && card.dataset.type !== typeValue) {
                        matched = false;
                    }
                    card.classList.toggle('hidden-by-filter', !matched);
                    if (matched) {
                        visible += 1;
                    }
                });

                if (count) {
                    count.textContent = String(visible);
                }
            }

            [input, year, region, type].forEach(function (control) {
                if (control) {
                    control.addEventListener('input', applyFilter);
                    control.addEventListener('change', applyFilter);
                }
            });

            var params = new URLSearchParams(window.location.search);
            var query = params.get('q');
            if (query && input) {
                input.value = query;
            }
            applyFilter();
        });
    });
})();
