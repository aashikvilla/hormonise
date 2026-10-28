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

const sampleAnswers = [
  { label: "Relationship and family expectations", text: "It's my marriage, and I'm worried about how my parents would react.", themes: ["relationship-uncertainty", "family-expectations"] as ThemeId[] },
  { label: "Work pressure", text: "Work has felt difficult, and I am not sure how to talk about it.", themes: ["work-pressure"] as ThemeId[] },
  { label: "Feeling disconnected", text: "I have felt disconnected and would like to find people with shared interests.", themes: ["relocation", "belonging", "hobbies"] as ThemeId[] },
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
    conversation: "What's been on your mind?",
    understanding: "Have I understood what matters?",
    discovery: state.chapter === "belonging" ? "Find a way to feel more connected" : "Explore communities and experiences",
    community: activeCommunity(state)?.name ?? "Community example",
    experience: "One person's experience",
    question: "Ask Ravi a question",
    reply: "A fictional reply from Ravi",
    reflection: "Was any part of this useful?",
    journey: "Your journey, in your words",
    contribute: "Share an experience by choice",
    help: "Help, safety and support roles",
  };
  return headings[state.screen];
}

export default function DemoExperience({ initialPath }: { initialPath?: Exclude<EntryPath, null> | "arjun" | "help" }) {
  const [state, dispatch] = useReducer(harmoniseReducer, initialPath, stateForEntry);
  const [freeAnswer, setFreeAnswer] = useState("");
  const [expandedDiscussion, setExpandedDiscussion] = useState<string | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
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
    headingRef.current?.focus();
  }, [state.screen]);

  function chooseSample(text: string, step: 1 | 2) {
    stateDispatch({ type: step === 1 ? "ANSWER_FIRST" : "ANSWER_SECOND", value: text, source: "sample" });
    setFreeAnswer("");
  }

  function submitTyped(step: 1 | 2) {
    if (!freeAnswer.trim()) return;
    stateDispatch({ type: step === 1 ? "ANSWER_FIRST" : "ANSWER_SECOND", value: freeAnswer.trim(), source: "typed" });
    setFreeAnswer("");
  }

  function navigate(screen: (typeof navItems)[number]["screen"]) {
    if (screen === "conversation") stateDispatch({ type: "START_PATH", path: "talk" });
    if (screen === "discovery") stateDispatch({ type: "OPEN_DISCOVERY" });
    if (screen === "journey") stateDispatch({ type: "OPEN_JOURNEY" });
    if (screen === "contribute") stateDispatch({ type: "OPEN_CONTRIBUTE" });
    if (screen === "help") stateDispatch({ type: "OPEN_HELP" });
  }

  function renderConversation() {
    const promptIndex = state.questionStep;
    return <>
      <p className="lede">You can start with a few words, choose a sample answer, or read without sharing more.</p>
      {state.isArjunDemo && <Notice tone="private">Arjun is a fictional example. This guided conversation is simulated and stays in this browser session.</Notice>}
      <section className="panel conversation-panel" aria-label="Private conversation">
        <label className="field-label" htmlFor="opening">Your opening {state.isArjunDemo ? "· Arjun's fictional words" : "· optional"}</label>
        <textarea id="opening" rows={2} value={state.opening} onChange={(event) => stateDispatch({ type: "EDIT_OPENING", value: event.target.value })} placeholder="You can start anywhere, or leave this blank." />
        {state.mockTextNotice && <Notice>New text is not interpreted in this guided demo. You can choose a sample response or browse communities.</Notice>}
        {promptIndex === 0 && <div className="prompt-block" aria-live="polite" aria-atomic="true">
          <h2>Would you rather talk about what&apos;s happening at home, or how it has been affecting you?</h2>
          <div className="choice-list">
            {sampleAnswers.map((answer) => <button className="choice-button" key={answer.label} onClick={() => chooseSample(answer.text, 1)}>{answer.label}<span aria-hidden="true">→</span></button>)}
          </div>
          <label className="field-label" htmlFor="free-answer">Or write a short answer</label>
          <textarea id="free-answer" rows={2} value={freeAnswer} onChange={(event) => setFreeAnswer(event.target.value)} placeholder="Only if you want to." />
          <PrimaryButton onClick={() => submitTyped(1)} disabled={!freeAnswer.trim()}>Use my answer</PrimaryButton>
        </div>}
        {promptIndex === 1 && <div className="prompt-block" aria-live="polite" aria-atomic="true">
          <h2>What would feel useful right now?</h2>
          <div className="choice-list">
            <button className="choice-button" onClick={() => chooseSample("I want to hear how others handled family expectations, without advice.", 2)}>Hear experiences without advice<span aria-hidden="true">→</span></button>
            <button className="choice-button" onClick={() => chooseSample("I would rather read quietly for now.", 2)}>Read quietly for now<span aria-hidden="true">→</span></button>
            <button className="choice-button" onClick={() => chooseSample("I want to talk through what matters to me first.", 2)}>Talk it through first<span aria-hidden="true">→</span></button>
          </div>
          <label className="field-label" htmlFor="free-answer">Or use your own words</label>
          <textarea id="free-answer" rows={2} value={freeAnswer} onChange={(event) => setFreeAnswer(event.target.value)} placeholder="No need to explain everything." />
          <PrimaryButton onClick={() => submitTyped(2)} disabled={!freeAnswer.trim()}>Use my answer</PrimaryButton>
        </div>}
        {promptIndex >= 2 && <div className="turn-summary" aria-live="polite">
          <h2>Your answers are ready to review</h2>
          <p>Only the sample choices above shape this guided example. Anything you typed remains uninterpreted.</p>
          <PrimaryButton onClick={() => stateDispatch({ type: "OPEN_UNDERSTANDING" })}>Review understanding</PrimaryButton>
        </div>}
      </section>
      <div className="inline-actions">
        <SecondaryButton onClick={() => stateDispatch({ type: "SKIP_QUESTION" })}>Skip this question</SecondaryButton>
        <SecondaryButton onClick={() => stateDispatch({ type: "STOP_ASKING" })}>Stop asking · browse quietly</SecondaryButton>
        <button className="text-button" onClick={() => stateDispatch({ type: "BACK" })}>Back</button>
      </div>
      <p className="small-note">No account. No outside request. Refreshing this page resets the demo.</p>
    </>;
  }

  function renderUnderstanding() {
    const statements = state.turns.filter((turn) => turn.speaker === "arjun");
    const suggestedThemes = state.proposedThemes;
    const otherThemes: ThemeId[] = ["family-expectations", "relationship-uncertainty", "work-pressure", "relocation", "belonging", "personal-autonomy", "communication", "hobbies"];
    return <>
      <p className="lede">Your words and a tentative reading are kept separate. You can remove a theme or change the kind of support you want.</p>
      <div className="three-columns">
        <section className="panel source-panel"><span className="tag tag-private">YOUR WORDS</span><h2>What you said</h2>
          {statements.length ? <ul className="statement-list">{statements.map((turn) => <li key={turn.id}>“{turn.text}”</li>)}</ul> : <p>No sample statements were selected. You can still browse all communities.</p>}
        </section>
        <section className="panel suggestion-panel"><span className="tag tag-suggestion">SUGGESTED · NOT CONFIRMED</span><h2>Possible connections</h2>
          {state.mockTextNotice && <p className="small-note">Typed answers are not analyzed here. Choose any themes you want this example to use.</p>}
          {suggestedThemes.length > 0 && <fieldset className="theme-options"><legend>Possible topics from this guided example</legend>{suggestedThemes.map((theme) => <label className="check-row" key={theme}><input type="checkbox" checked={state.confirmedThemes.includes(theme)} onChange={() => stateDispatch({ type: "TOGGLE_THEME", theme })}/><span>{textForTheme(theme)}</span></label>)}</fieldset>}
          <fieldset className="theme-options"><legend>{suggestedThemes.length ? "Add another topic if it fits" : "Choose topics to use for browsing"}</legend>{otherThemes.filter((theme) => !suggestedThemes.includes(theme)).map((theme) => <label className="check-row" key={theme}><input type="checkbox" checked={state.confirmedThemes.includes(theme)} onChange={() => stateDispatch({ type: "TOGGLE_THEME", theme })}/><span>{textForTheme(theme)}</span></label>)}</fieldset>
          <p className="small-note">No cause, diagnosis or certainty is inferred.</p>
        </section>
        <section className="panel need-panel"><span className="tag tag-person">YOUR CHOICE</span><h2>What would help now?</h2>
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
      <div className="action-row"><SecondaryButton onClick={() => stateDispatch({ type: "BACK" })}>Back to conversation</SecondaryButton><PrimaryButton onClick={() => stateDispatch({ type: "CONFIRM_UNDERSTANDING" })}>Use this to explore communities</PrimaryButton></div>
    </>;
  }

  function renderDiscovery() {
    const compare = state.chapter === "relationships" && state.confirmedThemes.includes("family-expectations");
    return <>
      <p className="lede">Communities are places to read experiences and discussions, with joining always optional.</p>
      <Notice tone="human">Fictional community examples · no live activity, member counts or availability are shown.</Notice>
      {state.chapter === "belonging" && <section className="panel chapter-notice"><span className="tag tag-person">NEW CHAPTER · FICTIONAL RETURN</span><h2>Belonging after moving</h2><p>Arjun&apos;s later concern is treated as a new chapter. It is not linked to his earlier family topic.</p></section>}
      {state.quietReader && <Notice tone="private">Quiet reading · no alias, question or membership is needed to continue.</Notice>}
      {state.mockTextNotice && <Notice>New text was not analyzed. These results use only themes you selected or an unpersonalized browse.</Notice>}
      {state.usefulness === "not-helpful" && <Notice>Thanks for saying so. These results show a different example community; you can also stop here.</Notice>}
      {state.noMatch || recommended.length === 0 ? <section className="panel no-match"><h2>There isn&apos;t a close fit in these examples.</h2><p>You can browse all communities or return to adjust the themes. No people or group activity are being invented.</p><div className="inline-actions"><SecondaryButton onClick={() => stateDispatch({ type: "SET_NO_MATCH", value: false })}>Browse all communities</SecondaryButton><SecondaryButton onClick={() => stateDispatch({ type: "BACK" })}>Change what you selected</SecondaryButton></div></section> : <div className="community-grid">
        {recommended.map((item) => <article className="community-card" key={item.id}>
          <div className="card-kicker">COMMUNITY EXAMPLE</div><h2>{item.name}</h2><p>{item.purpose}</p>
          <p className="fit-reason"><strong>Why it may fit:</strong> {item.topicIds.filter((topic) => state.confirmedThemes.includes(topic as ThemeId)).map((topic) => themeLabels[topic as ThemeId] ?? topic).join(", ") || "Open browsing, with no personal context applied."}</p>
          <div className="chip-list">{item.topicIds.slice(0, 3).map((topic) => <span className="chip" key={topic}>{themeLabels[topic as ThemeId] ?? topic}</span>)}</div>
          <p className="small-note">{item.activityLabel}</p>
          <div className="card-actions"><SecondaryButton onClick={() => stateDispatch({ type: "OPEN_COMMUNITY", communityId: item.id })}>Explore community</SecondaryButton><button className="text-button" onClick={() => { stateDispatch({ type: "OPEN_COMMUNITY", communityId: item.id }); stateDispatch({ type: "SET_COMMUNITY_TAB", tab: "experiences" }); }}>Read experiences</button></div>
        </article>)}
      </div>}
      {compare && <section className="comparison panel"><button className="comparison-toggle" aria-expanded={state.topicComparisonOpen} onClick={() => stateDispatch({ type: "TOGGLE_TOPIC_COMPARISON" })}>{state.topicComparisonOpen ? "Hide" : "Show"} the topic-only comparison <span>Illustrative example · not a measured evaluation</span></button>{state.topicComparisonOpen && <div className="comparison-detail"><h2>{fixtures.topicOnlyBaseline.name}</h2><p>{fixtures.topicOnlyBaseline.explanation}</p><p>Topic overlap can miss a request for a listener and discretion. This is a category example, not a person.</p></div>}</section>}
      <div className="discovery-footer-actions"><SecondaryButton onClick={() => stateDispatch({ type: "SET_NO_MATCH", value: true })}>None of these feels relevant</SecondaryButton><button className="text-button" onClick={() => stateDispatch({ type: "OPEN_UNDERSTANDING" })}>Change themes</button></div>
    </>;
  }

  function renderCommunity() {
    if (!community) return <section className="panel"><h2>Choose a community to explore</h2><PrimaryButton onClick={() => stateDispatch({ type: "OPEN_DISCOVERY" })}>Back to communities</PrimaryButton></section>;
    return <>
      <div className="community-intro panel"><div><span className="tag tag-human">HUMAN COMMUNITY · FICTIONAL DEMO</span><h2>{community.name}</h2><p>{community.purpose}</p></div><div className="community-status"><span className="status-dot"/> Example only<br/>No live activity</div></div>
      <div className="why-panel"><strong>Why this community surfaced</strong><p>{state.confirmedThemes.length ? `You chose ${state.confirmedThemes.map((theme) => themeLabels[theme]).join(" and ")}. These example discussions are related to those themes.` : "You chose to browse without sharing a personal topic."}</p></div>
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
          <div className="panel-heading"><div><span className="tag tag-human">CONTRIBUTOR-SHARED STORIES</span><h2>Learn from different experiences</h2></div><span className="small-note">Fictional accounts</span></div>
          {shownExperiences.length ? <div className="story-list">{shownExperiences.map((record) => {
            const person = fixtures.contributors.find((contributor) => contributor.id === record.contributorId);
            const publicSummary = record.id === "experience.ravi" ? state.contributorSummary : person?.approvedSummary;
            return <article className="story-card" key={record.id}><div><span className="tag tag-person">{person?.alias ?? "Contributor"} · fictional</span><h3>{record.milestones[0]?.title}</h3><p>{publicSummary ?? record.milestones[0]?.whatHappened}</p><p className="small-note">{record.id === "experience.ravi" ? "Questions permitted in this fictional example, by separate consent." : "Read-only example · no question route."}</p></div><SecondaryButton onClick={() => stateDispatch({ type: "OPEN_EXPERIENCE", experienceId: record.id })}>Read experience</SecondaryButton></article>;
          })}</div> : <p>No approved story is available in this example. You can return to the community list.</p>}
        </>}
        {state.communityTab === "discussions" && <>
          <span className="tag tag-human">SAMPLE DISCUSSIONS · FICTIONAL</span><h2>Questions people might explore</h2>
          {discussions.length ? discussions.map((discussion) => <article className="discussion-card" key={discussion.id}><p className="discussion-author">Fictional contributor · {discussion.authorAlias}</p><h3>{discussion.prompt}</h3><button className="text-button" aria-expanded={expandedDiscussion === discussion.id} onClick={() => setExpandedDiscussion(expandedDiscussion === discussion.id ? null : discussion.id)}>{expandedDiscussion === discussion.id ? "Close example" : "Read example perspective"}</button>{expandedDiscussion === discussion.id && <p className="discussion-preview">{discussion.preview}</p>}</article>) : <p>No sample discussions are included for this community. You can explore another topic.</p>}
        </>}
        {state.communityTab === "people" && <><span className="tag tag-human">PEOPLE · FICTIONAL ROLES</span><h2>Who contributes here?</h2><div className="role-grid"><article><h3>Peer contributor</h3><p>Shares a personal account. Not a trained listener or a professional.</p></article><article><h3>Moderator</h3><p>A human role that would review reports in a real service. No moderation is active in this demo.</p></article><article><h3>Qualified professional</h3><p>A separate support pathway. This prototype does not verify providers or offer appointments.</p></article></div><p className="small-note">No people are shown as online or available.</p></>}
        {state.communityTab === "guidelines" && <><span className="tag tag-private">COMMUNITY GUIDELINES · EXAMPLE</span><h2>Keep participation respectful</h2><ul className="guideline-list"><li>Experiences are perspectives, not instructions for someone else&apos;s choice.</li><li>Do not request private contact details or pressure someone to disclose.</li><li>Respect different decisions and leave when you want.</li><li>Use reporting for a human review process; this demo does not notify a moderator.</li></ul><SecondaryButton onClick={() => stateDispatch({ type: "REPORT_EXAMPLE" })}>Report this example content</SecondaryButton>{state.reportShown && <Notice>Report example recorded in this browser only. No moderator was notified.</Notice>}</>}
      </section>
      <div className="action-row"><SecondaryButton onClick={() => stateDispatch({ type: "OPEN_DISCOVERY" })}>Back to communities</SecondaryButton><button className="text-button" onClick={() => stateDispatch({ type: "OPEN_JOURNEY" })}>Open my journey</button></div>
    </>;
  }

  function renderExperience() {
    if (!experience) return <section className="panel"><h2>This story is no longer shared in the demo.</h2><SecondaryButton onClick={() => stateDispatch({ type: "OPEN_DISCOVERY" })}>Return to communities</SecondaryButton></section>;
    const person = fixtures.contributors.find((contributor) => contributor.id === experience.contributorId);
    const isRavi = experience.id === "experience.ravi";
    return <>
      <div className="story-detail-header panel"><span className="tag tag-human">{experience.attributionLabel}</span><h2>{person?.alias ?? "Contributor"}</h2><p>{isRavi ? state.contributorSummary : person?.approvedSummary}</p><p className="small-note">A personal account, not advice or a recommendation for your decision.</p></div>
      <section className="panel timeline-panel"><h2>What this contributor reported</h2><ol className="timeline">{experience.milestones.map((milestone) => <li key={milestone.id}><span className="timeline-time">{milestone.relativeTime}</span><h3>{milestone.title}</h3><p><strong>What happened:</strong> {milestone.whatHappened}</p><p><strong>What they tried:</strong> {milestone.whatIActuallyTried}</p>{milestone.whatHelped && <p><strong>They reported as helpful:</strong> {milestone.whatHelped}</p>}{milestone.whatDidNotHelp && <p><strong>They reported did not help:</strong> {milestone.whatDidNotHelp}</p>}<p className="source-id">Source: {milestone.id}</p></li>)}</ol></section>
      <div className="two-columns"><section className="panel"><span className="tag tag-suggestion">WHY IT MAY RELATE</span><h2>Some context overlaps</h2><p>{experience.themeIds.map((theme) => themeLabels[theme as ThemeId] ?? theme).join(" · ")}</p><p>These are the contributor&apos;s stated themes, not a measure of compatibility.</p></section><section className="panel difference-panel"><span className="tag tag-private">IMPORTANT DIFFERENCES</span><h2>Where your situations may differ</h2><ul>{experience.importantDifferencesFromArjun.map((difference) => <li key={difference}>{difference}</li>)}</ul>{experience.unknowns.map((unknown) => <p key={unknown}><strong>Not known:</strong> {unknown}</p>)}</section></div>
      <div className="action-row"><SecondaryButton onClick={() => stateDispatch({ type: "CLOSE_EXPERIENCE" })}>Back to community</SecondaryButton>{isRavi && !state.quietReader && state.contributorAllowsQuestions && state.contributorPublished && <PrimaryButton onClick={() => stateDispatch({ type: "OPEN_QUESTION" })}>Ask Ravi anonymously</PrimaryButton>}<button className="text-button" onClick={() => stateDispatch({ type: "EXPLORE_DIFFERENT_PERSPECTIVE" })}>Not relevant to me</button></div>
    </>;
  }

  function renderQuestion() {
    return <>
      <p className="lede">A separate, optional question. Nothing from the private conversation is added.</p>
      <Notice tone="human">Demo simulation only · no real person receives a message.</Notice>
      <div className="question-layout"><section className="panel question-form">
        <label className="field-label" htmlFor="alias">Pseudonym</label><input id="alias" value={state.alias} onChange={(event) => stateDispatch({ type: "SET_ALIAS", value: event.target.value })} aria-invalid={state.alias.trim().length > 0 && !aliasValid} aria-describedby="alias-help alias-error" autoComplete="off"/><p id="alias-help" className="small-note">3–24 letters, numbers or underscores. A pseudonym does not guarantee anonymity.</p>{state.alias.trim().length > 0 && !aliasValid && <p id="alias-error" className="field-error">Use 3–24 letters, numbers or underscores.</p>}
        <label className="field-label" htmlFor="question">Your question</label><textarea id="question" rows={4} maxLength={400} value={state.questionText} onChange={(event) => stateDispatch({ type: "SET_QUESTION_TEXT", value: event.target.value })} aria-invalid={state.questionText.trim().length > 0 && !questionValid} aria-describedby="question-help question-error"/><p id="question-help" className="small-note">Keep it to what you want Ravi to see. {state.questionText.length}/400</p>{state.questionText.trim().length > 0 && !questionValid && <p id="question-error" className="field-error">Add at least 12 characters, or cancel and keep reading.</p>}
        <label className="consent-row"><input type="checkbox" checked={state.questionConsent} onChange={(event) => stateDispatch({ type: "SET_QUESTION_CONSENT", value: event.target.checked })}/><span>I reviewed the exact alias and question below. Only these fields are included in this demo.</span></label>
      </section><aside className="panel recipient-preview"><span className="tag tag-private">EXACT RECIPIENT PREVIEW</span><h2>What would be shared</h2><dl><dt>Recipient</dt><dd>Ravi · contributor.ravi</dd><dt>Alias</dt><dd>{state.alias.trim() || "Not entered"}</dd><dt>Question</dt><dd>{state.questionText.trim() || "No question entered"}</dd></dl><p className="small-note">Not included: your original words, themes, age, location or other profile details.</p></aside></div>
      {state.error && <p className="error-message" role="alert">{state.error}</p>}
      <div className="action-row"><SecondaryButton onClick={() => stateDispatch({ type: "BACK" })}>Cancel · keep my draft</SecondaryButton><PrimaryButton onClick={() => stateDispatch({ type: "SEND_QUESTION" })} disabled={!aliasValid || !questionValid || !state.questionConsent}>Show simulated reply</PrimaryButton></div>
    </>;
  }

  function renderReply() {
    return <>
      <Notice tone="human">Fictional contributor reply — demo</Notice>
      <section className="panel reply-panel"><h2>Ravi · fictional lived-experience contributor</h2><blockquote>{fixtures.peerQuestionDemo.response.text}</blockquote><p className="small-note">This response is a local fixture. It was not generated by AI or sent by a person.</p></section>
      <div className="action-row"><SecondaryButton onClick={() => stateDispatch({ type: "BACK" })}>Back to question</SecondaryButton><PrimaryButton onClick={() => stateDispatch({ type: "CONTINUE_AFTER_REPLY" })}>Continue to reflection</PrimaryButton></div>
    </>;
  }

  function renderReflection() {
    const feedbackOptions = [
      ["perspective", "A new perspective"], ["understood", "Feeling understood"], ["action", "Something I'd like to try"], ["not-helpful", "Not helpful"], ["skip", "I'd rather skip"],
    ] as const;
    return <>
      <p className="lede">There is no expected answer. You can continue without saving a reflection.</p>
      <section className="panel reflection-panel"><h2>Was any part of this useful?</h2><div className="feedback-options" role="group" aria-label="Was any part of this useful?">{feedbackOptions.map(([value, label]) => <button key={value} className={state.usefulness === value ? "feedback-option selected" : "feedback-option"} aria-pressed={state.usefulness === value} onClick={() => stateDispatch({ type: "SET_USEFULNESS", value })}>{label}</button>)}</div>
        {state.usefulness === "not-helpful" && <div><Notice>Thanks for saying so. You can explore another perspective, or stop here.</Notice><SecondaryButton onClick={() => stateDispatch({ type: "EXPLORE_DIFFERENT_PERSPECTIVE" })}>Try another perspective</SecondaryButton></div>}
        <label className="field-label" htmlFor="next-step">Choose an optional next step</label><select id="next-step" value={state.nextStep} onChange={(event) => stateDispatch({ type: "SET_NEXT_STEP", value: event.target.value })}><option value="">No next step selected</option><option>Take a little time to think</option><option>Keep reading quietly</option><option>Explore another community</option><option>Talk with someone I trust</option><option>Explore qualified support</option><option>Nothing for now</option></select>
      </section>
      <section className="panel insight-panel"><span className="tag tag-private">OPTIONAL · PRIVATE TO THIS DEMO</span><h2>Would you like to keep a note in your journey?</h2><p>This stays in this session and is not shared with a community.</p><label className="field-label" htmlFor="insight">Your note</label><textarea id="insight" rows={2} value={state.insightDraft} onChange={(event) => stateDispatch({ type: "SET_INSIGHT_DRAFT", value: event.target.value })}/><div className="inline-actions"><SecondaryButton onClick={() => stateDispatch({ type: "APPROVE_INSIGHT" })}>Keep this note in my journey</SecondaryButton>{state.insightApproved && <span className="confirmation-text">Saved for this session only.</span>}</div></section>
      <div className="action-row"><SecondaryButton onClick={() => stateDispatch({ type: "BACK" })}>Back</SecondaryButton><PrimaryButton onClick={() => stateDispatch({ type: "OPEN_JOURNEY" })}>View my journey</PrimaryButton><button className="text-button" onClick={() => stateDispatch({ type: "OPEN_DISCOVERY" })}>Keep exploring</button></div>
    </>;
  }

  function renderJourney() {
    return <>
      <p className="lede">A session-only view of what Arjun chose. There is no score or inferred progress.</p>
      <div className="journey-grid"><section className="panel"><span className="tag tag-private">CHAPTER 1 · PRIVATE</span><h2>Relationships and family expectations</h2><h3>What Arjun originally said</h3><p>“{state.opening || fixtures.leadPersona.private.opening}”</p><h3>What he confirmed</h3><p>{state.confirmedNeed || "No support need confirmed yet."}</p><h3>Perspectives explored</h3>{state.openedExperienceIds.length ? <ul>{state.openedExperienceIds.map((id) => <li key={id}>{fixtures.experiences.find((item) => item.id === id)?.attributionLabel ?? "Fictional experience"}</li>)}</ul> : <p>No story opened in this session.</p>}{state.questionPayload && <p>One fictional reply viewed through an explicit question preview.</p>}{state.insightApproved && <div className="approved-note"><strong>Your note, approved to keep for this session</strong><p>{state.insightDraft}</p></div>}</section>
        <section className="panel return-panel"><span className="tag tag-suggestion">OPTIONAL FUTURE CHAPTER · SIMULATED</span><h2>30 days later</h2><p>“I&apos;ve moved cities and barely meet people outside work.”</p><p>This new concern is not assumed to be connected to the earlier chapter.</p><PrimaryButton onClick={() => stateDispatch({ type: "START_FUTURE_CHAPTER" })}>Start a new chapter</PrimaryButton><p className="small-note">Opens a different community: Moving &amp; Finding Friends.</p></section></div>
      <section className="panel chapter-summary"><h2>Your selected next step</h2><p>{state.nextStep || "No next step selected."}</p>{state.usefulness && <p>Usefulness: {state.usefulness === "not-helpful" ? "Not helpful" : state.usefulness === "skip" ? "Skipped" : feedbackLabel(state.usefulness)}</p>}</section>
      <section className="demo-end-card"><span className="tag tag-human">HARMONISE · DEMO END</span><h2>Human experiences are the destination.</h2><p>Harmonise can help people clarify what they want, find relevant community perspectives, and choose what they share.</p><p className="small-note">Model status: guided mock · no Meta inference ran · all contributors and replies are fictional.</p></section>
    </>;
  }

  function renderContributor() {
    return <>
      <p className="lede">A separate contributor view. Ravi controls the shareable summary and whether questions are allowed.</p>
      <Notice tone="human">Fictional contributor workflow · no real publishing or messages.</Notice>
      <div className="two-columns"><section className="panel"><span className="tag tag-private">PRIVATE DRAFT · FICTIONAL</span><h2>Ravi&apos;s notes</h2><label className="field-label" htmlFor="contributor-draft">What Ravi chose to write</label><textarea id="contributor-draft" rows={5} value={state.contributorDraft} onChange={(event) => stateDispatch({ type: "SET_CONTRIBUTOR_DRAFT", value: event.target.value })}/><p className="small-note">This mock does not send the draft to a model. Any proposed structure is illustrative.</p><h3>Suggested sections</h3><ul><li>What happened</li><li>What I tried</li><li>What I reported as helpful or unhelpful</li><li>What remains unknown</li></ul></section>
        <section className="panel"><span className="tag tag-person">PUBLIC SUMMARY · REVIEW BEFORE SHARING</span><h2>Approved story summary</h2><label className="field-label" htmlFor="contributor-summary">Edit the shareable version</label><textarea id="contributor-summary" rows={5} value={state.contributorSummary} onChange={(event) => stateDispatch({ type: "SET_CONTRIBUTOR_SUMMARY", value: event.target.value })}/><label className="check-row"><input type="checkbox" checked={state.contributorDiscoverable} onChange={(event) => stateDispatch({ type: "SET_CONTRIBUTOR_SCOPE", discoverable: event.target.checked, questions: event.target.checked && state.contributorAllowsQuestions })}/><span>Allow this approved story in community discovery</span></label><label className="check-row"><input type="checkbox" checked={state.contributorAllowsQuestions} disabled={!state.contributorDiscoverable} onChange={(event) => stateDispatch({ type: "SET_CONTRIBUTOR_SCOPE", discoverable: state.contributorDiscoverable, questions: event.target.checked })}/><span>Allow anonymous questions in the demo</span></label><p className="small-note">Never shared: real name, location, contact details or raw journal.</p><div className="inline-actions"><SecondaryButton onClick={() => stateDispatch({ type: "OPEN_CONTRIBUTOR_PREVIEW" })}>Preview what others see</SecondaryButton><SecondaryButton onClick={() => stateDispatch({ type: "APPROVE_CONTRIBUTOR" })}>I approve this summary</SecondaryButton></div>{state.contributorApproved && <Notice>Approval recorded for this demo. You still choose whether it is discoverable.</Notice>}
        {state.contributorPreviewOpen && <div className="public-preview"><strong>Public preview · fictional</strong><p>{state.contributorSummary}</p><p>Allowed scope: story discovery{state.contributorAllowsQuestions ? " and anonymous questions" : " only"}.</p><p>Excluded: private draft, raw notes, contact and location details.</p></div>}
        {state.error && <p className="error-message" role="alert">{state.error}</p>}
        <div className="inline-actions"><PrimaryButton onClick={() => stateDispatch({ type: "PUBLISH_CONTRIBUTOR" })} disabled={!state.contributorApproved}>Publish approved demo summary</PrimaryButton><SecondaryButton onClick={() => stateDispatch({ type: "REVOKE_CONTRIBUTOR" })}>Revoke sharing</SecondaryButton></div>{!state.contributorPublished && <Notice tone="private">Sharing revoked. Ravi&apos;s experience and question option are removed from public discovery.</Notice>}{state.contributorPublished && <p className="confirmation-text">This fictional approved record is currently discoverable in the demo.</p>}</section></div>
    </>;
  }

  function renderHelp() {
    return <>
      <p className="lede">Different kinds of support have different roles. This prototype does not provide or verify any of them.</p>
      <div className="role-grid help-grid"><article className="panel"><span className="tag tag-human">PEER CONTRIBUTOR</span><h2>Lived experience</h2><p>A person sharing what they experienced. Their story is not professional advice.</p></article><article className="panel"><span className="tag tag-person">TRAINED LISTENER</span><h2>Listening support</h2><p>A separate role with training that would need verification in a real service. No listener is available here.</p></article><article className="panel"><span className="tag tag-suggestion">MODERATOR</span><h2>Community review</h2><p>A human role for community reports. No reports leave this demo, and no live moderation runs.</p></article><article className="panel"><span className="tag tag-private">QUALIFIED PROFESSIONAL</span><h2>Professional support</h2><p>A separate path for people who want qualified help. This demo does not book, recommend or verify providers.</p></article></div>
      <section className="panel urgent-panel"><h2>If you may be in immediate danger</h2><p>Contact local emergency services or someone you trust. In India, emergency number 112 is listed in the supplied project guidance; confirm local availability before relying on any service information.</p><p>This demo does not monitor messages or assess safety.</p></section>
      <p className="small-note">Leaving the page is a navigation convenience. It does not erase browser history or activity on a shared device.</p>
    </>;
  }

  function renderCurrentScreen() {
    switch (state.screen) {
      case "entry": return <div className="entry-layout"><div><p className="lede">You can talk privately, read experiences, or support others. No account is needed for this demo.</p><Notice>Concept preview · fictional people and communities · simulated AI · no messages are sent.</Notice><div className="entry-grid">{([
        ["talk", "Talk something through", "Start with a few words or sample answers."],
        ["unsure", "I'm not sure where to start", "Choose a gentle prompt, or skip it."],
        ["quiet", "Just read experiences", "Browse without a profile or personal context."],
        ["support", "I'd like to support others", "Preview a contributor's choices and boundaries."],
      ] as [Exclude<EntryPath, null>, string, string][]).map(([path, title, description]) => <button key={path} className="entry-choice" onClick={() => stateDispatch({ type: "START_PATH", path })}><span className="entry-icon" aria-hidden="true">{path === "quiet" ? "○" : path === "support" ? "↗" : path === "talk" ? "…" : "◇"}</span><strong>{title}</strong><span>{description}</span></button>)}</div><div className="entry-example"><span><strong>Explore the fictional demo path</strong><small>Follow Arjun&apos;s example from a private concern to a chosen next step.</small></span><PrimaryButton onClick={() => stateDispatch({ type: "START_ARJUN" })}>Explore Arjun&apos;s example</PrimaryButton></div></div><aside className="entry-aside"><div className="entry-aside-mark">h</div><p className="aside-quote">“I want to hear what others went through, without anyone deciding for me.”</p><p className="small-note">A fictional example of a user-confirmed need.</p><Link className="text-button-link" href="/">Leave page <span>·</span> this does not erase browser history</Link></aside></div>;
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
    <header className="app-header"><div className="header-inner"><Brand/><div className="header-status"><span className="status-dot"/> Guided demo · fictional people · simulated AI</div><div className="header-actions"><button className="text-button" onClick={() => stateDispatch({ type: "RESTART" })}>Restart</button><Link className="leave-link" href="/">Leave page</Link></div></div></header>
    {state.screen !== "entry" && <nav className="primary-nav" aria-label="Main navigation">{navItems.map((item) => <button key={item.screen} className={state.screen === item.screen || (item.screen === "discovery" && ["community", "experience", "question", "reply", "reflection"].includes(state.screen)) ? "nav-item active" : "nav-item"} aria-current={state.screen === item.screen ? "page" : undefined} onClick={() => navigate(item.screen)}>{item.label}</button>)}</nav>}
    <section id="main-content" className="app-main" aria-labelledby="page-title">
      <div className="page-topline"><div><span className="page-kicker">HARMONISE · CONCEPT DEMO</span><h1 id="page-title" ref={headingRef} tabIndex={-1}>{appHeading(state)}</h1></div>{state.screen !== "entry" && <button className="text-button back-action" onClick={() => stateDispatch({ type: "BACK" })}>← Back</button>}</div>
      <div className="screen-content">{renderCurrentScreen()}</div>
      {state.error && state.screen !== "question" && state.screen !== "contribute" && <p className="error-message" role="alert">{state.error}</p>}
    </section>
    <footer className="app-footer"><span>Harmonise · concept prototype</span><span>Fictional contributions · no live AI, human messaging, or clinical service</span><button className="footer-link" onClick={() => stateDispatch({ type: "OPEN_HELP" })}>Help &amp; safety</button></footer>
  </main>;
}

function feedbackLabel(value: Exclude<HarmoniseState["usefulness"], null>) {
  const labels = { perspective: "A new perspective", understood: "Feeling understood", action: "Something I'd like to try", "not-helpful": "Not helpful", skip: "Skipped" };
  return labels[value];
}
