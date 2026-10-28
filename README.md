# Harmonise

An incremental upgrade of the existing Beyond Silence Next.js prototype. Harmonise helps a person explore what they want, read relevant community experiences, and decide what—if anything—they want to share. Communities and people provide the human value; the prototype's AI-like interpretation is deterministic demo behavior.

## Run locally

Requirements: Node.js 20.9+ and npm.

```bash
npm ci
npm run dev
```

Open <http://localhost:3000>. Start with **Explore Arjun's fictional example** for the guided demonstration, or choose any of the four entry paths. `/demo` opens the in-app entry chooser; `?path=quiet`, `?path=support`, and `?help=safety` open specific paths.

## Deploy to GitHub Pages

For the one-time repository setup, open **Settings → Pages** and set **Build and deployment → Source** to **GitHub Actions**. After that, pushes to the `work` branch run the workflow in `.github/workflows/deploy-pages.yml`, which checks the app, builds its static export, and deploys it. The expected project site URL is <https://aashikvilla.github.io/hormonise/>.

## Three-minute rehearsal

Use the sample answers so nothing needs to be typed:

1. **0:00–0:12 — Start with a choice.** On the landing page, select **Explore Arjun's fictional example**. Say: “Some experiences feel too personal to explain, and search terms can miss what matters.”
2. **0:12–0:32 — Explore without an intake.** Choose **Relationship and family expectations**, then **Hear experiences without advice**. The guided conversation asks two questions; it does not diagnose.
3. **0:32–0:48 — Confirm or correct.** Select **Review understanding**. Point out the separate source words, suggested themes and user choice. Optionally remove one theme or add **Work pressure** to show the recommendation changes.
4. **0:48–1:14 — Visit the community.** Choose **Use this to explore communities**, open **Family Expectations & Personal Choices**, and briefly show Experiences, Discussions and People. Community content is fictional and no activity is live.
5. **1:14–1:43 — Compare lived experience.** Open Ravi's story. Show all three milestones, the difference that Ravi had a trusted friend, and what the demo does not know about his outcome.
6. **1:43–2:18 — Review a human question.** Select **Ask Ravi anonymously**. Read the exact recipient preview, check consent and show the clearly fictional reply. No private conversation history is included.
7. **2:18–2:37 — Choose what was useful.** Select **A new perspective**, choose an optional next step, and explicitly keep or skip the private note.
8. **2:37–2:50 — Show continuity.** Open **My journey**, then **Start a new chapter**. The later “Belonging after moving” example opens a different community without linking the concerns.
9. **2:50–3:00 — Close honestly.** Briefly show **Contribute** and state that this is a fictional, frontend-only demo. No Meta inference ran.

### 120-second fallback

Choose Arjun's example → select the two sample answers → review the suggested themes → open the family community → open Ravi and point out the difference → preview and consent to the sample question → show the fictional reply → choose **A new perspective** → close on **My journey**. Skip the comparison drawer, other tabs, and contributor view.

## Verification

```bash
npm run lint
npm run typecheck
npm test
npm run build
npm run test:e2e -- --workers=1
```

Playwright covers desktop at 1920×1080 and mobile at 390×844. Browser screenshots are written to `/tmp/harmonise-*.png`. See [the migration map](docs/harmonise-migration-map.md) and [UX/accessibility review](docs/harmonise-quality-review.md) for implementation and review evidence.

## Prototype boundaries

- People, communities, experiences, discussion posts and the contributor reply are fictional sample data. They are not testimonials or live users.
- The guided conversation and contextual ordering are mock behavior. Arbitrary typed answers are not interpreted. The app makes no application API requests and has no Meta model integration configured; no live model call was made.
- Question preview is allowlisted to `recipientId`, `alias` and `questionText`; consent is required before the UI shows a local fictional reply. Nothing is sent to a person.
- State is in memory only and resets on refresh. There is no login, database, external messaging, real moderation, provider directory, booking, persistence or safety monitoring.
- A pseudonym does not guarantee anonymity. Leaving the page does not erase browser history. This demo is not therapy, legal advice, emergency support or clinical care.

The earlier Beyond Silence video files record a previous prototype direction; do not use them as a walkthrough of the current Harmonise interface.
