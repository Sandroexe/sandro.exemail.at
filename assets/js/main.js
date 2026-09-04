/* ══════════════════════════════════════════════════════════════════════════
   sandro.exemail.at · GLOBALES SKRIPT
   Nav, Sprache, Scroll-Reveal, Partikel-Hintergrund, Skill-Bars, To-Top.
   Alles defensiv – jede Seite bindet nur, was existiert.
   ══════════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── MOBILE NAV ───────────────────────────────────────────────────────── */
  var toggle = document.getElementById('navToggle');
  var menu = document.getElementById('navMenu');
  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      var open = menu.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        menu.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ── ACTIVE NAV (Fallback, falls page.nav nicht gesetzt) ──────────────── */
  if (!document.querySelector('.nav__link.is-active')) {
    var seg = window.location.pathname.replace(/\/$/, '').split('/').pop() || 'index';
    seg = seg.replace(/\.html$/, '') || 'index';
    var map = { '': 'home', 'index': 'home', 'projects': 'projects', 'certificates': 'certificates', 'lab': 'lab', 'links': 'links', 'contact': 'contact' };
    var key = map[seg];
    if (key) {
      var link = document.querySelector('.nav__link[data-nav="' + key + '"]');
      if (link) { link.classList.add('is-active'); link.setAttribute('aria-current', 'page'); }
    }
  }

  /* ── SPRACHE (DE / EN) ────────────────────────────────────────────────── */
  var langBtn = document.getElementById('langSwitch');
  var lang = 'de';
  try { lang = localStorage.getItem('lang') || 'de'; } catch (e) {}

  function applyLang(l) {
    lang = l;
    try { localStorage.setItem('lang', l); } catch (e) {}
    document.documentElement.lang = l;
    document.querySelectorAll('[data-lang-opt]').forEach(function (s) {
      s.classList.toggle('is-on', s.getAttribute('data-lang-opt') === l);
    });
    document.querySelectorAll('[data-de]').forEach(function (el) {
      var val = l === 'en' ? (el.getAttribute('data-en') || el.getAttribute('data-de')) : el.getAttribute('data-de');
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') el.placeholder = val;
      else el.innerHTML = val;
    });
  }
  window.siteLang = function () { return lang; };
  if (langBtn) langBtn.addEventListener('click', function () { applyLang(lang === 'de' ? 'en' : 'de'); });
  applyLang(lang);

  /* ── SCROLL REVEAL ───────────────────────────────────────────────────── */
  var reveal = document.querySelectorAll('.reveal');
  if (reveal.length) {
    if ('IntersectionObserver' in window && !reduceMotion) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
        });
      }, { rootMargin: '0px 0px -8% 0px' });
      reveal.forEach(function (el) { io.observe(el); });
    } else {
      reveal.forEach(function (el) { el.classList.add('is-in'); });
    }
  }

  /* ── SKILL BARS ──────────────────────────────────────────────────────── */
  var bars = document.querySelectorAll('.skill__fill[data-value]');
  if (bars.length) {
    var fill = function () { bars.forEach(function (b) { b.style.width = b.getAttribute('data-value'); }); };
    if ('IntersectionObserver' in window) {
      var bio = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { if (e.isIntersecting) { fill(); bio.disconnect(); } });
      }, { threshold: 0.3 });
      bio.observe(bars[0].closest('.card') || bars[0]);
    } else { fill(); }
  }

  /* ── TYPEWRITER (Hero) ───────────────────────────────────────────────── */
  var tw = document.querySelector('[data-typewriter]');
  if (tw) {
    var words;
    try { words = JSON.parse(tw.getAttribute('data-typewriter')); } catch (e) { words = []; }
    if (words.length) {
      if (reduceMotion) {
        tw.textContent = words[0];
      } else {
        var wi = 0, ci = 0, del = false;
        (function step() {
          var w = words[wi];
          tw.textContent = del ? w.slice(0, ci - 1) : w.slice(0, ci + 1);
          del ? ci-- : ci++;
          var d = del ? 45 : 95;
          if (!del && ci === w.length) { d = 2000; del = true; }
          else if (del && ci === 0) { del = false; wi = (wi + 1) % words.length; d = 400; }
          setTimeout(step, d);
        })();
      }
    }
  }

  /* ── TO-TOP ──────────────────────────────────────────────────────────── */
  var toTop = document.getElementById('toTop');
  if (toTop) {
    toTop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }); });
    window.addEventListener('scroll', function () {
      toTop.classList.toggle('is-visible', window.scrollY > 400);
    }, { passive: true });
  }

  /* ── PARTIKEL-HINTERGRUND ────────────────────────────────────────────── */
  var canvas = document.getElementById('bg-net');
  if (canvas && !reduceMotion) {
    var ctx = canvas.getContext('2d');
    var pts = [], raf, W, H;
    function size() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }
    function seed() {
      var n = Math.min(70, Math.floor(window.innerWidth / 20));
      pts = [];
      for (var i = 0; i < n; i++) {
        pts.push({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4 });
      }
    }
    function frame() {
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < pts.length; i++) {
        var p = pts[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
        ctx.fillStyle = 'rgba(255,255,255,0.45)';
        ctx.beginPath(); ctx.arc(p.x, p.y, 1, 0, Math.PI * 2); ctx.fill();
        for (var j = i + 1; j < pts.length; j++) {
          var q = pts[j], dx = p.x - q.x, dy = p.y - q.y, dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130) {
            ctx.strokeStyle = 'rgba(47,131,255,' + (1 - dist / 130) * 0.5 + ')';
            ctx.lineWidth = 0.5;
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(frame);
    }
    size(); seed(); frame();
    var t;
    window.addEventListener('resize', function () {
      clearTimeout(t);
      t = setTimeout(function () { size(); seed(); }, 200);
    });
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) { cancelAnimationFrame(raf); }
      else { frame(); }
    });
  }
})();
