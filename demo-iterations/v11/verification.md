# v11 candidate verification

Scope: the v11 app state capture, edited React footage, MP4, burned captions, SRT sidecar, and supplied full/half-size frames. Builder did not assign a score.

## Application and capture

- No application/source code changes were needed. The existing UI supports the required actual paths; v11 uses local fictional fixtures only.
- `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`, and `PORT=3033 PLAYWRIGHT_BASE_URL=http://127.0.0.1:3033 npm run test:e2e -- --workers=1` passed. Vitest: 27/27. Playwright: 32/32 across desktop and mobile. An attempted isolated E2E server on port 3042 did not start because the repo's existing Next dev server holds the shared `.next` lock; the successful suite reused the already running 3033 server without stopping it.
- Fast capture smoke and the fresh full Playwright recording both traversed all 18 actual React scene transitions. The 177.160-second raw capture is 1600×900 at 25fps. Start privately is selected and the first typed interaction occurs 9.404 seconds into the edited film.
- The capture assertions verify that Ravi consent remains unchecked, the optional Dev consent remains unchecked after editing, and posting stays disabled. No message/report/post is submitted.

## Media integrity

- `ffprobe`: 178.013-second container and AAC audio; H.264 video is 1920×1080 at 30fps, 5,339 frames, 177.967 seconds. Audio/video duration difference: 0.046 seconds.
- Full FFmpeg decode exits 0. The first frame is the fictional Arjun entry; the final shot is the composed private takeaway and unsent optional draft. No black frame was found in the sampled final-video frames.
- The SRT has 39 sequential, non-overlapping cues and is burned into the MP4. The last cue ends at 177.388 seconds; last speech ends at 176.772 seconds, leaving 1.254 seconds to audio end. Audio mean: −19.4 dBFS; peak: −3.8 dBFS.
- The edit uses 47 real source shots; none is held over five seconds. The output cut plan moves through the entry (0–15s), correction (15–43s), Day 4/9/16 thread (43–70.056s), Ravi preview, support return, takeaway, optional draft, and final choice.

## Film-visible checks

- Opening: the first frame names Arjun's uncertainty and keeps the fictional label visible. The first pull-back reveals Harmonise, `Interactive product preview`, the private-first audience promise, all three mechanism cards, and `Start privately`. The planned Muse Spark/no-connection narration and caption ends at 11.090 seconds; the current prepared/no-model note remains visible beside the cards.
- Correction: the connected edit shows the prepared local reply, explicit Not quite action, Arjun's typed words, and changed editable reflection. `Prepared local example · no model connected` stays adjacent; planned Muse Spark is described as organizing themes for review, not deciding truth.
- Community: the same prepared historical thread moves through Day 4, Day 9 and Day 16. Fictional peer perspectives, the host's “I can listen; I can’t decide for you” boundary, the prepared no-report beat, and Dev's unanswered question are visible. No live reply or moderation action is claimed.
- Ravi: the actual editor and exact changed group-only preview show alias, audience and text. Private context is excluded; consent is unchecked and continuation disabled.
- Support: the actual screen says no provider is verified or bookable, then returns to peer perspectives.
- Close: Arjun's selected private takeaway sits beside the selected optional local Dev draft. The final composed view states private context is excluded, consent unchecked, post disabled, and `Nothing is sent without consent`.

## Visual evidence and limitations

`verification/frames/` contains sampled 1920×1080 and 960×540 key frames for the opening/pull-back, correction, Day 9/16, Ravi audience preview, and final choice. At both sampled sizes, the opening label/promise/mechanism, correction options/edited words, community dates/unanswered status, Ravi audience/checkbox, and close disclosure are readable. Captions sit below the focused content in the sampled frames.

Narration is synthetic offline Flite. All people/posts/replies and moderation examples are fictional prepared content. No live model, Meta/API, community, moderator, provider, voice transcription, authentication, database, or message-sending integration is connected. The support route is a limitation and return path, not a verified service.
