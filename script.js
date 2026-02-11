// ====================================================
// script.js — LOHIXIS Premium Portfolio
// Senior Front-End Architecture: 
// - Scroll-triggered animations (fade-up)
// - Navbar solid state + blur
// - Skill bar animation (once visible)
// - Smooth scrolling (native enhancement)
// - Mobile toggle
// - Micro-interactions (glow, active states)
// 100% vanilla, clean, production-ready
// ====================================================

(function() {
  "use strict";

  // ---------- 1. CACHE DOM ELEMENTS ----------
  const navbar = document.getElementById('mainNav');
  const navMenu = document.querySelector('.nav-list');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.querySelectorAll('.nav-link, .nav-logo');
  const animatedElements = document.querySelectorAll('[data-animate]');
  const skillFillBars = document.querySelectorAll('.progress-fill');
  const skillPercentSpans = document.querySelectorAll('.skill-percent');

  // State
  let skillAnimationTriggered = false;

  // ---------- 2. NAVBAR SCROLL EFFECT (solid + blur) ----------
  function handleNavbarScroll() {
    if (window.scrollY > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  // ---------- 3. SMOOTH SCROLL (internal anchor links) ----------
  function initSmoothScroll() {
    navLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        // Only for hash links that exist on page
        if (href && href.startsWith('#') && href.length > 1) {
          e.preventDefault();
          const targetId = href.substring(1);
          const targetElement = document.getElementById(targetId);
          
          if (targetElement) {
            // Close mobile menu if open
            if (navMenu && navMenu.classList.contains('active')) {
              navMenu.classList.remove('active');
            }
            
            targetElement.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
            
            // Update URL without jumping (optional)
            history.pushState(null, null, href);
          }
        }
      });
    });
  }

  // ---------- 4. SCROLL ANIMATION (fade-up) using Intersection Observer ----------
  function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          // Optional: keep observing? we can unobserve after animation
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -30px 0px' }); // subtle trigger

    animatedElements.forEach(el => observer.observe(el));
  }

  // ---------- 5. SKILL BARS ANIMATION (trigger when #resume is visible) ----------
  function animateSkillBars() {
    if (skillAnimationTriggered) return;

    const resumeSection = document.getElementById('resume');
    if (!resumeSection) return;

    const rect = resumeSection.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;

    // If section is in viewport (with offset)
    if (rect.top < windowHeight - 80 && rect.bottom > 0) {
      // Set width from data-width attribute
      skillPercentSpans.forEach((span, index) => {
        const widthValue = span.getAttribute('data-width');
        if (widthValue) {
          // Find the parent .skill-bar-item then .progress-fill
          const parentItem = span.closest('.skill-bar-item');
          if (parentItem) {
            const fillDiv = parentItem.querySelector('.progress-fill');
            if (fillDiv) {
              fillDiv.style.width = widthValue + '%';
            }
          }
        }
      });
      skillAnimationTriggered = true; // ensure only once
    }
  }

  // ---------- 6. ACTIVE NAVIGATION HIGHLIGHT (based on scroll) ----------
  function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    let currentSectionId = '';
    const scrollY = window.scrollY + 120; // offset for navbar

    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      const sectionBottom = sectionTop + section.offsetHeight;
      
      if (scrollY >= sectionTop && scrollY < sectionBottom) {
        currentSectionId = section.getAttribute('id');
      }
    });

    // Update active class on nav links
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('active-link');
      const href = link.getAttribute('href');
      if (href && href === `#${currentSectionId}`) {
        link.classList.add('active-link');
      }
    });
  }

  // ---------- 7. MOBILE TOGGLE ----------
  function initMobileToggle() {
    if (navToggle && navMenu) {
      navToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        navMenu.classList.toggle('active');
      });

      // Close menu when clicking outside (optional, good UX)
      document.addEventListener('click', function(event) {
        if (navMenu.classList.contains('active') && 
            !navMenu.contains(event.target) && 
            !navToggle.contains(event.target)) {
          navMenu.classList.remove('active');
        }
      });
    }
  }

  // ---------- 8. BUTTON RIPPLE / GLOW (micro-interaction) ----------
  // CSS already handles .btn-glow, but we can add dynamic ripple effect if needed
  // Simpler: ensure btn-glow appears on hover — CSS does it.
  // We'll add a tiny data attribute for future, but not required.

  // ---------- 9. INITIAL LOAD & EVENT LISTENERS ----------
  window.addEventListener('load', function() {
    handleNavbarScroll();
    initScrollAnimations(); // starts observer
    
    // small delay for hero immediate appearance
    setTimeout(() => {
      document.querySelectorAll('.hero [data-animate]').forEach(el => {
        el.classList.add('animated');
      });
    }, 200);
    
    // Check if skill section is already visible on load
    animateSkillBars();
  });

  window.addEventListener('scroll', function() {
    handleNavbarScroll();
    updateActiveNavLink();
    animateSkillBars(); // will only trigger once
  });

  window.addEventListener('resize', function() {
    // re-check on resize (optional)
  });

  // ---------- 10. MANUAL INVOCATION ----------
  initSmoothScroll();
  initMobileToggle();
  updateActiveNavLink(); // set initial active link

  // Edge case: If skill bars never animate due to scroll position,
  // but we already check on load and scroll.
  // Force check after 1s in case of fast rendering
  setTimeout(animateSkillBars, 1000);

})();
