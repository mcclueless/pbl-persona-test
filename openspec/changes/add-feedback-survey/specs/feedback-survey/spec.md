## ADDED Requirements

### Requirement: The result screen offers a route to the feedback survey

The result screen SHALL present a link to an external feedback survey, placed within the existing call-to-action block, below the "Explore PBL at UM" button. The link SHALL open in a new browsing context so the result screen remains available behind it.

The link SHALL be rendered as a tertiary text link — the same quiet treatment as the existing "Retake the test" control — and SHALL NOT be rendered as a filled cobalt button, so that it does not compete with the primary call-to-action.

#### Scenario: A student reaches the result screen

- **WHEN** the result screen is displayed
- **THEN** a feedback survey link is visible inside the call-to-action block, below the "Explore PBL at UM" button

#### Scenario: The feedback link is visually subordinate

- **WHEN** the feedback survey link is displayed alongside the "Explore PBL at UM" call-to-action
- **THEN** the feedback link has no filled background and no border
- **AND** the "Explore PBL at UM" call-to-action remains the only filled cobalt button in the block

#### Scenario: The student follows the feedback link

- **WHEN** the student clicks the feedback survey link
- **THEN** the survey opens in a new tab
- **AND** the result screen remains intact in the original tab

#### Scenario: The link is not offered before the test is finished

- **WHEN** the start screen or a question is displayed
- **THEN** no feedback survey link is shown

### Requirement: Each language links to its own survey

The application SHALL hold one survey base URL per interface language and SHALL link to the survey matching the currently selected language.

- English: `https://maastrichtuniversity.eu.qualtrics.com/jfe/form/SV_0r2st1QZQMgRxSS`
- Dutch: `https://maastrichtuniversity.eu.qualtrics.com/jfe/form/SV_em1huq9t56bJHrE`

#### Scenario: The interface is in English

- **WHEN** the result screen is rendered with English selected
- **THEN** the feedback link points at the English survey `SV_0r2st1QZQMgRxSS`

#### Scenario: The interface is in Dutch

- **WHEN** the result screen is rendered with Dutch selected
- **THEN** the feedback link points at the Dutch survey `SV_em1huq9t56bJHrE`

### Requirement: The feedback link is labelled in the selected language

The feedback link SHALL carry a label in the currently selected interface language, authored in sentence case, and the label SHALL change with the language toggle.

#### Scenario: Label follows the language

- **WHEN** the student switches the interface between English and Dutch on the result screen
- **THEN** the feedback link label is displayed in the newly selected language
- **AND** it is displayed in the sentence case in which it is authored

### Requirement: The student's result travels with the link

The feedback link SHALL append the result context to the survey base URL as query parameters, so responses can be analysed by the persona the student received:

- `persona` — the key of the student's top-scoring persona (`collaborator`, `analyst`, or `challenger`)
- `lang` — the interface language at the moment of the click (`en` or `nl`)
- `source` — the fixed value `pbltool`, identifying this tool as the referrer

Parameter values SHALL be language-agnostic keys, never translated display text, so English and Dutch responses aggregate together.

#### Scenario: An Analyst opens the English survey

- **WHEN** the result screen shows Analyst as the top persona with English selected
- **THEN** the feedback link resolves to the English survey with `persona=analyst`, `lang=en`, and `source=pbltool`

#### Scenario: Persona keys are not translated

- **WHEN** the feedback link is built with Dutch selected
- **THEN** the `persona` value is the English persona key
- **AND** it is not the translated persona name shown on screen

### Requirement: The link target follows the live result state

The feedback link's target SHALL be rebuilt whenever the result screen renders, so it always reflects the current top persona and the current interface language rather than the values present when the screen was first shown.

#### Scenario: The student switches language after finishing

- **WHEN** the student completes the test in English and then switches the result screen to Dutch
- **THEN** the feedback link points at the Dutch survey
- **AND** its `lang` parameter is `nl`

#### Scenario: The student retakes the test and lands on a different persona

- **WHEN** the student retakes the test and reaches a result with a different top persona
- **THEN** the feedback link's `persona` parameter reflects the new top persona
- **AND** it does not carry the persona from the previous attempt
