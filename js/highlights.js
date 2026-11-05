/* Experience highlights stay tucked away behind a prompt with a blinking
   cursor. Click it and the highlights type themselves out, one after
   another, with the cursor running along the line being typed and then
   resting at the end. Click again to tuck them away.
   Without JavaScript the highlights simply show as normal. */
(function () {
    'use strict';

    var calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var SPEED = 14; // ms per character

    function caret() {
        var c = document.createElement('i');
        c.className = 'hl-caret';
        c.setAttribute('aria-hidden', 'true');
        return c;
    }

    document.querySelectorAll('.job-highlights').forEach(function (list, n) {
        var label = list.previousElementSibling;
        if (!label || !label.classList.contains('highlights-label')) return;
        var items = Array.prototype.slice.call(list.querySelectorAll('li'));
        var texts = items.map(function (li) { return li.textContent.trim(); });

        var id = list.id || ('highlights-' + (n + 1));
        list.id = id;
        list.hidden = true;
        list.classList.add('hl-js');

        // The label becomes a prompt you can click
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'hl-prompt';
        btn.setAttribute('aria-controls', id);
        btn.setAttribute('aria-expanded', 'false');
        btn.innerHTML = '<span class="hl-ps" aria-hidden="true">&gt;</span> ' +
            '<span class="hl-word">Highlights</span> <span class="hl-num">(' + items.length + ')</span>';
        var promptCaret = caret();
        btn.appendChild(promptCaret);
        label.replaceChildren(btn);

        var open = false, timer = null;

        function stopTyping() {
            clearTimeout(timer);
            list.querySelectorAll('.hl-caret').forEach(function (c) { c.remove(); });
        }

        function typeAll() {
            var cur = caret(), i = 0, c = 0;
            items.forEach(function (li) { li.textContent = ''; li.classList.remove('is-typed'); });
            list.setAttribute('aria-busy', 'true');
            (function step() {
                if (i >= items.length) { list.removeAttribute('aria-busy'); return; }
                var li = items[i], full = texts[i];
                if (c === 0) { li.classList.add('is-typed'); li.appendChild(cur); }
                c = Math.min(full.length, c + (calm ? full.length : 2));
                li.firstChild && li.firstChild.nodeType === 3
                    ? (li.firstChild.nodeValue = full.slice(0, c))
                    : li.insertBefore(document.createTextNode(full.slice(0, c)), cur);
                if (c >= full.length) {
                    i++; c = 0;
                    if (i < items.length) li.removeChild(cur);
                    timer = setTimeout(step, calm ? 0 : 160);
                } else {
                    timer = setTimeout(step, SPEED * 2);
                }
            })();
        }

        btn.addEventListener('click', function () {
            open = !open;
            btn.setAttribute('aria-expanded', String(open));
            btn.classList.toggle('is-open', open);
            stopTyping();
            if (open) {
                list.hidden = false;
                promptCaret.hidden = true;
                typeAll();
            } else {
                list.hidden = true;
                promptCaret.hidden = false;
                items.forEach(function (li, k) { li.textContent = texts[k]; });
            }
        });
    });
})();
