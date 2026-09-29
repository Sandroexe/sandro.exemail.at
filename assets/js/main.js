/*
 * ═══════════════════════════════════════════════════════════════════════
 *  main.js – Interaktivität der Website (ohne Framework)
 *
 *  1. Hell/Dunkel-Umschalter
 *  2. Mobiles Burger-Menü
 *  3. Header-Linie beim Scrollen
 *  4. Spam-Schutz: E-Mail & Telefon lesbar machen
 *  5. Scroll-Einblendungen
 *  6. Lebenslauf drucken / als PDF speichern
 *  7. Zertifikate: Filter & Detailansicht
 * ═══════════════════════════════════════════════════════════════════════
 */
(function () {
  "use strict";

  var root = document.documentElement;
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var darkScheme = window.matchMedia("(prefers-color-scheme: dark)");

  /* ─── 1. Hell/Dunkel-Umschalter ───────────────────────────────────── */

  function currentTheme() {
    var explicit = root.getAttribute("data-theme");
    if (explicit === "light" || explicit === "dark") return explicit;
    return darkScheme.matches ? "dark" : "light";
  }

  function updateToggleLabels() {
    var label = currentTheme() === "dark" ? "Helles Design aktivieren" : "Dunkles Design aktivieren";
    document.querySelectorAll("[data-theme-toggle]").forEach(function (btn) {
      btn.setAttribute("aria-label", label);
      btn.setAttribute("title", label);
    });
  }

  function initThemeToggle() {
    document.querySelectorAll("[data-theme-toggle]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var next = currentTheme() === "dark" ? "light" : "dark";
        root.setAttribute("data-theme", next);
        // Nur nach aktivem Klick speichern (siehe Datenschutzerklärung)
        try {
          localStorage.setItem("theme", next);
        } catch (e) {
          // Speichern nicht möglich – Auswahl gilt nur für diesen Seitenaufruf
        }
        updateToggleLabels();
      });
    });
    darkScheme.addEventListener("change", updateToggleLabels);
    updateToggleLabels();
  }

  /* ─── 2. Mobiles Burger-Menü ──────────────────────────────────────── */

  function initNavigation() {
    var toggle = document.querySelector("[data-nav-toggle]");
    var nav = document.querySelector("[data-nav]");
    if (!toggle || !nav) return;

    function setOpen(open) {
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Menü schließen" : "Menü öffnen");
      nav.classList.toggle("is-open", open);
    }

    toggle.addEventListener("click", function () {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });

    // Schließen mit Escape
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && nav.classList.contains("is-open")) {
        setOpen(false);
        toggle.focus();
      }
    });

    // Schließen bei Klick außerhalb oder auf einen Link
    document.addEventListener("click", function (event) {
      if (!nav.classList.contains("is-open")) return;
      if (event.target.closest("[data-nav] a") || !event.target.closest("[data-header]")) {
        setOpen(false);
      }
    });

    // Beim Wechsel auf Desktop-Breite zurücksetzen
    window.matchMedia("(min-width: 56em)").addEventListener("change", function (mq) {
      if (mq.matches) setOpen(false);
    });
  }

  /* ─── 3. Header-Linie beim Scrollen ───────────────────────────────── */

  function initHeaderScroll() {
    var header = document.querySelector("[data-header]");
    if (!header) return;
    var ticking = false;

    function update() {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
      ticking = false;
    }

    window.addEventListener("scroll", function () {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });
    update();
  }

  /* ─── 4. Spam-Schutz: E-Mail & Telefon lesbar machen ──────────────── */
  // Gegenstück zu _includes/obf.html (umgedreht, "@" → "|", "." → "~")

  function decode(value) {
    return Array.from(value.replace(/~/g, ".").replace(/\|/g, "@")).reverse().join("");
  }

  function initContactProtection() {
    document.querySelectorAll("[data-obf]").forEach(function (el) {
      var value = decode(el.getAttribute("data-obf"));
      var type = el.getAttribute("data-obf-typ");

      if (type === "mailto") {
        el.setAttribute("href", "mailto:" + value);
      } else if (type === "tel") {
        el.setAttribute("href", "tel:" + value.replace(/[^\d+]/g, ""));
      } else if (type === "text") {
        el.textContent = value;
      }
    });
  }

  /* ─── 5. Scroll-Einblendungen ─────────────────────────────────────── */

  function initReveal() {
    var elements = document.querySelectorAll("[data-reveal]");
    if (!elements.length) return;

    if (reducedMotion.matches || !("IntersectionObserver" in window)) {
      elements.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });

    elements.forEach(function (el) { observer.observe(el); });

    // Vor dem Drucken alles sichtbar machen
    window.addEventListener("beforeprint", function () {
      elements.forEach(function (el) { el.classList.add("is-visible"); });
    });
  }

  /* ─── 6. Lebenslauf drucken / als PDF speichern ───────────────────── */

  function initPrint() {
    document.querySelectorAll('[data-action="print"]').forEach(function (btn) {
      btn.addEventListener("click", function () {
        window.print();
      });
    });
  }

  /* ─── 7. Zertifikate: Filter & Detailansicht ──────────────────────── */

  function initCertificateFilter() {
    var buttons = document.querySelectorAll("[data-filter]");
    if (!buttons.length) return;
    var cards = document.querySelectorAll("[data-kategorie]");
    var status = document.querySelector("[data-filter-status]");

    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var filter = btn.getAttribute("data-filter");
        var visible = 0;

        buttons.forEach(function (b) {
          b.setAttribute("aria-pressed", String(b === btn));
        });

        cards.forEach(function (card) {
          var show = filter === "alle" || card.getAttribute("data-kategorie") === filter;
          card.hidden = !show;
          if (show) {
            visible += 1;
            card.classList.add("is-visible");
          }
        });

        if (status) {
          status.textContent = visible + (visible === 1 ? " Zertifikat" : " Zertifikate") + " angezeigt";
        }
      });
    });
  }

  function initDialogs() {
    document.querySelectorAll("[data-dialog-open]").forEach(function (btn) {
      var dialog = document.getElementById(btn.getAttribute("data-dialog-open"));
      if (!dialog || typeof dialog.showModal !== "function") return;

      btn.addEventListener("click", function () {
        dialog.showModal();
      });

      // Klick auf den abgedunkelten Hintergrund schließt die Detailansicht
      dialog.addEventListener("click", function (event) {
        if (event.target === dialog) dialog.close();
      });

      // Fokus nach dem Schließen zurück auf die Karte
      dialog.addEventListener("close", function () {
        btn.focus();
      });
    });

    document.querySelectorAll("[data-dialog-close]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var dialog = btn.closest("dialog");
        if (dialog) dialog.close();
      });
    });
  }

  /* ─── Start ───────────────────────────────────────────────────────── */

  initThemeToggle();
  initNavigation();
  initHeaderScroll();
  initContactProtection();
  initReveal();
  initPrint();
  initCertificateFilter();
  initDialogs();
})();
