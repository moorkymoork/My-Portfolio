/* 
   PORTFOLIO — script.js
   Features:
   - Dark and Light mode toggle (persisted)
   - Mobile nav toggle
   - Navbar scroll effect + active link
   - Scroll reveal animations
   - Skill bar animations (triggered on scroll)
   - Form validation
   - Smooth scroll
  */

'use strict';

// = THEME TOGGLE =
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

// Load saved theme (or default to dark)
const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
html.setAttribute('data-theme', savedTheme);

themeToggle.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('portfolio-theme', next);
});


// = MOBILE NAV TOGGLE =
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  // Prevent background scroll when menu is open
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

// Close menu when a link is clicked
navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
    document.body.style.overflow = '';
  });
});


// = NAVBAR SCROLL EFFECT =
const navbar = document.getElementById('navbar');

const handleNavbarScroll = () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
};
window.addEventListener('scroll', handleNavbarScroll, { passive: true });


// = ACTIVE NAV LINK ON SCROLL =
const sections     = document.querySelectorAll('section[id]');
const allNavLinks  = document.querySelectorAll('.nav-link');

const observeActive = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      allNavLinks.forEach(link => {
        link.classList.toggle(
          'active',
          link.getAttribute('href') === `#${id}`
        );
      });
    }
  });
}, { threshold: 0.45 });

sections.forEach(section => observeActive.observe(section));


// = SCROLL REVEAL =
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // Animate skill bars when their card becomes visible
      const bar = entry.target.querySelector('.skill-bar');
      if (bar) {
        const width = bar.getAttribute('data-width');
        // Small delay so CSS transition plays after element appears
        setTimeout(() => { bar.style.width = width + '%'; }, 100);
      }
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealElements.forEach(el => revealObserver.observe(el));


// = CONTACT FORM VALIDATION =
const form         = document.getElementById('contactForm');
const formSuccess  = document.getElementById('formSuccess');

const nameInput    = document.getElementById('name');
const emailInput   = document.getElementById('email');
const messageInput = document.getElementById('message');

const nameError    = document.getElementById('nameError');
const emailError   = document.getElementById('emailError');
const messageError = document.getElementById('messageError');

/**
 * Validates a single field and sets error text.
 * Returns true if valid.
 */
function validateField(input, errorEl, rules) {
  const value = input.value.trim();
  let error = '';

  if (rules.required && !value) {
    error = 'This field is required.';
  } else if (rules.minLength && value.length < rules.minLength) {
    error = `Minimum ${rules.minLength} characters required.`;
  } else if (rules.pattern && !rules.pattern.test(value)) {
    error = rules.patternMsg || 'Invalid format.';
  }

  errorEl.textContent = error;
  input.classList.toggle('error', !!error);
  return !error;
}

// Real-time validation on blur
nameInput.addEventListener('blur', () => {
  validateField(nameInput, nameError, { required: true, minLength: 2 });
});

emailInput.addEventListener('blur', () => {
  validateField(emailInput, emailError, {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    patternMsg: 'Please enter a valid email address.'
  });
});

messageInput.addEventListener('blur', () => {
  validateField(messageInput, messageError, { required: true, minLength: 10 });
});

// Clear error on input
[nameInput, emailInput, messageInput].forEach(input => {
  input.addEventListener('input', () => {
    input.classList.remove('error');
  });
});

// Form submit
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const validName    = validateField(nameInput, nameError, { required: true, minLength: 2 });
  const validEmail   = validateField(emailInput, emailError, {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    patternMsg: 'Please enter a valid email address.'
  });
  const validMessage = validateField(messageInput, messageError, { required: true, minLength: 10 });

  if (validName && validEmail && validMessage) {
    // Simulate form submission (replace with real API call if needed)
    const btn = form.querySelector('.submit-btn');
    btn.textContent = 'Sending…';
    btn.disabled = true;

    setTimeout(() => {
      formSuccess.classList.add('show');
      form.reset();
      btn.innerHTML = 'Send Message <span class="btn-arrow">→</span>';
      btn.disabled = false;

      // Hide success message after 5s
      setTimeout(() => formSuccess.classList.remove('show'), 5000);
    }, 1200);
  }
});


// = SMOOTH SCROLL POLYFILL (just in case) =
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});


// = HERO PARALLAX (subtle) =
const heroPhoto = document.querySelector('.hero-photo');

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  if (scrollY < window.innerHeight && heroPhoto) {
    heroPhoto.style.transform = `translateY(${scrollY * 0.25}px)`;
  }
}, { passive: true });


