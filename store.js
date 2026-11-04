/* ===== Smart Tables — shared data layer =====
   Cloud mode: Firebase Realtime Database (all devices stay in sync).
   Fallback:   localStorage only (same browser) if Firebase is unreachable. */
const FB_URL = 'https://venezia-tables-default-rtdb.europe-west1.firebasedatabase.app';
const KEY = 'smt_state_v1';
const TABLES = 12;
const CATS = { coffee: 'قهوة', tea: 'شاي', pastry: 'معجنات', snack: 'وجبات' };
const STATIONS = { grill: 'الشواية', prep: 'التحضير', bar: 'البار', kiosk: 'الكشك' };
const STATUS = { pending: 'بانتظار النادل', new: 'جديد', preparing: 'قيد التحضير', ready: 'جاهز', served: 'تم التقديم' };
const ZONES = [
  { id: 'a', name: 'الصالون الرئيسي', tables: [1, 2, 3, 4] },
  { id: 'b', name: 'التراس', tables: [5, 6, 7, 8] },
  { id: 'c', name: 'قسم VIP', tables: [9, 10, 11, 12] },
  { id: 'tk', name: 'سفري', tables: [] },
];
function zoneObj(n) { return ZONES.find(z => z.tables.includes(n)) || ZONES[3]; }
function zoneOf(n) { return zoneObj(n).name; }
const MENU = [
  { id: 1, name: 'إسبريسو', price: 3.5, cat: 'coffee', emoji: '☕', st: 'bar' },
  { id: 2, name: 'لاتيه', price: 4.5, cat: 'coffee', emoji: '🥛', st: 'bar' },
  { id: 3, name: 'كابتشينو', price: 4, cat: 'coffee', emoji: '☕', st: 'bar' },
  { id: 4, name: 'شاي مثلج', price: 3.25, cat: 'tea', emoji: '🍹', st: 'bar' },
  { id: 5, name: 'شاي أخضر', price: 2.75, cat: 'tea', emoji: '🍵', st: 'bar' },
  { id: 6, name: 'كرواسون', price: 3.5, cat: 'pastry', emoji: '🥐', st: 'prep' },
  { id: 7, name: 'بيغل', price: 4, cat: 'pastry', emoji: '🥯', st: 'prep' },
  { id: 8, name: 'مافن', price: 3.5, cat: 'pastry', emoji: '🧁', st: 'prep' },
  { id: 9, name: 'برغر كلاسيك', price: 9, cat: 'snack', emoji: '🍔', st: 'grill' },
  { id: 10, name: 'بطاطس مقلية', price: 3.5, cat: 'snack', emoji: '🍟', st: 'grill' },
  { id: 11, name: 'بيتزا', price: 11, cat: 'snack', emoji: '🍕', st: 'grill' },
  { id: 12, name: 'سلطة سيزر', price: 6.5, cat: 'snack', emoji: '🥗', st: 'prep' },
];

/* ---------- state + sync engine ---------- */
function norm(s) {
  s = s || {};
  s.orders = s.orders || []; s.cleaning = s.cleaning || []; s.notes = s.notes || []; s.events = s.events || [];
  s.seq = s.seq || 100; s.evSeq = s.evSeq || 0;
  return s;
}
const clone = o => JSON.parse(JSON.stringify(o));
let _state = norm((() => { try { return JSON.parse(localStorage.getItem(KEY)); } catch (e) { return null; } })());
let _ref = null, _synced = false, _listeners = [];
function load() { return _state; }
function cloudOn() { return !!_ref; }
function synced() { return _synced; }
function notify() { _listeners.slice().forEach(cb => { try { cb(); } catch (e) { console.error(e); } }); }
function cache() { try { localStorage.setItem(KEY, JSON.stringify(_state)); } catch (e) {} }

(function init() {
  try {
    if (typeof firebase !== 'undefined') {
      firebase.initializeApp({ databaseURL: FB_URL });
      _ref = firebase.database().ref('smt_state');
      _ref.on('value', snap => { _state = norm(snap.val()); _synced = true; cache(); notify(); },
        err => { console.warn('Firebase unavailable, using local mode:', err && err.message); _ref = null; _synced = true; notify(); });
      return;
    }
  } catch (e) { console.warn('Firebase init failed:', e); _ref = null; }
  _synced = true;
  if (typeof window !== 'undefined') window.addEventListener('storage', e => {
    if (e.key === KEY) { try { _state = norm(JSON.parse(e.newValue)); } catch (x) {} notify(); }
  });
})();

/* mutate(fn): fn(state) edits the state and returns a result, or false to cancel. Runs as a cloud transaction. */
function mutate(fn, done, fail) {
  if (_ref) {
    let res;
    _ref.transaction(cur => {
      const s = norm(cur);
      res = fn(s);
      if (res === false) return; // abort
      return clone(s);
    }, (err, committed) => {
      if (err || !committed) { if (fail) fail(err); } else if (done) done(res);
    });
  } else {
    const s = norm(clone(_state));
    const res = fn(s);
    if (res === false) { if (fail) fail(); return; }
    _state = s; cache(); notify();
    if (done) done(res);
  }
}
function replaceState(s) {
  s = norm(clone(s));
  if (_ref) _ref.set(s); else { _state = s; cache(); notify(); }
}

/* ---------- helpers ---------- */
function money(n) { return '$' + Number(n).toFixed(2); }
function mmss(ms) {
  const t = Math.max(0, Math.floor(ms / 1000));
  return String(Math.floor(t / 60)).padStart(2, '0') + ':' + String(t % 60).padStart(2, '0');
}
function ago(t) {
  const m = Math.floor((Date.now() - t) / 60000);
  return m < 1 ? 'الآن' : 'منذ ' + m + ' د';
}
function pushNote(s, text, kind) { s.notes.unshift({ t: Date.now(), text, kind }); s.notes = s.notes.slice(0, 30); }
function pushEvent(s, type, o, extra) {
  const z = zoneObj(o.table);
  s.events.push(Object.assign({ id: ++s.evSeq, t: Date.now(), type, order: o.id, table: o.table || null, zone: z.name, zoneId: z.id, waiter: o.waiter || null }, extra || {}));
  s.events = s.events.slice(-60);
}
function where(o) { return o.table ? 'طاولة ' + o.table : 'سفري'; }
function maybeClean(s, o) {
  if (o.table && o.paid && o.status === 'served' && !s.cleaning.includes(o.table)) s.cleaning.push(o.table);
}

/* ---------- order lifecycle: pending -> (waiter accepts) new -> preparing -> ready -> served -> paid ---------- */
function addOrder(table, items, done) {
  mutate(s => {
    s.seq++;
    const total = items.reduce((a, i) => a + i.price * i.qty, 0);
    const o = { id: s.seq, table: table || null, takeaway: !table, items, total,
      status: 'pending', method: null, paid: false, waiter: null, t: Date.now() };
    s.orders.push(o);
    s.orders = s.orders.filter(x => Date.now() - x.t < 3 * 86400e3); // keep 3 days
    s.cleaning = s.cleaning.filter(x => x !== o.table);
    pushNote(s, where(o) + ' — طلب جديد بانتظار نادل #' + o.id, 'new');
    pushEvent(s, 'new_order', o);
    return o;
  }, o => done && done(o), () => done && done(null));
}
function acceptOrder(id, waiter, done) {
  mutate(s => {
    const o = s.orders.find(x => x.id == id);
    if (!o || o.status !== 'pending') return false; // someone else took it first
    o.status = 'new'; o.waiter = waiter; o.tAcc = Date.now();
    pushNote(s, where(o) + ' — النادل ' + waiter + ' استلم الطلب #' + o.id, 'new');
    pushEvent(s, 'accepted', o);
    return true;
  }, () => done && done(true), () => done && done(false));
}
function advance(id) {
  mutate(s => {
    const o = s.orders.find(x => x.id == id);
    if (!o) return false;
    const next = { new: 'preparing', preparing: 'ready', ready: 'served' }[o.status];
    if (!next) return false;
    o.status = next;
    if (next === 'preparing') o.tStart = Date.now();
    if (next === 'ready') {
      o.tReady = Date.now();
      pushNote(s, where(o) + ' — الطلب #' + o.id + ' جاهز (' + (o.waiter || '') + ')', 'ready');
      pushEvent(s, 'order_ready', o);
    }
    if (next === 'served') { o.tDone = Date.now(); maybeClean(s, o); }
    return true;
  });
}
function requestPay(id, method) {
  mutate(s => {
    const o = s.orders.find(x => x.id == id);
    if (!o || o.paid) return false;
    o.payReq = method; o.payReqAt = Date.now();
    pushNote(s, where(o) + ' — يطلب الدفع ' + (method === 'cash' ? 'كاش' : 'بالبطاقة'), 'pay');
    pushEvent(s, 'pay_request', o, { method });
    return true;
  });
}
function markPaid(id, method) {
  mutate(s => {
    const o = s.orders.find(x => x.id == id);
    if (!o || o.paid) return false;
    o.paid = true; o.method = method || o.payReq || o.method || 'cash'; o.payReq = null; o.tPaid = Date.now();
    pushNote(s, 'تم دفع الطلب #' + o.id, 'pay');
    maybeClean(s, o);
    return true;
  });
}
function clearTable(n) { mutate(s => { s.cleaning = s.cleaning.filter(x => x !== n); return true; }); }
function tableStatus(n, s) {
  const act = s.orders.filter(o => o.table === n && (o.status !== 'served' || !o.paid));
  if (act.some(o => o.status === 'ready')) return 'ready';
  if (act.some(o => o.status === 'preparing')) return 'preparing';
  if (act.length) return 'occupied';
  return s.cleaning.includes(n) ? 'cleaning' : 'available';
}
function resetAll() { replaceState({ orders: [], cleaning: [], notes: [], seq: 100, events: [], evSeq: 0 }); }

function seedDemo() {
  const s = { orders: [], cleaning: [], notes: [], seq: 100, events: [], evSeq: 0 };
  const d = new Date(); d.setHours(0, 0, 0, 0);
  const now = Date.now();
  const weights = [2,4,6,7,6,5,5,7,9,8,6,4,3]; // hours 8..20
  weights.forEach((w, i) => {
    const hour = 8 + i;
    for (let k = 0; k < w; k++) {
      const t = d.getTime() + hour * 3600e3 + Math.random() * 3300e3;
      if (t > now - 20 * 60e3) continue;
      const n = 1 + Math.floor(Math.random() * 4);
      const items = [];
      for (let j = 0; j < n; j++) {
        const m = MENU[Math.floor(Math.random() * MENU.length)];
        const ex = items.find(x => x.id === m.id);
        if (ex) ex.qty++; else items.push({ id: m.id, name: m.name, price: m.price, qty: 1 + (Math.random() > .7 ? 1 : 0), st: m.st, cat: m.cat });
      }
      s.seq++;
      s.orders.push({ id: s.seq, table: 1 + Math.floor(Math.random() * TABLES), takeaway: false, items,
        total: items.reduce((a, i) => a + i.price * i.qty, 0), status: 'served', method: Math.random() > .4 ? 'card' : 'cash',
        paid: true, waiter: Math.random() > .5 ? 'أحمد' : 'ليلى', t, tDone: t + 25 * 60e3 });
    }
  });
  const live = [[7, 'preparing', 10], [8, 'preparing', 6], [2, 'ready', 14], [5, 'ready', 9], [12, 'new', 1]];
  live.forEach(([tb, st, min]) => {
    const it = [MENU[8], MENU[9], MENU[1]].slice(0, 2 + (tb % 2)).map(m => ({ id: m.id, name: m.name, price: m.price, qty: 1, st: m.st, cat: m.cat }));
    s.seq++;
    s.orders.push({ id: s.seq, table: tb, takeaway: false, items: it, total: it.reduce((a, i) => a + i.price * i.qty, 0),
      status: st, method: null, paid: false, waiter: tb % 2 ? 'ليلى' : 'أحمد', t: now - min * 60e3, tStart: now - (min - 1) * 60e3 });
  });
  s.cleaning = [3];
  pushNote(s, 'تم تحميل بيانات تجريبية', 'new');
  replaceState(s);
}

/* ---------- live updates ---------- */
function onChange(cb, ms) {
  _listeners.push(cb);
  setInterval(cb, ms || 4000); // keeps timers/"minutes ago" fresh
}
/* handler(event, state) fires once for every NEW event (history is skipped after first sync) */
function watchEvents(handler) {
  let last = _synced ? load().events.reduce((m, e) => Math.max(m, e.id), 0) : null;
  _listeners.push(() => {
    if (!_synced) return;
    const s = load();
    const mx = s.events.reduce((m, e) => Math.max(m, e.id), 0);
    if (last === null) { last = mx; return; }
    s.events.filter(e => e.id > last).forEach(e => { last = Math.max(last, e.id); handler(e, s); });
  });
}

/* ---------- sound + voice alerts (a browser needs one tap first: call unlockAudio from a button) ---------- */
let _ac;
function unlockAudio() {
  try { _ac = _ac || new (window.AudioContext || window.webkitAudioContext)(); if (_ac.state === 'suspended') _ac.resume(); } catch (e) {}
  try { if (window.speechSynthesis) speechSynthesis.getVoices(); } catch (e) {}
}
function beep(n) {
  try {
    unlockAudio();
    for (let i = 0; i < (n || 2); i++) {
      const o = _ac.createOscillator(), g = _ac.createGain(), t0 = _ac.currentTime + i * 0.32;
      o.type = 'sine'; o.frequency.value = i % 2 ? 1046 : 880;
      o.connect(g); g.connect(_ac.destination);
      g.gain.setValueAtTime(0.3, t0); g.gain.exponentialRampToValueAtTime(0.001, t0 + 0.28);
      o.start(t0); o.stop(t0 + 0.3);
    }
  } catch (e) {}
}
function say(text) {
  try {
    if (!window.speechSynthesis) return;
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'ar-SA'; u.rate = 0.95;
    const v = speechSynthesis.getVoices().find(x => x.lang && x.lang.startsWith('ar'));
    if (v) u.voice = v;
    speechSynthesis.speak(u);
  } catch (e) {}
}
function alertUser(text) {
  beep(2);
  setTimeout(() => say(text), 750);
  try { navigator.vibrate && navigator.vibrate([250, 120, 250]); } catch (e) {}
}
