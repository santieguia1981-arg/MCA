/* Sesión de usuario y sincronización del progreso del quiz con Supabase.
   - Sin configurar (js/config.js vacío) o sin conexión: todo sigue funcionando en local.
   - Se sincronizan solo historial, errores a repasar y última configuración (no el examen en curso). */
(function () {
    'use strict';
    var cfg = window.MCA_CONFIG || {};
    var KEYS = { history: 'mca.quiz.history.v1', wrong: 'mca.quiz.wrong.v1', config: 'mca.quiz.config.v1' };
    var STAMP = 'mca.quiz.stamp.v1';   // última modificación local
    var SYNCED = 'mca.quiz.synced.v1'; // este navegador ya se sincronizó alguna vez con la nube

    var configurado = !!(cfg.SUPABASE_URL && cfg.SUPABASE_ANON_KEY && window.supabase && window.supabase.createClient);
    var client = null, user = null, listeners = [], timer = null, pulling = false;

    function lsGet(k) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : null; } catch (e) { return null; } }
    function lsSetRaw(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
    function lsDelRaw(k) { try { localStorage.removeItem(k); } catch (e) {} }

    function leerLocal() {
        return {
            history: lsGet(KEYS.history) || [],
            wrong: lsGet(KEYS.wrong) || [],
            config: lsGet(KEYS.config),
            updated: lsGet(STAMP) || 0
        };
    }
    function escribirLocal(d) {
        if (d.history && d.history.length) lsSetRaw(KEYS.history, d.history); else lsDelRaw(KEYS.history);
        if (d.wrong && d.wrong.length) lsSetRaw(KEYS.wrong, d.wrong); else lsDelRaw(KEYS.wrong);
        if (d.config) lsSetRaw(KEYS.config, d.config); else lsDelRaw(KEYS.config);
        lsSetRaw(STAMP, d.updated || Date.now());
    }
    function unirHistorial(a, b) {
        var vistos = {}, out = [];
        (a || []).concat(b || []).forEach(function (h) {
            if (h && h.t && !vistos[h.t]) { vistos[h.t] = 1; out.push(h); }
        });
        out.sort(function (x, y) { return y.t - x.t; });
        return out.slice(0, 15);
    }
    function unirUnicos(a, b) {
        var s = {};
        (a || []).concat(b || []).forEach(function (k) { s[k] = 1; });
        return Object.keys(s);
    }

    function avisar() { listeners.forEach(function (f) { try { f(user); } catch (e) {} }); }

    async function empujar() {
        if (!client || !user) return;
        var l = leerLocal();
        var datos = { history: l.history, wrong: l.wrong, config: l.config, updated: l.updated || Date.now() };
        var r = await client.from('progreso').upsert({ user_id: user.id, datos: datos, updated_at: new Date().toISOString() });
        if (r.error) console.warn('MCA: no se pudo guardar el progreso en la nube', r.error.message);
        else lsSetRaw(SYNCED, 1);
    }

    async function traer() {
        if (!client || !user || pulling) return;
        pulling = true;
        try {
            var r = await client.from('progreso').select('datos').eq('user_id', user.id).maybeSingle();
            if (r.error) { console.warn('MCA: no se pudo leer el progreso', r.error.message); return; }
            var local = leerLocal();
            if (!r.data) { await empujar(); return; }
            var nube = r.data.datos || {};
            var yaSincronizado = !!lsGet(SYNCED);
            var merged = {
                history: unirHistorial(local.history, nube.history),
                // primer ingreso en este navegador: se unen los errores; después gana lo más reciente
                wrong: !yaSincronizado ? unirUnicos(local.wrong, nube.wrong)
                    : ((nube.updated || 0) > (local.updated || 0) ? (nube.wrong || []) : local.wrong),
                config: (nube.updated || 0) > (local.updated || 0) ? (nube.config || local.config) : (local.config || nube.config),
                updated: Math.max(local.updated || 0, nube.updated || 0, Date.now())
            };
            escribirLocal(merged);
            lsSetRaw(SYNCED, 1);
            await empujar();
            document.dispatchEvent(new CustomEvent('mca:cloud-pulled'));
        } finally { pulling = false; }
    }

    var API = {
        configurado: configurado,
        usuario: function () { return user; },
        onChange: function (f) { listeners.push(f); },
        // El quiz avisa cada vez que cambia algo sincronizable
        marcarCambio: function (key) {
            var esSync = false;
            for (var n in KEYS) if (KEYS[n] === key) esSync = true;
            if (!esSync) return;
            lsSetRaw(STAMP, Date.now());
            if (!user) return;
            clearTimeout(timer);
            timer = setTimeout(empujar, 1500);
        },
        enviarEnlace: ingresarConPassword: async function (email, password) {
            if (!configurado) return { error: { message: 'no-configurado' } };
            return client.auth.signInWithPassword({ email: email, password: password });
        },
        registrarConPassword: async function (email, password) {
            if (!configurado) return { error: { message: 'no-configurado' } };
            return client.auth.signUp({ email: email, password: password });
        },
        recuperarPassword: async function (email) {
            if (!configurado) return { error: { message: 'no-configurado' } };
            return client.auth.resetPasswordForEmail(email, {
                redirectTo: location.origin + '/reset-password.html'
            });
        },
        getSession: async function () {
            if (!configurado) return { data: { session: null } };
            return client.auth.getSession();
        },async function (email) {
            if (!configurado) return { error: { message: 'no-configurado' } };
            return client.auth.signInWithOtp({
                email: email,
                options: { emailRedirectTo: location.origin + location.pathname }
            });
        },
        salir: async function () {
            if (client) await client.auth.signOut();
            user = null; avisar();
        }
    };
    window.MCA_CLOUD._client = client;

    if (!configurado) return;
    client = window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY, {
        auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
    });
    client.auth.onAuthStateChange(function (evento, session) {
        user = session && session.user ? session.user : null;
        avisar();
        if (user && (evento === 'SIGNED_IN' || evento === 'INITIAL_SESSION')) traer();
    });
})();
