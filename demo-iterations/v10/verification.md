# v10 candidate verification

Scope: v10 implementation changes, actual React browser capture, final MP4, burned captions, SRT sidecar, and evidence frames. No judge score assigned by the builder.

## Application

- `npm run lint`, `npm run typecheck`, `npm run test:unit`, `npm run test:e2e -- --workers=1`, and `npm run build` passed before the full capture. Vitest: 27/27; Playwright: 32/32, including desktop and mobile.
- Capture smoke traversed all 18 scene transitions using the running React app. The full recording is a Playwright video of actual UI interaction, not an editorial screen tour. The first typed interaction follows Start privately at 9.421 seconds in the trimmed film (10.633 seconds in the raw capture).
- The filmed controls leave consent unchecked and posting disabled. Each example uses prepared local frontend data; no live model, API, Meta, speech transcription, message sending, provider service, or community/human moderation is connected.

## Media integrity

- `ffprobe`: 176.448-second MP4 container; H.264 video 1920×1080, 30 fps, 5,293 frames, 176.433 seconds; mono AAC audio, 48 kHz, 176.448 seconds. Audio/video stream delta: 0.015 seconds.
- Full FFmpeg decode completed with exit status 0. Video starts on the fictional Arjun entry screen and the final decoded frame is the composed agency choice; no black frame was found by the sampled black-frame scan.
- The 39 SRT cues are sequential, non-overlapping, and burned into the MP4. They start at 0.000 seconds; the final cue ends at 175.725 seconds. The final detected speech ends at 175.012 seconds, leaving 1.436 seconds to audio end. Audio mean level: −19.0 dBFS; peak: −3.4 dBFS.

## Film-visible checks

- Opening: the first screen names Arjun and the family pressure, carries the `Interactive product preview` and fictional/prepared/no-model disclosures, gives the private-first audience promise, shows the thought → possibility → correction sequence, and labels Muse Spark as planned/not connected.
- Correction: the footage shows the initial reflection, the explicit Not quite choice, Arjun’s typed correction, and the changed editable reflection with the prepared/no-model disclosure.
- Community: the historical fictional thread moves through Day 4, Day 9, and Day 16, with distinct member perspectives, a host boundary, Dev’s unanswered post, and a prepared moderation example. No report is submitted.
- Ravi: Arjun edits the exact group question; the visible preview changes. Ravi is group-replies-only, with no private-message option. The alias/audience are visible, private context is excluded, consent remains unchecked, and continuation is disabled.
- Support: the real preview screen says no provider is verified or bookable; the capture returns to peer content.
- Close: Arjun has selected a private takeaway and an optional local Dev draft. The final composed UI shows the exact selected content, private context excluded, consent unchecked, posting disabled, and `Nothing is sent without consent.`

## Visual evidence and limitations

Extracted final-video frames are in `verification/frames/` at full resolution and 960×540 for the opening, correction, Ravi preview, and final choice. The 960×540 sampled controls, audience labels, exact preview, checkbox, disabled actions, and close disclosure remain readable.

The voice is synthetic offline Flite narration. Fictional participants, perspectives, historical posts, host/moderation examples, and prepared responses are not live people or community activity. Muse roles are planned only; no model is connected. The provider screen is a caveat and return path, not a verified service. The local draft is not sent.
