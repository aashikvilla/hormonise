import Link from "next/link";

const entryChoices = [
  { path: "talk", title: "Talk something through", description: "Start with a few words, or choose a sample response." },
  { path: "unsure", title: "I'm not sure where to start", description: "Take one small step, with a skip option." },
  { path: "quiet", title: "Just read experiences", description: "Browse communities without sharing a personal story." },
  { path: "support", title: "I'd like to support others", description: "See how a contributor chooses what to share." },
];

export default function Home() {
  return <main className="landing-page">
    <header className="landing-header"><Link href="/" className="brand"><span className="brand-mark" aria-hidden="true">h</span><span>Harmonise</span></Link><span className="demo-badge">Illustrative scenario · fictional participants</span></header>
    <section className="landing-hero">
      <div className="landing-copy"><p className="page-kicker">HUMAN EXPERIENCES · YOUR CHOICE</p><h1>You don&apos;t have to have the right words.</h1><p className="landing-tagline">Talk privately, explore what others have experienced, or just look around.</p><p className="landing-description">Find a clearer way to say what matters, then explore human perspectives at your own pace. You choose what to share.</p><div className="landing-actions"><Link className="button button-primary" href="/demo?path=talk">Start with what&apos;s on your mind <span aria-hidden="true">→</span></Link><Link className="text-button-link" href="/demo?path=quiet">Explore experiences</Link><Link className="text-button-link" href="/demo?help=safety">Find human support</Link></div><p className="small-note">No account needed. <Link href="/demo?example=arjun">Follow Arjun&apos;s illustrative story</Link>.</p></div>
      <div className="landing-illustration" aria-label="A private thought, a user-confirmed need, and a human community">
        <div className="illustration-step step-private"><span className="illustration-symbol">“</span><div><small>YOUR WORDS</small><strong>Something feels difficult</strong></div></div>
        <div className="illustration-line" aria-hidden="true"/>
        <div className="illustration-step step-need"><span className="illustration-symbol">✓</span><div><small>YOUR CHOICE</small><strong>What would help now?</strong></div></div>
        <div className="illustration-line" aria-hidden="true"/>
        <div className="illustration-step step-community"><span className="illustration-symbol">○</span><div><small>HUMAN COMMUNITY</small><strong>Read, connect or leave</strong></div></div>
      </div>
    </section>
    <section className="landing-paths" aria-labelledby="paths-heading"><div className="section-title"><div><p className="page-kicker">CHOOSE A STARTING POINT</p><h2 id="paths-heading">Begin in the way that feels right.</h2></div><p>There is no required order. You can read quietly or stop at any point.</p></div><div className="landing-path-grid">{entryChoices.map((choice) => <Link className="landing-path" href={`/demo?path=${choice.path}`} key={choice.path}><span><strong>{choice.title}</strong><small>{choice.description}</small></span><span aria-hidden="true">→</span></Link>)}</div></section>
    <footer className="landing-footer"><span>Harmonise</span><span>Prepared content only · no live AI or human messages</span><Link href="/demo?help=safety">How privacy works</Link><Link href="/demo?path=quiet">Read without sharing →</Link></footer>
  </main>;
}
