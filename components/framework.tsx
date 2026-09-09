'use client';
import {useI18n} from '@/components/i18n-provider';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
export default function Framework({onStageChange}:{onStageChange?:(stage:number)=>void}={}) {
const {t:tr} = useI18n();
const steps = [
  [
    'DISCOVER',
    tr('m309'),
    tr('m310'),
    tr('m311'),
  ],
  [
    'DESIGN',
    tr('m312'),
    tr('m313'),
    tr('m314'),
  ],
  [
    'BUILD',
    tr('m315'),
    tr('m316'),
    tr('m317'),
  ],
  [
    'SECURE',
    tr('m318'),
    tr('m319'),
    tr('m320'),
  ],
  [
    'EVOLVE',
    tr('m321'),
    tr('m322'),
    tr('m323'),
  ],
];

  return (
    <Tabs defaultValue="DISCOVER" onValueChange={value=>onStageChange?.(steps.findIndex(step=>step[0]===value))} className="framework">
      <TabsList className="framework-tabs" variant="line">
        {steps.map(([name], i) => (
          <TabsTrigger value={name} key={name} onClick={()=>onStageChange?.(i)}>
            <span>0{i + 1}</span>
            {tr(({DISCOVER:"discover",DESIGN:"design",BUILD:"build",SECURE:"secure",EVOLVE:"evolve"} as const)[name as "DISCOVER"])}
          </TabsTrigger>
        ))}
      </TabsList>
      {steps.map(([name, title, body, deliverable]) => (
        <TabsContent key={name} value={name} className="framework-panel">
          <h3>{title}</h3>
          <div>
            <p>{body}</p>
            <small>{deliverable}</small>
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}

