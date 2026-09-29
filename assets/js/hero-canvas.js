/*
 * ═══════════════════════════════════════════════════════════════════════
 *  hero-canvas.js – dezenter animierter Hintergrund der Startseite
 *
 *  Zeichnet ein Leiterbahn-Motiv (wie auf einer Platine), auf dem kleine
 *  "Signale" entlanglaufen. Farben, Dichte und Tempo kommen aus
 *  _sass/_theme.scss (CSS-Variablen --c-primary, --bg-density usw.).
 *
 *  Performance:
 *   - Leiterbahnen werden nur einmal gezeichnet (Zwischenspeicher-Canvas)
 *   - Animation pausiert, wenn der Bereich nicht sichtbar oder der Tab
 *     im Hintergrund ist
 *   - Bei "Bewegung reduzieren" wird nur ein statisches Bild gezeigt
 * ═══════════════════════════════════════════════════════════════════════
 */
(function () {
  "use strict";

  var canvas = document.querySelector("[data-hero-canvas]");
  if (!canvas || !canvas.getContext) return;

  var root = document.documentElement;

  function cssNumber(name, fallback) {
    var value = parseFloat(getComputedStyle(root).getPropertyValue(name));
    return isNaN(value) ? fallback : value;
  }

  // In _theme.scss ausgeschaltet?
  if (cssNumber("--bg-anim", 1) === 0) {
    canvas.remove();
    return;
  }

  var density = Math.max(0.1, cssNumber("--bg-density", 1));
  var speed = Math.max(0.1, cssNumber("--bg-speed", 1));
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var darkScheme = window.matchMedia("(prefers-color-scheme: dark)");

  var ctx = canvas.getContext("2d");
  var layer = document.createElement("canvas");
  var layerCtx = layer.getContext("2d");

  var GRID = 28;
  // 8 Richtungen: waagrecht, senkrecht und diagonal (45°)
  var DIRECTIONS = [[1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1]];

  var width = 0;
  var height = 0;
  var dpr = 1;
  var traces = [];
  var pulses = [];
  var colors = { primary: "#0e7490", accent: "#0d9488" };
  var inView = true;
  var frameId = 0;
  var lastTime = 0;

  function random(min, max) {
    return min + Math.random() * (max - min);
  }

  function randomInt(min, max) {
    return Math.floor(random(min, max + 1));
  }

  function readColors() {
    var styles = getComputedStyle(root);
    colors.primary = styles.getPropertyValue("--c-primary").trim() || colors.primary;
    colors.accent = styles.getPropertyValue("--c-accent").trim() || colors.primary;
  }

  // Eine Leiterbahn: abwechselnd gerade und diagonale Abschnitte
  function createTrace() {
    var x = randomInt(0, Math.ceil(width / GRID)) * GRID;
    var y = randomInt(0, Math.ceil(height / GRID)) * GRID;
    var dir = randomInt(0, 3) * 2;
    var points = [[x, y]];
    var segments = randomInt(2, 4);

    for (var i = 0; i < segments; i++) {
      var steps = i % 2 === 0 ? randomInt(2, 6) : randomInt(1, 3);
      x += DIRECTIONS[dir][0] * steps * GRID;
      y += DIRECTIONS[dir][1] * steps * GRID;
      points.push([x, y]);
      dir = (dir + (Math.random() < 0.5 ? 1 : 7)) % 8;
    }

    var length = 0;
    var lengths = [0];
    for (var j = 1; j < points.length; j++) {
      length += Math.hypot(points[j][0] - points[j - 1][0], points[j][1] - points[j - 1][1]);
      lengths.push(length);
    }
    return { points: points, lengths: lengths, length: length };
  }

  function createPulse(initial) {
    return {
      trace: traces[randomInt(0, traces.length - 1)],
      distance: 0,
      velocity: random(40, 90) * speed,
      wait: initial ? random(0, 4) : random(0.5, 3)
    };
  }

  function pointAt(trace, distance) {
    for (var i = 1; i < trace.points.length; i++) {
      if (distance <= trace.lengths[i]) {
        var a = trace.points[i - 1];
        var b = trace.points[i];
        var segment = trace.lengths[i] - trace.lengths[i - 1] || 1;
        var t = (distance - trace.lengths[i - 1]) / segment;
        return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
      }
    }
    return trace.points[trace.points.length - 1];
  }

  // Leiterbahnen einmalig in den Zwischenspeicher zeichnen
  function drawLayer() {
    layer.width = width * dpr;
    layer.height = height * dpr;
    layerCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    layerCtx.clearRect(0, 0, width, height);
    layerCtx.lineWidth = 1.25;
    layerCtx.lineJoin = "round";
    layerCtx.lineCap = "round";

    traces.forEach(function (trace) {
      var start = trace.points[0];
      var end = trace.points[trace.points.length - 1];

      layerCtx.globalAlpha = 0.16;
      layerCtx.strokeStyle = colors.primary;
      layerCtx.beginPath();
      layerCtx.moveTo(start[0], start[1]);
      for (var i = 1; i < trace.points.length; i++) {
        layerCtx.lineTo(trace.points[i][0], trace.points[i][1]);
      }
      layerCtx.stroke();

      // Durchkontaktierung am Anfang, Lötpad am Ende
      layerCtx.globalAlpha = 0.3;
      layerCtx.beginPath();
      layerCtx.arc(start[0], start[1], 3, 0, Math.PI * 2);
      layerCtx.stroke();

      layerCtx.fillStyle = colors.accent;
      layerCtx.beginPath();
      layerCtx.arc(end[0], end[1], 2.5, 0, Math.PI * 2);
      layerCtx.fill();
    });
    layerCtx.globalAlpha = 1;
  }

  function drawFrame() {
    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(layer, 0, 0, width, height);

    pulses.forEach(function (pulse) {
      if (pulse.wait > 0) return;
      // Kurzer Schweif hinter dem Signal
      for (var k = 3; k >= 0; k--) {
        var p = pointAt(pulse.trace, Math.max(0, pulse.distance - k * 6));
        ctx.globalAlpha = k === 0 ? 0.9 : 0.35 - k * 0.08;
        ctx.fillStyle = k === 0 ? colors.primary : colors.accent;
        ctx.beginPath();
        ctx.arc(p[0], p[1], k === 0 ? 2.2 : 1.8, 0, Math.PI * 2);
        ctx.fill();
      }
      var head = pointAt(pulse.trace, pulse.distance);
      ctx.globalAlpha = 0.14;
      ctx.fillStyle = colors.primary;
      ctx.beginPath();
      ctx.arc(head[0], head[1], 7, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
  }

  function update(seconds) {
    pulses.forEach(function (pulse, index) {
      if (pulse.wait > 0) {
        pulse.wait -= seconds;
        return;
      }
      pulse.distance += pulse.velocity * seconds;
      if (pulse.distance > pulse.trace.length) {
        pulses[index] = createPulse(false);
      }
    });
  }

  function loop(time) {
    var seconds = Math.min((time - lastTime) / 1000, 0.05);
    lastTime = time;
    update(seconds);
    drawFrame();
    frameId = window.requestAnimationFrame(loop);
  }

  function start() {
    if (frameId || reducedMotion.matches || !inView || document.hidden) return;
    lastTime = performance.now();
    frameId = window.requestAnimationFrame(loop);
  }

  function stop() {
    if (frameId) window.cancelAnimationFrame(frameId);
    frameId = 0;
  }

  function build() {
    var rect = canvas.getBoundingClientRect();
    width = Math.max(1, Math.round(rect.width));
    height = Math.max(1, Math.round(rect.height));
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    var traceCount = Math.round(Math.min(90, Math.max(12, (width * height) / 26000)) * density);
    traces = [];
    for (var i = 0; i < traceCount; i++) traces.push(createTrace());

    pulses = [];
    var pulseCount = Math.max(4, Math.round(traceCount * 0.3));
    for (var j = 0; j < pulseCount; j++) pulses.push(createPulse(true));

    readColors();
    drawLayer();
    drawFrame();
  }

  // Größenänderung (entprellt)
  var resizeTimer = 0;
  new ResizeObserver(function () {
    var rect = canvas.getBoundingClientRect();
    if (Math.round(rect.width) === width && Math.round(rect.height) === height) return;
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(build, 150);
  }).observe(canvas);

  // Nur animieren, wenn sichtbar
  new IntersectionObserver(function (entries) {
    inView = entries[0].isIntersecting;
    if (inView) start(); else stop();
  }).observe(canvas);

  document.addEventListener("visibilitychange", function () {
    if (document.hidden) stop(); else start();
  });

  reducedMotion.addEventListener("change", function () {
    if (reducedMotion.matches) {
      stop();
      drawFrame();
    } else {
      start();
    }
  });

  // Farben bei Wechsel Hell/Dunkel neu einlesen
  function refreshColors() {
    readColors();
    drawLayer();
    drawFrame();
  }
  new MutationObserver(refreshColors).observe(root, { attributes: true, attributeFilter: ["data-theme"] });
  darkScheme.addEventListener("change", refreshColors);

  build();
  start();
})();
