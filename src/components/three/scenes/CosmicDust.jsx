import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Sparkles, Stars } from "@react-three/drei";
import * as THREE from "three";

function Galaxy() {
  const group = useRef();
  const points = useRef();
  const target = useRef({ x: 0, y: 0 });

  const { positions, colors } = useMemo(() => {
    const COUNT = 6000;
    const positions = new Float32Array(COUNT * 3);
    const colors = new Float32Array(COUNT * 3);
    const cInner = new THREE.Color("#ffd166");
    const cMid = new THREE.Color("#ff6b35");
    const cOuter = new THREE.Color("#5fc9f8");
    for (let i = 0; i < COUNT; i++) {
      const radius = Math.pow(Math.random(), 1.4) * 5.5;
      const branchAngle = ((i % 4) / 4) * Math.PI * 2;
      const spinAngle = radius * 1.2;
      const randX = (Math.random() - 0.5) * 0.6 * radius * 0.4;
      const randY = (Math.random() - 0.5) * 0.6 * radius * 0.2;
      const randZ = (Math.random() - 0.5) * 0.6 * radius * 0.4;
      positions[i * 3] = Math.cos(branchAngle + spinAngle) * radius + randX;
      positions[i * 3 + 1] = randY;
      positions[i * 3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randZ;

      const c = cInner
        .clone()
        .lerp(cMid, Math.min(1, radius / 3))
        .lerp(cOuter, Math.max(0, (radius - 3) / 3));
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    return { positions, colors };
  }, []);

  useFrame((state, delta) => {
    const { mouse } = state;
    target.current.x = mouse.x * 0.3;
    target.current.y = mouse.y * 0.3;
    if (group.current) {
      group.current.rotation.y += delta * 0.05;
      group.current.rotation.x +=
        (-target.current.y * 0.3 - group.current.rotation.x) * 0.04;
    }
  });

  return (
    <group ref={group} rotation={[Math.PI / 5, 0, 0]}>
      <points ref={points}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.045}
          sizeAttenuation
          vertexColors
          transparent
          opacity={0.9}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
      {/* Bright core */}
      <mesh>
        <sphereGeometry args={[0.3, 24, 24]} />
        <meshBasicMaterial color="#fff7d6" />
      </mesh>
      <pointLight position={[0, 0, 0]} intensity={3} color="#ffd166" distance={8} />
    </group>
  );
}

export default function CosmicDustScene() {
  return (
    <>
      <ambientLight intensity={0.2} />
      <Galaxy />
      <Sparkles count={140} scale={[14, 8, 8]} size={1.5} speed={0.25} color="#ffffff" />
      <Stars radius={80} depth={50} count={2200} factor={3} fade saturation={0} />
    </>
  );
}
