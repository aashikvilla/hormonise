# Three-minute film capture checklist

**Status:** the Harmonise Deep Human Journey v3 film was browser-captured and verified on 2026-10-28. Runtime is **173.500 seconds (2:53.5)**, under the 180-second limit. It has a two-second opening card and a silent, live-interaction screen capture with burned-in narration captions.

## Capture and review

- [x] Captured the existing Next.js app in Chromium at 1920×1080 with a fresh browser context.
- [x] Used the actual composer to show a hesitant draft, revision, send, contextual selectable answer, further messages, and correction of a tentative interpretation.
- [x] Demonstrated recording permission, stop, transcript review/edit, and explicit send. The app clearly says transcription is not connected; the text was typed by the user in the review field.
- [x] Confirmed the user-selected family-pressure context and choice to explore human perspectives.
- [x] Rejected the broad legal-topic result and captured the changed discovery view. This context comparison and reranking are deterministic illustrative fixtures, not model output.
- [x] Opened the relevant fictional community and read contrasting fictional accounts from Nisha, Mira, and Ravi without joining.
- [x] Reviewed the exact recipient, `QuietRiver` alias, and question before explicit consent. The prepared response is labeled fictional and no message was sent.
- [x] Edited and kept a personal takeaway, chose a next step, and opened a later life chapter separately without carrying the relationship context.
- [x] Captured no outbound requests or browser page errors.
- [x] Reviewed the opening, discovery, share-preview, and closing frames at full 1920×1080 resolution.
- [x] Verified the final H.264 video with `ffprobe` and decoded the entire file with FFmpeg.

## Measured sequence

Times below are approximate film timestamps from the captured browser interaction events, including the two-second title card.

| Beat | Film time | Evidence shown |
|---|---:|---|
| Opening and hesitant draft | 0:00–0:14 | Harmonise title and fictional-participant credit, then Arjun revises an unsent thought in the conversation composer. |
| Conversation, voice review, and correction | 0:14–1:02 | Multiple user turns and example replies; voice recording and manual transcript review; Arjun says he does not want a relationship verdict. |
| Confirmed need and contextual discovery | 1:02–1:26 | Arjun confirms what he wants; rejects the broad legal topic and sees the family-pressure context result move forward. |
| Contrasting human perspectives | 1:26–1:50 | Nisha, Mira, and Ravi are explored as fictional, distinct lived-experience examples; Ravi's differences and unknowns remain visible. |
| Exact share and consent | 1:50–2:10 | Ravi's recipient, alias, and question are reviewed; consent is explicit; a prepared fictional response follows. |
| User-owned takeaway | 2:10–2:38 | Arjun edits and keeps a thought privately and chooses a next step. |
| New chapter and continuity | 2:38–2:53.5 | A new city chapter starts separately; the journey shows both chapters and the context boundary. |

## Final artifacts

- Video: [`demo/harmonise-deep-human-journey-v3.mp4`](../demo/harmonise-deep-human-journey-v3.mp4)
- English caption sidecar: [`demo/harmonise-deep-human-journey-v3.en.srt`](../demo/harmonise-deep-human-journey-v3.en.srt)
- Narration-ready script: [`demo/harmonise-deep-human-journey-v3.voiceover.md`](../demo/harmonise-deep-human-journey-v3.voiceover.md)
- Encoding: MP4, H.264, 1920×1080, 24 fps, yuv420p; 3,001,654 bytes; no audio stream
- Duration: **173.500000 seconds**
- Capture source: two-second title card plus 1,715 Chromium frames sampled at 10 fps while actual browser controls drove the journey

The SRT text is burned into the MP4 and also provided as a sidecar. No synthetic narrator or voice actor was available; the separate script is ready for a narrator to record. All characters, community content, story rankings, responses, and questions are local fictional fixtures. No Meta model call, Muse transcription, actual human message, database write, live community activity, or moderation action occurred. Do not present this film as evidence of Meta inference.
