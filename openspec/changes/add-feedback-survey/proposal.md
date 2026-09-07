## Why

Students finish the PBL Persona Test and have no way to tell us what they thought of it. We now have two Qualtrics surveys ready — one English, one Dutch — but nothing links to them, so the tool collects zero feedback about itself. Adding the link at the end of the test also lets us carry the student's result into the survey, so responses can be read per persona ("the result felt wrong" clustering in one persona points at that persona's scoring) instead of arriving as an undifferentiated pile.

## What Changes

- Add a feedback link at the end of the test, on the result screen, inside the existing CTA block below the "Explore PBL at UM" button. It is a quiet text link in dove grey — not a second cobalt button — so it does not compete with the recruitment CTA for attention.
- Point the link at the language-matched Qualtrics survey:
  - EN: `https://maastrichtuniversity.eu.qualtrics.com/jfe/form/SV_em1huq9t56bJHrE`
  - NL: `https://maastrichtuniversity.eu.qualtrics.com/jfe/form/SV_0r2st1QZQMgRxSS`
- Carry result context into Qualtrics as query parameters: `?persona=<top persona>&lang=<en|nl>&source=pbltool`.
- Rebuild the link's `href` whenever the result screen renders, so it follows the live top persona and the live UI language (the EN/NL toggle stays available on the result screen, and a retake can change the persona).
- Open the survey in a new tab so the student's result survives the click.
- Add new EN/NL copy strings for the link label and the survey base URL, alongside the existing `ctaUrl`.
- Emit a new `pbl_survey_click` analytics event carrying `top_persona` and `language` — the same payload shape as the existing `pbl_cta_click`. Paired with `pbl_result`, this gives a feedback response rate per persona, so we know whether the responses we read are skewed before we read them.

Non-goals: this change does **not** author or edit the Qualtrics surveys themselves, and does **not** offer a feedback route to students who abandon the test before finishing — the link only appears on the result screen.

## Capabilities

### New Capabilities

- `feedback-survey`: The end-of-test route into the external Qualtrics feedback surveys — where the link appears, which survey each language gets, and what result context travels with the student.

### Modified Capabilities

- `analytics-tracking`: One added requirement — feedback-survey clicks are tracked as `pbl_survey_click`. Note this capability's baseline is not yet in `openspec/specs/`; it currently lives in the in-progress `add-gtm-analytics` change and merges into the main specs when that change is archived. This delta is written to stack cleanly on top of it either way.

## Impact

- **Code**: `index.html` (one anchor added inside the existing `.cta` block), `app.js` (build the survey `href` in `renderResult()`, plus a click listener emitting `pbl_survey_click`), `data.js` (two new strings per language), `styles.css` (one quiet-link rule, reusing the existing `.btn-restart` treatment). No build step, no new runtime dependency.
- **External config, not code**: each Qualtrics survey needs an Embedded Data element declaring `persona`, `lang`, and `source` in its Survey Flow. Without it Qualtrics silently discards the URL parameters — the links keep working and the context is simply lost, which is not visible until the results are exported.
- **Downstream**: adds one more Data Layer Variable, Custom Event trigger, and GA4 Event tag to the GTM console work already outstanding in `add-gtm-analytics`. That change is code-complete with only console configuration left, so folding `pbl_survey_click` into the same pass avoids a second trip through the GTM console.
- **Visual spec**: `openspec/specs/visual-branding/spec.md` requires calls-to-action to be cobalt buttons. The feedback link is deliberately not a CTA in that sense — it is a tertiary text link, the same treatment as the existing "Retake the test" control, which the spec is already silent about. No `visual-branding` delta is proposed; the gap is pre-existing and closing it is a separate concern.
- **Privacy**: the parameters carry a quiz result and a language, not identity. No personal data leaves the app.
