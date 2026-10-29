# v05 verification

- Browser smoke: `FAST_CAPTURE=1` completed the complete React flow, including entry, correction, branch, Ravi group-only consent preview and prepared response, bounded Dev contribution preview/post, the actual provider caveat screen, status card, and agency close.
- Full browser capture: completed as an actual Playwright capture at 1600×900. No app source was changed; the synthetic/editorial card is labeled `EDITORIAL STATUS CARD - NOT AN APP INTERACTION`.
- First frame: trim removes the initial `Opening the guided demo…` loading screen. Frame 0 and subsequent milestones were reviewed at 1920×1080 and 960×540.
- Media: 178.000 seconds, 1920×1080, 30 fps H.264, AAC mono 48 kHz. Full FFmpeg decode exited 0.
- Audio: synthetic offline Flite narration only; mean volume −20.7 dBFS, peak −2.9 dBFS. Captions are burned in and provided in `captions.srt` (14 sequential cues ending at 177.8s).
- Readability review: entry hook and fiction disclosure, correction draft, exact Ravi audience/alias/question/unchecked consent, provider caveat, planned role card at 960×540, and agency close were inspected. The screen states nothing is sent and no private message is offered.
- No lint/typecheck/unit/E2E/build suite rerun because this v05 change contains no application source changes. The actual browser smoke and full capture were run against the existing app.
- No live Meta service, model, authentication, database, real group, moderator, report-routing, verified provider, or professional service was used or implied. The professional path explicitly says no provider directory or credential checks are connected and none is verified/bookable.
