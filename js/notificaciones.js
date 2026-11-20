/* ==========================================================
   notificaciones.js - avisos armados con el progreso real
   del usuario (racha, XP, siguiente módulo, Premium).
   ========================================================== */

const usuarioAvisos = Datos.usuarioActual();
if (!usuarioAvisos) {
  window.location.replace("index.html");
}

document.addEventListener("DOMContentLoaded", function () {
  if (!usuarioAvisos) return;

  const p = usuarioAvisos.progreso;
  const lista = document.getElementById("lista-notificaciones");
  const avisos = [];

  // 1) Racha
  avisos.push({
    icono: "flama", color: "naranja",
    titulo: "¡Llevas " + p.rachaDias + (p.rachaDias === 1 ? " día" : " días") + " de racha!",
    texto: "Haz una lección hoy para no perderla.",
    cuando: "Hoy",
    enlace: { texto: "Seguir aprendiendo", href: "curso.html" }
  });

  // 2) Siguiente módulo del último curso abierto
  const curso = Cursos.buscarCurso(p.ultimoCurso) || CURSOS[0];
  const avance = Cursos.resumen(curso, p);
  if (avance.actual) {
    avisos.push({
      icono: "libro", color: "azul",
      titulo: "Te espera el Módulo " + avance.actual.numero,
      texto: curso.titulo + " · " + avance.actual.modulo.titulo,
      cuando: "Hoy",
      enlace: { texto: "Abrir curso", href: "curso.html?id=" + curso.id }
    });
  }

  // 3) XP para el siguiente nivel
  avisos.push({
    icono: "estrella", color: "verde",
    titulo: "Te faltan " + (Datos.XP_POR_NIVEL - p.xp) + " XP para el Nivel " + (p.nivel + 1),
    texto: "Cada lección terminada te da XP.",
    cuando: "Ayer"
  });

  // 4) Premium
  if (Datos.esPremium()) {
    avisos.push({
      icono: "medalla", color: "ciruela",
      titulo: "¡Bienvenido a Premium!",
      texto: "Ya tienes todos los cursos, vidas ilimitadas y certificados.",
      cuando: usuarioAvisos.premiumDesde || "Hoy"
    });
  } else {
    avisos.push({
      icono: "medalla", color: "ciruela",
      titulo: "Desbloquea C++ y más con Premium",
      texto: "Todos los cursos, certificados y sin anuncios.",
      cuando: "Esta semana",
      enlace: { texto: "Ver planes", href: "planes.html" }
    });
  }

  // 5) Curso nuevo
  avisos.push({
    icono: "codigo", color: "azul",
    titulo: "Próximamente: JavaScript",
    texto: "Estamos preparando un curso nuevo para crear páginas web.",
    cuando: "Esta semana",
    enlace: { texto: "Ver todos los cursos", href: "cursos.html" }
  });

  // Dibujar la lista (textContent para que ningún texto se meta como HTML)
  avisos.forEach(function (aviso) {
    const li = document.createElement("li");
    li.className = "notificacion";
    li.innerHTML =
      '<span class="caja-icono ' + aviso.color + '">' + crearIcono(aviso.icono) + "</span>" +
      '<div class="texto"><strong></strong><p></p><time></time></div>';

    li.querySelector("strong").textContent = aviso.titulo;
    li.querySelector("p").textContent = aviso.texto;
    li.querySelector("time").textContent = aviso.cuando;

    if (aviso.enlace) {
      const a = document.createElement("a");
      a.href = aviso.enlace.href;
      a.textContent = aviso.enlace.texto + " →";
      li.querySelector(".texto").insertBefore(a, li.querySelector("time"));
    }
    lista.appendChild(li);
  });

  // Ya se vieron: se apaga el puntito rojo de la campana en Inicio.
  try { localStorage.setItem("codeamigo.avisosVistos", new Date().toDateString()); } catch (e) { /* nada */ }
});
