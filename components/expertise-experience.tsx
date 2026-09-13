'use client';

import Image from 'next/image';
import {useEffect, useRef, useState, type CSSProperties} from 'react';
import Link from './locale-link';
import {useI18n} from './i18n-provider';
import {getContent} from '@/lib/content';
import LuxiaArtifact from './luxia-artifact';

const names = ['INTELLIGENCE', 'TRUST', 'SCALE', 'AUTOMATION'];
const descriptions = ['exAI', 'exTrust', 'exScale', 'exAuto'] as const;
const filmScenes = [
  {src: '/visuals/luxia-hero-v3.png', position: '62% 44%'},
  {src: '/visuals/trust.webp', position: '55% 48%'},
  {src: '/visuals/luxia-global-v2.png', position: '54% 50%'},
  {src: '/visuals/luxia-campus-v3.png', position: '58% 50%'},
];

const smootherStep = (value: number) => {
  const x = Math.min(1, Math.max(0, value));
  return x * x * x * (x * (x * 6 - 15) + 10);
};

// Each chapter rests on its key frame, moves with intent, then resolves before
// the next title enters. The scroll remains native while the film changes pace.
const cinematicTimeline = (value: number) => {
  if (value >= 1) return 1;
  const scaled = Math.max(0, value) * 4;
  const chapter = Math.floor(scaled);
  const local = scaled - chapter;
  const movement = smootherStep((local - .18) / .62);
  return (chapter + movement) / 4;
};

export default function ExpertiseExperience() {
  const {t, locale} = useI18n();
  const {services} = getContent(locale);
  const sequence = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      if (!sequence.current) return;
      const rect = sequence.current.getBoundingClientRect();
      const distance = Math.max(1, sequence.current.offsetHeight - window.innerHeight);
      setProgress(Math.min(1, Math.max(0, -rect.top / distance)));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, {passive: true});
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const mode = Math.min(3, Math.floor(progress * 4));
  const item = services[mode];
  const filmProgress = cinematicTimeline(progress);
  const chapterProgress = Math.min(1, Math.max(0, progress * 4 - mode));

  return (
    <div className="expertise-photo-film" ref={sequence}>
      <section className="expertise-photo-frame">
        <div className="expertise-photo-stage" aria-hidden="true" style={{'--scene-progress': chapterProgress} as CSSProperties}>
          {filmScenes.map((scene, index) => (
            <div className={index === mode ? 'is-current' : ''} key={scene.src}>
              <Image src={scene.src} alt="" fill sizes="100vw" style={{objectPosition: scene.position}} unoptimized priority={index === 0}/>
            </div>
          ))}
        </div>
        <div className="expertise-object-stage" aria-hidden="true"><LuxiaArtifact progress={filmProgress}/></div>
        <div className="expertise-photo-shade" aria-hidden="true"/>
        <div className="expertise-photo-copy" key={mode}>
          <p className="eyebrow">LUXIA CORE</p>
          <p className="photo-count">0{mode + 1}<span>/04</span></p>
          <h1>{names[mode]}</h1>
          <p className="photo-description" aria-live="polite">{t(descriptions[mode])}</p>
          <Link className="photo-link" href={'/expertise/' + item.slug}>{item.title}<span>↗</span></Link>
        </div>
        <div className="photo-progress" aria-hidden="true"><i style={{transform: `scaleX(${Math.max(.025, progress)})`}}/></div>
      </section>
    </div>
  );
}
