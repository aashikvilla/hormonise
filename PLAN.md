# Beyond Silence prototype plan

Last updated: 2026-10-26 UTC  
Overall status: **Complete for the mock prototype**  
Scope: a polished, deterministic Next.js concept demo for the Arjun journey. The supplied requirements are preserved in [`docs/`](docs/).

## Milestones

### M0 — Repository foundation — complete

- [x] Preserve the three supplied source documents verbatim in `docs/`.
- [x] Bootstrap Next.js App Router, React, strict TypeScript, Tailwind CSS, lint, typecheck, unit-test, and Playwright scripts.
- [x] Pin direct dependency versions and generate a frozen npm lockfile.
- [x] Add typed, deterministic demo fixtures and disclosure/matching helpers in `src/lib/demo.ts`.
- [x] Document setup, mock boundaries, and continuation in this file and `README.md`.

### M1 — Main product journey — complete

- [x] Landing page explains the product and starts the demo.
- [x] Share -> Understand -> Discover -> Join -> Connect works with preserved local state and reset.
- [x] Context and topic-only ranking compare the same three fixture circles.
- [x] Join disclosure is generated only from the allowlisted choices; consent and alias validation work.
- [x] Connect displays fixture messages, one marked reply at most, and editable sample drafts that never auto-send.
- [x] Keep browser behavior deterministic and make the lack of live AI and real peers clear.

### M2 — P0 continuation concepts — complete

- [x] Discover supports a read-only circle preview without joining or exposing the user's story.
- [x] Connect shows a read-only, unposted weekly topic suggestion requiring organizer approval.
- [x] Landing displays Kabir, Samira, and Meera as noninteractive concepts.
- [x] Restart clears preview, conversation, draft, and selection state.

### M3 — Quality and recording readiness — complete

- [x] Responsive, accessible UI checked at a 1920x1080 recording size and a 390x844 mobile viewport.
- [x] Unit and browser tests cover the primary path, disclosure boundaries, quiet preview, reset, and dialog behavior.
- [x] Run `npm run lint`, `npm run typecheck`, `npm test`, and `npm run build`; record results below.
- [x] Provide a concise, repeatable three-minute demo path.

## Acceptance checklist

Track the complete source acceptance criteria in `docs/BUILD_SPEC.md` and `docs/COMMUNITY_LIFECYCLE_AND_STORIES.md`.

- [x] A01 — Landing and accurate concept qualifier.
- [x] A02 — CTA opens Share with the sample story.
- [x] A03 — Empty story is blocked with accessible guidance.
- [x] A04 — Sample story restores and reveals the specified interpretation.
- [x] A05 — Insight selections persist.
- [x] A06 — Back navigation preserves story edits.
- [x] A07 — Context ranking puts family expectations first.
- [x] A08 — Topic ranking puts divorce logistics first, with an explanation.
- [x] A09 — Circle selection carries through to Join.
- [x] A10 — Consent is required.
- [x] A11 — Posted introduction uses explicit disclosure choices only.
- [x] A12 — Synthetic peer messages are labeled.
- [x] A13 — First custom message adds no more than one marked mock reply.
- [x] A14 — Restart restores all defaults.
- [x] A15 — Keyboard navigation and focus states work.
- [x] A16 — Desktop and mobile layouts avoid clipping and horizontal overflow.
- [x] A17 — Lint, typecheck, tests, and build pass.
- [x] A18 — No app-initiated network calls or claims of a live Meta integration.
- [x] A19 — Comparison is illustrative and has no fabricated scores.
- [x] A20 — About panel describes simulated content and limitations.
- [x] B01 — Quiet preview opens without joining or public identity.
- [x] B02 — Quiet reader can leave without joining or sending.
- [x] B03 — Sample draft fills the composer without sending.
- [x] B04 — Editing the selected draft changes only the eventual user message.
- [x] B05 — Weekly topic is an unposted fixture awaiting organizer approval.
- [x] B06 — Three additional stories remain noninteractive and separate from Arjun's analysis.
- [x] B07 — Restart clears every demo-local state.
- [x] B08 — Tests cover intro allowlisting and quiet preview isolation.

## Verification log

| Date (UTC) | Check | Result |
|---|---|---|
| 2026-10-26 | `npm_config_cache=/tmp/hormonise-npm-cache npm ci` | Passed (clean install, 421 packages) |
| 2026-10-26 | `npm run lint` | Passed |
| 2026-10-26 | `npm run typecheck` | Passed |
| 2026-10-26 | `npm test` | Passed (4 fixture tests) |
| 2026-10-26 | `npm run build` | Passed; `/` and `/demo` prerendered |
| 2026-10-26 | `npm run test:e2e` | Passed (12 browser cases across desktop 1920x1080 and mobile 390x844) |
| 2026-10-26 | Development and production server smoke | Both `/` and `/demo` returned HTTP 200; dev and production start commands both reached ready state |
| 2026-10-26 | Runtime request audit | Passed; browser test found no requests to external origins |

## Three-minute recording path

1. **0:00–0:20 — Landing:** introduce the fictional scenario and start the demo.
2. **0:20–0:45 — Share:** show the prefilled private story and explain that the user does not need to search by a category.
3. **0:45–1:12 — Understand:** confirm the fixed, simulated interpretation and show editable insight choices.
4. **1:12–1:40 — Discover:** compare context-aware and topic-only ordering; briefly open the quiet reading preview.
5. **1:40–2:03 — Join:** review the alias, allowlisted introduction, withheld story details, and explicit consent.
6. **2:03–2:30 — Connect:** show fictional peer messages, send one message for the marked simulated reply, then fill and edit a sample draft without auto-sending it.
7. **2:30–3:00 — Sustain and close:** show the unposted organizer topic and additional concept stories; state clearly that this is a mock with no real model calls or peer outcomes.

## Cloud environment setup

An install script and start instructions were saved as cloud-environment drafts. Their status is **saved, requires publication**; they have not been published. The install script uses the existing `/workspace/hormonise` checkout and `/tmp/hormonise-npm-cache`. The start instructions use `npm run dev -- --hostname 0.0.0.0 --port 3000` and include local `/` and `/demo` readiness checks.

## Continuation instructions

If work resumes in a later session, read this plan and the source documents in `docs/`, inspect `git status`, then pick up the first unchecked item in the active milestone. Preserve the frontend-only boundary: do not add model calls, API routes, auth, persistence, or external services. Update checkboxes and the verification log with actual outcomes before handing work back.

For sustained work, post a short manual progress update about once per hour: record the UTC time, completed items, current blocker, and next concrete item here. **No scheduler or hourly automation is configured in this repository or environment; these updates require a person or active agent to make them.**
