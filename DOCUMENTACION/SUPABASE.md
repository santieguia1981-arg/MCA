# Login y progreso en la nube (Supabase)

El quiz sigue funcionando **sin registrarse** (progreso en el navegador). Quien inicia sesión, además, guarda en su cuenta el historial de intentos, los errores a repasar y la última configuración, y los recupera desde cualquier dispositivo.

## Cómo funciona
- Acceso por **enlace mágico** al correo (sin contraseñas). Google y Apple figuran como "Próximamente".
- `js/config.js`: URL y clave pública (`anon`) del proyecto. **Vacío = modo solo local**; el botón "Ingresar" avisa que el acceso aún no está configurado.
- `js/nube.js`: sesión y sincronización. Une el progreso local con el de la nube (historial por fecha; errores a repasar: lo más reciente gana).
- `js/login.js`: botón y ventana de acceso. **Desde el 24-11-2026 solo se carga en `MCA.HTML`**: se quitó el botón «Ingresar» de `QUIZ.HTML` (que sigue cargando `config.js`, `nube.js` y la librería). Para volver a mostrarlo en el quiz, agregar `<script src="js/login.js" defer></script>` en su `<head>`.
- `vendor/supabase/supabase.js`: librería oficial `supabase-js` 2.45.4, copiada localmente (la política de seguridad no permite cargar scripts externos).
- `HERRAMIENTAS/supabase_setup.sql`: crea la tabla `progreso` con seguridad por fila (cada usuario solo accede a lo suyo).

## Puesta en marcha (una vez)
1. Crear un proyecto en supabase.com.
2. **SQL Editor** → pegar y ejecutar `HERRAMIENTAS/supabase_setup.sql`.
3. **Project Settings → API**: copiar *Project URL* y la clave *anon public* en `PÁGINA/js/config.js`. **Nunca** poner la clave `service_role`.
4. **Authentication → URL Configuration**: en *Site URL* poner el dominio de Vercel (y `http://localhost:*` en *Redirect URLs* para probar localmente).
5. **Authentication → Providers → Email**: dejar activo el acceso por correo (enlace mágico).
6. Opcional: en **Authentication → SMTP Settings** configurar un correo propio; el envío por defecto de Supabase tiene límite de mensajes por hora.

## Seguridad
- La clave `anon` es pública por diseño; la protección real son las políticas de fila de `supabase_setup.sql`. No desactivar RLS.
- La CSP (en cada `<meta>` y en `_headers`) permite conexiones solo a `https://*.supabase.co`. Si se usa un dominio propio de Supabase, hay que sumarlo.
- Se guardan correo y progreso del quiz: conviene publicar una política de privacidad antes de abrir el sitio al público.
