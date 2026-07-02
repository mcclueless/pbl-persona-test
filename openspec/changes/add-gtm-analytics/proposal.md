## Why

The PBL Persona Test is going live at `https://tools.maastrichtuniversity.nl/pbl/`, but we currently have no visibility into how it is used. We want to understand how visitors move through the quiz — which answers they pick, which persona they land on, and how many go on to click the "Explore PBL at UM" call-to-action — so we can judge the tool's reach and improve it. Maastricht University standardises on Google Tag Manager (container `GTM-5LTFPDLV`) for this, which lets analytics be configured without further code changes.

## What Changes

- Add the Google Tag Manager container snippet to the site (the `<head>` script and the `<body>` `<noscript>` fallback), loading `GTM-5LTFPDLV`.
- Add a small `track()` helper that pushes semantic events onto `window.dataLayer`, guarded so the app keeps working if GTM is blocked or fails to load.
- Instrument the user journey with eight namespaced (`pbl_`) events:
  - `pbl_start` — the test is started
  - `pbl_answer` — fired once per question **at completion**, reporting each question's final answer (question number, pillar, chosen persona, option letter)
  - `pbl_result` — the computed result (top persona, per-persona scores and percentages)
  - `pbl_persona_open` — a persona's detail is expanded on the results screen
  - `pbl_language_switch` — the EN/NL language is toggled
  - `pbl_restart` — "Retake the test" is clicked
  - `pbl_cta_click` — the "Explore PBL at UM" CTA is clicked
- All event field values are language-agnostic (English persona/pillar keys, never translated answer text) so EN and NL aggregate together.

Non-goals: this change does **not** configure GTM tags/triggers/GA4 (done in the GTM web console, outside this repo), and does **not** add a consent banner (consent is handled at the hosting-platform level — confirmed 2026-07-02).

## Capabilities

### New Capabilities

- `analytics-tracking`: Client-side usage analytics for the PBL Persona Test — loading Google Tag Manager and emitting a defined set of `dataLayer` events across the quiz journey.

### Modified Capabilities

<!-- None. The app has no existing OpenSpec specs; this is the first capability. -->

## Impact

- **Code**: `index.html` (GTM snippets), `app.js` (`track()` helper plus instrumentation in `startQuiz`, `choose` completion branch, `setLang`, `personaStone`, the restart handler, and the CTA click). No CSS changes; no HTML structure changes beyond the two GTM snippets.
- **Dependencies**: New third-party dependency on Google Tag Manager / `googletagmanager.com` loaded at runtime.
- **Privacy/compliance**: Loads an analytics tag on an EU (University) property. Consent is handled at the `tools.maastrichtuniversity.nl` platform level (confirmed 2026-07-02), so no in-app consent gate is required.
- **Downstream**: Requires follow-up configuration in the GTM console (event → trigger → tag → GA4) to turn the emitted events into reports.
