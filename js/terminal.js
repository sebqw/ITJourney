/* The CRT PowerShell window in the hero:
   - green "digital rain" drawn on a canvas behind the text
   - switch-on effect, then the command is typed and each output line
     decodes from random characters into the real text.
   Everything is skipped for visitors who prefer reduced motion. */
(function () {
    'use strict';

    var term = document.querySelector('.terminal');
    if (!term) return;
    var pre = term.querySelector('pre');
    var canvas = term.querySelector('.t-rain');
    var calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (calm || !pre) return;

    var GLYPHS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノ0123456789ABCDEF<>/{}$#';
    function glyph() { return GLYPHS.charAt(Math.floor(Math.random() * GLYPHS.length)); }

    /* ---------- Digital rain ---------- */
    if (canvas && canvas.getContext) {
        var ctx = canvas.getContext('2d');
        var size = 14, drops = [], visible = true, last = 0;

        function resize() {
            var r = canvas.getBoundingClientRect();
            var dpr = Math.min(window.devicePixelRatio || 1, 2);
            canvas.width = Math.max(1, Math.round(r.width * dpr));
            canvas.height = Math.max(1, Math.round(r.height * dpr));
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            var cols = Math.ceil(r.width / size);
            drops = [];
            for (var i = 0; i < cols; i++) drops.push(Math.random() * -40);
        }

        function frame(t) {
            requestAnimationFrame(frame);
            if (!visible || document.hidden || t - last < 60) return;
            last = t;
            var w = canvas.width, h = canvas.height;
            ctx.fillStyle = 'rgba(7, 10, 8, 0.2)';
            ctx.fillRect(0, 0, w, h);
            ctx.font = size + 'px monospace';
            for (var i = 0; i < drops.length; i++) {
                var y = drops[i] * size;
                if (y > 0) {
                    ctx.fillStyle = Math.random() < 0.08 ? '#e6fff0' : '#4dff8f';
                    ctx.fillText(glyph(), i * size, y);
                }
                if (y > h / (window.devicePixelRatio || 1) && Math.random() > 0.97) drops[i] = 0;
                drops[i] += 1;
            }
        }

        resize();
        window.addEventListener('resize', resize);
        if ('IntersectionObserver' in window) {
            new IntersectionObserver(function (e) { visible = e[0].isIntersecting; }).observe(term);
        }
        requestAnimationFrame(frame);
    }

    /* ---------- Typing ---------- */
    // Wrap each line of the output so it can be revealed on its own.
    var lines = pre.innerHTML.split('\n');
    pre.innerHTML = lines.map(function (l) {
        return '<span class="t-line is-waiting">' + l + '</span>';
    }).join('\n');
    var lineEls = Array.prototype.slice.call(pre.querySelectorAll('.t-line'));

    function textNodes(el) {
        var out = [], walk = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
        while (walk.nextNode()) out.push(walk.currentNode);
        return out;
    }

    // First line: type the command a character at a time.
    function typeLine(el, done) {
        var nodes = textNodes(el), full = nodes.map(function (n) { return n.nodeValue; });
        nodes.forEach(function (n) { n.nodeValue = ''; });
        el.classList.remove('is-waiting');
        var ni = 0, ci = 0;
        (function step() {
            if (ni >= nodes.length) return done();
            ci++;
            nodes[ni].nodeValue = full[ni].slice(0, ci);
            if (ci >= full[ni].length) { ni++; ci = 0; }
            setTimeout(step, 35 + Math.random() * 55);
        })();
    }

    // Output lines: scramble, then settle left to right into the real text.
    function decodeLine(el, done) {
        var nodes = textNodes(el), full = nodes.map(function (n) { return n.nodeValue; });
        el.classList.remove('is-waiting');
        el.classList.add('is-new');
        var total = full.join('').length, settled = 0;
        (function step() {
            var count = settled;
            nodes.forEach(function (n, i) {
                var s = full[i], out = '';
                for (var c = 0; c < s.length; c++) {
                    out += (count > 0 || s.charAt(c) === ' ') ? s.charAt(c) : glyph();
                    count--;
                }
                n.nodeValue = out;
            });
            if (settled >= total) return done();
            settled += 3;
            setTimeout(step, 18);
        })();
    }

    function run() {
                var i = 0;
        setTimeout(function () {
            typeLine(lineEls[0], function next() {
                i++;
                if (i >= lineEls.length) return;
                var el = lineEls[i];
                var blank = !el.textContent.trim() && !el.querySelector('.t-cursor');
                setTimeout(function () {
                    if (blank || el.querySelector('.t-cursor')) {
                        el.classList.remove('is-waiting');
                        next();
                    } else {
                        decodeLine(el, next);
                    }
                }, i === 1 ? 250 : 70);
            });
        }, 1000);
    }

    run();
})();

/* ---------- Easter egg: Bonfire Night ----------
   After 30 seconds on the page (or a click on the monitor's power light),
   a moustached chap appears on screen
   along with the old rhyme. Then the screen flips back. */
(function () {
    'use strict';

    var term = document.querySelector('.terminal');
    var screen = term && term.querySelector('.terminal-body');
    if (!screen) return;

    var FIGURE =
        '<svg viewBox="0 0 120 160" aria-hidden="true" focusable="false">' +
        // Shoulders and collar
        '<path d="M14 158 c2 -26 18 -40 46 -40 s44 14 46 40z"/>' +
        '<path d="M46 118 l14 16 14 -16" class="band"/>' +
        // Neck and head
        '<path d="M50 104 h20 v16 h-20z"/>' +
        '<ellipse cx="60" cy="70" rx="30" ry="36"/>' +
        // Ears
        '<path d="M30 66 c-7 -2 -9 10 -1 14z M90 66 c7 -2 9 10 1 14z"/>' +
        // Short hair with a side parting
        '<path d="M30 60 c-2 -26 14 -36 32 -36 c18 0 30 12 28 36 c-6 -12 -14 -18 -26 -18 c-4 6 -14 10 -34 18z" class="band"/>' +
        // Eyebrows and eyes
        '<path d="M42 58 q6 -4 12 0 M66 58 q6 -4 12 0" fill="none"/>' +
        '<circle cx="48" cy="66" r="2.6" class="eye"/><circle cx="72" cy="66" r="2.6" class="eye"/>' +
        // Nose
        '<path d="M60 68 q-4 10 0 14" fill="none"/>' +
        // Big bushy moustache
        '<path d="M60 84 c-6 -4 -16 -4 -24 2 c-4 3 -8 2 -10 0 c2 8 10 12 18 10 c7 -1 12 -5 16 -7 c4 2 9 6 16 7 c8 2 16 -2 18 -10 c-2 2 -6 3 -10 0 c-8 -6 -18 -6 -24 -2z" class="tache"/>' +
        // Small smile
        '<path d="M53 96 q7 4 14 0" fill="none"/>' +
        '</svg>';

    var egg = document.createElement('div');
    egg.className = 't-egg';
    egg.setAttribute('aria-hidden', 'true');
    egg.innerHTML =
        '<div class="egg-figure">' + FIGURE + '</div>' +
        '<div class="egg-text">' +
        '<p class="egg-rhyme">Remember, remember<br>the fifth of November,<br>gunpowder, treason<br>and plot.</p>' +
        '<p class="egg-sign"># 5 November</p>' +
        '</div>';
    screen.appendChild(egg);

    var playing = false;
    function play() {
        if (playing) return;
        playing = true;
        term.classList.add('show-egg');
        setTimeout(function () {
            term.classList.remove('show-egg');
            playing = false;
        }, 9000);
    }

    setTimeout(play, 30000);

    // Double-clicking the window replays it
    term.addEventListener('dblclick', function (e) {
        if (!e.target.closest('.terminal-bar')) play();
    });
})();

/* ---------- Drag the window by its title bar ----------
   Like a real desktop window. It stays inside the browser window,
   and double-clicking the title bar snaps it back into place. */
(function () {
    'use strict';

    var term = document.querySelector('.terminal');
    var bar = term && term.querySelector('.terminal-bar');
    if (!bar) return;

    var x = 0, y = 0, startX, startY, baseX, baseY, dragging = false;

    function place() {
        term.style.translate = x + 'px ' + y + 'px';
    }

    bar.addEventListener('pointerdown', function (e) {
        if (e.button !== 0) return;
        dragging = true;
        startX = e.clientX; startY = e.clientY;
        baseX = x; baseY = y;
        bar.setPointerCapture(e.pointerId);
        term.classList.add('is-dragging');
        e.preventDefault();
    });

    bar.addEventListener('pointermove', function (e) {
        if (!dragging) return;
        var nx = baseX + e.clientX - startX;
        var ny = baseY + e.clientY - startY;
        // Keep at least part of the window on screen
        var r = term.getBoundingClientRect();
        var left = r.left - x + nx, top = r.top - y + ny;
        var vw = document.documentElement.clientWidth, vh = window.innerHeight;
        if (left < -r.width + 80) nx += -r.width + 80 - left;
        if (left > vw - 80) nx -= left - (vw - 80);
        if (top < 0) ny -= top;
        if (top > vh - 40) ny -= top - (vh - 40);
        x = nx; y = ny;
        place();
    });

    function stop() {
        if (!dragging) return;
        dragging = false;
        term.classList.remove('is-dragging');
    }
    bar.addEventListener('pointerup', stop);
    bar.addEventListener('pointercancel', stop);

    bar.addEventListener('dblclick', function () {
        term.classList.add('is-snapping');
        x = 0; y = 0;
        place();
        setTimeout(function () { term.classList.remove('is-snapping'); }, 450);
    });
})();
