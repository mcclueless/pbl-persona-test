## MODIFIED Requirements

### Requirement: Typography uses GT Standard with a defined fallback

Base and body text SHALL use GT Standard Regular; headings and subheadings SHALL use GT Standard Bold. The licensed GT Standard webfont SHALL be self-hosted from the repository and served same-origin; no third-party font service SHALL be used. The font family SHALL be applied through CSS variables so no component rule names a font family literally.

Two optical sizes SHALL be used, selected by rendered size rather than by role: **GT Standard L** for text rendering at 22px or larger, and **GT Standard S** for text rendering below 22px.

Because the licensed package supplies only Regular (400) and Bold (700), every `font-weight` declaration in the stylesheet SHALL resolve to 400 or 700, so that no text renders as a browser-synthesised weight.

#### Scenario: Fonts are self-hosted and variable-driven

- **WHEN** any text is rendered
- **THEN** its `font-family` resolves through the shared `--font-display` / `--font-body` variables
- **AND** the resolved face is served from the application's own origin
- **AND** no request is made to a third-party font service

#### Scenario: Optical size follows rendered size

- **WHEN** text renders at 22px or larger
- **THEN** it uses GT Standard L
- **WHEN** text renders below 22px
- **THEN** it uses GT Standard S

#### Scenario: Only real weights are requested

- **WHEN** the stylesheet is inspected for `font-weight` declarations
- **THEN** every declaration is either `400` or `700`

### Requirement: Top-scoring persona is emphasised

The persona card representing the user's top-scoring persona SHALL be visually distinguished from the other two by **colour**: a steel blue `#000831` background with white text, against the cobalt `#355BD0` of the other two cards. It SHALL NOT be distinguished by a border, ring, or frame.

Its "best match" badge SHALL remain legible against the steel background, and its open state SHALL remain distinguishable from its closed state.

#### Scenario: The top persona card stands out by colour

- **WHEN** the result screen renders the three persona cards
- **THEN** the top-scoring card has a steel blue `#000831` background with white text
- **AND** the other two cards have a cobalt blue `#355BD0` background
- **AND** no card is surrounded by a ring or frame in its resting state

#### Scenario: The best-match badge stays visible on the steel card

- **WHEN** the top-scoring card displays its "Best match" badge
- **THEN** the badge has a white background with steel blue text

#### Scenario: The open state is visible on every card

- **WHEN** the user opens a persona card
- **THEN** that card shows an open-state indicator that contrasts with its own background
- **AND** this holds for both the steel top card and the cobalt cards

## ADDED Requirements

### Requirement: The logo matches the selected language

The topbar logo SHALL use the English UM wordmark when the interface language is English and the Dutch wordmark (`Universiteit Maastricht`) when the interface language is Dutch. The logo SHALL change at the same moment as the rest of the interface copy when the language is switched, on every screen.

#### Scenario: Switching to Dutch swaps the logo

- **WHEN** the user switches the interface language to Dutch
- **THEN** the topbar logo on the start, quiz, and result screens is the Dutch UM wordmark

#### Scenario: Switching to English swaps the logo back

- **WHEN** the user switches the interface language to English
- **THEN** the topbar logo on the start, quiz, and result screens is the English UM wordmark

### Requirement: Logo is rendered at 44px height

The topbar logo SHALL render at 44px tall with its aspect ratio preserved, in both languages and on every screen.

#### Scenario: The logo renders at the specified height

- **WHEN** any screen renders its topbar
- **THEN** the logo image is 44px tall
- **AND** its width scales proportionally
- **AND** it does not overlap or displace the language toggle at a 360px viewport width

### Requirement: The application canvas is distinct from the page behind it

The application canvas SHALL be white `#FFFFFF` on every screen. The page behind the canvas SHALL be steel blue `#000831`, so that on viewports wide enough to show it the canvas reads as a distinct surface rather than blending into the page.

Soft blue `#BEDDF7` SHALL be used for component frames and fills — chips, answer options, the growth card, the key message, and the call-to-action block — not as a page or canvas background.

#### Scenario: The canvas and the page behind it differ

- **WHEN** the application is viewed on a screen wide enough to show the page behind the canvas
- **THEN** the canvas is white `#FFFFFF`
- **AND** the page behind it is steel blue `#000831`

#### Scenario: The canvas is white on every screen

- **WHEN** the user views the start, quiz, or result screen
- **THEN** that screen's background is white `#FFFFFF`

### Requirement: The background carries no decorative artwork

No decorative shapes, blobs, gradients, or texture SHALL be rendered behind the content on any screen.

#### Scenario: No decorative shapes behind any screen

- **WHEN** the user views the start, quiz, or result screen
- **THEN** no decorative background shape is rendered

### Requirement: Questions display no pillar label

The quiz SHALL NOT display the pillar (theme) of a question to the user. The pillar SHALL remain available as data for analytics reporting.

#### Scenario: No pillar label above a question

- **WHEN** the user views any of the five questions
- **THEN** no pillar label or pill is displayed

#### Scenario: The pillar is still reported to analytics

- **WHEN** the user answers a question
- **THEN** the emitted `pbl_answer` event still carries the `question_pillar` parameter

### Requirement: Interface labels use sentence case

Result-screen labels SHALL be rendered in sentence case as authored, not transformed to upper case. This applies to the result kicker ("Your result"), the best-match badge ("Best match"), and the persona growth heading ("How PBL helps you grow").

#### Scenario: Result labels are not upper-cased

- **WHEN** the result screen renders the kicker, the best-match badge, or the growth heading
- **THEN** each is displayed in the sentence case in which it is authored
- **AND** no `text-transform: uppercase` is applied to it

### Requirement: Interface copy does not refer to persona cards as "stones"

User-facing copy SHALL NOT describe the persona cards as "stones" (or, in Dutch, "stenen"). The internal CSS class names are unaffected.

#### Scenario: The result-screen hint names what the user actually taps

- **WHEN** the result screen renders the hint below the persona cards
- **THEN** the hint refers to a persona, not a stone
