# feedback-survey Specification

## Purpose

The end-of-test route into the external Qualtrics feedback surveys — where the link appears on the result screen and how it is presented, which survey each interface language gets, and what result context travels with the student so responses can be read per persona.

Synced from `add-feedback-survey`. The link ships as a cobalt button in its own block, below the recruitment call-to-action; it began as a quiet text link and was escalated on 2026-09-11 after going unseen. The surveys themselves are external artefacts this capability links to but does not author — at the time of syncing, the Qualtrics Embedded Data elements that let each survey retain `persona`, `lang`, and `source` were still outstanding.

## Requirements

### Requirement: The result screen offers a route to the feedback survey

The result screen SHALL present a link to an external feedback survey in a block of its own, placed below the "Explore PBL at UM" call-to-action block and above the "Retake the test" control. The link SHALL open in a new browsing context so the result screen remains available behind it.

The link SHALL be rendered as a filled cobalt button, carrying the standard button treatment defined by the `visual-branding` capability: a cobalt blue `#355BD0` background, white text, and `20px` corners.

The survey button SHALL NOT share a block with the recruitment call-to-action. Each block SHALL contain exactly one filled button, so that the recruitment call-to-action and the feedback request read as two distinct asks rather than two competing buttons inside one frame. The recruitment call-to-action SHALL appear first, retaining its primacy through order rather than through a difference in visual weight.

#### Scenario: A student reaches the result screen

- **WHEN** the result screen is displayed
- **THEN** a feedback survey button is visible in its own block
- **AND** that block sits below the "Explore PBL at UM" call-to-action block and above the "Retake the test" control

#### Scenario: The feedback button is a cobalt button

- **WHEN** the feedback survey button is displayed
- **THEN** its background is cobalt blue `#355BD0`
- **AND** its text is white `#FFFFFF`
- **AND** its corner radius is `20px`

#### Scenario: The two asks do not share a frame

- **WHEN** the result screen is displayed
- **THEN** the feedback survey button sits outside the recruitment call-to-action block
- **AND** the recruitment call-to-action block contains exactly one filled button
- **AND** the feedback survey block contains exactly one filled button

#### Scenario: The student follows the feedback link

- **WHEN** the student clicks the feedback survey button
- **THEN** the survey opens in a new tab
- **AND** the result screen remains intact in the original tab

#### Scenario: The link is not offered before the test is finished

- **WHEN** the start screen or a question is displayed
- **THEN** no feedback survey button is shown

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
