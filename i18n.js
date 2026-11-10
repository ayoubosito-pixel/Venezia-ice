/* ===== Customer-page languages: Arabic, English, Spanish, French =====
   Staff pages (waiter / kitchen / dashboard / admin) stay in Arabic, so everything that is stored
   in orders keeps its canonical Arabic text; this file only changes what the customer SEES. */
const LANGS = {
  ar: { name: 'العربية', flag: '🇸🇦', dir: 'rtl', voice: 'ar-SA' },
  en: { name: 'English', flag: '🇬🇧', dir: 'ltr', voice: 'en-US' },
  es: { name: 'Español', flag: '🇪🇸', dir: 'ltr', voice: 'es-ES' },
  fr: { name: 'Français', flag: '🇫🇷', dir: 'ltr', voice: 'fr-FR' },
};
const I18N = {
  ar: {
    welcome: 'مرحبًا بكم في {0}', welcome_sub: 'يسعدنا خدمتكم. اطلبوا من هاتفكم وسيصلكم النادل إلى الطاولة.', start: 'ابدأ الطلب', change_lang: 'تغيير اللغة',
    table: 'طاولة {0}', takeaway: 'طلب سفري', online: '● متصل', local: '● وضع محلي', search: '🔍 ابحث عن منتج...', all: 'الكل', none: 'لا توجد نتائج',
    n_menu: 'القائمة', n_cart: 'السلة', n_orders: 'طلبي', n_waiter: 'النادل',
    cart_title: 'مراجعة السلة', n_items: '{0} عناصر', cart_empty: 'السلة فارغة', remove: 'حذف', line_note: '📝 ملاحظة على هذا الصنف...',
    order_note: '📝 ملاحظة على الطلب كاملًا (اختياري)', order_note_ph: 'مثال: أريد كل شيء معًا، حساسية من المكسرات...',
    subtotal: 'المجموع الفرعي', fee: 'رسوم الخدمة', total: 'الإجمالي', pay_note: '💡 الدفع يتم بعد انتهائك عبر النادل: كاش أو بجهاز البطاقة.', send: 'إرسال الطلب للنادل ✓',
    sheet_note: 'ملاحظة خاصة بهذا الصنف (اختياري)', sheet_ph: 'مثال: ساخن جدًا، بدون حليب...', add: 'أضف للسلة',
    t_empty: 'السلة فارغة', t_sending: 'جاري الإرسال...', t_fail: 'تعذر الإرسال، تحقق من الاتصال بالإنترنت', t_cash: 'تم إبلاغ النادل — جهّز المبلغ', t_card: 'تم إبلاغ النادل — سيحضر جهاز الدفع', t_called: 'تم إبلاغ النادل 🙋', t_sendfail: 'تعذر الإرسال',
    loading: '⏳ جاري التحميل...', my_orders: 'طلبي', thanks: '✅ تم الدفع، شكرًا لزيارتكم', no_order: 'لا يوجد طلب نشط', new_order: 'طلب جديد',
    invoice: 'فاتورة #{0}', paid: 'مدفوع ✓',
    st0: 'تم إرسال الطلب — بانتظار النادل', st1: 'النادل {0} استلم طلبك', st2: 'قيد التحضير 👨‍🍳', st3: 'طلبك جاهز — النادل {0} قادم إليك 🎉', st4: 'تم التقديم — بالهنا!',
    my_table: 'طاولتي {0}', my_takeaway: 'طاولتي (سفري)', with_waiter: ' · النادل {0}', audio_hint: '🔔 المس هنا لتفعيل التنبيهات الصوتية',
    more: '➕ اطلب المزيد', call: '🙋 نادِ النادل', ask_bill: 'انتهيت؟ اطلب الحساب ({0})', cash: '💵 كاش', card: '💳 بطاقة',
    pay_wait_cash: '⏳ تم إبلاغ النادل {0} — جهّز {1} نقدًا', pay_wait_card: '⏳ تم إبلاغ النادل {0} — سيحضر جهاز الدفع بالبطاقة',
    chat_title: '💬 التواصل مع النادل', chat_empty: 'اكتب رسالة أو اضغط أحد الأزرار', q_water: '💧 ماء', q_tools: '🧂 أدوات', q_note: '⚠️ ملاحظة', chat_ph: 'اكتب رسالتك...', chat_send: 'إرسال',
    ev_accepted: 'النادل {0} استلم طلبك ✅', ev_accepted_say: 'النادل {0} استلم طلبك رقم {1}', ev_ready: '🎉 طلبك جاهز — النادل {0} قادم إليك', ev_ready_say: 'طلبك رقم {0} جاهز، والنادل {1} قادم إليك', ev_chat_say: 'رسالة من النادل {0}: {1}',
  },
  en: {
    welcome: 'Welcome to {0}', welcome_sub: 'We are happy to serve you. Order from your phone and your waiter will bring it to your table.', start: 'Start ordering', change_lang: 'Change language',
    table: 'Table {0}', takeaway: 'Takeaway', online: '● Online', local: '● Local mode', search: '🔍 Search the menu...', all: 'All', none: 'No results',
    n_menu: 'Menu', n_cart: 'Cart', n_orders: 'My order', n_waiter: 'Waiter',
    cart_title: 'Your cart', n_items: '{0} items', cart_empty: 'Your cart is empty', remove: 'Remove', line_note: '📝 Note for this item...',
    order_note: '📝 Note for the whole order (optional)', order_note_ph: 'e.g. bring everything together, nut allergy...',
    subtotal: 'Subtotal', fee: 'Service fee', total: 'Total', pay_note: '💡 You pay at the end through your waiter: cash or card machine.', send: 'Send order to the waiter ✓',
    sheet_note: 'Note for this item (optional)', sheet_ph: 'e.g. very hot, no milk...', add: 'Add to cart',
    t_empty: 'Your cart is empty', t_sending: 'Sending...', t_fail: 'Could not send, check your internet connection', t_cash: 'Waiter notified — please prepare the cash', t_card: 'Waiter notified — they will bring the card machine', t_called: 'Waiter notified 🙋', t_sendfail: 'Could not send',
    loading: '⏳ Loading...', my_orders: 'My order', thanks: '✅ Paid, thank you for visiting us', no_order: 'No active order', new_order: 'New order',
    invoice: 'Invoice #{0}', paid: 'Paid ✓',
    st0: 'Order sent — waiting for the waiter', st1: 'Waiter {0} received your order', st2: 'Being prepared 👨‍🍳', st3: 'Your order is ready — waiter {0} is on the way 🎉', st4: 'Served — enjoy!',
    my_table: 'My table {0}', my_takeaway: 'My order (takeaway)', with_waiter: ' · Waiter {0}', audio_hint: '🔔 Tap here to enable sound alerts',
    more: '➕ Order more', call: '🙋 Call the waiter', ask_bill: 'Finished? Ask for the bill ({0})', cash: '💵 Cash', card: '💳 Card',
    pay_wait_cash: '⏳ Waiter {0} was notified — please prepare {1} in cash', pay_wait_card: '⏳ Waiter {0} was notified — they will bring the card machine',
    chat_title: '💬 Chat with the waiter', chat_empty: 'Type a message or tap a button', q_water: '💧 Water', q_tools: '🧂 Cutlery', q_note: '⚠️ Remark', chat_ph: 'Type your message...', chat_send: 'Send',
    ev_accepted: 'Waiter {0} received your order ✅', ev_accepted_say: 'Waiter {0} received your order number {1}', ev_ready: '🎉 Your order is ready — waiter {0} is coming', ev_ready_say: 'Your order number {0} is ready, and waiter {1} is coming to you', ev_chat_say: 'Message from waiter {0}: {1}',
  },
  es: {
    welcome: 'Bienvenidos a {0}', welcome_sub: 'Es un placer atenderte. Pide desde tu móvil y el camarero te lo llevará a la mesa.', start: 'Empezar a pedir', change_lang: 'Cambiar idioma',
    table: 'Mesa {0}', takeaway: 'Para llevar', online: '● En línea', local: '● Modo local', search: '🔍 Buscar en la carta...', all: 'Todo', none: 'Sin resultados',
    n_menu: 'Carta', n_cart: 'Cesta', n_orders: 'Mi pedido', n_waiter: 'Camarero',
    cart_title: 'Tu cesta', n_items: '{0} artículos', cart_empty: 'La cesta está vacía', remove: 'Quitar', line_note: '📝 Nota para este producto...',
    order_note: '📝 Nota para todo el pedido (opcional)', order_note_ph: 'Ej.: todo junto, alergia a los frutos secos...',
    subtotal: 'Subtotal', fee: 'Cargo por servicio', total: 'Total', pay_note: '💡 El pago se hace al final con el camarero: efectivo o datáfono.', send: 'Enviar pedido al camarero ✓',
    sheet_note: 'Nota para este producto (opcional)', sheet_ph: 'Ej.: muy caliente, sin leche...', add: 'Añadir a la cesta',
    t_empty: 'La cesta está vacía', t_sending: 'Enviando...', t_fail: 'No se pudo enviar, revisa tu conexión a internet', t_cash: 'Camarero avisado — prepara el efectivo', t_card: 'Camarero avisado — traerá el datáfono', t_called: 'Camarero avisado 🙋', t_sendfail: 'No se pudo enviar',
    loading: '⏳ Cargando...', my_orders: 'Mi pedido', thanks: '✅ Pagado, gracias por su visita', no_order: 'No hay pedido activo', new_order: 'Nuevo pedido',
    invoice: 'Factura n.º {0}', paid: 'Pagado ✓',
    st0: 'Pedido enviado — esperando al camarero', st1: 'El camarero {0} ha recibido tu pedido', st2: 'En preparación 👨‍🍳', st3: 'Tu pedido está listo — el camarero {0} va hacia ti 🎉', st4: 'Servido — ¡buen provecho!',
    my_table: 'Mi mesa {0}', my_takeaway: 'Mi pedido (para llevar)', with_waiter: ' · Camarero {0}', audio_hint: '🔔 Toca aquí para activar los avisos sonoros',
    more: '➕ Pedir más', call: '🙋 Llamar al camarero', ask_bill: '¿Has terminado? Pide la cuenta ({0})', cash: '💵 Efectivo', card: '💳 Tarjeta',
    pay_wait_cash: '⏳ Camarero {0} avisado — prepara {1} en efectivo', pay_wait_card: '⏳ Camarero {0} avisado — traerá el datáfono',
    chat_title: '💬 Chat con el camarero', chat_empty: 'Escribe un mensaje o pulsa un botón', q_water: '💧 Agua', q_tools: '🧂 Cubiertos', q_note: '⚠️ Aviso', chat_ph: 'Escribe tu mensaje...', chat_send: 'Enviar',
    ev_accepted: 'El camarero {0} ha recibido tu pedido ✅', ev_accepted_say: 'El camarero {0} ha recibido tu pedido número {1}', ev_ready: '🎉 Tu pedido está listo — el camarero {0} va hacia ti', ev_ready_say: 'Tu pedido número {0} está listo y el camarero {1} va hacia ti', ev_chat_say: 'Mensaje del camarero {0}: {1}',
  },
  fr: {
    welcome: 'Bienvenue à {0}', welcome_sub: 'Nous sommes heureux de vous servir. Commandez depuis votre téléphone et le serveur vous l’apportera à table.', start: 'Commencer à commander', change_lang: 'Changer de langue',
    table: 'Table {0}', takeaway: 'À emporter', online: '● En ligne', local: '● Mode local', search: '🔍 Rechercher un produit...', all: 'Tout', none: 'Aucun résultat',
    n_menu: 'Carte', n_cart: 'Panier', n_orders: 'Ma commande', n_waiter: 'Serveur',
    cart_title: 'Votre panier', n_items: '{0} articles', cart_empty: 'Le panier est vide', remove: 'Retirer', line_note: '📝 Remarque pour ce produit...',
    order_note: '📝 Remarque pour toute la commande (facultatif)', order_note_ph: 'Ex. : tout ensemble, allergie aux noix...',
    subtotal: 'Sous-total', fee: 'Frais de service', total: 'Total', pay_note: '💡 Le paiement se fait à la fin auprès du serveur : espèces ou terminal de carte.', send: 'Envoyer la commande au serveur ✓',
    sheet_note: 'Remarque pour ce produit (facultatif)', sheet_ph: 'Ex. : très chaud, sans lait...', add: 'Ajouter au panier',
    t_empty: 'Le panier est vide', t_sending: 'Envoi en cours...', t_fail: 'Envoi impossible, vérifiez votre connexion internet', t_cash: 'Serveur prévenu — préparez les espèces', t_card: 'Serveur prévenu — il apporte le terminal de carte', t_called: 'Serveur prévenu 🙋', t_sendfail: 'Envoi impossible',
    loading: '⏳ Chargement...', my_orders: 'Ma commande', thanks: '✅ Payé, merci de votre visite', no_order: 'Aucune commande en cours', new_order: 'Nouvelle commande',
    invoice: 'Facture n° {0}', paid: 'Payé ✓',
    st0: 'Commande envoyée — en attente du serveur', st1: 'Le serveur {0} a reçu votre commande', st2: 'En préparation 👨‍🍳', st3: 'Votre commande est prête — le serveur {0} arrive 🎉', st4: 'Servi — bon appétit !',
    my_table: 'Ma table {0}', my_takeaway: 'Ma commande (à emporter)', with_waiter: ' · Serveur {0}', audio_hint: '🔔 Touchez ici pour activer les alertes sonores',
    more: '➕ Commander plus', call: '🙋 Appeler le serveur', ask_bill: 'Terminé ? Demandez l’addition ({0})', cash: '💵 Espèces', card: '💳 Carte',
    pay_wait_cash: '⏳ Serveur {0} prévenu — préparez {1} en espèces', pay_wait_card: '⏳ Serveur {0} prévenu — il apporte le terminal de carte',
    chat_title: '💬 Discuter avec le serveur', chat_empty: 'Écrivez un message ou touchez un bouton', q_water: '💧 Eau', q_tools: '🧂 Couverts', q_note: '⚠️ Remarque', chat_ph: 'Écrivez votre message...', chat_send: 'Envoyer',
    ev_accepted: 'Le serveur {0} a reçu votre commande ✅', ev_accepted_say: 'Le serveur {0} a reçu votre commande numéro {1}', ev_ready: '🎉 Votre commande est prête — le serveur {0} arrive', ev_ready_say: 'Votre commande numéro {0} est prête et le serveur {1} arrive', ev_chat_say: 'Message du serveur {0} : {1}',
  },
};
/* canonical Arabic strings stored in orders / chat  ->  translations shown to the customer */
const TR = {
  'السكر': { en: 'Sugar', es: 'Azúcar', fr: 'Sucre' }, 'الملح': { en: 'Salt', es: 'Sal', fr: 'Sel' }, 'الثلج': { en: 'Ice', es: 'Hielo', fr: 'Glaçons' }, 'الحجم': { en: 'Size', es: 'Tamaño', fr: 'Taille' },
  'بدون سكر': { en: 'No sugar', es: 'Sin azúcar', fr: 'Sans sucre' }, 'نصف سكرة': { en: 'Half sugar', es: 'Medio azúcar', fr: 'Demi-sucre' }, 'سكرة': { en: 'One sugar', es: 'Un azúcar', fr: 'Un sucre' }, 'سكرتين': { en: 'Two sugars', es: 'Dos azúcares', fr: 'Deux sucres' },
  'بدون ملح': { en: 'No salt', es: 'Sin sal', fr: 'Sans sel' }, 'ملح عادي': { en: 'Normal salt', es: 'Sal normal', fr: 'Sel normal' }, 'زيادة ملح': { en: 'Extra salt', es: 'Extra de sal', fr: 'Plus de sel' },
  'بدون ثلج': { en: 'No ice', es: 'Sin hielo', fr: 'Sans glaçons' }, 'ثلج قليل': { en: 'Little ice', es: 'Poco hielo', fr: 'Peu de glaçons' }, 'ثلج عادي': { en: 'Normal ice', es: 'Hielo normal', fr: 'Glaçons normaux' },
  'صغير': { en: 'Small', es: 'Pequeño', fr: 'Petit' }, 'وسط': { en: 'Medium', es: 'Mediano', fr: 'Moyen' }, 'كبير': { en: 'Large', es: 'Grande', fr: 'Grand' },
  /* default menu + categories (products you add yourself can carry their own translations in the admin page) */
  'قهوة': { en: 'Coffee', es: 'Café', fr: 'Café' }, 'شاي': { en: 'Tea', es: 'Té', fr: 'Thé' }, 'معجنات': { en: 'Pastries', es: 'Bollería', fr: 'Viennoiseries' }, 'وجبات': { en: 'Meals', es: 'Platos', fr: 'Plats' },
  'إسبريسو': { en: 'Espresso', es: 'Espresso', fr: 'Expresso' }, 'لاتيه': { en: 'Latte', es: 'Latte', fr: 'Latte' }, 'كابتشينو': { en: 'Cappuccino', es: 'Capuchino', fr: 'Cappuccino' },
  'شاي مثلج': { en: 'Iced tea', es: 'Té helado', fr: 'Thé glacé' }, 'شاي أخضر': { en: 'Green tea', es: 'Té verde', fr: 'Thé vert' }, 'كرواسون': { en: 'Croissant', es: 'Cruasán', fr: 'Croissant' },
  'بيغل': { en: 'Bagel', es: 'Bagel', fr: 'Bagel' }, 'مافن': { en: 'Muffin', es: 'Magdalena', fr: 'Muffin' }, 'برغر كلاسيك': { en: 'Classic burger', es: 'Hamburguesa clásica', fr: 'Burger classique' },
  'بطاطس مقلية': { en: 'French fries', es: 'Patatas fritas', fr: 'Frites' }, 'بيتزا': { en: 'Pizza', es: 'Pizza', fr: 'Pizza' }, 'سلطة سيزر': { en: 'Caesar salad', es: 'Ensalada César', fr: 'Salade César' },
  /* quick chat messages the customer can send (waiter always receives Arabic) */
  '🙋 الزبون ينادي النادل': { en: '🙋 The customer is calling the waiter', es: '🙋 El cliente llama al camarero', fr: '🙋 Le client appelle le serveur' },
  '💧 أريد ماء': { en: '💧 I would like water', es: '💧 Quiero agua', fr: '💧 Je voudrais de l’eau' },
  '🧂 أحتاج أدوات إضافية': { en: '🧂 I need extra cutlery', es: '🧂 Necesito cubiertos extra', fr: '🧂 Il me faut des couverts en plus' },
  '⚠️ عندي ملاحظة على الطلب': { en: '⚠️ I have a remark about my order', es: '⚠️ Tengo una nota sobre mi pedido', fr: '⚠️ J’ai une remarque sur ma commande' },
};
let LANG = 'ar';
function setLang(l) {
  if (!LANGS[l]) l = 'ar'; LANG = l;
  try { sessionStorage.setItem('smt_lang', l); localStorage.setItem('smt_lang_pref', l); } catch (e) {}
  document.documentElement.lang = l; document.documentElement.dir = LANGS[l].dir;
}
function t(k) { let s = (I18N[LANG] && I18N[LANG][k]) || I18N.ar[k] || k; for (let i = 1; i < arguments.length; i++) s = s.split('{' + (i - 1) + '}').join(arguments[i]); return s; }
/* translate a canonical Arabic string (option, quick message...) */
function tr(ar) { return LANG === 'ar' ? ar : ((TR[ar] && TR[ar][LANG]) || ar); }
function pname(m) { return LANG === 'ar' ? m.name : ((m.tr && m.tr[LANG]) || tr(m.name)); }
function cname(id) { return LANG === 'ar' ? CATS[id] : ((CATTR[id] && CATTR[id][LANG]) || tr(CATS[id])); }
function iname(i) { const m = MENU.find(x => x.id == i.id); return m ? pname(m) : tr(i.name); }
/* one order line as the customer sees it */
function custItem(i) {
  const o = i.opts && i.opts.length ? ' <small style="opacity:.85">(' + esc(i.opts.map(tr).join(LANG === 'ar' ? '، ' : ', ')) + ')</small>' : '';
  return esc((i.qty || 1) + '× ' + iname(i)) + o + (i.note ? ' <small style="color:#ffd27a">📝 ' + esc(i.note) + '</small>' : '');
}
(function () { try { const s = sessionStorage.getItem('smt_lang'); if (s) setLang(s); } catch (e) {} })();
