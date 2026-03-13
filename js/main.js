/* ==============================
   ZaimTop 2026 — Main Script
   Vanilla JS, no dependencies
   ============================== */

(function () {
    'use strict';

    /* --- DOM Ready --- */
    document.addEventListener('DOMContentLoaded', init);

    function init() {
        initHeader();
        initMobileMenu();
        initCalculator();
        initFAQ();
        initScrollTop();
        initCookieConsent();
        initSmoothScroll();
        initSortButtons();
    }

    /* ============================
       Sticky Header
       ============================ */
    function initHeader() {
        var header = document.querySelector('.header');
        if (!header) return;

        var scrollThreshold = 10;

        function onScroll() {
            if (window.scrollY > scrollThreshold) {
                header.classList.add('header--scrolled');
            } else {
                header.classList.remove('header--scrolled');
            }
        }

        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    /* ============================
       Mobile Menu
       ============================ */
    function initMobileMenu() {
        var burger = document.querySelector('.header__burger');
        var mobileNav = document.querySelector('.mobile-nav');
        if (!burger || !mobileNav) return;

        burger.addEventListener('click', function () {
            burger.classList.toggle('header__burger--active');
            mobileNav.classList.toggle('mobile-nav--open');
            document.body.style.overflow = mobileNav.classList.contains('mobile-nav--open') ? 'hidden' : '';
        });

        /* Close on link click */
        var links = mobileNav.querySelectorAll('.mobile-nav__link, .mobile-nav__cta');
        links.forEach(function (link) {
            link.addEventListener('click', function () {
                burger.classList.remove('header__burger--active');
                mobileNav.classList.remove('mobile-nav--open');
                document.body.style.overflow = '';
            });
        });
    }

    /* ============================
       Loan Calculator
       ============================ */
    function initCalculator() {
        var amountSlider = document.getElementById('calc-amount');
        var termSlider = document.getElementById('calc-term');
        if (!amountSlider || !termSlider) return;

        var amountDisplay = document.getElementById('calc-amount-value');
        var termDisplay = document.getElementById('calc-term-value');
        var resultFirst = document.getElementById('calc-result-first');
        var resultRepeat = document.getElementById('calc-result-repeat');
        var resultTotal = document.getElementById('calc-result-total');

        function formatNumber(n) {
            return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
        }

        function getDaysWord(n) {
            var abs = Math.abs(n) % 100;
            var last = abs % 10;
            if (abs > 10 && abs < 20) return 'дней';
            if (last > 1 && last < 5) return 'дня';
            if (last === 1) return 'день';
            return 'дней';
        }

        function updateCalculator() {
            var amount = parseInt(amountSlider.value, 10);
            var term = parseInt(termSlider.value, 10);

            amountDisplay.textContent = formatNumber(amount) + ' \u20BD';
            termDisplay.textContent = term + ' ' + getDaysWord(term);

            /* First loan = 0% */
            resultFirst.textContent = '0 \u20BD';

            /* Repeat: average 0.8% per day */
            var dailyRate = 0.008;
            var interest = Math.round(amount * dailyRate * term);
            var total = amount + interest;

            resultRepeat.textContent = formatNumber(interest) + ' \u20BD';
            resultTotal.textContent = formatNumber(total) + ' \u20BD';

            /* Update slider track fill */
            updateSliderFill(amountSlider);
            updateSliderFill(termSlider);
        }

        function updateSliderFill(slider) {
            var min = parseFloat(slider.min);
            var max = parseFloat(slider.max);
            var val = parseFloat(slider.value);
            var pct = ((val - min) / (max - min)) * 100;
            slider.style.background = 'linear-gradient(to right, #FF6B35 0%, #FF6B35 ' + pct + '%, #E2E8F0 ' + pct + '%, #E2E8F0 100%)';
        }

        amountSlider.addEventListener('input', updateCalculator);
        termSlider.addEventListener('input', updateCalculator);

        updateCalculator();
    }

    /* ============================
       FAQ Accordion
       ============================ */
    function initFAQ() {
        var items = document.querySelectorAll('.faq__item');
        if (!items.length) return;

        items.forEach(function (item) {
            var question = item.querySelector('.faq__question');
            var answer = item.querySelector('.faq__answer');
            if (!question || !answer) return;

            question.addEventListener('click', function () {
                var isActive = item.classList.contains('faq__item--active');

                /* Close all */
                items.forEach(function (el) {
                    el.classList.remove('faq__item--active');
                    var a = el.querySelector('.faq__answer');
                    if (a) a.style.maxHeight = null;
                });

                /* Open clicked if it was closed */
                if (!isActive) {
                    item.classList.add('faq__item--active');
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                }
            });
        });
    }

    /* ============================
       Scroll To Top
       ============================ */
    function initScrollTop() {
        var btn = document.querySelector('.scroll-top');
        if (!btn) return;

        function toggleVisibility() {
            if (window.scrollY > 400) {
                btn.classList.add('scroll-top--visible');
            } else {
                btn.classList.remove('scroll-top--visible');
            }
        }

        window.addEventListener('scroll', toggleVisibility, { passive: true });
        toggleVisibility();

        btn.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* ============================
       Cookie Consent
       ============================ */
    function initCookieConsent() {
        var banner = document.querySelector('.cookie-consent');
        if (!banner) return;

        /* Check if already accepted */
        try {
            if (localStorage.getItem('cookie_consent') === 'accepted') return;
        } catch (e) {
            /* localStorage may be blocked */
        }

        banner.classList.add('cookie-consent--visible');

        var acceptBtn = document.getElementById('cookie-accept');
        var declineBtn = document.getElementById('cookie-decline');

        function hideBanner() {
            banner.classList.remove('cookie-consent--visible');
        }

        if (acceptBtn) {
            acceptBtn.addEventListener('click', function () {
                try { localStorage.setItem('cookie_consent', 'accepted'); } catch (e) {}
                hideBanner();
            });
        }

        if (declineBtn) {
            declineBtn.addEventListener('click', function () {
                try { localStorage.setItem('cookie_consent', 'declined'); } catch (e) {}
                hideBanner();
            });
        }
    }

    /* ============================
       Smooth Scroll for Anchors
       ============================ */
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(function (link) {
            link.addEventListener('click', function (e) {
                var targetId = this.getAttribute('href');
                if (targetId === '#') return;

                var target = document.querySelector(targetId);
                if (!target) return;

                e.preventDefault();
                var headerHeight = document.querySelector('.header')
                    ? document.querySelector('.header').offsetHeight
                    : 0;
                var top = target.getBoundingClientRect().top + window.scrollY - headerHeight - 20;

                window.scrollTo({ top: top, behavior: 'smooth' });
            });
        });
    }

    /* ============================
       Table Sort Buttons
       ============================ */
    function initSortButtons() {
        var buttons = document.querySelectorAll('.compare__sort-btn');
        if (!buttons.length) return;

        buttons.forEach(function (btn) {
            btn.addEventListener('click', function () {
                buttons.forEach(function (b) { b.classList.remove('compare__sort-btn--active'); });
                btn.classList.add('compare__sort-btn--active');

                var sortBy = btn.getAttribute('data-sort');
                sortTable(sortBy);
            });
        });
    }

    function sortTable(criteria) {
        /* Sort both desktop table rows and mobile cards */
        sortDesktopTable(criteria);
        sortMobileCards(criteria);
    }

    function sortDesktopTable(criteria) {
        var tbody = document.querySelector('.compare__table tbody');
        if (!tbody) return;

        var rows = Array.from(tbody.querySelectorAll('tr'));

        rows.sort(function (a, b) {
            var valA = parseFloat(a.getAttribute('data-' + criteria)) || 0;
            var valB = parseFloat(b.getAttribute('data-' + criteria)) || 0;

            if (criteria === 'rate') return valA - valB;
            return valB - valA;
        });

        rows.forEach(function (row) { tbody.appendChild(row); });
    }

    function sortMobileCards(criteria) {
        var container = document.querySelector('.compare__cards');
        if (!container) return;

        var cards = Array.from(container.querySelectorAll('.compare-card'));

        cards.sort(function (a, b) {
            var valA = parseFloat(a.getAttribute('data-' + criteria)) || 0;
            var valB = parseFloat(b.getAttribute('data-' + criteria)) || 0;

            if (criteria === 'rate') return valA - valB;
            return valB - valA;
        });

        cards.forEach(function (card) { container.appendChild(card); });
    }

})();
