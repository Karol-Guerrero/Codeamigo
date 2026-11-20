/* ==========================================================
   inicio.js - lo que pasa en la pantalla de Inicio
   ========================================================== */

const usuario = Datos.usuarioActual();

// Si nadie ha iniciado sesión, se regresa al login.
if (!usuario) {
  window.location.replace("index.html");
}

// Textos de cada estado de un curso en la ruta de aprendizaje.
const ESTADOS = {
  "completado": { texto: "Completado", etiqueta: "verde", icono: "palomita" },
  "en-curso": { texto: "En curso", etiqueta: "", icono: "" },
  "bloqueado": { texto: "Bloqueado", etiqueta: "gris", icono: "candado" }
};

document.addEventListener("DOMContentLoaded", function () {
  if (!usuario) return;

  const progreso = usuario.progreso;
  const primerNombre = usuario.nombre.split(" ")[0];

  // --- Saludo ---
  document.getElementById("nombre-usuario").textContent = primerNombre;
  document.getElementById("racha").textContent =
    progreso.rachaDias + (progreso.rachaDias === 1 ? " día" : " días");

  let estrellas = "";
  for (let i = 1; i <= 5; i++) {
    estrellas += crearIcono("estrella", i <= progreso.estrellas ? "llena" : "");
  }
  document.getElementById("estrellas").innerHTML = estrellas;

  // --- Nivel y XP ---
  const porcentaje = Math.min(100, Math.round((progreso.xp / Datos.XP_POR_NIVEL) * 100));
  document.getElementById("nivel").textContent = "Nivel " + progreso.nivel;
  document.getElementById("xp").textContent = progreso.xp + " XP";
  document.getElementById("barra-xp").style.width = porcentaje + "%";
  document.getElementById("xp-falta").textContent =
    (Datos.XP_POR_NIVEL - progreso.xp) + " XP para el nivel " + (progreso.nivel + 1);

  // --- Ruta de aprendizaje ---
  // Se crea un renglón por cada curso que exista en cursos.js.
  const lista = document.getElementById("ruta");

  CURSOS.forEach(function (curso) {
    const avance = Cursos.resumen(curso, progreso);
    const estado = ESTADOS[avance.estado];

    // Módulo que se muestra: el actual; si no hay, el primero
    // (curso bloqueado) o el último (curso terminado).
    let visible = avance.actual;
    if (!visible) {
      visible = avance.estado === "completado"
        ? avance.modulos[avance.modulos.length - 1]
        : avance.modulos[0];
    }

    const renglon = document.createElement("li");
    renglon.className = avance.estado;

    const enlace = document.createElement("a");
    enlace.href = "curso.html?id=" + curso.id;
    enlace.innerHTML =
      '<span class="estado">' + (estado.icono ? crearIcono(estado.icono) : "") + "</span>" +
      '<span class="lenguaje">' + (curso.siglas ? "" : crearIcono("capas")) + "</span>" +
      '<span class="info"><strong></strong><small></small></span>' +
      '<span class="etiqueta ' + estado.etiqueta + '">' + estado.texto + "</span>" +
      crearIcono("flecha", "flecha");

    // textContent evita que un texto raro se meta como código HTML.
    if (curso.siglas) enlace.querySelector(".lenguaje").textContent = curso.siglas;
    enlace.querySelector("strong").textContent = curso.tituloEnInicio;
    enlace.querySelector("small").textContent =
      "Módulo " + visible.numero + " · " + visible.modulo.titulo;

    renglon.appendChild(enlace);
    lista.appendChild(renglon);
  });

  // --- Recompensa: la insignia de Python ---
  const python = Cursos.buscarCurso("python");
  const faltan = Cursos.resumen(python, progreso).faltantes;

  document.getElementById("recompensa-texto").textContent = faltan > 0
    ? "Completa " + Cursos.contarModulos(faltan) + " más y desbloquea:"
    : "¡Ya desbloqueaste tu insignia!";
  document.getElementById("recompensa-insignia").textContent = python.insignia;

  // --- Puntito rojo de la campana: se muestra si hoy no se han visto los avisos ---
  let vistos = null;
  try { vistos = localStorage.getItem("codeamigo.avisosVistos"); } catch (e) { /* nada */ }
  document.getElementById("punto-aviso").hidden = vistos === new Date().toDateString();

  // --- Menú de la cuenta (icono amarillo) ---
  const botonCuenta = document.getElementById("boton-cuenta");
  const menu = document.getElementById("menu-cuenta");

  document.getElementById("menu-nombre").textContent = usuario.nombre;
  document.getElementById("menu-correo").textContent = usuario.correo;

  botonCuenta.addEventListener("click", function () {
    menu.hidden = !menu.hidden;
    botonCuenta.setAttribute("aria-expanded", String(!menu.hidden));
  });

  // Tocar fuera del menú lo cierra.
  document.addEventListener("click", function (evento) {
    if (!menu.hidden && !menu.contains(evento.target) && !botonCuenta.contains(evento.target)) {
      menu.hidden = true;
      botonCuenta.setAttribute("aria-expanded", "false");
    }
  });

  document.getElementById("cerrar-sesion").addEventListener("click", function () {
    Datos.cerrarSesion();
    window.location.href = "index.html";
  });
});
