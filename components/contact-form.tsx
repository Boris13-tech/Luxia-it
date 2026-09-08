'use client';
import {useI18n} from '@/components/i18n-provider';
import { useCallback, useEffect, useRef, useState } from 'react';
import Link from '@/components/locale-link';
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
export default function ContactForm() {
const {t:tr} = useI18n();
const categories = [
  tr('m324'),
  tr('m325'),
  tr('cloud'),
  tr('automation'),
  tr('m326'),
  tr('m327'),
];
const sizes = [
  tr('size1'),
  tr('size2'),
  tr('size3'),
  tr('size4'),
  tr('m328'),
];

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
  const messageField = useRef<HTMLTextAreaElement>(null);
  const stage = useCallback((category: string, message: string) => {
    messageField.current?.setCustomValidity('');
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
  const body = `${tr('greeting')}\n\n${tr('projectLabel')}: ${category}\n${tr('nameLabel')}: ${data.name}\n${tr('m342')}: ${data.company}\n${tr('emailLabel')}: ${data.email}\n${tr('m344')}: ${data.country}\n${tr('sizeLabel')}: ${size}\n\n${data.message}\n\n${tr('regards')}\n${data.name}`;
  const validate = (e: React.SyntheticEvent<HTMLInputElement|HTMLTextAreaElement>) => { const el=e.currentTarget; el.setCustomValidity(''); if(el.validity.valueMissing)el.setCustomValidity(tr('required')); else if(el.validity.typeMismatch)el.setCustomValidity(tr('invalidEmail')); else if(el.id==='message' && el.value.trim().length<20)el.setCustomValidity(tr('messageShort')); };
  const update = (key: keyof typeof data, value: string) =>
    setData((d) => ({ ...d, [key]: value }));
  return (
    <div className="contact-flow">
      <div className="stepper" aria-label={tr('m329') + ' ' + step + ' ' + tr('stepOf')}>
        {[tr('m330'), tr('m331'), tr('m332')].map((t, i) => (
          <span key={t} aria-current={step === i + 1 ? 'step' : undefined}>
            <b>0{i + 1}</b>
            {t}
          </span>
        ))}
      </div>
      <h2 ref={heading} tabIndex={-1}>
        {step === 1
          ? tr('m333')
          : step === 2
            ? tr('m334')
            : tr('m335')}
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
            aria-label={tr('m336')}
            className="category-options"
          >
            {categories.map((c, i) => (
              <div key={c} className="category-choice">
                <RadioGroupItem value={c} id={'category-' + i} aria-labelledby={'category-label-' + i} />
                <label id={'category-label-' + i} htmlFor={'category-' + i}>{c}</label>
                <b aria-hidden="true">↗</b>
              </div>
            ))}
          </RadioGroup>
          <label className="field-label" htmlFor="message">
            {tr('m337')}<span>*</span>
          </label>
          <textarea
            ref={messageField}
            onInvalid={validate}
            onInput={validate}
            id="message"
            required
            minLength={20}
            maxLength={3000}
            value={data.message}
            onChange={(e) => update('message', e.target.value)}
            placeholder={tr('m338')}
            rows={5}
          />
          <small>
            {tr('m339')}</small>
          <button className="button primary" type="submit">
            {tr('m340')}<span>→</span>
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
              ['name', tr('m341'), 'name'],
              ['company', tr('m342'), 'organization'],
              ['email', tr('m343'), 'email'],
              ['country', tr('m344'), 'country-name'],
            ].map(([key, title, autocomplete]) => (
              <div key={key}>
                <label className="field-label" htmlFor={key}>
                  {title} <span>*</span>
                </label>
                <input
                  onInvalid={validate}
                  onInput={validate}
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
                {tr('m345')}</label>
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
            {tr('m346')}{' '}
            <Link href="/privacy">{tr('m347')}</Link>
          </p>
          <div className="actions">
            <button type="button" className="button" onClick={() => setStep(1)}>
              {tr('m348')}</button>
            <button className="button primary" type="submit">
              {tr('m349')}<span>→</span>
            </button>
          </div>
        </form>
      ) : (
        <div className="contact-review">
          <p>
            {tr('m350')}<a href={'mailto:' + site.email}>{site.email}</a>.
          </p>
          <pre>{body}</pre>
          <div className="actions">
            <a
              className="button primary"
              href={
                'mailto:' +
                site.email +
                '?subject=' +
                encodeURIComponent(tr('m351') + ' ' + category) +
                '&body=' +
                encodeURIComponent(body)
              }
            >
              {tr('m352')}<span>↗</span>
            </a>
            <button
              className="button"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(body);
                  setFeedback(
                    tr('m353'),
                  );
                } catch {
                  setFeedback(
                    tr('m354'),
                  );
                }
              }}
            >
              {tr('m355')}</button>
          </div>
          <p className="privacy-note">
            {tr('m356')}</p>
          <output aria-live="polite">{feedback}</output>
          <button className="text-link" onClick={() => setStep(2)}>
            {tr('m357')}</button>
        </div>
      )}
    </div>
  );
}
