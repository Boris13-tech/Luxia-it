import {translator, type Locale} from './i18n';
export const site = {
  name: 'Luxia-IT',
  origin: 'https://luxia-it.legrandborisohandjae.chatgpt.site',
  email: 'Contact@Luxia-it.com',
  phone: '+40 766 438 679',
  whatsapp: 'https://wa.me/40766438679',
  founder: 'Boris Legrand Ohandja',
  locale: 'fr',
  locales: ['fr', 'en', 'zh'] as const,
};
export function getContent(locale: Locale='fr') {
const tr=translator(locale);
const services = [
  {
    slug: 'artificial-intelligence',
    pillar: 'INTELLIGENCE',
    title: tr('m324'),
    headline: tr('m366'),
    intro:
      tr('m367'),
    outcome:
      tr('m368'),
    capabilities: [
      [
        tr('m274'),
        tr('m369'),
      ],
      [
        tr('m275'),
        tr('m370'),
      ],
      [
        tr('m276'),
        tr('m371'),
      ],
      [
        tr('m372'),
        tr('m373'),
      ],
    ],
    deliverables: [
      tr('m374'),
      tr('m375'),
      tr('m376'),
      tr('m377'),
    ],
    questions: [
      [
        tr('m378'),
        tr('m379'),
      ],
      [
        tr('m380'),
        tr('m381'),
      ],
    ],
  },
  {
    slug: 'cybersecurity',
    pillar: 'TRUST',
    title: tr('m325'),
    headline: tr('m382'),
    intro:
      tr('m383'),
    outcome:
      tr('m384'),
    capabilities: [
      [
        tr('m281'),
        tr('m385'),
      ],
      [
        tr('m282'),
        tr('m386'),
      ],
      [
        tr('m387'),
        tr('m388'),
      ],
      [
        tr('m389'),
        tr('m390'),
      ],
    ],
    deliverables: [
      tr('m391'),
      tr('m392'),
      tr('m393'),
      tr('m394'),
    ],
    questions: [
      [
        tr('m395'),
        tr('m396'),
      ],
      [
        tr('m397'),
        tr('m398'),
      ],
    ],
  },
  {
    slug: 'cloud',
    pillar: 'SCALE',
    title: tr('m017'),
    headline: tr('m399'),
    intro:
      tr('m400'),
    outcome:
      tr('m401'),
    capabilities: [
      [
        tr('m402'),
        tr('m403'),
      ],
      [
        tr('m287'),
        tr('m404'),
      ],
      [
        tr('m288'),
        tr('m405'),
      ],
      [
        tr('m289'),
        tr('m406'),
      ],
    ],
    deliverables: [
      tr('m407'),
      tr('m408'),
      tr('m409'),
      tr('m410'),
    ],
    questions: [
      [
        tr('m411'),
        tr('m412'),
      ],
      [
        tr('m413'),
        tr('m414'),
      ],
    ],
  },
  {
    slug: 'automation',
    pillar: 'INTELLIGENCE',
    title: tr('automation'),
    headline: tr('m415'),
    intro:
      tr('m416'),
    outcome:
      tr('m417'),
    capabilities: [
      [
        tr('m418'),
        tr('m419'),
      ],
      [
        tr('m420'),
        tr('m421'),
      ],
      [
        tr('m422'),
        tr('m423'),
      ],
      [
        tr('m424'),
        tr('m425'),
      ],
    ],
    deliverables: [
      tr('m426'),
      tr('m427'),
      tr('m428'),
      tr('m429'),
    ],
    questions: [
      [
        tr('m430'),
        tr('m431'),
      ],
      [
        tr('m432'),
        tr('m433'),
      ],
    ],
  },
];
const sectors = [
  [
    tr('m040'),
    tr('m434'),
    tr('m435'),
    tr('m436'),
  ],
  [
    tr('m041'),
    tr('m437'),
    tr('m438'),
    tr('m439'),
  ],
  [
    tr('m042'),
    tr('m440'),
    tr('m441'),
    tr('m442'),
  ],
  [
    tr('m043'),
    tr('m443'),
    tr('m444'),
    tr('m445'),
  ],
  [
    tr('m044'),
    tr('m446'),
    tr('m447'),
    tr('m448'),
  ],
  [
    tr('m045'),
    tr('m449'),
    tr('m450'),
    tr('m451'),
  ],
  [
    tr('m046'),
    tr('m452'),
    tr('m453'),
    tr('m454'),
  ],
];
const articles = [
  {
    slug: 'agents-processus',
    tag: 'INTELLIGENCE',
    title: tr('m087'),
    intro:
      tr('m455'),
    sections: [
      [
        tr('m456'),
        tr('m457'),
      ],
      [
        tr('m458'),
        tr('m459'),
      ],
      [
        tr('m460'),
        tr('m461'),
      ],
      [
        tr('m462'),
        tr('m463'),
      ],
    ],
  },
  {
    slug: 'identite-securite',
    tag: 'TRUST',
    title: tr('m088'),
    intro:
      tr('m464'),
    sections: [
      [
        tr('m465'),
        tr('m466'),
      ],
      [
        tr('m467'),
        tr('m468'),
      ],
      [
        tr('m469'),
        tr('m470'),
      ],
      [
        tr('m471'),
        tr('m472'),
      ],
    ],
  },
  {
    slug: 'cloud-pilotage',
    tag: 'SCALE',
    title: tr('m089'),
    intro:
      tr('m473'),
    sections: [
      [
        tr('m474'),
        tr('m475'),
      ],
      [
        tr('m476'),
        tr('m477'),
      ],
      [
        tr('m478'),
        tr('m479'),
      ],
      [
        tr('m480'),
        tr('m481'),
      ],
    ],
  },
];
const cases = [
  {
    slug: 'knowledge-assistant',
    title: tr('m482'),
    tag: 'INTELLIGENCE',
    intro:
      tr('m483'),
    challenge:
      tr('m484'),
    architecture:
      tr('m485'),
    solution:
      tr('m486'),
    impact:
      tr('m487'),
    criteria: [
      tr('m488'),
      tr('m489'),
      tr('m490'),
      tr('m491'),
    ],
  },
  {
    slug: 'secure-cloud',
    title: tr('m492'),
    tag: 'TRUST × SCALE',
    intro:
      tr('m493'),
    challenge:
      tr('m494'),
    architecture:
      tr('m495'),
    solution:
      tr('m496'),
    impact:
      tr('m497'),
    criteria: [
      tr('m498'),
      tr('m499'),
      tr('m500'),
      tr('m501'),
    ],
  },
];
return {services,sectors,articles,cases};
}
export const {services,sectors,articles,cases}=getContent();
export const topRoutes = [
  'expertise',
  'solutions',
  'industries',
  'case-studies',
  'labs',
  'insights',
  'company',
  'company/careers',
  'contact',
  'privacy',
  'legal',
];
export const allRoutes = [
  ...topRoutes,
  ...services.map((s) => 'expertise/' + s.slug),
  ...articles.map((a) => 'insights/' + a.slug),
  ...cases.map((c) => 'case-studies/' + c.slug),
];
