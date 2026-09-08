'use client';
import {useI18n} from './i18n-provider';
export default function Engineering(){const {t}=useI18n();return <section className="engineering section wrap">
 <div className="engineering-intro"><p className="eyebrow">{t('engineeringLabel')}</p><h2>{t('engineeringTitle')}</h2><p>{t('engineeringText')}</p></div>
 <div className="engineering-matrix">{[
 [t('engineeringIdentity'),'Microsoft Entra','Microsoft Security'],
 [t('engineeringCloud'),'Microsoft Azure','Microsoft 365'],
 [t('engineeringDelivery'),'GitHub',t('engineeringIaC')],
 [t('engineeringIntelligence'),t('engineeringAI')]
 ].map(([label,...items],i)=><div key={label}><span className="micro">0{i+1} / {label}</span>{items.map(item=><strong key={item}>{item}</strong>)}</div>)}</div>
 <p className="fine-print">{t('engineeringNote')}</p>
 </section>;}
