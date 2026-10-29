# V18 verification

The v18 cut reuses v13's compact narrative and screen sequence. It adds the opening value clarification and records Arjun's actual `Keep this takeaway privately` selection after his correction, then repeats that selected state at the close. All footage comes from a fresh Playwright recording of the local React app.

The preview and community content are fictional and prepared. No model, Meta API, live community, moderator, provider directory, booking service, or message sending is connected. Narration is synthetic Flite speech; captions are burned into the MP4 and shipped as `captions.srt`.

## Media checks

- 1920×1080 H.264 video, 48 kHz AAC audio.
- Video stream 176.066667 seconds; audio stream 176.064 seconds; delta 0.002667 seconds.
- Full FFmpeg decode passed.
- 41 subtitle cues; zero overlaps; final cue ends at 174.98 seconds. Last speech ends approximately 1.53 seconds before stream end; measured silent tail is 1.69 seconds, under two seconds.
- Audio peak measured at -3.3 dBFS.
- Opening, correction, selected private takeaway, Day 4/9/16 thread, edited Ravi preview, support caveat and return, and ending were extracted at full size and 960×540. The final half-size frame shows the selected takeaway, optional Dev draft, private-context exclusion, unchecked consent, disabled posting, and “Nothing is sent.”
- The final frame maps to the actual captured composed agency-close UI state, not the subsequent scroll transition.

## Application checks

- `npm run lint` passed.
- `npm run typecheck` passed.
- `npm test` passed (27/27).
- Desktop/mobile Playwright E2E passed (34/34) on isolated port 3033.
- `npm run build` passed.
- Fresh capture smoke passed across all 21 scene markers, including the actual private-takeaway click and subsequent selected state.

The candidate is a frontend-only product preview and makes no claim that a real person, community, service, model, or provider acted.
