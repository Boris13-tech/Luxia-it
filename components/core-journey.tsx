'use client';
import {useEffect,useRef,useState} from 'react';
import Nucleus from './nucleus';
export default function CoreJourney(){
 const frame=useRef<HTMLDivElement>(null);const [mode,setMode]=useState(0);const [active,setActive]=useState(true);
 useEffect(()=>{
  let raf=0;const update=()=>{raf=0;const slots=Array.from(document.querySelectorAll<HTMLElement>('[data-core-slot]'));const visible=slots.filter(el=>{const r=el.getBoundingClientRect();return r.bottom>80&&r.top<innerHeight;});const target=visible.sort((a,b)=>Math.abs(a.getBoundingClientRect().top-innerHeight*.2)-Math.abs(b.getBoundingClientRect().top-innerHeight*.2))[0];
   if(!frame.current)return;
   if(target){const r=target.getBoundingClientRect();Object.assign(frame.current.style,{left:r.left+'px',top:r.top+'px',width:r.width+'px',height:r.height+'px',opacity:'1'});setActive(!document.hidden);let m=Number(target.dataset.coreSlot);if(target.dataset.coreSlot==='story'){const chapters=Array.from(document.querySelectorAll<HTMLElement>('[data-mode]'));const chapter=chapters.find(e=>{const r=e.getBoundingClientRect();return r.top<innerHeight*.58&&r.bottom>innerHeight*.4});m=Number(chapter?.dataset.mode||0);}setMode(Number.isFinite(m)?m:0);
   }else{frame.current.style.opacity='0';setActive(false);}
  };const schedule=()=>{if(!raf)raf=requestAnimationFrame(update);};
  const hover=(e:Event)=>{const m=(e.target as HTMLElement).closest<HTMLElement>('[data-core-hover]')?.dataset.coreHover;if(m!==undefined)setMode(Number(m));};
  const sizes=new ResizeObserver(schedule);document.querySelectorAll('[data-core-slot]').forEach(el=>sizes.observe(el));
  const panels=new MutationObserver(schedule);const agents=document.querySelector('.agents');if(agents)panels.observe(agents,{subtree:true,childList:true});
  update();addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);document.addEventListener('visibilitychange',schedule);document.addEventListener('pointerover',hover);document.addEventListener('focusin',hover);
  return()=>{sizes.disconnect();panels.disconnect();cancelAnimationFrame(raf);removeEventListener('scroll',schedule);removeEventListener('resize',schedule);document.removeEventListener('visibilitychange',schedule);document.removeEventListener('pointerover',hover);document.removeEventListener('focusin',hover);};
 },[]);
 return <div className="core-journey" ref={frame}><Nucleus mode={mode} active={active} persistent/></div>;
}
