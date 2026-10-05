const DB_NAME = 'squirreling-db';
const DB_VERSION = 1;
const SETTINGS_KEY = 'squirreling-settings-v1';

const defaultSettings = {
  gps: true,
  primaryId: 'tree',
  species: [
    { id: 'tree', name: 'Tree squirrel', emoji: '🐿️', visible: true },
    { id: 'chipmunk', name: 'Chipmunk', emoji: '🌰', visible: true },
    { id: 'groundhog', name: 'Groundhog', emoji: '🪵', visible: true },
    { id: 'flying', name: 'Flying squirrel', emoji: '🪽', visible: true },
    { id: 'other', name: 'Other sciurid', emoji: '🔎', visible: true }
  ]
};

let settings = loadSettings();
let sightings = [];
let db;
let map;
let markerLayer;
let currentMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
let selectedDate = dateKey(new Date());
let pendingPhoto = null;
let pendingPastPhoto = null;

const $ = (id) => document.getElementById(id);
const fmtTime = new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' });
const fmtDay = new Intl.DateTimeFormat(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
const fmtMonth = new Intl.DateTimeFormat(undefined, { month: 'long', year: 'numeric' });

function loadSettings() {
  try {
    const saved = JSON.parse(localStorage.getItem(SETTINGS_KEY));
    return saved?.species?.length ? saved : structuredClone(defaultSettings);
  } catch { return structuredClone(defaultSettings); }
}
function saveSettings() { localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings)); }
function dateKey(value) {
  const d = new Date(value);
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}
function speciesFor(id) { return settings.species.find(s => s.id === id) || { name: 'Squirrel', emoji: '🐿️' }; }

function openDb() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const database = req.result;
      if (!database.objectStoreNames.contains('sightings')) database.createObjectStore('sightings', { keyPath: 'id' });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}
function dbRequest(mode, action) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction('sightings', mode);
    const store = tx.objectStore('sightings');
    const req = action(store);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}
async function readAll() { return dbRequest('readonly', store => store.getAll()); }
async function putSighting(item) { await dbRequest('readwrite', store => store.put(item)); }
async function removeSighting(id) { await dbRequest('readwrite', store => store.delete(id)); }

async function init() {
  db = await openDb();
  sightings = (await readAll()).sort((a,b) => b.timestamp - a.timestamp);
  bindEvents();
  renderAll();
  if ('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js').catch(() => {});
}

function bindEvents() {
  document.querySelectorAll('.nav-item').forEach(button => button.addEventListener('click', () => switchView(button.dataset.view)));
  $('primarySpotButton').addEventListener('click', () => recordSighting(settings.primaryId));
  $('cameraButton').addEventListener('click', () => $('cameraInput').click());
  $('cameraInput').addEventListener('change', handlePhoto);
  $('pastSightingButton').addEventListener('click', openPastSighting);
  $('pastPhotoInput').addEventListener('change', handlePastPhoto);
  $('pastSightingForm').addEventListener('submit', savePastSighting);
  $('settingsButton').addEventListener('click', openSettings);
  $('customizeButton').addEventListener('click', openSettings);
  $('addSpeciesButton').addEventListener('click', () => $('addSpeciesDialog').showModal());
  $('confirmSpeciesButton').addEventListener('click', addSpecies);
  $('saveSettingsButton').addEventListener('click', commitSettings);
  $('gpsToggle').addEventListener('change', e => settings.gps = e.target.checked);
  $('prevMonth').addEventListener('click', () => changeMonth(-1));
  $('nextMonth').addEventListener('click', () => changeMonth(1));
  $('exportButton').addEventListener('click', exportData);
  $('importButton').addEventListener('click', () => $('importInput').click());
  $('importInput').addEventListener('change', importData);
}

function switchView(viewId) {
  document.querySelectorAll('.view').forEach(v => v.classList.toggle('active', v.id === viewId));
  document.querySelectorAll('.nav-item').forEach(v => v.classList.toggle('active', v.dataset.view === viewId));
  if (viewId === 'mapView') setTimeout(renderMap, 80);
  if (viewId === 'calendarView') renderCalendar();
  if (viewId === 'historyView') renderHistory();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function recordSighting(speciesId, photo = null) {
  const now = Date.now();
  const item = { id: crypto.randomUUID(), speciesId, timestamp: now, latitude: null, longitude: null, accuracy: null, photo };
  await putSighting(item);
  sightings.unshift(item);
  renderAll();
  const species = speciesFor(speciesId);
  $('primarySpotButton').classList.remove('pulse');
  void $('primarySpotButton').offsetWidth;
  $('primarySpotButton').classList.add('pulse');
  showToast(`${species.emoji} ${species.name} spotted!`);
  if (settings.gps && navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async pos => {
      item.latitude = pos.coords.latitude;
      item.longitude = pos.coords.longitude;
      item.accuracy = Math.round(pos.coords.accuracy);
      await putSighting(item);
      renderAll();
      showToast('📍 Location added');
    }, error => {
      if (error.code === 1) showToast('Location wasn’t allowed—sighting still saved');
    }, { enableHighAccuracy: true, timeout: 12000, maximumAge: 30000 });
  }
}

function localDateTimeValue(date = new Date()) {
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

function openPastSighting() {
  $('pastSpecies').innerHTML = settings.species.map(s => `<option value="${escapeHtml(s.id)}">${escapeHtml(s.emoji)} ${escapeHtml(s.name)}</option>`).join('');
  $('pastSpecies').value = settings.primaryId;
  $('pastDateTime').value = localDateTimeValue();
  $('pastDateTime').max = localDateTimeValue();
  $('pastPhotoInput').value = '';
  pendingPastPhoto = null;
  $('pastPhotoPreview').classList.add('hidden');
  $('pastPhotoPreview').innerHTML = '';
  $('pastSightingDialog').showModal();
}

async function handlePastPhoto(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  showToast('Preparing photo…');
  try {
    pendingPastPhoto = await compressImage(file);
    $('pastPhotoPreview').innerHTML = `<img src="${pendingPastPhoto}" alt="Selected sighting photo">`;
    $('pastPhotoPreview').classList.remove('hidden');
  } catch {
    pendingPastPhoto = null;
    event.target.value = '';
    showToast('Couldn’t prepare that photo');
  }
}

async function savePastSighting(event) {
  event.preventDefault();
  const timestamp = new Date($('pastDateTime').value).getTime();
  if (!Number.isFinite(timestamp) || timestamp > Date.now() + 60000) {
    showToast('Choose a valid time in the past');
    return;
  }
  const item = {
    id: crypto.randomUUID(),
    speciesId: $('pastSpecies').value,
    timestamp,
    latitude: null,
    longitude: null,
    accuracy: null,
    photo: pendingPastPhoto
  };
  await putSighting(item);
  sightings.push(item);
  sightings.sort((a,b) => b.timestamp - a.timestamp);
  pendingPastPhoto = null;
  $('pastSightingDialog').close();
  currentMonth = new Date(new Date(timestamp).getFullYear(), new Date(timestamp).getMonth(), 1);
  selectedDate = dateKey(timestamp);
  renderAll();
  const species = speciesFor(item.speciesId);
  showToast(`${species.emoji} Past sighting added`);
}

async function handlePhoto(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  showToast('Preparing photo…');
  try {
    pendingPhoto = await compressImage(file);
    await recordSighting(settings.primaryId, pendingPhoto);
  } catch { showToast('Couldn’t save that photo'); }
  pendingPhoto = null;
  event.target.value = '';
}

function compressImage(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const max = 1600;
      const scale = Math.min(1, max / Math.max(img.width, img.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL('image/jpeg', .78));
    };
    img.onerror = reject;
    img.src = url;
  });
}

function renderAll() {
  renderHome();
  renderCalendar();
  renderHistory();
  if ($('mapView').classList.contains('active')) renderMap();
}

function renderHome() {
  const today = dateKey(new Date());
  const count = sightings.filter(s => dateKey(s.timestamp) === today).length;
  const primary = speciesFor(settings.primaryId);
  $('todayLabel').textContent = new Intl.DateTimeFormat(undefined, { weekday:'long', month:'long', day:'numeric' }).format(new Date()).toUpperCase();
  $('todayCount').textContent = count;
  $('dailyPrompt').textContent = count ? (count > 4 ? 'A banner day for squirrels.' : 'The count is officially underway.') : 'Keep your eyes on the trees.';
  $('primaryEmoji').textContent = primary.emoji;
  $('primaryName').textContent = primary.name;
  const quick = settings.species.filter(s => s.visible && s.id !== settings.primaryId);
  $('quickGrid').innerHTML = quick.length ? quick.map(s => `<button class="quick-button" data-species="${escapeHtml(s.id)}"><span>${escapeHtml(s.emoji)}</span>${escapeHtml(s.name)}</button>`).join('') : '<div class="empty-state">Add shortcuts in Customize.</div>';
  $('quickGrid').querySelectorAll('[data-species]').forEach(b => b.addEventListener('click', () => recordSighting(b.dataset.species)));
  const last = sightings[0];
  $('lastCard').classList.toggle('hidden', !last);
  if (last) {
    const sp = speciesFor(last.speciesId);
    $('lastName').textContent = sp.name;
    $('lastMeta').textContent = `${fmtTime.format(last.timestamp)}${last.latitude ? ' · location saved' : ''}`;
    $('lastThumb').innerHTML = last.photo ? `<img src="${last.photo}" alt="Latest squirrel">` : sp.emoji;
  }
}

function renderCalendar() {
  $('monthLabel').textContent = fmtMonth.format(currentMonth);
  const year = currentMonth.getFullYear(), month = currentMonth.getMonth();
  const first = new Date(year, month, 1);
  const gridStart = new Date(year, month, 1 - first.getDay());
  const byDay = sightings.reduce((acc,s) => { const k=dateKey(s.timestamp); acc[k]=(acc[k]||0)+1; return acc; }, {});
  let html = '';
  for (let i=0;i<42;i++) {
    const d = new Date(gridStart); d.setDate(gridStart.getDate()+i);
    const key = dateKey(d), num = byDay[key] || 0;
    html += `<button class="calendar-day ${d.getMonth()!==month?'muted':''} ${key===selectedDate?'selected':''} ${key===dateKey(new Date())?'today':''}" data-date="${key}"><b>${d.getDate()}</b>${num?`<i></i><em>${num}</em>`:''}</button>`;
  }
  $('calendarGrid').innerHTML = html;
  $('calendarGrid').querySelectorAll('.calendar-day').forEach(b => b.addEventListener('click', () => { selectedDate=b.dataset.date; renderCalendar(); }));
  const selected = sightings.filter(s => dateKey(s.timestamp) === selectedDate);
  const selectedObj = new Date(`${selectedDate}T12:00:00`);
  $('selectedDayLabel').textContent = fmtDay.format(selectedObj);
  $('selectedDayCount').textContent = `${selected.length} sighting${selected.length===1?'':'s'}`;
  renderList($('daySightings'), selected, 'No squirrels logged on this day.');
}

function changeMonth(delta) {
  currentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth()+delta, 1);
  selectedDate = dateKey(currentMonth);
  renderCalendar();
}

function renderHistory() {
  $('totalCount').textContent = sightings.length;
  $('speciesCount').textContent = new Set(sightings.map(s=>s.speciesId)).size;
  $('streakCount').textContent = calculateStreak();
  renderList($('allSightings'), sightings, 'Your squirrel log is waiting for its first entry.', true);
}

function calculateStreak() {
  const dates = new Set(sightings.map(s => dateKey(s.timestamp)));
  let d = new Date(), streak = 0;
  if (!dates.has(dateKey(d))) d.setDate(d.getDate()-1);
  while (dates.has(dateKey(d))) { streak++; d.setDate(d.getDate()-1); }
  return streak;
}

function renderList(container, items, empty, showDate=false) {
  if (!items.length) { container.innerHTML = `<div class="empty-state">${empty}</div>`; return; }
  container.innerHTML = items.map(s => {
    const sp = speciesFor(s.speciesId);
    return `<button class="sighting-row" data-id="${s.id}"><span class="sighting-icon">${s.photo?`<img src="${s.photo}" alt="">`:escapeHtml(sp.emoji)}</span><span><strong>${escapeHtml(sp.name)}</strong><span>${s.latitude?'📍 GPS saved':'No location'}${s.photo?' · Photo':''}</span></span><time>${showDate?fmtDay.format(s.timestamp):fmtTime.format(s.timestamp)}</time></button>`;
  }).join('');
  container.querySelectorAll('[data-id]').forEach(b => b.addEventListener('click', () => showDetail(b.dataset.id)));
}

function showDetail(id) {
  const item = sightings.find(s => s.id === id); if (!item) return;
  const sp = speciesFor(item.speciesId);
  $('detailContent').innerHTML = `${item.photo?`<img class="detail-photo" src="${item.photo}" alt="Squirrel sighting">`:''}<div class="dialog-header"><div><p class="eyebrow">SIGHTING</p><h2>${escapeHtml(sp.emoji)} ${escapeHtml(sp.name)}</h2></div><button class="close-button" id="closeDetail" aria-label="Close">×</button></div><p class="detail-meta">${new Date(item.timestamp).toLocaleString()}<br>${item.latitude?`${item.latitude.toFixed(5)}, ${item.longitude.toFixed(5)} · ±${item.accuracy || '?'}m`:'No GPS coordinates'}</p><div class="detail-actions"><button class="secondary-button" id="closeDetail2">Done</button><button class="danger-button" id="deleteSighting">Delete sighting</button></div>`;
  $('detailDialog').showModal();
  $('closeDetail').onclick = $('closeDetail2').onclick = () => $('detailDialog').close();
  $('deleteSighting').onclick = async () => {
    if (!confirm('Delete this squirrel sighting?')) return;
    await removeSighting(item.id);
    sightings = sightings.filter(s => s.id !== item.id);
    $('detailDialog').close(); renderAll(); showToast('Sighting deleted');
  };
}

function renderMap() {
  const mapped = sightings.filter(s => Number.isFinite(s.latitude) && Number.isFinite(s.longitude));
  $('mapEmpty').classList.toggle('hidden', mapped.length > 0);
  if (!window.L) return;
  if (!map) {
    map = L.map('map', { zoomControl: true }).setView([38.88,-77.1], 11);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution:'© OpenStreetMap contributors' }).addTo(map);
    markerLayer = L.layerGroup().addTo(map);
  }
  markerLayer.clearLayers();
  mapped.forEach(s => {
    const sp = speciesFor(s.speciesId);
    L.marker([s.latitude,s.longitude]).bindPopup(`<strong>${escapeHtml(sp.emoji)} ${escapeHtml(sp.name)}</strong><br>${new Date(s.timestamp).toLocaleString()}`).addTo(markerLayer);
  });
  if (mapped.length === 1) map.setView([mapped[0].latitude,mapped[0].longitude], 15);
  if (mapped.length > 1) map.fitBounds(L.latLngBounds(mapped.map(s=>[s.latitude,s.longitude])), { padding:[28,28] });
  map.invalidateSize();
}

function openSettings() {
  renderSpeciesEditor();
  $('gpsToggle').checked = settings.gps;
  $('settingsDialog').showModal();
}

function renderSpeciesEditor() {
  $('speciesEditor').innerHTML = settings.species.map(s => `<div class="species-edit-row ${s.id===settings.primaryId?'primary':''}" data-id="${escapeHtml(s.id)}"><input type="radio" name="primary" value="${escapeHtml(s.id)}" ${s.id===settings.primaryId?'checked':''} aria-label="Make primary"><input class="emoji-edit" value="${escapeHtml(s.emoji)}" maxlength="4" aria-label="Emoji"><input class="name-edit" value="${escapeHtml(s.name)}" maxlength="32" aria-label="Species name"><button type="button" class="visibility-button" aria-label="${s.visible?'Hide':'Show'} shortcut">${s.visible?'◉':'○'}</button></div>`).join('');
  $('speciesEditor').querySelectorAll('.species-edit-row').forEach(row => {
    const s = settings.species.find(x=>x.id===row.dataset.id);
    row.querySelector('[type=radio]').onchange = () => { settings.primaryId=s.id; renderSpeciesEditor(); };
    row.querySelector('.emoji-edit').oninput = e => s.emoji=e.target.value || '🐿️';
    row.querySelector('.name-edit').oninput = e => s.name=e.target.value || 'Squirrel';
    row.querySelector('.visibility-button').onclick = () => { s.visible=!s.visible; renderSpeciesEditor(); };
  });
}

function addSpecies(event) {
  const name = $('newSpeciesName').value.trim();
  if (!name) { event.preventDefault(); return; }
  const id = `custom-${Date.now()}`;
  settings.species.push({ id, name, emoji:$('newSpeciesEmoji').value.trim() || '🐿️', visible:true });
  $('newSpeciesName').value=''; $('newSpeciesEmoji').value='🐿️';
  setTimeout(() => { renderSpeciesEditor(); if (!$('settingsDialog').open) $('settingsDialog').showModal(); }, 0);
}

function commitSettings() {
  settings.gps = $('gpsToggle').checked;
  saveSettings(); renderAll(); showToast('Squirrel setup saved');
}

async function exportData() {
  const payload = { app:'Squirreling', version:1, exportedAt:new Date().toISOString(), settings, sightings };
  const blob = new Blob([JSON.stringify(payload)], { type:'application/json' });
  const a = document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=`squirreling-backup-${dateKey(new Date())}.json`; a.click(); URL.revokeObjectURL(a.href);
  showToast('Backup exported');
}

async function importData(event) {
  const file=event.target.files?.[0]; if (!file) return;
  try {
    const data=JSON.parse(await file.text());
    if (!Array.isArray(data.sightings) || !data.settings?.species) throw new Error();
    if (!confirm(`Import ${data.sightings.length} sightings? Existing sightings with different IDs will be kept.`)) return;
    settings=data.settings; saveSettings();
    for (const item of data.sightings) await putSighting(item);
    sightings=(await readAll()).sort((a,b)=>b.timestamp-a.timestamp);
    renderAll(); renderSpeciesEditor(); showToast('Backup imported');
  } catch { showToast('That backup file isn’t valid'); }
  event.target.value='';
}

function showToast(message) {
  const t=$('toast'); t.textContent=message; t.classList.add('show');
  clearTimeout(showToast.timer); showToast.timer=setTimeout(()=>t.classList.remove('show'), 2400);
}
function escapeHtml(value='') { const d=document.createElement('div'); d.textContent=String(value); return d.innerHTML; }

init().catch(() => showToast('Local storage could not be opened'));
