"use client";
import { useThree } from "@react-three/fiber";
import { useGetViewConfig } from "@/routing/routes";
import { useEffect } from "react";

export const Camera = () => {
  const { camera, set } = useThree();
  let config = useGetViewConfig();

  useEffect(() => {
    camera.rotation.set(0, 0, 0);
    if (config) {
      camera.position.set(...config.position);
      camera.rotation.set(...config.rotation);
    }
  }, [camera, config]);
  return <></>;
};
