import Link from "next/link";

const stories = [
  { name: "Kabir", age: "27", title: "Belonging through shared activity", copy: "A move to a new city makes familiar routines feel far away. A low-pressure walk or game can be a first step toward connection.", mark: "01", tone: "sage" },
  { name: "Samira", age: "31", title: "Room to read quietly", copy: "Sometimes the safest first step is simply understanding your options without joining, posting, or explaining yourself.", mark: "02", tone: "lilac" },
  { name: "Meera", age: "36", title: "Experience, shared by choice", copy: "A peer host can offer a little lived experience on their own terms, with clear boundaries and no promise to be always available.", mark: "03", tone: "sand" },
];

export default function Home() {
  return <main className="landing">
    <header className="site-header wrap">
      <Link href="/" className="brand" aria-label="Beyond Silence home"><span className="brand-mark">b</span><span>Beyond Silence</span></Link>
      <div className="header-right"><span className="concept-pill"><i /> Concept prototype</span><Link href="/demo" className="header-link">Open the demo <span aria-hidden="true">↗</span></Link></div>
    </header>

    <section className="hero wrap">
      <div className="hero-copy">
        <div className="eyebrow"><span className="eyebrow-line" /> HUMAN CONNECTION, AT YOUR PACE</div>
        <h1>You don’t have to<br /><em>carry it alone.</em></h1>
        <p className="hero-lede">Some experiences are too personal to post, and too nuanced for a search box. Find peer circles that understand the context behind your story.</p>
        <div className="hero-actions"><Link href="/demo" className="button button-primary button-large">Experience the 3-minute demo <span aria-hidden="true">→</span></Link><a className="text-link" href="#how-it-works">How it works <span aria-hidden="true">↓</span></a></div>
        <div className="hero-note"><span className="note-check">✓</span> Start with a private story. Choose what you share.</div>
      </div>
      <div className="hero-art" aria-label="Illustration showing a private story becoming a thoughtful insight and a peer circle">
        <div className="art-orbit orbit-one" /><div className="art-orbit orbit-two" />
        <div className="art-caption"><span className="caption-dot" /> A more human way to find support</div>
        <div className="flow-card story-card"><div className="flow-label"><span className="flow-icon icon-story">“</span><span>YOUR STORY</span><span className="lock-mini">⌑</span></div><div className="story-lines"><i /><i /><i className="short" /></div><div className="card-foot">Private by choice</div></div>
        <div className="flow-connector connector-a"><span>· · ·</span><b>›</b></div>
        <div className="flow-card insight-card"><div className="flow-label"><span className="flow-icon icon-insight">✳</span><span>WHAT MATTERS</span></div><p>Family expectations<br />Privacy<br />A listener, not advice</p><div className="insight-foot"><span>YOUR WORDS, REFLECTED</span><span>✓</span></div></div>
        <div className="flow-connector connector-b"><span>· · ·</span><b>›</b></div>
        <div className="flow-card circle-card-art"><div className="flow-label"><span className="flow-icon icon-circle">◌</span><span>A CIRCLE THAT GETS IT</span></div><div className="avatar-stack"><span>M</span><span>S</span><span>+</span></div><div className="art-circle-title">Shared experience,<br />without the pressure.</div><div className="circle-foot"><span className="tiny-online" /> Small, thoughtful circles</div></div>
        <div className="art-stamp"><span>✳</span><br />YOU<br />CHOOSE<br />THE PACE</div>
        <div className="art-bottom-note"><span>“</span> Context can make all the difference.</div>
      </div>
    </section>

    <section className="how-section" id="how-it-works"><div className="wrap">
      <div className="section-heading"><div><div className="eyebrow"><span className="eyebrow-line" /> A SMALLER FIRST STEP</div><h2>From “I don’t know where to start”<br /><em>to “they understand.”</em></h2></div><p>A guided experience built around what you need, what you want to keep private, and how you’d like to participate.</p></div>
      <div className="steps-row"><article className="landing-step"><span className="step-number">01</span><span className="step-icon">↗</span><h3>Put it in your own words</h3><p>Begin with what’s on your mind. No labels or categories to figure out first.</p></article><div className="step-divider" /><article className="landing-step"><span className="step-number">02</span><span className="step-icon">✳</span><h3>Shape what feels right</h3><p>Review an example interpretation, correct it, and choose the kind of support you want.</p></article><div className="step-divider" /><article className="landing-step"><span className="step-number">03</span><span className="step-icon">◌</span><h3>Choose your next step</h3><p>Explore relevant circles. Read quietly or introduce yourself with only what you approve.</p></article></div>
    </div></section>

    <section className="stories-section wrap"><div className="stories-intro"><div className="eyebrow"><span className="eyebrow-line" /> DIFFERENT NEEDS, DIFFERENT FIRST STEPS</div><h2>Connection doesn’t<br />look the same for everyone.</h2><p>These fictional scenarios show how the idea could extend beyond the primary demo.</p></div><div className="story-grid">{stories.map((story) => <article className={`persona-card ${story.tone}`} key={story.name}><div className="persona-top"><span className="persona-mark">{story.mark}</span><span>ILLUSTRATIVE CONCEPT</span></div><h3>{story.title}</h3><p>{story.copy}</p><div className="persona-person"><span className="persona-avatar">{story.name[0]}</span><span><strong>{story.name}, {story.age}</strong><small>Fictional persona</small></span><span className="persona-arrow">↗</span></div></article>)}</div></section>

    <section className="closing-cta"><div className="wrap closing-inner"><div><div className="eyebrow light"><span className="eyebrow-line" /> A THREE-MINUTE WALKTHROUGH</div><h2>See what changes when<br />context comes first.</h2></div><Link href="/demo" className="button button-light button-large">Start the demo <span aria-hidden="true">→</span></Link></div></section>
    <footer className="site-footer wrap"><Link href="/" className="brand footer-brand"><span className="brand-mark">b</span><span>Beyond Silence</span></Link><p>Concept prototype · Fictional personas and simulated responses · Not therapy or crisis care</p><a href="#top" className="back-top">Back to top ↑</a></footer>
  </main>;
}
