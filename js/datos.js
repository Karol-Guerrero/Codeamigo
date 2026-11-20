/* ==========================================================
   datos.js - TODO lo que tiene que ver con guardar y leer
   información vive en este archivo.

   Por ahora las cuentas se guardan en el navegador (localStorage),
   o sea que son cuentas de prueba: solo existen en este navegador.

   Cuando la app tenga servidor (y los pagos con Mercado Pago),
   solo se cambia lo de adentro de estas funciones; las pantallas
   no se tocan porque siempre piden las cosas a "Datos".
   ========================================================== */
const Datos = (function () {
  const CLAVE_USUARIOS = "codeamigo.usuarios";
  const CLAVE_SESION = "codeamigo.sesion";
  const CLAVE_VIDAS = "codeamigo.vidas";
  const CLAVE_RECARGO_VIDAS = "codeamigo.ultimoRecargoVidas";

  // Cada nivel se completa con 1000 XP.
  const XP_POR_NIVEL = 1000;

  // Vidas de la cuenta Free (Premium tiene vidas ilimitadas).
  const VIDAS_MAXIMAS = 5;

  // Progreso con el que empieza una cuenta nueva.
  // Es el punto de partida del diseño de Figma: Nivel 3, 420 XP,
  // racha de 3 días y los dos primeros módulos de Python terminados.
  // De aquí en adelante todo lo que se gana es real.
  function progresoInicial() {
    return {
      nivel: 3,
      xp: 420,
      rachaDias: 3,
      estrellas: 4,
      ultimoDia: null,                       // último día que se hizo una lección
      modulosCompletados: ["python-1", "python-2"],
      leccionesCompletadas: [],
      ultimoCurso: "python"                  // curso que abre el botón "Aprender"
    };
  }

  /* ---------- Ayudas para leer y guardar ---------- */
  function leer(clave, porDefecto) {
    try {
      const texto = localStorage.getItem(clave);
      return texto ? JSON.parse(texto) : porDefecto;
    } catch (e) {
      return porDefecto;
    }
  }

  function guardar(clave, valor) {
    try {
      localStorage.setItem(clave, JSON.stringify(valor));
      return true;
    } catch (e) {
      return false;
    }
  }

  function limpiarCorreo(correo) {
    return String(correo || "").trim().toLowerCase();
  }

  // Si una cuenta se creó con una versión anterior de la app,
  // le faltan datos nuevos. Aquí se le agregan sin borrar lo que ya tenía.
  function completarProgreso(progreso) {
    const base = progresoInicial();
    progreso = progreso || {};
    for (const campo in base) {
      if (progreso[campo] === undefined) progreso[campo] = base[campo];
    }
    delete progreso.ruta;          // datos de la Etapa 1 que ya no se usan
    delete progreso.recompensa;
    return progreso;
  }

  // Fecha en formato 2026-11-17 (para comparar días de la racha).
  function fechaDe(dia) {
    return dia.getFullYear() + "-" +
      String(dia.getMonth() + 1).padStart(2, "0") + "-" +
      String(dia.getDate()).padStart(2, "0");
  }

  // La contraseña NO se guarda tal cual: se guarda una "huella" (hash).
  // Esto es solo para la versión de prueba; la seguridad de verdad
  // se hará en el servidor.
  async function huella(correo, contrasena) {
    const texto = correo + "|" + contrasena;
    if (window.crypto && window.crypto.subtle) {
      const bytes = new TextEncoder().encode(texto);
      const resultado = await window.crypto.subtle.digest("SHA-256", bytes);
      return Array.from(new Uint8Array(resultado))
        .map(function (b) { return b.toString(16).padStart(2, "0"); })
        .join("");
    }
    // Respaldo sencillo si el navegador no permite lo de arriba.
    let h = 5381;
    for (let i = 0; i < texto.length; i++) {
      h = ((h << 5) + h + texto.charCodeAt(i)) >>> 0;
    }
    return "r" + h.toString(16);
  }

  /* ---------- Cuentas ---------- */

  // Crea una cuenta. Regresa { ok: true } o { ok: false, error: "..." }
  async function registrar(nombre, correo, contrasena) {
    const usuarios = leer(CLAVE_USUARIOS, []);
    const correoLimpio = limpiarCorreo(correo);

    const yaExiste = usuarios.some(function (u) { return u.correo === correoLimpio; });
    if (yaExiste) {
      return { ok: false, error: "Ya existe una cuenta con ese correo." };
    }

    usuarios.push({
      nombre: nombre.trim(),
      correo: correoLimpio,
      huella: await huella(correoLimpio, contrasena),
      progreso: progresoInicial()
    });

    if (!guardar(CLAVE_USUARIOS, usuarios)) {
      return { ok: false, error: "No se pudo guardar la cuenta en este navegador." };
    }
    guardar(CLAVE_SESION, correoLimpio);
    recargarVidasDe(correoLimpio);          // cuenta nueva: 5 vidas
    return { ok: true };
  }

  // Inicia sesión con correo (o nombre) y contraseña.
  async function iniciarSesion(correoONombre, contrasena) {
    const usuarios = leer(CLAVE_USUARIOS, []);
    const buscado = limpiarCorreo(correoONombre);

    const usuario = usuarios.find(function (u) {
      return u.correo === buscado || u.nombre.toLowerCase() === buscado;
    });

    if (!usuario || usuario.huella !== await huella(usuario.correo, contrasena)) {
      return { ok: false, error: "Correo o contraseña incorrectos." };
    }

    guardar(CLAVE_SESION, usuario.correo);
    recargarSiEsOtroDia(usuario.correo);    // primer login del día: vidas llenas
    return { ok: true };
  }

  function cerrarSesion() {
    try { localStorage.removeItem(CLAVE_SESION); } catch (e) { /* nada */ }
  }

  // Regresa el usuario que tiene la sesión abierta, o null si no hay.
  function usuarioActual() {
    const correo = leer(CLAVE_SESION, null);
    if (!correo) return null;
    const usuarios = leer(CLAVE_USUARIOS, []);
    const usuario = usuarios.find(function (u) { return u.correo === correo; });
    if (!usuario) return null;
    usuario.progreso = completarProgreso(usuario.progreso);
    return usuario;
  }

  // Guarda los cambios de un usuario en la lista de cuentas.
  function guardarUsuario(usuario) {
    const usuarios = leer(CLAVE_USUARIOS, []);
    const lugar = usuarios.findIndex(function (u) { return u.correo === usuario.correo; });
    if (lugar === -1) return false;
    usuarios[lugar] = usuario;
    return guardar(CLAVE_USUARIOS, usuarios);
  }

  /* ---------- Progreso ---------- */

  // Recuerda cuál fue el último curso que se abrió.
  function recordarCurso(idCurso) {
    const usuario = usuarioActual();
    if (!usuario) return;
    usuario.progreso.ultimoCurso = idCurso;
    guardarUsuario(usuario);
  }

  // Se llama al terminar una lección. Suma XP, sube de nivel si toca
  // y actualiza la racha. Regresa lo que pasó para poder mostrarlo.
  function completarLeccion(idLeccion, xpDeLaLeccion) {
    const usuario = usuarioActual();
    if (!usuario) return { ok: false };
    const progreso = usuario.progreso;

    // Si ya la había hecho, se puede repasar pero no vuelve a dar XP.
    if (progreso.leccionesCompletadas.includes(idLeccion)) {
      return { ok: true, repetida: true, xpGanado: 0, subioDeNivel: false, progreso: progreso };
    }

    progreso.leccionesCompletadas.push(idLeccion);

    // XP y nivel
    progreso.xp += xpDeLaLeccion;
    let subioDeNivel = false;
    while (progreso.xp >= XP_POR_NIVEL) {
      progreso.xp -= XP_POR_NIVEL;
      progreso.nivel += 1;
      subioDeNivel = true;
    }

    // Racha: sube si es la primera lección de hoy y ayer (o antes de
    // empezar a contar) también hubo actividad; si se saltó un día,
    // vuelve a empezar en 1.
    const hoy = fechaDe(new Date());
    const ayer = new Date();
    ayer.setDate(ayer.getDate() - 1);

    if (progreso.ultimoDia !== hoy) {
      const sigueLaRacha = progreso.ultimoDia === null || progreso.ultimoDia === fechaDe(ayer);
      progreso.rachaDias = sigueLaRacha ? progreso.rachaDias + 1 : 1;
      progreso.estrellas = sigueLaRacha ? Math.min(5, progreso.estrellas + 1) : 1;
      progreso.ultimoDia = hoy;
    }

    if (!guardarUsuario(usuario)) return { ok: false };
    return { ok: true, repetida: false, xpGanado: xpDeLaLeccion, subioDeNivel: subioDeNivel, progreso: progreso };
  }

  /* ---------- Recuperar contraseña (Etapa 4) ----------
     Como todavía no hay servidor, no se puede mandar un correo de
     verdad. Por eso la pantalla de recuperar primero revisa que la
     cuenta exista y luego deja poner una contraseña nueva. */
  function existeCuenta(correo) {
    const usuarios = leer(CLAVE_USUARIOS, []);
    const buscado = limpiarCorreo(correo);
    return usuarios.some(function (u) { return u.correo === buscado; });
  }

  async function cambiarContrasena(correo, nueva) {
    const usuarios = leer(CLAVE_USUARIOS, []);
    const buscado = limpiarCorreo(correo);
    const usuario = usuarios.find(function (u) { return u.correo === buscado; });
    if (!usuario) return { ok: false, error: "No encontramos una cuenta con ese correo." };
    usuario.huella = await huella(usuario.correo, nueva);
    if (!guardar(CLAVE_USUARIOS, usuarios)) {
      return { ok: false, error: "No se pudo guardar la contraseña nueva." };
    }
    return { ok: true };
  }

  /* ---------- Plan Premium (Etapa 4) ----------
     Por ahora se activa después del pago de prueba. Cuando haya
     servidor, esto lo decidirá el servidor al confirmar el pago
     con Mercado Pago (nunca el navegador solo). */
  function esPremium() {
    const usuario = usuarioActual();
    return !!(usuario && usuario.plan === "premium");
  }

  function activarPremium() {
    const usuario = usuarioActual();
    if (!usuario) return false;
    usuario.plan = "premium";
    usuario.premiumDesde = fechaDe(new Date());
    return guardarUsuario(usuario);
  }

  function cancelarPremium() {
    const usuario = usuarioActual();
    if (!usuario) return false;
    usuario.plan = "free";
    delete usuario.premiumDesde;
    return guardarUsuario(usuario);
  }

  /* ---------- Vidas (Etapa 5) ----------
     - Free: 5 vidas. Se pierde 1 por cada respuesta incorrecta.
     - Se recargan completas una vez al día (al primer login del día,
       o al abrir una lección si la sesión quedó abierta desde ayer).
     - Premium: vidas ilimitadas (obtenerVidas regresa Infinity).
     En localStorage cada clave guarda un objeto por cuenta, para
     que dos cuentas en el mismo navegador no compartan vidas:
       codeamigo.vidas               { "karol@ejemplo.com": 4 }
       codeamigo.ultimoRecargoVidas  { "karol@ejemplo.com": "2026-11-19" } */

  // Lee una clave que debe ser un objeto; si trae otra cosa, regresa {}.
  function leerPorCuenta(clave) {
    const valor = leer(clave, {});
    return valor && typeof valor === "object" && !Array.isArray(valor) ? valor : {};
  }

  function recargarVidasDe(correo) {
    const vidas = leerPorCuenta(CLAVE_VIDAS);
    const recargos = leerPorCuenta(CLAVE_RECARGO_VIDAS);
    vidas[correo] = VIDAS_MAXIMAS;
    recargos[correo] = fechaDe(new Date());
    guardar(CLAVE_VIDAS, vidas);
    guardar(CLAVE_RECARGO_VIDAS, recargos);
  }

  // Solo recarga si hoy todavía no se ha recargado (así cerrar
  // sesión y volver a entrar no regala vidas).
  function recargarSiEsOtroDia(correo) {
    const recargos = leerPorCuenta(CLAVE_RECARGO_VIDAS);
    if (recargos[correo] !== fechaDe(new Date())) recargarVidasDe(correo);
  }

  // Cuántas vidas le quedan al usuario con sesión abierta.
  function obtenerVidas() {
    const usuario = usuarioActual();
    if (!usuario) return 0;
    if (usuario.plan === "premium") return Infinity;

    recargarSiEsOtroDia(usuario.correo);
    const vidas = leerPorCuenta(CLAVE_VIDAS)[usuario.correo];
    if (typeof vidas !== "number" || isNaN(vidas)) {
      recargarVidasDe(usuario.correo);
      return VIDAS_MAXIMAS;
    }
    return Math.max(0, Math.min(VIDAS_MAXIMAS, vidas));
  }

  // Quita 1 vida (nunca baja de 0). Regresa las vidas que quedan.
  function perderVida() {
    const usuario = usuarioActual();
    if (!usuario) return 0;
    if (usuario.plan === "premium") return Infinity;

    const quedan = Math.max(0, obtenerVidas() - 1);
    const vidas = leerPorCuenta(CLAVE_VIDAS);
    vidas[usuario.correo] = quedan;
    guardar(CLAVE_VIDAS, vidas);
    return quedan;
  }

  // Llena las vidas en este momento. Regresa las vidas que quedan.
  function recargarVidas() {
    const usuario = usuarioActual();
    if (!usuario) return 0;
    recargarVidasDe(usuario.correo);
    return obtenerVidas();
  }

  return {
    XP_POR_NIVEL: XP_POR_NIVEL,
    VIDAS_MAXIMAS: VIDAS_MAXIMAS,
    obtenerVidas: obtenerVidas,
    perderVida: perderVida,
    recargarVidas: recargarVidas,
    existeCuenta: existeCuenta,
    cambiarContrasena: cambiarContrasena,
    esPremium: esPremium,
    activarPremium: activarPremium,
    cancelarPremium: cancelarPremium,
    registrar: registrar,
    iniciarSesion: iniciarSesion,
    cerrarSesion: cerrarSesion,
    usuarioActual: usuarioActual,
    recordarCurso: recordarCurso,
    completarLeccion: completarLeccion
  };
})();
