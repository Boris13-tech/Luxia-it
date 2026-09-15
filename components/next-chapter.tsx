'use client';

import {usePathname} from 'next/navigation';
import Link from './locale-link';
import {useI18n} from './i18n-provider';

export default function NextChapter() {
  const {locale, t} = useI18n();
  const pathname = usePathname();
  const path = pathname.replace(/^\/(fr|en|zh)/, '') || '/';
  const chapters = [
    ['/', t('m108')], ['/solutions', t('m097')], ['/expertise', t('m096')],
    ['/industries', t('m098')], ['/case-studies', t('m099')], ['/labs', 'Luxia Labs'],
    ['/insights', 'Luxia Insights'], ['/company', t('m100')], ['/contact', t('m102')],
  ];
  if (['/contact', '/legal', '/privacy'].includes(path)) return null;
  const index = chapters.findIndex(([url]) => url === path);
  const next = index < 0 ? chapters.find(([url]) => url === '/expertise')! : chapters[(index + 1) % chapters.length];
  const label = {fr:'Poursuivre la découverte', en:'Continue exploring', zh:'继续探索'}[locale];
  return <section className="next-chapter" aria-label={label}>
    <Link href={next[0]}><span className="eyebrow">{label}</span><strong>{next[1]}</strong><span className="chapter-arrow" aria-hidden="true">↗</span></Link>
  </section>;
}
