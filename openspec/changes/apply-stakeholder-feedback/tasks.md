## 1. Font assets

- [x] 1.1 Create `assets/fonts/` and move the supplied GT Standard and GT Super woff2 files into it
- [x] 1.2 Confirm the four referenced faces are present: `GT-Standard-L-Standard-{Regular,Bold}.woff2`, `GT-Standard-S-Standard-{Regular,Bold}.woff2`

## 2. Install GT Standard (`styles.css`)

- [x] 2.1 Remove the Google Fonts `@import` for Inter and the stand-in comment block
- [x] 2.2 Add four `@font-face` blocks — families `GT Standard L` and `GT Standard S`, weights 400 and 700, `font-display: swap`, `font-style: normal`
- [x] 2.3 Point `--font-display` at `'GT Standard L'` and `--font-body` at `'GT Standard S'`, both falling back to `system-ui, sans-serif`
- [x] 2.4 Move the twelve sub-22px sites from `var(--font-display)` to `var(--font-body)`, keeping their weights
- [x] 2.5 Give `.stone .stone-pct small` an explicit `var(--font-body)` so an 11px label does not inherit the L optical size from its parent

## 3. Normalise font weights (`styles.css`)

- [x] 3.1 Remap all seven `font-weight: 800` declarations to `700`
- [x] 3.2 Remap `font-weight: 600` → `700` on `.key-message` and `.field label`
- [x] 3.3 Remap `font-weight: 600` → `400` on `.detail-top .pct-line` and `.stone .stone-pct small`
- [x] 3.4 Remap both `font-weight: 500` declarations to `400`
- [x] 3.5 Tighten `.hero-title` and `.result-head h1` letter-spacing to `-0.03em` to compensate for the lost 800 weight
- [x] 3.6 Verify no `font-weight` other than 400 and 700 remains in the stylesheet

## 4. Font loading (`index.html`)

- [x] 4.1 Preload `GT-Standard-L-Standard-Bold.woff2` and `GT-Standard-S-Standard-Regular.woff2` with `as="font" type="font/woff2" crossorigin`

## 5. Language-specific logo

- [x] 5.1 Point the favicon at `assets/um-logo-en-blue.svg`
- [x] 5.2 Add `class="brand-logo"` to the three topbar `<img>` elements and set their `src` to `assets/um-logo-en-blue.svg`
- [x] 5.3 In `setLang()`, update every `.brand-logo` `src` to the `en`/`nl` asset
- [x] 5.4 Set `.topbar .brand img` height to `44px`
- [x] 5.5 Delete the two stray logo duplicates from the repository root

## 6. Remove the decorative background

- [x] 6.1 Remove the three `<div class="stones">` containers from `index.html`
- [x] 6.2 Remove the `.stones` and `.stones span` rules and the three per-screen blob rule sets from `styles.css`
- [x] 6.3 Confirm `.stones-grid` / `.stone` (the persona cards) are untouched

## 7. Remove the pillar pills

- [x] 7.1 Remove the `<span class="q-pillar" id="q-pillar">` element from `index.html`
- [x] 7.2 Remove the `$('#q-pillar').textContent` assignment from `app.js`
- [x] 7.3 Remove the `.q-pillar` rule from `styles.css`
- [x] 7.4 Confirm `pillar` is still defined on all five questions in `data.js` and still sent as `question_pillar`

## 8. Sentence-case labels (`styles.css`)

- [x] 8.1 Remove `text-transform: uppercase` from `.result-head .kicker` and reduce its letter-spacing
- [x] 8.2 Remove `text-transform: uppercase` from `.stone .crown` and reduce its letter-spacing
- [x] 8.3 Remove `text-transform: uppercase` from `.detail h3` and reduce its letter-spacing
- [x] 8.4 Confirm `.eyebrow` keeps its uppercase treatment (out of scope)

## 9. Best-match card

- [x] 9.1 `.stone.is-top`: steel `#000831` background, white text, no ring
- [x] 9.2 `.stone .crown`: invert to white background with steel text
- [x] 9.3 `.stone.is-top.is-open`: white ring instead of steel
- [x] 9.4 Confirm the two non-top cards remain cobalt

## 10. Documentation

- [x] 10.1 Update `um-visual-identity.md` typography section: GT Standard replaces Fort / Aptos
- [x] 10.2 Update its palette section to the UM 2025 colours

## 12. Canvas / page separation and "stone" copy

- [x] 12.1 Point `--paper` at `--white` so the canvas, the start screen, and the modal inputs all go white
- [x] 12.2 Set `body` background to `var(--steel)` so the page behind the canvas is navy
- [x] 12.3 Repoint `#screen-quiz` and `#screen-result` from `var(--soft)` to `var(--paper)`
- [x] 12.4 Give `.detail.is-shown` a `1.5px solid var(--soft-deep)` border so the white panel has an edge on the white canvas
- [x] 12.5 Update `<meta name="theme-color">` to `#FFFFFF` — on phones the canvas fills the viewport
- [x] 12.6 Reword `tapHint` in both languages to drop "stone" / "steen"
- [x] 12.7 Re-verify: navy surround at desktop width, white canvas, soft-blue components still legible

## 11. Verification

- [x] 11.1 Load the app and confirm GT Standard renders (no Inter, no Google Fonts request in the network panel)
- [x] 11.2 Switch EN ↔ NL and confirm the logo swaps on all three screens
- [x] 11.3 Complete a run and confirm: no background blobs, no pillar pills, sentence-case labels, steel top card with a visible white `Best match` badge
- [x] 11.4 Open each persona card and confirm the open-state ring is visible on both the steel and cobalt cards
- [x] 11.5 Confirm `dataLayer` still receives `question_pillar` on `pbl_answer`
