import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import {
  Environment,
  Float,
  MeshTransmissionMaterial,
  Sparkles,
  Stars,
} from "@react-three/drei";
import * as THREE from "three";

/**
 * A small constellation of glassy crystals floating together,
 * surrounded by a warm cosmic dust cloud.
 */

const CRYSTALS = [
  { pos: [0, 0, 0], scale: 1.25, geo: "icosa" },
  { pos: [-1.7, 0.8, -0.4], scale: 0.55, geo: "octa" },
  { pos: [1.6, -0.9, 0.2], scale: 0.7, geo: "tetra" },
  { pos: [0.4, 1.5, -0.6], scale: 0.45, geo: "octa" },
  { pos: [-1.2, -1.3, 0.4], scale: 0.5, geo: "icosa" },
  { pos: [2.0, 1.0, -0.8], scale: 0.4, geo: "tetra" },
];

function Crystal({ pos, scale, geo, idx }) {
  const ref = useRef();
  useFrame((s, d) => {
    if (!ref.current) return;
    ref.current.rotation.x += d * (0.1 + idx * 0.02);
    ref.current.rotation.y += d * (0.08 + idx * 0.015);
  });
  return (
    <Float
      speed={0.7 + idx * 0.1}
      rotationIntensity={0.25}
      floatIntensity={0.6}
      position={pos}
    >
      <mesh ref={ref} scale={scale}>
        {geo === "icosa" && <icosahedronGeometry args={[1, 0]} />}
        {geo === "octa" && <octahedronGeometry args={[1, 0]} />}
        {geo === "tetra" && <tetrahedronGeometry args={[1, 0]} />}
        <MeshTransmissionMaterial
          backside
          samples={4}
          thickness={0.7}
          chromaticAberration={0.35}
          anisotropy={0.25}
          distortion={0.15}
          distortionScale={0.3}
          temporalDistortion={0.04}
          ior={1.45}
          color="#ffffff"
          roughness={0.05}
          transmission={1}
        />
      </mesh>
    </Float>
  );
}

function Cluster() {
  const group = useRef();
  const target = useRef({ x: 0, y: 0 });

  useFrame((state, delta) => {
    const { mouse } = state;
    target.current.x = mouse.x * 0.4;
    target.current.y = mouse.y * 0.4;
    if (group.current) {
      group.current.rotation.y +=
        (target.current.x - group.current.rotation.y) * 0.04;
      group.current.rotation.x +=
        (-target.current.y - group.current.rotation.x) * 0.04;
      group.current.rotation.y += delta * 0.04;
    }
  });

  return (
    <group ref={group}>
      {CRYSTALS.map((c, i) => (
        <Crystal key={i} {...c} idx={i} />
      ))}
    </group>
  );
}

function Dust() {
  const group = useRef();
  const { positions, colors } = useMemo(() => {
    const COUNT = 4000;
    const positions = new Float32Array(COUNT * 3);
    const colors = new Float32Array(COUNT * 3);
    const cInner = new THREE.Color("#ffd166");
    const cMid = new THREE.Color("#ff6b35");
    const cOuter = new THREE.Color("#b794f4");
    for (let i = 0; i < COUNT; i++) {
      // Fluffy cloud around the cluster
      const r = 1.8 + Math.pow(Math.random(), 1.4) * 5.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.7;
      positions[i * 3 + 2] = r * Math.cos(phi);

      const c = cInner
        .clone()
        .lerp(cMid, Math.min(1, (r - 1.8) / 3))
        .lerp(cOuter, Math.max(0, (r - 4.5) / 2.5));
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    return { positions, colors };
  }, []);

  useFrame((s, d) => {
    if (!group.current) return;
    group.current.rotation.y += d * 0.04;
  });

  return (
    <group ref={group}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.04}
          sizeAttenuation
          vertexColors
          transparent
          opacity={0.75}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

export default function CrystalNebula() {
  return (
    <>
      <ambientLight intensity={0.45} />
      <directionalLight position={[4, 4, 5]} intensity={1.2} color="#ffffff" />
      <pointLight position={[-3, 2, -2]} intensity={1.3} color="#ff6b35" />
      <pointLight position={[3, -2, 2]} intensity={1.0} color="#5fc9f8" />
      <Environment preset="studio" />
      <Dust />
      <Cluster />
      <Sparkles count={60} scale={[10, 6, 6]} size={1.4} speed={0.25} color="#ffd166" />
      <Stars radius={70} depth={40} count={1400} factor={2.5} fade saturation={0} />
    </>
  );
}
