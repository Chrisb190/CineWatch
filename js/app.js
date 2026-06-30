
// ── Config ──────────────────────────────────────────────────
const CONFIG = {
  API_KEY: '75b6850c1ec54ca4c602aeecf24fb429',
  API_URL: 'https://api.themoviedb.org/3',
  IMG_URL: 'https://image.tmdb.org/t/p/w500',
  IMG_LG:  'https://image.tmdb.org/t/p/w780',
};

// ============================================================
//  CLASS: CardRenderer — builds movie card HTML
// ============================================================
class CardRenderer {
  constructor(myspace, modal) {
    this.myspace = myspace;
    this.modal   = modal;
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
    const alreadyAdded = myspace?.has(movie.id);

    card.innerHTML = `
      ${poster
        ? `<img src="${poster}" alt="${title}" loading="lazy">`
        : `<div class="no-poster"><span>🎬</span><p>No image</p></div>`}

      <div class="card-bottom">
        <div class="card-title">${title}</div>
        <div class="card-year">${year}</div>
      </div>

          <div class="card-overlay">
      ${rating ? `<div class="card-score">★ ${rating}</div>` : ''}
      ${genre  ? `<span class="card-genre">${genre}</span>`     : ''}
      <h3 class="card-overlay-title">${title}</h3>
      <p class="card-year">${year}</p>
      <div class="card-actions" style="position:relative">
  <button class="card-btn add-watch" data-id="${movie.id}"}>
    ${alreadyAdded ? '✓ Added' : '+ Watch'}
  </button>  <button class="card-btn details-btn" data-id="${movie.id}">Details</button>
  </div>
    </div>
    `;

    container.appendChild(card);
    card.querySelector('.details-btn')
      ?.addEventListener('click', e => {
        e.stopPropagation();
        modal.open(movie.id);
      });

      card.querySelector('.add-watch')
  ?.addEventListener('click', e => {
    e.stopPropagation();

    const btn = card.querySelector('.add-watch');
    const existing = document.querySelector('.watch-dropdown');
    if (existing) existing.remove();

    const dropdown = document.createElement('div');
    dropdown.className = 'watch-dropdown';
    
    if (myspace.has(movie.id)) {
  const entry = myspace.getAll().find(m => m.id === movie.id);
  if (entry?.watched) {
    dropdown.innerHTML = `
      <button class="dropdown-opt" data-action="remove">Remove from Watched</button>
      <button class="dropdown-opt" data-action="to-watchlist">Move to Watchlist</button>
    `;
  } else {
    dropdown.innerHTML = `
      <button class="dropdown-opt" data-action="remove">Remove from Watchlist</button>
      <button class="dropdown-opt" data-action="to-watched">Move to Watched</button>
    `;
  }
} else {
  dropdown.innerHTML = `
    <button class="dropdown-opt" data-action="watchlist">Add to Watchlist</button>
    <button class="dropdown-opt" data-action="watched">Mark as Watched</button>
  `;
}

    dropdown.style.cssText = `
  position:absolute;
  bottom:calc(100% + 6px);
  z-index:9999;
`;
btn.closest('.card-actions').appendChild(dropdown);

    dropdown.querySelectorAll('.dropdown-opt').forEach(opt => {
      opt.addEventListener('click', ev => {
        ev.stopPropagation();
        const action = opt.dataset.action;
        if (action === 'remove') {
          myspace.remove(movie.id);
        } else if (action === 'watchlist') {
          myspace.add({ ...movie, watched: false });
        } else if (action === 'watched') {
          myspace.add({ ...movie, watched: true });
        } else if (action === 'to-watched') {
          myspace.toggleWatched(movie.id);
        } else if (action === 'to-watchlist') {
          myspace.toggleWatched(movie.id);
        }
        dropdown.remove();
      });
    });

    setTimeout(() => {
      document.addEventListener('click', () => dropdown.remove(), { once: true });
    }, 0);
  });
  document.addEventListener('myspaceUpdated', () => {
  const btn = card.querySelector('.add-watch');
  if (!btn) return;
  const inList = myspace?.has(movie.id);
  btn.textContent = inList ? '✓ Added' : '+ Watch';
  btn.disabled    = false;
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
    const page = location.pathname.split('/').pop() || 'index.html';
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
  constructor(myspace) {
    this.myspace = myspace;
    this.backdrop  = document.getElementById('movie-modal');
    if (!this.backdrop) return;
    this.backdrop.querySelector('.cw-modal-close')?.addEventListener('click', () => this.close());
    this.backdrop.addEventListener('click', e => { if (e.target === this.backdrop) this.close(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') this.close(); });
  }

  async open(movieId, hideActions = false) {
    this.hideActions = hideActions;
    if (!this.backdrop) return;
    this.backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
    this._renderLoading();

    try {
      const m = await fetchMovieDetail(movieId);
      this._render(m);
    } catch {
      this._renderError();
    }
  }

  close() {
    if (!this.backdrop) return;
    this.backdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  _render(m) {
    const inMyspace = this.myspace.has(m.id);
    const poster      = m.poster_path ? `${CONFIG.IMG_LG}${m.poster_path}` : null;
    const rating      = m.vote_average ? (m.vote_average / 2).toFixed(1) : null;
    const year        = m.release_date ? m.release_date.slice(0, 4) : '';
    const genres      = m.genres ? m.genres.map(g => g.name).join(', ') : '';
    const runtime     = m.runtime ? `${m.runtime} min` : '';
    const director    = m.credits?.crew?.find(p => p.job === 'Director')?.name || '';
    const cast        = m.credits?.cast?.slice(0, 4).map(p => p.name).join(', ') || '';

    // Build minimal movie object to store in myspace
    const movieSnap = {
      id:          m.id,
      Title:       m.title,
      Year:        year,
      Poster:      m.poster_path ? `${CONFIG.IMG_URL}${m.poster_path}` : null,
      imdbRating:  rating,
      Genre:       genres,
    };

    

    this.backdrop.querySelector('.cw-modal-content').innerHTML = `${(() => {
  const curated = (typeof CURATED_FILMS !== 'undefined')
    ? CURATED_FILMS.find(f => f.id === m.id)
    : null;
  if (!curated) return '';
  return `
    <div class="my-take">
      <div class="my-take-header">
        <span class="my-take-label">Personal Thoughts</span>
        <span class="my-take-stars">${'★'.repeat(curated.myRating)}${'☆'.repeat(5 - curated.myRating)}</span>
      </div>
      <p class="my-take-text">${curated.myReview}</p>
      <div class="my-take-tags">
        ${curated.tags.map(t => `<span class="my-take-tag">${t}</span>`).join('')}
      </div>
    </div>`;
})()}
      <button class="cw-modal-close">✕</button>
      <div class="cw-modal-poster-row">
        <div class="cw-modal-poster">
          ${poster
            ? `<img src="${poster}" alt="${m.title}" loading="lazy">`
            : `<div style="height:100%;display:flex;align-items:center;justify-content:center;color:var(--text-dim);font-size:2rem">🎬</div>`}
        </div>
        <div class="cw-modal-info">
          <div class="cw-modal-title">${m.title}</div>
          ${m.tagline ? `<div class="cw-modal-tagline">${m.tagline}</div>` : ''}
          <div class="cw-modal-badges">
            ${year    ? `<span class="badge">${year}</span>`           : ''}
            ${runtime ? `<span class="badge">${runtime}</span>`        : ''}
            ${rating  ? `<span class="badge gold">★ ${rating}</span>`  : ''}
            ${m.adult === false ? `<span class="badge">PG</span>`      : ''}
          </div>
          <p class="cw-modal-plot">${m.overview || 'No synopsis available.'}</p>
          ${!this.hideActions ? `
          <div class="cw-modal-actions">
            <button class="btn ${inMyspace ? 'btn-ghost remove-modal-btn' : 'btn-primary add-modal-btn'}"
              data-movie='${JSON.stringify(movieSnap)}'>
              ${inMyspace ? '🗑 Remove from Watchlist' : '＋ Add to Watchlist'}
            </button>
          </div>` : ''}
        </div>
      </div>
      <div class="cw-modal-body">
        <div class="cw-modal-detail-grid">
          ${director ? `<div class="detail-item"><label>Director</label><span>${director}</span></div>`     : ''}
          ${cast     ? `<div class="detail-item"><label>Cast</label><span>${cast}</span></div>`             : ''}
          ${genres   ? `<div class="detail-item"><label>Genre</label><span>${genres}</span></div>`          : ''}
          ${m.original_language ? `<div class="detail-item"><label>Language</label><span>${m.original_language.toUpperCase()}</span></div>` : ''}
          ${m.production_countries?.[0] ? `<div class="detail-item"><label>Country</label><span>${m.production_countries[0].name}</span></div>` : ''}
          ${m.budget  ? `<div class="detail-item"><label>Budget</label><span>$${(m.budget/1e6).toFixed(0)}M</span></div>`   : ''}
          ${m.revenue ? `<div class="detail-item"><label>Revenue</label><span>$${(m.revenue/1e6).toFixed(0)}M</span></div>` : ''}
          ${m.vote_count ? `<div class="detail-item"><label>Votes</label><span>${m.vote_count.toLocaleString()}</span></div>` : ''}
        </div>
      </div>`;

    this.backdrop.querySelector('.cw-modal-close')?.addEventListener('click', () => this.close());

    const addBtn = this.backdrop.querySelector('.add-modal-btn');
    const remBtn = this.backdrop.querySelector('.remove-modal-btn');
    if (addBtn) {
      addBtn.addEventListener('click', () => {
        const data = JSON.parse(addBtn.dataset.movie);
        if (this.myspace.add(data)) {
          document.dispatchEvent(new CustomEvent('myspaceUpdated'));
          this.close();
        }
      });
    }
    if (remBtn) {
      remBtn.addEventListener('click', () => {
        this.myspace.remove(m.id);
        document.dispatchEvent(new CustomEvent('myspaceUpdated'));
        this.close();
      });
    }
  }

  _renderLoading() {
    this.backdrop.querySelector('.cw-modal-content').innerHTML = `
      <button class="cw-modal-close">✕</button>
      <div class="state-container" style="min-height:300px">
        <div class="spinner"></div>
        <p class="state-sub">Loading movie details…</p>
      </div>`;
    this.backdrop.querySelector('.cw-modal-close')?.addEventListener('click', () => this.close());
  }

  _renderError() {
    this.backdrop.querySelector('.cw-modal-content').innerHTML = `
      <button class="cw-modal-close">✕</button>
      <div class="state-container" style="min-height:300px">
        <div class="state-title">Couldn't Load</div>
        <p class="state-sub">Failed to fetch movie details. Please try again.</p>
      </div>`;
    this.backdrop.querySelector('.cw-modal-close')?.addEventListener('click', () => this.close());
  }
}

// ============================================================
//  CLASS: MyspaceManager
// ============================================================
class MyspaceManager {
  constructor() {
    this.key = 'cinewatch_myspace';
  }

  getAll() {
    try {
      return JSON.parse(localStorage.getItem(this.key)) || [];
    } catch { return []; }
  }

  add(movie) {
    const list = this.getAll();
    if (!this.has(movie.id)) {
      list.push({ ...movie, addedAt: Date.now(), watched: movie.watched ?? false });
      this._save(list);
      return true;
    }
    return false;
  }

  remove(id) {
    const list = this.getAll().filter(m => m.id !== id);
    this._save(list);
  }

  has(id) {
    return this.getAll().some(m => m.id === id);
  }

  toggleWatched(id) {
    const list = this.getAll().map(m =>
      m.id === id ? { ...m, watched: !m.watched } : m
    );
    this._save(list);
  }

  toggleLiked(id) {
    const list = this.getAll().map(m =>
      m.id === id ? { ...m, liked: !m.liked } : m
    );
    this._save(list);
  }

  getStats() {
    const list = this.getAll();
    return {
      total:   list.length,
      watched: list.filter(m => m.watched).length,
      toWatch: list.filter(m => !m.watched).length,
    };
  }

  _save(list) {
    localStorage.setItem(this.key, JSON.stringify(list));
    document.dispatchEvent(new CustomEvent('myspaceUpdated'));
  }
}

// ============================================================
//  SHARED INIT
// ============================================================
let modal;
let myspace;

document.addEventListener('DOMContentLoaded', () => {
  myspace = new MyspaceManager();
  modal   = new MovieModal(myspace);
  new NavController();
  new ScrollAnimator();
  document.dispatchEvent(new CustomEvent('appReady'));
});