"use client";
import { Canvas } from "@react-three/fiber";
import { CubeGrid } from "@/components/cube-grid";
import { Heading } from "@chakra-ui/react";
import { useState } from "react";

export default function Home() {
  const [loaded, setLoaded] = useState<boolean>(false);
  const onLoaded = () => {
    setTimeout(() => {
      setLoaded(true);
    }, 10)
  };
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
      <Heading
        position={"absolute"}
        fontSize={loaded ? "96px": "0"}
        filter={"drop-shadow(0px 0px 6px)"}
        transition={"all linear .4s"}
      >
        Slaterhaus
      </Heading>
      <Canvas>
        {/*<spotLight color="white" position={[0, 0, 20]} intensity={500}/>*/}
        <spotLight color="white" position={[0, 0, 5]} intensity={50} />
        <directionalLight color="blue" position={[0, 5, -5]} intensity={5} />
        {Array(10)
          .fill(0)
          .map((it, i) => (
            <CubeGrid z={-i + 2} onLoaded={onLoaded} />
          ))}
      </Canvas>
    </div>
  );
}
