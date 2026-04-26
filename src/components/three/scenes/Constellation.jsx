import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import * as THREE from "three";

const NODE_COUNT = 80;
const RADIUS = 3.2;
const MAX_LINK_DIST = 1.4;

function buildPoints() {
  const pts = [];
  for (let i = 0; i < NODE_COUNT; i++) {
    // Distribute on a sphere with some jitter
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = RADIUS * (0.6 + Math.random() * 0.4);
    pts.push(
      new THREE.Vector3(
        Math.cos(theta) * Math.sin(phi) * r,
        Math.sin(theta) * Math.sin(phi) * r,
        Math.cos(phi) * r
      )
    );
  }
  return pts;
}

function buildEdges(pts) {
  const verts = [];
  const colors = [];
  const c1 = new THREE.Color("#5fc9f8");
  const c2 = new THREE.Color("#b794f4");
  for (let i = 0; i < pts.length; i++) {
    for (let j = i + 1; j < pts.length; j++) {
      const d = pts[i].distanceTo(pts[j]);
      if (d < MAX_LINK_DIST) {
        verts.push(pts[i].x, pts[i].y, pts[i].z, pts[j].x, pts[j].y, pts[j].z);
        const t = 1 - d / MAX_LINK_DIST;
        const c = c1.clone().lerp(c2, 1 - t);
        colors.push(c.r, c.g, c.b, c.r, c.g, c.b);
      }
    }
  }
  return { verts: new Float32Array(verts), colors: new Float32Array(colors) };
}

function Mesh() {
  const group = useRef();
  const points = useRef();
  const target = useRef({ x: 0, y: 0 });

  const { pts, edges, nodePositions } = useMemo(() => {
    const pts = buildPoints();
    const edges = buildEdges(pts);
    const nodePositions = new Float32Array(pts.length * 3);
    pts.forEach((p, i) => {
      nodePositions[i * 3] = p.x;
      nodePositions[i * 3 + 1] = p.y;
      nodePositions[i * 3 + 2] = p.z;
    });
    return { pts, edges, nodePositions };
  }, []);

  useFrame((state, delta) => {
    const { mouse } = state;
    target.current.x = mouse.x * 0.6;
    target.current.y = mouse.y * 0.6;
    if (group.current) {
      group.current.rotation.y += delta * 0.04;
      group.current.rotation.y +=
        (target.current.x - (group.current.rotation.y % (Math.PI * 2))) * 0.005;
      group.current.rotation.x +=
        (-target.current.y - group.current.rotation.x) * 0.04;
    }
  });

  return (
    <group ref={group}>
      {/* Lines */}
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[edges.verts, 3]}
          />
          <bufferAttribute attach="attributes-color" args={[edges.colors, 3]} />
        </bufferGeometry>
        <lineBasicMaterial vertexColors transparent opacity={0.5} />
      </lineSegments>

      {/* Nodes */}
      <points ref={points}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[nodePositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.06}
          color="#ffd166"
          sizeAttenuation
          transparent
          opacity={0.95}
        />
      </points>

      {/* Center accent */}
      <mesh>
        <icosahedronGeometry args={[0.35, 1]} />
        <meshStandardMaterial
          color="#ff6b35"
          emissive="#ff6b35"
          emissiveIntensity={0.6}
          metalness={0.3}
          roughness={0.4}
        />
      </mesh>
    </group>
  );
}

export default function ConstellationScene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[0, 0, 0]} intensity={1.4} color="#ff6b35" distance={6} />
      <Mesh />
      <Stars radius={60} depth={40} count={1500} factor={3} fade saturation={0} />
    </>
  );
}
