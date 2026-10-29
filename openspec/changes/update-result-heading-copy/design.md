# Design

## Context

The result heading is built from two spans (`#result-title1`, `#result-title2.accent`) filled from `resultTitle1` / `resultTitle2` in `data.js`; the `.accent` span is cobalt and `display:block`, giving a two-tone, two-line heading. The hint is a `<p class="tap-hint">` filled from `tapHint`. All copy is set at render time from the active language's string table, so EN/NL parity is maintained by keeping keys identical across both tables.

## Goals / Non-Goals

**Goals:**
- One heading string per language, rendered as a single uniform element.
- No dead markup, string keys or CSS left behind.

**Non-Goals:**
- Changing the kicker ("Your result"), heading size/weight, or card behaviour.
- Renaming the internal `.stone` class names.

## Decisions

- **One span, one key (`resultTitle`).** The user chose a single uniform heading. Keeping two spans with one emptied would leave an invisible block-level line and a misleading key. Alternative considered: splitting "Tap a persona" / "to learn more" across the existing spans to keep the cobalt accent — rejected by the owner.
- **Delete the hint element rather than blanking the string.** An empty `<p>` still carries `margin-top: 16px`, leaving a gap above the detail panel. Removing element, key, assignment and CSS together avoids that and avoids a `null` lookup if only the markup were removed.
- **Keep the "no stones" scenario's title.** OpenSpec rejects a MODIFIED block that drops or renames a scenario, so the scenario keeps its title ("…hint names what the user actually taps") and only its body is re-pointed at the heading, which is now the on-screen instruction.
- **"Tap" over "Click".** Most visitors use phones; matches the wording of the removed hint.

## Risks / Trade-offs

- [The heading no longer says "your persona", so the result framing rests on the kicker "Your result" and the best-match badge] → Accepted by the owner; the best-match card still marks the user's persona.
- [Longer NL string may wrap differently at narrow widths] → Check at ~360px during verification.
