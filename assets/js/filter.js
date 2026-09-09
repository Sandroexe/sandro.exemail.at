/* ═══════════════════════════════════════════════════════════════════
   filter.js — Suche, Sprachfilter und Sortierung auf /projects/.

   Ohne JavaScript ist die Filterleiste ausgeblendet und alle
   Projekte stehen vollständig und sortiert auf der Seite. Dieses
   Skript blendet die Leiste erst ein und macht sie dann nutzbar.
   ═══════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var grid = document.getElementById('project-grid');
  var bar = document.getElementById('filterbar');
  if (!grid || !bar) return;

  bar.hidden = false;

  var search = document.getElementById('filter-search');
  var langSel = document.getElementById('filter-lang');
  var sortSel = document.getElementById('filter-sort');
  var reset = document.getElementById('filter-reset');
  var empty = document.getElementById('project-empty');
  var cards = Array.prototype.slice.call(grid.querySelectorAll('.pcard'));

  /* Die Sprachliste ergibt sich aus den vorhandenen Karten — so
     taucht eine neue Sprache automatisch auf, sobald ein Repo sie
     mitbringt. */
  if (langSel) {
    var langs = {};
    cards.forEach(function (c) {
      var l = c.getAttribute('data-lang');
      if (l) langs[l] = true;
    });
    Object.keys(langs).sort().forEach(function (l) {
      var opt = document.createElement('option');
      opt.value = l;
      opt.textContent = l.charAt(0).toUpperCase() + l.slice(1);
      langSel.appendChild(opt);
    });
  }

  function apply() {
    var q = (search && search.value || '').trim().toLowerCase();
    var lang = langSel && langSel.value || '';
    var shown = 0;

    cards.forEach(function (card) {
      var okText = !q || (card.getAttribute('data-search') || '').indexOf(q) !== -1;
      var okLang = !lang || card.getAttribute('data-lang') === lang;
      var visible = okText && okLang;
      card.hidden = !visible;
      if (visible) shown++;
    });

    if (empty) empty.hidden = shown !== 0;
  }

  function sort() {
    var mode = sortSel && sortSel.value || 'pushed';
    var sorted = cards.slice().sort(function (a, b) {
      if (mode === 'stars') {
        return (+b.getAttribute('data-stars')) - (+a.getAttribute('data-stars'));
      }
      if (mode === 'name') {
        return a.getAttribute('data-name').localeCompare(b.getAttribute('data-name'));
      }
      /* pushed: eigene Projekte ohne Datum bleiben vorne stehen. */
      var da = a.getAttribute('data-pushed') || '9999';
      var db = b.getAttribute('data-pushed') || '9999';
      return db.localeCompare(da);
    });
    sorted.forEach(function (c) { grid.appendChild(c); });
  }

  if (search) search.addEventListener('input', apply);
  if (langSel) langSel.addEventListener('change', apply);
  if (sortSel) sortSel.addEventListener('change', sort);
  if (reset) reset.addEventListener('click', function () {
    if (search) search.value = '';
    if (langSel) langSel.value = '';
    apply();
    if (search) search.focus();
  });
})();
