# v19 candidate verification

V19 is a fresh Playwright recording of the local React application, edited into a 176.234-second film. The 12-second kinetic-type opening is an editorial product-story graphic; all following picture is captured React UI. UI footage totals 164.234 seconds (93.19%). The app itself was unchanged for v19.

The opening identifies a fictional Arjun and carries the adjacent prepared/no-model disclosure. It states the private-reflection proposition and shows the actual interactive product preview by 12 seconds. The recorded app sequence includes a prepared local reply, Arjun selecting “Not quite,” his edited words, and the changed editable reflection; planned Muse roles remain labeled planned and not connected. The community cut shows historical prepared Day 4/9/16 states, peer perspective, a fictional host boundary, and Dev's unanswered thread. Ravi's actual edited group-question preview appears once, including the exact audience and alias, excluded private context, unchecked consent and disabled continuation. The provider screen is presented as unavailable and the film returns to Arjun. The final actual app view shows his selected private takeaway, optional local draft for Dev, private context excluded, consent unchecked, post disabled, and explicit nothing-sent copy.

## Media checks

- `ffprobe`: H.264 1920×1080, 176.233333 s; AAC mono 48 kHz, 176.234000 s; stream delta 0.000667 s.
- Full FFmpeg decode completed without errors.
- SRT has 40 cues and no overlaps. Last cue ends at 175.325 s. Last speech ends about 174.87 s; measured silent tail is 1.525 s.
- Audio measured -19.7 dBFS mean and -3.7 dBFS peak.
- Inspected representative opening, entry, correction, Day 4/9/16 thread, Ravi preview, support return, and close frames at 960×540; verification also contains corresponding 1920×1080 stills.
- `narration.txt` is paired with the burned captions and uses synthetic Flite narration.

## App validation

- `npm run lint` passed.
- `npm run typecheck` passed.
- `npm test` passed, 27/27.
- `npm run build` passed.
- `CI= npm run test:e2e -- --workers=1` passed, 34/34 desktop/mobile tests against the already-running local server on port 3033. An attempted isolated server on 3044 could not start because a stale Next development server held the shared `.next` lock; the complete suite then passed against the existing server.
- Capture smoke passed all 22 scene markers before the full capture.

This is a frontend-only product preview using fictional, prepared local fixtures. No live Meta/API, AI model, community, moderator, provider, or message-sending integration is connected. The human/community roles shown are illustrative only.
