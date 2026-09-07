# GTM → GA4: the remaining seven `pbl_*` events

Finishes Phase 3 of [`gtm-setup.md`](gtm-setup.md) (tasks 5.1 / steps 8–10).

`pbl_survey_click` is already live in container `GTM-5LTFPDLV` — the pattern
below is the same one, repeated. Nothing here is code; it is all GTM and GA4
console work.

> ## ✅ Sections 1–4 are complete as of 2026-09-07
>
> Container `GTM-5LTFPDLV` is at **version 9** with **all eight** `pbl_*` events
> published — each on its own trigger, with the correct parameter names, the
> correct variables, and measurement ID `G-KSK91X79BX`. Verified by parsing the
> published container, and tasks 4.1–4.4 verified against the live site (7/7).
>
> **Only [section 5](#5-ga4-custom-definitions) and
> [section 6](#6-confirm) remain**, both in GA4 rather than GTM. Sections 1–4
> below are kept as the record of what was built.

**Why this was needed.** The app pushes all eight events to `dataLayer`
regardless of GTM. GTM Preview's **left-hand event stream** shows every push,
tagged or not — which is why `pbl_result` looked like it was "working" there
while never reaching GA4. Only an event with a **trigger and a GA4 tag** is
forwarded.

> **The lesson worth keeping.** Through versions 3 to 8 the GTM UI reported
> eight tags while the published container shipped seven, and then shipped a
> tag whose event name did not match its trigger (`pbl_survey_click` firing on
> `pbl_result`, so completions were recorded as survey clicks). None of that is
> visible from inside GTM. The published container at
> `https://www.googletagmanager.com/gtm.js?id=GTM-5LTFPDLV` is the only source
> of truth — check the version number and the tag/trigger pairing there, not
> the workspace.

## The seven to add

Priority order — `pbl_result` first, since it carries the persona distribution
that the reports in
[`../add-feedback-survey/ga4-reports.md`](../add-feedback-survey/ga4-reports.md)
are built on.

| # | Event | Parameters to send |
|---|---|---|
| 1 | `pbl_result` | `top_persona`, `pct_collaborator`, `pct_analyst`, `pct_challenger`, `language` |
| 2 | `pbl_answer` | `question_number`, `question_pillar`, `chosen_persona`, `option_letter`, `language` |
| 3 | `pbl_cta_click` | `top_persona`, `language` |
| 4 | `pbl_persona_open` | `persona`, `language` |
| 5 | `pbl_start` | `language` |
| 6 | `pbl_restart` | `language` |
| 7 | `pbl_language_switch` | `language` |

> `pbl_persona_open` sends **`persona`**, not `top_persona` — it names the card
> the user expanded, which is often not their result. They are different fields
> and need different variables. Likewise `pbl_answer` sends `chosen_persona`.
>
> The app also pushes `score_collaborator` / `score_analyst` /
> `score_challenger` on `pbl_result`. They are the raw 0–5 counts that the
> `pct_*` values are derived from, so sending both is redundant. Take `pct_*`
> and skip `score_*` unless you specifically want the raw counts.

---

## 1. Data Layer Variables (do all of these first)

Variables → **User-Defined Variables** → New → **Data Layer Variable**. Name each
variable exactly as its Data Layer Variable Name, Version 2, default value empty.

- [x] `persona`
- [x] `question_number`
- [x] `question_pillar`
- [x] `chosen_persona`
- [x] `option_letter`
- [x] `pct_collaborator`
- [x] `pct_analyst`
- [x] `pct_challenger`

`top_persona` and `language` already exist — skip them, do not create duplicates.

> **Speed it up:** create the first one, then use its **three-dot menu → Copy**
> and change the two name fields. Eight variables takes about two minutes this
> way instead of ten.

## 2. Triggers

Triggers → New → **Custom Event**. Event name typed exactly, regex matching
**off**, fires on **All Custom Events**. Name each trigger after its event.

- [x] `pbl_result`
- [x] `pbl_answer`
- [x] `pbl_cta_click`
- [x] `pbl_persona_open`
- [x] `pbl_start`
- [x] `pbl_restart`
- [x] `pbl_language_switch`

Copy-and-edit works here too: only the Event name field changes between them.

## 3. GA4 Event tags

Tags → New → **Google Analytics: GA4 Event**, one per event.

- **Measurement ID:** `{{GA4 Measurement ID}}` (or `G-KSK91X79BX`)
- **Event Name:** the `pbl_*` name, exactly
- **Event Parameters:** from the table above, each as `name` = `{{name}}`
- **Triggering:** the matching trigger
- **Tag name:** `GA4 - pbl_result`, and so on

Fastest route: open the existing `GA4 - pbl_survey_click` tag, **three-dot menu →
Copy**, then change the event name, the parameters and the trigger. Every tag
after the first is about a minute.

- [x] `GA4 - pbl_result`
- [x] `GA4 - pbl_answer`
- [x] `GA4 - pbl_cta_click`
- [x] `GA4 - pbl_persona_open`
- [x] `GA4 - pbl_start`
- [x] `GA4 - pbl_restart`
- [x] `GA4 - pbl_language_switch`

## 4. Preview, then publish

- [x] Preview against `https://tools.maastrichtuniversity.nl/pbl/` and play a
      full pass: start, five answers, the result, expand a persona, toggle the
      language, click the CTA, click the feedback link, retake.
- [x] For each event, select it in the left event stream and check the **Tags**
      tab: the matching tag under **Tags Fired**, with real values rather than
      `undefined`.
- [x] Expect exactly **five** `pbl_answer` tags on one pass — the app reports
      final answers only, all at completion, so five is correct and one-per-click
      is not.
- [x] **Submit → Publish.**

## 5. GA4 custom definitions

Registration is what makes a parameter usable in reports. The split matters:
things you **group by** are dimensions, things you **average** are metrics.

**Admin → Custom definitions → Custom dimensions** (event-scoped):

- [ ] `top_persona` — *PBL persona*
- [ ] `language` — *PBL interface language* (distinct name: GA4 has a built-in Language dimension)
- [ ] `chosen_persona` — *Answer persona*
- [ ] `question_pillar` — *Question pillar*
- [ ] `option_letter` — *Answer option*
- [ ] `persona` — *Persona opened*
- [ ] `question_number` — *Question number*

**Admin → Custom definitions → Custom metrics** (event-scoped, Standard unit):

- [ ] `pct_collaborator`, `pct_analyst`, `pct_challenger` — only if you want to
      average match strength ("how decisive was the result"). Skip otherwise.

> Not retroactive, for either kind. Anything collected before a definition
> exists reads `(not set)` permanently, so create them in the same sitting as
> the publish.

## 6. Confirm

- [ ] **Admin → DebugView** with GTM Preview connected: play a pass and confirm
      each event now appears *with* its parameters. This is the check that
      distinguishes "pushed to dataLayer" from "received by GA4" — the
      distinction that made `pbl_result` look configured when it was not.
- [ ] **Reports → Realtime**: events appear within seconds.
- [ ] Explorations: allow 24–48h, then build the reports in
      [`../add-feedback-survey/ga4-reports.md`](../add-feedback-survey/ga4-reports.md).

## When this is done

Tasks 4.1–4.4 and 5.1 in [`tasks.md`](tasks.md) can be ticked and
`add-gtm-analytics` archived with
`/openspec-archive-change add-gtm-analytics`.
