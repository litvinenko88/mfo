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
        initFilter();
        initFAQ();
        initScrollTop();
        initCookieConsent();
        initSmoothScroll();
        initMfoToggle();
        initReviewsToggle();
        initMfoDetails();
        initMfoSort();
        initAffiliateTracking();
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

        /* Horizontal wheel scroll for categories bar */
        var categoriesNav = document.querySelector('.categories-nav');
        var arrowLeft = document.querySelector('.categories-arrow--left');
        var arrowRight = document.querySelector('.categories-arrow--right');

        if (categoriesNav) {
            /* Update arrow visibility based on scroll position */
            function updateArrows() {
                if (!arrowLeft || !arrowRight) return;
                var scrollL = categoriesNav.scrollLeft;
                var maxScroll = categoriesNav.scrollWidth - categoriesNav.clientWidth;

                if (scrollL <= 2) {
                    arrowLeft.classList.add('categories-arrow--hidden');
                } else {
                    arrowLeft.classList.remove('categories-arrow--hidden');
                }

                if (scrollL >= maxScroll - 2) {
                    arrowRight.classList.add('categories-arrow--hidden');
                } else {
                    arrowRight.classList.remove('categories-arrow--hidden');
                }
            }

            /* Arrow click handlers */
            var scrollStep = 200;
            if (arrowLeft) {
                arrowLeft.addEventListener('click', function () {
                    categoriesNav.scrollLeft -= scrollStep;
                });
            }
            if (arrowRight) {
                arrowRight.addEventListener('click', function () {
                    categoriesNav.scrollLeft += scrollStep;
                });
            }

            categoriesNav.addEventListener('scroll', updateArrows, { passive: true });
            window.addEventListener('resize', updateArrows);
            updateArrows();

            categoriesNav.addEventListener('wheel', function (e) {
                if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
                    e.preventDefault();
                    categoriesNav.scrollLeft += e.deltaY;
                }
            }, { passive: false });

            /* Drag scroll with mouse */
            var isDown = false;
            var startX;
            var scrollLeft;

            categoriesNav.addEventListener('mousedown', function (e) {
                isDown = true;
                categoriesNav.style.cursor = 'grabbing';
                startX = e.pageX - categoriesNav.offsetLeft;
                scrollLeft = categoriesNav.scrollLeft;
            });

            categoriesNav.addEventListener('mouseleave', function () {
                isDown = false;
                categoriesNav.style.cursor = 'grab';
            });

            categoriesNav.addEventListener('mouseup', function () {
                isDown = false;
                categoriesNav.style.cursor = 'grab';
            });

            categoriesNav.addEventListener('mousemove', function (e) {
                if (!isDown) return;
                e.preventDefault();
                var x = e.pageX - categoriesNav.offsetLeft;
                categoriesNav.scrollLeft = scrollLeft - (x - startX);
            });

            categoriesNav.style.cursor = 'grab';
        }
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
        var resultOverpay = document.getElementById('calc-result-overpay');
        var resultTotal = document.getElementById('calc-result-total');
        var resultCount = document.getElementById('calc-result-count');
        var matchesContainer = document.getElementById('calc-matches');
        var clientToggle = document.getElementById('calc-client-toggle');
        var isNewClient = true;

        /* MFO database — real offers from documentation */
        var mfoList = [
            {n:"Займер",logo:"logos/01-zajmer.svg",amtN:[1000,30000],amtR:[1000,30000],trmN:[7,30],trmR:[7,30],rateN:0,rateR:0.8,z:true,zd:30,url:"https://pxl.leads.su/click/95cecac27d1faca720a8981dbc34748e?erid=2W5zFGRgkqW"},
            {n:"Быстроденьги",logo:"logos/02-bystrodengi.svg",amtN:[1000,30000],amtR:[1000,500000],trmN:[1,21],trmR:[1,1080],rateN:0,rateR:0.8,z:true,zd:10,url:"https://pxl.leads.su/click/9b7c3f92632059651026c93817da5be4?erid=2W5zFHRnKXf"},
            {n:"Бери Беру",logo:"logos/03-beriberu.svg",amtN:[1000,50000],amtR:[1000,50000],trmN:[5,31],trmR:[5,31],rateN:0,rateR:0.8,z:true,zd:21,url:"https://pxl.leads.su/click/4e60ee94de113b15d5fbc7bed4e6ed12?erid=2W5zFGqH8AU"},
            {n:"Credit7",logo:"logos/04-credit7.svg",amtN:[1000,30000],amtR:[1000,100000],trmN:[7,30],trmR:[7,30],rateN:0,rateR:0.8,z:true,zd:7,url:"https://pxl.leads.su/click/f676af6bb07f68d706c6053669efcfbe?erid=2W5zFHAu736"},
            {n:"Лайк Мани",logo:"logos/05-like-money.svg",amtN:[2000,100000],amtR:[2000,100000],trmN:[1,180],trmR:[1,180],rateN:0,rateR:0.8,z:true,zd:7,url:"https://pxl.leads.su/click/77307f82112c60903718f3a5208b16e2?erid=2W5zFJEVzd6"},
            {n:"Boostra",logo:"logos/06-boostra.svg",amtN:[1000,100000],amtR:[1000,100000],trmN:[1,180],trmR:[1,180],rateN:0,rateR:0.8,z:true,zd:null,url:"https://pxl.leads.su/click/b5b01b9d38dc1fed50cd70ebdb5c05e7?erid=2W5zFHzPkun"},
            {n:"BelkaCredit",logo:"logos/07-belkacredit.svg",amtN:[1000,30000],amtR:[1000,30000],trmN:[7,30],trmR:[7,30],rateN:0,rateR:0.8,z:true,zd:7,url:"https://pxl.leads.su/click/1e72b15a212a832a32c5daa5b4734e25?erid=2W5zFK9wF9A"},
            {n:"Срочно Деньги",logo:"logos/08-srochnodengi.svg",amtN:[2000,100000],amtR:[2000,100000],trmN:[1,360],trmR:[1,360],rateN:0,rateR:0.8,z:true,zd:7,url:"https://pxl.leads.su/click/38d67604feb85b28ab4090610ea5bbba?erid=2W5zFJkUBEY"},
            {n:"HurmaCredit",logo:"logos/09-hurmacredit.svg",amtN:[1000,50000],amtR:[1000,50000],trmN:[5,31],trmR:[5,31],rateN:0,rateR:0.8,z:true,zd:21,url:"https://pxl.leads.su/click/bc55d263b3dd36189299a5528d41e2d7?erid=2W5zFH7Yxqn"},
            {n:"Умные Наличные",logo:"logos/10-umnye-nalichnye.svg",amtN:[1000,30000],amtR:[1000,30000],trmN:[1,30],trmR:[1,30],rateN:0,rateR:0.8,z:true,zd:null,url:"https://pxl.leads.su/click/7d30ad52043887efd2e33ee89ea41e62?erid=2W5zFJSTEz4"},
            {n:"Надо Денег",logo:"logos/11-nado-deneg.svg",amtN:[1000,100000],amtR:[1000,100000],trmN:[7,168],trmR:[7,168],rateN:0,rateR:0.8,z:true,zd:7,url:"https://pxl.leads.su/click/9d9fc0e645501c612c6cfa1055214b42?erid=2W5zFHdCTFv"},
            {n:"Доброзайм",logo:"logos/12-dobrozajm.svg",amtN:[1000,100000],amtR:[1000,1000000],trmN:[4,720],trmR:[4,720],rateN:0,rateR:0.8,z:true,zd:7,url:"https://pxl.leads.su/click/97d69622e4f8b11f0af2747944c4a311?erid=2W5zFJSXfu2"},
            {n:"OneClickMoney",logo:"logos/13-oneclickmoney.svg",amtN:[500,200000],amtR:[500,200000],trmN:[15,735],trmR:[15,735],rateN:0,rateR:0.8,z:true,zd:null,url:"https://pxl.leads.su/click/df029d65324cad9b3579f8b1034cab21?erid=2W5zFH7Qc5v"},
            {n:"Деньги Сразу",logo:"logos/15-dengi-srazu.svg",amtN:[1000,30000],amtR:[1000,100000],trmN:[16,16],trmR:[17,365],rateN:0.8,rateR:0.8,z:false,zd:null,url:"https://pxl.leads.su/click/174ea44bddaf32da6dd1bfe047b83a80?erid=2W5zFGDsBp4"},
            {n:"Свои Люди",logo:"logos/16-svoi-lyudi.svg",amtN:[5000,30000],amtR:[5000,30000],trmN:[3,30],trmR:[3,30],rateN:0.8,rateR:0.8,z:false,zd:null,url:"https://pxl.leads.su/click/8bae555126c05cbc61c4c2f72d4eb3b6?erid=2W5zFHDfLCg"},
            {n:"Кредиска",logo:"logos/17-krediska.svg",amtN:[1000,50000],amtR:[1000,50000],trmN:[5,31],trmR:[5,31],rateN:0,rateR:0.8,z:true,zd:21,url:"https://pxl.leads.su/click/05d217c2c615daf5286328e1249f9301?erid=2W5zFHywXyi"},
            {n:"Займиго",logo:"logos/18-zaymigo.svg",amtN:[5000,50000],amtR:[5000,50000],trmN:[5,31],trmR:[5,31],rateN:0,rateR:0.8,z:true,zd:21,url:"https://pxl.leads.su/click/034e966f88817730c36d8275cae1b4dd?erid=2W5zFK44HXE"},
            {n:"Joymoney",logo:"logos/19-joymoney.svg",amtN:[3000,30000],amtR:[11000,100000],trmN:[10,30],trmR:[10,168],rateN:0,rateR:0.8,z:true,zd:14,url:"https://pxl.leads.su/click/4f1a5e421ae9b0afb91d49ef85946fba?erid=2W5zFK1Gnqv"},
            {n:"MoneyMan",logo:"logos/20-moneyman.svg",amtN:[1000,30000],amtR:[1000,100000],trmN:[5,33],trmR:[10,126],rateN:0,rateR:0.8,z:true,zd:21,url:"https://vldmnt.ru/go/ssm7xv7ihi"},
            {n:"Лайкзайм",logo:"logos/21-likezaim.svg",amtN:[1000,30000],amtR:[1000,30000],trmN:[1,14],trmR:[1,14],rateN:0,rateR:0.8,z:true,zd:null,url:"https://vldmnt.ru/go/snuwwxsc8v"},
            {n:"Kviku",logo:"logos/22-kviku.svg",amtN:[1000,100000],amtR:[1000,100000],trmN:[60,365],trmR:[60,365],rateN:0.8,rateR:0.8,z:true,zd:50,url:"https://vldmnt.ru/go/s995xwjrn6"},
            {n:"Bunny Money",logo:"logos/23-bunny-money.svg",amtN:[1000,30000],amtR:[1000,30000],trmN:[3,30],trmR:[3,30],rateN:0,rateR:0.8,z:false,zd:null,url:"https://vldmnt.ru/go/sgtta83y0f"},
            {n:"Вебзайм",logo:"logos/26-webzaim.svg",amtN:[3000,30000],amtR:[3000,30000],trmN:[7,30],trmR:[7,30],rateN:0,rateR:0.8,z:true,zd:14,url:"https://vldmnt.ru/go/s59sfd2drp"},
            {n:"Max.Credit",logo:"logos/27-max-credit.svg",amtN:[5000,30000],amtR:[5000,30000],trmN:[3,30],trmR:[3,30],rateN:0.8,rateR:0.8,z:false,zd:null,url:"https://vldmnt.ru/go/s03s3xmmdj"},
            {n:"Гринмани",logo:"logos/29-grinmani.svg",amtN:[3000,30000],amtR:[3000,100000],trmN:[7,21],trmR:[7,364],rateN:0,rateR:0.41,z:true,zd:21,url:"https://vldmnt.ru/go/stjejc0nuh"},
            {n:"еКапуста",logo:"logos/31-ekapusta.svg",amtN:[1000,30000],amtR:[1000,30000],trmN:[7,30],trmR:[7,30],rateN:0,rateR:0.99,z:true,zd:30,url:"https://vldmnt.ru/go/s2sanlbasa"},
            {n:"Cash To You",logo:"logos/32-cash-to-you.svg",amtN:[500,30000],amtR:[500,30000],trmN:[6,31],trmR:[6,31],rateN:0.8,rateR:0.8,z:false,zd:null,url:"https://vldmnt.ru/go/sqp7uapj7b"},
            {n:"Небус",logo:"logos/33-nebus.svg",amtN:[1000,50000],amtR:[1000,50000],trmN:[1,113],trmR:[1,113],rateN:0.8,rateR:0.8,z:false,zd:null,url:"https://vldmnt.ru/go/s7h430n94n"},
            {n:"До зарплаты",logo:"logos/34-do-zarplaty.svg",amtN:[1000,20000],amtR:[1000,30000],trmN:[7,180],trmR:[7,180],rateN:0,rateR:0.8,z:true,zd:null,url:"https://vldmnt.ru/go/s8uxolnvnr"},
            {n:"Фин5",logo:"logos/14-fin5.svg",amtN:[1000,100000],amtR:[1000,100000],trmN:[1,365],trmR:[1,365],rateN:0,rateR:0.8,z:true,zd:null,url:"https://pxl.leads.su/click/a2b141f8039bcd39f2efcc172d6fd11c?erid=2W5zFGbcPc5",agg:true},
            {n:"EcoZaym",logo:"logos/24-ecozaym.svg",amtN:[1000,100000],amtR:[1000,100000],trmN:[1,365],trmR:[1,365],rateN:0,rateR:0.8,z:true,zd:null,url:"https://vldmnt.ru/go/szhcpcvb8i",agg:true}
        ];

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

        function findMatches(amount, term, isNew) {
            var results = [];
            for (var i = 0; i < mfoList.length; i++) {
                var m = mfoList[i];
                var amt = isNew ? m.amtN : m.amtR;
                var trm = isNew ? m.trmN : m.trmR;
                if (amount >= amt[0] && amount <= amt[1] && term >= trm[0] && term <= trm[1]) {
                    var rate = isNew ? m.rateN : m.rateR;
                    var isZero = isNew && m.z && (m.zd === null || term <= m.zd);
                    var effectiveRate = isZero ? 0 : rate;
                    var overpay = Math.round(amount * (effectiveRate / 100) * term);
                    results.push({
                        name: m.n,
                        logo: m.logo,
                        url: m.url,
                        rate: effectiveRate,
                        overpay: overpay,
                        total: amount + overpay,
                        isZero: isZero,
                        isAgg: m.agg || false
                    });
                }
            }
            /* Sort: 0% first, then by lowest overpay */
            results.sort(function(a, b) {
                if (a.isZero !== b.isZero) return a.isZero ? -1 : 1;
                return a.overpay - b.overpay;
            });
            return results;
        }

        function renderMatches(matches) {
            if (!matchesContainer) return;
            var max = 3;
            var shown = matches.slice(0, max);

            if (shown.length === 0) {
                matchesContainer.innerHTML = '<div class="calc-match calc-match--empty">Нет подходящих предложений. Попробуйте изменить сумму или срок.</div>';
                return;
            }

            var html = '';
            for (var i = 0; i < shown.length; i++) {
                var m = shown[i];
                var badge = m.isZero ? '<span class="calc-match__badge calc-match__badge--green">0%</span>' : '';
                if (m.isAgg) badge = '<span class="calc-match__badge calc-match__badge--blue">Подбор</span>';
                html += '<div class="calc-match">' +
                    '<div class="calc-match__left">' +
                        '<img src="' + m.logo + '" alt="' + m.name + '" class="calc-match__logo" width="80" height="28">' +
                        badge +
                    '</div>' +
                    '<div class="calc-match__center">' +
                        '<div class="calc-match__overpay">' + (m.isZero ? '0 ₽' : formatNumber(m.overpay) + ' ₽') + '</div>' +
                        '<div class="calc-match__overpay-label">переплата</div>' +
                    '</div>' +
                    '<a href="' + m.url + '" class="btn btn--primary btn--xs calc-match__btn" rel="nofollow noopener" target="_blank">Получить</a>' +
                '</div>';
            }

            if (matches.length > max) {
                html += '<a href="#compare" class="calc-match__more">Ещё ' + (matches.length - max) + ' предложений ↓</a>';
            }

            matchesContainer.innerHTML = html;
        }

        function updateCalculator() {
            var amount = parseInt(amountSlider.value, 10);
            var term = parseInt(termSlider.value, 10);

            amountDisplay.textContent = formatNumber(amount) + ' \u20BD';
            termDisplay.textContent = term + ' ' + getDaysWord(term);

            var matches = findMatches(amount, term, isNewClient);

            /* Overpay: use avg rate or best match */
            var bestRate = isNewClient ? 0 : 0.8;
            if (matches.length > 0 && !matches[0].isAgg) {
                bestRate = matches[0].rate;
            }
            var overpay = Math.round(amount * (bestRate / 100) * term);
            var total = amount + overpay;

            resultOverpay.textContent = formatNumber(overpay) + ' \u20BD';
            if (overpay === 0) {
                resultOverpay.className = 'calculator__result-value calculator__result-value--green';
            } else {
                resultOverpay.className = 'calculator__result-value';
            }
            resultTotal.textContent = formatNumber(total) + ' \u20BD';
            resultCount.textContent = matches.length;

            renderMatches(matches);

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

        /* Client type toggle */
        if (clientToggle) {
            var toggleBtns = clientToggle.querySelectorAll('.calculator__toggle-btn');
            for (var i = 0; i < toggleBtns.length; i++) {
                toggleBtns[i].addEventListener('click', function() {
                    for (var j = 0; j < toggleBtns.length; j++) {
                        toggleBtns[j].classList.remove('calculator__toggle-btn--active');
                    }
                    this.classList.add('calculator__toggle-btn--active');
                    isNewClient = this.getAttribute('data-client') === 'new';
                    updateCalculator();
                });
            }
        }

        amountSlider.addEventListener('input', updateCalculator);
        termSlider.addEventListener('input', updateCalculator);

        /* Toggle matches visibility */
        var matchesToggle = document.getElementById('calc-matches-toggle');
        if (matchesToggle) {
            matchesToggle.addEventListener('click', function() {
                var wrap = this.closest('.calculator__matches-wrap');
                if (wrap) wrap.classList.toggle('is-open');
            });
        }

        updateCalculator();
    }

    /* ============================
       Sub-page Filter (подбор займа)
       ============================ */
    function initFilter() {
        var amountSlider = document.getElementById('filter-amount');
        var termSlider = document.getElementById('filter-term');
        if (!amountSlider || !termSlider) return;

        var amountDisplay = document.getElementById('filter-amount-value');
        var termDisplay = document.getElementById('filter-term-value');
        var kiToggle = document.getElementById('filter-ki-toggle');
        var filterBtn = document.getElementById('filter-submit');
        var filterCount = document.getElementById('filter-count');
        var mfoGrid = document.getElementById('mfo-grid');

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

        function updateSliderFill(slider) {
            var min = parseFloat(slider.min);
            var max = parseFloat(slider.max);
            var val = parseFloat(slider.value);
            var pct = ((val - min) / (max - min)) * 100;
            slider.style.background = 'linear-gradient(to right, #FF6B35 0%, #FF6B35 ' + pct + '%, #E2E8F0 ' + pct + '%, #E2E8F0 100%)';
        }

        function filterCards() {
            if (!mfoGrid) return 0;
            var cards = mfoGrid.querySelectorAll('.mfo-card');
            var amount = parseInt(amountSlider.value, 10);
            var term = parseInt(termSlider.value, 10);
            var count = 0;

            for (var i = 0; i < cards.length; i++) {
                var cardMaxAmount = parseInt(cards[i].getAttribute('data-amount'), 10) || 0;
                var cardMaxTerm = parseInt(cards[i].getAttribute('data-term'), 10) || 0;
                var match = amount <= cardMaxAmount && (cardMaxTerm === 0 || term <= cardMaxTerm);

                if (match) {
                    cards[i].style.display = '';
                    cards[i].classList.remove('mfo-card--dimmed');
                    count++;
                } else {
                    cards[i].classList.add('mfo-card--dimmed');
                    count++;
                }
            }
            return count;
        }

        function updateFilter() {
            var amount = parseInt(amountSlider.value, 10);
            var term = parseInt(termSlider.value, 10);

            amountDisplay.textContent = formatNumber(amount) + ' \u20BD';
            termDisplay.textContent = term + ' ' + getDaysWord(term);

            updateSliderFill(amountSlider);
            updateSliderFill(termSlider);

            /* Count matching cards for the counter */
            if (mfoGrid && filterCount) {
                var cards = mfoGrid.querySelectorAll('.mfo-card');
                var matchCount = 0;
                for (var i = 0; i < cards.length; i++) {
                    var cardMaxAmount = parseInt(cards[i].getAttribute('data-amount'), 10) || 0;
                    var cardMaxTerm = parseInt(cards[i].getAttribute('data-term'), 10) || 0;
                    var match = amount <= cardMaxAmount && (cardMaxTerm === 0 || term <= cardMaxTerm);
                    if (match) matchCount++;
                }
                filterCount.textContent = matchCount;
            }
        }

        /* KI toggle buttons */
        if (kiToggle) {
            var toggleBtns = kiToggle.querySelectorAll('.calculator__toggle-btn');
            for (var i = 0; i < toggleBtns.length; i++) {
                toggleBtns[i].addEventListener('click', function() {
                    for (var j = 0; j < toggleBtns.length; j++) {
                        toggleBtns[j].classList.remove('calculator__toggle-btn--active');
                    }
                    this.classList.add('calculator__toggle-btn--active');
                });
            }
        }

        /* Filter submit — scroll to rating + apply filter */
        if (filterBtn) {
            filterBtn.addEventListener('click', function(e) {
                e.preventDefault();
                filterCards();
                var target = document.getElementById('mfo-rating');
                if (target) {
                    var headerHeight = document.querySelector('.header') ? document.querySelector('.header').offsetHeight : 0;
                    var top = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 16;
                    window.scrollTo({ top: top, behavior: 'smooth' });
                }
            });
        }

        amountSlider.addEventListener('input', updateFilter);
        termSlider.addEventListener('input', updateFilter);

        /* Init state */
        updateFilter();
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
       MFO Cards Toggle (show more / collapse)
       ============================ */
    function initMfoToggle() {
        var btn = document.getElementById('mfo-toggle-btn');
        var extraGrid = document.getElementById('mfo-grid-extra');
        if (!btn || !extraGrid) return;

        var expanded = false;

        btn.addEventListener('click', function () {
            expanded = !expanded;
            if (expanded) {
                extraGrid.classList.add('is-visible');
                btn.textContent = 'Скрыть';
            } else {
                extraGrid.classList.remove('is-visible');
                btn.textContent = 'Показать ещё 19 МФО';
                var section = document.getElementById('compare');
                if (section) {
                    section.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    }

    /* ============================
       Reviews Toggle (show all / collapse)
       ============================ */
    function initReviewsToggle() {
        var btn = document.getElementById('reviews-toggle');
        var grid = document.getElementById('reviews-grid');
        if (!btn || !grid) return;

        var expanded = false;

        btn.addEventListener('click', function () {
            expanded = !expanded;
            if (expanded) {
                grid.classList.add('reviews--expanded');
                btn.textContent = 'Скрыть отзывы';
            } else {
                grid.classList.remove('reviews--expanded');
                btn.textContent = 'Показать все 50 отзывов';
                /* Scroll reviews section into view */
                var section = document.getElementById('reviews');
                if (section) {
                    section.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    }

    /* ============================
       MFO Sort
       ============================ */
    function initMfoSort() {
        var select = document.getElementById('mfo-sort-select');
        var grid1 = document.getElementById('mfo-grid');
        var grid2 = document.getElementById('mfo-grid-extra');
        if (!select || !grid1) return;

        select.addEventListener('change', function () {
            var val = select.value;
            var parts = val.split('-');
            var key = parts[0];
            var dir = parts[1];

            // Collect all cards from both grids
            var cards = [];
            var allCards = document.querySelectorAll('.mfo-card');
            allCards.forEach(function (card) { cards.push(card); });

            // Sort
            cards.sort(function (a, b) {
                var aVal = parseFloat(a.dataset[key]) || 0;
                var bVal = parseFloat(b.dataset[key]) || 0;
                return dir === 'desc' ? bVal - aVal : aVal - bVal;
            });

            // Determine how many visible (first grid)
            var visibleCount = 12;

            // Clear grids
            grid1.innerHTML = '';
            if (grid2) grid2.innerHTML = '';

            // Re-insert cards with updated ranks
            cards.forEach(function (card, i) {
                var rank = card.querySelector('.mfo-card__rank');
                if (rank) rank.textContent = '#' + (i + 1);

                if (i < visibleCount) {
                    grid1.appendChild(card);
                } else if (grid2) {
                    grid2.appendChild(card);
                }
            });
        });
    }

    /* ============================
       MFO Card Info Toggle
       ============================ */
    function initMfoDetails() {
        var toggles = document.querySelectorAll('.mfo-card__info-toggle');
        if (!toggles.length) return;

        toggles.forEach(function (btn) {
            btn.addEventListener('click', function () {
                var info = btn.closest('.mfo-card__info');
                var isOpen = info.classList.contains('is-open');

                if (isOpen) {
                    info.classList.remove('is-open');
                    btn.setAttribute('aria-expanded', 'false');
                } else {
                    info.classList.add('is-open');
                    btn.setAttribute('aria-expanded', 'true');
                }
            });
        });
    }

    /* ============================
       Affiliate Link Tracking
       Adds tracking params from pp.md
       and sets page slug dynamically
       ============================ */
    function initAffiliateTracking() {
        var path = window.location.pathname.replace(/^\/|\/$/g, '');
        var pageSlug = path ? path.replace(/\//g, '-') : 'glavnaya';

        var leadsNames = {
            '95cecac27d1faca720a8981dbc34748e': 'zaymer',
            '9b7c3f92632059651026c93817da5be4': 'bystrodengi',
            '4e60ee94de113b15d5fbc7bed4e6ed12': 'beri-beru',
            'f676af6bb07f68d706c6053669efcfbe': 'Credit7',
            '77307f82112c60903718f3a5208b16e2': 'layk-mani',
            'b5b01b9d38dc1fed50cd70ebdb5c05e7': 'Boostra',
            '1e72b15a212a832a32c5daa5b4734e25': 'BelkaCredit',
            '38d67604feb85b28ab4090610ea5bbba': 'srochno-dengi',
            'bc55d263b3dd36189299a5528d41e2d7': 'Hurmacredit',
            '7d30ad52043887efd2e33ee89ea41e62': 'umnyye-nalichnyye',
            '9d9fc0e645501c612c6cfa1055214b42': 'nado-deneg',
            '97d69622e4f8b11f0af2747944c4a311': 'dobrozaym',
            'df029d65324cad9b3579f8b1034cab21': 'OneClickMone',
            'a2b141f8039bcd39f2efcc172d6fd11c': 'fin5',
            '174ea44bddaf32da6dd1bfe047b83a80': 'dengi-srazu',
            '8bae555126c05cbc61c4c2f72d4eb3b6': 'svoi-lyudi',
            '05d217c2c615daf5286328e1249f9301': 'Krediska',
            '034e966f88817730c36d8275cae1b4dd': 'Zaymigo',
            '4f1a5e421ae9b0afb91d49ef85946fba': 'Joymoney'
        };

        var vldmntNames = {
            'ssm7xv7ihi': 'Moneyman-VIP',
            'snuwwxsc8v': 'laykzaym',
            's995xwjrn6': 'Kviku',
            'sgtta83y0f': 'Bunny-Money',
            'szhcpcvb8i': 'EcoZaym',
            's59sfd2drp': 'vebzaym',
            's03s3xmmdj': 'Max-Credit',
            'stjejc0nuh': 'grinmani-zaym-pod-0',
            's2sanlbasa': 'Ekapusta',
            'sqp7uapj7b': 'cash-to-you',
            's7h430n94n': 'nebus',
            's8uxolnvnr': 'do-zarplaty-ecom'
        };

        function addTracking(href) {
            if (href.indexOf('pxl.leads.su') !== -1) {
                if (href.indexOf('aff_sub1=') !== -1) {
                    return href.replace(/aff_sub1=[^&]+/, 'aff_sub1=' + pageSlug);
                }
                var m = href.match(/click\/([a-f0-9]+)/);
                if (m && leadsNames[m[1]]) {
                    return href.replace('?erid=', '?source=site&aff_sub1=' + pageSlug + '&aff_sub2=' + leadsNames[m[1]] + '&erid=');
                }
            }
            if (href.indexOf('vldmnt.ru') !== -1) {
                if (href.indexOf('subid3=') !== -1) {
                    return href.replace(/subid3=[^&]+/, 'subid3=' + pageSlug);
                }
                var m = href.match(/go\/([a-z0-9]+)/);
                if (m && vldmntNames[m[1]]) {
                    var base = href.split('?')[0];
                    return base + '?subid1=site&subid2=click2&subid3=' + pageSlug + '&subid4=' + vldmntNames[m[1]];
                }
            }
            return href;
        }

        var links = document.querySelectorAll('a[href*="pxl.leads.su"], a[href*="vldmnt.ru"]');
        for (var i = 0; i < links.length; i++) {
            links[i].href = addTracking(links[i].href);
        }

        document.addEventListener('mousedown', function(e) {
            var link = e.target.closest('a[href*="pxl.leads.su"], a[href*="vldmnt.ru"]');
            if (link) link.href = addTracking(link.href);
        });
    }

})();
