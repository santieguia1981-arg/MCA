# Historial de cambios

## 24 de noviembre de 2026 · Cálculos, aviso legal, modo nocturno y 560 preguntas

### Contenido y funciones
- **Nueva página `CALCULOS.HTML`** en el menú y en el pie de todas las páginas: 33 calculadoras de matemática financiera en seis categorías. Se **rediseñó con menú lateral**: la lista de fórmulas ya no queda fija sobre la calculadora; en celular se pliega en un botón «Fórmulas». Se conservaron todas las calculadoras, fórmulas y textos.
- **Quiz:**
  - Banco de **500 → 560 preguntas**: 61 preguntas de cálculo basadas en las fórmulas de Cálculos (módulo IV: 24, módulo V: 26, módulo VI: 11). Cada una cita el panel y la fórmula.
  - El botón de inicio pasa de «Comenzar Examen de Idoneidad» a **«Simulador de Examen»**.
  - Se quitaron las opciones de **90 y 120 minutos** del tiempo límite (quedan 10, 20, 30, 45 y 60).
  - Se quitó el botón «Rendir el examen de idoneidad | Argentina.gob.ar» del pie (el enlace «Examen Idoneidad» sigue en las referencias oficiales).
  - Se quitó el botón **«Ingresar»** de `QUIZ.HTML` (ya no carga `js/login.js`); queda solo en `MCA.HTML`.
- **Aviso legal** en las seis páginas: el botón del pie ya existía pero no funcionaba. En `CALCULOS`, `EXTRAS`, `NORMATIVA` y `NORMAS CNV T.O.` el modal estaba cortado (sin cuerpo ni botón «Entendido» y con etiquetas sin cerrar) y en `NORMAS CNV T.O.` las funciones quedaron dentro de un `<script src>`, que el navegador ignora. Se completó con el texto de `MCA.HTML`; `QUIZ.HTML` lo recibió con el mismo contenido.
- **Quiz en pestaña nueva:** el botón «Quiz» del menú se abre en una pestaña nueva desde todas las páginas, salvo desde el propio Quiz.
- **Aviso legal legible en modo diurno:** al elegir el modo diurno, el modal pasa a fondo blanco con todo el texto en negro en las seis páginas (regla compartida en `css/mca.css`). Además `MCA.HTML` recibió los mismos estilos del modal que las demás páginas: antes quedaba sin espaciado y con la tarjeta transparente.
- **Modo diurno / nocturno** en las seis páginas (`js/tema.js` y variables de `css/mca.css`). Detalle en `ESPECIFICACIONES_PROYECTO_MCA.md`, sección 3.6.

### Errores corregidos
- **`QUIZ.HTML` no cargaba el script** después de agregar las preguntas nuevas: faltaba una coma entre la última pregunta anterior y la primera nueva (`SyntaxError`), lo que dejaba sin funcionar todo el quiz y el aviso legal. Corregido.
- **`EXTRAS.html` → `EXTRAS.HTML`:** el archivo tenía la extensión en minúsculas y todos los menús enlazaban a `EXTRAS.HTML`; funcionaba en Windows pero se habría roto en un hosting que distingue mayúsculas (Vercel/GitHub). Se renombró.
- Tres preguntas de cálculo tenían opciones casi idénticas (solo cambiaba el signo); se reemplazó la opción duplicada.

### Reorganización
| Antes | Ahora |
|---|---|
| `PÁGINA/MODIFICACIONES.docx` | `DOCUMENTACION/MODIFICACIONES.docx` (es una lista de pendientes; en `PÁGINA/` se habría publicado) |
| `PÁGINA/EXTRAS.html` | `PÁGINA/EXTRAS.HTML` |
| `PÁGINA/EXTRAS/` (494 MB de audios, presentaciones y video) | `RECURSOS/EXTRAS/`. Extras ya reproduce todo desde Cloudinary; `PÁGINA/` pasó de ~500 MB a ~4,5 MB |
| (copias previas a los cambios de hoy) | `ARCHIVO/copias-html/2026-11-24 antes de modo nocturno y rediseño de Cálculos/` |

Verificación: `python -X utf8 HERRAMIENTAS/verificar_sitio.py` → `0 problema(s)` (6 páginas, 560 preguntas).

### Publicación
- Archivo nuevo **`PÁGINA/vercel.json`** con las cabeceras de seguridad para Vercel (las mismas de `_headers`: HSTS, nosniff, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, COOP y CSP, con `media-src` autorizado para `https://res.cloudinary.com` por los audios y el video de Extras) y caché larga para `fonts/` y `vendor/`. Ver `SEGURIDAD.md` y `PUBLICACION.md` (pasos para publicar en Vercel).


## 13 de noviembre de 2026 · Normas CNV actualizadas hasta la R.G. 1178

Se leyeron las resoluciones publicadas en https://www.cnv.gov.ar/sitioWeb/MarcoRegulatorio?panel=2 después de la R.G. 1173 y se incorporaron a `PÁGINA/data/normativa.js` las que modifican las Normas (las consultas públicas no se incorporan):

| RG | Fecha | Qué modifica en el sitio |
|---|---|---|
| 1174 | 28-10-2026 | Sustituye el **Título XV** (Autopista de la Información Financiera) completo: 45 artículos y 2 anexos (antes 18 y 2) |
| 1175 | 28-10-2026 | Nuevo **Capítulo XIX del Título XVIII** (prórroga excepcional de presentación de estados financieros hasta el 13-11-2026) |
| 1177 | 04-11-2026 | Art. 2 del Título I (términos «FCIA ETF» y «FCICC»); sustituye el art. 21 y agrega el **art. 21 bis** (Título V, Cap. II, Sec. II) |
| 1178 | 04-11-2026 | Sustituye los arts. 58 y 159 del Título II, Cap. V; sustituye el **Capítulo I del Título XVII** (15 artículos); agrega el art. 4 al Cap. XVIII del Título XVIII |

- No se incorporaron las R.G. **1171** y **1176**, que son consultas públicas.
- El encabezado de la página de Normas CNV T.O. pasa a «Texto vigente al 07-11-2026 (última actualización incorporada: R.G. N° 1178)».
- Las normas pasan de 2.200 a **2.232 artículos** y de 86 a 87 capítulos.
- Textos fuente en `FUENTES/resoluciones-cnv/` (61 archivos); copia previa en `ARCHIVO/respaldos-normativa/2026-11-13 antes de RG 1174 a 1178.js`.
- Documento nuevo: `ACTUALIZACION_NORMAS.md` con el procedimiento y los criterios de carga.

## 13 de noviembre de 2026

### Contenido y funciones
- **Portada (`MCA.HTML`) reordenada:** portada → mapa interactivo → simulador de operación en vivo → tarjetas de acceso → marco legal → indicadores (al final). Se quitaron los botones «Practicar con el simulador» y «Ver la normativa».
- **Voz del mapa y del simulador:** femenina con acento argentino (es-AR). Al abrir un actor se leen la Definición CNV, la Función clave y los Ejemplos y tipos.
- **Extras:** nueva tarjeta de enlace a la UIF en «Enlaces Institucionales».
- **Quiz:**
  - Banco de **221 → 500 preguntas**, todas con fuente, las nuevas con cita textual verificada (ver `BANCO_DE_PREGUNTAS.md`).
  - Progreso guardado del examen en curso, historial de intentos, «Repasar mis errores» y recordatorio de la última configuración.
  - Indicador de preguntas de la portada: 220+ → 500.
- **Mejoras en todas las páginas:** enlace «Saltar al contenido», botón «Volver arriba», atajo `/` para el buscador de normas, estilos de impresión, `meta description`, favicon y etiquetas Open Graph (`js/ui.js` y `css/mca.css`).

### Seguridad
- CSP y política de referrer por `<meta>`, redirección a HTTPS fuera de localhost, `rel="noopener noreferrer"` en enlaces externos y validación del hash en `NORMATIVA.HTML`.
- Archivo `PÁGINA/_headers` con las cabeceras de servidor (pendiente de configurar según el hosting). Ver `SEGURIDAD.md`.

### Reorganización del proyecto
El sitio quedó separado del material de apoyo: `PÁGINA/` contiene solo lo que se publica. Se **movió sin borrar nada**; los enlaces del sitio no cambiaron (el verificador confirma `0 problemas`).

| Antes | Ahora |
|---|---|
| `NORMATIVA/` | `FUENTES/normativa/` |
| `PÁGINA/.md/RESOL CNV/` | `FUENTES/resoluciones-cnv/` |
| `PÁGINA/CORRECCIONES/` | `FUENTES/correcciones/` |
| `LOGO/` | `RECURSOS/LOGO/` |
| `COPIA DE SEGURIDAD/` (10 archivos) | `ARCHIVO/copias-html/` |
| `PÁGINA/data/respaldos/` | `ARCHIVO/respaldos-normativa/` |
| `PÁGINA/herramientas/NO USAR (reemplazados)/` | `ARCHIVO/herramientas-reemplazadas/` |
| `detalles_completos_de_mca_html_c.md` (raíz) | `ARCHIVO/documentos-antiguos/` |
| `PÁGINA/ESPECIFICACIONES_PROYECTO_MCA.md` | `DOCUMENTACION/` (actualizado) |
| `PÁGINA/muestra_revision_preguntas.md` | `DOCUMENTACION/` |

Archivos nuevos: `README.md` (raíz), `HERRAMIENTAS/` (`verificar_sitio.py`, `abrir_sitio.bat`, `banco_preguntas/`), `DOCUMENTACION/` (`FUENTES.md`, `BANCO_DE_PREGUNTAS.md`, `SEGURIDAD.md`, `PUBLICACION.md`, este archivo), `ARCHIVO/copias-html/QUIZ_2026-11-13_221-preguntas.HTML` (el quiz de antes de las 500 preguntas) y los README de `ARCHIVO/` y `FUENTES/`.

Notas de la mudanza:
- `ESPECIFICACIONES_PROYECTO_MCA.md` mencionaba un `QUIZ_ESPECIFICACIONES.md` que **no existía** en el proyecto; se quitó la referencia.
- Si abrías el proyecto desde `MCA/PÁGINA`, ahora la raíz de trabajo es `MCA/`.
- Para volver atrás un movimiento basta mover la carpeta a su ubicación anterior según la tabla.

## Antes del 13 de noviembre de 2026

El historial anterior está en `ESPECIFICACIONES_PROYECTO_MCA.md` y en las copias de `ARCHIVO/`: rediseño visual y cambio de logo (10-11-2026), correcciones del 23-10-2026 y actualización de las Normas CNV hasta la R.G. 1173 (versiones guardadas en `ARCHIVO/respaldos-normativa/`).
