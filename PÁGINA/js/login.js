/* Botón "Ingresar" y ventana de acceso. Usa window.MCA_CLOUD (js/nube.js, Supabase).
   El acceso es por enlace mágico enviado al correo: no hay contraseñas que guardar. */
(function () {
    'use strict';

    function emailValido(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v); }

    function init() {
        var links = document.querySelector('.m-links');
        var nube = window.MCA_CLOUD;
        if (!links || !nube) return;

        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'm-login-btn';
        links.appendChild(btn);

        var overlay = document.createElement('div');
        overlay.className = 'm-login-overlay';
        overlay.hidden = true;
        overlay.innerHTML =
            '<div class="m-login-card" role="dialog" aria-modal="true" aria-labelledby="m-login-title">' +
            '<button type="button" class="m-login-close" aria-label="Cerrar"><i class="fa-solid fa-xmark"></i></button>' +
            '<div class="m-login-body"></div></div>';
        document.body.appendChild(overlay);
        var body = overlay.querySelector('.m-login-body');
        var previo = null;

        function cerrar() {
            overlay.hidden = true;
            document.body.style.overflow = '';
            if (previo && previo.focus) previo.focus();
        }

        function actualizar() {
            var u = nube.usuario();
            if (u && u.email) {
                btn.innerHTML = '<span class="m-login-av"></span><span class="m-login-name"></span>';
                btn.querySelector('.m-login-av').textContent = u.email.charAt(0).toUpperCase();
                btn.querySelector('.m-login-name').textContent = u.email.split('@')[0];
                btn.setAttribute('aria-label', 'Cuenta de ' + u.email);
            } else {
                btn.innerHTML = '<i class="fa-solid fa-user" aria-hidden="true"></i> Ingresar';
                btn.setAttribute('aria-label', 'Ingresar');
            }
        }

        function vistaLogin() {
            body.innerHTML =
                '<h2 id="m-login-title">Ingresá a MCA</h2>' +
                '<p class="m-login-sub">Guardá tu progreso del quiz y retomalo desde cualquier dispositivo.</p>' +
                '<button type="button" class="m-login-social" onclick="loginConGoogle()">Continuar con Google</button>' +
                '<button type="button" class="m-login-social" onclick="loginConApple()">Continuar con Apple</button>' +
                '<div class="m-login-or"><span>o</span></div>' +
                '<form novalidate>' +
                '<input type="email" name="email" placeholder="Ingresá tu correo electrónico" autocomplete="email" aria-label="Correo electrónico" required>' +
                '<p class="m-login-err" role="alert" hidden></p>' +
                '<button type="submit" class="m-login-submit">Continuar con correo electrónico</button>' +
                '</form>' +
                '<p class="m-login-note">Te enviamos un enlace para entrar, sin contraseña. Usamos tu correo solo para guardar tu progreso.</p>';
            var form = body.querySelector('form');
            var input = form.elements.email;
            var err = body.querySelector('.m-login-err');
            var enviar = form.querySelector('.m-login-submit');
            function mostrarError(t) { err.textContent = t; err.hidden = false; }
            form.addEventListener('submit', async function (e) {
                e.preventDefault();
                var v = input.value.trim().toLowerCase();
                if (!emailValido(v)) { mostrarError('Ingresá un correo válido.'); input.focus(); return; }
                if (!nube.configurado) { mostrarError('El acceso con cuenta todavía no está configurado en este sitio.'); return; }
                enviar.disabled = true;
                enviar.textContent = 'Enviando…';
                var r;
                try { r = await nube.enviarEnlace(v); } catch (x) { r = { error: { message: 'red' } }; }
                if (r && r.error) {
                    enviar.disabled = false;
                    enviar.textContent = 'Continuar con correo electrónico';
                    mostrarError('No pudimos enviar el enlace. Revisá el correo e intentá de nuevo en unos minutos.');
                    return;
                }
                vistaEnviado(v);
            });
            input.addEventListener('input', function () { err.hidden = true; });
            setTimeout(function () { input.focus(); }, 30);
        }

        function vistaEnviado(email) {
            body.innerHTML =
                '<h2 id="m-login-title">Revisá tu correo</h2>' +
                '<p class="m-login-sub">Te enviamos un enlace de acceso a <strong class="m-login-mail"></strong>. Abrilo desde este mismo dispositivo para entrar.</p>' +
                '<button type="button" class="m-login-submit m-login-ok">Entendido</button>';
            body.querySelector('.m-login-mail').textContent = email;
            body.querySelector('.m-login-ok').addEventListener('click', cerrar);
        }

        function vistaSesion(u) {
            body.innerHTML =
                '<h2 id="m-login-title">Sesión iniciada</h2>' +
                '<p class="m-login-sub"></p>' +
                '<p class="m-login-note">Tu progreso del quiz se guarda en tu cuenta.</p>' +
                '<button type="button" class="m-login-submit m-login-out">Cerrar sesión</button>';
            body.querySelector('.m-login-sub').textContent = u.email;
            body.querySelector('.m-login-out').addEventListener('click', async function () {
                await nube.salir();
                cerrar();
            });
        }

        function abrir() {
            var u = nube.usuario();
            if (u) vistaSesion(u); else vistaLogin();
            previo = document.activeElement;
            overlay.hidden = false;
            document.body.style.overflow = 'hidden';
        }

        btn.addEventListener('click', abrir);
        overlay.querySelector('.m-login-close').addEventListener('click', cerrar);
        overlay.addEventListener('click', function (e) { if (e.target === overlay) cerrar(); });
        document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !overlay.hidden) cerrar(); });
        nube.onChange(actualizar);
        actualizar();
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
     async function loginConGoogle() {
    try {
      const cfg = window.MCA_CONFIG || {};
      if (!cfg.SUPABASE_URL || !cfg.SUPABASE_ANON_KEY) {
        alert("Falta configurar Supabase en config.js");
        return;
      }
      const supabase = window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: window.location.origin + window.location.pathname }
      });
      if (error) throw error;
    } catch (e) {
      console.error(e);
      alert("No se pudo iniciar sesión con Google: " + e.message);
    }
  }
  window.loginConGoogle = loginConGoogle;
})();
