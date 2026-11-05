# ITJourney

My personal site and CV: Sebastian Quintana Warsop, Tier 2 Service Desk Analyst at a managed service provider, working in Microsoft 365, security and desktop and application support.

Live at [sebqw.github.io/ITJourney](https://sebqw.github.io/ITJourney/)

![Site preview](images/site-preview.webp)

## What's on the site

- **CV:** experience, skills, qualifications and projects, with a downloadable PDF CV
- **FOV CRM 2.0:** my apprenticeship client management app, rebuilt to run live in the browser
- **Photography:** a few of my own photos, with a full-size viewer
- **Notes:** my documentation hub, starting with MS-102 revision flashcards
- **Packet Run:** a small maze game I made for the site
- **A PowerShell window** in the header that types out my profile. You can drag it around by its title bar.

It has a light and a dark theme, and works on phones.

## How it's built

I built the first version of this site myself in 2022 during my IT apprenticeship. In 2026 I rebuilt and extended it with the help of AI tools.

It's plain HTML, CSS and JavaScript with no frameworks and no build step. Open `index.html` in a browser to run it locally.

The site is published to GitHub Pages by the workflow in `.github/workflows/deploy-pages.yml`.

## Files

- `index.html`: the main page
- `project.html`: the story of FOV CRM, from the original C# Windows Forms app to the 2.0 rebuild
- `terms.html`: terms of use and privacy, written in the voice of a fictional lawyer
- `crm/`: FOV CRM 2.0, running with demo data and saving changes in the visitor's browser only
- `notes/`: the documentation hub (`notes/ms102-cards.js` holds the flashcards)
- `CSS/styles.css`: all styling, with the colour palette at the top
- `CSS/fonts.css` and `fonts/`: the site's fonts, hosted here rather than loaded from Google
- `js/theme-init.js`: applies the saved light or dark theme before the page appears
- `js/site.js`: shared behaviour (phone menu, light and dark switch, scroll effects)
- `js/terminal.js`: the PowerShell window in the header
- `js/slideshow.js`: the project image slideshow
- `js/packet-run.js`: Packet Run
- `js/highlights.js`: the experience highlights behind a blinking-cursor prompt
- `js/gallery.js`: the photo viewer
- `images/`: images used by the site
- `Sebastian-Quintana-Warsop-CV.pdf`: my CV

## Security

The site is static, has no logins, and doesn't collect or store visitor data. The CRM demo saves only to the visitor's own browser.

- Every page sets a strict Content Security Policy: scripts, styles, fonts and images only load from this site, with no inline scripts.
- Fonts are self-hosted, so the site makes no third-party requests.
- A `security.txt` file in `.well-known/` says how to report a security issue.

Some HTTP headers, including CORS, X-Frame-Options, X-Content-Type-Options and HSTS, are set by GitHub Pages and can't be changed from the repository. Setting those would need a custom domain behind a service such as Cloudflare.

## Credits

- Photography: all photos on the site, including the header image, are my own. © Sebastian Quintana Warsop, all rights reserved. Please ask before reusing them.
- Favicon: [Dewi Sari](https://www.flaticon.com/authors/dewi-sari) on [Flaticon](https://www.flaticon.com/)
- Fonts: Sora, Roboto and JetBrains Mono, under the SIL Open Font License (copies in `fonts/`), via [Fontsource](https://fontsource.org/)
