## 1. Load Google Tag Manager

- [x] 1.1 Add the GTM `<script>` snippet (container `GTM-5LTFPDLV`) as high as possible in the `<head>` of `index.html`
- [x] 1.2 Add the GTM `<noscript>` iframe fallback immediately after the opening `<body>` tag in `index.html`

## 2. Tracking helper

- [x] 2.1 Add a `track(event, props)` helper in `app.js` that pushes `{ event, ...props }` onto `window.dataLayer` inside a try/catch, initialising `window.dataLayer` if absent

## 3. Instrument the journey

- [x] 3.1 `startQuiz()` → emit `pbl_start` with `language`
- [x] 3.2 In `choose()`'s completion branch, after `computeResult()`, loop `state.answers` and emit one `pbl_answer` per question (`question_number`, `question_pillar` from `QUESTIONS[i].pillar.en`, `chosen_persona`, `option_letter` derived from the option index, `language`)
- [x] 3.3 In the same completion branch, emit `pbl_result` with `top_persona`, per-persona `score_*`, per-persona `pct_*`, and `language`
- [x] 3.4 `personaStone()` click handler → emit `pbl_persona_open` (`persona`, `language`) only when opening (`willOpen === true`)
- [x] 3.5 `setLang(lang)` → emit `pbl_language_switch` with the newly selected `language`
- [x] 3.6 Restart button handler → emit `pbl_restart`
- [x] 3.7 Add a `click` listener on `#cta-btn` → emit `pbl_cta_click` (`top_persona`, `language`); confirm the link still opens in a new tab

## 4. Verify

- [ ] 4.1 In-browser, run a full EN pass and confirm `pbl_start`, five `pbl_answer`, and `pbl_result` fire with correct payloads (via GTM Preview or `window.dataLayer`)
- [ ] 4.2 Confirm `pbl_persona_open` fires only on open (not collapse), `pbl_language_switch` fires on toggle (not initial load), `pbl_restart` on retake, and `pbl_cta_click` on the CTA
- [ ] 4.3 Confirm going Back and changing an answer results in only the final answer being reported at completion
- [ ] 4.4 Confirm the app still works with GTM blocked (no uncaught errors)

## 5. Hand-off (outside this repo)

- [ ] 5.1 Provide the event/payload contract to the GTM container owner for trigger/tag → GA4 configuration
- [x] 5.2 Confirm consent/GDPR handling for `tools.maastrichtuniversity.nl` before public launch — confirmed 2026-07-02: handled at the platform level, no in-app gate needed
