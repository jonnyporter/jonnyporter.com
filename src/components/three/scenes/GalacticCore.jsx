import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import {
  Environment,
  Float,
  MeshTransmissionMaterial,
  Stars,
  Sparkles,
} from "@react-three/drei";
import * as THREE from "three";

/**
 * Chrome torus knot sits inside a swirling spiral galaxy.
 * The knot rotates and parallaxes; particles spiral around it.
 */

function Knot() {
  const group = useRef();
  const mesh = useRef();
  const target = useRef({ x: 0, y: 0 });

  useFrame((state, delta) => {
    const { mouse } = state;
    target.current.x = mouse.x * 0.5;
    target.current.y = mouse.y * 0.5;
    if (group.current) {
      group.current.rotation.y +=
        (target.current.x - group.current.rotation.y) * 0.04;
      group.current.rotation.x +=
        (-target.current.y - group.current.rotation.x) * 0.04;
    }
    if (mesh.current) {
      mesh.current.rotation.y += delta * 0.18;
      mesh.current.rotation.x += delta * 0.06;
    }
  });

  return (
    <group ref={group}>
      <Float speed={0.9} rotationIntensity={0.2} floatIntensity={0.3}>
        <mesh ref={mesh} scale={0.85}>
          <torusKnotGeometry args={[1.0, 0.32, 200, 32]} />
          <MeshTransmissionMaterial
            backside
            samples={5}
            thickness={1.0}
            chromaticAberration={0.45}
            anisotropy={0.3}
            distortion={0.25}
            distortionScale={0.4}
            temporalDistortion={0.05}
            ior={1.45}
            color="#ffffff"
            roughness={0.06}
            transmission={1}
          />
        </mesh>
      </Float>
    </group>
  );
}

function Spiral() {
  const group = useRef();
  const target = useRef({ x: 0, y: 0 });

  const { positions, colors } = useMemo(() => {
    const COUNT = 5500;
    const positions = new Float32Array(COUNT * 3);
    const colors = new Float32Array(COUNT * 3);
    const cInner = new THREE.Color("#ffd166");
    const cMid = new THREE.Color("#ff6b35");
    const cOuter = new THREE.Color("#5fc9f8");
    for (let i = 0; i < COUNT; i++) {
      // Bias particles to a wider ring (so the knot is visible inside the eye)
      const radius = 1.6 + Math.pow(Math.random(), 1.2) * 5.0;
      const branchAngle = ((i % 4) / 4) * Math.PI * 2;
      const spinAngle = radius * 1.1;
      const randX = (Math.random() - 0.5) * 0.5 * radius * 0.4;
      const randY = (Math.random() - 0.5) * 0.5 * radius * 0.18;
      const randZ = (Math.random() - 0.5) * 0.5 * radius * 0.4;
      positions[i * 3] = Math.cos(branchAngle + spinAngle) * radius + randX;
      positions[i * 3 + 1] = randY;
      positions[i * 3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randZ;

      const c = cInner
        .clone()
        .lerp(cMid, Math.min(1, (radius - 1.6) / 2.5))
        .lerp(cOuter, Math.max(0, (radius - 4) / 3));
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    return { positions, colors };
  }, []);

  useFrame((state, delta) => {
    const { mouse } = state;
    target.current.x = mouse.x * 0.2;
    target.current.y = mouse.y * 0.2;
    if (group.current) {
      group.current.rotation.y += delta * 0.06;
      group.current.rotation.x +=
        (-target.current.y * 0.3 - group.current.rotation.x) * 0.04;
    }
  });

  return (
    <group ref={group} rotation={[Math.PI / 5, 0, 0]}>
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
          opacity={0.85}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

export default function GalacticCore() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[4, 4, 5]} intensity={1.0} color="#ffffff" />
      <pointLight position={[0, 0, 0]} intensity={2.2} color="#ffd166" distance={4} />
      <pointLight position={[-3, 2, 2]} intensity={0.8} color="#ff6b35" />
      <pointLight position={[3, -2, -2]} intensity={0.6} color="#5fc9f8" />
      <Environment preset="studio" />
      <Spiral />
      <Knot />
      <Sparkles count={80} scale={[12, 6, 6]} size={1.2} speed={0.2} color="#ffffff" />
      <Stars radius={70} depth={40} count={1500} factor={2.5} fade saturation={0} />
    </>
  );
}
