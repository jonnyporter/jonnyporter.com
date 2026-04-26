import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Environment, Float, MeshTransmissionMaterial } from "@react-three/drei";

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
      <Float speed={1.0} rotationIntensity={0.25} floatIntensity={0.4}>
        <mesh ref={mesh} scale={1.0}>
          <torusKnotGeometry args={[1.0, 0.34, 200, 32]} />
          <MeshTransmissionMaterial
            backside
            samples={6}
            thickness={1.2}
            chromaticAberration={0.4}
            anisotropy={0.3}
            distortion={0.3}
            distortionScale={0.4}
            temporalDistortion={0.05}
            ior={1.4}
            color="#ffffff"
            roughness={0.05}
            transmission={1}
          />
        </mesh>
      </Float>

      {/* Soft accent ring behind */}
      <mesh position={[0, 0, -2]}>
        <ringGeometry args={[2.4, 2.42, 96]} />
        <meshBasicMaterial color="#ff6b35" transparent opacity={0.6} />
      </mesh>
    </group>
  );
}

export default function LiquidChromeScene() {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={1.4} color="#ffffff" />
      <pointLight position={[-4, 2, 3]} intensity={1.1} color="#ff6b35" />
      <pointLight position={[4, -2, -2]} intensity={0.9} color="#5fc9f8" />
      <Environment preset="studio" />
      <Knot />
    </>
  );
}
