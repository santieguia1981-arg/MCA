# Seguridad

El sitio es estático: **no tiene servidor, base de datos, usuarios, cookies ni claves de API**. Por eso no aplican medidas como autenticación, Row-Level Security, hasheo de contraseñas, rate limiting o parametrización de consultas. **Actualización:** el sitio ahora tiene login opcional y progreso del quiz en Supabase; la autenticación y la seguridad por fila las resuelve Supabase (ver [`SUPABASE.md`](SUPABASE.md)). Mientras `PÁGINA/js/config.js` esté vacío, el sitio sigue sin usuarios ni conexiones.

## Medidas aplicadas (en las seis páginas)

| Medida | Dónde | Detalle |
|---|---|---|
| Política de seguridad de contenido (CSP) | `<meta http-equiv="Content-Security-Policy">` en cada `.HTML` | Solo recursos propios (`'self'`, `file:` para abrirlo con doble clic), sin conexiones externas (`connect-src 'self'`), sin objetos incrustados, `base-uri` y `form-action` restringidos. Permite scripts y estilos inline (`'unsafe-inline'`) porque `MCA.HTML` y `QUIZ.HTML` tienen mucho código dentro del HTML |
| Política de referrer | `<meta name="referrer">` | `strict-origin-when-cross-origin` |
| Forzar HTTPS | Script en el `<head>` | Si se entra por `http://` a un dominio real, redirige a `https://`. No actúa en localhost ni en `file://` |
| Enlaces externos | Todos los `target="_blank"` | `rel="noopener noreferrer"` |
| Hash de la URL validado | `NORMATIVA.HTML` | Solo acepta identificadores simples; no usa el hash como selector |
| Texto escapado | `js/normativa-view.js` | El buscador y el árbol escapan el texto antes de insertarlo |
| Sin dependencias externas | Todo el sitio | Tipografía, íconos y estilos son locales (`fonts/`, `vendor/fontawesome/`, `css/`) |
| Datos del alumno | `QUIZ.HTML` | Solo `localStorage` del propio navegador (examen en curso, historial, errores). Se reconstruye desde el banco de preguntas y se valida al leer; nada sale del equipo |

## Pendiente: cabeceras de servidor

Las `<meta>` **no pueden** fijar HSTS, `X-Frame-Options` ni `frame-ancestors`. Eso se configura en el servidor y depende del hosting, que todavía no está definido.

- **Vercel (hosting elegido):** `PÁGINA/vercel.json` ya tiene las cabeceras (HSTS, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, `Cross-Origin-Opener-Policy` y la CSP completa con `frame-ancestors 'none'`, conexión permitida a `https://*.supabase.co` y medios (audio/video) permitidos desde `https://res.cloudinary.com`) y una caché larga solo para `fonts/` y `vendor/`. Vercel redirige `http` a `https` por sí mismo y entrega el certificado automáticamente. Hay que configurar el proyecto con **Root Directory = `PÁGINA`**, sin framework ni comando de build. Si se cambia una cabecera, hay que mantener `vercel.json` y `_headers` iguales.
- `PÁGINA/_headers` tiene la misma configuración para **Netlify / Cloudflare Pages**; Vercel no lo usa (se deja por si se cambia de hosting).
- Para **Apache / hosting compartido** (cPanel, Hostinger…), usar un `.htaccess` en la raíz del sitio (requiere `mod_headers`):

```apache
<IfModule mod_headers.c>
  Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains"
  Header always set X-Content-Type-Options "nosniff"
  Header always set X-Frame-Options "DENY"
  Header always set Referrer-Policy "strict-origin-when-cross-origin"
  Header always set Permissions-Policy "camera=(), microphone=(), geolocation=(), payment=()"
  Header always set Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:; media-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests"
</IfModule>
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

- Para **Nginx**, las mismas cabeceras con `add_header … always;` dentro del bloque `server { … }`.
- **GitHub Pages** no permite cabeceras propias: quedarían solo las de las `<meta>`.

Antes de publicar:
0. En Vercel, comprobar después del primer despliegue que las cabeceras llegan (securityheaders.com o `curl -I https://TU-DOMINIO`).
1. Activar HTTPS en el hosting (casi todos ofrecen certificado gratuito); sin eso HSTS y la redirección no sirven.
2. Probar primero **sin** `Strict-Transport-Security`: una vez que un navegador lo recibe, queda obligado a usar HTTPS durante un año.
3. Después de publicar, revisar las cabeceras en securityheaders.com.

## Limitaciones

- La CSP permite scripts inline. Se puede quitar moviendo el JavaScript de `MCA.HTML` y `QUIZ.HTML` a archivos `.js` aparte, pero es un cambio grande.
- La política se probó abriendo las páginas con doble clic en Edge sin interfaz (sin bloqueos). No se probó en un hosting real.
- Font Awesome 6.4.0 es la única dependencia de terceros (incluida en `vendor/`); no hay gestor de paquetes que la escanee. Conviene revisar si hay una versión más nueva.
