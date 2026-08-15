import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';

export const metadata = {
  title: 'Luxia-IT | Industries',
  description: 'Technology in context. Financial services, technology, retail, industrial, professional services, and public sector.',
};

export default function IndustriesPage() {
  return (
    <>
      <Header />

      <section className="p-hero">
        <div className="wrap">
          <div className="breadcrumb"><Link href="/">Home</Link> / Industries</div>
          <span className="kicker" style={{ marginBottom: '24px' }}>Industries</span>
          <h1>Technology<br />in <em>context.</em></h1>
          <p className="sub">Six industries where we currently have real depth. The list stays deliberately narrow. An industry only appears here once we can point to work that matters in it.</p>
        </div>
      </section>
      <hr className="hr-fade" />
      <section className="section">
        <div className="wrap">
          <div className="card-grid">
            <Link className="mcard" href="/contact">
              <div className="num">01</div>
              <h4>Financial Services</h4>
              <p>Cloud, Zero Trust identity, and DevSecOps pipelines built for the operational and regulatory shape of financial services.</p>
              <div className="stack">Zero Trust · SecOps · DORA</div>
              <div className="arrow">Explore →</div>
            </Link>
            <Link className="mcard" href="/contact">
              <div className="num">02</div>
              <h4>Technology &amp; Software</h4>
              <p>Platform engineering, developer experience, and AI infrastructure for teams whose product is the software.</p>
              <div className="stack">Platform · DX · MLOps</div>
              <div className="arrow">Explore →</div>
            </Link>
            <Link className="mcard" href="/contact">
              <div className="num">03</div>
              <h4>Retail &amp; Consumer</h4>
              <p>Digital commerce, secure checkout, and data platforms for multi-brand groups where every category has different constraints.</p>
              <div className="stack">Commerce · Data · Loyalty</div>
              <div className="arrow">Explore →</div>
            </Link>
            <Link className="mcard" href="/contact">
              <div className="num">04</div>
              <h4>Industrial &amp; Manufacturing</h4>
              <p>IoT ingestion, edge inference, and OT and IT security for factory environments where uptime is not negotiable.</p>
              <div className="stack">IoT · Edge · OT security</div>
              <div className="arrow">Explore →</div>
            </Link>
            <Link className="mcard" href="/contact">
              <div className="num">05</div>
              <h4>Professional Services</h4>
              <p>Automation and knowledge tooling for firms whose product is their people&apos;s time.</p>
              <div className="stack">Automation · AI · Knowledge</div>
              <div className="arrow">Explore →</div>
            </Link>
            <Link className="mcard" href="/contact">
              <div className="num">06</div>
              <h4>Public &amp; Social Sector</h4>
              <p>Sovereign-friendly cloud, accessibility, and delivery models built for public procurement and long-term service life.</p>
              <div className="stack">Sovereign · A11y · Procurement</div>
              <div className="arrow">Explore →</div>
            </Link>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="wrap">
          <span className="kicker">How we serve an industry</span>
          <h2>Every industry page will answer four questions.</h2>
          <div className="dlist" style={{ marginTop: 'calc(1.5*var(--leading))' }}>
            <div className="row"><span className="k">01</span><span className="t">What are the business challenges?</span><span className="m">context</span></div>
            <div className="row"><span className="k">02</span><span className="t">What are the technology challenges?</span><span className="m">context</span></div>
            <div className="row"><span className="k">03</span><span className="t">Which Luxia capabilities apply, and how?</span><span className="m">answer</span></div>
            <div className="row"><span className="k">04</span><span className="t">What have we already shipped here?</span><span className="m">proof</span></div>
          </div>
        </div>
      </section>
      <section className="close-cta">
        <div className="wrap">
          <h2>Sector not on the list yet?</h2>
          <p className="lede">We would rather have real depth in six industries than a landing page in twenty. If yours is not on this list and you think it should be, tell us why.</p>
          <div className="row"><Link className="btn btn-primary" href="/contact">Start a conversation →</Link></div>
        </div>
      </section>

      <Footer />
    </>
  );
}
