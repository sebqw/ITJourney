/* Apply the visitor's saved light/dark choice before the page paints,
   so there's no flash of the wrong theme. Loaded in <head>. */
try {
    var savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light' || savedTheme === 'dark') document.documentElement.dataset.theme = savedTheme;
} catch (e) {}
