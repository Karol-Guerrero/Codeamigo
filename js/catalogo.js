/* ==========================================================
   catalogo.js - pantalla "Todos los cursos"
   Junta los cursos que ya existen (cursos.js) con los que
   vienen después, y marca cuáles son Premium.
   ========================================================== */

const usuarioCatalogo = Datos.usuarioActual();
if (!usuarioCatalogo) {
  window.location.replace("index.html");
}

// Cursos que solo se abren con Premium (igual que en planes.html).
const CURSOS_PREMIUM = ["cpp"];

// Colores del cuadrito de cada curso.
const COLOR_CURSO = { python: "", control: "", cpp: "ciruela" };

// Cursos que todavía no existen pero ya se anuncian.
const CURSOS_PROXIMOS = [
  { id: "javascript", siglas: "JS", titulo: "JavaScript", lema: "Dale vida a las páginas web.", color: "amarilla" },
  { id: "java", siglas: "Java", titulo: "Java", lema: "Programación orientada a objetos paso a paso.", color: "naranja" }
];

document.addEventListener("DOMContentLoaded", function () {
  if (!usuarioCatalogo) return;

  const progreso = usuarioCatalogo.progreso;
  const premium = Datos.esPremium();
  const lista = document.getElementById("lista-cursos");

  if (premium) {
    document.getElementById("texto-plan").textContent =
      "Tienes Premium: todos los cursos están abiertos para ti.";
  }

  function etiquetaPremium() {
    return '<span class="etiqueta premium">' + crearIcono("estrella") + "Premium</span>";
  }

  // Arma una tarjeta. "datos" trae lo que se va a mostrar.
  function crearTarjeta(datos) {
    const li = document.createElement("li");
    li.dataset.tipo = datos.tipo;          // gratis | premium | proximamente

    const tarjeta = document.createElement(datos.href ? "a" : "div");
    tarjeta.className = "tarjeta-curso " + datos.tipo;
    if (datos.href) tarjeta.href = datos.href;

    tarjeta.innerHTML =
      '<span class="insignia-curso ' + (datos.color || "") + '"></span>' +
      '<span class="info"><strong></strong><small></small>' +
      '<span class="fila-etiquetas"></span>' +
      (datos.porcentaje !== undefined
        ? '<span class="barra"><span style="width:' + datos.porcentaje + '%"></span></span>'
        : "") +
      "</span>" +
      (datos.href ? crearIcono("flecha", "flecha") : "");

    const insignia = tarjeta.querySelector(".insignia-curso");
    if (datos.siglas) insignia.textContent = datos.siglas;
    else insignia.innerHTML = crearIcono("capas");

    tarjeta.querySelector("strong").textContent = datos.titulo;
    tarjeta.querySelector("small").textContent = datos.detalle;
    tarjeta.querySelector(".fila-etiquetas").innerHTML = datos.etiquetas.join("");

    li.appendChild(tarjeta);
    return li;
  }

  // --- Cursos que ya existen ---
  CURSOS.forEach(function (curso) {
    const avance = Cursos.resumen(curso, progreso);
    const esDePago = CURSOS_PREMIUM.includes(curso.id);
    const porcentaje = Math.round((avance.completados / avance.modulos.length) * 100);

    const etiquetas = [];
    if (esDePago) etiquetas.push(etiquetaPremium());
    else etiquetas.push('<span class="etiqueta verde">Gratis</span>');

    if (avance.estado === "completado") etiquetas.push('<span class="etiqueta verde">Completado</span>');
    else if (avance.estado === "bloqueado") etiquetas.push('<span class="etiqueta gris">Bloqueado</span>');
    else etiquetas.push('<span class="etiqueta">En curso</span>');

    // Si es de pago y no tienes Premium, te manda a ver los planes.
    const href = esDePago && !premium ? "planes.html" : "curso.html?id=" + curso.id;

    lista.appendChild(crearTarjeta({
      tipo: esDePago ? "premium" : "gratis",
      href: href,
      siglas: curso.siglas,
      color: COLOR_CURSO[curso.id],
      titulo: curso.tituloEnInicio,
      detalle: avance.completados + " de " + avance.modulos.length + " módulos · " + curso.lema,
      etiquetas: etiquetas,
      porcentaje: porcentaje
    }));
  });

  // --- Cursos que vienen después ---
  CURSOS_PROXIMOS.forEach(function (curso) {
    lista.appendChild(crearTarjeta({
      tipo: "proximamente",
      href: null,
      siglas: curso.siglas,
      color: curso.color,
      titulo: curso.titulo,
      detalle: curso.lema,
      etiquetas: [etiquetaPremium(), '<span class="etiqueta gris">Próximamente</span>']
    }));
  });

  // --- Filtros ---
  const botones = document.querySelectorAll(".filtro");
  botones.forEach(function (boton) {
    boton.addEventListener("click", function () {
      botones.forEach(function (b) { b.classList.remove("activo"); });
      boton.classList.add("activo");

      const filtro = boton.dataset.filtro;
      lista.querySelectorAll("li").forEach(function (li) {
        const tipo = li.dataset.tipo;
        let visible = filtro === "todos" || filtro === tipo;
        // "Premium" también incluye los que vienen después (son Premium).
        if (filtro === "premium" && tipo === "proximamente") visible = true;
        li.hidden = !visible;
      });
    });
  });
});
