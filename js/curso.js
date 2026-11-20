/* ==========================================================
   curso.js - lo que pasa en la pantalla de un curso
   (Python, Estructuras de control o C++)
   ========================================================== */

const usuario = Datos.usuarioActual();

if (!usuario) {
  window.location.replace("index.html");
}

// Textos de cada estado de un módulo.
const ESTADOS_MODULO = {
  "completado": { texto: "COMPLETADO", icono: "palomita" },
  "actual": { texto: "ESTÁS AQUÍ", icono: "reproducir" },
  "bloqueado": { texto: "BLOQUEADO", icono: "candado" }
};

function dosDigitos(numero) {
  return String(numero).padStart(2, "0");
}

document.addEventListener("DOMContentLoaded", function () {
  if (!usuario) return;

  const progreso = usuario.progreso;

  // ¿Qué curso toca mostrar? El de la dirección (curso.html?id=python);
  // si no viene, el último que se abrió.
  const idPedido = new URLSearchParams(window.location.search).get("id");
  const curso = Cursos.buscarCurso(idPedido) ||
    Cursos.buscarCurso(progreso.ultimoCurso) ||
    CURSOS[0];

  Datos.recordarCurso(curso.id);

  const avance = Cursos.resumen(curso, progreso);
  const primerNombre = usuario.nombre.split(" ")[0];
  const esLista = curso.diseno === "lista";

  document.title = "Codeamigo - " + curso.titulo;
  document.getElementById("app").classList.add(curso.tema);

  // --- Etiqueta de arriba a la derecha ---
  const chip = document.getElementById("chip");
  if (curso.chip) {
    chip.classList.add("lila");
    chip.innerHTML = crearIcono("matraz");
    chip.append(curso.chip);
  } else {
    chip.innerHTML = crearIcono("flama");
    chip.append(progreso.rachaDias + (progreso.rachaDias === 1 ? " día" : " días"));
  }

  // --- Portada ---
  document.getElementById("curso-ruta").textContent = curso.ruta;
  document.getElementById("curso-lema").textContent = curso.lema;

  const titulo = document.getElementById("curso-titulo");
  if (curso.icono) titulo.innerHTML = crearIcono(curso.icono);
  titulo.append(curso.titulo);

  if (curso.letra) {
    // En vez de la mascota, un cuadro con la letra del lenguaje.
    const cuadro = document.createElement("div");
    cuadro.className = "letra-curso";
    cuadro.textContent = curso.letra;
    document.getElementById("curso-imagen").replaceChildren(cuadro);
  }

  if (curso.terminal) {
    const terminal = document.getElementById("terminal");
    const lineas = document.createElement("div");
    curso.terminal.forEach(function (texto) {
      const linea = document.createElement("div");
      linea.textContent = texto;
      lineas.appendChild(linea);
    });
    const marca = document.createElement("span");
    marca.className = "tenue";
    marca.textContent = curso.letra + " / 01";
    terminal.append(lineas, marca);
    terminal.hidden = false;
  }

  // --- Avance ---
  const porcentaje = Math.round((avance.completados / avance.modulos.length) * 100);

  if (esLista) {
    document.getElementById("avance").hidden = true;
    document.getElementById("mapa-etiqueta").textContent =
      avance.completados + "/" + avance.modulos.length + " · " + (avance.bloqueado ? 0 : progreso.xp) + " XP";
  } else {
    document.getElementById("avance-texto").textContent =
      avance.completados + " de " + avance.modulos.length + " módulos completados";
    document.getElementById("avance-xp").textContent = progreso.xp + " XP";
    document.getElementById("avance-barra").style.width = porcentaje + "%";
    document.getElementById("mapa-etiqueta").textContent = curso.etiquetaMapa;
  }

  document.getElementById("mapa-titulo").textContent = curso.tituloMapa;

  // --- Curso bloqueado ---
  if (avance.bloqueado) {
    document.getElementById("aviso-bloqueo").hidden = false;
    document.getElementById("aviso-bloqueo-texto").textContent = curso.textoBloqueo;

    const requisito = Cursos.buscarCurso(curso.requiere);
    const nota = document.getElementById("nota-bloqueo");
    nota.textContent = (avance.faltanDelRequisito === 1 ? "Te falta " : "Te faltan ") +
      Cursos.contarModulos(avance.faltanDelRequisito) +
      " de " + requisito.titulo + " para desbloquear " + curso.nombreCorto;
    nota.hidden = false;
  }

  // --- Módulos ---
  const lista = document.getElementById("modulos");
  lista.className = esLista ? "lista" : "mapa";

  avance.modulos.forEach(function (m) {
    const estado = ESTADOS_MODULO[m.estado];

    const paso = document.createElement("li");
    paso.className = "paso " + m.estado;

    const boton = document.createElement("button");
    boton.type = "button";

    if (esLista) {
      boton.innerHTML =
        '<span class="numero mono">' + dosDigitos(m.numero) + "</span>" +
        '<span class="caja-paso">' +
          '<span class="info"><strong></strong><span class="temas mono"></span></span>' +
          crearIcono(estado.icono) +
        "</span>";
    } else {
      boton.innerHTML =
        '<span class="columna"><span class="nodo">' + crearIcono(estado.icono) + "</span></span>" +
        '<span class="info">' +
          '<span class="ceja mono">' + dosDigitos(m.numero) + " / " + estado.texto + "</span>" +
          '<strong></strong><span class="temas mono"></span><span class="extra"></span>' +
        "</span>";
    }

    boton.querySelector("strong").textContent = m.modulo.titulo;
    boton.querySelector(".temas").textContent = m.modulo.temas;

    // Debajo del módulo actual: en qué lección va.
    const extra = boton.querySelector(".extra");
    if (extra && m.estado === "actual") {
      extra.textContent = m.siguiente
        ? "Lección " + (m.hechas + 1) + " de " + m.lecciones.length + " · +" + m.siguiente.xp + " XP"
        : "Próximamente";
    }

    boton.addEventListener("click", function () {
      if (m.estado === "bloqueado") {
        mostrarMensaje(avance.bloqueado
          ? "Este curso todavía está bloqueado."
          : "Completa el módulo anterior para desbloquear este.");
      } else if (m.estado === "actual" && m.siguiente) {
        window.location.href = "leccion.html?id=" + m.siguiente.id + "&curso=" + curso.id;
      } else if (m.estado === "completado" && m.lecciones.length > 0) {
        // Módulo terminado: se puede repasar desde la primera lección.
        window.location.href = "leccion.html?id=" + m.lecciones[0].id + "&curso=" + curso.id;
      } else if (m.estado === "completado") {
        mostrarMensaje("¡Ya completaste este módulo!");
      } else {
        mostrarMensaje("Estamos preparando las lecciones de este módulo.");
      }
    });

    paso.appendChild(boton);
    lista.appendChild(paso);
  });

  // --- Aviso amarillo ---
  const avisoIcono = document.getElementById("aviso-icono");
  const avisoTitulo = document.getElementById("aviso-titulo");
  const avisoTexto = document.getElementById("aviso-texto");

  if (curso.retoFinal) {
    avisoIcono.innerHTML = crearIcono("chip");
    avisoTitulo.textContent = curso.retoFinal.titulo;
    avisoTexto.textContent = curso.retoFinal.detalle;
  } else if (curso.insignia) {
    avisoIcono.innerHTML = crearIcono("medalla");
    avisoTitulo.textContent = curso.insignia;
    avisoTexto.textContent = avance.faltantes > 0
      ? "¡Solo " + Cursos.contarModulos(avance.faltantes) + " más para conseguirla!"
      : "¡Ya es tuya!";
  } else {
    avisoIcono.innerHTML = crearIcono("foco");
    avisoTitulo.textContent = "¡Paso a paso, " + primerNombre + "!";
    avisoTexto.textContent = avance.actual
      ? "Completa el módulo " + avance.actual.numero + " para desbloquear el siguiente."
      : "¡Terminaste todos los módulos!";
  }

  // --- Botón de continuar ---
  const continuar = document.getElementById("continuar");
  const continuarTitulo = document.getElementById("continuar-titulo");
  const continuarDetalle = document.getElementById("continuar-detalle");
  const filaReto = document.getElementById("fila-reto");
  const siguiente = avance.actual ? avance.actual.siguiente : null;

  function apagarBoton(tituloBoton, detalle) {
    continuar.classList.add("apagado");
    continuar.removeAttribute("href");
    continuar.setAttribute("aria-disabled", "true");
    continuarTitulo.textContent = tituloBoton;
    continuarDetalle.textContent = detalle;
    filaReto.hidden = true;
  }

  if (avance.bloqueado) {
    apagarBoton("Siguiente lección: " + avance.modulos[0].modulo.titulo, "Curso bloqueado");
  } else if (avance.estado === "completado") {
    apagarBoton("¡Curso completado!", "Terminaste todos los módulos");
  } else if (!siguiente) {
    apagarBoton("Próximamente", "Estamos preparando «" + avance.actual.modulo.titulo + "»");
  } else {
    continuar.href = "leccion.html?id=" + siguiente.id + "&curso=" + curso.id;
    continuarDetalle.textContent = siguiente.titulo;
    document.getElementById("reto-texto").textContent = avance.actual.modulo.reto || "";
    document.getElementById("reto-minutos").textContent = siguiente.minutos + " min";
  }
});
