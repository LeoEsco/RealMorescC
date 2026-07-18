/* ============================================================
   BLOODSHOT.IO — INTERACTIONS
   Minimal, purposeful JavaScript.
   ============================================================ */

(function () {
  'use strict';

  // ── Smooth Scroll ───────────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;

      var target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      // Close mobile menu if open
      if (document.body.classList.contains('menu-open')) {
        closeMobileMenu();
      }

      var navHeight = 72;
      var targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    });
  });

  // ── Navbar Show/Hide on Scroll ──────────────────────────
  var nav = document.getElementById('siteNav');
  var lastScrollY = 0;
  var scrollThreshold = 80;

  function handleNavScroll() {
    var currentScrollY = window.pageYOffset;

    if (currentScrollY > scrollThreshold) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }

    if (currentScrollY > lastScrollY && currentScrollY > 300) {
      nav.classList.add('hidden');
    } else {
      nav.classList.remove('hidden');
    }

    lastScrollY = currentScrollY;
  }

  var scrollTicking = false;
  window.addEventListener('scroll', function () {
    if (!scrollTicking) {
      window.requestAnimationFrame(function () {
        handleNavScroll();
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  }, { passive: true });

  // ── Mobile Menu ─────────────────────────────────────────
  var navToggle = document.getElementById('navToggle');
  var mobileMenu = document.getElementById('mobileMenu');

  function closeMobileMenu() {
    document.body.classList.remove('menu-open');
    mobileMenu.classList.remove('open');
  }

  if (navToggle) {
    navToggle.addEventListener('click', function () {
      var isOpen = document.body.classList.contains('menu-open');
      if (isOpen) {
        closeMobileMenu();
      } else {
        document.body.classList.add('menu-open');
        mobileMenu.classList.add('open');
      }
    });
  }

  // Close mobile menu when clicking links
  if (mobileMenu) {
    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        closeMobileMenu();
      });
    });
  }

  // ── Intersection Observer — Reveal on Scroll ────────────
  var revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    // Fallback: show everything
    revealElements.forEach(function (el) {
      el.classList.add('revealed');
    });
  }

  // ── Pricing Tabs ────────────────────────────────────────
  var tabButtons = document.querySelectorAll('.tab-btn');
  var pricingPanels = document.querySelectorAll('.pricing-panel');

  tabButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var targetTab = this.getAttribute('data-tab');

      // Update buttons
      tabButtons.forEach(function (b) { b.classList.remove('active'); });
      this.classList.add('active');

      // Update panels
      pricingPanels.forEach(function (panel) {
        panel.classList.remove('active');
      });

      var targetPanel = document.getElementById('panel-' + targetTab);
      if (targetPanel) {
        targetPanel.classList.add('active');

        // Trigger reveal for newly visible cards
        targetPanel.querySelectorAll('.price-card').forEach(function (card) {
          card.classList.add('revealed');
        });
      }
    });
  });

  // ── FAQ Accordion ───────────────────────────────────────
  var faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(function (item) {
    var question = item.querySelector('.faq-question');
    var answer = item.querySelector('.faq-answer');

    question.addEventListener('click', function () {
      var isOpen = item.classList.contains('open');

      // Close all
      faqItems.forEach(function (otherItem) {
        otherItem.classList.remove('open');
        var otherAnswer = otherItem.querySelector('.faq-answer');
        if (otherAnswer) otherAnswer.style.maxHeight = null;
      });

      // Open clicked if it wasn't open
      if (!isOpen) {
        item.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

})();
