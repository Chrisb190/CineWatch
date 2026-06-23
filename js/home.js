
// Curated data — 16 personally selected films 
const CURATED_FILMS = [
  {
    id: 278, Title: 'The Shawshank Redemption', Year: '1994',
    poster: 'images/TheShawshankRedemption.webp',
    imdbRating: '9.3', Genre: 'Drama',
    myRating: 5,
    myReview: 'The story is emotional without feeling forced, and the friendship between Andy and Red is what makes it so memorable.',
    tags: ['Hope', 'Prison', 'Drama', 'Masterpiece']
  },
  {
    id: 238, Title: 'The Godfather', Year: '1972',
    poster: 'images/TheGodfather.webp',
    imdbRating: '9.2', Genre: 'Crime, Drama',
    myRating: 5,
    myReview: "I was surprised by how engaging this movie was despite its age. The characters are unforgettable, and every decision Michael makes pulls you deeper into the story.",
    tags: ['Mafia', 'Family', 'Power', 'Classic']
  },
  {
    id: 155, Title: 'The Dark Knight', Year: '2008',
    poster: 'images/TheDarkKnight.webp',
    imdbRating: '9.0', Genre: 'Action, Crime, Drama',
    myRating: 5,
    myReview: "Heath Ledger's Joker completely steals the show. I've watched this movie several times and it still feels intense from beginning to end.",
    tags: ['Superhero', 'Thriller', 'Iconic', 'Joker']
  },
  {
    id: 389, Title: '12 Angry Men', Year: '1957',
    poster: 'images/12AngryMen.webp',
    imdbRating: '9.0', Genre: 'Crime, Drama',
    myRating: 5,
    myReview: "Proof that cinema doesn't need spectacle. Set almost entirely in one room, this is pure dramatic tension. The most compelling argument for reasonable doubt ever put on screen.",
    tags: ['Courtroom', 'Tension', 'Black & White', 'Perfect']
  },
  {
    id: 769, Title: 'GoodFellas', Year: '1990',
    poster: 'images/GoodFellas.webp',
    imdbRating: '8.7', Genre: 'Crime, Drama',
    myRating: 5,
    myReview: "Scorsese's kinetic masterpiece. The Copacabana tracking shot alone earns its place in history. Ray Liotta, Pesci, and De Niro together is an embarrassment of riches — a crime film that makes glamour feel like a trap.",
    tags: ['Crime', 'Scorsese', 'Classic', 'Gangster']
  },
  {
    id: 244786, Title: "Whiplash", Year: '1993',
    poster: 'images/Whiplash.webp',
    imdbRating: '9.0', Genre: 'Biography, Drama, Music',
    myRating: 5,
    myReview: "Very intense movie. It actually made me feel stressed watching it, but in a good way. Unforgettable ending.",
    tags: ['Music', 'Drama', 'Performance', 'Modern']
  },
  {
    id: 680, Title: 'Pulp Fiction', Year: '1994',
    poster: 'images/PulpFiction.webp',
    imdbRating: '8.9', Genre: 'Crime, Drama',
    myRating: 5,
    myReview: "Tarantino rewrote the rules of narrative cinema. Endlessly quotable, visually inventive, and somehow still fresh. The most influential film of the 90s, by a wide margin.",
    tags: ['Crime', 'Nonlinear', '90s', 'Cult']
  },
  {
    id: 49184, Title: 'West Beirut', Year: '2001',
    poster: 'images/WestBeirut.webp',
    imdbRating: '8.8', Genre: 'Drama',
    myRating: 4,
    myReview: "A really emotional film that shows Lebanon in a very real way. It feels personal and honest, and some scenes stayed in my head after watching it.",
    tags: ['Drama', 'Lebanon', 'Historical', 'Emotional']
  },
  {
    id: 157336, Title: 'Interstellar', Year: '2014',
    poster: 'images/Interstellar.webp',
    imdbRating: '8.7', Genre: 'Adventure, Drama, Sci-Fi',
    myRating: 5,
    myReview: "This is one of those movies that gets better every time I watch it. The visuals are incredible, but the emotional moments are what stay with me the most.",
    tags: ['Sci-Fi', 'Space', 'Emotional', 'Nolan']
  },
  {
    id: 807, Title: 'Seven', Year: '1998',
    poster: 'images/Se7en.webp',
    imdbRating: '8.6', Genre: 'Drama, Mystery, Thriller',
    myRating: 4,
    myReview: "Dark and disturbing in a way that actually works. The atmosphere is really heavy, and the ending still sticks with me.",
    tags: ['Mystery', 'Thriller', 'Psychological', 'Fincher']
  },
  {
    id: 1402, Title: 'The Pursuit Of Happyness', Year: '1999',
    poster: 'images/ThePursuitOfHappyness.webp',
    imdbRating: '8.8', Genre: 'Biography, Drama',
    myRating: 5,
    myReview: "A heartwarming story of perseverance and hope. Will Smith delivers a career-defining performance, capturing the struggles and emotions of a man trying to provide for his son.",
    tags: ['Drama', 'Biography', 'Heartwarming', 'Inspirational']
  },
  {
    id: 27205, Title: 'Inception', Year: '2010',
    poster: 'images/Inception.webp',
    imdbRating: '8.8', Genre: 'Action, Adventure, Sci-Fi',
    myRating: 4,
    myReview: "Nolan constructs a puzzle that rewards repeat viewing. It really keeps me thinking. The idea is really creative, and I still get confused in a good way every time.",
    tags: ['Mind-Bending', 'Sci-Fi', 'Nolan', 'Thriller']
  },
  {
    id: 2062, Title: 'Ratatouille', Year: '2007',
    poster: 'images/Ratatouille.webp',
    imdbRating: '8.1', Genre: 'Animation, Comedy, Family',
    myRating: 5,
    myReview: "My childhood favorite movie, and it still holds up. It's fun, heartwarming, and honestly just really comforting to watch even now.",
    tags: ['Pixar', 'Animation', 'Comedy', 'Food']
  },
  {
    id: 603, Title: 'The Matrix', Year: '1999',
    poster: 'images/TheMatrix.webp',
    imdbRating: '8.7', Genre: 'Action, Sci-Fi',
    myRating: 4,
    myReview: "Really cool concept and still feels ahead of its time. I like how it makes you question reality while still being a fun action movie.",
    tags: ['Sci-Fi', 'Action', 'Revolutionary', '90s']
  },
  {
    id: 98, Title: 'Gladiator', Year: '2000',
    poster: 'images/Gladiator.webp',
    imdbRating: '8.5', Genre: 'Action, Adventure, Drama',
    myRating: 4,
    myReview: "Very solid epic movie. The story is simple but really effective, and the ending is one of the most satisfying ones I've seen.",
    tags: ['Epic', 'Rome', 'Action', 'Crowe']
  },
  {
    id: 10681, Title: 'WALL·E', Year: '2008',
    poster: 'images/WALLE.webp',
    imdbRating: '8.4', Genre: 'Animation, Adventure, Family',
    myRating: 5,
    myReview: "Super emotional for an animated movie. It's quiet for a long time, but it still manages to say a lot without needing much dialogue.",
    tags: ['Pixar', 'Animation', 'Love', 'Sci-Fi']
  },
];


// Controller logic engine to link data records onto raw nodes
class HomeController {
  constructor() {
  this.featuredGrid    = document.getElementById('featured-grid');
  this.curatedGrid     = document.getElementById('curated-grid');
  this.trendingGrid    = document.getElementById('trending-grid');
  this.trendingExtra   = document.getElementById('trending-grid-extra');
  this.trendingViewAll = document.getElementById('trending-view-all');
  this.trendingData    = [];
  this.renderer        = new CardRenderer();
}

  async init() {
  await Promise.all([
    this._loadTrending(),
    this._loadNowPlaying(),
    this._loadCurated(),
  ]);
  new ScrollAnimator()._observe();
}

  async _loadNowPlaying() {
  if (!this.featuredGrid) return;
  this.featuredGrid.innerHTML = this._loadingHTML();
  try {
    const data = await fetchNowPlaying(1);
    this.featuredGrid.innerHTML = '';
    data.results.slice(0, 8).forEach((m, i) => {
      const card = this.renderer.render(m, this.featuredGrid);
      card.classList.add('fade-up');
      setTimeout(() => card.classList.add('visible'), i * 50);
    });
  } catch (err) {
    this.featuredGrid.innerHTML = this._errorHTML('Could not load movies');
  }
}

  _loadCurated() {
    if (!this.curatedGrid) return;
    this.curatedGrid.innerHTML = '';
    CURATED_FILMS.forEach((m, i) => {
      const card = this.renderer.render(m, this.curatedGrid);
      card.classList.add('fade-up');
      setTimeout(() => card.classList.add('visible'), i * 40);
    });
  }

  async _loadTrending() {
  if (!this.trendingGrid) return;
  this.trendingGrid.innerHTML = this._loadingHTML();
  try {
    const data = await fetchTrending(1);
    this.trendingData = data.results;
    this.trendingGrid.innerHTML = '';

    // Show first 6
    this.trendingData.slice(0, 6).forEach((m, i) => {
      const card = this.renderer.render(m, this.trendingGrid);
      card.classList.add('fade-up');
      setTimeout(() => card.classList.add('visible'), i * 60);
    });

    // Wire view all button
    this.trendingViewAll?.addEventListener('click', e => {
      e.preventDefault();
      const isExpanded = this.trendingExtra.style.display !== 'none';

      if (isExpanded) {
        this.trendingExtra.style.display = 'none';
        this.trendingExtra.innerHTML = '';
        this.trendingViewAll.textContent = 'View all →';
      } else {
        this.trendingExtra.style.display = 'grid';
        this.trendingData.slice(6, 12).forEach((m, i) => {
          const card = this.renderer.render(m, this.trendingExtra);
          card.classList.add('fade-up');
          setTimeout(() => card.classList.add('visible'), i * 60);
        });
        this.trendingViewAll.textContent = 'View less ↑';
      }
    });

  } catch {
    this.trendingGrid.innerHTML = this._errorHTML('Could not load trending');
  }
}
_loadingHTML() {
  return `<div class="state-container" style="grid-column:1/-1;min-height:200px">
    <div class="spinner"></div>
    <p class="state-sub">Fetching movies…</p>
  </div>`;
}

_errorHTML(title, detail = '') {
  return `<div class="state-container" style="grid-column:1/-1">
    <div class="state-icon">⚠️</div>
    <div class="state-title">${title}</div>
    ${detail ? `<p class="state-sub">${detail}</p>` : ''}
  </div>`;
}}

document.addEventListener('appReady', () => {
  const home = new HomeController();
  home.init();
});