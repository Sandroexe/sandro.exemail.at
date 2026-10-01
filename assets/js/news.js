/*
 * ═══════════════════════════════════════════════════════════════════════
 *  news.js – Seite /news/ und eigene Beiträge
 *
 *  1. Filter (Alle / Eigene Beiträge / Presse / Kategorien) + Seitennummern
 *     Ohne JavaScript sind einfach alle News untereinander sichtbar.
 *  2. Teilen: "Link kopieren" und "Teilen …" (Web Share API am Handy)
 * ═══════════════════════════════════════════════════════════════════════
 */
(function () {
  "use strict";

  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* ─── 1. Filter & Seitennummern ───────────────────────────────────── */

  function initListe() {
    var liste = document.querySelector("[data-news-liste]");
    if (!liste) return;

    var eintraege = Array.prototype.slice.call(liste.querySelectorAll("[data-news-typ]"));
    var buttons = Array.prototype.slice.call(document.querySelectorAll("[data-news-filter]"));
    var nav = document.querySelector("[data-news-seiten]");
    var status = document.querySelector("[data-news-status]");
    var leer = document.querySelector("[data-news-leer]");
    var proSeite = Math.max(1, parseInt(liste.getAttribute("data-pro-seite"), 10) || 9);
    var filter = { wert: "alle", art: "" };
    var seite = 1;

    function passt(el) {
      if (filter.wert === "alle") return true;
      var attr = filter.art === "kategorie" ? "data-news-kategorie" : "data-news-typ";
      return el.getAttribute(attr) === filter.wert;
    }

    function zeichnen(scrollen) {
      var treffer = eintraege.filter(passt);
      var seiten = Math.max(1, Math.ceil(treffer.length / proSeite));
      seite = Math.min(seite, seiten);
      var von = (seite - 1) * proSeite;

      eintraege.forEach(function (el) { el.hidden = true; });
      treffer.slice(von, von + proSeite).forEach(function (el) {
        el.hidden = false;
        el.classList.add("is-visible");
      });

      if (leer) leer.hidden = treffer.length > 0;
      if (status) {
        status.textContent = treffer.length + (treffer.length === 1 ? " Eintrag" : " Einträge") +
          (seiten > 1 ? ", Seite " + seite + " von " + seiten : "");
      }

      if (nav) {
        nav.hidden = seiten < 2;
        nav.textContent = "";
        if (seiten > 1) {
          var ul = document.createElement("ul");
          ul.className = "pagination__liste";
          for (var i = 1; i <= seiten; i += 1) {
            var li = document.createElement("li");
            var btn = document.createElement("button");
            btn.type = "button";
            btn.className = "pagination__btn";
            btn.textContent = String(i);
            btn.setAttribute("aria-label", "Seite " + i);
            if (i === seite) btn.setAttribute("aria-current", "page");
            btn.addEventListener("click", (function (nr) {
              return function () { seite = nr; zeichnen(true); };
            })(i));
            li.appendChild(btn);
            ul.appendChild(li);
          }
          nav.appendChild(ul);
        }
      }

      if (scrollen) {
        liste.scrollIntoView({ behavior: reducedMotion.matches ? "auto" : "smooth", block: "start" });
      }
    }

    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        filter = { wert: btn.getAttribute("data-news-filter"), art: btn.getAttribute("data-news-filter-art") || "" };
        seite = 1;
        buttons.forEach(function (b) { b.setAttribute("aria-pressed", String(b === btn)); });
        zeichnen(false);
      });
    });

    // Direktlink auf einen Eintrag (/news/#presse-…): passende Seite zeigen
    var ziel = window.location.hash ? document.getElementById(decodeURIComponent(window.location.hash.slice(1))) : null;
    if (ziel && ziel.closest("[data-news-typ]")) {
      var pos = eintraege.indexOf(ziel.closest("[data-news-typ]"));
      seite = Math.floor(pos / proSeite) + 1;
      zeichnen(false);
      ziel.classList.add("is-hervorgehoben");
      ziel.scrollIntoView({ block: "center" });
    } else {
      zeichnen(false);
    }
  }

  /* ─── 2. Teilen ───────────────────────────────────────────────────── */

  function initTeilen() {
    var nativ = document.querySelector("[data-teilen-nativ]");
    if (nativ && navigator.share) {
      nativ.closest("[data-teilen-nativ-li]").hidden = false;
      nativ.addEventListener("click", function () {
        navigator.share({ title: nativ.getAttribute("data-titel"), url: nativ.getAttribute("data-url") })
          .catch(function () { /* abgebrochen – nichts zu tun */ });
      });
    }

    document.querySelectorAll("[data-teilen-kopieren]").forEach(function (btn) {
      var text = btn.querySelector("[data-teilen-text]");
      btn.addEventListener("click", function () {
        var url = btn.getAttribute("data-teilen-kopieren");
        var fertig = function (meldung) {
          text.textContent = meldung;
          window.setTimeout(function () { text.textContent = "Link kopieren"; }, 2500);
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(url).then(function () { fertig("Link kopiert ✓"); }, function () { fertig("Kopieren nicht möglich"); });
        } else {
          window.prompt("Link zum Kopieren:", url);
        }
      });
    });
  }

  initListe();
  initTeilen();
})();
