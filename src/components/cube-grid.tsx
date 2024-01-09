import { useRef, useState } from "react";
import { Mesh, TextureLoader, Vector3 } from "three";
import { useFrame, useLoader } from "@react-three/fiber";

export function Cube({ position }: { position: Vector3 }) {
  const mesh = useRef<Mesh>(null!);
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);

  useFrame(() => {
    if (mesh.current) {
      if (hovered) {
        mesh.current.rotation.y += 0.01;
        // mesh.current.rotation.z += 0.01;
      } else {
        mesh.current.rotation.y = 0;
        // mesh.current.rotation.z = 0;
      }
    }
  });
  const [albedoMap, normalMap, roughnessMap, aoMap, heightMap] = useLoader(
    TextureLoader,
    [
      "/objects/wall/TCom_Wall_Stone3_2x2_512_albedo.jpg",
      "/objects/wall/TCom_Wall_Stone3_2x2_512_normal.jpg",
      "/objects/wall/TCom_Wall_Stone3_2x2_512_roughness.jpg",
      "/objects/wall/TCom_Wall_Stone3_2x2_512_ao.jpg",
      "/objects/wall/TCom_Wall_Stone3_2x2_512_height.jpg",
    ],
  );

  // Create material with textures
  return (
    <mesh
      ref={mesh}
      position={position}
      scale={hovered ? 0.0 : 1}
      onClick={(event) => setActive(!active)}
      onPointerOver={(event) => setHover(!hovered)}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        displacementMap={heightMap}
        aoMap={aoMap}
        map={albedoMap}
        normalMap={normalMap}
        roughnessMap={roughnessMap}
        displacementScale={0.0001}
        bumpScale={20}
      />
    </mesh>
  );
}

export function CubeGrid({z}: {z: number}) {
  const gridSize = 15;
  let cubes = [];

  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      // Position each cube in the grid
      cubes.push(
        <Cube
          key={`${i}-${j}`}
          position={new Vector3(i - gridSize / 2, j - gridSize / 2, z)}
        />,
      );
    }
  }

  return <>{cubes}</>;
}
