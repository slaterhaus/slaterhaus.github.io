"use client";
import { useThree } from "@react-three/fiber";
import { useGetViewConfig } from "@/routing/routes";
import { useEffect } from "react";

export const Camera = () => {
  const {camera, set} = useThree();
  let config = useGetViewConfig()

  useEffect(() => {
    camera.rotation.set(1,2,3)
    if (config) {
      camera.position.set(1,2,3);
      camera.rotation.set(1,2,3);
    }
  }, [camera, config]);
  return <></>
};
