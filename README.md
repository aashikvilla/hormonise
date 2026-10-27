# Beyond Silence 2.0

An interactive concept prototype for a person moving from a private, hard-to-explain concern to confirmed needs, fictional lived-experience perspectives, an optional consented question, and a chosen next step.

## Run locally

Requirements: Node.js 20.9+ and npm.

    npm ci
    npm run dev

Open http://localhost:3000 and select **Explore Arjun’s story**. The guided experience is at /demo.

## Three-minute click rehearsal

Use the seeded choices to rehearse without typing:

1. Open **Explore Arjun’s story**.
2. Select **Things in my relationship**.
3. Select **Hear how other people navigated this**.
4. Review the tentative mirror, then select **Yes, that is it · Confirm and explore**.
5. Open Ravi’s story and point out what he tried, what he reported as helpful, and what differed. Return to the story list.
6. Switch to **Topic-only example**, then back to **Context-first** to show the illustrative ordering.
7. Open Nisha’s story and show that her situation differed and that questions are unavailable. Return and open Ravi.
8. Select **Ask Ravi anonymously**, review the pseudonym and exact recipient preview, check consent, and select **Send demo question**.
9. Read the clearly labeled simulated human reply, select **Continue privately**, choose a next step, and select **Yes**, **Somewhat**, **No**, or **Skip**.
10. Close with the flywheel and prototype disclosure. Restart to show the flow resets.

For the quiet branch, restart and select **I would rather not share details**. Browse the neutral fictional stories, open one, return to the list, then select **Finish privately**. This route never requests an alias or sends a question.

## Checks

    npm run lint
    npm run typecheck
    npm test
    npm run build
    npm run test:e2e

Playwright browser tests use the checked-in configuration at tests/playwright.config.ts.

## Mock limitations

This is a frontend-only rehearsal. Conversation prompts, interpretations, story records, rankings, and the contributor reply are deterministic local fixtures. No Meta AI or other model runs; the app makes no application API calls and stores no persistent user data. The named contributors are fictional and their stories are not testimonials. Topic/context order is an illustrative comparison, not measured model performance. The recipient preview contains only the editable pseudonym and question, and submission requires explicit approval before showing one fixture response. This prototype does not diagnose, prescribe, send real messages, verify support services, or claim an outcome. It is not therapy, legal advice, or crisis care.

The prior V1 walkthrough in demo-walkthrough.mp4 records the old circle-joining flow; the updated V2 app is the current product direction.
