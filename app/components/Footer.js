import Link from 'next/link';

export default function Footer() {
  return (
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
  );
}
