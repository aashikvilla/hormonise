# Three-minute film capture checklist

**Status:** rehearsal captured and verified on 2026-10-28. The final film is 178.417 seconds (2:58.4), under the 180-second limit. It opens with a two-second editorial title card before the captured app landing screen. It is a silent screen capture with burned-in narration captions; the English `.srt` sidecar contains the timed narration text.

## Capture setup and observed behavior

- [x] Ran the flow in the existing local Next.js app in Chromium at a 1920×1080 viewport. A fresh browser context provided the reset state.
- [x] Confirmed the persistent `Illustrative scenario · fictional participants` disclosure is visible.
- [x] Used actual app buttons to complete the scenario: Arjun's correction, support preference, understanding map, C0/C1 comparison, T1/T2 discussions, Nisha read-only story, Ravi's R1–R3 experience, exact recipient/alias/question preview, explicit consent, prepared response, selected private takeaway, separate New City chapter, and the two-chapter journey recap.
- [x] Confirmed the consent checkbox was selected before proceeding. The reply remains labeled **Prepared illustrative reply** and identifies Ravi as fictional.
- [x] Captured no external requests and no browser page errors during the recorded walkthrough.
- [x] Captions and selected output frames were reviewed at 960×540. The film has no audio stream; no synthetic voice was added.

## Measured scene timestamps

Times are relative to the first captured frame and rounded to the nearest tenth of a second. Individual milestone times come from the Playwright-driven session; the video was encoded from 1,764 actual 1920×1080 Chromium viewport captures sampled at 10 fps.

| Beat | Measured window | Observed interaction / content |
|---|---:|---|
| Editorial cold open and landing screen | 0:00–0:13.3 | Two-second cream title card with “Advice is everywhere. Feeling understood isn't.”, Harmonise, and fictional-participant credit; the captured app landing screen follows at 0:02.0 |
| Private conversation and correction | 0:13.3–0:37.5 | Conversation opens at 0:13.3; Arjun corrects the tentative interpretation at 0:20.5; names the perspective he wants at 0:27.5 |
| Confirmable understanding map | 0:37.5–0:58.5 | His words, possible interpretation, and selected support remain distinct |
| C0/C1 comparison and community | 0:58.5–1:16.5 | Topic-only/context-aware comparison at 0:58.5; community and T1/T2 discussion view at 1:06.5 |
| Human perspectives | 1:16.5–1:43.5 | Nisha's read-only story at 1:16.5; Ravi's structured experience at 1:22.5, including differences and unknowns |
| Exact question, consent, prepared reply | 1:43.5–2:09.5 | Recipient preview at 1:43.5; consent checked at 1:50.5; prepared illustrative reply at 1:52.5 |
| Reflection and chosen takeaway | 2:09.5–2:29.5 | Arjun selects “A new perspective,” keeps a note privately, and chooses a next step |
| New chapter and continuity | 2:29.5–2:44.5 | Chapter 1 recap at 2:29.5; starts separately at 2:29.6; both chapters verified in Journey at 2:38.5; New City community at 2:38.6; Journey returns at 2:44.5 |
| Honest close | 2:44.5–2:58.4 | Journey keeps both chapters visible; closing captions state fictional provenance and that no Meta model call or real message occurred |

## Final artifact

- Video: [`demo/harmonise-final-film-rehearsal.mp4`](../demo/harmonise-final-film-rehearsal.mp4)
- Caption sidecar: [`demo/harmonise-final-film-rehearsal.en.srt`](../demo/harmonise-final-film-rehearsal.en.srt)
- Container/video: MP4, H.264, 1920×1080, 24 fps, yuv420p
- Duration: 178.416667 seconds (2:58.4), including no audio track
- File size: 3,722,879 bytes
- Source capture: two-second editorial title card followed by 1,764 Chromium frames at 1920×1080, sampled at 10 fps while real clicks drove the app
- Validation: full video decode succeeded; sample frames were extracted and reviewed at 960×540

## Demo narration and boundaries

The burned-in captions are the narration script. The film is intentionally silent; it does not contain a generated or participant voice. All participants, posts, stories, rankings, question routing, and the prepared reply are local fictional fixtures. No Meta model call, real message, database write, user account, live community activity, moderation action, or provider appointment occurs. The C0/C1 ranking is an illustrative mock comparison, not evidence of live model behavior. Meta-model inference remains a future integration and must be separately verified before a later film presents it as live.
