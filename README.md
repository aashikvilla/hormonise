# Beyond Silence

An early concept prototype for finding peer support by understanding the context behind a private story. The intended demo follows a fictional Arjun from sharing a story through a simulated peer connection.

## Run locally

Requirements: Node.js 20.9 or later and npm.

```bash
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), then choose **Experience the 3-minute demo**. The guided flow lives at `/demo`.

For a concise recording, spend about 20 seconds on the landing, 25 seconds on Share, 27 seconds on the simulated interpretation, 28 seconds comparing discovery and previewing quiet reading, 23 seconds reviewing disclosure, and 27 seconds on the simulated conversation and editable draft. Use the remaining 30 seconds to show the unposted host topic and close by stating that no model calls or real peer outcomes are part of this prototype.

Useful checks:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

Browser tests use Playwright and the config at `tests/playwright.config.ts`:

```bash
npm run test:e2e
```

Install the browser once with `npx playwright install chromium` if the environment does not already have it.

The final verification passed lint, typecheck, four unit tests, production build, and 12 Playwright browser cases across desktop and mobile sizes. The browser checks also confirmed that the prototype makes no runtime requests to external origins. See [PLAN.md](PLAN.md) for the detailed verification log and cloud setup draft status.

## What is simulated

This is a local, frontend-only concept demo. The story interpretation, circle ranking, member counts, peer messages, suggested drafts, and community topic are fixed fictional fixtures. No model calls, API routes, accounts, database, real peer communication, or external runtime integrations are used. The default interpretation is designed for the sample Arjun story; editing the story does not produce a new analysis. A pseudonym does not guarantee anonymity, and this prototype is not therapy, legal advice, or crisis care.

## Future Meta model integration

The current `storyInsights` fixture and `rankCircles` helper in `src/lib/demo.ts` define the mock understanding and discovery boundary. A later, explicitly scoped integration could replace those fixture-backed functions with consented Muse Spark inference and evaluated retrieval over opted-in circle profiles, while retaining user correction, allowlisted disclosure, and clear model-status labeling. No such integration is present or required to run this prototype.

Read [PLAN.md](PLAN.md) for milestone status, acceptance criteria, verification notes, and continuation guidance. The supplied specifications are preserved in [`docs/`](docs/).
