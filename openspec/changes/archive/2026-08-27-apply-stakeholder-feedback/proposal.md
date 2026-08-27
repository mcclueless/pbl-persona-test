## Why

Marketing & Communications reviewed the PBL Persona Test after the `restyle-um-brand-refresh` change and returned a list of remarks. In parallel, M&C supplied the two assets that change was waiting on: the licensed **GT Standard** webfont package and the **Dutch** UM logo (`Universiteit Maastricht`).

This change installs both assets and applies the review remarks, closing the typography follow-up left open by the restyle.

Two remarks were resolved by the owner before scoping:

- The remark *"since it is an external website, it needs to be in Open Sans"* is **overruled** — the tool ships on `tools.maastrichtuniversity.nl`, a UM-owned domain covered by the GT Standard licence. GT Standard is the font.
- The remark *"remove Shadow in 'how pbl helps you grow'"* is **dropped** as unresolvably ambiguous; no shadow change is made.

## What Changes

- **Install GT Standard.** Replace the Inter stand-in (loaded from Google Fonts) with self-hosted GT Standard woff2 files under `assets/fonts/`. Two optical sizes are used — **L** for display type at 22px and above, **S** for everything below — wired through the existing `--font-display` / `--font-body` variables.
- **Normalise font weights.** GT Standard ships here in Regular (400) and Bold (700) only, while the stylesheet asks for 400/500/600/700/800. All 26 weight declarations are remapped onto the two real weights so nothing renders as a browser-synthesised face.
- **Language-specific logo, larger.** The topbar logo becomes `um-logo-en-blue.svg` / `um-logo-nl-blue.svg`, swapped by `setLang()` alongside the rest of the interface copy, and grows from `30px` to `44px` tall.
- **Remove the decorative background.** The blurred "stacked stone" blobs behind all three screens are deleted.
- **Separate the canvas from the page behind it.** The application canvas becomes white `#FFFFFF` on all three screens and the page behind it becomes steel blue `#000831`, restoring the pre-restyle framing where the two differ. Soft blue `#BEDDF7` steps back from being the canvas to being a frame and fill colour for chips, answer options, the growth card, the key message, and the CTA block. The persona detail panel gains a soft-blue border, since a white panel on a white canvas has no edge of its own.
- **Stop calling the persona cards "stones".** The result-screen hint becomes "Tap a persona to read its profile" / "Tik op een persona om het profiel te lezen". The `.stone` CSS class names are left alone.
- **Remove the pillar pills.** The cobalt pill above each question (Community / Discovery / Active engagement / Impact) stops rendering. The underlying `pillar` data stays in `data.js` because the in-flight `add-gtm-analytics` contract sends it as the `question_pillar` parameter on every `pbl_answer` event.
- **Sentence-case three labels.** `YOUR RESULT` → `Your result`, `BEST MATCH` → `Best match`, `HOW PBL HELPS YOU GROW` → `How PBL helps you grow`. The copy in `data.js` is already sentence case; three `text-transform: uppercase` rules do the shouting.
- **Emphasise the best match by colour.** The top-scoring persona card becomes steel blue `#000831` with white text and loses its steel ring; the other two stay cobalt. Its `Best match` badge inverts to white-on-steel so it stays visible, and its open-state indicator becomes a white ring.

Non-goals: no changes to quiz logic, scoring, questions, translations, or the GTM event contract; no change to the CTA destination or the dormant lead-capture modal; no rename of the `.stone` / `.stones-grid` persona-card classes; the start screen's `PBL PERSONA TEST` eyebrow keeps its uppercase treatment, as it was not among the remarks.

## Capabilities

### Modified Capabilities

- `visual-branding`: typography moves from a fallback face to the licensed GT Standard; top-persona emphasis moves from a ring to a colour change; new requirements cover language-specific logo usage, logo sizing, the absence of decorative background artwork, and sentence-case labelling.

## Impact

- **Code**: `styles.css` (`@font-face` block, font tokens, weight normalisation, background-blob removal, pillar rule removal, logo height, three `text-transform` removals, best-match card treatment). `index.html` (logo `src` and favicon, removal of three `.stones` containers and the `#q-pillar` span, font preloads). `app.js` (logo swap in `setLang()`, removal of the pillar render line). `data.js` unchanged.
- **Assets**: GT Standard woff2 files move to `assets/fonts/`; four are referenced (L Regular/Bold, S Regular/Bold). `assets/um-logo-en-blue.svg` and `assets/um-logo-nl-blue.svg` become the logo pair — the former is byte-identical to the deleted `assets/um-logo-blue.svg`, so this is a rename plus a genuinely new Dutch asset. Two stray duplicates in the repository root are removed.
- **Performance**: the render-blocking Google Fonts request is replaced by same-origin woff2 files with `font-display: swap`; the two faces used above the fold are preloaded. Declared-but-unused faces are not fetched by the browser.
- **Analytics**: no event or parameter changes. `question_pillar` continues to be sent even though the pillar is no longer displayed.
- **Follow-up**: `um-visual-identity.md` still documents the pre-2025 brand (Fort / Aptos and the old palette) and is updated to describe GT Standard and the current palette.
