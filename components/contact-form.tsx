'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { site } from '@/lib/content';
import { useContactTools } from './contact-tools';
const categories = [
  'Intelligence artificielle',
  'Cybersécurité',
  'Cloud',
  'Automatisation',
  'Partenariat',
  'Autre',
];
const sizes = [
  '1–10 personnes',
  '11–50 personnes',
  '51–250 personnes',
  '251–1 000 personnes',
  'Plus de 1 000 personnes',
];
export default function ContactForm() {
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState(categories[0]);
  const [size, setSize] = useState(sizes[0]);
  const [data, setData] = useState({
    name: '',
    company: '',
    email: '',
    country: '',
    message: '',
  });
  const [feedback, setFeedback] = useState('');
  const stage = useCallback((category: string, message: string) => {
    setCategory(category);
    setData((d) => ({ ...d, message }));
    setStep(1);
  }, []);
  useContactTools(stage);
  const heading = useRef<HTMLHeadingElement>(null);
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    heading.current?.focus();
  }, [step]);
  const body = `Bonjour Luxia-IT,\n\nProjet : ${category}\nNom : ${data.name}\nEntreprise : ${data.company}\nEmail : ${data.email}\nPays : ${data.country}\nEffectif : ${size}\n\n${data.message}\n\nCordialement,\n${data.name}`;
  const update = (key: keyof typeof data, value: string) =>
    setData((d) => ({ ...d, [key]: value }));
  return (
    <div className="contact-flow">
      <div className="stepper" aria-label={'Étape ' + step + ' sur 3'}>
        {['Votre projet', 'Votre organisation', 'Votre message'].map((t, i) => (
          <span key={t} aria-current={step === i + 1 ? 'step' : undefined}>
            <b>0{i + 1}</b>
            {t}
          </span>
        ))}
      </div>
      <h2 ref={heading} tabIndex={-1}>
        {step === 1
          ? 'Quel sujet vous amène ?'
          : step === 2
            ? 'Faisons connaissance.'
            : 'Votre message est prêt.'}
      </h2>
      {step === 1 ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setStep(2);
          }}
        >
          <RadioGroup
            value={category}
            onValueChange={(v) => setCategory(String(v))}
            aria-label="Catégorie du projet"
            className="category-options"
          >
            {categories.map((c, i) => (
              <label key={c}>
                <RadioGroupItem value={c} id={'category-' + i} aria-label={c} />
                <span>{c}</span>
                <b>↗</b>
              </label>
            ))}
          </RadioGroup>
          <label className="field-label" htmlFor="message">
            Parlez-nous de votre projet <span>*</span>
          </label>
          <textarea
            id="message"
            required
            minLength={20}
            maxLength={3000}
            value={data.message}
            onChange={(e) => update('message', e.target.value)}
            placeholder="Vos objectifs, votre contexte et les difficultés à résoudre…"
            rows={5}
          />
          <small>
            20 caractères minimum. Ne communiquez pas de données sensibles.
          </small>
          <button className="button primary" type="submit">
            Continuer <span>→</span>
          </button>
        </form>
      ) : step === 2 ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setStep(3);
          }}
        >
          <div className="form-grid">
            {[
              ['name', 'Nom complet', 'name'],
              ['company', 'Entreprise', 'organization'],
              ['email', 'Email professionnel', 'email'],
              ['country', 'Pays', 'country-name'],
            ].map(([key, title, autocomplete]) => (
              <div key={key}>
                <label className="field-label" htmlFor={key}>
                  {title} <span>*</span>
                </label>
                <input
                  id={key}
                  type={key === 'email' ? 'email' : 'text'}
                  required
                  maxLength={160}
                  autoComplete={autocomplete}
                  value={data[key as keyof typeof data]}
                  onChange={(e) =>
                    update(key as keyof typeof data, e.target.value)
                  }
                />
              </div>
            ))}
            <div className="full">
              <label
                className="field-label"
                id="size-label"
                htmlFor="company-size"
              >
                Taille de l’entreprise
              </label>
              <Select
                value={size}
                onValueChange={(v) => setSize(String(v))}
                items={sizes.map((s) => ({ label: s, value: s }))}
              >
                <SelectTrigger
                  id="company-size"
                  aria-labelledby="size-label"
                  className="size-select"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sizes.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <p className="privacy-note">
            Ces informations servent uniquement à préparer votre message. Elles
            ne sont pas enregistrées par ce formulaire.{' '}
            <Link href="/privacy">Confidentialité ↗</Link>
          </p>
          <div className="actions">
            <button type="button" className="button" onClick={() => setStep(1)}>
              ← Retour
            </button>
            <button className="button primary" type="submit">
              Préparer le message <span>→</span>
            </button>
          </div>
        </form>
      ) : (
        <div className="contact-review">
          <p>
            Vérifiez votre demande, puis ouvrez votre messagerie pour l’envoyer
            à <a href={'mailto:' + site.email}>{site.email}</a>.
          </p>
          <pre>{body}</pre>
          <div className="actions">
            <a
              className="button primary"
              href={
                'mailto:' +
                site.email +
                '?subject=' +
                encodeURIComponent('Projet Luxia-IT — ' + category) +
                '&body=' +
                encodeURIComponent(body)
              }
            >
              Ouvrir ma messagerie <span>↗</span>
            </a>
            <button
              className="button"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(body);
                  setFeedback(
                    'Message copié. Vous pouvez le coller dans votre messagerie.',
                  );
                } catch {
                  setFeedback(
                    'Copie indisponible. Sélectionnez le texte ci-dessus pour le copier.',
                  );
                }
              }}
            >
              Copier le message
            </button>
          </div>
          <p className="privacy-note">
            Aucun message n’a été envoyé automatiquement. Vous confirmez l’envoi
            dans votre application de messagerie.
          </p>
          <output aria-live="polite">{feedback}</output>
          <button className="text-link" onClick={() => setStep(2)}>
            ← Modifier mes informations
          </button>
        </div>
      )}
    </div>
  );
}
