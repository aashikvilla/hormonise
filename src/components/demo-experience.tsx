"use client";

import Link from "next/link";
import { useEffect, useReducer, useRef, useState } from "react";
import {
  fixtures,
  getPublicExperiences,
  getRecommendedCommunities,
  harmoniseReducer,
  stateForEntry,
  themeLabels,
  type CommunityTab,
  type EntryPath,
  type HarmoniseAction,
  type HarmoniseState,
  type ThemeId,
} from "@/lib/harmonise";
import { hasFamilyContext, replyForUserMessage } from "@/lib/conversation";

const navItems = [
  { label: "Explore", screen: "conversation" as const },
  { label: "Communities", screen: "discovery" as const },
  { label: "My journey", screen: "journey" as const },
  { label: "Contribute", screen: "contribute" as const },
  { label: "Help & safety", screen: "help" as const },
];

const communityTabs: { id: CommunityTab; label: string }[] = [
  { id: "experiences", label: "Experiences" },
  { id: "discussions", label: "Discussions" },
  { id: "people", label: "People" },
  { id: "guidelines", label: "Guidelines" },
];

function Brand() {
  return <Link href="/" className="brand" aria-label="Harmonise home"><span className="brand-mark" aria-hidden="true">h</span><span>Harmonise</span></Link>;
}

function Notice({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "neutral" | "human" | "private" }) {
  return <p className={`notice notice-${tone}`}>{children}</p>;
}

function PrimaryButton({ children, onClick, disabled = false, type = "button" }: { children: React.ReactNode; onClick?: () => void; disabled?: boolean; type?: "button" | "submit" }) {
  return <button type={type} className="button button-primary" onClick={onClick} disabled={disabled}>{children}</button>;
}

function SecondaryButton({ children, onClick, disabled = false }: { children: React.ReactNode; onClick?: () => void; disabled?: boolean }) {
  return <button type="button" className="button button-secondary" onClick={onClick} disabled={disabled}>{children}</button>;
}

function textForTheme(theme: ThemeId) {
  return themeLabels[theme];
}

function activeCommunity(state: HarmoniseState) {
  return fixtures.communities.find((community) => community.id === state.selectedCommunityId) ?? null;
}

function activeExperience(state: HarmoniseState) {
  return getPublicExperiences(state).find((experience) => experience.id === state.selectedExperienceId) ?? null;
}

function appHeading(state: HarmoniseState) {
  const headings: Record<HarmoniseState["screen"], string> = {
    entry: "A place to begin, at your pace",
    conversation: "Some things are hard to say out loud.",
    understanding: "Have I understood what matters?",
    discovery: state.chapter === "belonging" ? "Find a way to feel more connected" : "Explore communities and experiences",
    community: activeCommunity(state)?.name ?? "Community example",
    experience: "One person's experience",
    question: "Ask Ravi a question",
    reply: "A perspective from Ravi",
    reflection: "Was any part of this useful?",
    journey: "Your journey, in your words",
    contribute: "Share an experience by choice",
    help: "Help, safety and support roles",
  };
  return headings[state.screen];
}

export default function DemoExperience({ initialPath }: { initialPath?: Exclude<EntryPath, null> | "arjun" | "help" }) {
  const [state, dispatch] = useReducer(harmoniseReducer, initialPath, stateForEntry);
  const [chatTurns, setChatTurns] = useState<{ id: string; role: "you" | "harmonise"; text: string }[]>([]);
  const [composer, setComposer] = useState(initialPath === "arjun" ? "I don't know... things at home feel weird lately." : "");
  const [understandingConfirmed, setUnderstandingConfirmed] = useState(false);
  const [recordingState, setRecordingState] = useState<"idle" | "recording" | "review">("idle");
  const [recordingError, setRecordingError] = useState("");
  const [transcriptDraft, setTranscriptDraft] = useState("");
  const recorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const previousScreenRef = useRef(state.screen);
  const community = activeCommunity(state);
  const experience = activeExperience(state);
  const recommended = getRecommendedCommunities(state);
  const publicExperiences = getPublicExperiences(state);
  const publicExperienceIds = community?.experienceIds ?? [];
  const shownExperiences = publicExperiences.filter((record) =>
    publicExperienceIds.includes(record.id) ||
    (community?.id === "community.family-expectations" && record.id === "experience.nisha")
  );
  const discussions = fixtures.discussions.filter((discussion) => community?.discussionIds.includes(discussion.id));
  const aliasValid = /^[A-Za-z0-9_]{3,24}$/.test(state.alias.trim());
  const questionValid = state.questionText.trim().length >= 12;
  const stateDispatch = dispatch as (action: HarmoniseAction) => void;

  useEffect(() => {
    if (previousScreenRef.current !== state.screen) headingRef.current?.focus();
    previousScreenRef.current = state.screen;
  }, [state.screen]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ block: "nearest" });
  }, [chatTurns.length]);

  useEffect(() => () => {
    mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
  }, []);

  function navigate(screen: (typeof navItems)[number]["screen"]) {
    if (screen === "conversation") stateDispatch({ type: "START_PATH", path: "talk" });
    if (screen === "discovery") stateDispatch({ type: "OPEN_DISCOVERY" });
    if (screen === "journey") stateDispatch({ type: "OPEN_JOURNEY" });
    if (screen === "contribute") stateDispatch({ type: "OPEN_CONTRIBUTE" });
    if (screen === "help") stateDispatch({ type: "OPEN_HELP" });
  }

  function restartJourney() {
    stateDispatch({ type: "RESTART" });
    stateDispatch({ type: "START_PATH", path: "talk" });
    setChatTurns([]);
    setComposer("");
    setUnderstandingConfirmed(false);
    setRecordingError("");
    setRecordingState("idle");
    setTranscriptDraft("");
  }

  function renderConversation() {
    function sendChat(text = composer) {
      const clean = text.trim();
      if (!clean) return;
      const turnNo = chatTurns.filter((turn) => turn.role === "you").length + 1;
      const next = [
        ...chatTurns,
        { id: `you-${turnNo}`, role: "you" as const, text: clean },
        { id: `guide-${turnNo}`, role: "harmonise" as const, text: replyForUserMessage(clean, turnNo, chatTurns.filter((turn) => turn.role === "you").map((turn) => turn.text)) },
      ];
      setChatTurns(next);
      setComposer("");
      setUnderstandingConfirmed(false);
    }

    async function startRecording() {
      setRecordingError("");
      if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
        setRecordingError("Voice recording isn’t available in this browser. You can keep typing here.");
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaStreamRef.current = stream;
        const recorder = new MediaRecorder(stream);
        recorderRef.current = recorder;
        recorder.start();
        setRecordingState("recording");
      } catch {
        setRecordingError("Microphone access wasn’t granted. You can continue by typing, or try again.");
      }
    }

    function stopRecording() {
      recorderRef.current?.stop();
      mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
      recorderRef.current = null;
      setTranscriptDraft("");
      setRecordingState("review");
    }

    function cancelRecording() {
      if (recorderRef.current?.state === "recording") recorderRef.current.stop();
      mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
      recorderRef.current = null;
      setRecordingState("idle");
      setTranscriptDraft("");
    }

    function exploreExperiences() {
      const family = hasFamilyContext(chatTurns);
      const mappedTurns = chatTurns.map((turn) => ({ id: turn.id, speaker: turn.role === "you" ? "arjun" as const : "guide" as const, text: turn.text }));
      stateDispatch({ type: "SYNC_CHAT_CONTEXT", turns: mappedTurns, themes: family ? ["family-expectations", "personal-autonomy"] : [], need: family ? "Perspectives on family expectations, without pressure to choose a relationship outcome." : "Explore without personal context" });
      setUnderstandingConfirmed(true);
      stateDispatch({ type: "OPEN_DISCOVERY" });
    }

    return <>
      <p className="lede">Start wherever you are. You can keep it broad, change direction, or simply read quietly.</p>
      <section className="panel conversation-panel organic-chat" aria-label="Conversation">
        <div className="chat-provenance">A local illustrative conversation · no AI service is connected</div>
        <div className="chat-log" aria-live="polite" aria-relevant="additions text">
          {chatTurns.length === 0 && <article className="conversation-turn turn-guide"><span>Harmonise</span><p>Some things are hard to say out loud. You can start wherever you are. What’s on your mind?</p></article>}
          {chatTurns.map((turn) => <article className={`conversation-turn ${turn.role === "you" ? "turn-arjun" : "turn-guide"}`} key={turn.id}><span>{turn.role === "you" ? "You" : "Harmonise · example reply"}</span><p>{turn.text}</p></article>)}
          <div ref={chatEndRef}/>
        </div>
        {chatTurns.filter((turn) => turn.role === "you").length === 1 && <div className="inline-chat-choices" aria-label="Optional response"><span>Only if it helps:</span>{["With someone", "How I feel", "Not sure"].map((choice) => <button key={choice} type="button" onClick={() => sendChat(choice)}>{choice}</button>)}</div>}
        {chatTurns.filter((turn) => turn.role === "you").length >= 3 && <section className="inline-understanding" aria-labelledby="understanding-inline-title">
          <div><span className="context-eyebrow">A THOUGHT TO CHECK</span><h2 id="understanding-inline-title">Have I got this right?</h2><p><strong>What you said:</strong> “{chatTurns.filter((turn) => turn.role === "you").at(-1)?.text}”</p><p><strong>Might matter:</strong> {hasFamilyContext(chatTurns) ? "family expectations and making your own choices. This is only a possible reading." : "I don’t have enough context to name a theme yet."}</p><p><strong>What you want now:</strong> {understandingConfirmed ? `${hasFamilyContext(chatTurns) ? "Hear lived experiences without a verdict" : "Explore without personal context"} · confirmed by you` : "Not confirmed yet"}</p></div>
          <div className="inline-chat-choices"><button type="button" onClick={() => setUnderstandingConfirmed(true)}>Yes, that’s closer</button><button type="button" onClick={() => setUnderstandingConfirmed(false)}>Not quite</button><button type="button" onClick={() => setComposer("I don't want someone to tell me to stay or leave.")}>Edit in my words</button></div>
          {understandingConfirmed && <div className="inline-chat-choices"><button type="button" onClick={exploreExperiences}>Hear experiences</button><button type="button" onClick={() => setComposer("")}>Keep talking</button></div>}
        </section>}
        {recordingState === "recording" && <div className="voice-review" role="status"><strong>Listening</strong><span>Recording stays in this browser and is not sent anywhere.</span><div className="inline-actions"><SecondaryButton onClick={stopRecording}>Stop and review</SecondaryButton><button className="text-button" onClick={cancelRecording}>Cancel recording</button></div></div>}
        {recordingState === "review" && <div className="voice-review"><strong>Review before sending</strong><p>Voice transcription is not connected here. Type or edit the words you want to send; no audio will be shared.</p><label className="field-label" htmlFor="voice-transcript">Your transcript</label><textarea id="voice-transcript" rows={3} value={transcriptDraft} onChange={(event) => setTranscriptDraft(event.target.value)} placeholder="Type what you said, or cancel and use the composer."/><div className="inline-actions"><PrimaryButton onClick={() => { sendChat(transcriptDraft); setRecordingState("idle"); setTranscriptDraft(""); }} disabled={!transcriptDraft.trim()}>Send this text</PrimaryButton><SecondaryButton onClick={cancelRecording}>Cancel</SecondaryButton></div></div>}
        {recordingError && <Notice>{recordingError}</Notice>}
        <form className="chat-composer" onSubmit={(event) => { event.preventDefault(); sendChat(); }}>
          <label className="sr-only" htmlFor="chat-input">Your message</label>
          <textarea id="chat-input" rows={2} value={composer} onChange={(event) => setComposer(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); sendChat(); } }} placeholder="Write a message…" />
          <div className="composer-actions"><span>Enter to send · Shift+Enter for a new line</span><div><SecondaryButton onClick={startRecording}>Use voice</SecondaryButton><PrimaryButton type="submit" disabled={!composer.trim()}>Send</PrimaryButton></div></div>
        </form>
      </section>
      <div className="inline-actions"><SecondaryButton onClick={() => stateDispatch({ type: "OPEN_DISCOVERY" })}>Explore quietly</SecondaryButton><button className="text-button" onClick={() => stateDispatch({ type: "OPEN_HELP" })}>How information is used</button><button className="text-button" onClick={() => { setChatTurns([]); setComposer(""); setUnderstandingConfirmed(false); }}>Start a fresh conversation</button></div>
    </>;
  }

  function renderUnderstanding() {
    const statements = state.turns.filter((turn) => turn.speaker === "arjun");
    const otherThemes: ThemeId[] = ["family-expectations", "relationship-uncertainty", "work-pressure", "relocation", "belonging", "personal-autonomy", "communication", "hobbies"];
    const mappedThemes = [...new Set([...state.proposedThemes, ...state.confirmedThemes, ...state.rejectedThemes])];
    return <>
      <p className="lede">I may have missed something. Keep, change or set aside each possible connection.</p>
      <div className="understanding-map" aria-label="Your words, possible meaning and chosen support">
        <section className="context-layer context-words"><span className="context-eyebrow">01 · YOUR WORDS</span><h2>What you said</h2>
          {statements.length ? <ul className="statement-list">{statements.map((turn) => <li key={turn.id}><span className="source-ref">{turn.id.toUpperCase()}</span>“{turn.text}”</li>)}</ul> : <p>You can still browse without adding personal context.</p>}
        </section>
        <div className="context-thread" aria-hidden="true"><span/></div>
        <section className="context-layer context-interpretation"><span className="context-eyebrow">02 · POSSIBLE INTERPRETATION</span><h2>What might matter</h2>
          {state.mockTextNotice && <p className="small-note">Your typed words were not interpreted. Choose only what you want to use.</p>}
          <fieldset className="context-theme-list"><legend>These are suggestions, not conclusions</legend>{mappedThemes.length ? mappedThemes.map((theme) => {
            const isConfirmed = state.confirmedThemes.includes(theme);
            const isRejected = state.rejectedThemes.includes(theme) && !isConfirmed;
            return <label className={`context-theme ${isRejected ? "theme-rejected" : isConfirmed ? "theme-confirmed" : ""}`} key={theme}><input type="checkbox" checked={isConfirmed} onChange={() => stateDispatch({ type: "TOGGLE_THEME", theme })}/><span className="context-theme-name">{textForTheme(theme)}</span><span className="theme-status">{isRejected ? "You set this aside" : isConfirmed ? "Confirmed by you" : "Possible link"}</span></label>;
          }) : <p>No themes were inferred from your new words.</p>}</fieldset>
          <details className="other-theme-details"><summary>Add a different topic</summary><div className="theme-options">{otherThemes.filter((theme) => !mappedThemes.includes(theme)).map((theme) => <label className="check-row" key={theme}><input type="checkbox" checked={state.confirmedThemes.includes(theme)} onChange={() => stateDispatch({ type: "TOGGLE_THEME", theme })}/><span>{textForTheme(theme)}</span></label>)}</div></details>
          <p className="small-note">Still unknown: the relationship outcome, and whether Arjun has a trusted confidant.</p>
        </section>
        <div className="context-thread context-thread-confirmed" aria-hidden="true"><span/></div>
        <section className="context-layer context-need"><span className="context-eyebrow">03 · YOUR CHOICE</span><h2>What you want now</h2><p className="confirmed-need">{state.confirmedNeed || "Choose what kind of support would feel useful."}</p>
          <div className="radio-options" role="group" aria-label="Choose what would help now">
            {([
              ["human-perspective", "Hear lived experiences without a verdict"],
              ["quiet-reading", "Read quietly"],
              ["shared-activity", "Find people through shared interests"],
              ["not-sure", "I'm not sure yet"],
            ] as const).map(([need, label]) => <label className="radio-row" key={need}><input type="radio" name="supportNeed" checked={state.supportNeed === need} onChange={() => stateDispatch({ type: "SET_SUPPORT_NEED", need, label })}/><span>{label}</span></label>)}
          </div>
        </section>
      </div>
      <div className="action-row"><SecondaryButton onClick={() => stateDispatch({ type: "BACK" })}>Back to conversation</SecondaryButton><PrimaryButton onClick={() => stateDispatch({ type: "CONFIRM_UNDERSTANDING" })}>Find human perspectives</PrimaryButton></div>
    </>;
  }

  function renderDiscovery() {
    const compare = state.chapter === "relationships" && state.confirmedThemes.includes("family-expectations");
    const contextualCommunity = fixtures.communities.find((item) => item.id === "community.family-expectations");
    return <>
      <p className="lede">Read a conversation, explore a story, or leave without joining.</p>
      {state.chapter === "belonging" && <section className="new-chapter-banner"><span className="context-eyebrow">A FEW WEEKS LATER · ILLUSTRATIVE</span><h2>New City, Feeling Lonely After Work</h2><p>{state.opening}</p><p>{state.carryPreviousContext && state.carriedTakeaway ? `You chose to bring this note: “${state.carriedTakeaway}”` : "You chose to start this chapter separately. Nothing from the earlier relationship conversation is used to shape these results."}</p><p className="small-note">This topic is about social connection, not an assumed cause or diagnosis.</p></section>}
      {state.quietReader && <Notice tone="private">Quiet reading · no alias, question or membership is needed to continue.</Notice>}
      {state.mockTextNotice && <Notice>Your new words weren&apos;t interpreted. These suggestions use only what you selected.</Notice>}
      {state.usefulness === "not-helpful" && <Notice>Thanks for saying so. You can choose a different kind of support, read another perspective, or stop here.</Notice>}
      {compare && contextualCommunity && <section className="relevance-compare" aria-labelledby="relevance-title"><div className="relevance-heading"><span className="context-eyebrow">WHY THIS COMMUNITY</span><h2 id="relevance-title">Not just similar words. Similar situations.</h2><p>No match scores—just the reasons behind this illustrative comparison.</p></div><div className="relevance-rail">{!state.rejectedBaseline && <><article className="relevance-result relevance-keyword" id="source-C0"><span className="relevance-label">C0 · Broad topic result</span><h3>{fixtures.topicOnlyBaseline.name}</h3><p>{fixtures.topicOnlyBaseline.explanation}</p><small>Source {fixtures.topicOnlyBaseline.sourceIds.map((source) => <a className="source-link" href={`#source-${source}`} key={source}>{source}</a>)}</small><button className="text-button" onClick={() => stateDispatch({ type: "REJECT_BASELINE" })}>Not for me · change these results</button></article><span className="relevance-arrow" aria-hidden="true">→</span></>}<article className="relevance-result relevance-context" id="source-C1"><span className="relevance-label">C1 · Your confirmed context</span><h3>{contextualCommunity.name}</h3><p>You said the pressure comes from family and asked for firsthand perspectives without a verdict.</p><small>Grounded in <a className="source-link" href="#source-C1">C1 · {contextualCommunity.evidenceIds.join(" · ")}</a></small></article></div>{state.rejectedBaseline && <Notice>Feedback noted. Broad legal-topic suggestions are set aside; family-pressure experiences are shown first.</Notice>}</section>}
      {state.noMatch || recommended.length === 0 ? <section className="panel no-match"><h2>There isn&apos;t a close fit in these communities.</h2><p>You can browse the available stories or return to change what matters. No people or activity will be invented.</p><div className="inline-actions"><SecondaryButton onClick={() => stateDispatch({ type: "SET_NO_MATCH", value: false })}>Browse all communities</SecondaryButton><SecondaryButton onClick={() => stateDispatch({ type: "BACK" })}>Change what you selected</SecondaryButton></div></section> : <div className="community-grid">
        {recommended.map((item) => <article className="community-card" key={item.id}>
          <div className="card-kicker">COMMUNITY</div><h2>{item.name}</h2><p>{item.purpose}</p>
          <p className="fit-reason"><strong>Why it may fit:</strong> {item.topicIds.filter((topic) => state.confirmedThemes.includes(topic as ThemeId)).map((topic) => themeLabels[topic as ThemeId] ?? topic).join(", ") || "Open browsing, with no personal context applied."}</p>
          <div className="chip-list">{item.topicIds.slice(0, 3).map((topic) => <span className="chip" key={topic}>{themeLabels[topic as ThemeId] ?? topic}</span>)}</div>
          <div className="card-actions"><SecondaryButton onClick={() => stateDispatch({ type: "OPEN_COMMUNITY", communityId: item.id })}>Explore community</SecondaryButton><button className="text-button" onClick={() => { stateDispatch({ type: "OPEN_COMMUNITY", communityId: item.id }); stateDispatch({ type: "SET_COMMUNITY_TAB", tab: "experiences" }); }}>Read experiences</button></div>
        </article>)}
      </div>}
      <div className="discovery-footer-actions"><SecondaryButton onClick={() => stateDispatch({ type: "SET_NO_MATCH", value: true })}>None of these feels relevant</SecondaryButton><button className="text-button" onClick={() => stateDispatch({ type: "OPEN_UNDERSTANDING" })}>Change themes</button></div>
    </>;
  }

  function renderCommunity() {
    if (!community) return <section className="panel"><h2>Choose a community to explore</h2><PrimaryButton onClick={() => stateDispatch({ type: "OPEN_DISCOVERY" })}>Back to communities</PrimaryButton></section>;
    return <>
      <div className="community-intro panel"><div><span className="tag tag-human">COMMUNITY PERSPECTIVES</span><h2>{community.name}</h2><p>{community.purpose}</p></div><div className="community-status"><span className="status-dot"/> Reading available<br/>No live activity</div></div>
      {community.id === "community.family-expectations" && <Notice tone="human"><strong>Example facilitator note · fictional role.</strong> People can disagree. Please speak from experience and avoid telling anyone what relationship decision to make. This example has no live moderator.</Notice>}
      <div className="why-panel"><strong>Why this community surfaced</strong><p>{state.confirmedThemes.length ? `You confirmed ${state.confirmedThemes.map((theme) => themeLabels[theme]).join(" and ")}. Related posts are grounded in ${community.evidenceIds.join(", ") || "the selected topics"}.` : "You chose to browse without sharing a personal topic."}</p></div>
      <div className="tab-list" role="tablist" aria-label={`${community.name} sections`} onKeyDown={(event) => {
        if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
        event.preventDefault();
        const current = communityTabs.findIndex((tab) => tab.id === state.communityTab);
        const offset = event.key === "ArrowRight" ? 1 : -1;
        const next = communityTabs[(current + offset + communityTabs.length) % communityTabs.length];
        stateDispatch({ type: "SET_COMMUNITY_TAB", tab: next.id });
        document.getElementById(`tab-${next.id}`)?.focus();
      }}>
        {communityTabs.map((tab) => <button key={tab.id} role="tab" aria-selected={state.communityTab === tab.id} aria-controls="community-tab-panel" id={`tab-${tab.id}`} tabIndex={state.communityTab === tab.id ? 0 : -1} className={state.communityTab === tab.id ? "tab selected" : "tab"} onClick={() => stateDispatch({ type: "SET_COMMUNITY_TAB", tab: tab.id })}>{tab.label}</button>)}
      </div>
      <section className="panel tab-panel" role="tabpanel" id="community-tab-panel" aria-labelledby={`tab-${state.communityTab}`}>
        {state.communityTab === "experiences" && <>
          {discussions.length > 0 && <div className="community-posts"><div className="panel-heading"><div><span className="tag tag-human">INSIDE THE COMMUNITY</span><h2>What people are talking about</h2></div></div>{discussions.map((discussion) => <article className="community-post" key={discussion.id} id={`source-${discussion.sourceId}`}><div className="post-meta"><span>{discussion.authorAlias}</span><span className="source-ref">{discussion.sourceId}</span></div><h3>{discussion.prompt}</h3><p>{discussion.preview}</p>{discussion.reply && <blockquote className="post-reply"><span>Another perspective · illustrative</span>{discussion.reply}</blockquote>}</article>)}</div>}
          <div className="panel-heading"><div><span className="tag tag-human">ILLUSTRATIVE EXPERIENCES</span><h2>Different lives, shared questions</h2></div></div>
          {shownExperiences.length ? <div className="story-list">{shownExperiences.map((record) => {
            const person = fixtures.contributors.find((contributor) => contributor.id === record.contributorId);
            const publicSummary = record.id === "experience.ravi" ? state.contributorSummary : person?.approvedSummary;
            return <article className="story-card" key={record.id}><div><span className="tag tag-person">Illustrative contributor · {person?.alias ?? "Contributor"}</span><h3>{record.milestones[0]?.title}</h3><p>{publicSummary ?? record.milestones[0]?.whatHappened}</p><p className="small-note">{record.id === "experience.ravi" && state.contributorAllowsQuestions ? "Ravi has chosen to receive one question in this scenario." : "Read-only story · no question route."}</p></div><SecondaryButton onClick={() => stateDispatch({ type: "OPEN_EXPERIENCE", experienceId: record.id })}>Read experience</SecondaryButton></article>;
          })}</div> : <p>No approved story is available in this example. You can return to the community list.</p>}
        </>}
        {state.communityTab === "discussions" && <>
          <span className="tag tag-human">ILLUSTRATIVE POSTS</span><h2>Questions people might explore</h2>
          {discussions.length ? discussions.map((discussion) => <article className="discussion-card" key={discussion.id}><p className="discussion-author">{discussion.authorAlias} · {discussion.sourceId}</p><h3>{discussion.prompt}</h3><p>{discussion.preview}</p>{discussion.reply && <blockquote className="post-reply"><span>Another perspective · illustrative</span>{discussion.reply}</blockquote>}</article>) : <p>No posts are included for this community yet. You can explore a different topic.</p>}
        </>}
        {state.communityTab === "people" && <><span className="tag tag-human">CONTRIBUTOR ROLES</span><h2>Who contributes here?</h2><div className="role-grid"><article><h3>Peer contributor</h3><p>Shares a personal account. Not a trained listener or a professional.</p></article><article><h3>Example facilitator · fictional role</h3><p>This prepared guidance is not live moderation. Reports are not sent or reviewed here.</p></article><article><h3>Qualified professional</h3><p>A separate support pathway. This service does not verify providers or offer appointments.</p></article></div><p className="small-note">No people are shown as online or available.</p></>}
        {state.communityTab === "guidelines" && <><span className="tag tag-private">COMMUNITY GUIDELINES · EXAMPLE</span><h2>Keep participation respectful</h2><ul className="guideline-list"><li>Experiences are perspectives, not instructions for someone else&apos;s choice.</li><li>Do not request private contact details or pressure someone to disclose.</li><li>Respect different decisions and leave when you want.</li><li>Use reporting for a human review process; no moderator is notified here.</li></ul><SecondaryButton onClick={() => stateDispatch({ type: "REPORT_EXAMPLE" })}>Report this example content</SecondaryButton>{state.reportShown && <Notice>Report example recorded in this browser only. No moderator was notified.</Notice>}</>}
      </section>
      <div className="action-row"><SecondaryButton onClick={() => stateDispatch({ type: "OPEN_DISCOVERY" })}>Back to communities</SecondaryButton><button className="text-button" onClick={() => stateDispatch({ type: "OPEN_JOURNEY" })}>Open my journey</button></div>
    </>;
  }

  function renderExperience() {
    if (!experience) return <section className="panel"><h2>This story is no longer available.</h2><SecondaryButton onClick={() => stateDispatch({ type: "OPEN_DISCOVERY" })}>Return to communities</SecondaryButton></section>;
    const person = fixtures.contributors.find((contributor) => contributor.id === experience.contributorId);
    const isRavi = experience.id === "experience.ravi";
    return <>
      <div className="story-detail-header panel"><span className="tag tag-human">{experience.attributionLabel}</span><h2>{person?.alias ?? "Contributor"}</h2><p>{isRavi ? state.contributorSummary : person?.approvedSummary}</p><p className="small-note">One person&apos;s account, not a recommendation for your decision.</p></div>
      <section className="panel timeline-panel"><h2>What {person?.alias ?? "this contributor"} reported</h2><ol className="timeline">{experience.milestones.map((milestone) => <li key={milestone.id} id={`source-${milestone.id}`}><span className="timeline-time">{milestone.relativeTime}</span><h3>{milestone.title}</h3><p><strong>What happened:</strong> {milestone.whatHappened}</p><p><strong>What he tried:</strong> {milestone.whatIActuallyTried}</p>{milestone.whatHelped && <p><strong>He said helped:</strong> {milestone.whatHelped}</p>}{milestone.whatDidNotHelp && <p><strong>He said did not help:</strong> {milestone.whatDidNotHelp}</p>}<p className="source-id">Source: {milestone.id}</p></li>)}</ol></section>
      <div className="two-columns"><section className="panel story-overlap"><span className="tag tag-suggestion">{isRavi ? "WHERE YOUR EXPERIENCES MEET" : "WHAT THIS ACCOUNT COVERS"}</span><h2>{isRavi ? "Space to think before others decide" : experience.milestones[0]?.title}</h2>{isRavi ? <><p><strong>Arjun said:</strong> “{fixtures.leadPersona.private.utterances[2].text}”</p><p><strong>Ravi wrote:</strong> “{experience.milestones[1]?.whatIActuallyTried}”</p><p className="source-id">Grounded in Arjun u3 and Ravi {experience.milestones.map((milestone) => milestone.id).join(", ")}</p></> : <><p>{experience.milestones[0]?.whatHappened}</p><p><strong>{person?.alias} tried:</strong> {experience.milestones[0]?.whatIActuallyTried}</p><p className="source-id">Source: {experience.milestones.map((milestone) => milestone.id).join(", ")}</p></>}</section><section className="panel difference-panel"><span className="tag tag-private">WHERE YOUR LIVES DIFFER</span><h2>What may not carry over</h2><ul>{experience.importantDifferencesFromArjun.map((difference) => <li key={difference}>{difference}</li>)}</ul>{experience.unknowns.map((unknown) => <p key={unknown}><strong>Still unknown:</strong> {unknown}</p>)}</section></div>
      {isRavi && !state.quietReader && (!state.contributorAllowsQuestions || !state.contributorPublished) && <section className="no-recipient"><h2>Ravi isn&apos;t available for questions here</h2><p>You can still read, choose Nisha&apos;s read-only perspective, or continue without contacting anyone.</p><div className="inline-actions"><SecondaryButton onClick={() => stateDispatch({ type: "OPEN_EXPERIENCE", experienceId: "experience.nisha" })}>Read Nisha&apos;s story</SecondaryButton><SecondaryButton onClick={() => stateDispatch({ type: "CLOSE_EXPERIENCE" })}>Keep reading quietly</SecondaryButton></div></section>}
      <div className="action-row"><SecondaryButton onClick={() => stateDispatch({ type: "CLOSE_EXPERIENCE" })}>Back to community</SecondaryButton>{isRavi && !state.quietReader && state.contributorAllowsQuestions && state.contributorPublished && <PrimaryButton onClick={() => stateDispatch({ type: "OPEN_QUESTION" })}>Ask Ravi</PrimaryButton>}<button className="text-button" onClick={() => stateDispatch({ type: "EXPLORE_DIFFERENT_PERSPECTIVE" })}>Not relevant to me</button></div>
    </>;
  }

  function renderQuestion() {
    return <>
      <p className="lede">If you want to ask, review exactly what this prepared example contains. Your earlier conversation isn&apos;t included.</p>
      <div className="question-layout"><section className="panel question-form">
        <label className="field-label" htmlFor="alias">Your alias</label><input id="alias" value={state.alias} onChange={(event) => stateDispatch({ type: "SET_ALIAS", value: event.target.value })} aria-invalid={state.alias.trim().length > 0 && !aliasValid} aria-describedby="alias-help alias-error" autoComplete="off"/><p id="alias-help" className="small-note">3–24 letters, numbers or underscores. An alias does not guarantee anonymity in a real service.</p>{state.alias.trim().length > 0 && !aliasValid && <p id="alias-error" className="field-error">Use 3–24 letters, numbers or underscores.</p>}
        <label className="field-label" htmlFor="question">Your question</label><textarea id="question" rows={4} maxLength={400} value={state.questionText} onChange={(event) => stateDispatch({ type: "SET_QUESTION_TEXT", value: event.target.value })} aria-invalid={state.questionText.trim().length > 0 && !questionValid} aria-describedby="question-help question-error"/><p id="question-help" className="small-note">Keep it to what you want Ravi to see. {state.questionText.length}/400</p>{state.questionText.trim().length > 0 && !questionValid && <p id="question-error" className="field-error">Add at least 12 characters, or cancel and keep reading.</p>}
        <label className="consent-row"><input type="checkbox" checked={state.questionConsent} onChange={(event) => stateDispatch({ type: "SET_QUESTION_CONSENT", value: event.target.checked })}/><span>I reviewed the exact alias and question below. In this prepared scenario, nothing is sent to a person.</span></label>
      </section><aside className="panel recipient-preview"><span className="tag tag-private">EXACT RECIPIENT PREVIEW</span><h2>What would be shared</h2><dl><dt>Recipient</dt><dd>Ravi · contributor.ravi</dd><dt>Alias</dt><dd>{state.alias.trim() || "Not entered"}</dd><dt>Question</dt><dd>{state.questionText.trim() || "No question entered"}</dd></dl><p className="small-note">Your private conversation and journey are not included.</p></aside></div>
      {state.error && <p className="error-message" role="alert">{state.error}</p>}
      <div className="action-row"><SecondaryButton onClick={() => stateDispatch({ type: "BACK" })}>Cancel · keep my draft</SecondaryButton><PrimaryButton onClick={() => stateDispatch({ type: "SEND_QUESTION" })} disabled={!aliasValid || !questionValid || !state.questionConsent}>Continue to prepared response</PrimaryButton></div><p className="small-note">This is an illustrative response flow. It does not send a message or contact Ravi.</p>
    </>;
  }

  function renderReply() {
    return <>
      <Notice tone="human">Prepared illustrative reply · Ravi is a fictional participant.</Notice>
      <section className="prepared-reply"><span className="context-eyebrow">RAVI · PREPARED EXAMPLE</span><blockquote>{fixtures.peerQuestionDemo.response.text}</blockquote><p>This original fictional response was not generated by Meta AI or sent by a person.</p></section>
      <section className="arjun-reaction"><span className="context-eyebrow">WHAT ARJUN NOTICED</span><p>“{fixtures.leadPersona.private.reaction}”</p></section>
      <div className="action-row"><SecondaryButton onClick={() => stateDispatch({ type: "BACK" })}>Back to question</SecondaryButton><PrimaryButton onClick={() => stateDispatch({ type: "CONTINUE_AFTER_REPLY" })}>Continue to reflection</PrimaryButton></div>
    </>;
  }

  function renderReflection() {
    const feedbackOptions = [
      ["perspective", "A new perspective"], ["understood", "Feeling understood"], ["action", "Something I'd like to try"], ["not-helpful", "Not helpful"], ["skip", "I'd rather skip"],
    ] as const;
    return <>
      <p className="lede">You don&apos;t need to solve the bigger question today. Keep only what feels useful to you.</p>
      <section className="takeaway-panel"><span className="context-eyebrow">YOUR TAKEAWAY</span><h2>Is there something you&apos;d like to carry forward?</h2><p>Arjun&apos;s relationship is still unresolved. He can name the support he wants without choosing an outcome.</p><label className="field-label" htmlFor="insight">Edit this, write your own, or leave it blank</label><textarea id="insight" rows={3} value={state.insightDraft} onChange={(event) => stateDispatch({ type: "SET_INSIGHT_DRAFT", value: event.target.value })}/><div className="inline-actions"><SecondaryButton onClick={() => stateDispatch({ type: "APPROVE_INSIGHT" })} disabled={!state.insightDraft.trim()}>Keep privately</SecondaryButton><button className="text-button" onClick={() => stateDispatch({ type: "SET_INSIGHT_DRAFT", value: "" })}>Don&apos;t keep a note</button>{state.insightApproved && <span className="confirmation-text">Kept in this session only.</span>}</div></section>
      <section className="panel reflection-panel"><h2>Was any part of this useful?</h2><div className="feedback-options" role="group" aria-label="Was any part of this useful?">{feedbackOptions.map(([value, label]) => <button key={value} className={state.usefulness === value ? "feedback-option selected" : "feedback-option"} aria-pressed={state.usefulness === value} onClick={() => stateDispatch({ type: "SET_USEFULNESS", value })}>{label}</button>)}</div>
        {state.usefulness === "not-helpful" && <div className="alternative-support"><Notice>Thanks for saying so. What would feel better now?</Notice><div className="inline-actions"><SecondaryButton onClick={() => stateDispatch({ type: "EXPLORE_DIFFERENT_PERSPECTIVE" })}>Read another perspective</SecondaryButton><SecondaryButton onClick={() => stateDispatch({ type: "RESTART" })}>Take a break</SecondaryButton><SecondaryButton onClick={() => stateDispatch({ type: "OPEN_HELP" })}>Explore qualified support</SecondaryButton></div><p className="small-note">No listener or professional is contacted or booked from here.</p></div>}
        <label className="field-label" htmlFor="next-step">Choose an optional next step</label><select id="next-step" value={state.nextStep} onChange={(event) => stateDispatch({ type: "SET_NEXT_STEP", value: event.target.value })}><option value="">No step right now</option><option>Write down what I want from a conversation</option><option>Explore another perspective</option><option>Talk with someone I trust</option><option>Explore qualified support</option></select>
      </section>
      <div className="action-row"><SecondaryButton onClick={() => stateDispatch({ type: "BACK" })}>Back</SecondaryButton><PrimaryButton onClick={() => stateDispatch({ type: "OPEN_JOURNEY" })}>View my journey</PrimaryButton><button className="text-button" onClick={() => stateDispatch({ type: "OPEN_DISCOVERY" })}>Keep exploring</button></div>
    </>;
  }

  function renderJourney() {
    const prior = state.priorChapter;
    const chapterOne = prior ?? {
      opening: state.opening || fixtures.leadPersona.private.opening,
      confirmedNeed: state.confirmedNeed,
      confirmedThemes: state.confirmedThemes,
      rejectedThemes: state.rejectedThemes,
      openedExperienceIds: state.openedExperienceIds,
      questionPayload: state.questionPayload,
      usefulness: state.usefulness,
      nextStep: state.nextStep,
      insightDraft: state.insightDraft,
      insightApproved: state.insightApproved,
    };
    const laterChapterActive = state.chapter === "belonging" && prior !== null;
    return <>
      <p className="lede">Only the words and choices you kept appear here. Nothing is saved beyond this session.</p>
      <div className="journey-grid">
        <section className="panel"><span className="tag tag-private">CHAPTER 1 · RELATIONSHIPS</span><h2>Relationships and family expectations</h2><h3>What you first said</h3><p>“{chapterOne.opening}”</p><h3>What you confirmed</h3><p>{chapterOne.confirmedNeed || "No support need confirmed yet."}</p>{chapterOne.confirmedThemes.length > 0 && <p><strong>Confirmed themes:</strong> {chapterOne.confirmedThemes.map(textForTheme).join(" · ")}</p>}{chapterOne.rejectedThemes.length > 0 && <p><strong>Set aside:</strong> {chapterOne.rejectedThemes.map(textForTheme).join(" · ")}</p>}<h3>Perspectives you explored</h3>{chapterOne.openedExperienceIds.length ? <ul>{chapterOne.openedExperienceIds.map((id) => <li key={id}>{fixtures.experiences.find((item) => item.id === id)?.attributionLabel ?? "Illustrative experience"}</li>)}</ul> : <p>No story opened in this session.</p>}{chapterOne.questionPayload && <p>You reviewed a prepared response after choosing the exact alias and question.</p>}{chapterOne.insightApproved && <div className="approved-note"><strong>Your private takeaway</strong><p>{chapterOne.insightDraft}</p></div>}{chapterOne.nextStep && <p><strong>Next step you chose:</strong> {chapterOne.nextStep}</p>}{chapterOne.usefulness && <p><strong>Your reflection:</strong> {feedbackLabel(chapterOne.usefulness)}</p>}</section>
        {laterChapterActive ? <section className="panel return-panel"><span className="tag tag-private">CHAPTER 2 · NEW CITY</span><h2>New City, Feeling Lonely After Work</h2><h3>What you shared</h3><p>“{state.opening}”</p><h3>What you want now</h3><p>{state.confirmedNeed}</p><p><strong>Topics you chose:</strong> {state.confirmedThemes.map(textForTheme).join(" · ")}</p>{state.carryPreviousContext && state.carriedTakeaway ? <div className="approved-note"><strong>You chose to carry this note forward</strong><p>{state.carriedTakeaway}</p></div> : <p>You started this chapter separately. The relationship conversation did not shape these topics.</p>}<SecondaryButton onClick={() => stateDispatch({ type: "OPEN_COMMUNITY", communityId: "community.moving-friends" })}>Explore New City, New Connections</SecondaryButton></section> : <section className="panel return-panel"><span className="context-eyebrow">A FEW WEEKS LATER · ILLUSTRATIVE</span><h2>A different chapter begins</h2><p>“{fixtures.chapters.find((chapter) => chapter.id === "chapter.arjun-belonging")?.futureNote}”</p><p>Do you want to start separately, or bring a note you chose to keep?</p><div className="chapter-choice-actions"><PrimaryButton onClick={() => stateDispatch({ type: "START_FUTURE_CHAPTER", carryContext: false })}>Start separately</PrimaryButton><SecondaryButton onClick={() => stateDispatch({ type: "START_FUTURE_CHAPTER", carryContext: true })} disabled={!chapterOne.insightApproved}>Bring my selected takeaway</SecondaryButton></div>{!chapterOne.insightApproved && <p className="small-note">To bring context, first choose to keep a takeaway privately.</p>}</section>}
      </div>
      {!laterChapterActive && <section className="panel chapter-summary"><h2>Your selected next step</h2><p>{chapterOne.nextStep || "No next step selected."}</p>{chapterOne.usefulness && <p>Usefulness: {chapterOne.usefulness === "not-helpful" ? "Not helpful" : chapterOne.usefulness === "skip" ? "Skipped" : feedbackLabel(chapterOne.usefulness)}</p>}</section>}
      {laterChapterActive && <section className="panel chapter-summary"><h2>Chapter 2 next step</h2><p>{state.nextStep || "No next step selected in this chapter yet."}</p></section>}
      <section className="demo-end-card"><span className="tag tag-human">HARMONISE</span><h2>Find understanding. Find each other.</h2><p>Designed for future Meta AI to help make relevant human experience easier to reach. People choose what to share and what to carry forward.</p><p className="small-note">This scenario uses local prepared content. No Meta model call occurred in this build; every participant and response is illustrative.</p></section>
    </>;
  }

  function renderContributor() {
    return <>
      <p className="lede">See how a contributor chooses what to share and what to keep private.</p>
      <Notice tone="human">This is a prepared scenario; changing these controls does not publish or send anything.</Notice>
      <div className="two-columns"><section className="panel"><span className="tag tag-private">PRIVATE NOTES</span><h2>Ravi&apos;s writing</h2><label className="field-label" htmlFor="contributor-draft">What Ravi chose to write</label><textarea id="contributor-draft" rows={5} value={state.contributorDraft} onChange={(event) => stateDispatch({ type: "SET_CONTRIBUTOR_DRAFT", value: event.target.value })}/><p className="small-note">These notes stay in this browser and are not sent to AI.</p><h3>Possible story sections</h3><ul><li>What happened</li><li>What I tried</li><li>What I found helpful or unhelpful</li><li>What remains unknown</li></ul></section>
        <section className="panel"><span className="tag tag-person">YOUR SHARING CHOICES</span><h2>Summary others could see</h2><label className="field-label" htmlFor="contributor-summary">Edit the shareable version</label><textarea id="contributor-summary" rows={5} value={state.contributorSummary} onChange={(event) => stateDispatch({ type: "SET_CONTRIBUTOR_SUMMARY", value: event.target.value })}/><label className="check-row"><input type="checkbox" checked={state.contributorDiscoverable} onChange={(event) => stateDispatch({ type: "SET_CONTRIBUTOR_SCOPE", discoverable: event.target.checked, questions: event.target.checked && state.contributorAllowsQuestions })}/><span>Include this story in community discovery</span></label><label className="check-row"><input type="checkbox" checked={state.contributorAllowsQuestions} disabled={!state.contributorDiscoverable} onChange={(event) => stateDispatch({ type: "SET_CONTRIBUTOR_SCOPE", discoverable: state.contributorDiscoverable, questions: event.target.checked })}/><span>Allow one question in this prepared scenario</span></label><p className="small-note">Never included: real name, location, contact details or private notes.</p><div className="inline-actions"><SecondaryButton onClick={() => stateDispatch({ type: "OPEN_CONTRIBUTOR_PREVIEW" })}>Preview what could be shared</SecondaryButton><SecondaryButton onClick={() => stateDispatch({ type: "APPROVE_CONTRIBUTOR" })}>Approve this summary</SecondaryButton></div>{state.contributorApproved && <Notice>Choice recorded for this session. You still control whether it appears in discovery.</Notice>}
        {state.contributorPreviewOpen && <div className="public-preview"><strong>Public preview · fictional</strong><p>{state.contributorSummary}</p><p>Allowed scope: story discovery{state.contributorAllowsQuestions ? " and anonymous questions" : " only"}.</p><p>Excluded: private draft, raw notes, contact and location details.</p></div>}
        {state.error && <p className="error-message" role="alert">{state.error}</p>}
        <div className="inline-actions"><PrimaryButton onClick={() => stateDispatch({ type: "PUBLISH_CONTRIBUTOR" })} disabled={!state.contributorApproved}>Apply choices to this scenario</PrimaryButton><SecondaryButton onClick={() => stateDispatch({ type: "REVOKE_CONTRIBUTOR" })}>Remove from discovery</SecondaryButton></div>{!state.contributorPublished && <Notice tone="private">Ravi&apos;s story and question option are removed from this scenario&apos;s discovery.</Notice>}{state.contributorPublished && <p className="confirmation-text">The approved story is available in this scenario.</p>}</section></div>
    </>;
  }

  function renderHelp() {
    return <>
      <p className="lede">Different kinds of support have different roles. Harmonise does not provide or verify any of them.</p>
      <div className="role-grid help-grid"><article className="panel"><span className="tag tag-human">PEER CONTRIBUTOR</span><h2>Lived experience</h2><p>A person sharing what they experienced. Their story is not professional advice.</p></article><article className="panel"><span className="tag tag-person">TRAINED LISTENER</span><h2>Listening support</h2><p>A separate role with training that would need verification in a real service. No listener is available here.</p></article><article className="panel"><span className="tag tag-suggestion">MODERATOR</span><h2>Community review</h2><p>A human role for community reports. This example does not notify a moderator.</p></article><article className="panel"><span className="tag tag-private">QUALIFIED PROFESSIONAL</span><h2>Professional support</h2><p>A separate path for people who want qualified help. Harmonise does not book, recommend or verify providers.</p></article></div>
      <section className="panel urgent-panel"><h2>If you may be in immediate danger</h2><p>Contact local emergency services or someone you trust. In India, emergency number 112 is listed in the supplied project guidance; confirm local availability before relying on any service information.</p><p>No messages are monitored and safety is not assessed here.</p></section>
      <p className="small-note">Leaving the page is a navigation convenience. It does not erase browser history or activity on a shared device.</p>
    </>;
  }

  function renderCurrentScreen() {
    switch (state.screen) {
      case "entry": return <div className="entry-layout"><div><p className="lede">You can talk privately, read experiences, or support others. No account is needed.</p><Notice>Your private words aren&apos;t included in community posts or the prepared response.</Notice><div className="entry-grid">{([
        ["talk", "Talk something through", "Start with a few words or sample answers."],
        ["unsure", "I'm not sure where to start", "Choose a gentle prompt, or skip it."],
        ["quiet", "Just read experiences", "Browse without a profile or personal context."],
        ["support", "I'd like to support others", "Preview a contributor's choices and boundaries."],
      ] as [Exclude<EntryPath, null>, string, string][]).map(([path, title, description]) => <button key={path} className="entry-choice" onClick={() => stateDispatch({ type: "START_PATH", path })}><span className="entry-icon" aria-hidden="true">{path === "quiet" ? "○" : path === "support" ? "↗" : path === "talk" ? "…" : "◇"}</span><strong>{title}</strong><span>{description}</span></button>)}</div><div className="entry-example"><span><strong>Follow one person&apos;s journey</strong><small>See how a changing understanding leads to a different kind of support.</small></span><PrimaryButton onClick={() => stateDispatch({ type: "START_ARJUN" })}>Explore Arjun&apos;s story</PrimaryButton></div></div><aside className="entry-aside"><div className="entry-aside-mark">h</div><p className="aside-quote">“I want to hear what others went through, without anyone deciding for me.”</p><p className="small-note">Illustrative participant · Arjun</p><Link className="text-button-link" href="/">Leave page <span>·</span> this does not erase browser history</Link></aside></div>;
      case "conversation": return renderConversation();
      case "understanding": return renderUnderstanding();
      case "discovery": return renderDiscovery();
      case "community": return renderCommunity();
      case "experience": return renderExperience();
      case "question": return renderQuestion();
      case "reply": return renderReply();
      case "reflection": return renderReflection();
      case "journey": return renderJourney();
      case "contribute": return renderContributor();
      case "help": return renderHelp();
    }
  }

  return <main className="harmonise-app">
    <a className="skip-link" href="#main-content">Skip to content</a>
    <header className="app-header"><div className="header-inner"><Brand/><div className="header-status">Illustrative scenario · fictional participants</div><div className="header-actions"><button className="text-button" onClick={restartJourney}>Restart</button><Link className="leave-link" href="/">Leave page</Link></div></div></header>
    {state.screen !== "entry" && <nav className="primary-nav" aria-label="Main navigation">{navItems.map((item) => <button key={item.screen} className={state.screen === item.screen || (item.screen === "discovery" && ["community", "experience", "question", "reply", "reflection"].includes(state.screen)) ? "nav-item active" : "nav-item"} aria-current={state.screen === item.screen ? "page" : undefined} onClick={() => navigate(item.screen)}>{item.label}</button>)}</nav>}
    <section id="main-content" className="app-main" aria-labelledby="page-title">
      <div className="page-topline"><div><span className="page-kicker">HARMONISE</span><h1 id="page-title" ref={headingRef} tabIndex={-1}>{appHeading(state)}</h1></div>{state.screen !== "entry" && state.screen !== "conversation" && <button className="text-button back-action" onClick={() => stateDispatch({ type: "BACK" })}>← Back</button>}</div>
      <div className="screen-content">{renderCurrentScreen()}</div>
      {state.error && state.screen !== "question" && state.screen !== "contribute" && <p className="error-message" role="alert">{state.error}</p>}
    </section>
    <footer className="app-footer"><span>Harmonise</span><span>Prepared content only · no live AI, messages, or clinical service</span><button className="footer-link" onClick={() => stateDispatch({ type: "OPEN_HELP" })}>Help &amp; safety</button></footer>
  </main>;
}

function feedbackLabel(value: Exclude<HarmoniseState["usefulness"], null>) {
  const labels = { perspective: "A new perspective", understood: "Feeling understood", action: "Something I'd like to try", "not-helpful": "Not helpful", skip: "Skipped" };
  return labels[value];
}
