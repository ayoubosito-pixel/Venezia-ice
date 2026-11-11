/* ===== Waiter-app languages (ar / en / es / fr). Loaded after i18n.js.
   Each row: key: [Arabic, English, Spanish, French]. Orders & chat are always STORED in Arabic. ===== */
(function () {
  const S = {
    w_title: ['تطبيق النادل', 'Waiter app', 'App del camarero', 'Application serveur'],
    w_login_p: ['اختر اسمك وأدخل كلمة المرور التي أعطاك إياها المدير.', 'Choose your name and enter the password your manager gave you.', 'Elige tu nombre e introduce la contraseña que te dio el encargado.', 'Choisissez votre nom et entrez le mot de passe donné par le responsable.'],
    w_pw: ['كلمة المرور', 'Password', 'Contraseña', 'Mot de passe'],
    w_enter: ['دخول وتفعيل التنبيهات 🔔', 'Log in and enable alerts 🔔', 'Entrar y activar avisos 🔔', 'Se connecter et activer les alertes 🔔'],
    w_nowaiters: ['لا يوجد نوادل مسجلون. اطلب من المدير إضافة حسابك من صفحة الإدارة.', 'No waiters registered. Ask the manager to add your account in the admin page.', 'No hay camareros registrados. Pide al encargado que añada tu cuenta en la página de administración.', 'Aucun serveur enregistré. Demandez au responsable d’ajouter votre compte dans la page d’administration.'],
    w_loading: ['جاري التحميل...', 'Loading...', 'Cargando...', 'Chargement...'],
    w_retry: ['جاري التحميل... أعد المحاولة بعد ثانية', 'Loading... try again in a second', 'Cargando... inténtalo de nuevo en un segundo', 'Chargement... réessayez dans une seconde'],
    w_gate_h: ['🔔 تفعيل التنبيهات', '🔔 Enable alerts', '🔔 Activar avisos', '🔔 Activer les alertes'],
    w_gate_p: ['المتصفح يمنع الصوت حتى تلمس الشاشة. المس الزر ليرنّ الهاتف عند وصول كل طلب.', 'The browser blocks sound until you tap the screen. Tap the button so the phone rings for every new order.', 'El navegador bloquea el sonido hasta que toques la pantalla. Toca el botón para que el móvil suene con cada pedido.', 'Le navigateur bloque le son tant que vous ne touchez pas l’écran. Touchez le bouton pour que le téléphone sonne à chaque commande.'],
    w_gate_btn: ['تفعيل الصوت الآن', 'Enable sound now', 'Activar sonido ahora', 'Activer le son maintenant'],
    w_logout: ['خروج', 'Log out', 'Salir', 'Quitter'],
    w_testsound: ['🔊 اختبار الصوت', '🔊 Test sound', '🔊 Probar sonido', '🔊 Tester le son'],
    w_voice_ok: ['🗣 الصوت المنطوق متاح', '🗣 Voice alerts available', '🗣 Avisos de voz disponibles', '🗣 Alertes vocales disponibles'],
    w_voice_no: ['🔔 جرس فقط (لا يوجد صوت منطوق للغة)', '🔔 Bell only (no voice for this language)', '🔔 Solo timbre (sin voz para este idioma)', '🔔 Sonnerie seule (pas de voix pour cette langue)'],
    w_h_new: ['طلبات جديدة بانتظار نادل', 'New orders waiting for a waiter', 'Pedidos nuevos esperando camarero', 'Nouvelles commandes en attente de serveur'],
    w_h_mine: ['طلباتي', 'My orders', 'Mis pedidos', 'Mes commandes'],
    w_h_chat: ['💬 رسائل الطاولات', '💬 Table messages', '💬 Mensajes de las mesas', '💬 Messages des tables'],
    w_zone: ['المنطقة: {0}', 'Area: {0}', 'Zona: {0}', 'Zone : {0}'],
    w_all: ['الكل', 'All', 'Todas', 'Toutes'],
    w_allz: ['كل المناطق', 'All areas', 'Todas las zonas', 'Toutes les zones'],
    w_cloud: ['☁️ متصل', '☁️ Online', '☁️ En línea', '☁️ En ligne'],
    w_localm: ['⚠️ وضع محلي', '⚠️ Local mode', '⚠️ Modo local', '⚠️ Mode local'],
    w_accept: ['✋ قبول الطلب', '✋ Accept order', '✋ Aceptar pedido', '✋ Accepter la commande'],
    w_none_new: ['لا توجد طلبات جديدة', 'No new orders', 'No hay pedidos nuevos', 'Aucune nouvelle commande'],
    w_none_mine: ['لا توجد طلبات باسمك الآن', 'You have no orders right now', 'No tienes pedidos ahora', 'Vous n’avez aucune commande'],
    w_none_chat: ['لا توجد رسائل', 'No messages', 'No hay mensajes', 'Aucun message'],
    w_wantpay: ['💰 الزبون يريد الدفع:', '💰 The customer wants to pay:', '💰 El cliente quiere pagar:', '💰 Le client veut payer :'],
    w_cashp: ['كاش 💵', 'Cash 💵', 'Efectivo 💵', 'Espèces 💵'],
    w_cardp: ['بالبطاقة 💳 — أحضر جهاز الدفع', 'Card 💳 — bring the card machine', 'Tarjeta 💳 — lleva el datáfono', 'Carte 💳 — apportez le terminal'],
    w_collected: ['✅ تم التحصيل', '✅ Payment collected', '✅ Cobrado', '✅ Encaissé'],
    w_served: ['🍽 استلمت الطلب وقدّمته', '🍽 I took it and served it', '🍽 Lo recogí y lo serví', '🍽 Récupérée et servie'],
    w_waitpay: ['بانتظار طلب الدفع من الزبون', 'Waiting for the customer to ask for the bill', 'Esperando que el cliente pida la cuenta', 'En attente de la demande d’addition'],
    w_manual: ['تحصيل يدويًا', 'Collect manually', 'Cobrar manualmente', 'Encaisser manuellement'],
    w_onote: ['📝 الطلب: {0}', '📝 Order: {0}', '📝 Pedido: {0}', '📝 Commande : {0}'],
    w_reply_ph: ['اكتب ردًا...', 'Write a reply...', 'Escribe una respuesta...', 'Écrire une réponse...'],
    w_send: ['إرسال', 'Send', 'Enviar', 'Envoyer'],
    w_otw: ['في الطريق 🏃', 'On my way 🏃', 'Voy 🏃', 'J’arrive 🏃'],
    w_ok: ['حاضر ✅', 'Sure ✅', 'Claro ✅', 'Volontiers ✅'],
    w_wait: ['لحظة من فضلك ⏳', 'One moment please ⏳', 'Un momento, por favor ⏳', 'Un instant s’il vous plaît ⏳'],
    w_more: ['هل تريد شيئًا آخر؟', 'Would you like anything else?', '¿Desea algo más?', 'Désirez-vous autre chose ?'],
    w_trans: ['🌐 ترجمة', '🌐 Translate', '🌐 Traducir', '🌐 Traduire'],
    w_table: ['طاولة {0}', 'Table {0}', 'Mesa {0}', 'Table {0}'],
    w_take: ['سفري', 'Takeaway', 'Para llevar', 'À emporter'],
    w_now: ['الآن', 'now', 'ahora', 'à l’instant'],
    w_ago: ['منذ {0} د', '{0} min ago', 'hace {0} min', 'il y a {0} min'],
    w_inv: ['فاتورة رقم {0}', 'invoice {0}', 'factura número {0}', 'facture numéro {0}'],
    w_t_acc: ['✅ استلمت الطلب — ظهر الآن في المطبخ', '✅ Order accepted — now in the kitchen', '✅ Pedido aceptado — ya está en cocina', '✅ Commande acceptée — en cuisine'],
    w_t_late: ['سبقك نادل آخر لهذا الطلب', 'Another waiter took this order first', 'Otro camarero se adelantó', 'Un autre serveur l’a déjà prise'],
    w_t_paid: ['تم تحصيل الدفع ✓', 'Payment collected ✓', 'Pago cobrado ✓', 'Paiement encaissé ✓'],
    w_t_sel: ['اختر اسمك من القائمة', 'Choose your name from the list', 'Elige tu nombre de la lista', 'Choisissez votre nom dans la liste'],
    w_t_badpw: ['كلمة المرور غير صحيحة', 'Wrong password', 'Contraseña incorrecta', 'Mot de passe incorrect'],
    w_t_out: ['تم تسجيل خروجك — تغيّرت بيانات حسابك', 'You were logged out — your account changed', 'Sesión cerrada — tu cuenta cambió', 'Déconnecté — votre compte a changé'],
    w_hi: ['👋 {0}', '👋 {0}', '👋 {0}', '👋 {0}'],
    w_sys: ['طاولات سمارت', 'Smart Tables', 'Mesas Smart', 'Tables Smart'],
    /* spoken / banner texts */
    w_v_on: ['التنبيهات مفعّلة', 'Alerts are on', 'Los avisos están activados', 'Les alertes sont activées'],
    w_v_test: ['هذا اختبار للتنبيه الصوتي', 'This is a sound alert test', 'Esto es una prueba de aviso sonoro', 'Ceci est un test d’alerte sonore'],
    w_v_new: ['طلب جديد في {0}', 'New order in {0}', 'Nuevo pedido en {0}', 'Nouvelle commande en {0}'],
    w_v_new_t: ['طلب جديد في {0}، {1}', 'New order in {0}, {1}', 'Nuevo pedido en {0}, {1}', 'Nouvelle commande en {0}, {1}'],
    w_v_ready: ['الطلب جاهز يا {0}، {1}', 'Order ready, {0}. {1}', 'Pedido listo, {0}. {1}', 'Commande prête, {0}. {1}'],
    w_b_ready: ['✅ طلبك جاهز — {0}', '✅ Your order is ready — {0}', '✅ Tu pedido está listo — {0}', '✅ Votre commande est prête — {0}'],
    w_v_pay_cash: ['{0} تريد الدفع نقدًا', '{0} wants to pay cash', '{0} quiere pagar en efectivo', '{0} veut payer en espèces'],
    w_v_pay_card: ['{0} تريد الدفع بالبطاقة، أحضر جهاز الدفع', '{0} wants to pay by card, bring the card machine', '{0} quiere pagar con tarjeta, lleva el datáfono', '{0} veut payer par carte, apportez le terminal'],
    w_b_pay: ['💰 طلب دفع — {0} · {1}', '💰 Payment request — {0} · {1}', '💰 Petición de pago — {0} · {1}', '💰 Demande de paiement — {0} · {1}'],
    w_v_call: ['{0} تنادي النادل', '{0} is calling the waiter', '{0} llama al camarero', '{0} appelle le serveur'],
    w_v_msg: ['رسالة من {0}: {1}', 'Message from {0}: {1}', 'Mensaje de {0}: {1}', 'Message de {0} : {1}'],
    w_v_pend: ['يوجد {0} طلب بانتظار نادل', '{0} order(s) waiting for a waiter', '{0} pedido(s) esperando camarero', '{0} commande(s) en attente de serveur'],
    w_v_rd: ['لديك طلب جاهز للتقديم', 'You have an order ready to serve', 'Tienes un pedido listo para servir', 'Vous avez une commande prête à servir'],
    s_pending: ['بانتظار النادل', 'Waiting for waiter', 'Esperando camarero', 'En attente de serveur'],
    s_new: ['جديد', 'New', 'Nuevo', 'Nouveau'],
    s_preparing: ['قيد التحضير', 'Preparing', 'En preparación', 'En préparation'],
    s_ready: ['جاهز', 'Ready', 'Listo', 'Prête'],
    s_served: ['تم التقديم', 'Served', 'Servido', 'Servie'],
  };
  const L = ['ar', 'en', 'es', 'fr'];
  Object.keys(S).forEach(k => L.forEach((l, i) => { I18N[l][k] = S[k][i]; }));
  /* canned waiter replies are stored in Arabic and shown to the customer in their own language */
  ['w_otw', 'w_ok', 'w_wait', 'w_more'].forEach(k => {});
  const CAN = { 'في الطريق إليك 🏃': ['I’m on my way 🏃', 'Voy hacia ti 🏃', 'J’arrive 🏃'], 'حاضر ✅': S.w_ok.slice(1), 'لحظة من فضلك ⏳': S.w_wait.slice(1), 'هل تريد شيئًا آخر؟': S.w_more.slice(1) };
  Object.keys(CAN).forEach(a => { TR[a] = { en: CAN[a][0], es: CAN[a][1], fr: CAN[a][2] }; });
  /* waiter language is kept apart from the customer's choice */
  window.WLANG_KEY = 'smt_wlang';
  window.statusT = s => t('s_' + s);
  window.whereT = o => o.table ? t('w_table', o.table) : t('w_take');
  window.agoT = ms => { const m = Math.floor((Date.now() - ms) / 60000); return m < 1 ? t('w_now') : t('w_ago', m); };
})();
