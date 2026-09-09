---
# Die Stationen kommen aus cv.yml — das Easter Egg erzählt damit
# denselben Lebenslauf wie /cv/, nur als Netzwerkroute.
layout: null
---
{%- assign S = site.data.site -%}
{%- assign P = site.data.profile -%}
/* ═══════════════════════════════════════════════════════════════════
   egg.js — traceroute durch den Lebenslauf.

   Auslöser: irgendwo "mtr" tippen, oder fünfmal auf den Knoten im
   Hero-Netzdiagramm klicken. Danach läuft ein simulierter traceroute,
   dessen Hops die Stationen aus cv.yml sind — von der Volksschule bis
   heute, mit plausibel schwankenden Laufzeiten.

   Zentral abschaltbar über features.easter_egg in _data/site.yml:
   steht der Schalter auf false, wird diese Datei gar nicht erst
   eingebunden.
   ═══════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  {%- comment -%} Hops in chronologischer Reihenfolge: Ausbildung rückwärts, dann Beruf. {%- endcomment -%}
  var HOPS = [
    {%- assign edu = site.data.cv.education | sort: "start" -%}
    {%- for e in edu %}
    { host: {{ e.org | slugify | append: ".edu.local" | jsonify }}, name: {{ e.org | jsonify }}, note: {{ e.title | jsonify }} },
    {%- endfor %}
    {%- assign exp = site.data.cv.experience | sort: "start" -%}
    {%- for e in exp %}
    { host: {{ e.org | slugify | append: ".at" | jsonify }}, name: {{ e.org | jsonify }}, note: {{ e.title | jsonify }} },
    {%- endfor %}
    { host: {{ S.domain | jsonify }}, name: {{ P.name | jsonify }}, note: {{ P.role | jsonify }} }
  ];

  var TITLE = {{ site.data.i18n.de.egg.title | jsonify }};
  var DONE  = {{ site.data.i18n.de.egg.done | jsonify }};
  var CLOSE = {{ site.data.i18n.de.egg.close | jsonify }};

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var box = null;
  var running = false;

  function build() {
    box = document.createElement('aside');
    box.className = 'egg';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-label', TITLE);
    box.innerHTML =
      '<div class="egg__head">' +
        '<span>$ traceroute ' + HOPS[HOPS.length - 1].host + '</span>' +
        '<button class="egg__close" type="button">' + CLOSE + '</button>' +
      '</div><pre class="egg__out" aria-live="polite"></pre>';
    document.body.appendChild(box);
    box.querySelector('.egg__close').addEventListener('click', close);
    document.addEventListener('keydown', onEsc);
    return box;
  }

  function onEsc(e) { if (e.key === 'Escape') close(); }

  function close() {
    if (!box) return;
    box.remove();
    box = null;
    running = false;
    document.removeEventListener('keydown', onEsc);
  }

  function pad(n, w) {
    var s = String(n);
    while (s.length < w) s = ' ' + s;
    return s;
  }

  function run() {
    if (running) return;
    running = true;
    if (!box) build();
    var out = box.querySelector('.egg__out');
    out.textContent = '';

    var i = 0;
    /* Die Laufzeiten steigen mit der Entfernung, wackeln aber —
       sonst sieht es aus wie eine Tabelle, nicht wie ein Netz. */
    function step() {
      if (!box) return;
      var hop = HOPS[i];
      var base = 2 + i * 3.5;
      var times = [0, 1, 2].map(function () {
        return (base + Math.random() * 4).toFixed(3);
      });
      var line = document.createElement('span');
      line.className = 'egg__hop';
      line.innerHTML = pad(i + 1, 2) + '  <b>' + hop.name + '</b> (' + hop.host + ')  ' +
        times.join(' ms  ') + ' ms\n     ' + hop.note + '\n';
      out.appendChild(line);
      out.scrollTop = out.scrollHeight;

      i++;
      if (i < HOPS.length) {
        setTimeout(step, reduced ? 0 : 260 + Math.random() * 220);
      } else {
        var end = document.createElement('span');
        end.textContent = '\n' + DONE + '\n';
        out.appendChild(end);
        running = false;
      }
    }
    step();
  }

  /* Auslöser 1: "mtr" tippen — aber nicht, während jemand ein
     Formularfeld ausfüllt. */
  var typed = '';
  document.addEventListener('keydown', function (e) {
    var tag = (e.target.tagName || '').toLowerCase();
    if (tag === 'input' || tag === 'textarea' || e.target.isContentEditable) return;
    if (e.key.length !== 1) return;
    typed = (typed + e.key.toLowerCase()).slice(-3);
    if (typed === 'mtr') { typed = ''; run(); }
  });

  /* Auslöser 2: fünfmal auf einen Knoten im Hero-Netzdiagramm. */
  var clicks = 0, timer = null;
  document.querySelectorAll('.netdiagram .node').forEach(function (node) {
    node.style.cursor = 'pointer';
    node.addEventListener('click', function () {
      clicks++;
      clearTimeout(timer);
      timer = setTimeout(function () { clicks = 0; }, 1200);
      if (clicks >= 5) { clicks = 0; run(); }
    });
  });
})();
