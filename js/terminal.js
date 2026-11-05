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
        // Hair peeking out under the hat
        '<path d="M30 62 c-1 -8 1 -14 4 -18 h52 c3 4 5 10 4 18 c-4 -6 -8 -9 -12 -10 h-36 c-4 1 -8 4 -12 10z" class="band"/>' +
        // Eyebrows and eyes
        '<path d="M42 58 q6 -4 12 0 M66 58 q6 -4 12 0" fill="none"/>' +
        '<circle cx="48" cy="66" r="2.6" class="eye"/><circle cx="72" cy="66" r="2.6" class="eye"/>' +
        // Nose
        '<path d="M60 68 q-4 10 0 14" fill="none"/>' +
        // Big bushy moustache
        '<path d="M60 84 c-6 -4 -16 -4 -24 2 c-4 3 -8 2 -10 0 c2 8 10 12 18 10 c7 -1 12 -5 16 -7 c4 2 9 6 16 7 c8 2 16 -2 18 -10 c-2 2 -6 3 -10 0 c-8 -6 -18 -6 -24 -2z" class="tache"/>' +
        // Big bushy beard, drawn as soft scallops
        '<path d="M34 86 c-2 10 0 20 6 28 c3 -2 5 0 6 3 c3 -2 6 -1 7 2 c3 -2 6 -2 7 1 c1 -3 4 -3 7 -1 c1 -3 4 -5 7 -3 c1 -3 3 -5 6 -3 c6 -8 8 -18 6 -27 c-4 6 -10 8 -16 6 c-4 4 -10 6 -14 6 s-10 -2 -14 -6 c-6 2 -12 0 -16 -6z" class="beard"/>' +
        // Beard texture
        '<path d="M46 100 q2 6 0 12 M60 102 q2 7 0 14 M74 100 q-2 6 0 12" fill="none" class="strand"/>' +
        // Moustache again on top of the beard
        '<path d="M60 84 c-6 -4 -16 -4 -24 2 c-4 3 -8 2 -10 0 c2 8 10 12 18 10 c7 -1 12 -5 16 -7 c4 2 9 6 16 7 c8 2 16 -2 18 -10 c-2 2 -6 3 -10 0 c-8 -6 -18 -6 -24 -2z" class="tache"/>' +
        // Tall flat-topped hat with a wide brim and buckle band, as worn in 1605
        '<path d="M40 6 c0 -3 40 -3 40 0 l4 36 h-48z" class="hat"/>' +
        '<path d="M36 32 h48 v8 h-48z" class="band"/>' +
        '<rect x="55" y="32" width="10" height="8" rx="1" class="buckle"/>' +
        '<path d="M18 42 c10 -3 74 -3 84 0 c3 1 3 5 0 6 c-12 3 -72 3 -84 0 c-3 -1 -3 -5 0 -6z" class="hat"/>' +
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

/* ---------- Drag the window by its title bar, with physics ----------
   Grab the title bar and throw it: the window keeps its momentum,
   slows down with friction, bounces off the edges of the browser window
   and tilts as it moves. Double-click the title bar to send it home. */
(function () {
    'use strict';

    var term = document.querySelector('.terminal');
    var bar = term && term.querySelector('.terminal-bar');
    if (!bar) return;

    var calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var FRICTION = 0.94;    // speed kept each frame (1 = ice)
    var BOUNCE = 0.55;      // speed kept after hitting an edge
    var MAX_TILT = 8;       // degrees

    var x = 0, y = 0, vx = 0, vy = 0, tilt = 0;
    var dragging = false, grabX, grabY, lastX, lastY, lastT, raf = null;

    function render() {
        term.style.translate = x.toFixed(1) + 'px ' + y.toFixed(1) + 'px';
        term.style.rotate = calm ? '' : tilt.toFixed(2) + 'deg';
    }

    // The window's home position on screen, without our offset
    function home() {
        var r = term.getBoundingClientRect();
        return { left: r.left - x, top: r.top - y, w: r.width, h: r.height };
    }

    // Keep the window inside the visible part of the page; returns which edges it hit
    function contain() {
        var b = home();
        var vw = document.documentElement.clientWidth, vh = window.innerHeight;
        var minX = -b.left, maxX = vw - b.w - b.left;
        var minY = -b.top, maxY = vh - b.h - b.top;
        var hit = false;
        if (maxX < minX) maxX = minX;
        if (maxY < minY) maxY = minY;
        if (x < minX) { x = minX; vx = Math.abs(vx) * BOUNCE; hit = true; }
        if (x > maxX) { x = maxX; vx = -Math.abs(vx) * BOUNCE; hit = true; }
        if (y < minY) { y = minY; vy = Math.abs(vy) * BOUNCE; hit = true; }
        if (y > maxY) { y = maxY; vy = -Math.abs(vy) * BOUNCE; hit = true; }
        return hit;
    }

    function glide() {
        vx *= FRICTION;
        vy *= FRICTION;
        x += vx;
        y += vy;
        contain();
        tilt += (Math.max(-MAX_TILT, Math.min(MAX_TILT, vx * 0.35)) - tilt) * 0.2;
        render();
        if (Math.abs(vx) > 0.15 || Math.abs(vy) > 0.15 || Math.abs(tilt) > 0.05) {
            raf = requestAnimationFrame(glide);
        } else {
            tilt = 0; render(); raf = null;
        }
    }

    bar.addEventListener('pointerdown', function (e) {
        if (e.button !== 0) return;
        if (raf) cancelAnimationFrame(raf), raf = null;
        dragging = true;
        grabX = e.clientX - x; grabY = e.clientY - y;
        lastX = e.clientX; lastY = e.clientY; lastT = performance.now();
        vx = vy = 0;
        bar.setPointerCapture(e.pointerId);
        term.classList.add('is-dragging');
        e.preventDefault();
    });

    bar.addEventListener('pointermove', function (e) {
        if (!dragging) return;
        var now = performance.now(), dt = Math.max(8, now - lastT);
        // Velocity in px per 60fps frame, smoothed
        vx = vx * 0.5 + ((e.clientX - lastX) / dt * 16.7) * 0.5;
        vy = vy * 0.5 + ((e.clientY - lastY) / dt * 16.7) * 0.5;
        lastX = e.clientX; lastY = e.clientY; lastT = now;
        x = e.clientX - grabX;
        y = e.clientY - grabY;
        contain();
        tilt += (Math.max(-MAX_TILT, Math.min(MAX_TILT, vx * 0.6)) - tilt) * 0.3;
        render();
    });

    function release() {
        if (!dragging) return;
        dragging = false;
        term.classList.remove('is-dragging');
        // A pause before letting go means no throw
        if (performance.now() - lastT > 80) { vx = vy = 0; }
        if (calm) { vx = vy = 0; tilt = 0; render(); return; }
        raf = requestAnimationFrame(glide);
    }
    bar.addEventListener('pointerup', release);
    bar.addEventListener('pointercancel', release);

    bar.addEventListener('dblclick', function () {
        if (raf) cancelAnimationFrame(raf), raf = null;
        vx = vy = 0; x = 0; y = 0; tilt = 0;
        term.classList.add('is-snapping');
        render();
        setTimeout(function () { term.classList.remove('is-snapping'); }, 500);
    });

    // If the page scrolls or resizes, keep the window reachable
    window.addEventListener('resize', function () { if (x || y) { contain(); render(); } });
})();
