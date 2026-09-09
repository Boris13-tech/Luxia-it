'use client';
import {useEffect,useRef,useState} from 'react';
import Nucleus from './nucleus';
import Framework from './framework';
import Link from './locale-link';
import {useI18n} from './i18n-provider';
import {getContent} from '@/lib/content';
const names=['INTELLIGENCE','TRUST','SCALE','AUTOMATION'];
const descriptions=['exAI','exTrust','exScale','exAuto'] as const;
export default function ExpertiseExperience(){
 const {t,locale}=useI18n(),{services}=getContent(locale);
 const [mode,setMode]=useState(0),[method,setMethod]=useState(-1),[policy,setPolicy]=useState<'allow'|'deny'|'privilege'>('allow');
 const [awake,setAwake]=useState(true);
 const [visible,setVisible]=useState(true),ref=useRef<HTMLDivElement>(null);
 useEffect(()=>{const observer=new IntersectionObserver(([entry])=>setVisible(entry.isIntersecting),{threshold:0});if(ref.current)observer.observe(ref.current);return()=>observer.disconnect();},[]);
 useEffect(()=>{let timer:ReturnType<typeof setTimeout>;const wake=()=>{setAwake(true);clearTimeout(timer);timer=setTimeout(()=>setAwake(false),45000);};wake();window.addEventListener("pointermove",wake,{passive:true});window.addEventListener("scroll",wake,{passive:true});window.addEventListener("keydown",wake);window.addEventListener("pointerdown",wake,{passive:true});return()=>{clearTimeout(timer);window.removeEventListener("pointermove",wake);window.removeEventListener("scroll",wake);window.removeEventListener("keydown",wake);window.removeEventListener("pointerdown",wake);};},[]);
 const select=(i:number)=>{setMode(i);setMethod(-1);};
 return <div className="expertise-experience" ref={ref}>
 <div className="expertise-universe" aria-hidden="true"><Nucleus mode={mode} method={method} policy={policy} experience active={visible&&awake}/></div>
 <section className="expertise-command wrap">
 <p className="eyebrow">LUXIA CORE / {t('exExplore')}</p><h1>{t('exTitle')}</h1>
 <div className="core-selector" aria-label={t('exExplore')}>{names.map((name,i)=><button type="button" key={name} aria-pressed={mode===i&&method<0} onPointerEnter={e=>{if(e.pointerType==='mouse')select(i)}} onFocus={()=>select(i)} onClick={()=>select(i)}><span>0{i+1}</span>{name}<b>↗</b></button>)}</div>
 <p className="core-instruction">{t('exControl')}</p><div className="core-mode-copy" aria-live="polite"><p>{t(descriptions[mode])}</p></div>
 </section>
 <section className="expertise-inspect wrap">
 <div className="expertise-capability"><p className="eyebrow">{names[mode]}</p><h2>{services[mode].title}</h2><p>{services[mode].outcome}</p><Link className="text-link" href={'/expertise/'+services[mode].slug}>{services[mode].title} ↗</Link></div>
 <div className="core-security-controls"><button className="text-link security-mode-trigger" type="button" onClick={()=>select(1)}>ZERO TRUST <span>↗</span></button>
 {mode===1&&<><div className="policy-controls" aria-label="Zero Trust">{(['allow','deny','privilege'] as const).map((p,i)=><button type="button" key={p} aria-pressed={policy===p} onClick={()=>setPolicy(p)}>{t((['exAllow','exDeny','exPrivilege'] as const)[i])}</button>)}</div><p className="fine-print">{t('exConcept')}</p></>}
 <details className="technical-reveal" onToggle={e=>{if(e.currentTarget.open)select(1)}}><summary>{t('exDiagram')}<span>+</span></summary><div className="trust-architecture">
 {(['Identity','Pim','Workload','Vault','Telemetry'] as const).map((part,i)=><article key={part} className={'trust-'+part.toLowerCase()}><span className="micro">0{i+1}</span><h3>{t(`ex${part}`)}</h3><p>{t(`ex${part}Text`)}</p></article>)}
 <p className="trust-references">{t('exSources')}: <a href="https://learn.microsoft.com/en-us/entra/identity/conditional-access/overview">Conditional Access ↗</a> · <a href="https://learn.microsoft.com/en-us/entra/id-governance/privileged-identity-management/pim-configure">PIM ↗</a> · <a href="https://learn.microsoft.com/en-us/azure/key-vault/general/authentication">Key Vault ↗</a></p>
 </div></details></div></section>
 <section className="expertise-method wrap"><p className="eyebrow">LUXIA TRANSFORMATION FRAMEWORK</p><h2>{t('exMethod')}</h2><Framework onStageChange={stage=>{setMethod(stage);setPolicy("allow");setMode([0,0,3,1,2][stage]);}}/></section>
 </div>;
}


