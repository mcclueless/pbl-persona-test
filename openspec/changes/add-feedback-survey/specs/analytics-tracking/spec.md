## ADDED Requirements

### Requirement: Feedback survey clicks are tracked

The application SHALL emit a `pbl_survey_click` event when the user clicks the feedback survey link on the result screen, before navigation, carrying the result context. The payload SHALL match the shape already used for `pbl_cta_click`, so outbound clicks from the result screen are comparable.

#### Scenario: User clicks the feedback survey link

- **WHEN** the user clicks the feedback survey link on the result screen
- **THEN** a `pbl_survey_click` event is pushed with `top_persona` and `language`
- **AND** the link still opens the Qualtrics survey in a new tab

#### Scenario: Tracking never blocks the survey

- **WHEN** the tracking push fails for any reason, including GTM being blocked
- **THEN** no uncaught error is thrown
- **AND** the survey still opens

#### Scenario: Response rate can be derived per persona

- **WHEN** `pbl_result` and `pbl_survey_click` events are compared for a given persona
- **THEN** both carry the same `top_persona` and `language` field names and value formats
