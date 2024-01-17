import Home from "@/views/home";
import { useSearchParams } from "next/navigation";
import Immutable from 'immutable';

export interface RouteConfig {
  position: [number, number, number];
  rotation: [number, number, number];
  cameraType?: "Orthographic" | "Perspective";
  bokehScale?: number;
  focusRange?: number;
  controls?: "fly" | "head" | "mouse" | "trackball" | "orbit";
  Component: () => JSX.Element,
  postProcessing?:Record<string, Record<string, number>>
}

const routes = new Map<string, RouteConfig>();

routes.set("", {
  controls: "head",
  position: [0, -1, 4.75],
  rotation: [0.33, 0, 20.0],
  Component: Home,
  // postProcessing: {'autoFocus': {focusRange: .07, bokehScale: 7}}
});

export const useGetViewConfig = (): RouteConfig => {
  const params = useSearchParams();
  const view = params.get("view");
  if (view !== null) {
    return <RouteConfig>routes.get(view);
  } else {
    return <RouteConfig>routes.get("");
  }
}

export default routes;
