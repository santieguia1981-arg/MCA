# HERRAMIENTAS

Scripts y accesos directos del proyecto. Todos se ejecutan desde la carpeta `MCA/` y no necesitan instalar nada más que Python 3.

| Archivo | Qué hace |
|---|---|
| `abrir_sitio.bat` | Abre `PÁGINA/MCA.HTML` en el navegador predeterminado (doble clic) |
| `verificar_sitio.py` | Revisa enlaces, recursos, banco de preguntas y etiquetas de seguridad |
| `banco_preguntas/construir_banco.py` | Valida y agrega preguntas nuevas al quiz a partir de candidatas con cita textual |
| `banco_preguntas/candidatas/MOD1.json … MOD6.json` | Las 330 preguntas candidatas redactadas el 13-11-2026, cada una con su cita y archivo fuente |

## verificar_sitio.py

```bash
python -X utf8 HERRAMIENTAS/verificar_sitio.py
```

Comprueba:
1. Que cada `href` y `src` local de los seis `.HTML` apunte a un archivo existente, **respetando mayúsculas** (los hostings en Linux las distinguen).
2. Que los `url()` de los `.css` existan.
3. El banco de `QUIZ.HTML`: cantidad por módulo, enunciados repetidos, opciones repetidas o vacías y preguntas sin fuente.
4. Que exista `data/normativa.js`, y avisa si una página no carga `js/ui.js` o no tiene CSP ni meta description.

Termina con código 0 si no hay problemas y 1 si los hay. Los avisos no hacen fallar la verificación.

## banco_preguntas/construir_banco.py

```bash
python -X utf8 HERRAMIENTAS/banco_preguntas/construir_banco.py              # solo informe
python -X utf8 HERRAMIENTAS/banco_preguntas/construir_banco.py --audit 0.5  # preguntas con poca coincidencia respuesta-cita
python -X utf8 HERRAMIENTAS/banco_preguntas/construir_banco.py --write      # agrega al quiz (hacer copia antes)
```

- Comprueba que la cita de cada candidata exista literalmente en `FUENTES/normativa/NORMATIVA md/`.
- Descarta las repetidas o muy parecidas a las que ya están en `QUIZ.HTML`.
- Con el banco completo (500 candidatas incorporadas; las 61 preguntas de cálculo del 24-11-2026 se agregaron aparte y no pasan por este script) el informe da 0 nuevas: es seguro volver a ejecutarlo, no duplica nada. Las candidatas sobrantes (unas 40, las que figuran como «válidas» en el informe) quedan disponibles si se sube el objetivo `TARGET_TOTAL` dentro del script.
- Detalle del método en `DOCUMENTACION/BANCO_DE_PREGUNTAS.md`.

## Qué se archivó

`parse_toc.py` y `validar.py` (generaban `normativa.json` desde el Texto Ordenado) fueron reemplazados y están en `ARCHIVO/herramientas-reemplazadas/`. No usarlos: `data/normativa.js` se mantiene a mano.
