'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Nucleus from './nucleus';
export const pillars = [
  {
    name: 'INTELLIGENCE',
    title: 'L’IA au cœur de votre activité.',
    text: 'Des agents qui assistent vos équipes. Des connaissances accessibles. Des processus qui avancent avec moins de friction.',
    items: [
      'Agents IA & copilotes',
      'Assistants de connaissance',
      'Intelligence documentaire',
      'Automatisation des processus',
    ],
    path: 'artificial-intelligence',
    label: 'Explorer l’intelligence artificielle',
  },
  {
    name: 'TRUST',
    title: 'La confiance se construit.',
    text: 'La sécurité fait partie de l’architecture. Nous relions identités, données et gouvernance pour protéger ce qui compte.',
    items: [
      'Identité & accès',
      'Architecture Zero Trust',
      'Microsoft Security',
      'Évaluation & gouvernance',
    ],
    path: 'cybersecurity',
    label: 'Découvrir notre approche sécurité',
  },
  {
    name: 'SCALE',
    title: 'Une infrastructure qui voit plus loin.',
    text: 'Un cloud conçu pour vos usages, vos exigences de résilience et votre trajectoire de croissance. Avec la maîtrise des coûts en ligne de mire.',
    items: [
      'Microsoft Azure',
      'Migration & modernisation',
      'Résilience & sauvegarde',
      'Observabilité & optimisation',
    ],
    path: 'cloud',
    label: 'Concevoir votre trajectoire cloud',
  },
];
export default function PillarStory() {
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
        <Nucleus mode={mode} />
        <div className="scene-caption">
          <span>LUXIA CORE / 0{mode + 1}</span>
          <span>{pillars[mode].name}</span>
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
