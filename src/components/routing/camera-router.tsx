"use client";
import { useThree } from "@react-three/fiber";
import { useSearchParams } from "next/navigation";
import routes, { RouteConfig } from "@/components/routes";
import { useEffect } from "react";
import { Autofocus, EffectComposer } from "@react-three/postprocessing";

export const CameraRouter = () => {
  const { camera, set } = useThree();
  const params = useSearchParams();
  const view = params.get("view");
  let config: RouteConfig | undefined;
  if (view !== null) {
    config = routes.get(view);
  } else {
    config = routes.get("");
  }

  useEffect(() => {
    if (config) {
      camera.position.set(...config.position);
      camera.rotation.set(...config.rotation);
    }
  }, [camera, config]);
  // console.log(camera.position, camera.rotation)
  return (
    <EffectComposer>
      <Autofocus focusRange={0.01} bokehScale={7} />
    </EffectComposer>
  );
};
