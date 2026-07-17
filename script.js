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


  // ----- Starfield (rises from bottom on scroll) -----
  (function stars(){
    var canvas=document.getElementById("stars");
    if(!canvas) return;
    var reduce=window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if(reduce) return;
    var ctx=canvas.getContext("2d");
    var dpr=Math.min(window.devicePixelRatio||1,2);
    var W,H,particles=[],scrollY=0,lastScroll=0,vel=0;
    function size(){W=canvas.width=Math.floor(innerWidth*dpr);H=canvas.height=Math.floor(innerHeight*dpr);canvas.style.width=innerWidth+"px";canvas.style.height=innerHeight+"px";}
    function make(initial){return{x:Math.random()*W,y:initial?Math.random()*H:H+Math.random()*40*dpr, r:(Math.random()*1.6+0.4)*dpr, s:Math.random()*0.4+0.15, a:Math.random()*0.5+0.25};}
    function init(){size();var n=Math.round((innerWidth*innerHeight)/26000);particles=[];for(var i=0;i<n;i++)particles.push(make(true));}
    function color(){var d=root.getAttribute("data-theme")==="light";return d?"0,0,0":"255,255,255";}
    function frame(){
      ctx.clearRect(0,0,W,H);
      var col=color();
      for(var i=0;i<particles.length;i++){
        var p=particles[i];
        p.y-=(p.s+vel*0.6)*dpr;
        p.x+=Math.sin((p.y+p.r)*0.01)*0.2*dpr;
        if(p.y< -10*dpr){particles[i]=make(false);}
        ctx.beginPath();
        ctx.fillStyle="rgba("+col+","+p.a+")";
        ctx.arc(p.x,p.y,p.r,0,6.283);
        ctx.fill();
      }
      requestAnimationFrame(frame);
    }
    window.addEventListener("scroll",function(){scrollY=window.scrollY;vel=Math.min(6,(scrollY-lastScroll));lastScroll=scrollY;clearTimeout(stars._t);stars._t=setTimeout(function(){vel=0;},120);},{passive:true});
    window.addEventListener("resize",init);
    init();requestAnimationFrame(frame);
  })();

  // ----- Year -----
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
