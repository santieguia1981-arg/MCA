/* Mejoras de navegación compartidas: saltar al contenido, volver arriba y atajo "/" para buscar. */
(function () {
    'use strict';

    function init() {
        // 1) Enlace "Saltar al contenido" (accesibilidad por teclado)
        var main = document.querySelector('main');
        if (main) {
            if (!main.id) main.id = 'contenido';
            main.setAttribute('tabindex', '-1');
            var skip = document.createElement('a');
            skip.className = 'm-skip';
            skip.href = '#' + main.id;
            skip.textContent = 'Saltar al contenido';
            skip.addEventListener('click', function (e) {
                e.preventDefault();
                main.focus();
                main.scrollIntoView();
            });
            document.body.insertBefore(skip, document.body.firstChild);
        }

        // 2) Botón "Volver arriba" (aparece al bajar)
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'm-totop';
        btn.setAttribute('aria-label', 'Volver arriba');
        btn.innerHTML = '<i class="fa-solid fa-arrow-up" aria-hidden="true"></i>';
        btn.addEventListener('click', function () {
            var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
        });
        document.body.appendChild(btn);
        var ticking = false;
        function onScroll() {
            if (ticking) return;
            ticking = true;
            window.requestAnimationFrame(function () {
                btn.classList.toggle('is-visible', window.scrollY > 700);
                ticking = false;
            });
        }
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();

        // 3) Atajo "/" para ir al buscador (si la página tiene uno)
        var search = document.getElementById('norm-search');
        if (search) {
            document.addEventListener('keydown', function (e) {
                if (e.key !== '/' || e.ctrlKey || e.metaKey || e.altKey) return;
                var t = e.target, tag = t && t.tagName;
                if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || (t && t.isContentEditable)) return;
                e.preventDefault();
                search.focus();
                search.select();
            });
        }
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
})();
