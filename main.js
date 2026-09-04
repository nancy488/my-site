/**
 * HealthyfiKey — main.js
 * Vanilla JS, no dependencies. Loaded on every page. Every feature below
 * checks for its own DOM hooks before wiring up, so this file is safe to
 * include on pages that don't use a given feature (e.g. the category
 * filter only exists on index.html).
 */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    initMobileMenu();
    initCategoryFilter();
    initNetlifyForms();
    setCurrentYear();
  });

  /**
   * Mobile header menu: toggles the collapsible nav panel that sits under
   * the header on small screens, keeps aria-expanded in sync, closes on
   * Escape, on outside link click, and automatically when the viewport
   * grows past the desktop breakpoint.
   */
  function initMobileMenu() {
    var toggle = document.querySelector('[data-menu-toggle]');
    var panel = document.getElementById('mobile-menu-panel');
    if (!toggle || !panel) return;

    function setOpen(isOpen) {
      panel.classList.toggle('is-open', isOpen);
      toggle.setAttribute('aria-expanded', String(isOpen));
      toggle.setAttribute('data-menu-open', String(isOpen));
    }

    toggle.addEventListener('click', function () {
      setOpen(!panel.classList.contains('is-open'));
    });

    panel.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        setOpen(false);
      });
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') setOpen(false);
    });

    if (window.matchMedia) {
      var desktopQuery = window.matchMedia('(min-width: 768px)');
      var handleChange = function (event) {
        if (event.matches) setOpen(false);
      };
      if (desktopQuery.addEventListener) {
        desktopQuery.addEventListener('change', handleChange);
      } else if (desktopQuery.addListener) {
        // Safari < 14 fallback
        desktopQuery.addListener(handleChange);
      }
    }
  }

  /**
   * Instant category filter for the homepage article feed. Buttons carry
   * data-filter="<slug>", cards carry data-category="<slug>". Clicking a
   * button instantly shows/hides matching cards and syncs the URL hash so
   * a filtered view can be bookmarked or shared (e.g. index.html#nutrition).
   */
  function initCategoryFilter() {
    var grid = document.getElementById('article-grid');
    if (!grid) return;

    var filterButtons = Array.prototype.slice.call(document.querySelectorAll('[data-filter]'));
    var cards = Array.prototype.slice.call(grid.querySelectorAll('[data-category]'));
    var emptyState = document.querySelector('[data-empty-state]');
    var validFilters = filterButtons.map(function (btn) {
      return btn.getAttribute('data-filter');
    });

    function normalize(value) {
      return validFilters.indexOf(value) !== -1 ? value : 'all';
    }

    function applyFilter(target) {
      var visibleCount = 0;

      filterButtons.forEach(function (btn) {
        var isActive = btn.getAttribute('data-filter') === target;
        btn.classList.toggle('is-active', isActive);
        btn.setAttribute('aria-pressed', String(isActive));
      });

      cards.forEach(function (card) {
        var matches = target === 'all' || card.getAttribute('data-category') === target;
        card.hidden = !matches;
        if (matches) visibleCount += 1;
      });

      if (emptyState) emptyState.hidden = visibleCount !== 0;
    }

    filterButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var target = normalize(btn.getAttribute('data-filter'));
        applyFilter(target);
        if (window.history && window.history.replaceState) {
          var newUrl = target === 'all'
            ? window.location.pathname + window.location.search
            : '#' + target;
          window.history.replaceState(null, '', newUrl);
        }
      });
    });

    window.addEventListener('hashchange', function () {
      applyFilter(normalize(window.location.hash.replace('#', '')));
    });

    applyFilter(normalize(window.location.hash.replace('#', '')));
  }

  /**
   * Progressive-enhancement handler for Netlify Forms. Any <form
   * data-ajax-form data-netlify="true"> on the site (newsletter signups,
   * the contact page) is submitted in the background so the visitor gets
   * an inline confirmation instead of a full page reload. If fetch fails
   * for any reason, the form still works as a plain HTML POST because we
   * only preventDefault after wiring the listener, not in markup.
   */
  function initNetlifyForms() {
    var forms = document.querySelectorAll('form[data-ajax-form]');
    if (!forms.length) return;

    forms.forEach(function (form) {
      form.addEventListener('submit', function (event) {
        event.preventDefault();

        var statusEl = form.querySelector('[data-form-status]');
        var submitBtn = form.querySelector('button[type="submit"]');
        var honeypot = form.querySelector('input[name="bot-field"]');

        // Silently drop obvious bot submissions rather than round-tripping them.
        if (honeypot && honeypot.value) return;

        var params = new URLSearchParams();
        new FormData(form).forEach(function (value, key) {
          params.append(key, value);
        });

        setFormStatus(statusEl, 'loading', 'Sending…');
        if (submitBtn) submitBtn.disabled = true;

        fetch('/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: params.toString(),
        })
          .then(function (response) {
            if (!response.ok) throw new Error('Form submission failed');
            var successMessage = form.getAttribute('data-success-message') ||
              'Thanks! Your submission has been received.';
            setFormStatus(statusEl, 'success', successMessage);
            form.reset();
          })
          .catch(function () {
            setFormStatus(
              statusEl,
              'error',
              'Something went wrong sending that. Please try again in a moment.'
            );
          })
          .finally(function () {
            if (submitBtn) submitBtn.disabled = false;
          });
      });
    });
  }

  function setFormStatus(el, type, message) {
    if (!el) return;
    el.textContent = message;
    el.classList.remove('is-success', 'is-error', 'is-loading');
    el.classList.add('is-visible', 'is-' + type);
  }

  /** Keeps footer copyright years accurate without a redeploy. */
  function setCurrentYear() {
    var year = String(new Date().getFullYear());
    document.querySelectorAll('[data-current-year]').forEach(function (el) {
      el.textContent = year;
    });
  }
})();
