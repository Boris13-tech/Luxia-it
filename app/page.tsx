import Link from 'next/link';
import Nucleus from '@/components/nucleus';
import PillarStory from '@/components/pillar-story';
import Framework from '@/components/framework';
import Agents from '@/components/agents';
export const metadata = { alternates: { canonical: '/' } };
export default function Home() {
  return (
    <main id="main">
      <section className="hero">
        <div className="hero-art">
          <Nucleus />
          <div className="orbit-label label-one">
            <i /> INTELLIGENCE
          </div>
          <div className="orbit-label label-two">
            <i /> TRUST
          </div>
          <div className="orbit-label label-three">
            <i /> SCALE
          </div>
          <span className="art-coordinate">LUXIA CORE — SYSTEM 01</span>
        </div>
        <div className="hero-content wrap">
          <p className="eyebrow">
            <span className="status-dot" /> HUMAN AMBITION. INTELLIGENT SYSTEMS.
          </p>
          <h1>
            Construisez
            <br />
            l’entreprise
            <br />
            <em>intelligente.</em>
          </h1>
          <p className="hero-description">
            L’intelligence pour avancer.
            <br />
            La confiance pour durer. L’infrastructure pour grandir.
          </p>
          <div className="actions">
            <Link href="/contact" className="button primary">
              Démarrer une transformation <span>↗</span>
            </Link>
            <Link href="/company" className="text-link">
              Découvrir Luxia-IT <span>↗</span>
            </Link>
          </div>
        </div>
        <div className="hero-bottom wrap">
          <span>01 / UNE NOUVELLE DIMENSION</span>
          <span>
            AFRIQUE <b>×</b> EUROPE
          </span>
          <a href="#vision">
            EXPLORER <span>↓</span>
          </a>
        </div>
      </section>
      <section className="pillar-strip wrap">
        {[
          [
            '01',
            'INTELLIGENCE',
            'IA & automatisation',
            'artificial-intelligence',
          ],
          ['02', 'TRUST', 'Cybersécurité & identité', 'cybersecurity'],
          ['03', 'SCALE', 'Cloud & infrastructure', 'cloud'],
        ].map(([n, t, s, p]) => (
          <Link key={n} href={'/expertise/' + p}>
            <span>{n}</span>
            {t}
            <small>{s}</small>
            <b>↗</b>
          </Link>
        ))}
      </section>
      <section className="section wrap vision" id="vision">
        <p className="eyebrow">LA NOUVELLE ÉQUATION</p>
        <h2>
          Votre technologie ne doit plus
          <br />
          simplement fonctionner.
          <br />
          <span>Elle doit vous faire avancer.</span>
        </h2>
        <div className="vision-bottom">
          <span className="micro">INTELLIGENCE + TRUST + SCALE</span>
          <p>
            IA, cybersécurité et cloud forment désormais un même socle. Luxia-IT
            relie ces disciplines pour concevoir des systèmes utiles, maîtrisés
            et capables d’évoluer avec votre organisation.
          </p>
        </div>
      </section>
      <PillarStory />
      <section className="section wrap">
        <div className="section-heading">
          <div>
            <p className="eyebrow">LA PROCHAINE DIMENSION DU TRAVAIL</p>
            <h2>
              Vos équipes.
              <br />
              <span>De nouvelles capacités.</span>
            </h2>
          </div>
          <p>
            Des agents spécialisés, reliés à vos processus et placés sous votre
            contrôle. Explorez les concepts de notre future force de travail
            numérique.
          </p>
        </div>
        <Agents />
        <Link href="/solutions" className="text-link section-link">
          Explorer les solutions ↗
        </Link>
      </section>
      <section className="labs-teaser">
        <div className="wrap labs-layout">
          <div>
            <p className="eyebrow">
              <span className="status-dot" /> LUXIA LABS
            </p>
            <h2>
              Ne pas seulement
              <br />
              suivre la suite.
              <br />
              <span>La concevoir.</span>
            </h2>
            <p>
              Notre espace de recherche et de développement. Agents IA,
              automatisation, sécurité de l’IA et architectures cloud.
            </p>
            <Link href="/labs" className="text-link">
              Entrer dans Luxia Labs ↗
            </Link>
          </div>
          <Link href="/labs#alma" className="alma">
            <span className="micro">EN DÉVELOPPEMENT</span>
            <strong>ALMA</strong>
            <span>
              Coming from Luxia Labs. <b>↗</b>
            </span>
          </Link>
        </div>
      </section>
      <section className="section wrap industries-home">
        <p className="eyebrow">LA TECHNOLOGIE PREND LE SENS DE VOTRE MÉTIER</p>
        <div className="section-heading">
          <h2>
            Des enjeux différents.
            <br />
            <span>La même exigence.</span>
          </h2>
          <Link href="/industries" className="text-link">
            Nos secteurs d’intervention ↗
          </Link>
        </div>
        <div className="industry-list">
          {[
            'PME & ETI',
            'Services financiers',
            'Services professionnels',
            'Éducation',
            'Commerce',
            'Secteur public',
            'Startups',
          ].map((s, i) => (
            <Link key={s} href={'/industries#sector-' + i}>
              <span>0{i + 1}</span>
              {s}
              <b>↗</b>
            </Link>
          ))}
        </div>
      </section>
      <section className="continents section">
        <div className="wrap">
          <p className="eyebrow">ANCRAGE LOCAL. AMBITION INTERNATIONALE.</p>
          <h2>
            Une vision technologique.
            <br />
            <span>Deux continents.</span>
          </h2>
          <div className="continent-line">
            <div>
              <span>01 / AFRIQUE</span>
              <strong>Africa</strong>
              <small>
                Compréhension des marchés.
                <br />
                Pertinence des usages.
              </small>
            </div>
            <div className="bridge" aria-hidden="true">
              <span>×</span>
            </div>
            <div>
              <span>02 / EUROPE</span>
              <strong>Europe</strong>
              <small>
                Culture technologique.
                <br />
                Exigence d’architecture.
              </small>
            </div>
          </div>
          <div className="continent-copy">
            <p>
              Relier les écosystèmes, sans réduire l’ambition à une géographie.
              Notre trajectoire s’appuie sur le Cameroun, l’Afrique francophone,
              la Roumanie et l’Europe.
            </p>
            <Link href="/company#international" className="text-link">
              Notre vision internationale ↗
            </Link>
          </div>
        </div>
      </section>
      <section className="section wrap">
        <div className="section-heading">
          <div>
            <p className="eyebrow">POURQUOI LUXIA-IT</p>
            <h2>
              Acheter la technologie
              <br />
              est une étape.
              <br />
              <span>La faire réussir, notre métier.</span>
            </h2>
          </div>
          <p>
            De la stratégie à l’amélioration continue, nous relions les
            décisions, l’architecture et l’exécution. Votre transformation garde
            un cap et des critères de réussite explicites.
          </p>
        </div>
        <p className="eyebrow framework-label">
          LUXIA TRANSFORMATION FRAMEWORK
        </p>
        <Framework />
      </section>
      <section className="section wrap">
        <div className="section-heading">
          <div>
            <p className="eyebrow">DE L’ARCHITECTURE À L’USAGE</p>
            <h2>La preuve par le projet.</h2>
          </div>
          <Link href="/case-studies" className="text-link">
            Explorer les démonstrations ↗
          </Link>
        </div>
        <div className="project-grid">
          <Link href="/case-studies/knowledge-assistant" className="project">
            <div
              className="project-graphic knowledge-diagram"
              aria-hidden="true"
            >
              <span>DOCUMENTS</span>
              <i>→</i>
              <b>
                KNOWLEDGE
                <br />
                LAYER
              </b>
              <i>→</i>
              <span>ÉQUIPES</span>
            </div>
            <p className="eyebrow">CONCEPT PROJECT / INTELLIGENCE</p>
            <h3>
              La connaissance d’entreprise,
              <br />
              rendue accessible. <span>↗</span>
            </h3>
            <p>
              Une architecture de référence pour un assistant documentaire avec
              contrôle des accès.
            </p>
          </Link>
          <Link href="/case-studies/secure-cloud" className="project">
            <div
              className="project-graphic security-diagram"
              aria-hidden="true"
            >
              <span>IDENTITÉ</span>
              <span>POLITIQUES</span>
              <span>RESSOURCES</span>
            </div>
            <p className="eyebrow">CONCEPT PROJECT / TRUST × SCALE</p>
            <h3>
              Un socle cloud.
              <br />
              La sécurité dès le départ. <span>↗</span>
            </h3>
            <p>
              Une architecture de référence Azure pour organiser les identités,
              les accès et l’observabilité.
            </p>
          </Link>
        </div>
      </section>
      <section className="section wrap">
        <div className="section-heading">
          <div>
            <p className="eyebrow">LUXIA INSIGHTS</p>
            <h2>
              Comprendre.
              <br />
              <span>Puis décider.</span>
            </h2>
          </div>
          <Link href="/insights" className="text-link">
            Toutes les perspectives ↗
          </Link>
        </div>
        <div className="insight-rows">
          {[
            [
              'INTELLIGENCE',
              'Agents IA : commencer par le processus, pas par le modèle.',
              'agents-processus',
            ],
            [
              'TRUST',
              'L’identité, premier périmètre de votre sécurité.',
              'identite-securite',
            ],
            [
              'SCALE',
              'Le cloud se pilote autant qu’il se construit.',
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
        <p className="eyebrow">VOTRE PROCHAINE ÉTAPE</p>
        <h2>
          Construisons
          <br />
          <em>la suite.</em>
        </h2>
        <Link href="/contact" className="button primary">
          Parler à un expert <span>↗</span>
        </Link>
        <span className="closing-note">
          L’AMBITION EST HUMAINE.
          <br />
          LA TECHNOLOGIE LA REND POSSIBLE.
        </span>
      </section>
    </main>
  );
}
