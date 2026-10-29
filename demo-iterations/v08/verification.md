# V08 candidate verification

- `demo.mp4` is 176.788 seconds (container and audio); its H.264 video stream is 176.766667 seconds, 0.021333 seconds shorter, at 1920×1080/30fps with 5,303 frames. AAC mono audio is 48 kHz. A complete FFmpeg decode exits 0.
- Offline synthetic Flite narration only. `captions.srt` has 19 sequential, non-overlapping cues. The final cue ends at 176.224 seconds, 0.564 seconds before the container/audio end. Audio measures mean -20.3 dBFS and peak -3.8 dBFS.
- The full Playwright React recording is preserved at `capture/react-capture-full.webm` (190.920 seconds). `capture/react-capture.webm` is an exact 178.000-second frame-copy derivative from that same recording and is the render source. `capture/timeline.json` records the 13 scenes. No UI was fabricated in the video editor.
- Key frame exports are in `verification/` at both 1920×1080 and 960×540. At both sizes, the opening entry choice and fiction label, before/after correction with editable text, day thread, exact edited Ravi preview, support caveat/return, and final selected takeaway plus Dev draft were inspected. The two correction states use an editorial crop to keep captions below the app content and clear of controls.
- Full-path capture smoke passed through the correction, Ravi question edit, support return, private takeaway, selected bounded contribution and editable Dev draft. Ravi and Dev consent remain unchecked, and both post/send controls remain disabled.
- Code checks passed after source changes: `npm run lint`, `npm run typecheck`, `npm test` (27/27), Playwright E2E (32/32 desktop/mobile), and `npm run build`.
- The preview is frontend-only. All sample people, messages, groups, moderation and historical posts are fictional local fixtures. No live Meta/API, model, speech transcription, community, moderator, provider, or human action is connected.
- V07 is unchanged. Earlier v08 capture/render attempts are retained and clearly named under `capture/attempts/` for audit; `demo.mp4` and `captions.srt` are the final candidate files.

No score was assigned by the builder.
