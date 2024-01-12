import React, { useEffect } from 'react';
import { useSearchParams } from "next/navigation";
import { CameraControls, FaceControls, FlyControls, OrbitControls, TrackballControls } from '@react-three/drei';
import routes, { RouteConfig } from "@/components/routes";

export default function Controls() {
  const params = useSearchParams();
  const view = params.get("view");
  let config: RouteConfig | undefined;
  if (view !== null) {
    config = routes.get(view);
  } else {
    config = routes.get("");
  }

  switch (config?.controls) {
    case "head":

      return <FaceControls />; // Custom component
    case "mouse":
      return <CameraControls/>;
    case "orbit":
      return <OrbitControls/>;
    case "trackball":
      return <TrackballControls/>;
    case "fly":
      return <FlyControls/>;
    default:
      return null;
  }
}
