"use client";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Suspense, useRef } from "react";
import { Color, DirectionalLight } from "three";
// @ts-ignore
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { Heading } from "@chakra-ui/react";

const Tree = (
  { position, scale }: { position: [number, number, number]; scale: number } = {
    position: [0, 0, 0],
    scale: 0.25,
  },
) => {
  const fbx = useLoader(FBXLoader, "/objects/prefab_beech_tree_04.fbx");
  return <primitive object={fbx} scale={0.25} position={position} />;
};

export function RotatingLights() {
  const directionalLightRef = useRef<DirectionalLight>(null!);
  const directionalLightRef2 = useRef<DirectionalLight>(null!);
  let time = 0;

  useFrame(() => {
    if (directionalLightRef.current && directionalLightRef2.current) {
      time += 0.01;

      const radius = 1000;
      const x = Math.sin(time) * radius;
      const y = Math.cos(time) * radius;
      directionalLightRef.current.intensity = 1;
      directionalLightRef.current.color = new Color(0, 55, 255);
      directionalLightRef.current.position.set(x, y, 0);
      directionalLightRef2.current.intensity = 1;
      directionalLightRef2.current.color = new Color(255, 55, 0);
      directionalLightRef2.current.position.set(y, x, 0);
    }
  });

  return (
    <>
      <directionalLight ref={directionalLightRef2} />
      <directionalLight ref={directionalLightRef} />
    </>
  );
}

export default function Home() {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Suspense fallback={<div />}>
        <Heading
          position={"absolute"}
          mixBlendMode={"difference"}
          lineHeight={0}
          fontSize={"10em"}
          filter={"blur(2px)"}
        >
          Slaterhaus
        </Heading>
        <Canvas>
          <RotatingLights />
          <Tree position={[0, -200, -400]} scale={0.25} />
        </Canvas>
      </Suspense>
    </div>
  );
}
