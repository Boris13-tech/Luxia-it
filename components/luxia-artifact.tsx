'use client';

import Image from 'next/image';
import type {CSSProperties} from 'react';

const textureSources = [
  '/visuals/intelligence.webp',
  '/visuals/trust.webp',
  '/visuals/cloud.webp',
  '/visuals/automation.webp',
];
const compact = [[-70,-52], [70,-52], [-70,52], [70,52]];
const distributed = [[-195,-105], [175,-92], [-178,105], [196,92]];
const aligned = [[-210,0], [-70,0], [70,0], [210,0]];
const mix = (a:number,b:number,t:number) => a + (b-a)*t;
const smooth = (value:number,start:number,end:number) => {
  const x=Math.min(1,Math.max(0,(value-start)/(end-start)));
  return x*x*(3-2*x);
};

export default function LuxiaArtifact({progress}: {progress: number}) {
  const stage=progress*3;
  const trust=smooth(stage,.58,1)*(1-smooth(stage,1.42,1.86));
  const scale=smooth(stage,1.52,2.18);
  const automation=smooth(stage,2.34,3);
  const active=Math.min(3,Math.floor(progress*4));
  const rootStyle={
    '--artifact-scale': 1+trust*.09-scale*.12+automation*.08,
    '--shell-gap': `${120-trust*110+scale*70-automation*50}px`,
    '--artifact-turn': `${-7+progress*6}deg`,
    '--core-light': .4+(1-Math.min(1,stage))*1.05+automation*.4,
  } as CSSProperties;

  return <div className="luxia-artifact" style={rootStyle}>
    <div className="artifact-glass"/>
    <div className="artifact-core"><i/><span/></div>
    {textureSources.map((src,index)=>{
      const start=compact[index],spread=distributed[index],end=aligned[index];
      const x=mix(mix(start[0],spread[0],scale),end[0],automation);
      const y=mix(mix(start[1],spread[1],scale),end[1],automation);
      const sequence=smooth(automation,index*.13,Math.min(1,index*.13+.38));
      return <div className="artifact-module" key={src} style={{transform:`translate3d(${x}px,${y}px,${18+sequence*20}px) rotateY(${(index-1.5)*(1-automation)*2}deg)`,opacity:index===active?.92:.16+sequence*.3}}>
        <Image src={src} alt="" fill sizes="180px" unoptimized/>
      </div>;
    })}
    <div className="artifact-shell shell-left"/><div className="artifact-shell shell-right"/>
  </div>;
}
