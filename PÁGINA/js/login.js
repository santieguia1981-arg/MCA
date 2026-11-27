/* Botón "Ingresar" y ventana de acceso. Usa window.MCA_CLOUD (js/nube.js, Supabase).
   Acceso con email + contraseña. */
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
    }

    function mostrarLogin() {
      body.innerHTML =
        '<h2 id="m-login-title">Ingresá a MCA</h2>' +
        '<p>Ingresá con tu email y contraseña.</p>' +
        '<form id="m-login-form">' +
        '<input type="email" id="m-email" placeholder="Email" required>' +
        '<input type="password" id="m-pass" placeholder="Contraseña" required>' +
        '<button type="submit" id="m-btn-login">Ingresar</button>' +
        '</form>' +
        '<button type="button" id="m-btn-reset">Olvidé mi contraseña</button>' +
        '<button type="button" id="m-btn-signup">¿No tenés cuenta? Registrate</button>' +
        '<p id="m-msg"></p>';

      var form = document.getElementById('m-login-form');
      var msg = document.getElementById('m-msg');

      form.addEventListener('submit', async function(e) {
        e.preventDefault();
        var email = document.getElementById('m-email').value.trim();
        var pass = document.getElementById('m-pass').value;
        if (!emailValido(email)) { msg.textContent = 'Email inválido'; return; }
        msg.textContent = 'Ingresando...';
        var supabase = nube.supabase || nube.client || nube;
        var { error } = await supabase.auth.signInWithPassword({ email: email, password: pass });
        if (error) msg.textContent = error.message;
        else { msg.textContent = '¡Bienvenido!'; setTimeout(cerrar, 800); }
      });

      document.getElementById('m-btn-reset').addEventListener('click', async function() {
        var email = document.getElementById('m-email').value.trim();
        if (!emailValido(email)) { msg.textContent = 'Poné tu email primero'; return; }
        var supabase = nube.supabase || nube.client || nube;
        var { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: 'https://mercado-de-capitales-argentino.vercel.app/reset-password'
        });
        msg.textContent = error ? error.message : 'Te mandamos un mail para cambiar la contraseña';
      });

      document.getElementById('m-btn-signup').addEventListener('click', mostrarRegistro);
    }

    function mostrarRegistro() {
      body.innerHTML =
        '<h2 id="m-login-title">Crear cuenta</h2>' +
        '<p>Creá tu cuenta con email y contraseña.</p>' +
        '<form id="m-signup-form">' +
        '<input type="email" id="m-email2" placeholder="Email" required>' +
        '<input type="password" id="m-pass2" placeholder="Contraseña (mínimo 6 caracteres)" required>' +
        '<button type="submit" id="m-btn-signup2">Crear cuenta</button>' +
        '</form>' +
        '<button type="button" id="m-btn-back">¿Ya tenés cuenta? Ingresá</button>' +
        '<p id="m-msg2"></p>';

      var form = document.getElementById('m-signup-form');
      var msg = document.getElementById('m-msg2');

      form.addEventListener('submit', async function(e) {
        e.preventDefault();
        var email = document.getElementById('m-email2').value.trim();
        var pass = document.getElementById('m-pass2').value;
        if (!emailValido(email)) { msg.textContent = 'Email inválido'; return; }
        if (pass.length < 6) { msg.textContent = 'La contraseña debe tener al menos 6 caracteres'; return; }
        msg.textContent = 'Creando cuenta...';
        var supabase = nube.supabase || nube.client || nube;
        var { error } = await supabase.auth.signUp({ email: email, password: pass });
        if (error) msg.textContent = error.message;
        else msg.textContent = '¡Cuenta creada! Ya podés ingresar';
      });

      document.getElementById('m-btn-back').addEventListener('click', mostrarLogin);
    }

    overlay.querySelector('.m-login-close').addEventListener('click', cerrar);
    overlay.addEventListener('click', function(e) { if (e.target === overlay) cerrar(); });

    btn.addEventListener('click', function() {
      overlay.hidden = false;
      document.body.style.overflow = 'hidden';
      mostrarLogin();
    });

    // Actualizar botón según sesión
    async function actualizarBtn() {
      var supabase = nube.supabase || nube.client || nube;
      var { data } = await supabase.auth.getSession();
      if (data.session) {
        btn.textContent = 'Mi cuenta';
        btn.onclick = async function() {
          await supabase.auth.signOut();
          location.reload();
        };
      } else {
        btn.textContent = 'Ingresar';
      }
    }
    actualizarBtn();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
