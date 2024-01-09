"use client";
import React from 'react';
import { FirstPersonControls, PointerLockControls, OrbitControls, CameraControls, KeyboardControls } from '@react-three/drei';
import { Euler, TextureLoader, Vector3 } from 'three';
import { Canvas, useLoader } from "@react-three/fiber";
import { ArtPanel } from "@/components/museum/art-panel";
import { Floor } from "@/components/museum/floor";


function Gallery() {
  // Load textures for artwork
  const textures = useLoader(TextureLoader, [
    '/img/cora_corn.jpg',
  ]);

  // Create materials for each artwork
  // const materials = textures.map(texture => new MeshStandardMaterial({ map: texture }));

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
          <ambientLight intensity={0.5}/>
          <pointLight position={[10, 10, 10]}/>
          <ArtPanel image={'/img/cora_corn.jpg'} color={"white"} position={new Vector3(0, 0, 4)} rotation={undefined}
                    size={undefined}/>
          <Floor position={new Vector3(0,0,0)} rotation={new Euler(2, 0, 0)} size={
            [10, 10, 10, 10, 10, 10]
          } color={"white"} />
          {/*<OrbitControls />*/}
          {/*<FirstPersonControls/>*/}
          <CameraControls />
        </Canvas>
      </div>
  );
}

export default Gallery;