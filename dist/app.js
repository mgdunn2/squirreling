const DB_NAME = 'squirreling-db';
const DB_VERSION = 2;
const SETTINGS_KEY = 'squirreling-settings-v1';
const PENDING_DELETES_KEY = 'squirreling-pending-deletes-v1';
const FRIENDS_CACHE_KEY = 'squirreling-friends-cache-v1';
const TAXONOMY_VERSION = 2;
const LEAFLET_CSS_URL = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
const LEAFLET_SCRIPT_URL = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
const FIREBASE_SCRIPT_URLS = [
  'https://www.gstatic.com/firebasejs/12.19.0/firebase-app-compat.js',
  'https://www.gstatic.com/firebasejs/12.19.0/firebase-auth-compat.js',
  'https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore-compat.js'
];
const OPTIONAL_LOAD_TIMEOUT = 6500;

const TAXA = [
  { id:'eastern-gray', taxonId:'sciurus-carolinensis', name:'Eastern gray squirrel', scientific:'Sciurus carolinensis', rank:'species', identification:'exact', image:'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0a/Eastern_Grey_Squirrel.jpg/960px-Eastern_Grey_Squirrel.jpg' },
  { id:'eastern-gray-melanistic', taxonId:'sciurus-carolinensis', name:'Black eastern gray squirrel', scientific:'Sciurus carolinensis', rank:'species', identification:'exact', traits:['melanistic'], image:'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/25/Melanistic_Eastern_Gray_Squirrel_%28Sciurus_carolinensis%29_01.jpg/960px-Melanistic_Eastern_Gray_Squirrel_%28Sciurus_carolinensis%29_01.jpg' },
  { id:'fox-squirrel', taxonId:'sciurus-niger', name:'Fox squirrel', scientific:'Sciurus niger', rank:'species', identification:'exact', image:'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b0/Fox_Squirrel_%28Sciurus_niger%29_%2816756760102%29.jpg/960px-Fox_Squirrel_%28Sciurus_niger%29_%2816756760102%29.jpg' },
  { id:'american-red', taxonId:'tamiasciurus-hudsonicus', name:'American red squirrel', scientific:'Tamiasciurus hudsonicus', rank:'species', identification:'exact', image:'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/6d/Tamiasciurus_hudsonicus.jpg/960px-Tamiasciurus_hudsonicus.jpg' },
  { id:'aberts-squirrel', taxonId:'sciurus-aberti', name:'Abert’s squirrel', scientific:'Sciurus aberti', rank:'species', identification:'exact', image:'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/28/Sciurus_aberti_Lassen_National_Forest.jpg/960px-Sciurus_aberti_Lassen_National_Forest.jpg' },
  { id:'rock-squirrel', taxonId:'otospermophilus-variegatus', name:'Rock squirrel', scientific:'Otospermophilus variegatus', rank:'species', identification:'exact', image:'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/cd/Otospermophilus_variegatus.jpg/960px-Otospermophilus_variegatus.jpg' },
  { id:'harriss-antelope-squirrel', taxonId:'ammospermophilus-harrisii', name:'Harris’s antelope squirrel', scientific:'Ammospermophilus harrisii', rank:'species', identification:'exact', image:'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b2/Ammospermophilus_Harrisii.jpg/960px-Ammospermophilus_Harrisii.jpg' },
  { id:'townsends-chipmunk', taxonId:'neotamias-townsendii', name:'Townsend’s chipmunk', scientific:'Neotamias townsendii', rank:'species', identification:'exact', image:'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4d/Neotamias_townsendii.jpg/960px-Neotamias_townsendii.jpg' },
  { id:'cliff-chipmunk', taxonId:'neotamias-dorsalis', name:'Cliff chipmunk', scientific:'Neotamias dorsalis', rank:'species', identification:'exact', image:'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8d/Cliff_chipmunk.jpg/330px-Cliff_chipmunk.jpg' },
  { id:'eastern-chipmunk', taxonId:'tamias-striatus', name:'Eastern chipmunk', scientific:'Tamias striatus', rank:'species', identification:'exact', image:'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/09/Eastern_Chipmunk_%28Tamias_striatus%29.jpg/960px-Eastern_Chipmunk_%28Tamias_striatus%29.jpg' },
  { id:'chipmunk-unspecified', taxonId:'chipmunks', name:'Chipmunk — species unknown', scientific:null, rank:'group', identification:'broad', image:'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/09/Eastern_Chipmunk_%28Tamias_striatus%29.jpg/960px-Eastern_Chipmunk_%28Tamias_striatus%29.jpg' },
  { id:'groundhog', taxonId:'marmota-monax', name:'Groundhog', scientific:'Marmota monax', rank:'species', identification:'exact', image:'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2d/Groundhog_-_Marmota_monax%2C_Leesylvania_State_Park%2C_Woodbridge%2C_Virginia_cropped.jpg/960px-Groundhog_-_Marmota_monax%2C_Leesylvania_State_Park%2C_Woodbridge%2C_Virginia_cropped.jpg' },
  { id:'hoary-marmot', taxonId:'marmota-caligata', name:'Hoary marmot', scientific:'Marmota caligata', rank:'species', identification:'exact', image:'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7a/Hoary_marmot_%28Marmota_caligata_cascadensis%29_Whistler_2.jpg/960px-Hoary_marmot_%28Marmota_caligata_cascadensis%29_Whistler_2.jpg' },
  { id:'marmot-unspecified', taxonId:'marmota', name:'Marmot — species unknown', scientific:'Marmota', rank:'genus', identification:'broad', image:'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2d/Groundhog_-_Marmota_monax%2C_Leesylvania_State_Park%2C_Woodbridge%2C_Virginia_cropped.jpg/960px-Groundhog_-_Marmota_monax%2C_Leesylvania_State_Park%2C_Woodbridge%2C_Virginia_cropped.jpg' },
  { id:'southern-flying', taxonId:'glaucomys-volans', name:'Southern flying squirrel', scientific:'Glaucomys volans', rank:'species', identification:'exact', image:'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/83/Southern_Flying_Squirrel_-_Glaucomys_volans%2C_Arlington%2C_Virginia%2C_December_22%2C_2020_%2853406816432%29.jpg/500px-Southern_Flying_Squirrel_-_Glaucomys_volans%2C_Arlington%2C_Virginia%2C_December_22%2C_2020_%2853406816432%29.jpg' },
  { id:'flying-unspecified', taxonId:'glaucomys', name:'Flying squirrel — species unknown', scientific:'Glaucomys', rank:'genus', identification:'broad', image:'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/83/Southern_Flying_Squirrel_-_Glaucomys_volans%2C_Arlington%2C_Virginia%2C_December_22%2C_2020_%2853406816432%29.jpg/500px-Southern_Flying_Squirrel_-_Glaucomys_volans%2C_Arlington%2C_Virginia%2C_December_22%2C_2020_%2853406816432%29.jpg' },
  { id:'tree-squirrel-unspecified', taxonId:'tree-squirrels', name:'Tree squirrel — species unknown', scientific:null, rank:'group', identification:'broad', image:'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0a/Eastern_Grey_Squirrel.jpg/960px-Eastern_Grey_Squirrel.jpg' },
  { id:'other-sciurid', taxonId:'sciuridae', name:'Other squirrel-family animal', scientific:'Sciuridae', rank:'family', identification:'broad', image:'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0a/Eastern_Grey_Squirrel.jpg/960px-Eastern_Grey_Squirrel.jpg' }
];
const FALLBACK_TAXON_IMAGE = TAXA[0].image;

const TAXON_BY_ID = new Map(TAXA.map(taxon => [taxon.id, taxon]));

const defaultSettings = {
  taxonomyVersion: TAXONOMY_VERSION,
  gps: true,
  primaryId: 'eastern-gray',
  visibleIds: ['eastern-gray-melanistic','chipmunk-unspecified','marmot-unspecified']
};

const legacySettingsSpecies = (() => {
  try { return JSON.parse(localStorage.getItem(SETTINGS_KEY))?.species || []; }
  catch { return []; }
})();
let settings = loadSettings();
let sightings = [];
let db;
let speciesPhotos = {};
let pendingSpeciesPhotoId = null;
let map;
let markerLayer;
let mapScope = 'recent';
let currentMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
let selectedDate = dateKey(new Date());
let pendingPhoto = null;
let pendingPastPhoto = null;
let pendingPastMetadata = null;
let pendingPastLocation = null;
let locationPickerMap = null;
let locationPickerMarker = null;
let locationPickerSelection = null;
let locationPickerTarget = null;
let firebaseAuth = null;
let cloudDb = null;
let firebaseLoadPromise = null;
let leafletLoadPromise = null;
let currentUser = null;
let unsubscribeCloud = null;
let importTarget = 'local';
let friends = [];
let friendRequests = [];
let friendSightings = [];
let friendUnsubscribers = [];
let unsubscribeFriends = null;
let unsubscribeRequests = null;
let socialRetryTimer = null;
let socialRetryAttempt = 0;
let socialSession = 0;
let friendsLoaded = false;
let selectedPeople = new Set(['me']);
let timeFilter = 'all';
let customDateStart = '';
let customDateEnd = '';
let speciesFilter = 'all';
let historyGroup = 'none';

const $ = (id) => document.getElementById(id);
const fmtTime = new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' });
const fmtDay = new Intl.DateTimeFormat(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
const fmtMonth = new Intl.DateTimeFormat(undefined, { month: 'long', year: 'numeric' });

function loadSettings() {
  try {
    const saved = JSON.parse(localStorage.getItem(SETTINGS_KEY));
    return migrateSettings(saved);
  } catch { return structuredClone(defaultSettings); }
}
function saveSettings() { localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings)); }
function dateKey(value) {
  const d = new Date(value);
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}
function normalizeLabel(value='') { return String(value).trim().toLowerCase().replace(/[–—]/g,'-').replace(/\s+/g,' '); }
function legacyClassification(id, label='') {
  const key = normalizeLabel(label || id);
  if (['tree','tree squirrel'].includes(key)) return 'eastern-gray';
  if (['black tree squirrel','black squirrel','melanistic tree squirrel'].includes(key)) return 'eastern-gray-melanistic';
  if (key === 'chipmunk') return 'chipmunk-unspecified';
  if (key === 'marmot') return 'marmot-unspecified';
  if (['groundhog','woodchuck'].includes(key)) return 'groundhog';
  if (['flying','flying squirrel'].includes(key)) return 'flying-unspecified';
  if (['other','other sciurid','other squirrel-family animal'].includes(key)) return 'other-sciurid';
  return TAXON_BY_ID.has(id) ? id : null;
}
function migrateSettings(saved) {
  if (!saved) return structuredClone(defaultSettings);
  if (saved.taxonomyVersion === TAXONOMY_VERSION && Array.isArray(saved.visibleIds)) return { ...structuredClone(defaultSettings), ...saved };
  const legacySpecies = Array.isArray(saved.species) ? saved.species : [];
  const mapped = legacySpecies.map(s => legacyClassification(s.id, s.name)).filter(Boolean);
  const primaryLegacy = legacySpecies.find(s => s.id === saved.primaryId);
  const primaryId = legacyClassification(saved.primaryId, primaryLegacy?.name) || 'eastern-gray';
  return { taxonomyVersion:TAXONOMY_VERSION, gps:saved.gps !== false, primaryId, visibleIds:[...new Set(mapped.filter(id => id !== primaryId))] };
}
function classificationFor(id) { return TAXON_BY_ID.get(id) || TAXON_BY_ID.get('other-sciurid'); }
function speciesFor(id) { return classificationFor(id); }
function displaySpecies(item) {
  const id=item.classificationId || item.speciesId;
  const known = classificationFor(id);
  if (TAXON_BY_ID.has(id)) return known;
  return { ...known, id, name:item.commonName || item.speciesName || known.name, scientific:item.scientificName || null };
}
function applyClassification(item, classificationId, legacyLabel=null) {
  const taxon = classificationFor(classificationId);
  Object.assign(item, {
    classificationId:taxon.id, speciesId:taxon.id, taxonId:taxon.taxonId, taxonRank:taxon.rank,
    commonName:taxon.name, scientificName:taxon.scientific, traits:[...(taxon.traits || [])],
    identification:taxon.identification, taxonomyVersion:TAXONOMY_VERSION
  });
  if (legacyLabel && !item.legacyLabel) item.legacyLabel = legacyLabel;
  delete item.speciesName;
  delete item.speciesEmoji;
  return item;
}
function migrateSighting(item, legacySpecies=[]) {
  if (item.taxonomyVersion === TAXONOMY_VERSION && item.classificationId) return { item, changed:false };
  const legacy = legacySpecies.find(s => s.id === item.speciesId);
  const label = item.commonName || item.speciesName || legacy?.name || item.speciesId || 'Squirrel';
  const classificationId = legacyClassification(item.speciesId, label);
  if (classificationId) return { item:applyClassification({ ...item }, classificationId, label), changed:true };
  const custom = { ...item, classificationId:'legacy:' + normalizeLabel(label).replace(/[^a-z0-9]+/g,'-'), taxonId:'sciuridae', taxonRank:'unclassified', commonName:label, scientificName:null, traits:[], identification:'broad', taxonomyVersion:TAXONOMY_VERSION, legacyLabel:label };
  return { item:custom, changed:true };
}
function taxonPhotoSource(taxon) { return speciesPhotos[taxon.id] || taxon.image; }
function taxonImage(taxon) { return '<img class="taxon-photo" src="' + escapeHtml(taxonPhotoSource(taxon)) + '" alt="" loading="lazy" referrerpolicy="no-referrer" onerror="this.onerror=null;this.src=\'' + escapeHtml(FALLBACK_TAXON_IMAGE) + '\'">'; }
function scientificLine(taxon) { return taxon.scientific ? '<em>' + escapeHtml(taxon.scientific) + '</em>' : 'Broad identification'; }

function filteredFeedSightings() {
  return [...sightings.filter(() => selectedPeople.has('me')), ...friendSightings.filter(s => selectedPeople.has(s.friendUid))].sort((a,b)=>b.timestamp-a.timestamp);
}

function filteredSightings() {
  const bounds=timeFilterBounds();
  return filteredFeedSightings().filter(item => {
    const timestamp=Number(item.timestamp);
    if (bounds.start !== null && timestamp < bounds.start) return false;
    if (bounds.end !== null && timestamp >= bounds.end) return false;
    return speciesFilter === 'all' || (item.classificationId || item.speciesId) === speciesFilter;
  });
}

function dateBoundary(value, exclusiveEnd=false) {
  const parts=String(value || '').split('-').map(Number);
  if (parts.length !== 3 || parts.some(part => !Number.isFinite(part))) return null;
  return new Date(parts[0],parts[1]-1,parts[2]+(exclusiveEnd?1:0)).getTime();
}

function timeFilterBounds(now=new Date()) {
  const todayStart=new Date(now.getFullYear(),now.getMonth(),now.getDate()).getTime();
  if (timeFilter === 'today') return { start:todayStart, end:new Date(now.getFullYear(),now.getMonth(),now.getDate()+1).getTime() };
  if (timeFilter === 'week') return { start:now.getTime()-(7*86400000), end:null };
  if (timeFilter === 'month') return { start:now.getTime()-(30*86400000), end:null };
  if (timeFilter === 'year') return { start:new Date(now.getFullYear(),0,1).getTime(), end:null };
  if (timeFilter === 'custom') return { start:dateBoundary(customDateStart), end:dateBoundary(customDateEnd,true) };
  return { start:null, end:null };
}

function renderFeedFilters() {
  const options = [['me','Me'], ...friends.map(f => [f.uid, f.name || f.email || 'Friend'])];
  const count=options.filter(([id])=>selectedPeople.has(id)).length;
  const label=count===0?'Nobody':count===options.length&&count>1?'Everyone':count===1?options.find(([id])=>selectedPeople.has(id))[1]:`${count} people`;
  ['mapFeedFilter','historyFeedFilter','leaderboardFeedFilter'].forEach(id => {
    const root=$(id);
    const open=root.querySelector('details')?.open || false;
    root.innerHTML=`<details class="people-dropdown" ${open?'open':''}><summary>${escapeHtml(label)}</summary><div class="people-menu"><label class="people-all"><input type="checkbox" data-people="all" ${count===options.length?'checked':''}><span>All</span></label>${options.map(([value,name])=>`<label><input type="checkbox" value="${escapeHtml(value)}" ${selectedPeople.has(value)?'checked':''}><span>${escapeHtml(name)}</span></label>`).join('')}</div></details>`;
    root.querySelectorAll('input:not([data-people])').forEach(input=>input.addEventListener('change',()=>{
      if(input.checked) selectedPeople.add(input.value); else selectedPeople.delete(input.value);
      refreshPeopleFilter();
    }));
    const allInput=root.querySelector('[data-people="all"]');
    allInput.indeterminate=count>0 && count<options.length;
    allInput.addEventListener('change',()=>{
      selectedPeople=new Set(count===options.length?[]:options.map(([id])=>id));
      refreshPeopleFilter();
    });
  });
}

function refreshPeopleFilter() {
  mapScope='recent';
  renderFeedFilters();
  renderHistory();
  if ($('mapView').classList.contains('active')) renderMap();
}

function renderDataFilters() {
  const timeOptions=[['all','All time'],['today','Today'],['week','Last 7 days'],['month','Last 30 days'],['year','This year'],['custom','Custom range']];
  const timeHtml=timeOptions.map(([value,label])=>`<option value="${value}" ${value===timeFilter?'selected':''}>${label}</option>`).join('');
  $('mapTimeFilter').innerHTML=timeHtml;
  $('historyTimeFilter').innerHTML=timeHtml;
  $('leaderboardTimeFilter').innerHTML=timeHtml;
  const speciesOptions=[['all','All species'],...TAXA.map(taxon=>[taxon.id,taxon.name])];
  const speciesHtml=speciesOptions.map(([value,label])=>`<option value="${escapeHtml(value)}" ${value===speciesFilter?'selected':''}>${escapeHtml(label)}</option>`).join('');
  $('mapSpeciesFilter').innerHTML=speciesHtml;
  $('historySpeciesFilter').innerHTML=speciesHtml;
  $('leaderboardSpeciesFilter').innerHTML=speciesHtml;
  $('historyGroupFilter').value=historyGroup;
  ['map','history','leaderboard'].forEach(prefix => {
    const range=$(prefix + 'CustomDateRange');
    range.classList.toggle('hidden',timeFilter !== 'custom');
    $(prefix + 'CustomStart').value=customDateStart;
    $(prefix + 'CustomEnd').value=customDateEnd;
  });
}

function setDataFilter(type,value) {
  if (type === 'time') {
    timeFilter=value;
    if (value === 'custom' && !customDateStart && !customDateEnd) {
      customDateStart=dateKey(new Date());
      customDateEnd=customDateStart;
    }
  }
  if (type === 'species') speciesFilter=value;
  mapScope='recent';
  renderDataFilters();
  renderHistory();
  if ($('mapView').classList.contains('active')) renderMap();
}

function setCustomDateFilter(bound,value) {
  if (bound === 'start') customDateStart=value;
  if (bound === 'end') customDateEnd=value;
  if (customDateStart && customDateEnd && customDateStart > customDateEnd) {
    if (bound === 'start') customDateEnd=customDateStart;
    else customDateStart=customDateEnd;
  }
  timeFilter='custom';
  mapScope='recent';
  renderDataFilters();
  renderHistory();
  if ($('mapView').classList.contains('active')) renderMap();
}


function openDb() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const database = req.result;
      if (!database.objectStoreNames.contains('sightings')) database.createObjectStore('sightings', { keyPath: 'id' });
      if (!database.objectStoreNames.contains('speciesPhotos')) database.createObjectStore('speciesPhotos', { keyPath: 'id' });
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
function speciesPhotoRequest(mode, action) {
  return new Promise((resolve,reject) => {
    const tx=db.transaction('speciesPhotos',mode);
    const request=action(tx.objectStore('speciesPhotos'));
    tx.oncomplete=()=>resolve(request.result);
    tx.onerror=()=>reject(tx.error);
    tx.onabort=()=>reject(tx.error);
  });
}
async function saveSpeciesPhoto(id,photo) {
  if (photo) await speciesPhotoRequest('readwrite',store=>store.put({id,photo}));
  else await speciesPhotoRequest('readwrite',store=>store.delete(id));
  if (photo) speciesPhotos[id]=photo; else delete speciesPhotos[id];
}
async function handleSpeciesPhoto(event) {
  const file=event.target.files?.[0];
  const id=pendingSpeciesPhotoId;
  event.target.value='';
  if (!file || !id) return;
  showToast('Preparing species photo…');
  try {
    const photo=await compressImage(file,640);
    await saveSpeciesPhoto(id,photo);
    renderSpeciesEditor(); renderAll();
    showToast('Species photo saved on this device');
  } catch { showToast('Couldn’t save that photo. Try another image or free some device storage.'); }
}
async function putSighting(item, sync=true) {
  await dbRequest('readwrite', store => store.put(item));
  if (sync && currentUser && item.ownerUid === currentUser.uid) syncSighting(item).catch(() => renderAccount('Sync waiting for connection'));
}
async function removeSighting(id, sync=true) {
  const item = sightings.find(s => s.id === id);
  await dbRequest('readwrite', store => store.delete(id));
  if (sync && currentUser && item?.ownerUid === currentUser.uid) {
    queueDelete(currentUser.uid, id);
    cloudDb.collection('users').doc(currentUser.uid).collection('sightings').doc(id).delete()
      .then(() => clearQueuedDelete(currentUser.uid, id))
      .catch(() => renderAccount('Deletion waiting to sync'));
  }
}

async function init() {
  db = await openDb();
  speciesPhotos=Object.fromEntries((await speciesPhotoRequest('readonly',store=>store.getAll())).map(item=>[item.id,item.photo]));
  const stored = await readAll();
  sightings = [];
  for (const original of stored) {
    const migrated = migrateSighting(original, legacySettingsSpecies);
    if (migrated.changed) {
      migrated.item.updatedAt = Date.now();
      await putSighting(migrated.item, false);
    }
    sightings.push(migrated.item);
  }
  sightings.sort((a,b) => b.timestamp - a.timestamp);
  saveSettings();
  bindEvents();
  renderAll();
  registerServiceWorker();
  loadOptionalLibraries();
}

function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return;
  let refreshing=false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (refreshing) return;
    refreshing=true;
    location.reload();
  });
  navigator.serviceWorker.register('./sw.js', { updateViaCache:'none' }).then(registration => registration.update()).catch(() => {});
}

function loadScript(url, timeout=OPTIONAL_LOAD_TIMEOUT) {
  const existing=[...document.scripts].find(script => script.src === url);
  if (existing?.dataset.loaded === 'true') return Promise.resolve();
  return new Promise((resolve,reject) => {
    const script=existing || document.createElement('script');
    let settled=false;
    const finish=(error) => {
      if (settled) return;
      settled=true;
      clearTimeout(timer);
      script.onload=null;
      script.onerror=null;
      if (error) {
        script.remove();
        reject(error);
      } else {
        script.dataset.loaded='true';
        resolve();
      }
    };
    const timer=setTimeout(() => finish(new Error('Network library timed out')),timeout);
    script.onload=()=>finish();
    script.onerror=()=>finish(new Error('Network library failed'));
    if (!existing) {
      script.src=url;
      script.async=true;
      script.crossOrigin='anonymous';
      document.head.appendChild(script);
    }
  });
}

function loadStylesheet(url) {
  if ([...document.styleSheets].some(sheet => sheet.href === url)) return;
  const link=document.createElement('link');
  link.rel='stylesheet';
  link.href=url;
  link.crossOrigin='anonymous';
  document.head.appendChild(link);
}

async function loadLeaflet() {
  if (window.L) return;
  if (!leafletLoadPromise) {
    loadStylesheet(LEAFLET_CSS_URL);
    leafletLoadPromise=loadScript(LEAFLET_SCRIPT_URL).catch(error => {
      leafletLoadPromise=null;
      throw error;
    });
  }
  await leafletLoadPromise;
  if ($('mapView').classList.contains('active')) renderMap();
}

async function loadFirebaseLibraries() {
  if (window.firebase?.auth && window.firebase?.firestore) return;
  if (!firebaseLoadPromise) {
    firebaseLoadPromise=(async()=>{
      for (const url of FIREBASE_SCRIPT_URLS) await loadScript(url);
    })().catch(error => {
      firebaseLoadPromise=null;
      throw error;
    });
  }
  await firebaseLoadPromise;
}

function loadOptionalLibraries() {
  loadLeaflet().catch(() => {});
  loadFirebaseLibraries().then(initFirebase).catch(() => renderAccount('Cloud sync is waiting for a connection; local mode works.'));
}

function bindEvents() {
  $('speciesPhotoInput').addEventListener('change',handleSpeciesPhoto);
  $('leaderboardTimeFilter').addEventListener('change',e=>setDataFilter('time',e.target.value));
  $('leaderboardSpeciesFilter').addEventListener('change',e=>setDataFilter('species',e.target.value));
  ['map','history','leaderboard'].forEach(prefix => {
    $(prefix + 'CustomStart').addEventListener('change',e=>setCustomDateFilter('start',e.target.value));
    $(prefix + 'CustomEnd').addEventListener('change',e=>setCustomDateFilter('end',e.target.value));
  });
  document.querySelectorAll('.nav-item').forEach(button => button.addEventListener('click', () => switchView(button.dataset.view)));
  $('primarySpotButton').addEventListener('click', () => recordSighting(settings.primaryId));
  $('cameraButton').addEventListener('click', () => $('cameraInput').click());
  $('cameraInput').addEventListener('change', handlePhoto);
  $('noteSightingButton').addEventListener('click', openNoteSighting);
  $('noteSightingForm').addEventListener('submit', saveNoteSighting);
  $('pastSightingButton').addEventListener('click', openPastSighting);
  $('pastPhotoInput').addEventListener('change', handlePastPhoto);
  $('pastSightingForm').addEventListener('submit', savePastSighting);
  $('choosePastLocationButton').addEventListener('click', () => openLocationPicker('past'));
  $('cancelLocationPicker').addEventListener('click', cancelLocationPicker);
  $('savePickedLocation').addEventListener('click', savePickedLocation);
  $('settingsButton').addEventListener('click', openSettings);
  $('customizeButton').addEventListener('click', openSettings);
  $('saveSettingsButton').addEventListener('click', commitSettings);
  $('reviewTaxonomyButton').addEventListener('click', openTaxonomyReview);
  $('saveTaxonomyReview').addEventListener('click', saveTaxonomyReview);
  $('identificationForm').addEventListener('submit', saveIdentificationEdit);
  $('gpsToggle').addEventListener('change', e => settings.gps = e.target.checked);
  $('prevMonth').addEventListener('click', () => changeMonth(-1));
  $('nextMonth').addEventListener('click', () => changeMonth(1));
  $('exportButton').addEventListener('click', exportData);
  $('importButton').addEventListener('click', () => { importTarget='local'; $('importInput').click(); });
  $('importAccountButton').addEventListener('click', () => { importTarget='account'; $('importInput').click(); });
  $('importInput').addEventListener('change', importData);
  $('googleSignInButton').addEventListener('click', signInWithGoogle);
  $('signOutButton').addEventListener('click', () => firebaseAuth?.signOut());
  $('uploadLocalButton').addEventListener('click', uploadLocalSightings);
  $('sendFriendRequest').addEventListener('click', sendFriendRequest);
  $('mapScopeButton').addEventListener('click', () => {
    mapScope = mapScope === 'recent' ? 'all' : 'recent';
    renderMap();
  });
  $('cancelNoteSighting').addEventListener('click', () => $('noteSightingDialog').close());
  window.addEventListener('online', () => {
    if (currentUser && socialRetryTimer) restartSocialSync(currentUser);
    if (!window.L) loadLeaflet().catch(() => {});
    if (!firebaseAuth) loadFirebaseLibraries().then(initFirebase).catch(() => {});
  });
  document.addEventListener('click', event => {
    document.querySelectorAll('.people-dropdown[open]').forEach(menu => { if (!menu.contains(event.target)) menu.open=false; });
  });
  $('mapTimeFilter').addEventListener('change', e => setDataFilter('time',e.target.value));
  $('historyTimeFilter').addEventListener('change', e => setDataFilter('time',e.target.value));
  $('mapSpeciesFilter').addEventListener('change', e => setDataFilter('species',e.target.value));
  $('historySpeciesFilter').addEventListener('change', e => setDataFilter('species',e.target.value));
  $('historyGroupFilter').addEventListener('change', e => { historyGroup=e.target.value; renderHistory(); });
}

function switchView(viewId) {
  document.querySelectorAll('.view').forEach(v => v.classList.toggle('active', v.id === viewId));
  document.querySelectorAll('.nav-item').forEach(v => v.classList.toggle('active', v.dataset.view === viewId));
  if (viewId === 'mapView') {
    mapScope = 'recent';
    setTimeout(renderMap, 80);
  }
  if (viewId === 'calendarView') renderCalendar();
  if (viewId === 'historyView') renderHistory();
  if (viewId === 'leaderboardView') renderLeaderboard();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function recordSighting(speciesId, photo = null, notes = '') {
  const now = Date.now();
  const item = applyClassification({ id:crypto.randomUUID(), timestamp:now, latitude:null, longitude:null, accuracy:null, photo, notes:notes.trim(), ownerUid:currentUser?.uid || null, updatedAt:now }, speciesId);
  await putSighting(item);
  sightings.unshift(item);
  renderAll();
  const species = speciesFor(speciesId);
  $('primarySpotButton').classList.remove('pulse');
  void $('primarySpotButton').offsetWidth;
  $('primarySpotButton').classList.add('pulse');
  showToast(`${species.name} spotted!`);
  if (settings.gps && navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async pos => {
      item.latitude = pos.coords.latitude;
      item.longitude = pos.coords.longitude;
      item.accuracy = Math.round(pos.coords.accuracy);
      item.updatedAt = Date.now();
      await putSighting(item);
      renderAll();
      showToast('📍 Location added');
    }, error => {
      if (error.code === 1) showToast('Location wasn’t allowed—sighting still saved');
    }, { enableHighAccuracy: true, timeout: 12000, maximumAge: 30000 });
  }
}

function openNoteSighting() {
  $('noteSpecies').innerHTML=taxonomyOptions(settings.primaryId);
  $('noteSpecies').value=settings.primaryId;
  $('sightingNotes').value='';
  $('noteSightingDialog').showModal();
  setTimeout(()=>$('sightingNotes').focus(),50);
}

async function saveNoteSighting(event) {
  event.preventDefault();
  const notes=$('sightingNotes').value.trim();
  if (!notes) { showToast('Add a note first'); return; }
  $('noteSightingDialog').close();
  await recordSighting($('noteSpecies').value,null,notes);
}

function localDateTimeValue(date = new Date()) {
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

function openPastSighting() {
  $('pastSpecies').innerHTML = taxonomyOptions(settings.primaryId);
  $('pastSpecies').value = settings.primaryId;
  $('pastDateTime').value = localDateTimeValue();
  $('pastDateTime').max = localDateTimeValue();
  $('pastPhotoInput').value = '';
  pendingPastPhoto = null;
  pendingPastMetadata = null;
  pendingPastLocation = null;
  $('pastPhotoPreview').classList.add('hidden');
  $('pastPhotoPreview').innerHTML = '';
  $('pastMetadataStatus').classList.add('hidden');
  $('pastMetadataStatus').textContent = '';
  updatePastLocationSummary();
  $('pastSightingDialog').showModal();
}

async function handlePastPhoto(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  showToast('Preparing photo…');
  try {
    const [photo, metadata] = await Promise.all([compressImage(file), readExifMetadata(file)]);
    pendingPastPhoto = photo;
    pendingPastMetadata = metadata;
    $('pastPhotoPreview').innerHTML = `<img src="${pendingPastPhoto}" alt="Selected sighting photo">`;
    $('pastPhotoPreview').classList.remove('hidden');
    const found = [];
    if (Number.isFinite(metadata.latitude) && Number.isFinite(metadata.longitude)) {
      pendingPastLocation = { latitude: metadata.latitude, longitude: metadata.longitude };
      found.push('photo location');
      updatePastLocationSummary();
    }
    if (metadata.capturedAt && metadata.capturedAt.getTime() <= Date.now()) {
      $('pastDateTime').value = localDateTimeValue(metadata.capturedAt);
      found.push('capture time');
    }
    $('pastMetadataStatus').textContent = found.length ? `✓ Found ${found.join(' and ')} in the photo` : 'No location or capture time found in this photo';
    $('pastMetadataStatus').classList.remove('hidden');
  } catch {
    pendingPastPhoto = null;
    pendingPastMetadata = null;
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
  const item = applyClassification({
    id: crypto.randomUUID(),
    timestamp,
    latitude: Number.isFinite(pendingPastLocation?.latitude) ? pendingPastLocation.latitude : null,
    longitude: Number.isFinite(pendingPastLocation?.longitude) ? pendingPastLocation.longitude : null,
    accuracy: null,
    photo: pendingPastPhoto,
    ownerUid: currentUser?.uid || null,
    updatedAt: Date.now()
  }, $('pastSpecies').value);
  await putSighting(item);
  sightings.push(item);
  sightings.sort((a,b) => b.timestamp - a.timestamp);
  pendingPastPhoto = null;
  pendingPastMetadata = null;
  pendingPastLocation = null;
  $('pastSightingDialog').close();
  currentMonth = new Date(new Date(timestamp).getFullYear(), new Date(timestamp).getMonth(), 1);
  selectedDate = dateKey(timestamp);
  renderAll();
  const species = speciesFor(item.speciesId);
  showToast(`${species.name} added`);
}

function updatePastLocationSummary() {
  $('pastLocationSummary').textContent = pendingPastLocation
    ? `${pendingPastLocation.latitude.toFixed(5)}, ${pendingPastLocation.longitude.toFixed(5)}`
    : 'No location selected';
}

function openLocationPicker(target) {
  locationPickerTarget = target;
  const targetItem = target === 'past' ? null : sightings.find(item => item.id === target);
  locationPickerSelection = target === 'past'
    ? pendingPastLocation
    : (Number.isFinite(targetItem?.latitude) ? { latitude:targetItem.latitude, longitude:targetItem.longitude } : null);
  if ($('pastSightingDialog').open) $('pastSightingDialog').close();
  if ($('detailDialog').open) $('detailDialog').close();
  $('locationPickerDialog').showModal();
  setTimeout(renderLocationPickerMap, 80);
  if (!window.L) loadLeaflet().then(renderLocationPickerMap).catch(() => showToast('The map will load when your connection improves'));
}

function renderLocationPickerMap() {
  if (!window.L || !$('locationPickerDialog').open) return;
  const mapped = sightings.find(s => Number.isFinite(s.latitude) && Number.isFinite(s.longitude));
  const center = locationPickerSelection || (mapped ? { latitude:mapped.latitude, longitude:mapped.longitude } : { latitude:38.88, longitude:-77.1 });
  if (!locationPickerMap) {
    locationPickerMap = L.map('locationPickerMap').setView([center.latitude, center.longitude], locationPickerSelection ? 15 : 11);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom:19, attribution:'© OpenStreetMap contributors' }).addTo(locationPickerMap);
    locationPickerMap.on('click', event => setPickerSelection(event.latlng.lat, event.latlng.lng));
  } else {
    locationPickerMap.setView([center.latitude, center.longitude], locationPickerSelection ? 15 : 11);
  }
  if (locationPickerSelection) setPickerSelection(locationPickerSelection.latitude, locationPickerSelection.longitude, false);
  else {
    if (locationPickerMarker) { locationPickerMap.removeLayer(locationPickerMarker); locationPickerMarker=null; }
    $('pickedCoordinates').textContent = 'Tap the map to place a pin.';
    $('savePickedLocation').disabled = true;
  }
  locationPickerMap.invalidateSize();
}

function setPickerSelection(latitude, longitude, pan=true) {
  locationPickerSelection = { latitude, longitude };
  if (locationPickerMarker) locationPickerMarker.setLatLng([latitude, longitude]);
  else locationPickerMarker = L.marker([latitude, longitude]).addTo(locationPickerMap);
  if (pan) locationPickerMap.panTo([latitude, longitude]);
  $('pickedCoordinates').textContent = `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
  $('savePickedLocation').disabled = false;
}

function cancelLocationPicker() {
  const target = locationPickerTarget;
  $('locationPickerDialog').close();
  if (target === 'past') $('pastSightingDialog').showModal();
  else if (target) showDetail(target);
}

async function savePickedLocation() {
  if (!locationPickerSelection) return;
  const target = locationPickerTarget;
  if (target === 'past') {
    pendingPastLocation = { ...locationPickerSelection };
    updatePastLocationSummary();
    $('locationPickerDialog').close();
    $('pastSightingDialog').showModal();
    showToast('📍 Location selected');
    return;
  }
  const item = sightings.find(s => s.id === target);
  if (!item) return;
  item.latitude = locationPickerSelection.latitude;
  item.longitude = locationPickerSelection.longitude;
  item.accuracy = null;
  item.updatedAt = Date.now();
  await putSighting(item);
  $('locationPickerDialog').close();
  renderAll();
  showDetail(item.id);
  showToast('📍 Location added');
}

async function readExifMetadata(file) {
  const empty = { latitude: null, longitude: null, capturedAt: null };
  try {
    const view = new DataView(await file.arrayBuffer());
    if (view.byteLength < 4 || view.getUint16(0, false) !== 0xffd8) return empty;
    let offset = 2;
    while (offset + 4 <= view.byteLength) {
      if (view.getUint8(offset) !== 0xff) break;
      const marker = view.getUint8(offset + 1);
      if (marker === 0xda || marker === 0xd9) break;
      const length = view.getUint16(offset + 2, false);
      if (length < 2 || offset + 2 + length > view.byteLength) break;
      if (marker === 0xe1 && length >= 8 && ascii(view, offset + 4, 6) === 'Exif\0\0') {
        return parseExifTiff(view, offset + 10, length - 8);
      }
      offset += 2 + length;
    }
  } catch {}
  return empty;
}

function parseExifTiff(view, base, available) {
  const empty = { latitude: null, longitude: null, capturedAt: null };
  if (available < 8 || base + available > view.byteLength) return empty;
  const byteOrder = view.getUint16(base, false);
  const little = byteOrder === 0x4949;
  if (!little && byteOrder !== 0x4d4d) return empty;
  const u16 = at => view.getUint16(base + at, little);
  const u32 = at => view.getUint32(base + at, little);
  const inRange = (at, size=1) => at >= 0 && at + size <= available;
  if (!inRange(4, 4) || u16(2) !== 42) return empty;

  const readIfd = at => {
    const tags = new Map();
    if (!inRange(at, 2)) return tags;
    const count = u16(at);
    for (let i=0; i<count; i++) {
      const entry = at + 2 + i * 12;
      if (!inRange(entry, 12)) break;
      tags.set(u16(entry), { type:u16(entry+2), count:u32(entry+4), valueAt:entry+8, pointer:u32(entry+8) });
    }
    return tags;
  };
  const bytesPerType = type => ({1:1,2:1,3:2,4:4,5:8,7:1,9:4,10:8}[type] || 0);
  const dataAt = tag => {
    const size = bytesPerType(tag.type) * tag.count;
    const at = size <= 4 ? tag.valueAt : tag.pointer;
    return inRange(at, size) ? at : null;
  };
  const text = tag => {
    if (!tag || tag.type !== 2) return null;
    const at = dataAt(tag); if (at === null) return null;
    return ascii(view, base + at, tag.count).replace(/\0.*$/, '').trim();
  };
  const rational = (tag, index) => {
    const at = dataAt(tag); if (at === null || tag.type !== 5 || index >= tag.count) return NaN;
    const numerator = u32(at + index*8), denominator = u32(at + index*8 + 4);
    return denominator ? numerator / denominator : NaN;
  };
  const firstIfd = u32(4);
  const root = readIfd(firstIfd);
  let capturedAt = null;
  const exifPointer = root.get(0x8769)?.pointer;
  const exif = Number.isFinite(exifPointer) ? readIfd(exifPointer) : new Map();
  const dateString = text(exif.get(0x9003)) || text(exif.get(0x9004)) || text(root.get(0x0132));
  const match = dateString?.match(/^(\d{4}):(\d{2}):(\d{2}) (\d{2}):(\d{2}):(\d{2})/);
  if (match) {
    const parts = match.slice(1).map(Number);
    const candidate = new Date(parts[0], parts[1]-1, parts[2], parts[3], parts[4], parts[5]);
    if (!Number.isNaN(candidate.getTime())) capturedAt = candidate;
  }

  let latitude = null, longitude = null;
  const gpsPointer = root.get(0x8825)?.pointer;
  if (Number.isFinite(gpsPointer)) {
    const gps = readIfd(gpsPointer);
    const latTag = gps.get(0x0002), lonTag = gps.get(0x0004);
    if (latTag && lonTag) {
      const lat = rational(latTag,0) + rational(latTag,1)/60 + rational(latTag,2)/3600;
      const lon = rational(lonTag,0) + rational(lonTag,1)/60 + rational(lonTag,2)/3600;
      const latRef = text(gps.get(0x0001)), lonRef = text(gps.get(0x0003));
      if (Number.isFinite(lat) && Number.isFinite(lon)) {
        latitude = latRef === 'S' ? -lat : lat;
        longitude = lonRef === 'W' ? -lon : lon;
      }
    }
  }
  return { latitude, longitude, capturedAt };
}

function ascii(view, start, count) {
  let value = '';
  for (let i=0; i<count && start+i<view.byteLength; i++) value += String.fromCharCode(view.getUint8(start+i));
  return value;
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

function compressImage(file, max = 1600) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const scale = Math.min(1, max / Math.max(img.width, img.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL('image/jpeg', .78));
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Unsupported image')); };
    img.src = url;
  });
}

function renderAll() {
  renderHome();
  renderCalendar();
  renderHistory();
  renderFeedFilters();
  renderDataFilters();
  if ($('mapView').classList.contains('active')) renderMap();
}

function renderHome() {
  const today = dateKey(new Date());
  const count = sightings.filter(s => dateKey(s.timestamp) === today).length;
  const primary = speciesFor(settings.primaryId);
  $('todayLabel').textContent = new Intl.DateTimeFormat(undefined, { weekday:'long', month:'long', day:'numeric' }).format(new Date()).toUpperCase();
  $('todayCount').textContent = count;
  $('dailyPrompt').textContent = count ? (count > 4 ? 'A banner day for squirrels.' : 'The count is officially underway.') : 'Keep your eyes on the trees.';
  $('primaryImage').onerror = () => {
    $('primaryImage').onerror = null;
    $('primaryImage').src = FALLBACK_TAXON_IMAGE;
  };
  $('primaryImage').src = taxonPhotoSource(primary);
  $('primaryImage').alt = primary.name;
  $('primaryName').textContent = primary.name;
  const quick = settings.visibleIds.filter(id => id !== settings.primaryId).map(classificationFor);
  $('quickGrid').innerHTML = quick.length ? quick.map(s => `<button class="quick-button" data-species="${escapeHtml(s.id)}">${taxonImage(s)}<span><strong>${escapeHtml(s.name)}</strong><small>${scientificLine(s)}</small></span></button>`).join('') : '<div class="empty-state">Add shortcuts in Customize.</div>';
  $('quickGrid').querySelectorAll('[data-species]').forEach(b => b.addEventListener('click', () => recordSighting(b.dataset.species)));
  const last = sightings[0];
  $('lastCard').classList.toggle('hidden', !last);
  if (last) {
    const sp = displaySpecies(last);
    $('lastName').textContent = sp.name;
    $('lastMeta').textContent = `${fmtTime.format(last.timestamp)}${last.latitude ? ' · location saved' : ''}`;
    $('lastThumb').innerHTML = last.photo ? `<img src="${last.photo}" alt="Latest squirrel">` : taxonImage(sp);
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
  renderLeaderboard();
  const visible = filteredSightings();
  $('totalCount').textContent = visible.length;
  $('speciesCount').textContent = new Set(visible.map(s=>s.taxonId || s.speciesId)).size;
  $('streakCount').textContent = calculateStreak(visible);
  renderGroupedHistory(visible);
}

function leaderboardEntries(items,people) {
  const counts=new Map(people.map(([id,name])=>[id,{id,name,count:0}]));
  items.forEach(item=>{ const entry=counts.get(item.friendUid || 'me'); if(entry) entry.count++; });
  const rows=[...counts.values()].sort((a,b)=>b.count-a.count || (a.id==='me'?-1:b.id==='me'?1:a.name.localeCompare(b.name)));
  let rank=0;
  return rows.map((row,index)=>{ if(index===0 || row.count!==rows[index-1].count) rank=index+1; return {...row,rank}; });
}
function renderLeaderboard() {
  const people=[['me','Me'],...friends.map(f=>[f.uid,f.name || f.email || 'Friend'])].filter(([id])=>selectedPeople.has(id));
  const rows=leaderboardEntries(filteredSightings(),people);
  $('leaderboardRows').innerHTML=rows.length ? rows.map(row=>`<div class="leaderboard-row ${row.id==='me'?'is-me':''}"><span class="leaderboard-rank">${row.rank}</span><strong>${escapeHtml(row.name)}</strong><span class="leaderboard-count">${row.count.toLocaleString()}<small>sighting${row.count===1?'':'s'}</small></span></div>`).join('') : '<div class="empty-state">Select people to see the standings.</div>';
  $('leaderboardStatus').textContent=currentUser ? 'Only your sightings and those shared by approved friends are counted. Choose All in People to compare everyone.' : 'Local mode shows your sightings. Sign in and add friends to compare counts.';
}

function historyGroupKey(item) {
  if (historyGroup === 'day') return { key:dateKey(item.timestamp), label:fmtDay.format(item.timestamp) };
  if (historyGroup === 'species') { const species=displaySpecies(item); return { key:species.id, label:species.name }; }
  if (historyGroup === 'person') return item.friendUid
    ? { key:`friend:${item.friendUid}`, label:item.ownerName || 'Friend' }
    : { key:'me', label:'Me' };
  return { key:'all', label:'' };
}

function renderGroupedHistory(items) {
  const container=$('allSightings');
  if (historyGroup === 'none') { renderList(container,items,'No sightings match these filters.',true); return; }
  if (!items.length) { container.innerHTML='<div class="empty-state">No sightings match these filters.</div>'; return; }
  const groups=new Map();
  items.forEach(item => {
    const group=historyGroupKey(item);
    if (!groups.has(group.key)) groups.set(group.key,{ label:group.label, items:[] });
    groups.get(group.key).items.push(item);
  });
  container.innerHTML=[...groups.entries()].map(([key,group])=>`<section class="history-group"><h3>${escapeHtml(group.label)} · ${group.items.length}</h3><div class="sighting-list" data-group="${escapeHtml(key)}"></div></section>`).join('');
  [...groups.entries()].forEach(([key,group])=>renderList(container.querySelector(`[data-group="${CSS.escape(key)}"]`),group.items,'',historyGroup!=='day'));
}

function calculateStreak(items=sightings) {
  const dates = new Set(items.map(s => dateKey(s.timestamp)));
  let d = new Date(), streak = 0;
  if (!dates.has(dateKey(d))) d.setDate(d.getDate()-1);
  while (dates.has(dateKey(d))) { streak++; d.setDate(d.getDate()-1); }
  return streak;
}

function renderList(container, items, empty, showDate=false) {
  if (!items.length) { container.innerHTML = `<div class="empty-state">${empty}</div>`; return; }
  container.innerHTML = items.map(s => {
    const sp = displaySpecies(s);
    const owner = s.friendUid ? `${escapeHtml(s.ownerName || 'Friend')} · ` : '';
    return `<button class="sighting-row" data-id="${s.id}" data-friend="${escapeHtml(s.friendUid || '')}"><span class="sighting-icon">${s.photo?`<img src="${s.photo}" alt="">`:taxonImage(sp)}</span><span><strong>${escapeHtml(sp.name)}</strong><span>${owner}${sp.scientific?`<i>${escapeHtml(sp.scientific)}</i> · `:''}${s.latitude?'📍 GPS saved':'No location'}${s.photo?' · Photo':''}${s.notes?' · Note':''}</span></span><time>${showDate?fmtDay.format(s.timestamp):fmtTime.format(s.timestamp)}</time></button>`;
  }).join('');
  container.querySelectorAll('[data-id]').forEach(b => b.addEventListener('click', () => b.dataset.friend ? showFriendDetail(b.dataset.id, b.dataset.friend) : showDetail(b.dataset.id)));
}

function showDetail(id) {
  const item = sightings.find(s => s.id === id); if (!item) return;
  const sp = displaySpecies(item);
  $('detailContent').innerHTML = `${item.photo?`<img class="detail-photo" src="${item.photo}" alt="Squirrel sighting">`:`<div class="detail-taxon-photo">${taxonImage(sp)}</div>`}<div class="dialog-header"><div><p class="eyebrow">SIGHTING</p><h2>${escapeHtml(sp.name)}</h2>${sp.scientific?`<p class="scientific-name"><em>${escapeHtml(sp.scientific)}</em>${item.traits?.length?` · ${escapeHtml(item.traits.join(', '))}`:''}</p>`:''}</div><button class="close-button" id="closeDetail" aria-label="Close">×</button></div><p class="detail-meta">${new Date(item.timestamp).toLocaleString()}<br>${Number.isFinite(item.latitude)?`${item.latitude.toFixed(5)}, ${item.longitude.toFixed(5)}${item.accuracy?` · ±${item.accuracy}m`:''}`:'No GPS coordinates'}</p>${item.notes?`<p class="sighting-note">${escapeHtml(item.notes)}</p>`:''}<button class="secondary-button refine-button" id="refineSighting">Refine identification</button>${Number.isFinite(item.latitude)?'':`<button class="secondary-button add-location-button" id="addLocationToSighting">📍 Choose location on map</button>`}<div class="detail-actions"><button class="secondary-button" id="closeDetail2">Done</button><button class="danger-button" id="deleteSighting">Delete sighting</button></div>`;
  $('detailDialog').showModal();
  $('closeDetail').onclick = $('closeDetail2').onclick = () => $('detailDialog').close();
  if ($('addLocationToSighting')) $('addLocationToSighting').onclick = () => openLocationPicker(item.id);
  $('refineSighting').onclick = () => openIdentificationEditor(item.id);
  $('deleteSighting').onclick = async () => {
    if (!confirm('Delete this squirrel sighting?')) return;
    await removeSighting(item.id);
    sightings = sightings.filter(s => s.id !== item.id);
    $('detailDialog').close(); renderAll(); showToast('Sighting deleted');
  };
}

function showFriendDetail(id, friendUid) {
  const item = friendSightings.find(s => s.id === id && s.friendUid === friendUid); if (!item) return;
  const sp = displaySpecies(item);
  $('detailContent').innerHTML = `<div class="detail-taxon-photo">${taxonImage(sp)}</div><div class="dialog-header"><div><p class="eyebrow">${escapeHtml((item.ownerName || 'FRIEND').toUpperCase())}</p><h2>${escapeHtml(sp.name)}</h2>${sp.scientific?`<p class="scientific-name"><em>${escapeHtml(sp.scientific)}</em></p>`:''}</div><button class="close-button" id="closeFriendDetail" aria-label="Close">×</button></div><p class="detail-meta">${new Date(item.timestamp).toLocaleString()}<br>${Number.isFinite(item.latitude)?`${item.latitude.toFixed(5)}, ${item.longitude.toFixed(5)}`:'No GPS coordinates'}<br>Photos remain private on their device.</p>${item.notes?`<p class="sighting-note">${escapeHtml(item.notes)}</p>`:''}<button class="secondary-button" id="doneFriendDetail">Done</button>`;
  $('detailDialog').showModal();
  $('closeFriendDetail').onclick = $('doneFriendDetail').onclick = () => $('detailDialog').close();
}

function openIdentificationEditor(id) {
  const item=sightings.find(s=>s.id===id); if (!item) return;
  $('identificationSelect').innerHTML=taxonomyOptions(item.classificationId || item.speciesId);
  $('identificationTarget').value=id;
  $('detailDialog').close();
  $('identificationDialog').showModal();
}

async function saveIdentificationEdit(event) {
  event.preventDefault();
  const item=sightings.find(s=>s.id===$('identificationTarget').value); if (!item) return;
  applyClassification(item,$('identificationSelect').value);
  item.updatedAt=Date.now();
  await putSighting(item);
  $('identificationDialog').close();
  renderAll();
  showDetail(item.id);
  showToast('Identification updated');
}

const MAP_PIN_COLORS = ['#276749','#d97706','#2563eb','#9333ea','#dc2626','#0891b2','#c026d3','#4d7c0f'];

function mapPeople(items) {
  const people = new Map();
  items.forEach(item => {
    const id = item.friendUid || currentUser?.uid || 'me';
    if (!people.has(id)) people.set(id, item.friendUid ? (item.ownerName || 'Friend') : 'Me');
  });
  const ordered = [...people.entries()].sort(([a],[b]) => {
    if (a === (currentUser?.uid || 'me')) return -1;
    if (b === (currentUser?.uid || 'me')) return 1;
    return a.localeCompare(b);
  });
  return new Map(ordered.map(([id,name], index) => [id, { name, color:MAP_PIN_COLORS[index % MAP_PIN_COLORS.length] }]));
}

function personPinIcon(color) {
  return L.divIcon({
    className:'person-map-pin',
    html:`<span style="--pin-color:${color}"></span>`,
    iconSize:[24,30],
    iconAnchor:[12,28],
    popupAnchor:[0,-27]
  });
}

function renderMap() {
  const mapped = filteredSightings().filter(s => Number.isFinite(s.latitude) && Number.isFinite(s.longitude));
  const newestTimestamp = mapped.reduce((newest, sighting) => Math.max(newest, Number(sighting.timestamp) || 0), 0);
  const recentCutoff = newestTimestamp - (7 * 24 * 60 * 60 * 1000);
  const recent = mapped.filter(sighting => (Number(sighting.timestamp) || 0) >= recentCutoff);
  const focusSightings = mapScope === 'all' ? mapped : recent;
  const hasOlderSightings = recent.length < mapped.length;
  const people = mapPeople(mapped);
  $('mapScopeButton').textContent = mapScope === 'all' ? 'Show recent week' : 'Show all sightings';
  $('mapScopeButton').hidden = !hasOlderSightings;
  $('mapLegend').innerHTML = [...people.values()].map(person => `<span class="map-legend-item"><i class="map-legend-dot" style="--pin-color:${person.color}"></i>${escapeHtml(person.name)}</span>`).join('');
  if (!window.L) {
    $('mapEmpty').classList.remove('hidden');
    $('mapEmpty').innerHTML='<span>⌁</span><strong>Map waiting for connection</strong><p>Spotting and local history still work normally.</p>';
    return;
  }
  $('mapEmpty').innerHTML='<span>📍</span><strong>No mapped squirrels yet</strong><p>Your next GPS-tagged sighting will appear here.</p>';
  $('mapEmpty').classList.toggle('hidden', mapped.length > 0);
  if (!map) {
    map = L.map('map', { zoomControl: true }).setView([38.88,-77.1], 11);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution:'© OpenStreetMap contributors' }).addTo(map);
    markerLayer = L.layerGroup().addTo(map);
  }
  markerLayer.clearLayers();
  mapped.forEach(s => {
    const sp = displaySpecies(s);
    const person = people.get(s.friendUid || currentUser?.uid || 'me');
    L.marker([s.latitude,s.longitude], { icon:personPinIcon(person.color) }).bindPopup(`<strong>${escapeHtml(sp.name)}</strong>${sp.scientific?`<br><em>${escapeHtml(sp.scientific)}</em>`:''}<br>${escapeHtml(person.name)}<br>${new Date(s.timestamp).toLocaleString()}${s.notes?`<br>${escapeHtml(s.notes)}`:''}`).addTo(markerLayer);
  });
  if (focusSightings.length === 1) map.setView([focusSightings[0].latitude,focusSightings[0].longitude], 15);
  if (focusSightings.length > 1) map.fitBounds(L.latLngBounds(focusSightings.map(s=>[s.latitude,s.longitude])), { padding:[28,28], maxZoom:15 });
  map.invalidateSize();
}

function openSettings() {
  renderSpeciesEditor();
  renderTaxonomyReviewStatus();
  $('gpsToggle').checked = settings.gps;
  $('settingsDialog').showModal();
}

function renderSpeciesEditor() {
  $('speciesEditor').innerHTML = TAXA.map(s => `<div class="species-edit-row ${s.id===settings.primaryId?'primary':''}" data-id="${escapeHtml(s.id)}"><button type="button" class="species-photo-button" aria-label="Choose a local photo for ${escapeHtml(s.name)}">${taxonImage(s)}<span>Photo</span></button><span class="taxon-copy"><strong>${escapeHtml(s.name)}</strong><small>${scientificLine(s)}</small>${speciesPhotos[s.id]?'<button type="button" class="reset-species-photo">Restore stock photo</button>':''}</span><label class="default-choice"><input type="radio" name="primary" value="${escapeHtml(s.id)}" ${s.id===settings.primaryId?'checked':''}><span>Default</span></label><button type="button" class="visibility-button" aria-label="${settings.visibleIds.includes(s.id)?'Remove from':'Add to'} shortcuts">${settings.visibleIds.includes(s.id)?'Shown':'Add'}</button></div>`).join('');
  $('speciesEditor').querySelectorAll('.species-edit-row').forEach(row => {
    row.querySelector('.species-photo-button').onclick=()=>{
      pendingSpeciesPhotoId=row.dataset.id;
      $('speciesPhotoInput').click();
    };
    const reset=row.querySelector('.reset-species-photo');
    if(reset) reset.onclick=async()=>{
      try { await saveSpeciesPhoto(row.dataset.id,null); renderSpeciesEditor(); renderAll(); showToast('Stock photo restored'); }
      catch { showToast('Couldn’t restore that photo'); }
    };
    row.querySelector('[type=radio]').onchange = () => {
      settings.primaryId=row.dataset.id;
      settings.visibleIds=settings.visibleIds.filter(id=>id!==row.dataset.id);
      renderSpeciesEditor();
    };
    row.querySelector('.visibility-button').onclick = () => {
      const id=row.dataset.id;
      settings.visibleIds=settings.visibleIds.includes(id) ? settings.visibleIds.filter(value=>value!==id) : [...settings.visibleIds,id];
      renderSpeciesEditor();
    };
  });
}

function taxonomyOptions(selected='') {
  const exact = TAXA.filter(t => t.identification === 'exact');
  const broad = TAXA.filter(t => t.identification === 'broad');
  const options = items => items.map(t => `<option value="${escapeHtml(t.id)}" ${t.id===selected?'selected':''}>${escapeHtml(t.name)}${t.scientific?` — ${escapeHtml(t.scientific)}`:''}</option>`).join('');
  return `<optgroup label="Specific species and forms">${options(exact)}</optgroup><optgroup label="Broader identifications">${options(broad)}</optgroup>`;
}

function unresolvedSightings() {
  return sightings.filter(item => item.identification === 'broad');
}

function reviewChoices(item) {
  const id=item.classificationId || item.speciesId;
  const groups = {
    'chipmunk-unspecified':['chipmunk-unspecified','eastern-chipmunk'],
    'marmot-unspecified':['marmot-unspecified','groundhog'],
    'flying-unspecified':['flying-unspecified','southern-flying'],
    'tree-squirrel-unspecified':['tree-squirrel-unspecified','eastern-gray','eastern-gray-melanistic','fox-squirrel','american-red']
  };
  return (groups[id] || TAXA.map(t=>t.id)).map(classificationFor);
}

function renderTaxonomyReviewStatus() {
  const count=unresolvedSightings().length;
  $('taxonomyReviewCount').textContent = count ? `${count} broad identification${count===1?'':'s'} to review.` : 'All sightings use the most precise identification you recorded.';
  $('reviewTaxonomyButton').disabled = !count;
}

function openTaxonomyReview() {
  const unresolved=unresolvedSightings();
  $('taxonomyReviewList').innerHTML = unresolved.map(item => {
    const current=displaySpecies(item);
    const options=reviewChoices(item).map(t=>`<option value="${escapeHtml(t.id)}" ${t.id===(item.classificationId||item.speciesId)?'selected':''}>${escapeHtml(t.name)}</option>`).join('');
    return `<label class="review-row" data-id="${escapeHtml(item.id)}"><span><strong>${escapeHtml(current.name)}</strong><small>${new Date(item.timestamp).toLocaleDateString()}${Number.isFinite(item.latitude)?' · location saved':''}</small></span><select>${options}</select></label>`;
  }).join('');
  $('settingsDialog').close();
  $('taxonomyReviewDialog').showModal();
}

async function saveTaxonomyReview() {
  const rows=[...$('taxonomyReviewList').querySelectorAll('.review-row')];
  for (const row of rows) {
    const item=sightings.find(s=>s.id===row.dataset.id);
    if (!item || row.querySelector('select').value === (item.classificationId || item.speciesId)) continue;
    applyClassification(item,row.querySelector('select').value);
    item.updatedAt=Date.now();
    await putSighting(item);
  }
  $('taxonomyReviewDialog').close();
  renderAll();
  showToast('Identifications updated');
}

function commitSettings() {
  settings.gps = $('gpsToggle').checked;
  saveSettings();
  if (currentUser) syncSettings().catch(() => renderAccount('Settings waiting to sync'));
  renderAll(); showToast('Squirrel setup saved');
}

async function exportData() {
  const payload = { app:'Squirreling', version:3, taxonomyVersion:TAXONOMY_VERSION, exportedAt:new Date().toISOString(), settings, sightings, speciesPhotos };
  const blob = new Blob([JSON.stringify(payload)], { type:'application/json' });
  const a = document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=`squirreling-backup-${dateKey(new Date())}.json`; a.click(); URL.revokeObjectURL(a.href);
  showToast('Backup exported');
}

async function importData(event) {
  const file=event.target.files?.[0]; if (!file) return;
  try {
    const data=JSON.parse(await file.text());
    if (!Array.isArray(data.sightings) || !data.settings) throw new Error();
    const intoAccount = importTarget === 'account' && currentUser;
    if (!confirm(`Import ${data.sightings.length} sightings ${intoAccount?'into your account':'on this device only'}? Existing sightings with different IDs will be kept.`)) return;
    const importLegacySpecies=Array.isArray(data.settings.species)?data.settings.species:[];
    settings=migrateSettings(data.settings); saveSettings();
    for(const [id,photo] of Object.entries(data.speciesPhotos || {})) {
      if(TAXON_BY_ID.has(id) && typeof photo==='string' && /^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(photo) && photo.length<5000000) await saveSpeciesPhoto(id,photo);
    }
    for (const original of data.sightings) {
      const migrated=migrateSighting(original,importLegacySpecies);
      const item = { ...migrated.item, ownerUid:intoAccount?currentUser.uid:null, updatedAt:Date.now() };
      await putSighting(item, Boolean(intoAccount));
    }
    if (intoAccount) await syncSettings();
    sightings=(await readAll()).sort((a,b)=>b.timestamp-a.timestamp);
    renderAll(); renderSpeciesEditor(); showToast('Backup imported');
  } catch { showToast('That backup file isn’t valid'); }
  event.target.value='';
}

async function initFirebase() {
  if (firebaseAuth) return;
  if (!window.firebase || !window.SQUIRRELING_FIREBASE_CONFIG) {
    renderAccount('Cloud sync is unavailable; local mode still works.');
    return;
  }
  try {
    if (!firebase.apps.length) firebase.initializeApp(window.SQUIRRELING_FIREBASE_CONFIG);
    firebaseAuth = firebase.auth();
    cloudDb = firebase.firestore();
    try {
      await cloudDb.enablePersistence({ synchronizeTabs:true });
    } catch (error) {
      if (!['failed-precondition','unimplemented'].includes(error?.code)) {
        renderAccount('Cloud cache is unavailable; live sync will still work.');
      }
    }
    firebaseAuth.onAuthStateChanged(user => {
      const previousUid=currentUser?.uid || null;
      const session=++socialSession;
      currentUser = user;
      if (unsubscribeCloud) { unsubscribeCloud(); unsubscribeCloud=null; }
      stopSocialListeners({ clear:!user || Boolean(previousUid && previousUid!==user.uid), cancelRetry:true });
      if (user && !friendsLoaded) loadCachedFriends(user.uid);
      renderAccount();
      renderFriends(); renderFeedFilters(); renderHistory();
      if (user) {
        startSocialSync(user,session);
        startAccountSync(user);
      }
    });
  } catch {
    renderAccount('Cloud sync could not start; local mode still works.');
  }
}

async function signInWithGoogle() {
  if (!firebaseAuth) { showToast('Cloud sync is unavailable'); return; }
  const provider = new firebase.auth.GoogleAuthProvider();
  try {
    await firebaseAuth.signInWithPopup(provider);
  } catch (error) {
    if (['auth/popup-blocked','auth/cancelled-popup-request','auth/operation-not-supported-in-this-environment'].includes(error.code)) {
      await firebaseAuth.signInWithRedirect(provider);
    } else {
      showToast(error.code === 'auth/unauthorized-domain' ? 'Add mgdunn2.github.io to Firebase authorized domains' : 'Google sign-in did not complete');
    }
  }
}

function renderAccount(message='') {
  if (!$('accountTitle')) return;
  const signedIn = Boolean(currentUser);
  $('accountTitle').textContent = signedIn ? (currentUser.displayName || currentUser.email || 'Signed in') : 'Local only';
  $('accountStatus').textContent = message || (signedIn ? `Syncing sightings as ${currentUser.email || 'your Google account'}. Photos stay on this device.` : 'Sightings are stored only on this device.');
  $('googleSignInButton').classList.toggle('hidden', signedIn);
  $('signOutButton').classList.toggle('hidden', !signedIn);
  $('uploadLocalButton').classList.toggle('hidden', !signedIn);
  $('importAccountButton').classList.toggle('hidden', !signedIn);
  $('friendsSection').classList.toggle('hidden', !signedIn);
}

function cloudSighting(item) {
  const { photo, ...record } = item;
  const sp = displaySpecies(item);
  return { ...record, ownerUid:currentUser.uid, ownerName:currentUser.displayName || currentUser.email || 'Squirreler', commonName:sp.name, scientificName:sp.scientific || null, updatedAt:item.updatedAt || Date.now() };
}

async function syncSighting(item) {
  if (!currentUser || !cloudDb) return;
  await cloudDb.collection('users').doc(currentUser.uid).collection('sightings').doc(item.id).set(cloudSighting(item));
  renderAccount('All account sightings synced.');
}

async function syncSettings() {
  if (!currentUser || !cloudDb) return;
  await cloudDb.collection('users').doc(currentUser.uid).collection('settings').doc('app').set({ ...settings, updatedAt:Date.now() });
}

async function startAccountSync(user) {
  renderAccount('Connecting to your squirrel account…');
  try {
    await flushQueuedDeletes(user.uid);
    const settingsDoc = await cloudDb.collection('users').doc(user.uid).collection('settings').doc('app').get();
    if (settingsDoc.exists) {
      const { updatedAt, ...remoteSettings } = settingsDoc.data();
      settings = migrateSettings(remoteSettings);
      saveSettings();
      renderAll();
      if (remoteSettings.taxonomyVersion !== TAXONOMY_VERSION) await syncSettings();
    }
    let firstSnapshot = true;
    unsubscribeCloud = cloudDb.collection('users').doc(user.uid).collection('sightings').onSnapshot(async snapshot => {
      let changed = false;
      const remoteIds = new Set(snapshot.docs.map(doc => doc.id));
      for (const change of snapshot.docChanges()) {
        const migratedRemote = migrateSighting({ ...change.doc.data(), id:change.doc.id, ownerUid:user.uid });
        const remote = migratedRemote.item;
        const local = sightings.find(s => s.id === remote.id);
        if (change.type === 'removed') {
          if (local?.ownerUid === user.uid) {
            await removeSighting(remote.id, false);
            sightings = sightings.filter(s => s.id !== remote.id);
            changed = true;
          }
        } else if (local && (local.updatedAt || 0) > (remote.updatedAt || 0)) {
          await syncSighting(local);
        } else {
          const merged = { ...remote, photo:local?.photo || null };
          await putSighting(merged, false);
          sightings = sightings.filter(s => s.id !== merged.id);
          sightings.push(merged);
          if (migratedRemote.changed) await syncSighting(merged);
          changed = true;
        }
      }
      if (changed) {
        sightings.sort((a,b) => b.timestamp-a.timestamp);
        renderAll();
      }
      if (firstSnapshot) {
        firstSnapshot = false;
        for (const local of sightings.filter(s => s.ownerUid === user.uid && !remoteIds.has(s.id))) await syncSighting(local);
      }
      renderAccount('All account sightings synced.');
    }, () => renderAccount('Offline — account changes will sync later.'));
  } catch {
    renderAccount('Offline — using sightings stored on this device.');
  }
}

async function emailHash(email) {
  const normalized=email.trim().toLowerCase();
  const bytes=await crypto.subtle.digest('SHA-256', new TextEncoder().encode(normalized));
  return [...new Uint8Array(bytes)].map(value=>value.toString(16).padStart(2,'0')).join('');
}

function setFriendsSyncStatus(message='') {
  const status=$('friendsSyncStatus');
  if (!status) return;
  status.textContent=message;
  status.classList.toggle('hidden',!message);
}

function isCurrentSocialSession(user,session) {
  return currentUser?.uid===user.uid && socialSession===session;
}

function loadCachedFriends(uid) {
  try {
    const cached=JSON.parse(localStorage.getItem(FRIENDS_CACHE_KEY));
    if (cached?.uid!==uid || !Array.isArray(cached.friends)) return;
    friends=cached.friends.filter(friend=>friend && typeof friend.uid==='string').map(friend=>({ uid:friend.uid, name:friend.name || '', email:friend.email || '' }));
    friendsLoaded=true;
  } catch {}
}

function cacheFriends(uid) {
  try {
    localStorage.setItem(FRIENDS_CACHE_KEY,JSON.stringify({ uid, friends:friends.map(({uid,name,email})=>({uid,name,email})) }));
  } catch {}
}

function startSocialSync(user, session=socialSession) {
  if (!isCurrentSocialSession(user,session)) return;
  setFriendsSyncStatus(friendsLoaded ? '' : 'Loading friends…');
  unsubscribeRequests=cloudDb.collection('friendRequests').where('recipientUid','==',user.uid).onSnapshot(snapshot => {
    if (!isCurrentSocialSession(user,session)) return;
    friendRequests=snapshot.docs.map(doc=>({ id:doc.id, ...doc.data() })).filter(request=>request.status==='pending');
    renderFriends();
  }, error => handleSocialError(user,session,error));
  unsubscribeFriends=cloudDb.collection('users').doc(user.uid).collection('friends').onSnapshot({ includeMetadataChanges:true }, snapshot => {
    if (!isCurrentSocialSession(user,session)) return;
    if (snapshot.empty && snapshot.metadata.fromCache && friendsLoaded && friends.length) {
      setFriendsSyncStatus('Showing saved friends while reconnecting…');
      return;
    }
    friends=snapshot.docs.map(doc=>({ uid:doc.id, ...doc.data() }));
    friendsLoaded=true;
    cacheFriends(user.uid);
    socialRetryAttempt=0;
    setFriendsSyncStatus('');
    startFriendSightingListeners(user,session);
    renderFriends(); renderFeedFilters(); renderHistory();
  }, error => handleSocialError(user,session,error));

  // Keeping the email directory current should never block loading the friend roster.
  emailHash(user.email || '').then(hash => {
    if (!isCurrentSocialSession(user,session)) return;
    return cloudDb.collection('emailDirectory').doc(hash).set({ uid:user.uid, name:user.displayName || user.email, email:user.email, updatedAt:Date.now() });
  }).catch(() => {});
}

function handleSocialError(user,session,error) {
  if (!isCurrentSocialSession(user,session)) return;
  setFriendsSyncStatus('Friends are temporarily unavailable. Retrying…');
  scheduleSocialRetry(user);
}

function scheduleSocialRetry(user) {
  if (currentUser?.uid!==user.uid || socialRetryTimer) return;
  const delay=Math.min(30000,2000*(2**socialRetryAttempt++));
  socialRetryTimer=setTimeout(()=>restartSocialSync(user),delay);
}

function restartSocialSync(user) {
  if (currentUser?.uid!==user.uid) return;
  if (socialRetryTimer) clearTimeout(socialRetryTimer);
  socialRetryTimer=null;
  stopSocialListeners({ clear:false, cancelRetry:false });
  const session=++socialSession;
  startSocialSync(user,session);
}

function stopSocialListeners({ clear=false, cancelRetry=false }={}) {
  if (unsubscribeFriends) unsubscribeFriends();
  if (unsubscribeRequests) unsubscribeRequests();
  friendUnsubscribers.forEach(unsubscribe=>unsubscribe());
  unsubscribeFriends=unsubscribeRequests=null;
  friendUnsubscribers=[];
  if (cancelRetry && socialRetryTimer) clearTimeout(socialRetryTimer);
  if (cancelRetry) socialRetryTimer=null;
  if (clear) {
    friends=[]; friendRequests=[]; friendSightings=[]; friendsLoaded=false;
    selectedPeople=new Set(['me']);
    setFriendsSyncStatus('');
    renderFriends(); renderFeedFilters(); renderHistory();
  }
}

function startFriendSightingListeners(user,session) {
  friendUnsubscribers.forEach(unsubscribe=>unsubscribe());
  friendUnsubscribers=[];
  const currentFriendIds=new Set(friends.map(friend=>friend.uid));
  friendSightings=friendSightings.filter(s=>currentFriendIds.has(s.friendUid));
  friends.forEach(friend => {
    const unsubscribe=cloudDb.collection('users').doc(friend.uid).collection('sightings').onSnapshot(snapshot => {
      if (!isCurrentSocialSession(user,session)) return;
      friendSightings=friendSightings.filter(s=>s.friendUid!==friend.uid);
      snapshot.docs.forEach(doc=>{
        const migrated=migrateSighting({ ...doc.data(), id:doc.id });
        friendSightings.push({ ...migrated.item, friendUid:friend.uid, ownerName:friend.name || friend.email || doc.data().ownerName || 'Friend', photo:null });
      });
      renderHistory(); renderFeedFilters();
      if ($('mapView').classList.contains('active')) renderMap();
    }, error => handleSocialError(user,session,error));
    friendUnsubscribers.push(unsubscribe);
  });
}

async function sendFriendRequest() {
  if (!currentUser) return;
  const email=$('friendEmail').value.trim().toLowerCase();
  if (!email) return;
  if (email === currentUser.email?.toLowerCase()) { showToast('That’s your own account'); return; }
  try {
    const directory=await cloudDb.collection('emailDirectory').doc(await emailHash(email)).get();
    if (!directory.exists) { showToast('They need to sign in to Squirreling first'); return; }
    const recipient=directory.data();
    const id=`${recipient.uid}_${currentUser.uid}`;
    await cloudDb.collection('friendRequests').doc(id).set({ senderUid:currentUser.uid, senderName:currentUser.displayName || currentUser.email, senderEmail:currentUser.email, recipientUid:recipient.uid, recipientName:recipient.name || email, status:'pending', createdAt:Date.now() });
    $('friendEmail').value=''; showToast('Friend request sent');
  } catch { showToast('Couldn’t send that request'); }
}

async function acceptFriendRequest(id) {
  const request=friendRequests.find(item=>item.id===id); if (!request || !currentUser) return;
  try {
    const batch=cloudDb.batch();
    batch.update(cloudDb.collection('friendRequests').doc(id), { status:'accepted', respondedAt:Date.now() });
    batch.set(cloudDb.collection('users').doc(currentUser.uid).collection('friends').doc(request.senderUid), { uid:request.senderUid, name:request.senderName, email:request.senderEmail, createdAt:Date.now() });
    batch.set(cloudDb.collection('users').doc(request.senderUid).collection('friends').doc(currentUser.uid), { uid:currentUser.uid, name:currentUser.displayName || currentUser.email, email:currentUser.email, createdAt:Date.now() });
    await batch.commit(); showToast('Friend added');
  } catch { showToast('Couldn’t approve the request—check Firestore rules'); }
}

async function rejectFriendRequest(id) {
  try { await cloudDb.collection('friendRequests').doc(id).update({ status:'rejected', respondedAt:Date.now() }); }
  catch { showToast('Couldn’t decline the request'); }
}

function renderFriends() {
  if (!$('friendsList')) return;
  $('requestsBlock').classList.toggle('hidden', !friendRequests.length);
  $('friendRequests').innerHTML=friendRequests.map(request=>`<div class="friend-row"><span><strong>${escapeHtml(request.senderName || request.senderEmail)}</strong><br>${escapeHtml(request.senderEmail || '')}</span><button class="secondary-button" data-accept="${escapeHtml(request.id)}">Accept</button><button class="secondary-button" data-reject="${escapeHtml(request.id)}">Decline</button></div>`).join('');
  $('friendsList').innerHTML=friends.length?friends.map(friend=>`<div class="friend-row"><span><strong>${escapeHtml(friend.name || friend.email || 'Friend')}</strong><br>${escapeHtml(friend.email || '')}</span></div>`).join(''):`<small class="helper">${currentUser&&!friendsLoaded?'Loading friends…':'No squirrel friends yet.'}</small>`;
  $('friendRequests').querySelectorAll('[data-accept]').forEach(button=>button.onclick=()=>acceptFriendRequest(button.dataset.accept));
  $('friendRequests').querySelectorAll('[data-reject]').forEach(button=>button.onclick=()=>rejectFriendRequest(button.dataset.reject));
}

function queuedDeletes() {
  try { return JSON.parse(localStorage.getItem(PENDING_DELETES_KEY)) || []; }
  catch { return []; }
}

function queueDelete(uid, id) {
  const queue = queuedDeletes();
  if (!queue.some(item => item.uid === uid && item.id === id)) queue.push({ uid, id });
  localStorage.setItem(PENDING_DELETES_KEY, JSON.stringify(queue));
}

function clearQueuedDelete(uid, id) {
  localStorage.setItem(PENDING_DELETES_KEY, JSON.stringify(queuedDeletes().filter(item => item.uid !== uid || item.id !== id)));
}

async function flushQueuedDeletes(uid) {
  for (const item of queuedDeletes().filter(item => item.uid === uid)) {
    await cloudDb.collection('users').doc(uid).collection('sightings').doc(item.id).delete();
    clearQueuedDelete(uid, item.id);
  }
}

async function uploadLocalSightings() {
  if (!currentUser) return;
  const local = sightings.filter(s => !s.ownerUid);
  if (!local.length) { showToast('No local-only sightings to sync'); return; }
  if (!confirm(`Add ${local.length} local sighting${local.length===1?'':'s'} to your account? Photos will remain only on this device.`)) return;
  renderAccount('Uploading this device’s sightings…');
  for (const item of local) {
    item.ownerUid = currentUser.uid;
    item.updatedAt = Date.now();
    await putSighting(item);
  }
  await syncSettings();
  renderAccount('All account sightings synced.');
  showToast('Device sightings added to account');
}

function showToast(message) {
  const t=$('toast'); t.textContent=message; t.classList.add('show');
  clearTimeout(showToast.timer); showToast.timer=setTimeout(()=>t.classList.remove('show'), 2400);
}
function escapeHtml(value='') { const d=document.createElement('div'); d.textContent=String(value); return d.innerHTML; }

init().catch(() => showToast('Local storage could not be opened'));
