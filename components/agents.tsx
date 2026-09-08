'use client';
import {useI18n} from '@/components/i18n-provider';
import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import Nucleus from './nucleus';
export default function Agents({sharedCore=false}:{sharedCore?:boolean}) {
const {t:tr} = useI18n();
const agents = [
  [
    'Knowledge',
    tr('m292'),
    tr('m293'),
    tr('m294'),
  ],
  [
    'Operations',
    tr('m295'),
    tr('m296'),
    tr('m297'),
  ],
  [
    'Support',
    tr('m298'),
    tr('m299'),
    tr('m300'),
  ],
  [
    'Sales',
    tr('m301'),
    tr('m302'),
    tr('m303'),
  ],
  [
    'Security',
    tr('m304'),
    tr('m305'),
    tr('m306'),
  ],
];

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
            {tr(({Knowledge:"knowledge",Operations:"operations",Support:"support",Sales:"sales",Security:"security"} as const)[n as "Knowledge"])}
            <span>↗</span>
          </TabsTrigger>
        ))}
      </TabsList>
      {agents.map(([n, t, d, f]) => (
        <TabsContent key={n} value={n} className="agent-panel">
          <div className="agent-visual">
            {sharedCore?<div className="agent-core-slot" data-core-slot="3"/>:<Nucleus mode={3}/>}
          </div>
          <div>
            <p className="eyebrow">{tr(({Knowledge:"knowledge",Operations:"operations",Support:"support",Sales:"sales",Security:"security"} as const)[n as "Knowledge"])} {tr('m307')}</p>
            <h3>{t}</h3>
            <p>{d}</p>
            <div className="flow-label">{f}</div>
            <p className="fine-print">
              {tr('m308')}</p>
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}
