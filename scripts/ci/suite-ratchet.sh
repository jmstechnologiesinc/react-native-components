#!/usr/bin/env bash
# Corre la suite de la biblioteca y compuerta con un ratchet.
#
# POR QUÉ IMPORTA AQUÍ. Esto es una biblioteca PUBLICADA: una rotura no se nota
# en este repositorio, se nota en la aplicación después de publicar, y para
# entonces ya viaja dentro de un `npm ci` ajeno. Es el mismo argumento por el
# que los paquetes compartidos ganaron su puerta antes que nadie.
#
# POR QUÉ RATCHET Y NO «VERDE». Una suite ya fallaba el 2026-09-17: el BARRIL,
# que nunca ha cargado bajo Jest. Está en `.github/known-suite-failures.txt` con
# su cadena medida y su último eslabón nombrado. Se exige «no peor que la lista
# registrada», que muerde en la primera rotura nueva.
set -uo pipefail

here="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
baseline="${1:-$here/.github/known-suite-failures.txt}"

if [ ! -f "$baseline" ]; then
    echo "FAIL: falta la lista registrada ($baseline). Un ratchet sin línea base no compuerta nada." >&2
    exit 2
fi

known="$(grep -vE '^\s*(#|$)' "$baseline" | awk '{print $1}' | sort -u)"

# `--listTests` no vale: una suite que revienta al construirse (C-4) también
# tiene que contarse, y sólo la corrida lo dice.
report="$(cd "$here" && npx jest --ci --silent 2>&1)"
failing="$(printf '%s\n' "$report" | grep -E '^FAIL ' | awk '{print $2}' | sort -u)"
# Se cuentan RUTAS ÚNICAS: jest imprime la cabecera `FAIL <ruta>` y la repite
# junto al detalle del fallo, así que contar líneas da más suites de las que
# hay -- 29 donde jest dice 26. Un recuento inflado no rompe la puerta, pero
# convierte el informe en algo que no se puede contrastar con la salida de al
# lado, y entonces deja de leerse.
ran="$(printf '%s\n' "$report" | grep -E '^(PASS|FAIL) ' | awk '{print $2}' | sort -u | wc -l | tr -d ' ')"

if [ "$ran" -eq 0 ]; then
    echo "FAIL: no se ejecutó ninguna suite. No hubo medida que compuertar." >&2
    printf '%s\n' "$report" | tail -20 >&2
    exit 2
fi

echo "suites ejecutadas: $ran"

new="$(comm -23 <(printf '%s\n' "$failing" | grep -v '^$') <(printf '%s\n' "$known"))"
fixed="$(comm -13 <(printf '%s\n' "$failing" | grep -v '^$') <(printf '%s\n' "$known"))"

if [ -n "$fixed" ]; then
    echo
    echo "ESTAS YA PASAN — borra su línea de $baseline (la lista existe para encoger):"
    printf '    %s\n' $fixed
fi

if [ -n "$new" ]; then
    echo
    echo "FAIL: suites rotas que NO están en la lista registrada:" >&2
    printf '    %s\n' $new >&2
    exit 1
fi

echo "OK: ninguna rotura nueva."
exit 0
