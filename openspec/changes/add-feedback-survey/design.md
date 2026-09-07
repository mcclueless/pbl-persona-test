## Context

The PBL Persona Test is a static, client-only app — `index.html`, `app.js`, `data.js`, `styles.css`, no build step. All copy lives in the `I18N` object in `data.js`, keyed by language; `app.js` renders from it and re-renders on every language switch.

The result screen already carries one outbound link: the "Explore PBL at UM" CTA. Its URL sits in `I18N.<lang>.ctaUrl`, is applied in `renderResult()` (`$('#cta-btn').href = T.ctaUrl`), and its click handler pushes `pbl_cta_click`. The feedback link is the second outbound link on the same screen and follows the same shape, with one difference that drives most of this design: its URL is not a constant.

Two Qualtrics surveys already exist, one per language. They are external artefacts — this change links to them, it does not author them.

Constraints worth naming:
- `openspec/specs/visual-branding/spec.md` requires all buttons and calls-to-action to be cobalt `#355BD0` with white text and a 20px radius. A second cobalt button on the result screen would be spec-compliant and still wrong: it would split attention between the recruitment CTA (UM's goal) and the feedback survey (ours).
- The EN/NL toggle stays live on the result screen, so anything language-dependent must survive a mid-screen switch.
- `add-gtm-analytics` is code-complete with only GTM console configuration outstanding. Any new event should be defined now so it rides along with that console pass.

## Goals / Non-Goals

**Goals:**
- Give finishers a visible but subordinate route into the feedback survey.
- Send each student to the survey in the language they are reading.
- Carry the result into Qualtrics so feedback can be segmented by persona.
- Make the outbound click measurable, in the same shape as the existing CTA click.

**Non-Goals:**
- Authoring or restructuring the Qualtrics surveys.
- A feedback route for students who abandon the test mid-way.
- Any in-app display or storage of survey responses.
- Closing the `visual-branding` spec's silence on tertiary text links.

## Decisions

### Quiet text link inside the CTA block, not a second button

The link is placed inside the existing `.cta` block, below the cobalt button, styled with the `.btn-restart` treatment already in the stylesheet: dove text, no fill, no border.

*Why:* it adds no new visual surface to a screen that already has persona cards, a detail panel, a CTA block, and a footer, and it leaves exactly one filled cobalt button in view. The recruitment CTA keeps its prominence.

*Alternatives considered:* a second soft-blue block with its own cobalt button — highest response rate, but two primary CTAs competing, which is the trade-off we explicitly did not want. Placing it in the footer next to "Retake the test" — cheapest visually, but low enough to be missed by most students, which defeats the point of adding it.

*Spec note:* the `visual-branding` requirement governs buttons and calls-to-action. This link is deliberately neither; it is a tertiary control, the same class of thing as "Retake the test", which that spec already does not describe. The gap is pre-existing and this change does not widen it, so no `visual-branding` delta is proposed.

### Base URL in `data.js`, full `href` assembled in `renderResult()`

`I18N.<lang>.surveyUrl` holds only the bare Qualtrics form URL. The query string is appended at render time from live state:

```
surveyUrl + '?persona=' + state.topPersona + '&lang=' + state.lang + '&source=pbltool'
```

*Why:* `persona` is unknown until the quiz completes, and both `persona` and `lang` can change while the result screen is open — via the language toggle, or via a retake that lands on a different persona. A complete URL stored in `data.js` would be correct only for the first render and would then go stale silently. `renderResult()` already re-runs on both triggers (`setLang()` calls it when the result screen is active), so rebuilding there costs nothing and cannot drift.

*Alternative considered:* building the URL once in `computeResult()`. Rejected — it survives a retake but not a language switch, which is the more likely of the two.

### Parameters are language-agnostic keys

`persona` carries the internal key (`collaborator` / `analyst` / `challenger`), never the displayed name, matching the rule the analytics events already follow. `lang` is strictly redundant while the two surveys are separate response sets, but it costs one field and makes a merged export self-describing.

### `pbl_survey_click` mirrors `pbl_cta_click`

Same payload (`top_persona`, `language`), same wiring: a click listener registered in `init()`, pushing through the existing guarded `track()` helper. Because the link opens in a new tab, the page persists and the push is reliable without any navigation delay.

*Why the same shape:* `pbl_result` fires for every finisher and `pbl_survey_click` for the subset who click through, so the ratio is a per-persona response rate — but only if the field names and value formats match, which is what makes the two events joinable in GA4.

### Qualtrics Embedded Data is a prerequisite, not an implementation detail

Qualtrics discards unknown URL parameters unless the survey flow declares them. Each survey needs an Embedded Data element at the top of its Survey Flow with `persona`, `lang`, and `source`, each left as *"Value will be set from Panel or URL"*.

This is console work in a system this repo does not control, so it belongs in `tasks.md` as an explicitly non-code step rather than being assumed.

## Risks / Trade-offs

- **Embedded Data not configured in Qualtrics** → the links still work, the parameters vanish, and nobody notices until the first export. Mitigation: an explicit non-code task per survey, plus a verification step that submits a test response through a parameterised link and confirms the three fields land in the response.
- **The two survey IDs could be swapped** → Dutch students land in the English survey and vice versa; a silent, embarrassing failure. The IDs and their language labels reached this change in separate messages, so the mapping is asserted, not verified. Mitigation: a verification task that opens both URLs and confirms the language of each before launch.
- **`pbl_survey_click` not configured in GTM** → the link works and the click is invisible in GA4. Mitigation: append the variable/trigger/tag rows to `add-gtm-analytics/gtm-setup.md` so it is picked up in the console pass that is already outstanding, rather than needing a second one.
- **A quiet link means fewer responses** → accepted deliberately, in exchange for not diluting the recruitment CTA. If the response volume proves too low, the placement can be escalated to its own block later without changing the URL, parameter, or event design.
- **Only finishers can give feedback** → the students most worth hearing from may be the ones who quit at question 3. Accepted for this change; an abandonment route would need its own trigger and is out of scope.
- **Third outbound link on one screen** → mitigated by the visual hierarchy: one filled button, two quiet text links.
