
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
      <div class="card-actions">
        <button class="card-btn details-btn" data-id="${movie.id}">Details</button>
      </div>
    </div>
    `;

    container.appendChild(card);
    card.querySelector('.details-btn')
      ?.addEventListener('click', e => {
        e.stopPropagation();
        modal.open(movie.id);
      });

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

async function fetchMovieDetail(id) {
  const url = `${CONFIG.API_URL}/movie/${id}?api_key=${CONFIG.API_KEY}&append_to_response=credits`;
  const res  = await fetch(url);
  if (!res.ok) throw new Error('Network error');
  return res.json();
}

// ============================================================
//  CLASS: MovieModal
// ============================================================
class MovieModal {
  constructor() {
    this.backdrop = document.getElementById('movie-modal');
    this.content  = this.backdrop?.querySelector('.cw-modal-content');
    this._setupClose();
  }

  _setupClose() {
    this.backdrop?.addEventListener('click', e => {
      if (e.target === this.backdrop) this.close();
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') this.close();
    });
  }

  async open(movieId) {
    if (!this.backdrop) return;
    this.backdrop.classList.add('open');
    this.content.innerHTML = `<div class="state-container" style="min-height:300px"><div class="spinner"></div></div>`;
    try {
      const m       = await fetchMovieDetail(movieId);
      const poster  = m.poster_path ? `${CONFIG.IMG_LG}${m.poster_path}` : null;
      const rating  = m.vote_average ? (m.vote_average / 2).toFixed(1) : '—';
      const runtime = m.runtime ? `${Math.floor(m.runtime / 60)}h ${m.runtime % 60}m` : '';
      const genres  = m.genres?.map(g => g.name).join(', ') || '';
      const director = m.credits?.crew?.find(c => c.job === 'Director')?.name || '';
      const cast     = m.credits?.cast?.slice(0, 5).map(c => c.name).join(', ') || '';

      this.content.innerHTML = `
        <button class="cw-modal-close" id="modal-close">✕</button>
        <div class="cw-modal-body">
          <div class="cw-modal-poster">
            ${poster
              ? `<img src="${poster}" alt="${m.title}">`
              : `<div class="no-poster"><span>🎬</span></div>`}
          </div>
          <div class="cw-modal-info">
            <h2 class="cw-modal-title">${m.title}</h2>
            <div class="cw-modal-meta">
              ${m.release_date ? `<span>${m.release_date.slice(0,4)}</span>` : ''}
              ${runtime        ? `<span>${runtime}</span>`                   : ''}
              ${rating         ? `<span class="cw-modal-rating">★ ${rating}</span>` : ''}
            </div>
            ${genres   ? `<p class="cw-modal-genres">${genres}</p>`          : ''}
            ${m.overview ? `<p class="cw-modal-overview">${m.overview}</p>` : ''}
            ${director ? `<p class="cw-modal-credit"><strong>Director:</strong> ${director}</p>` : ''}
            ${cast     ? `<p class="cw-modal-credit"><strong>Cast:</strong> ${cast}</p>`         : ''}
          </div>
        </div>
      `;
      document.getElementById('modal-close')
        ?.addEventListener('click', () => this.close());
    } catch {
      this.content.innerHTML = `<div class="state-container"><div class="state-icon">⚠️</div><div class="state-title">Failed to load</div></div>`;
    }
  }

  close() {
    this.backdrop?.classList.remove('open');
    setTimeout(() => { if (this.content) this.content.innerHTML = ''; }, 300);
  }
}


// ============================================================
//  SHARED INIT
// ============================================================
let modal;

document.addEventListener('DOMContentLoaded', () => {
  modal  = new MovieModal();
  new NavController();
  new ScrollAnimator();
  document.dispatchEvent(new CustomEvent('appReady'));
});