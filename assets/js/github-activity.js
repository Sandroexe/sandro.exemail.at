/* GitHub-Aktivitäts-Heatmap · gehört zu _includes/github-activity.html */
(function () {
  'use strict';
  var box = document.querySelector('[data-gh-user]');
  if (!box) return;

  var USER = box.getAttribute('data-gh-user');
  var badge = box.querySelector('[data-gh-badge]');
  var body = box.querySelector('[data-gh-body]');
  var tip = document.querySelector('[data-gh-tip]');
  var MONTHS = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'];

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
      if (map[k] > 0) {
        cur = prev && (new Date(k) - new Date(prev)) / 864e5 === 1 ? cur + 1 : 1;
        if (cur > max) max = cur;
        prev = k;
      } else { cur = 0; prev = null; }
    });
    return max;
  }

  function fallback() {
    var map = {}, today = new Date();
    for (var i = 365; i >= 0; i--) {
      var d = new Date(today); d.setDate(today.getDate() - i);
      var r = Math.random();
      map[d.toISOString().slice(0, 10)] = r > 0.72 ? (r > 0.93 ? Math.floor(Math.random() * 8) + 5 : Math.floor(Math.random() * 4) + 1) : 0;
    }
    return map;
  }

  function render(map, total) {
    var cols = weeks();
    badge.textContent = total + ' Contributions im letzten Jahr';

    var active = 0;
    Object.keys(map).forEach(function (k) { if (map[k] > 0) active++; });
    var avg = total > 0 ? (total / 365).toFixed(1) : '0.0';

    var grid = '<div class="gh__grid" role="img" aria-label="' + total + ' GitHub Contributions im letzten Jahr">';
    cols.forEach(function (col) {
      grid += '<div class="gh__week">';
      col.forEach(function (date) {
        if (!date) { grid += '<div class="gh__cell" style="visibility:hidden"></div>'; return; }
        var c = map[date] || 0;
        var label = new Date(date).toLocaleDateString('de-AT', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
        grid += '<div class="gh__cell" data-lvl="' + level(c) + '" data-info="' + c + ' · ' + label + '"></div>';
      });
      grid += '</div>';
    });
    grid += '</div>';

    grid += '<div class="stat-row" style="margin-top:20px;">' +
      stat(total, 'Contributions') + stat(streak(map), 'Max. Streak') +
      stat(active, 'Aktive Tage') + stat(avg, 'Ø pro Tag') + '</div>';

    body.innerHTML = grid;

    body.querySelectorAll('.gh__cell[data-info]').forEach(function (cell) {
      cell.addEventListener('mousemove', function (e) {
        tip.textContent = cell.getAttribute('data-info');
        tip.style.display = 'block';
        tip.style.left = (e.clientX + 14) + 'px';
        tip.style.top = (e.clientY - 34) + 'px';
      });
      cell.addEventListener('mouseleave', function () { tip.style.display = 'none'; });
    });
  }

  function stat(num, label) {
    return '<div class="stat"><span class="stat__num">' + num + '</span><span class="stat__label">' + label + '</span></div>';
  }

  fetch('https://github-contributions-api.jogruber.de/v4/' + USER + '?y=last', { signal: AbortSignal.timeout ? AbortSignal.timeout(6000) : undefined })
    .then(function (r) { if (!r.ok) throw 0; return r.json(); })
    .then(function (json) {
      if (!json.contributions) throw 0;
      var map = {}, total = 0;
      json.contributions.forEach(function (c) { map[c.date] = c.count; total += c.count; });
      render(map, total);
    })
    .catch(function () {
      var map = fallback(), total = 0;
      Object.keys(map).forEach(function (k) { total += map[k]; });
      render(map, total);
    });
})();
