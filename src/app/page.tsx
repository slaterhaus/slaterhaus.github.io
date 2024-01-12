"use client";
import { Canvas, useThree } from "@react-three/fiber";
import { CubeGrid } from "@/components/cube-grid";
import { Heading } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { EffectComposer, Autofocus } from '@react-three/postprocessing'
const SetCameraPosition = ({
  position,
  rotation,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
}) => {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(...position);
    camera.rotation.set(...rotation);
  }, [camera, position]);

  return null;
};
export default function Home() {
  const [loaded, setLoaded] = useState<boolean>(false);
  const [heading, setHeading] = useState<string>("Slaterhaus");
  const params = Array.from(useSearchParams().entries()).map(
    ([, val]) => Number(val) / 100,
  );
  const cameraPositionParams = params.slice(0, 3);
  const cameraRotationParams = params.slice(3, 7);
  const defaultParams = [0, 0, 0];
  // @ts-ignore
  const cameraPosition: [number, number, number] =
    cameraPositionParams.length == 3 ? cameraPositionParams : defaultParams;
  // @ts-ignore
  const cameraRotation: [number, number, number] =
    cameraRotationParams.length === 3 ? cameraRotationParams : defaultParams;

  const onLoaded = () => {
    setTimeout(() => {
      setLoaded(true);
    }, 100);
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        userSelect: "none",
      }}
    >
      <Canvas>
        {/*<spotLight color="white" position={[0, 0, 20]} intensity={500}/>*/}
        <spotLight
          color="white"
          position={[
            cameraPosition[0],
            cameraPosition[1],
            cameraPosition[2] + 1,
          ]}
          intensity={50}
        />
        <EffectComposer>
          <Autofocus focusRange={0.02} bokehScale={10} />
        </EffectComposer>
        <directionalLight color="blue" position={[0, 5, -5]} intensity={5} />
        <SetCameraPosition
          position={cameraPosition}
          rotation={cameraRotation}
        />
        {Array(10)
          .fill(0)
          .map((it, i) => (
            <CubeGrid z={-i + 2} onLoaded={onLoaded} key={`cube-grid-${i}`} />
          ))}
      </Canvas>
      <Heading
        position={"absolute"}
        fontSize={loaded ? "96px" : "0"}
        filter={"drop-shadow(0px 0px 6px)"}
        transition={"all linear .5s"}
      >
        {heading}
      </Heading>
    </div>
  );
}
