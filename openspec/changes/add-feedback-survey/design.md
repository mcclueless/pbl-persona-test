## Context

The PBL Persona Test is a static, client-only app — `index.html`, `app.js`, `data.js`, `styles.css`, no build step. All copy lives in the `I18N` object in `data.js`, keyed by language; `app.js` renders from it and re-renders on every language switch.

The result screen already carries one outbound link: the "Explore PBL at UM" CTA. Its URL sits in `I18N.<lang>.ctaUrl`, is applied in `renderResult()` (`$('#cta-btn').href = T.ctaUrl`), and its click handler pushes `pbl_cta_click`. The feedback link is the second outbound link on the same screen and follows the same shape, with one difference that drives most of this design: its URL is not a constant.

Two Qualtrics surveys already exist, one per language. They are external artefacts — this change links to them, it does not author them.

Constraints worth naming:
- `openspec/specs/visual-branding/spec.md` requires all buttons and calls-to-action to be cobalt `#355BD0` with white text and a 20px radius. The feedback button follows that treatment. Two cobalt buttons split attention when they share a frame, so the two asks are kept in separate blocks — see *Cobalt button in its own block* below.
- The EN/NL toggle stays live on the result screen, so anything language-dependent must survive a mid-screen switch.
- `add-gtm-analytics` is code-complete with only GTM console configuration outstanding. Any new event should be defined now so it rides along with that console pass.

## Goals / Non-Goals

**Goals:**
- Give finishers a route into the feedback survey that is actually noticed, without displacing the recruitment CTA from first position.
- Send each student to the survey in the language they are reading.
- Carry the result into Qualtrics so feedback can be segmented by persona.
- Make the outbound click measurable, in the same shape as the existing CTA click.

**Non-Goals:**
- Authoring or restructuring the Qualtrics surveys.
- A feedback route for students who abandon the test mid-way.
- Any in-app display or storage of survey responses.
- Amending `visual-branding` — the survey button uses the cobalt treatment that spec already defines.

## Decisions

### Cobalt button in its own block, below the CTA block

The survey link is a filled cobalt button — `#355BD0`, white text, 20px corners — in a block of its own, placed below the `.cta` recruitment block and above "Retake the test". Each block holds exactly one filled button.

*Why:* the link has to be seen to be used, and a filled button is the treatment this app already uses for "do this thing". Giving it a separate block rather than a second slot inside `.cta` keeps the two asks from competing inside one frame, and lets the recruitment CTA keep primacy through order — it comes first — rather than through a difference in visual weight.

*Why not a second button inside the `.cta` block:* that block's heading and body copy are recruitment copy, framing the "Explore PBL at UM" button. A survey button underneath them inherits that framing and reads as part of UM's offer rather than a separate request from us. Two identical cobalt buttons in one frame also leave order as the sole hierarchy signal, with no surrounding structure to reinforce it.

*Why not steel `#000831`:* considered, as a way to distinguish the two buttons by hue rather than by position. Rejected on two grounds. Steel is near-black — roughly 19:1 against white where cobalt is about 5.7:1 — so a steel button outweighs the cobalt CTA and takes primacy whether or not that is intended. And `visual-branding` already spends steel on the top-persona card, directly above this block, where it means "this is your best match"; reusing it for the survey button would blur a signal the student met seconds earlier.

*Spec note:* a cobalt/white/20px button is exactly what `visual-branding` mandates for buttons, so this treatment needs no `visual-branding` delta. The `feedback-survey` delta carries the placement and the one-filled-button-per-block rule.

*Superseded decision (2026-09-11):* this shipped first as a quiet dove-grey text link inside the `.cta` block, reusing the `.btn-restart` treatment — deliberately subordinate, so as not to dilute the recruitment CTA. Reversed because the link went unseen in practice. The mechanism is legible in the stylesheet: at 13.5px in dove `#4a5570`, set `margin-top: 16px` beneath a cobalt button whose `box-shadow: 0 14px 36px -14px` falls roughly 18px, the link begins inside that shadow. This is precisely the escalation the Risks section anticipated, and the escape hatch held — the survey URLs, the query parameters, and the `pbl_survey_click` event are all unchanged.

*Basis for the reversal:* the owner's direct observation that the link goes unseen, corroborated by the stylesheet geometry above. A GA4 baseline separating a visibility problem from a motivation problem was considered and deliberately set aside by the owner on 2026-09-11 — the shadow overlap is a sufficient explanation on its own, and the change is cheap enough not to need one. `pbl_survey_click` keeps firing either way, so the effect stays observable after the fact.

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
- **A quiet link means fewer responses** → this risk fired. Accepted at first in exchange for not diluting the recruitment CTA, then reversed on 2026-09-11 once the link proved effectively invisible. The escape hatch worked as written: the placement and treatment changed, the URL, parameters, and event design did not.
- **Only finishers can give feedback** → the students most worth hearing from may be the ones who quit at question 3. Accepted for this change; an abandonment route would need its own trigger and is out of scope.
- **Third outbound link on one screen** → the screen now carries two filled cobalt buttons plus the quiet "Retake the test" control. Mitigated by separation and order: one filled button per block, recruitment first, each with its own framing copy.
- **Two cobalt buttons could still read as competing** → the residual cost of making the survey visible, accepted knowingly. Separate blocks and fixed order are the mitigation; if the recruitment CTA measurably suffers, `pbl_cta_click` against `pbl_result` will show it, and the survey block can be moved below "Retake the test" without touching the URL or event design.
