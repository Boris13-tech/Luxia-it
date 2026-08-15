import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';

export const metadata = {
  title: 'Luxia-IT | About',
  description: 'A technology company organised around three practices. Part of the Legrand-Tech ecosystem.',
};

export default function AboutPage() {
  return (
    <>
      <Header />

      <section className="p-hero">
        <div className="wrap">
          <div className="breadcrumb"><Link href="/">Home</Link> / About</div>
          <span className="kicker" style={{ marginBottom: '24px' }}>About Luxia-IT</span>
          <h1>A technology company<br />organised around <em>three practices.</em></h1>
          <p className="sub">Luxia-IT builds products, works on the systems businesses already run, and trains the people responsible for both. The company continues the technology work of the Legrand-Tech ecosystem, which has several years of Azure, cloud security, and DevSecOps engineering behind it.</p>
        </div>
      </section>
      <hr className="hr-fade" />

      <section className="section">
        <div className="wrap">
          <div className="split">
            <div>
              <span className="kicker">Story</span>
              <h2 style={{ marginTop: '20px' }}>From a technology practice to a company.</h2>
            </div>
            <div style={{ fontSize: '16px', color: 'color-mix(in srgb,var(--color-text) 78%,transparent)', lineHeight: 1.7, maxWidth: '60ch' }}>
              <p>Legrand-Tech has been known for its training work and its Azure engineering. Luxia-IT is the corporate technology brand that carries that heritage forward. It also adds product development and larger transformation engagements as the practice matures.</p>
              <p>We stayed small on purpose while the practice matured. The next few years are about scaling it into a technology company at a pace we can stand behind.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="accent-band">
        <div className="wrap">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '40px' }}>
            <div>
              <div className="pill accent" style={{ marginBottom: '14px' }}>Vision</div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 500, fontSize: '22px', letterSpacing: '-.015em', margin: '0 0 12px' }}>A regional reference for serious technology work.</h3>
              <p style={{ fontSize: '14px', color: 'color-mix(in srgb,var(--color-text) 78%,transparent)', lineHeight: 1.6, margin: 0 }}>A place where the engineering is real, the ambition is honest, and the team behind the work is visible.</p>
            </div>
            <div>
              <div className="pill accent" style={{ marginBottom: '14px' }}>Mission</div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 500, fontSize: '22px', letterSpacing: '-.015em', margin: '0 0 12px' }}>Build technology, transform businesses, develop talent.</h3>
              <p style={{ fontSize: '14px', color: 'color-mix(in srgb,var(--color-text) 78%,transparent)', lineHeight: 1.6, margin: 0 }}>Three practices, one company, each one keeping the others honest.</p>
            </div>
            <div>
              <div className="pill accent" style={{ marginBottom: '14px' }}>Values</div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 500, fontSize: '22px', letterSpacing: '-.015em', margin: '0 0 12px' }}>Craft, honesty, delivery.</h3>
              <p style={{ fontSize: '14px', color: 'color-mix(in srgb,var(--color-text) 78%,transparent)', lineHeight: 1.6, margin: 0 }}>We say what we can do, then do it. Senior engineers, small teams, and real work.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <span className="kicker">Leadership</span>
          <h2>The people.</h2>
          <p className="lede">A short leadership section. It will grow as the team grows. Photographs will appear once we can shoot them properly.</p>
          <div className="card-grid" style={{ marginTop: 'calc(1.5*var(--leading))' }}>
            <div className="mcard">
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--color-accent-800)', display: 'grid', placeItems: 'center', fontFamily: 'var(--font-heading)', fontWeight: 500, color: 'var(--color-accent-100)', marginBottom: '8px' }}>OB</div>
              <div className="num">Founder · CEO</div>
              <h4 style={{ fontSize: '20px' }}>Ohandja Edimo Boris Legrand</h4>
              <p>Founder of Legrand-Tech. Now leading Luxia-IT as it becomes a corporate technology brand.</p>
            </div>
            <div className="mcard">
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'color-mix(in srgb,var(--color-text) 10%,transparent)', display: 'grid', placeItems: 'center', fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '10px', color: 'color-mix(in srgb,var(--color-text) 45%,transparent)', marginBottom: '8px' }}>TBA</div>
              <div className="num">Head of Consulting</div>
              <h4 style={{ fontSize: '20px' }}>Placeholder</h4>
              <p>To be announced. The consulting practice lead as it scales.</p>
            </div>
            <div className="mcard">
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'color-mix(in srgb,var(--color-text) 10%,transparent)', display: 'grid', placeItems: 'center', fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '10px', color: 'color-mix(in srgb,var(--color-text) 45%,transparent)', marginBottom: '8px' }}>TBA</div>
              <div className="num">Head of Academy</div>
              <h4 style={{ fontSize: '20px' }}>Placeholder</h4>
              <p>To be announced. The Academy program lead.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <span className="kicker">Ecosystem</span>
          <h2>Part of Legrand-Tech.</h2>
          <p className="lede" style={{ maxWidth: '60ch' }}>Luxia-IT sits inside the Legrand-Tech ecosystem. The practice, contracts, certifications, and Azure heritage that make the technology story credible are all part of that ecosystem. Where the two brands overlap during the brand transition, we say so plainly on the relevant pages.</p>
        </div>
      </section>

      <section className="close-cta">
        <div className="wrap">
          <h2>Work with us.</h2>
          <div className="row">
            <Link className="btn btn-primary" href="/contact">Talk to an expert →</Link>
            <Link className="btn btn-secondary" href="/careers">Join Luxia</Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
