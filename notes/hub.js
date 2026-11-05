/* Notes hub: show how many MS-102 flashcards there are. */
(function () {
    var n = (window.MS102_CARDS || []).length;
    var el = document.getElementById('hub-ms102-count');
    if (n && el) el.textContent = n + ' flashcards';
})();
