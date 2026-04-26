import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Environment, Float, Sparkles, Stars } from "@react-three/drei";
import * as THREE from "three";

/**
 * A pearly chrome sphere with a flat ring of warm cosmic particles
 * orbiting around it (Saturn-style, but warmer).
 */

function Orb() {
  const ref = useRef();
  useFrame((s, d) => {
    if (!ref.current) return;
    ref.current.rotation.y += d * 0.1;
  });
  return (
    <Float speed={0.5} rotationIntensity={0.15} floatIntensity={0.25}>
      <mesh ref={ref}>
        <sphereGeometry args={[1.05, 96, 96]} />
        <meshStandardMaterial
          color="#fff7ea"
          metalness={1}
          roughness={0.08}
          envMapIntensity={1.4}
        />
      </mesh>
    </Float>
  );
}

function Ring() {
  const points = useRef();
  const group = useRef();
  const target = useRef({ x: 0, y: 0 });

  const { positions, colors, sizes } = useMemo(() => {
    const COUNT = 5000;
    const positions = new Float32Array(COUNT * 3);
    const colors = new Float32Array(COUNT * 3);
    const sizes = new Float32Array(COUNT);
    const cInner = new THREE.Color("#ffd166");
    const cMid = new THREE.Color("#ff6b35");
    const cOuter = new THREE.Color("#b794f4");

    const innerR = 1.6;
    const outerR = 3.8;
    for (let i = 0; i < COUNT; i++) {
      const r = innerR + Math.pow(Math.random(), 0.7) * (outerR - innerR);
      const theta = Math.random() * Math.PI * 2;
      // Thin disc with subtle vertical jitter
      const yJitter = (Math.random() - 0.5) * 0.08 * (1 + (r - innerR) / 2);
      positions[i * 3] = Math.cos(theta) * r;
      positions[i * 3 + 1] = yJitter;
      positions[i * 3 + 2] = Math.sin(theta) * r;

      const t = (r - innerR) / (outerR - innerR);
      const c =
        t < 0.5
          ? cInner.clone().lerp(cMid, t * 2)
          : cMid.clone().lerp(cOuter, (t - 0.5) * 2);
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;

      sizes[i] = 0.02 + Math.random() * 0.05;
    }
    return { positions, colors, sizes };
  }, []);

  useFrame((state, delta) => {
    const { mouse } = state;
    target.current.x = mouse.x * 0.4;
    target.current.y = mouse.y * 0.4;
    if (group.current) {
      group.current.rotation.y += delta * 0.12;
      group.current.rotation.x +=
        (-target.current.y - group.current.rotation.x) * 0.04;
      group.current.rotation.z +=
        (target.current.x * 0.5 - group.current.rotation.z) * 0.03;
    }
  });

  return (
    <group ref={group} rotation={[Math.PI / 7, 0, 0]}>
      <points ref={points}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.05}
          sizeAttenuation
          vertexColors
          transparent
          opacity={0.95}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

export default function OrbAndOrbit() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 4, 5]} intensity={1.4} color="#ffffff" />
      <pointLight position={[-4, 2, 2]} intensity={1.3} color="#ff6b35" />
      <pointLight position={[4, -2, -2]} intensity={1.0} color="#5fc9f8" />
      <Environment preset="studio" />
      <Orb />
      <Ring />
      <Sparkles count={70} scale={[12, 6, 6]} size={1.2} speed={0.2} color="#ffffff" />
      <Stars radius={70} depth={40} count={1400} factor={2.5} fade saturation={0} />
    </>
  );
}
