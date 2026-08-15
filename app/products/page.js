import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';

export const metadata = {
  title: 'Luxia-IT | Products and Solutions',
  description: 'Products built for specific business problems. Platforms, applications, and solutions engineered by Luxia-IT.',
};

export default function ProductsPage() {
  return (
    <>
      <Header />

      <section className="p-hero">
        <div className="wrap">
          <div className="breadcrumb"><Link href="/">Home</Link> / <Link href="/what-we-do">What we do</Link> / Products &amp; Solutions</div>
          <span className="kicker" style={{ marginBottom: '24px' }}>01 · Products &amp; Solutions</span>
          <h1>Products built<br />around <em>real problems.</em></h1>
          <p className="sub">Products we design, build, and operate. Each one is scoped around a real business problem, not a generic backlog. The teams using them are the same teams that keep the business running each day.</p>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <span className="kicker">Featured products</span>
          <h2>What we&apos;re building.</h2>
          <p className="lede">Real products, described honestly. Where a product has not launched publicly yet, the status on this page says so.</p>

          <div className="card-grid">
            <Link className="mcard" href="/contact">
              <span className="pill accent">In development</span>
              <div className="num">CTOS · Platform</div>
              <h4>Secure Azure landing zone, out of the box.</h4>
              <p>For teams under regulatory pressure who need a compliant Azure landing zone quickly. Provisions the landing zone, wires GitOps delivery, and enforces policy through OPA.</p>
              <div className="stack">Azure · IaC · OPA · GitOps</div>
              <div className="arrow">Request early access →</div>
            </Link>
            <Link className="mcard" href="/contact">
              <span className="pill accent">In development</span>
              <div className="num">SecureFlow</div>
              <h4>DevSecOps pipeline for regulated finance.</h4>
              <p>For banking workloads where every deployment must be signed, audited, and reversible. A multi-cloud DevSecOps reference with signed artefacts, SBOMs, and break-glass approvals built in.</p>
              <div className="stack">Multi-cloud · SLSA · SBOM</div>
              <div className="arrow">Book a demo →</div>
            </Link>
            <Link className="mcard" href="/contact">
              <span className="pill">Coming soon</span>
              <div className="num">IAM Azure PME</div>
              <h4>Identity, tuned for mid-market.</h4>
              <p>For growing companies whose identity story has outgrown ad hoc groups. An Entra ID and conditional access baseline that we install, harden, and hand over.</p>
              <div className="stack">Entra ID · CAE · SSO</div>
              <div className="arrow">Join the waitlist →</div>
            </Link>
            <Link className="mcard" href="/contact">
              <span className="pill">Placeholder</span>
              <div className="num">Solution 04</div>
              <h4>Data platform starter for industrial IoT.</h4>
              <p>For factories moving from spreadsheets to a real data platform. Ingestion, storage, governance, and a first analytics layer, packaged for OT environments.</p>
              <div className="stack">Fabric · Databricks · Edge</div>
              <div className="arrow">Learn more →</div>
            </Link>
            <Link className="mcard" href="/contact">
              <span className="pill">Placeholder</span>
              <div className="num">Solution 05</div>
              <h4>AI assistants that survive procurement.</h4>
              <p>For teams whose AI features must survive procurement. A framework for enterprise-grade agents with grounding, guardrails, evaluation, and the audit trail buyers request.</p>
              <div className="stack">LLM · RAG · Guardrails</div>
              <div className="arrow">Learn more →</div>
            </Link>
            <Link className="mcard" href="/contact">
              <span className="pill">Placeholder</span>
              <div className="num">Solution 06</div>
              <h4>Observability, without the license shock.</h4>
              <p>For teams whose observability bill has outgrown the value it returns. A curated open-source stack on OpenTelemetry, deployed on your infrastructure.</p>
              <div className="stack">OTel · Prometheus · Grafana</div>
              <div className="arrow">Learn more →</div>
            </Link>
          </div>
        </div>
      </section>

      <section className="accent-band">
        <div className="wrap">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '56px', alignItems: 'center' }}>
            <div>
              <span className="kicker" style={{ color: 'var(--color-text)' }}>Our approach</span>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 500, fontSize: 'clamp(28px,3vw,42px)', letterSpacing: '-.02em', margin: '16px 0 16px', lineHeight: 1.1 }}>From the business problem<br />to a running system.</h2>
            </div>
            <div style={{ display: 'grid', gap: '14px' }}>
              <div style={{ fontSize: '14px', lineHeight: 1.6 }}><b style={{ color: 'var(--color-accent)', fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '11px', letterSpacing: '.1em', marginRight: '12px' }}>01</b>Problem definition with the business</div>
              <div style={{ fontSize: '14px', lineHeight: 1.6 }}><b style={{ color: 'var(--color-accent)', fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '11px', letterSpacing: '.1em', marginRight: '12px' }}>02</b>Opportunity sizing and technology fit</div>
              <div style={{ fontSize: '14px', lineHeight: 1.6 }}><b style={{ color: 'var(--color-accent)', fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '11px', letterSpacing: '.1em', marginRight: '12px' }}>03</b>Solution design and prototype</div>
              <div style={{ fontSize: '14px', lineHeight: 1.6 }}><b style={{ color: 'var(--color-accent)', fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '11px', letterSpacing: '.1em', marginRight: '12px' }}>04</b>Build, secure, measure</div>
              <div style={{ fontSize: '14px', lineHeight: 1.6 }}><b style={{ color: 'var(--color-accent)', fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '11px', letterSpacing: '.1em', marginRight: '12px' }}>05</b>Roadmap and handover</div>
            </div>
          </div>
        </div>
      </section>

      <section className="close-cta">
        <div className="wrap">
          <span className="kicker">Product partnership</span>
          <h2>Building something that isn&apos;t on this page?</h2>
          <p className="lede" style={{ maxWidth: '56ch' }}>If you have a real problem worth building around, we will tell you honestly whether Luxia is the right partner, and whether a product is the right answer at all.</p>
          <div className="row"><Link className="btn btn-primary" href="/contact">Discuss a product →</Link></div>
        </div>
      </section>

      <Footer />
    </>
  );
}
