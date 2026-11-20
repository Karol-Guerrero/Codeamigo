# Scripts de la prueba de pago

Estos scripts corren en la terminal (no en el navegador) porque usan el
**Access Token** de Mercado Pago, que es secreto y nunca debe estar en
el código de la página web.

Necesitas `curl` y `python3` (ya vienen en la mayoría de sistemas).

## Orden para la demo

1. **Crear la preferencia de pago** (una sola vez, antes de la expo):

   ```
   ACCESS_TOKEN=TEST-xxxxxxxx ./crear_preferencia.sh
   ```

   Copia el valor de `"id"` que te regresa y pégalo en
   `../js/pago.js`, en `CONFIG_PAGO.PREFERENCE_ID`. También pega ahí
   tu `PUBLIC_KEY` de prueba.

2. **Abrir `pago.html`** en el navegador y pagar los $5.00 MXN con una
   tarjeta de prueba de Mercado Pago (las tarjetas de prueba están en
   su documentación, dentro de "Cuentas y tarjetas de prueba").

3. **Buscar el pago** que se acaba de hacer:

   ```
   ACCESS_TOKEN=TEST-xxxxxxxx ./buscar_pagos.sh
   ```

   Copia el `id` del pago con `estado=approved`.

4. **Devolver el pago** (el "devolver 5 pesos" que pide el profe):

   ```
   ACCESS_TOKEN=TEST-xxxxxxxx PAYMENT_ID=el-id-de-arriba ./reembolso.sh
   ```

Todo esto es con dinero de prueba (sandbox): no se mueve dinero real
en ningún paso.
