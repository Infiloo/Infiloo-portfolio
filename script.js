(function () {
  "use strict";

  var root = document.documentElement;
  var preloader = document.getElementById("preloader");
  var loadbar = document.getElementById("loadbar");
  var countEl = document.getElementById("count");
  var toggle = document.getElementById("themeToggle");
  var burger = document.getElementById("navBurger");
  var navLinks = document.getElementById("navLinks");
  var nav = document.getElementById("nav");
  var yearEl = document.getElementById("year");

  // ----- Preloader counter + loadbar -----
  (function preload() {
    var progress = 0;
    var target = 100;
    var timer = setInterval(function () {
      progress += Math.random() * 14 + 4;
      if (progress >= target) {
        progress = target;
        clearInterval(timer);
        setTimeout(finish, 350);
      }
      var p = Math.min(progress, target);
      if (loadbar) loadbar.style.transform = "scaleX(" + p / 100 + ")";
      if (countEl) countEl.textContent = Math.floor(p);
    }, 90);

    function finish() {
      if (loadbar) loadbar.style.opacity = "0";
      if (preloader) preloader.classList.add("is-done");
      document.body.style.overflow = "";
      revealAll();
    }
    document.body.style.overflow = "hidden";
  })();

  // ----- Theme toggle -----
  function applyTheme(t) {
    root.setAttribute("data-theme", t);
    toggle.setAttribute("aria-pressed", String(t === "light"));
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
    if (e.target.classList.contains("link")) {
      navLinks.classList.remove("is-open");
      burger.setAttribute("aria-expanded", "false");
    }
  });

  // ----- Nav hide on scroll down -----
  var lastY = 0;
  window.addEventListener("scroll", function () {
    var y = window.scrollY;
    if (y > lastY && y > 200) nav.classList.add("is-hidden");
    else nav.classList.remove("is-hidden");
    lastY = y;
  }, { passive: true });

  // ----- Scroll reveal -----
  var revealEls = document.querySelectorAll(".reveal, .reveal-mask");
  function revealAll() {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealAll();
  }

  // ----- Orbital partners ring -----
  var ring = document.getElementById("ring");
  if (ring) {
    var items = ring.querySelectorAll(".ring__item");
    var n = items.length;
    items.forEach(function (item, i) {
      var angle = (360 / n) * i;
      item.style.setProperty("--angle", angle + "deg");
      item.style.transform =
        "rotate(" + angle + "deg) translateY(calc(var(--ring-r, -28vw))) rotate(" + (-angle) + "deg)";
    });
    window.addEventListener("resize", function () {
      var r = Math.min(window.innerWidth * 0.28, 340) + "px";
      ring.style.setProperty("--ring-r", "-" + r);
    });
    ring.style.setProperty("--ring-r", "-" + Math.min(window.innerWidth * 0.28, 340) + "px");
  }

  // ----- Discord copy -----
  var copyBtn = document.getElementById("discordCopy");
  if (copyBtn) {
    copyBtn.addEventListener("click", function () {
      var value = copyBtn.getAttribute("data-copy");
      var url = copyBtn.querySelector(".link-row__url");
      var prev = url.textContent;
      var done = function () {
        url.textContent = "Copied @" + value + " to clipboard ✓";
        setTimeout(function () { url.textContent = prev; }, 1800);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(value).then(done).catch(done);
      } else {
        var t = document.createElement("textarea");
        t.value = value; document.body.appendChild(t); t.select();
        try { document.execCommand("copy"); } catch (e) {}
        document.body.removeChild(t); done();
      }
    });
  }

  // ----- Year -----
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
