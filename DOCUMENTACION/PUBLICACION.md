# Publicación del sitio

## Qué subir

**Solo el contenido de `PÁGINA/`**, completo y respetando sus carpetas. No subir `FUENTES/`, `ARCHIVO/`, `HERRAMIENTAS/`, `DOCUMENTACION/` ni `RECURSOS/`: no son parte del sitio (y `FUENTES/normativa` pesa 28 MB, `ARCHIVO/respaldos-normativa` otros 33 MB).

**Audios y video:** desde Extras se reproducen desde **Cloudinary** (`https://res.cloudinary.com`), no desde el sitio; por eso la web es liviana para el visitante y el hosting no sirve esos archivos. Los originales (unos 494 MB) están en `RECURSOS/EXTRAS/`, **fuera de `PÁGINA/`** desde el 24-11-2026, por lo que no se publican. `PÁGINA/` pesa unos 4,5 MB (el archivo más grande es `data/normativa.js`, ~3 MB).

## Antes de publicar

1. Ejecutar `python -X utf8 HERRAMIENTAS/verificar_sitio.py` y confirmar `0 problema(s)`.
2. Abrir cada página en el navegador y revisar a simple vista, **en modo diurno y nocturno**: portada, mapa y voz, simulador de operación, normas y buscador, módulos de normativa, enlaces de extras, calculadoras, botón AVISO LEGAL y un examen completo del quiz.
3. Revisar que el hosting **distinga mayúsculas** (la mayoría en Linux lo hace): los nombres de los `.HTML` deben coincidir exactamente con los enlaces.
4. Cabeceras de seguridad (ver `SEGURIDAD.md`): para **Vercel** ya está `PÁGINA/vercel.json` (HTTPS lo da Vercel). `PÁGINA/_headers` sirve para Netlify y Cloudflare Pages.
5. Confirmar que las cifras de portada de `MCA.HTML` (22 títulos, 2.200+ artículos, 560 preguntas) coinciden con el contenido.

## Publicar en Vercel

1. Subir el proyecto a GitHub (el repositorio puede contener todo `MCA/`; solo se publica `PÁGINA/`).
2. En Vercel: *Add New → Project* → elegir el repositorio.
3. **Root Directory:** `PÁGINA`. **Framework Preset:** Other. Sin *Build Command* ni *Output Directory*.
4. *Deploy*. `PÁGINA/vercel.json` agrega las cabeceras de seguridad automáticamente.
5. Con Supabase: poner el dominio de Vercel en *Authentication → URL Configuration → Site URL* (ver `SUPABASE.md`).
6. Con `PÁGINA/` de unos 4,5 MB no hay problema de tamaño en Vercel. Los medios se sirven desde Cloudinary, cuya URL está autorizada en `media-src` de `vercel.json`; después del primer despliegue, reproducir un audio para confirmarlo.

## Cosas a tener en cuenta

- `data/normativa.js` pesa ~3 MB: la página de Normas puede tardar un instante. Si el hosting comprime (gzip/brotli) los `.js`, mejora mucho.
- Desde un servidor de pruebas sencillo la descarga de `normativa.js` puede cortarse; ante una página de normas vacía, recargar.
- La voz del mapa y del simulador depende de las voces en español instaladas en el equipo de cada visitante (en Edge sobre Windows 11 suele estar «Microsoft Elena Online (Natural) – Español (Argentina)»).
- Para pruebas locales no hace falta servidor: `HERRAMIENTAS/abrir_sitio.bat` abre el sitio directamente.

## Actualizar el sitio publicado

Cuando cambie algo en `PÁGINA/`, volver a subir los archivos modificados. Si cambió `css/mca.css` o `img/logo-mca.png`, tener en cuenta que el navegador puede conservar la versión anterior: el logo se referencia con `?v=2`; subir ese número si se reemplaza la imagen.
