import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Preload } from "@react-three/drei";
import Aurora from "./scenes/Aurora.jsx";
import Aperture from "./scenes/Aperture.jsx";
import Constellation from "./scenes/Constellation.jsx";
import LiquidChrome from "./scenes/LiquidChrome.jsx";
import CosmicDust from "./scenes/CosmicDust.jsx";
import GalacticCore from "./scenes/GalacticCore.jsx";
import RefractedCosmos from "./scenes/RefractedCosmos.jsx";
import CrystalNebula from "./scenes/CrystalNebula.jsx";
import OrbAndOrbit from "./scenes/OrbAndOrbit.jsx";

const SCENES = {
  aurora: Aurora,
  aperture: Aperture,
  constellation: Constellation,
  chrome: LiquidChrome,
  cosmic: CosmicDust,
  galactic: GalacticCore,
  refracted: RefractedCosmos,
  crystal: CrystalNebula,
  orb: OrbAndOrbit,
};

export default function HeroScene({ variant = "aurora" }) {
  const SceneComponent = SCENES[variant] || Aurora;
  return (
    <Canvas
      key={variant}
      dpr={[1, 2]}
      camera={{ position: [0, 0, 6], fov: 50 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ position: "absolute", inset: 0 }}
    >
      <Suspense fallback={null}>
        <color attach="background" args={["#0a0a0f"]} />
        <SceneComponent />
        <Preload all />
      </Suspense>
    </Canvas>
  );
}
