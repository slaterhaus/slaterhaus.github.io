import React, { useEffect, useState } from "react";
import {
  CameraControls,
  FaceControls,
  FaceLandmarker,
  FlyControls,
  OrbitControls,
  TrackballControls,
} from "@react-three/drei";
import { useGetViewConfig } from "@/routing/routes";

export default function Controls() {
  const [webcamAvailable, setWebcamAvailable] = useState<boolean>(false);

  let config = useGetViewConfig();
  useEffect(() => {
    if (config?.controls !== "head") return;
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        setWebcamAvailable(true);
      })
      .catch((error) => {
        setWebcamAvailable(false);
      });
  }, []);

  switch (config?.controls) {
    case "head":
      return webcamAvailable ? (
        <FaceLandmarker>
          <FaceControls />
        </FaceLandmarker>
      ) : (
        <CameraControls />
      );
    case "mouse":
      return <CameraControls />;
    case "orbit":
      return <OrbitControls />;
    case "trackball":
      return <TrackballControls />;
    case "fly":
      return <FlyControls />;
    default:
      return null;
  }
}
