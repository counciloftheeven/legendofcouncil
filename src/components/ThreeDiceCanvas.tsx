import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ThreeDiceCanvasProps {
  zarlar: number[]; // e.g. [1, -1, 0, 1]
  isRolling: boolean;
  onSettle?: () => void;
  haneRenk?: string;
}

// Cache textures globally so they are created once and reused across rolls
let cachedTextures: THREE.Material[] | null = null;

function getSharedMaterials(): THREE.Material[] {
  if (cachedTextures) return cachedTextures;

  const texPlus = createFaceTexture('+', '#f59e0b', '#1a140d'); // Amber Gold
  const texMinus = createFaceTexture('−', '#ef4444', '#1f1111'); // Blood Red
  const texZero = createFaceTexture('○', '#867664', '#151311'); // Slate Grey

  const matPlus = new THREE.MeshStandardMaterial({
    map: texPlus,
    roughness: 0.35,
    metalness: 0.3,
  });
  const matMinus = new THREE.MeshStandardMaterial({
    map: texMinus,
    roughness: 0.35,
    metalness: 0.3,
  });
  const matZero = new THREE.MeshStandardMaterial({
    map: texZero,
    roughness: 0.45,
    metalness: 0.2,
  });

  // 0: +X (-), 1: -X (-), 2: +Y (+), 3: -Y (+), 4: +Z (0), 5: -Z (0)
  cachedTextures = [matMinus, matMinus, matPlus, matPlus, matZero, matZero];
  return cachedTextures;
}
function createFaceTexture(symbol: string, color: string, bg: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  // Dark stone / metallic base
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 256, 256);

  // Outer carved border
  ctx.strokeStyle = '#4a3828';
  ctx.lineWidth = 14;
  ctx.strokeRect(12, 12, 232, 232);

  // Inner filigree frame
  ctx.strokeStyle = color;
  ctx.lineWidth = 4;
  ctx.strokeRect(26, 26, 204, 204);

  // Corner rivets
  ctx.fillStyle = color;
  ctx.fillRect(32, 32, 8, 8);
  ctx.fillRect(216, 32, 8, 8);
  ctx.fillRect(32, 216, 8, 8);
  ctx.fillRect(216, 216, 8, 8);

  // Rune symbol in center
  ctx.font = '900 120px "Cinzel", "Crimson Pro", serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = color;
  ctx.shadowColor = color;
  ctx.shadowBlur = 12;
  ctx.fillText(symbol, 128, 134);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

interface SingleDieProps {
  position: [number, number, number];
  targetValue: number; // -1, 0, or 1
  isRolling: boolean;
  materials: THREE.Material[];
  delay: number;
}

const SingleDie: React.FC<SingleDieProps> = ({
  position,
  targetValue,
  isRolling,
  materials,
  delay,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);

  // Target Euler rotation based on face mapping:
  // Materials:
  // 0: +X (-1)
  // 1: -X (-1)
  // 2: +Y (+1)
  // 3: -Y (+1)
  // 4: +Z ( 0)
  // 5: -Z ( 0)
  // Camera looks directly along +Z with slight downward angle.
  const targetEuler = useMemo(() => {
    if (targetValue === 1) {
      // Top face (+Y) pointing toward camera
      return new THREE.Euler(-Math.PI * 0.4, 0, (Math.random() > 0.5 ? 0 : Math.PI));
    } else if (targetValue === -1) {
      // Side face (+X or -X) pointing toward camera
      const dir = Math.random() > 0.5 ? Math.PI * 0.5 : -Math.PI * 0.5;
      return new THREE.Euler(0, dir, 0);
    } else {
      // Front face (+Z or -Z) pointing toward camera
      const flip = Math.random() > 0.5 ? 0 : Math.PI;
      return new THREE.Euler(0, flip, 0);
    }
  }, [targetValue]);

  // Rolling state variables
  const rollingState = useRef({
    currentProgress: 1, // 0 to 1
    duration: 1.1 + delay,
    spinVelocity: new THREE.Vector3(0, 0, 0),
    startY: position[1],
    currentRot: new THREE.Euler(0, 0, 0),
  });

  useEffect(() => {
    if (isRolling) {
      rollingState.current.currentProgress = 0;
      rollingState.current.spinVelocity.set(
        (Math.random() - 0.5) * 35,
        (Math.random() - 0.5) * 35,
        (Math.random() - 0.5) * 35
      );
    }
  }, [isRolling]);

  useFrame((_, delta) => {
    if (!meshRef.current) return;

    if (rollingState.current.currentProgress < 1) {
      rollingState.current.currentProgress += delta / rollingState.current.duration;
      const t = Math.min(1, rollingState.current.currentProgress);

      // Bounce arc in Y
      const height = Math.sin(t * Math.PI) * 1.6 * (1 - t * 0.5);
      meshRef.current.position.y = position[1] + height;

      // Tumbling spin that decelerates
      const remainingSpin = (1 - t) * (1 - t);
      meshRef.current.rotation.x += rollingState.current.spinVelocity.x * remainingSpin * delta;
      meshRef.current.rotation.y += rollingState.current.spinVelocity.y * remainingSpin * delta;
      meshRef.current.rotation.z += rollingState.current.spinVelocity.z * remainingSpin * delta;

      // Settle smoothly towards targetEuler near the end (t > 0.65)
      if (t > 0.65) {
        const settleBlend = (t - 0.65) / 0.35;
        meshRef.current.rotation.x = THREE.MathUtils.lerp(
          meshRef.current.rotation.x,
          targetEuler.x,
          settleBlend * 0.2
        );
        meshRef.current.rotation.y = THREE.MathUtils.lerp(
          meshRef.current.rotation.y,
          targetEuler.y,
          settleBlend * 0.2
        );
        meshRef.current.rotation.z = THREE.MathUtils.lerp(
          meshRef.current.rotation.z,
          targetEuler.z,
          settleBlend * 0.2
        );
      }
    } else {
      // Settled state
      meshRef.current.position.y = position[1];
      meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, targetEuler.x, 0.1);
      meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, targetEuler.y, 0.1);
      meshRef.current.rotation.z = THREE.MathUtils.lerp(meshRef.current.rotation.z, targetEuler.z, 0.1);
    }
  });

  return (
    <mesh ref={meshRef} position={position} castShadow receiveShadow material={materials}>
      <boxGeometry args={[1.05, 1.05, 1.05]} />
    </mesh>
  );
};

export const ThreeDiceCanvas: React.FC<ThreeDiceCanvasProps> = ({
  zarlar,
  isRolling,
  onSettle,
  haneRenk = '#d4af37',
}) => {
  // Use shared materials (cached) for 4dF dice
  const materials = useMemo(() => getSharedMaterials(), []);

  const [settled, setSettled] = useState(!isRolling);

  useEffect(() => {
    if (isRolling) {
      setSettled(false);
      const timer = setTimeout(() => {
        setSettled(true);
        if (onSettle) onSettle();
      }, 1250);
      return () => clearTimeout(timer);
    }
  }, [isRolling, onSettle]);

  // Dice X positions in 3D scene
  const positions: [number, number, number][] = [
    [-2.2, 0, 0],
    [-0.75, 0, 0],
    [0.75, 0, 0],
    [2.2, 0, 0],
  ];

  return (
    <div className="relative w-full h-44 sm:h-52 rounded-xl overflow-hidden border-2 border-[#5a432e] bg-[#0d0a08] shadow-inner">
      <Canvas
        camera={{ position: [0, 1.8, 4.6], fov: 42 }}
        shadows
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        frameloop={isRolling || !settled ? 'always' : 'demand'}
      >
        <ambientLight intensity={1.1} />
        <directionalLight position={[4, 8, 5]} intensity={2.2} castShadow shadow-mapSize={512} />
        <pointLight position={[-4, 2, 2]} intensity={1.2} color={haneRenk} />
        <pointLight position={[0, -2, 3]} intensity={0.6} color="#ffffff" />

        {/* Dice tray floor */}
        <mesh position={[0, -0.65, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[12, 8]} />
          <meshStandardMaterial color="#14100c" roughness={0.9} metalness={0.1} />
        </mesh>

        {/* 4 3D Fate Dice */}
        {positions.map((pos, idx) => (
          <SingleDie
            key={idx}
            position={pos}
            targetValue={zarlar[idx] ?? 0}
            isRolling={isRolling}
            materials={materials}
            delay={idx * 0.08}
          />
        ))}
      </Canvas>

      {/* Atmospheric Overlays */}
      <div className="absolute top-2 left-3 text-[10px] uppercase font-mono font-bold text-[#8a7a67] pointer-events-none">
        3D Fate Çanağı (4dF)
      </div>
      {isRolling && (
        <div className="absolute bottom-2 right-3 text-xs font-heading font-bold text-amber-300 animate-pulse pointer-events-none">
          Kader Zarları Dönüyor...
        </div>
      )}
    </div>
  );
};
