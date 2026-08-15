import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';

export const metadata = {
  title: 'Luxia-IT | Luxia Academy',
  description: 'The talent behind the technology. Programs in cybersecurity, cloud, DevSecOps, and data, taught by the engineers who deliver client work.',
  openGraph: {
    title: 'Luxia-IT | Luxia Academy',
    description: 'The talent behind the technology. Programs in cybersecurity, cloud, DevSecOps, and data, taught by the engineers who deliver client work.',
    type: 'website',
  },
};

export default function AcademyPage() {
  return (
    <>
      <Header />

      <section className="p-hero">
        <div className="wrap">
          <div className="breadcrumb">
            <Link href="/">Home</Link> / <Link href="/what-we-do">What we do</Link> / Luxia Academy
          </div>
          <span className="kicker" style={{ marginBottom: '24px' }}>03 · Luxia Academy</span>
          <h1>The people behind<br />the <em>technology.</em></h1>
          <p className="sub">Cybersecurity, cloud, DevSecOps, and data. Designed and taught by the engineers who deliver client work. The syllabus reflects the practice.</p>
          <div className="cta">
            <Link className="btn btn-primary" href="/contact">Training inquiry →</Link>
            <a className="btn btn-secondary" href="#programs">See programs</a>
          </div>
        </div>
      </section>

      <hr className="hr-fade" />

      <section className="section" id="programs">
        <div className="wrap">
          <span className="kicker">Programs</span>
          <h2>Six tracks, one method.</h2>
          <p className="lede">Certifying tracks, bootcamps, and one longer premium program. The premium program follows how the team actually builds and runs systems for clients.</p>
          <div className="dlist" style={{ marginTop: 'calc(1.5*var(--leading))' }}>
            <Link className="row" href="/contact">
              <span className="k">01</span>
              <span className="t">Cybersecurity fundamentals &amp; SOC path<small>bootcamp · placeholder duration</small></span>
              <span className="m">Cybersecurity</span>
            </Link>
            <Link className="row" href="/contact">
              <span className="k">02</span>
              <span className="t">Azure AZ-104 and Cloud Administration<small>certifying · placeholder duration</small></span>
              <span className="m">Cloud</span>
            </Link>
            <Link className="row" href="/contact">
              <span className="k">03</span>
              <span className="t">DevSecOps on Azure, premium program<small>5 to 6 months · practitioner led</small></span>
              <span className="m">DevSecOps</span>
            </Link>
            <Link className="row" href="/contact">
              <span className="k">04</span>
              <span className="t">Cloud Security &amp; Zero Trust<small>certifying · placeholder duration</small></span>
              <span className="m">Security</span>
            </Link>
            <Link className="row" href="/contact">
              <span className="k">05</span>
              <span className="t">Data platforms &amp; AI in production<small>bootcamp · placeholder duration</small></span>
              <span className="m">Data &amp; AI</span>
            </Link>
            <Link className="row" href="/contact">
              <span className="k">06</span>
              <span className="t">Emerging technology briefings<small>corporate · half-day sessions</small></span>
              <span className="m">Executive</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <span className="kicker">Method</span>
          <h2>Practitioners teaching.</h2>
          <p className="lede">Every program is designed and taught by senior engineers from the consulting and product practices. What is taught in class is what those engineers do the rest of the week.</p>
          <div className="card-grid" style={{ marginTop: 'calc(1.5*var(--leading))' }}>
            <div className="mcard">
              <div className="num">Real projects</div>
              <h4 style={{ fontSize: '19px' }}>Real projects.</h4>
              <p>Every track ends on a real project, reviewed by the engineer who wrote the material for it.</p>
            </div>
            <div className="mcard">
              <div className="num">Small cohorts</div>
              <h4 style={{ fontSize: '19px' }}>Small cohorts.</h4>
              <p>Cohorts stay small, typically between twelve and twenty, so instructors can give proper feedback and participants can help each other.</p>
            </div>
            <div className="mcard">
              <div className="num">Corporate paths</div>
              <h4 style={{ fontSize: '19px' }}>Private cohorts.</h4>
              <p>We run private cohorts for engineering teams. The method is the same, tuned to your stack and your calendar.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="close-cta">
        <div className="wrap">
          <h2>Train <em>the team</em>.</h2>
          <p className="lede">Talk to us about a certifying track, a private cohort for an engineering team, or a short executive briefing. Detailed curricula and project material are shared with confirmed cohorts.</p>
          <div className="row">
            <Link className="btn btn-primary" href="/contact">Training inquiry →</Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
