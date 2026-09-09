'use client';
import Image from 'next/image';
import {visualScenes,sceneIndex} from '@/lib/visual-scenes';
export default function Nucleus({mode=0,className='',persistent=false,policy='allow'}:{mode?:number;experience?:boolean;method?:number;policy?:'allow'|'deny'|'privilege';className?:string;active?:boolean;persistent?:boolean}){
 const index=sceneIndex(mode);
 return <figure className={'nucleus editorial-visual '+className} data-visual={index} data-placement={mode<0?'hero':mode} data-policy={policy} aria-hidden="true">
  {visualScenes.map((scene,i)=><div key={scene.src} className={'visual-exposure '+(i===index?'is-current':'')}><Image src={scene.src} alt="" fill sizes={persistent?'100vw':'(max-width: 700px) 100vw, 60vw'} style={{objectPosition:scene.position}} unoptimized loading={i===1?'eager':'lazy'}/></div>)}
  {index===1&&<div className="cyber-caption"><strong>ZERO TRUST</strong><span>MFA · RBAC · SIEM</span></div>}
 </figure>;
}
