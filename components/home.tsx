import Image from 'next/image';
import Link from '@/components/locale-link';
import type {Locale} from '@/lib/i18n';

const copy = {
  fr: {
    title: ['Un avenir plus sûr,', 'plus intelligent,', 'plus humain.'],
    intro: 'Luxia-IT conçoit des architectures cloud, cybersécurité et IA qui relient la stratégie, les équipes et l’exécution.',
    primary: 'Découvrir nos expertises', secondary: 'Notre vision',
    promises: ['Connecter les talents.', 'Sécuriser les idées.', 'Bâtir des systèmes durables.'],
    ecosystem: 'NOTRE ÉCOSYSTÈME', platformTitle: ['Une architecture.', 'Des capacités qui travaillent ensemble.'],
    platformCopy: 'Identité, sécurité, cloud, données et automatisation sont conçus comme un même système, avec des responsabilités et des accès explicites.',
    platformCta: 'Explorer les solutions', core: 'SOCLE LUXIA',
    nodes: [['IA & AUTOMATISATION','Interpréter et orchestrer'],['IDENTITÉ','Contrôler les accès'],['CYBERSÉCURITÉ','Détecter et protéger'],['CLOUD','Distribuer et faire évoluer'],['DEVSECOPS','Construire avec contrôle']],
    stages: [['01','Comprendre','Objectifs, processus et contraintes.'],['02','Concevoir','Architecture, données et responsabilités.'],['03','Construire','Mise en œuvre progressive et vérifiable.'],['04','Faire évoluer','Mesure, sécurité et amélioration continue.']],
    impactEyebrow: 'DU CONCEPT À L’IMPACT', impactTitle: ['Des résultats', 'qui comptent.'],
    impactCopy: 'Chaque projet commence par un besoin mesurable et se termine par un système que les équipes peuvent comprendre, utiliser et faire évoluer.',
    principles: [['CLARTÉ','Un périmètre et des décisions explicites.'],['CONFIANCE','La sécurité intégrée à l’architecture.'],['CONTINUITÉ','Une trajectoire adaptée à votre organisation.']],
    industriesEyebrow: 'DES SOLUTIONS POUR CHAQUE CONTEXTE', industriesTitle: ['Des organisations plus fortes.', 'Des services plus résilients.'], industriesCta: 'Voir tous les secteurs',
    industries: [['Finance','Identité et conformité'],['Éducation','Accès et connaissance'],['Services professionnels','Automatisation maîtrisée'],['Secteur public','Sécurité et continuité']],
    globalEyebrow: 'AFRIQUE × EUROPE', globalTitle: ['Deux continents.', 'Une même exigence d’ingénierie.'],
    globalCopy: 'Relier les usages, les compétences et les infrastructures par des systèmes compatibles : cloud, identité, données et collaboration.', globalCta: 'Découvrir notre vision internationale',
    closing: ['Votre ambition mérite', 'une architecture.'], contact: 'Parler à un expert'
  },
  en: {
    title: ['Build a safer,', 'smarter and more', 'human future.'],
    intro: 'Luxia-IT designs cloud, cybersecurity and AI architectures that connect strategy, teams and execution.',
    primary: 'Explore our expertise', secondary: 'Our vision',
    promises: ['Connect talent.', 'Secure ideas.', 'Build lasting systems.'],
    ecosystem: 'OUR ECOSYSTEM', platformTitle: ['One architecture.', 'Capabilities working together.'],
    platformCopy: 'Identity, security, cloud, data and automation are designed as one system, with explicit responsibilities and access.',
    platformCta: 'Explore solutions', core: 'LUXIA FOUNDATION',
    nodes: [['AI & AUTOMATION','Interpret and orchestrate'],['IDENTITY','Control access'],['CYBERSECURITY','Detect and protect'],['CLOUD','Distribute and scale'],['DEVSECOPS','Build with control']],
    stages: [['01','Understand','Goals, processes and constraints.'],['02','Design','Architecture, data and ownership.'],['03','Build','Progressive, verifiable delivery.'],['04','Evolve','Measurement, security and improvement.']],
    impactEyebrow: 'FROM CONCEPT TO IMPACT', impactTitle: ['Outcomes', 'that matter.'],
    impactCopy: 'Every project starts with a measurable need and ends with a system teams can understand, use and evolve.',
    principles: [['CLARITY','An explicit scope and clear decisions.'],['TRUST','Security built into the architecture.'],['CONTINUITY','A path shaped around your organisation.']],
    industriesEyebrow: 'SOLUTIONS FOR EVERY CONTEXT', industriesTitle: ['Stronger organisations.', 'More resilient services.'], industriesCta: 'View all industries',
    industries: [['Finance','Identity and compliance'],['Education','Access and knowledge'],['Professional services','Controlled automation'],['Public sector','Security and continuity']],
    globalEyebrow: 'AFRICA × EUROPE', globalTitle: ['Two continents.', 'One engineering standard.'],
    globalCopy: 'Connecting uses, expertise and infrastructure through compatible systems: cloud, identity, data and collaboration.', globalCta: 'Discover our international vision',
    closing: ['Your ambition deserves', 'an architecture.'], contact: 'Talk to an expert'
  },
  zh: {
    title: ['建设更安全、', '更智能、', '更人性的未来。'],
    intro: 'Luxia-IT 设计云、网络安全与人工智能架构，将战略、团队与执行连接起来。',
    primary: '探索我们的专长', secondary: '我们的愿景',
    promises: ['连接人才。', '保护创意。', '构建可持续系统。'],
    ecosystem: '我们的生态系统', platformTitle: ['一套架构。', '多种能力协同运作。'],
    platformCopy: '身份、安全、云、数据与自动化被设计为一个整体，并明确责任与访问权限。',
    platformCta: '探索解决方案', core: 'LUXIA 技术底座',
    nodes: [['人工智能与自动化','理解与编排'],['身份','控制访问'],['网络安全','检测与保护'],['云','分布与扩展'],['DEVSECOPS','在控制中构建']],
    stages: [['01','理解','目标、流程与约束。'],['02','设计','架构、数据与责任。'],['03','构建','渐进且可验证的交付。'],['04','演进','度量、安全与持续改进。']],
    impactEyebrow: '从概念到影响', impactTitle: ['真正重要的', '业务成果。'],
    impactCopy: '每个项目从可衡量的需求开始，最终形成团队能够理解、使用并持续演进的系统。',
    principles: [['清晰','明确范围与决策。'],['信任','将安全融入架构。'],['连续','适合组织发展的路径。']],
    industriesEyebrow: '适用于不同场景的解决方案', industriesTitle: ['更强大的组织。', '更有韧性的服务。'], industriesCta: '查看所有行业',
    industries: [['金融','身份与合规'],['教育','访问与知识'],['专业服务','可控自动化'],['公共部门','安全与连续性']],
    globalEyebrow: '非洲 × 欧洲', globalTitle: ['两个大陆。', '同一工程标准。'],
    globalCopy: '通过兼容的云、身份、数据和协作系统，连接业务场景、专业能力与基础设施。', globalCta: '了解我们的国际愿景',
    closing: ['您的雄心值得', '一套清晰架构。'], contact: '与专家交流'
  }
} as const;

export default function Home({locale}:{locale:Locale}) {
  const c=copy[locale];
  const x={
    fr:{reference:'TECHNOLOGIES DE RÉFÉRENCE',impact:'Une vision unifiée',delivery:'Des solutions concrètes',measure:'Des critères mesurables',reach:'Une ambition internationale',campus:'La technologie au service des organisations.',futureEye:'NOTRE ENGAGEMENT',futureTitle:'Un avenir numérique plus inclusif.',futureCopy:'Nous croyons à une technologie qui renforce les compétences, réduit les fractures et ouvre de nouvelles opportunités.',futureTag:'Des talents d’Afrique. Un impact global.',futureCta:'Découvrir notre impact',footer:'UN MONDE PLUS HUMAIN. PLUS CONNECTÉ.'},
    en:{reference:'REFERENCE TECHNOLOGIES',impact:'One unified vision',delivery:'Concrete solutions',measure:'Measurable criteria',reach:'International ambition',campus:'Technology serving organisations.',futureEye:'OUR COMMITMENT',futureTitle:'A more inclusive digital future.',futureCopy:'We believe in technology that strengthens skills, closes gaps and opens new opportunities.',futureTag:'Talent from Africa. Global impact.',futureCta:'Discover our impact',footer:'A MORE HUMAN. CONNECTED WORLD.'},
    zh:{reference:'参考技术',impact:'统一愿景',delivery:'具体方案',measure:'可衡量标准',reach:'国际化雄心',campus:'让技术服务于组织。',futureEye:'我们的承诺',futureTitle:'建设更包容的数字未来。',futureCopy:'我们相信技术能够增强能力、缩小差距并创造新的机会。',futureTag:'非洲人才，全球影响。',futureCta:'了解我们的影响',footer:'更人性，更互联的世界。'}
  }[locale];
  return <main id="main" className="home-page home-vision-v2">
    <section className="v2-hero">
      <Image className="v2-hero-image" src="/visuals/trust.webp" alt="" fill priority sizes="100vw" />
      <div className="v2-hero-shade" />
      <div className="wrap v2-hero-grid">
        <div className="v2-hero-copy">
          <p className="eyebrow">INTELLIGENCE. TRUST. SCALE.</p>
          <h1>{c.title[0]}<br/>{c.title[1]}<br/><em>{c.title[2]}</em></h1>
          <p>{c.intro}</p>
          <div className="actions"><Link href="/expertise" className="button v2-light-button">{c.primary}<span>→</span></Link><Link href="/company" className="v2-video-link">{c.secondary}<span>↗</span></Link></div>
        </div>
        <aside className="v2-manifesto" aria-label={c.secondary}>{c.promises.map((item,i)=><div key={item}><span>0{i+1}</span><strong>{item}</strong></div>)}</aside>
      </div>
      <div className="wrap v2-technology-line" aria-label={x.reference}><b>{x.reference}</b><span>MICROSOFT</span><span>AZURE</span><span>MICROSOFT 365</span><span>GITHUB</span><span>VERCEL</span></div>

    </section>

    <section className="v2-platform v3-platform wrap">
      <div className="v2-section-copy"><p className="eyebrow">{c.ecosystem}</p><h2>{c.platformTitle[0]}<br/><span>{c.platformTitle[1]}</span></h2><p>{c.platformCopy}</p><Link href="/solutions" className="button v2-light-button">{c.platformCta}<span>→</span></Link></div>
      <div className="home-capabilities">{c.nodes.map(([title,desc],i)=><Link key={title} href={i===0?'/expertise/artificial-intelligence':i===1||i===2?'/expertise/cybersecurity':i===3?'/expertise/cloud':'/expertise/automation'}><strong>{title}</strong><span>{desc}</span><b>↗</b></Link>)}</div>
    </section>

    <section className="v2-impact">
      <div className="wrap v2-impact-grid">
        <div className="v2-section-copy"><p className="eyebrow">{c.impactEyebrow}</p><h2>{c.impactTitle[0]}<br/><span>{c.impactTitle[1]}</span></h2><p>{c.impactCopy}</p><div className="v2-principles v3-outcomes">{[[c.stages[0][0],c.stages[0][1]],[c.stages[1][0],c.stages[1][1]],[c.stages[2][0],c.stages[2][1]],['04',c.stages[3][1]]].map(([value,label])=><div key={value+label}><strong>{value}</strong><span>{label}</span></div>)}</div></div>
        <Link href="/company" className="v2-impact-image"><Image src="/visuals/automation.webp" alt="" fill sizes="(max-width: 800px) 100vw, 54vw"/><div><span>LUXIA-IT ↗</span><strong>{x.campus}</strong></div></Link>
      </div>
    </section>

    <section className="v2-industries wrap">
      <div className="v2-section-copy"><p className="eyebrow">{c.industriesEyebrow}</p><h2>{c.industriesTitle[0]}<br/><span>{c.industriesTitle[1]}</span></h2><Link href="/industries" className="button v2-light-button">{c.industriesCta}<span>→</span></Link></div>
      <div className="v2-industry-grid v3-industry-grid">{c.industries.map(([title,desc],i)=><Link key={title} href={'/industries#sector-'+[1,3,2,5][i]}><span>0{i+1}</span><strong>{title}</strong><small>{desc}</small><b>↗</b></Link>)}</div>
    </section>

    <section className="v2-global v3-future">
      <Image src="/visuals/connectivity.webp" alt="" fill sizes="100vw"/>
      <div className="v2-global-shade" />
      <div className="wrap v2-global-content"><p className="eyebrow">{x.futureEye}</p><h2>{x.futureTitle}</h2><p>{x.futureCopy}</p><Link href="/company#international" className="button v2-light-button">{x.futureCta}<span>→</span></Link><aside>{x.futureTag}</aside></div>
    </section>


  </main>;
}
