'use client';

import Image from 'next/image';
import {useEffect,useRef,useState} from 'react';
import type {Locale} from '@/lib/i18n';

const slides=['trust','cloud','automation'];
const labels={fr:{pause:'Mettre le diaporama en pause',play:'Reprendre le diaporama',next:'Image suivante',group:'Images de nos environnements technologiques'},en:{pause:'Pause slideshow',play:'Resume slideshow',next:'Next image',group:'Our technology environments'},zh:{pause:'暂停幻灯片',play:'继续幻灯片',next:'下一张图片',group:'我们的技术环境'}};

export default function HeroSlideshow({locale}:{locale:Locale}) {
 const [active,setActive]=useState(0);
 const [paused,setPaused]=useState(false);
 const [available,setAvailable]=useState(false);
 const [visible,setVisible]=useState(true);
 const [reduced,setReduced]=useState(true);
 const root=useRef<HTMLDivElement>(null);
 const c=labels[locale];
 useEffect(()=>{
  const media=matchMedia('(prefers-reduced-motion: reduce)');
  const update=()=>setReduced(media.matches); update(); media.addEventListener('change',update);
  let live=true;
  // Decode the next frames before allowing any crossfade.
  void Promise.all(slides.slice(1).map(name=>new Promise<void>(resolve=>{
   const img=new window.Image(); img.src=`/visuals/${name}.webp`; img.decode().then(resolve).catch(()=>{});
  }))).then(()=>{if(live)setAvailable(true);});
  const observer=new IntersectionObserver(([entry])=>setVisible(entry.isIntersecting),{threshold:.1});
  if(root.current)observer.observe(root.current);
  const visibility=()=>setVisible(!document.hidden && !!root.current && root.current.getBoundingClientRect().bottom>0);
  document.addEventListener('visibilitychange',visibility);
  return()=>{live=false;observer.disconnect();media.removeEventListener('change',update);document.removeEventListener('visibilitychange',visibility);};
 },[]);
 useEffect(()=>{
  if(paused||reduced||!visible||!available)return;
  const timer=setTimeout(()=>setActive(n=>(n+1)%slides.length),6500);
  return()=>clearTimeout(timer);
 },[active,paused,reduced,visible,available]);
 return <><div ref={root} className="v2-hero-image hero-slideshow" aria-hidden="true">
  {slides.map((name,index)=><div key={name} className={`hero-slide${active===index?' is-active':''}`}><Image src={`/visuals/${name}.webp`} alt="" fill priority={index===0} sizes="100vw"/></div>)}
 </div><fieldset className="hero-slideshow-controls" aria-label={c.group}>
  <span className="hero-frame-number">0{active+1}<span> / 03</span></span>
  <button type="button" onClick={()=>setPaused(v=>!v)} aria-label={paused?c.play:c.pause} aria-pressed={paused} disabled={reduced}>{paused?'▶':'Ⅱ'}</button>
  <button type="button" aria-label={c.next} disabled={!available} onClick={()=>{setPaused(true);setActive(n=>(n+1)%slides.length);}}>→</button>
 </fieldset></>;
}

