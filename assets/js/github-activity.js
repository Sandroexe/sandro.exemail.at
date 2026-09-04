/* GitHub-Aktivitäts-Heatmap · _includes/github-activity.html · Tailwind · zweisprachig */
(function () {
  'use strict';
  var box = document.querySelector('[data-gh-user]');
  if (!box) return;

  var USER = box.getAttribute('data-gh-user');
  var badge = box.querySelector('[data-gh-badge]');
  var body = box.querySelector('[data-gh-body]');
  var tip = document.querySelector('[data-gh-tip]');

  var I18N = { de: {}, en: {} };
  try { I18N.de = JSON.parse(box.getAttribute('data-gh-i18n-de')); } catch (e) {}
  try { I18N.en = JSON.parse(box.getAttribute('data-gh-i18n-en')); } catch (e) {}
  function t() {
    var l = document.documentElement.getAttribute('data-lang') === 'en' ? 'en' : 'de';
    return I18N[l] || I18N.de;
  }

  var LVL = ['bg-slate-100 ring-1 ring-slate-200', 'bg-blue-200', 'bg-blue-400', 'bg-blue-600', 'bg-blue-800'];
  var LAST = null;

  function weeks() {
    var out = [], today = new Date();
    var start = new Date(today);
    start.setDate(today.getDate() - today.getDay() - 52 * 7);
    for (var w = 0; w <= 52; w++) {
      var col = [];
      for (var d = 0; d < 7; d++) {
        var dt = new Date(start);
        dt.setDate(start.getDate() + w * 7 + d);
        col.push(dt > today ? null : dt.toISOString().slice(0, 10));
      }
      out.push(col);
    }
    return out;
  }
  function level(c) { return c === 0 ? 0 : c <= 2 ? 1 : c <= 5 ? 2 : c <= 9 ? 3 : 4; }
  function streak(map) {
    var keys = Object.keys(map).sort(), max = 0, cur = 0, prev = null;
    keys.forEach(function (k) {
      if (map[k] > 0) { cur = prev && (new Date(k) - new Date(prev)) / 864e5 === 1 ? cur + 1 : 1; if (cur > max) max = cur; prev = k; }
      else { cur = 0; prev = null; }
    });
    return max;
  }
  function fallback() {
    var map = {}, today = new Date();
    for (var i = 365; i >= 0; i--) {
      var dd = new Date(today); dd.setDate(today.getDate() - i);
      var r = Math.random();
      map[dd.toISOString().slice(0, 10)] = r > 0.72 ? (r > 0.93 ? Math.floor(Math.random() * 8) + 5 : Math.floor(Math.random() * 4) + 1) : 0;
    }
    return map;
  }
  function stat(num, label) {
    return '<div class="flex-1 min-w-[110px] rounded-xl border border-slate-200 bg-white p-4 text-center shadow-sm">' +
      '<span class="block font-mono text-2xl font-bold leading-none text-blue-600">' + num + '</span>' +
      '<span class="mt-1 block text-xs text-slate-400">' + label + '</span></div>';
  }

  function render() {
    if (!LAST) return;
    var map = LAST.map, total = LAST.total, s = t();
    badge.textContent = total + ' ' + s.badge;

    var active = 0;
    Object.keys(map).forEach(function (k) { if (map[k] > 0) active++; });
    var avg = total > 0 ? (total / 365).toFixed(1) : '0.0';

    var html = '<div class="flex gap-[3px] overflow-x-auto pb-1" role="img" aria-label="' + total + ' GitHub Contributions">';
    weeks().forEach(function (col) {
      html += '<div class="flex flex-1 shrink-0 basis-[10px] flex-col gap-[3px]">';
      col.forEach(function (date) {
        if (!date) { html += '<div class="aspect-square w-full rounded-[3px] invisible"></div>'; return; }
        var c = map[date] || 0;
        var label = new Date(date).toLocaleDateString(s.locale, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
        html += '<div class="aspect-square w-full rounded-[3px] transition-transform hover:scale-150 ' + LVL[level(c)] +
          '" data-info="' + c + ' · ' + label + '"></div>';
      });
      html += '</div>';
    });
    html += '</div>';

    html += '<div class="mt-5 flex flex-wrap gap-3.5">' +
      stat(total, s.contributions) + stat(streak(map), s.streak) +
      stat(active, s.days) + stat(avg, s.avg) + '</div>';

    body.innerHTML = html;

    body.querySelectorAll('[data-info]').forEach(function (cell) {
      cell.addEventListener('mousemove', function (ev) {
        tip.textContent = cell.getAttribute('data-info');
        tip.classList.remove('hidden');
        tip.style.left = (ev.clientX + 14) + 'px';
        tip.style.top = (ev.clientY - 34) + 'px';
      });
      cell.addEventListener('mouseleave', function () { tip.classList.add('hidden'); });
    });
  }

  window.addEventListener('langchange', render);

  fetch('https://github-contributions-api.jogruber.de/v4/' + USER + '?y=last', { signal: AbortSignal.timeout ? AbortSignal.timeout(6000) : undefined })
    .then(function (r) { if (!r.ok) throw 0; return r.json(); })
    .then(function (json) {
      if (!json.contributions) throw 0;
      var map = {}, total = 0;
      json.contributions.forEach(function (c) { map[c.date] = c.count; total += c.count; });
      LAST = { map: map, total: total };
      render();
    })
    .catch(function () {
      var map = fallback(), total = 0;
      Object.keys(map).forEach(function (k) { total += map[k]; });
      LAST = { map: map, total: total };
      render();
    });
})();
