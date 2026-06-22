// CLASS: ReviewManager ,handles storing and retrieving user ratings for movies using localStorage
class ReviewManager {
  constructor() {
    this.key = 'cinewatch_reviews';
  }

  getAll() {
    try {
      return JSON.parse(localStorage.getItem(this.key)) || {};
    } catch { return {}; }
  }

  get(movieId) {
    return this.getAll()[movieId] ?? null;
  }

  set(movieId, rating) {
    const all = this.getAll();
    all[movieId] = rating;
    localStorage.setItem(this.key, JSON.stringify(all));
  }

  remove(movieId) {
    const all = this.getAll();
    delete all[movieId];
    localStorage.setItem(this.key, JSON.stringify(all));
  }
}

// ============================================================
//  CLASS: RatingModal — star picker modal
// ============================================================
class RatingModal {
  constructor(reviewManager, onSave) {
    this.reviews   = reviewManager;
    this.onSave    = onSave;
    this.backdrop  = document.getElementById('rate-modal');
    this.content   = document.getElementById('rate-modal-content');
    this.currentId = null;
    this._setupClose();
  }

  _setupClose() {
    this.backdrop?.addEventListener('click', e => {
      if (e.target === this.backdrop) this.close();
    });
  }

  open(movie) {
    if (!this.backdrop) return;
    this.currentId = movie.id;
    const current  = this.reviews.get(movie.id) ?? 0;
    const title    = movie.Title || movie.title || '';

    this.content.innerHTML = `
      <div style="padding:1.5rem">
        <h3 style="font-family:var(--font-display);font-size:1.4rem;letter-spacing:0.05em;margin-bottom:0.25rem">
          Rate Film
        </h3>
        <p style="color:var(--text-muted);font-size:0.85rem;margin-bottom:1.25rem">${title}</p>
        <div class="star-picker" id="star-picker">
          ${[1,2,3,4,5].map(n => `
            <button class="star-btn ${n <= current ? 'active' : ''}" data-val="${n}">★</button>
          `).join('')}
        </div>
        <div style="display:flex;gap:0.75rem;margin-top:1.5rem">
          <button class="btn btn-primary" id="save-rating" style="flex:1">Save</button>
          <button class="btn btn-ghost" id="cancel-rating" style="flex:1">Cancel</button>
          ${current ? `<button class="btn btn-ghost" id="remove-rating" style="color:var(--red);border-color:var(--red)">Remove</button>` : ''}
        </div>
      </div>
    `;

    this._bindStars();

    document.getElementById('save-rating')?.addEventListener('click', () => {
      const active = this.content.querySelectorAll('.star-btn.active').length;
      if (active > 0) {
        this.reviews.set(this.currentId, active);
        this.onSave();
        this.close();
      }
    });

    document.getElementById('cancel-rating')?.addEventListener('click', () => this.close());

    document.getElementById('remove-rating')?.addEventListener('click', () => {
      this.reviews.remove(this.currentId);
      this.onSave();
      this.close();
    });

    this.backdrop.classList.add('open');
  }

  _bindStars() {
    const btns = this.content.querySelectorAll('.star-btn');
    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        const val = +btn.dataset.val;
        btns.forEach(b => b.classList.toggle('active', +b.dataset.val <= val));
      });
    });
  }

  close() {
    this.backdrop?.classList.remove('open');
  }
}

// ============================================================
//  CLASS: MyspaceCardRenderer
// ============================================================
class MyspaceCardRenderer {
  constructor(myspaceManager, reviewManager, ratingModal) {
    this.myspace = myspaceManager;
    this.reviews = reviewManager;
    this.ratingModal = ratingModal;
  }

  render(movie, container) {
    const title   = movie.Title || movie.title || '';
    const year    = movie.Year  || '';
    const poster = movie.Poster || movie.poster
     || (movie.poster_path ? `${CONFIG.IMG_URL}${movie.poster_path}` : null);    const rating  = this.reviews.get(movie.id);
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
        ${rating ? `<span class="card-rating">★ ${rating}/5</span>` : ''}
        <h3 class="card-overlay-title">${title}</h3>
        <div class="card-actions">
        ${!movie.watched ? `<button class="card-btn watched-btn">Watched</button>` : ''}
        <button class="card-btn rate-btn">★ Rate</button>
        <button class="card-btn remove-btn" style="color:var(--red);border-color:var(--red)">Remove</button>
        </div>
    `;

    card.querySelector('.rate-btn')?.addEventListener('click', e => {
      e.stopPropagation();
      this.ratingModal.open(movie);
    });

    card.querySelector('.remove-btn')?.addEventListener('click', e => {
      e.stopPropagation();
      this.myspace.remove(movie.id);
    });
        card.querySelector('.watched-btn')?.addEventListener('click', e => {
    e.stopPropagation();
    this.myspace.toggleWatched(movie.id);
    });

    container.appendChild(card);
    return card;
  }
}

// ============================================================
//  CLASS: MyspaceController
// ============================================================
class MyspaceController {
  constructor() {
    this.myspace     = myspace;
    this.reviews     = new ReviewManager();
    this.ratingModal = new RatingModal(this.reviews, () => this.render());
    this.renderer    = new MyspaceCardRenderer(this.myspace, this.reviews, this.ratingModal);
    this.grid        = document.getElementById('myspace-grid');
    this.statsEl     = document.getElementById('myspace-stats');
    this.activeTab   = 'watchlist';

    this._setupTabs();
    document.addEventListener('myspaceUpdated', () => this.render());
  }

  _setupTabs() {
    document.getElementById('tab-myspace')?.addEventListener('click', () => {
      this.activeTab = 'watchlist';
      this._setActiveTab('tab-myspace');
      this.render();
    });
    document.getElementById('tab-watched')?.addEventListener('click', () => {
      this.activeTab = 'watched';
      this._setActiveTab('tab-watched');
      this.render();
    });
    document.getElementById('tab-likes')?.addEventListener('click', () => {
      this.activeTab = 'likes';
      this._setActiveTab('tab-likes');
      this.render();
    });
  }

  _setActiveTab(id) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(id)?.classList.add('active');
  }

  render() {
    this._renderStats();
    this._renderGrid();
  }

  _renderStats() {
    if (!this.statsEl) return;
    const stats = this.myspace.getStats();
    this.statsEl.innerHTML = `
      <div class="stat-card">
        <div class="stat-value">${stats.total}</div>
        <div class="stat-label">In Watchlist</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${stats.watched}</div>
        <div class="stat-label">Watched</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${stats.toWatch}</div>
        <div class="stat-label">To Watch</div>
      </div>
    `;
  }

  _renderGrid() {
    if (!this.grid) return;
    const all = this.myspace.getAll();

    let films;
    if (this.activeTab === 'watchlist') {
      films = all.filter(m => !m.watched);
    } else if (this.activeTab === 'watched') {
      films = all.filter(m => m.watched);
    } else {
      films = all.filter(m => m.liked);
    }

    if (films.length === 0) {
      this.grid.innerHTML = `
        <div class="empty-myspace" style="grid-column:1/-1">
          <div class="big-icon">🎬</div>
          <h3>Nothing here yet</h3>
          <p>Add movies from the Home or Browse page.</p>
          <a href="browse.html" class="btn btn-primary">Browse Movies</a>
        </div>`;
      return;
    }

    this.grid.innerHTML = '';
    films.forEach((m, i) => {
      const card = this.renderer.render(m, this.grid);
      card.classList.add('fade-up');
      setTimeout(() => card.classList.add('visible'), i * 40);
    });
  }
}

// ── Boot ─────────────────────────────────────────────────────
document.addEventListener('appReady', () => {
  if (document.getElementById('myspace-grid')) {
    const ctrl = new MyspaceController();
    ctrl.render();
  }
});