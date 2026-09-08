'use client';
import {useState} from 'react';
import {useI18n} from './i18n-provider';
import type {MessageKey} from '@/lib/i18n';
const stages=['stageProblem','stageArchitecture','stageIdentity','stageData','stageIntelligence','stageOutcome'] as const;
export default function CaseArchitecture({variant='knowledge',compact=false}:{variant?:'knowledge'|'cloud';compact?:boolean}){
 const {t}=useI18n(),[step,setStep]=useState(0),id="case-"+variant+(compact?"-overview":"-detail");
 return <section className={'case-explorer'+(compact?' compact':'')} aria-label={t('caseExplore')}>
 <div className="case-explorer-heading"><p className="eyebrow">{t('caseConcept')}</p><span className="micro">0{step+1} / 06</span></div>
 <div className="case-explorer-layout"><div className="architecture-drawing" aria-hidden="true">
 <svg viewBox="0 0 640 360"><defs><linearGradient id={id+'g'} x2="1" y2="1"><stop stopColor="#8bdff3"/><stop offset="1" stopColor="#095493"/></linearGradient></defs>
 {[0,1,2,3,4,5].map((n)=><g key={n} className={n<=step?'architecture-layer is-lit':'architecture-layer'} style={{opacity:n<=step?1:.18}}>
 <path d={`M ${100+n*64} ${50+n*9} v ${190-n*10} l 95 55 v -25 l -68 -40 v ${-160+n*10} z`} fill="#102733" stroke={'url(#'+id+'g)'} strokeWidth="1"/>
 <path className={n===step?'architecture-signal':''} d={`M ${114+n*64} ${80+n*9} v ${141-n*10} l 78 45`} fill="none" stroke={n<=step?'#a2e8f8':'#376070'} strokeWidth={n===step?3:1}/>
 </g>)}
 <path d="M 114 130 L 178 139 L 242 148 L 306 157 L 370 166 L 434 175" stroke="#62bad5" fill="none" strokeDasharray="3 6"/>
 {step>=2&&<path d="M 229 138 v 21 m 25 -21 v21" stroke="#d1faff" strokeWidth="4"/>}
 </svg></div>
 <div className="case-explorer-copy"><h3>{t(stages[step])}</h3><p id={id+'panel'} aria-live="polite">{t((variant+step) as MessageKey)}</p></div></div>
 <div className="architecture-controls" aria-label={t('caseExplore')}>{stages.map((label,i)=><button key={label} type="button" aria-pressed={i===step} aria-controls={id+'panel'} onClick={()=>setStep(i)}><span>0{i+1}</span>{t(label)}</button>)}</div>
 </section>;
}

