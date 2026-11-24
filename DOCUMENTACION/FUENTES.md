# Fuentes de información

Todo el contenido normativo del sitio sale del material guardado en `FUENTES/`. Este documento indica qué hay, para qué se usa y dónde se refleja en el sitio.

## `FUENTES/normativa/`

| Archivo(s) | Qué es | Dónde se usa |
|---|---|---|
| `NORMATIVA md/guia_de_estudio_v2.md` (y `guia_de_estudio_v2.pdf`) | Guía de Estudio del Examen de Idoneidad en el Mercado de Capitales, con los módulos I a VI, su temario, bibliografía y cuestionarios | `NORMATIVA.HTML` (temarios y bibliografía); base de las preguntas del quiz |
| `NORMATIVA md/TOC 2013 ACTUALIZADO (16-04-26).md` (y `.pdf` en `NORMATIVA PDF/`) | Normas CNV, Texto Ordenado 2013 actualizado al 16-04-2026 | Origen de `data/normativa.js` (Normas CNV T.O.); preguntas del quiz |
| `NORMATIVA md/Ley 26831 - MERCADO DE CAPITALES.md` | Ley 26.831 de Mercado de Capitales | Quiz; marco legal de `MCA.HTML` |
| `NORMATIVA md/TEXTO ORIGINAL - Decreto Reglamentario 1023_2013 …md` | Decreto Reglamentario 1023/2013 | Quiz (módulo I) |
| `NORMATIVA md/LEY 27.440 FINANCIAMIENTO PRODUCTIVO.md` | Ley 27.440 de Financiamiento Productivo | Quiz (módulos V y VI) |
| `NORMATIVA md/Ley 19.550 ACTUALIZADA.md` | Ley 19.550 de Sociedades Comerciales | Quiz (módulos I y III) |
| `NORMATIVA md/TEXTO ACTUALIZADO - Ley 23576 - OBLIGACIONES NEGOCIABLES ….md` | Ley 23.576 de Obligaciones Negociables | Quiz (módulos I y V) |
| `NORMATIVA md/Ley 24.083 FCI.md` | Ley 24.083 de Fondos Comunes de Inversión | Quiz (módulo VI) |
| `NORMATIVA md/Ley 24441 Sancionada el 22_12_94  FIDEICOMISOS.md` | Ley 24.441 de Fideicomisos (nótese el doble espacio antes de «FIDEICOMISOS») | Quiz (módulo VI) |
| `NORMATIVA md/TEXTO ACTUALIZADO - Ley 26994 - CODIGO CIVIL Y COMERCIAL ….md` | Código Civil y Comercial de la Nación (se usan los artículos de fideicomiso) | Quiz (módulo VI) |
| `NORMATIVA md/TEXTO ACTUALIZADO - Ley 21526 - ENTIDADES FINANCIERAS ….md` | Ley 21.526 de Entidades Financieras | Consulta |
| `NORMATIVA PDF/` | Los mismos textos en PDF (versión original descargada) | Consulta |
| `NORMATIVA.docx` | Lista de las normas de referencia del examen (leyes y decretos). Incluye normas que **no** están transcriptas en esta carpeta, como las Leyes 22.169, 24.467 y 25.246 y el Decreto 471/2018 | Consulta |

Los `.md` son conversiones automáticas de los PDF: **pueden tener palabras pegadas o errores de extracción** (por ejemplo «laComisión»). Ante una duda, confirmar en el PDF.

## `FUENTES/resoluciones-cnv/`

61 resoluciones generales de la CNV en texto (`RGCRGN1103-26.md` a `RGCRGN1178-26.md`, año 2026; no son todas las numeradas en ese rango: se excluyen las consultas públicas y las que no modifican las Normas). Se usaron para actualizar a mano `PÁGINA/data/normativa.js` resolución por resolución. La última incorporada es la R.G. 1178 (el sitio lo indica en `NORMATIVA_META.actualizacion`). Las R.G. 1174, 1175, 1177 y 1178 se tomaron de Infoleg y se verificaron contra el PDF de la CNV (https://www.cnv.gov.ar/sitioWeb/MarcoRegulatorio?panel=2). Criterios y procedimiento: `ACTUALIZACION_NORMAS.md`.

## `FUENTES/correcciones/`

`Correciones 23-10-26.md` y `.docx`: textos de las R.G. que quedaron pendientes de verificar y las instrucciones para incorporarlos a las normas. Ya se aplicaron (versión «con correcciones 23-10 aplicadas» de `normativa.js`, guardada en `ARCHIVO/respaldos-normativa/`).

## Fuentes que NO están en el proyecto

- Las **resoluciones de la UIF** (por ejemplo 29/2013, 3/2014, 78/2023, 56/2024) solo figuran como enlaces en `NORMATIVA.HTML`. Lo que el quiz dice sobre ellas proviene de lo que la guía y las Normas CNV (Título XI) transcriben.
- Los textos oficiales vigentes siempre se consultan en InfoLeg y en argentina.gob.ar/cnv, los sitios enlazados desde las páginas.

## Material propio de `RECURSOS/EXTRAS/`

Audios (.m4a), presentaciones (.pptx) y un video (.mp4) de apoyo. No son fuente normativa: son contenido didáctico. Desde el 24-11-2026 los audios y el video se publican desde Cloudinary y esta carpeta guarda los originales; las presentaciones (.pptx) se conservan aunque ya no se usan, porque se convirtieron a audios. Su detalle está en `ESPECIFICACIONES_PROYECTO_MCA.md`, sección 4.4.
