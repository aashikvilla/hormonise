"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  STEPS, type DemoStep, type DiscoveryMode, type ChatMessage, type ShareChoices,
  sampleStory, storyInsights, insightOptions, rankCircles, composeIntroduction,
  isAliasValid, seedMessages, suggestedDrafts, weeklyTopic,
} from "@/lib/demo";

const stepLabels: Record<DemoStep, string> = {
  share: "Share", understand: "Understand", discover: "Discover", join: "Join", connect: "Connect",
};

function BrandMark() { return <span className="brand-mark" aria-hidden="true">b</span>; }
function LockIcon() { return <svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><rect x="4" y="8" width="12" height="9" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M6.5 8V5.7a3.5 3.5 0 0 1 7 0V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>; }

export default function DemoExperience() {
  const [step, setStep] = useState<DemoStep>("share");
  const [story, setStory] = useState(sampleStory);
  const [storyError, setStoryError] = useState("");
  const [keys, setKeys] = useState(storyInsights.selectedKeys);
  const [mode, setMode] = useState<DiscoveryMode>("context");
  const [selectedCircleId, setSelectedCircleId] = useState("family-expectations");
  const [previewCircleId, setPreviewCircleId] = useState<string | null>(null);
  const [choices, setChoices] = useState<ShareChoices>({ relationshipContext: true, seekLivedExperience: true, ageAndCity: false, alias: "QuietRiver29", consented: false });
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messageText, setMessageText] = useState("");
  const [replySent, setReplySent] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [joinError, setJoinError] = useState("");
  const aboutTrigger = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const firstFocusRef = useRef<HTMLButtonElement>(null);
  const composerRef = useRef<HTMLTextAreaElement>(null);

  const selectedCircle = useMemo(() => rankCircles(mode).find((circle) => circle.id === selectedCircleId) ?? rankCircles("context")[0], [mode, selectedCircleId]);
  const previewCircle = useMemo(() => rankCircles(mode).find((circle) => circle.id === previewCircleId) ?? rankCircles("context").find((circle) => circle.id === previewCircleId) ?? null, [mode, previewCircleId]);
  const introduction = composeIntroduction(choices) || "I'd like to read and listen first.";
  const storyIsSample = story.trim() === sampleStory;
  const aliasValid = isAliasValid(choices.alias);
  const hasDialog = aboutOpen;

  const closeDialog = useCallback(() => {
    setAboutOpen(false);
    window.setTimeout(() => aboutTrigger.current?.focus(), 0);
  }, []);

  useEffect(() => {
    if (!hasDialog) return;
    firstFocusRef.current?.focus();
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeDialog();
      if (event.key === "Tab" && dialogRef.current) {
        const nodes = Array.from(dialogRef.current.querySelectorAll<HTMLElement>("button, a[href], input, textarea, [tabindex]:not([tabindex='-1'])")).filter((node) => !node.hasAttribute("disabled"));
        if (nodes.length < 1) return;
        const first = nodes[0]; const last = nodes[nodes.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [hasDialog, closeDialog]);
  function go(next: DemoStep) { setStep(next); setPreviewCircleId(null); window.scrollTo({ top: 0, behavior: "smooth" }); }
  function restart() {
    setStep("share"); setStory(sampleStory); setStoryError(""); setKeys(storyInsights.selectedKeys);
    setMode("context"); setSelectedCircleId("family-expectations"); setPreviewCircleId(null);
    setChoices({ relationshipContext: true, seekLivedExperience: true, ageAndCity: false, alias: "QuietRiver29", consented: false });
    setMessages([]); setMessageText(""); setReplySent(false); setJoinError(""); setAboutOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function continueFromStory() {
    if (!story.trim()) { setStoryError("Add a few words, or choose the sample story to continue."); return; }
    setStoryError(""); go("understand");
  }
  function joinCircle(circleId: string) {
    setSelectedCircleId(circleId); setPreviewCircleId(null); setJoinError(""); go("join");
  }
  function joinWithIntroduction() {
    if (!aliasValid) { setJoinError("Use 3–24 letters, numbers, or underscores for your alias."); return; }
    if (!choices.consented) { setJoinError("Review and confirm the introduction before joining this simulated circle."); return; }
    const introMessage: ChatMessage = { id: "user-intro", senderId: "quietriver", senderDisplayName: choices.alias, text: introduction, kind: "user-intro", simulated: true };
    setMessages([...seedMessages, introMessage]); setReplySent(false); setJoinError(""); go("connect");
  }
  function sendMessage() {
    const text = messageText.trim(); if (!text) return;
    const userMessage: ChatMessage = { id: `user-${Date.now()}`, senderId: "quietriver", senderDisplayName: choices.alias, text, kind: "user", simulated: true };
    const next = [...messages, userMessage];
    if (!replySent) {
      next.push({ id: "mock-reply", senderId: "maya-r", senderDisplayName: "Maya_R", text: "Thanks for sharing. Would you prefer someone to listen, or to share what helped them?", kind: "mock-reply", simulated: true });
      setReplySent(true);
    }
    setMessages(next); setMessageText("");
  }
  function chooseDraft(draft: string) { setMessageText(draft); composerRef.current?.focus(); }

  return <main className="demo-page">
    <header className="demo-top"><div className="demo-top-inner">
      <div className="demo-brand-group"><Link href="/" className="brand demo-brand"><BrandMark/><span>Beyond Silence</span></Link><span className="demo-divider"/><span className="demo-context">A guided concept experience</span></div>
      <div className="demo-top-actions"><span className="concept-pill small"><i/> Concept demo · fictional scenario</span><button className="quiet-button" onClick={restart}>Restart demo</button></div>
    </div></header>
    <nav className="progress-wrap" aria-label="Demo progress">
      {STEPS.map((item, index) => <span key={item} className={`progress-step ${step === item ? "active" : index < STEPS.indexOf(step) ? "done" : ""}`} aria-current={step === item ? "step" : undefined}>
        <span className="progress-dot">{index < STEPS.indexOf(step) ? "✓" : index + 1}</span><span>{stepLabels[item]}</span>
        {index < STEPS.length - 1 && <i className="progress-link" aria-hidden="true"/>}
      </span>)}
    </nav>

    <section className="demo-main">
      {previewCircle ? <>
        <div className="preview-back"><button className="link-button" onClick={() => setPreviewCircleId(null)}>← Back to results</button></div>
        <div className="demo-kicker"><span className="kicker-line"/> QUIET READING PREVIEW · NO MEMBERSHIP CREATED</div>
        <div className="demo-panel panel-pad">
          <div className="preview-header"><div><div className="box-label">VISITOR PREVIEW · FICTIONAL CONTENT</div><h2>{previewCircle.title}</h2><p>{previewCircle.format} · {previewCircle.memberCount} demo members</p></div><span className="reader-badge">◉ Reading quietly</span></div>
          <div className="preview-content"><div>{previewCircle.previewPosts.map((post, index) => <article className="preview-post" key={`${post.author}-${index}`}><div className="preview-post-header"><span>{post.author}</span><span>Example conversation</span></div><h3>A little space to be heard</h3><p>{post.text}</p></article>)}</div><aside className="preview-aside"><h3>Just looking is a valid choice.</h3><p>You are viewing illustrative posts in this browser demo. No alias or introduction is shown to the circle. Reading quietly here does not create a membership. A real service would need to explain its device and privacy limits clearly.</p><div className="sim-note">Fictional posts · no real community</div></aside></div>
          <div className="preview-actions"><button className="button button-secondary button-small" onClick={() => setPreviewCircleId(null)}>Back to results</button><button className="button button-primary button-small" onClick={() => joinCircle(previewCircle.id)}>Continue to join <span aria-hidden="true">→</span></button></div>
        </div>
      </> : <>
        <div className="demo-kicker"><span className="kicker-line"/> {step === "share" ? "A PRIVATE FIRST STEP" : step === "understand" ? "REFLECT, THEN CORRECT" : step === "discover" ? "FIND YOUR KIND OF SUPPORT" : step === "join" ? "CHOOSE WHAT TO SHARE" : "A CONNECTION, AT YOUR PACE"}</div>
        {step === "share" && <>
          <h1 className="demo-heading">What’s been weighing on you?</h1><p className="demo-subheading">Share only what you’re comfortable with. You can edit or remove any detail.</p>
          <div className="demo-panel panel-pad">
            <label htmlFor="story" className="form-label">Your story <span className="help-copy">· Fictional sample, ready to edit</span></label>
            <textarea id="story" className="story-input" value={story} onChange={(event) => { setStory(event.target.value); if (event.target.value.trim()) setStoryError(""); }} aria-describedby={storyError ? "story-error story-help" : "story-help"}/>
            <div className="share-meta"><span id="story-help" className="privacy-inline"><LockIcon/> Your story stays in this browser demo; no account or server submission.</span><span className="help-copy">{story.length} characters</span></div>
            {storyError && <p id="story-error" className="form-error" role="alert">{storyError}</p>}
            <div className="share-actions"><div className="action-cluster"><button className="button button-secondary button-small" onClick={() => { setStory(sampleStory); setStoryError(""); }}>Use sample story</button><button className="button button-secondary button-small" onClick={() => { setStory(""); setStoryError(""); }}>Clear</button></div><button className="button button-primary button-small button-wide" onClick={continueFromStory}>Continue <span aria-hidden="true">→</span></button></div>
          </div>
        </>}
        {step === "understand" && <>
          <h1 className="demo-heading">Here’s what we understood.<br/>Does this feel right?</h1><p className="demo-subheading">A sample interpretation to review and adjust. Your choices shape what we look for.</p>
          {!storyIsSample && <div className="edited-note" role="note">This preview uses a fixed example interpretation; live AI analysis is not connected yet.</div>}
          <div className="story-two-col"><div className="quote-box"><span className="box-label">IN YOUR WORDS</span><p className="quote-text">“{story.trim().slice(0, 150)}{story.trim().length > 150 ? "…" : ""}”</p></div><div className="interpret-box"><span className="box-label">SAMPLE REFLECTION</span><p className="interpret-text">{storyInsights.mainChallenge}</p><p className="interpret-small">It sounds like you want a listener who understands the family context, without deciding for you.</p></div></div>
          <div className="demo-panel panel-pad">
            <div className="insight-layout"><div className="insight-main"><div className="insight-title">What matters to you?</div><div className="insight-chips">{insightOptions.map((option) => <label className="insight-chip" key={option.key}><input type="checkbox" checked={keys[option.key]} onChange={(event) => setKeys({ ...keys, [option.key]: event.target.checked })}/>{option.label}</label>)}</div>{keys.legalAdvice && <p className="legal-note">This demo focuses on peer support, not professional legal guidance.</p>}</div><aside className="insight-side"><div className="detail-row"><strong>What makes it difficult</strong><span>{storyInsights.barriers.join(" · ")}</span></div><div className="detail-row"><strong>Preferred support</strong><span>{storyInsights.supportPreference}</span></div><div className="detail-row"><strong>Intention</strong><span>{storyInsights.intent}</span></div><div className="detail-row"><strong>Privacy</strong><span>{storyInsights.privacyPreference}</span></div></aside></div>
            <div className="sim-note">Illustrative AI understanding, simulated for this prototype</div>
            <div className="step-actions"><button className="button button-secondary button-small" onClick={() => go("share")}>← Edit my story</button><button className="button button-primary button-small button-wide" onClick={() => go("discover")}>Yes, find relevant support <span aria-hidden="true">→</span></button></div>
          </div>
        </>}
        {step === "discover" && <>
          <h1 className="demo-heading">People who understand the part<br className="desktop-break"/> that’s hardest to explain.</h1><p className="demo-subheading">See how context can change which circles appear first.</p>
          <div className="discover-toolbar"><div className="mode-toggle" role="group" aria-label="Illustrative matching approach"><button type="button" aria-pressed={mode === "context"} onClick={() => setMode("context")}>Context-aware</button><button type="button" aria-pressed={mode === "keyword"} onClick={() => setMode("keyword")}>Topic-only</button></div><span className="illustrative-label">Illustrative comparison, not a measured evaluation.</span></div>
          <div className="circle-grid">{rankCircles(mode).map((circle, index) => <article className={`circle-result ${mode === "context" && index === 0 ? "featured" : ""}`} key={circle.id}>
            {mode === "context" && index === 0 && <span className="circle-rec">RECOMMENDED EXAMPLE</span>}<div className="circle-small-label">PEER CIRCLE · DEMO FIXTURE</div><h2>{circle.title}</h2><p>{circle.description}</p><div className="circle-meta"><span>◌</span>{circle.format}<span>·</span>{circle.memberCount} demo members</div><div className="circle-tags">{circle.tags.slice(0, 3).map((tag) => <span key={tag}>{tag}</span>)}</div><div className="circle-reason"><strong>Why this match?</strong>{mode === "context" ? circle.whyContext : circle.whyKeyword}</div><div className="circle-actions"><button className="link-button" onClick={() => setPreviewCircleId(circle.id)}>Read circle preview</button><button className="button button-secondary button-small" onClick={() => joinCircle(circle.id)}>Choose circle</button></div>
          </article>)}</div>
          <div className="results-insight"><span className="insight-spark">✳</span><p>{mode === "context" ? "Context-aware discovery considers family pressure, privacy and the kind of support you asked for—not only the topic word." : "Topic-only discovery ranks by direct overlap with “divorce”. It can miss your need for discretion and family-pressure context."}</p></div>
          <div className="quiet-preview-banner"><div><h3>Prefer to read first?</h3><p>Open a visitor preview of approved example posts. You can stay a reader, with no public alias or introduction.</p></div><button className="button button-secondary button-small" onClick={() => setPreviewCircleId((rankCircles(mode)[0]?.id) ?? "family-expectations")}>Read quietly <span aria-hidden="true">→</span></button></div>
          <div className="step-actions"><button className="button button-secondary button-small" onClick={() => go("understand")}>← Back</button><span className="help-copy">Choose any circle to see its sharing preview.</span></div>
        </>}
        {step === "join" && <>
          <h1 className="demo-heading">You decide what others see.</h1><p className="demo-subheading">Review an exact introduction before joining this simulated circle.</p>
          <div className="join-layout"><aside className="join-circle-card"><span className="box-label">YOUR SELECTED CIRCLE</span><h2>{selectedCircle.title}</h2><p>{selectedCircle.description}</p><div className="circle-meta" style={{marginTop:14}}><span>◌</span>{selectedCircle.format} · {selectedCircle.memberCount} demo members</div><div className="alias-block"><label htmlFor="alias" className="form-label">Your circle alias</label><input id="alias" className="field-input" value={choices.alias} maxLength={24} onChange={(event) => setChoices({ ...choices, alias: event.target.value })} aria-invalid={!aliasValid}/><div className={aliasValid ? "field-foot" : "alias-error"}>{aliasValid ? "Fictional alias · not a guarantee of anonymity" : "Use 3–24 letters, numbers, or underscores."}</div></div></aside>
            <section className="disclosure-card"><h2>Choose your introduction</h2><p className="disclosure-intro">Only checked details will be included. Your original story is never posted.</p>
              <div className="choice-row"><input id="choice-context" type="checkbox" checked={choices.relationshipContext} onChange={(event) => setChoices({ ...choices, relationshipContext: event.target.checked })}/><label htmlFor="choice-context">I’m dealing with family expectations around a personal relationship</label></div>
              <div className="choice-row"><input id="choice-experience" type="checkbox" checked={choices.seekLivedExperience} onChange={(event) => setChoices({ ...choices, seekLivedExperience: event.target.checked })}/><label htmlFor="choice-experience">I’d appreciate hearing from people with similar experiences</label></div>
              <div className="choice-row"><input id="choice-age" type="checkbox" checked={choices.ageAndCity} onChange={(event) => setChoices({ ...choices, ageAndCity: event.target.checked })}/><label htmlFor="choice-age">My age and city</label></div>
              <div className="intro-preview"><span className="box-label">EXACT INTRODUCTION · SHARED AS {choices.alias || "YOUR ALIAS"}</span><p>{introduction}</p></div>
              <div className="private-box"><strong>Will remain private</strong><p>Original narrative · marriage duration · real name · contacts · family details</p></div>
              <label className="consent-row"><input type="checkbox" checked={choices.consented} onChange={(event) => { setChoices({ ...choices, consented: event.target.checked }); setJoinError(""); }}/><span>I reviewed what will be shared in this simulated circle.</span></label>
            </section></div>
          {joinError && <p className="form-error" role="alert">{joinError}</p>}
          <div className="join-bottom"><button className="button button-secondary button-small" onClick={() => go("discover")}>← Back to matches</button><button className={`button button-primary button-small button-wide ${(!choices.consented || !aliasValid) ? "button-disabled" : ""}`} onClick={joinWithIntroduction}>Join circle with this introduction <span aria-hidden="true">→</span></button></div>
        </>}
        {step === "connect" && <>
          <h1 className="demo-heading">A place to begin, at your pace.</h1><p className="demo-subheading">Read quietly, share a little, or simply leave and return when you choose.</p>
          <div className="connect-layout"><aside className="connect-sidebar"><section className="context-card"><span className="box-label">YOUR CIRCLE</span><h2>{selectedCircle.title}</h2><p>{selectedCircle.description}</p><div className="control-points"><span><i>✓</i> You control your introduction</span><span><i>✓</i> Participation is optional</span></div></section><section className="success-card"><strong>From a private story to a relevant human connection.</strong><p>In a real product, a peer would need to opt in before connecting. This conversation is simulated.</p></section><section className="host-card"><span className="host-label">KEEP THIS CIRCLE GOING · SAMPLE HOST VIEW</span><h3>Suggested weekly topic</h3><blockquote>“{weeklyTopic.title}”</blockquote><p>{weeklyTopic.note}</p></section></aside>
            <section className="conversation" aria-label="Simulated circle conversation"><div className="conversation-head"><div className="convo-title"><span className="convo-avatar">◌</span><span><strong>{selectedCircle.title}</strong><small>Fictional peer conversation · no real users</small></span></div><span className="chat-label">SIMULATED</span></div>
              <div className="message-list" aria-live="polite">{messages.map((message) => { const mine = message.senderId === "quietriver"; return <article key={message.id} className={`message ${mine ? "mine" : ""}`}><span className="message-avatar">{mine ? choices.alias[0]?.toUpperCase() ?? "Q" : message.senderDisplayName[0]}</span><div className="message-body"><div className="message-name">{message.kind === "user-intro" ? `${message.senderDisplayName} · Your shared introduction` : message.senderDisplayName}</div><div className="message-bubble">{message.text}</div>{message.kind === "mock-reply" && <div className="message-note">Simulated peer response · not live AI</div>}</div></article>; })}</div>
              <div className="composer-area"><div className="draft-area"><div className="draft-caption">SAMPLE DRAFT, NOT LIVE AI · SELECT TO EDIT BEFORE SENDING</div><div className="drafts">{suggestedDrafts.map((draft, index) => <button type="button" key={draft} onClick={() => chooseDraft(draft)} aria-label={`Fill composer with sample draft ${index + 1}`}>{index === 0 ? "Listening before advice" : "Read quietly for now"}</button>)}</div></div>
                <div className="composer-row"><textarea ref={composerRef} className="composer" aria-label="Write a message" placeholder="Write only what you’re comfortable sharing…" value={messageText} onChange={(event) => setMessageText(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); sendMessage(); } }}/><button className="button button-primary button-small send-button" onClick={sendMessage} disabled={!messageText.trim()}>Send <span aria-hidden="true">↑</span></button></div><div className="composer-hint"><span>Only messages you send appear in this mock conversation.</span><span>Enter to send · Shift + Enter for a new line</span></div>
              </div><div className="connect-actions"><button className="link-button" onClick={() => go("understand")}>See what AI changed</button><div className="action-cluster"><button className="quiet-button" onClick={() => go("discover")}>Compare discovery approaches</button><button className="quiet-button" ref={aboutTrigger} onClick={() => setAboutOpen(true)}>About this prototype</button></div></div>
            </section></div>
        </>}
      </>}
    </section>
    <footer className="demo-footer"><span className="footer-sim"><i/>Fictional scenario · Simulated AI · No external requests</span><span>Peer support concept · Not therapy or crisis care</span></footer>

    {hasDialog && <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) closeDialog(); }}><div className="modal" role="dialog" aria-modal="true" aria-labelledby="dialog-title" aria-describedby="dialog-description" ref={dialogRef}>
      <button className="modal-close" ref={firstFocusRef} aria-label="Close dialog" onClick={closeDialog}>×</button>
      <div className="demo-kicker"><span className="kicker-line"/> A CLEAR NOTE</div>
      <h2 id="dialog-title">About this prototype</h2>
      <p id="dialog-description">All people, circle activity, AI-style interpretation, ranking, and replies in this walkthrough are simulated. No real users are connected, and no model inference or server submission takes place.</p>
      <div className="modal-note">This concept is for non-clinical peer connection. It is not therapy, professional advice, or crisis care.</div>
      <div className="modal-actions"><button className="button button-primary button-small" onClick={closeDialog}>Got it</button></div>
    </div></div>}
  </main>;
}
