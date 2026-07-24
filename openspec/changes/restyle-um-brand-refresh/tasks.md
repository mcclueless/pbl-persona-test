## 1. Brand token layer

- [x] 1.1 In `styles.css` `:root`, add brand tokens: `--steel:#000831`, `--cobalt:#355BD0`, `--soft:#BEDDF7`, `--white:#ffffff`, `--radius-btn:20px`
- [x] 1.2 Remap legacy variables to the new palette: `--midnight`/`--ink` → steel, `--paper` → soft, `--sky`/`--sky-deep` → cobalt; keep `--dove` only for genuinely secondary text
- [x] 1.3 Point `--font-body` and `--font-display` at `'Inter', system-ui, sans-serif` (GT Standard stand-in); leave a comment marking where the real GT Standard `@font-face` goes

## 2. Fonts & document head (`index.html`)

- [x] 2.1 Replace the Google Fonts `<link>` (Bricolage + Hanken) with Inter (weights 400 and 700)
- [x] 2.2 Update `<meta name="theme-color">` to `#BEDDF7`
- [x] 2.3 Swap both `um-logo-white.svg` references (quiz + result topbars) to `um-logo-blue.svg`

## 3. Unify screens on the light theme (`styles.css`)

- [x] 3.1 `body` / `.app` background → soft blue; base text → steel
- [x] 3.2 `#screen-quiz` and `#screen-result` backgrounds → soft blue (remove the dark radial gradients); their text → steel
- [x] 3.3 Retire `.lang-toggle.on-dark` styling so all language toggles use the light treatment
- [x] 3.4 Recolour the stacked-stone background accents to on-brand tints (soft/cobalt at low opacity)

## 4. Components

- [x] 4.1 Buttons (`.btn-primary`, `.btn-download`, `.detail-switch`, modal submit): cobalt bg, white text, `border-radius: var(--radius-btn)` (20px)
- [x] 4.2 Chips/pills (`.eyebrow`, `.q-pillar`, `.result-head .kicker`): soft bg with steel or cobalt text per role (subheading-like → cobalt)
- [x] 4.3 Quiz answers (`.answer`): soft/white frame + steel border + steel text at rest; `.answer.chosen` and `.answer .key` selected state → cobalt fill + white text
- [x] 4.4 Progress bar (`.progress-segs .seg` track → steel tint; `.seg i` fill → cobalt); `.progress-meta .count` accent → cobalt
- [x] 4.5 Persona stones (`.stone`): flat cobalt bg, white text, `20px` corners; remove per-persona gradient rules and organic blob radius
- [x] 4.6 Top-persona emphasis (`.stone.is-top`): steel-blue ring instead of the sky ring; recolour `.crown` to steel/white
- [x] 4.7 Detail panel (`.detail.is-shown`): keep a white surface with steel text (legibility over the soft-blue page); recolour `.grow-card`, `.detail h3`, `.key-message` to soft-blue frames with steel text and cobalt accents
- [x] 4.8 CTA block (`.cta`): soft-blue (or white) frame with steel text and cobalt heading, replacing the dark gradient
- [x] 4.9 Modal (`.modal`, fields, consent, success): keep white surface; recolour focus/accent states and the submit button to cobalt

## 5. Persona colour data (`data.js`)

- [x] 5.1 Change all three persona `color` values to cobalt (`var(--cobalt)` / `#355BD0`) so the inline detail-badge/heading accents match the one-colour persona spec

## 6. Assets cleanup

- [x] 6.1 Remove `assets/UM logo - primary - clearspace - EN - blue.BMP` (superseded by the SVG)
- [x] 6.2 Remove `assets/um-logo-white.svg` (no longer referenced)

## 7. Verify

- [x] 7.1 Open the app and confirm all three screens render on the soft-blue canvas with the steel-blue logo top-left (EN and NL)
- [x] 7.2 Confirm buttons/CTAs are cobalt with white text and 20px corners, and quiz answers select to cobalt
- [x] 7.3 Confirm all three persona cards are the same cobalt, the top persona shows the steel ring, and the detail panel + modal remain legible (white surfaces)
- [x] 7.4 Confirm no broken/white logo references and no leftover dark backgrounds
