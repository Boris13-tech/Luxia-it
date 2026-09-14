'use client';

import Image from 'next/image';
import Link from './locale-link';
import {useI18n} from './i18n-provider';
import {getContent} from '@/lib/content';

const visuals = [
  '/visuals/intelligence.webp',
  '/visuals/trust.webp',
  '/visuals/cloud.webp',
  '/visuals/automation.webp',
];

const descriptions = ['exAI', 'exTrust', 'exScale', 'exAuto'] as const;

export default function ExpertiseExperience() {
  const {t, locale} = useI18n();
  const {services} = getContent(locale);

  return (
    <div className="expertise-editorial">
      <section className="expertise-editorial-hero wrap">
        <div className="expertise-editorial-copy">
          <p className="eyebrow">EXPERTISE / INTELLIGENCE · TRUST · SCALE</p>
          <h1>{t('m134')}</h1>
          <p>{t('m183')}</p>
          <Link href="/contact" className="button primary">{t('m093')}<span>↗</span></Link>
        </div>
        <div className="expertise-editorial-image" aria-hidden="true">
          <Image src="/visuals/luxia-global-v2.png" alt="" fill sizes="(max-width: 760px) 100vw, 56vw" priority unoptimized/>
          <span>LUXIA-IT / SYSTEMS</span>
        </div>
      </section>

      <section className="expertise-editorial-index wrap">
        <div className="expertise-index-heading">
          <p className="eyebrow">{t('m096')}</p>
          <h2>{t('m135')}</h2>
        </div>
        <div className="expertise-editorial-grid">
          {services.map((service, index) => (
            <Link className="expertise-editorial-card" href={'/expertise/' + service.slug} key={service.slug}>
              <Image src={visuals[index]} alt="" fill sizes="(max-width: 760px) 100vw, 50vw" unoptimized/>
              <i aria-hidden="true"/>
              <div>
                <span className="micro">0{index + 1} / {service.pillar}</span>
                <h3>{service.title}</h3>
                <p>{t(descriptions[index])}</p>
                <strong>↗</strong>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
