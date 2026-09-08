'use client';
import {useI18n} from '@/components/i18n-provider';
import Link from '@/components/locale-link';
export default function NotFound() {
 const {t:tr}=useI18n();
  return (
    <main id="main" className="inner-page">
      <section className="page-hero wrap">
        <p className="eyebrow">{tr('m361')}</p>
        <h1>
          {tr('m362')}<br />
          {tr('m363')}</h1>
        <p className="page-intro">
          {tr('m364')}</p>
        <Link href="/" className="button primary">
          {tr('m365')}</Link>
      </section>
    </main>
  );
}
