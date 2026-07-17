# Portfolio for Leo (Infiloo) — Implementation Plan

## Goal
Build a clean, premium-feeling personal portfolio as a **static HTML/CSS/JS** site (no build step) with a **dark + light theme toggle**, covering the full set of sections.

> Note: The three style-reference images could not be read (model has no image input). The visual design below is derived from the "clean + premium" brief and the user's stack. If the user can describe the reference style in words later, the styling tokens can be tuned to match.

## Tech & Constraints
- Single `index.html` + `styles.css` + `script.js` (vanilla, no framework/build).
- Theme toggle persisted via `localStorage`, respects `prefers-color-scheme` on first load.
- Responsive (mobile-first), accessible (semantic HTML, focus states, `aria` on toggle).
- Deployable as static files (GitHub Pages / Netlify / any static host).

## Design Tokens (premium feel)
- Typography: system font stack + a refined display font (e.g. Inter / Space Grotesk via Google Fonts, with fallback).
- Dark theme: deep near-black bg (`#0b0d12`), elevated surfaces, soft shadows, subtle accent (e.g. indigo/teal glow).
- Light theme: off-white bg (`#f7f8fa`), white cards, soft shadows, same accent.
- Glassmorphism cards: translucent surface + backdrop blur + 1px border.
- Buttons: pill / rounded, subtle gradient + hover lift + glow on accent.
- Smooth transitions (200–300ms ease) on theme, hover, scroll-reveal.

## Sections (Full set)
1. **Navbar** — name/alias logo, anchor links (About, Projects, Skills, Hobbies, Contact), theme toggle button. Sticky with blur on scroll.
2. **Hero** — Name "Leo", alias "Infiloo", tagline, hardware line (Raspberry Pi 500, ESP32, microcontrollers), primary CTA buttons (View Projects, Contact).
3. **About** — short bio; primary hardware environment.
4. **Projects** — card grid for the 4 projects:
   - **Zusammen Chat** — web-chat app: user profiles, private channels, support account. Tech: web frameworks, DB.
   - **Shard** — mobile messaging: crypto safety numbers, recent-chat pinning, video calls. Features: cryptographic safety, UI customization, media streaming.
   - **decloud** — Telegram file-sharing/cloud bot: link expiration, security controls.
   - **LibPlayer** — Python media client syncing RPi media to Discord rich presence with live progress bars. Tech: Python, API, Discord RPC.
   Each card: title, description, tech/feature tags, (placeholder) link slot.
5. **Skills & Tech Stack** — grouped chips: Languages (HTML, CSS, JS, Python, MicroPython), Frameworks (React, Tailwind), Systems (Linux/KDE Plasma, Raspberry Pi OS, ESP32, self-hosted).
6. **Hobbies & Interests** — 3 cards: Self-Hosting & Hardware; Gaming & Server Admin (Minecraft, Roblox, No Man's Sky); Music & Audio Streaming (Spotify, Laut.fm bots).
7. **Contact** — CTA linking to Gravatar profile: `https://gravatar.com/infiloo` (primary button). Optional secondary mailto placeholder.
8. **Footer** — copyright, alias, small links.

## Files to Create
- `index.html` — semantic structure for all sections + navbar/footer.
- `styles.css` — CSS variables for dark/light, layout, components, responsive, animations.
- `script.js` — theme toggle + persistence, mobile nav, scroll-reveal (IntersectionObserver), current year.
- `README.md` — brief run/deploy instructions (optional but recommended).

## Validation
- Open `index.html` in a browser; verify:
  - Theme toggle switches dark/light and persists on reload.
  - All sections render with correct content from the profile dataset.
  - Responsive layout works at mobile/tablet/desktop widths.
  - Contact button points to `https://gravatar.com/infiloo`.
  - Keyboard accessible (tab order, focus visible, toggle operable).

## Open / Placeholder Items
- Real project URLs / repo links (use `#` placeholders for now).
- Real email for mailto (placeholder).
- Avatar image (use Gravatar URL or a placeholder).
- Any exact accent color / font preference if user supplies style description later.
