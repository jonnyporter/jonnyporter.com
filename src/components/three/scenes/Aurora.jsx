import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sparkles, Stars } from "@react-three/drei";

function Centerpiece() {
  const group = useRef();
  const inner = useRef();
  const ringA = useRef();
  const ringB = useRef();
  const target = useRef({ x: 0, y: 0 });

  useFrame((state, delta) => {
    const { mouse } = state;
    target.current.x = mouse.x * 0.5;
    target.current.y = mouse.y * 0.5;
    if (group.current) {
      group.current.rotation.y +=
        (target.current.x - group.current.rotation.y) * 0.05;
      group.current.rotation.x +=
        (-target.current.y - group.current.rotation.x) * 0.05;
    }
    if (inner.current) {
      inner.current.rotation.y += delta * 0.15;
      inner.current.rotation.x += delta * 0.08;
    }
    if (ringA.current) ringA.current.rotation.z += delta * 0.2;
    if (ringB.current) ringB.current.rotation.z -= delta * 0.12;
  });

  return (
    <group ref={group}>
      <Float speed={1.2} rotationIntensity={0.4} floatIntensity={0.7}>
        <mesh ref={inner} castShadow>
          <icosahedronGeometry args={[1.4, 4]} />
          <MeshDistortMaterial
            color="#ff6b35"
            distort={0.45}
            speed={1.4}
            roughness={0.15}
            metalness={0.85}
            emissive="#ff3300"
            emissiveIntensity={0.25}
          />
        </mesh>
        <mesh>
          <icosahedronGeometry args={[2.0, 1]} />
          <meshBasicMaterial color="#5fc9f8" wireframe transparent opacity={0.18} />
        </mesh>
        <mesh ref={ringA} rotation={[Math.PI / 3, 0, 0]}>
          <torusGeometry args={[2.6, 0.012, 16, 100]} />
          <meshBasicMaterial color="#b794f4" transparent opacity={0.55} />
        </mesh>
        <mesh ref={ringB} rotation={[Math.PI / 5, Math.PI / 4, 0]}>
          <torusGeometry args={[3.1, 0.008, 16, 100]} />
          <meshBasicMaterial color="#ffd166" transparent opacity={0.45} />
        </mesh>
      </Float>
    </group>
  );
}

function FloatingShape({ position, color, type, scale }) {
  const ref = useRef();
  useFrame((s, d) => {
    if (!ref.current) return;
    ref.current.rotation.x += d * 0.4;
    ref.current.rotation.y += d * 0.3;
  });
  const geo = useMemo(() => {
    if (type === "octa") return <octahedronGeometry args={[1, 0]} />;
    if (type === "torus") return <torusGeometry args={[0.5, 0.18, 16, 32]} />;
    return <tetrahedronGeometry args={[1, 0]} />;
  }, [type]);
  return (
    <Float speed={1 + Math.random()} rotationIntensity={0.5} floatIntensity={1.5}>
      <mesh ref={ref} position={position} scale={scale}>
        {geo}
        <meshStandardMaterial
          color={color}
          metalness={0.8}
          roughness={0.2}
          emissive={color}
          emissiveIntensity={0.15}
        />
      </mesh>
    </Float>
  );
}

export default function Aurora() {
  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[5, 5, 5]} intensity={1.1} color="#ffd166" />
      <pointLight position={[-4, -4, -4]} intensity={0.9} color="#5fc9f8" />
      <pointLight position={[4, -2, 3]} intensity={0.6} color="#b794f4" />
      <Centerpiece />
      <FloatingShape position={[-3.2, 1.6, -1]} color="#5fc9f8" type="tetra" scale={0.35} />
      <FloatingShape position={[3.0, -1.4, -1]} color="#ffd166" type="octa" scale={0.4} />
      <FloatingShape position={[-2.6, -1.8, 0.5]} color="#b794f4" type="torus" scale={0.6} />
      <FloatingShape position={[2.4, 1.8, 0.2]} color="#ff6b35" type="tetra" scale={0.3} />
      <Sparkles count={120} scale={[10, 6, 6]} size={2} speed={0.4} color="#ffd166" />
      <Stars radius={50} depth={30} count={1200} factor={3} fade saturation={0} />
    </>
  );
}
