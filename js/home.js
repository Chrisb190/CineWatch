
// Curated data — 16 personally selected films 
const CURATED_FILMS = [
  {
    id: 278, Title: 'The Shawshank Redemption', Year: '1994',
    poster: 'images/TheShawshankRedemption.webp',
    imdbRating: '9.3', Genre: 'Drama',
    myRating: 5,
    myReview: 'A timeless meditation on hope and friendship. Every frame feels deliberate. Robbins and Freeman deliver careers-best performances in a story that will outlast us all.',
    tags: ['Hope', 'Prison', 'Drama', 'Masterpiece']
  },
  {
    id: 238, Title: 'The Godfather', Year: '1972',
    poster: 'images/TheGodfather.webp',
    imdbRating: '9.2', Genre: 'Crime, Drama',
    myRating: 5,
    myReview: "Coppola's magnum opus. The quiet scenes hit harder than the violence — a portrait of power, loyalty, and inevitable corruption that feels as urgent today as in 1972.",
    tags: ['Mafia', 'Family', 'Power', 'Classic']
  },
  {
    id: 155, Title: 'The Dark Knight', Year: '2008',
    poster: 'images/TheDarkKnight.webp',
    imdbRating: '9.0', Genre: 'Action, Crime, Drama',
    myRating: 5,
    myReview: "Ledger's Joker is one of cinema's all-time great performances. Nolan turned a superhero film into a philosophical thriller about the nature of chaos. Still unmatched.",
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
    id: 424, Title: "Schindler's List", Year: '1993',
    poster: 'images/SchindlersList.webp',
    imdbRating: '9.0', Genre: 'Biography, Drama, History',
    myRating: 5,
    myReview: "Spielberg's most important film. Shot in stark black and white, the girl in the red coat remains one of cinema's most devastating symbols. Essential viewing.",
    tags: ['Holocaust', 'History', 'Emotional', 'Powerful']
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
    id: 120, Title: 'The Fellowship of the Ring', Year: '2001',
    poster: 'images/TheFellowshipOfTheRing.webp',
    imdbRating: '8.8', Genre: 'Adventure, Drama, Fantasy',
    myRating: 4,
    myReview: "The perfect opening act. Shore's score, Weta's practical design, and a cast that genuinely believes in Middle-earth — this set a bar that fantasy filmmaking still chases.",
    tags: ['Fantasy', 'Adventure', 'Epic', 'Iconic']
  },
  {
    id: 157336, Title: 'Interstellar', Year: '2014',
    poster: 'images/Interstellar.webp',
    imdbRating: '8.7', Genre: 'Adventure, Drama, Sci-Fi',
    myRating: 5,
    myReview: "Nolan at his most ambitious and his most human. The docking scene, the waterworld, the bookshelf — a film that makes you feel the weight of time and love simultaneously.",
    tags: ['Sci-Fi', 'Space', 'Emotional', 'Nolan']
  },
  {
    id: 857, Title: 'Saving Private Ryan', Year: '1998',
    poster: 'images/SavingPrivateRyan.webp',
    imdbRating: '8.6', Genre: 'Drama, War',
    myRating: 4,
    myReview: "The Omaha Beach sequence alone changed how war was depicted on screen. Brutal, visceral, and achingly human — Spielberg's love letter to the Greatest Generation.",
    tags: ['War', 'WWII', 'Emotional', 'Hanks']
  },
  {
    id: 550, Title: 'Fight Club', Year: '1999',
    poster: 'images/FightClub.webp',
    imdbRating: '8.8', Genre: 'Drama',
    myRating: 5,
    myReview: "Fincher's darkest provocation. A film that gets under your skin and stays there. The first rule is you don't talk about it — the second is that you absolutely should.",
    tags: ['Cult', '90s', 'Twist', 'Identity']
  },
  {
    id: 27205, Title: 'Inception', Year: '2010',
    poster: 'images/Inception.webp',
    imdbRating: '8.8', Genre: 'Action, Adventure, Sci-Fi',
    myRating: 4,
    myReview: "The heist movie as dreamscape. Nolan constructs a puzzle that rewards repeat viewing. The spinning top ending is cinema's greatest mic drop — intentionally unanswerable.",
    tags: ['Mind-Bending', 'Sci-Fi', 'Nolan', 'Thriller']
  },
  {
    id: 129, Title: 'Spirited Away', Year: '2001',
    poster: 'images/SpiritedAway.webp',
    imdbRating: '8.6', Genre: 'Animation, Adventure, Family',
    myRating: 5,
    myReview: "Miyazaki's masterwork. A child's journey through a spirit world that feels genuinely alien and deeply Japanese. The bathhouse scenes are some of the most imaginative world-building in animation.",
    tags: ['Anime', 'Miyazaki', 'Fantasy', 'Magical']
  },
  {
    id: 603, Title: 'The Matrix', Year: '1999',
    poster: 'images/TheMatrix.webp',
    imdbRating: '8.7', Genre: 'Action, Sci-Fi',
    myRating: 4,
    myReview: "The Wachowskis invented a new cinematic grammar with bullet time. Still philosophically rich and technically stunning, even after countless imitators have diluted its impact.",
    tags: ['Sci-Fi', 'Action', 'Revolutionary', '90s']
  },
  {
    id: 98, Title: 'Gladiator', Year: '2000',
    poster: 'images/Gladiator.webp',
    imdbRating: '8.5', Genre: 'Action, Adventure, Drama',
    myRating: 4,
    myReview: "Crowe's finest hour. Scott builds Ancient Rome with grandeur and grit, then populates it with a villain (Phoenix) who steals every scene he's in. Are you not entertained?",
    tags: ['Epic', 'Rome', 'Action', 'Crowe']
  },
  {
    id: 10681, Title: 'WALL·E', Year: '2008',
    poster: 'images/WALL-E.webp',
    imdbRating: '8.4', Genre: 'Animation, Adventure, Family',
    myRating: 5,
    myReview: "Pixar's most daring film. Nearly silent for its first act, it tells a love story through gesture and beeps. A devastating critique of consumer culture wrapped in the most adorable robot ever.",
    tags: ['Pixar', 'Animation', 'Love', 'Sci-Fi']
  },
];

// Controller logic engine to link data records onto raw nodes
class HomeController {
  constructor() {
    this.curatedGrid = document.getElementById('curated-grid');
    this.renderer = new CardRenderer();
  }

  init() {
    this._loadCurated();
  }

  _loadCurated() {
    if (!this.curatedGrid) return;
    this.curatedGrid.innerHTML = '';
    
    CURATED_FILMS.forEach((m) => {
      this.renderer.render(m, this.curatedGrid);
    });
  }
}

// Automatically boot the controller context if we are on the Home page grid space
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('curated-grid')) {
    const home = new HomeController();
    home.init();
  }
}); 