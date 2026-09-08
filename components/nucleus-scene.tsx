/* oxlint-disable react/react-compiler -- Three.js owns mutable GPU buffers updated in useFrame. */
'use client';
import {Canvas,useFrame} from '@react-three/fiber';
import {useMemo,useRef} from 'react';
import * as THREE from 'three';

// One topology drives compute, workload routing and local verification gates.
// Deterministic coordinates keep the organism continuous across editorial states.
const ZONES=7, PER_ZONE=12, NODE_COUNT=ZONES*PER_ZONE;
const EDGE_COUNT=NODE_COUNT+ZONES*5;
const PACKETS=EDGE_COUNT*2;
const vertexShader=`attribute float intensity; varying float vIntensity;
void main(){vIntensity=intensity;vec4 p=modelViewMatrix*vec4(position,1.);gl_Position=projectionMatrix*p;gl_PointSize=clamp((4.+intensity*11.)*6./-p.z,2.,22.);}`;
const fragmentShader=`varying float vIntensity;void main(){float r=length(gl_PointCoord-.5)*2.;float a=pow(max(0.,1.-r),2.5);vec3 c=mix(vec3(.12,.39,.85),vec3(.7,.92,1.),vIntensity);gl_FragColor=vec4(c,a*.85);}`;
function Organism({mode,reduced}:{mode:number;reduced:boolean}){
 const group=useRef<THREE.Group>(null), nodes=useRef<THREE.InstancedMesh>(null),gates=useRef<THREE.InstancedMesh>(null),surfaces=useRef<THREE.InstancedMesh>(null);
 const elapsed=useRef(0),state=useRef(mode),dummy=useMemo(()=>new THREE.Object3D(),[]);
 const data=useMemo(()=>{
  const base=Array.from({length:NODE_COUNT},(_,i)=>{const z=Math.floor(i/PER_ZONE),j=i%PER_ZONE;const a=z*2.39996;const r=.65+z*.34;return new THREE.Vector3(Math.cos(a)*r+(j%3-1)*.3, (z-3)*.42+(Math.floor(j/3)-1.5)*.22,Math.sin(a)*r*.7+(j%2)*.24);});
  return {base,positions:base.map(p=>p.clone()),lines:new Float32Array(EDGE_COUNT*6),lineColors:new Float32Array(EDGE_COUNT*6),packets:new Float32Array(PACKETS*3),intensity:new Float32Array(PACKETS),edges:Array.from({length:EDGE_COUNT},()=>[0,0]),energy:new Float32Array(NODE_COUNT),a:new THREE.Vector3(),b:new THREE.Vector3(),color:new THREE.Color()};
 },[]);
 const lineGeometry=useMemo(()=>{const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(data.lines,3).setUsage(THREE.DynamicDrawUsage));g.setAttribute('color',new THREE.BufferAttribute(data.lineColors,3).setUsage(THREE.DynamicDrawUsage));return g;},[data]);
 const packetGeometry=useMemo(()=>{const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(data.packets,3).setUsage(THREE.DynamicDrawUsage));g.setAttribute('intensity',new THREE.BufferAttribute(data.intensity,1).setUsage(THREE.DynamicDrawUsage));return g;},[data]);
 useFrame(({pointer,camera},delta)=>{
  if(!group.current||!nodes.current||!gates.current||!surfaces.current)return;
  elapsed.current+=Math.min(delta,.05);const time=reduced?8:elapsed.current;
  state.current=reduced?mode:THREE.MathUtils.damp(state.current,mode,2,delta);
  const m=state.current,cloud=Math.exp(-Math.pow(m-2,2)*3),security=Math.exp(-Math.pow(m-1,2)*3),sync=Math.exp(-Math.pow(m-3,2)*3),labs=Math.max(0,m-3);
  const reveal=reduced?1:THREE.MathUtils.smoothstep(time,.2,3.8);
  const cycle=time%14,verify=Math.exp(-Math.pow(cycle-2,2)*1.1),compute=Math.exp(-Math.pow(cycle-7,2)*.4);
  const scale=.22+reveal*(.78+cloud*.18+compute*.055);
  group.current.scale.setScalar(scale);
  group.current.rotation.set(.16+(reduced?0:pointer.y*.035),-.25+Math.sin(time*.065)*.18+(reduced?0:pointer.x*.08),-.12);
  // Camera shifts are restrained: topology remains recognisably the same system.
  camera.position.z=THREE.MathUtils.damp(camera.position.z,mode===2?9.5:8.8,2,delta);
  data.energy.fill(.05);
  for(let i=0;i<NODE_COUNT;i++){
   const z=Math.floor(i/PER_ZONE),j=i%PER_ZONE,p=data.positions[i],b=data.base[i];
   const expansion=1+cloud*.21+labs*Math.sin(time*.3+z)*.14;
   const proximity=reduced?0:Math.max(0,1-Math.hypot(b.x-pointer.x*3,b.y-pointer.y*2)/1.5);
   p.set(b.x*expansion+Math.sin(time*.25+z*1.8+j*.7)*.065+pointer.x*proximity*.1,b.y+Math.cos(time*.32+z+j*.8)*.055,b.z*expansion+Math.sin(time*.22+i*.4)*(.05+labs*.09));
  }
  for(let e=0;e<EDGE_COUNT;e++){
   let a,b;
   if(e<NODE_COUNT){a=e;const z=Math.floor(e/PER_ZONE),j=e%PER_ZONE;b=z*PER_ZONE+(j+1+(j%3===0?2:0))%PER_ZONE;}
   else{const k=e-NODE_COUNT,z=k%ZONES;a=z*PER_ZONE+(Math.floor(k/ZONES)*3)%PER_ZONE;const target=(z+1+Math.floor(k/ZONES)%2)%ZONES;b=target*PER_ZONE+(Math.floor(time/8)+k*3)%PER_ZONE;}
   data.edges[e][0]=a;data.edges[e][1]=b;
   const suspicious=e===NODE_COUNT+3 && cycle>9 && cycle<12;
   // Local quarantine reroutes a workload; the rest of the network keeps running.
   if(suspicious){b=(b+4)%NODE_COUNT;data.edges[e][1]=b;}
   const pa=data.positions[a],pb=data.positions[b];pa.toArray(data.lines,e*6);pb.toArray(data.lines,e*6+3);
   const glow=.10+(e>=NODE_COUNT?.14:0)+verify*.12+compute*.12;
   data.color.set(suspicious?'#77573d':e%7===0?'#76cde0':'#2263aa').multiplyScalar(glow*2.2);
   data.color.toArray(data.lineColors,e*6);data.color.toArray(data.lineColors,e*6+3);
   for(let k=0;k<2;k++){
    const idx=e*2+k;let phase=(time*(.13+sync*.065)+e*.173+k*.5)%1;
    // Packets slow at the authentication gate, then enter compute clusters.
    const gate=.33; if(phase>.25&&phase<.45)phase=gate+(phase-.33)*.35;
    const intensity=(.2+Math.sin(phase*Math.PI)*.8)*reveal;
    data.a.lerpVectors(pa,pb,phase);data.a.toArray(data.packets,idx*3);data.intensity[idx]=intensity;
    if(phase>.82)data.energy[b]+=intensity*.45;
   }
  }
  for(let i=0;i<NODE_COUNT;i++){
   const energy=Math.min(1,data.energy[i]+compute*.5),z=Math.floor(i/PER_ZONE);
   dummy.position.copy(data.positions[i]);dummy.rotation.set(0,z*.25,Math.PI/4);dummy.scale.setScalar((i%4===0?.058:.032)*(1+energy*.6));dummy.updateMatrix();nodes.current.setMatrixAt(i,dummy.matrix);
   data.color.set(i%4===0?'#a7dce8':'#2474ce').multiplyScalar(.6+energy*.9);nodes.current.setColorAt(i,data.color);
  }
  for(let z=0;z<ZONES;z++){
   const edge=NODE_COUNT+z;const [a,b]=data.edges[edge];const p=data.a.lerpVectors(data.positions[a],data.positions[b],.33);
   dummy.position.copy(p);dummy.lookAt(data.positions[b]);const pulse=.82+verify*.5+security*.25;dummy.scale.set(.19*pulse,.19*pulse,1);dummy.updateMatrix();gates.current.setMatrixAt(z,dummy.matrix);
   data.color.set(z===3&&cycle>9&&cycle<12?'#bc835b':'#79c9d9').multiplyScalar(.3+verify*.7+security*.25);gates.current.setColorAt(z,data.color);
   const anchor=data.positions[z*PER_ZONE+4];dummy.position.copy(anchor);dummy.rotation.set(.3+z*.12,.5+z*.3,-.15);dummy.scale.set(.32+compute*.15,.42+cloud*.12,.035);dummy.updateMatrix();surfaces.current.setMatrixAt(z,dummy.matrix);
  }
  nodes.current.instanceMatrix.needsUpdate=true;if(nodes.current.instanceColor)nodes.current.instanceColor.needsUpdate=true;
  gates.current.instanceMatrix.needsUpdate=true;if(gates.current.instanceColor)gates.current.instanceColor.needsUpdate=true;surfaces.current.instanceMatrix.needsUpdate=true;
  lineGeometry.attributes.position.needsUpdate=true;lineGeometry.attributes.color.needsUpdate=true;packetGeometry.attributes.position.needsUpdate=true;packetGeometry.attributes.intensity.needsUpdate=true;
 });
 return <group ref={group}>
  <lineSegments geometry={lineGeometry} frustumCulled={false}><lineBasicMaterial vertexColors transparent opacity={.7} depthWrite={false}/></lineSegments>
  <instancedMesh ref={nodes} args={[undefined,undefined,NODE_COUNT]} frustumCulled={false}><boxGeometry args={[1,1,1]}/><meshBasicMaterial toneMapped={false}/></instancedMesh>
  <instancedMesh ref={surfaces} args={[undefined,undefined,ZONES]} frustumCulled={false}><boxGeometry args={[1,1,1]}/><meshPhysicalMaterial color="#439bd6" metalness={.55} roughness={.25} transparent opacity={.18} depthWrite={false} side={THREE.DoubleSide}/></instancedMesh>
  <instancedMesh ref={gates} args={[undefined,undefined,ZONES]} frustumCulled={false}><ringGeometry args={[.8,1,4]}/><meshBasicMaterial side={THREE.DoubleSide} transparent opacity={.8} depthWrite={false}/></instancedMesh>
  <points geometry={packetGeometry} frustumCulled={false}><shaderMaterial vertexShader={vertexShader} fragmentShader={fragmentShader} transparent depthWrite={false} blending={THREE.AdditiveBlending}/></points>
 </group>;
}
export default function NucleusScene({mode=0,reduced=false,active=true}:{mode?:number;reduced?:boolean;active?:boolean}){
 const mobile=typeof window!=='undefined'&&window.matchMedia('(max-width: 600px)').matches;
 return <Canvas dpr={[1,mobile?1:1.5]} camera={{position:[0,0,8.8],fov:42}} gl={{alpha:true,antialias:!mobile,powerPreference:'low-power'}} frameloop={!active||reduced?'demand':'always'}><fog attach="fog" args={['#080d14',8,17]}/><ambientLight intensity={.7}/><pointLight position={[0,2,3]} intensity={12} color="#91d8f5"/><Organism mode={mode} reduced={reduced}/></Canvas>;
}
