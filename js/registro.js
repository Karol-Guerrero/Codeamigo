/* ==========================================================
   registro.js - lo que pasa en la pantalla Datos (crear cuenta)
   ========================================================== */

document.addEventListener("DOMContentLoaded", function () {
  const formulario = document.getElementById("formulario-registro");
  const errorGeneral = document.getElementById("error-general");

  // Muestra (o quita) el mensaje rojo debajo de un campo.
  function marcarError(idCampo, mensaje) {
    const campo = document.getElementById(idCampo);
    const texto = campo.querySelector(".error");
    campo.classList.toggle("con-error", mensaje !== "");
    texto.textContent = mensaje;
    texto.hidden = mensaje === "";
  }

  formulario.addEventListener("submit", async function (evento) {
    evento.preventDefault();
    errorGeneral.hidden = true;

    const nombre = document.getElementById("nombre").value.trim();
    const correo = document.getElementById("correo").value.trim();
    const contrasena = document.getElementById("contrasena").value;
    const confirmar = document.getElementById("confirmar").value;

    // Revisión de cada campo. Si el mensaje queda vacío, está bien.
    const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);

    const errores = {
      "campo-nombre": nombre === "" ? "Escribe tu nombre." : "",
      "campo-correo": correoValido ? "" : "Escribe un correo válido, por ejemplo karol@ejemplo.com.",
      "campo-contrasena": contrasena.length >= 8 ? "" : "La contraseña debe tener al menos 8 caracteres.",
      "campo-confirmar": confirmar === contrasena ? "" : "Las contraseñas no coinciden."
    };

    let hayErrores = false;
    for (const idCampo in errores) {
      marcarError(idCampo, errores[idCampo]);
      if (errores[idCampo] !== "") hayErrores = true;
    }
    if (hayErrores) return;

    const resultado = await Datos.registrar(nombre, correo, contrasena);

    if (resultado.ok) {
      window.location.href = "inicio.html";
    } else {
      errorGeneral.textContent = resultado.error;
      errorGeneral.hidden = false;
    }
  });
});
