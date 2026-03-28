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
        initWalletSelector();
        initFAQ();
        initScrollTop();
        initCookieConsent();
        initSmoothScroll();
        initMfoToggle();
        initReviewsToggle();
        initMfoDetails();
        initMfoSort();
        initMfoSortButtons();
        initSortBar();
        initAffiliateTracking();
        initTermSlider();
        initFullCalculator();
        initBenefitCalc();
        initAutoEstimator();
        initPensionCalc();
        initStatusChecker();
        initDocChecker();
        initApprovalGauge();
        initBezOtkazaChecklist();
        initQuizWidget();
        initBudgetPlanner();
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
       Wallet Selector (na-elektronnyj-koshelek)
       Фильтрует карточки МФО по типу кошелька и сумме
       ============================ */
    function initWalletSelector() {
        var walletTypes = document.getElementById('wallet-types');
        var amountSlider = document.getElementById('wallet-amount');
        if (!walletTypes || !amountSlider) return;

        var amountDisplay = document.getElementById('wallet-amount-value');
        var matchCount = document.getElementById('wallet-match-count');
        var filterCount = document.getElementById('wallet-filter-count');
        var speedEl = document.getElementById('wallet-speed');
        var feeEl = document.getElementById('wallet-fee');
        var submitBtn = document.getElementById('wallet-submit-btn');
        var mfoGrid = document.getElementById('mfo-grid');
        var activeWallet = 'all';

        /* Данные о комиссиях и скорости по типу кошелька */
        var walletInfo = {
            all:      { speed: 'от 1 мин', fee: '0–1,6%' },
            qiwi:     { speed: 'от 1 мин', fee: '0–1%' },
            yoomoney: { speed: 'от 1 мин', fee: '0–0,5%' },
            webmoney: { speed: 'от 3 мин', fee: '0,8–1,6%' }
        };

        function formatNumber(n) {
            return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
        }

        function updateSliderFill(slider) {
            var min = parseFloat(slider.min);
            var max = parseFloat(slider.max);
            var val = parseFloat(slider.value);
            var pct = ((val - min) / (max - min)) * 100;
            slider.style.background = 'linear-gradient(to right, #FF6B35 0%, #FF6B35 ' + pct + '%, #E2E8F0 ' + pct + '%, #E2E8F0 100%)';
        }

        function walletMatches(cardWallet, selectedWallet) {
            if (selectedWallet === 'all') return true;
            if (cardWallet === 'all') return true;
            return cardWallet.indexOf(selectedWallet) !== -1;
        }

        function countMatching() {
            if (!mfoGrid) return 0;
            var cards = mfoGrid.querySelectorAll('.mfo-card');
            var amount = parseInt(amountSlider.value, 10);
            var count = 0;
            for (var i = 0; i < cards.length; i++) {
                var cardWallet = cards[i].getAttribute('data-wallet') || '';
                var cardAmount = parseInt(cards[i].getAttribute('data-amount'), 10) || 0;
                if (walletMatches(cardWallet, activeWallet) && amount <= cardAmount) {
                    count++;
                }
            }
            return count;
        }

        function applyFilter() {
            if (!mfoGrid) return;
            var cards = mfoGrid.querySelectorAll('.mfo-card');
            var amount = parseInt(amountSlider.value, 10);
            var visibleIdx = 0;
            for (var i = 0; i < cards.length; i++) {
                var cardWallet = cards[i].getAttribute('data-wallet') || '';
                var cardAmount = parseInt(cards[i].getAttribute('data-amount'), 10) || 0;
                var match = walletMatches(cardWallet, activeWallet) && amount <= cardAmount;
                if (match) {
                    cards[i].classList.remove('mfo-card--hidden-wallet');
                    cards[i].classList.remove('mfo-card--dimmed');
                    visibleIdx++;
                    var rank = cards[i].querySelector('.mfo-card__rank');
                    if (rank) rank.textContent = '#' + visibleIdx;
                } else {
                    cards[i].classList.add('mfo-card--hidden-wallet');
                }
            }
        }

        function update() {
            var amount = parseInt(amountSlider.value, 10);
            if (amountDisplay) amountDisplay.textContent = formatNumber(amount) + ' \u20BD';
            updateSliderFill(amountSlider);

            var count = countMatching();
            if (matchCount) matchCount.textContent = count;
            if (filterCount) filterCount.textContent = count;

            var info = walletInfo[activeWallet] || walletInfo.all;
            if (speedEl) speedEl.textContent = info.speed;
            if (feeEl) feeEl.textContent = info.fee;
        }

        /* Wallet type buttons */
        var btns = walletTypes.querySelectorAll('.wallet-type');
        for (var i = 0; i < btns.length; i++) {
            btns[i].addEventListener('click', function() {
                for (var j = 0; j < btns.length; j++) {
                    btns[j].classList.remove('wallet-type--active');
                }
                this.classList.add('wallet-type--active');
                activeWallet = this.getAttribute('data-wallet');
                update();
            });
        }

        /* Amount slider */
        amountSlider.addEventListener('input', update);

        /* Submit button — apply filter + scroll */
        if (submitBtn) {
            submitBtn.addEventListener('click', function(e) {
                e.preventDefault();
                applyFilter();
                var target = document.getElementById('mfo-rating');
                if (target) {
                    var headerHeight = document.querySelector('.header') ? document.querySelector('.header').offsetHeight : 0;
                    var top = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 16;
                    window.scrollTo({ top: top, behavior: 'smooth' });
                }
            });
        }

        /* Init */
        update();
    }

    /* ============================
       FAQ Accordion
       ============================ */
    function initFAQ() {
        var items = document.querySelectorAll('.faq-block__item');
        if (!items.length) return;

        items.forEach(function (item) {
            item.addEventListener('toggle', function () {
                if (!item.open) return;
                items.forEach(function (el) {
                    if (el !== item && el.open) el.open = false;
                });
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
        var defaultText = btn.textContent;

        btn.addEventListener('click', function () {
            expanded = !expanded;
            if (expanded) {
                extraGrid.classList.add('is-visible');
                btn.textContent = 'Скрыть';
            } else {
                extraGrid.classList.remove('is-visible');
                btn.textContent = defaultText;
                var section = document.getElementById('mfo-rating');
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

        var totalReviews = grid.querySelectorAll('.reviews__card, .review-card').length;
        var expanded = false;

        btn.textContent = 'Показать все ' + totalReviews + ' отзывов';

        btn.addEventListener('click', function () {
            expanded = !expanded;
            if (expanded) {
                grid.classList.add('reviews--expanded');
                btn.textContent = 'Скрыть отзывы';
            } else {
                grid.classList.remove('reviews--expanded');
                btn.textContent = 'Показать все ' + totalReviews + ' отзывов';
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
       MFO Sort Buttons (dolgosrochniy-zaym)
       ============================ */
    function initMfoSortButtons() {
        var sortContainer = document.getElementById('mfo-sort');
        if (!sortContainer) return;

        var btns = sortContainer.querySelectorAll('.mfo-sort__btn');
        if (!btns.length) return;

        var grid = document.getElementById('mfo-grid');
        if (!grid) return;

        function sortCards(sortKey) {
            var cards = [];
            var allCards = grid.querySelectorAll('.mfo-card');
            for (var i = 0; i < allCards.length; i++) {
                cards.push(allCards[i]);
            }

            cards.sort(function (a, b) {
                var aVal = parseFloat(a.getAttribute('data-' + sortKey)) || 0;
                var bVal = parseFloat(b.getAttribute('data-' + sortKey)) || 0;
                /* Ставка — по возрастанию (чем меньше, тем лучше) */
                if (sortKey === 'rate') return aVal - bVal;
                /* Срок и сумма — по убыванию (чем больше, тем лучше) */
                return bVal - aVal;
            });

            for (var j = 0; j < cards.length; j++) {
                var rank = cards[j].querySelector('.mfo-card__rank');
                if (rank) rank.textContent = '#' + (j + 1);
                grid.appendChild(cards[j]);
            }
        }

        for (var k = 0; k < btns.length; k++) {
            btns[k].addEventListener('click', (function (btn) {
                return function () {
                    for (var m = 0; m < btns.length; m++) {
                        btns[m].classList.remove('mfo-sort__btn--active');
                    }
                    btn.classList.add('mfo-sort__btn--active');
                    sortCards(btn.getAttribute('data-sort'));
                };
            })(btns[k]));
        }
    }

    /* ============================
       Sort Bar (bez-procentov rating header)
       ============================ */
    function initSortBar() {
        var bar = document.querySelector('.sort-bar');
        if (!bar) return;

        var btns = bar.querySelectorAll('.sort-bar__btn');
        if (!btns.length) return;

        var grid = document.getElementById('mfo-grid');
        if (!grid) return;

        function sortCards(sortKey) {
            var cards = Array.prototype.slice.call(grid.querySelectorAll('.mfo-card'));

            cards.sort(function (a, b) {
                var aVal = parseFloat(a.getAttribute('data-' + sortKey)) || 0;
                var bVal = parseFloat(b.getAttribute('data-' + sortKey)) || 0;
                if (sortKey === 'rate') return aVal - bVal;
                return bVal - aVal;
            });

            for (var j = 0; j < cards.length; j++) {
                var rank = cards[j].querySelector('.mfo-card__rank');
                if (rank) rank.textContent = '#' + (j + 1);
                grid.appendChild(cards[j]);
            }
        }

        for (var k = 0; k < btns.length; k++) {
            btns[k].addEventListener('click', (function (btn) {
                return function () {
                    for (var m = 0; m < btns.length; m++) {
                        btns[m].classList.remove('sort-bar__btn--active');
                    }
                    btn.classList.add('sort-bar__btn--active');
                    sortCards(btn.getAttribute('data-sort'));
                };
            })(btns[k]));
        }
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
       Benefit Compare Calculator
       ============================ */
    function initBenefitCalc() {
        var amountSlider = document.getElementById('benefit-amount');
        var termSlider = document.getElementById('benefit-term');
        if (!amountSlider || !termSlider) return;

        var amountLabel = document.getElementById('benefit-amount-value');
        var termLabel = document.getElementById('benefit-term-value');
        var approvalWithout = document.getElementById('bc-approval-without');
        var approvalWith = document.getElementById('bc-approval-with');
        var countWithout = document.getElementById('bc-count-without');
        var countWith = document.getElementById('bc-count-with');
        var timeWithout = document.getElementById('bc-time-without');
        var timeWith = document.getElementById('bc-time-with');
        var bestMfo = document.getElementById('bc-best-mfo');
        var bestBonus = document.getElementById('bc-best-bonus');
        var matchCount = document.getElementById('bc-match-count');

        /* Реальные данные 9 МФО: max — макс. сумма, term — макс. срок (дни) */
        var mfoList = [
            { name: 'Займер',       max: 30000,  term: 30,  bonus: '+5 000 ₽ к сумме, 0%',   approvalBoost: 70 },
            { name: 'Быстроденьги', max: 100000, term: 180, bonus: 'до 100 000 ₽, 0%',       approvalBoost: 60 },
            { name: 'Лайк Мани',    max: 100000, term: 180, bonus: '+90% одобрение, 0%',      approvalBoost: 90 },
            { name: 'Надо Денег',   max: 100000, term: 168, bonus: '+4 000 ₽ к сумме, 0%',   approvalBoost: 65 },
            { name: 'ДоброЗайм',   max: 100000, term: 720, bonus: 'до 720 дней, 0%',        approvalBoost: 55 },
            { name: 'Вебзайм',     max: 30000,  term: 30,  bonus: '+40% одобрение, 0%',      approvalBoost: 40 },
            { name: 'еКапуста',    max: 30000,  term: 30,  bonus: 'рейтинг 4.9, 0%',        approvalBoost: 35 },
            { name: 'КэшТуЮ',     max: 30000,  term: 31,  bonus: 'увелич. лимит',           approvalBoost: 45 },
            { name: 'До зарплаты', max: 30000,  term: 180, bonus: 'до 180 дней, 0%',        approvalBoost: 50 }
        ];

        function fmt(n) {
            return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' ₽';
        }

        function termFmt(d) {
            if (d < 30) return d + ' ' + declDays(d);
            var m = Math.floor(d / 30);
            var extra = d % 30;
            if (extra === 0) return m + ' мес.';
            return m + ' мес. ' + extra + ' дн.';
        }

        function declDays(n) {
            var a = n % 10, b = n % 100;
            if (a === 1 && b !== 11) return 'день';
            if (a >= 2 && a <= 4 && (b < 10 || b >= 20)) return 'дня';
            return 'дней';
        }

        function update() {
            var amount = parseInt(amountSlider.value, 10);
            var term = parseInt(termSlider.value, 10);
            amountLabel.textContent = fmt(amount);
            termLabel.textContent = termFmt(term);

            /* Подходящие МФО: сумма <= max И срок <= term */
            var matched = [];
            for (var i = 0; i < mfoList.length; i++) {
                if (amount <= mfoList[i].max && term <= mfoList[i].term) {
                    matched.push(mfoList[i]);
                }
            }
            var matchedCount = matched.length;

            /* Без Госуслуг — одобрение зависит от суммы */
            var approvalW;
            if (amount <= 10000) approvalW = 50;
            else if (amount <= 30000) approvalW = 40;
            else if (amount <= 50000) approvalW = 30;
            else approvalW = 25;
            approvalWithout.textContent = '~' + approvalW + '%';

            /* Без Госуслуг: все МФО подходящие по сумме+сроку доступны */
            countWithout.textContent = matchedCount;

            var timeW = amount <= 15000 ? '15–25 мин' : amount <= 50000 ? '20–30 мин' : '25–40 мин';
            timeWithout.textContent = timeW;

            /* С Госуслугами — одобрение выше */
            var approvalG;
            if (amount <= 10000) approvalG = 95;
            else if (amount <= 30000) approvalG = 90;
            else if (amount <= 50000) approvalG = 80;
            else approvalG = 70;
            approvalWith.textContent = 'до ' + approvalG + '%';

            countWith.textContent = matchedCount;

            var timeG = amount <= 15000 ? '2–3 мин' : amount <= 50000 ? '3–5 мин' : '5–10 мин';
            timeWith.textContent = timeG;

            /* Лучшее предложение — выбираем по релевантности к запросу */
            if (matchedCount > 0) {
                var best = matched[0];
                var bestScore = -1;
                for (var j = 0; j < matched.length; j++) {
                    var m = matched[j];
                    var score = 0;
                    /* Бонус за точное попадание по сумме (чем ближе max к запросу — тем лучше) */
                    var amountFit = 1 - Math.abs(m.max - amount) / 100000;
                    score += amountFit * 40;
                    /* Бонус за попадание по сроку */
                    var termFit = 1 - Math.abs(m.term - term) / 720;
                    score += termFit * 30;
                    /* Базовый бонус Госуслуг */
                    score += m.approvalBoost * 0.3;
                    /* Малая сумма ≤15к — приоритет Займер (+5к) и Вебзайм (+40%) */
                    if (amount <= 15000 && (m.name === 'Займер' || m.name === 'Вебзайм')) score += 15;
                    /* Средняя сумма 15-30к — приоритет КэшТуЮ и еКапуста */
                    if (amount > 15000 && amount <= 30000 && (m.name === 'КэшТуЮ' || m.name === 'еКапуста')) score += 12;
                    /* Большая сумма >30к — приоритет Надо Денег и Быстроденьги */
                    if (amount > 30000 && (m.name === 'Надо Денег' || m.name === 'Быстроденьги')) score += 15;
                    /* Длинный срок >60 — приоритет До зарплаты и ДоброЗайм */
                    if (term > 60 && (m.name === 'До зарплаты' || m.name === 'ДоброЗайм')) score += 15;
                    /* Очень длинный срок >180 — ДоброЗайм явный лидер */
                    if (term > 180 && m.name === 'ДоброЗайм') score += 20;
                    /* Короткий срок ≤14 — приоритет Вебзайм (0% до 14 дн) */
                    if (term <= 14 && m.name === 'Вебзайм') score += 18;
                    /* Средний срок 31-90 — приоритет Надо Денег */
                    if (term > 30 && term <= 90 && m.name === 'Надо Денег') score += 12;
                    if (score > bestScore) {
                        bestScore = score;
                        best = m;
                    }
                }
                bestMfo.textContent = best.name;
                bestBonus.textContent = best.bonus;
            } else {
                bestMfo.textContent = 'ДоброЗайм';
                bestBonus.textContent = 'до 720 дней, макс. срок';
            }

            matchCount.textContent = matchedCount > 0 ? matchedCount : 9;
        }

        amountSlider.addEventListener('input', update);
        termSlider.addEventListener('input', update);
        update();
    }

    /* ============================
       Auto Estimator — Оценка залоговой стоимости авто
       База средних рыночных цен РФ (2025–2026)
       Алгоритм: базовая цена модели (нового авто) → коэфф. года → коэфф. пробега
       ============================ */
    function initAutoEstimator() {
        var brandSelect = document.getElementById('car-brand');
        var modelSelect = document.getElementById('car-model');
        var yearSelect = document.getElementById('car-year');
        var mileageInput = document.getElementById('car-mileage');
        var mileageLabel = document.getElementById('mileage-value');
        var carValueEl = document.getElementById('est-car-value');
        var loanValueEl = document.getElementById('est-loan-value');
        if (!brandSelect || !modelSelect) return;

        /* ========== База данных: марки → модели → базовая цена нового (тыс. ₽) ========== */
        var carDB = {
            lada: {
                name: 'LADA (ВАЗ)',
                models: {
                    granta:    { name: 'Granta',         price: 750 },
                    vesta:     { name: 'Vesta',          price: 1250 },
                    vesta_sw:  { name: 'Vesta SW Cross', price: 1450 },
                    niva:      { name: 'Niva Travel',    price: 1200 },
                    niva_leg:  { name: 'Niva Legend',    price: 850 },
                    largus:    { name: 'Largus',         price: 1100 },
                    priora:    { name: 'Priora',         price: 550 },
                    kalina:    { name: 'Kalina',         price: 500 },
                    x_ray:     { name: 'XRAY',           price: 1100 }
                }
            },
            kia: {
                name: 'Kia',
                models: {
                    rio:       { name: 'Rio',            price: 1600 },
                    ceed:      { name: 'Ceed',           price: 2000 },
                    cerato:    { name: 'Cerato',         price: 1900 },
                    sportage:  { name: 'Sportage',       price: 2800 },
                    sorento:   { name: 'Sorento',        price: 3500 },
                    k5:        { name: 'K5',             price: 2500 },
                    seltos:    { name: 'Seltos',         price: 2200 },
                    soul:      { name: 'Soul',           price: 1800 },
                    optima:    { name: 'Optima',         price: 2200 },
                    mohave:    { name: 'Mohave',         price: 4200 }
                }
            },
            hyundai: {
                name: 'Hyundai',
                models: {
                    solaris:   { name: 'Solaris',        price: 1500 },
                    creta:     { name: 'Creta',          price: 2200 },
                    tucson:    { name: 'Tucson',         price: 2900 },
                    santa_fe:  { name: 'Santa Fe',       price: 3800 },
                    elantra:   { name: 'Elantra',        price: 2000 },
                    sonata:    { name: 'Sonata',         price: 2700 },
                    ix35:      { name: 'ix35',           price: 1800 },
                    accent:    { name: 'Accent',         price: 1200 },
                    palisade:  { name: 'Palisade',       price: 5000 }
                }
            },
            toyota: {
                name: 'Toyota',
                models: {
                    camry:     { name: 'Camry',          price: 3200 },
                    corolla:   { name: 'Corolla',        price: 2300 },
                    rav4:      { name: 'RAV4',           price: 3500 },
                    land_cruiser: { name: 'Land Cruiser 300', price: 8500 },
                    land_cruiser_prado: { name: 'Land Cruiser Prado', price: 5500 },
                    hilux:     { name: 'Hilux',          price: 3800 },
                    fortuner:  { name: 'Fortuner',       price: 4200 },
                    alphard:   { name: 'Alphard',        price: 6000 },
                    highlander:{ name: 'Highlander',     price: 4500 }
                }
            },
            volkswagen: {
                name: 'Volkswagen',
                models: {
                    polo:      { name: 'Polo',           price: 1700 },
                    tiguan:    { name: 'Tiguan',         price: 3200 },
                    golf:      { name: 'Golf',           price: 2500 },
                    passat:    { name: 'Passat',         price: 2800 },
                    touareg:   { name: 'Touareg',        price: 5500 },
                    jetta:     { name: 'Jetta',          price: 2100 },
                    taos:      { name: 'Taos',           price: 2600 },
                    teramont:  { name: 'Teramont',       price: 4200 }
                }
            },
            skoda: {
                name: 'Škoda',
                models: {
                    rapid:     { name: 'Rapid',          price: 1600 },
                    octavia:   { name: 'Octavia',        price: 2400 },
                    kodiaq:    { name: 'Kodiaq',         price: 3200 },
                    karoq:     { name: 'Karoq',          price: 2600 },
                    superb:    { name: 'Superb',         price: 3000 },
                    fabia:     { name: 'Fabia',          price: 1400 }
                }
            },
            renault: {
                name: 'Renault',
                models: {
                    logan:     { name: 'Logan',          price: 1200 },
                    sandero:   { name: 'Sandero',        price: 1300 },
                    duster:    { name: 'Duster',         price: 1800 },
                    kaptur:    { name: 'Kaptur',         price: 1900 },
                    arkana:    { name: 'Arkana',         price: 2100 },
                    koleos:    { name: 'Koleos',         price: 2600 },
                    megane:    { name: 'Megane',         price: 1700 },
                    fluence:   { name: 'Fluence',        price: 1300 }
                }
            },
            nissan: {
                name: 'Nissan',
                models: {
                    qashqai:   { name: 'Qashqai',       price: 2500 },
                    x_trail:   { name: 'X-Trail',        price: 2800 },
                    almera:    { name: 'Almera',         price: 1100 },
                    juke:      { name: 'Juke',           price: 1700 },
                    murano:    { name: 'Murano',         price: 3500 },
                    patrol:    { name: 'Patrol',         price: 6000 },
                    teana:     { name: 'Teana',          price: 2000 },
                    terrano:   { name: 'Terrano',        price: 1500 },
                    pathfinder:{ name: 'Pathfinder',     price: 3000 }
                }
            },
            bmw: {
                name: 'BMW',
                models: {
                    series3:   { name: '3 серия',        price: 4000 },
                    series5:   { name: '5 серия',        price: 5500 },
                    series7:   { name: '7 серия',        price: 8500 },
                    x1:        { name: 'X1',             price: 3800 },
                    x3:        { name: 'X3',             price: 5000 },
                    x5:        { name: 'X5',             price: 7000 },
                    x6:        { name: 'X6',             price: 7500 },
                    series1:   { name: '1 серия',        price: 2800 },
                    x7:        { name: 'X7',             price: 9500 }
                }
            },
            mercedes: {
                name: 'Mercedes-Benz',
                models: {
                    c_class:   { name: 'C-Class',        price: 4500 },
                    e_class:   { name: 'E-Class',        price: 6000 },
                    s_class:   { name: 'S-Class',        price: 11000 },
                    a_class:   { name: 'A-Class',        price: 3200 },
                    gle:       { name: 'GLE',            price: 8000 },
                    glc:       { name: 'GLC',            price: 5500 },
                    gls:       { name: 'GLS',            price: 10000 },
                    cla:       { name: 'CLA',            price: 3800 },
                    glb:       { name: 'GLB',            price: 4200 }
                }
            },
            audi: {
                name: 'Audi',
                models: {
                    a3:        { name: 'A3',             price: 3200 },
                    a4:        { name: 'A4',             price: 4000 },
                    a6:        { name: 'A6',             price: 5500 },
                    a8:        { name: 'A8',             price: 8500 },
                    q3:        { name: 'Q3',             price: 3800 },
                    q5:        { name: 'Q5',             price: 5000 },
                    q7:        { name: 'Q7',             price: 7000 },
                    q8:        { name: 'Q8',             price: 8000 }
                }
            },
            mazda: {
                name: 'Mazda',
                models: {
                    mazda3:    { name: 'Mazda3',         price: 2200 },
                    mazda6:    { name: 'Mazda6',         price: 2700 },
                    cx5:       { name: 'CX-5',           price: 2800 },
                    cx9:       { name: 'CX-9',           price: 3800 },
                    cx30:      { name: 'CX-30',          price: 2400 },
                    cx3:       { name: 'CX-3',           price: 1800 }
                }
            },
            ford: {
                name: 'Ford',
                models: {
                    focus:     { name: 'Focus',          price: 1700 },
                    mondeo:    { name: 'Mondeo',         price: 2200 },
                    kuga:      { name: 'Kuga',           price: 2500 },
                    explorer:  { name: 'Explorer',       price: 4500 },
                    fiesta:    { name: 'Fiesta',         price: 1300 },
                    ecosport:  { name: 'EcoSport',       price: 1600 }
                }
            },
            chevrolet: {
                name: 'Chevrolet',
                models: {
                    cruze:     { name: 'Cruze',          price: 1400 },
                    aveo:      { name: 'Aveo',           price: 1000 },
                    niva:      { name: 'Niva',           price: 1300 },
                    captiva:   { name: 'Captiva',        price: 2000 },
                    lacetti:   { name: 'Lacetti',        price: 900 },
                    cobalt:    { name: 'Cobalt',         price: 1000 },
                    tahoe:     { name: 'Tahoe',          price: 6000 },
                    trailblazer:{ name: 'TrailBlazer',   price: 2400 }
                }
            },
            mitsubishi: {
                name: 'Mitsubishi',
                models: {
                    outlander: { name: 'Outlander',      price: 2800 },
                    asx:       { name: 'ASX',            price: 2200 },
                    pajero:    { name: 'Pajero',         price: 3200 },
                    pajero_sport:{ name: 'Pajero Sport', price: 3500 },
                    lancer:    { name: 'Lancer',         price: 1300 },
                    l200:      { name: 'L200',           price: 3000 },
                    eclipse:   { name: 'Eclipse Cross',  price: 2500 }
                }
            },
            honda: {
                name: 'Honda',
                models: {
                    civic:     { name: 'Civic',          price: 2100 },
                    accord:    { name: 'Accord',         price: 2600 },
                    crv:       { name: 'CR-V',           price: 3000 },
                    hrv:       { name: 'HR-V',           price: 2200 },
                    pilot:     { name: 'Pilot',          price: 4000 },
                    fit:       { name: 'Fit / Jazz',     price: 1200 }
                }
            },
            subaru: {
                name: 'Subaru',
                models: {
                    forester:  { name: 'Forester',       price: 3200 },
                    outback:   { name: 'Outback',        price: 3500 },
                    xv:        { name: 'XV',             price: 2800 },
                    impreza:   { name: 'Impreza',        price: 2200 },
                    legacy:    { name: 'Legacy',         price: 2500 }
                }
            },
            lexus: {
                name: 'Lexus',
                models: {
                    rx:        { name: 'RX',             price: 5500 },
                    nx:        { name: 'NX',             price: 4200 },
                    es:        { name: 'ES',             price: 4500 },
                    lx:        { name: 'LX',             price: 9000 },
                    is:        { name: 'IS',             price: 4000 },
                    gx:        { name: 'GX',             price: 6500 }
                }
            },
            volvo: {
                name: 'Volvo',
                models: {
                    xc60:      { name: 'XC60',           price: 4500 },
                    xc90:      { name: 'XC90',           price: 6000 },
                    xc40:      { name: 'XC40',           price: 3800 },
                    s60:       { name: 'S60',            price: 3500 },
                    s90:       { name: 'S90',            price: 4800 },
                    v60:       { name: 'V60',            price: 3800 }
                }
            },
            suzuki: {
                name: 'Suzuki',
                models: {
                    vitara:    { name: 'Vitara',         price: 2100 },
                    sx4:       { name: 'SX4',            price: 1600 },
                    jimny:     { name: 'Jimny',          price: 2400 },
                    swift:     { name: 'Swift',          price: 1400 },
                    grand_vitara:{ name: 'Grand Vitara', price: 2600 }
                }
            },
            peugeot: {
                name: 'Peugeot',
                models: {
                    p308:      { name: '308',            price: 1800 },
                    p408:      { name: '408',            price: 2000 },
                    p3008:     { name: '3008',           price: 2500 },
                    p5008:     { name: '5008',           price: 2800 },
                    p208:      { name: '208',            price: 1500 }
                }
            },
            citroen: {
                name: 'Citroën',
                models: {
                    c4:        { name: 'C4',             price: 1800 },
                    c5_air:    { name: 'C5 Aircross',    price: 2600 },
                    c3_air:    { name: 'C3 Aircross',    price: 2000 },
                    berlingo:  { name: 'Berlingo',       price: 1700 }
                }
            },
            uaz: {
                name: 'УАЗ',
                models: {
                    patriot:   { name: 'Patriot',        price: 1400 },
                    hunter:    { name: 'Hunter',         price: 1000 },
                    pickup:    { name: 'Pickup',         price: 1300 },
                    bukhanka:  { name: 'Буханка',        price: 900 }
                }
            },
            gaz: {
                name: 'ГАЗ',
                models: {
                    gazel:     { name: 'ГАЗель Next',    price: 1800 },
                    gazel_nn:  { name: 'ГАЗель NN',      price: 2500 },
                    sobol:     { name: 'Соболь',         price: 1300 },
                    volga:     { name: 'Волга',          price: 600 }
                }
            },
            chery: {
                name: 'Chery',
                models: {
                    tiggo4:    { name: 'Tiggo 4',        price: 1900 },
                    tiggo7:    { name: 'Tiggo 7 Pro',    price: 2400 },
                    tiggo8:    { name: 'Tiggo 8 Pro',    price: 2900 },
                    arrizo8:   { name: 'Arrizo 8',       price: 2300 }
                }
            },
            haval: {
                name: 'Haval',
                models: {
                    jolion:    { name: 'Jolion',         price: 1900 },
                    f7:        { name: 'F7 / F7x',      price: 2300 },
                    h9:        { name: 'H9',             price: 3500 },
                    dargo:     { name: 'Dargo',          price: 2800 },
                    m6:        { name: 'M6',             price: 1600 }
                }
            },
            geely: {
                name: 'Geely',
                models: {
                    coolray:   { name: 'Coolray',        price: 1900 },
                    atlas:     { name: 'Atlas Pro',      price: 2200 },
                    monjaro:   { name: 'Monjaro',        price: 3200 },
                    emgrand:   { name: 'Emgrand',        price: 1500 },
                    tugella:   { name: 'Tugella',        price: 2600 }
                }
            },
            changan: {
                name: 'Changan',
                models: {
                    cs35:      { name: 'CS35 Plus',      price: 1700 },
                    cs55:      { name: 'CS55 Plus',      price: 2100 },
                    cs75:      { name: 'CS75 Plus',      price: 2500 },
                    uni_v:     { name: 'UNI-V',          price: 2200 },
                    uni_k:     { name: 'UNI-K',          price: 2800 }
                }
            },
            omoda: {
                name: 'OMODA',
                models: {
                    c5:        { name: 'C5',             price: 2200 },
                    s5:        { name: 'S5',             price: 2000 }
                }
            },
            exeed: {
                name: 'EXEED',
                models: {
                    txl:       { name: 'TXL',            price: 3000 },
                    vx:        { name: 'VX',             price: 3800 },
                    lx:        { name: 'LX',             price: 2500 }
                }
            },
            other: {
                name: 'Другая марка',
                models: {
                    sedan:     { name: 'Седан (средний)', price: 1500 },
                    suv:       { name: 'Кроссовер/SUV',  price: 2200 },
                    premium:   { name: 'Премиум',        price: 4000 },
                    economy:   { name: 'Эконом',         price: 800 },
                    minivan:   { name: 'Минивэн',        price: 2500 },
                    truck:     { name: 'Пикап/грузовой', price: 2000 }
                }
            }
        };

        /* ========== Заполняем <select> марок ========== */
        var brandKeys = Object.keys(carDB);
        for (var i = 0; i < brandKeys.length; i++) {
            var opt = document.createElement('option');
            opt.value = brandKeys[i];
            opt.textContent = carDB[brandKeys[i]].name;
            brandSelect.appendChild(opt);
        }

        /* ========== При смене марки — заполняем модели ========== */
        brandSelect.addEventListener('change', function () {
            var brandKey = brandSelect.value;
            modelSelect.innerHTML = '';

            if (!brandKey || !carDB[brandKey]) {
                modelSelect.disabled = true;
                var ph = document.createElement('option');
                ph.value = '';
                ph.textContent = 'Сначала выберите марку';
                modelSelect.appendChild(ph);
                calculate();
                return;
            }

            modelSelect.disabled = false;
            var defOpt = document.createElement('option');
            defOpt.value = '';
            defOpt.textContent = 'Выберите модель';
            modelSelect.appendChild(defOpt);

            var models = carDB[brandKey].models;
            var modelKeys = Object.keys(models);
            for (var j = 0; j < modelKeys.length; j++) {
                var mOpt = document.createElement('option');
                mOpt.value = modelKeys[j];
                mOpt.textContent = models[modelKeys[j]].name;
                modelSelect.appendChild(mOpt);
            }
            calculate();
        });

        /* ========== Алгоритм расчёта ========== */
        /*
         * 1. Берём базовую цену модели (цена нового авто, тыс. ₽)
         * 2. Применяем коэффициент амортизации по году выпуска:
         *    - Каждый год авто теряет ~8–12% стоимости
         *    - Первый год — максимальная потеря (~15%), далее замедляется
         *    - Формула: K_год = e^(-0.09 × возраст) — экспоненциальная амортизация
         *    - Минимум: 12% от новой цены для 20-летних авто
         * 3. Применяем коэффициент по пробегу:
         *    - Средний пробег ~15 тыс. км/год
         *    - Если пробег выше нормы — снижение, ниже — бонус
         *    - Формула: K_пробег = max(0.5, 1 - (пробег - норма) × 0.001)
         * 4. Итог: цена = базовая × K_год × K_пробег
         * 5. Максимальный займ = 80% от оценки
         */
        function calculate() {
            var brandKey = brandSelect.value;
            var modelKey = modelSelect.value;
            var yearVal = parseInt(yearSelect.value, 10);
            var mileage = parseInt(mileageInput.value, 10);

            /* Обновляем лейбл пробега */
            mileageLabel.textContent = mileage + ' тыс. км';

            /* Если не все поля заполнены — показываем прочерк */
            if (!brandKey || !modelKey || !yearVal) {
                carValueEl.textContent = '— ₽';
                loanValueEl.textContent = '— ₽';
                return;
            }

            var brand = carDB[brandKey];
            if (!brand || !brand.models[modelKey]) return;

            var basePrice = brand.models[modelKey].price; /* тыс. ₽ */
            var currentYear = 2026;
            var age = currentYear - yearVal;
            if (age < 0) age = 0;

            /* Коэффициент амортизации по году */
            var kYear;
            if (age === 0) {
                kYear = 0.95; /* Почти новый, лёгкая скидка */
            } else if (age === 1) {
                kYear = 0.82; /* Первый год — максимальная потеря */
            } else {
                /* Экспоненциальная амортизация: ~9% в год */
                kYear = Math.exp(-0.09 * age);
                /* Минимум 12% от новой цены */
                if (kYear < 0.12) kYear = 0.12;
            }

            /* Коэффициент по пробегу */
            /* Нормальный пробег = 15 тыс. км/год × возраст (мин. 1 год) */
            var normalMileage = Math.max(15, 15 * Math.max(age, 1));
            var mileageDiff = mileage - normalMileage; /* тыс. км отклонения */

            var kMileage;
            if (mileageDiff <= 0) {
                /* Пробег ниже нормы — небольшой бонус (макс. +10%) */
                kMileage = 1 + Math.min(0.10, Math.abs(mileageDiff) * 0.002);
            } else {
                /* Пробег выше нормы — снижение */
                kMileage = 1 - mileageDiff * 0.0015;
                if (kMileage < 0.50) kMileage = 0.50;
            }

            /* Премиум-марки меньше теряют в цене */
            var premiumBrands = ['bmw', 'mercedes', 'audi', 'lexus', 'volvo'];
            if (premiumBrands.indexOf(brandKey) !== -1 && age > 2) {
                kYear *= 1.08; /* +8% удержание стоимости */
                if (kYear > 0.95) kYear = 0.95;
            }

            /* Toyota / Lexus — лучшая ликвидность */
            if (brandKey === 'toyota' || brandKey === 'lexus') {
                kYear *= 1.05;
                if (kYear > 0.95) kYear = 0.95;
            }

            /* Китайские авто — быстрее теряют */
            var chineseBrands = ['chery', 'haval', 'geely', 'changan', 'omoda', 'exeed'];
            if (chineseBrands.indexOf(brandKey) !== -1 && age > 1) {
                kYear *= 0.92;
            }

            /* Итоговая цена */
            var estimatedPrice = Math.round(basePrice * kYear * kMileage);
            /* Округляем до 10 тыс. */
            estimatedPrice = Math.round(estimatedPrice / 10) * 10;
            if (estimatedPrice < 50) estimatedPrice = 50; /* Минимум 50 тыс. ₽ */

            var maxLoan = Math.round(estimatedPrice * 0.8 / 10) * 10;

            carValueEl.textContent = formatPrice(estimatedPrice) + ' ₽';
            loanValueEl.textContent = formatPrice(maxLoan) + ' ₽';

            /* Сохраняем для кнопки фильтрации */
            currentLoanAmount = maxLoan * 1000; /* в рублях */
        }

        var currentLoanAmount = 0;

        function formatPrice(thousands) {
            /* thousands — в тысячах рублей, конвертируем в рубли */
            var rub = thousands * 1000;
            return rub.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
        }

        /* ========== Кнопка «Показать подходящие компании» ========== */
        var ctaBtn = document.querySelector('.auto-estimator .btn--primary');
        if (ctaBtn) {
            ctaBtn.addEventListener('click', function (e) {
                e.preventDefault();
                var cards = document.querySelectorAll('.mfo-card');
                if (!cards.length) return;

                var hasMatch = false;

                for (var c = 0; c < cards.length; c++) {
                    var card = cards[c];
                    var cardMax = parseInt(card.getAttribute('data-amount'), 10) || 0;

                    if (currentLoanAmount > 0 && cardMax >= currentLoanAmount) {
                        /* Подходит — подсвечиваем */
                        card.classList.add('mfo-card--match');
                        card.classList.remove('mfo-card--dimmed');
                        hasMatch = true;
                    } else if (currentLoanAmount > 0) {
                        /* Не подходит — приглушаем */
                        card.classList.add('mfo-card--dimmed');
                        card.classList.remove('mfo-card--match');
                    } else {
                        /* Нет расчёта — всё обычное */
                        card.classList.remove('mfo-card--match', 'mfo-card--dimmed');
                    }
                }

                /* Если ничего не подошло — показать все без фильтра */
                if (!hasMatch && currentLoanAmount > 0) {
                    for (var d = 0; d < cards.length; d++) {
                        cards[d].classList.remove('mfo-card--dimmed', 'mfo-card--match');
                    }
                }

                /* Скролл к рейтингу */
                var target = document.getElementById('mfo-rating');
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        }

        /* ========== Слушатели событий ========== */
        modelSelect.addEventListener('change', calculate);
        yearSelect.addEventListener('change', calculate);
        mileageInput.addEventListener('input', calculate);
        calculate();
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

    /* ============================
       Term Slider (долгосрочный займ — hero)
       Читает данные МФО из DOM, рассчитывает
       переплату и подбирает лучшее предложение
       ============================ */
    function initTermSlider() {
        var amountSlider = document.getElementById('long-amount');
        var termSlider = document.getElementById('long-term');
        if (!amountSlider || !termSlider) return;

        var amountDisplay = document.getElementById('long-amount-value');
        var termDisplay = document.getElementById('long-term-value');
        var totalEl = document.getElementById('term-total');
        var overpayEl = document.getElementById('term-overpay');
        var overpayMinEl = document.getElementById('term-overpay-min');
        var rateEl = document.getElementById('term-rate');
        var countEl = document.getElementById('term-filter-count');
        var showBtn = document.getElementById('term-show-btn');
        var grid = document.getElementById('mfo-grid');

        function formatNum(n) {
            return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
        }

        function calcOverpay(amount, days, ratePct) {
            var interest = Math.round(amount * (ratePct / 100) * days);
            var cap = Math.round(amount * 1.3);
            if (interest > cap) interest = cap;
            return interest;
        }

        function getMatching(amount, days) {
            if (!grid) return [];
            var cards = grid.querySelectorAll('.mfo-card');
            var result = [];
            for (var i = 0; i < cards.length; i++) {
                var maxAmt = parseInt(cards[i].getAttribute('data-amount'), 10) || 0;
                var maxTerm = parseInt(cards[i].getAttribute('data-term'), 10) || 0;
                if (amount <= maxAmt && days <= maxTerm) {
                    result.push(cards[i]);
                }
            }
            return result;
        }

        function update() {
            var amount = parseInt(amountSlider.value, 10);
            var months = parseInt(termSlider.value, 10);
            var days = months * 30;

            if (amountDisplay) amountDisplay.textContent = formatNum(amount) + ' ₽';
            if (termDisplay) termDisplay.textContent = months + ' мес.';

            var matching = getMatching(amount, days);
            var count = matching.length;

            /* Найти мин/макс ставки среди подходящих */
            var minRate = 999;
            var maxRate = 0;
            for (var i = 0; i < matching.length; i++) {
                var r = parseFloat(matching[i].getAttribute('data-rate')) || 0;
                if (r < minRate) minRate = r;
                if (r > maxRate) maxRate = r;
            }
            if (count === 0) { minRate = 0; maxRate = 0.8; }

            var overpayMin = calcOverpay(amount, days, minRate);
            var overpayMax = calcOverpay(amount, days, maxRate);
            var totalMin = amount + overpayMin;
            var totalMax = amount + overpayMax;

            if (count === 0) {
                if (overpayMinEl) overpayMinEl.textContent = '—';
                if (overpayEl) overpayEl.textContent = '—';
                if (totalEl) totalEl.textContent = '—';
                if (rateEl) rateEl.textContent = 'Нет подходящих МФО';
            } else {
                if (overpayMinEl) overpayMinEl.textContent = formatNum(overpayMin) + ' ₽';
                if (overpayEl) overpayEl.textContent = formatNum(overpayMax) + ' ₽';
                if (totalEl) {
                    if (totalMin === totalMax) {
                        totalEl.textContent = formatNum(totalMax) + ' ₽';
                    } else {
                        totalEl.textContent = formatNum(totalMin) + ' – ' + formatNum(totalMax) + ' ₽';
                    }
                }
                if (rateEl) {
                    var minStr = minRate.toString().replace('.', ',');
                    var maxStr = maxRate.toString().replace('.', ',');
                    if (minRate === maxRate) {
                        rateEl.textContent = minStr + '% / день';
                    } else {
                        rateEl.textContent = 'от ' + minStr + '% до ' + maxStr + '% / день';
                    }
                }
            }

            if (countEl) countEl.textContent = count;

            /* Убрать затемнение при изменении слайдера */
            if (grid) {
                var all = grid.querySelectorAll('.mfo-card');
                for (var j = 0; j < all.length; j++) {
                    all[j].classList.remove('mfo-card--dimmed');
                }
            }
        }

        /* Кнопка: показать подходящие МФО */
        if (showBtn) {
            showBtn.addEventListener('click', function(e) {
                e.preventDefault();
                var amount = parseInt(amountSlider.value, 10);
                var months = parseInt(termSlider.value, 10);
                var days = months * 30;

                if (grid) {
                    var allCards = grid.querySelectorAll('.mfo-card');
                    for (var i = 0; i < allCards.length; i++) {
                        var maxAmt = parseInt(allCards[i].getAttribute('data-amount'), 10) || 0;
                        var maxTerm = parseInt(allCards[i].getAttribute('data-term'), 10) || 0;
                        if (amount <= maxAmt && days <= maxTerm) {
                            allCards[i].classList.remove('mfo-card--dimmed');
                        } else {
                            allCards[i].classList.add('mfo-card--dimmed');
                        }
                    }
                }

                var target = document.getElementById('mfo-rating');
                if (target) {
                    var hdr = document.querySelector('.header');
                    var hH = hdr ? hdr.offsetHeight : 0;
                    var top = target.getBoundingClientRect().top + window.pageYOffset - hH - 16;
                    window.scrollTo({ top: top, behavior: 'smooth' });
                }
            });
        }

        amountSlider.addEventListener('input', update);
        termSlider.addEventListener('input', update);
        update();
    }

    /* ============================
       Full Calculator (долгосрочный займ — помесячный график)
       ============================ */
    function initFullCalculator() {
        var amountInput = document.getElementById('calc-amount');
        var daysInput = document.getElementById('calc-days');
        var rateInput = document.getElementById('calc-rate');
        var calcBtn = document.getElementById('calc-btn');
        if (!amountInput || !daysInput || !rateInput || !calcBtn) return;

        var scheduleBody = document.getElementById('calc-schedule-body');
        if (!scheduleBody) return;

        function formatNum(n) {
            return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
        }

        function calculate() {
            var amount = parseFloat(amountInput.value) || 0;
            var days = parseInt(daysInput.value, 10) || 0;
            var rate = parseFloat(rateInput.value) || 0;

            if (amount < 0) amount = 0;
            if (days < 1) days = 1;
            if (rate < 0) rate = 0;
            if (rate > 0.8) rate = 0.8;

            /* Общая переплата с кэпом 130% */
            var totalInterest = Math.round(amount * (rate / 100) * days);
            var cap = Math.round(amount * 1.3);
            if (totalInterest > cap) totalInterest = cap;
            var totalReturn = amount + totalInterest;

            /* Количество полных месяцев (30 дней = 1 мес.) */
            var months = Math.max(1, Math.round(days / 30));
            var monthlyPayment = Math.round(totalReturn / months);

            /* Генерируем помесячный график */
            var rows = '';
            var remaining = amount;
            var dailyRate = rate / 100;
            var paidInterest = 0;
            var sumPayments = 0;
            var sumPrincipal = 0;

            for (var m = 1; m <= months; m++) {
                if (remaining <= 0) break;

                var daysInMonth = (m === months) ? (days - 30 * (months - 1)) : 30;
                if (daysInMonth < 1) daysInMonth = 30;

                var monthInterest = Math.round(remaining * dailyRate * daysInMonth);
                if (paidInterest + monthInterest > totalInterest) {
                    monthInterest = totalInterest - paidInterest;
                }
                paidInterest += monthInterest;

                var payment, principal;
                if (m === months || remaining <= monthlyPayment - monthInterest) {
                    /* Последний месяц или остаток меньше платежа — закрываем */
                    principal = remaining;
                    payment = principal + monthInterest;
                } else {
                    payment = monthlyPayment;
                    principal = payment - monthInterest;
                    if (principal < 0) principal = 0;
                    if (principal > remaining) principal = remaining;
                }

                remaining = Math.max(0, remaining - principal);
                sumPayments += Math.round(payment);
                sumPrincipal += Math.round(principal);

                rows += '<tr>' +
                    '<td>' + m + '</td>' +
                    '<td>' + formatNum(Math.round(payment)) + ' ₽</td>' +
                    '<td>' + formatNum(monthInterest) + ' ₽</td>' +
                    '<td>' + formatNum(Math.round(principal)) + ' ₽</td>' +
                    '<td>' + formatNum(Math.round(remaining)) + ' ₽</td>' +
                    '</tr>';
            }

            /* Итоговая строка */
            rows += '<tr class="overpay-table__total">' +
                '<td>Итого</td>' +
                '<td>' + formatNum(sumPayments) + ' ₽</td>' +
                '<td>' + formatNum(paidInterest) + ' ₽</td>' +
                '<td>' + formatNum(sumPrincipal) + ' ₽</td>' +
                '<td>0 ₽</td>' +
                '</tr>';

            scheduleBody.innerHTML = rows;
        }

        calcBtn.addEventListener('click', calculate);

        [amountInput, daysInput, rateInput].forEach(function(input) {
            input.addEventListener('keydown', function(e) {
                if (e.key === 'Enter') { e.preventDefault(); calculate(); }
            });
        });

        calculate();
    }

    /* ===========================
       LIVE STATUS WIDGET (kruglosutochno)
       =========================== */
    function initLiveWidget() {
        var timeEl = document.getElementById('current-time');
        var chartEl = document.getElementById('activity-chart');
        if (!timeEl || !chartEl) return;

        function updateTime() {
            var now = new Date();
            var h = String(now.getHours()).padStart(2, '0');
            var m = String(now.getMinutes()).padStart(2, '0');
            timeEl.textContent = h + ':' + m;

            var bars = chartEl.querySelectorAll('.live-activity__bar');
            bars.forEach(function(bar) {
                var barHour = parseInt(bar.getAttribute('data-hour'), 10);
                bar.classList.toggle('is-current', barHour === now.getHours());
            });
        }

        updateTime();
        setInterval(updateTime, 30000);
    }

    initLiveWidget();

    /* ===========================
       GOAL SELECTOR (dengi-v-dolg)
       =========================== */
    (function initGoalSelector() {
        var btns = document.querySelectorAll('.goal-selector__btn');
        if (!btns.length) return;

        var goals = {
            repair:   { amount: 50000, term: 90,  label: '50 000 ₽', termLabel: '90 дней'  },
            medical:  { amount: 30000, term: 60,  label: '30 000 ₽', termLabel: '60 дней'  },
            salary:   { amount: 15000, term: 14,  label: '15 000 ₽', termLabel: '14 дней'  },
            purchase: { amount: 80000, term: 180, label: '80 000 ₽', termLabel: '180 дней' }
        };

        var activeGoal = 'repair';

        function filterCards(goalKey) {
            var g = goals[goalKey];
            if (!g) return;
            var cards = document.querySelectorAll('.mfo-card');
            var count = 0;

            cards.forEach(function(card) {
                var maxAmount = parseInt(card.getAttribute('data-amount'), 10) || 0;
                var maxTerm = parseInt(card.getAttribute('data-term'), 10) || 0;
                var fits = maxAmount >= g.amount && maxTerm >= g.term;

                if (fits) {
                    card.classList.remove('mfo-card--dimmed');
                    count++;
                } else {
                    card.classList.add('mfo-card--dimmed');
                }
            });

            var amEl = document.getElementById('goal-amount');
            var tmEl = document.getElementById('goal-term');
            var cnEl = document.getElementById('goal-count');
            if (amEl) amEl.textContent = g.label;
            if (tmEl) tmEl.textContent = g.termLabel;
            if (cnEl) cnEl.textContent = count;
        }

        btns.forEach(function(btn) {
            btn.addEventListener('click', function() {
                btns.forEach(function(b) { b.classList.remove('goal-selector__btn--active'); });
                btn.classList.add('goal-selector__btn--active');
                activeGoal = btn.getAttribute('data-goal');
                filterCards(activeGoal);
            });
        });

        var showBtn = document.querySelector('.btn--filter-submit');
        if (showBtn) {
            showBtn.addEventListener('click', function(e) {
                e.preventDefault();
                filterCards(activeGoal);
                var target = document.getElementById('mfo-rating');
                if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        }

        filterCards(activeGoal);
    })();

    /* ===========================
       CHECKLIST (dengi-v-dolg)
       =========================== */
    (function initChecklist() {
        var checks = document.querySelectorAll('.checklist__checkbox');
        if (!checks.length) return;
        var total = checks.length;
        var bar = document.getElementById('checklist-progress');
        var txt = document.getElementById('checklist-text');

        function update() {
            var done = 0;
            checks.forEach(function(c) { if (c.checked) done++; });
            var pct = Math.round(done / total * 100);
            if (bar) bar.style.width = pct + '%';
            if (txt) txt.textContent = done + ' из ' + total + ' выполнено';
        }

        checks.forEach(function(c) {
            c.addEventListener('change', update);
        });
    })();

    /* ===========================
       DEBT LOAD CALCULATOR — ПДН (dengi-v-dolg)
       =========================== */
    (function initDebtCalc() {
        var incomeSlider = document.getElementById('monthly-income');
        var paymentsSlider = document.getElementById('current-payments');
        var loanSlider = document.getElementById('new-loan');
        var termSlider = document.getElementById('loan-term-calc');
        if (!incomeSlider) return;

        var incomeVal = document.getElementById('income-value');
        var paymentsVal = document.getElementById('payments-value');
        var loanVal = document.getElementById('loan-value');
        var termVal = document.getElementById('term-value');
        var pdnEl = document.getElementById('pdn-value');
        var monthlyEl = document.getElementById('monthly-payment');
        var overpayEl = document.getElementById('overpay-value');
        var statusEl = document.getElementById('pdn-status');

        function fmt(n) {
            return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
        }

        function calc() {
            var income = parseInt(incomeSlider.value, 10);
            var payments = parseInt(paymentsSlider.value, 10);
            var loan = parseInt(loanSlider.value, 10);
            var term = parseInt(termSlider.value, 10);

            if (incomeVal) incomeVal.textContent = fmt(income) + ' ₽';
            if (paymentsVal) paymentsVal.textContent = fmt(payments) + ' ₽';
            if (loanVal) loanVal.textContent = fmt(loan) + ' ₽';
            if (termVal) termVal.textContent = term + ' дней';

            var dailyRate = 0.008;
            var overpay = Math.round(loan * dailyRate * term);
            var totalReturn = loan + overpay;
            var monthlyPayment = Math.round(totalReturn / Math.max(term / 30, 1));
            var pdn = income > 0 ? Math.round((payments + monthlyPayment) / income * 100) : 0;

            if (pdnEl) pdnEl.textContent = pdn + '%';
            if (monthlyEl) monthlyEl.textContent = fmt(monthlyPayment) + ' ₽';
            if (overpayEl) overpayEl.textContent = fmt(overpay) + ' ₽';

            if (statusEl) {
                statusEl.className = 'debt-calc__result-status';
                if (pdn <= 30) {
                    statusEl.classList.add('debt-calc__result-status--ok');
                    statusEl.textContent = '✓ Низкая нагрузка — высокая вероятность одобрения';
                } else if (pdn <= 50) {
                    statusEl.classList.add('debt-calc__result-status--warning');
                    statusEl.textContent = '⚠ Средняя нагрузка — одобрение возможно с ограничениями';
                } else {
                    statusEl.classList.add('debt-calc__result-status--danger');
                    statusEl.textContent = '✗ Высокая нагрузка — есть риск отказа';
                }
            }
        }

        [incomeSlider, paymentsSlider, loanSlider, termSlider].forEach(function(s) {
            s.addEventListener('input', calc);
        });

        calc();
    })();

    /* ============================
       Promo Calc — Калькулятор переплаты после 0%
       ============================ */
    (function () {
        var amountSlider = document.getElementById('promo-amount');
        var freeDaysSlider = document.getElementById('promo-free-days');
        var extraDaysSlider = document.getElementById('promo-extra-days');
        if (!amountSlider || !freeDaysSlider || !extraDaysSlider) return;

        var amountValue = document.getElementById('promo-amount-value');
        var freeDaysValue = document.getElementById('promo-free-days-value');
        var extraDaysValue = document.getElementById('promo-extra-days-value');
        var resultFree = document.getElementById('promo-result-free');
        var resultPaid = document.getElementById('promo-result-paid');

        var RATE = 0.008; // 0.8% в день

        function formatMoney(n) {
            return n.toLocaleString('ru-RU') + ' ₽';
        }

        function calc() {
            var amount = parseInt(amountSlider.value, 10);
            var freeDays = parseInt(freeDaysSlider.value, 10);
            var extraDays = parseInt(extraDaysSlider.value, 10);

            amountValue.textContent = formatMoney(amount);
            freeDaysValue.textContent = freeDays + ' дней';
            extraDaysValue.textContent = extraDays + ' дней';

            // При возврате в срок — 0 переплата
            resultFree.textContent = '0 ₽ переплата';

            // При просрочке — проценты за все дни (льготный + просрочка)
            if (extraDays > 0) {
                var totalDays = freeDays + extraDays;
                var interest = Math.round(amount * RATE * totalDays);
                // Закон: переплата не более 1.5x тела
                var maxInterest = Math.round(amount * 1.5);
                if (interest > maxInterest) interest = maxInterest;
                resultPaid.textContent = formatMoney(interest) + ' переплата';
                resultPaid.classList.remove('promo-calc__result-value--success');
                resultPaid.classList.add('promo-calc__result-value--warn');
            } else {
                resultPaid.textContent = '0 ₽';
                resultPaid.classList.remove('promo-calc__result-value--warn');
                resultPaid.classList.add('promo-calc__result-value--success');
            }

            // Подкрашиваем трек слайдеров
            [amountSlider, freeDaysSlider, extraDaysSlider].forEach(function (s) {
                var pct = ((s.value - s.min) / (s.max - s.min)) * 100;
                s.style.background = 'linear-gradient(to right, var(--color-primary) ' + pct + '%, var(--color-border-light) ' + pct + '%)';
            });
        }

        amountSlider.addEventListener('input', calc);
        freeDaysSlider.addEventListener('input', calc);
        extraDaysSlider.addEventListener('input', calc);

        calc();
    })();

    /* ============================
       Promo Ticker — auto month + rotation + countdown
       ============================ */
    (function () {
        var MONTHS = [
            'январь', 'февраль', 'март', 'апрель', 'май', 'июнь',
            'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'
        ];

        /* Заголовок с текущим месяцем */
        var titleEl = document.getElementById('promo-ticker-title');
        if (titleEl) {
            var now = new Date();
            var monthName = MONTHS[now.getMonth()];
            var year = now.getFullYear();
            titleEl.textContent = 'Действующие акции 0% — ' + monthName + ' ' + year;
        }

        /* Полный список МФО для ротации */
        var ALL_MFO = [
            { name: 'Kviku',           offer: '0% до 50 дней' },
            { name: 'еКапуста',       offer: '0% до 30 дней' },
            { name: 'Займер',          offer: '0% до 30 дней' },
            { name: 'Бери Беру',       offer: '0% до 21 дня'  },
            { name: 'HurmaCredit',     offer: '0% до 21 дня'  },
            { name: 'Кредиска',        offer: '0% до 21 дня'  },
            { name: 'Займиго',         offer: '0% до 21 дня'  },
            { name: 'MoneyMan',        offer: '0% до 21 дня'  },
            { name: 'Гринмани',        offer: '0% до 21 дня'  },
            { name: 'Joymoney',        offer: '0% до 14 дней' },
            { name: 'Вебзайм',         offer: '0% до 14 дней' },
            { name: 'Быстроденьги',    offer: '0% до 10 дней' },
            { name: 'Срочно Деньги',   offer: '0% до 7 дней'  },
            { name: 'Лайк Мани',       offer: '0% до 7 дней'  },
            { name: 'Credit7',         offer: '0% до 7 дней'  }
        ];

        /* Случайная выборка count элементов из массива */
        function pickRandom(arr, count) {
            var copy = arr.slice();
            var result = [];
            for (var i = 0; i < count && copy.length; i++) {
                var idx = Math.floor(Math.random() * copy.length);
                result.push(copy.splice(idx, 1)[0]);
            }
            return result;
        }

        /* Дата окончания акции — последний день текущего месяца */
        function getEndOfMonth() {
            var d = new Date();
            var y = d.getFullYear();
            var m = d.getMonth() + 1;
            return y + '-' + (m < 10 ? '0' + m : m) + '-' +
                   new Date(y, m, 0).getDate() + 'T23:59:59';
        }

        /* Генерируем 3 случайных МФО */
        var listEl = document.getElementById('promo-ticker-list');
        if (listEl) {
            var picked = pickRandom(ALL_MFO, 3);
            var endDate = getEndOfMonth();
            var html = '';
            picked.forEach(function (mfo) {
                html +=
                    '<div class="promo-ticker__item">' +
                        '<div class="promo-ticker__company">' + mfo.name + '</div>' +
                        '<div class="promo-ticker__offer">' + mfo.offer + '</div>' +
                        '<div class="promo-ticker__countdown">' +
                            '<span class="promo-ticker__countdown-label">До конца акции:</span>' +
                            '<span class="promo-ticker__countdown-timer" data-end="' + endDate + '">-- дн. --:--:--</span>' +
                        '</div>' +
                    '</div>';
            });
            listEl.innerHTML = html;
        }

        /* Обратный отсчёт */
        function pad(n) { return n < 10 ? '0' + n : n; }

        function updateCountdowns() {
            var timers = document.querySelectorAll('.promo-ticker__countdown-timer[data-end]');
            if (!timers.length) return;
            var now = Date.now();
            timers.forEach(function (el) {
                var end = new Date(el.getAttribute('data-end')).getTime();
                var diff = end - now;
                if (diff <= 0) {
                    el.textContent = 'Акция завершена';
                    return;
                }
                var d = Math.floor(diff / 86400000);
                var h = Math.floor((diff % 86400000) / 3600000);
                var m = Math.floor((diff % 3600000) / 60000);
                var s = Math.floor((diff % 60000) / 1000);
                el.textContent = d + ' дн. ' + pad(h) + ':' + pad(m) + ':' + pad(s);
            });
        }

        updateCountdowns();
        setInterval(updateCountdowns, 1000);
    })();

    /* ============================
       Pension Calculator
       ============================ */
    function initPensionCalc() {
        var incomeSlider = document.getElementById('pension-income');
        var amountSlider = document.getElementById('pension-amount');
        var termSlider   = document.getElementById('pension-term');
        if (!incomeSlider || !amountSlider || !termSlider) return;

        var incomeDisplay  = document.getElementById('pension-income-value');
        var amountDisplay  = document.getElementById('pension-amount-value');
        var termDisplay    = document.getElementById('pension-term-value');
        var paymentEl      = document.getElementById('pension-payment');
        var shareEl        = document.getElementById('pension-share');
        var barEl          = document.getElementById('pension-share-bar');
        var hintEl         = document.getElementById('pension-hint');

        function fmt(n) {
            return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
        }

        function calc() {
            var income = parseInt(incomeSlider.value, 10);
            var amount = parseInt(amountSlider.value, 10);
            var days   = parseInt(termSlider.value, 10);

            incomeDisplay.textContent = fmt(income) + ' \u20BD';
            amountDisplay.textContent = fmt(amount) + ' \u20BD';
            termDisplay.textContent   = days + ' ' + declDays(days);

            /* Rate: 0% first loan 30d, else 0.8%/day */
            var rate = 0.008;
            var interest = amount * rate * days;
            var total = amount + interest;

            /* Monthly payment */
            var months = days / 30;
            var monthly = months > 0 ? Math.ceil(total / months) : total;

            /* Share of pension */
            var share = income > 0 ? (monthly / income) * 100 : 0;
            if (share > 100) share = 100;

            paymentEl.textContent = fmt(Math.ceil(monthly)) + ' \u20BD';
            shareEl.textContent = share.toFixed(1) + '%';

            /* Bar */
            barEl.style.width = Math.min(share, 100) + '%';
            barEl.className = 'pcalc-result__bar-fill';
            if (share > 50) barEl.classList.add('pcalc-result__bar-fill--danger');
            else if (share > 30) barEl.classList.add('pcalc-result__bar-fill--warn');

            /* Hint */
            hintEl.className = 'pcalc-result__hint';
            if (share <= 30) {
                hintEl.textContent = '\u2705 Нагрузка комфортная. Платёж не превышает 30% пенсии.';
                hintEl.classList.add('pcalc-result__hint--good');
            } else if (share <= 50) {
                hintEl.textContent = '\u26A0\uFE0F Умеренная нагрузка. Рассмотрите меньшую сумму или больший срок.';
                hintEl.classList.add('pcalc-result__hint--warn');
            } else {
                hintEl.textContent = '\u274C Высокая нагрузка! Платёж превышает 50% пенсии. Уменьшите сумму.';
                hintEl.classList.add('pcalc-result__hint--danger');
            }
        }

        function declDays(n) {
            var a = n % 10, b = n % 100;
            if (b >= 11 && b <= 19) return '\u0434\u043D\u0435\u0439';
            if (a === 1) return '\u0434\u0435\u043D\u044C';
            if (a >= 2 && a <= 4) return '\u0434\u043D\u044F';
            return '\u0434\u043D\u0435\u0439';
        }

        incomeSlider.addEventListener('input', calc);
        amountSlider.addEventListener('input', calc);
        termSlider.addEventListener('input', calc);
        calc();
    }

    /* ============================
       Status Checker (bezrabotnym)
       ============================ */
    function initStatusChecker() {
        var checker = document.getElementById('status-checker');
        if (!checker) return;

        var buttons = checker.querySelectorAll('.status-checker__btn');
        var mfoCount = document.getElementById('status-mfo-count');
        var maxAmount = document.getElementById('status-max-amount');
        var approval = document.getElementById('status-approval');

        var data = {
            'unemployed':    { mfo: 24, amount: '30 000 ₽', approval: '89%' },
            'self-employed': { mfo: 28, amount: '100 000 ₽', approval: '94%' },
            'freelancer':    { mfo: 26, amount: '50 000 ₽', approval: '91%' },
            'maternity':     { mfo: 22, amount: '30 000 ₽', approval: '87%' },
            'student':       { mfo: 20, amount: '30 000 ₽', approval: '85%' }
        };

        function updateResult(status) {
            var d = data[status];
            if (!d) return;
            mfoCount.textContent = d.mfo;
            maxAmount.textContent = d.amount;
            approval.textContent = d.approval;

            var values = checker.querySelectorAll('.status-checker__result-value');
            for (var i = 0; i < values.length; i++) {
                values[i].classList.remove('status-checker__result-value--animated');
                void values[i].offsetWidth;
                values[i].classList.add('status-checker__result-value--animated');
            }
        }

        for (var i = 0; i < buttons.length; i++) {
            buttons[i].addEventListener('click', function () {
                for (var j = 0; j < buttons.length; j++) {
                    buttons[j].classList.remove('status-checker__btn--active');
                }
                this.classList.add('status-checker__btn--active');
                updateResult(this.getAttribute('data-status'));
            });
        }

        /* Set initial values for default active button */
        var active = checker.querySelector('.status-checker__btn--active');
        if (active) {
            updateResult(active.getAttribute('data-status'));
        }
    }

    /* ============================
       Biz Selector — Подбор по форме бизнеса (/dlya-biznesa/)
       ============================ */
    (function () {
        var selector = document.getElementById('biz-selector');
        if (!selector) return;

        var btns = selector.querySelectorAll('.biz-selector__btn');
        var countEl = document.getElementById('biz-mfo-count');
        var amountEl = document.getElementById('biz-max-amount');
        var termEl = document.getElementById('biz-max-term');

        var bizData = {
            'ip': { count: 4, maxAmount: '10 000 000 ₽', maxTerm: '60 мес.' },
            'self-employed': { count: 3, maxAmount: '500 000 ₽', maxTerm: '24 мес.' },
            'ooo': { count: 3, maxAmount: '20 000 000 ₽', maxTerm: '60 мес.' }
        };

        function updateBizResult(type) {
            var d = bizData[type];
            if (!d) return;
            countEl.textContent = d.count;
            amountEl.textContent = d.maxAmount;
            termEl.textContent = d.maxTerm;

            /* Filter MFO list items by biz type */
            var items = document.querySelectorAll('#mfo-grid .mfo-list__item');
            for (var i = 0; i < items.length; i++) {
                var types = (items[i].getAttribute('data-biz-type') || '').split(',');
                if (types.indexOf(type) !== -1) {
                    items[i].style.display = '';
                } else {
                    items[i].style.display = 'none';
                }
            }
        }

        for (var i = 0; i < btns.length; i++) {
            btns[i].addEventListener('click', function () {
                for (var j = 0; j < btns.length; j++) {
                    btns[j].classList.remove('biz-selector__btn--active');
                }
                this.classList.add('biz-selector__btn--active');
                updateBizResult(this.getAttribute('data-biz'));
            });
        }

        /* Init with default active button */
        var activeBtn = selector.querySelector('.biz-selector__btn--active');
        if (activeBtn) {
            updateBizResult(activeBtn.getAttribute('data-biz'));
        }
    })();

    /* ============================
       Biz Accordion — Документы по типу бизнеса
       ============================ */
    (function () {
        var triggers = document.querySelectorAll('.biz-accordion__trigger');
        if (!triggers.length) return;

        for (var i = 0; i < triggers.length; i++) {
            triggers[i].addEventListener('click', function () {
                var expanded = this.getAttribute('aria-expanded') === 'true';
                /* Close all */
                for (var j = 0; j < triggers.length; j++) {
                    triggers[j].setAttribute('aria-expanded', 'false');
                }
                /* Toggle current */
                if (!expanded) {
                    this.setAttribute('aria-expanded', 'true');
                }
            });
        }
    })();

    /* ============================
       ROI Calculator — Калькулятор окупаемости бизнес-займа
       ============================ */
    (function () {
        var amountSlider = document.getElementById('roi-amount');
        var termSlider = document.getElementById('roi-term');
        var profitSlider = document.getElementById('roi-profit');
        var rateSlider = document.getElementById('roi-rate');
        if (!amountSlider || !termSlider || !profitSlider || !rateSlider) return;

        var amountValue = document.getElementById('roi-amount-value');
        var termValue = document.getElementById('roi-term-value');
        var profitValue = document.getElementById('roi-profit-value');
        var rateValue = document.getElementById('roi-rate-value');
        var overpayEl = document.getElementById('roi-overpay');
        var roiEl = document.getElementById('roi-value');
        var paybackEl = document.getElementById('roi-payback');

        function fmt(n) {
            return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' ₽';
        }

        function calc() {
            var amount = parseInt(amountSlider.value, 10);
            var term = parseInt(termSlider.value, 10);
            var profit = parseInt(profitSlider.value, 10);
            var rateYear = parseInt(rateSlider.value, 10);

            amountValue.textContent = fmt(amount);
            termValue.textContent = term + ' мес.';
            profitValue.textContent = fmt(profit);
            rateValue.textContent = rateYear + '%';

            var rateMonth = rateYear / 12 / 100;
            var overpay = Math.round(amount * rateMonth * term);
            var totalProfit = profit * term;
            var roi = amount > 0 ? Math.round((totalProfit - overpay) / amount * 100) : 0;
            var paybackMonths = profit > 0 ? Math.ceil((amount + overpay) / profit) : 0;

            overpayEl.textContent = fmt(overpay);
            roiEl.textContent = roi + '%';

            if (paybackMonths > 0 && paybackMonths <= term) {
                paybackEl.textContent = paybackMonths + ' мес.';
            } else if (paybackMonths > term) {
                paybackEl.textContent = '> ' + term + ' мес.';
            } else {
                paybackEl.textContent = '—';
            }

            /* Color coding */
            if (roi >= 30) {
                roiEl.style.color = '#10B981';
            } else if (roi >= 10) {
                roiEl.style.color = '#F59E0B';
            } else {
                roiEl.style.color = '#EF4444';
            }
        }

        [amountSlider, termSlider, profitSlider, rateSlider].forEach(function (s) {
            s.addEventListener('input', calc);
        });

        calc();
    })();

    /* ============================
       Doc Checker (по-паспорту)
       ============================ */
    function initDocChecker() {
        var checker = document.getElementById('doc-checker');
        if (!checker) return;

        var checkboxes = checker.querySelectorAll('input[type="checkbox"][data-doc]');
        var mfoCount = document.getElementById('doc-mfo-count');
        var maxAmount = document.getElementById('doc-max-amount');
        var approvalSpeed = document.getElementById('doc-approval-speed');
        if (!mfoCount || !maxAmount || !approvalSpeed) return;

        var allCards = document.querySelectorAll('#mfo-rating .mfo-card');

        function update() {
            var selectedDocs = ['passport'];
            checkboxes.forEach(function (cb) {
                if (cb.checked) selectedDocs.push(cb.getAttribute('data-doc'));
            });

            var matched = 0;
            var maxAmt = 0;

            allCards.forEach(function (card) {
                var cardDocs = (card.getAttribute('data-docs') || 'passport').split(',');
                var hasAll = selectedDocs.every(function (doc) {
                    return cardDocs.indexOf(doc) !== -1;
                });

                if (hasAll) {
                    card.style.display = '';
                    card.style.opacity = '1';
                    matched++;
                    var amt = parseInt(card.getAttribute('data-amount') || '0', 10);
                    if (amt > maxAmt) maxAmt = amt;
                } else {
                    card.style.display = 'none';
                    card.style.opacity = '0';
                }
            });

            var speed = '5–10 мин.';
            if (selectedDocs.length >= 4) {
                speed = '2–3 мин.';
            } else if (selectedDocs.length === 3) {
                speed = '3–5 мин.';
            } else if (selectedDocs.length === 2) {
                speed = '5–7 мин.';
            }

            mfoCount.textContent = matched;
            maxAmount.textContent = maxAmt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' ₽';
            approvalSpeed.textContent = speed;
        }

        checkboxes.forEach(function (cb) {
            cb.addEventListener('change', function () {
                var label = cb.closest('.doc-checker__checkbox');
                if (label) {
                    if (cb.checked) {
                        label.classList.add('doc-checker__checkbox--checked');
                    } else {
                        label.classList.remove('doc-checker__checkbox--checked');
                    }
                }
                update();
            });
        });

        // Кнопка "Показать подходящие МФО" — скролл к рейтингу
        var showBtn = checker.querySelector('.pcalc-btn');
        if (showBtn) {
            showBtn.addEventListener('click', function (e) {
                e.preventDefault();
                var target = document.getElementById('mfo-rating');
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        }

        update();
    }

    /* ============================
       Approval Gauge (bez-otkaza)
       ============================ */
    function initApprovalGauge() {
        var amountSlider = document.getElementById('gauge-amount');
        var ageSlider = document.getElementById('gauge-age');
        if (!amountSlider || !ageSlider) return;

        var amountDisplay = document.getElementById('gauge-amount-value');
        var ageDisplay = document.getElementById('gauge-age-value');
        var fillBar = document.getElementById('gauge-fill');
        var resultDisplay = document.getElementById('gauge-result');
        var verdictEl = document.getElementById('gauge-verdict');
        var mfoCountEl = document.getElementById('gauge-mfo-count');
        var toggleWrap = document.getElementById('gauge-employment-toggle');

        var employment = 'employed';

        /* Employment toggle */
        if (toggleWrap) {
            var toggleBtns = toggleWrap.querySelectorAll('.calculator__toggle-btn');
            for (var i = 0; i < toggleBtns.length; i++) {
                toggleBtns[i].addEventListener('click', function () {
                    for (var j = 0; j < toggleBtns.length; j++) {
                        toggleBtns[j].classList.remove('calculator__toggle-btn--active');
                    }
                    this.classList.add('calculator__toggle-btn--active');
                    employment = this.getAttribute('data-employment');
                    updateGauge();
                });
            }
        }

        function formatNum(n) {
            return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
        }

        function getAgeWord(n) {
            var abs = Math.abs(n) % 100;
            var last = abs % 10;
            if (abs > 10 && abs < 20) return 'лет';
            if (last > 1 && last < 5) return 'года';
            if (last === 1) return 'год';
            return 'лет';
        }

        function calcApproval(amount, age, emp) {
            /* Base approval by amount */
            var base;
            if (amount <= 5000) base = 96;
            else if (amount <= 15000) base = 94;
            else if (amount <= 30000) base = 91;
            else if (amount <= 50000) base = 86;
            else if (amount <= 70000) base = 80;
            else base = 74;

            /* Age modifier */
            var ageMod = 0;
            if (age >= 23 && age <= 55) ageMod = 2;
            else if (age >= 18 && age <= 22) ageMod = -3;
            else if (age >= 56 && age <= 65) ageMod = 0;
            else if (age >= 66 && age <= 70) ageMod = -2;
            else ageMod = -5;

            /* Employment modifier */
            var empMod = 0;
            if (emp === 'employed') empMod = 3;
            else if (emp === 'self') empMod = 1;
            else if (emp === 'pensioner') empMod = -1;
            else empMod = -4; /* unemployed */

            var result = base + ageMod + empMod;
            if (result > 98) result = 98;
            if (result < 45) result = 45;
            return result;
        }

        function countMfo(amount) {
            /* Count how many MFO from the rating accept this amount */
            var cards = document.querySelectorAll('#mfo-grid .mfo-card');
            var count = 0;
            cards.forEach(function (card) {
                var maxAmt = parseInt(card.getAttribute('data-amount') || '0', 10);
                if (amount <= maxAmt) count++;
            });
            /* Fallback: if no cards found or parsed, estimate */
            if (cards.length === 0) {
                if (amount <= 30000) return 15;
                if (amount <= 50000) return 12;
                if (amount <= 100000) return 9;
                return 5;
            }
            return count;
        }

        function updateSliderFill(slider) {
            var min = parseFloat(slider.min);
            var max = parseFloat(slider.max);
            var val = parseFloat(slider.value);
            var pct = ((val - min) / (max - min)) * 100;
            slider.style.background = 'linear-gradient(to right, #FF6B35 0%, #FF6B35 ' + pct + '%, #E2E8F0 ' + pct + '%, #E2E8F0 100%)';
        }

        function updateGauge() {
            var amount = parseInt(amountSlider.value, 10);
            var age = parseInt(ageSlider.value, 10);

            /* Update displays */
            if (amountDisplay) amountDisplay.textContent = formatNum(amount) + ' \u20BD';
            if (ageDisplay) ageDisplay.textContent = age + ' ' + getAgeWord(age);

            /* Calculate approval */
            var pct = calcApproval(amount, age, employment);
            var mfoCount = countMfo(amount);

            /* Update gauge bar */
            if (fillBar) fillBar.style.width = pct + '%';

            /* Update result number with color */
            if (resultDisplay) {
                resultDisplay.textContent = pct + '%';
                if (pct >= 85) {
                    resultDisplay.style.color = 'var(--color-success, #16a34a)';
                } else if (pct >= 70) {
                    resultDisplay.style.color = '#f59e0b';
                } else {
                    resultDisplay.style.color = '#ef4444';
                }
            }

            /* Update verdict */
            if (verdictEl && mfoCountEl) {
                mfoCountEl.textContent = mfoCount;
                if (pct >= 85) {
                    verdictEl.textContent = '';
                    verdictEl.innerHTML = 'Высокие шансы на одобрение — <strong>' + mfoCount + '</strong> МФО готовы рассмотреть заявку';
                    verdictEl.style.background = 'rgba(22, 163, 106, 0.08)';
                } else if (pct >= 70) {
                    verdictEl.textContent = '';
                    verdictEl.innerHTML = 'Средние шансы — <strong>' + mfoCount + '</strong> МФО могут одобрить. Подайте в 2–3 организации';
                    verdictEl.style.background = 'rgba(245, 158, 11, 0.08)';
                } else {
                    verdictEl.textContent = '';
                    verdictEl.innerHTML = 'Шансы ниже среднего — попробуйте уменьшить сумму. Доступно <strong>' + mfoCount + '</strong> МФО';
                    verdictEl.style.background = 'rgba(239, 68, 68, 0.08)';
                }
            }

            updateSliderFill(amountSlider);
            updateSliderFill(ageSlider);
        }

        amountSlider.addEventListener('input', updateGauge);
        ageSlider.addEventListener('input', updateGauge);

        updateGauge();
    }

    /* ============================
       Checklist Progress (bez-otkaza)
       ============================ */
    function initBezOtkazaChecklist() {
        var wrap = document.getElementById('checklist-items');
        if (!wrap) return;

        var checks = wrap.querySelectorAll('.checklist-item__input');
        if (!checks.length) return;

        var total = checks.length;
        var fillBar = document.getElementById('checklist-fill');
        var percentEl = document.getElementById('checklist-percent');

        function update() {
            var done = 0;
            checks.forEach(function (c) { if (c.checked) done++; });
            var pct = Math.round(done / total * 100);
            if (fillBar) fillBar.style.width = pct + '%';
            if (percentEl) percentEl.textContent = pct + '%';
        }

        checks.forEach(function (c) {
            c.addEventListener('change', function () {
                var item = c.closest('.checklist-item');
                if (item) {
                    if (c.checked) {
                        item.classList.add('checklist-item--done');
                    } else {
                        item.classList.remove('checklist-item--done');
                    }
                }
                update();
            });
        });
    }

    /* --- Квиз-виджет (s-18-let) --- */
    function initQuizWidget() {
        var widget = document.querySelector('.quiz-widget');
        if (!widget) return;

        var steps = widget.querySelectorAll('.quiz-widget__step');
        var progressBar = widget.querySelector('.quiz-widget__progress-bar');
        var resultBlock = widget.querySelector('.quiz-widget__result');
        var resultText = widget.querySelector('.quiz-widget__result-text');
        var currentStep = 0;
        var answers = {};
        var totalSteps = steps.length;

        function showStep(idx) {
            steps.forEach(function (s, i) {
                s.classList.toggle('quiz-widget__step--active', i === idx);
            });
            if (progressBar) {
                progressBar.style.width = Math.round(((idx + 1) / totalSteps) * 100) + '%';
            }
        }

        function finish() {
            steps.forEach(function (s) { s.classList.remove('quiz-widget__step--active'); });
            if (progressBar) progressBar.style.width = '100%';

            // Считаем кол-во подходящих МФО
            var age = parseInt(answers.age, 10) || 18;
            var cards = document.querySelectorAll('.mfo-card[data-min-age]');
            var count = 0;
            cards.forEach(function (c) {
                var min = parseInt(c.getAttribute('data-min-age'), 10) || 18;
                if (age >= min) count++;
            });

            // Fallback если карточек нет — общая цифра
            if (count === 0) count = age >= 20 ? 15 : 14;

            if (resultText) {
                resultText.innerHTML = 'Вам доступно <strong>' + count + ' МФО</strong>, готовых выдать займ прямо сейчас';
            }
            if (resultBlock) resultBlock.style.display = 'block';

            var submitBtn = document.getElementById('quiz-submit');
            if (submitBtn) submitBtn.style.display = '';
        }

        showStep(0);
        if (resultBlock) resultBlock.style.display = 'none';

        widget.addEventListener('click', function (e) {
            var btn = e.target.closest('.quiz-widget__option');
            if (!btn) return;

            var step = btn.closest('.quiz-widget__step');
            var name = step ? step.getAttribute('data-step') : '';
            answers[name] = btn.getAttribute('data-value');

            // Отметка выбора
            var siblings = step.querySelectorAll('.quiz-widget__option');
            siblings.forEach(function (s) { s.classList.remove('quiz-widget__option--selected'); });
            btn.classList.add('quiz-widget__option--selected');

            setTimeout(function () {
                currentStep++;
                if (currentStep < totalSteps) {
                    showStep(currentStep);
                } else {
                    finish();
                }
            }, 300);
        });
    }

    /* --- Бюджет-планнер (s-18-let) --- */
    function initBudgetPlanner() {
        var section = document.getElementById('budget-planner');
        if (!section) return;

        var incomeRange = section.querySelector('input[name="income"]');
        var expenseRange = section.querySelector('input[name="expenses"]');
        if (!incomeRange || !expenseRange) return;

        var incomeVal = document.getElementById('planner-income-value');
        var expenseVal = document.getElementById('planner-expenses-value');
        var freeEl = document.getElementById('planner-free');
        var limitEl = document.getElementById('planner-limit');
        var paymentEl = document.getElementById('planner-payment');
        var verdictEl = document.getElementById('planner-verdict');

        function fmt(n) {
            return n.toLocaleString('ru-RU') + ' ₽';
        }

        function calc() {
            var income = parseInt(incomeRange.value, 10);
            var expenses = parseInt(expenseRange.value, 10);
            var free = Math.max(income - expenses, 0);
            var limit = Math.round(free * 0.7);
            var payment = Math.round(free * 0.5);

            if (incomeVal) incomeVal.textContent = fmt(income);
            if (expenseVal) expenseVal.textContent = fmt(expenses);
            if (freeEl) freeEl.textContent = fmt(free);
            if (limitEl) limitEl.textContent = fmt(limit);
            if (paymentEl) paymentEl.textContent = fmt(payment);

            if (verdictEl) {
                if (free <= 0) {
                    verdictEl.textContent = 'Расходы превышают доходы — займ сейчас брать рискованно';
                    verdictEl.style.background = 'rgba(220,38,38,0.06)';
                } else if (free < 3000) {
                    verdictEl.textContent = 'Свободных средств мало — рекомендуем микрозайм до ' + fmt(limit);
                    verdictEl.style.background = 'rgba(234,179,8,0.08)';
                } else {
                    verdictEl.textContent = 'Вы можете комфортно обслуживать займ до ' + fmt(limit);
                    verdictEl.style.background = 'rgba(22,163,74,0.06)';
                }
            }
        }

        incomeRange.addEventListener('input', calc);
        expenseRange.addEventListener('input', calc);
        calc();
    }

})();
