# Reading the PBL data in GA4

How to see the events once they are flowing: real-time verification first, then
the two reports worth building. Console work in GA4, no code.

Prerequisite for everything below: the custom dimensions exist
(Admin → Custom definitions), event-scoped, at minimum `top_persona` and
`language`. Without them the fields are collected but cannot be used as report
dimensions. They are **not retroactive** — data collected before a dimension was
created shows as `(not set)` forever.

---

## Part 1 — Seeing events in real time

GA4 has two live tools and they answer different questions. Reaching for the
wrong one is the usual reason people conclude nothing is being collected.

| | **Realtime** | **DebugView** |
|---|---|---|
| Where | Reports → Realtime | Admin → DebugView |
| Who it shows | everyone on the site | only debug-enabled devices |
| Window | last 30 minutes | live stream, as it happens |
| Parameter detail | limited | **full** — every parameter and value |
| Answers | "is anything arriving at all?" | "is `top_persona` actually `analyst`?" |

### Realtime — is anything arriving

- [ ] 1. **Reports → Realtime.**
- [ ] 2. Find the **Event count by Event name** card and look for `pbl_result`.
      It appears within seconds of someone completing the test.
- [ ] 3. Click the event name to open its detail card.

Good for confirming the pipe is open. Not the tool for inspecting values.

### DebugView — seeing `pbl_result` with its parameters

This is the one to use when you want to see that a completed test really carried
`top_persona: 'analyst'` and `language: 'en'`.

- [ ] 4. Put your own browser into debug mode. The easiest route, since the
      container is already set up: open GTM, click **Preview**, and connect to
      `https://tools.maastrichtuniversity.nl/pbl/`. GTM Preview sets
      `debug_mode` automatically for that session — no extension needed.
      (The *Google Analytics Debugger* Chrome extension does the same thing if
      you would rather not run Preview.)
- [ ] 5. In GA4: **Admin → DebugView** (under *Data display*).
- [ ] 6. Top left, pick your device from the **Debug device** dropdown. If it is
      empty, debug mode is not active — go back to step 4.
- [ ] 7. Play the test through to the result screen. `pbl_start`, five
      `pbl_answer`, then `pbl_result` appear in the timeline within a second or
      two.
- [ ] 8. Click `pbl_result` in the stream. The panel lists every parameter:
      `top_persona`, `score_collaborator/analyst/challenger`,
      `pct_collaborator/analyst/challenger`, `language`.
- [ ] 9. Confirm `top_persona` matches the best-match card the test just showed
      you, and `language` matches the interface language.

DebugView only shows debug-enabled devices, so it stays readable no matter how
much real traffic the site is getting.

---

## ⚠️ Open question: is `language` actually arriving?

Capturing the live site's real network traffic on 2026-09-07 showed every
`pbl_*` event reaching `region1.google-analytics.com` with HTTP 204 and correct
parameters — `top_persona`, `pct_*`, `chosen_persona`, `question_pillar`,
`option_letter` all present — but **no `language` parameter on any event**,
despite all eight GTM tags being wired with `language={{language}}` (verified in
published container v9).

The likely cause is that **`language` is a reserved GA4 field**. GA4 collects
the browser locale automatically as `ul=` outside the `ep.` namespace, and the
event-scoped parameter appears to be dropped or overridden.

**Check before trusting the language column below:** Admin → DebugView with GTM
Preview connected, click a `pbl_result` event, and read its parameter list. If
`language` is absent there too, it is being dropped.

**If it is dropped**, the fix is to rename the parameter to something
unreserved — `ui_language` or `pbl_language` — in all eight GA4 Event tags (the
Data Layer Variable and the app's dataLayer key both stay `language`; only the
GA4 event *parameter name* changes), then register that as the custom dimension.
Until then the language column would reflect the browser's locale rather than
the EN/NL toggle the student actually used, which is a different thing and often
wrong.

---

## Part 2 — The persona × language report

An **Exploration**, not a standard report: faster to build and it pivots
directly.

> **The rule that trips everyone up once:** the Variables panel on the left is a
> shopping basket. Nothing is available to Rows, Columns, Values, Filters or
> Segments until you have imported it there — including standard fields like
> Event name that GA4 obviously already knows about.
>
> And **Event name is a dimension, not a metric.** Metrics are only the numbers
> (Event count, Total users). Anything you group or filter *by* is a dimension.

- [ ] 10. **Explore → Blank → Free form.**
- [ ] 11. Variables → **Dimensions +** → import three: your persona dimension,
      your language dimension, and **Event name**.
- [ ] 12. Variables → **Metrics +** → import **Event count**.
- [ ] 13. Tab Settings:

      | Slot | What goes in it |
      |---|---|
      | Rows | PBL persona |
      | Columns | PBL interface language |
      | Values | Event count |
      | Filters | Event name **exactly matches** `pbl_result` |

The filter is not optional. `pbl_cta_click` and `pbl_survey_click` also carry
`top_persona`, so without it a student who finishes and clicks both is counted
three times. Filtered to `pbl_result` — which fires exactly once per completed
test — **Event count = completed tests**, and the grid is a true distribution:

```
             │   en   │   nl   │
    ─────────┼────────┼────────┤
    analyst  │        │        │
    collab…  │        │        │
    challen… │        │        │
```

## Part 3 — The feedback response rate

Second tab in the same exploration. This is the number the whole
`add-feedback-survey` change exists to make possible.

- [ ] 14. **Rows:** PBL persona · **Columns:** Event name · **Values:** Event count
- [ ] 15. **Filters:** Event name **matches regex** `pbl_result|pbl_survey_click`

Each row then shows completions beside feedback clicks, so the ratio reads
straight off the grid — and tells you whether the feedback sitting in Qualtrics
is skewed toward one persona before you read a word of it. This works only
because both events carry `top_persona` with identical field names and value
formats.

---

## Why the report looks empty or wrong

| What you see | Why |
|---|---|
| Nothing at all, though Realtime works | Explorations run on **processed** data — allow 24–48h. Realtime and DebugView are the instant checks; Explore is not. |
| A large `(not set)` row | Data collected before the custom dimension existed. Not a bug, and not fixable retroactively. |
| Counts look roughly 3× too high | The `Event name` filter is missing, so `pbl_cta_click` and `pbl_survey_click` are being counted alongside `pbl_result`. |
| Small rows missing entirely | Data thresholding. With Google Signals on in your reporting identity, GA4 withholds low-volume rows. Switching reporting identity to **Device-based** removes it. |
| The dimension is not in the picker | It was never created in Admin → Custom definitions, or you are searching its parameter name rather than its display name. |
