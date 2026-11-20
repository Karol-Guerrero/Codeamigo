#!/usr/bin/env bash
# ==========================================================
# Crea la preferencia de pago de prueba ($5.00 MXN) en Mercado
# Pago. Esto se corre UNA VEZ (o cada vez que quieras una
# preferencia nueva), desde la terminal, nunca desde el navegador.
#
# Uso:
#   ACCESS_TOKEN=TEST-xxxxxxxx ./crear_preferencia.sh
#
# El resultado trae un campo "id": ese valor se pega en
# js/pago.js, en CONFIG_PAGO.PREFERENCE_ID
# ==========================================================
set -e

if [ -z "$ACCESS_TOKEN" ]; then
  echo "Falta el Access Token de prueba."
  echo "Uso: ACCESS_TOKEN=TEST-xxxxxxxx ./crear_preferencia.sh"
  exit 1
fi

curl -s -X POST "https://api.mercadopago.com/checkout/preferences" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {
        "title": "Prueba de integracion - Codeamigo Premium",
        "quantity": 1,
        "unit_price": 5.00,
        "currency_id": "MXN"
      }
    ],
    "back_urls": {
      "success": "https://www.mercadopago.com.mx",
      "failure": "https://www.mercadopago.com.mx",
      "pending": "https://www.mercadopago.com.mx"
    }
  }' | python3 -m json.tool
