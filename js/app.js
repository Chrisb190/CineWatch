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

//  CLASS: CardRenderer (Initial Basic Pipeline Structure)
// ============================================================
class CardRenderer {
  render(movie, container) {
    const card = document.createElement('div');
    card.className = 'movie-card';
    card.dataset.id = movie.id;
    
    // Check if poster exists from local data property fields
    let posterSrc;

    if (movie.poster) {
      posterSrc = movie.poster; // local curated data
    } 
    else if (movie.poster_path) {
      posterSrc = `${CONFIG.IMG_URL}${movie.poster_path}`; // API data
    } 
    else {
      posterSrc = fallback;
    } 
    // Simple early scaffolding code layout (no badges or watch buttons yet)
    card.innerHTML = `
      <img src="${posterSrc}" alt="${movie.Title || movie.title}">
      <div style="padding: 0.75rem; background: var(--bg-card);">
        <h4 style="margin: 0 0 0.25rem 0; font-size: 1rem; color: var(--text); font-weight: 500;">${movie.Title || movie.title}</h4>
        <small style="color: var(--text-muted);">${movie.Year || (movie.release_date ? movie.release_date.substring(0,4) : '')}</small>
      </div>
    `;
    
    container.appendChild(card);
    return card;
  }
}

// Global Core Infrastructure Boots
document.addEventListener('DOMContentLoaded', () => {
  new NavController();
  new ScrollAnimator();
});