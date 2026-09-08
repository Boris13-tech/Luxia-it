import Link from '@/components/locale-link';
import {translator,type Locale} from '@/lib/i18n';
import {site} from '@/lib/content';
export default function SiteFooter({locale}:{locale:Locale}){const tr=translator(locale); return (        <footer className="wrap footer">
          <div className="footer-top">
            <Link href="/" className="wordmark">
              LUXIA<span>-IT</span>
            </Link>
            <p>
              {tr('m261')}<br />
              {tr('m262')}</p>
            <Link href="/contact" className="text-link">
              {tr('m263')}</Link>
          </div>
          <a className="footer-email" href={"mailto:"+site.email}>{site.email} ↗</a><div className="footer-bottom">
            <span>© {new Date().getFullYear()} Luxia-IT</span>
            <Link href="/industries">{tr('m098')}</Link>
            <Link href="/case-studies">{tr('m099')}</Link>
            <Link href="/company/careers">{tr('m101')}</Link>
            <Link href="/privacy">{tr('m103')}</Link>
            <Link href="/legal">{tr('m104')}</Link>
            <span>{tr('m202')}</span>
          </div>
        </footer>);}
