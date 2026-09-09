import {translator, type Locale} from '@/lib/i18n';
import Link from '@/components/locale-link';
import CoreJourney from '@/components/core-journey';
import PillarStory from '@/components/pillar-story';
import Framework from '@/components/framework';
import Agents from '@/components/agents';
import Engineering from '@/components/engineering';
import CaseArchitecture from '@/components/case-architecture';

export default function Home({locale}:{locale:Locale}) {
const tr=translator(locale);
  return (
    <main id="main" className="home-page"><CoreJourney/>
      <section className="hero" data-scene="-1">
        <div className="hero-art" data-core-slot="0">
          <span className="art-coordinate">{tr('m001')}</span>
        </div>
        <div className="hero-content wrap">
          <p className="eyebrow">
            <span className="status-dot" /> {tr('m002')}</p>
          <h1>
            {tr('m003')}<br />
            {tr('m004')}<br />
            <em>{tr('m005')}</em>
          </h1>
          <p className="hero-description">
            {tr('m006')}<br />
            {tr('m007')}</p>
          <div className="actions">
            <Link href="/contact" className="button primary">
              {tr('m008')}<span>↗</span>
            </Link>
            <Link href="/company" className="text-link">
              {tr('m009')}<span>↗</span>
            </Link>
          </div>
        </div>
        <div className="hero-bottom wrap">
          <span>{tr('m010')}</span>
          <span>
            {tr('m011')}<b>{tr('m012')}</b> {tr('m013')}</span>
          <a href="#vision">
            {tr('m014')}<span>↓</span>
          </a>
        </div>
      </section>
      <section className="pillar-strip wrap">
        {[
          [
            '01',
            'INTELLIGENCE',
            tr('m015'),
            'artificial-intelligence',
          ],
          ['02', 'TRUST', tr('m016'), 'cybersecurity'],
          ['03', 'SCALE', tr('m017'), 'cloud'],
        ].map(([n, t, s, p]) => (
          <Link key={n} data-core-hover={Number(n)-1} href={'/expertise/' + p}>
            <span>{n}</span>
            {t}
            <small>{s}</small>
            <b>↗</b>
          </Link>
        ))}
      </section>
      <section className="section wrap vision" id="vision">
        <p className="eyebrow">{tr('m018')}</p>
        <h2>
          {tr('m019')}<br />
          {tr('m020')}<br />
          <span>{tr('m021')}</span>
        </h2>
        <div className="vision-bottom">
          <span className="micro">{tr('m022')}</span>
          <p>
            {tr('m023')}</p>
        </div>
      </section>
      <PillarStory sharedCore />
      <section className="section wrap agent-chapter" data-scene="3">
        <div className="section-heading">
          <div>
            <p className="eyebrow">{tr('m024')}</p>
            <h2>
              {tr('m025')}<br />
              <span>{tr('m026')}</span>
            </h2>
          </div>
          <p>
            {tr('m027')}</p>
        </div>
        <Agents sharedCore />
        <Link href="/solutions" className="text-link section-link">
          {tr('m028')}</Link>
      </section>
      <section className="labs-teaser" data-scene="4">
        <div className="wrap labs-layout">
          <div>
            <p className="eyebrow">
              <span className="status-dot" /> LUXIA LABS
            </p>
            <h2>
              {tr('m029')}<br />
              {tr('m030')}<br />
              <span>{tr('m031')}</span>
            </h2>
            <p>
              {tr('m032')}</p>
            <Link href="/labs" className="text-link">
              {tr('m033')}</Link>
          </div>
          <Link href="/labs#alma" className="alma"><div className="labs-core-slot" data-core-slot="4"/>
            <span className="micro">{tr('m034')}</span>
            <strong>ALMA</strong>
            <span>
              {tr('m035')}<b>↗</b>
            </span>
          </Link>
        </div>
      </section>
      <Engineering />
      <section className="section wrap industries-home">
        <p className="eyebrow">{tr('m036')}</p>
        <div className="section-heading">
          <h2>
            {tr('m037')}<br />
            <span>{tr('m038')}</span>
          </h2>
          <Link href="/industries" className="text-link">
            {tr('m039')}</Link>
        </div>
        <div className="industry-list">
          {[
            tr('m040'),
            tr('m041'),
            tr('m042'),
            tr('m043'),
            tr('m044'),
            tr('m045'),
            tr('m046'),
          ].map((s, i) => (
            <Link key={s} href={'/industries#sector-' + i}>
              <span>0{i + 1}</span>
              {s}
              <b>↗</b>
            </Link>
          ))}
        </div>
      </section>
      <section className="continents section" data-scene="5">
        <div className="wrap">
          <p className="eyebrow">{tr('m047')}</p>
          <h2>
            {tr('m048')}<br />
            <span>{tr('m049')}</span>
          </h2>
          <div className="continent-line">
            <div>
              <span>{tr('m050')}</span>
              <strong>{tr('m051')}</strong>
              <small>
                {tr('m052')}<br />
                {tr('m053')}</small>
            </div>
            <div className="bridge" aria-hidden="true">
              <span>{tr('m012')}</span>
            </div>
            <div>
              <span>{tr('m054')}</span>
              <strong>{tr('m055')}</strong>
              <small>
                {tr('m056')}<br />
                {tr('m057')}</small>
            </div>
          </div>
          <div className="international-disciplines"><span>CLOUD</span><span>IDENTITY</span><span>DATA</span><span>COLLABORATION</span></div>
          <div className="continent-copy">
            <p>
              {tr('m058')}</p>
            <Link href="/company#international" className="text-link">
              {tr('m059')}</Link>
          </div>
        </div>
      </section>
      <section className="section wrap">
        <div className="section-heading">
          <div>
            <p className="eyebrow">{tr('m060')}</p>
            <h2>
              {tr('m061')}<br />
              {tr('m062')}<br />
              <span>{tr('m063')}</span>
            </h2>
          </div>
          <p>
            {tr('m064')}</p>
        </div>
        <p className="eyebrow framework-label">
          {tr('m065')}</p>
        <Framework />
      </section>
      <section className="section wrap">
        <div className="section-heading">
          <div>
            <p className="eyebrow">{tr('m066')}</p>
            <h2>{tr('m067')}</h2>
          </div>
          <Link href="/case-studies" className="text-link">
            {tr('m068')}</Link>
        </div>
        <CaseArchitecture variant="knowledge" compact/>
        <div className="project-grid">
          <Link href="/case-studies/knowledge-assistant" className="project">
            <div
              className="project-graphic knowledge-diagram"
              aria-hidden="true"
            >
              <span>{tr('m069')}</span>
              <i>→</i>
              <b>
                {tr('m070')}<br />
                {tr('m071')}</b>
              <i>→</i>
              <span>{tr('m072')}</span>
            </div>
            <p className="eyebrow">{tr('m073')}</p>
            <h3>
              {tr('m074')}<br />
              {tr('m075')}<span>↗</span>
            </h3>
            <p>
              {tr('m076')}</p>
          </Link>
          <Link href="/case-studies/secure-cloud" className="project">
            <div
              className="project-graphic security-diagram"
              aria-hidden="true"
            >
              <span>{tr('m077')}</span>
              <span>{tr('m078')}</span>
              <span>{tr('m079')}</span>
            </div>
            <p className="eyebrow">{tr('m080')}</p>
            <h3>
              {tr('m081')}<br />
              {tr('m082')}<span>↗</span>
            </h3>
            <p>
              {tr('m083')}</p>
          </Link>
        </div>
      </section>
      <section className="section wrap">
        <div className="section-heading">
          <div>
            <p className="eyebrow">LUXIA INSIGHTS</p>
            <h2>
              {tr('m084')}<br />
              <span>{tr('m085')}</span>
            </h2>
          </div>
          <Link href="/insights" className="text-link">
            {tr('m086')}</Link>
        </div>
        <div className="insight-rows">
          {[
            [
              'INTELLIGENCE',
              tr('m087'),
              'agents-processus',
            ],
            [
              'TRUST',
              tr('m088'),
              'identite-securite',
            ],
            [
              'SCALE',
              tr('m089'),
              'cloud-pilotage',
            ],
          ].map(([tag, title, slug], i) => (
            <Link key={slug} href={'/insights/' + slug}>
              <span className="micro">
                0{i + 1} / {tag}
              </span>
              <h3>{title}</h3>
              <span>↗</span>
            </Link>
          ))}
        </div>
      </section>
      <section className="closing wrap">
        <p className="eyebrow">{tr('m090')}</p>
        <h2>
          {tr('m091')}<br />
          <em>{tr('m092')}</em>
        </h2>
        <Link href="/contact" className="button primary">
          {tr('m093')}<span>↗</span>
        </Link>
        <span className="closing-note">
          {tr('m094')}<br />
          {tr('m095')}</span>
      </section>
    </main>
  );
}
