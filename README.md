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

[Watch or download the final film](demo/harmonise-final-film-rehearsal.mp4) · [English SRT sidecar](demo/harmonise-final-film-rehearsal.en.srt). The video is 2:58.4, 1920×1080 H.264, silent, with English captions burned in.

## Deploy to GitHub Pages

For the one-time repository setup, open **Settings → Pages** and set **Build and deployment → Source** to **GitHub Actions**. After that, pushes to the `main` branch run the workflow in `.github/workflows/deploy-pages.yml`, which checks the app, builds its static export, and deploys it. The expected project site URL is <https://aashikvilla.github.io/hormonise/>.

## Three-minute rehearsal

The complete flow uses selectable sample answers; no typing is required. Target 176–179 seconds and keep the fictional-content disclosure visible at the beginning and end.

1. **0:00–0:12 — Start with care.** Choose **Follow Arjun's illustrative story**. Frame the need: “When something feels personal, a person may not yet know what to search for.”
2. **0:12–0:35 — Let Arjun correct the first read.** Select **Not quite — the pressure is from my family**, then **Hear how others handled that pressure, without advice**. The screen preserves Arjun's exact words and the assistant's tentative wording.
3. **0:35–0:53 — Confirm the map.** Choose **Review understanding**. Show the three layers—his words, possible interpretation, and the support he wants. Point out that family expectations and personal autonomy are confirmed while relationship uncertainty is set aside. Continue with **Find human perspectives**.
4. **0:53–1:13 — Show why context matters.** Explain C0, **Separation paperwork and settlement basics**, and C1, the family-expectations community. These are source-labeled illustrative fixtures, not a live AI result or a match score. Open **Family Expectations & Personal Choices**.
5. **1:13–1:33 — Visit the human space.** In Experiences, briefly show Nisha's T1 and Ravi's T2 posts with replies, then open Ravi's story. The **R1–R3** timeline separates what he tried, what he reported as helpful, and what remained unresolved. Mention that Ravi had a trusted friend; Arjun has not said he does.
6. **1:33–2:02 — Make connection optional and consentful.** Select **Ask Ravi**. Review the exact alias and recipient, edit the prepared question if desired, check the consent box, and choose **Continue to prepared response**. Identify the response as prepared and illustrative; no person is contacted.
7. **2:02–2:28 — Keep only what Arjun chooses.** Continue to reflection. Select **A new perspective**, choose an optional next step, and keep the editable takeaway privately. Say that this remains local to the current session.
8. **2:28–2:49 — Preserve a boundary across chapters.** Choose **View my journey**. Show his opening words, confirmed need, explored perspectives, and selected takeaway. Choose **Start separately** for the New City chapter to demonstrate that relationship context is not carried over.
9. **2:49–3:00 — Close honestly.** State that participants and content are fictional and that no Meta model inference, real messaging, or moderation ran. Meta inference is a planned integration, not part of this build.

### 120-second fallback

Choose **Follow Arjun's illustrative story** → select the family-pressure correction and the no-advice preference → review and confirm the understanding map → show the C0/C1 comparison → open the family community and Ravi's story → review the exact question and consent → show the prepared illustrative reply → keep the takeaway → start the new-city chapter separately. Skip the comparison drawer, other tabs, and contributor view.

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
