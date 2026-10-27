"use client";

import { useMemo, useReducer, useState } from "react";
import Link from "next/link";
import {
  ARJUN_CONTEXT, CONTEXT_CLAIMS, EXPERIENCES, SAMPLE_FIRST_ANSWER,
  SAMPLE_QUESTION, ALTERNATE_QUESTION, composeRecipientPreview, composeTakeaway, mockContributorService, mockExperienceService,
  demoReducer, initialDemoState,
} from "@/lib/demo";

const stages = ["conversation", "mirror", "experiences", "connect", "takeaway"] as const;
const stageNames = ["Private conversation", "Confirm understanding", "Explore experiences", "Optional question", "Your takeaway"];
const intents = [
  { id: "experience", label: "Hear how other people navigated this" },
  { id: "reflect", label: "Understand what I want first" },
  { id: "listener", label: "Find someone who will listen" },
  { id: "uncertain", label: "I am not sure yet" },
] as const;
const nextSteps = [
  "Write down what I want from a conversation",
  "Continue reading quietly",
  "Explore talking to a trained listener",
  "Explore professional support resources",
  "Nothing for now",
];

function BrandMark() { return <span className="brand-mark">b</span>; }
function Arrow({ left = false }: { left?: boolean }) { return <svg className="arrow-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d={left ? "M19 12H5m6 6-6-6 6-6" : "M5 12h14m-6-6 6 6-6 6"} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>; }

export default function DemoExperience() {
  const [state, dispatch] = useReducer(demoReducer, initialDemoState);
  const [whyOpen, setWhyOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [keepTalking, setKeepTalking] = useState(false);
  const [extraThought, setExtraThought] = useState("");
  const [copied, setCopied] = useState(false);
  const index = stages.indexOf(state.stage);
  const story = useMemo(() => EXPERIENCES.find((item) => item.id === state.selectedExperienceId) ?? null, [state.selectedExperienceId]);
  const stories = useMemo(() => mockExperienceService.findRelevant(state.selectedClaims, state.discoveryMode), [state.selectedClaims, state.discoveryMode]);
  const contributorReply = mockContributorService.getReply("story-pressure-listener");
  const preview = composeRecipientPreview({ alias: state.pseudonym, question: state.questionDraft });
  const validAlias = /^[A-Za-z0-9_]{3,24}$/.test(state.pseudonym);
  const validQuestion = state.questionDraft.trim().length >= 12;
  const summary = composeTakeaway(state);
  const confirmedWords = [...state.transcript].reverse().find((turn) => turn.role === "user")?.text ?? ARJUN_CONTEXT;
  const firstAnswer = state.transcript.find((turn, turnIndex) => turnIndex > 0 && turn.role === "user")?.text ?? "";
  const tentativeTension = firstAnswer.includes("relationship")
    ? "Uncertainty about the relationship + concern about how family may react."
    : firstAnswer.includes("family")
      ? "Family expectations may be making it harder to talk openly."
      : "You want room to talk without labels before deciding what anything means.";

  function intent(id: typeof intents[number]["id"], label: string) {
    dispatch({ type: "SELECT_INTENT", intent: id, label });
  }
  function quiet() { dispatch({ type: "CHOOSE_ENGAGEMENT", mode: "quiet" }); }
  function submitQuestion() {
    if (validAlias && validQuestion && state.previewApproved) dispatch({ type: "SEND_QUESTION" });
  }
  function restart() { dispatch({ type: "RESTART" }); setWhyOpen(false); setEditing(false); setCopied(false); }

  return <main className="v2-app">
    <header className="v2-header"><div className="v2-header-inner">
      <Link href="/" className="brand"><BrandMark/><span>Beyond Silence</span></Link>
      <span className="v2-header-note"><i/> Concept · fictional accounts · simulated AI</span>
      <button className="quiet-button" onClick={restart}>Restart demo</button>
    </div></header>
    <nav className="v2-progress" aria-label="Demo progress">{stages.map((stage, i) => <div key={stage} className={"v2-progress-item " + (i === index ? "current" : i < index ? "done" : "")}><span>{i < index ? "✓" : i + 1}</span><small>{stageNames[i]}</small></div>)}</nav>

    <div className="v2-shell"><section className="v2-content" aria-live="polite">
      <div className="v2-sim">Concept prototype · simulated interpretation · fictional perspectives</div>

      {state.stage === "conversation" && <>
        <div className="v2-eyebrow">A PRIVATE FIRST STEP</div><h1>Some things are hard to explain.</h1>
        <p className="v2-lede">Start with as little as you like. You do not need a label or a decision.</p>
        <div className="v2-conversation-grid"><section className="v2-card v2-dialogue">
          <label className="v2-label" htmlFor="opening">YOUR OPENING · EDITABLE</label>
          <textarea id="opening" value={state.initialWords} onChange={(e) => dispatch({ type: "EDIT_INITIAL", text: e.target.value })} rows={2}/>
          <p className="v2-local-note">This stays in the browser demo. Edited text is not analyzed live.</p>
          {state.turnIndex === 0 ? <>
            <div className="v2-assistant-prompt">You do not need to name the problem yet. Which part has been hardest lately?</div>
            <div className="v2-answer-list">
              <button onClick={() => dispatch({ type: "SELECT_FIRST", answer: SAMPLE_FIRST_ANSWER })}>Things in my relationship <Arrow/></button>
              <button onClick={() => dispatch({ type: "SELECT_FIRST", answer: "What my family expects of me feels hardest to talk about." })}>What my family expects of me <Arrow/></button>
              <button onClick={() => dispatch({ type: "SELECT_FIRST", answer: "I just want to talk without labels." })}>I just want to talk without labels <Arrow/></button>
            </div>
            <button className="v2-sample-link" onClick={() => dispatch({ type: "SELECT_FIRST", answer: SAMPLE_FIRST_ANSWER })}>Use example answer</button>
          </> : <>
            {state.transcript.slice(1).filter((turn) => !(state.turnIndex === 1 && turn.role === "assistant")).map((turn) => <div key={turn.id} className={turn.role === "user" ? "v2-user-bubble" : "v2-assistant-prompt"}>{turn.text}</div>)}
            {state.turnIndex === 1 && <div className="v2-turn"><p className="v2-question">It sounds like both the relationship and fear of judgment may be weighing on you. What would be most useful right now?</p>
              <div className="v2-answer-list">{intents.map((item) => <button key={item.id} onClick={() => intent(item.id, item.label)}>{item.label}<Arrow/></button>)}</div>
              <button className="v2-sample-link" onClick={() => intent("experience", "Hear how other people navigated this")}>Use example answer</button>
            </div>}
            {state.turnIndex === 2 && <button className="button button-primary" onClick={() => dispatch({ type: "OPEN_MIRROR" })}>Review my understanding <Arrow/></button>}
          </>}
          <div className="v2-dialogue-foot">{state.turnIndex > 0 && <button className="v2-text-button" onClick={() => dispatch({ type: "BACK" })}><Arrow left/> Back</button>}<button className="v2-text-button" onClick={quiet}>I would rather not share details</button></div>
        </section><aside className="v2-card v2-control-rail"><span className="v2-icon">✳</span><h2>You stay in control</h2><p>Answer with a sample or your own words. You can stop and read privately at any point.</p><div className="v2-rule"/><p className="v2-small">No account · No public profile · No message sent</p></aside></div>
      </>}

      {state.stage === "mirror" && <>
        <div className="v2-eyebrow">A TENTATIVE REFLECTION</div><h1>Does this sound right?</h1>
        <p className="v2-lede">The interpretation is a starting point. Keep what fits; change what does not.</p>
        {state.initialWords.trim() !== initialDemoState.initialWords && <p className="v2-info" role="note">This is a scripted example, not live analysis of edited words.</p>}
        <div className="v2-assistant-prompt">I may be hearing this: {tentativeTension} You are looking for “{state.intentLabel}”. Is that accurate?</div>
        <div className="v2-mirror-grid">
          <article className="v2-card"><div className="v2-label">IN YOUR WORDS</div><p className="v2-quote">“{confirmedWords}”</p><small>Paraphrased from your guided answer</small></article>
          <article className="v2-card v2-tentative"><div className="v2-label">POSSIBLE TENSION · PLEASE CONFIRM</div><p>{tentativeTension}</p><small>Simulated interpretation, not a diagnosis</small></article>
          <article className="v2-card"><label className="v2-label" htmlFor="support-need">WHAT WOULD HELP NOW?</label><input id="support-need" value={state.intentLabel} onChange={(e) => dispatch({ type: "EDIT_INTENT", text: e.target.value })}/><small>Your selected answer · editable</small></article>
        </div>
        <section className="v2-card v2-confirm-card"><div className="v2-label">WHAT MATTERS MOST TO YOU?</div>
          <div className="v2-pill-options">{[["Perspective from others","experience"],["A private space to reflect","reflect"],["A nonjudgmental listener","listener"]].map(([text,id]) => <button key={id} aria-pressed={state.supportIntent === id} onClick={() => intent(id as typeof state.supportIntent,text)}>{text}</button>)}</div>
          <div className="v2-label v2-sub-label">KEEP OR CHANGE THESE IDEAS</div>
          <div className="v2-claim-list">{CONTEXT_CLAIMS.map((claim) => <label key={claim.id}><input type="checkbox" checked={Boolean(state.selectedClaims[claim.id])} onChange={() => dispatch({ type: "TOGGLE_CLAIM", id: claim.id })}/>{claim.text}</label>)}</div>
          {editing && <div className="v2-correction">Edit the need above and change selected ideas. Your choices guide this demo.</div>}
          {keepTalking && <div className="v2-keep-talking"><label className="v2-label" htmlFor="extra-thought">ANYTHING ELSE YOU WOULD LIKE INCLUDED?</label><textarea id="extra-thought" value={extraThought} onChange={(e) => setExtraThought(e.target.value)} rows={2} placeholder="Add a thought in your own words"/><button className="v2-sample-link" onClick={() => { dispatch({ type: "EDIT_INTENT", text: extraThought.trim() || state.intentLabel }); setKeepTalking(false); }}>Add this thought to my reflection</button></div>}
          <div className="v2-actions"><button className="button button-secondary" onClick={() => setEditing(!editing)}>{editing ? "Done editing" : "That is not right — change what you understood"}</button><button className="button button-secondary" onClick={() => setKeepTalking(!keepTalking)}>Keep talking</button><button className="button button-primary" onClick={() => dispatch({ type: "CONFIRM_CONTEXT" })}>Confirm and explore experiences <Arrow/></button></div>
        </section>
      </>}

      {state.stage === "experiences" && <>
        <div className="v2-eyebrow">{state.engagementMode === "quiet" ? "QUIET READING · NOT PERSONALIZED" : "HUMAN PERSPECTIVES · FICTIONAL FIXTURES"}</div><h1>Experiences are perspectives, not instructions.</h1>
        <p className="v2-lede">{state.engagementMode === "quiet" ? "Browse neutral example stories without sharing details. No personalized match is being made." : "See what was similar, what differed, and decide whether another person's experience is useful."}</p>
        {state.engagementMode !== "quiet" && <><div className="v2-relevance">Confirmed focus {CONTEXT_CLAIMS.filter((claim) => state.selectedClaims[claim.id]).map((claim) => <span key={claim.id}>{claim.id === "family" ? "family pressure" : claim.id === "privacy" ? "privacy" : claim.id === "verdict" ? "wants a verdict" : "lived experience"}</span>)}</div>
        <div className="v2-toolbar"><div className="mode-toggle" role="group" aria-label="Story ordering"><button aria-pressed={state.discoveryMode === "context"} onClick={() => dispatch({ type: "SET_DISCOVERY_MODE", mode: "context" })}>Context-first</button><button aria-pressed={state.discoveryMode === "topic"} onClick={() => dispatch({ type: "SET_DISCOVERY_MODE", mode: "topic" })}>Topic-only example</button></div><span>Illustrative fixture ranking. Not measured model performance.</span></div></>}
        {story ? <article className="v2-card v2-story-detail">
          <button className="v2-text-button" onClick={() => dispatch({ type: "BACK_TO_EXPERIENCES" })}><Arrow left/> Back to experiences</button>
          <div className="v2-story-heading"><div><span className="v2-fiction-tag">FICTIONAL DEMO ACCOUNT</span><h2>{story.alias}</h2></div><span className="v2-fiction">Not a real testimonial</span></div>
          <div className="v2-story-fields"><StoryField title="What happened" value={story.situation}/><StoryField title="What they wanted" value={story.wanted}/><StoryField title="What they tried" values={story.tried}/><StoryField title="What they say helped" values={story.helpful}/><StoryField title="What did not help" values={story.unhelpful}/><StoryField title="Their perspective" value={story.perspective}/><StoryField title="Where this differs" values={story.differences}/></div>
          <div className="v2-questions"><strong>What questions does this raise for me?</strong><p>What feels relevant to my situation, and what is different? Their experience does not decide what I should do.</p></div>
          {whyOpen && <div className="v2-evidence"><strong>Why this surfaced</strong><p>Based on this story&apos;s stated situation, wanted support, and differences. No live model ranking is running.</p><div>Overlap: {story.overlaps.join(" · ")}</div><div>Differences: {story.differences.join(" · ")}</div></div>}
          <button className="v2-sample-link" onClick={() => setWhyOpen(!whyOpen)}>{whyOpen ? "Hide evidence" : "Why this surfaced"}</button>
          <div className="v2-actions"><button className="button button-secondary" onClick={() => dispatch({ type: "BACK_TO_EXPERIENCES" })}>Keep reading privately</button>{state.engagementMode !== "quiet" && story.contributorAllowsQuestions && <button className="button button-primary" onClick={() => { dispatch({ type: "CHOOSE_ENGAGEMENT", mode: "question" }); setWhyOpen(false); }}>Ask Ravi anonymously <Arrow/></button>}</div>
        </article> : <div className="v2-story-grid">{(state.engagementMode === "quiet" ? EXPERIENCES : stories).map((item, i) => <article key={item.id} className={"v2-card v2-story-card " + (state.engagementMode !== "quiet" && state.discoveryMode === "context" && i === 0 ? "v2-story-featured" : "")}>
          <div className="v2-story-card-top"><span className="v2-fiction-tag">FICTIONAL DEMO ACCOUNT</span><span>{i + 1}</span></div><h2>{item.alias}</h2><p>{item.situation}</p><div className="v2-story-preview"><strong>Wanted:</strong> {item.wanted}</div><div className="v2-story-differences"><strong>Important difference</strong><p>{item.differences[0]}</p></div><button className="button button-secondary" onClick={() => dispatch({ type: "OPEN_EXPERIENCE", id: item.id })}>Open story <Arrow/></button>
        </article>)}</div>}
        {!story && state.engagementMode !== "quiet" && <details className="v2-baseline"><summary>Why does ordering change?</summary><p>{state.discoveryMode === "context" ? "Context-first places Ravi first because his story names family pressure, uncertainty and wanting a listener. Nisha follows; the legal-process example is less aligned." : "Topic-only example places the process story first because it shares a broad topic. It may miss privacy and a need for perspective without a verdict."}</p><small>Illustrative mock comparison only.</small></details>}
        {!story && <div className="v2-bottom-choice"><div><strong>{state.engagementMode === "quiet" ? "Read and leave when you are ready." : "Reading only is a complete choice."}</strong><p>No account, alias, join or message is needed.</p></div><button className="button button-secondary" onClick={() => state.engagementMode === "quiet" ? dispatch({ type: "FINISH_QUIET" }) : quiet()}>{state.engagementMode === "quiet" ? "Finish privately" : "Keep reading privately"} <Arrow/></button></div>}
        {story && <div className="v2-bottom-choice"><div><strong>Want another kind of support?</strong><p>Choose a next step without joining or sending a message.</p></div><button className="button button-secondary" onClick={() => dispatch({ type: "CHOOSE_ENGAGEMENT", mode: "alternatives" })}>See other ways to get support <Arrow/></button></div>}
      </>}

      {state.stage === "connect" && <>
        <div className="v2-eyebrow">OPTIONAL · ONE ANONYMOUS QUESTION</div><h1>{state.questionSentInDemo ? "A perspective, shared by choice." : "Ask Ravi without sharing your whole story."}</h1>
        <p className="v2-lede">{state.questionSentInDemo ? "This is fixture text from a fictional contributor." : "Ravi’s fictional account accepts one question. Nothing leaves this browser demo."}</p>
        <article className="v2-card v2-contributor"><span className="v2-fiction-tag">FICTIONAL CONTRIBUTOR</span><h2>Ravi, 34</h2><p>Faced family expectations and relationship uncertainty. Accepts one anonymous question in this concept demo.</p></article>
        {!state.questionSentInDemo ? <div className="v2-connect-grid">
          <section className="v2-card v2-question-form">
            <label className="v2-label" htmlFor="pseudonym">Pseudonym</label><input id="pseudonym" value={state.pseudonym} onChange={(e) => dispatch({ type: "SET_ALIAS", value: e.target.value })} aria-invalid={!validAlias}/><span className="v2-help">{validAlias ? "Shown only in this fictional recipient preview." : "Use 3–24 letters, numbers, or underscores."}</span>
            <div className="v2-draft-picks"><span className="v2-label">SUGGESTED QUESTION · EDITABLE</span><div><button onClick={() => dispatch({ type: "SET_QUESTION", value: SAMPLE_QUESTION })}>Use suggested question</button><button onClick={() => dispatch({ type: "SET_QUESTION", value: ALTERNATE_QUESTION })}>Use another example</button></div></div>
            <label className="v2-label" htmlFor="question">Your question</label><textarea id="question" value={state.questionDraft} onChange={(e) => dispatch({ type: "SET_QUESTION", value: e.target.value })} rows={4} maxLength={500}/><span className="v2-help">{state.questionDraft.length}/500 characters · Not auto-sent.</span>
            {validAlias && validQuestion && <div className="v2-recipient"><div className="v2-label">EXACT RECIPIENT PREVIEW</div><strong>{preview.alias}</strong><p>{preview.question}</p><span>Only this alias and text appear in the simulated exchange.</span></div>}
            <label className="v2-consent"><input type="checkbox" checked={state.previewApproved} onChange={(e) => dispatch({ type: "SET_APPROVAL", approved: e.target.checked })}/><span>I reviewed the text I&apos;m sharing in this simulated exchange.</span></label>
            <div className="v2-actions"><button className="button button-secondary" onClick={() => dispatch({ type: "BACK_TO_EXPERIENCES" })}>Back to stories</button><button className="button button-primary" onClick={submitQuestion} disabled={!validAlias || !validQuestion || !state.previewApproved}>Send demo question</button></div>
            {(!validAlias || !validQuestion) && <p className="v2-help">Enter a valid pseudonym and a question of at least 12 characters.</p>}
            <p className="v2-privacy-line">Original story, age, city, family details and context claims are never included.</p>
          </section><aside className="v2-card v2-private-rail"><h2>Review before sharing</h2><p>The fictional contributor receives no original story or inferred context.</p><div className="v2-rule"/><p className="v2-small">No real person receives a message.</p></aside>
        </div> : <section className="v2-card v2-reply-card"><div className="v2-label">YOUR DEMO QUESTION · {state.pseudonym}</div><blockquote>{state.questionDraft}</blockquote><div className="v2-sim-reply"><span className="v2-fiction-tag">SIMULATED HUMAN REPLY · NOT LIVE AI OR SENT TO A PERSON</span><h2>Ravi, 34 · fictional contributor</h2><p>{contributorReply}</p></div><div className="v2-actions"><button className="button button-secondary" onClick={() => dispatch({ type: "SET_USEFULNESS", value: "somewhat" })}>This perspective helped</button><button className="button button-secondary" onClick={() => dispatch({ type: "SET_USEFULNESS", value: "no" })}>Not relevant to me</button><button className="button button-primary" onClick={() => dispatch({ type: "CONTINUE_TO_TAKEAWAY" })}>Continue privately <Arrow/></button></div><p className="v2-help">Your reaction stays in this demo page&apos;s local state.</p></section>}
      </>}

      {state.stage === "takeaway" && <>
        <div className="v2-eyebrow">A USEFUL NEXT STEP, AT YOUR PACE</div><h1>You chose what to take with you.</h1><p className="v2-lede">This is a reflection, not a score or a claim that everything is resolved.</p>
        {state.engagementMode === "alternatives" && <section className="v2-card v2-alternatives"><h2>Other ways to seek support</h2><p>You could speak with a trained listener or explore professional support resources. This demo does not book or verify a service.</p></section>}
        <div className="v2-takeaway-grid"><Takeaway label="WHAT YOU CAME IN WITH" text={summary.original}/><Takeaway label="WHAT YOU CONFIRMED YOU NEED" text={summary.need}/><Takeaway label="HUMAN PERSPECTIVES YOU EXPLORED" text={summary.perspectives.length ? state.chosenExperienceIds.map((id) => { const viewed = EXPERIENCES.find((item) => item.id === id); return viewed ? viewed.alias + " reported: " + viewed.helpful[0] + " Different context: " + viewed.differences[0] + "." : ""; }).filter(Boolean).join(" ") + (state.questionSentInDemo ? " Fictional reply viewed." : "") : "You chose to continue privately without opening a story."}/></div>
        <section className="v2-card v2-next-step"><div className="v2-label">WHAT NEXT? · CHOOSE ONE, OR NOTHING</div><div className="v2-next-options">{nextSteps.map((option) => <label key={option}><input type="radio" name="next-step" checked={state.nextStep === option} onChange={() => dispatch({ type: "SET_NEXT_STEP", value: option })}/>{option}</label>)}</div><p className="v2-local-note">This stays on the page. No reminders or saved memory.</p></section>
        <section className="v2-card v2-feedback"><div className="v2-label">WAS THIS USEFUL FOR YOU TODAY?</div><div className="v2-feedback-options">{[["Yes","yes"],["Somewhat","somewhat"],["No","no"],["Skip","skip"]].map(([text,value]) => <button key={value} aria-pressed={state.usefulness === value} onClick={() => dispatch({ type: "SET_USEFULNESS", value: value as "yes"|"somewhat"|"no"|"skip" })}>{text}</button>)}</div>{state.usefulness === "no" && <><div className="v2-gentle-no">Thanks for saying so. This may not have fit what you needed. You can revisit the stories or leave when you are ready; no response is treated as success.</div><button className="v2-sample-link" onClick={() => dispatch({ type: "REVISIT_EXPERIENCES" })}>Revisit experiences</button></>}</section>
        <div className="v2-flywheel">Understand privately <span>→</span> Learn from people <span>→</span> Connect by choice <span>→</span> Reflect <span>→</span> Help someone else, optionally</div>
        <div className="v2-actions v2-finish-actions"><button className="button button-secondary" onClick={() => dispatch({ type: "BACK" })}>Back</button><button className="button button-secondary" onClick={async () => { const text = "A private concern that was difficult to explain.\nWhat I need: " + summary.need + "\nNext step: " + (summary.nextStep ?? "Nothing for now"); try { await navigator.clipboard.writeText(text); setCopied(true); } catch { setCopied(false); } }}>Copy my summary</button><button className="button button-primary" onClick={restart}>Restart demo</button></div>
        {copied && <p className="v2-help" role="status">Sanitized summary copied.</p>}
      </>}

      {(state.stage === "mirror" || (state.stage === "experiences" && !story)) && <div className="v2-navigation"><button className="v2-text-button" onClick={() => dispatch({ type: "BACK" })}><Arrow left/> Back a step</button></div>}
    </section>
    <aside className="v2-side-note"><div className="v2-label">THE POINT IS YOUR CHOICE</div><p>Understanding is tentative. Other people&apos;s experiences are perspectives, not instructions.</p><div className="v2-rule"/><p className="v2-small">Every account and reply is fictional. No AI inference, external request, or real message is used.</p></aside></div>
    <footer className="v2-footer"><span>Beyond Silence · Concept prototype</span><span>Not therapy, legal advice, or crisis care</span></footer>
  </main>;
}

function StoryField({ title, value, values }: { title: string; value?: string; values?: string[] }) {
  return <section><h3>{title}</h3>{value ? <p>{value}</p> : <ul>{values?.map((item) => <li key={item}>{item}</li>)}</ul>}</section>;
}
function Takeaway({ label, text }: { label: string; text: string }) {
  return <article className="v2-card"><div className="v2-label">{label}</div><p>{text}</p></article>;
}
