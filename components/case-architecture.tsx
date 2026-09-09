'use client';
import {useState} from 'react';
import {useI18n} from './i18n-provider';
import type {MessageKey} from '@/lib/i18n';
const stages=['stageProblem','stageArchitecture','stageIdentity','stageData','stageIntelligence','stageOutcome'] as const;
export default function CaseArchitecture({variant='knowledge',compact=false}:{variant?:'knowledge'|'cloud';compact?:boolean}){
 const {t}=useI18n(),[step,setStep]=useState(0),id='case-'+variant+(compact?'-overview':'-detail');
 const flow=variant==='knowledge'?['refRequest','refAccess','refSources','refAnswer']:['refDeploy','refRoles','refEnvironments','refObserve'];
 return <section className={'case-explorer reference-case'+(compact?' compact':'')} aria-label={t('caseExplore')}>
  <div className="case-explorer-heading"><p className="eyebrow">{t(variant==='knowledge'?'caseConcept':'caseCloudLabel')}</p><span className="micro">0{step+1} / 06</span></div>
  <div className="case-explorer-layout">
   <div className="reference-workflow">
    <p className="reference-context">{t(variant==='knowledge'?'refContext':'refCloudContext')}</p>
    <blockquote>{t(variant==='knowledge'?'refQuestion':'refCloudQuestion')}</blockquote>
    <ol className="reference-flow">{flow.map((label,i)=><li key={label} className={i<=Math.floor((step+1)/2)?'is-active':''}><span>0{i+1}</span><strong>{t(label as MessageKey)}</strong></li>)}</ol>
    <p className="reference-condition">{t(step===2?'refAccessRule':step===5?'refMeasure':'refPrinciple')}</p>
   </div>
   <div className="case-explorer-copy"><h3>{t(stages[step])}</h3><p id={id+'panel'} aria-live="polite">{t((variant+step) as MessageKey)}</p></div>
  </div>
  <div className="architecture-controls" aria-label={t('caseExplore')}>{stages.map((label,i)=><button key={label} type="button" aria-pressed={i===step} aria-controls={id+'panel'} onClick={()=>setStep(i)}><span>0{i+1}</span>{t(label)}</button>)}</div>
  <p className="reference-note">{t('refNote')}</p>
 </section>;
}
