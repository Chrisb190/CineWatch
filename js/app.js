

// ============================================================
//  CLASS: NavController — mobile toggle navigation controller
// ============================================================
class NavController {
  constructor() {
    this.hamburger = document.querySelector('.hamburger');
    this.navLinks  = document.getElementById('nav-links');
    
    if (this.hamburger) {
      this.hamburger.addEventListener('click', () => this.toggleMenu());
    }
    this._setActiveLink();
  }

  toggleMenu() {
    this.navLinks.classList.toggle('open');
    this.hamburger.classList.toggle('active');
  }

  _setActiveLink() {
    const path = window.location.pathname.split('/').pop() || 'home.html';
    document.querySelectorAll('.nav-links a').forEach(a => {
      if (a.getAttribute('href') === path) a.classList.add('active');
    });
  }
}

// ============================================================
//  CLASS: ScrollAnimator — handles viewport reveal elements
// ============================================================
class ScrollAnimator {
  constructor() {
    this.elements = document.querySelectorAll('.fade-up');
    this.options  = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
    this.init();
  }

  init() {
    if (!('IntersectionObserver' in window)) {
      // Fallback for browsers that do not support IntersectionObserver
      this.elements.forEach(el => el.classList.add('visible'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // Reveal animation occurs only once
        }
      });
    }, this.options);

    this.elements.forEach(el => observer.observe(el));
  }
}

// Global Core Infrastructure Boots
document.addEventListener('DOMContentLoaded', () => {
  new NavController();
  new ScrollAnimator();
});