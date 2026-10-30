# Spec Delta

## MODIFIED Requirements

### Requirement: Interface copy does not refer to persona cards as "stones"

User-facing copy SHALL NOT describe the persona cards as "stones" (or, in Dutch, "stenen"). The internal CSS class names are unaffected.

#### Scenario: The result-screen hint names what the user actually taps

- **WHEN** the result screen renders its instruction to tap a persona (the heading above the persona cards)
- **THEN** the heading refers to a persona, not a stone

## ADDED Requirements

### Requirement: Result heading invites the user to open a persona

The result-screen heading SHALL instruct the user to tap a persona to learn more, rendered as a single uniform line of copy: "Tap a persona to learn more" in English and "Tik op een persona voor meer informatie" in Dutch. No separate instructional hint SHALL appear below the persona cards.

#### Scenario: English heading

- **WHEN** the result screen renders in English
- **THEN** the heading reads "Tap a persona to learn more"
- **AND** no part of the heading is styled differently from the rest

#### Scenario: Dutch heading

- **WHEN** the result screen renders in Dutch
- **THEN** the heading reads "Tik op een persona voor meer informatie"

#### Scenario: No hint below the cards

- **WHEN** the result screen renders in either language
- **THEN** no hint text appears between the persona cards and the detail panel
