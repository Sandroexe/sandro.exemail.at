---
# Front Matter, damit Endpoint und Meldungstexte aus _data kommen
# statt hier abgeschrieben zu werden.
layout: null
---
{%- assign C = site.data.contact -%}
/* ═══════════════════════════════════════════════════════════════════
   contact.js — Absenden des Kontaktformulars.

   Der Endpoint ist selbst gehostet und akzeptiert per CORS nur die
   Origin https://sandro.exemail.at. In der lokalen Vorschau schlägt
   das Absenden deshalb immer fehl — das ist Absicht. Für diesen Fall
   bietet die Seite unten den direkten E-Mail-Weg an.

   Ohne JavaScript ist das Formular nicht absendbar; sichtbar bleiben
   dann aber E-Mail-Adresse, Telefonnummer und vCard.
   ═══════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var form = document.getElementById('contact-form');
  if (!form) return;

  var statusEl = document.getElementById('form-status');
  var submitBtn = form.querySelector('[type="submit"]');
  var root = document.documentElement;

  var TEXT = {
    de: {
      sending: {{ site.data.i18n.de.contact.sending | jsonify }},
      success: {{ site.data.i18n.de.contact.success | jsonify }},
      error:   {{ site.data.i18n.de.contact.error | jsonify }},
      submit:  {{ site.data.i18n.de.contact.submit | jsonify }}
    },
    en: {
      sending: {{ site.data.i18n.en.contact.sending | jsonify }},
      success: {{ site.data.i18n.en.contact.success | jsonify }},
      error:   {{ site.data.i18n.en.contact.error | jsonify }},
      submit:  {{ site.data.i18n.en.contact.submit | jsonify }}
    }
  };
  function t(key) {
    var lang = root.getAttribute('data-lang') === 'en' ? 'en' : 'de';
    return TEXT[lang][key];
  }

  /* Fehler erst zeigen, wenn das Feld einmal verlassen wurde —
     nicht schon beim ersten Tastendruck. */
  function mark(field) {
    var wrap = field.closest('.field');
    if (!wrap) return;
    var bad = !field.checkValidity() && field.value.trim() !== '';
    wrap.setAttribute('data-invalid', String(bad));
    field.setAttribute('aria-invalid', String(bad));
  }

  form.querySelectorAll('input, textarea').forEach(function (field) {
    field.addEventListener('blur', function () { mark(field); });
    field.addEventListener('input', function () {
      if (field.closest('.field').getAttribute('data-invalid') === 'true') mark(field);
    });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var invalid = null;
    form.querySelectorAll('input, textarea').forEach(function (field) {
      if (!field.checkValidity()) {
        var wrap = field.closest('.field');
        if (wrap) wrap.setAttribute('data-invalid', 'true');
        field.setAttribute('aria-invalid', 'true');
        if (!invalid) invalid = field;
      }
    });
    if (invalid) { invalid.focus(); return; }

    var data = {
      name: form.elements.name.value.trim(),
      email: form.elements.email.value.trim(),
      phone: form.elements.phone.value.trim(),
      message: form.elements.message.value.trim()
    };

    submitBtn.disabled = true;
    statusEl.removeAttribute('data-state');
    statusEl.textContent = t('sending');

    fetch({{ C.form.endpoint | jsonify }}, {
      method: {{ C.form.method | jsonify }},
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json().catch(function () { return {}; });
      })
      .then(function () {
        statusEl.setAttribute('data-state', 'ok');
        statusEl.textContent = t('success');
        form.reset();
        form.querySelectorAll('.field').forEach(function (f) { f.removeAttribute('data-invalid'); });
      })
      .catch(function (err) {
        statusEl.setAttribute('data-state', 'err');
        statusEl.textContent = t('error');
        /* Der Fallback steht schon im HTML und wird nur eingeblendet. */
        var fb = document.getElementById('form-fallback');
        if (fb) fb.hidden = false;
        if (window.console) console.warn('[contact]', err);
      })
      .finally(function () {
        submitBtn.disabled = false;
      });
  });
})();
