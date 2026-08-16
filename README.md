# Sofia Ferazzoli — academic portfolio

A lightweight bilingual academic portfolio built for GitHub Pages. It uses plain HTML, CSS and a small amount of JavaScript, with no external libraries, tracking or cookies.

## What is included

- English / Italian language switch
- Research, publications, CV, outreach, university notes, interests and contact sections
- Direct links to publications and the existing Altervista notes archive
- A support area with only PayPal.Me and bank transfer
- Responsive mobile navigation, keyboard accessibility and reduced-motion support
- Social preview image, metadata, structured data and a custom 404 page

## Editing the content

- Page content: `index.html`
- Colours and layout: `assets/css/styles.css`
- Language switch and navigation behaviour: `assets/js/site.js`
- Social preview: `assets/images/background_resize.png`

The support area offers the two methods selected by Sofia: direct PayPal.Me and bank transfer. Payment details live only inside the `donation-grid` block in `index.html`; update that block if an account or link changes.

## Publishing on GitHub Pages

This repository is a user site because its name is `sofiaferazzoli.github.io`. In GitHub, open **Settings → Pages**, choose **Deploy from a branch**, then select **main** and **/(root)**. Every later push to `main` will publish the new version automatically.

No build command is required. For a local preview, serve the repository as a simple static folder rather than opening `index.html` directly, because asset paths start at the site root.

## Privacy note

The public site intentionally excludes the phone number, date of birth, signature and certificate ID found in the private CV.
