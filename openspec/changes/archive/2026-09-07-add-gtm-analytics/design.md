## Context

The PBL Persona Test is a static, client-only site (`index.html`, `app.js`, `data.js`, `styles.css`) with three screens — start, quiz (5 questions), result — driven by an in-memory `state` object in `app.js`. It ships no build step and no third-party runtime dependencies today. It is going live at `https://tools.maastrichtuniversity.nl/pbl/`, and stakeholders want usage analytics via Maastricht University's standard Google Tag Manager container `GTM-5LTFPDLV`.

Relevant existing structure:
- `startQuiz()` resets state and shows the quiz.
- `choose(persona, btn)` records an answer; its final branch (last question) calls `computeResult()` then shows the result screen.
- `computeResult()` fills `state.pct`, `state.scores`, and `state.topPersona`.
- `renderResult()` re-runs on **every** language toggle (it is called from `setLang`), so it is not a safe place to fire once-per-completion events.
- `setLang(lang)` handles the EN/NL toggle. `personaStone()` builds each result stone and toggles detail open/closed. The CTA is an `<a id="cta-btn" target="_blank">` whose `href` is set from `data.js`.

## Goals / Non-Goals

**Goals:**
- Load GTM `GTM-5LTFPDLV` with the canonical snippet, non-blocking and failure-tolerant.
- Emit a small, well-named set of `pbl_*` events covering start, answers, result, persona opens, language switches, restart, and CTA clicks.
- Keep event payloads language-agnostic so EN/NL data aggregates.
- Add zero dependencies beyond GTM itself; no build step.

**Non-Goals:**
- Configuring GTM tags/triggers/variables or GA4 — that happens in the GTM web console.
- Adding a cookie/consent banner or Consent Mode wiring in the app (flagged as an open question).
- Tracking partial-quiz answer data (answers are only emitted at completion by design).
- Server-side or PII collection (the dormant lead-capture modal is untouched).

## Decisions

### D1: Canonical GTM snippet, verbatim, in `index.html`
Place the GTM `<script>` as high as possible in `<head>` (Google's guidance for accurate loading) and the `<noscript>` iframe immediately after `<body>`. Use the exact snippet UM provided. Rationale: matches Google/UM conventions; the async loader already fails gracefully.

### D2: A single `track(event, props)` helper in `app.js`
```js
function track(event, props) {
  try { (window.dataLayer = window.dataLayer || []).push(Object.assign({ event }, props || {})); }
  catch (_) {}
}
```
Rationale: one choke point keeps naming consistent and guarantees the try/catch guard everywhere. Defining `dataLayer` defensively means events queue correctly even if this runs before the GTM loader.

### D3: Fire `pbl_answer` ×5 at completion, not per selection
Reading final answers from `state.answers` in `choose()`'s completion branch (after `computeResult()`) is the only way to guarantee "final answer, exactly once per question," because Back-and-change cannot be retracted from an append-only `dataLayer`. The option letter is derived as `QUESTIONS[i].options.findIndex(o => o.p === state.answers[i])` → `['A','B','C'][idx]`, and the pillar as `QUESTIONS[i].pillar.en`. Alternative considered: fire live per selection with client-side dedupe — rejected because a changed answer would already have been pushed and cannot be unsent.

### D4: Fire `pbl_result` in the completion branch, never in `renderResult()`
`renderResult()` re-runs on language toggle, so firing there would double-count results. The completion branch runs exactly once per finished test. Alternative considered: a "hasFired" guard inside `renderResult()` — rejected as more fragile than firing at the single completion point.

### D5: Event names and payload keys (the contract for GTM config)
| event | key fields |
|---|---|
| `pbl_start` | `language` |
| `pbl_answer` | `question_number`, `question_pillar`, `chosen_persona`, `option_letter`, `language` |
| `pbl_result` | `top_persona`, `score_collaborator/analyst/challenger`, `pct_collaborator/analyst/challenger`, `language` |
| `pbl_persona_open` | `persona`, `language` |
| `pbl_language_switch` | `language` |
| `pbl_restart` | `language` |
| `pbl_cta_click` | `top_persona`, `language` |

`pbl_` prefix namespaces our events within the shared `GTM-5LTFPDLV` container. Persona/pillar values use English keys only.

### D6: Instrumentation points
- `startQuiz()` → `pbl_start`
- `choose()` completion branch → 5× `pbl_answer`, then `pbl_result` (after `computeResult()`)
- `setLang(lang)` → `pbl_language_switch` (only reached on user toggle, not on initial load)
- `personaStone()` click handler, `willOpen === true` branch → `pbl_persona_open`
- restart button handler → `pbl_restart`
- `#cta-btn` → add a `click` listener that fires `pbl_cta_click`; the anchor is `target="_blank"`, so the page persists and the push is reliable.

## Risks / Trade-offs

- **Consent / GDPR on an EU University property** → RESOLVED: the `tools.maastrichtuniversity.nl` hosting platform handles consent management at the platform level (confirmed 2026-07-02), so this app does not need its own consent gate. The GTM snippet and events can fire under the platform's consent handling.
- **No abandoned-quiz answer data** → Firing answers at completion means drop-offs contribute no per-answer data. Mitigation: accepted trade-off; `pbl_start` minus `pbl_result` still reveals overall drop-off.
- **Events without GTM config produce no reports** → dataLayer pushes are inert until mapped to tags/triggers. Mitigation: hand the D5 table to whoever configures the container.
- **Shared container collisions** → RESOLVED: `GTM-5LTFPDLV` is dedicated to this tool and not shared with other UM tools (confirmed 2026-07-02), so there is no cross-tool event collision. The `pbl_` prefix is retained for readability regardless.

## Migration Plan

1. Add GTM snippets to `index.html` and the `track()` helper + instrumentation to `app.js`.
2. Verify in-browser (GTM Preview / `window.dataLayer`) that each event fires with the expected payload.
3. Configure triggers/tags → GA4 in the GTM console using the D5 contract.
4. Confirm consent handling (open question) before public launch.

Rollback: remove the two GTM snippets and the tracking calls — no data model or structural changes to revert.

## Open Questions

- ~~Does `tools.maastrichtuniversity.nl` handle consent at the platform level, or does this app need its own consent gate?~~ RESOLVED 2026-07-02: the platform handles consent; no in-app gate needed.
- ~~Is `GTM-5LTFPDLV` shared with other UM tools?~~ RESOLVED 2026-07-02: the container is dedicated to this tool; not shared.
- ~~Downstream GA4 destination and report setup — who configures the container?~~ RESOLVED 2026-07-02: the site owner (b.kapeller) will configure GA4 in the GTM console.
