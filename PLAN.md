# Beyond Silence 2.0 implementation plan

Last updated: 2026-10-27 UTC
Status: v2 P0 implemented; final browser rerun pending after copy-only interpretation refinement.

## V2 flow and acceptance

- [x] Preserve the existing Next.js App Router project, design tokens, routes, and responsive shell.
- [x] Replace group joining with a private opening and two guided sample turns.
- [x] Show the user's guided words, a tentative interpretation, editable intent and claims, and explicit confirmation.
- [x] Show three structured fictional perspective fixtures including similarities, attempts, reported helpful and unhelpful experiences, and differences.
- [x] Compare context-first and topic-only fixture ordering with transparent explanation and no performance claims.
- [x] Offer quiet generic browsing directly from the conversation without alias, personalized match, or message.
- [x] Allow one optional Ravi question with editable pseudonym/question, an exact recipient preview, explicit consent, and a single fixture reply.
- [x] Guard the question route so read-only contributors cannot receive it.
- [x] End in a user-chosen next step and optional usefulness feedback, including a respectful “No” response and restart.
- [x] Keep all simulation local, deterministic, visibly fictional, and without persistence or external requests.
- [x] Update README with setup, exact happy path, quiet route, and mock limitations.
- [x] Keep the earlier v1 video artifact for reference; its circle-joining storyline no longer represents the v2 app.

## Verification

| Check | Result |
|---|---|
| npm run lint | Passed |
| npm run typecheck | Passed |
| npm test | Passed, 7 unit tests |
| npm run build | Passed; / and /demo statically rendered |
| Playwright | QA reported 16/16 desktop/mobile executions passing; rerun requested after final interpretation wording change |

## Three-minute rehearsal

1. 0:00–0:16 — Landing: frame the problem and choose Explore Arjun’s story.
2. 0:16–0:55 — Conversation: choose “Things in my relationship,” then “Hear how other people navigated this.”
3. 0:55–1:15 — Mirror: show the tentative interpretation, correct or retain it, and confirm the support need.
4. 1:15–1:58 — Experiences: open Ravi and Nisha, point out what each tried, what they reported as helpful, and how their circumstances differ. Toggle topic-only, then context-first.
5. 1:58–2:25 — Optional question: choose Ravi, inspect the exact alias and question preview, grant consent, submit the demo question, and show the clearly simulated reply.
6. 2:25–2:48 — Takeaway: select a next step and usefulness response; show the confirmed need and only the perspectives opened.
7. 2:48–3:00 — Close: show the optional future loop and disclose that this is a frontend mock.

Quiet branch: restart, choose “I would rather not share details,” open a neutral story, return to the list, and finish privately. It never requests an alias or sends a question.

## Cloud environment setup

Install and startup instructions are saved in the cloud environment draft and require publication. The install uses the existing checkout and /tmp/hormonise-npm-cache; the startup uses Next dev on port 3000. No hourly scheduler is available, so resumption remains manual.
