> **Revision 2026-09-11** — the feedback link is being escalated from a quiet text link to a
> cobalt button in its own block (see *Cobalt button in its own block* in `design.md`). Tasks
> 2.1-2.2, 3.1-3.2, 8.1-8.2 are reopened; the `data.js`, `app.js`, and Qualtrics/GTM work is
> unaffected, because the element `id`, the URL, the parameters, and the event are unchanged.

## 1. Copy and URLs (`data.js`)

- [x] 1.1 Add `surveyUrl` to `I18N.en` — `https://maastrichtuniversity.eu.qualtrics.com/jfe/form/SV_0r2st1QZQMgRxSS` — placed next to `ctaUrl`, storing the bare form URL with no query string
- [x] 1.2 Add `surveyUrl` to `I18N.nl` — `https://maastrichtuniversity.eu.qualtrics.com/jfe/form/SV_em1huq9t56bJHrE`
- [x] 1.3 Add the link label `surveyLink` to both languages in sentence case: EN `Help us improve this test`, NL `Help ons deze test te verbeteren`

## 2. Markup (`index.html`)

- [x] 2.1 Move the `<a id="survey-link">` out of the `.cta` block into a new sibling block placed immediately after it and before `.result-foot`; keep the `id`, `target="_blank" rel="noopener noreferrer"`, and the empty `<span id="survey-link-label">` exactly as they are, so `app.js` needs no change
- [x] 2.2 Replace `class="btn-quiet"` with the cobalt button treatment, and restore the external-link icon to the same 20px size as `#cta-btn` now that it is a button rather than a text link

## 3. Styling (`styles.css`)

- [x] 3.1 Give the survey button the cobalt treatment — `#355BD0` background, white text, `20px` radius — by reusing the existing `.btn-download` rule rather than duplicating it, and add a rule for the new block matching the spacing of the `.cta` block above it
- [x] 3.2 Confirm each block contains exactly one filled button, that the recruitment CTA block comes first, and that the survey block sits between the CTA block and "Retake the test"
  - Verified in markup and CSS 2026-09-11: `.cta` and `.survey-cta` are siblings in that order, one filled button each. `.survey-cta` carries `padding: 0 24px` plus a transparent 1.5px border so its box matches `.cta` exactly under the global `border-box` — without both, the survey button renders 48px (no padding) or 3px (no border) wider than the CTA above it. Visual confirmation still pending in 8.1.
- [x] 3.3 Remove the now-unused `.btn-quiet` rule from `styles.css` once nothing references it — `.btn-restart` is a separate rule and stays

## 4. Behaviour and analytics (`app.js`)

- [x] 4.1 In `renderResult()`, set `$('#survey-link-label').textContent = T.surveyLink`
- [x] 4.2 In `renderResult()`, build the href from live state — `T.surveyUrl + '?persona=' + state.topPersona + '&lang=' + state.lang + '&source=pbltool'` — and assign it to `$('#survey-link').href`; do not store the assembled URL in `data.js`
- [x] 4.3 In `init()`, add a `click` listener on `#survey-link` that calls `track('pbl_survey_click', { top_persona: state.topPersona, language: state.lang })`

## 5. Browser verification (code)

- [x] 5.1 Complete an EN pass and confirm the link resolves to `SV_0r2st1QZQMgRxSS` with `persona`, `lang=en`, and `source=pbltool` matching the persona shown on screen
- [x] 5.2 Switch the finished result screen to NL and confirm both the survey ID and the `lang` parameter change, and that the label switches to Dutch
- [x] 5.3 Retake the test, land on a different top persona, and confirm the `persona` parameter updates rather than carrying over from the previous attempt
- [x] 5.4 Confirm the link opens in a new tab and the result screen is still intact in the original tab
- [x] 5.5 Confirm `pbl_survey_click` appears in `window.dataLayer` with the expected payload, and that the survey still opens with GTM blocked
- [ ] 5.6 Re-run one EN pass after the restyle confirming the href, the label, the new tab, and `pbl_survey_click` all still work from the anchor's new location. `app.js` is untouched, so this is a smoke check that the `id` survived the move rather than a re-test of 5.1-5.5

## 6. Qualtrics console (NOT code — external system)

> Step-by-step runbook: [`qualtrics-setup.md`](qualtrics-setup.md)

- [x] 6.1 Verify the survey mapping before anything else: open both URLs and confirm `SV_0r2st1QZQMgRxSS` is the English survey and `SV_em1huq9t56bJHrE` is the Dutch one; a swap fails silently and sends students to the wrong-language survey
  - Confirmed by the owner 2026-09-07: the mapping was **swapped** in the original hand-off. Corrected in `data.js`, `proposal.md`, and the spec; re-verified in-browser.
- [ ] 6.2 In the **English** survey → Survey Flow, add an Embedded Data element at the very top with fields `persona`, `lang`, and `source`, each left as "Value will be set from Panel or URL"; save and publish
- [ ] 6.3 Repeat 6.2 in the **Dutch** survey — Qualtrics discards the parameters entirely if this is missing, with no visible error
- [ ] 6.4 Submit one test response through a parameterised link in each survey and confirm all three fields appear in the recorded response

## 7. GTM console (NOT code — external system)

> Step-by-step runbook: [`gtm-setup-survey-event.md`](gtm-setup-survey-event.md)
> Reading the data afterwards: [`ga4-reports.md`](ga4-reports.md)

- [x] 7.1 Append `pbl_survey_click` to the event contract table in `openspec/changes/archive/2026-09-07-add-gtm-analytics/gtm-setup.md`, with params `top_persona` and `language`
- [x] 7.2 In container `GTM-5LTFPDLV`, add the Custom Event trigger for `pbl_survey_click`, plus the `top_persona` and `language` Data Layer Variables if they do not exist yet (Phase 3 of the main runbook is still unticked, so they may not) — reuse rather than duplicate them
- [x] 7.3 Add the GA4 Event tag for `pbl_survey_click` on that trigger, alongside the other `pbl_*` tags
- [x] 7.4 Preview, confirm the event fires with both parameters, then publish and check it in GA4 Realtime
  - Published in container v9 and verified against the live container 2026-09-07: trigger, event name, `top_persona` and `language` all correct.
  - Preview passed 2026-09-07: `GA4 - pbl_survey_click` fired with both `top_persona` and `language` populated. Publish + custom dimensions + Realtime still outstanding.

## 8. Wrap-up

- [ ] 8.1 Confirm the result screen still reads correctly on a narrow viewport with two stacked cobalt buttons in separate blocks plus the restart control, and that the Dutch label `Help ons deze test te verbeteren` does not wrap awkwardly inside the button
- [ ] 8.2 Commit and push to `main`
  - Committed 2026-09-11; not yet pushed.
- [ ] 8.3 Before publishing, record the current `pbl_survey_click` ÷ `pbl_result` ratio in GA4 as a baseline, so the button's effect is measurable afterwards. If `pbl_survey_click` is already healthy relative to `pbl_cta_click`, the problem is motivation rather than visibility and this change will not move it — see the open question in `design.md`
