/* Contact: the email address isn't written anywhere in the page, so bots
   that harvest addresses from web pages can't pick it up. It's stored
   backwards in two pieces and only put together when a person clicks. */
(function () {
    'use strict';

    var btn = document.getElementById('email-reveal');
    var slot = document.getElementById('email-slot');
    if (!btn || !slot) return;
    btn.hidden = false;

    function flip(s) { return s.split('').reverse().join(''); }

    btn.addEventListener('click', function () {
        var address = flip(btn.dataset.u) + '@' + flip(btn.dataset.d);
        var link = document.createElement('a');
        link.href = 'mailto:' + address;
        link.textContent = address;
        slot.replaceChildren(link);

        // The button becomes a normal "Email me" link
        var mail = document.createElement('a');
        mail.className = 'btn';
        mail.href = link.href;
        mail.textContent = 'Email me';
        btn.replaceWith(mail);
        mail.focus();
    });
})();
