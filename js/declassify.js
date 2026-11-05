/* Experience highlights start "classified": each one is blacked out like a
   redacted document. Click Declassify (or any blacked-out line) and the bars
   peel away one by one while the text decodes. Click again to redact.
   Without JavaScript the highlights simply show as normal. */
(function () {
    'use strict';

    var calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var GLYPHS = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789#$%&@';
    var LOCK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        '<rect x="5" y="11" width="14" height="10" rx="2"/><path class="shackle" d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>';

    function scramble(el, text, done) {
        if (calm) { el.textContent = text; return done && done(); }
        var settled = 0;
        (function step() {
            var out = '';
            for (var i = 0; i < text.length; i++) {
                var c = text.charAt(i);
                out += (i < settled || c === ' ') ? c : GLYPHS.charAt(Math.floor(Math.random() * GLYPHS.length));
            }
            el.textContent = out;
            if (settled >= text.length) return done && done();
            settled += 4;
            setTimeout(step, 22);
        })();
    }

    document.querySelectorAll('.job-highlights').forEach(function (list, n) {
        var label = list.previousElementSibling;
        if (!label || !label.classList.contains('highlights-label')) return;
        var items = Array.prototype.slice.call(list.querySelectorAll('li'));

        // Wrap each highlight so the black bar follows the lines of text
        var texts = items.map(function (li, i) {
            var t = li.textContent.trim();
            var span = document.createElement('span');
            span.className = 'hl-text';
            span.textContent = t;
            li.replaceChildren(span);
            li.style.setProperty('--i', i);
            return t;
        });

        var id = list.id || ('highlights-' + (n + 1));
        list.id = id;
        list.classList.add('is-redacted');

        var head = document.createElement('div');
        head.className = 'hl-head';
        label.parentNode.insertBefore(head, label);
        head.appendChild(label);
        label.innerHTML = 'Highlights <span class="hl-count">[' + items.length + ' classified]</span>';

        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'hl-reveal';
        btn.setAttribute('aria-controls', id);
        btn.setAttribute('aria-expanded', 'false');
        btn.innerHTML = LOCK + '<span>Declassify</span>';
        head.appendChild(btn);

        var open = false;
        function toggle() {
            open = !open;
            list.classList.toggle('is-redacted', !open);
            list.classList.toggle('is-open', open);
            btn.setAttribute('aria-expanded', String(open));
            btn.querySelector('span').textContent = open ? 'Redact' : 'Declassify';
            label.querySelector('.hl-count').textContent = '[' + items.length + (open ? ' declassified]' : ' classified]');
            if (open) {
                items.forEach(function (li, i) {
                    var span = li.querySelector('.hl-text');
                    setTimeout(function () { scramble(span, texts[i]); }, calm ? 0 : i * 180);
                });
            }
        }

        btn.addEventListener('click', toggle);
        list.addEventListener('click', function () { if (!open) toggle(); });
    });
})();
