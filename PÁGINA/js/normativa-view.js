/* Desplegable de la normativa completa: Título > Capítulo > Sección > Artículo (+ Anexos).
   Los nodos se construyen al abrirlos (carga diferida) para que la página siga ágil con ~2.150 artículos. */
(function () {
    'use strict';
    var D = window.NORMATIVA || [];
    var META = window.NORMATIVA_META || {};
    var root = document.getElementById('norm-tree');
    if (!root) return;

    var LABEL = { title: 'TÍTULO', chapter: 'CAPÍTULO', section: 'SECCIÓN', anexo: 'ANEXO' };

    function esc(s) {
        return String(s).replace(/[&<>"]/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
        });
    }
    function fold(s) {
        return String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
    }
    function nodeAt(path) {
        var idx = path.split('.').map(Number);
        var n = D[idx[0]];
        for (var i = 1; i < idx.length; i++) n = n.children[idx[i]];
        return n;
    }
    function artCount(n) {
        if (n._ac !== undefined) return n._ac;
        var c = n.kind === 'article' ? 1 : 0;
        (n.children || []).forEach(function (k) { c += artCount(k); });
        n._ac = c;
        return c;
    }
    function artLabel(n) {
        var suffix = String(n.num).replace(/^\d+\s*/, '');
        return 'Art. ' + n.n + '°' + (suffix ? ' ' + suffix : '');
    }
    function paragraphs(text) {
        if (!text) return '';
        return text.split('\n').map(function (p) { return p.trim() ? '<p>' + esc(p) + '</p>' : ''; }).join('');
    }

    function make(n, path) {
        var d = document.createElement('details');
        d.className = 'norm norm-' + n.kind;
        d.setAttribute('data-p', path);
        var s = document.createElement('summary');
        var tag, badge = '';
        if (n.kind === 'article') {
            tag = artLabel(n);
        } else {
            tag = LABEL[n.kind] + ' ' + n.num;
            var c = artCount(n);
            if (c) badge = '<span class="n-badge">' + c + (c === 1 ? ' artículo' : ' artículos') + '</span>';
        }
        s.innerHTML = '<span class="n-tag">' + esc(tag) + '</span>' +
            '<span class="n-name">' + esc(n.name || '') + '</span>' + badge +
            '<span class="n-chev" aria-hidden="true">▾</span>';
        d.appendChild(s);
        var body = document.createElement('div');
        body.className = 'n-body';
        d.appendChild(body);
        return d;
    }

    function fill(d) {
        if (d._filled) return;
        d._filled = true;
        var n = nodeAt(d.getAttribute('data-p'));
        var body = d.querySelector(':scope > .n-body');
        var html = n.text ? '<div class="n-text">' + paragraphs(n.text) + '</div>' : '';
        (n.nota || []).forEach(function (t) { html += '<p class="n-fuente">' + esc(t) + '</p>'; });
        if (n.fuente && n.fuente.length) {
            var VIG = META.vigencias || {};
            html += '<p class="n-fuente">Fuente: ' + esc(n.fuente.map(function (id) {
                var lbl = id.replace(/^RGCRGN(\d+)-(\d\d)$/, function (m, a, b) { return 'RG ' + a + '/20' + b; });
                return VIG[id] ? lbl + ' (' + VIG[id] + ')' : lbl;
            }).join(', ')) + '</p>';
        }
        body.innerHTML = html;
        (n.children || []).forEach(function (k, i) {
            body.appendChild(make(k, d.getAttribute('data-p') + '.' + i));
        });
    }

    // ---- árbol raíz ----
    var frag = document.createDocumentFragment();
    D.forEach(function (t, i) { frag.appendChild(make(t, String(i))); });
    root.appendChild(frag);

    // carga diferida al abrir (el evento toggle no burbujea: se escucha en captura)
    root.addEventListener('toggle', function (e) {
        var d = e.target;
        if (d.tagName === 'DETAILS' && d.open) fill(d);
    }, true);

    // ---- estadísticas / cabecera ----
    var st = { title: 0, chapter: 0, section: 0, article: 0, anexo: 0 };
    (function walk(list) {
        list.forEach(function (n) { st[n.kind]++; walk(n.children || []); });
    })(D);
    var stats = document.getElementById('norm-stats');
    if (stats) {
        stats.textContent = st.title + ' Títulos · ' + st.chapter + ' Capítulos · ' + st.section +
            ' Secciones · ' + st.article + ' Artículos · ' + st.anexo + ' Anexos';
    }
    var dateEl = document.getElementById('norm-date');
    if (dateEl) dateEl.textContent = META.fecha || '';
    var updEl = document.getElementById('norm-upd');
    if (updEl) updEl.textContent = META.actualizacion || '';

    // ---- abrir una ruta completa (para resultados de búsqueda) ----
    function openPath(path) {
        var parts = path.split('.');
        var container = root;
        for (var i = 0; i < parts.length; i++) {
            var p = parts.slice(0, i + 1).join('.');
            var el = container.querySelector(':scope > details[data-p="' + p + '"]');
            if (!el) return null;
            el.open = true;
            fill(el);
            container = el.querySelector(':scope > .n-body');
        }
        return container.parentElement;
    }

    // ---- botones ----
    var collapse = document.getElementById('norm-collapse');
    if (collapse) collapse.addEventListener('click', function () {
        root.querySelectorAll('details[open]').forEach(function (d) { d.open = false; });
        window.scrollTo({ top: root.getBoundingClientRect().top + window.scrollY - 140, behavior: 'smooth' });
    });
    function openLevel(depth) {
        // depth 1 = Títulos; depth 2 = Títulos y Capítulos
        root.querySelectorAll(':scope > details').forEach(function (t) {
            t.open = true; fill(t);
            if (depth > 1) t.querySelectorAll(':scope > .n-body > details').forEach(function (c) { c.open = true; fill(c); });
        });
    }
    var openChapters = document.getElementById('norm-open-chapters');
    if (openChapters) openChapters.addEventListener('click', function () { openLevel(2); });
    openLevel(1); // primera visualización: todos los Títulos abiertos

    // ---- buscador (texto de artículos, nombres de apartados y número de artículo) ----
    var flat = null;
    function buildFlat() {
        flat = [];
        (function walk(list, base, trail) {
            list.forEach(function (n, i) {
                var path = base ? base + '.' + i : String(i);
                var t = trail.concat([n.kind === 'article' ? artLabel(n) : (LABEL[n.kind] + ' ' + n.num)]);
                var hay = fold((n.name || '') + ' ' + (n.text || '') + ' ' + (n.fuente ? n.fuente.join(' ') : '') + ' ' + (n.nota ? n.nota.join(' ') : ''));
                flat.push({ path: path, n: n, trail: t, hay: hay, isArt: n.kind === 'article' });
                walk(n.children || [], path, t);
            });
        })(D, '', []);
    }
    var input = document.getElementById('norm-search');
    var results = document.getElementById('norm-results');
    var timer = null;
    function search() {
        var q = fold(input.value.trim());
        results.innerHTML = '';
        if (q.length < 3) { results.classList.add('hidden'); return; }
        if (!flat) buildFlat();
        var words = q.split(/\s+/).filter(Boolean);
        var out = [], total = 0;
        for (var i = 0; i < flat.length; i++) {
            var f = flat[i], ok = true;
            for (var w = 0; w < words.length; w++) { if (f.hay.indexOf(words[w]) === -1) { ok = false; break; } }
            if (!ok) continue;
            total++;
            if (out.length < 40) out.push(f);
        }
        results.classList.remove('hidden');
        if (!out.length) {
            results.innerHTML = '<p class="norm-res-empty">Sin resultados para “' + esc(input.value) + '”.</p>';
            return;
        }
        var head = '<p class="norm-res-count">' + total + ' resultado' + (total === 1 ? '' : 's') +
            (total > out.length ? ' (se muestran los primeros ' + out.length + ')' : '') + '</p>';
        results.innerHTML = head + out.map(function (f) {
            var txt = f.n.text || '';
            var pos = fold(txt).indexOf(words[0]);
            var snip = '';
            if (pos > -1) {
                var a = Math.max(0, pos - 60);
                snip = (a > 0 ? '…' : '') + txt.substr(a, 190).replace(/\n/g, ' ') + '…';
            }
            return '<button type="button" class="norm-res" data-path="' + f.path + '">' +
                '<span class="norm-res-trail">' + esc(f.trail.join(' › ')) + '</span>' +
                '<span class="norm-res-name">' + esc(f.n.name || '') + '</span>' +
                (snip ? '<span class="norm-res-snip">' + esc(snip) + '</span>' : '') + '</button>';
        }).join('');
    }
    if (input) {
        input.addEventListener('input', function () { clearTimeout(timer); timer = setTimeout(search, 250); });
        results.addEventListener('click', function (e) {
            var b = e.target.closest('.norm-res');
            if (!b) return;
            var el = openPath(b.getAttribute('data-path'));
            if (el) setTimeout(function () {
                window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 110, behavior: 'smooth' });
                el.classList.add('norm-flash');
                setTimeout(function () { el.classList.remove('norm-flash'); }, 1800);
            }, 60);
        });
    }
})();
