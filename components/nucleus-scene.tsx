/* oxlint-disable react/react-compiler -- The render loop owns mutable GPU objects. */
'use client';
import {Canvas,useFrame,useThree} from '@react-three/fiber';
import {useEffect,useMemo,useRef} from 'react';
import * as THREE from 'three';
import {RoomEnvironment} from 'three/examples/jsm/environments/RoomEnvironment.js';
function Environment(){
 const {gl,scene}=useThree();
 useEffect(()=>{const room=new RoomEnvironment();const pmrem=new THREE.PMREMGenerator(gl);const target=pmrem.fromScene(room,.04);scene.environment=target.texture;return()=>{scene.environment=null;target.dispose();pmrem.dispose();room.dispose();};},[gl,scene]);
 return null;
}
const cameras=[new THREE.Vector3(7,4,10),new THREE.Vector3(-2,1.2,5.4),new THREE.Vector3(1.5,.3,3.7),new THREE.Vector3(10,8,15),new THREE.Vector3(5,7,10),new THREE.Vector3(-7,3,11),new THREE.Vector3(0,10,17)];
function Architecture({mode,reduced,mobile,journey,experience,method,policy}:{mode:number;reduced:boolean;mobile:boolean;journey:boolean;experience:boolean;method:number;policy:string}){
 const chassis=useRef<THREE.InstancedMesh>(null),rims=useRef<THREE.InstancedMesh>(null),gates=useRef<THREE.InstancedMesh>(null),packets=useRef<THREE.InstancedMesh>(null),glass=useRef<THREE.InstancedMesh>(null);
 const threads=useRef<THREE.InstancedMesh>(null);
 const morph=useRef({fragment:0,assembly:1,expansion:0});
 const decks=useRef<THREE.InstancedMesh>(null),decisions=useRef<THREE.InstancedMesh>(null);
 const group=useRef<THREE.Group>(null),clock=useRef(0),slow=useRef(0),quality=useRef(false);
 const {setDpr}=useThree();const count=mobile?9:17;
 const data=useMemo(()=>{
  // The logo's rising corner becomes a folded architectural lamella.
  const shape=new THREE.Shape();shape.moveTo(-1.6,2.5);shape.lineTo(-1.2,2.5);shape.lineTo(-1.2,-1.35);shape.lineTo(1.7,-1.35);shape.lineTo(1.7,-1.75);shape.lineTo(-1.6,-1.75);shape.closePath();
  const body=new THREE.ExtrudeGeometry(shape,{depth:.115,bevelEnabled:true,bevelSegments:2,steps:1,bevelSize:.035,bevelThickness:.025,curveSegments:1});
  return {body,anchors:Array.from({length:17},()=>new THREE.Vector3()),dummy:new THREE.Object3D(),color:new THREE.Color(),target:new THREE.Vector3(),look:new THREE.Vector3()};
 },[]);
 useEffect(()=>()=>data.body.dispose(),[data]);
 useEffect(()=>{if(experience)clock.current=0;},[experience,mode,method,policy]);
 useFrame(({camera,pointer},dt)=>{
  if(!chassis.current||!rims.current||!gates.current||!packets.current||!glass.current||!group.current||!decks.current||!decisions.current||(experience&&!threads.current))return;
  const delta=Math.min(dt,.05);clock.current+=delta;const t=reduced?5:clock.current;
  // One cycle drives verification, gate opening, resource routing and authorized exit.
  const cycle=t%12,baseOpen=reduced?1:THREE.MathUtils.smoothstep(cycle,1.4,2.2)*(1-THREE.MathUtils.smoothstep(cycle,9.8,10.5));
  const denied=experience&&mode===1&&policy==="deny";
  const privileged=experience&&mode===1&&policy==="privilege";
  const open=denied?0:privileged?baseOpen*(1-THREE.MathUtils.smoothstep(cycle,7,7.6)):baseOpen;
  const compute=(denied?0:1)*THREE.MathUtils.smoothstep(cycle,4.8,5.5)*(1-THREE.MathUtils.smoothstep(cycle,7.2,8));
  const action=(denied?0:1)*THREE.MathUtils.smoothstep(cycle,7.5,8)*(1-THREE.MathUtils.smoothstep(cycle,9.6,10));
  const reveal=reduced||experience?1:THREE.MathUtils.smoothstep(t,0,2.2);
  const m=THREE.MathUtils.clamp(mode+1,0,6),a=Math.floor(m),b=Math.min(6,a+1);
  data.target.lerpVectors(cameras[a],cameras[b],m-a);if(mobile)data.target.multiplyScalar(1.2);
  if(experience){data.target.set(7-mode*.6,3.5,mode===1?9:mode===2?15:12);if(mobile)data.target.multiplyScalar(.68);}
  if(!reduced){data.target.x+=pointer.x*.25;data.target.y+=pointer.y*.15;}
  if(reduced)camera.position.copy(data.target);else camera.position.lerp(data.target,1-Math.exp(-delta*2));
  data.look.set(journey&&mode<0?(mobile?-.15:-2.9)*(1-Math.max(0,mode+1)):0,mobile&&mode<0?-1.7:0,0);if(experience)data.look.set(mobile?0:-2.5,0,0);camera.lookAt(data.look);
  group.current.rotation.set(.05,-.22,0);group.current.scale.setScalar(.96+reveal*.04);
  const expansion=Math.exp(-Math.pow(mode-2,2)*3),lab=Math.exp(-Math.pow(mode-4,2)*4),international=Math.exp(-Math.pow(mode-5,2)*4);
  morph.current.fragment=THREE.MathUtils.damp(morph.current.fragment,experience&&method===0?1:0,3,delta);
  morph.current.expansion=THREE.MathUtils.damp(morph.current.expansion,expansion,2,delta);
  for(let i=0;i<count;i++){
   const fragment=morph.current.fragment;
   const assemble=experience&&method===2?(.5+.5*Math.min(1,cycle/5)):1;
   const reorganize=experience&&mode===0&&method<0?Math.sin(t*.5+i*.7)*.18:0;
   const x=fragment*Math.sin(i*3)*.75+reorganize+Math.floor(i/3)*.14+international*(i<count/2?-1:1)*1.8;
   const y=fragment*Math.cos(i*2)*.6+(i%3)*.24+Math.floor(i/3)*.07+lab*Math.sin(t*.25+i*.5)*.22;
   const z=(i-(count-1)/2)*.27*(1+morph.current.expansion*(experience?2.2:.7))+international*(i%3)*.25;
   data.anchors[i].set(x+.8,y-1.22,z);
   data.dummy.position.set(x,y,z);data.dummy.rotation.set(0,0,lab*(i%2?.035:-.035));data.dummy.scale.setScalar(assemble);data.dummy.updateMatrix();chassis.current.setMatrixAt(i,data.dummy.matrix);
   data.color.set(i%4===0?'#376a80':'#172c3a').multiplyScalar(.015+reveal*1.2+compute*(i%3===0?.4:.04));chassis.current.setColorAt(i,data.color);
   data.dummy.position.set(-1.18+x,.54+y,z+.06);data.dummy.rotation.set(0,0,0);data.dummy.scale.set(.018,3.76,.019);data.dummy.updateMatrix();rims.current.setMatrixAt(i*2,data.dummy.matrix);
   data.dummy.position.set(.24+x,-1.33+y,z+.06);data.dummy.scale.set(2.84,.018,.019);data.dummy.updateMatrix();rims.current.setMatrixAt(i*2+1,data.dummy.matrix);
   const lit=(i%4===0?.46:.065)+compute*.22+action*.16;data.color.set('#69d6ee').multiplyScalar(lit*reveal);rims.current.setColorAt(i*2,data.color);rims.current.setColorAt(i*2+1,data.color);
   for(let side=0;side<2;side++){
    data.dummy.position.set(-1.17+x+(side?1:-1)*(.11+open*.19),-.55+y,z+.12);data.dummy.scale.set(.19,.07,.24);data.dummy.updateMatrix();gates.current.setMatrixAt(i*2+side,data.dummy.matrix);
    data.color.set(denied?'#d09c6f':open>.8?'#9eeaff':'#315d6f').multiplyScalar(reveal);gates.current.setColorAt(i*2+side,data.color);
   }
   data.dummy.position.set(-.66+x,-.08+y,z);data.dummy.scale.set(.43,.85+(i%3)*.18,.018);data.dummy.updateMatrix();glass.current.setMatrixAt(i,data.dummy.matrix);
   for(let k=0;k<3;k++){
    const travel=reduced?.7:THREE.MathUtils.clamp((cycle-2.2-k*.36-i*.035)/(privileged?3.8:6.5),0,1);
    const blocked=denied||(experience&&mode===3&&i%4===0&&cycle>4&&cycle<7);
    const distance=experience&&mode===1&&k===2&&cycle>9?(12-cycle)/3*(denied?2.9:6.6):blocked?Math.min(2.9,travel*6.6):travel*6.6;
    const px=distance<3.8?-1.12:-1.12+(distance-3.8),py=distance<3.8?2.45-distance:-1.35;
    data.dummy.position.set(px+x+(blocked?Math.max(0,travel-.44)*-2:0),py+y,z+.1);data.dummy.scale.setScalar((cycle>10&&!(experience&&mode===1&&k===2)?0:.036)*reveal);data.dummy.updateMatrix();packets.current.setMatrixAt(i*3+k,data.dummy.matrix);
   }
  }
  for(let j=0;j<count-1;j++){
   const a=data.anchors[j],b=data.anchors[Math.min(count-1,j+(experience&&mode===0?2:1))];data.dummy.position.copy(a).lerp(b,.5);data.dummy.lookAt(b);data.dummy.scale.set(.009,.009,a.distanceTo(b));data.dummy.updateMatrix();threads.current?.setMatrixAt(j,data.dummy.matrix);
  }
  for(let j=0;j<6;j++){
   const tier=j%3,cluster=j<3?-1:1;
   data.dummy.position.set(.1+tier*.62+international*cluster*1.5,-1.1+tier*.13,cluster*(.7+expansion*1.8));
   data.dummy.rotation.set(0,0,0);data.dummy.scale.set(.48,.09,1.7);data.dummy.updateMatrix();decks.current.setMatrixAt(j,data.dummy.matrix);
   data.color.set('#244351').multiplyScalar(.04+reveal*(.8+compute*.4));decks.current.setColorAt(j,data.color);
   data.dummy.position.y+=.051;data.dummy.scale.set(.35,.006,action>.2?1.5:.35+compute);data.dummy.updateMatrix();decisions.current.setMatrixAt(j,data.dummy.matrix);
   data.color.set('#a4e6ec').multiplyScalar((.04+compute*.45+action*.8)*reveal);decisions.current.setColorAt(j,data.color);
  }
  for(const mesh of [chassis.current,rims.current,gates.current,packets.current,glass.current,decks.current,decisions.current,threads.current]){if(!mesh)continue;mesh.instanceMatrix.needsUpdate=true;if(mesh.instanceColor)mesh.instanceColor.needsUpdate=true;}
  if(!reduced&&!quality.current&&clock.current>4){slow.current=dt>.028?slow.current+1:Math.max(0,slow.current-1);if(slow.current>75){quality.current=true;setDpr(mobile?.8:1);}}
 });
 return <group ref={group}>
  {experience&&<instancedMesh ref={threads} args={[undefined,undefined,count-1]} frustumCulled={false}><boxGeometry/><meshBasicMaterial color="#46889d" transparent opacity={.55}/></instancedMesh>}
  <instancedMesh ref={decks} args={[undefined,undefined,6]} frustumCulled={false}><boxGeometry/><meshStandardMaterial metalness={.9} roughness={.2}/></instancedMesh>
  <instancedMesh ref={decisions} args={[undefined,undefined,6]} frustumCulled={false}><boxGeometry/><meshBasicMaterial toneMapped={false}/></instancedMesh>
  <instancedMesh ref={chassis} args={[data.body,undefined,count]} frustumCulled={false}><meshStandardMaterial metalness={.88} roughness={.26} envMapIntensity={1.9}/></instancedMesh>
  <instancedMesh ref={rims} args={[undefined,undefined,count*2]} frustumCulled={false}><boxGeometry/><meshBasicMaterial toneMapped={false}/></instancedMesh>
  <instancedMesh ref={gates} args={[undefined,undefined,count*2]} frustumCulled={false}><boxGeometry/><meshStandardMaterial metalness={.5} roughness={.18}/></instancedMesh>
  <instancedMesh ref={glass} args={[undefined,undefined,count]} frustumCulled={false}><boxGeometry/><meshPhysicalMaterial color="#86c7dc" metalness={.2} roughness={.08} transparent opacity={.085} depthWrite={false} envMapIntensity={2}/></instancedMesh>
  <instancedMesh ref={packets} args={[undefined,undefined,count*3]} frustumCulled={false}><boxGeometry/><meshBasicMaterial color="#b9f5ff" toneMapped={false}/></instancedMesh>
 </group>;
}
export default function NucleusScene({mode=0,reduced=false,active=true,journey=false,experience=false,method=-1,policy="allow"}:{mode?:number;reduced?:boolean;active?:boolean;journey?:boolean;experience?:boolean;method?:number;policy?:string}){
 const mobile=typeof window!=='undefined'&&window.matchMedia('(max-width: 700px)').matches;
 return <Canvas dpr={[.8,mobile?1:1.5]} camera={{position:[7,4,10],fov:40,near:.1,far:80}} gl={{alpha:true,antialias:!mobile,powerPreference:'low-power'}} frameloop={!active||reduced?'demand':'always'}>
  <Environment/><ambientLight intensity={.35}/><directionalLight position={[2,6,4]} intensity={3} color="#c0e8ff"/><pointLight position={[-4,-2,3]} intensity={24} color="#087bef"/><Architecture mode={mode} reduced={reduced} mobile={mobile} journey={journey} experience={experience} method={method} policy={policy}/>
 </Canvas>;
}




