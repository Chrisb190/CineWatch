// CLASS: ReviewManager ,handles storing and retrieving user ratings for movies using localStorage
class ReviewManager {
  constructor() { this.key = 'cinewatch_ratings'; }

  getAll() {
    try { return JSON.parse(localStorage.getItem(this.key)) || {}; }
    catch { return {}; }
  }

  // Store both rating (number) and text (string) together
  set(movieId, rating, text = '') {
    const all = this.getAll();
    const existing = all[movieId] || {};
    all[movieId] = {
      rating,
      text: text.trim(),
      updatedAt: Date.now(),
      movie: (typeof existing === 'number' ? null : existing.movie) || null,
    };
    localStorage.setItem(this.key, JSON.stringify(all));
  }

  // Store a movie snapshot so the reviews section can render it
  setMovie(movieId, movieSnap) {
    const all = this.getAll();
    if (all[movieId]) {
      const existing = typeof all[movieId] === 'number'
        ? { rating: all[movieId], text: '', updatedAt: Date.now() }
        : all[movieId];
      existing.movie = movieSnap;
      all[movieId] = existing;
      localStorage.setItem(this.key, JSON.stringify(all));
    }
  }

  get(movieId) {
    const entry = this.getAll()[movieId];
    if (!entry) return 0;
    return typeof entry === 'number' ? entry : (entry.rating || 0);
  }

  getText(movieId) {
    const entry = this.getAll()[movieId];
    if (!entry || typeof entry === 'number') return '';
    return entry.text || '';
  }

  getEntry(movieId) {
    const entry = this.getAll()[movieId];
    if (!entry) return null;
    if (typeof entry === 'number') return { rating: entry, text: '', movie: null };
    return entry;
  }

  // Returns all entries that have a written review
  getAllWithText() {
    const all = this.getAll();
    return Object.entries(all)
      .map(([id, entry]) => ({
        id: Number(id),
        ...(typeof entry === 'number' ? { rating: entry, text: '', movie: null } : entry),
      }))
      .filter(e => e.text && e.text.trim().length > 0);
  }

  remove(movieId) {
    const all = this.getAll();
    delete all[movieId];
    localStorage.setItem(this.key, JSON.stringify(all));
  }
}

// ============================================================
//  CLASS: RatingModal — star rating popup
// ============================================================
class RatingModal {
  constructor(reviews, onRate) {
    this.reviews  = reviews;
    this.onRate   = onRate;
    this.backdrop = document.getElementById('rate-modal');
    this.content  = document.getElementById('rate-modal-content');
    this.backdrop?.addEventListener('click', e => {
      if (e.target === this.backdrop) this.close();
    });
  }

  open(movie) {
    if (!this.backdrop) return;
    const current     = this.reviews.get(movie.id);
    const currentText = this.reviews.getText(movie.id);
    const _title  = movie.Title || movie.title || '';
    const _posterSrc = movie.Poster || movie.poster
      || (movie.poster_path ? `${CONFIG.IMG_URL}${movie.poster_path}` : null);
    const poster = _posterSrc
      ? `<img src="${_posterSrc}" alt="${_title}" style="width:60px;border-radius:6px;flex-shrink:0">`
      : '<div style="width:60px;height:90px;background:var(--bg-raised);border-radius:6px;display:flex;align-items:center;justify-content:center">🎬</div>';

    this.content.innerHTML = `
      <button class="cw-modal-close" id="rate-close">✕</button>
      <div style="padding:1.75rem">
        <div style="display:flex;gap:1rem;align-items:flex-start;margin-bottom:1.5rem">
          ${poster}
          <div>
            <div style="font-family:var(--font-display);font-size:1.2rem;letter-spacing:0.04em">${_title}</div>
            <div style="font-size:0.78rem;color:var(--text-dim);margin-top:0.2rem">${movie.Year || ''}</div>
          </div>
        </div>
        <p style="font-size:0.75rem;letter-spacing:0.1em;text-transform:uppercase;color:var(--text-dim);margin-bottom:0.75rem">Your Rating</p>
        <div class="star-picker" id="star-picker">
          ${[1,2,3,4,5].map(n => `
            <button class="star-pick ${n <= current ? 'active' : ''}" data-val="${n}" aria-label="${n} star${n>1?'s':''}">★</button>
          `).join('')}
        </div>
        <p style="font-size:0.72rem;color:var(--text-dim);text-align:center;margin-top:0.5rem;margin-bottom:1.5rem" id="star-label">
          ${current ? this._label(current) : 'Tap to rate'}
        </p>
        <p style="font-size:0.75rem;letter-spacing:0.1em;text-transform:uppercase;color:var(--text-dim);margin-bottom:0.5rem">
          Your Review <span style="color:var(--text-dim);font-size:0.65rem;text-transform:none;letter-spacing:0">(optional)</span>
        </p>
        <textarea id="review-text" class="review-textarea" placeholder="What did you think? Write your thoughts…" rows="4">${currentText}</textarea>
        <div style="display:flex;gap:0.75rem;margin-top:1.25rem">
          <button class="btn btn-primary" id="rate-save" style="flex:1">Save</button>
          ${current ? `<button class="btn btn-ghost" id="rate-clear">Clear</button>` : ''}
        </div>
      </div>`;

    let selected = current;

    const label = this.content.querySelector('#star-label');
    const stars = this.content.querySelectorAll('.star-pick');

    const highlight = val => {
      stars.forEach((s, i) => s.classList.toggle('active', i < val));
      label.textContent = val ? this._label(val) : 'Tap to rate';
    };

    stars.forEach(s => {
      s.addEventListener('mouseenter', () => highlight(+s.dataset.val));
      s.addEventListener('mouseleave', () => highlight(selected));
      s.addEventListener('click', () => { selected = +s.dataset.val; highlight(selected); });
    });

    this.content.querySelector('#rate-close')?.addEventListener('click', () => this.close());

    this.content.querySelector('#rate-save')?.addEventListener('click', () => {
      const text = this.content.querySelector('#review-text')?.value || '';
      if (!selected) {
        // Show inline warning if they wrote text but forgot to pick a star
        const existing = this.content.querySelector('.rate-warning');
        if (!existing) {
          const warn = document.createElement('p');
          warn.className = 'rate-warning';
          warn.textContent = '⚠ Pick a star rating.';
          this.content.querySelector('#star-picker').insertAdjacentElement('beforebegin', warn);
        }
        // Shake the star row to draw attention
        const picker = this.content.querySelector('#star-picker');
        picker.classList.remove('shake');
        void picker.offsetWidth; // reflow to re-trigger animation
        picker.classList.add('shake');
        return;
      }
      this.reviews.set(movie.id, selected, text);
      this.reviews.setMovie(movie.id, {
      id:     movie.id,
      Title:  movie.Title  || movie.title  || '',
      Year:   movie.Year   || (movie.release_date ? movie.release_date.slice(0,4) : ''),
      Poster: movie.Poster || movie.poster
              || (movie.poster_path ? `${CONFIG.IMG_URL}${movie.poster_path}` : null),
    });
      this.onRate(movie.id, selected);
      document.dispatchEvent(new CustomEvent('reviewsUpdated'));
      toast.success(`Review saved for "${movie.Title}"`);
      this.close();
    });

    this.content.querySelector('#rate-clear')?.addEventListener('click', () => {
      this.reviews.remove(movie.id);
      this.onRate(movie.id, 0);
      document.dispatchEvent(new CustomEvent('reviewsUpdated'));
      this.close();
    });

    this.backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  close() {
    this.backdrop?.classList.remove('open');
    document.body.style.overflow = '';
  }

  _label(n) {
    return ['', 'Poor', 'Fair', 'Good', 'Great', 'Masterpiece'][n] || '';
  }
}

// ============================================================
//  CLASS: MyspaceCardRenderer
// ============================================================
class MyspaceCardRenderer {
  constructor(myspaceMgr, reviewMgr, ratingModal, toastMgr, onUpdate) {
    this.myspace   = myspaceMgr;
    this.reviews     = reviewMgr;
    this.ratingModal = ratingModal;
    this.toast       = toastMgr;
    this.onUpdate    = onUpdate;
  }

  render(movie, container) {
    const card = document.createElement('div');
    card.className = 'movie-card wl-card';
    card.dataset.id = movie.id;

    const title  = movie.Title  || movie.title  || '';
    const year   = movie.Year   || (movie.release_date ? movie.release_date.slice(0,4) : '');
    const poster = movie.Poster || movie.poster
      || (movie.poster_path ? `${CONFIG.IMG_URL}${movie.poster_path}` : null);    const rating  = this.reviews.get(movie.id);
    const watched = movie.watched;
    const isFav   = movie.liked || false;

    card.innerHTML = `
      ${poster
        ? `<img src="${poster}" alt="${movie.Title}" loading="lazy">`
        : `<div class="no-poster"><span>🎬</span><p>No image</p></div>`}

      <!-- Always-visible title strip -->
      <div class="card-bottom">
        <div class="card-title">${title}</div>
        <div class="card-year">${year}</div>
      </div>

      <!-- Watched dim overlay -->
      <div class="wl-watched-overlay ${watched ? 'visible' : ''}">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>
      </div>

      <!-- User rating badge -->
      ${rating ? `<div class="wl-rating-badge">${'★'.repeat(rating)}</div>` : ''}

      <!--action bar -->
      <div class="wl-actions">

        <!-- Eye — toggle watched -->
        <button class="wl-btn wl-eye ${watched ? 'active' : ''}" title="${watched ? 'Mark unwatched' : 'Mark watched'}" aria-label="Toggle watched">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="${watched ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
        </button>

        <!-- Heart — toggle favorite -->
        <button class="wl-btn wl-heart ${isFav ? 'active' : ''}" title="${isFav ? 'Remove from favorites' : 'Add to favorites'}" aria-label="Toggle favorite">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="${isFav ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>

        <!-- Ellipsis — dropdown menu -->
        <button class="wl-btn wl-menu" title="More options" aria-label="More options">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/>
          </svg>
        </button>

      </div>

      <!-- Dropdown menu -->
      <div class="wl-dropdown" id="drop-${movie.id}">
        <button class="wl-drop-item rate-btn">
          <span>★</span> Rate this film
          ${rating ? `<span class="wl-drop-current">${rating}★</span>` : ''}
        </button>
        <button class="wl-drop-item details-btn">
          <span>ℹ</span> View details
        </button>
        <div class="wl-drop-divider"></div>
        <button class="wl-drop-item remove-btn" style="color:var(--red)">
          <span>✕</span> Remove from list
        </button>
      </div>`;

    this._attachEvents(card, movie);
    container.appendChild(card);

    // Close dropdown when clicking outside
    document.addEventListener('click', e => {
      if (!card.contains(e.target)) {
        card.querySelector('.wl-dropdown')?.classList.remove('open');
      }
    });

    return card;
  }

  _attachEvents(card, movie) {
    const drop    = card.querySelector('.wl-dropdown');
    const eyeBtn  = card.querySelector('.wl-eye');
    const heartBtn= card.querySelector('.wl-heart');
    const menuBtn = card.querySelector('.wl-menu');
    const rateBtn = card.querySelector('.rate-btn');
    const detBtn  = card.querySelector('.details-btn');
    const remBtn  = card.querySelector('.remove-btn');

    // Eye — toggle watched
  
    eyeBtn.addEventListener('click', e => {
    e.stopPropagation();
    if (movie.watched) {
      // In Watched tab — remove entirely
      myspace.remove(movie.id);
      this.toast.remove(`"${movie.Title || movie.title || ''}" removed`);
    } else {
      // In Watchlist tab — move to Watched
      myspace.toggleWatched(movie.id);
      movie.watched = true;
      this.toast.info(`"${movie.Title || movie.title || ''}" moved to Watched`);
    }
    this.onUpdate();
  });
    // Heart — liked toggle
    heartBtn.addEventListener('click', e => {
      e.stopPropagation();
      myspace.toggleLiked(movie.id);
      movie.liked = !movie.liked;
      heartBtn.classList.toggle('active', movie.liked);
      heartBtn.querySelector('svg').setAttribute('fill', movie.liked ? 'currentColor' : 'none');
      heartBtn.title = movie.liked ? 'Remove from likes' : 'Like this film';
      this.toast.success(movie.liked ? `"${title}" added to likes` : `"${title}" removed from likes`);
      this.onUpdate();
    });

    // Ellipsis — toggle dropdown
    menuBtn.addEventListener('click', e => {
      e.stopPropagation();
      // Close all other dropdowns
      document.querySelectorAll('.wl-dropdown.open').forEach(d => {
        if (d !== drop) d.classList.remove('open');
      });
      drop.classList.toggle('open');
    });

    // Rate
    rateBtn.addEventListener('click', e => {
      e.stopPropagation();
      drop.classList.remove('open');
      this.ratingModal.open(movie);
    });

    // Details
    detBtn.addEventListener('click', e => {
      e.stopPropagation();
      drop.classList.remove('open');
      modal?.open(movie.id);
    });

    // Remove
    remBtn.addEventListener('click', e => {
      e.stopPropagation();
      drop.classList.remove('open');
      myspace.remove(movie.id);
      this.reviews.remove(movie.id);
      this.toast.remove(`"${title}" removed`);
      this.onUpdate();
    });
  }
}

// ============================================================
//  CLASS: MyspaceController
// ============================================================
class MyspaceController {
  constructor() {
    this.grid        = document.getElementById('myspace-grid');
    this.statsEl     = document.getElementById('myspace-stats');
    this.tabMyspace  = document.getElementById('tab-myspace');
    this.tabWatched  = document.getElementById('tab-watched');
    this.tabLikes    = document.getElementById('tab-likes');
    this.activeTab   = 'watched';

    this.reviews     = new ReviewManager();
    this.tabReviews  = document.getElementById('tab-reviews');

    this.ratingModal = new RatingModal(this.reviews, (id, val) => {
      const card = this.grid?.querySelector(`[data-id="${id}"]`);
      if (card) {
        const existing = card.querySelector('.wl-rating-badge');
        if (existing) existing.remove();
        if (val) {
          const badge = document.createElement('div');
          badge.className = 'wl-rating-badge';
          badge.textContent = '★'.repeat(val);
          card.appendChild(badge);
        }
        const rateItem = card.querySelector('.rate-btn .wl-drop-current');
        if (rateItem) rateItem.textContent = val ? `${val}★` : '';
      }
      this._updateStats();
    });

    this.wlRenderer = new MyspaceCardRenderer(
      myspace, this.reviews,
      this.ratingModal, toast,
      () => { this._render(); this._updateStats(); }
    );
  }

  init() {
    this._setupTabs();
    this._render();
    this._updateStats();

    document.addEventListener('myspaceUpdated', () => {
      this._render();
      this._updateStats();
    });
    document.addEventListener('reviewsUpdated', () => {
      this._render();
      this._updateStats();
    });
  }

  // Delegate edit-review button clicks from the reviews section
  _setupReviewEditDelegate() {
    const section = document.getElementById('reviews-section');
    if (!section) return;
    section.addEventListener('click', e => {
      const btn = e.target.closest('.review-entry-edit');
      if (!btn) return;
      const id = Number(btn.dataset.id);
      // Find the movie from myspace list or the stored snapshot
      const fromList = myspace.getAll().find(m => m.id === id);
      const entry    = this.reviews.getEntry(id);
      const snap     = fromList || entry?.movie;
      if (snap) this.ratingModal.open(snap);
    });
  }

  _setupTabs() {
    const tabs = [
      { btn: this.tabMyspace, key: 'myspace' },
      { btn: this.tabWatched,   key: 'watched' },
      { btn: this.tabLikes,     key: 'likes' },
      { btn: this.tabReviews,   key: 'reviews' },
    ];
    tabs.forEach(({ btn, key }) => {
      btn?.addEventListener('click', () => {
        tabs.forEach(t => t.btn?.classList.remove('active'));
        btn.classList.add('active');
        this.activeTab = key;
        this._render();
      });
    });
  }

  _getFiltered() {
    const all = myspace.getAll();
    if (this.activeTab === 'watched')   return all.filter(m => m.watched);
    if (this.activeTab === 'likes')     return all.filter(m => m.liked);
    return all.filter(m => !m.watched); // 'myspace' — only unwatched films
  }

  _render() {
    if (!this.grid) return;
      this.grid.className = 'card-grid';
    if (this.activeTab === 'reviews') {
    this._renderReviews();
    return;
  }
    const movies = this._getFiltered();

    if (movies.length === 0) {
      this.grid.className = 'reviews-container';
      this.grid.innerHTML = this._emptyHTML();
      return;
    }

    this.grid.innerHTML = '';
    movies.forEach((m, i) => {
      const card = this.wlRenderer.render(m, this.grid);
      card.classList.add('fade-up');
      setTimeout(() => card.classList.add('visible'), i * 40);
    });
  }

  _renderReviews() {
    this.grid.className = 'reviews-container';
  const entries = this.reviews.getAllWithText();

  if (entries.length === 0) {
    this.grid.innerHTML = `
      <div class="empty-myspace">
        <h3>No reviews yet</h3>
        <p>Rate a film and write your thoughts to see them here.</p>
      </div>`;
    return;
  }

  const sorted = entries.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));

  this.grid.innerHTML = `
    <div class="reviews-list">
      ${sorted.map(e => this._reviewCardHTML(e)).join('')}
    </div>`;

  this.grid.querySelectorAll('.review-entry').forEach((el, i) => {
    el.classList.add('fade-up');
    setTimeout(() => el.classList.add('visible'), i * 60);
  });

  // Wire edit buttons
  this.grid.querySelectorAll('.review-entry-edit').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = Number(btn.dataset.id);
      const fromList = myspace.getAll().find(m => m.id === id);
      const entry    = this.reviews.getEntry(id);
      const snap     = fromList || entry?.movie;
      if (snap) this.ratingModal.open(snap);
    });
  });
}

_reviewCardHTML(e) {
  const stars    = e.rating ? '★'.repeat(e.rating) + '☆'.repeat(5 - e.rating) : '';
  const label    = ['', 'Poor', 'Fair', 'Good', 'Great', 'Masterpiece'][e.rating] || '';
  const posterSrc = e.movie?.Poster || e.movie?.poster || null;
  const poster   = posterSrc
    ? `<img src="${posterSrc}" alt="${e.movie?.Title || ''}" loading="lazy">`
    : `<div class="review-entry-no-poster">🎬</div>`;
  const title    = e.movie?.Title || `Film #${e.id}`;
  const year     = e.movie?.Year  || '';
  const date     = e.updatedAt
    ? new Date(e.updatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    : '';

  return `
    <article class="review-entry" data-id="${e.id}">
      <div class="review-entry-poster">${poster}</div>
      <div class="review-entry-body">
        <div class="review-entry-header">
          <div>
            <div class="review-entry-title">${title}</div>
            ${year ? `<div class="review-entry-year">${year}</div>` : ''}
          </div>
          <div class="review-entry-meta">
            ${stars ? `<div class="review-entry-stars" title="${label}">${stars}</div>` : ''}
            ${date  ? `<div class="review-entry-date">${date}</div>`  : ''}
          </div>
        </div>
        <p class="review-entry-text">${e.text}</p>
        <button class="review-entry-edit btn btn-ghost" data-id="${e.id}" 
          style="font-size:0.75rem;padding:0.35rem 0.85rem;margin-top:0.75rem">
          Edit Review
        </button>
      </div>
    </article>`;
}

  _updateStats() {
    if (!this.statsEl) return;
    const all     = myspace.getAll();
    const watched = all.filter(m => m.watched).length;
    const liked   = all.filter(m => m.liked).length;
    const rated   = all.filter(m => this.reviews.get(m.id) > 0).length;

    this.statsEl.innerHTML = `
  <div class="stat-card">
    <div class="stat-value">${watched}</div>
    <div class="stat-label">Watched</div>
  </div>
  <div class="stat-card">
    <div class="stat-value">${all.filter(m => !m.watched).length}</div>
    <div class="stat-label">Watchlist</div>
  </div>
  <div class="stat-card">
    <div class="stat-value">${liked}</div>
    <div class="stat-label">Likes</div>
  </div>
  <div class="stat-card">
    <div class="stat-value">${this.reviews.getAllWithText().length}</div>
    <div class="stat-label">Reviews</div>
  </div>`;
  }

  _emptyHTML() {
    const messages = {
      watched:   { title: 'Nothing watched yet', sub: 'Browse movies and mark them as watched.' },  
      myspace: { title: 'No films yet',       sub: 'Browse movies and save them to your myspace.' },
      likes:     { title: 'No likes yet',        sub: 'Hit the heart icon on any film to add it here.' },
      reviews:   { title: 'No reviews yet',      sub: 'Rate a film and write your thoughts to see them here.' },
    };
    const m = messages[this.activeTab];
    return `
      <div class="empty-myspace">
        <h3>${m.title}</h3>
        <p>${m.sub}</p>
        ${this.activeTab === 'myspace' ? `<a href="browse.html" class="btn btn-primary" style="margin-top:0.5rem">Browse Movies</a>` : ''}
      </div>`;
  }
}

// ── Boot ─────────────────────────────────────────────────────
document.addEventListener('appReady', () => {
  const wl = new MyspaceController();
  wl.init();
});