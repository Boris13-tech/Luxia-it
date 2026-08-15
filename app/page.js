'use client';

import './page.css';
import Link from 'next/link';
import { useEffect, useRef } from 'react';

export default function HomePage() {
  const menuRef = useRef(null);

  useEffect(() => {
    // Load hero-fx.js as a module script (it uses dynamic import('three'))
    const script = document.createElement('script');
    script.src = '/hero-fx.js';
    script.type = 'module';
    document.body.appendChild(script);

    // Load image-slot.js web component
    const imgSlotScript = document.createElement('script');
    imgSlotScript.src = '/image-slot.js';
    document.body.appendChild(imgSlotScript);

    return () => {
      document.body.removeChild(script);
      document.body.removeChild(imgSlotScript);
    };
  }, []);

  function toggleMenu() {
    if (menuRef.current) {
      menuRef.current.classList.toggle('open');
    }
  }

  return (
    <>
      {/* ========= TOP NAV ========= */}
      <header className="top">
        <div className="inner">
          <Link className="brand" href="/"><img src="/logo Luxia-IT.png" alt="Luxia-IT" style={{height:'24px',width:'auto'}} /></Link>
          <nav ref={menuRef}>
            <Link href="/what-we-do">What we do</Link>
            <Link href="/products">Products</Link>
            <Link href="/consulting">Consulting</Link>
            <Link href="/academy">Academy</Link>
            <Link href="/industries">Industries</Link>
            <Link href="/insights">Insights</Link>
            <Link href="/about">About</Link>
            <Link href="/careers">Careers</Link>
          </nav>
          <div className="r">
            <span className="lang"><b>EN</b> / FR</span>
            <Link className="btn btn-primary" href="/contact">Talk to an expert</Link>
            <button className="mburger" type="button" onClick={toggleMenu}>Menu</button>
          </div>
        </div>
      </header>

      {/* ========= HERO ========= */}
      <div className="hero-shell">
        <canvas className="hero-fx" id="hero-fx" aria-hidden="true"></canvas>
        <section className="hero">
          <div className="wrap">
            <div className="grid">
              <div>
                <div className="kicker" style={{marginBottom:'24px'}}>A Legrand-Tech company</div>
                <h1>We build<br />what&apos;s <span className="accent">next.</span></h1>
                <p className="sub">We build technology products, we work on the systems businesses already run, and we train the engineers and consultants who deliver both. Three practices, one company.</p>
                <div className="cta">
                  <Link className="btn btn-primary" href="/contact">Discuss a project →</Link>
                  <Link className="btn btn-secondary" href="/what-we-do">Explore what we do</Link>
                </div>
              </div>
              <aside className="hero-side">
                <div className="lbl">Three practices, one company</div>
                <div className="three">
                  <div className="row"><div className="n">01</div><div><div className="t">Products &amp; Solutions</div><div className="d">Software we design, build, and operate.</div></div></div>
                  <div className="row"><div className="n">02</div><div><div className="t">Technology Consulting</div><div className="d">Senior engineers embedded with your team; deliverables are running systems.</div></div></div>
                  <div className="row"><div className="n">03</div><div><div className="t">Luxia Academy</div><div className="d">Programs run by the engineers who ship for our clients.</div></div></div>
                </div>
              </aside>
            </div>
          </div>
        </section>
      </div>

      <hr className="hr-fade" />

      {/* ========= HERITAGE STRIP ========= */}
      <section className="proof">
        <div className="wrap">
          <div className="row">
            <div className="lbl">Heritage</div>
            <div className="marks" style={{fontSize:'14px',color:'color-mix(in srgb,var(--color-text) 72%,transparent)',fontFamily:'inherit',lineHeight:'1.55',maxWidth:'66ch'}}>
              Luxia-IT continues the technology work of Legrand-Tech, a practice with several years of Azure, cloud security, and DevSecOps engineering behind it. Partner statuses and public credentials are added to this page as they are formalised.
            </div>
          </div>
        </div>
      </section>

      <hr className="hr-fade" />

      {/* ========= WHAT WE DO ========= */}
      <section className="section">
        <div className="wrap">
          <span className="kicker">01 · What we do</span>
          <h2>Three practices. One company.</h2>
          <p className="lede">Products keep the engineering current. Consulting keeps that engineering close to the businesses that use it. The Academy makes the team sustainable, and eventually the wider talent market too.</p>
          <div className="pillars">
            <Link className="pillar" href="/products" style={{textDecoration:'none',color:'inherit'}}>
              <div className="num"><span>01</span><span className="arrow">→</span></div>
              <h3>We build <span className="accent">technology.</span></h3>
              <p className="desc">Products and platforms that Luxia-IT designs, builds, and runs alongside the client teams who use them every day.</p>
              <ul>
                <li>Digital platforms</li>
                <li>Business applications</li>
                <li>SaaS &amp; internal tools</li>
                <li>Automation &amp; AI</li>
              </ul>
              <span className="link">Explore our solutions →</span>
            </Link>
            <Link className="pillar" href="/consulting" style={{textDecoration:'none',color:'inherit'}}>
              <div className="num"><span>02</span><span className="arrow">→</span></div>
              <h3>We solve <span className="accent">complex problems.</span></h3>
              <p className="desc">Senior engineers and architects working inside the client team. The deliverables are running systems, not slide decks.</p>
              <ul>
                <li>Cloud &amp; Azure architecture</li>
                <li>Cybersecurity &amp; Zero Trust</li>
                <li>DevSecOps &amp; delivery</li>
                <li>Data &amp; AI</li>
              </ul>
              <span className="link">Explore our capabilities →</span>
            </Link>
            <Link className="pillar" href="/academy" style={{textDecoration:'none',color:'inherit'}}>
              <div className="num"><span>03</span><span className="arrow">→</span></div>
              <h3>We build <span className="accent">talent.</span></h3>
              <p className="desc">Cohorts are run by the engineers who ship for our clients. The programs mirror how the practice actually works.</p>
              <ul>
                <li>Cybersecurity</li>
                <li>Cloud &amp; Azure</li>
                <li>DevSecOps</li>
                <li>Data &amp; AI</li>
              </ul>
              <span className="link">Explore the Academy →</span>
            </Link>
          </div>

          {/* 3D flywheel */}
          <figure className="pillars-fx-wrap" aria-hidden="true">
            <canvas className="pillars-fx" id="pillars-fx"></canvas>
            <div className="pillars-fx-legend">
              <span><i style={{background:'#9184d9'}}></i>Products</span>
              <span><i style={{background:'#a7a1db'}}></i>Consulting</span>
              <span><i style={{background:'#d2cefd'}}></i>Academy</span>
            </div>
          </figure>
        </div>
      </section>

      {/* ========= HUMAN DIMENSION ========= */}
      <section className="section" style={{paddingTop:0}}>
        <div className="wrap">
          <span className="kicker">The people</span>
          <h2>Engineers, consultants, product teams.</h2>
          <p className="lede">Real photographs of Luxia-IT teams and the environments they work in will replace these slots as the marketing photography is shot. We prefer authentic professional environments to stock imagery. If a photograph was not shot on our floor, it does not ship on the site.</p>
          <div className="humans">
            <figure className="human-slot lighten">
              <image-slot id="home-team-1" shape="rounded" radius="12" placeholder="Engineering team during a code review"></image-slot>
              <figcaption>Engineering. A code review.</figcaption>
            </figure>
            <figure className="human-slot lighten">
              <image-slot id="home-team-2" shape="rounded" radius="12" placeholder="Consulting session at the architecture whiteboard"></image-slot>
              <figcaption>Consulting. Architecture whiteboard.</figcaption>
            </figure>
            <figure className="human-slot lighten">
              <image-slot id="home-team-3" shape="rounded" radius="12" placeholder="Academy classroom, practitioner led"></image-slot>
              <figcaption>Academy. A practitioner-led session.</figcaption>
            </figure>
            <figure className="human-slot lighten">
              <image-slot id="home-team-4" shape="rounded" radius="12" placeholder="Product team planning"></image-slot>
              <figcaption>Product. A planning morning.</figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* ========= STAT BAND ========= */}
      <section className="stats-band" aria-label="Luxia-IT at a glance">
        <div className="wrap">
          <div className="grid">
            <div className="stat"><div className="n">3</div><div className="lbl">Practices, one company</div></div>
            <div className="stat"><div className="n">7</div><div className="lbl">Technology domains</div></div>
            <div className="stat"><div className="n">6</div><div className="lbl">Industries served</div></div>
            <div className="stat"><div className="n">EU / FR</div><div className="lbl">First markets<div className="note">Working across France and the EU</div></div></div>
          </div>
        </div>
      </section>

      {/* ========= FEATURED WORK ========= */}
      <section className="section">
        <div className="wrap">
          <span className="kicker">02 · Selected work</span>
          <h2>How we tell a case study.</h2>
          <p className="lede">Case studies are published once the client has reviewed the story and any figures we quote. The slots below show the format. Real work replaces them as clients agree to publish.</p>
          <div className="work-grid">
            <article className="case big">
              <div className="placeholder-ribbon">Format · awaiting first story</div>
              <div>
                <div className="tags"><span className="tag">Cloud</span><span className="tag">Zero Trust</span><span className="tag">Financial Services</span></div>
                <h4>The challenge, approach, and outcome format.</h4>
                <p className="excerpt">A one-line summary of the problem the client came to us with. Then the shape of the engagement: who was on the ground, how long the work took, and what was decided. Then the technology choices, and finally the outcome, with numbers only when the client has signed them off.</p>
              </div>
              <div className="impact">
                <div><div className="k">Challenge</div><div className="v">to publish</div></div>
                <div><div className="k">Approach</div><div className="v">to publish</div></div>
                <div><div className="k">Outcome</div><div className="v">to publish</div></div>
              </div>
            </article>
            <div className="col">
              <article className="case">
                <div className="placeholder-ribbon">Format</div>
                <div className="tags"><span className="tag">DevSecOps</span><span className="tag">Retail</span></div>
                <h4>Secure CI/CD pipelines, told as a story.</h4>
                <p className="excerpt">Format only. Real DevSecOps work will appear here as clients agree to publish.</p>
              </article>
              <article className="case">
                <div className="placeholder-ribbon">Format</div>
                <div className="tags"><span className="tag">Data &amp; AI</span><span className="tag">Industrial</span></div>
                <h4>Data platforms and AI, told as a story.</h4>
                <p className="excerpt">Format only. The first industrial data engagement will be summarised here.</p>
              </article>
            </div>
          </div>
        </div>
      </section>

      <hr className="hr-fade" />

      {/* ========= TECHNOLOGIES ========= */}
      <section className="section">
        <div className="wrap">
          <span className="kicker">03 · Technologies</span>
          <h2>Where our engineering lives.</h2>
          <p className="lede">Seven domains, each with its own architects, engineers, and delivery lead. No specialty on this page is a solo pursuit.</p>
          <div className="tech-matrix">
            <Link className="tech-cell" href="/consulting" style={{textDecoration:'none',color:'inherit'}}>
              <div><div className="cat">01 · Cloud</div><h5>Azure, architecture, migration.</h5><div className="stack">Landing zones · IaC · FinOps</div></div>
              <div className="arrow">→</div>
            </Link>
            <Link className="tech-cell" href="/consulting" style={{textDecoration:'none',color:'inherit'}}>
              <div><div className="cat">02 · Cybersecurity</div><h5>Zero Trust, identity, resilience.</h5><div className="stack">Entra ID · SIEM · IR</div></div>
              <div className="arrow">→</div>
            </Link>
            <Link className="tech-cell" href="/consulting" style={{textDecoration:'none',color:'inherit'}}>
              <div><div className="cat">03 · DevSecOps</div><h5>Secure delivery, end to end.</h5><div className="stack">CI/CD · Policy-as-code · SBOM</div></div>
              <div className="arrow">→</div>
            </Link>
            <Link className="tech-cell" href="/consulting" style={{textDecoration:'none',color:'inherit'}}>
              <div><div className="cat">04 · Software Engineering</div><h5>Products, platforms, integrations.</h5><div className="stack">React · .NET · Node · Go</div></div>
              <div className="arrow">→</div>
            </Link>
            <Link className="tech-cell" href="/consulting" style={{textDecoration:'none',color:'inherit'}}>
              <div><div className="cat">05 · Data &amp; AI</div><h5>Platforms, intelligence, governance.</h5><div className="stack">Fabric · Databricks · LLM</div></div>
              <div className="arrow">→</div>
            </Link>
            <Link className="tech-cell" href="/consulting" style={{textDecoration:'none',color:'inherit'}}>
              <div><div className="cat">06 · Automation</div><h5>Business processes, at engineer scale.</h5><div className="stack">Power Platform · APIs · Bots</div></div>
              <div className="arrow">→</div>
            </Link>
            <Link className="tech-cell" href="/consulting" style={{textDecoration:'none',color:'inherit'}}>
              <div><div className="cat">07 · Infrastructure</div><h5>Hybrid, resilient, observable.</h5><div className="stack">Networking · Observability · SRE</div></div>
              <div className="arrow">→</div>
            </Link>
            <Link className="tech-cell" href="/consulting" style={{textDecoration:'none',color:'inherit',background:'color-mix(in srgb,var(--color-accent-900) 40%,var(--color-bg))'}}>
              <div><div className="cat" style={{color:'var(--color-accent)'}}>See all →</div><h5 style={{color:'var(--color-accent)'}}>Explore our capabilities.</h5><div className="stack">One page, seven practices</div></div>
              <div className="arrow" style={{opacity:0}}>→</div>
            </Link>
          </div>
        </div>
      </section>

      <hr className="hr-fade" />

      {/* ========= INSIGHTS ========= */}
      <section className="section">
        <div className="wrap">
          <span className="kicker">04 · Insights</span>
          <h2>How we think about the work.</h2>
          <p className="lede">Short pieces written by the engineers, architects, and consultants working on the problems the rest of this site describes.</p>
          <div className="insights">
            <article className="article">
              <div className="meta"><span>Perspective</span><span className="dot"></span><span>Placeholder</span></div>
              <h5><Link href="/insights">What comes after identity in a Zero Trust programme.</Link></h5>
              <p className="ex">Most Zero Trust programs stop after identity is done. The harder work sits in network segmentation, data access, and the seams between them.</p>
              <div className="who">Engineering</div>
            </article>
            <article className="article">
              <div className="meta"><span>Research</span><span className="dot"></span><span>Placeholder</span></div>
              <h5><Link href="/insights">The FinOps trap: how landing zones become cost problems.</Link></h5>
              <p className="ex">A short field note on the architectural decisions that quietly compound into six-figure invoices around month twelve.</p>
              <div className="who">Cloud practice</div>
            </article>
            <article className="article">
              <div className="meta"><span>Engineering story</span><span className="dot"></span><span>Placeholder</span></div>
              <h5><Link href="/insights">Shipping AI features that survive procurement.</Link></h5>
              <p className="ex">Building an AI feature is straightforward. Building one that an enterprise procurement team will sign for is a different discipline.</p>
              <div className="who">Data &amp; AI</div>
            </article>
          </div>
        </div>
      </section>

      {/* ========= ACADEMY ========= */}
      <section className="section">
        <div className="wrap">
          <div className="academy">
            <div className="body">
              <span className="kicker">05 · Luxia Academy</span>
              <h2>The talent behind the technology.</h2>
              <p className="lede">Programs in cybersecurity, cloud, DevSecOps, and data. Every program is designed and taught by the engineers who deliver client work.</p>
              <Link className="btn btn-primary" href="/academy">Explore the Academy →</Link>
            </div>
            <div className="prog" role="list">
              <Link className="p" href="/academy"><span className="k">01</span><span>Cybersecurity fundamentals &amp; SOC path</span><span className="m">12 weeks · placeholder</span></Link>
              <Link className="p" href="/academy"><span className="k">02</span><span>Azure AZ-104 and cloud architecture</span><span className="m">10 weeks · placeholder</span></Link>
              <Link className="p" href="/academy"><span className="k">03</span><span>DevSecOps on Azure</span><span className="m">5 to 6 months · premium</span></Link>
              <Link className="p" href="/academy"><span className="k">04</span><span>Data platforms &amp; AI in production</span><span className="m">14 weeks · placeholder</span></Link>
            </div>
          </div>
        </div>
      </section>

      <hr className="hr-fade" />

      {/* ========= AUDIENCES ========= */}
      <section className="section">
        <div className="wrap">
          <span className="kicker">06 · Find your path</span>
          <h2>Three ways to enter the conversation.</h2>
          <div className="audiences" style={{marginTop:'calc(1.5*var(--leading))'}}>
            <div className="aud">
              <div className="role">CEO · Founder</div>
              <h5>What can Luxia-IT transform in the next 12 months?</h5>
              <p>Business outcomes, credible timelines, and senior engineers on the ground rather than a rotating cast.</p>
              <Link className="go" href="/contact">Talk to an expert →</Link>
            </div>
            <div className="aud">
              <div className="role">CTO · CIO · CISO</div>
              <h5>Depth on architecture, security, and execution.</h5>
              <p>How we build, how we secure, and how we deliver. Down to the pipelines, the policies, and the people involved.</p>
              <Link className="go" href="/consulting">Explore capabilities →</Link>
            </div>
            <div className="aud">
              <div className="role">Talent · Student</div>
              <h5>Build the skills, then the career.</h5>
              <p>Academy paths, engineering roles, and consulting tracks. Together they form a career, not a single course.</p>
              <Link className="go" href="/careers">Join Luxia →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========= CLOSING CTA ========= */}
      <section className="close-cta">
        <div className="wrap">
          <span className="kicker">Get started</span>
          <h2>Let&apos;s build <em>what&apos;s next</em>.</h2>
          <p className="lede" style={{maxWidth:'56ch'}}>A short note is enough. Describe the problem, the technology in play, or the team you are building. A senior engineer reads every message.</p>
          <div className="row">
            <Link className="btn btn-primary" href="/contact">Discuss a project →</Link>
            <Link className="btn btn-secondary" href="/careers">Join Luxia</Link>
            <Link className="btn btn-ghost" href="/insights">Read our insights</Link>
          </div>
        </div>
      </section>

      {/* ========= FOOTER ========= */}
      <footer>
        <div className="wrap">
          <div className="grid">
            <div className="col brand-col">
              <div className="brand" style={{pointerEvents:'none'}}>LUXIA-IT</div>
              <p>A technology company that builds products, transforms businesses, and develops the talent behind the technology.</p>
              <div style={{fontFamily:'ui-monospace,Menlo,monospace',fontSize:'11px',color:'color-mix(in srgb,var(--color-text) 45%,transparent)',letterSpacing:'.05em'}}>Part of the Legrand-Tech ecosystem</div>
            </div>
            <div className="col">
              <h6>What we do</h6>
              <Link href="/products">Products &amp; Solutions</Link>
              <Link href="/consulting">Technology Consulting</Link>
              <Link href="/academy">Luxia Academy</Link>
              <Link href="/industries">Industries</Link>
            </div>
            <div className="col">
              <h6>Company</h6>
              <Link href="/about">About</Link>
              <Link href="/insights">Insights</Link>
              <Link href="/careers">Careers</Link>
              <Link href="/contact">Contact</Link>
            </div>
            <div className="col">
              <h6>Get in touch</h6>
              <Link href="/contact">Talk to an expert</Link>
              <Link href="/contact">Discuss a project</Link>
              <Link href="/contact">Training inquiry</Link>
              <div style={{fontFamily:'ui-monospace,Menlo,monospace',fontSize:'11.5px',color:'color-mix(in srgb,var(--color-text) 55%,transparent)',paddingTop:'10px'}}>contact@legrand-tech.com</div>
            </div>
          </div>
          <div className="base">
            <div>© 2026 Luxia-IT · Part of Legrand-Tech</div>
            <div>EN / FR · Legal · Privacy · Cookies</div>
          </div>
        </div>
      </footer>
    </>
  );
}
