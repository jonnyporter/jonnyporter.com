import React, { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Environment,
  Float,
  Lightformer,
  MeshTransmissionMaterial,
  Sparkles,
  Stars,
} from "@react-three/drei";
import { AdditiveBlending, Color } from "three";

/**
 * Galactic Core: a refractive chrome torus knot at the eye of a
 * swirling spiral galaxy. The knot rotates and parallaxes with the
 * cursor; particles spiral around it.
 *
 * Loaded lazily by Hero.jsx. Rendering pauses whenever the hero is
 * off screen, and the studio lighting is built from in-scene panels
 * so nothing is fetched from a CDN at runtime.
 */

// Pointer position in -1..1, tracked on the window so the parallax keeps
// working while the cursor is over the headline (which sits above the canvas).
const pointer = { x: 0, y: 0 };

function usePointer() {
  useEffect(() => {
    const onMove = (e) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);
}

function Knot({ lowPower }) {
  const group = useRef();
  const mesh = useRef();

  useFrame((_, delta) => {
    const tx = pointer.x * 0.5;
    const ty = pointer.y * 0.5;
    if (group.current) {
      group.current.rotation.y += (tx - group.current.rotation.y) * 0.04;
      group.current.rotation.x += (-ty - group.current.rotation.x) * 0.04;
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
          <torusKnotGeometry args={[1.0, 0.32, lowPower ? 140 : 200, 32]} />
          <MeshTransmissionMaterial
            backside={!lowPower}
            samples={lowPower ? 3 : 4}
            resolution={lowPower ? 256 : 512}
            backsideResolution={256}
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

function Spiral({ count }) {
  const group = useRef();

  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const cInner = new Color("#ffd166");
    const cMid = new Color("#ff6b35");
    const cOuter = new Color("#5fc9f8");
    const c = new Color();
    for (let i = 0; i < count; i++) {
      // Bias particles to a wider ring so the knot is visible inside the eye
      const radius = 1.6 + Math.pow(Math.random(), 1.2) * 5.0;
      const branchAngle = ((i % 4) / 4) * Math.PI * 2;
      const spinAngle = radius * 1.1;
      const randX = (Math.random() - 0.5) * 0.5 * radius * 0.4;
      const randY = (Math.random() - 0.5) * 0.5 * radius * 0.18;
      const randZ = (Math.random() - 0.5) * 0.5 * radius * 0.4;
      positions[i * 3] = Math.cos(branchAngle + spinAngle) * radius + randX;
      positions[i * 3 + 1] = randY;
      positions[i * 3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randZ;

      c.copy(cInner)
        .lerp(cMid, Math.min(1, (radius - 1.6) / 2.5))
        .lerp(cOuter, Math.max(0, (radius - 4) / 3));
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    return { positions, colors };
  }, [count]);

  useFrame((_, delta) => {
    if (!group.current) return;
    group.current.rotation.y += delta * 0.06;
    group.current.rotation.x +=
      (-pointer.y * 0.06 - (group.current.rotation.x - Math.PI / 5)) * 0.04;
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
          blending={AdditiveBlending}
        />
      </points>
    </group>
  );
}

/**
 * On wide screens the galaxy sits to the right, clear of the headline.
 * On tall ones it drops below it and hangs off the right edge.
 */
function Rig({ children }) {
  const { viewport } = useThree();
  const wide = viewport.aspect > 1.15;
  return (
    <group
      position={
        wide
          ? [viewport.width * 0.2, 0, 0]
          : [viewport.width * 0.22, -viewport.height * 0.14, 0]
      }
      scale={wide ? 1 : 0.8}
    >
      {children}
    </group>
  );
}

function ReadySignal({ onReady }) {
  const fired = useRef(false);
  useFrame(() => {
    if (fired.current) return;
    fired.current = true;
    onReady?.();
  });
  return null;
}

export default function HeroScene({ active = true, reducedMotion = false, onReady }) {
  usePointer();

  const lowPower = useMemo(
    () =>
      typeof window !== "undefined" &&
      (window.innerWidth < 800 || (navigator.hardwareConcurrency || 8) <= 4),
    []
  );

  const frameloop = reducedMotion ? "demand" : active ? "always" : "never";

  return (
    <Canvas
      dpr={[1, lowPower ? 1.25 : 1.5]}
      frameloop={frameloop}
      camera={{ position: [0, 0, 6], fov: 50 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ position: "absolute", inset: 0 }}
    >
      <ambientLight intensity={0.4} />
      <directionalLight position={[4, 4, 5]} intensity={1.0} color="#ffffff" />

      {/* Studio softboxes, rendered once into the environment map. */}
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={3.2} color="#ffffff" position={[0, 5, 0]} rotation-x={Math.PI / 2} scale={[10, 4, 1]} />
        <Lightformer form="rect" intensity={2.4} color="#ffe2c4" position={[-6, 1, 1]} rotation-y={Math.PI / 2} scale={[6, 3, 1]} />
        <Lightformer form="rect" intensity={2.4} color="#cfeaff" position={[6, -1, 1]} rotation-y={-Math.PI / 2} scale={[6, 3, 1]} />
        <Lightformer form="ring" intensity={2} color="#ffffff" position={[0, 0, 7]} scale={3} />
        <Lightformer form="rect" intensity={1.2} color="#ffffff" position={[0, -5, 0]} rotation-x={-Math.PI / 2} scale={[10, 4, 1]} />
      </Environment>

      <Rig>
        <pointLight position={[0, 0, 0]} intensity={2.2} color="#ffd166" distance={4} />
        <pointLight position={[-3, 2, 2]} intensity={0.8} color="#ff6b35" />
        <pointLight position={[3, -2, -2]} intensity={0.6} color="#5fc9f8" />
        <Spiral count={lowPower ? 3200 : 5500} />
        <Knot lowPower={lowPower} />
      </Rig>

      <Sparkles count={80} scale={[12, 6, 6]} size={1.2} speed={0.2} color="#ffffff" />
      <Stars radius={70} depth={40} count={1500} factor={2.5} fade saturation={0} />
      <ReadySignal onReady={onReady} />
    </Canvas>
  );
}
