## Why

The PBL Persona Test currently uses an ad-hoc palette (midnight + sky blue + green/blue/purple persona accents) and Google-hosted display fonts (Bricolage Grotesque + Hanken Grotesk) that do not match Maastricht University's refreshed brand. Marketing & Communications has specified an updated visual identity for the tool: a single soft-blue light theme, steel-blue text, cobalt call-to-actions, and GT Standard typography. This change brings the app in line with that specification before public launch.

## What Changes

- **Unify on one light theme.** Today the start screen is light while the quiz and result screens are dark (midnight gradient, white text, white logo). All three screens move to a single soft-blue `#BEDDF7` background with steel-blue `#000831` text. The dark screens and the white logo variant are retired.
- **Adopt the brand palette as CSS tokens:**
  - Background / all light frames: **soft blue `#BEDDF7`**
  - Body text + headings + logo: **steel blue `#000831`**
  - Subheadings + buttons/CTAs + persona cards: **cobalt blue `#355BD0`**
  - Button/CTA text: **white `#FFFFFF`**
- **Typography → GT Standard.** Body text and base font: GT Standard Regular. Headings and subheadings: GT Standard Bold. Because GT Standard is a licensed font not yet available in the repo, ship now with a close neutral-grotesque fallback (Inter) wired through `--font-*` variables, so the real GT Standard files can be dropped in later via a single `@font-face` change.
- **Buttons & persona cards:** rounded `20px` corners (replacing the current full-pill `999px`), cobalt background, white text.
- **Personas display in one colour.** The three persona cards, currently distinct gradients (green/blue/purple), all become cobalt `#355BD0` with white text and `20px` corners. The top-scoring persona keeps a non-colour emphasis (a steel-blue ring) since colour no longer distinguishes them.
- **Logo:** use the existing vector `assets/um-logo-blue.svg` (already filled `#000831`, the exact steel blue) on every screen. The supplied 5 MB `.BMP` is the same wordmark in raster form and is dropped rather than converted, since a rasterised copy would be strictly heavier and lower quality than the SVG already in the repo.

Non-goals: this change does **not** alter quiz logic, questions, scoring, copy, language handling, or the GTM analytics wiring; it does **not** ship the real licensed GT Standard font files (a follow-up once M&C provides the webfont); and it does **not** change the CTA destination or the dormant lead-capture modal's behaviour (only its colours).

## Capabilities

### New Capabilities

- `visual-branding`: The visual identity of the PBL Persona Test — palette, typography, background, frames, buttons, and logo usage — expressed as a single UM-brand-aligned light theme.

### Modified Capabilities

<!-- None. Styling had no prior OpenSpec spec; this is the first capability to codify it. -->

## Impact

- **Code**: `styles.css` (new `:root` token layer; recolour of the two dark screens, quiz answers, progress bar, chips, persona stones, detail panel, CTA, modal; button radius; font variables). `index.html` (swap the two `um-logo-white.svg` references to `um-logo-blue.svg`; update the Google Fonts `<link>` and `theme-color` meta). No changes to `app.js` logic; `data.js` persona `color` values change to cobalt.
- **Assets**: `assets/um-logo-blue.svg` becomes the sole logo. `assets/UM logo - primary - clearspace - EN - blue.BMP` and `assets/um-logo-white.svg` are removed as unused.
- **Dependencies**: Fonts still loaded from Google Fonts (Inter as the GT Standard stand-in) until UM supplies the licensed webfont.
- **Accessibility**: Steel-on-soft-blue body text has strong contrast. Cobalt is reserved for large bold subheadings and button surfaces (white text on cobalt), not small body text, to keep contrast acceptable.
- **Follow-up**: Replace the Inter fallback with self-hosted GT Standard Regular/Bold woff2 files under `assets/fonts/` when provided by M&C.
