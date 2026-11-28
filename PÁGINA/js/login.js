// login.js - MCA
(function() {
  if (!window.MCA_CLOUD) { console.error('MCA_CLOUD no cargado'); return; }

  let btn = document.getElementById('mca-login-btn');
  if (!btn) {
    btn = document.createElement('button');
    btn.id = 'mca-login-btn';
    btn.textContent = 'Ingresar';
    btn.style.cssText = 'padding:8px 16px; border-radius:999px; border:1px solid #ccc; background:white; cursor:pointer; font-weight:600;';
    const header = document.querySelector('header') || document.body;
    header.appendChild(btn);
  }

  let modal = document.getElementById('mca-login-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'mca-login-modal';
    modal.style.cssText = 'display:none; position:fixed; inset:0; background:rgba(0,0,0,0.5); z-index:9999; align-items:center; justify-content:center;';
    modal.innerHTML = `
      <div style="background:white; border-radius:20px; padding:24px; width:90%; max-width:400px; position:relative;">
        <button id="mca-close" style="position:absolute; top:12px; right:12px; background:none; border:none; font-size:20px; cursor:pointer;">×</button>
        <div id="mca-modal-content"></div>
      </div>
    `;
    document.body.appendChild(modal);
    modal.querySelector('#mca-close').onclick = () => modal.style.display = 'none';
    modal.onclick = (e) => { if (e.target === modal) modal.style.display = 'none'; };
  }

  const content = modal.querySelector('#mca-modal-content');

  function renderLogin() {
    content.innerHTML = `
      <h2 style="text-align:center; margin:0 0 8px;">Ingresá a MCA</h2>
      <p style="text-align:center; color:#666; margin:0 0 16px;">Ingresá con tu email y contraseña.</p>
      <input id="mca-email" type="email" placeholder="Email" style="width:100%; padding:12px; border-radius:12px; border:1px solid #ddd; margin-bottom:12px; box-sizing:border-box;">
      <input id="mca-pass" type="password" placeholder="Contraseña" style="width:100%; padding:12px; border-radius:12px; border:1px solid #ddd; margin-bottom:12px; box-sizing:border-box;">
      <button id="mca-submit" style="width:100%; padding:12px; border-radius:12px; border:none; background:#111; color:white; font-weight:600; cursor:pointer;">Ingresar</button>
      <div style="text-align:center; margin-top:12px;">
        <a href="#" id="mca-forgot" style="color:#666; font-size:14px;">Olvidé mi contraseña</a>
      </div>
      <div style="text-align:center; margin-top:8px;">
        <span style="color:#666; font-size:14px;">¿No tenés cuenta? </span>
        <a href="#" id="mca-register" style="font-weight:600;">Registrate</a>
      </div>
      <p id="mca-msg" style="text-align:center; margin-top:12px; font-size:14px;"></p>
    `;

    const email = content.querySelector('#mca-email');
    const pass = content.querySelector('#mca-pass');
    const submit = content.querySelector('#mca-submit');
    const msg = content.querySelector('#mca-msg');
    const reg = content.querySelector('#mca-register');
    const forgot = content.querySelector('#mca-forgot');
    let modo = 'login';

    reg.onclick = (e) => {
      e.preventDefault();
      modo = modo === 'login' ? 'register' : 'login';
      submit.textContent = modo === 'login' ? 'Ingresar' : 'Crear cuenta';
      reg.textContent = modo === 'login' ? 'Registrate' : 'Ingresá';
      msg.textContent = '';
    };

    forgot.onclick = async (e) => {
      e.preventDefault();
      if (!email.value) { msg.textContent = 'Poné tu email primero'; msg.style.color = 'red'; return; }
      msg.textContent = 'Enviando...'; msg.style.color = '#666';
      try {
        await window.MCA_CLOUD.recuperarPassword(email.value);
        msg.textContent = 'Te mandamos un email para recuperar la contraseña';
        msg.style.color = 'green';
      } catch (err) {
        msg.textContent = err.message || 'Error al enviar';
        msg.style.color = 'red';
      }
    };

    submit.onclick = async () => {
      msg.textContent = 'Cargando...'; msg.style.color = '#666';
      try {
        if (modo === 'login') {
          await window.MCA_CLOUD.ingresarConPassword(email.value, pass.value);
          msg.textContent = '¡Listo!'; msg.style.color = 'green';
          setTimeout(() => modal.style.display = 'none', 800);
        } else {
          await window.MCA_CLOUD.registrarConPassword(email.value, pass.value);
          msg.textContent = '¡Cuenta creada! Ya podés ingresar'; msg.style.color = 'green';
          modo = 'login'; submit.textContent = 'Ingresar';
        }
      } catch (err) {
        msg.textContent = err.message || 'Error';
        msg.style.color = 'red';
      }
    };
  }

  function renderLoggedIn(user) {
    content.innerHTML = `
      <h2 style="text-align:center; margin:0 0 8px;">Hola 👋</h2>
      <p style="text-align:center; color:#666; margin:0 0 16px;">${user.email}</p>
      <button id="mca-logout" style="width:100%; padding:12px; border-radius:12px; border:none; background:#e11; color:white; font-weight:600; cursor:pointer;">Cerrar sesión</button>
      <p id="mca-msg" style="text-align:center; margin-top:12px; font-size:14px;"></p>
    `;
    content.querySelector('#mca-logout').onclick = async () => {
      await window.MCA_CLOUD.salir();
      modal.style.display = 'none';
    };
  }

  async function pintar() {
    try {
      const session = await window.MCA_CLOUD.getSession();
      const user = session?.user || window.MCA_CLOUD.usuario;
      if (user) {
        btn.textContent = user.email.split('@')[0];
        btn.onclick = () => { renderLoggedIn(user); modal.style.display = 'flex'; };
      } else {
        btn.textContent = 'Ingresar';
        btn.onclick = () => { renderLogin(); modal.style.display = 'flex'; };
      }
    } catch (e) {
      btn.textContent = 'Ingresar';
      btn.onclick = () => { renderLogin(); modal.style.display = 'flex'; };
    }
  }

  if (window.MCA_CLOUD.onChange) {
    window.MCA_CLOUD.onChange(() => pintar());
  }
  pintar();
})();
