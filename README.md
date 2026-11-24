# MCA · Mercado de Capitales Argentino

Plataforma educativa interactiva sobre el mercado de capitales argentino y la acreditación de idoneidad ante la Comisión Nacional de Valores (CNV). Es un **sitio estático** (HTML, CSS y JavaScript): no necesita servidor propio ni base de datos. Funciona abriendo los archivos; para escuchar los audios y ver el video de Extras hace falta conexión a internet (se cargan desde Cloudinary).

> Contenido con fines educativos e informativos. No reemplaza los textos oficiales ni constituye asesoramiento profesional.

> Estado documentado: **24 de noviembre de 2026**.

## Cómo abrirlo

- Doble clic en [`HERRAMIENTAS/abrir_sitio.bat`](HERRAMIENTAS/abrir_sitio.bat), o
- abrir [`PÁGINA/MCA.HTML`](PÁGINA/MCA.HTML) con el navegador.

## Qué hay en el sitio

| Página | Archivo | Contenido |
|---|---|---|
| Inicio | `PÁGINA/MCA.HTML` | Mapa interactivo de actores con voz, simulador de operación en vivo y accesos |
| Normas CNV T.O. | `PÁGINA/NORMAS CNV T.O..HTML` | Texto Ordenado completo (22 títulos, 2.232 artículos; al 07-11-2026, R.G. 1178) con buscador |
| Normativa | `PÁGINA/NORMATIVA.HTML` | Los 6 módulos de la guía de idoneidad, con temarios y bibliografía |
| Extras | `PÁGINA/EXTRAS.HTML` | 19 podcasts y 1 video (alojados en Cloudinary) y enlaces institucionales |
| Cálculos | `PÁGINA/CALCULOS.HTML` | 33 calculadoras de matemática financiera (tasas, bonos, acciones, derivados, cartera y balances), con menú lateral |
| Quiz | `PÁGINA/QUIZ.HTML` | Simulador de examen: 560 preguntas (61 de cálculo), progreso guardado y repaso de errores |

**En todas las páginas:**
- **Modo diurno / nocturno:** botón sol-luna al final del menú; recuerda la elección del lector y parte del modo de su sistema.
- **AVISO LEGAL:** botón en el pie que abre un modal (en modo diurno, fondo blanco con texto negro).
- **Menú común:** Inicio · Normas CNV T.O. · Normativa · Extras · Cálculos · Quiz. «Quiz» se abre en una pestaña nueva, salvo desde el propio Quiz.
- **Ingresar** (login opcional con Supabase): solo en `MCA.HTML`.

## Mapa de carpetas

```
MCA/
├── PÁGINA/          El sitio. Es lo único que se publica en el hosting (~4,5 MB)
│   ├── *.HTML       Las seis páginas
│   ├── css/ js/ data/ fonts/ vendor/ img/   Estilos, scripts, Texto Ordenado, tipografía, librerías y logo
│   └── vercel.json  Cabeceras de seguridad para Vercel (_headers: las mismas para Netlify / Cloudflare)
├── FUENTES/         Leyes, Texto Ordenado, guía de estudio y resoluciones en que se basa el contenido
├── RECURSOS/        Logos originales (LOGO/) y los originales de audios, presentaciones y video (EXTRAS/, ~494 MB)
├── HERRAMIENTAS/    Verificador del sitio, acceso directo, herramienta del banco de preguntas y SQL de Supabase
├── DOCUMENTACION/   Toda la documentación (.md) y la lista de pendientes (MODIFICACIONES.docx)
└── ARCHIVO/         Copias y material histórico (no se usa; no borrar sin revisar)
```

## Documentación

| Documento | Para qué sirve |
|---|---|
| [`DOCUMENTACION/ESPECIFICACIONES_PROYECTO_MCA.md`](DOCUMENTACION/ESPECIFICACIONES_PROYECTO_MCA.md) | Documento técnico y funcional completo de las seis páginas, el diseño (con modo claro) y el mantenimiento |
| [`DOCUMENTACION/FUENTES.md`](DOCUMENTACION/FUENTES.md) | Inventario de las fuentes de información y qué contenido sale de cada una |
| [`DOCUMENTACION/ACTUALIZACION_NORMAS.md`](DOCUMENTACION/ACTUALIZACION_NORMAS.md) | Cómo y con qué criterios se incorporan las resoluciones de la CNV a las Normas del sitio |
| [`DOCUMENTACION/BANCO_DE_PREGUNTAS.md`](DOCUMENTACION/BANCO_DE_PREGUNTAS.md) | Cómo se armó el banco de preguntas (500 + 61 de cálculo), cómo se verificó y cómo agregar más |
| [`DOCUMENTACION/SEGURIDAD.md`](DOCUMENTACION/SEGURIDAD.md) | Medidas aplicadas y cabeceras de servidor según el hosting (Vercel incluido) |
| [`DOCUMENTACION/SUPABASE.md`](DOCUMENTACION/SUPABASE.md) | Login opcional y progreso del quiz en la nube: configuración paso a paso |
| [`DOCUMENTACION/PUBLICACION.md`](DOCUMENTACION/PUBLICACION.md) | Qué subir al hosting, cómo publicar en Vercel y qué revisar antes |
| [`DOCUMENTACION/CAMBIOS.md`](DOCUMENTACION/CAMBIOS.md) | Historial de cambios y reorganización (incluye dónde estaba cada cosa antes) |
| [`DOCUMENTACION/muestra_revision_preguntas.md`](DOCUMENTACION/muestra_revision_preguntas.md) | Muestra de 24 preguntas nuevas con su cita, para revisión |
| `DOCUMENTACION/MODIFICACIONES.docx` | Lista de pendientes de trabajo (GitHub, Vercel, Supabase, login, seguridad) |
| [`HERRAMIENTAS/README.md`](HERRAMIENTAS/README.md) | Cómo usar los scripts |

## Antes de publicar o después de cambiar algo

```bash
python -X utf8 HERRAMIENTAS/verificar_sitio.py
```

Revisa que no haya enlaces rotos (respetando mayúsculas), que el banco de preguntas no tenga repetidas ni opciones duplicadas y que cada página tenga sus etiquetas de seguridad. Debe terminar con `0 problema(s)`.

## Publicar en Vercel

1. Subir el proyecto a GitHub (se publica solo `PÁGINA/`).
2. En Vercel: *Add New → Project* → elegir el repositorio.
3. **Root Directory = `PÁGINA`**, Framework "Other", sin comando de build.
4. *Deploy*. `PÁGINA/vercel.json` agrega las cabeceras de seguridad (HSTS, CSP, etc.).
5. Después de publicar: abrir las seis páginas, reproducir un audio de Extras, probar el modo diurno/nocturno y revisar las cabeceras (securityheaders.com o `curl -I`).
6. Con login de Supabase: poner el dominio de Vercel en *Site URL* (ver `DOCUMENTACION/SUPABASE.md`).

Detalle y advertencias en [`DOCUMENTACION/PUBLICACION.md`](DOCUMENTACION/PUBLICACION.md) y [`DOCUMENTACION/SEGURIDAD.md`](DOCUMENTACION/SEGURIDAD.md).

## Reglas para no romper el sitio

1. **`PÁGINA/` se publica completa y sin sacarle carpetas:** los enlaces son relativos (`css/`, `js/`, `data/`, `img/`, `fonts/`, `vendor/`). Todo lo que esté dentro de `PÁGINA/` se publica: no dejar ahí documentos de trabajo, copias ni medios pesados.
2. **No renombrar los `.HTML`:** sus nombres (mayúsculas, espacios y doble punto de `NORMAS CNV T.O..HTML`) están en los menús de todas las páginas, y los hostings en Linux distinguen mayúsculas.
3. **`data/normativa.js` se actualiza a mano, resolución por resolución;** no se regenera desde el Texto Ordenado. Antes de cambios grandes, guardar una copia en `ARCHIVO/respaldos-normativa/`.
4. **Audios y video de Extras:** se agregan subiéndolos a Cloudinary y poniendo su URL en `EXTRAS.HTML`. La política de seguridad (`vercel.json`, `_headers` y la `<meta>` de la página) solo autoriza `https://res.cloudinary.com` para medios; otro dominio quedaría bloqueado.
5. **Colores nuevos:** definirlos como variable en `css/mca.css` para modo oscuro y modo claro; los colores fijos se ven mal en uno de los dos modos.
6. **Cabeceras de seguridad:** si se cambia una, mantener `vercel.json` y `_headers` iguales.
7. Los plazos, montos y porcentajes de las normas cambian con frecuencia: contrastar siempre con el texto oficial vigente.

## Pendientes conocidos

- **Publicación:** subir de nuevo el sitio a GitHub y Vercel y comprobar ya publicado las cabeceras de `vercel.json` y la reproducción de audios desde Cloudinary (no se pudo probar en un despliegue real).
- **Supabase / login:** avanzar con la configuración (ver `DOCUMENTACION/SUPABASE.md` y `MODIFICACIONES.docx`). El botón «Ingresar» ya no está en `QUIZ.HTML`; si se quiere el progreso en la nube desde el quiz, hay que volver a cargar `js/login.js` ahí.
- **Revisión de preguntas:** las preguntas del quiz que provienen de la guía de estudio y las 61 de cálculo no fueron validadas por un especialista (ver `DOCUMENTACION/BANCO_DE_PREGUNTAS.md`).
- **Revisión visual manual:** las pruebas del 24-11-2026 (incluido el modo claro) se hicieron con capturas y mediciones automáticas, no con una revisión a mano de cada calculadora y de cada título de las Normas.
- **Presentaciones PowerPoint:** ya no se usan (se convirtieron a audio); se conservan en `RECURSOS/EXTRAS/`.
