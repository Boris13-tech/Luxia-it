import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';

export const metadata = {
  title: 'Luxia-IT | Insights',
  description: 'How Luxia-IT thinks about technology. Perspectives, research, and engineering stories.',
};

export default function InsightsPage() {
  return (
    <>
      <Header />

      <section className="p-hero">
        <div className="wrap">
          <div className="breadcrumb"><Link href="/">Home</Link> / Insights</div>
          <span className="kicker" style={{ marginBottom: '24px' }}>Insights</span>
          <h1>Notes on<br />the <em>work.</em></h1>
          <p className="sub">Perspectives, short pieces of research, and field notes. Written by the engineers, architects, and consultants working on the problems described elsewhere on this site.</p>
        </div>
      </section>
      <hr className="hr-fade" />
      <section className="section">
        <div className="wrap">
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: 'calc(1.5*var(--leading))' }}>
            <span className="pill accent">All</span>
            <span className="pill">Perspectives</span>
            <span className="pill">Research</span>
            <span className="pill">Technology briefs</span>
            <span className="pill">Engineering stories</span>
            <span className="pill">Executive insights</span>
          </div>

          <Link href="/contact" style={{ textDecoration: 'none', color: 'inherit', display: 'block', padding: '40px', border: '1px solid var(--color-divider)', borderRadius: '14px', background: 'linear-gradient(180deg,var(--color-surface),transparent)', marginBottom: '32px' }}>
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center', fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '11px', color: 'color-mix(in srgb,var(--color-text) 55%,transparent)', marginBottom: '20px' }}>
              <span style={{ color: 'var(--color-accent)', letterSpacing: '.12em', textTransform: 'uppercase' }}>Perspective</span><span>Placeholder · 8 min read</span>
            </div>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 500, fontSize: 'clamp(28px,3vw,42px)', letterSpacing: '-.02em', margin: '0 0 16px', maxWidth: '24ch', lineHeight: 1.1 }}>What comes after identity in a Zero Trust programme.</h3>
            <p style={{ fontSize: '16px', color: 'color-mix(in srgb,var(--color-text) 75%,transparent)', maxWidth: '64ch', margin: '0 0 20px', lineHeight: 1.6 }}>Most Zero Trust programs stop after identity and conditional access are done. The harder work, and where most projects run into trouble, sits in network segmentation, data access, and the seams between them.</p>
            <div style={{ fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '11px', color: 'var(--color-accent)' }}>Read →</div>
          </Link>

          <div className="card-grid">
            <Link className="mcard" href="/contact">
              <div className="num">Research</div>
              <h4>The FinOps trap.</h4>
              <p>How landing-zone decisions quietly compound into six-figure invoices around month twelve.</p>
              <div className="stack">Placeholder · 6 min · Cloud</div>
            </Link>
            <Link className="mcard" href="/contact">
              <div className="num">Engineering story</div>
              <h4>Shipping AI features that survive procurement.</h4>
              <p>Building an AI feature is straightforward. Building one that clears enterprise procurement is a different discipline.</p>
              <div className="stack">Placeholder · 7 min · Data &amp; AI</div>
            </Link>
            <Link className="mcard" href="/contact">
              <div className="num">Technology brief</div>
              <h4>DORA, DevSecOps, and the paperwork.</h4>
              <p>What DORA actually requires of a delivery pipeline in practice.</p>
              <div className="stack">Placeholder · 5 min · DevSecOps</div>
            </Link>
            <Link className="mcard" href="/contact">
              <div className="num">Perspective</div>
              <h4>Small models, big pipelines.</h4>
              <p>Why the interesting production questions in AI have moved back to the pipeline.</p>
              <div className="stack">Placeholder · 6 min · Data &amp; AI</div>
            </Link>
            <Link className="mcard" href="/contact">
              <div className="num">Executive insight</div>
              <h4>The five decisions that shape a cloud programme.</h4>
              <p>Five decisions a CIO makes early in a cloud programme and lives with for years.</p>
              <div className="stack">Placeholder · 9 min · Cloud</div>
            </Link>
            <Link className="mcard" href="/contact">
              <div className="num">Engineering story</div>
              <h4>What a good SBOM looks like.</h4>
              <p>The gap between an SBOM you can generate and an SBOM an auditor will accept.</p>
              <div className="stack">Placeholder · 4 min · DevSecOps</div>
            </Link>
          </div>
        </div>
      </section>
      <section className="close-cta">
        <div className="wrap">
          <h2>Get the next piece.</h2>
          <p className="lede">An occasional email. Perspectives and engineering notes when there is something worth saying, never on a schedule.</p>
          <div style={{ display: 'flex', gap: '8px', maxWidth: '460px', marginTop: '20px' }}>
            <input className="input" type="email" placeholder="you@company.com" style={{ flex: 1 }} />
            <button className="btn btn-primary">Subscribe</button>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
