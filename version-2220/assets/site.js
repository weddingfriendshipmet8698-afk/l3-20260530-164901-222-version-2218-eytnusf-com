(function () {
  function qs(root, selector) {
    return root.querySelector(selector);
  }

  function qsa(root, selector) {
    return Array.from(root.querySelectorAll(selector));
  }

  function setupMobileNav() {
    qsa(document, "[data-nav-toggle]").forEach(function (button) {
      var header = button.closest(".site-header");
      var nav = header ? qs(header, "[data-mobile-nav]") : null;

      if (!nav) {
        return;
      }

      button.addEventListener("click", function () {
        nav.classList.toggle("is-open");
      });
    });
  }

  function matchesQuery(text, query) {
    if (!query) {
      return true;
    }

    var parts = query
      .toLowerCase()
      .split(/\s+/)
      .map(function (item) {
        return item.trim();
      })
      .filter(Boolean);

    if (!parts.length) {
      return true;
    }

    var value = (text || "").toLowerCase();
    return parts.every(function (part) {
      return value.indexOf(part) !== -1;
    });
  }

  function setupFilters() {
    qsa(document, "[data-filter-form]").forEach(function (form) {
      var input = qs(form, 'input[type="search"]');
      var targetSelector = form.getAttribute("data-filter-target");
      var target = targetSelector ? document.querySelector(targetSelector) : null;
      var countSelector = form.getAttribute("data-filter-count");
      var countNode = countSelector ? document.querySelector(countSelector) : null;

      if (!input || !target) {
        return;
      }

      var items = qsa(target, "[data-filter-item]");

      function applyFilter() {
        var query = input.value.trim();
        var visible = 0;

        items.forEach(function (item) {
          var text = item.getAttribute("data-search-text") || item.textContent || "";
          var show = matchesQuery(text, query);
          item.classList.toggle("is-hidden", !show);
          if (show) {
            visible += 1;
          }
        });

        if (countNode) {
          countNode.textContent = String(visible);
        }
      }

      input.addEventListener("input", applyFilter);
      form.addEventListener("submit", function (event) {
        event.preventDefault();
        applyFilter();
      });

      applyFilter();
    });
  }

  function setupHeroCarousel() {
    qsa(document, "[data-hero-carousel]").forEach(function (carousel) {
      var slides = qsa(carousel, "[data-hero-slide]");
      var dots = qsa(carousel, "[data-hero-dot]");
      if (slides.length <= 1) {
        return;
      }

      var index = 0;
      var timer = null;

      function activate(nextIndex) {
        index = (nextIndex + slides.length) % slides.length;
        slides.forEach(function (slide, slideIndex) {
          slide.classList.toggle("is-active", slideIndex === index);
        });

        dots.forEach(function (dot, dotIndex) {
          dot.classList.toggle("is-active", dotIndex === index);
        });
      }

      function restart() {
        if (timer) {
          window.clearInterval(timer);
        }
        timer = window.setInterval(function () {
          activate(index + 1);
        }, 5000);
      }

      dots.forEach(function (dot, dotIndex) {
        dot.addEventListener("click", function () {
          activate(dotIndex);
          restart();
        });
      });

      activate(0);
      restart();
    });
  }

  function setupVideoPlayers() {
    qsa(document, "[data-video-player]").forEach(function (container) {
      var video = qs(container, "video");
      var overlay = qs(container, "[data-play-overlay]");

      if (!video || !overlay) {
        return;
      }

      var source = video.getAttribute("data-src");
      var poster = video.getAttribute("data-poster");
      var hlsInstance = null;
      var bound = false;

      function bindSource() {
        if (bound || !source) {
          return;
        }

        if (poster) {
          video.setAttribute("poster", poster);
        }

        if (video.canPlayType && video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = source;
          bound = true;
          return;
        }

        if (window.Hls && window.Hls.isSupported()) {
          hlsInstance = new window.Hls();
          hlsInstance.loadSource(source);
          hlsInstance.attachMedia(video);
          bound = true;
          return;
        }

        video.src = source;
        bound = true;
      }

      function startPlayback() {
        bindSource();
        overlay.classList.add("is-hidden");
        var playPromise = video.play();
        if (playPromise && typeof playPromise.catch === "function") {
          playPromise.catch(function () {});
        }
      }

      overlay.addEventListener("click", startPlayback);
      video.addEventListener("click", function () {
        if (video.paused) {
          startPlayback();
        }
      });

      video.addEventListener("play", function () {
        overlay.classList.add("is-hidden");
      });

      video.addEventListener("pause", function () {
        if (!video.ended) {
          overlay.classList.remove("is-hidden");
        }
      });

      if (window.IntersectionObserver) {
        var observer = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              bindSource();
              observer.disconnect();
            }
          });
        }, { threshold: 0.1 });

        observer.observe(container);
      } else {
        bindSource();
      }

      container._hls = function () {
        if (hlsInstance) {
          hlsInstance.destroy();
        }
      };
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    setupMobileNav();
    setupFilters();
    setupHeroCarousel();
    setupVideoPlayers();
  });
})();
