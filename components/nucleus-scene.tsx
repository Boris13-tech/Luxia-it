'use client';
import { Canvas, useFrame } from '@react-three/fiber';
import { Edges } from '@react-three/drei';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

function DataFlow({ reduced }: { reduced: boolean }) {
  const points = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!points.current) return;
    points.current.children.forEach((point, i) => {
      const phase =
        (reduced ? 0 : clock.elapsedTime * 0.24) + (i * Math.PI) / 3;
      point.position.set(
        Math.cos(phase) * 2.45,
        Math.sin(phase * 2) * 1.4,
        Math.sin(phase) * 2.45,
      );
    });
  });
  return (
    <group ref={points}>
      {Array.from({ length: 6 }, (_, i) => (
        <mesh key={i}>
          <sphereGeometry args={[0.045, 8, 8]} />
          <meshBasicMaterial color="#c5f2ff" />
        </mesh>
      ))}
    </group>
  );
}

function Structure({ mode, reduced }: { mode: number; reduced: boolean }) {
  const group = useRef<THREE.Group>(null);
  const layers = useRef<THREE.Group>(null);
  const nodes = useMemo(
    () =>
      Array.from({ length: 54 }, (_, i) => {
        const t = i * 2.399963;
        const r = 2.15 + (i % 4) * 0.22;
        return new THREE.Vector3(
          Math.cos(t) * r,
          Math.sin(i * 1.71) * 2.1,
          Math.sin(t) * r,
        );
      }),
    [],
  );
  const lines = useMemo(() => {
    const p: number[] = [];
    nodes.forEach((a, i) =>
      nodes.slice(i + 1).forEach((b) => {
        if (a.distanceTo(b) < 1.55) p.push(...a.toArray(), ...b.toArray());
      }),
    );
    return new Float32Array(p);
  }, [nodes]);
  const shape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-0.9, 1.45);
    s.lineTo(-0.36, 1.45);
    s.lineTo(-0.36, -0.72);
    s.lineTo(0.95, -0.72);
    s.lineTo(0.95, -1.25);
    s.lineTo(-0.9, -1.25);
    s.closePath();
    return s;
  }, []);
  useFrame(({ clock, pointer }, delta) => {
    if (!group.current || !layers.current) return;
    const t = reduced ? 0 : clock.elapsedTime;
    group.current.rotation.y = THREE.MathUtils.damp(
      group.current.rotation.y,
      -0.62 + Math.sin(t * 0.13) * 0.13 + pointer.x * 0.07,
      3,
      delta,
    );
    group.current.rotation.x = THREE.MathUtils.damp(
      group.current.rotation.x,
      0.18 + pointer.y * 0.03,
      3,
      delta,
    );
    group.current.position.y = Math.sin(t * 0.35) * 0.075;
    const target = mode === 2 ? 1.25 : mode === 1 ? 0.96 : 1;
    layers.current.scale.lerp(
      new THREE.Vector3(target, target, target),
      Math.min(1, delta * 2),
    );
    layers.current.rotation.y = reduced ? 0 : t * (mode === 3 ? 0.075 : 0.022);
  });
  return (
    <group ref={group} rotation={[0.18, -0.62, -0.08]}>
      {mode === 3 && <DataFlow reduced={reduced} />}
      <group ref={layers}>
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <mesh key={i} rotation={[0, i * 0.045, 0]} scale={1 + i * 0.073}>
            <boxGeometry args={[2.75, 2.75, 2.75]} />
            <meshBasicMaterial
              color="#1057b5"
              transparent
              opacity={0.018}
              depthWrite={false}
            />
            <Edges
              threshold={20}
              color={i % 3 === 0 ? '#419dff' : '#164f9b'}
              transparent
              opacity={i % 3 === 0 ? 0.6 : 0.28}
            />
          </mesh>
        ))}
        <lineSegments>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[lines, 3]} />
          </bufferGeometry>
          <lineBasicMaterial
            color={mode === 1 ? '#84dfff' : '#2789ff'}
            transparent
            opacity={mode === 0 ? 0.28 : 0.1}
          />
        </lineSegments>
        {nodes.map((p, i) => (
          <mesh key={i} position={p} scale={i % 5 === 0 ? 0.042 : 0.018}>
            <sphereGeometry args={[1, 6, 6]} />
            <meshBasicMaterial color={i % 5 === 0 ? '#c3f1ff' : '#388dff'} />
          </mesh>
        ))}
      </group>
      {[0, 1, 2].map((i) => (
        <mesh
          key={i}
          position={[(i - 1) * 0.67, (i - 1) * 0.22, (i - 1) * -0.38]}
          scale={0.72}
        >
          <extrudeGeometry
            args={[
              shape,
              {
                depth: 0.22,
                bevelEnabled: true,
                bevelSize: 0.035,
                bevelThickness: 0.025,
                bevelSegments: 2,
                steps: 1,
              },
            ]}
          />
          <meshPhysicalMaterial
            color={i === 0 ? '#bedbff' : i === 1 ? '#0878ff' : '#0645d5'}
            metalness={0.7}
            roughness={0.24}
            clearcoat={1}
            emissive={i === 0 ? '#204f7c' : '#0054f0'}
            emissiveIntensity={0.22}
          />
          <Edges
            color={i === 0 ? '#d8efff' : '#49b9ff'}
            transparent
            opacity={0.8}
          />
        </mesh>
      ))}
      {mode === 1 && (
        <mesh>
          <icosahedronGeometry args={[3.15, 1]} />
          <meshBasicMaterial
            color="#59baff"
            wireframe
            transparent
            opacity={0.2}
          />
        </mesh>
      )}
      {mode === 2 &&
        [-1, 1].map((x) => (
          <group key={x} position={[x * 3, 0, 0]}>
            <mesh>
              <boxGeometry args={[0.7, 0.7, 0.7]} />
              <meshBasicMaterial color="#1673e5" transparent opacity={0.16} />
              <Edges color="#67baff" />
            </mesh>
          </group>
        ))}
    </group>
  );
}
export default function NucleusScene({
  mode = 0,
  reduced = false,
}: {
  mode?: number;
  reduced?: boolean;
}) {
  const mobile =
    typeof window !== 'undefined' &&
    window.matchMedia('(max-width: 600px)').matches;
  return (
    <Canvas
      dpr={[1, mobile ? 1 : 1.5]}
      camera={{ position: [0, 0, 10.3], fov: 42 }}
      gl={{ alpha: true, antialias: true, powerPreference: 'low-power' }}
      frameloop={reduced ? 'demand' : 'always'}
    >
      <ambientLight intensity={1.2} />
      <directionalLight position={[2, 5, 4]} intensity={5} color="#a0dcff" />
      <pointLight position={[-4, -1, 3]} intensity={35} color="#006aff" />
      <Structure mode={mode} reduced={reduced} />
    </Canvas>
  );
}
