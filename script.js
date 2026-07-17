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
  var progressBar = document.getElementById("scrollProgress");

  // ----- Preloader counter + loadbar -----
  function finishPreload() {
    if (finishPreload.done) return;
    finishPreload.done = true;
    if (loadbar) loadbar.style.opacity = "0";
    if (preloader) preloader.classList.add("is-done");
    document.body.style.overflow = "";
    revealAll();
  }
  (function preload() {
    var progress = 0;
    var target = 100;
    var timer = setInterval(function () {
      progress += Math.random() * 14 + 4;
      if (progress >= target) {
        progress = target;
        clearInterval(timer);
        setTimeout(finishPreload, 300);
      }
      var p = Math.min(progress, target);
      if (loadbar) loadbar.style.transform = "scaleX(" + p / 100 + ")";
      if (countEl) countEl.textContent = Math.floor(p);
    }, 90);
    document.body.style.overflow = "hidden";
    window.addEventListener("load", function () { setTimeout(finishPreload, 400); });
    setTimeout(finishPreload, 4000);
  })();

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


    // ----- Starfield (calm constant drift) -----
  (function stars(){
    var canvas=document.getElementById("stars");
    if(!canvas) return;
    var reduce=window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if(reduce) return;
    var ctx=canvas.getContext("2d");
    var dpr=Math.min(window.devicePixelRatio||1,2);
    var W,H,particles=[],theme=root.getAttribute("data-theme")==="light";
    function size(){W=canvas.width=Math.floor(innerWidth*dpr);H=canvas.height=Math.floor(innerHeight*dpr);canvas.style.width=innerWidth+"px";canvas.style.height=innerHeight+"px";}
    function make(initial){return{x:Math.random()*W,y:initial?Math.random()*H:H+Math.random()*60*dpr, r:(Math.random()*1.4+0.4)*dpr, s:Math.random()*0.35+0.12, a:Math.random()*0.45+0.2, ph:Math.random()*6.28};}
    function init(){size();var n=Math.max(40,Math.round((innerWidth*innerHeight)/34000));particles=[];for(var i=0;i<n;i++)particles.push(make(true));}
    function frame(){
      ctx.clearRect(0,0,W,H);
      var col=theme?"0,0,0":"255,255,255";
      for(var i=0;i<particles.length;i++){
        var p=particles[i];
        p.y-=p.s*dpr;
        p.ph+=0.01;
        p.x+=Math.sin(p.ph)*0.15*dpr;
        if(p.y< -10*dpr){particles[i]=make(false);}
        ctx.beginPath();
        ctx.fillStyle="rgba("+col+","+p.a+")";
        ctx.arc(p.x,p.y,p.r,0,6.283);
        ctx.fill();
      }
      requestAnimationFrame(frame);
    }
    root.addEventListener("themechange",function(){theme=root.getAttribute("data-theme")==="light";});
    var rt;window.addEventListener("resize",function(){clearTimeout(rt);rt=setTimeout(init,200);});
    init();requestAnimationFrame(frame);
  })();

  // ----- Year -----
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
