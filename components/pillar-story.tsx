'use client';
import {useI18n} from '@/components/i18n-provider';
import { useEffect, useRef, useState } from 'react';
import Link from '@/components/locale-link';
import Nucleus from './nucleus';
export default function PillarStory({sharedCore=false}:{sharedCore?:boolean}) {
const {t:tr} = useI18n();
const pillars = [
  {
    name: 'INTELLIGENCE',
    title: tr('m272'),
    text: tr('m273'),
    items: [
      tr('m274'),
      tr('m275'),
      tr('m276'),
      tr('m277'),
    ],
    path: 'artificial-intelligence',
    label: tr('m278'),
  },
  {
    name: 'TRUST',
    title: tr('m279'),
    text: tr('m280'),
    items: [
      tr('m281'),
      tr('m282'),
      'Microsoft Security',
      tr('m283'),
    ],
    path: 'cybersecurity',
    label: tr('m284'),
  },
  {
    name: 'SCALE',
    title: tr('m285'),
    text: tr('m286'),
    items: [
      'Microsoft Azure',
      tr('m287'),
      tr('m288'),
      tr('m289'),
    ],
    path: 'cloud',
    label: tr('m290'),
  },
];

  pillars.push({name:'AUTOMATION',title:tr('syncTitle'),text:tr('syncText'),items:[tr('m418'),tr('m420'),tr('m422'),tr('m424')],path:'automation',label:tr('syncLink')});
  const [mode, setMode] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const o = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (e.isIntersecting)
            setMode(Number((e.target as HTMLElement).dataset.mode));
        }),
      { rootMargin: '-25% 0px -30% 0px', threshold: 0 },
    );
    ref.current?.querySelectorAll('[data-mode]').forEach((e) => o.observe(e));
    return () => o.disconnect();
  }, []);
  return (
    <section className="story wrap" ref={ref}>
      <div className="story-visual">
        {sharedCore?<div className="story-core-slot" data-core-slot="story"/>:<Nucleus mode={mode}/>}
        <div className="scene-caption">
          <span>{tr('m291')}{mode + 1}</span>
          <span aria-hidden="true">↗</span>
        </div>
      </div>
      <div className="story-chapters">
        {pillars.map((p, i) => (
          <article className="story-chapter" key={p.name} data-mode={i}>
            <p className="eyebrow">
              0{i + 1} / {p.name}
            </p>
            <h2>{p.title}</h2>
            <p>{p.text}</p>
            <ul>
              {p.items.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
            <Link className="text-link" href={'/expertise/' + p.path}>
              {p.label} ↗
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
