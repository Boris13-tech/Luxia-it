'use client';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
const steps = [
  [
    'DISCOVER',
    'Comprendre avant de concevoir.',
    'Nous clarifions vos objectifs, vos processus et vos contraintes. Un diagnostic partagé distingue les vrais besoins des effets de mode.',
    'Livrable : diagnostic et feuille de route priorisée.',
  ],
  [
    'DESIGN',
    'Donner une architecture à l’ambition.',
    'Nous définissons les flux de données, les choix techniques et les responsabilités. Les exigences de sécurité font partie de la conception.',
    'Livrable : architecture cible et critères de réussite.',
  ],
  [
    'BUILD',
    'Rendre la stratégie opérationnelle.',
    'Un premier périmètre utile est développé et testé avec vos équipes. Les intégrations et la documentation sont traitées ensemble.',
    'Livrable : solution testée et documentation technique.',
  ],
  [
    'SECURE',
    'Vérifier ce qui mérite votre confiance.',
    'Les accès, les configurations et les scénarios de risque sont examinés. Les écarts sont corrigés avant l’ouverture du service.',
    'Livrable : revue de sécurité et plan de remédiation.',
  ],
  [
    'EVOLVE',
    'Faire progresser le système.',
    'L’usage réel guide les améliorations. Nous suivons la qualité de service, les coûts et les besoins qui émergent après le déploiement.',
    'Livrable : plan d’amélioration continue.',
  ],
];
export default function Framework() {
  return (
    <Tabs defaultValue="DISCOVER" className="framework">
      <TabsList className="framework-tabs" variant="line">
        {steps.map(([name], i) => (
          <TabsTrigger value={name} key={name}>
            <span>0{i + 1}</span>
            {name}
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
