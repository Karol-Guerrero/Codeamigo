/* ==========================================================
   leccion.js - lo que pasa dentro de una lección:
   muestra los pasos uno por uno y al final suma el XP.
   ========================================================== */

const usuario = Datos.usuarioActual();

if (!usuario) {
  window.location.replace("index.html");
}

document.addEventListener("DOMContentLoaded", function () {
  if (!usuario) return;

  // La dirección es leccion.html?id=cond-1&curso=python
  const parametros = new URLSearchParams(window.location.search);
  const encontrada = Cursos.buscarLeccion(parametros.get("id"));
  const curso = Cursos.buscarCurso(parametros.get("curso")) || CURSOS[0];
  const direccionCurso = "curso.html?id=" + curso.id;

  // Si la lección no existe, se regresa al curso.
  if (!encontrada) {
    window.location.replace(direccionCurso);
    return;
  }

  const leccion = encontrada.leccion;

  // Las lecciones van en orden: no se puede abrir una si no se
  // han terminado las anteriores.
  const hechas = encontrada.grupo.filter(function (l) {
    return usuario.progreso.leccionesCompletadas.includes(l.id);
  }).length;

  if (encontrada.posicion > hechas) {
    window.location.replace(direccionCurso);
    return;
  }

  const zona = document.getElementById("paso");
  const respuesta = document.getElementById("respuesta");
  const boton = document.getElementById("boton-paso");
  const botonVolver = document.getElementById("boton-volver");
  const barra = document.getElementById("avance-leccion");
  const zonaVidas = document.getElementById("vidas");

  document.title = "Codeamigo - " + leccion.titulo;
  document.getElementById("salir").href = direccionCurso;
  botonVolver.href = direccionCurso;
  document.getElementById("xp-leccion").textContent = "+" + leccion.xp + " XP";

  let numeroDePaso = 0;       // en qué paso vamos
  let opcionElegida = null;   // opción marcada en una pregunta
  let yaAcerto = false;       // si ya contestó bien la pregunta actual
  let sinVidas = false;       // si se acabaron las vidas en esta lección

  // Crea un elemento con su clase y su texto.
  function crear(etiqueta, clase, texto) {
    const elemento = document.createElement(etiqueta);
    if (clase) elemento.className = clase;
    if (texto) elemento.textContent = texto;
    return elemento;
  }

  // Dibuja los corazones del encabezado. Si "animar" es true, el
  // corazón que se acaba de perder hace una animación.
  // Regresa cuántas vidas quedan (Infinity si es Premium).
  function pintarVidas(animar) {
    const vidas = Datos.obtenerVidas();
    zonaVidas.replaceChildren();

    if (vidas === Infinity) {
      zonaVidas.classList.add("ilimitadas");
      zonaVidas.append(crear("span", "corazon", "❤️"), crear("span", "infinito", "∞"));
      zonaVidas.setAttribute("aria-label", "Vidas ilimitadas (Premium)");
      return vidas;
    }

    for (let i = 0; i < Datos.VIDAS_MAXIMAS; i++) {
      let clase = "corazon";
      if (i >= vidas) clase += " vacio";
      if (animar && i === vidas) clase += " se-rompe";
      zonaVidas.appendChild(crear("span", clase, "❤️"));
    }
    zonaVidas.setAttribute("aria-label", "Vidas: " + vidas + " de " + Datos.VIDAS_MAXIMAS);
    return vidas;
  }

  // Pantalla de "te quedaste sin vidas".
  function mostrarSinVidas() {
    sinVidas = true;
    zona.replaceChildren();
    zona.classList.add("final");
    respuesta.hidden = true;

    zona.appendChild(crear("div", "corazon-grande", "💔"));
    zona.appendChild(crear("h1", "", "¡Te quedaste sin vidas!"));
    zona.appendChild(crear("p", "", "Tus " + Datos.VIDAS_MAXIMAS +
      " vidas se recargan mañana al iniciar sesión. Mientras, puedes revisar tu progreso y tus logros."));

    const premium = crear("a", "boton principal", "Vidas ilimitadas con Premium");
    premium.href = "planes.html";
    zona.appendChild(premium);

    boton.hidden = true;
    botonVolver.hidden = false;
  }

  function crearCodigo(texto) {
    const caja = crear("pre", "codigo mono");
    caja.appendChild(crear("code", "", texto));
    return caja;
  }

  // Dibuja el paso en el que vamos.
  function mostrarPaso() {
    const paso = leccion.pasos[numeroDePaso];

    zona.replaceChildren();
    respuesta.hidden = true;
    opcionElegida = null;
    yaAcerto = false;
    barra.style.width = Math.round((numeroDePaso / leccion.pasos.length) * 100) + "%";
    window.scrollTo(0, 0);

    if (paso.tipo === "explicacion") {
      zona.appendChild(crear("p", "ceja-leccion", leccion.titulo));
      zona.appendChild(crear("h1", "", paso.titulo));
      paso.parrafos.forEach(function (texto) {
        zona.appendChild(crear("p", "", texto));
      });
      if (paso.codigo) zona.appendChild(crearCodigo(paso.codigo));

      boton.textContent = "Continuar";
      boton.disabled = false;
      return;
    }

    // Paso de tipo "pregunta"
    zona.appendChild(crear("p", "ceja-leccion", "Pregunta"));
    zona.appendChild(crear("h1", "", paso.pregunta));
    if (paso.codigo) zona.appendChild(crearCodigo(paso.codigo));

    const opciones = crear("div", "opciones");
    paso.opciones.forEach(function (texto, numero) {
      const opcion = crear("button", "opcion", texto);
      opcion.type = "button";
      opcion.setAttribute("aria-pressed", "false");

      opcion.addEventListener("click", function () {
        if (yaAcerto || sinVidas) return;
        opcionElegida = numero;
        respuesta.hidden = true;

        opciones.querySelectorAll(".opcion").forEach(function (otra) {
          otra.classList.remove("elegida", "incorrecta");
          otra.setAttribute("aria-pressed", "false");
        });
        opcion.classList.add("elegida");
        opcion.setAttribute("aria-pressed", "true");

        boton.textContent = "Comprobar";
        boton.disabled = false;
      });

      opciones.appendChild(opcion);
    });
    zona.appendChild(opciones);

    boton.textContent = "Comprobar";
    boton.disabled = true;
  }

  // Revisa la respuesta de una pregunta.
  function comprobar() {
    const paso = leccion.pasos[numeroDePaso];
    const opciones = zona.querySelectorAll(".opcion");
    const elegida = opciones[opcionElegida];

    elegida.classList.remove("elegida");

    if (opcionElegida === paso.correcta) {
      yaAcerto = true;
      elegida.classList.add("correcta");
      respuesta.className = "respuesta bien";
      respuesta.textContent = "¡Correcto! " + paso.explicacion;
      boton.textContent = "Continuar";
    } else {
      elegida.classList.add("incorrecta");
      respuesta.className = "respuesta mal";

      // Respuesta incorrecta: se pierde 1 vida (Premium no pierde).
      const quedan = Datos.perderVida();
      pintarVidas(true);

      if (quedan === 0) {
        sinVidas = true;
        respuesta.textContent = "Esa no era. Te quedaste sin vidas por hoy.";
        boton.textContent = "Continuar";
        boton.disabled = false;
      } else {
        let texto = "Casi. Revisa el ejemplo y elige otra opción.";
        if (quedan !== Infinity) {
          texto += quedan === 1 ? " Perdiste una vida: te queda 1." : " Perdiste una vida: te quedan " + quedan + ".";
        }
        respuesta.textContent = texto;
        boton.disabled = true;
      }
    }
    respuesta.hidden = false;
  }

  // Pantalla final: guarda el progreso y muestra lo que se ganó.
  function terminar() {
    const resultado = Datos.completarLeccion(leccion.id, leccion.xp);

    zona.replaceChildren();
    zona.classList.add("final");
    respuesta.hidden = true;
    barra.style.width = "100%";

    if (!resultado.ok) {
      zona.appendChild(crear("h1", "", "No se pudo guardar tu avance"));
      zona.appendChild(crear("p", "", "Revisa que tu navegador permita guardar datos e inténtalo de nuevo."));
      boton.hidden = true;
      botonVolver.hidden = false;
      return;
    }

    const progreso = resultado.progreso;

    const mascota = document.createElement("img");
    mascota.className = "mascota";
    mascota.src = "img/mascota.png";
    mascota.alt = "";
    mascota.dataset.respaldo = "mascota-respaldo";
    zona.appendChild(mascota);
    revisarImagenes();

    zona.appendChild(crear("h1", "", "¡Lección completada!"));

    let mensaje = "Terminaste «" + leccion.titulo + "».";
    if (resultado.repetida) {
      mensaje += " Como ya la habías hecho antes, esta vez no suma XP.";
    } else if (resultado.subioDeNivel) {
      mensaje += " ¡Y subiste al nivel " + progreso.nivel + "!";
    }
    zona.appendChild(crear("p", "", mensaje));

    // Tres cuadritos: XP ganado, racha y nivel.
    const logros = crear("div", "logros-leccion");
    [
      ["+" + resultado.xpGanado + " XP", "ganados"],
      [progreso.rachaDias + (progreso.rachaDias === 1 ? " día" : " días"), "de racha"],
      ["Nivel " + progreso.nivel, progreso.xp + " XP"]
    ].forEach(function (dato) {
      const cuadro = crear("div", "logro");
      cuadro.appendChild(crear("strong", "", dato[0]));
      cuadro.appendChild(crear("small", "", dato[1]));
      logros.appendChild(cuadro);
    });
    zona.appendChild(logros);

    // ¿Hay otra lección después de esta?
    const siguiente = encontrada.grupo[encontrada.posicion + 1];
    botonVolver.hidden = false;

    if (siguiente) {
      boton.textContent = "Siguiente lección";
      boton.disabled = false;
      boton.onclick = function () {
        window.location.href = "leccion.html?id=" + siguiente.id + "&curso=" + curso.id;
      };
    } else {
      boton.hidden = true;
      zona.appendChild(crear("p", "nota", "¡Completaste todas las lecciones de este módulo!"));
    }
  }

  // El botón de abajo hace cosas distintas según el momento.
  boton.addEventListener("click", function () {
    if (sinVidas) {        // se acabaron las vidas: no se puede seguir
      mostrarSinVidas();
      return;
    }

    const paso = leccion.pasos[numeroDePaso];
    if (!paso) return;     // ya estamos en la pantalla final

    if (paso.tipo === "pregunta" && !yaAcerto) {
      comprobar();
      return;
    }

    numeroDePaso += 1;
    if (numeroDePaso < leccion.pasos.length) {
      mostrarPaso();
    } else {
      terminar();
    }
  });

  // Si ya no hay vidas, ni siquiera empieza la lección.
  if (pintarVidas(false) === 0) {
    mostrarSinVidas();
  } else {
    mostrarPaso();
  }
});
