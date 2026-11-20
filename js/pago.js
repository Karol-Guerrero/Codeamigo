/* ==========================================================
   pago.js - Integración de Mercado Pago (Checkout Bricks).

   SOLO va aquí la Public Key (segura para el navegador).
   El Access Token (secreto) NUNCA va en este archivo ni en
   ningún .html — vive solo en scripts/ y se usa desde la
   terminal. Ver scripts/crear_preferencia.sh y
   scripts/reembolso.sh.
   ========================================================== */

const CONFIG_PAGO = {
  // Credencial de prueba de Mercado Pago (clave pública, segura para el navegador)
  PUBLIC_KEY: "APP_USR-e5e92048-8f1f-456a-bf2b-b620c61c7164",

  // La obtienes al correr scripts/crear_preferencia.sh (te
  // imprime un "id" en la respuesta). Pégalo aquí.
  PREFERENCE_ID: "3856150216-96b53367-ca70-4e05-9a22-9f5259ed4075"
};

(function () {
  const yaConfigurado =
    CONFIG_PAGO.PUBLIC_KEY.indexOf("AQUI") === -1 &&
    CONFIG_PAGO.PREFERENCE_ID.indexOf("AQUI") === -1;

  if (!yaConfigurado) {
    document.getElementById("aviso-config").hidden = false;
    return;
  }

  const mp = new MercadoPago(CONFIG_PAGO.PUBLIC_KEY, { locale: "es-MX" });
  const bricksBuilder = mp.bricks();

  bricksBuilder.create("wallet", "walletBrick_container", {
    initialization: {
      preferenceId: CONFIG_PAGO.PREFERENCE_ID
    },
    customization: {
      texts: { valueProp: "smart_option" }
    }
  });
})();
