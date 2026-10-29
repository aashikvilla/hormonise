# v09 acceptance evidence

The candidate was captured from actual Playwright interactions with the local React application. The opening shows the audience and a three-step correctable-reflection example before the user chooses **Start privately**; the first typed interaction appears at 10.944 seconds in the raw capture. The capture then shows the corrected editable reflection, the Day 4/9/16 prepared thread, a prepared no-report example, Ravi question edit and exact changed group preview, professional-support caveat and return, and Arjun's selected private takeaway plus optional local Dev draft.

The final screen is an actual application state entered with **Review my choices**. It retains the local selected draft, excluded private context, unchecked consent and disabled post control and states **Nothing is sent without consent**. No send, publication or reply occurs.

The final MP4 is 1920×1080 at 30 fps. `ffprobe` reports 176.400 seconds of video and 176.428 seconds of AAC audio, a 28 ms difference. Full FFmpeg decode exits successfully. The audio measures -20.8 dBFS mean and -3.8 dBFS peak. The final speech ends at 174.939 seconds, leaving 1.509 seconds of silence. The burned-in captions and SRT sidecar contain 19 non-overlapping cues; the final cue ends at 175.641 seconds.

Full-resolution and 960×540 frames are saved under `verification/` at each required beat. The first frame is already the entry screen, with no white or black opening flash. Captions remain in the lower safe band and do not obscure the opening cards, correction text, Ravi consent controls or final choice panel.

Application checks passed after the v09 source change: `npm run lint`, `npm run typecheck`, `npm test` (27/27), `PORT=3033 PLAYWRIGHT_BASE_URL=http://127.0.0.1:3033 npm run test:e2e -- --workers=1` (32/32 desktop and mobile), and `npm run build`. A separate FAST_CAPTURE smoke traversed all 15 recorded UI scenes.

All scenarios and community members are fictional prepared examples. Muse Spark, transcription, community, moderation, provider availability, authentication, persistence and sending are not connected. No score is assigned here; cold judge and release verification are separate.
