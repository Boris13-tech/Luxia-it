'use client';
import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import Nucleus from './nucleus';
const agents = [
  [
    'Knowledge',
    'La connaissance, enfin accessible.',
    'Un assistant qui explore un corpus autorisé et propose des réponses sourcées. Les accès restent alignés sur les droits de chaque utilisateur.',
    'QUESTION → SOURCES → RÉPONSE',
  ],
  [
    'Operations',
    'Moins de tâches répétées.',
    'Un agent qui prépare et orchestre des étapes de travail définies. Les actions sensibles passent par une validation humaine.',
    'ÉVÉNEMENT → VALIDATION → ACTION',
  ],
  [
    'Support',
    'Une réponse mieux préparée.',
    'Un assistant qui classe une demande, retrouve les informations utiles et prépare une réponse pour votre équipe support.',
    'DEMANDE → CONTEXTE → PROPOSITION',
  ],
  [
    'Sales',
    'Le contexte avant la conversation.',
    'Un agent qui synthétise les informations commerciales autorisées pour préparer les échanges et faciliter le suivi.',
    'CONTEXTE → SYNTHÈSE → SUIVI',
  ],
  [
    'Security',
    'Le signal au milieu du bruit.',
    'Un assistant qui aide à contextualiser une alerte et à préparer son examen. Les décisions de sécurité restent supervisées.',
    'ALERTE → ANALYSE → REVUE',
  ],
];
export default function Agents() {
  const [active, setActive] = useState('Knowledge');
  return (
    <Tabs
      value={active}
      onValueChange={(v) => setActive(String(v))}
      className="agents"
    >
      <TabsList variant="line" className="agent-tabs">
        {agents.map(([n]) => (
          <TabsTrigger value={n} key={n}>
            {n}
            <span>↗</span>
          </TabsTrigger>
        ))}
      </TabsList>
      {agents.map(([n, t, d, f]) => (
        <TabsContent key={n} value={n} className="agent-panel">
          <div className="agent-visual">
            <Nucleus mode={3} />
          </div>
          <div>
            <p className="eyebrow">{n.toUpperCase()} AGENT / CONCEPT</p>
            <h3>{t}</h3>
            <p>{d}</p>
            <div className="flow-label">{f}</div>
            <p className="fine-print">
              Scénario exploratoire. Disponibilité et périmètre à définir selon
              votre projet.
            </p>
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}
