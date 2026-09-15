import CaseArchitecture from './case-architecture';
import ExpertiseExperience from './expertise-experience';
import {notFound} from 'next/navigation';
import Link from '@/components/locale-link';
import {getContent, allRoutes, site} from '@/lib/content';
import {translator, type Locale, localizedPath} from '@/lib/i18n';
import Image from 'next/image';

import ContactForm from '@/components/contact-form';

const serviceVisuals: Record<string, string> = {
  'artificial-intelligence': '/visuals/intelligence.webp',
  cybersecurity: '/visuals/cyber.webp',
  cloud: '/visuals/cloud.webp',
  automation: '/visuals/automation.webp',
};

function EditorialVisual({src, label}: {src: string; label: string}) {
  return (
    <div className="editorial-frame">
      <Image src={src} alt="" fill sizes="(max-width: 700px) 100vw, 50vw" />
      <i aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}
function getTitle(path: string,locale:Locale) {
const tr=translator(locale);const {services,articles,cases}=getContent(locale);
const labels: Record<string, string> = {
  expertise: tr('m096'),
  solutions: tr('m097'),
  industries: tr('m098'),
  'case-studies': tr('m099'),
  labs: 'Luxia Labs',
  insights: 'Luxia Insights',
  company: tr('m100'),
  'company/careers': tr('m101'),
  contact: tr('m102'),
  privacy: tr('m103'),
  legal: tr('m104'),
};

  return (
    services.find((s) => 'expertise/' + s.slug === path)?.title ||
    articles.find((a) => 'insights/' + a.slug === path)?.title ||
    cases.find((c) => 'case-studies/' + c.slug === path)?.title ||
    labels[path]
  );
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
      <div className="page-hero-copy">
        <p className="eyebrow">{kicker}</p>
        <h1>{title}</h1>
        {intro && <p className="page-intro">{intro}</p>}
        {children}
      </div>

    </section>
  );
}
function CTA({
  title, locale,
}: {
  title?: string; locale:Locale;
}) {
  return (
    <section className="page-cta wrap">
      <h2>{title || translator(locale)('m106')}</h2>
      <Link href="/contact" className="button primary">
        {translator(locale)('m093')}<span>↗</span>
      </Link>
    </section>
  );
}
function Breadcrumbs({ path,locale }: { path: string;locale:Locale }) {
const tr=translator(locale);
  const parts = path.split('/');
  return (
    <nav className="breadcrumbs wrap" aria-label={tr('m107')}>
      <Link href="/">{tr('m108')}</Link>
      {parts.map((p, i) => {
        const url = parts.slice(0, i + 1).join('/');
        return (
          <span key={url}>
            /{' '}
            {i === parts.length - 1 ? (
              <span aria-current="page">{getTitle(url,locale)}</span>
            ) : (
              <Link href={'/' + url}>{getTitle(url,locale)}</Link>
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
export default function ContentPage({path,locale}:{path:string;locale:Locale}) {
const tr=translator(locale); const {services,sectors,articles,cases}=getContent(locale); const slug=path.split('/');
  if (!allRoutes.includes(path)) notFound();
  const service = services.find((s) => 'expertise/' + s.slug === path);
  const article = articles.find((a) => 'insights/' + a.slug === path);
  const project = cases.find((c) => 'case-studies/' + c.slug === path);
  let content;
  if (service) {
    content = (
      <>
        <PageHero
          kicker={tr('m109') + service.pillar}
          title={service.headline}
          intro={service.intro}
        />
        <section className="detail-lead wrap">
          <div>
            <p className="eyebrow">{tr('m110')}</p>
            <h2>{service.outcome}</h2>
            <Link className="text-link" href="/contact">
              {tr('m111')}</Link>
          </div>
          <EditorialVisual src={serviceVisuals[service.slug]} label={service.title} />
        </section>
        <section className="section wrap">
          <p className="eyebrow">{tr('m112')}</p>
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
            <p className="eyebrow">{tr('m113')}</p>
            <h2>
              {tr('m114')}<br />
              <span>{tr('m115')}</span>
            </h2>
          </div>
          <ol>
            {service.deliverables.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ol>
        </section>
        <section className="section wrap">
          <p className="eyebrow">{tr('m116')}</p>
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
        <CTA locale={locale} />
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
            url: site.origin + localizedPath(locale, '/'+path),
          }}
        />
      </>
    );
  } else if (article) {
    content = (
      <>
        <PageHero
          kicker={tr('m117') + article.tag}
          title={article.title}
          intro={article.intro}
        >
          <p className="article-byline">
            {tr('m118')}</p>
        </PageHero>
        <article className="article-content wrap">
          <aside>
            <p className="eyebrow">{tr('m119')}</p>
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
              <p>{tr('m120')}</p>
              <Link className="text-link" href="/contact">
                {tr('m121')}</Link>
            </div>
          </div>
        </article>
        <section className="section wrap">
          <p className="eyebrow">{tr('m122')}</p>
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
            inLanguage: locale === 'zh' ? 'zh-CN' : locale,
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
            mainEntityOfPage: site.origin + localizedPath(locale, '/'+path),
          }}
        />
      </>
    );
  } else if (project) {
    content = (
      <>
        <PageHero
          kicker={tr('m123') + project.tag}
          title={project.title}
          intro={project.intro}
        >
          <p className="content-notice">
            {tr('m124')}</p>
        </PageHero>
        <div className="wrap"><CaseArchitecture variant={project.slug==='secure-cloud'?'cloud':'knowledge'}/></div>
        <section className="case-body wrap">
          {[
            [tr('case1'), project.challenge],
            [tr('case2'), project.architecture],
            [tr('case3'), project.solution],
            [tr('case4'), project.impact],
          ].map(([t, b]) => (
            <article key={t}>
              <h2>{t}</h2>
              <p>{b}</p>
            </article>
          ))}
          <article>
            <h2>{tr('m125')}</h2>
            <ul>
              {project.criteria.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </article>
        </section>
        <CTA locale={locale} title={tr('m126')} />
      </>
    );
  } else
    switch (path) {
      case 'expertise':
        content = <><ExpertiseExperience/><CTA locale={locale}/></>;
        break;
      case 'solutions':
        content = (
          <>
            <PageHero
              kicker={tr('m133')}
              title={tr('m134')}
              intro={tr('m135')}
            />
            <section className="section wrap">
              <div className="capability-rows">
                {[
                  [
                    tr('m136'),
                    tr('m137'),
                    'artificial-intelligence',
                  ],
                  [
                    tr('m138'),
                    tr('m139'),
                    'automation',
                  ],
                  [
                    tr('m140'),
                    tr('m141'),
                    'cybersecurity',
                  ],
                  [
                    tr('m142'),
                    tr('m143'),
                    'cloud',
                  ],
                ].map(([t, d, p], i) => (
                  <article key={t}>
                    <Image className="solution-photo" src={serviceVisuals[p]} alt="" width={1000} height={560} sizes="(max-width:700px) 100vw, 50vw" />
                    <h3>{t}</h3>
                    <div>
                      <p>{d}</p>
                      <Link href={'/expertise/' + p} className="text-link">
                        {tr('m144')}</Link>
                    </div>
                  </article>
                ))}
              </div>
            </section>
            <section className="section wrap">
              <p className="eyebrow">{tr('m145')}</p>
              <h2>
                {tr('m146')}<br />
                <span>{tr('m147')}</span>
              </h2>
              <div className="platform-story-panel">
                <Image src="/visuals/connectivity.webp" alt="" fill sizes="100vw" />
                <i aria-hidden="true" />
                <div>
                  <span className="micro">LUXIA CORE</span>
                  <strong>{tr('m146')}</strong>
                  <small>{tr('m147')}</small>
                </div>
              </div>
            </section>
            <CTA locale={locale} title={tr('m148')} />
          </>
        );
        break;
      case 'industries':
        content = (
          <>
            <PageHero
              kicker={tr('m098')}
              title={tr('m149')}
              intro={tr('m150')}
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
                    {tr('m151')}</Link>
                </article>
              ))}
            </section>
            <CTA locale={locale} />
          </>
        );
        break;
      case 'case-studies':
        content = (
          <>
            <PageHero
              kicker={tr('m152')}
              title={tr('m153')}
              intro={tr('m154')}
            />
            <section className="wrap case-index">
              {cases.map((c, i) => (
                <Link key={c.slug} href={'/case-studies/' + c.slug}>
                  <span className="case-number">0{i + 1}</span>
                  <div>
                    <p className="eyebrow">{tr('m123')}{c.tag}</p>
                    <h2>{c.title}</h2>
                    <p>{c.intro}</p>
                    <span className="text-link">
                      {tr('m155')}</span>
                  </div>
                </Link>
              ))}
            </section>
            <CTA locale={locale} />
          </>
        );
        break;
      case 'labs':
        content = (
          <>
            <PageHero
              kicker={tr('m156')}
              title={tr('m157')}
              intro={tr('m158')}
            />
            <section className="labs-feature wrap" id="alma">
              <p className="eyebrow">
                <span className="status-dot" /> {tr('m034')}</p>
              <div className="labs-page-core"><Image src="/visuals/intelligence.webp" alt="" fill sizes="50vw" /></div><h2>ALMA</h2>
              <p>{tr('m035')}</p>
              <div className="alma-description">
                <p>
                  {tr('m159')}</p>
                <Link href="/contact" className="text-link">
                  {tr('m160')}</Link>
              </div>
            </section>
            <section className="section wrap">
              <p className="eyebrow">{tr('m161')}</p>
              <div className="capability-rows">
                {[
                  [
                    tr('m162'),
                    tr('m163'),
                  ],
                  [
                    tr('m164'),
                    tr('m165'),
                  ],
                  [
                    tr('m166'),
                    tr('m167'),
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
            <CTA locale={locale} title={tr('m168')} />
          </>
        );
        break;
      case 'insights':
        content = (
          <>
            <PageHero
              kicker="LUXIA INSIGHTS"
              title={tr('m169')}
              intro={tr('m170')}
            />
            <section className="wrap insights-index">
              {articles.map((a, i) => (
                <Link href={'/insights/' + a.slug} key={a.slug}>
                  <p className="eyebrow">
                    0{i + 1} / {a.tag} {tr('m171')}</p>
                  <h2>{a.title}</h2>
                  <p>{a.intro}</p>
                  <span className="text-link">{tr('m172')}</span>
                </Link>
              ))}
            </section>
            <section className="section wrap">
              <p className="eyebrow">{tr('m173')}</p>
              <h2>
                {tr('m174')}<br />
                {tr('m175')}<br />
                <span>{tr('m176')}</span>
              </h2>
              <p className="narrow">
                {tr('m177')}</p>
            </section>
            <CTA locale={locale} />
          </>
        );
        break;
      case 'company':
        content = (
          <>
            <PageHero
              kicker={tr('m178')}
              title={tr('m179')}
              intro={tr('m180')}
            />
            <section className="section wrap company-mission">
              <div>
                <p className="eyebrow">{tr('m181')}</p>
                <h2>{tr('m182')}</h2>
                <p>
                  {tr('m183')}</p>
              </div>
              <div>
                <p className="eyebrow">{tr('m184')}</p>
                <h2>{tr('m185')}</h2>
                <p>
                  {tr('m186')}</p>
              </div>
            </section>
            <section className="wrap company-visual-story">
              <Image src="/visuals/world.webp" alt="" fill sizes="100vw" />
              <i aria-hidden="true" />
              <p>{tr('m049')}<br/><span>{tr('m203')}</span></p>
            </section>
            <section className="section wrap">
              <p className="eyebrow">{tr('m187')}</p>
              <div className="capability-rows">
                {[
                  [
                    tr('m188'),
                    tr('m189'),
                  ],
                  [
                    tr('m190'),
                    tr('m191'),
                  ],
                  [
                    tr('m192'),
                    tr('m193'),
                  ],
                  [
                    tr('m194'),
                    tr('m195'),
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
              <p className="eyebrow">{tr('m196')}</p>
              <h2>{tr('m197')}</h2>
              <p>
                {tr('m198')}</p>
              <div className="leadership">
                <div className="founder-monogram" aria-hidden="true">
                  BL
                </div>
                <div>
                  <p className="eyebrow">{tr('m199')}</p>
                  <h3>{site.founder}</h3>
                  <span>{tr('m200')}</span>
                  <p>
                    {tr('m201')}</p>
                </div>
              </div>
            </section>
            <section className="section wrap" id="international">
              <p className="eyebrow">{tr('m202')}</p>
              <h2>
                {tr('m049')}<br />
                <span>{tr('m203')}</span>
              </h2>
              <div className="company-mission">
                <p>
                  {tr('m204')}</p>
                <p>
                  {tr('m205')}</p>
              </div>
            </section>
            <section className="page-cta wrap">
              <h2>{tr('m206')}</h2>
              <Link className="button" href="/company/careers">
                {tr('m207')}</Link>
            </section>
          </>
        );
        break;
      case 'company/careers':
        content = (
          <>
            <PageHero
              kicker={tr('m208')}
              title={tr('m209')}
              intro={tr('m210')}
            />
            <section className="section wrap">
              <p className="eyebrow">{tr('m211')}</p>
              <div className="industry-list">
                {[
                  tr('m212'),
                  tr('m016'),
                  tr('m213'),
                  tr('m214'),
                ].map((t) => (
                  <span className="career-field" key={t}>
                    {t}
                  </span>
                ))}
              </div>
              <div className="content-notice">
                {tr('m215')}</div>
              <h2 className="spaced">{tr('m216')}</h2>
              <p className="narrow">
                {tr('m217')}</p>
              <a
                className="button primary"
                href={
                  'mailto:' +
                  site.email +
                  '?subject='+encodeURIComponent(tr('careersSubject'))
                }
              >
                {tr('m218')}</a>
            </section>
          </>
        );
        break;
      case 'contact':
        content = (
          <>
            <PageHero
              kicker={tr('m219')}
              title={tr('m220')}
              intro={tr('m221')}
            />
            <section className="contact-layout wrap">
              <ContactForm />
              <aside>
                <p className="eyebrow">{tr('m222')}</p>
                <a href={'mailto:' + site.email} className="contact-address">
                  {site.email} ↗
                </a>
                <p>{tr('m223')}</p>
                <a
                  className="text-link"
                  href={site.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {site.phone} <span>↗</span>
                </a>
                <hr />
                <p className="eyebrow">{tr('m224')}</p>
                <ol>
                  <li>{tr('m225')}</li>
                  <li>{tr('m226')}</li>
                  <li>{tr('m227')}</li>
                </ol>
                <span className="micro">{tr('m202')}</span>
              </aside>
            </section>
          </>
        );
        break;
      case 'privacy':
        content = (
          <>
            <PageHero
              kicker={tr('m228')}
              title={tr('m229')}
              intro={tr('m230')}
            />
            <section className="legal-copy wrap">
              <h2>{tr('m231')}</h2>
              <p>
                {tr('m232')}</p>
              <h2>{tr('m233')}</h2>
              <p>
                {tr('m234')}</p>
              <h2>{tr('m235')}</h2>
              <p>
                {tr('m236')}</p>
              <h2>{tr('m237')}</h2>
              <p>
                {tr('m238')}<a href={'mailto:' + site.email}>{site.email}</a>.
              </p>
              <h2>{tr('m239')}</h2>
              <p>
                {tr('m240')}</p>
            </section>
          </>
        );
        break;
      case 'legal':
        content = (
          <>
            <PageHero
              kicker={tr('m241')}
              title={tr('m242')}
              intro={tr('m243')}
            />
            <section className="legal-copy wrap">
              <h2>{tr('m244')}</h2>
              <p>
                {tr('m245')}<br />
                {tr('m246')}{site.founder}.<br />
                {tr('m247')}<a href={'mailto:' + site.email}>{site.email}</a>.<br />
                {tr('m248')}<a href="tel:+40766438679">{site.phone}</a>.
              </p>
              <h2>{tr('m249')}</h2>
              <p>
                {tr('m250')}</p>
              <h2>{tr('m251')}</h2>
              <p>
                {tr('m252')}</p>
              <h2>{tr('m253')}</h2>
              <p>
                {tr('m254')}</p>
              <h2>{tr('m255')}</h2>
              <p>
                {tr('m256')}</p>
            </section>
          </>
        );
        break;
    }
  return (
    <main id="main" className="inner-page" data-page={path} data-family={path.split('/')[0]}>
      <Breadcrumbs locale={locale} path={path} />
      {content}
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: tr('m108'),
              item: site.origin + '/' + locale,
            },
            ...slug.map((_, i) => ({
              '@type': 'ListItem',
              position: i + 2,
              name: getTitle(slug.slice(0, i + 1).join('/'),locale),
              item: site.origin + localizedPath(locale, '/'+slug.slice(0, i+1).join('/')),
            })),
          ],
        }}
      />
    </main>
  );
}
