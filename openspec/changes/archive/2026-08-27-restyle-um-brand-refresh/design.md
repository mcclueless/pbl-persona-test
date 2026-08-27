## Context

The PBL Persona Test is a static, client-only site (`index.html`, `app.js`, `data.js`, `styles.css`) with three screens — start, quiz, result — and a dormant lead-capture modal. All styling lives in `styles.css`, driven by a `:root` custom-property block; `app.js` and `data.js` inject a handful of inline colours from a per-persona `color` value.

Today's visual system is deliberately "stories-style": the **start** screen is light (`--paper #f5f7fb`, dark text, blue logo) while the **quiz** and **result** screens are **dark** (midnight radial gradients, white text, `um-logo-white.svg`). Accent colour is sky blue `#6ED2EC`, and the three personas are colour-coded green/blue/purple via CSS gradients and matching `data.js` `color` values.

M&C's refreshed brand for the tool specifies a single light theme. The existing `assets/um-logo-blue.svg` is already the UM primary wordmark filled `#000831` — the exact steel blue requested — so the logo asset itself needs no colour work.

## Goals / Non-Goals

**Goals:**
- One unified light theme across all three screens: soft-blue `#BEDDF7` canvas, steel-blue `#000831` text.
- Cobalt `#355BD0` for buttons/CTAs (white text, `20px` corners), subheadings, and all three persona cards.
- GT Standard Regular (body/base) and GT Standard Bold (headings/subheadings), wired so the licensed files drop in later without touching component CSS.
- Recolour purely through the token layer wherever possible; keep `app.js` logic untouched.

**Non-Goals:**
- No changes to quiz flow, scoring, copy, translations, or GTM analytics.
- No shipping of the real licensed GT Standard webfont in this change (fallback now, swap later).
- No new screens, layouts, or component structure — this is a re-skin, not a redesign.
- No change to the CTA link or the modal's behaviour (colours only).

## Decisions

### D1: A new brand-token layer in `:root`
Introduce canonical brand tokens and route every component through them:
```css
:root {
  --steel:  #000831;   /* body + headings text, logo */
  --cobalt: #355BD0;   /* buttons, CTAs, subheadings, persona cards */
  --soft:   #BEDDF7;   /* background + light frames */
  --white:  #ffffff;   /* text on cobalt surfaces */
  --radius-btn: 20px;  /* buttons + persona cards */
}
```
The existing `--midnight`, `--sky`, `--paper`, and persona-accent variables are **remapped** to these (rather than deleted wholesale) so that references scattered through the stylesheet resolve to the new palette with minimal churn: `--midnight → var(--steel)`, `--ink → var(--steel)`, `--paper → var(--soft)`, `--sky`/`--sky-deep → var(--cobalt)`, `--dove` retained only where genuinely secondary. Rationale: fastest, lowest-risk path to a consistent recolour; a later cleanup pass can inline the aliases.

### D2: Collapse the two dark screens onto the light canvas
Replace the dark radial-gradient backgrounds of `#screen-quiz` and `#screen-result` with the soft-blue canvas and steel text. Consequences handled explicitly:
- **Quiz answer buttons** move from translucent-white-on-dark to a soft-blue/white frame with a steel-blue border and steel text; the "chosen" state fills cobalt with white text.
- **Progress bar** track goes from white-translucent to a steel-blue tint; the fill goes sky→cobalt.
- **`on-dark` language-toggle** styling is retired (all toggles use the light styling).
- **Chips/pills** (`.eyebrow`, `.q-pillar`, `.result-head .kicker`, `.crown`) recolour to cobalt-on-soft or steel-on-soft.

### D3: Buttons and persona cards → cobalt, white text, 20px
All primary actions (`.btn-primary`, `.btn-download`, `.detail-switch`, modal submit) become `background: var(--cobalt)`, `color: var(--white)`, `border-radius: var(--radius-btn)` (20px), replacing the current `999px` pill and midnight/sky fills. Persona stones (`.stone`) lose their per-persona gradients and organic blob radius, becoming flat `var(--cobalt)` with white text and `20px` corners.

### D4: Persona top-emphasis without colour
With all three cards the same cobalt, the current sky-ring + crown that flagged the top persona no longer reads as "different." Keep the emphasis but change its cue: `.stone.is-top` gets a steel-blue ring (`box-shadow: 0 0 0 2.5px var(--steel)`) and the crown pill becomes steel-on-white (or white-on-steel). Ordering already puts the top persona first. Rationale: the user explicitly asked for one persona colour; emphasis must therefore come from a non-hue signal.

### D5: Frame legibility — chips soft, big panels white
"All light-blue frames → soft blue with steel text" is applied to the **small framed elements** (chips, pills, the grow-card, the key-message callout, quiz answer rest state). The **large content surfaces** — the `.detail` persona panel and the `.modal` — stay **white** with steel text so they separate from the soft-blue page behind them; soft-on-soft would erase the boundary. This preserves visual structure while honouring the intent (soft-blue framing language, steel text throughout). Flagged to and confirmed with the requester during exploration.

### D6: GT Standard via font variables, Inter as the stand-in
GT Standard is a licensed font, absent from the repo and unavailable on Google Fonts. Map it through the existing variables:
```css
--font-body:    'Inter', system-ui, sans-serif;  /* → GT Standard Regular (400) */
--font-display: 'Inter', system-ui, sans-serif;  /* → GT Standard Bold   (700) */
```
Headings/subheadings use weight 700; body uses 400. Inter is chosen as the fallback because GT Standard is a clean neutral grotesque and Inter's proportions and x-height are the closest ubiquitous match. Swap-in later = add `@font-face` blocks pointing at `assets/fonts/GT-Standard-*.woff2` and change the two variable values; no component CSS changes. The Google Fonts `<link>` is updated from Bricolage+Hanken to Inter.

### D7: Logo — one SVG everywhere, drop the BMP
`assets/um-logo-blue.svg` (vector, already `#000831`) replaces both current logo references. The two `um-logo-white.svg` uses in `index.html` (quiz + result topbars) switch to the blue SVG, appropriate now that those screens are light. The supplied `.BMP` (2840×437, 5 MB) is the same wordmark; rasterising it would be heavier and non-scalable, so it is removed rather than converted. `um-logo-white.svg` is also removed as unused. The `<link rel="icon">` and `theme-color` meta update to the new palette (`theme-color` → `#BEDDF7`).

## Risks / Trade-offs

- **Fallback font ≠ final font.** Inter is close but not GT Standard; letter-spacing and heading weight may shift slightly when the real font lands. Mitigation: the variable indirection makes the swap a two-line change, and the layout is not tuned to Inter-specific metrics.
- **Cobalt-on-soft-blue contrast.** `#355BD0` on `#BEDDF7` is ~2.9:1 — acceptable for large bold subheadings but below AA for small text. Mitigation (D5): cobalt is used for large/bold type and as a *background* (white text on cobalt clears AA); small body text stays steel-on-soft (very high contrast).
- **Loss of the stories-style dark aesthetic.** The dark quiz/result screens were a deliberate mood; unifying to light removes it. Mitigation: this is the explicit brand direction, confirmed during exploration.
- **Personas visually less distinct.** One colour makes the three cards differ only by icon/label/percentage. Mitigation (D4): icons, names, and the steel top-ring carry the distinction; this is the requested behaviour.

## Migration Plan

1. Add the brand-token layer and remap legacy variables in `styles.css` (D1).
2. Recolour components: screens, quiz answers, progress, chips, persona stones, detail panel, CTA, modal (D2–D5).
3. Switch button/card radius to 20px and fonts to the variable-driven Inter stand-in; update the Google Fonts link (D3, D6).
4. Update `data.js` persona `color` values to cobalt; swap logo references and meta in `index.html`; remove unused logo assets (D7).
5. Verify in-browser across all three screens (EN + NL), the persona detail panel, and the modal.

Rollback: revert `styles.css`, `index.html`, `data.js`, and restore the removed assets — no structural or logic changes to undo.

## Open Questions

- ~~Where do the GT Standard font files come from?~~ RESOLVED during exploration: ship a close fallback (Inter) now; M&C to provide licensed woff2 files for a later swap.
- ~~Do the dark quiz/result screens stay dark or join the light theme?~~ RESOLVED: unify all three on the soft-blue light theme.
- ~~Convert the BMP or use the existing SVG?~~ RESOLVED: use the existing `um-logo-blue.svg`; drop the BMP.
