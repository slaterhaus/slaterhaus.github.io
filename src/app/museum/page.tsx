"use client";
import React from "react";
import { CameraControls } from "@react-three/drei";
import { Euler, Vector3 } from "three";
import { Canvas } from "@react-three/fiber";
import { ArtPanel } from "@/components/museum/art-panel";
import { Floor } from "@/components/museum/floor";

export function Gallery() {
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
      <Canvas>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <ArtPanel
          image={"/img/cora_corn.jpg"}
          color={"white"}
          position={new Vector3(0, 0, 0)}
          rotation={undefined}
          size={undefined}
        />
        <CameraControls />
      </Canvas>
    </div>
  );
}

export default Gallery;
