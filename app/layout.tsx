import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import Link from 'next/link';
import './globals.css';
import SiteHeader from '@/components/site-header';
const sans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const mono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });
export const metadata: Metadata = {
  metadataBase: new URL('https://luxia-it.legrandborisohandjae.chatgpt.site'),
  title: {
    default: 'Luxia-IT — Construisez l’entreprise intelligente.',
    template: '%s | Luxia-IT',
  },
  description:
    'Intelligence artificielle, cybersécurité et cloud. Luxia-IT conçoit les systèmes de votre transformation, entre Afrique et Europe.',
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    siteName: 'Luxia-IT',
    title: 'Luxia-IT — Construisez l’entreprise intelligente.',
    description: 'Human ambition. Intelligent systems. Trusted technology.',
  },
  twitter: { card: 'summary', title: 'Luxia-IT — Intelligence. Trust. Scale.' },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="dark">
      <body className={`${sans.variable} ${mono.variable}`}>
        <a className="skip" href="#main">
          Aller au contenu
        </a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Luxia-IT',
              url: 'https://luxia-it.legrandborisohandjae.chatgpt.site',
              email: 'Contact@legrand-tech.com',
              telephone: '+40 766 438 679',
              founder: { '@type': 'Person', name: 'Boris Legrand Ohandja' },
            }),
          }}
        />
        <SiteHeader />
        {children}
        <footer className="wrap footer">
          <div className="footer-top">
            <Link href="/" className="wordmark">
              LUXIA<span>-IT</span>
            </Link>
            <p>
              Human ambition.
              <br />
              Intelligent systems. Trusted technology.
            </p>
            <Link href="/contact" className="text-link">
              Construisons la suite ↗
            </Link>
          </div>
          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} Luxia-IT</span>
            <Link href="/industries">Secteurs</Link>
            <Link href="/case-studies">Projets</Link>
            <Link href="/company/careers">Carrières</Link>
            <Link href="/privacy">Confidentialité</Link>
            <Link href="/legal">Mentions légales</Link>
            <span>AFRIQUE × EUROPE</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
