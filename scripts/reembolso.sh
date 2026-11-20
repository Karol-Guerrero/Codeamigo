#!/usr/bin/env bash
# ==========================================================
# Devuelve (reembolsa) un pago de prueba ya hecho.
# Corre esto DESPUÉS de pagar los $5.00 en pago.html y de
# encontrar el id del pago con buscar_pagos.sh
#
# Uso:
#   ACCESS_TOKEN=TEST-xxxxxxxx PAYMENT_ID=1234567890 ./reembolso.sh
# ==========================================================
set -e

if [ -z "$ACCESS_TOKEN" ] || [ -z "$PAYMENT_ID" ]; then
  echo "Faltan datos."
  echo "Uso: ACCESS_TOKEN=TEST-xxxxxxxx PAYMENT_ID=1234567890 ./reembolso.sh"
  exit 1
fi

curl -s -X POST "https://api.mercadopago.com/v1/payments/$PAYMENT_ID/refunds" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" | python3 -m json.tool
