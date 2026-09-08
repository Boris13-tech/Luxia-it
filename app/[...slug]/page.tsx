import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  services,
  sectors,
  articles,
  cases,
  allRoutes,
  site,
} from '@/lib/content';
import Nucleus from '@/components/nucleus';
import Framework from '@/components/framework';
import Agents from '@/components/agents';
import ContactForm from '@/components/contact-form';
const labels: Record<string, string> = {
  expertise: 'Expertises',
  solutions: 'Solutions',
  industries: 'Secteurs',
  'case-studies': 'Projets',
  labs: 'Luxia Labs',
  insights: 'Luxia Insights',
  company: 'Le groupe',
  'company/careers': 'Carrières',
  contact: 'Contact',
  privacy: 'Confidentialité',
  legal: 'Mentions légales',
};
function getTitle(path: string) {
  return (
    services.find((s) => 'expertise/' + s.slug === path)?.title ||
    articles.find((a) => 'insights/' + a.slug === path)?.title ||
    cases.find((c) => 'case-studies/' + c.slug === path)?.title ||
    labels[path]
  );
}
export function generateStaticParams() {
  return allRoutes.map((p) => ({ slug: p.split('/') }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const path = slug.join('/');
  const title = getTitle(path) || 'Page introuvable';
  const desc =
    services.find((s) => 'expertise/' + s.slug === path)?.intro ||
    articles.find((a) => 'insights/' + a.slug === path)?.intro ||
    cases.find((c) => 'case-studies/' + c.slug === path)?.intro ||
    `${title} — Luxia-IT. Intelligence, cybersécurité et cloud : une même exigence entre Afrique et Europe.`;
  return {
    title,
    description: desc,
    alternates: { canonical: '/' + path },
    openGraph: {
      title: title + ' | Luxia-IT',
      description: desc,
      url: '/' + path,
      type: path.startsWith('insights/') ? 'article' : 'website',
    },
    twitter: {
      card: 'summary',
      title: title + ' | Luxia-IT',
      description: desc,
    },
  };
}
function PageHero({
  kicker,
  title,
  intro,
  children,
}: {
  kicker: string;
  title: string;
  intro?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="page-hero wrap">
      <p className="eyebrow">{kicker}</p>
      <h1>{title}</h1>
      {intro && <p className="page-intro">{intro}</p>}
      {children}
    </section>
  );
}
function CTA({
  title = 'Votre ambition mérite une architecture.',
}: {
  title?: string;
}) {
  return (
    <section className="page-cta wrap">
      <h2>{title}</h2>
      <Link href="/contact" className="button primary">
        Parler à un expert <span>↗</span>
      </Link>
    </section>
  );
}
function Breadcrumbs({ path }: { path: string }) {
  const parts = path.split('/');
  return (
    <nav className="breadcrumbs wrap" aria-label="Fil d’Ariane">
      <Link href="/">Accueil</Link>
      {parts.map((p, i) => {
        const url = parts.slice(0, i + 1).join('/');
        return (
          <span key={url}>
            /{' '}
            {i === parts.length - 1 ? (
              <span aria-current="page">{getTitle(url)}</span>
            ) : (
              <Link href={'/' + url}>{getTitle(url)}</Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, '\\u003c'),
      }}
    />
  );
}
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const path = slug.join('/');
  if (!allRoutes.includes(path)) notFound();
  const service = services.find((s) => 'expertise/' + s.slug === path);
  const article = articles.find((a) => 'insights/' + a.slug === path);
  const project = cases.find((c) => 'case-studies/' + c.slug === path);
  let content;
  if (service) {
    content = (
      <>
        <PageHero
          kicker={'EXPERTISE / ' + service.pillar}
          title={service.headline}
          intro={service.intro}
        />
        <section className="detail-lead wrap">
          <div>
            <p className="eyebrow">L’OBJECTIF</p>
            <h2>{service.outcome}</h2>
            <Link className="text-link" href="/contact">
              Discuter de votre contexte ↗
            </Link>
          </div>
          <Nucleus
            mode={
              services.indexOf(service) === 3 ? 3 : services.indexOf(service)
            }
          />
        </section>
        <section className="section wrap">
          <p className="eyebrow">PÉRIMÈTRES D’INTERVENTION</p>
          <div className="capability-rows">
            {service.capabilities.map(([t, d], i) => (
              <article key={t}>
                <span className="micro">0{i + 1}</span>
                <h3>{t}</h3>
                <p>{d}</p>
              </article>
            ))}
          </div>
        </section>
        <section className="section wrap deliverables">
          <div>
            <p className="eyebrow">DU CADRAGE À LA MISE EN SERVICE</p>
            <h2>
              Des livrables.
              <br />
              <span>Un cap partagé.</span>
            </h2>
          </div>
          <ol>
            {service.deliverables.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ol>
        </section>
        <section className="section wrap">
          <p className="eyebrow">QUESTIONS DE DÉPART</p>
          <div className="faq">
            {service.questions.map(([q, a]) => (
              <details key={q}>
                <summary>
                  {q}
                  <span>+</span>
                </summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </section>
        <CTA />
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: service.title,
            description: service.intro,
            provider: {
              '@type': 'Organization',
              name: site.name,
              url: site.origin,
            },
            url: site.origin + '/' + path,
          }}
        />
      </>
    );
  } else if (article) {
    content = (
      <>
        <PageHero
          kicker={'LUXIA INSIGHTS / ' + article.tag}
          title={article.title}
          intro={article.intro}
        >
          <p className="article-byline">
            Perspective Luxia-IT · Note d’analyse
          </p>
        </PageHero>
        <article className="article-content wrap">
          <aside>
            <p className="eyebrow">DANS CETTE PERSPECTIVE</p>
            {article.sections.map(([t], i) => (
              <a key={t} href={'#part-' + i}>
                0{i + 1} — {t}
              </a>
            ))}
          </aside>
          <div>
            {article.sections.map(([t, b], i) => (
              <section key={t} id={'part-' + i}>
                <h2>{t}</h2>
                <p>{b}</p>
              </section>
            ))}
            <div className="article-end">
              <p>Une question à rapprocher de votre organisation ?</p>
              <Link className="text-link" href="/contact">
                Échanger avec Luxia-IT ↗
              </Link>
            </div>
          </div>
        </article>
        <section className="section wrap">
          <p className="eyebrow">POUR POURSUIVRE</p>
          <div className="insight-rows">
            {articles
              .filter((a) => a.slug !== article.slug)
              .map((a) => (
                <Link key={a.slug} href={'/insights/' + a.slug}>
                  <span className="micro">{a.tag}</span>
                  <h3>{a.title}</h3>
                  <span>↗</span>
                </Link>
              ))}
          </div>
        </section>
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: article.title,
            description: article.intro,
            inLanguage: 'fr',
            author: {
              '@type': 'Organization',
              name: site.name,
              url: site.origin,
            },
            publisher: {
              '@type': 'Organization',
              name: site.name,
              url: site.origin,
            },
            mainEntityOfPage: site.origin + '/' + path,
          }}
        />
      </>
    );
  } else if (project) {
    content = (
      <>
        <PageHero
          kicker={'CONCEPT PROJECT / ' + project.tag}
          title={project.title}
          intro={project.intro}
        >
          <p className="content-notice">
            Architecture conceptuelle. Ce contenu ne décrit pas une mission
            client ni un système en production.
          </p>
        </PageHero>
        <section className="case-body wrap">
          {[
            ['01 / DÉFI', project.challenge],
            ['02 / ARCHITECTURE', project.architecture],
            ['03 / SOLUTION', project.solution],
            ['04 / IMPACT ENVISAGÉ', project.impact],
          ].map(([t, b]) => (
            <article key={t}>
              <h2>{t}</h2>
              <p>{b}</p>
            </article>
          ))}
          <article>
            <h2>05 / CRITÈRES D’ÉVALUATION</h2>
            <ul>
              {project.criteria.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </article>
        </section>
        <CTA title="Donnons un contexte réel à cette architecture." />
      </>
    );
  } else
    switch (path) {
      case 'expertise':
        content = (
          <>
            <PageHero
              kicker="INTELLIGENCE. TRUST. SCALE."
              title="Les expertises se rencontrent. Votre entreprise avance."
              intro="Quatre disciplines complémentaires. Une approche cohérente de la stratégie, de l’architecture et de la mise en œuvre."
            />
            <section className="wrap expertise-index">
              {services.map((s, i) => (
                <Link key={s.slug} href={'/expertise/' + s.slug}>
                  <span className="micro">
                    0{i + 1} / {s.pillar}
                  </span>
                  <h2>{s.title}</h2>
                  <p>{s.outcome}</p>
                  <span className="arrow">↗</span>
                </Link>
              ))}
            </section>
            <section className="section wrap">
              <p className="eyebrow">UNE MÉTHODE COMMUNE</p>
              <h2>
                De la question initiale
                <br />
                <span>à l’évolution continue.</span>
              </h2>
              <Framework />
            </section>
            <CTA />
          </>
        );
        break;
      case 'solutions':
        content = (
          <>
            <PageHero
              kicker="SOLUTIONS / DE L’USAGE AU SYSTÈME"
              title="La bonne technologie commence par le bon problème."
              intro="Partir d’un besoin métier, relier les expertises et définir un périmètre mesurable. Chaque solution est cadrée selon vos données, vos équipes et vos contraintes."
            />
            <section className="section wrap">
              <div className="capability-rows">
                {[
                  [
                    'Rendre la connaissance accessible',
                    'Relier vos documents autorisés à un assistant qui aide les équipes à retrouver des informations et leurs sources.',
                    'artificial-intelligence',
                  ],
                  [
                    'Fluidifier les opérations',
                    'Orchestrer les échanges entre outils, les validations et les tâches répétitives, avec une gestion explicite des exceptions.',
                    'automation',
                  ],
                  [
                    'Renforcer le socle de confiance',
                    'Revoir les identités, les accès et les configurations cloud pour donner une priorité concrète aux protections.',
                    'cybersecurity',
                  ],
                  [
                    'Préparer la croissance',
                    'Concevoir une infrastructure documentée, observable et adaptée aux besoins de reprise et d’évolution.',
                    'cloud',
                  ],
                ].map(([t, d, p], i) => (
                  <article key={t}>
                    <span className="micro">0{i + 1}</span>
                    <h3>{t}</h3>
                    <div>
                      <p>{d}</p>
                      <Link href={'/expertise/' + p} className="text-link">
                        L’expertise associée ↗
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </section>
            <section className="section wrap">
              <p className="eyebrow">AGENTS IA / CONCEPTS À EXPLORER</p>
              <h2>
                Une capacité spécialisée.
                <br />
                <span>Une supervision explicite.</span>
              </h2>
              <Agents />
            </section>
            <CTA title="Quel processus voulez-vous faire progresser ?" />
          </>
        );
        break;
      case 'industries':
        content = (
          <>
            <PageHero
              kicker="SECTEURS"
              title="La pertinence est une question de contexte."
              intro="Les mêmes technologies rencontrent des réalités différentes. Notre travail commence par comprendre vos usages, vos contraintes et vos responsabilités."
            />
            <section className="sector-index wrap">
              {sectors.map(([n, t, d, tags], i) => (
                <article key={n} id={'sector-' + i}>
                  <p className="eyebrow">
                    0{i + 1} / {n}
                  </p>
                  <h2>{t}</h2>
                  <p>{d}</p>
                  <small>{tags}</small>
                  <Link href="/contact" className="text-link">
                    Parlons de votre secteur ↗
                  </Link>
                </article>
              ))}
            </section>
            <CTA />
          </>
        );
        break;
      case 'case-studies':
        content = (
          <>
            <PageHero
              kicker="ARCHITECTURES & DÉMONSTRATIONS"
              title="Rendre les idées concrètes."
              intro="Explorez des architectures de référence et des scénarios de travail. Ces projets conceptuels exposent notre approche ; ils ne représentent pas des réalisations clients."
            />
            <section className="wrap case-index">
              {cases.map((c, i) => (
                <Link key={c.slug} href={'/case-studies/' + c.slug}>
                  <span className="case-number">0{i + 1}</span>
                  <div>
                    <p className="eyebrow">CONCEPT PROJECT / {c.tag}</p>
                    <h2>{c.title}</h2>
                    <p>{c.intro}</p>
                    <span className="text-link">
                      Défi · Architecture · Solution · Impact ↗
                    </span>
                  </div>
                </Link>
              ))}
            </section>
            <CTA />
          </>
        );
        break;
      case 'labs':
        content = (
          <>
            <PageHero
              kicker="LUXIA LABS / RECHERCHE & DÉVELOPPEMENT"
              title="Un espace pour construire ce qui vient."
              intro="Luxia Labs explore les agents IA, l’automatisation, la sécurité de l’IA et les architectures cloud. Une démarche qui relie expérimentation et contraintes d’usage."
            />
            <section className="labs-feature wrap" id="alma">
              <p className="eyebrow">
                <span className="status-dot" /> EN DÉVELOPPEMENT
              </p>
              <h2>ALMA</h2>
              <p>Coming from Luxia Labs.</p>
              <div className="alma-description">
                <p>
                  ALMA est un projet de plateforme intelligente en développement
                  au sein de Luxia Labs. Son périmètre et sa disponibilité
                  seront présentés lorsqu’ils seront définis.
                </p>
                <Link href="/contact" className="text-link">
                  Échanger avec Luxia Labs ↗
                </Link>
              </div>
            </section>
            <section className="section wrap">
              <p className="eyebrow">AXES D’EXPLORATION</p>
              <div className="capability-rows">
                {[
                  [
                    'Agents & orchestration',
                    'Coordonner des capacités spécialisées avec des responsabilités et des validations lisibles.',
                  ],
                  [
                    'Sécurité de l’IA',
                    'Examiner les accès, les sources, les limites d’action et la robustesse des interactions.',
                  ],
                  [
                    'Architectures émergentes',
                    'Explorer les systèmes cloud et les méthodes d’automatisation qui peuvent répondre à des besoins concrets.',
                  ],
                ].map(([t, d], i) => (
                  <article key={t}>
                    <span className="micro">0{i + 1}</span>
                    <h3>{t}</h3>
                    <p>{d}</p>
                  </article>
                ))}
              </div>
            </section>
            <CTA title="L’expérimentation commence par une question utile." />
          </>
        );
        break;
      case 'insights':
        content = (
          <>
            <PageHero
              kicker="LUXIA INSIGHTS"
              title="Une perspective claire sur des systèmes complexes."
              intro="IA, cybersécurité, cloud et transformation : des notes pour poser les bonnes questions avant de prendre une décision."
            />
            <section className="wrap insights-index">
              {articles.map((a, i) => (
                <Link href={'/insights/' + a.slug} key={a.slug}>
                  <p className="eyebrow">
                    0{i + 1} / {a.tag} / PERSPECTIVE
                  </p>
                  <h2>{a.title}</h2>
                  <p>{a.intro}</p>
                  <span className="text-link">Lire la perspective ↗</span>
                </Link>
              ))}
            </section>
            <section className="section wrap">
              <p className="eyebrow">HORIZONS ÉDITORIAUX</p>
              <h2>
                L’écosystème Microsoft.
                <br />
                La sécurité de l’IA.
                <br />
                <span>La technologie en Afrique.</span>
              </h2>
              <p className="narrow">
                Ces thèmes prolongeront les prochaines perspectives Luxia-IT, à
                mesure que nos analyses seront prêtes à être publiées.
              </p>
            </section>
            <CTA />
          </>
        );
        break;
      case 'company':
        content = (
          <>
            <PageHero
              kicker="LE GROUPE / LUXIA-IT"
              title="L’ambition est humaine. La technologie la rend possible."
              intro="Luxia-IT est une entreprise technologique qui relie intelligence artificielle, cybersécurité et cloud pour accompagner la transformation des organisations."
            />
            <section className="section wrap company-mission">
              <div>
                <p className="eyebrow">NOTRE MISSION</p>
                <h2>Transformer la complexité en capacité d’action.</h2>
                <p>
                  Concevoir des systèmes qui rendent les organisations plus
                  intelligentes, plus automatisées et plus résilientes. La
                  valeur se juge dans le travail réel des équipes.
                </p>
              </div>
              <div>
                <p className="eyebrow">NOTRE VISION</p>
                <h2>L’entreprise intelligente se construit ensemble.</h2>
                <p>
                  Une technologie comprise, gouvernée et intégrée à l’activité.
                  Une même exigence d’architecture, quel que soit le marché où
                  elle est déployée.
                </p>
              </div>
            </section>
            <section className="section wrap">
              <p className="eyebrow">NOS PRINCIPES</p>
              <div className="capability-rows">
                {[
                  [
                    'L’utilité avant la démonstration',
                    'Chaque choix technique doit servir un besoin explicite et un résultat que l’organisation peut évaluer.',
                  ],
                  [
                    'La confiance dès la conception',
                    'Les identités, les données et les responsabilités font partie de l’architecture initiale.',
                  ],
                  [
                    'La clarté dans la relation',
                    'Rendre visibles les décisions, les limites et les compromis pour avancer sur une base partagée.',
                  ],
                  [
                    'L’évolution dans la durée',
                    'Documenter, transmettre et faire progresser les systèmes au-delà de leur mise en service.',
                  ],
                ].map(([t, d], i) => (
                  <article key={t}>
                    <span className="micro">0{i + 1}</span>
                    <h3>{t}</h3>
                    <p>{d}</p>
                  </article>
                ))}
              </div>
            </section>
            <section className="section wrap company-story">
              <p className="eyebrow">NOTRE HISTOIRE</p>
              <h2>Relier ce qui est trop souvent séparé.</h2>
              <p>
                Luxia-IT porte une conviction : l’intelligence artificielle, la
                sécurité et l’infrastructure doivent être pensées comme un
                ensemble. Cette approche structure le développement de
                l’entreprise et de Luxia Labs.
              </p>
              <div className="leadership">
                <div className="founder-monogram" aria-hidden="true">
                  BL
                </div>
                <div>
                  <p className="eyebrow">DIRECTION</p>
                  <h3>{site.founder}</h3>
                  <span>Founder & Technology Lead</span>
                  <p>
                    À l’origine de Luxia-IT, Boris Legrand Ohandja porte la
                    vision technologique et l’approche d’architecture de
                    l’entreprise.
                  </p>
                </div>
              </div>
            </section>
            <section className="section wrap" id="international">
              <p className="eyebrow">AFRIQUE × EUROPE</p>
              <h2>
                Deux continents.
                <br />
                <span>Un même niveau d’exigence.</span>
              </h2>
              <div className="company-mission">
                <p>
                  Comprendre les réalités des marchés africains et les
                  écosystèmes européens pour concevoir des systèmes pertinents.
                  Le Cameroun, l’Afrique francophone, la Roumanie et l’Europe
                  constituent les premiers axes de cette trajectoire.
                </p>
                <p>
                  Cette orientation décrit notre ambition et nos marchés de
                  développement. Elle ne revendique pas un réseau de bureaux ni
                  des implantations non confirmées.
                </p>
              </div>
            </section>
            <section className="page-cta wrap">
              <h2>Construire avec nous.</h2>
              <Link className="button" href="/company/careers">
                Carrières & collaborations ↗
              </Link>
            </section>
          </>
        );
        break;
      case 'company/careers':
        content = (
          <>
            <PageHero
              kicker="CARRIÈRES & COLLABORATIONS"
              title="Les bonnes questions ont besoin de bonnes équipes."
              intro="Nous nous intéressons aux profils qui relient rigueur technique, compréhension métier et capacité à travailler ensemble."
            />
            <section className="section wrap">
              <p className="eyebrow">DOMAINES D’INTÉRÊT</p>
              <div className="industry-list">
                {[
                  'IA & ingénierie logicielle',
                  'Cybersécurité & identité',
                  'Cloud & architecture',
                  'Conseil & transformation',
                ].map((t) => (
                  <span className="career-field" key={t}>
                    {t}
                  </span>
                ))}
              </div>
              <div className="content-notice">
                Aucun poste ouvert n’est annoncé à ce jour sur ce site. Une
                candidature spontanée ne constitue pas une offre d’emploi.
              </div>
              <h2 className="spaced">Présentez-nous votre approche.</h2>
              <p className="narrow">
                Partagez votre domaine d’expertise, votre expérience et les
                sujets sur lesquels vous souhaitez contribuer. Évitez les
                données personnelles non nécessaires.
              </p>
              <a
                className="button primary"
                href={
                  'mailto:' +
                  site.email +
                  '?subject=Candidature%20spontan%C3%A9e%20Luxia-IT'
                }
              >
                Envoyer une candidature ↗
              </a>
            </section>
          </>
        );
        break;
      case 'contact':
        content = (
          <>
            <PageHero
              kicker="COMMENÇONS PAR VOTRE CONTEXTE"
              title="Que souhaitez-vous construire ?"
              intro="Un projet défini, une difficulté à résoudre ou une idée à explorer. Donnez-nous le point de départ."
            />
            <section className="contact-layout wrap">
              <ContactForm />
              <aside>
                <p className="eyebrow">UNE CONVERSATION DIRECTE</p>
                <a href={'mailto:' + site.email} className="contact-address">
                  {site.email} ↗
                </a>
                <p>Vous préférez un premier échange sur WhatsApp ?</p>
                <a
                  className="text-link"
                  href={site.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {site.phone} <span>↗</span>
                </a>
                <hr />
                <p className="eyebrow">ET ENSUITE ?</p>
                <ol>
                  <li>Comprendre votre besoin.</li>
                  <li>Clarifier le périmètre.</li>
                  <li>Définir une prochaine étape utile.</li>
                </ol>
                <span className="micro">AFRIQUE × EUROPE</span>
              </aside>
            </section>
          </>
        );
        break;
      case 'privacy':
        content = (
          <>
            <PageHero
              kicker="INFORMATIONS / CONFIDENTIALITÉ"
              title="Vos informations, avec clarté."
              intro="Cette page décrit le fonctionnement de cette version du site. Les informations juridiques du responsable de traitement restent à compléter avant la mise en ligne publique."
            />
            <section className="legal-copy wrap">
              <h2>Formulaire de contact</h2>
              <p>
                Les champs saisis restent dans la mémoire de votre navigateur
                pendant la navigation sur le formulaire. Ils ne sont pas
                enregistrés dans une base de données par ce site. L’étape finale
                prépare un message dans votre application de messagerie ; vous
                décidez de son envoi.
              </p>
              <h2>Email et WhatsApp</h2>
              <p>
                Lorsque vous envoyez un email ou utilisez WhatsApp, les
                informations sont traitées par ces services et par le
                destinataire pour répondre à votre demande. Le lien WhatsApp
                ouvre un service externe. Nous vous invitons à ne pas
                transmettre d’informations sensibles lors du premier contact.
              </p>
              <h2>Cookies et mesure d’audience</h2>
              <p>
                Le code de ce site n’ajoute pas d’outil publicitaire ni de
                mesure d’audience. L’hébergement privé peut utiliser des
                mécanismes de connexion et des journaux techniques propres à la
                plateforme d’hébergement.
              </p>
              <h2>Contact relatif aux données</h2>
              <p>
                Pour une question concernant vos échanges avec Luxia-IT, écrivez
                à <a href={'mailto:' + site.email}>{site.email}</a>.
              </p>
              <h2>Informations restant à confirmer</h2>
              <p>
                L’identité juridique du responsable de traitement, son adresse,
                les modalités de conservation des échanges, les bases juridiques
                applicables et l’autorité de contrôle compétente doivent être
                confirmées par l’entreprise avant publication publique.
              </p>
            </section>
          </>
        );
        break;
      case 'legal':
        content = (
          <>
            <PageHero
              kicker="INFORMATIONS / MENTIONS LÉGALES"
              title="Informations sur le site."
              intro="Luxia-IT — Intelligence. Trust. Scale."
            />
            <section className="legal-copy wrap">
              <h2>Marque et contact</h2>
              <p>
                Nom utilisé sur le site : Luxia-IT.
                <br />
                Fondateur et responsable technologique : {site.founder}.<br />
                Email : <a href={'mailto:' + site.email}>{site.email}</a>.<br />
                Téléphone : <a href="tel:+40766438679">{site.phone}</a>.
              </p>
              <h2>Éditeur — informations à compléter</h2>
              <p>
                La dénomination sociale, la forme juridique, l’adresse du siège,
                le numéro d’immatriculation, l’identifiant fiscal et le
                responsable de publication n’ont pas été fournis. Ces
                informations doivent être complétées avant publication publique.
              </p>
              <h2>Hébergement</h2>
              <p>
                Cette version de présentation est hébergée sur Sites. Les
                coordonnées légales de l’hébergeur de la version publique
                devront être confirmées lors du choix de son hébergement
                définitif.
              </p>
              <h2>Contenus et marques</h2>
              <p>
                Les noms de produits tiers, dont Microsoft et Azure, servent à
                décrire les domaines technologiques concernés. Leur mention
                n’implique pas une certification ni un partenariat commercial.
              </p>
              <h2>Projets et recherche</h2>
              <p>
                Les pages intitulées « Concept Project » présentent des
                architectures conceptuelles. Elles ne constituent pas des
                références clients. ALMA est un projet en développement dont le
                périmètre et la disponibilité ne sont pas annoncés.
              </p>
            </section>
          </>
        );
        break;
    }
  return (
    <main id="main" className="inner-page">
      <Breadcrumbs path={path} />
      {content}
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Accueil',
              item: site.origin,
            },
            ...slug.map((_, i) => ({
              '@type': 'ListItem',
              position: i + 2,
              name: getTitle(slug.slice(0, i + 1).join('/')),
              item: site.origin + '/' + slug.slice(0, i + 1).join('/'),
            })),
          ],
        }}
      />
    </main>
  );
}
