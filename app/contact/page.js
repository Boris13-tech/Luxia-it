'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function ContactPage() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = '/contact.js';
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <>
      <Header />

      <section className="p-hero">
        <div className="wrap">
          <div className="breadcrumb"><Link href="/">Home</Link> / Contact</div>
          <span className="kicker" style={{ marginBottom: '24px' }}>Contact</span>
          <h1>Tell us what<br />you are <em>building.</em></h1>
          <p className="sub">Tell us the shape of the problem. A senior engineer usually replies within two working days.</p>
        </div>
      </section>
      <hr className="hr-fade" />

      <section className="section">
        <div className="wrap">
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '56px', alignItems: 'start' }}>
            <div>
              <span className="kicker">Send a message</span>
              <h2 style={{ marginTop: '20px', fontSize: '32px' }}>Tell us what you need.</h2>

              <div id="form-endpoint-notice" role="note" style={{ marginTop: 'calc(1.5*var(--leading))', padding: '14px 18px', border: '1px dashed color-mix(in srgb,var(--color-text) 30%,transparent)', borderRadius: '8px', fontSize: '13px', color: 'color-mix(in srgb,var(--color-text) 70%,transparent)', lineHeight: 1.55 }}>
                The contact endpoint is configured at deployment. Until it is in place, please write to <a href="mailto:contact@legrand-tech.com" style={{ color: 'var(--color-accent)' }}>contact@legrand-tech.com</a> directly. Submissions from this page do not transmit until the endpoint is wired.
              </div>
              <form id="contact-form" noValidate style={{ display: 'grid', gap: '16px', marginTop: 'calc(1*var(--leading))' }}>
                <div id="contact-status" role="status" aria-live="polite" style={{ display: 'none', padding: '14px 18px', border: '1px solid var(--color-accent)', borderRadius: '8px', background: 'color-mix(in srgb,var(--color-accent) 8%,transparent)', color: 'var(--color-accent)', fontSize: '13.5px' }}></div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="field"><label htmlFor="c-name">Name</label><input className="input" id="c-name" name="name" required placeholder="Your full name" autoComplete="name" /></div>
                  <div className="field"><label htmlFor="c-org">Company</label><input className="input" id="c-org" name="company" placeholder="Company or organisation" autoComplete="organization" /></div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="field"><label htmlFor="c-email">Email</label><input className="input" id="c-email" name="email" type="email" required placeholder="you@company.com" autoComplete="email" /></div>
                  <div className="field"><label htmlFor="c-role">Role</label><input className="input" id="c-role" name="role" placeholder="CTO, CIO, founder…" autoComplete="organization-title" /></div>
                </div>
                <div className="field"><label>What can we help with?</label>
                  <div className="seg" style={{ display: 'flex', flexWrap: 'wrap' }}>
                    <label className="seg-opt"><input type="radio" name="topic" value="project" defaultChecked />Discuss a project</label>
                    <label className="seg-opt"><input type="radio" name="topic" value="consult" />Talk to an expert</label>
                    <label className="seg-opt"><input type="radio" name="topic" value="product" />Product partnership</label>
                    <label className="seg-opt"><input type="radio" name="topic" value="training" />Training inquiry</label>
                    <label className="seg-opt"><input type="radio" name="topic" value="press" />General</label>
                  </div>
                </div>
                <div className="field"><label htmlFor="c-msg">Tell us more</label><textarea id="c-msg" name="message" className="input" rows="6" placeholder="The problem, the constraints, and the timeline. Anything that helps us reply properly."></textarea></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap', paddingTop: '8px' }}>
                  <div style={{ fontSize: '12px', color: 'color-mix(in srgb,var(--color-text) 55%,transparent)', maxWidth: '44ch', lineHeight: 1.55 }}>This form is read by a person at Luxia-IT. The details you enter are used to reply to you and are not shared with third parties. Retention is covered in the privacy notice.</div>
                  <button type="submit" id="submit-btn" disabled className="btn btn-primary" style={{ padding: '12px 22px' }}>Send message →</button>
                </div>
              </form>
            </div>

            <aside style={{ display: 'grid', gap: '20px' }}>
              <div style={{ border: '1px solid var(--color-divider)', borderRadius: '12px', padding: '24px 28px' }}>
                <div className="pill accent" style={{ marginBottom: '14px' }}>Direct</div>
                <h4 style={{ fontFamily: 'var(--font-heading)', fontWeight: 500, fontSize: '18px', margin: '0 0 10px' }}>Reach us directly.</h4>
                <div style={{ fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '13px', color: 'color-mix(in srgb,var(--color-text) 78%,transparent)', lineHeight: 1.9 }}>
                  contact@legrand-tech.com<br />calendly.com/legrand-tech
                </div>
                <div style={{ fontSize: '11px', color: 'color-mix(in srgb,var(--color-text) 45%,transparent)', marginTop: '12px', lineHeight: 1.5 }}>During the brand transition, the contact details on this page are still those of Legrand-Tech, the parent ecosystem.</div>
              </div>

              <div style={{ border: '1px solid var(--color-divider)', borderRadius: '12px', padding: '24px 28px' }}>
                <div className="pill" style={{ marginBottom: '14px' }}>By topic</div>
                <div style={{ display: 'grid', gap: '10px', fontSize: '14px' }}>
                  <div><span style={{ color: 'var(--color-accent)', fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '11px', letterSpacing: '.1em', marginRight: '10px' }}>01</span>Discuss a project. A specific brief, timeline, and budget.</div>
                  <div><span style={{ color: 'var(--color-accent)', fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '11px', letterSpacing: '.1em', marginRight: '10px' }}>02</span>Talk to an expert. An early conversation, no brief yet.</div>
                  <div><span style={{ color: 'var(--color-accent)', fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '11px', letterSpacing: '.1em', marginRight: '10px' }}>03</span>Product partnership. A joint build or design partnership.</div>
                  <div><span style={{ color: 'var(--color-accent)', fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '11px', letterSpacing: '.1em', marginRight: '10px' }}>04</span>Training inquiry. A private cohort or executive briefing.</div>
                </div>
              </div>

              <div style={{ border: '1px solid var(--color-divider)', borderRadius: '12px', padding: '24px 28px' }}>
                <div className="pill" style={{ marginBottom: '14px' }}>Location</div>
                <div style={{ fontSize: '14px', color: 'color-mix(in srgb,var(--color-text) 78%,transparent)', lineHeight: 1.6 }}>Paris is our first market. We work with clients across France and the EU. Both English-speaking and French-speaking teams.</div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
