/* ===== Smart Tables — shared data layer (localStorage, syncs across tabs) ===== */
const KEY = 'smt_state_v1';
const TABLES = 12;
const CATS = { coffee: 'قهوة', tea: 'شاي', pastry: 'معجنات', snack: 'وجبات' };
const STATIONS = { grill: 'الشواية', prep: 'التحضير', bar: 'البار', kiosk: 'الكشك' };
const STATUS = { new: 'جديد', preparing: 'قيد التحضير', ready: 'جاهز', served: 'تم التقديم' };
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

function load() {
  try { const s = JSON.parse(localStorage.getItem(KEY)); if (s && s.orders) return s; } catch (e) {}
  return { orders: [], cleaning: [], notes: [], seq: 100 };
}
function save(s) { localStorage.setItem(KEY, JSON.stringify(s)); }
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

function addOrder(table, items, method, takeaway) {
  const s = load();
  s.seq++;
  const total = items.reduce((a, i) => a + i.price * i.qty, 0);
  const o = { id: s.seq, table: table || null, takeaway: !!takeaway || !table, items, total,
    status: 'new', method, paid: method !== 'cash', t: Date.now() };
  s.orders.push(o);
  s.cleaning = s.cleaning.filter(x => x !== table);
  pushNote(s, (o.table ? 'طاولة ' + o.table : 'سفري') + ' — طلب جديد #' + o.id, 'new');
  if (o.paid) pushNote(s, 'تم دفع الطلب #' + o.id, 'pay');
  save(s);
  return o;
}
function advance(id) {
  const s = load();
  const o = s.orders.find(x => x.id == id);
  if (!o) return;
  const next = { new: 'preparing', preparing: 'ready', ready: 'served' }[o.status];
  if (!next) return;
  o.status = next;
  if (next === 'preparing') o.tStart = Date.now();
  if (next === 'ready') { o.tReady = Date.now(); pushNote(s, (o.table ? 'طاولة ' + o.table : 'سفري') + ' — الطلب #' + o.id + ' جاهز', 'ready'); }
  if (next === 'served') {
    o.tDone = Date.now();
    if (o.table && !s.cleaning.includes(o.table)) s.cleaning.push(o.table);
  }
  save(s);
}
function markPaid(id) {
  const s = load(); const o = s.orders.find(x => x.id == id);
  if (o && !o.paid) { o.paid = true; pushNote(s, 'تم دفع الطلب #' + o.id, 'pay'); save(s); }
}
function clearTable(n) { const s = load(); s.cleaning = s.cleaning.filter(x => x !== n); save(s); }
function tableStatus(n, s) {
  const act = s.orders.filter(o => o.table === n && o.status !== 'served');
  if (act.some(o => o.status === 'ready')) return 'ready';
  if (act.some(o => o.status === 'preparing')) return 'preparing';
  if (act.length) return 'occupied';
  return s.cleaning.includes(n) ? 'cleaning' : 'available';
}
function resetAll() { localStorage.removeItem(KEY); }

function seedDemo() {
  const s = { orders: [], cleaning: [], notes: [], seq: 100 };
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
        paid: true, t, tDone: t + 25 * 60e3 });
    }
  });
  const live = [[7, 'preparing', 10], [8, 'preparing', 6], [2, 'ready', 14], [5, 'ready', 9], [12, 'new', 1]];
  live.forEach(([tb, st, min]) => {
    const it = [MENU[8], MENU[9], MENU[1]].slice(0, 2 + (tb % 2)).map(m => ({ id: m.id, name: m.name, price: m.price, qty: 1, st: m.st, cat: m.cat }));
    s.seq++;
    s.orders.push({ id: s.seq, table: tb, takeaway: false, items: it, total: it.reduce((a, i) => a + i.price * i.qty, 0),
      status: st, method: 'card', paid: true, t: now - min * 60e3, tStart: now - (min - 1) * 60e3 });
  });
  s.cleaning = [3];
  pushNote(s, 'تم تحميل بيانات تجريبية', 'new');
  save(s);
}

/* live updates: other tabs via storage event + light polling */
function onChange(cb) {
  window.addEventListener('storage', e => { if (e.key === KEY) cb(); });
  setInterval(cb, 4000);
}
