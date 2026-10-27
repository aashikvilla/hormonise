import Link from "next/link";

function Arrow({ direction = "right" }: { direction?: "right" | "down" | "up-right" }) {
  const path = direction === "down" ? "M12 5v14m0 0 6-6m-6 6-6-6" : direction === "up-right" ? "M7 17 17 7M7 7h10v10" : "M5 12h14m-6-6 6 6-6 6";
  return <svg className={`arrow-icon arrow-${direction}`} viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d={path} stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function Sparkle() {
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 2.7 14.3 9.7 21.3 12l-7 2.3-2.3 7-2.3-7-7-2.3 7-2.3L12 2.7Z" stroke="currentColor" strokeWidth="1.45" strokeLinejoin="round"/><path d="m19 2 .7 2.1L22 5l-2.3.8L19 8l-.7-2.2L16 5l2.3-.9L19 2Z" fill="currentColor"/></svg>;
}

function CircleIcon() {
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="7.5" stroke="currentColor" strokeWidth="1.5"/><circle cx="12" cy="12" r="2" fill="currentColor"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>;
}

function StoryIcon() {
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7 4.5h10a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-11a2 2 0 0 1 2-2Z" stroke="currentColor" strokeWidth="1.5"/><path d="M8.5 9h7m-7 3h7m-7 3h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>;
}

function LockIcon() {
  return <svg className="lock-mini" viewBox="0 0 20 20" fill="none" aria-hidden="true"><rect x="4.5" y="8.5" width="11" height="8" rx="1.8" stroke="currentColor" strokeWidth="1.4"/><path d="M6.8 8.5V6a3.2 3.2 0 0 1 6.4 0v2.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>;
}

const stories = [
  { name: "Kabir", age: "27", title: "Belonging through shared activity", copy: "A move to a new city makes familiar routines feel far away. A low-pressure walk or game can be a first step toward connection.", mark: "01", tone: "sage" },
  { name: "Samira", age: "31", title: "Room to read quietly", copy: "Sometimes the safest first step is simply understanding your options without joining, posting, or explaining yourself.", mark: "02", tone: "lilac" },
  { name: "Meera", age: "36", title: "Experience, shared by choice", copy: "A peer host can offer a little lived experience on their own terms, with clear boundaries and no promise to be always available.", mark: "03", tone: "sand" },
];

export default function Home() {
  return <main className="landing">
    <header className="site-header wrap">
      <Link href="/" className="brand" aria-label="Beyond Silence home"><span className="brand-mark">b</span><span>Beyond Silence</span></Link>
      <div className="header-right"><span className="concept-pill"><i /> Concept prototype</span><Link href="/demo" className="header-link">Open the demo <Arrow direction="up-right" /></Link></div>
    </header>

    <section className="hero wrap">
      <div className="hero-copy">
        <div className="eyebrow"><span className="eyebrow-line" /> HUMAN PERSPECTIVES, AT YOUR PACE</div>
        <h1>Some things are<br /><em>too personal to post.</em></h1>
        <p className="hero-lede">Find the words, learn from fictional human perspectives, and choose your next step. At your pace.</p>
        <div className="hero-actions"><Link href="/demo" className="button button-primary button-large">Explore Arjun&apos;s story <Arrow /></Link><a className="text-link" href="#how-it-works">How it works <Arrow direction="down" /></a></div>
        <div className="hero-note"><span className="note-check" aria-hidden="true" /> Interactive concept · Fictional stories and peers · Simulated AI · No real messages sent</div>
      </div>
      <div className="hero-art" aria-label="Illustration showing a private story becoming a thoughtful insight and a peer circle">
        <div className="art-orbit orbit-one" /><div className="art-orbit orbit-two" />
        <div className="art-caption"><span className="caption-dot" /> A more human way to find support</div>
        <div className="flow-card story-card"><div className="flow-label"><span className="flow-icon icon-story"><StoryIcon /></span><span>YOUR STORY</span><LockIcon /></div><div className="story-lines"><i /><i /><i className="short" /></div><div className="card-foot">Private by choice</div></div>
        <div className="flow-connector connector-a"><span/><Arrow /></div>
        <div className="flow-card insight-card"><div className="flow-label"><span className="flow-icon icon-insight"><Sparkle /></span><span>WHAT MATTERS</span></div><p>Family expectations<br />Privacy<br />A listener, not advice</p><div className="insight-foot"><span>YOUR WORDS, REFLECTED</span><span className="mini-check" /></div></div>
        <div className="flow-connector connector-b"><span/><Arrow /></div>
        <div className="flow-card circle-card-art"><div className="flow-label"><span className="flow-icon icon-circle"><CircleIcon /></span><span>A HUMAN PERSPECTIVE</span></div><div className="avatar-stack"><span>R</span><span>N</span><span>+</span></div><div className="art-circle-title">Learn from experience,<br />choose your next step.</div><div className="circle-foot"><span className="tiny-online" /> Connection by choice</div></div>
        <div className="art-stamp"><Sparkle/><br />YOU<br />CHOOSE<br />THE PACE</div>
        <div className="art-bottom-note"><span>“</span> Context can make all the difference.</div>
      </div>
    </section>

    <section className="how-section" id="how-it-works"><div className="wrap">
      <div className="section-heading"><div><div className="eyebrow"><span className="eyebrow-line" /> A SMALLER FIRST STEP</div><h2>From “I don’t know how to say it”<br /><em>to “I know what I need.”</em></h2></div><p>A guided experience built around understanding, firsthand perspectives, privacy, and a next step chosen by the person themselves.</p></div>
      <div className="steps-row"><article className="landing-step"><span className="step-number">01</span><span className="step-icon"><StoryIcon/></span><h3>Start privately</h3><p>Begin with a vague thought. Sample answers help you continue without typing.</p></article><div className="step-divider" /><article className="landing-step"><span className="step-number">02</span><span className="step-icon"><Sparkle/></span><h3>Confirm what matters</h3><p>Review a tentative interpretation and correct it in your own words.</p></article><div className="step-divider" /><article className="landing-step"><span className="step-number">03</span><span className="step-icon"><CircleIcon/></span><h3>Learn and choose</h3><p>Read fictional lived experiences, ask one question by choice, or finish privately.</p></article></div>
    </div></section>

    <section className="stories-section wrap"><div className="stories-intro"><div className="eyebrow"><span className="eyebrow-line" /> DIFFERENT NEEDS, DIFFERENT FIRST STEPS</div><h2>Connection doesn’t<br />look the same for everyone.</h2><p>These fictional scenarios show how the idea could extend beyond the primary demo.</p></div><div className="story-grid">{stories.map((story) => <article className={`persona-card ${story.tone}`} key={story.name}><div className="persona-top"><span className="persona-mark">{story.mark}</span><span>ILLUSTRATIVE CONCEPT</span></div><h3>{story.title}</h3><p>{story.copy}</p><div className="persona-person"><span className="persona-avatar">{story.name[0]}</span><span><strong>{story.name}, {story.age}</strong><small>Fictional persona</small></span><span className="persona-arrow"><Arrow direction="up-right" /></span></div></article>)}</div></section>

    <section className="closing-cta"><div className="wrap closing-inner"><div><div className="eyebrow light"><span className="eyebrow-line" /> A THREE-MINUTE WALKTHROUGH</div><h2>See what changes when<br />context comes first.</h2></div><Link href="/demo" className="button button-light button-large">Start the demo <Arrow /></Link></div></section>
    <footer className="site-footer wrap"><Link href="/" className="brand footer-brand"><span className="brand-mark">b</span><span>Beyond Silence</span></Link><p>Concept prototype · Fictional personas and simulated responses · Not therapy or crisis care</p><a href="#top" className="back-top">Back to top <Arrow direction="up-right" /></a></footer>
  </main>;
}
