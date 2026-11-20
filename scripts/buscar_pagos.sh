#!/usr/bin/env bash
# ==========================================================
# Lista tus pagos de prueba más recientes (el más nuevo primero)
# para encontrar el "id" del pago de $5.00 que acabas de hacer
# en pago.html, y así poder reembolsarlo con reembolso.sh
#
# Uso:
#   ACCESS_TOKEN=TEST-xxxxxxxx ./buscar_pagos.sh
# ==========================================================
set -e

if [ -z "$ACCESS_TOKEN" ]; then
  echo "Falta el Access Token de prueba."
  echo "Uso: ACCESS_TOKEN=TEST-xxxxxxxx ./buscar_pagos.sh"
  exit 1
fi

curl -s -G "https://api.mercadopago.com/v1/payments/search" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  --data-urlencode "sort=date_created" \
  --data-urlencode "criteria=desc" \
  --data-urlencode "limit=5" \
  | python3 -c "
import json, sys
data = json.load(sys.stdin)
for p in data.get('results', []):
    print(f\"id={p['id']}  estado={p['status']}  monto={p['transaction_amount']}  fecha={p['date_created']}\")
"
