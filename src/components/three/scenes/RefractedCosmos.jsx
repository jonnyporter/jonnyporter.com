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
 * A glass dodecahedron in front of a warm cosmic particle field.
 * Particles refract through the glass for a subtle prism effect.
 */

function ParticleField() {
  const group = useRef();
  const target = useRef({ x: 0, y: 0 });

  const { positions, colors } = useMemo(() => {
    const COUNT = 4500;
    const positions = new Float32Array(COUNT * 3);
    const colors = new Float32Array(COUNT * 3);
    const cInner = new THREE.Color("#ffd166");
    const cMid = new THREE.Color("#ff6b35");
    const cOuter = new THREE.Color("#5fc9f8");
    const cAccent = new THREE.Color("#b794f4");
    for (let i = 0; i < COUNT; i++) {
      // Volumetric cloud, biased behind the foreground glass
      const r = 2 + Math.pow(Math.random(), 1.3) * 6;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.6;
      // Push most particles behind the camera target plane (z<0)
      positions[i * 3 + 2] = r * Math.cos(phi) - 1.5;

      const t = Math.random();
      const c =
        t < 0.4
          ? cInner.clone().lerp(cMid, t / 0.4)
          : t < 0.75
          ? cMid.clone().lerp(cOuter, (t - 0.4) / 0.35)
          : cOuter.clone().lerp(cAccent, (t - 0.75) / 0.25);
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    return { positions, colors };
  }, []);

  useFrame((state, delta) => {
    const { mouse } = state;
    target.current.x = mouse.x * 0.15;
    target.current.y = mouse.y * 0.15;
    if (group.current) {
      group.current.rotation.y += delta * 0.04;
      group.current.rotation.y +=
        (target.current.x - (group.current.rotation.y % (Math.PI * 2))) * 0.005;
    }
  });

  return (
    <group ref={group}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.05}
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

function Lens() {
  const group = useRef();
  const mesh = useRef();
  const target = useRef({ x: 0, y: 0 });

  useFrame((state, delta) => {
    const { mouse } = state;
    target.current.x = mouse.x * 0.6;
    target.current.y = mouse.y * 0.6;
    if (group.current) {
      group.current.rotation.y +=
        (target.current.x - group.current.rotation.y) * 0.05;
      group.current.rotation.x +=
        (-target.current.y - group.current.rotation.x) * 0.05;
    }
    if (mesh.current) {
      mesh.current.rotation.y += delta * 0.12;
      mesh.current.rotation.x += delta * 0.05;
    }
  });

  return (
    <group ref={group}>
      <Float speed={0.8} rotationIntensity={0.2} floatIntensity={0.35}>
        <mesh ref={mesh} scale={1.55} position={[0, 0, 1]}>
          <dodecahedronGeometry args={[1, 0]} />
          <MeshTransmissionMaterial
            backside
            samples={6}
            thickness={1.4}
            chromaticAberration={0.7}
            anisotropy={0.4}
            distortion={0.4}
            distortionScale={0.5}
            temporalDistortion={0.05}
            ior={1.55}
            color="#ffffff"
            roughness={0.04}
            transmission={1}
          />
        </mesh>
      </Float>
    </group>
  );
}

export default function RefractedCosmos() {
  return (
    <>
      <ambientLight intensity={0.45} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} color="#ffffff" />
      <pointLight position={[-4, 2, -2]} intensity={1.4} color="#ff6b35" />
      <pointLight position={[4, -2, -3]} intensity={1.0} color="#5fc9f8" />
      <Environment preset="night" />
      <ParticleField />
      <Lens />
      <Sparkles count={60} scale={[12, 6, 8]} size={1.3} speed={0.2} color="#ffd166" />
      <Stars radius={70} depth={40} count={1500} factor={2.5} fade saturation={0} />
    </>
  );
}
