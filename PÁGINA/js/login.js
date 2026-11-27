// login.js - MCA
(function() {
  const client = window.MCA_CLOUD._client;
  if (!client) {
    console.error('MCA_CLOUD no cargado');
    return;
  }

  // Crear botón en el header
  let btn = document.getElementById('mca-login-btn');
  if (!btn) {
    btn = document.createElement('button');
    btn.id = 'mca-login-btn';
    btn.textContent = 'Ingresar';
    btn.style.cssText = 'padding:8px 16px; border-radius:999px; border:1px solid #ccc; background:white; cursor:pointer; font-weight:600;';
    // Buscá dónde ponerlo: al lado de la luna
    const header = document.querySelector('header') || document.body;
    header.appendChild(btn);
  }

  // Crear modal
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

    let modo = 'login'; // login | register

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
      const { error } = await client.auth.resetPasswordForEmail(email.value);
      msg.textContent = error ? error.message : 'Te mandamos un email para recuperar la contraseña';
      msg.style.color = error ? 'red' : 'green';
    };

    submit.onclick = async () => {
      msg.textContent = 'Cargando...';
      msg.style.color = '#666';
      if (modo === 'login') {
        const { error } = await client.auth.signInWithPassword({ email: email.value, password: pass.value });
        if (error) { msg.textContent = error.message; msg.style.color = 'red'; }
        else { msg.textContent = '¡Listo!'; msg.style.color = 'green'; setTimeout(() => modal.style.display = 'none', 800); }
      } else {
        const { error } = await client.auth.signUp({ email: email.value, password: pass.value });
        if (error) { msg.textContent = error.message; msg.style.color = 'red'; }
        else { msg.textContent = '¡Cuenta creada! Ya podés ingresar'; msg.style.color = 'green'; modo = 'login'; submit.textContent = 'Ingresar'; }
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
      await client.auth.signOut();
      modal.style.display = 'none';
    };
  }

  async function pintar() {
    const { data: { session } } = await client.auth.getSession();
    if (session?.user) {
      btn.textContent = session.user.email.split('@')[0];
      btn.onclick = () => { renderLoggedIn(session.user); modal.style.display = 'flex'; };
    } else {
      btn.textContent = 'Ingresar';
      btn.onclick = () => { renderLogin(); modal.style.display = 'flex'; };
    }
  }

  client.auth.onAuthStateChange(() => pintar());
  pintar();
})();
