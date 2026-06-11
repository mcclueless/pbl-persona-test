# PBL Persona Test — Maastricht University

A mobile-first, **static** web app that lets prospective students answer 5 quick
questions and discover their Problem-Based Learning (PBL) persona —
**Collaborator**, **Analyst**, or **Challenger**. Built to start a conversation at
events and online, introduce PBL in a non-academic way, and collect leads for CRM.

No backend, no build step, no dependencies. Just static files.

## Run / deploy

Open `index.html` in a browser, or serve the folder from any static web server:

```bash
python3 -m http.server 8000     # then visit http://localhost:8000
```

Deploy by uploading the whole folder to any static host (Azure Static Web Apps,
Netlify, an IIS/Apache/Nginx directory, a CMS asset folder, …). Keep the file
structure intact.

## Files

| File | Purpose |
|------|---------|
| `index.html` | Markup & screen structure (start · quiz · result · modal) |
| `styles.css` | All styling — UM visual identity, responsive, animations |
| `data.js` | **All content**: questions, answers, persona text, EN/NL copy |
| `app.js` | Logic: quiz flow, scoring, results, language toggle, modal |
| `assets/` | UM primary logos (blue + reversed white) |

## Editing content

Everything users read lives in **`data.js`**:

- `QUESTIONS` — the 5 questions, each answer maps to a persona (`p` field).
- `RESULT_TEXT` — per-persona result narrative (intro / body / growth), EN + NL.
- `PERSONAS` — display name, tagline, accent colour.
- `I18N` — all interface strings (buttons, labels, key message) in EN + NL.

No code changes are needed to tweak wording or translations.

## How scoring works

Each of the 5 answers points to one persona. The percentage shown per persona is
`answers for that persona ÷ 5 × 100`. The highest-scoring persona is highlighted
as the **Best match** (ties resolve to Collaborator → Analyst → Challenger order).

## Lead capture → Dynamics / CRM

The "Download PBL infographic" CTA opens a lead-capture form. Currently it
validates input and shows a confirmation; the captured payload is assembled in
`app.js → submitLead()`:

```js
{ firstName, email, persona, scores, locale, consent }
```

To wire it to Dynamics, replace the `console.log` in `submitLead()` with a POST to
your Dynamics marketing form endpoint (or embed the official Dynamics form markup
in the modal). The persona + scores are included so the lead can enter the correct
PBL nurture journey and be linked to Experience Days.

## Brand

UM visual identity: Midnight `#011b3c`, Sky Blue `#6ED2EC`, 32px rounded corners,
stacked-stone ("gestapelde stenen") background texture at low opacity, primary UM
logo (blue on light, reversed white on dark). Fort/Aptos are not web-available, so
the closest characterful web fallbacks are used (Bricolage Grotesque + Hanken
Grotesk). Swap to self-hosted Fort web fonts when licensed.
