/* ═══════════════════════════════════════════════════════════════════
   site.js — läuft auf jeder Seite.

   Grundsatz: die Seite funktioniert ohne dieses Skript vollständig.
   Alles hier ist Verbesserung, nicht Voraussetzung. Deshalb wird es
   auch mit defer geladen und fasst nie Inhalte an, nur Zustände.
   ═══════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var root = document.documentElement;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function store(key, value) {
    try { localStorage.setItem(key, value); } catch (e) { /* Privatmodus: egal */ }
  }
  function read(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  }

  /* ── Farbschema ──────────────────────────────────────────────
     Der erste Klick springt bewusst auf das Gegenteil dessen, was
     man gerade sieht — nicht auf einen gespeicherten Wert. */
  var themeBtn = document.getElementById('theme-toggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var explicit = root.getAttribute('data-theme');
      var current = explicit || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      var next = current === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      store('theme', next);
      themeBtn.setAttribute('aria-pressed', String(next === 'dark'));
    });
  }

  /* ── Sprache ─────────────────────────────────────────────────
     Sichtbarer Text liegt doppelt im HTML und wird per CSS
     umgeschaltet. Nur Attribute (aria-label, alt, title) müssen
     hier nachgezogen werden — dafür der Katalog. */
  var langBtn = document.getElementById('lang-toggle');
  var langLabel = document.getElementById('lang-label');
  var catalogue = null;

  function applyAttrs(lang) {
    if (!catalogue || !catalogue[lang]) return;
    document.querySelectorAll('[data-i18n-attr]').forEach(function (el) {
      el.getAttribute('data-i18n-attr').split(',').forEach(function (pair) {
        var bits = pair.split(':');
        if (bits.length !== 2) return;
        var attr = bits[0].trim();
        var path = bits[1].trim().split('.');
        var val = catalogue[lang];
        for (var i = 0; i < path.length && val; i++) val = val[path[i]];
        if (typeof val === 'string') el.setAttribute(attr, val);
      });
    });
  }

  function setLang(lang) {
    root.setAttribute('data-lang', lang);
    root.setAttribute('lang', lang);
    if (langLabel) langLabel.textContent = lang === 'en' ? 'EN' : 'DE';
    store('lang', lang);

    if (catalogue) { applyAttrs(lang); return; }
    fetch('/assets/js/i18n.json')
      .then(function (r) { return r.json(); })
      .then(function (data) { catalogue = data; applyAttrs(lang); })
      .catch(function () { /* Attribute bleiben deutsch — kein Beinbruch */ });
  }

  if (langBtn) {
    if (langLabel) langLabel.textContent = root.getAttribute('data-lang') === 'en' ? 'EN' : 'DE';
    if (root.getAttribute('data-lang') === 'en') setLang('en');
    langBtn.addEventListener('click', function () {
      setLang(root.getAttribute('data-lang') === 'en' ? 'de' : 'en');
    });
  }

  /* ── Navigation auf schmalen Schirmen ────────────────────────── */
  var navBtn = document.querySelector('.navtoggle');
  var nav = document.getElementById('mainnav');
  if (navBtn && nav) {
    navBtn.addEventListener('click', function () {
      var open = navBtn.getAttribute('aria-expanded') === 'true';
      navBtn.setAttribute('aria-expanded', String(!open));
      nav.setAttribute('data-open', String(!open));
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        navBtn.setAttribute('aria-expanded', 'false');
        nav.setAttribute('data-open', 'false');
      }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navBtn.getAttribute('aria-expanded') === 'true') {
        navBtn.setAttribute('aria-expanded', 'false');
        nav.setAttribute('data-open', 'false');
        navBtn.focus();
      }
    });
  }

  /* ── Scroll-Reveal ───────────────────────────────────────────
     Bei prefers-reduced-motion gar nicht erst starten: die
     Elemente sind dann per CSS ohnehin sichtbar. */
  if (!reduced && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    document.querySelectorAll('.reveal, .skill').forEach(function (el) { io.observe(el); });
  } else {
    document.querySelectorAll('.reveal, .skill').forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ── Nach-oben-Knopf ─────────────────────────────────────────── */
  var toTop = document.querySelector('.totop');
  if (toTop) {
    var onScroll = function () {
      toTop.classList.toggle('is-visible', window.scrollY > window.innerHeight * 0.8);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── Relative Zeitangaben ────────────────────────────────────
     Im HTML steht ein absolutes Datum (funktioniert ohne JS),
     hier wird daraus "vor 3 Tagen". */
  var rtf = window.Intl && Intl.RelativeTimeFormat
    ? new Intl.RelativeTimeFormat(root.getAttribute('data-lang') || 'de', { numeric: 'auto' })
    : null;
  if (rtf) {
    var units = [['year', 31536e6], ['month', 2592e6], ['week', 6048e5 * 1], ['day', 864e5], ['hour', 36e5]];
    document.querySelectorAll('[data-reltime]').forEach(function (el) {
      var then = new Date(el.getAttribute('data-reltime')).getTime();
      if (isNaN(then)) return;
      var diff = then - Date.now();
      for (var i = 0; i < units.length; i++) {
        var abs = Math.abs(diff);
        if (abs >= units[i][1] || i === units.length - 1) {
          el.textContent = rtf.format(Math.round(diff / units[i][1]), units[i][0]);
          break;
        }
      }
    });
  }

  /* ── Link kopieren (Social-Impressum) ────────────────────────── */
  document.querySelectorAll('[data-copy]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var text = btn.getAttribute('data-copy');
      var done = function () {
        var label = btn.querySelector('[data-copy-label]');
        if (!label) return;
        label.setAttribute('data-copied', 'true');
        setTimeout(function () { label.removeAttribute('data-copied'); }, 2000);
      };
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(done).catch(function () {});
      }
    });
  });

  /* ── Drucken ─────────────────────────────────────────────────
     Ohne JS bleibt Strg+P der Weg — der Knopf ist nur bequemer. */
  document.querySelectorAll('[data-print]').forEach(function (btn) {
    btn.addEventListener('click', function (e) { e.preventDefault(); window.print(); });
  });

})();
