import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, Sparkles, Stars } from "@react-three/drei";
import * as THREE from "three";

const BLADE_COUNT = 9;

function Blade({ angle, scale }) {
  const ref = useRef();
  // Triangular blade pointing inward, rotated to angle
  const shape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, 0);
    s.lineTo(0.55, 1.6);
    s.lineTo(-0.55, 1.6);
    s.lineTo(0, 0);
    return s;
  }, []);
  const geom = useMemo(() => {
    const g = new THREE.ExtrudeGeometry(shape, { depth: 0.05, bevelEnabled: false });
    return g;
  }, [shape]);
  return (
    <mesh ref={ref} rotation={[0, 0, angle]} scale={scale}>
      <primitive object={geom} attach="geometry" />
      <meshStandardMaterial
        color="#ffb56b"
        metalness={0.6}
        roughness={0.25}
        emissive="#ff6b35"
        emissiveIntensity={0.25}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function Aperture() {
  const group = useRef();
  const blades = useRef();
  const dots = useRef();
  const target = useRef({ x: 0, y: 0 });
  const t0 = useRef(0);

  useFrame((state, delta) => {
    t0.current += delta;
    const { mouse } = state;
    target.current.x = mouse.x * 0.4;
    target.current.y = mouse.y * 0.4;
    if (group.current) {
      group.current.rotation.y += (target.current.x - group.current.rotation.y) * 0.05;
      group.current.rotation.x += (-target.current.y - group.current.rotation.x) * 0.05;
    }
    if (blades.current) {
      // slow rotation + breathing scale (open/close)
      blades.current.rotation.z += delta * 0.08;
      const breathe = 0.92 + Math.sin(t0.current * 0.6) * 0.08;
      blades.current.scale.setScalar(breathe);
    }
    if (dots.current) dots.current.rotation.z -= delta * 0.15;
  });

  const angles = useMemo(
    () => Array.from({ length: BLADE_COUNT }, (_, i) => (i * Math.PI * 2) / BLADE_COUNT),
    []
  );

  // Outer focus dots around the iris
  const dotPositions = useMemo(() => {
    const r = 3.0;
    return Array.from({ length: 24 }, (_, i) => {
      const a = (i * Math.PI * 2) / 24;
      return [Math.cos(a) * r, Math.sin(a) * r, 0];
    });
  }, []);

  return (
    <group ref={group}>
      {/* Glowing center of aperture */}
      <mesh>
        <circleGeometry args={[0.4, 32]} />
        <meshBasicMaterial color="#ffd166" />
      </mesh>
      <pointLight position={[0, 0, 1]} intensity={2.5} color="#ff6b35" distance={6} />

      {/* Aperture blades */}
      <group ref={blades}>
        {angles.map((a, i) => (
          <Blade key={i} angle={a} scale={1} />
        ))}
      </group>

      {/* Outer ring of focus marks */}
      <group ref={dots}>
        {dotPositions.map((p, i) => (
          <mesh key={i} position={p}>
            <sphereGeometry args={[i % 4 === 0 ? 0.05 : 0.025, 12, 12]} />
            <meshBasicMaterial color="#5fc9f8" />
          </mesh>
        ))}
      </group>

      {/* Subtle outer ring */}
      <mesh>
        <torusGeometry args={[3.4, 0.006, 16, 100]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.25} />
      </mesh>
    </group>
  );
}

export default function ApertureScene() {
  return (
    <>
      <ambientLight intensity={0.25} />
      <directionalLight position={[3, 4, 5]} intensity={1} color="#ffd166" />
      <pointLight position={[-5, -3, -2]} intensity={0.7} color="#5fc9f8" />
      <Float speed={0.6} rotationIntensity={0.2} floatIntensity={0.3}>
        <Aperture />
      </Float>
      <Sparkles count={80} scale={[10, 6, 6]} size={1.6} speed={0.3} color="#ffd166" />
      <Stars radius={50} depth={30} count={900} factor={2} fade saturation={0} />
    </>
  );
}
