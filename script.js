(function () {
  "use strict";

  var root = document.documentElement;
  var toggle = document.getElementById("themeToggle");
  var burger = document.getElementById("navBurger");
  var navLinks = document.getElementById("navLinks");
  var nav = document.getElementById("nav");
  var yearEl = document.getElementById("year");
  var progressBar = document.getElementById("scrollProgress");

  // ----- Theme toggle -----
  function applyTheme(t) {
    root.setAttribute("data-theme", t);
    toggle.setAttribute("aria-pressed", String(t === "light"));
    root.dispatchEvent(new Event("themechange"));
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

  // ----- Scroll: progress + nav hide + ring parallax (rAF throttled) -----
  var lastY = 0;
  var ticking = false;
  function update() {
    ticking = false;
    var y = window.scrollY;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    if (progressBar) progressBar.style.transform = "scaleX(" + (max > 0 ? y / max : 0) + ")";
    if (y > lastY && y > 200) nav.classList.add("is-hidden");
    else nav.classList.remove("is-hidden");
    lastY = y;
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  update();

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

  // ----- Hero word-by-word reveal -----
  document.querySelectorAll("[data-split]").forEach(function (el) {
    var words = el.textContent.trim().split(/\s+/);
    el.setAttribute("aria-label", el.textContent);
    el.innerHTML = words.map(function (w, i) {
      return '<span class="word" style="--i:' + i + '"><span>' + w + "</span></span>";
    }).join(" ");
  });

  // ----- Seamless marquee (duplicate content) -----
  var track = document.getElementById("marqueeTrack");
  if (track) {
    track.innerHTML += track.innerHTML;
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
