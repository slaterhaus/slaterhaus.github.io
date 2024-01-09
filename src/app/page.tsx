"use client";
import { Canvas } from "@react-three/fiber";
import { CubeGrid } from "@/components/cube-grid";
import { Heading } from "@chakra-ui/react";

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
        <Heading position={"absolute"} fontSize={"128px"} filter={"drop-shadow(0px 0px 6px)"}>
          Slaterhaus
        </Heading>
        <Canvas>
          {/*<ambientLight intensity={1.1} />*/}
          <spotLight color="white" position={[0, 0, 20]} intensity={500}/>
          {Array(10).fill(0).map((it, i) => <CubeGrid z={-i}/>)}

        </Canvas>
      </div>
  );
}
