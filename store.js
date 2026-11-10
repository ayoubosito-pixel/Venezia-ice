/* ===== Smart Tables — shared data layer =====
   Cloud mode: Firebase Realtime Database (all devices stay in sync).
   Fallback:   localStorage only (same browser) if Firebase is unreachable. */
const FB_URL = 'https://venezia-tables-default-rtdb.europe-west1.firebasedatabase.app';
const KEY = 'smt_state_v1';
const STATIONS = { grill: 'الشواية', prep: 'التحضير', bar: 'البار', kiosk: 'الكشك' };
const STATUS = { pending: 'بانتظار النادل', new: 'جديد', preparing: 'قيد التحضير', ready: 'جاهز', served: 'تم التقديم' };
/* option groups a product can offer (admin ticks which ones apply to each product) */
const OPTION_GROUPS = {
  sugar: { name: 'السكر', choices: ['بدون سكر', 'نصف سكرة', 'سكرة', 'سكرتين'], def: 'سكرة' },
  salt: { name: 'الملح', choices: ['بدون ملح', 'ملح عادي', 'زيادة ملح'], def: 'ملح عادي' },
  ice: { name: 'الثلج', choices: ['بدون ثلج', 'ثلج قليل', 'ثلج عادي'], def: 'ثلج عادي' },
  size: { name: 'الحجم', choices: ['صغير', 'وسط', 'كبير'], def: 'وسط' },
};
const TK_ZONE = { id: 'tk', name: 'سفري', tables: [] };
/* default venue; the admin page overwrites it (saved in Firebase node smt_config) */
const DEFAULT_CFG = {
  pin: '1234',
  cats: { coffee: 'قهوة', tea: 'شاي', pastry: 'معجنات', snack: 'وجبات' },
  zones: [
    { id: 'a', name: 'الصالون الرئيسي', tables: [1, 2, 3, 4] },
    { id: 'b', name: 'التراس', tables: [5, 6, 7, 8] },
    { id: 'c', name: 'قسم VIP', tables: [9, 10, 11, 12] },
  ],
  menu: [
    { id: 1, name: 'إسبريسو', price: 3.5, cat: 'coffee', emoji: '☕', st: 'bar', opts: ['sugar'] },
    { id: 2, name: 'لاتيه', price: 4.5, cat: 'coffee', emoji: '🥛', st: 'bar', opts: ['sugar'] },
    { id: 3, name: 'كابتشينو', price: 4, cat: 'coffee', emoji: '☕', st: 'bar', opts: ['sugar'] },
    { id: 4, name: 'شاي مثلج', price: 3.25, cat: 'tea', emoji: '🍹', st: 'bar', opts: ['sugar', 'ice'] },
    { id: 5, name: 'شاي أخضر', price: 2.75, cat: 'tea', emoji: '🍵', st: 'bar', opts: ['sugar'] },
    { id: 6, name: 'كرواسون', price: 3.5, cat: 'pastry', emoji: '🥐', st: 'prep', opts: [] },
    { id: 7, name: 'بيغل', price: 4, cat: 'pastry', emoji: '🥯', st: 'prep', opts: [] },
    { id: 8, name: 'مافن', price: 3.5, cat: 'pastry', emoji: '🧁', st: 'prep', opts: [] },
    { id: 9, name: 'برغر كلاسيك', price: 9, cat: 'snack', emoji: '🍔', st: 'grill', opts: ['salt'] },
    { id: 10, name: 'بطاطس مقلية', price: 3.5, cat: 'snack', emoji: '🍟', st: 'grill', opts: ['salt'] },
    { id: 11, name: 'بيتزا', price: 11, cat: 'snack', emoji: '🍕', st: 'grill', opts: ['salt'] },
    { id: 12, name: 'سلطة سيزر', price: 6.5, cat: 'snack', emoji: '🥗', st: 'prep', opts: ['salt'] },
  ],
};
/* live containers: filled from the config, mutated in place so every page sees updates */
const CATS = {}, CATTR = {}, MENU = [], ZONES = [], BRAND = { name: '', logo: '', color: '#111827' };
function tableList() { return ZONES.reduce((a, z) => a.concat(z.tables), []).sort((x, y) => x - y); }
function zoneObj(n) { return ZONES.find(z => z.tables.includes(n)) || TK_ZONE; }
function zoneOf(n) { return zoneObj(n).name; }
function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
/* one order line with its options + note (HTML-escaped: notes come from customers) */
function itemHtml(i) {
  return esc((i.qty || 1) + '× ' + i.name)
    + (i.opts && i.opts.length ? ' <small style="opacity:.85">(' + esc(i.opts.join('، ')) + ')</small>' : '')
    + (i.note ? ' <small style="color:#ffd27a">📝 ' + esc(i.note) + '</small>' : '');
}

/* ---------- state + sync engine ---------- */
function norm(s) {
  s = s || {};
  s.orders = s.orders || []; s.cleaning = s.cleaning || []; s.notes = s.notes || []; s.events = s.events || [];
  s.seq = s.seq || 100; s.evSeq = s.evSeq || 0; s.chat = s.chat || {};
  return s;
}
const clone = o => JSON.parse(JSON.stringify(o));
const CKEY = 'smt_cfg_v1';
let _cfg = null, _cref = null, _cfgReady = false;
function cfgReady() { return _cfgReady; }
function normCfg(c) {
  if (!c || !c.v) { if (!c || !c.menu) c = clone(DEFAULT_CFG); }
  c.cats = c.cats || {}; c.menu = c.menu || []; c.zones = c.zones || []; c.waiters = c.waiters || []; c.brand = c.brand || {}; c.catTr = c.catTr || {}; c.pin = c.pin || '1234';
  c.zones.forEach(z => { z.tables = z.tables || []; });
  c.menu.forEach(m => { m.opts = m.opts || []; });
  return c;
}
function applyCfg(c) {
  _cfg = c;
  Object.keys(CATS).forEach(k => delete CATS[k]); Object.assign(CATS, c.cats);
  Object.keys(CATTR).forEach(k => delete CATTR[k]); Object.assign(CATTR, c.catTr || {});
  MENU.length = 0; c.menu.forEach(m => MENU.push(m));
  ZONES.length = 0; c.zones.forEach(z => ZONES.push(z)); ZONES.push(TK_ZONE);
  BRAND.name = (c.brand && c.brand.name) || ''; BRAND.logo = (c.brand && c.brand.logo) || '';
  BRAND.color = (c.brand && /^#[0-9a-f]{6}$/i.test(c.brand.color)) ? c.brand.color : '#111827';
}
applyCfg(normCfg((() => { try { return JSON.parse(localStorage.getItem(CKEY)); } catch (e) { return null; } })()));
/* waiter / admin passwords are stored only as SHA-256 hashes (salted with the account id) */
async function hashPw(id, pw) {
  const s = 'smt|' + id + '|' + pw;
  try {
    const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
    return Array.from(new Uint8Array(b)).map(x => x.toString(16).padStart(2, '0')).join('');
  } catch (e) { let h = 0; for (const ch of s) h = (h * 31 + ch.charCodeAt(0)) | 0; return 'x' + h; }
}
function cfgPin() { return (_cfg && _cfg.pin) || '1234'; }
/* cfgMutate(fn): fn(config) edits it, returns a result or false to cancel. Saved to Firebase as a transaction. */
function cfgMutate(fn, done, fail) {
  if (_cref) {
    let res;
    _cref.transaction(cur => {
      const c = normCfg(cur ? clone(cur) : null);
      res = fn(c);
      if (res === false) return;
      c.v = 1; return clone(c);
    }, (err, ok) => { if (err || !ok) { if (fail) fail(err); } else if (done) done(res); });
  } else {
    const c = normCfg(clone(_cfg));
    const res = fn(c);
    if (res === false) { if (fail) fail(); return; }
    c.v = 1; applyCfg(c);
    try { localStorage.setItem(CKEY, JSON.stringify(c)); } catch (e) {}
    notify();
    if (done) done(res);
  }
}
let _state = norm((() => { try { return JSON.parse(localStorage.getItem(KEY)); } catch (e) { return null; } })());
let _ref = null, _synced = false, _listeners = [];
function load() { return _state; }
function cloudOn() { return !!_ref; }
function synced() { return _synced; }
/* venue identity: any element with data-brand-name / data-brand-logo is filled from the config */
function applyBrand() {
  if (typeof document === 'undefined') return;
  document.querySelectorAll('[data-brand-name]').forEach(e => { e.textContent = BRAND.name || 'طاولات سمارت'; });
  document.querySelectorAll('[data-brand-logo]').forEach(e => { if (BRAND.logo) { if (e.getAttribute('src') !== BRAND.logo) e.src = BRAND.logo; e.hidden = false; } else e.hidden = true; });
  if (!document.__t0) document.__t0 = document.title;
  document.title = BRAND.name ? BRAND.name + ' — ' + document.__t0 : document.__t0;
}
if (typeof document !== 'undefined') document.addEventListener('DOMContentLoaded', () => applyBrand());
function brandCardHtml() {
  return '<div style="display:flex;justify-content:center;align-items:center;gap:6px;margin-bottom:6px">' + (BRAND.logo ? '<img src="' + BRAND.logo + '" style="width:28px;height:28px;border-radius:7px;object-fit:cover">' : '') + '<b style="font-size:13px">' + esc(BRAND.name || 'طاولات سمارت') + '</b></div>';
}
/* printable table card: brand-coloured header, framed QR, big table number, 3 steps */
function brandInk(hex) { const n = parseInt(String(hex).slice(1), 16) || 0, r = n >> 16, g = (n >> 8) & 255, b = n & 255; return (0.299 * r + 0.587 * g + 0.114 * b) > 150 ? '#111827' : '#ffffff'; }
function qrCardHtml(o) {
  const B = o.brand || BRAND, col = /^#[0-9a-f]{6}$/i.test(B.color) ? B.color : '#111827';
  let svg = ''; try { svg = window.smtQR(o.url, { level: 'M', color: '#111' }); } catch (e) { svg = '<div class="qerr">' + esc(o.url) + '</div>'; }
  return '<div class="qcard" style="--bc:' + col + ';--bi:' + brandInk(col) + '">' +
    '<div class="qhead"><div class="qlogo">' + (B.logo ? '<img src="' + B.logo + '" alt="">' : '☕') + '</div><b>' + esc(B.name || 'طاولات سمارت') + '</b></div>' +
    '<div class="qbody"><div class="qgo">امسح واطلب من هاتفك</div><div class="qframe">' + svg + '</div>' +
    '<div class="qnum">' + (o.label ? '<small>' + esc(o.label) + '</small>' : '') + '<span>' + esc(o.num) + '</span></div>' +
    '<div class="qzone">' + esc(o.zone || '') + '</div></div>' +
    '<div class="qsteps"><span><i>1</i>امسح الكود</span><span><i>2</i>اختر طلبك</span><span><i>3</i>يصلك النادل</span></div></div>';
}
function notify() { try { applyBrand(); } catch (e) {} _listeners.slice().forEach(cb => { try { cb(); } catch (e) { console.error(e); } }); }
function cache() { try { localStorage.setItem(KEY, JSON.stringify(_state)); } catch (e) {} }

(function init() {
  try {
    if (typeof firebase !== 'undefined') {
      firebase.initializeApp({ databaseURL: FB_URL });
      _ref = firebase.database().ref('smt_state');
      _cref = firebase.database().ref('smt_config');
      _cref.on('value', snap => { _cfgReady = true; applyCfg(normCfg(snap.val())); try { localStorage.setItem(CKEY, JSON.stringify(_cfg)); } catch (e) {} notify(); });
      _ref.on('value', snap => { _state = norm(snap.val()); _synced = true; cache(); notify(); },
        err => { console.warn('Firebase unavailable, using local mode:', err && err.message); _ref = null; _cref = null; _synced = true; _cfgReady = true; notify(); });
      return;
    }
  } catch (e) { console.warn('Firebase init failed:', e); _ref = null; }
  _synced = true; _cfgReady = true;
  if (typeof window !== 'undefined') window.addEventListener('storage', e => {
    if (e.key === KEY) { try { _state = norm(JSON.parse(e.newValue)); } catch (x) {} notify(); }
    if (e.key === CKEY) { try { applyCfg(normCfg(JSON.parse(e.newValue))); } catch (x) {} notify(); }
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

/* demo/reset buttons are hidden unless the page URL has ?demo=1 */
try { if (!/[?&]demo=1/.test(location.search)) { const st = document.createElement('style'); st.textContent = '.demo-only{display:none!important}'; document.head.appendChild(st); } } catch (e) {}

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
function addOrder(table, items, done, note) {
  mutate(s => {
    s.seq++;
    const total = items.reduce((a, i) => a + i.price * i.qty, 0);
    const o = { id: s.seq, table: table || null, takeaway: !table, items, total,
      status: 'pending', method: null, paid: false, waiter: null, t: Date.now(), note: String(note || '').slice(0, 200) };
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
    if (o.table && !unpaidAt(s, o.table).length) delete s.chat[chatKey(o.table)];
    return true;
  });
}
function chatKey(t) { return t || 'tk'; }
function unpaidAt(s, t) { return s.orders.filter(o => o.table === (t || null) && !o.paid); }
function tableWaiter(s, t) {
  const a = s.orders.filter(o => o.table === (t || null) && !(o.paid && o.status === 'served') && o.waiter).sort((x, y) => y.t - x.t)[0];
  return a ? a.waiter : null;
}
/* open channel between a table's customer and its waiter, lives until the table is paid */
function sendChat(table, from, name, text, kind, done) {
  mutate(s => {
    const k = chatKey(table);
    text = String(text || '').slice(0, 300);
    s.chat[k] = (s.chat[k] || []).concat([{ t: Date.now(), from, name, text, kind: kind || 'msg' }]).slice(-40);
    const z = zoneObj(table || null);
    s.events.push({ id: ++s.evSeq, t: Date.now(), type: 'chat', from, name, text, kind: kind || 'msg', table: table || null, zone: z.name, zoneId: z.id, waiter: from === 'c' ? tableWaiter(s, table) : name, order: null });
    s.events = s.events.slice(-60);
    return true;
  }, () => done && done(true), () => done && done(false));
}
function requestPayTable(table, method) {
  mutate(s => {
    const os = unpaidAt(s, table).filter(o => o.status !== 'pending');
    if (!os.length) return false;
    os.forEach(o => { o.payReq = method; o.payReqAt = Date.now(); });
    const total = os.reduce((a, o) => a + o.total, 0);
    pushNote(s, where(os[0]) + ' — يطلب الدفع ' + (method === 'cash' ? 'كاش' : 'بالبطاقة'), 'pay');
    pushEvent(s, 'pay_request', os[0], { method, orders: os.map(o => o.id), total });
    return true;
  });
}
function markPaidTable(table, method) {
  mutate(s => {
    const os = unpaidAt(s, table);
    if (!os.length) return false;
    os.forEach(o => { o.paid = true; o.method = method || o.payReq || o.method || 'cash'; o.payReq = null; o.tPaid = Date.now(); maybeClean(s, o); });
    pushNote(s, 'تم دفع ' + (table ? 'طاولة ' + table : 'الطلب'), 'pay');
    if (table) delete s.chat[chatKey(table)]; // conversation ends with payment
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
      s.orders.push({ id: s.seq, table: (tableList()[Math.floor(Math.random() * tableList().length)] || 1), takeaway: false, items,
        total: items.reduce((a, i) => a + i.price * i.qty, 0), status: 'served', method: Math.random() > .4 ? 'card' : 'cash',
        paid: true, waiter: Math.random() > .5 ? 'أحمد' : 'ليلى', t, tDone: t + 25 * 60e3 });
    }
  });
  const live = [[7, 'preparing', 10], [8, 'preparing', 6], [2, 'ready', 14], [5, 'ready', 9], [12, 'new', 1]];
  live.forEach(([tb, st, min]) => {
    const it = [MENU[8], MENU[9], MENU[1]].filter(Boolean).slice(0, 2 + (tb % 2)).map(m => ({ id: m.id, name: m.name, price: m.price, qty: 1, st: m.st, cat: m.cat }));
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
let _ac, _audioOk = false, _spoke = false;
function audioReady() { return _audioOk; }
function unlockAudio() {
  try {
    _ac = _ac || new (window.AudioContext || window.webkitAudioContext)();
    if (_ac.state === 'suspended') _ac.resume();
    const b = _ac.createBuffer(1, 1, 22050), src = _ac.createBufferSource(); // silent tick unlocks iOS
    src.buffer = b; src.connect(_ac.destination); src.start(0);
    _audioOk = true;
  } catch (e) {}
  try {
    if (window.speechSynthesis && !_spoke) { _spoke = true; const u = new SpeechSynthesisUtterance(' '); u.volume = 0; speechSynthesis.speak(u); }
  } catch (e) {}
}
/* any first touch on the page unlocks sound, so alerts work after a reload too */
if (typeof document !== 'undefined') ['pointerdown', 'touchstart', 'click', 'keydown'].forEach(ev =>
  document.addEventListener(ev, () => { if (!_audioOk) unlockAudio(); }, { passive: true }));
function voiceOk() { try { return !!window.speechSynthesis && speechSynthesis.getVoices().some(v => v.lang && v.lang.toLowerCase().startsWith('ar')); } catch (e) { return false; } }
function beep(n) {
  try {
    if (!_ac) unlockAudio();
    if (_ac.state === 'suspended') _ac.resume();
    for (let i = 0; i < (n || 2); i++) {
      const o = _ac.createOscillator(), g = _ac.createGain(), t0 = _ac.currentTime + i * 0.32;
      o.type = 'sine'; o.frequency.value = i % 2 ? 1046 : 880;
      o.connect(g); g.connect(_ac.destination);
      g.gain.setValueAtTime(0.3, t0); g.gain.exponentialRampToValueAtTime(0.001, t0 + 0.28);
      o.start(t0); o.stop(t0 + 0.3);
    }
  } catch (e) {}
}
function say(text, lang) {
  try {
    if (!window.speechSynthesis) return;
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang || 'ar-SA'; u.rate = 0.95; u.volume = 1;
    speechSynthesis.cancel();
    const pf = (lang || 'ar-SA').slice(0, 2), v = speechSynthesis.getVoices().find(x => x.lang && x.lang.toLowerCase().startsWith(pf));
    if (v) u.voice = v;
    speechSynthesis.speak(u);
  } catch (e) {}
}
function alertUser(text, lang) {
  beep(2);
  setTimeout(() => say(text, lang), 750);
  try { navigator.vibrate && navigator.vibrate([250, 120, 250]); } catch (e) {}
}
