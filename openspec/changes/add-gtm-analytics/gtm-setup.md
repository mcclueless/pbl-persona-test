# GTM → GA4 setup & handoff

Runbook for finishing the `add-gtm-analytics` change. The **code is done and
deployed-ready** (merged to `main`, commit `8254538`). What remains is
account-gated work in the GTM and GA4 consoles plus a browser verification
pass — none of it requires code changes.

> Pick-up point (as of 2026-07-08): implementation complete and pushed.
> Remaining = Phase 1 deploy check, Phase 2 browser verify, Phase 3 GTM→GA4
> config, Phase 4 publish + GA4 dimensions. Work top to bottom.

---

## 0. What's already built (no action needed)

- GTM container `GTM-5LTFPDLV` loads from `index.html` — `<script>` in `<head>`,
  `<noscript>` iframe after `<body>`.
- `app.js` has a guarded `track(event, props)` helper pushing to
  `window.dataLayer`, and fires these events:

| Event | When it fires | Payload fields |
|---|---|---|
| `pbl_start` | "Start the test" clicked | `language` |
| `pbl_answer` | ×5 at completion, **final answers only** | `question_number`, `question_pillar`, `chosen_persona`, `option_letter`, `language` |
| `pbl_result` | at completion | `top_persona`, `score_collaborator/analyst/challenger`, `pct_collaborator/analyst/challenger`, `language` |
| `pbl_persona_open` | a persona detail is expanded (not on collapse) | `persona`, `language` |
| `pbl_language_switch` | EN/NL toggled (not on initial load) | `language` |
| `pbl_restart` | "Retake the test" clicked | `language` |
| `pbl_cta_click` | "Explore PBL at UM" clicked | `top_persona`, `language` |

All values are language-agnostic (English persona/pillar keys) so EN + NL
aggregate together.

---

## What you need before starting

- Access to the **GTM container** `GTM-5LTFPDLV` (tagmanager.google.com).
- A **GA4 property + Measurement ID** (`G-XXXXXXXX`), from GA4 → Admin →
  Data streams. Create one if it doesn't exist yet.
- Consent: **handled at the `tools.maastrichtuniversity.nl` platform level**
  (confirmed 2026-07-02) — no in-app consent gate needed.

---

## Phase 1 — Confirm the code is live

- [ ] 1. Ensure `https://tools.maastrichtuniversity.nl/pbl/` serves the latest
      `main`. If the deploy to that path is manual, trigger it.
- [ ] 2. On the live URL: DevTools → Network → filter `gtm.js` → confirm a
      200 response (the container is loading).

## Phase 2 — Verify events fire (browser only, no GTM needed)

Covers tasks 4.1–4.4 in `tasks.md`.

- [ ] 3. Open the live site → DevTools (F12) → Console. Type `dataLayer` — it
      should be an array.
- [ ] 4. Paste this once to log every `pbl_*` push:
      ```js
      window.dataLayer = window.dataLayer || [];
      const _p = window.dataLayer.push;
      window.dataLayer.push = function(o){ if(o && o.event && o.event.startsWith('pbl_')) console.log('▶', o.event, o); return _p.apply(this, arguments); };
      ```
- [ ] 5. Play through and confirm:
  - Start → `pbl_start`
  - Answer all 5 → **five** `pbl_answer` then one `pbl_result`
  - Go Back and change an answer before finishing → only the **final** answer
    is reported per question
  - Tap a persona → `pbl_persona_open`; tap again to collapse → nothing
  - Toggle EN/NL → `pbl_language_switch`; click the same language again → nothing
  - "Explore PBL at UM" → `pbl_cta_click`
  - "Retake the test" → `pbl_restart`
- [ ] 6. (task 4.4) Turn on a tracker blocker or block `googletagmanager.com`
      in DevTools, reload, confirm the quiz still works with no console errors.

## Phase 3 — Configure GTM → GA4 (task 5.1)

In tagmanager.google.com, open `GTM-5LTFPDLV`.

- [ ] 7. **Base GA4 tag (once):** Tags → New → **Google tag**. Tag ID =
      `G-XXXXXXXX`. Trigger = **Initialization – All Pages**. Save.
- [ ] 8. **Data Layer Variables:** Variables → New → **Data Layer Variable**,
      one each, named exactly: `language`, `question_number`, `question_pillar`,
      `chosen_persona`, `option_letter`, `top_persona`, `pct_collaborator`,
      `pct_analyst`, `pct_challenger` (add `score_*` if you want raw counts).
- [ ] 9. **Triggers:** Triggers → New → **Custom Event**, one per event, with
      the Event name field set exactly to: `pbl_start`, `pbl_answer`,
      `pbl_result`, `pbl_persona_open`, `pbl_language_switch`, `pbl_restart`,
      `pbl_cta_click`.
- [ ] 10. **GA4 Event tags:** Tags → New → **GA4 Event**, one per event. Event
      Name = the `pbl_*` name, add Event Parameters from the variables, attach
      the matching trigger. Example:
      ```
      Tag: GA4 - pbl_answer
        Event Name: pbl_answer
        Parameters:
          question_number = {{question_number}}
          question_pillar = {{question_pillar}}
          chosen_persona  = {{chosen_persona}}
          option_letter   = {{option_letter}}
          language        = {{language}}
        Trigger: pbl_answer
      ```
      (`pbl_result` → `top_persona` + `pct_*`; `pbl_cta_click` → `top_persona`
      + `language`; the rest → just `language`.)

## Phase 4 — Preview, publish, finish GA4

- [ ] 11. GTM **Preview** → enter the live URL → play through → confirm each
      tag fires with correct parameter values in Tag Assistant.
- [ ] 12. GTM **Submit → Publish**.
- [ ] 13. GA4 → Admin → **Custom definitions → Create custom dimension** for
      each parameter you want to slice by in reports (`top_persona`,
      `chosen_persona`, `question_pillar`, `option_letter`, `language`).
      Event-scoped. Without this the data still arrives (Realtime/DebugView) but
      won't appear as dimensions in standard reports.
- [ ] 14. GA4 → Reports → **Realtime** → confirm events land while clicking the
      live site.

---

## When done

All boxes ticked → the change is ready to archive:
`/openspec-archive-change add-gtm-analytics` (folds the spec into
`openspec/specs/`). Update `tasks.md` 4.1–4.4 and 5.1 to `[x]` first.

## Rollback

Remove the two GTM snippets from `index.html` and the `track()` calls in
`app.js`. No data model or structural changes to revert.
