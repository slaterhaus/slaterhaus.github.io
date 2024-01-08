"use client";
import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useState } from 'react';
import { Mesh } from 'three';
import { Container } from "@chakra-ui/react";

export default function Home() {
  return (
      <div style={{width: '100vw', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <Canvas>
          <ambientLight intensity={0.1}/>
          <directionalLight color="white" position={[0, 0, 5]}/>
          <SpinningMesh/>
        </Canvas>
      </div>
  );
}

function SpinningMesh() {
  // This reference will give us direct access to the mesh
  const mesh = useRef<Mesh>();

  // Set up state for the hovered and active state
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);

  // Subscribe this component to the render-loop, rotate the mesh every frame
  useFrame(() => {
    if (mesh.current) {
      mesh.current.rotation.x = mesh.current.rotation.y += .01;
    }
  });

  // Return the view, these are regular three.js elements expressed in JSX
  return (
      <mesh
          ref={mesh}
          scale={active ? 1.5 : 1}
          onClick={(event) => setActive(!active)}
          onPointerOver={(event) => setHover(true)}
          onPointerOut={(event) => setHover(false)}>
        <boxGeometry args={[1, 1, 1]}/>
        <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'}/>
      </mesh>
  );
}