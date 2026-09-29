/*
 * Wird im <head> geladen, BEVOR die Seite gezeichnet wird:
 *  - markiert, dass JavaScript aktiv ist (Klasse "js" statt "no-js")
 *  - übernimmt eine gespeicherte Hell/Dunkel-Auswahl (localStorage),
 *    damit die Seite nicht kurz im falschen Farbschema aufblitzt.
 * Ohne gespeicherte Auswahl gilt die Systemeinstellung (per CSS).
 */
(function () {
  var root = document.documentElement;
  root.classList.remove("no-js");
  root.classList.add("js");

  try {
    var theme = localStorage.getItem("theme");
    if (theme === "light" || theme === "dark") {
      root.setAttribute("data-theme", theme);
    }
  } catch (e) {
    // localStorage nicht verfügbar (z. B. privater Modus) – Systemeinstellung gilt
  }
})();
