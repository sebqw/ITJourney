/* Photography: open a photo full size, then step through with the arrow
   buttons, arrow keys or a swipe. Escape or the cross closes it. */
(function () {
    'use strict';

    var box = document.getElementById('lightbox');
    var shots = Array.prototype.slice.call(document.querySelectorAll('.shot-open'));
    if (!box || !shots.length || typeof box.showModal !== 'function') return;

    var img = box.querySelector('img');
    var caption = box.querySelector('.lb-caption');
    var current = 0, opener = null;

    function show(i) {
        current = (i + shots.length) % shots.length;
        var s = shots[current];
        img.src = s.dataset.full;
        img.alt = s.querySelector('img').alt;
        caption.textContent = s.dataset.caption;
    }

    shots.forEach(function (s, i) {
        s.addEventListener('click', function () {
            opener = s;
            show(i);
            box.showModal();
        });
    });

    box.querySelector('.lb-prev').addEventListener('click', function () { show(current - 1); });
    box.querySelector('.lb-next').addEventListener('click', function () { show(current + 1); });
    box.querySelector('.lb-close').addEventListener('click', function () { box.close(); });

    // Clicking the dark area around the photo closes it
    box.addEventListener('click', function (e) {
        if (e.target === box || e.target.tagName === 'FIGURE') box.close();
    });

    box.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowLeft') show(current - 1);
        if (e.key === 'ArrowRight') show(current + 1);
    });

    var startX = null;
    box.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; }, { passive: true });
    box.addEventListener('touchend', function (e) {
        if (startX === null) return;
        var dx = e.changedTouches[0].clientX - startX;
        if (Math.abs(dx) > 50) show(current + (dx < 0 ? 1 : -1));
        startX = null;
    });

    box.addEventListener('close', function () { if (opener) opener.focus(); });
})();
