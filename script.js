// script.js – premium smooth animations, scroll skill bars, navbar effect

(function() {
    "use strict";

    // ---------- 1. NAVBAR SCROLL EFFECT (transparent -> solid) ----------
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 30) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // ---------- 2. SMOOTH SCROLLING (native + polyfill) ----------
    const navLinks = document.querySelectorAll('.nav-menu a, .btn[href^="#"], .nav-logo a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const targetId = href === '#' ? null : href;
                if (targetId && targetId !== '#') {
                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                        targetElement.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start',
                        });
                        // close mobile menu after click
                        const navMenu = document.querySelector('.nav-menu');
                        if (navMenu.classList.contains('active')) {
                            navMenu.classList.remove('active');
                        }
                    }
                }
            }
        });
    });

    // ---------- 3. SCROLL ANIMATIONS (FADE-UP) + SKILL BARS TRIGGER ----------
    const fadeElements = document.querySelectorAll('.fade-up');
    const skillBars = document.querySelectorAll('.progress-fill');
    // store initial data-width for each skill percent
    const skillPercentElements = document.querySelectorAll('.skill-percent');
    let animatedBars = false; // ensure bars animate only once

    function checkFadeAndBars() {
        const windowHeight = window.innerHeight;
        const triggerBottom = windowHeight * 0.9;

        fadeElements.forEach(el => {
            const rect = el.getBoundingClientRect().top;
            if (rect < triggerBottom) {
                el.classList.add('active');
            }
        });

        // Skill bars activation – only when #resume section is visible
        if (!animatedBars) {
            const resumeSection = document.getElementById('resume');
            if (resumeSection) {
                const rect = resumeSection.getBoundingClientRect();
                if (rect.top < windowHeight - 80) {
                    // fill progress bars with width from data attribute
                    skillPercentElements.forEach((span, index) => {
                        const width = span.getAttribute('data-width');
                        // find parent skill-bar-item then progress-fill
                        const parentItem = span.closest('.skill-bar-item');
                        if (parentItem) {
                            const fillDiv = parentItem.querySelector('.progress-fill');
                            if (fillDiv) {
                                fillDiv.style.width = width + '%';
                            }
                        }
                    });
                    animatedBars = true;
                }
            }
        }
    }

    // initial check on load + scroll
    window.addEventListener('load', function() {
        checkFadeAndBars();
        // tiny delay for hero
        setTimeout(() => {
            document.querySelectorAll('.hero .fade-up').forEach(el => el.classList.add('active'));
        }, 200);
    });
    window.addEventListener('scroll', checkFadeAndBars);
    window.addEventListener('resize', checkFadeAndBars);

    // ---------- 4. MOBILE TOGGLE MENU ----------
    const toggleBtn = document.getElementById('mobile-toggle');
    const navMenu = document.querySelector('.nav-menu');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }

    // ---------- 5. ACTIVE NAVIGATION HIGHLIGHT (while scrolling) ----------
    const sections = document.querySelectorAll('section[id]');
    function setActiveLink() {
        let current = '';
        const scrollPosition = window.scrollY + 100;
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        navLinks.forEach(link => {
            link.classList.remove('active-link');
            const href = link.getAttribute('href');
            if (href && href.includes(current) && current !== '') {
                link.classList.add('active-link');
            }
        });
    }
    window.addEventListener('scroll', setActiveLink);
    window.addEventListener('load', setActiveLink);

    // ---------- 6. FALLBACK FOR HOVER ON TOUCH (nothing heavy) ----------
    // ensure skill bars not already animated if page loads on resume
    // extra insurance: if bars visible on load, trigger immediately
    window.dispatchEvent(new Event('scroll'));

})();