"use client";
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { Suspense, useRef, useState } from 'react';
import { AmbientLight, Color, DirectionalLight, Mesh } from 'three';
// @ts-ignore
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'

const Model = () => {
  const {height} = useThree((state) => state.viewport);
  const fbx = useLoader(FBXLoader, "/objects/prefab_beech_tree_04.fbx")

  return <primitive object={fbx} scale={.25} position={[0, -height * 25, -400]}/>;
};

function RotatingLights() {
  const directionalLightRef = useRef<DirectionalLight>(null!);
  const directionalLightRef2 = useRef<DirectionalLight>(null!);
  let time = 0;

  useFrame(() => {
    if (directionalLightRef.current && directionalLightRef2.current) {
      time += 0.01;

      const radius = 1000;
      const x = Math.sin(time) * radius;
      const y = Math.cos(time) * radius;
      directionalLightRef.current.intensity = 1
      directionalLightRef.current.color = new Color(0, 55, 255)
      directionalLightRef.current.position.set(x, y, 0);
      directionalLightRef2.current.intensity = 1
      directionalLightRef2.current.color = new Color(255, 55, 0)
      directionalLightRef2.current.position.set(y, x, 0);
    }
  });

  return (
      <>
        <directionalLight ref={directionalLightRef2} />
        <directionalLight ref={directionalLightRef}/>
      </>
  );
}

export default function Home() {


  return (
      <div style={{width: '100vw', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <Canvas>
          {/*<ambientLight intensity={1.0} position={[0, 0, -5]}/>*/}
          {/*<directionalLight color="white" position={[0, -10, -70]} intensity={1000}/>*/}
          {/*<SpinningMesh/>*/}
          <RotatingLights/>
          <Suspense>
            <Model/>
          </Suspense>
        </Canvas>
      </div>
  );
}

function SpinningMesh() {
  // This reference will give us direct access to the mesh
  const mesh = useRef<Mesh>(null!)


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