# v13 verification

The v13 candidate is a 178-second edit of a fresh 183.44-second Playwright recording of the real local React preview. It ends on the captured agency summary: the selected private takeaway, optional one-thing-for-Dev draft, fictional/local label, unchecked consent, disabled posting, and no-send boundary.

- Candidate: `demo.mp4`, H.264 1920×1080 at 30 fps, 178.766667-second video stream; AAC mono 48 kHz, 178.752-second audio stream. Audio/video delta: 14.7 ms. Full FFmpeg decode passed.
- Audio: mean -19.0 dBFS, peak -4.0 dBFS. The last spoken line is detected to 176.969s, 1.798 seconds before video end. The final SRT cue runs to 177.580s. No black interval over 0.5 seconds was detected.
- Captions: 41 burned-in SRT cues, chronological and non-overlapping, without repeated punctuation. Last cue ends before the end of the picture.
- Opening: directly extracted frame 0 shows Arjun’s first-person line, the fictional/prepared/no-model label, audience and private-first proposition, role sequence, and planned/not-connected Muse note. At 4.5 seconds the promise remains legible; actual Start privately conversation begins before 10 seconds.
- Correction: captured UI shows the prepared local response, actual Not quite action, edited words, and changed editable reflection. The planned Muse Spark role is described separately from prepared behavior.
- Community: a single prepared historical thread visits Day 4, Day 9, and Day 16; the fiction label, contrasting members, host boundary, and unanswered Dev question are visible. No report action is represented as routed or live.
- Sharing and support: one captured Ravi question edit leads to its exact group-only preview with alias, private-context exclusion, unchecked consent, and disabled continue. The unverified-provider caveat and return path appear once.
- Close: final frame was extracted directly from the MP4 and inspected at 1920×1080 and 960×540. It shows Arjun’s actual choice summary; no message is sent.
- Visual samples: `verification/contact.png` and `verification/contact-960.png`, with corresponding full/half-size key frames in `verification/final-frames/` and `verification/960/`.
- App validation (no app source changes): lint, typecheck, unit tests 27/27, desktop/mobile E2E 32/32, and production build passed. Capture smoke traversed all 20 marked states.
- Scope: frontend-only fictional fixtures and local rules. No live model, Meta service, human/community/moderator/provider action, or sending is connected. The professional-support view states that no provider is verified or bookable.
