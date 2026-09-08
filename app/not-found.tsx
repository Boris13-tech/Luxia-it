import Link from 'next/link';
export default function NotFound() {
  return (
    <main id="main" className="inner-page">
      <section className="page-hero wrap">
        <p className="eyebrow">404 / PAGE INTROUVABLE</p>
        <h1>
          Reprenons
          <br />
          le bon chemin.
        </h1>
        <p className="page-intro">
          Cette page n’existe pas ou son adresse a changé.
        </p>
        <Link href="/" className="button primary">
          Retour à l’accueil ↗
        </Link>
      </section>
    </main>
  );
}
