import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';

export const metadata = {
  title: 'Luxia-IT | Careers',
  description: 'Engineers, consultants, and builders. Come build the next Luxia-IT.',
};

export default function CareersPage() {
  return (
    <>
      <Header />

      <section className="p-hero">
        <div className="wrap">
          <div className="breadcrumb">
            <Link href="/">Home</Link> / Careers
          </div>
          <span className="kicker" style={{ marginBottom: '24px' }}>
            Careers
          </span>
          <h1>
            Engineers, consultants,<br />
            and <em>builders.</em>
          </h1>
          <p className="sub">
            Small teams, senior colleagues, and real ownership from the first weeks. Engineers move between product, consulting, and the Academy as their interests change. The three practices are structured to make that easy.
          </p>
        </div>
      </section>

      <hr className="hr-fade" />

      <section className="section">
        <div className="wrap">
          <div className="split">
            <div>
              <span className="kicker">Why Luxia-IT</span>
              <h2 style={{ marginTop: '20px' }}>A practice, not a training programme.</h2>
            </div>
            <div
              style={{
                fontSize: '16px',
                color: 'color-mix(in srgb,var(--color-text) 78%,transparent)',
                lineHeight: 1.7,
                maxWidth: '60ch',
              }}
            >
              <p>
                You work on real problems in your first weeks, alongside senior engineers. Moving between product, consulting, and teaching is the norm rather than the exception, and the three practices are structured to support it.
              </p>
              <p>We are small. Everyone owns something that matters.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <span className="kicker">Tracks</span>
          <h2>Three ways in.</h2>
          <div className="card-grid" style={{ marginTop: 'calc(1.5*var(--leading))' }}>
            <Link className="mcard" href="#openings">
              <div className="num">Engineering</div>
              <h4>Software, cloud, security, data.</h4>
              <p>
                You will ship products and platforms. Deep technical work, with a short path from idea to production.
              </p>
              <div className="arrow">See openings →</div>
            </Link>
            <Link className="mcard" href="#openings">
              <div className="num">Consulting</div>
              <h4>Architects and senior engineers.</h4>
              <p>
                You will embed with client teams, solve complex problems, and hand the work over cleanly.
              </p>
              <div className="arrow">See openings →</div>
            </Link>
            <Link className="mcard" href="#openings">
              <div className="num">Academy · Talent</div>
              <h4>Teach what you ship.</h4>
              <p>
                For engineers who want to design and teach programs alongside their client work. It is a track, not a side project.
              </p>
              <div className="arrow">See openings →</div>
            </Link>
          </div>
        </div>
      </section>

      <section className="section" id="openings">
        <div className="wrap">
          <span className="kicker">Open positions</span>
          <h2>What we&apos;re hiring for.</h2>
          <p className="lede">
            The list here is illustrative. Real posts appear as roles open. If none match your profile, send us a note anyway. We keep every strong application on file.
          </p>
          <div className="dlist" style={{ marginTop: 'calc(1.5*var(--leading))' }}>
            <Link className="row" href="/contact">
              <span className="k">→</span>
              <span className="t">
                Senior Cloud Architect · Azure<small>Paris · placeholder</small>
              </span>
              <span className="m">Consulting</span>
            </Link>
            <Link className="row" href="/contact">
              <span className="k">→</span>
              <span className="t">
                DevSecOps Engineer<small>Remote EU · placeholder</small>
              </span>
              <span className="m">Engineering</span>
            </Link>
            <Link className="row" href="/contact">
              <span className="k">→</span>
              <span className="t">
                Senior Full-Stack Engineer<small>Paris · placeholder</small>
              </span>
              <span className="m">Products</span>
            </Link>
            <Link className="row" href="/contact">
              <span className="k">→</span>
              <span className="t">
                Cybersecurity Consultant<small>Paris · placeholder</small>
              </span>
              <span className="m">Consulting</span>
            </Link>
            <Link className="row" href="/contact">
              <span className="k">→</span>
              <span className="t">
                Academy Lead, DevSecOps track<small>Paris · placeholder</small>
              </span>
              <span className="m">Academy</span>
            </Link>
            <Link className="row" href="/contact">
              <span className="k">→</span>
              <span className="t">
                Data &amp; AI Engineer<small>Remote EU · placeholder</small>
              </span>
              <span className="m">Engineering</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="close-cta">
        <div className="wrap">
          <h2>
            Nothing that fits <em>yet?</em>
          </h2>
          <p className="lede">
            Send us a short note. Every strong application is kept on file, and we get back in touch when a role opens.
          </p>
          <div className="row">
            <Link className="btn btn-primary" href="/contact">
              Get in touch →
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
