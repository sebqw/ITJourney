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
   the screen glitches and Guy Fawkes appears with his lantern,
   along with the old rhyme. Then the screen flips back. */
(function () {
    'use strict';

    var term = document.querySelector('.terminal');
    var screen = term && term.querySelector('.terminal-body');
    if (!screen) return;

    var FIGURE =
        '<svg viewBox="0 0 120 160" aria-hidden="true" focusable="false">' +
        // Tall capotain hat with a wide brim
        '<path d="M42 10 h34 l4 34 h-42 z"/>' +
        '<path d="M28 44 h64 a4 3 0 0 1 0 6 h-64 a4 3 0 0 1 0-6z"/>' +
        '<rect x="38" y="36" width="42" height="4" class="band"/>' +
        // Head in profile, beard and ruff collar
        '<path d="M44 50 h32 c2 8 1 16 -3 22 l4 4 -4 2 c-3 6 -10 9 -17 8 c-6 -2 -10 -8 -12 -16z"/>' +
        '<path d="M38 84 c8 6 36 6 44 0 l3 6 c-10 8 -40 8 -50 0z" class="band"/>' +
        // Long cloak
        '<path d="M36 90 c-14 20 -22 48 -24 68 h96 c-2 -20 -10 -48 -24 -68 c-14 6 -34 6 -48 0z"/>' +
        // Arm reaching out with the lantern
        '<path d="M80 98 c8 6 14 14 16 22 l-6 2 c-3 -6 -8 -12 -14 -16z"/>' +
        '<path d="M88 122 h14 v4 h-14z"/>' +
        '<rect x="89" y="126" width="12" height="16" rx="2" class="lantern"/>' +
        '<path d="M88 142 h14 v3 h-14z"/>' +
        '</svg>';

    var egg = document.createElement('div');
    egg.className = 't-egg';
    egg.setAttribute('aria-hidden', 'true');
    egg.innerHTML =
        '<div class="egg-figure">' + FIGURE + '<i class="egg-glow"></i></div>' +
        '<div class="egg-text">' +
        '<p class="egg-rhyme">Remember, remember<br>the fifth of November,<br>gunpowder, treason<br>and plot.</p>' +
        '<p class="egg-sign">// Guy Fawkes, 1605</p>' +
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
    term.addEventListener('dblclick', play);
})();
