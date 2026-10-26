# Beyond Silence prototype plan

Last updated: 2026-10-26 UTC  
Overall status: **In progress**  
Scope: a polished, deterministic Next.js concept demo for the Arjun journey. The supplied requirements are preserved in [`docs/`](docs/).

## Milestones

### M0 — Repository foundation — complete

- [x] Preserve the three supplied source documents verbatim in `docs/`.
- [x] Bootstrap Next.js App Router, React, strict TypeScript, Tailwind CSS, lint, typecheck, unit-test, and Playwright scripts.
- [x] Pin direct dependency versions and generate a frozen npm lockfile.
- [x] Add typed, deterministic demo fixtures and disclosure/matching helpers in `src/lib/demo.ts`.
- [x] Document setup, mock boundaries, and continuation in this file and `README.md`.

### M1 — Main product journey — in progress

- [ ] Landing page explains the product and starts the demo.
- [ ] Share -> Understand -> Discover -> Join -> Connect works with preserved local state and reset.
- [ ] Context and topic-only ranking compare the same three fixture circles.
- [ ] Join disclosure is generated only from the allowlisted choices; consent and alias validation work.
- [ ] Connect displays fixture messages, one marked reply at most, and editable sample drafts that never auto-send.
- [ ] Keep browser behavior deterministic and make the lack of live AI and real peers clear.

### M2 — P0 continuation concepts — in progress

- [ ] Discover supports a read-only circle preview without joining or exposing the user's story.
- [ ] Connect shows a read-only, unposted weekly topic suggestion requiring organizer approval.
- [ ] Landing displays Kabir, Samira, and Meera as noninteractive concepts.
- [ ] Restart clears preview, conversation, draft, and selection state.

### M3 — Quality and recording readiness — pending

- [ ] Responsive, accessible UI suitable for a 1920x1080 recording and a 390px mobile viewport.
- [ ] Meaningful unit and browser tests cover the primary path and disclosure boundaries.
- [ ] Run `npm run lint`, `npm run typecheck`, `npm test`, and `npm run build`; record results below.
- [ ] Provide a concise, repeatable three-minute demo path.

## Acceptance checklist

Track the complete source acceptance criteria in `docs/BUILD_SPEC.md` and `docs/COMMUNITY_LIFECYCLE_AND_STORIES.md`.

- [ ] A01 — Landing and accurate concept qualifier.
- [ ] A02 — CTA opens Share with the sample story.
- [ ] A03 — Empty story is blocked with accessible guidance.
- [ ] A04 — Sample story restores and reveals the specified interpretation.
- [ ] A05 — Insight selections persist.
- [ ] A06 — Back navigation preserves story edits.
- [ ] A07 — Context ranking puts family expectations first.
- [ ] A08 — Topic ranking puts divorce logistics first, with an explanation.
- [ ] A09 — Circle selection carries through to Join.
- [ ] A10 — Consent is required.
- [ ] A11 — Posted introduction uses explicit disclosure choices only.
- [ ] A12 — Synthetic peer messages are labeled.
- [ ] A13 — First custom message adds no more than one marked mock reply.
- [ ] A14 — Restart restores all defaults.
- [ ] A15 — Keyboard navigation and focus states work.
- [ ] A16 — Desktop and mobile layouts avoid clipping and horizontal overflow.
- [ ] A17 — Lint, typecheck, tests, and build pass.
- [ ] A18 — No app-initiated network calls or claims of a live Meta integration.
- [ ] A19 — Comparison is illustrative and has no fabricated scores.
- [ ] A20 — About panel describes simulated content and limitations.
- [ ] B01 — Quiet preview opens without joining or public identity.
- [ ] B02 — Quiet reader can leave without joining or sending.
- [ ] B03 — Sample draft fills the composer without sending.
- [ ] B04 — Editing the selected draft changes only the eventual user message.
- [ ] B05 — Weekly topic is an unposted fixture awaiting organizer approval.
- [ ] B06 — Three additional stories remain noninteractive and separate from Arjun's analysis.
- [ ] B07 — Restart clears every demo-local state.
- [ ] B08 — Tests cover intro allowlisting and quiet preview isolation.

## Verification log

| Date (UTC) | Check | Result |
|---|---|---|
| 2026-10-26 | `npm install` and lockfile generation | Passed (414 packages installed) |
| 2026-10-26 | `npm run lint` | Passed |
| 2026-10-26 | `npm test` | Passed (4 fixture tests) |
| 2026-10-26 | `npm run typecheck` | Pending UI implementation; currently reports its in-progress missing `DemoExperience` import |

## Continuation instructions

If work resumes in a later session, read this plan and the source documents in `docs/`, inspect `git status`, then pick up the first unchecked item in the active milestone. Preserve the frontend-only boundary: do not add model calls, API routes, auth, persistence, or external services. Update checkboxes and the verification log with actual outcomes before handing work back.

For sustained work, post a short manual progress update about once per hour: record the UTC time, completed items, current blocker, and next concrete item here. **No scheduler or hourly automation is configured in this repository or environment; these updates require a person or active agent to make them.**
