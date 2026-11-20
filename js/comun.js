/* ==========================================================
   comun.js - cosas que usan todas las pantallas:
   1) los iconos, 2) el respaldo de imágenes, 3) los mensajitos.
   ========================================================== */

/* ---------- 1) Iconos ----------
   En el HTML se escribe:  <i data-icono="campana"></i>
   y aquí se cambia por el dibujo (SVG) correspondiente. */
const ICONOS = {
  campana: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/>',
  usuario: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/>',
  ayuda: '<circle cx="12" cy="12" r="9"/><path d="M9.6 9.2a2.5 2.5 0 1 1 3.6 2.2c-.8.4-1.2 1-1.2 1.8"/><path d="M12 17h.01"/>',
  correo: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
  candado: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
  ojo: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  "ojo-cerrado": '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/><path d="M4 4l16 16"/>',
  escudo: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/>',
  palomita: '<path d="M5 12l5 5 9-10"/>',
  casa: '<path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/>',
  libro: '<path d="M12 6c-2-1.5-5-2-8-1.5v13c3-.5 6 0 8 1.5 2-1.5 5-2 8-1.5v-13c-3-.5-6 0-8 1.5z"/><path d="M12 6v13"/>',
  trofeo: '<path d="M8 4h8v5a4 4 0 0 1-8 0z"/><path d="M8 6H5a3 3 0 0 0 3 4"/><path d="M16 6h3a3 3 0 0 1-3 4"/><path d="M12 13v4"/><path d="M8 20h8"/>',
  flama: '<path d="M12 3c1 3 5 5 5 10a5 5 0 0 1-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3-1-5 1-9z"/>',
  estrella: '<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>',
  mapa: '<path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2z"/><path d="M9 4v14"/><path d="M15 6v14"/>',
  capas: '<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5"/>',
  flecha: '<path d="M9 6l6 6-6 6"/>',
  codigo: '<path d="M8 8l-4 4 4 4"/><path d="M16 8l4 4-4 4"/>',
  atras: '<path d="M15 6l-6 6 6 6"/>',
  cerrar: '<path d="M6 6l12 12"/><path d="M18 6L6 18"/>',
  reproducir: '<path d="M8 5l11 7-11 7z"/>',
  "flecha-larga": '<path d="M5 12h14"/><path d="M13 6l6 6-6 6"/>',
  medalla: '<circle cx="12" cy="9" r="5"/><path d="M9 13.5L7.5 21l4.5-2.5 4.5 2.5-1.5-7.5"/>',
  foco: '<path d="M9 18h6"/><path d="M10 21h4"/><path d="M12 3a6 6 0 0 0-4 10.5c.7.7 1 1.5 1 2.5h6c0-1 .3-1.8 1-2.5A6 6 0 0 0 12 3z"/>',
  chip: '<rect x="7" y="7" width="10" height="10" rx="1.5"/><path d="M10 3v4M14 3v4M10 17v4M14 17v4M3 10h4M3 14h4M17 10h4M17 14h4"/>',
  matraz: '<path d="M9 3h6"/><path d="M10 3v6l-5 9a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-9V3"/>'
};

function crearIcono(nombre, clases) {
  return '<svg class="icono ' + (clases || "") + '" viewBox="0 0 24 24" fill="none" ' +
    'stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ' +
    'aria-hidden="true">' + (ICONOS[nombre] || "") + "</svg>";
}

function pintarIconos(raiz) {
  (raiz || document).querySelectorAll("i[data-icono]").forEach(function (i) {
    i.outerHTML = crearIcono(i.dataset.icono, i.className);
  });
}

/* ---------- 2) Respaldo de imágenes ----------
   Si todavía no has puesto img/logo.png o img/mascota.png,
   en vez de una imagen rota se muestra un cuadrito azul. */
function ponerRespaldo(img) {
  const caja = document.createElement("div");
  caja.className = img.dataset.respaldo;
  caja.innerHTML = crearIcono("codigo");
  img.replaceWith(caja);
}

function revisarImagenes() {
  document.querySelectorAll("img[data-respaldo]").forEach(function (img) {
    if (img.complete && img.naturalWidth === 0) {
      ponerRespaldo(img);
    } else if (!img.complete) {
      img.addEventListener("error", function () { ponerRespaldo(img); });
    }
  });
}

/* ---------- 3) Mensajitos ----------
   mostrarMensaje("texto") enseña un aviso abajo por unos segundos. */
let temporizadorMensaje = null;

function mostrarMensaje(texto) {
  let caja = document.querySelector(".mensaje");
  if (!caja) {
    caja = document.createElement("div");
    caja.className = "mensaje";
    caja.setAttribute("role", "status");
    document.body.appendChild(caja);
  }
  caja.textContent = texto;
  caja.hidden = false;
  clearTimeout(temporizadorMensaje);
  temporizadorMensaje = setTimeout(function () { caja.hidden = true; }, 2800);
}

/* Botones que todavía no tienen pantalla: avisan que vienen después. */
function activarPendientes() {
  document.querySelectorAll("[data-pendiente]").forEach(function (boton) {
    boton.addEventListener("click", function () {
      mostrarMensaje(boton.dataset.pendiente + " estará disponible en la siguiente etapa.");
    });
  });
}

document.addEventListener("DOMContentLoaded", function () {
  pintarIconos();
  revisarImagenes();
  activarPendientes();
});
