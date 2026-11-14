/* Notes hub: show how many flashcards each deck has. */
(function () {
    function count(id, cards) {
        var el = document.getElementById(id);
        if (el && cards && cards.length) el.textContent = cards.length + ' flashcards';
    }
    count('hub-ms102-count', window.MS102_CARDS);
    count('hub-sc300-count', window.SC300_CARDS);
})();
