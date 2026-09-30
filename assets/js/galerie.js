/*
 * ═══════════════════════════════════════════════════════════════════════
 *  galerie.js – Großansicht (Lightbox) der Seite /galerie/
 *  Eigenbau ohne Bibliothek. Ohne JavaScript öffnet ein Klick einfach die
 *  große Bilddatei.
 *
 *  Bedienung: Pfeiltasten ← →, Escape, Klick neben das Foto, Wischen am
 *  Handy, Direktlink /galerie/#bild-<name> öffnet das Foto sofort.
 *  Filter (main.js) werden berücksichtigt: Blättern nur durch sichtbare Fotos.
 * ═══════════════════════════════════════════════════════════════════════
 */
(function () {
  "use strict";

  var dialog = document.querySelector("[data-lightbox]");
  if (!dialog || typeof dialog.showModal !== "function") return;

  var links = Array.prototype.slice.call(document.querySelectorAll("[data-lightbox-bild]"));
  if (!links.length) return;

  var img = dialog.querySelector("[data-lightbox-img]");
  var webp = dialog.querySelector("[data-lightbox-webp]");
  var buehne = dialog.querySelector("[data-lightbox-buehne]");
  var felder = {
    zaehler: dialog.querySelector("[data-lightbox-zaehler]"),
    titel: dialog.querySelector("[data-lightbox-titel]"),
    beschreibung: dialog.querySelector("[data-lightbox-beschreibung]"),
    meta: dialog.querySelector("[data-lightbox-meta]")
  };
  var btnZurueck = dialog.querySelector("[data-lightbox-zurueck]");
  var btnWeiter = dialog.querySelector("[data-lightbox-weiter]");
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  var aktuell = null;   // aktuell angezeigter Link
  var ausloeser = null; // Element, das den Fokus nach dem Schließen zurückbekommt

  function sichtbare() {
    return links.filter(function (a) {
      var eintrag = a.closest("[data-kategorie]");
      return !eintrag || !eintrag.hidden;
    });
  }

  function text(el, wert) {
    el.textContent = wert || "";
    el.hidden = !wert;
  }

  function vorladen(a) {
    if (!a) return;
    new Image().src = a.getAttribute("data-webp");
  }

  function zeigen(a) {
    var liste = sichtbare();
    var pos = liste.indexOf(a);
    if (pos === -1) return;
    aktuell = a;

    dialog.classList.remove("is-geladen");
    webp.srcset = a.getAttribute("data-webp");
    img.src = a.href;
    img.alt = a.getAttribute("data-alt") || "";
    img.width = Number(a.getAttribute("data-breite")) || 0;
    img.height = Number(a.getAttribute("data-hoehe")) || 0;
    // Dasselbe Foto erneut geöffnet: kein neues "load"-Ereignis
    if (img.complete && img.naturalWidth) dialog.classList.add("is-geladen");

    text(felder.zaehler, liste.length > 1 ? (pos + 1) + " / " + liste.length : "");
    text(felder.titel, a.getAttribute("data-titel"));
    text(felder.beschreibung, a.getAttribute("data-beschreibung"));
    var meta = a.getAttribute("data-meta") || "";
    var fotograf = a.getAttribute("data-fotograf");
    if (fotograf) meta += (meta ? " · " : "") + "Foto: " + fotograf;
    text(felder.meta, meta);

    btnZurueck.hidden = btnWeiter.hidden = liste.length < 2;
    vorladen(liste[(pos + 1) % liste.length]);
    vorladen(liste[(pos - 1 + liste.length) % liste.length]);
  }

  function blaettern(schritt) {
    var liste = sichtbare();
    if (liste.length < 2 || !aktuell) return;
    var pos = liste.indexOf(aktuell);
    zeigen(liste[(pos + schritt + liste.length) % liste.length]);
  }

  function oeffnen(a) {
    ausloeser = a;
    zeigen(a);
    dialog.showModal();
    document.documentElement.classList.add("lightbox-offen");
  }

  img.addEventListener("load", function () {
    dialog.classList.add("is-geladen");
  });

  links.forEach(function (a) {
    a.addEventListener("click", function (event) {
      // Neuer Tab (Strg/Cmd-Klick, Mittelklick) bleibt möglich
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
      event.preventDefault();
      oeffnen(a);
    });
  });

  btnZurueck.addEventListener("click", function () { blaettern(-1); });
  btnWeiter.addEventListener("click", function () { blaettern(1); });
  dialog.querySelector("[data-lightbox-zu]").addEventListener("click", function () { dialog.close(); });

  dialog.addEventListener("keydown", function (event) {
    if (event.key === "ArrowRight") { event.preventDefault(); blaettern(1); }
    if (event.key === "ArrowLeft") { event.preventDefault(); blaettern(-1); }
  });

  // Klick neben das Foto schließt. Das <img> füllt die ganze Bühne und zeigt
  // das Foto mit "object-fit: contain" – Ränder daneben zählen als "daneben".
  function aufFoto(event) {
    if (event.target !== img || !img.naturalWidth) return false;
    var r = img.getBoundingClientRect();
    var massstab = Math.min(r.width / img.naturalWidth, r.height / img.naturalHeight);
    var b = img.naturalWidth * massstab;
    var h = img.naturalHeight * massstab;
    var x = event.clientX - r.left - (r.width - b) / 2;
    var y = event.clientY - r.top - (r.height - h) / 2;
    return x >= 0 && x <= b && y >= 0 && y <= h;
  }

  dialog.addEventListener("click", function (event) {
    var t = event.target;
    if (t === dialog || t === buehne || t.classList.contains("lightbox__figur") || (t === img && !aufFoto(event))) {
      dialog.close();
    }
  });

  dialog.addEventListener("close", function () {
    document.documentElement.classList.remove("lightbox-offen");
    if (ausloeser) ausloeser.focus({ preventScroll: true });
  });

  // Wischgesten am Handy: links/rechts = blättern, nach unten = schließen
  var start = null;
  buehne.addEventListener("touchstart", function (event) {
    if (event.touches.length !== 1) { start = null; return; }
    start = { x: event.touches[0].clientX, y: event.touches[0].clientY };
  }, { passive: true });

  buehne.addEventListener("touchend", function (event) {
    if (!start) return;
    var dx = event.changedTouches[0].clientX - start.x;
    var dy = event.changedTouches[0].clientY - start.y;
    start = null;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
      blaettern(dx < 0 ? 1 : -1);
    } else if (dy > 90 && Math.abs(dy) > Math.abs(dx)) {
      dialog.close();
    }
  }, { passive: true });

  // Direktlink /galerie/#bild-<name> (z. B. von der Startseite)
  function ausAdresse() {
    var id = decodeURIComponent(window.location.hash.slice(1));
    var ziel = id ? document.getElementById(id) : null;
    if (ziel && ziel.hasAttribute("data-lightbox-bild")) {
      ziel.scrollIntoView({ block: "center", behavior: reducedMotion.matches ? "auto" : "smooth" });
      if (!dialog.open) oeffnen(ziel);
    }
  }
  window.addEventListener("hashchange", ausAdresse);
  ausAdresse();
})();
