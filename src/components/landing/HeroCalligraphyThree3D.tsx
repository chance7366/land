"use client";

import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Text } from "@react-three/drei";
import type { Group } from "three";
import { HERO_TAGLINE_LINES } from "@/components/landing/HeroCalligraphy";

const FONT_URL =
  "https://cdn.jsdelivr.net/gh/google/fonts@main/ofl/eastseadokdo/EastSeaDokdo-Regular.ttf";

const LINE_HEX = ["#ffffff", "#fef08a", "#facc15", "#ca8a04"] as const;

function CalligraphyMesh({ compact }: { compact?: boolean }) {
  const group = useRef<Group>(null);
  const fontSize = compact ? 0.32 : 0.42;
  const lineGap = compact ? 0.42 : 0.55;

  const lines = useMemo(
    () =>
      HERO_TAGLINE_LINES.map((line, i) => ({
        text: line.text,
        color: LINE_HEX[i] ?? "#ffffff",
        y: (compact ? 0.85 : 1.05) - i * lineGap,
      })),
    [compact, lineGap],
  );

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    group.current.rotation.y = Math.sin(t * 0.45) * 0.22;
    group.current.rotation.x = Math.cos(t * 0.35) * 0.08;
    group.current.position.y = Math.sin(t * 0.7) * 0.06;
  });

  return (
    <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.35}>
      <group ref={group} position={[-0.15, 0.05, 0]}>
        {lines.map((line) => (
          <Text
            key={line.text}
            font={FONT_URL}
            fontSize={fontSize}
            color={line.color}
            anchorX="left"
            anchorY="middle"
            position={[0, line.y, 0]}
            outlineWidth={0.012}
            outlineColor="#1a1200"
            fillOpacity={1}
          >
            {line.text}
          </Text>
        ))}
      </group>
    </Float>
  );
}

type HeroCalligraphyThree3DProps = {
  className?: string;
  /** Home hero overlay — absolute left, smaller on mobile */
  variant?: "sample" | "hero";
};

/**
 * WebGL 3D calligraphy via React Three Fiber + troika Text.
 */
export function HeroCalligraphyThree3D({
  className = "",
  variant = "sample",
}: HeroCalligraphyThree3DProps) {
  const isHero = variant === "hero";

  return (
    <div
      className={
        isHero
          ? `pointer-events-none absolute left-0 top-2 z-[5] h-[140px] w-[min(100%,220px)] sm:top-3 sm:h-[160px] sm:w-[260px] md:left-2 md:top-16 md:h-[220px] md:w-[320px] lg:left-6 lg:top-20 lg:h-[260px] lg:w-[380px] ${className}`
          : `pointer-events-none h-[220px] w-full sm:h-[260px] md:h-[300px] ${className}`
      }
      aria-hidden="true"
    >
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0.4, 0.15, isHero ? 3.6 : 4.2], fov: isHero ? 40 : 42 }}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      >
        <ambientLight intensity={1.1} />
        <directionalLight position={[3, 4, 5]} intensity={1.4} />
        <directionalLight position={[-3, -1, 2]} intensity={0.35} color="#4dabff" />
        <Suspense fallback={null}>
          <CalligraphyMesh compact={isHero} />
        </Suspense>
      </Canvas>
    </div>
  );
}
