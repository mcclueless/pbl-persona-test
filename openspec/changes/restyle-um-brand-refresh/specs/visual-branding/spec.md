## ADDED Requirements

### Requirement: Single soft-blue light theme across all screens

The application SHALL present a single light theme on every screen (start, quiz, result). The page background SHALL be soft blue `#BEDDF7`. There SHALL be no dark-background screens.

#### Scenario: Every screen uses the soft-blue canvas

- **WHEN** the user views the start, quiz, or result screen
- **THEN** the screen background is soft blue `#BEDDF7`
- **AND** no screen renders a dark (midnight) background

### Requirement: Text colour follows the brand palette

Body text and headings SHALL be steel blue `#000831`. Subheadings SHALL be cobalt blue `#355BD0`. Text placed on a cobalt surface (buttons, CTAs, persona cards) SHALL be white `#FFFFFF`.

#### Scenario: Body and heading text is steel blue

- **WHEN** body text or a heading is rendered on the soft-blue canvas
- **THEN** its colour is steel blue `#000831`

#### Scenario: Subheadings are cobalt

- **WHEN** a subheading (e.g. a section label such as the growth heading or a chip/kicker acting as a subheading) is rendered
- **THEN** its colour is cobalt blue `#355BD0`

#### Scenario: Text on cobalt surfaces is white

- **WHEN** text sits on a cobalt background (a button, CTA, or persona card)
- **THEN** that text is white `#FFFFFF`

### Requirement: Typography uses GT Standard with a defined fallback

Base and body text SHALL use GT Standard Regular; headings and subheadings SHALL use GT Standard Bold. The font family SHALL be applied through CSS variables so the licensed GT Standard files can replace the fallback without changing component styles. Until the licensed files are installed, a close neutral-grotesque fallback (Inter) SHALL be used.

#### Scenario: Fonts are variable-driven

- **WHEN** any text is rendered
- **THEN** its `font-family` resolves through the shared `--font-body` / `--font-display` variables
- **AND** headings and subheadings render at bold weight (700)

#### Scenario: Fallback in effect until GT Standard is installed

- **WHEN** the licensed GT Standard webfont files are not present in the repo
- **THEN** the app renders with the Inter fallback and system-ui as the ultimate fallback
- **AND** installing GT Standard later requires only an `@font-face` addition and updating the two font variables

### Requirement: Buttons and calls-to-action use cobalt with rounded corners

All buttons and calls-to-action SHALL have a cobalt blue `#355BD0` background, white text, and a `20px` corner radius.

#### Scenario: A primary button or CTA is rendered

- **WHEN** a button or call-to-action (start button, CTA link, detail switch, modal submit) is displayed
- **THEN** its background is cobalt blue `#355BD0`
- **AND** its text is white
- **AND** its corners are rounded to `20px`

### Requirement: Light-blue frames use soft blue with steel text

Framed UI elements that were previously light-blue (chips, pills, callout cards, the quiz answer rest state, the growth card, the key-message block) SHALL use a soft blue `#BEDDF7` fill with steel blue `#000831` text.

#### Scenario: A framed element is rendered

- **WHEN** a light framed element (chip, pill, growth card, key-message, or quiz answer in its unselected state) is displayed
- **THEN** its fill is soft blue `#BEDDF7`
- **AND** its text is steel blue `#000831`

### Requirement: Persona cards display in a single cobalt colour

The persona result cards SHALL all use the same cobalt blue `#355BD0` background with white text and `20px` corners. No persona SHALL be distinguished from another by hue. The top-scoring persona MAY be emphasised only by a non-hue cue (such as a steel-blue ring or ordering).

#### Scenario: All persona cards share one colour

- **WHEN** the result screen displays the three persona cards
- **THEN** every card has a cobalt blue `#355BD0` background with white text and `20px` corners
- **AND** no card is given a different fill colour to distinguish it

#### Scenario: Top persona emphasis is not colour-based

- **WHEN** the top-scoring persona is emphasised
- **THEN** the emphasis uses a non-hue cue (e.g. a steel-blue ring or first position), not a different card colour

### Requirement: UM primary logo is the steel-blue vector on every screen

The application SHALL display the Maastricht University primary wordmark from the vector `assets/um-logo-blue.svg` (steel blue `#000831`) in the top-left of every screen. It SHALL NOT use a white logo variant or a rasterised logo.

#### Scenario: Logo shown on each screen

- **WHEN** the start, quiz, or result screen is displayed
- **THEN** the top-left logo is the steel-blue vector `um-logo-blue.svg`
- **AND** no white or rasterised (BMP/PNG) logo variant is used
