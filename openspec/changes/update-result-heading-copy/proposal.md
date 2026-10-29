# Proposal

## Why

The result-screen heading "Here is your PBL persona" announces a result but doesn't tell the user what to do next, so a separate small grey hint below the persona cards has to carry the instruction. Making the heading itself the instruction removes that redundancy and puts the call to action where the eye lands first.

## What Changes

- The result-screen heading becomes a single line of copy: "Tap a persona to learn more" (EN) / "Tik op een persona voor meer informatie" (NL), replacing "Here is your / PBL persona" and "Dit is jouw / PBL-persona".
- The heading is rendered as one uniform run of text; the cobalt second line ("PBL persona") goes away.
- The hint below the persona cards ("Tap a persona to read its profile" / "Tik op een persona om het profiel te lezen") is removed entirely, including its element and spacing.
- The "no stones" copy rule's scenario is re-pointed from the removed hint to the heading.

## Capabilities

### New Capabilities

_None._

### Modified Capabilities

- `visual-branding`: the "Interface copy does not refer to persona cards as stones" requirement's scenario now targets the result heading instead of the removed hint; a new requirement states that the result heading instructs the user to tap a persona and that no separate hint appears below the cards.

## Impact

- `index.html` — result heading markup; hint element removed.
- `data.js` — EN and NL strings: two heading keys collapse into one, hint key removed.
- `app.js` — `renderResult()` text assignments for heading and hint.
- `styles.css` — `.result-head h1 .accent` and `.tap-hint` rules removed.
- No analytics impact: `pbl_persona_open` is tied to the cards, not the hint.
