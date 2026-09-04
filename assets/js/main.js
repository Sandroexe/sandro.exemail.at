/* ══════════════════════════════════════════════════════════════════════════
   sandro.exemail.at · GLOBALES SKRIPT  (Tailwind-Setup)
   Mobile-Nav, Sprache (DE/EN), Scroll-Reveal, Skill-Bars, Typewriter, To-Top.
   Alles defensiv – jede Seite bindet nur, was existiert.
   ══════════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var root = document.documentElement;

  /* ── MOBILE NAV ──────────────────────────────────────────────────────── */
  var toggle = document.getElementById('navToggle');
  var menu = document.getElementById('navMenu');
  if (toggle && menu) {
    var setMenu = function (open) {
      menu.classList.toggle('hidden', !open);
      menu.classList.toggle('flex', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    };
    toggle.addEventListener('click', function () {
      setMenu(menu.classList.contains('hidden'));
    });
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { if (window.innerWidth < 768) setMenu(false); });
    });
  }

  /* ── ACTIVE NAV (Fallback) ───────────────────────────────────────────── */
  if (!document.querySelector('.nav__link[aria-current="page"]')) {
    var seg = window.location.pathname.replace(/\/$/, '').split('/').pop() || 'index';
    seg = seg.replace(/\.html$/, '') || 'index';
    var map = { '': 'home', 'index': 'home', 'projects': 'projects', 'certificates': 'certificates', 'lab': 'lab', 'links': 'links', 'contact': 'contact' };
    var link = document.querySelector('.nav__link[data-nav="' + map[seg] + '"]');
    if (link) {
      link.classList.remove('text-slate-500', 'hover:bg-slate-100', 'hover:text-slate-900');
      link.classList.add('text-blue-600', 'bg-blue-50');
      link.setAttribute('aria-current', 'page');
    }
  }

  /* ── SPRACHE (DE / EN) ───────────────────────────────────────────────── */
  var LANG_KEY = 'preferred_language';
  var langBtn = document.getElementById('langSwitch');

  var lang = root.getAttribute('data-lang');
  if (lang !== 'de' && lang !== 'en') { try { lang = localStorage.getItem(LANG_KEY); } catch (e) {} }
  if (lang !== 'de' && lang !== 'en') { lang = (navigator.language || 'en').toLowerCase().indexOf('de') === 0 ? 'de' : 'en'; }

  function applyLang(l, persist) {
    lang = l;
    if (persist) { try { localStorage.setItem(LANG_KEY, l); } catch (e) {} }
    root.lang = l;
    root.setAttribute('data-lang', l);

    document.querySelectorAll('[data-lang-opt]').forEach(function (s) {
      var on = s.getAttribute('data-lang-opt') === l;
      s.classList.toggle('bg-blue-600', on);
      s.classList.toggle('text-white', on);
      s.classList.toggle('text-slate-500', !on);
    });

    document.querySelectorAll('[data-de]').forEach(function (el) {
      var val = l === 'en' ? (el.getAttribute('data-en') || el.getAttribute('data-de')) : el.getAttribute('data-de');
      if (val == null) return;
      var tag = el.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') el.placeholder = val;
      else if (tag === 'IMG') el.alt = val;
      else el.innerHTML = val;
    });

    window.dispatchEvent(new CustomEvent('langchange', { detail: l }));
  }

  window.siteLang = function () { return lang; };
  window.setSiteLang = function (l) { if (l === 'de' || l === 'en') applyLang(l, true); };
  if (langBtn) langBtn.addEventListener('click', function () { applyLang(lang === 'de' ? 'en' : 'de', true); });
  applyLang(lang, false);

  /* ── SCROLL REVEAL ───────────────────────────────────────────────────── */
  var reveal = document.querySelectorAll('.reveal');
  if (reveal.length) {
    if ('IntersectionObserver' in window && !reduceMotion) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
      }, { rootMargin: '0px 0px -8% 0px' });
      reveal.forEach(function (el) { io.observe(el); });
    } else {
      reveal.forEach(function (el) { el.classList.add('is-in'); });
    }
  }

  /* ── SKILL BARS ──────────────────────────────────────────────────────── */
  var bars = document.querySelectorAll('[data-value]');
  if (bars.length) {
    var fill = function () { bars.forEach(function (b) { b.style.width = b.getAttribute('data-value'); }); };
    if ('IntersectionObserver' in window) {
      var bio = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { if (e.isIntersecting) { fill(); bio.disconnect(); } });
      }, { threshold: 0.25 });
      bio.observe(bars[0]);
    } else { fill(); }
  }

  /* ── TYPEWRITER (Hero) ───────────────────────────────────────────────── */
  var tw = document.querySelector('[data-typewriter-de]');
  if (tw) {
    var twTimer = null;
    var twWords = function () {
      var raw = (lang === 'en' && tw.getAttribute('data-typewriter-en')) || tw.getAttribute('data-typewriter-de');
      try { return JSON.parse(raw); } catch (e) { return []; }
    };
    var twStart = function () {
      clearTimeout(twTimer);
      var words = twWords();
      if (!words.length) return;
      if (reduceMotion) { tw.textContent = words[0]; return; }
      var wi = 0, ci = 0, del = false;
      (function step() {
        var w = words[wi];
        tw.textContent = del ? w.slice(0, ci - 1) : w.slice(0, ci + 1);
        del ? ci-- : ci++;
        var dl = del ? 45 : 95;
        if (!del && ci === w.length) { dl = 2000; del = true; }
        else if (del && ci === 0) { del = false; wi = (wi + 1) % words.length; dl = 400; }
        twTimer = setTimeout(step, dl);
      })();
    };
    twStart();
    window.addEventListener('langchange', twStart);
  }

  /* ── TO-TOP ──────────────────────────────────────────────────────────── */
  var toTop = document.getElementById('toTop');
  if (toTop) {
    toTop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }); });
    window.addEventListener('scroll', function () {
      var show = window.scrollY > 400;
      toTop.classList.toggle('opacity-0', !show);
      toTop.classList.toggle('translate-y-2', !show);
      toTop.classList.toggle('pointer-events-none', !show);
    }, { passive: true });
  }
})();
