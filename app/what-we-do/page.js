import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';

export const metadata = {
  title: 'Luxia-IT | What we do',
  description: 'Three practices, one company. Products & Solutions, Technology Consulting, and Luxia Academy.',
};

export default function WhatWeDoPage() {
  return (
    <>
      <Header />

      <section className="p-hero">
        <div className="wrap">
          <div className="breadcrumb"><Link href="/">Home</Link> / What we do</div>
          <span className="kicker" style={{ marginBottom: '24px' }}>What we do</span>
          <h1>Three practices.<br />One <em>company.</em></h1>
          <p className="sub">The three practices keep each other honest. Building products keeps our engineering current. Consulting keeps that engineering close to the businesses that use it. The Academy makes the team sustainable, and eventually the wider talent market too.</p>
          <div className="cta">
            <Link className="btn btn-primary" href="/contact">Discuss a project →</Link>
            <Link className="btn btn-secondary" href="/industries">Explore by industry</Link>
          </div>
        </div>
      </section>
      <hr className="hr-fade" />
      <section className="section">
        <div className="wrap">
          <div className="card-grid">
            <Link className="mcard" href="/products" style={{ minHeight: '360px', padding: '32px' }}>
              <div className="num">01 · Products &amp; Solutions</div>
              <h4 style={{ fontSize: '26px' }}>We build technology.</h4>
              <p>Digital platforms, business applications, cloud services, cybersecurity products, and automation. Each product is engineered around a specific business problem rather than a generic backlog.</p>
              <div className="stack">Platforms · Applications · SaaS · Automation · AI</div>
              <div className="arrow">Explore our solutions →</div>
            </Link>
            <Link className="mcard" href="/consulting" style={{ minHeight: '360px', padding: '32px' }}>
              <div className="num">02 · Technology Consulting</div>
              <h4 style={{ fontSize: '26px' }}>We solve complex problems.</h4>
              <p>Senior engineers and architects for Cloud, Cybersecurity, DevSecOps, Software Engineering, Data &amp; AI. Delivery, not decks.</p>
              <div className="stack">Cloud · Security · DevSecOps · Data · AI</div>
              <div className="arrow">Explore our capabilities →</div>
            </Link>
            <Link className="mcard" href="/academy" style={{ minHeight: '360px', padding: '32px' }}>
              <div className="num">03 · Luxia Academy</div>
              <h4 style={{ fontSize: '26px' }}>We build talent.</h4>
              <p>Programs in cybersecurity, cloud, DevSecOps, and data. Built and taught by the engineers who deliver client work.</p>
              <div className="stack">Cybersecurity · Cloud · DevSecOps · Data · AI</div>
              <div className="arrow">Explore the Academy →</div>
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <span className="kicker">How the three connect</span>
          <h2>Three practices that feed each other.</h2>
          <p className="lede">The three practices are structured to reinforce each other. Consulting engagements surface opportunities we can turn into products. Products give the consulting practice real engineering depth. The Academy trains the people who staff both, and over time becomes a talent pipeline for the wider ecosystem.</p>
          <div className="split" style={{ marginTop: 'calc(1.5*var(--leading))' }}>
            <div>
              <div className="pill accent" style={{ marginBottom: '16px' }}>The loop</div>
              <p style={{ fontSize: '16px', lineHeight: 1.7, color: 'color-mix(in srgb,var(--color-text) 78%,transparent)', maxWidth: '52ch' }}>Products, consulting, and the Academy each keep the next one honest. The loop is intentional.</p>
            </div>
            <div className="dlist">
              <div className="row"><span className="k">→</span><span className="t">Products earn technical credibility</span><span className="m">shipped code</span></div>
              <div className="row"><span className="k">→</span><span className="t">Consulting stays close to real problems</span><span className="m">on the ground</span></div>
              <div class="row"><span className="k">→</span><span className="t">Academy trains the practitioners</span><span className="m">who ship &amp; deliver</span></div>
              <div className="row"><span className="k">→</span><span className="t">The pipeline feeds back into Products</span><span className="m">and outward</span></div>
            </div>
          </div>
        </div>
      </section>
      <section className="close-cta">
        <div className="wrap">
          <h2>Let&apos;s build <em>what&apos;s next</em>.</h2>
          <div className="row"><Link className="btn btn-primary" href="/contact">Discuss a project →</Link><Link className="btn btn-secondary" href="/careers">Join Luxia</Link></div>
        </div>
      </section>

      <Footer />
    </>
  );
}
