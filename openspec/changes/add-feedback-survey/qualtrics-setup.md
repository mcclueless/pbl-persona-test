# Qualtrics setup — receiving the embedded data

Runbook for tasks 6.2–6.4 of `add-feedback-survey`. This is console work in
Qualtrics, not code. It must be done **once per survey, in both surveys**.

> **Why this is needed:** the PBL tool appends `?persona=…&lang=…&source=pbltool`
> to the survey link. Qualtrics **silently discards** URL parameters it has not
> been told to expect. Without the steps below the links still work, students
> still respond, and the three fields are simply absent from every response —
> with no error, no warning, and nothing visible until someone opens the export.

## The two surveys

| Language | Survey ID | Link the tool builds |
|---|---|---|
| **English** | `SV_0r2st1QZQMgRxSS` | `…/jfe/form/SV_0r2st1QZQMgRxSS?persona=analyst&lang=en&source=pbltool` |
| **Dutch** | `SV_em1huq9t56bJHrE` | `…/jfe/form/SV_em1huq9t56bJHrE?persona=analyst&lang=nl&source=pbltool` |

> ⚠️ These IDs were transposed in the original hand-off and corrected on
> 2026-09-07. `SV_0r2st1QZQMgRxSS` is **English**. Confirm you are in the survey
> you think you are before editing its flow.

## The three fields

| Field | Values it can carry | What it is for |
|---|---|---|
| `persona` | `collaborator`, `analyst`, `challenger` | The result the student was shown. The reason this whole exercise exists — it lets "the result felt wrong" be read per persona. |
| `lang` | `en`, `nl` | The interface language at the moment they clicked. Redundant while the two surveys are separate, useful if the exports are ever merged. |
| `source` | `pbltool` | Marks the response as coming from the persona test, so later traffic from elsewhere is distinguishable. |

Field names are **case-sensitive** and must match exactly.

---

## Step by step (repeat in both surveys)

- [ ] 1. Sign in at `maastrichtuniversity.eu.qualtrics.com` and open the survey
      from **Projects**. Check the ID in the browser address bar against the
      table above.
- [ ] 2. Go to the **Survey** tab, then **Survey flow** in the left sidebar.
- [ ] 3. Click **+ Add a New Element Here** at the **very top**, above the first
      block. Position matters: the element must run *before* any question,
      otherwise the values are not available to the questions or to display
      logic.
- [ ] 4. Choose **Embedded Data**.
- [ ] 5. In the field box type `persona`.
      **Leave the value side alone.** It should read *"Value will be set from
      Panel or URL"*. Do **not** click "Set a Value Now" — that hard-codes a
      constant and permanently overwrites whatever the link passes.
- [ ] 6. Click **Add a New Field** and type `lang`. Repeat for `source`. All
      three live in the same Embedded Data element.
- [ ] 7. Confirm the element sits at the top of the flow. If it does not, use
      its **Move** handle to drag it above the first block.
- [ ] 8. Click **Apply**.
- [ ] 9. Click **Publish** (top right). Flow changes do **not** take effect for
      respondents until the survey is republished.

## Verify it actually works (task 6.4)

Do this per survey — it is the only way to know the wiring is live.

- [ ] 10. Paste the full test link from the table above into a browser. Use the
      real link, not **Preview**: preview does not pass URL parameters unless
      you add them to the preview URL yourself.
- [ ] 11. Complete the survey and submit it.
- [ ] 12. Open **Data & Analysis → Data**. Find your test response.
- [ ] 13. If you do not see `persona`, `lang`, and `source` as columns, they are
      probably just hidden — open the **column chooser** and switch them on.
      Embedded data columns are not shown by default.
- [ ] 14. Confirm the values read `analyst`, `en` (or `nl`), and `pbltool`.
      Blank columns mean the flow element is missing, misnamed, positioned below
      a block, or the survey was not republished after the edit.
- [ ] 15. Delete the test response so it does not pollute the real data.

## Using it afterwards

- **Filter:** Data & Analysis → **Add filter** → the embedded data field →
  e.g. `persona = challenger` to read only that group's comments.
- **Export:** Export & Import → **Export Data** → CSV. The three fields come
  through as their own columns.
- **Report:** the fields are available as breakouts in **Reports**, so a chart
  can be split by persona.

## Two things worth knowing

- **Only new responses carry the data.** Embedded data is written at response
  time. Anything submitted before step 9 has the fields permanently empty —
  they cannot be backfilled.
- **A field arrives empty if the student edits the link** or reaches the survey
  some other way (bookmark, shared link, copy-paste without the query string).
  Empty is expected for those and is not a fault.
