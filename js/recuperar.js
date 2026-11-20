/* ==========================================================
   recuperar.js - pantalla de "¿Olvidaste tu contraseña?"
   Paso 1: revisa que exista una cuenta con ese correo.
   Paso 2: guarda la contraseña nueva.
   ========================================================== */

document.addEventListener("DOMContentLoaded", function () {
  const pasoCorreo = document.getElementById("paso-correo");
  const pasoNueva = document.getElementById("paso-nueva");
  const pasoListo = document.getElementById("paso-listo");

  const correo = document.getElementById("correo");
  const errorCorreo = document.getElementById("error-correo");
  const nueva = document.getElementById("nueva");
  const confirmar = document.getElementById("confirmar");
  const errorNueva = document.getElementById("error-nueva");

  let correoElegido = "";

  function mostrarError(caja, texto) {
    caja.textContent = texto;
    caja.hidden = false;
  }

  // --- Paso 1 ---
  document.getElementById("formulario-correo").addEventListener("submit", function (evento) {
    evento.preventDefault();
    errorCorreo.hidden = true;

    const valor = correo.value.trim();
    if (valor === "" || !valor.includes("@")) {
      mostrarError(errorCorreo, "Escribe un correo válido.");
      return;
    }
    if (!Datos.existeCuenta(valor)) {
      mostrarError(errorCorreo, "No encontramos una cuenta con ese correo.");
      return;
    }

    correoElegido = valor;
    document.getElementById("correo-elegido").textContent = valor.toLowerCase();
    pasoCorreo.hidden = true;
    pasoNueva.hidden = false;
    nueva.focus();
  });

  // --- Paso 2 ---
  document.getElementById("formulario-nueva").addEventListener("submit", async function (evento) {
    evento.preventDefault();
    errorNueva.hidden = true;

    if (nueva.value.length < 8) {
      mostrarError(errorNueva, "La contraseña debe tener al menos 8 caracteres.");
      return;
    }
    if (nueva.value !== confirmar.value) {
      mostrarError(errorNueva, "Las dos contraseñas no son iguales.");
      return;
    }

    const resultado = await Datos.cambiarContrasena(correoElegido, nueva.value);
    if (!resultado.ok) {
      mostrarError(errorNueva, resultado.error);
      return;
    }

    pasoNueva.hidden = true;
    pasoListo.hidden = false;
  });
});
