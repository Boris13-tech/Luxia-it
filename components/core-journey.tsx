'use client';
import {useEffect,useRef,useState} from 'react';
import Nucleus from './nucleus';
export default function CoreJourney(){
 const frame=useRef<HTMLDivElement>(null),[mode,setMode]=useState(-1);
 useEffect(()=>{
  let raf=0;const media=matchMedia('(prefers-reduced-motion: reduce)');
  const update=()=>{raf=0;const root=frame.current;if(!root)return;
   const scenes=Array.from(document.querySelectorAll<HTMLElement>('[data-scene]'));
   const target=scenes.find(el=>{const r=el.getBoundingClientRect();return r.top<innerHeight*.65&&r.bottom>innerHeight*.35;});
   if(target){const rect=target.getBoundingClientRect();setMode(Number(target.dataset.scene));const p=Math.max(0,Math.min(1,(innerHeight-rect.top)/(innerHeight+rect.height)));root.style.setProperty('--visual-scale',String(media.matches?1:1.09-p*.09));root.style.setProperty('--visual-y',media.matches?'0px':`${(p-.5)*-36}px`);root.style.opacity='1';}
   else root.style.opacity='0';
  };
  const schedule=()=>{if(!raf)raf=requestAnimationFrame(update);};update();addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);media.addEventListener('change',schedule);
  return()=>{cancelAnimationFrame(raf);removeEventListener('scroll',schedule);removeEventListener('resize',schedule);media.removeEventListener('change',schedule);};
 },[]);
 return <div className="core-journey photographic-journey" ref={frame} aria-hidden="true"><Nucleus mode={mode} persistent/></div>;
}
