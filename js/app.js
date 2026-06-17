
// ── Config ──────────────────────────────────────────────────
const CONFIG = {
  API_KEY: '',//key is kept private 
  API_URL: 'https://api.themoviedb.org/3',
  IMG_URL: 'https://image.tmdb.org/t/p/w500',
  IMG_LG:  'https://image.tmdb.org/t/p/w780',
  PER_PAGE: 20,
};

// ============================================================
//  CLASS: CardRenderer — builds movie card HTML
// ============================================================
class CardRenderer {
  constructor(myspace, modal, toast) {
    this.myspace = myspace;
    this.modal   = modal;
    this.toast   = toast;
  }

  render(movie, container) {
    const title = movie.title || movie.Title || '';

    const year = movie.release_date
      ? movie.release_date.slice(0, 4)
      : (movie.Year || '');

    let poster = null;

    if (movie.poster) {
      // Local curated images (images/ folder)
      poster = movie.poster;
    } else if (movie.poster_path) {
      // TMDb API images — not used yet
      poster = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
    } else if (movie.Poster) {
      poster = movie.Poster;
    }

    const rating = movie.vote_average
      ? (movie.vote_average / 2).toFixed(1)
      : (movie.imdbRating || null);

    const genre = movie.genre_names?.[0]
      || (movie.Genre ? movie.Genre.split(',')[0].trim() : '');

    const card = document.createElement('article');
    card.className = 'movie-card';

    card.innerHTML = `
      ${poster
        ? `<img src="${poster}" alt="${title}" loading="lazy">`
        : `<div class="no-poster"><span>🎬</span><p>No image</p></div>`}

      <div class="card-bottom">
        <div class="card-title">${title}</div>
        <div class="card-year">${year}</div>
      </div>

      <div class="card-overlay">
        ${rating ? `<span class="card-rating">★ ${rating}</span>` : ''}
        ${genre  ? `<span class="card-genre">${genre}</span>`     : ''}
        <h3 class="card-overlay-title">${title}</h3>
        <p class="card-year">${year}</p>
      </div>
    `;

    container.appendChild(card);
    return card;
  }
}

// ============================================================
//  CLASS: NavController
// ============================================================
class NavController {
  constructor() {
    this.hamburger = document.querySelector('.hamburger');
    this.navLinks  = document.querySelector('.nav-links');
    this._markActive();
    this._setupHamburger();
  }

  _markActive() {
    const page = location.pathname.split('/').pop() || 'home.html';
    document.querySelectorAll('.nav-links a').forEach(a => {
      if (a.getAttribute('href') === page) a.classList.add('active');
    });
  }

  _setupHamburger() {
    this.hamburger?.addEventListener('click', () => {
      this.navLinks?.classList.toggle('open');
    });
  }
}

// ============================================================
//  CLASS: ScrollAnimator
// ============================================================
class ScrollAnimator {
  constructor() {
    this.observer = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          this.observer.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });
    this._observe();
  }

  _observe() {
    document.querySelectorAll('.fade-up').forEach(el => this.observer.observe(el));
  }
}

// ============================================================
//  TMDb API HELPERS
// ============================================================
async function fetchNowPlaying(page = 1) {
  const url = `${CONFIG.API_URL}/movie/now_playing?api_key=${CONFIG.API_KEY}&page=${page}`;
  const res  = await fetch(url);
  if (!res.ok) throw new Error('Network error');
  return res.json();
}

async function fetchTrending(page = 1) {
  const url = `${CONFIG.API_URL}/trending/movie/week?api_key=${CONFIG.API_KEY}&page=${page}`;
  const res  = await fetch(url);
  if (!res.ok) throw new Error('Network error');
  return res.json();
}

// ============================================================
//  SHARED INIT
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  new NavController();
  new ScrollAnimator();
  document.dispatchEvent(new CustomEvent('appReady'));
});