## Context

`restyle-um-brand-refresh` moved the tool to the UM 2025 palette but shipped **Inter** as a stand-in, because GT Standard is licensed and was not in the repository. It also left the app with a single logo asset. M&C have now supplied both missing pieces plus a list of review remarks.

Two findings from investigating the assets shaped this design:

1. **`um-logo-en-blue.svg` is not a new asset.** It is byte-identical (SHA `5d0ff116…`, viewBox `0 0 3286 882`) to the `assets/um-logo-blue.svg` deleted from the working tree, and to a stray copy in the repository root. The only genuinely new logo is the Dutch one. This matters because the remark *"UM Logo needs to be bigger"* cannot be satisfied by keeping the current `height: 30px` — that is exactly today's rendering.
2. **GT Standard here has two weights, not five.** The package supplies Regular and Bold across three optical sizes. The stylesheet asks for 400/500/600/700/800; 13 of its 26 weight declarations have no matching face.

## Goals / Non-Goals

**Goals:**
- Self-host GT Standard and remove the third-party font request entirely.
- Keep the `--font-display` / `--font-body` indirection intact so no component rule needs a literal family name.
- Apply every actionable remark without touching quiz logic or the analytics contract.
- Leave the top-persona emphasis legible in both its resting and open states after the colour change.

**Non-Goals:**
- No optical-size refinement beyond a two-tier split; no variable-font or three-tier setup.
- No italic support — nothing in the app renders true italic.
- No renaming of `.stone` / `.stones-grid` after the decorative blobs are removed.

## Decisions

### D1: Two optical sizes, split by rendered size — not by role

GT Standard's S/M/L axis is **optical size**, which tracks how large the text renders, not whether it is a heading. This does not map onto the existing `--font-display` / `--font-body` split, because `--font-display` is used both for the 58px hero and for 10px labels.

The split is therefore made at **22px**:

```
  --font-display : 'GT Standard L'   → 8 sites, 22px–58px
  --font-body    : 'GT Standard S'   → everything else, 10px–19px
```

Twelve small-but-bold sites (`.lang-toggle`, `.eyebrow`, `.progress-meta .count`, `.result-head .kicker`, `.stone-name`, `.crown`, `.detail h3`, `.key-message`, the buttons) move from `--font-display` to `--font-body` while keeping `font-weight: 700`. This is the typographically correct pairing: small bold text wants the small optical size.

**Alternatives rejected:** shipping a single optical size (M) for everything would be simpler but discards the reason the package has an optical axis; shipping all three tiers would need a third token and a second threshold for marginal gain.

The middle (M) tier, all six Oblique faces, and both GT Super Text faces are **not referenced**. Nothing in the app renders true italic — `.hero-title em` is explicitly `font-style: normal` and uses a gradient-clip effect — and GT Super is a serif with no role in the current design. They are moved into `assets/fonts/` with the rest of the package but left out of the stylesheet. Because browsers only fetch a face when a rule actually matches it, declaring `GT Standard L` at 400 costs nothing even though no current rule uses it; it guards against a future large-and-regular heading silently rendering as faux weight.

### D2: Collapse five requested weights onto the two that exist

| Declared | Sites | Maps to | Rationale |
|---|---|---|---|
| 800 | 7 | **700** | Hero, result `h1`, `%` figure, detail `h2`, CTA/modal headings. No heavier face exists. |
| 700 | 13 | **700** | Unchanged. |
| 600 | 4 | **700** or **400** | Emphasis (`.key-message`, `.field label`) → 700; secondary meta (`.pct-line`, `.stone-pct small`) → 400. |
| 500 | 2 | **400** | `.feature-list`, `.answer` are body copy. |

Losing 800 costs the hero some presence, so `.hero-title` and `.result-head h1` tighten from `letter-spacing: -0.02em` to `-0.03em` to recover density. This is the one place where the font swap is a deliberate design adjustment rather than a substitution.

### D3: The logo becomes language-reactive state

`setLang()` already owns `document.documentElement.lang`, all interface copy, and the toggle's active class. The logo joins it rather than becoming a second, parallel mechanism. The three topbar `<img>` elements get a shared `.brand-logo` class so one query updates all of them.

Sizing uses a single rule for both languages: the Dutch mark is `3370×882` against the English `3286×882`, so at a shared `height: 44px` they render 168px and 164px wide — a 4px difference, well inside the ~230px the topbar has available at a 360px viewport.

The favicon stays English-only. It is set once in `<head>`, and swapping a favicon mid-session is unusual behaviour for a marginal gain.

### D4: Colour replaces the ring as best-match emphasis — and two things depend on that ring

The remark asks for the top card in steel `#000831` with white text and no frame. Two existing treatments break under it, because both use a steel ring or a steel fill that becomes invisible against a steel card:

```
  .stone.is-top  → steel ring          removed; colour now carries the emphasis
  .stone .crown  → steel bg, white text   inverted to white bg, steel text
  .stone.is-open → steel ring          white ring when the open card is also .is-top
```

The `Best match` badge is **kept rather than dropped**. Dropping it would also have removed one of the three labels the remarks explicitly asked to sentence-case, which would read as the remark being ignored.

The persona detail panel keeps its cobalt accent even when opened from the steel top card. Accents come from `data.js`, which is out of scope here, and a steel-on-steel detail heading would be a regression.

### D5: The pillar data outlives the pillar pill

`app.js` sends `question_pillar: Q.pillar.en` with every `pbl_answer` event, and `add-gtm-analytics` is still in flight — its GA4 custom dimensions are not yet registered, so nothing downstream has confirmed the parameter is safe to drop. Only the render line and the `.q-pillar` rule are removed; `data.js` is untouched.

## Risks / Trade-offs

- **Self-hosted fonts add ~254KB** of same-origin payload where there was a third-party request. Mitigated by `font-display: swap` and preloading the two faces used above the fold; the trade is a removed cross-origin dependency and no Google Fonts privacy surface.
- **The type will look different**, not merely re-faced. Losing weights 800/600/500 is visible on the hero and the result heading. This is inherent to the supplied package, not a shortcut.
- **Font files in a public repository** are a distribution distinct from serving them on a licensed domain. Flagged for the owner; not blocking.
