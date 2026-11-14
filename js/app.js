/* Accesorios 593 — interacciones. Sin cookies de seguimiento ni envío de datos. */
(function () {
  'use strict';
  var d = document, root = d.documentElement;
  var $ = function (s, c) { return (c || d).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || d).querySelectorAll(s)); };

  /* ===== Número de WhatsApp =====
     Está en <html data-wa="593964067840"> (código 593, sin + ni espacios).
     Cada botón lleva su propio mensaje en data-msg. */
  var WA = (root.getAttribute('data-wa') || '').replace(/\D/g, '');
  var WA_LINK = 'https://wa.link/zmtexr';
  function waUrl(text) {
    if (WA) return 'https://wa.me/' + WA + (text ? '?text=' + encodeURIComponent(text) : '');
    return WA_LINK;
  }
  var HOLA = '¡Hola Accesorios 593! 👋 Vengo de su página web y quiero información.';
  $$('.js-wa').forEach(function (a) { a.href = waUrl(a.getAttribute('data-msg') || HOLA); });

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
    counters();
    tilt();
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

  /* Números que cuentan hacia arriba al aparecer */
  function counters() {
    var els = $$('[data-count]');
    if (!els.length || !('IntersectionObserver' in window)) return;
    var fmt = function (n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.'); };
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        var el = e.target, end = +el.getAttribute('data-count'), pre = el.getAttribute('data-pre') || '', t0 = performance.now();
        (function step(t) {
          var k = Math.min(1, (t - t0) / 1400), v = Math.round(end * (1 - Math.pow(1 - k, 3)));
          el.textContent = pre + fmt(v);
          if (k < 1) requestAnimationFrame(step);
        })(t0);
      });
    }, { threshold: .6 });
    els.forEach(function (el) { io.observe(el); });
  }

  /* Tarjetas: leve inclinación 3D y brillo que sigue al mouse (solo PC) */
  function tilt() {
    if (!window.matchMedia || !matchMedia('(hover:hover) and (pointer:fine)').matches) return;
    $$('#grid .card, .feat > div, .info article').forEach(function (c) {
      c.addEventListener('pointermove', function (e) {
        var r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        c.style.setProperty('--mx', (x * 100) + '%'); c.style.setProperty('--my', (y * 100) + '%');
        c.style.transform = 'perspective(900px) rotateX(' + ((.5 - y) * 6).toFixed(2) + 'deg) rotateY(' + ((x - .5) * 6).toFixed(2) + 'deg) translateY(-4px)';
      });
      c.addEventListener('pointerleave', function () { c.style.transform = ''; });
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
  var GENS = {
    '17': ['17 Pro Max', '17 Pro', 'Air', '17'],
    '16': ['16 Pro Max', '16 Pro', '16 Plus', '16', '16e'],
    '15': ['15 Pro Max', '15 Pro', '15 Plus', '15'],
    '14': ['14 Pro Max', '14 Pro', '14 Plus', '14'],
    '13': ['13 Pro Max', '13 Pro', '13', '13 mini'],
    '12': ['12 Pro Max', '12 Pro', '12', '12 mini'],
    '11': ['11 Pro Max', '11 Pro', '11']
  };
  var genBox = $('#gen'), verBox = $('#ver'), otroBox = $('#otro-box');
  function chip(box, name, value, label) {
    var l = d.createElement('label');
    l.innerHTML = '<input type="radio"><span></span>';
    l.firstChild.name = name; l.firstChild.value = value; l.lastChild.textContent = label;
    box.appendChild(l); return l.firstChild;
  }
  ['17', '16', '15', '14', '13', '12', '11'].forEach(function (g) { chip(genBox, 'gen', g, g); }); // de la más nueva a la más antigua
  chip(genBox, 'gen', 'otro', 'Otro');
  genBox.addEventListener('change', function () {
    var g = val('gen');
    verBox.innerHTML = '';
    otroBox.hidden = g !== 'otro'; verBox.hidden = g === 'otro';
    if (g === 'otro') { $('#m-otro').focus(); return; }
    GENS[g].forEach(function (v) {
      var lab = v.replace(g + ' ', '').replace(/^(\d+)$/, 'iPhone $1');
      if (v === 'Air') lab = 'Air';
      chip(verBox, 'ver', v === 'Air' ? 'iPhone Air' : 'iPhone ' + v, lab);
    });
    err.textContent = '';
  });
  verBox.addEventListener('change', function () { // al elegir la versión pasa solo al siguiente paso
    setTimeout(function () { if (step === 1 && model()) go(2); }, 280);
  });

  var prod = $('#prod');
  var ph = d.createElement('option'); ph.value = ''; ph.textContent = 'Elige un producto'; prod.appendChild(ph);
  $$('.js-want').map(function (b) { return b.getAttribute('data-p'); }).concat(['Otro / varios productos']).forEach(function (n) {
    var o = d.createElement('option'); o.value = o.textContent = n; prod.appendChild(o);
  });

  var f = $('#f'), sets = $$('fieldset', f), stepsUi = $$('.steps li', f), step = 1, N = sets.length;
  var bNext = $('#next'), bBack = $('#back'), bSend = $('#send'), err = $('#err');
  function val(name) {
    var el = f.querySelector('[name="' + name + '"]:checked') || f.querySelector('[name="' + name + '"]:not([type=radio])');
    return el ? (el.value || '').trim() : '';
  }
  function model() { return val('gen') === 'otro' ? val('otro') : val('ver'); }
  function message() {
    var lines = ['¡Hola Accesorios 593! 👋 Quiero hacer un pedido:', '',
      '📱 Modelo: ' + model(),
      '🛍️ Producto: ' + (val('prod') || 'Quiero recomendaciones')];
    if (val('color')) lines.push('🎨 Color: ' + val('color'));
    lines.push('🚚 Entrega: ' + val('ent') + (val('ciudad') ? ' — ' + val('ciudad') : ''));
    if (val('nom')) lines.push('🙋 Nombre: ' + val('nom'));
    lines.push('', '¿Me confirman precio y disponibilidad? ¡Gracias!');
    return lines.join('\n');
  }
  function show(n) {
    step = n;
    sets.forEach(function (s) { s.hidden = +s.getAttribute('data-s') !== n; });
    stepsUi.forEach(function (li, i) { li.classList.toggle('on', i < n); });
    $('#stp').textContent = 'Paso ' + n + ' de ' + N;
    bBack.hidden = n === 1; bNext.hidden = n === N; bSend.hidden = n !== N;
    err.textContent = '';
    if (n === N) $('#sum').textContent = message();
  }
  function go(n) {
    show(n);
    var leg = sets[n - 1].querySelector('legend'); if (leg) { leg.tabIndex = -1; leg.focus({ preventScroll: true }); }
  }
  function check() {
    if (step === 1 && !val('gen')) return 'Elige la generación de tu iPhone.';
    if (step === 1 && !model()) return val('gen') === 'otro' ? 'Escribe el modelo de tu iPhone.' : 'Elige la versión de tu iPhone.';
    if (step === 2 && !val('prod')) return 'Elige un producto (o “Otro / varios productos”).';
    if (step === 3 && val('ent') === 'Envío a otra ciudad' && !val('ciudad')) return 'Escribe la ciudad a la que enviamos.';
    return '';
  }
  f.addEventListener('change', function (e) {
    if (e.target.name === 'ent') $('#c-opt').textContent = val('ent') === 'Envío a otra ciudad' ? 'obligatorio' : 'opcional';
  });
  bNext.addEventListener('click', function () {
    var e = check(); if (e) { err.textContent = e; return; }
    go(step + 1);
  });
  bBack.addEventListener('click', function () { go(step - 1); });
  $('#nom').addEventListener('input', function () { $('#sum').textContent = message(); });
  f.addEventListener('submit', function (e) {
    e.preventDefault();
    // location.href funciona también dentro de Instagram, TikTok y Facebook (no usan ventanas emergentes).
    location.href = waUrl(message());
  });
  $$('.js-want').forEach(function (b) {
    b.addEventListener('click', function () {
      prod.value = b.getAttribute('data-p');
      show(model() ? 2 : 1);
      $('#pedido').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
    });
  });
  show(1);

  /* ===== Videos del catálogo: se cargan y reproducen solo cuando la tarjeta está en pantalla ===== */
  var vids = $$('.pv');
  if (vids.length && !reduce && 'IntersectionObserver' in window) {
    var vio = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        var v = e.target;
        if (e.isIntersecting) {
          if (!v.getAttribute('data-ok')) {
            var size = v.clientWidth * (window.devicePixelRatio || 1) > 400 ? '544' : '368';
            var base = v.getAttribute('data-v') + '-' + size;
            v.innerHTML = '<source src="' + base + '.webm" type="video/webm"><source src="' + base + '.mp4" type="video/mp4">';
            v.setAttribute('data-ok', '1');
            v.addEventListener('playing', function () { v.classList.add('on'); });
            v.load();
          }
          var p = v.play(); if (p && p.catch) p.catch(function () { /* sin reproducción automática: queda la foto */ });
        } else if (!v.paused) {
          v.pause();
        }
      });
    }, { rootMargin: '150px 0px' });
    vids.forEach(function (v) { vio.observe(v); });
  }

  /* ===== Ampliar foto del producto ===== */
  var zoom = $('#zoom');
  if (zoom && zoom.showModal) {
    var zImg = $('img', zoom), zTxt = $('p', zoom);
    $$('.ph').forEach(function (b) {
      b.addEventListener('click', function () {
        var alt = $('img', b).alt;
        zImg.src = b.getAttribute('data-full'); zImg.alt = alt; zTxt.textContent = alt;
        var zwa = $('#zwa', zoom);
        if (zwa) zwa.href = waUrl('¡Hola Accesorios 593! 👋 Me interesa el ' + alt + '. ¿Me confirman precio y colores disponibles?');
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
