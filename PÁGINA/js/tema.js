/* Modo diurno / nocturno. Guarda la elección del lector y, si no eligió, respeta el modo de su sistema.
   Se carga en <head> (sin defer) para aplicar el tema antes de pintar y evitar el destello. */
(function () {
    'use strict';
    var KEY = 'mca-tema';
    var root = document.documentElement;

    function guardado() {
        try { var v = localStorage.getItem(KEY); return v === 'light' || v === 'dark' ? v : null; } catch (e) { return null; }
    }
    function delSistema() {
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    }
    function aplicar(t) {
        if (t === 'light') root.setAttribute('data-theme', 'light');
        else root.removeAttribute('data-theme');
        var b = document.querySelector('.m-theme-btn');
        if (b) {
            var claro = t === 'light';
            b.setAttribute('aria-pressed', String(claro));
            b.setAttribute('aria-label', claro ? 'Cambiar a modo nocturno' : 'Cambiar a modo diurno');
            b.title = claro ? 'Modo nocturno' : 'Modo diurno';
        }
    }
    var actual = guardado() || delSistema();
    aplicar(actual);

    function init() {
        var links = document.querySelector('.m-links');
        if (!links || document.querySelector('.m-theme-btn')) return;
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'm-theme-btn';
        b.innerHTML = '<i class="fa-solid fa-sun" aria-hidden="true"></i><i class="fa-solid fa-moon" aria-hidden="true"></i>';
        b.addEventListener('click', function () {
            actual = actual === 'light' ? 'dark' : 'light';
            try { localStorage.setItem(KEY, actual); } catch (e) {}
            aplicar(actual);
        });
        links.appendChild(b);
        aplicar(actual);
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();

    // Si el lector no eligió nada, acompañar los cambios del sistema
    if (window.matchMedia) {
        var mq = window.matchMedia('(prefers-color-scheme: light)');
        var onChange = function () { if (!guardado()) { actual = delSistema(); aplicar(actual); } };
        if (mq.addEventListener) mq.addEventListener('change', onChange);
    }
})();
