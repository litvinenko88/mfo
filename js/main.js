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
        initAffiliateTracking();
        initTermSlider();
        initFullCalculator();
        initBenefitCalc();
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

})();
