# Tasks

## 1. Heading copy

- [x] 1.1 In `data.js`, replace `resultTitle1`/`resultTitle2` with a single `resultTitle` key in EN ("Tap a persona to learn more") and NL ("Tik op een persona voor meer informatie"); verify `grep resultTitle data.js` shows exactly two `resultTitle:` lines
- [x] 1.2 In `index.html`, make the result `<h1>` a single `<span id="result-title">` with the EN default text, and in `app.js` set it from `T.resultTitle`; verify `grep -n "result-title[12]\|resultTitle[12]" index.html app.js data.js` returns nothing
- [x] 1.3 Remove the unused `.result-head h1 .accent` rule from `styles.css`; verify `grep -n "h1 .accent" styles.css` returns nothing

## 2. Remove the tap hint

- [x] 2.1 Remove the `<p class="tap-hint">` element, both `tapHint` keys, the `#tap-hint` assignment in `app.js` and the `.tap-hint` CSS rule; verify `grep -rn "tap-hint\|tapHint" index.html app.js data.js styles.css` returns nothing

## 3. Verify

- [x] 3.1 On the local server, complete the quiz in EN and NL and confirm the heading reads correctly as one uniform line, no hint appears under the cards, tapping a card still opens the detail panel, and the browser console shows no errors; also check the NL heading at ~360px width
- [x] 3.2 Run `openspec validate update-result-heading-copy --strict` and confirm it passes
