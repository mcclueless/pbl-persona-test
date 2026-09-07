## ADDED Requirements

### Requirement: Google Tag Manager container is loaded

The site SHALL load the Google Tag Manager container `GTM-5LTFPDLV` on every page, using the standard GTM `<head>` script and the `<body>` `<noscript>` iframe fallback. Loading SHALL NOT block rendering, and failure to load SHALL NOT break the application.

#### Scenario: GTM loads on page open

- **WHEN** the page is opened in a browser with JavaScript enabled
- **THEN** the GTM container `GTM-5LTFPDLV` is requested from `googletagmanager.com`
- **AND** `window.dataLayer` exists and is an array

#### Scenario: GTM blocked or unavailable

- **WHEN** the GTM script is blocked (e.g. by an ad/tracker blocker) or fails to load
- **THEN** the quiz still starts, runs, and shows results normally
- **AND** no uncaught error is thrown by the tracking code

### Requirement: Analytics events use a safe, namespaced dataLayer helper

The application SHALL push analytics events through a single helper that writes to `window.dataLayer`. Every event name SHALL be prefixed with `pbl_` to namespace it within the shared GTM container. The helper SHALL be wrapped so that a failure to push never interrupts the user flow. Event field values that describe personas or pillars SHALL be language-agnostic (English keys), never the translated answer text.

#### Scenario: Event is pushed to dataLayer

- **WHEN** any tracked interaction occurs
- **THEN** a single object is pushed onto `window.dataLayer`
- **AND** its `event` property starts with `pbl_`

#### Scenario: Push failure is contained

- **WHEN** pushing to `window.dataLayer` throws for any reason
- **THEN** the error is caught and the user-facing interaction completes normally

### Requirement: Test start is tracked

The application SHALL emit a `pbl_start` event when the user starts the test.

#### Scenario: User starts the test

- **WHEN** the user clicks "Start the test"
- **THEN** a `pbl_start` event is pushed with the current `language`

### Requirement: Final answers are tracked once per question

The application SHALL emit one `pbl_answer` event per question, reporting the user's final answer, at the moment the test completes. It SHALL NOT emit `pbl_answer` for intermediate selections that are later changed via Back. Each event SHALL include the question number, the question pillar (English), the chosen persona key, and the option letter (A/B/C).

#### Scenario: Test completed with five answers

- **WHEN** the user answers the final question and the result is computed
- **THEN** exactly five `pbl_answer` events are pushed, one per question
- **AND** each carries `question_number`, `question_pillar`, `chosen_persona`, `option_letter`, and `language`

#### Scenario: Answer changed via Back

- **WHEN** the user goes back and changes an earlier answer before completing
- **THEN** only the final answer for that question is reported in its `pbl_answer` event
- **AND** no `pbl_answer` event reflects the superseded selection

#### Scenario: Quiz abandoned before completion

- **WHEN** the user leaves before answering the final question
- **THEN** no `pbl_answer` events are emitted for that session

### Requirement: Result is tracked

The application SHALL emit a `pbl_result` event when the result is computed, carrying the top persona plus the per-persona scores and percentages.

#### Scenario: Result computed

- **WHEN** the test completes and the result is computed
- **THEN** a `pbl_result` event is pushed with `top_persona`, per-persona `score_*`, per-persona `pct_*`, and `language`

### Requirement: Persona detail opens are tracked

The application SHALL emit a `pbl_persona_open` event when a user expands a persona's detail on the results screen. It SHALL NOT emit the event when the same persona is clicked again to collapse its detail.

#### Scenario: User opens a persona detail

- **WHEN** the user clicks a persona stone that is not currently open
- **THEN** a `pbl_persona_open` event is pushed with the opened `persona` and `language`

#### Scenario: User collapses an open persona

- **WHEN** the user clicks the persona whose detail is already open
- **THEN** no `pbl_persona_open` event is emitted

### Requirement: Language switches are tracked

The application SHALL emit a `pbl_language_switch` event when the user toggles between EN and NL. The initial default language on load SHALL NOT emit this event.

#### Scenario: User toggles language

- **WHEN** the user clicks the EN or NL language toggle
- **THEN** a `pbl_language_switch` event is pushed with the newly selected `language`

### Requirement: Restart is tracked

The application SHALL emit a `pbl_restart` event when the user chooses to retake the test.

#### Scenario: User retakes the test

- **WHEN** the user clicks "Retake the test" on the results screen
- **THEN** a `pbl_restart` event is pushed

### Requirement: CTA clicks are tracked

The application SHALL emit a `pbl_cta_click` event when the user clicks the "Explore PBL at UM" call-to-action, before navigation, carrying the result context.

#### Scenario: User clicks the CTA

- **WHEN** the user clicks the "Explore PBL at UM" link on the results screen
- **THEN** a `pbl_cta_click` event is pushed with `top_persona` and `language`
- **AND** the link still opens the UM PBL page in a new tab
