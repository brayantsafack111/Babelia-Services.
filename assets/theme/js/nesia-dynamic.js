/* ==========================================================================
   Nesia Consulting — interactions dynamiques
   Navbar au scroll, révélation au défilement, lien actif, retour en haut
   ========================================================================== */
(function () {
  "use strict";

  /* ---------- 1. Navbar : ombre + réduction au scroll ---------- */
  var navbar = document.querySelector(".navbar.navbar-fixed-top");
  if (navbar) {
    var toggleNavbarScroll = function () {
      navbar.classList.toggle("nesia-navbar-scrolled", window.scrollY > 30);
    };
    window.addEventListener("scroll", toggleNavbarScroll, { passive: true });
    toggleNavbarScroll();
  }

  /* ---------- 2. Révélation au défilement (fade + slide-up) ---------- */
  var revealSelectors = [
    ".cid-vhWQazzgLq .image-wrapper",
    ".cid-vhWQazzgLq .text-wrapper",
    ".cid-vhWOiX9wEy .mbr-section-head",
    ".cid-vhWOiX9wEy .embla__slide",
    ".cid-vhWPsES99W .mbr-section-head",
    ".cid-vhWPsES99W form",
    ".cid-vk5kbnARry .mbr-section-head",
    ".cid-vk5kbnARry .google-map"
  ];
  var revealEls = Array.prototype.slice.call(
    document.querySelectorAll(revealSelectors.join(","))
  );

  revealEls.forEach(function (el, i) {
    el.classList.add("reveal-init");
    el.style.transitionDelay = (i % 3) * 0.09 + "s";
  });

  if ("IntersectionObserver" in window && revealEls.length) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );
    revealEls.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("reveal-in");
    });
  }

  /* ---------- 3. Lien de navigation actif selon la section visible ---------- */
  var trackedSections = [
    { id: "image1-a", navMatch: "#image1-a" },
    { id: "features017-3", navMatch: "#features017-3" },
    { id: "form6-8", navMatch: "#form6-8" }
  ];
  var navAnchors = Array.prototype.slice.call(
    document.querySelectorAll(".navbar-nav a[href*='#']")
  );

  var setActiveNav = function (hash) {
    navAnchors.forEach(function (a) {
      a.classList.remove("nesia-active-link");
      var parentLi = a.closest(".nav-item");
      var topLevelLink = parentLi && parentLi.querySelector(":scope > .nav-link");
      if (topLevelLink) topLevelLink.classList.remove("nesia-active-link");
    });
    if (!hash) return;
    navAnchors.forEach(function (a) {
      if (a.getAttribute("href").indexOf(hash) !== -1) {
        a.classList.add("nesia-active-link");
        var parentLi = a.closest(".nav-item");
        var topLevelLink = parentLi && parentLi.querySelector(":scope > .nav-link");
        if (topLevelLink) topLevelLink.classList.add("nesia-active-link");
      }
    });
  };

  if ("IntersectionObserver" in window) {
    var navObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var match = trackedSections.filter(function (s) {
              return s.id === entry.target.id;
            })[0];
            if (match) setActiveNav(match.navMatch);
          }
        });
      },
      { threshold: 0, rootMargin: "-45% 0px -50% 0px" }
    );
    trackedSections.forEach(function (s) {
      var el = document.getElementById(s.id);
      if (el) navObserver.observe(el);
    });
  }

  /* ---------- 4. Sous-menus : ouverture au survol (desktop) ---------- */
  var isHoverCapable =
    window.matchMedia &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  if (isHoverCapable && window.bootstrap) {
    document
      .querySelectorAll(".navbar-nav > .nav-item.dropdown")
      .forEach(function (item) {
        var toggle = item.querySelector(":scope > .dropdown-toggle");
        if (!toggle) return;
        var instance =
          bootstrap.Dropdown.getInstance(toggle) ||
          new bootstrap.Dropdown(toggle);
        var closeTimer;

        item.addEventListener("mouseenter", function () {
          clearTimeout(closeTimer);
          instance.show();
          toggle.blur();
        });
        item.addEventListener("mouseleave", function () {
          closeTimer = setTimeout(function () {
            instance.hide();
          }, 180);
        });
      });
  }

  /* ---------- 5. Bouton retour en haut ---------- */
  var backToTop = document.createElement("button");
  backToTop.type = "button";
  backToTop.setAttribute("aria-label", "Retour en haut de page");
  backToTop.className = "nesia-back-to-top";
  backToTop.innerHTML =
    '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 19V5M12 5L5 12M12 5L19 12" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  document.body.appendChild(backToTop);

  var toggleBackToTop = function () {
    backToTop.classList.toggle("is-visible", window.scrollY > 500);
  };
  window.addEventListener("scroll", toggleBackToTop, { passive: true });
  backToTop.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
  toggleBackToTop();
})();
