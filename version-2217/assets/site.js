(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  ready(function () {
    var menuButton = document.querySelector(".mobile-menu-button");
    var mobileNav = document.querySelector(".mobile-nav");

    if (menuButton && mobileNav) {
      menuButton.addEventListener("click", function () {
        var isOpen = mobileNav.classList.toggle("is-open");
        menuButton.setAttribute("aria-expanded", String(isOpen));
      });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(document.querySelectorAll(".hero-dot"));
    var current = 0;

    function showSlide(index) {
      if (!slides.length) {
        return;
      }

      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === current);
      });
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener("click", function () {
        showSlide(index);
      });
    });

    if (slides.length > 1) {
      window.setInterval(function () {
        showSlide(current + 1);
      }, 5600);
    }

    var urlParams = new URLSearchParams(window.location.search);
    var initialQuery = urlParams.get("q") || "";
    var searchInput = document.querySelector("[data-search-input]");
    var localSearchForm = document.querySelector(".local-search");
    var cards = Array.prototype.slice.call(document.querySelectorAll(".movie-card"));
    var filterButtons = Array.prototype.slice.call(document.querySelectorAll("[data-filter]"));
    var activeCategory = "";

    function normalize(value) {
      return String(value || "").trim().toLowerCase();
    }

    function cardText(card) {
      return [
        card.getAttribute("data-title"),
        card.getAttribute("data-region"),
        card.getAttribute("data-genre"),
        card.getAttribute("data-year"),
        card.getAttribute("data-category"),
        card.textContent
      ].join(" ").toLowerCase();
    }

    function applyFilters() {
      var query = normalize(searchInput ? searchInput.value : "");
      cards.forEach(function (card) {
        var matchesQuery = !query || cardText(card).indexOf(query) !== -1;
        var matchesCategory = !activeCategory || card.getAttribute("data-category") === activeCategory;
        card.classList.toggle("is-filtered-out", !(matchesQuery && matchesCategory));
      });
    }

    if (searchInput) {
      searchInput.value = initialQuery;
      searchInput.addEventListener("input", applyFilters);
    }

    if (localSearchForm) {
      localSearchForm.addEventListener("submit", function (event) {
        event.preventDefault();
        applyFilters();
      });
    }

    filterButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        activeCategory = button.getAttribute("data-filter") || "";
        filterButtons.forEach(function (item) {
          item.classList.toggle("is-active", item === button);
        });
        applyFilters();
      });
    });

    applyFilters();
  });
})();
