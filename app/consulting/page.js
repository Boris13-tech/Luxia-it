import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';

export const metadata = {
  title: 'Luxia-IT | Technology Consulting',
  description: 'We solve complex technology problems. Cloud, cybersecurity, DevSecOps, software engineering, and data, delivered by senior engineers.',
};

export default function ConsultingPage() {
  return (
    <>
      <Header />

      <section className="p-hero">
        <div className="wrap">
          <div className="breadcrumb"><Link href="/">Home</Link> / <Link href="/what-we-do">What we do</Link> / Technology Consulting</div>
          <span className="kicker" style={{ marginBottom: '24px' }}>02 · Technology Consulting</span>
          <h1>We solve<br /><em>complex problems.</em></h1>
          <p className="sub">Cloud, Cybersecurity, DevSecOps, Software Engineering, Data &amp; AI. Delivered by senior engineers who ship, not slide decks.</p>
          <div className="cta"><Link className="btn btn-primary" href="/contact">Talk to an expert →</Link></div>
        </div>
      </section>

      <hr className="hr-fade" />
      <section className="section">
        <div className="wrap">
          <span className="kicker">Capabilities</span>
          <h2>The seven practices.</h2>
          <p className="lede">Each practice is a real team. A single practice can lead an engagement on its own, or plug into a wider transformation programme.</p>

          <div className="card-grid">
            <div className="mcard">
              <div className="num">01 · Cloud &amp; Infrastructure</div>
              <h4>Azure, architecture, migration, governance.</h4>
              <p>When cloud spend is climbing and the platform is holding delivery back. We design landing zones, put the platform on infrastructure as code, and bring FinOps discipline to the bill. Multi-cloud only when it earns its keep.</p>
              <div className="stack">Azure · Terraform · Bicep · FinOps</div>
            </div>
            <div className="mcard">
              <div className="num">02 · Cybersecurity</div>
              <h4>Zero Trust, identity, resilience.</h4>
              <p>When the perimeter model no longer fits the way the business works. Security architecture, Entra ID, conditional access, SIEM, and incident response, grounded in the Azure security baseline we have worked with for years.</p>
              <div className="stack">Entra ID · Zero Trust · SIEM · IR</div>
            </div>
            <div className="mcard">
              <div className="num">03 · DevSecOps</div>
              <h4>Secure software delivery, end to end.</h4>
              <p>When shipping is slow and every release is a negotiation with audit. Continuous delivery, policy as code, SBOM generation, signed artefacts, and the review gates regulators expect.</p>
              <div className="stack">GitHub · Azure DevOps · OPA · SLSA</div>
            </div>
            <div className="mcard">
              <div className="num">04 · Software Engineering</div>
              <h4>Products, applications, platforms.</h4>
              <p>When an internal application has outgrown the spreadsheet or the initial contractor. Senior full-stack engineers who build the application and stay long enough for it to hold up under real load and audit.</p>
              <div className="stack">React · .NET · Node · Go · Python</div>
            </div>
            <div className="mcard">
              <div className="num">05 · Data &amp; AI</div>
              <h4>Platforms, intelligence, governance.</h4>
              <p>When the data is present but not usable, or the AI feature is stuck in proof-of-concept. Data platforms, warehouses, and AI systems with the evaluation and audit trails needed for regulated use.</p>
              <div className="stack">Fabric · Databricks · LLM · RAG</div>
            </div>
            <div className="mcard">
              <div className="num">06 · Automation</div>
              <h4>Business processes, at engineer scale.</h4>
              <p>When repetitive work is quietly eating a team&apos;s week. Automation of what should not require a human, with the observability and governance to keep it running.</p>
              <div className="stack">Power Platform · APIs · RPA</div>
            </div>
            <div className="mcard" style={{ gridColumn: 'span 2' }}>
              <div className="num">07 · Technology Strategy &amp; Architecture</div>
              <h4>Modernisation, governance, transformation.</h4>
              <p>When the next twelve months of delivery need a clearer shape. Architecture reviews, technology roadmaps, and target operating models, delivered as a short senior engagement.</p>
              <div className="stack">Enterprise architecture · TRM · TOM · Governance</div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <span className="kicker">How we work</span>
          <h2>How the work runs in practice.</h2>
          <div className="split" style={{ marginTop: 'calc(1.5*var(--leading))' }}>
            <div>
              <p style={{ fontSize: '16px', lineHeight: 1.7, color: 'color-mix(in srgb,var(--color-text) 78%,transparent)', maxWidth: '52ch' }}>Engagements are staffed with senior engineers who embed with the client team. We measure ourselves on delivered outcomes, not billable hours. Most engagements run between one and twelve months, and a short discovery is often the honest way to start.</p>
            </div>
            <div className="dlist">
              <div className="row"><span className="k">01</span><span className="t">Discovery<small>1 to 2 weeks</small></span><span className="m">problem, options, plan</span></div>
              <div className="row"><span className="k">02</span><span className="t">Architecture<small>2 to 6 weeks</small></span><span className="m">target design, roadmap</span></div>
              <div className="row"><span className="k">03</span><span className="t">Delivery<small>1 to 12 months</small></span><span className="m">shipping, together</span></div>
              <div className="row"><span className="k">04</span><span className="t">Handover<small>2 to 4 weeks</small></span><span class="m">skills &amp; ownership</span></div>
            </div>
          </div>
        </div>
      </section>

      <section className="close-cta">
        <div className="wrap">
          <h2>Have a <em>complex problem?</em></h2>
          <p className="lede">A one-hour call with a senior engineer costs nothing, and usually clarifies more than a written proposal would.</p>
          <div className="row"><Link className="btn btn-primary" href="/contact">Talk to an expert →</Link></div>
        </div>
      </section>

      <Footer />
    </>
  );
}
