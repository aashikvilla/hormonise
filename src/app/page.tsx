import Link from "next/link";

const entryChoices = [
  { path: "talk", title: "Talk something through", description: "Start with a few words, or choose a sample response." },
  { path: "unsure", title: "I'm not sure where to start", description: "Take one small step, with a skip option." },
  { path: "quiet", title: "Just read experiences", description: "Browse communities without sharing a personal story." },
  { path: "support", title: "I'd like to support others", description: "See how a contributor chooses what to share." },
];

export default function Home() {
  return <main className="landing-page">
    <header className="landing-header"><Link href="/" className="brand"><span className="brand-mark" aria-hidden="true">h</span><span>Harmonise</span></Link><span className="demo-badge">Concept demo</span></header>
    <section className="landing-hero">
      <div className="landing-copy"><p className="page-kicker">HUMAN EXPERIENCES · YOUR CHOICE</p><h1>You don&apos;t have to know what to say.</h1><p className="landing-tagline">Find understanding, and people who understand — on your terms.</p><p className="landing-description">Talk privately, explore lived-experience examples, and see how communities could fit what matters to you. You choose what to share.</p><Link className="button button-primary" href="/demo?example=arjun">Explore Arjun&apos;s fictional example <span aria-hidden="true">→</span></Link><p className="small-note">No account required. This demo uses fictional people, communities and responses.</p></div>
      <div className="landing-illustration" aria-label="A private thought, a user-confirmed need, and a human community">
        <div className="illustration-step step-private"><span className="illustration-symbol">“</span><div><small>YOUR WORDS</small><strong>Something feels difficult</strong></div></div>
        <div className="illustration-line" aria-hidden="true"/>
        <div className="illustration-step step-need"><span className="illustration-symbol">✓</span><div><small>YOUR CHOICE</small><strong>What would help now?</strong></div></div>
        <div className="illustration-line" aria-hidden="true"/>
        <div className="illustration-step step-community"><span className="illustration-symbol">○</span><div><small>HUMAN COMMUNITY</small><strong>Read, connect or leave</strong></div></div>
      </div>
    </section>
    <section className="landing-paths" aria-labelledby="paths-heading"><div className="section-title"><div><p className="page-kicker">CHOOSE A STARTING POINT</p><h2 id="paths-heading">Begin in the way that feels right.</h2></div><p>There is no required order. You can read quietly or stop at any point.</p></div><div className="landing-path-grid">{entryChoices.map((choice) => <Link className="landing-path" href={`/demo?path=${choice.path}`} key={choice.path}><span><strong>{choice.title}</strong><small>{choice.description}</small></span><span aria-hidden="true">→</span></Link>)}</div></section>
    <footer className="landing-footer"><span>Harmonise · fictional demo</span><span>Not therapy, crisis care or live human support</span><Link href="/demo?help=safety">Privacy &amp; safety</Link><Link href="/demo?path=quiet">Read without sharing →</Link></footer>
  </main>;
}
