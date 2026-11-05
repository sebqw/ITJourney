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

    /* Fireworks behind the figure: rockets climb, burst into sparks that
       fall under gravity, fade and leave short trails. */
    var sky = document.createElement('canvas');
    sky.className = 'egg-sky';
    egg.insertBefore(sky, egg.firstChild);
    var ctx = sky.getContext && sky.getContext('2d');
    var calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var COLOURS = ['#4dff8f', '#ffd36b', '#ff7a59', '#7dd3fc', '#f472b6', '#ffffff'];
    var rockets = [], sparks = [], fwRaf = null, fwUntil = 0, nextLaunch = 0, W = 0, H = 0;

    function sizeSky() {
        var r = sky.getBoundingClientRect(), dpr = Math.min(window.devicePixelRatio || 1, 2);
        W = r.width; H = r.height;
        sky.width = Math.max(1, Math.round(W * dpr));
        sky.height = Math.max(1, Math.round(H * dpr));
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function launch() {
        rockets.push({
            x: W * (0.15 + Math.random() * 0.7), y: H,
            vx: (Math.random() - 0.5) * 1.2, vy: -(H / 55 + Math.random() * 2.2),
            colour: COLOURS[Math.floor(Math.random() * COLOURS.length)]
        });
    }

    function burst(r) {
        var n = 60 + Math.floor(Math.random() * 30), ring = Math.random() < 0.3;
        for (var i = 0; i < n; i++) {
            var a = (i / n) * Math.PI * 2, s = ring ? 2.6 : 0.6 + Math.random() * 2.6;
            sparks.push({ x: r.x, y: r.y, px: r.x, py: r.y, vx: Math.cos(a) * s, vy: Math.sin(a) * s,
                life: 1, decay: 0.009 + Math.random() * 0.01, colour: Math.random() < 0.15 ? '#ffffff' : r.colour });
        }
    }

    function frame(t) {
        // Fade the previous frame for trails
        ctx.globalCompositeOperation = 'destination-out';
        ctx.fillStyle = 'rgba(0, 0, 0, 0.18)';
        ctx.fillRect(0, 0, W, H);
        ctx.globalCompositeOperation = 'lighter';

        if (t < fwUntil && t > nextLaunch) { launch(); nextLaunch = t + 350 + Math.random() * 550; }

        for (var i = rockets.length - 1; i >= 0; i--) {
            var r = rockets[i];
            r.px = r.x; r.py = r.y;
            r.x += r.vx; r.y += r.vy; r.vy += 0.09;
            ctx.strokeStyle = '#ffe9a8'; ctx.lineWidth = 2;
            ctx.beginPath(); ctx.moveTo(r.px, r.py); ctx.lineTo(r.x, r.y); ctx.stroke();
            if (r.vy >= -0.6 || r.y < H * 0.12) { burst(r); rockets.splice(i, 1); }
        }

        for (var k = sparks.length - 1; k >= 0; k--) {
            var s = sparks[k];
            s.px = s.x; s.py = s.y;
            s.vx *= 0.985; s.vy = s.vy * 0.985 + 0.035;
            s.x += s.vx; s.y += s.vy;
            s.life -= s.decay;
            if (s.life <= 0) { sparks.splice(k, 1); continue; }
            ctx.globalAlpha = Math.max(0, s.life);
            ctx.strokeStyle = s.colour; ctx.lineWidth = 2.2;
            ctx.beginPath(); ctx.moveTo(s.px, s.py); ctx.lineTo(s.x, s.y); ctx.stroke();
        }
        ctx.globalAlpha = 1;

        if (t < fwUntil || rockets.length || sparks.length) fwRaf = requestAnimationFrame(frame);
        else { ctx.clearRect(0, 0, W, H); fwRaf = null; }
    }

    function fireworks(ms) {
        if (!ctx || calm) return;
        sizeSky();
        fwUntil = performance.now() + ms;
        nextLaunch = 0;
        if (!fwRaf) fwRaf = requestAnimationFrame(frame);
    }

    var playing = false;
    function play() {
        if (playing) return;
        playing = true;
        term.classList.add('show-egg');
        fireworks(7800);
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
        term.dispatchEvent(new Event('terminal:move'));
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

/* ---------- Text gets shoved out of the way ----------
   Words in the intro (and the buttons and highlight cards) act like
   little bodies on springs. When the window comes close they get pushed
   away from it, wobble, and spring back once it has gone. */
(function () {
    'use strict';

    var term = document.querySelector('.terminal');
    if (!term) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var REACH = 46;       // px around the window where text feels it
    var PUSH = 1.6;       // strength of the shove
    var SPRING = 0.06;    // pull back to the resting place
    var DAMP = 0.82;      // velocity kept each frame

    // Split the intro text into words, keeping the spaces between them
    function splitWords(el) {
        var walk = document.createTreeWalker(el, NodeFilter.SHOW_TEXT), nodes = [];
        while (walk.nextNode()) nodes.push(walk.currentNode);
        nodes.forEach(function (n) {
            if (!n.nodeValue.trim()) return;
            var frag = document.createDocumentFragment();
            n.nodeValue.split(/(\s+)/).forEach(function (part) {
                if (!part) return;
                if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
                var w = document.createElement('span');
                w.className = 'bump';
                w.textContent = part;
                frag.appendChild(w);
            });
            n.parentNode.replaceChild(frag, n);
        });
    }

    document.querySelectorAll('.hero .status, .hero h1, .hero .role, .hero .pitch').forEach(splitWords);
    var els = Array.prototype.slice.call(document.querySelectorAll(
        '.hero .bump, .hero-actions .btn, .highlights li'));

    var bodies = els.map(function (el) {
        el.classList.add('bump');
        return { el: el, ox: 0, oy: 0, vx: 0, vy: 0, cx: 0, cy: 0, w: 0, h: 0 };
    });

    // Resting centres in page coordinates (measured with offsets removed)
    function measure() {
        var sx = window.scrollX, sy = window.scrollY;
        bodies.forEach(function (b) {
            var r = b.el.getBoundingClientRect();
            b.cx = r.left + r.width / 2 - b.ox + sx;
            b.cy = r.top + r.height / 2 - b.oy + sy;
            b.w = r.width; b.h = r.height;
        });
    }
    var measured = false;
    window.addEventListener('resize', function () { measured = false; });

    var running = false, idle = 0;

    function step() {
        var sx = window.scrollX, sy = window.scrollY;
        var r = term.getBoundingClientRect();
        var L = r.left + sx, T = r.top + sy, R = r.right + sx, B = r.bottom + sy;
        var mx = (L + R) / 2, my = (T + B) / 2;
        var active = false;

        bodies.forEach(function (b) {
            var px = b.cx + b.ox, py = b.cy + b.oy;
            // Nearest point on the window to this word, padded by half the word's size
            var hw = b.w / 2, hh = b.h / 2;
            var nx = Math.max(L - hw, Math.min(px, R + hw));
            var ny = Math.max(T - hh, Math.min(py, B + hh));
            var dx = px - nx, dy = py - ny, d = Math.sqrt(dx * dx + dy * dy);
            if (d < REACH) {
                if (d < 0.5) { dx = px - mx; dy = py - my; d = Math.sqrt(dx * dx + dy * dy) || 1; }
                var f = (1 - Math.min(d, REACH) / REACH) * PUSH * (d < 0.5 ? 2.5 : 1);
                // Inside the window: push out hard
                if (px > L - hw && px < R + hw && py > T - hh && py < B + hh) f = PUSH * 2.5;
                b.vx += dx / d * f * 3;
                b.vy += dy / d * f * 3;
            }
            b.vx = (b.vx - b.ox * SPRING) * DAMP;
            b.vy = (b.vy - b.oy * SPRING) * DAMP;
            b.ox += b.vx;
            b.oy += b.vy;

            if (Math.abs(b.ox) + Math.abs(b.oy) + Math.abs(b.vx) + Math.abs(b.vy) > 0.15) {
                active = true;
                b.el.style.transform = 'translate(' + b.ox.toFixed(1) + 'px,' + b.oy.toFixed(1) + 'px) rotate(' + (b.vx * 0.8).toFixed(1) + 'deg)';
            } else if (b.ox || b.oy) {
                b.ox = b.oy = b.vx = b.vy = 0;
                b.el.style.transform = '';
            }
        });

        idle = active ? 0 : idle + 1;
        if (idle > 20) { running = false; return; }
        requestAnimationFrame(step);
    }

    term.addEventListener('terminal:move', function () {
        idle = 0;
        if (running) return;
        if (!measured) { measure(); measured = true; }
        running = true;
        requestAnimationFrame(step);
    });
})();
