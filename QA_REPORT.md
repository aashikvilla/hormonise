# Beyond Silence prototype QA

Browser acceptance coverage lives in `tests/demo-flow.spec.ts`. The suite ran against the local Next.js app in system Chromium at desktop 1920×1080 and mobile 390×844. All 12 executions passed (six scenarios in each viewport), with no skipped tests.

Coverage includes the landing CTA and fictional persona cards; the five-stage guided journey; empty-story validation and the fixed-preview warning after an edit; context versus topic-only ordering; a quiet preview that keeps the user outside membership and contains no alias or private narrative; consent-gated joining; the disclosure allowlist and withheld story details; editable sample drafts that do not send until submitted; one marked simulated reply on the first message only; restart clearing local conversation state; the read-only organizer topic; About dialog focus trapping, Escape close and focus restoration; viewport overflow checks; and a request audit confirming no runtime requests to an external origin.

The browser screenshots captured during the passing run are available outside the repository:

- `/tmp/beyond-silence-desktop-landing.png`
- `/tmp/beyond-silence-desktop-connect.png`
- `/tmp/beyond-silence-mobile-landing.png`
- `/tmp/beyond-silence-mobile-connect.png`

I reviewed the screenshots at both sizes. The layout remains legible without horizontal overflow. Development screenshots include Next.js's local dev indicator; it is absent from production builds. This QA report covers the mocked frontend flow only; peers, interpretation, matching, replies and community prompts remain fixtures, with no real backend or peer availability tested.

Command used:

```sh
node_modules/.bin/playwright test --config tests/playwright.config.ts
```
