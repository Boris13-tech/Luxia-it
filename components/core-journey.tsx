'use client';
import {useEffect,useRef,useState} from 'react';
import Nucleus from './nucleus';
export default function CoreJourney(){
 const frame=useRef<HTMLDivElement>(null),[mode,setMode]=useState(-1),[active,setActive]=useState(true);
 useEffect(()=>{
  if(process.env.NODE_ENV!=="production"){const qa=new URLSearchParams(location.search).get("core-review");if(qa==="scene"||qa==="identity")document.documentElement.dataset.coreReview=qa;}
  let raf=0;const update=()=>{raf=0;if(!frame.current)return;
   const scenes=Array.from(document.querySelectorAll<HTMLElement>('[data-scene]'));
   const target=scenes.find(el=>{const r=el.getBoundingClientRect();return r.top<innerHeight*.55&&r.bottom>innerHeight*.45});
   if(target){const rect=target.getBoundingClientRect(),m=Number(target.dataset.scene);const next=target.nextElementSibling as HTMLElement|null;
    const progress=Math.max(0,Math.min(1,(innerHeight*.5-rect.bottom+innerHeight*.35)/(innerHeight*.35)));
    setMode(next?.dataset.scene?m+(Number(next.dataset.scene)-m)*progress:m);frame.current.style.opacity='1';
   }else frame.current.style.opacity='.07';
   const home=document.querySelector('.home-page')?.getBoundingClientRect();setActive(!document.hidden&&!!home&&home.bottom>0&&!!target);
  };const schedule=()=>{if(!raf)raf=requestAnimationFrame(update);};
  update();addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);document.addEventListener('visibilitychange',schedule);
  return()=>{delete document.documentElement.dataset.coreReview;cancelAnimationFrame(raf);removeEventListener('scroll',schedule);removeEventListener('resize',schedule);document.removeEventListener('visibilitychange',schedule);};
 },[]);
 return <div className="core-journey" ref={frame} aria-hidden="true"><Nucleus mode={mode} active={active} persistent/></div>;
}

