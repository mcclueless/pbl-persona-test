# GTM → GA4 setup for `pbl_survey_click`

Runbook for tasks 7.2–7.4 of `add-feedback-survey`. Console work in Google Tag
Manager and GA4, not code.

This is a **delta** on the main runbook at
[`../add-gtm-analytics/gtm-setup.md`](../add-gtm-analytics/gtm-setup.md), which
covers all eight `pbl_*` events. If none of that has been done yet, work through
that file's Phase 3 first — the base Google tag is a prerequisite for everything
below, and while you are in there it is cheaper to configure all eight events in
one pass than to come back for this one.

## What the app already sends

The code is live and pushed. When a student clicks "Help us improve this test",
this lands on `window.dataLayer`:

```js
{ event: 'pbl_survey_click', top_persona: 'analyst', language: 'en' }
```

`top_persona` is always one of `collaborator` / `analyst` / `challenger` and
`language` is `en` or `nl` — English keys in both cases, never translated, so
EN and NL aggregate together.

This is byte-for-byte the same payload shape as `pbl_cta_click`. That is
deliberate: it makes the two outbound clicks directly comparable, and it means
**no new Data Layer Variables are needed** if you have already set up
`pbl_cta_click`.

---

## Prerequisites

- [ ] 0. Access to GTM container `GTM-5LTFPDLV` at `tagmanager.google.com`, and
      the GA4 property's Measurement ID (`G-XXXXXXXX`).
- [ ] 0b. The base **Google tag** exists in the container, firing on
      *Initialization – All Pages*. (Phase 3, step 7 of the main runbook.)

## 1. Data Layer Variables

Skip any that already exist — do **not** create duplicates.

- [ ] 1. **Variables → User-Defined Variables → New → Data Layer Variable.**
      Data Layer Variable Name: `top_persona` (exactly). Version 2. Leave the
      default value empty. Name the variable `top_persona` to match the main
      runbook's convention. Save.
- [ ] 2. Repeat for `language`.

## 2. Trigger

- [ ] 3. **Triggers → New → Trigger Configuration → Custom Event.**
- [ ] 4. **Event name:** `pbl_survey_click` — typed exactly, no wildcards, and
      leave "Use regex matching" off.
- [ ] 5. **This trigger fires on:** All Custom Events.
- [ ] 6. Name it `pbl_survey_click` and save.

## 3. GA4 Event tag

- [ ] 7. **Tags → New → Tag Configuration → Google Analytics: GA4 Event.**
- [ ] 8. Point it at your Google tag / Measurement ID, the same way the other
      `pbl_*` tags do.
- [ ] 9. **Event Name:** `pbl_survey_click`.
- [ ] 10. **Event Parameters** — add two rows:

      | Parameter name | Value |
      |---|---|
      | `top_persona` | `{{top_persona}}` |
      | `language`    | `{{language}}` |

- [ ] 11. **Triggering:** the `pbl_survey_click` trigger from step 6.
- [ ] 12. Name the tag `GA4 - pbl_survey_click` and save.

## 4. Preview and publish

- [ ] 13. **Preview**, enter the live URL, and play through: finish the test,
      then click "Help us improve this test".
- [ ] 14. In Tag Assistant, select the `pbl_survey_click` event and confirm
      `GA4 - pbl_survey_click` is under **Tags Fired**, with `top_persona` and
      `language` holding real values — not `undefined`. `undefined` means the
      Data Layer Variable name does not match the key in the push.
- [ ] 15. The survey opens in a new tab, which is intentional: the original page
      survives, so the tag has time to fire. Do not "fix" this by making the
      link open in the same tab.
- [ ] 16. **Submit → Publish**, with a version name such as
      `Add pbl_survey_click`.

## 5. GA4 custom dimensions

Without this the events still arrive and are visible in Realtime and DebugView,
but the parameters cannot be used as dimensions in standard reports.

- [ ] 17. **GA4 → Admin → Custom definitions → Create custom dimension.**
      Event parameter `top_persona`, **event-scoped**. Skip if it already exists
      for `pbl_result` / `pbl_cta_click` — one definition serves every event
      that sends the parameter.
- [ ] 18. Same for `language`. Give it a distinct display name, e.g.
      **PBL interface language**: GA4 already reports a built-in Language
      dimension taken from the browser, and the two are easy to confuse in a
      report otherwise.
- [ ] 19. **Reports → Realtime**, click through the live site, confirm
      `pbl_survey_click` appears.

> Custom dimensions are not retroactive — they only apply to data collected
> after they are created. Create them early.

## What to do with it

The number worth watching is the ratio, not the raw count:

```
   pbl_survey_click        how many finishers actually gave feedback
   ────────────────   =    ... and, split by top_persona, whether the
     pbl_result             feedback you are reading is skewed toward
                            one persona before you read a word of it
```

Both events carry `top_persona` with identical field names and value formats,
which is what makes that division possible in GA4.
