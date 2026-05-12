/* ═══════════════════════════════════════════════
   ROAMLY — MAP PROTOTYPE  ·  script.js

   HOW THIS FILE IS ORGANISED:
   1. Category config   – labels, emojis, colours, heatmap gradients
   2. Trip days         – June 6–12 2026
   3. Melbourne spots   – neighbourhood name lookup
   4. Heatmap data      – coordinate clusters per category
   5. App state         – variables that track what's happening
   6. Map               – Leaflet setup + heatmap rendering
   7. Screens           – navigation between the 3 screens
   8. Bottom sheet      – tap → pick a day → save
   9. Calendar          – renders saved spots
  10. Event listeners   – wires up all the buttons
   ═══════════════════════════════════════════════ */


/* ── 1. CATEGORY CONFIG ─────────────────────────
   Everything the app needs to know about each vibe.
   gradient: how Leaflet.heat colours the glow
   (0 = edge of glow, 1 = hottest centre) */

const CATEGORIES = {
  food: {
    label:    'Food',
    emoji:    '🍜',
    color:    '#D94F38',
    gradient: { 0.25: '#FFD4C2', 0.55: '#FF6B35', 1: '#B30000' },
  },
  nightlife: {
    label:    'Nightlife',
    emoji:    '🌙',
    color:    '#2D1B69',
    gradient: { 0.25: '#C9B8FF', 0.55: '#7B5EA7', 1: '#2D1B69' },
  },
  livemusic: {
    label:    'Live Music',
    emoji:    '🎸',
    color:    '#1A7A6E',
    gradient: { 0.25: '#B3EDE8', 0.55: '#2EC4B6', 1: '#0A7A6E' },
  },
  shopping: {
    label:    'Shopping',
    emoji:    '🛍️',
    color:    '#E88035',
    gradient: { 0.25: '#FFE0B2', 0.55: '#FFA040', 1: '#C65D00' },
  },
  cultural: {
    label:    'Cultural',
    emoji:    '🏛️',
    color:    '#9E5230',
    gradient: { 0.25: '#D4B896', 0.55: '#C4815A', 1: '#7A3B1E' },
  },
  outdoors: {
    label:    'Outdoors',
    emoji:    '🌿',
    color:    '#3A7D44',
    gradient: { 0.25: '#B5D5B7', 0.55: '#56AB2F', 1: '#1B5E20' },
  },
};


/* ── 2. TRIP DAYS ───────────────────────────────
   June 6 2026 = Saturday */
const TRIP_DAYS = [
  { short: 'Sat', date: 6  },
  { short: 'Sun', date: 7  },
  { short: 'Mon', date: 8  },
  { short: 'Tue', date: 9  },
  { short: 'Wed', date: 10 },
  { short: 'Thu', date: 11 },
  { short: 'Fri', date: 12 },
];


/* ── 3. MELBOURNE NEIGHBOURHOODS ────────────────
   Used to give a tap on the map a human-readable name.
   The app finds whichever one is closest to where the
   user tapped and displays that name in the sheet. */
const NEIGHBOURHOODS = [
  { name: 'Fitzroy',        lat: -37.7996, lng: 144.9779 },
  { name: 'Carlton',        lat: -37.7986, lng: 144.9657 },
  { name: 'Collingwood',    lat: -37.8030, lng: 144.9789 },
  { name: 'CBD',            lat: -37.8136, lng: 144.9631 },
  { name: 'Southbank',      lat: -37.8225, lng: 144.9648 },
  { name: 'St Kilda',       lat: -37.8679, lng: 144.9787 },
  { name: 'Richmond',       lat: -37.8183, lng: 144.9997 },
  { name: 'Brunswick',      lat: -37.7668, lng: 144.9598 },
  { name: 'Prahran',        lat: -37.8500, lng: 144.9939 },
  { name: 'South Yarra',    lat: -37.8400, lng: 144.9939 },
  { name: 'Windsor',        lat: -37.8556, lng: 144.9939 },
  { name: 'Northcote',      lat: -37.7700, lng: 144.9994 },
  { name: 'Albert Park',    lat: -37.8442, lng: 144.9609 },
  { name: 'Port Melbourne', lat: -37.8373, lng: 144.9378 },
  { name: 'Hawthorn',       lat: -37.8226, lng: 145.0357 },
  { name: 'Abbotsford',     lat: -37.8040, lng: 144.9970 },
];

/* Returns the neighbourhood name closest to [lat, lng] */
function nearestNeighbourhood(lat, lng) {
  let best = NEIGHBOURHOODS[0];
  let bestDist = Infinity;
  NEIGHBOURHOODS.forEach(n => {
    const d = (lat - n.lat) ** 2 + (lng - n.lng) ** 2;
    if (d < bestDist) { bestDist = d; best = n; }
  });
  return best.name;
}


/* ── 4. HEATMAP DATA ────────────────────────────
   Each category has several clusters of points.
   makeCluster() spreads ~n points in a ring around
   a centre coordinate, simulating a real precinct. */

function makeCluster(lat, lng, intensity, n) {
  const pts = [[lat, lng, intensity]]; // centre point
  for (let i = 0; i < n; i++) {
    const angle = (i / n) * 2 * Math.PI;
    const radius = 0.003 + (i % 4) * 0.0015;
    pts.push([
      lat + Math.sin(angle) * radius,
      lng + Math.cos(angle) * radius,
      intensity * (0.55 + (i % 4) * 0.12),
    ]);
  }
  return pts;
}

const HEAT_DATA = {
  food: [
    ...makeCluster(-37.7986, 144.9657, 1.0, 10), // Lygon St, Carlton
    ...makeCluster(-37.7996, 144.9779, 0.9, 10), // Brunswick St, Fitzroy
    ...makeCluster(-37.8136, 144.9631, 0.95, 8), // CBD / Chinatown
    ...makeCluster(-37.8183, 144.9997, 0.80, 8), // Swan St, Richmond
    ...makeCluster(-37.8679, 144.9787, 0.85, 8), // St Kilda
    ...makeCluster(-37.8225, 144.9648, 0.70, 6), // Southbank
  ],
  nightlife: [
    ...makeCluster(-37.8500, 144.9939, 1.0, 10), // Chapel St, Windsor
    ...makeCluster(-37.8136, 144.9640, 0.9, 10), // CBD laneways
    ...makeCluster(-37.8030, 144.9789, 0.85, 8), // Collingwood
    ...makeCluster(-37.7996, 144.9779, 0.80, 8), // Fitzroy
    ...makeCluster(-37.8679, 144.9787, 0.80, 8), // St Kilda
  ],
  livemusic: [
    ...makeCluster(-37.8030, 144.9789, 1.0, 10), // Collingwood / Fitzroy
    ...makeCluster(-37.8183, 144.9997, 0.90, 8), // The Corner, Richmond
    ...makeCluster(-37.8679, 144.9787, 0.85, 8), // Esplanade, St Kilda
    ...makeCluster(-37.7668, 144.9598, 0.80, 8), // Brunswick venues
    ...makeCluster(-37.7700, 144.9994, 0.75, 6), // Northcote Social Club
    ...makeCluster(-37.8225, 144.9648, 0.70, 6), // Recital Centre, Southbank
  ],
  shopping: [
    ...makeCluster(-37.8136, 144.9631, 1.0, 10), // Bourke St Mall, CBD
    ...makeCluster(-37.8400, 144.9939, 0.90, 8), // Chapel St, South Yarra
    ...makeCluster(-37.7996, 144.9779, 0.80, 8), // Brunswick St, Fitzroy
    ...makeCluster(-37.8556, 144.9939, 0.80, 8), // High St, Armadale
    ...makeCluster(-37.8183, 144.9997, 0.70, 6), // Bridge Rd, Richmond
  ],
  cultural: [
    ...makeCluster(-37.8180, 144.9691, 1.0, 10), // Fed Square / ACMI
    ...makeCluster(-37.8225, 144.9690, 0.95, 8), // NGV / Arts Centre
    ...makeCluster(-37.7986, 144.9657, 0.85, 8), // Melbourne Museum, Carlton
    ...makeCluster(-37.8175, 144.9598, 0.75, 6), // Immigration Museum
  ],
  outdoors: [
    ...makeCluster(-37.8304, 144.9799, 1.0, 10), // Royal Botanic Gardens
    ...makeCluster(-37.8143, 144.9820, 0.90, 8), // Fitzroy Gardens
    ...makeCluster(-37.8442, 144.9609, 0.85, 8), // Albert Park Lake
    ...makeCluster(-37.7870, 144.9779, 0.80, 8), // Edinburgh Gardens
    ...makeCluster(-37.7850, 144.9657, 0.75, 6), // Princes Park
  ],
};


/* ── 5. APP STATE ───────────────────────────────
   These variables track what the app is doing right now */
let map            = null;       // the Leaflet map object
let heatLayer      = null;       // current heatmap layer
let activeCategory = null;       // which category the user picked
let selectedDay    = 0;          // index into TRIP_DAYS (0 = Sat 6)
let tappedLat      = null;       // where the user tapped on map
let tappedLng      = null;
const savedSpots   = [];         // array of saved { dayIndex, neighbourhood, category }
let prevScreen     = 'home';     // used by back button on calendar


/* ── 6. MAP ─────────────────────────────────────*/

function initMap() {
  if (map) return; // only create the map once

  map = L.map('map', {
    center: [-37.8200, 144.9631], // Melbourne CBD, slightly south to show more
    zoom: 13,
    zoomControl: false,           // hide the +/- zoom buttons (phone feel)
  });

  /* CartoDB Positron — a clean, light map style that shows
     heatmap colours clearly without competing with them */
  L.tileLayer(
    'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> © <a href="https://carto.com/">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19,
    }
  ).addTo(map);

  /* When user taps anywhere on the map, open the save sheet */
  map.on('click', (e) => {
    tappedLat = e.latlng.lat;
    tappedLng = e.latlng.lng;
    openSheet();
  });
}

function showHeatmap(category) {
  /* Remove the previous heatmap layer if one exists */
  if (heatLayer) {
    map.removeLayer(heatLayer);
    heatLayer = null;
  }

  const cat = CATEGORIES[category];

  /* L.heatLayer is from the Leaflet.heat plugin:
     radius = size of each glow blob in pixels
     blur   = how soft the edges are
     max    = the maximum intensity value in the data */
  heatLayer = L.heatLayer(HEAT_DATA[category], {
    radius:   42,
    blur:     32,
    maxZoom:  13,
    max:      1.0,
    gradient: cat.gradient,
  }).addTo(map);
}


/* ── 7. SCREENS ─────────────────────────────────*/

let currentScreen = 'home';

const screens = {
  home:     document.getElementById('screen-home'),
  map:      document.getElementById('screen-map'),
  calendar: document.getElementById('screen-calendar'),
};

function showScreen(name) {
  prevScreen = currentScreen;

  /* Slide out the current screen */
  const old = screens[currentScreen];
  old.classList.remove('active');
  old.classList.add('slide-out');
  setTimeout(() => old.classList.remove('slide-out'), 350);

  /* Slide in the new screen */
  screens[name].classList.add('active');
  currentScreen = name;

  /* Leaflet needs to know when its container size changes */
  if (name === 'map' && map) {
    setTimeout(() => map.invalidateSize(), 60);
  }

  if (name === 'calendar') {
    renderCalendar();
  }
}


/* ── 8. BOTTOM SHEET ────────────────────────────*/

const sheetOverlay  = document.getElementById('sheet-overlay');
const bottomSheet   = document.getElementById('bottom-sheet');
const sheetLocation = document.getElementById('sheet-location');
const sheetCatLabel = document.getElementById('sheet-cat-label');
const sheetEmoji    = document.getElementById('sheet-emoji');
const dayRowEl      = document.getElementById('day-row');
const saveBtn       = document.getElementById('save-btn');

/* Build the row of day chips (Sat 6, Sun 7, …) */
function buildDayChips() {
  dayRowEl.innerHTML = '';
  TRIP_DAYS.forEach((d, i) => {
    const chip = document.createElement('button');
    chip.className = 'day-chip' + (i === selectedDay ? ' selected' : '');
    chip.innerHTML = `<span class="chip-day">${d.short}</span>
                      <span class="chip-date">${d.date}</span>`;
    chip.addEventListener('click', () => {
      selectedDay = i;
      buildDayChips(); // re-render chips to move the highlight
    });
    dayRowEl.appendChild(chip);
  });
}

function openSheet() {
  const neighbourhood = nearestNeighbourhood(tappedLat, tappedLng);
  const cat = CATEGORIES[activeCategory];

  sheetLocation.textContent  = neighbourhood;
  sheetCatLabel.textContent  = `${cat.label} · Melbourne`;
  sheetEmoji.textContent     = cat.emoji;

  saveBtn.textContent = 'Save to trip';
  saveBtn.classList.remove('saved');

  buildDayChips();

  sheetOverlay.classList.add('open');
  bottomSheet.classList.add('open');
}

function closeSheet() {
  sheetOverlay.classList.remove('open');
  bottomSheet.classList.remove('open');
}

function saveSpot() {
  const neighbourhood = nearestNeighbourhood(tappedLat, tappedLng);

  savedSpots.push({
    dayIndex:      selectedDay,
    neighbourhood: neighbourhood,
    category:      activeCategory,
  });

  updateBadges();

  /* Flash the button green, then close */
  saveBtn.textContent = 'Saved! ✓';
  saveBtn.classList.add('saved');
  setTimeout(closeSheet, 700);
}

/* Keep the badge numbers in sync with savedSpots.length */
function updateBadges() {
  const count = savedSpots.length;
  ['badge-home', 'badge-map'].forEach(id => {
    const el = document.getElementById(id);
    el.textContent = count;
    el.classList.toggle('visible', count > 0);
  });
}


/* ── 9. CALENDAR ────────────────────────────────*/

const weekGridEl = document.getElementById('week-grid');
const calEmptyEl = document.getElementById('cal-empty');

function renderCalendar() {
  weekGridEl.innerHTML = '';

  if (savedSpots.length === 0) {
    calEmptyEl.classList.add('show');
    weekGridEl.style.display = 'none';
    return;
  }

  calEmptyEl.classList.remove('show');
  weekGridEl.style.display = 'grid';

  /* One column per day */
  TRIP_DAYS.forEach((day, i) => {
    const col = document.createElement('div');
    col.className = 'day-col';

    /* Day header */
    col.innerHTML = `
      <div class="day-col-header">
        <div class="dcol-day">${day.short}</div>
        <div class="dcol-date">${day.date}</div>
      </div>`;

    /* Spots saved on this day */
    savedSpots
      .filter(s => s.dayIndex === i)
      .forEach(spot => {
        const cat   = CATEGORIES[spot.category];
        const chip  = document.createElement('div');
        chip.className = 'spot-chip';
        chip.style.borderLeftColor = cat.color;
        chip.innerHTML = `
          <span class="spot-chip-emoji">${cat.emoji}</span>
          <span class="spot-chip-name">${spot.neighbourhood}</span>`;
        col.appendChild(chip);
      });

    weekGridEl.appendChild(col);
  });
}


/* ── 10. EVENT LISTENERS ────────────────────────*/

/* Category cards → show map with that heatmap */
document.querySelectorAll('.cat-card').forEach(card => {
  card.addEventListener('click', () => {
    activeCategory = card.dataset.cat;
    document.getElementById('map-title').textContent = CATEGORIES[activeCategory].label;

    showScreen('map');
    initMap();           // safe to call multiple times
    showHeatmap(activeCategory);
  });
});

/* Back buttons */
document.getElementById('btn-back-map').addEventListener('click', () => showScreen('home'));
document.getElementById('btn-back-cal').addEventListener('click', () => {
  /* Go back to map if a category is active, otherwise home */
  showScreen(activeCategory ? 'map' : 'home');
});

/* Calendar open buttons */
document.getElementById('btn-open-calendar').addEventListener('click',     () => showScreen('calendar'));
document.getElementById('btn-open-calendar-map').addEventListener('click', () => showScreen('calendar'));

/* Bottom sheet */
sheetOverlay.addEventListener('click', closeSheet);
saveBtn.addEventListener('click', saveSpot);

/* ── INIT ───────────────────────────────────── */
updateBadges();    // ensure badges start hidden
renderCalendar();  // ensure empty state shows on first open
