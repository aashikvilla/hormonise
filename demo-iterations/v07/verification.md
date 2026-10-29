# V07 technical verification

- App capture is a new full Playwright recording of actual React controls at 1600×900. `capture/timeline.json` records the scenes. The final source recording is 177.000 s. A complete earlier 172.760 s take is retained under `capture/attempts/` for audit of the duration correction.
- Candidate `demo.mp4` is 1920×1080 H.264/AAC mono 48 kHz, 30fps, 5,280 video frames, exactly 176.000 s. `ffprobe` reports container/video/audio at 176.000 s with stream delta 0.000 s. Full decode using `ffmpeg -v error -i demo.mp4 -f null -` exits 0.
- Audio is offline synthetic Flite only; measured mean -20.4 dBFS and peak -3.9 dBFS. No model generated the in-app local response.
- `captions.srt` has 19 sequential, non-overlapping cues; last cue ends at 154.072 s and no cue contains doubled terminal punctuation. Captions are burned into the MP4 and supplied as a sidecar.
- Full-size and 960×540 images are included for opening (0/4/8s), correction (22s), Day4/Day9/triage/Day16 (50/68/84/95s), Ravi audience consent (114s), support (129s), Maybe later (134s), and final bounded preview (139/165s). Crop/padding keeps community/triage labels and the Ravi/final share controls clear of captions.
- Playwright FAST_CAPTURE smoke passed all actual interactions. After source changes: `npm run lint`, `npm run typecheck`, `npm test` (27/27), isolated E2E (28/28 desktop+mobile), and `npm run build` passed.
- No app backend or live API/auth/database/community/model integration was added. Every participant and thread is fictional/prepared, triage is a local illustrative view, and no message/report reaches a person. Professional support is not verified/bookable.
