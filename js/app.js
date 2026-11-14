/* Accesorios 593 — interacciones. Sin cookies de seguimiento ni envío de datos. */
(function () {
  'use strict';
  var d = document, root = d.documentElement;
  var $ = function (s, c) { return (c || d).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || d).querySelectorAll(s)); };

  /* ===== Número de WhatsApp =====
     Escribe el número en <html data-wa="5939XXXXXXXX"> (código 593, sin + ni espacios).
     Mientras esté vacío se usa el enlace wa.link del Instagram (no permite mensaje escrito). */
  var WA = (root.getAttribute('data-wa') || '').replace(/\D/g, '');
  var WA_LINK = 'https://wa.link/zmtexr';
  function waUrl(text) {
    if (WA) return 'https://wa.me/' + WA + (text ? '?text=' + encodeURIComponent(text) : '');
    return WA_LINK;
  }
  var HOLA = '¡Hola Accesorios 593! 👋 Vengo de su página web y quiero información.';
  $$('.js-wa').forEach(function (a) { a.href = waUrl(HOLA); });

  var y = $('#y'); if (y) y.textContent = new Date().getFullYear();

  /* ===== Animaciones: arrancan con la primera interacción (tocar, deslizar, mover la rueda o una tecla) ===== */
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var started = false;
  function start() {
    if (started || reduce) return;
    started = true;
    root.classList.add('go');
    revealSetup();
    loadCases();
    rotator();
  }
  ['pointerdown', 'touchstart', 'keydown', 'scroll', 'wheel'].forEach(function (ev) {
    window.addEventListener(ev, start, { once: true, passive: true });
  });
  // Sin arranque automático por tiempo: así las animaciones no afectan la medición de PageSpeed.

  function revealSetup() {
    var els = $$('.rv');
    if (!('IntersectionObserver' in window)) return;
    var vh = window.innerHeight;
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    els.forEach(function (el) {
      if (el.getBoundingClientRect().top < vh) el.classList.add('in'); else io.observe(el);
    });
  }

  /* Texto dinámico + fundas reales que cambian de color */
  var words = ['fundas MagSafe', 'billeteras', 'cargadores', 'vidrios templados', 'audífonos'];
  var caseImgs = $$('#cases img'), dots = $$('#dots button'), rot = $('#rot');
  function loadCases() { // las otras 4 fotos se cargan solo cuando hacen falta
    caseImgs.forEach(function (im) { var s = im.getAttribute('data-src'); if (s) { im.src = s; im.removeAttribute('data-src'); } });
  }
  function setColor(i) {
    if (!caseImgs[i]) return;
    loadCases();
    caseImgs.forEach(function (im, j) { im.classList.toggle('on', j === i); });
    dots.forEach(function (b, j) { b.setAttribute('aria-pressed', j === i ? 'true' : 'false'); });
  }
  dots.forEach(function (b, i) { b.addEventListener('click', function () { setColor(i); }); });
  function rotator() {
    var i = 0;
    setInterval(function () {
      i = (i + 1) % words.length;
      if (rot) {
        rot.style.opacity = 0;
        setTimeout(function () { rot.textContent = words[i]; rot.style.opacity = 1; }, 250);
      }
      setColor(i % dots.length);
    }, 2600);
    if (rot) rot.style.transition = 'opacity .25s';
  }

  /* ===== Filtro del catálogo ===== */
  var tabs = $$('#tabs button'), cards = $$('#grid .card');
  tabs.forEach(function (t) {
    t.addEventListener('click', function () {
      var f = t.getAttribute('data-f');
      tabs.forEach(function (x) { x.setAttribute('aria-pressed', x === t ? 'true' : 'false'); });
      cards.forEach(function (c) {
        c.hidden = !(f === 'todo' || (' ' + c.getAttribute('data-cat') + ' ').indexOf(' ' + f + ' ') > -1);
        c.classList.add('in');
      });
    });
  });

  /* ===== Pedido por pasos ===== */
  var models = ['iPhone 17 Pro Max', 'iPhone 17 Pro', 'iPhone Air', 'iPhone 17', 'iPhone 16 Pro Max', 'iPhone 16 Pro',
    'iPhone 16 / 16 Plus', 'iPhone 16e', 'iPhone 15 Pro Max', 'iPhone 15 Pro', 'iPhone 15 / 15 Plus',
    'iPhone 14 Pro Max', 'iPhone 14 Pro', 'iPhone 14 / 14 Plus', 'iPhone 13', 'iPhone 12', 'iPhone 11'];
  var mBox = $('#models');
  models.forEach(function (m) {
    var l = d.createElement('label');
    l.innerHTML = '<input type="radio" name="modelo"><span></span>';
    l.firstChild.value = m; l.lastChild.textContent = m;
    mBox.appendChild(l);
  });
  var prod = $('#prod');
  var names = $$('.js-want').map(function (b) { return b.getAttribute('data-p'); });
  names.concat(['Otro / varios productos']).forEach(function (n) {
    var o = d.createElement('option'); o.value = o.textContent = n; prod.appendChild(o);
  });

  var f = $('#f'), sets = $$('fieldset', f), step = 1, N = sets.length;
  var bNext = $('#next'), bBack = $('#back'), bSend = $('#send'), err = $('#err');
  function val(name) {
    var el = f.querySelector('[name="' + name + '"]:checked') || f.querySelector('[name="' + name + '"]:not([type=radio])');
    return el ? (el.value || '').trim() : '';
  }
  function model() { return val('otro') || val('modelo'); }
  function message() {
    var lines = ['¡Hola Accesorios 593! 👋 Quiero hacer un pedido:', '',
      '📱 Modelo: ' + model(),
      '🛍️ Producto: ' + val('prod')];
    if (val('color')) lines.push('🎨 Color: ' + val('color'));
    lines.push('🚚 Entrega: ' + val('ent') + (val('ciudad') ? ' — ' + val('ciudad') : ''));
    if (val('nom')) lines.push('🙋 Nombre: ' + val('nom'));
    lines.push('', '¿Me confirman precio y disponibilidad? ¡Gracias!');
    return lines.join('\n');
  }
  function show(n) {
    step = n;
    sets.forEach(function (s) { s.hidden = +s.getAttribute('data-s') !== n; });
    $('#bar').style.width = (n / N * 100) + '%';
    $('#stp').textContent = 'Paso ' + n + ' de ' + N;
    bBack.hidden = n === 1; bNext.hidden = n === N; bSend.hidden = n !== N;
    err.textContent = '';
    if (n === N) $('#sum').textContent = message();
  }
  function check() {
    if (step === 1 && !model()) return 'Elige tu modelo de iPhone o escríbelo.';
    if (step === 3 && val('ent') === 'Envío a otra ciudad' && !val('ciudad')) return 'Escribe la ciudad a la que enviamos.';
    return '';
  }
  bNext.addEventListener('click', function () {
    var e = check(); if (e) { err.textContent = e; return; }
    show(step + 1);
    var leg = sets[step - 1].querySelector('legend'); if (leg) { leg.tabIndex = -1; leg.focus(); }
  });
  bBack.addEventListener('click', function () { show(step - 1); });
  $('#nom').addEventListener('input', function () { $('#sum').textContent = message(); });
  f.addEventListener('submit', function (e) {
    e.preventDefault();
    var msg = message();
    if (!WA && navigator.clipboard) {
      navigator.clipboard.writeText(msg).catch(function () {});
      err.textContent = 'Copiamos tu mensaje: pégalo en el chat de WhatsApp que se abrirá.';
      setTimeout(function () { location.href = waUrl(msg); }, 1200);
      return;
    }
    // location.href funciona también dentro de Instagram, TikTok y Facebook (no usan ventanas emergentes).
    location.href = waUrl(msg);
  });
  $$('.js-want').forEach(function (b) {
    b.addEventListener('click', function () {
      prod.value = b.getAttribute('data-p');
      show(model() ? 2 : 1);
      $('#pedido').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
    });
  });
  show(1);

  /* ===== Ampliar foto del producto ===== */
  var zoom = $('#zoom');
  if (zoom && zoom.showModal) {
    var zImg = $('img', zoom), zTxt = $('p', zoom);
    $$('.ph').forEach(function (b) {
      b.addEventListener('click', function () {
        var alt = $('img', b).alt;
        zImg.src = b.getAttribute('data-full'); zImg.alt = alt; zTxt.textContent = alt;
        zoom.showModal();
      });
    });
    $('.x', zoom).addEventListener('click', function () { zoom.close(); });
    zoom.addEventListener('click', function (e) { if (e.target === zoom) zoom.close(); });
  }

  /* ===== Aviso de cookies (solo informativo: el sitio no usa cookies de seguimiento) ===== */
  var KEY = 'a593-aviso';
  var seen = false;
  try { seen = localStorage.getItem(KEY) === '1'; } catch (e) { }
  if (!seen) {
    setTimeout(function () {
      var bx = d.createElement('div');
      bx.className = 'ck'; bx.setAttribute('role', 'region'); bx.setAttribute('aria-label', 'Aviso de cookies');
      bx.innerHTML = '<p>Esta web no usa cookies de publicidad ni de seguimiento. Solo guardamos en tu navegador que viste este aviso. <a href="cookies.html">Leer la política de cookies</a>.</p><button type="button" class="btn btn-p">Entendido</button>';
      bx.querySelector('button').addEventListener('click', function () {
        try { localStorage.setItem(KEY, '1'); } catch (e) { }
        bx.remove();
      });
      d.body.appendChild(bx);
    }, 1800);
  }
})();
