const GENRE_MAP = {
  all:         null,
  action:      28,
  drama:       18,
  comedy:      35,
  thriller:    53,
  horror:      27,
  scifi:       878,
  romance:     10749,
  animation:   16,
  documentary: 99,
};

// ============================================================
//  CLASS: BrowseController
// ============================================================
class BrowseController {
  constructor() {
    this.grid        = document.getElementById('browse-grid');
    this.searchInput = document.getElementById('browse-search');
    this.yearFilter  = document.getElementById('year-filter');
    this.resultCount = document.getElementById('result-count');
    this.pagination  = document.getElementById('pagination');
    this.genrePills  = document.querySelectorAll('.genre-pill');

    this.currentPage  = 1;
    this.totalPages   = 1;
    this.totalResults = 0;
    this.activeGenre  = 'all';
    this.searchQuery  = '';
    this.searchTimer  = null;
  }

  init() {
    this._buildYearOptions();
    this._setupListeners();
    this._fetch();
  }

  _buildYearOptions() {
  if (!this.yearFilter) return;
  const options = [
    { label: 'Any Year', value: '' },
    { label: '2026',     value: '2026' },
    { label: '2020s',    value: '2020s' },
    { label: '2010s',    value: '2010s' },
    { label: '2000s',    value: '2000s' },
    { label: '1990s',    value: '1990s' },
    { label: '1980s',    value: '1980s' },
    { label: '1970s',  value: '1970s' },
    { label: '1960s',  value: '1960s' },
    { label: '1950s',  value: '1950s' },
    
  ];
  options.forEach(o => {
    const opt = document.createElement('option');
    opt.value = o.value;
    opt.textContent = o.label;
    this.yearFilter.appendChild(opt);
  });
}
  _setupListeners() {
    // Live search with 500ms debounce
    this.searchInput?.addEventListener('input', () => {
      clearTimeout(this.searchTimer);
      this.searchTimer = setTimeout(() => {
        this.searchQuery = this.searchInput.value.trim();
        this.currentPage = 1;
        this._fetch();
      }, 500);
    });

    this.yearFilter?.addEventListener('change', () => {
      this.currentPage = 1;
      this._fetch();
    });

    this.genrePills.forEach(pill => {
      pill.addEventListener('click', () => {
        this.genrePills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        this.activeGenre = pill.dataset.genre;
        this.currentPage = 1;
        this._fetch();
      });
    });
  }

  async _fetch() {
    if (!this.grid) return;
    this.grid.innerHTML = this._loadingHTML();
    this.pagination.innerHTML = '';

    try {
const yearVal = this.yearFilter?.value || '';
let yearFrom = '';
let yearTo   = '';

if (yearVal === '2026') {
  yearFrom = yearTo = '2026';
} else if (yearVal === '2020s') {
  yearFrom = '2020'; yearTo = '2029';
} else if (yearVal === '2010s') {
  yearFrom = '2010'; yearTo = '2019';
} else if (yearVal === '2000s') {
  yearFrom = '2000'; yearTo = '2009';
} else if (yearVal === '1990s') {
  yearFrom = '1990'; yearTo = '1999';
} else if (yearVal === '1980s') {
  yearFrom = '1980'; yearTo = '1989';
} else if (yearVal === '1970s') {
  yearFrom = '1970'; yearTo = '1979';
} else if (yearVal === '1960s') {
  yearFrom = '1960'; yearTo = '1969';
} else if (yearVal === '1950s') {
  yearFrom = '1950'; yearTo = '1959';
}      let data;

      if (this.searchQuery) {
        let url = `${CONFIG.API_URL}/search/movie?api_key=${CONFIG.API_KEY}&query=${encodeURIComponent(this.searchQuery)}&page=${this.currentPage}&include_adult=false`;
        if (yearFrom) url += `&primary_release_date.gte=${yearFrom}-01-01&primary_release_date.lte=${yearTo}-12-31`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('Network error');
        data = await res.json();
      } else {
        const genreId = GENRE_MAP[this.activeGenre];
        let url = `${CONFIG.API_URL}/discover/movie?api_key=${CONFIG.API_KEY}&sort_by=popularity.desc&page=${this.currentPage}&include_adult=false`;
        if (genreId) url += `&with_genres=${genreId}`;
        if (yearFrom) url += `&primary_release_date.gte=${yearFrom}-01-01&primary_release_date.lte=${yearTo}-12-31`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('Network error');
        data = await res.json();
      }

      this.totalResults = data.total_results || 0;
      this.totalPages   = data.total_pages   || 1;

      if (this.resultCount) {
        this.resultCount.textContent = `${this.totalResults.toLocaleString()} results`;
      }

      this._renderGrid(data.results);
      this._renderPagination();

    } catch (err) {
      this._renderError();
      if (this.resultCount) this.resultCount.textContent = '0 results';
    }
  }

  _renderGrid(movies) {
    this.grid.innerHTML = '';
    if (!movies || movies.length === 0) {
      this.grid.innerHTML = `
        <div class="state-container" style="grid-column:1/-1">
          <div class="state-title">No Results</div>
          <p class="state-sub">Try a different search term or genre.</p>
        </div>`;
      return;
    }
    movies.slice(0, 18).forEach((m, i) => {
          const card = new CardRenderer().render(m, this.grid);
      card.classList.add('fade-up');
      setTimeout(() => card.classList.add('visible'), i * 30);
    });
  }

  _renderPagination() {
    if (!this.pagination) return;
    const total = Math.min(this.totalPages, 500);
    if (total <= 1) return;

    this.pagination.innerHTML = '';

    const createBtn = (label, page, disabled = false, active = false) => {
      const btn = document.createElement('button');
      btn.className = `page-btn${active ? ' active' : ''}`;
      btn.textContent = label;
      btn.disabled = disabled;
      if (!disabled && !active) {
        btn.addEventListener('click', () => {
          this.currentPage = page;
          this._fetch();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        });
      }
      return btn;
    };

    this.pagination.appendChild(createBtn('←', this.currentPage - 1, this.currentPage === 1));

    const start = Math.max(1, this.currentPage - 2);
    const end   = Math.min(total, start + 4);
    for (let p = start; p <= end; p++) {
      this.pagination.appendChild(createBtn(p, p, false, p === this.currentPage));
    }

    this.pagination.appendChild(createBtn('→', this.currentPage + 1, this.currentPage >= total));
  }

  _loadingHTML() {
    return `<div class="state-container" style="grid-column:1/-1;min-height:300px">
      <div class="spinner"></div>
      <p class="state-sub">Searching…</p>
    </div>`;
  }

  _renderError() {
    this.grid.innerHTML = `
      <div class="state-container" style="grid-column:1/-1">
        <div class="state-title">Failed to Load</div>
        <p class="state-sub">Could not connect to TMDb. Check your connection.</p>
      </div>`;
  }
}

// ── Boot ─────────────────────────────────────────────────────
document.addEventListener('appReady', () => {
  if (document.getElementById('browse-grid')) {
    const browse = new BrowseController();
    browse.init();
  }
});