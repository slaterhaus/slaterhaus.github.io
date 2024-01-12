"use client";
import { CubeGrid } from "@/components/cube-grid";
import { useThree } from "@react-three/fiber";
import { Center, Cloud, Text3D } from "@react-three/drei";
import { Suspense } from "react";
import { Vector3 } from "three";

export default function Home() {
  const { camera } = useThree();
  const p = camera.position;
  return (
    <>
      <spotLight
        color="white"
        position={[p.x, p.y, p.z + 0.1]}
        intensity={50}
      />

      <directionalLight color="blue" position={[0, 5, -5]} intensity={5} />

      {Array(10)
        .fill(0)
        .map((it, i) => (
          <CubeGrid z={-i + 2} key={`cube-grid-${i}`} />
        ))}
      <ambientLight intensity={5} castShadow/>
      <Text3D
          // color="#f0f0f0" // Text color
          size={1}
          // maxWidth={200}
          lineHeight={1}
          letterSpacing={0.02}
          // textAlign={'left'}
          font="/fonts/battlesbridge.json"
          // anchorX="center"
          // anchorY="middle"
          position={new Vector3(-6, 0, -5)}
          castShadow
          // material={{
          //   transparent: true,
          //   opacity: 0.5
          // }}
      >
        Slaterhaus
      </Text3D>


    </>
  );
}
