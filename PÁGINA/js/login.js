/* Botón "Ingresar" y ventana de acceso. Usa window.MCA_CLOUD (js/nube.js, Supabase). */
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
    overlay.innerHTML = '<div class="m-login-card" role="dialog" aria-modal="true" aria-labelledby="m-login-title"><button type="button" class="m-login-close" aria-label="Cerrar"><i class="fa-solid fa-xmark"></i></button><div class="m-login-body"></div></div>';
    document.body.appendChild(overlay);
    var body = overlay.querySelector('.m-login-body');
    function cerrar() { overlay.hidden = true; document.body.style.overflow = ''; }
    function mostrarLogin() {
      body.innerHTML = '<h2 id="m-login-title">Ingresá a MCA</h2><p>Ingresá con tu email y contraseña.</p><form id="m-login-form"><input type="email" id="m-email" placeholder="Email" required><input type="password" id="m-pass" placeholder="Contraseña" required><button type="submit" id="m-btn-login">Ingresar</button></form><button type="button" id="m-btn-reset">Olvidé mi contraseña</button><button type="button" id="m-btn-signup">¿No tenés cuenta? Registrate</button><p id="m-msg"></p>';
      var form = document.getElementById('m-login-form');
      var msg = document.getElementById('m-msg');
      form.addEventListener('submit', async function(e) {
        e.preventDefault();
        var email = document.getElementById('m-email').value.trim();
        var pass = document.getElementById('m-pass').value;
        if (!emailValido(email)) { msg.textContent = 'Email inválido'; return; }
        msg.textContent = 'Ingresando...';
        var r = await nube.ingresarConPassword(email, pass);
        if (r.error) msg.textContent = r.error.message;
        else { msg.textContent = '¡Bienvenido!'; setTimeout(cerrar, 800); }
      });
      document.getElementById('m-btn-reset').addEventListener('click', async function() {
        var email = document.getElementById('m-email').value.trim();
        if (!emailValido(email)) { msg.textContent = 'Poné tu email primero'; return; }
        var r = await nube.recuperarPassword(email);
        msg.textContent = r.error ? r.error.message : 'Te mandamos un mail para cambiar la contraseña';
      });
      document.getElementById('m-btn-signup').addEventListener('click', mostrarRegistro);
    }
    function mostrarRegistro() {
      body.innerHTML = '<h2 id="m-login-title">Crear cuenta</h2><p>Creá tu cuenta con email y contraseña.</p><form id="m-signup-form"><input type="email" id="m-email2" placeholder="Email" required><input type="password" id="m-pass2" placeholder="Contraseña (mínimo 6 caracteres)" required><button type="submit">Crear cuenta</button></form><button type="button" id="m-btn-back">¿Ya tenés cuenta? Ingresá</button><p id="m-msg2"></p>';
      var form = document.getElementById('m-signup-form');
      var msg = document.getElementById('m-msg2');
      form.addEventListener('submit', async function(e) {
        e.preventDefault();
        var email = document.getElementById('m-email2').value.trim();
        var pass = document.getElementById('m-pass2').value;
        if (!emailValido(email)) { msg.textContent = 'Email inválido'; return; }
        if (pass.length < 6) { msg.textContent = 'La contraseña debe tener al menos 6 caracteres'; return; }
        msg.textContent = 'Creando cuenta...';
        var r = await nube.registrarConPassword(email, pass);
        if (r.error) msg.textContent = r.error.message;
        else msg.textContent = '¡Cuenta creada! Ya podés ingresar';
      });
      document.getElementById('m-btn-back').addEventListener('click', mostrarLogin);
    }
    overlay.querySelector('.m-login-close').addEventListener('click', cerrar);
    overlay.addEventListener('click', function(e) { if (e.target === overlay) cerrar(); });
    btn.addEventListener('click', function() { overlay.hidden = false; document.body.style.overflow = 'hidden'; mostrarLogin(); });
    async function actualizarBtn() {
      try {
        var r = await nube.getSession();
        if (r.data && r.data.session) {
          btn.textContent = 'Mi cuenta';
          btn.onclick = async function() { await nube.salir(); location.reload(); };
        } else { btn.textContent = 'Ingresar'; }
      } catch(e) { btn.textContent = 'Ingresar'; }
    }
    actualizarBtn();
    nube.onChange(function(u) {
      if (u) { btn.textContent = 'Mi cuenta'; btn.onclick = async function() { await nube.salir(); location.reload(); }; }
      else { btn.textContent = 'Ingresar'; }
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
