(function () {
  "use strict";

  var root = document.documentElement;
  var toggle = document.getElementById("themeToggle");
  var burger = document.getElementById("navBurger");
  var navLinks = document.getElementById("navLinks");
  var nav = document.getElementById("nav");
  var yearEl = document.getElementById("year");

  // ----- Theme toggle with persistence -----
  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    toggle.setAttribute("aria-pressed", String(theme === "light"));
  }

  var stored = null;
  try { stored = localStorage.getItem("theme"); } catch (e) {}
  var initial = stored || (window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
  applyTheme(initial);

  toggle.addEventListener("click", function () {
    var next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
    applyTheme(next);
    try { localStorage.setItem("theme", next); } catch (e) {}
  });

  // ----- Mobile nav -----
  burger.addEventListener("click", function () {
    var open = navLinks.classList.toggle("is-open");
    burger.setAttribute("aria-expanded", String(open));
  });
  navLinks.addEventListener("click", function (e) {
    if (e.target.tagName === "A") {
      navLinks.classList.remove("is-open");
      burger.setAttribute("aria-expanded", "false");
    }
  });

  // ----- Nav shadow on scroll -----
  function onScroll() {
    if (window.scrollY > 8) nav.classList.add("is-scrolled");
    else nav.classList.remove("is-scrolled");
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // ----- Reveal on scroll -----
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  // ----- Discord copy action -----
  var copyBtn = document.getElementById("discordCopy");
  if (copyBtn) {
    var copyHint = document.getElementById("copyHint");
    copyBtn.addEventListener("click", function () {
      var value = copyBtn.getAttribute("data-copy");
      var done = function () {
        var url = copyBtn.querySelector(".link-card__url");
        var prev = url.innerHTML;
        url.innerHTML = "Copied <strong>" + value + "</strong> to clipboard ✓";
        setTimeout(function () { url.innerHTML = prev; }, 1800);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(value).then(done).catch(done);
      } else {
        var t = document.createElement("textarea");
        t.value = value;
        document.body.appendChild(t);
        t.select();
        try { document.execCommand("copy"); } catch (e) {}
        document.body.removeChild(t);
        done();
      }
    });
  }

  // ----- Year -----
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
