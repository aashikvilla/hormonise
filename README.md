# Harmonise

An incremental upgrade of the existing Beyond Silence Next.js application. Harmonise helps a person explore what they want, read relevant community experiences, and decide what—if anything—they want to share. Communities and people provide the human value; interpretation and ranking in this build use local, deterministic fixtures.

## Run locally

Requirements: Node.js 20.9+ and npm.

```bash
npm ci
npm run dev
```

Open <http://localhost:3000>. Start with **Follow Arjun's illustrative story** for the guided walkthrough, or choose any of the four entry paths. `/demo` opens the in-app entry chooser; `?path=quiet`, `?path=support`, and `?help=safety` open specific paths.

## Final demo video

[Watch or download the v3 film](demo/harmonise-deep-human-journey-v3.mp4) · [English SRT sidecar](demo/harmonise-deep-human-journey-v3.en.srt) · [Narration-ready script](demo/harmonise-deep-human-journey-v3.voiceover.md). It runs 2:54.4 at 1920×1080 H.264. The MP4 is intentionally silent; narration text is burned in as captions, and the SRT is supplied separately for accessibility and recording.

## Deploy to GitHub Pages

For the one-time repository setup, open **Settings → Pages** and set **Build and deployment → Source** to **GitHub Actions**. After that, pushes to the `main` branch run the workflow in `.github/workflows/deploy-pages.yml`, which checks the app, builds its static export, and deploys it. The expected project site URL is <https://aashikvilla.github.io/hormonise/>.

## Three-minute rehearsal

This measured browser walkthrough is 2:54.4. Keep the fictional-participant disclosure visible and use the timed SRT when recording narration.

1. **0:00–0:14 — Hesitate and revise.** Let the opening title card play. In the conversation composer, type `Everything is fine...`, pause, then revise to `I don't know... things at home feel weird lately.`
2. **0:14–0:38 — Build context in conversation.** Send the opening, choose **With someone**, then send `Maybe my wife. We aren't always arguing. I can talk with her.` Let the fixture response ask what feels hard without requesting details.
3. **0:38–1:02 — Try voice, review, and correct.** Choose **Use voice**, record briefly, then **Stop and review**. Since transcription is not connected in this build, type the words into the editable transcript and send them. When the tentative understanding appears, choose **Not quite** → **Edit in my words**, send `I don't want someone telling me to stay or leave.`, then choose **Yes, that’s closer** and **Hear experiences**.
4. **1:02–1:26 — Reject a poor fit.** Show the contextual family-pressure result. Choose **Not for me · change these results** on the broad legal-topic result and note that the displayed discovery changes. This is a deterministic illustrative comparison, not a Meta result.
5. **1:26–1:50 — Read contrasting stories.** Open the family community and read Nisha, Mira, then Ravi. Highlight what Ravi tried and reported helpful, what did not help, and that he had a trusted friend Arjun has not reported.
6. **1:50–2:10 — Review and consent.** Choose **Ask Ravi**. Review Ravi, alias `QuietRiver`, and the exact question. Check consent and continue to the clearly labeled prepared fictional reply; no real person receives a message.
7. **2:10–2:38 — Choose a takeaway.** Continue to reflection, select **A new perspective**, edit the note to `I want to hear myself think before I ask others for answers.`, choose an optional next step, and click **Keep privately** then **View my journey**.
8. **2:38–2:54 — Start a new chapter separately.** Show the journey recap and choose **Start separately**. Return to **My journey** to show both chapters and that the previous relationship context did not carry forward.

The capture has no recorded or synthetic narration. The narration-ready text is in the linked script; all voice, Meta, and fictional-content limits are stated there and in the closing captions.

## Verification

```bash
npm run lint
npm run typecheck
npm test
npm run build
npm run test:e2e -- --workers=1
```

Playwright covers desktop at 1920×1080 and mobile at 390×844 (plus a 320px overflow check). Browser screenshots are written to `/tmp/harmonise-*.png`. See [the migration map](docs/harmonise-migration-map.md) and [UX/accessibility review](docs/harmonise-quality-review.md) for implementation and review evidence.

## Prototype boundaries

- People, communities, experiences, discussion posts and the contributor reply are fictional sample data. They are not testimonials or live users.
- The guided conversation and contextual ordering are mock behavior. Arbitrary typed answers are not interpreted. The app makes no application API requests and has no Meta model integration configured; no live model call was made.
- Question preview is allowlisted to `recipientId`, `alias` and `questionText`; consent is required before the UI shows a local fictional reply. Nothing is sent to a person.
- State is in memory only and resets on refresh. There is no login, database, external messaging, real moderation, provider directory, booking, persistence or safety monitoring.
- A pseudonym does not guarantee anonymity. Leaving the page does not erase browser history. This demo is not therapy, legal advice, emergency support or clinical care.

The earlier Beyond Silence video files record a previous product direction; use this rehearsal sequence for the current Harmonise interface.
