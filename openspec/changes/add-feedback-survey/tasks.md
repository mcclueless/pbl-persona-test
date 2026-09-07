## 1. Copy and URLs (`data.js`)

- [x] 1.1 Add `surveyUrl` to `I18N.en` — `https://maastrichtuniversity.eu.qualtrics.com/jfe/form/SV_em1huq9t56bJHrE` — placed next to `ctaUrl`, storing the bare form URL with no query string
- [x] 1.2 Add `surveyUrl` to `I18N.nl` — `https://maastrichtuniversity.eu.qualtrics.com/jfe/form/SV_0r2st1QZQMgRxSS`
- [x] 1.3 Add the link label `surveyLink` to both languages in sentence case: EN `Help us improve this test`, NL `Help ons deze test te verbeteren`

## 2. Markup (`index.html`)

- [x] 2.1 Add an `<a id="survey-link" class="btn-quiet">` inside the `.cta` block, immediately after the `#cta-btn` anchor, with `target="_blank" rel="noopener noreferrer"` and an empty `<span id="survey-link-label">` for the label
- [x] 2.2 Give the link the same trailing external-link arrow icon treatment as `#cta-btn`, sized down to match a text link

## 3. Styling (`styles.css`)

- [x] 3.1 Add a `.btn-quiet` rule reusing the existing `.btn-restart` treatment — dove text, no background, no border, inline-flex with a small gap — and a hover that darkens to steel
- [x] 3.2 Confirm the link sits below the cobalt button with enough spacing to read as subordinate, and that `#cta-btn` remains the only filled cobalt button *within the CTA block* (the non-top persona cards are cobalt-filled too, which is pre-existing and outside this change)

## 4. Behaviour and analytics (`app.js`)

- [x] 4.1 In `renderResult()`, set `$('#survey-link-label').textContent = T.surveyLink`
- [x] 4.2 In `renderResult()`, build the href from live state — `T.surveyUrl + '?persona=' + state.topPersona + '&lang=' + state.lang + '&source=pbltool'` — and assign it to `$('#survey-link').href`; do not store the assembled URL in `data.js`
- [x] 4.3 In `init()`, add a `click` listener on `#survey-link` that calls `track('pbl_survey_click', { top_persona: state.topPersona, language: state.lang })`

## 5. Browser verification (code)

- [x] 5.1 Complete an EN pass and confirm the link resolves to `SV_em1huq9t56bJHrE` with `persona`, `lang=en`, and `source=pbltool` matching the persona shown on screen
- [x] 5.2 Switch the finished result screen to NL and confirm both the survey ID and the `lang` parameter change, and that the label switches to Dutch
- [x] 5.3 Retake the test, land on a different top persona, and confirm the `persona` parameter updates rather than carrying over from the previous attempt
- [x] 5.4 Confirm the link opens in a new tab and the result screen is still intact in the original tab
- [x] 5.5 Confirm `pbl_survey_click` appears in `window.dataLayer` with the expected payload, and that the survey still opens with GTM blocked

## 6. Qualtrics console (NOT code — external system)

- [ ] 6.1 Verify the survey mapping before anything else: open both URLs and confirm `SV_em1huq9t56bJHrE` is the English survey and `SV_0r2st1QZQMgRxSS` is the Dutch one; a swap fails silently and sends students to the wrong-language survey
- [ ] 6.2 In the **English** survey → Survey Flow, add an Embedded Data element at the very top with fields `persona`, `lang`, and `source`, each left as "Value will be set from Panel or URL"; save and publish
- [ ] 6.3 Repeat 6.2 in the **Dutch** survey — Qualtrics discards the parameters entirely if this is missing, with no visible error
- [ ] 6.4 Submit one test response through a parameterised link in each survey and confirm all three fields appear in the recorded response

## 7. GTM console (NOT code — external system)

- [x] 7.1 Append `pbl_survey_click` to the event contract table in `openspec/changes/add-gtm-analytics/gtm-setup.md`, with params `top_persona` and `language`
- [ ] 7.2 In container `GTM-5LTFPDLV`, add the Custom Event trigger for `pbl_survey_click` (the `top_persona` and `language` Data Layer Variables already exist for `pbl_cta_click` — reuse them rather than creating duplicates)
- [ ] 7.3 Add the GA4 Event tag for `pbl_survey_click` on that trigger, alongside the other `pbl_*` tags
- [ ] 7.4 Preview, confirm the event fires with both parameters, then publish and check it in GA4 Realtime

## 8. Wrap-up

- [x] 8.1 Confirm the result screen still reads correctly on a narrow viewport with three interactive elements stacked in and below the CTA block
- [x] 8.2 Commit and push to `main`
