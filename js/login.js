/* ==========================================================
   login.js - lo que pasa en la pantalla de Iniciar sesión
   ========================================================== */

// Si ya hay una sesión abierta, no tiene caso mostrar el login.
if (Datos.usuarioActual()) {
  window.location.replace("inicio.html");
}

document.addEventListener("DOMContentLoaded", function () {
  const formulario = document.getElementById("formulario-login");
  const correo = document.getElementById("correo");
  const contrasena = document.getElementById("contrasena");
  const errorGeneral = document.getElementById("error-general");
  const botonVer = document.getElementById("ver-contrasena");

  // Botón del ojito: muestra u oculta la contraseña.
  botonVer.addEventListener("click", function () {
    const oculta = contrasena.type === "password";
    contrasena.type = oculta ? "text" : "password";
    botonVer.innerHTML = crearIcono(oculta ? "ojo" : "ojo-cerrado");
    botonVer.setAttribute("aria-label", oculta ? "Ocultar contraseña" : "Mostrar contraseña");
  });

  document.getElementById("boton-ayuda").addEventListener("click", function () {
    mostrarMensaje("Usa el correo y la contraseña con los que creaste tu cuenta.");
  });

  // Al presionar INICIAR SESIÓN
  formulario.addEventListener("submit", async function (evento) {
    evento.preventDefault();          // evita que la página se recargue
    errorGeneral.hidden = true;

    if (correo.value.trim() === "" || contrasena.value === "") {
      errorGeneral.textContent = "Escribe tu correo y tu contraseña.";
      errorGeneral.hidden = false;
      return;
    }

    const resultado = await Datos.iniciarSesion(correo.value, contrasena.value);

    if (resultado.ok) {
      window.location.href = "inicio.html";
    } else {
      errorGeneral.textContent = resultado.error;
      errorGeneral.hidden = false;
    }
  });
});
