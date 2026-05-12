/* ═══════════════════════════════════════════
   ROAMLY — DISCOVERY PROTOTYPE  ·  script.js
   ═══════════════════════════════════════════ */


/* ── TRIP DAYS ─────────────────────────────── */
const TRIP_DAYS = [
  { short: 'Sat', date: 6  },
  { short: 'Sun', date: 7  },
  { short: 'Mon', date: 8  },
  { short: 'Tue', date: 9  },
  { short: 'Wed', date: 10 },
  { short: 'Thu', date: 11 },
  { short: 'Fri', date: 12 },
];


/* ── SUGGESTION DATA ───────────────────────────
   Indexed by [group][vibe] — each returns 3 venues */
const SUGGESTIONS = {
  solo: {
    zen: [
      { name: 'National Gallery of Victoria', meta: 'Southbank · 10am – 5pm', desc: 'World-class art in a peaceful setting. Free entry to the permanent collection. Lose a few hours in here.', img: 'ngv' },
      { name: 'Royal Botanic Gardens',         meta: 'South Yarra · Sunrise – Sunset', desc: 'Wander 38 hectares of curated gardens along the Yarra. Completely free, completely beautiful.', img: 'gardens' },
      { name: 'Auction Rooms',                 meta: 'North Melbourne · 7am – 4pm', desc: 'Melbourne\'s most celebrated specialty coffee in a quiet, airy warehouse. Bring a book.', img: 'coffee' },
    ],
    mid: [
      { name: 'Queen Victoria Market',     meta: 'CBD · 6am – 2pm',   desc: 'Melbourne\'s beating heart. Fresh produce, street food, local makers, and an energy that\'s impossible not to love.', img: 'market' },
      { name: 'Smith Street Gallery Crawl',meta: 'Collingwood · All day', desc: 'Independent galleries, vintage shops, and the best flat white you\'ll have all trip. No agenda needed.', img: 'gallery' },
      { name: 'Fitzroy Pool',              meta: 'Fitzroy · 7am – 7pm', desc: 'A 50m outdoor pool right in the middle of Melbourne\'s coolest neighbourhood. Locals love it.', img: 'pool' },
    ],
    wild: [
      { name: 'Bar Americano',    meta: 'CBD · 4pm – Late',     desc: 'Standing-room-only laneway bar. The best Negroni in Melbourne — no question, no argument.', img: 'bar' },
      { name: 'The Espy',        meta: 'St Kilda · 11am – Late', desc: 'Three floors of live music overlooking Port Phillip Bay. Free entry most nights. A Melbourne institution.', img: 'espy' },
      { name: 'Naked for Satan', meta: 'Fitzroy · Noon – Late',  desc: 'Rooftop bar, pintxos, and views of the city skyline. Starts civilised. Ends legendary.', img: 'rooftop' },
    ],
  },
  duo: {
    zen: [
      { name: 'Tipo 00',               meta: 'CBD · Noon – Late',      desc: 'Melbourne\'s most loved pasta restaurant. Book ahead or wait at the bar — worth both.', img: 'pasta' },
      { name: 'Fitzroy Gardens Picnic', meta: 'Fitzroy · All day',      desc: 'Grab supplies from the Deli on Smith St and find your spot under the elms. Underrated date move.', img: 'park' },
      { name: 'Attica',                meta: 'Ripponlea · 6pm – Late',  desc: 'One of Australia\'s best restaurants. Native ingredients, unforgettable experience. Save up and go.', img: 'fine-dining' },
    ],
    mid: [
      { name: 'Rooftop Cinema',    meta: 'CBD · Evenings',     desc: 'Open-air cinema on top of a carpark with skyline views. BYO snacks and a blanket.', img: 'cinema' },
      { name: 'Chin Chin',         meta: 'CBD · Noon – Late',  desc: 'Modern Southeast Asian and always buzzing. No bookings — just turn up and let the chaos be part of it.', img: 'asian-food' },
      { name: 'Collingwood Yards', meta: 'Collingwood · 10am – 6pm', desc: 'Arts precinct with studios, a brilliant cafe, and ever-changing exhibitions. Melbourne at its most creative.', img: 'arts' },
    ],
    wild: [
      { name: 'MoVida',        meta: 'CBD · Noon – Late',   desc: 'Spanish tapas in a legendary Melbourne laneway. Order the anchoas. Order everything, actually.', img: 'spanish' },
      { name: 'Rooftop Bar',   meta: 'CBD · 4pm – Midnight', desc: 'The OG Melbourne rooftop. Grab a cocktail, watch the sun go down over the city. A classic for a reason.', img: 'rooftop2' },
      { name: 'The Corner Hotel', meta: 'Richmond · 4pm – Late', desc: 'Melbourne\'s best mid-size live music venue. Check what\'s on tonight — it\'s almost always worth it.', img: 'corner' },
    ],
  },
  family: {
    zen: [
      { name: 'Melbourne Zoo',    meta: 'Parkville · 9am – 5pm',     desc: 'One of the world\'s oldest zoos. Gorillas, lions, a brilliant butterfly house, and tired kids by 3pm.', img: 'zoo' },
      { name: 'Scienceworks',     meta: 'Spotswood · 10am – 4:30pm', desc: 'Hands-on science museum that exhausts kids in the best possible way. The Lightning Room is unmissable.', img: 'science' },
      { name: 'Williamstown Beach', meta: 'Williamstown · All day',  desc: 'Calm, patrolled beach with views of the CBD skyline across the water. Ferry there from Southgate.', img: 'beach' },
    ],
    mid: [
      { name: 'Melbourne Museum', meta: 'Carlton · 10am – 5pm',     desc: 'Natural history, Indigenous culture, IMAX, and a dinosaur gallery. An entire day sorted in one building.', img: 'museum' },
      { name: 'Sea Life Melbourne', meta: 'CBD · 9:30am – 5pm',     desc: 'Walk through tunnels of sharks and rays. Kids go absolutely feral — in the best way possible.', img: 'aquarium' },
      { name: 'Federation Square', meta: 'CBD · All day',           desc: 'Free events, street food, ACMI, and the NGV all within a five-minute walk. The city\'s living room.', img: 'fedsquare' },
    ],
    wild: [
      { name: 'Luna Park',          meta: 'St Kilda · 11am – 6pm', desc: 'Heritage amusement park right on the beach. The Big Dipper is not for the faint-hearted.', img: 'lunapark' },
      { name: 'MCG Stadium Tour',   meta: 'Richmond · 10am – 3pm', desc: 'Behind the scenes at the world\'s largest cricket ground. Even non-sports fans find it iconic.', img: 'mcg' },
      { name: 'Trampoline World',   meta: 'Port Melbourne · 9am – 9pm', desc: 'Wall-to-wall trampolines. Guaranteed to destroy any leftover energy. You will sleep well tonight.', img: 'trampoline' },
    ],
  },
  group: {
    zen: [
      { name: 'Yarra Valley Wineries', meta: 'Yarra Valley · 10am – 5pm', desc: 'An hour from the CBD and worth every minute. TarraWarra and Domaine Chandon are essential stops.', img: 'winery' },
      { name: 'Heide Museum of Modern Art', meta: 'Bulleen · 10am – 5pm', desc: 'Sculpture gardens, a working kitchen garden, and brilliant Australian modern art. Under-the-radar gem.', img: 'heide' },
      { name: 'Dandenong Ranges',      meta: 'Dandenong · All day', desc: 'Ancient mountain ash forests, fern gullies, and the Puffing Billy steam train. Feels a world away.', img: 'ranges' },
    ],
    mid: [
      { name: 'Southbank Promenade', meta: 'Southbank · All day',   desc: 'Restaurants, bars, street performers and the best view of the CBD skyline. The city showing off.', img: 'southbank' },
      { name: 'Queen Victoria Market Night', meta: 'CBD · 5pm – Late', desc: 'The night market version is chaotic, delicious, and genuinely fun. 50+ food vendors.', img: 'night-market' },
      { name: 'Docklands',           meta: 'Docklands · All day',   desc: 'Waterfront precinct with restaurants, public art, and great people watching over the bay.', img: 'docklands' },
    ],
    wild: [
      { name: 'The Corner Hotel',   meta: 'Richmond · 4pm – 3am', desc: 'Book out the band room for a group. Melbourne\'s most beloved live venue — always a big night.', img: 'corner2' },
      { name: 'Public House',       meta: 'Richmond · 4pm – Late', desc: 'Massive pub with great food, loads of space, a beer garden, and no attitude. Perfect for a big group.', img: 'pub' },
      { name: 'Collingwood Social', meta: 'Collingwood · 3pm – Late', desc: 'Bowling, pool, ping pong, and a great bar. Group activity sorted in one venue. Bring your competitive side.', img: 'social' },
    ],
  },
};

/* Picsum seeds give consistent, beautiful travel photos */
function imgUrl(seed, w = 400, h = 260) {
  return `https://picsum.photos/seed/${seed}/${w}/${h}`;
}

/* Loading screen background images */
const LOADING_IMAGES = [
  'https://picsum.photos/seed/travel1/390/844',
  'https://picsum.photos/seed/travel2/390/844',
  'https://picsum.photos/seed/travel3/390/844',
];


/* ── APP STATE ──────────────────────────────── */
const state = {
  location:  '',
  hours:     11,
  minutes:   30,
  ampm:      'AM',
  group:     null,
  vibe:      null,
  selectedDay: 0,
  activeSuggestion: null,
};


/* ── SCREEN NAVIGATION ──────────────────────── */
let currentScreen = 'landing';

function showScreen(id) {
  const prev = document.getElementById(`screen-${currentScreen}`);
  const next = document.getElementById(`screen-${id}`);

  prev.classList.remove('active');
  prev.classList.add('slide-out');
  setTimeout(() => prev.classList.remove('slide-out'), 350);

  next.classList.add('active');
  currentScreen = id;
}


/* ── SCREEN 1 — LANDING ─────────────────────── */
const locationInput = document.getElementById('location-input');
const btnLandingNext = document.getElementById('btn-landing-next');

locationInput.addEventListener('input', () => {
  state.location = locationInput.value.trim();
  btnLandingNext.disabled = state.location.length < 2;
});

btnLandingNext.addEventListener('click', () => {
  /* Populate the location confirm screen */
  document.getElementById('confirm-place').textContent = state.location;
  showScreen('location');
});


/* ── SCREEN 2 — LOCATION CONFIRM ────────────── */
document.getElementById('btn-location-next').addEventListener('click', () => {
  showScreen('time');
});


/* ── SCREEN 3 — TIME PICKER ─────────────────── */
function padTwo(n) { return String(n).padStart(2, '0'); }

function updateDrum(id, value) {
  const el = document.getElementById(id);
  el.textContent = value;
  el.classList.add('bump');
  setTimeout(() => el.classList.remove('bump'), 140);
}

document.getElementById('hr-up').addEventListener('click', () => {
  state.hours = state.hours === 12 ? 1 : state.hours + 1;
  updateDrum('hr-display', state.hours);
});
document.getElementById('hr-down').addEventListener('click', () => {
  state.hours = state.hours === 1 ? 12 : state.hours - 1;
  updateDrum('hr-display', state.hours);
});
document.getElementById('min-up').addEventListener('click', () => {
  state.minutes = (state.minutes + 5) % 60;
  updateDrum('min-display', padTwo(state.minutes));
});
document.getElementById('min-down').addEventListener('click', () => {
  state.minutes = (state.minutes - 5 + 60) % 60;
  updateDrum('min-display', padTwo(state.minutes));
});
document.getElementById('ampm-toggle').addEventListener('click', () => {
  state.ampm = state.ampm === 'AM' ? 'PM' : 'AM';
  updateDrum('ampm-display', state.ampm);
});
document.getElementById('ampm-down-btn').addEventListener('click', () => {
  state.ampm = state.ampm === 'AM' ? 'PM' : 'AM';
  updateDrum('ampm-display', state.ampm);
});

document.getElementById('btn-time-next').addEventListener('click', () => {
  const timeStr = `${state.hours}:${padTwo(state.minutes)} ${state.ampm}`;
  document.getElementById('time-affirm').textContent = `Perfect time! ${timeStr} it is.`;
  showScreen('group');
});


/* ── SCREEN 4 — GROUP PICKER ─────────────────── */
const groupAffirms = {
  solo:   'Love the solo energy.',
  duo:    'Even better with two.',
  family: 'Family time — the best kind.',
  group:  'The more the merrier!',
};

document.querySelectorAll('.group-card').forEach(card => {
  card.addEventListener('click', () => {
    document.querySelectorAll('.group-card').forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
    state.group = card.dataset.group;
    document.getElementById('btn-group-next').disabled = false;
  });
});

document.getElementById('btn-group-next').addEventListener('click', () => {
  document.getElementById('group-affirm').textContent = groupAffirms[state.group];
  showScreen('emotion');
});


/* ── SCREEN 5 — VIBE PICKER ─────────────────── */
document.querySelectorAll('.vibe-card').forEach(card => {
  card.addEventListener('click', () => {
    document.querySelectorAll('.vibe-card').forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
    state.vibe = card.dataset.vibe;
    document.getElementById('btn-emotion-next').disabled = false;
  });
});

document.getElementById('btn-emotion-next').addEventListener('click', () => {
  /* Build the confirmation narrative */
  const groupText = { solo: 'you', duo: 'you two', family: 'the family', group: 'the crew' };
  const vibeText  = { zen: 'zen', mid: 'mid', wild: 'wild' };

  document.getElementById('n-location').textContent = state.location;
  document.getElementById('n-time').textContent     = `${state.hours}:${padTwo(state.minutes)} ${state.ampm}`;
  document.getElementById('n-group').textContent    = groupText[state.group];
  document.getElementById('n-vibe').textContent     = vibeText[state.vibe];

  showScreen('confirmation');
});


/* ── SCREEN 6 — CONFIRMATION ─────────────────── */
document.getElementById('btn-confirm-next').addEventListener('click', () => {
  showScreen('loading');
  startLoading();
});


/* ── SCREEN 7 — LOADING ──────────────────────── */
let loadingIndex = 0;
let loadingInterval = null;

function startLoading() {
  const bg = document.getElementById('loading-bg');
  loadingIndex = 0;
  bg.style.backgroundImage = `url('${LOADING_IMAGES[0]}')`;

  loadingInterval = setInterval(() => {
    loadingIndex = (loadingIndex + 1) % LOADING_IMAGES.length;
    bg.style.backgroundImage = `url('${LOADING_IMAGES[loadingIndex]}')`;
  }, 900);

  /* Auto-advance to suggestions after 2.8s */
  setTimeout(() => {
    clearInterval(loadingInterval);
    buildSuggestions();
    showScreen('suggestions');
  }, 2800);
}


/* ── SCREEN 8 — SUGGESTIONS ─────────────────── */
function buildSuggestions() {
  const list  = document.getElementById('suggestions-list');
  const spots = SUGGESTIONS[state.group][state.vibe];
  list.innerHTML = '';

  spots.forEach((spot, i) => {
    const card = document.createElement('button');
    card.className = 'suggestion-card';
    card.innerHTML = `
      <div class="sug-image" style="background-image:url('${imgUrl(spot.img)}')"></div>
      <div class="sug-body">
        <p class="sug-name">${spot.name}</p>
        <p class="sug-meta">${spot.meta}</p>
      </div>`;
    card.addEventListener('click', () => openExpanded(i));
    list.appendChild(card);
  });
}

function openExpanded(index) {
  const spot = SUGGESTIONS[state.group][state.vibe][index];
  state.activeSuggestion = spot;

  document.getElementById('expanded-image').style.backgroundImage = `url('${imgUrl(spot.img, 390, 300)}')`;
  document.getElementById('expanded-name').textContent = spot.name;
  document.getElementById('expanded-meta').textContent = spot.meta;
  document.getElementById('expanded-desc').textContent = spot.desc;

  buildDayChips();

  const saveBtn = document.getElementById('btn-save-spot');
  saveBtn.textContent = 'Save to trip ✓';
  saveBtn.classList.remove('saved');

  showScreen('expanded');
}


/* ── SCREEN 9 — EXPANDED ─────────────────────── */
function buildDayChips() {
  const row = document.getElementById('day-row-expanded');
  row.innerHTML = '';
  TRIP_DAYS.forEach((d, i) => {
    const chip = document.createElement('button');
    chip.className = 'day-chip' + (i === state.selectedDay ? ' selected' : '');
    chip.innerHTML = `<span class="chip-day">${d.short}</span><span class="chip-date">${d.date}</span>`;
    chip.addEventListener('click', () => {
      state.selectedDay = i;
      buildDayChips();
    });
    row.appendChild(chip);
  });
}

document.getElementById('btn-back-expanded').addEventListener('click', () => {
  showScreen('suggestions');
});

document.getElementById('btn-save-spot').addEventListener('click', () => {
  const saveBtn = document.getElementById('btn-save-spot');
  saveBtn.textContent = 'Saved! ✓';
  saveBtn.classList.add('saved');

  /* Populate saved screen */
  const day  = TRIP_DAYS[state.selectedDay];
  const spot = state.activeSuggestion;
  document.getElementById('saved-day').textContent = `${day.short} Jun ${day.date}`;
  document.getElementById('saved-image').style.backgroundImage = `url('${imgUrl(spot.img, 390, 200)}')`;

  setTimeout(() => showScreen('saved'), 600);
});

document.getElementById('btn-show-map').addEventListener('click', () => {
  /* Opens the map prototype in a new tab */
  window.open('../Roamly Map/index.html', '_blank');
});


/* ── SCREEN 10 — SAVED ───────────────────────── */
document.getElementById('btn-go-again').addEventListener('click', () => {
  /* Reset state and go back to the start */
  state.location  = '';
  state.group     = null;
  state.vibe      = null;
  state.selectedDay = 0;
  state.activeSuggestion = null;

  document.getElementById('location-input').value = '';
  document.getElementById('btn-landing-next').disabled = true;
  document.querySelectorAll('.group-card').forEach(c => c.classList.remove('selected'));
  document.querySelectorAll('.vibe-card').forEach(c  => c.classList.remove('selected'));
  document.getElementById('btn-group-next').disabled   = true;
  document.getElementById('btn-emotion-next').disabled = true;

  showScreen('landing');
});
