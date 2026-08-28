# Tumbler & Leaf — Local Business Website

A complete, production-ready website built for **Tumbler & Leaf**, a filter coffee and chai house in Banjara Hills, Hyderabad — created as a live example of what a small local business's web presence should look like.

**This is a template built to demonstrate the approach.** The business, address, phone number, menu prices, and reviews on this site are illustrative placeholders written for the pitch — swap them for a real business's real details before using this for an actual client (see [Customizing for a real business](#customizing-for-a-real-business) below).

See **[PITCH.md](./PITCH.md)** for the client-facing proposal — who this is for, what problem it solves, and how it helps the business grow.

## Features

- **Single-page site** — Home, Menu, About, Gallery, Testimonials, Contact, all on one scrollable page with a sticky nav
- **Categorized, priced menu** with tabbed filtering (Filter Coffee / Chai / Tiffin / Snacks)
- **Fully responsive** — down to small mobile screens, with a slide-out mobile nav
- **Click-to-WhatsApp** floating button and header CTA for instant ordering
- **Google Maps embed** for the location
- **Working contact form** (via Formsubmit — no backend needed)
- **Placeholder photo system** — clearly labeled tiles so the site looks complete even before real photos are supplied
- **Scroll-reveal animations** and a marquee ticker, both respecting `prefers-reduced-motion`
- No build step, no framework, no dependencies — just HTML, CSS, and vanilla JS

## Project structure

```
tumbler-leaf/
├─ index.html        # The entire site
├─ css/style.css      # All styling, design tokens as CSS variables
├─ js/script.js       # Mobile nav, menu tabs, scroll reveal
├─ PITCH.md           # Client-facing business pitch
└─ README.md
```

## Running it locally

No install needed — it's a static site.

```bash
cd tumbler-leaf
python3 -m http.server 8080
# then open http://localhost:8080
```

Or just open `index.html` directly in a browser (everything works without a server, except the contact form's `POST`, which needs to be served over http/https).

## Customizing for a real business

To adapt this template for an actual local business:

1. **Swap the copy** in `index.html` — business name, tagline, story, menu items and prices, hours, address, phone, email.
2. **Update the map** — go to Google Maps, search the real address, click *Share → Embed a map*, and paste the new `src` into the `<iframe>` in the Contact section.
3. **Update the WhatsApp number** — replace `919876543210` in both `wa.me/` links (header button and floating button) with the business's real number, in `<countrycode><number>` format, no `+` or spaces.
4. **Replace the placeholder photo tiles** — swap the `.about-photo` and `.gtile` placeholder blocks for real `<img>` tags once photos are available.
5. **Connect the contact form** — this uses [Formsubmit.co](https://formsubmit.co), a free form backend that needs no signup:
   - Change the form's `action` attribute to `https://formsubmit.co/<the-owner's-real-email>`
   - The **first submission** will send a confirmation email to that address — the owner clicks the link once, and every submission after that lands directly in their inbox.
6. **Replace the sample testimonials** with real reviews (Google, Zomato, or direct customer quotes) — the sample ones are clearly marked as placeholders in the page itself.
7. **Update colors/fonts if needed** — everything is driven by CSS variables at the top of `css/style.css` (`:root { ... }`), so a full re-theme for a different business type takes minutes, not a rewrite.

## Deploying it

Any static host works. Two free options:

**GitHub Pages**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-repo-url>
git push -u origin main
```
Then in the repo settings, enable **Pages** → deploy from the `main` branch, root folder. The site will be live at `https://<username>.github.io/<repo-name>/`.

**Netlify / Vercel**
Drag and drop the `tumbler-leaf` folder onto [app.netlify.com/drop](https://app.netlify.com/drop) for an instant live URL, or connect the GitHub repo for automatic redeploys on every push.

## License

MIT — free to reuse as a starting template for other local business sites.
