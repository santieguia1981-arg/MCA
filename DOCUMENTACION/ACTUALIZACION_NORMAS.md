# Cómo se actualizan las Normas CNV del sitio

Procedimiento y criterios con los que se incorporan las resoluciones generales (RG) de la CNV a `PÁGINA/data/normativa.js`, la fuente de la página **Normas CNV T.O.**

> El encabezado de `normativa.js` decía «ver NOTAS DEL PROYECTO.md», pero ese archivo **no existe en el proyecto**. Este documento reúne los criterios que se infieren de los datos ya cargados y de lo definido en `FUENTES/correcciones/`. Si existen las notas originales, conviene compararlas con esta lista.

## Estado actual

- Texto vigente al **07-11-2026**; última RG incorporada: **N.° 1178**.
- 22 títulos · 87 capítulos · 458 secciones · 2.232 artículos · 61 anexos.
- RG incorporadas con fuente al pie del artículo: 1103 a 1178 (las que modifican el Texto Ordenado). Sus textos están en `FUENTES/resoluciones-cnv/`.

## Qué se incorpora y qué no

| Se incorpora | No se incorpora |
|---|---|
| RG que modifican, sustituyen, incorporan o derogan artículos, capítulos o títulos de las Normas (N.T. 2013 y mod.) | **Consultas públicas** («Elaboración Participativa de Normas»: ponen un proyecto a consulta) |
| Disposiciones transitorias y prórrogas que se agregan al texto de las Normas | RG que no tocan el Texto Ordenado |

En la página de la CNV, las consultas públicas aparecen con la sección **«Consultas Públicas»**. Para confirmar una resolución dudosa se abre su texto en Infoleg: el título de las consultas dice «Elaboración Participativa de Normas. Aplicación»; las que modifican las Normas dicen «Normas (N.T. 2013 y mod.). Modificación».

RG no incorporadas por ser consultas públicas: 1171 (07-10-2026) y 1176 (04-11-2026).

## Pasos

1. **Listar las RG nuevas** en https://www.cnv.gov.ar/sitioWeb/MarcoRegulatorio?panel=2 (ordenadas por fecha) a partir de la última incorporada.
2. **Leer el texto** de cada una. Infoleg (`fuente_infoleg` en el `.md` de cada RG) da el texto limpio; el PDF de la CNV (`fuente_pdf`) sirve para verificarlo.
3. **Guardar el texto** en `FUENTES/resoluciones-cnv/RGCRGN####-26.md`, con la cabecera de las demás (número, fecha, sección, descripción, expediente, qué modifica, enlaces).
4. **Hacer una copia** de `normativa.js` en `ARCHIVO/respaldos-normativa/` con el nombre «AAAA-MM-DD antes de RG … .js».
5. **Reescribir los artículos modificados** en `normativa.js` (ver criterios).
6. **Actualizar `NORMATIVA_META`**: `fecha`, `actualizacion` y `vigencias`.
7. **Revisar las cifras** de portada y de documentación (títulos, capítulos, artículos) y ejecutar `python -X utf8 HERRAMIENTAS/verificar_sitio.py`.
8. **Abrir la página** de Normas CNV y comprobar que cada título se despliega hasta la lectura del artículo.

## Criterios de carga

- **Fuente al pie del artículo modificado.** Cada artículo, o anexo, tocado por una RG lleva `fuente: ["RGCRGN####-26", …]`. Se agregan a la lista las RG sucesivas que lo modifican. La página lo muestra como «Fuente: RG ####/2026» y, si la RG tiene una entrada en `vigencias`, agrega entre paréntesis su vigencia.
- **Artículo sustituido:** se reemplaza el texto y el nombre (el epígrafe) por los de la RG, se conserva la fuente anterior y se agrega la nueva.
- **Artículo nuevo:** se inserta en su lugar con `num` («21 bis», «4») y `n` (número entero). Capítulos y secciones nuevos se crean con su nombre.
- **Capítulo o título sustituido en bloque:** se reemplaza todo su contenido. Cada artículo nuevo lleva solo la RG que lo sustituye.
- **Artículo derogado o suprimido:** se mantiene el artículo con la leyenda de la RG («Derogado por …», «Suprimido conforme Resolución General N° …»).
- **Definiciones del art. 2 del Título I:** el término nuevo se inserta en orden alfabético dentro del texto del artículo y el artículo suma la RG como fuente.
- **Texto:** transcripción fiel al texto publicado, sin las comillas de cita y con el punto final restituido. Cada párrafo va en una línea (`\n`). Los números de artículo y sus rótulos no forman parte del texto.
- **Anexos:**
  - Si la RG reproduce el anexo, se incorpora completo.
  - Si no se puede incorporar (formularios gráficos, archivos aparte), se coloca el **título del anexo** y la **fuente**: una `nota` en el artículo o el anexo («Anexo X: ver en RG ####/2026», con el enlace de descarga de la CNV cuando existe).
  - Si la RG sustituye el cuerpo pero no el anexo, se conserva el anexo del Texto Ordenado y se deja una `nota` que lo aclara.
- **Vigencias especiales** (aplicación diferida, prórrogas): entrada en `NORMATIVA_META.vigencias` con el texto de la fecha («vigente desde el DD-MM-AAAA», «aplicable desde …»). La vigencia general es el día siguiente al de su publicación en el Boletín Oficial.
- **Fecha de la cabecera** («Texto vigente al …»): se usa la fecha en que entra en vigencia la última RG incorporada. Para las RG 1174 a 1178 es el 07-11-2026 (publicación en el B.O. del 06-11-2026).
- **No regenerar desde el Texto Ordenado original:** `normativa.js` se actualiza a mano, resolución por resolución.
- Antes de cambios grandes, siempre copia de respaldo.

## Estructura de datos

```
window.NORMATIVA_META = { fecha, actualizacion, vigencias: { "RGCRGN1178-26": "…" }, fuente }
window.NORMATIVA = [ título { kind, num, name, children: [
    capítulo { kind, num, name, children: [
        sección { kind, num, name, children: [
            artículo { kind:"article", num, name, text, n, fuente:[…], nota:[…] },
            anexo    { kind:"anexo", num, name, text, fuente:[…] } ] } ] } ] } ]
```

Los capítulos pueden contener artículos directamente (sin secciones). Los anexos cuelgan del capítulo o de la sección donde se los menciona.
