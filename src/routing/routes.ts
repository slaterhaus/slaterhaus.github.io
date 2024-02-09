import Home from "@/views/home";
import { useSearchParams } from "next/navigation";
import Immutable from "immutable";
import GradientDescent from "@/views/gradient-descent/gradient-descent";
import {useRouter} from "next/router";

export interface RouteConfig {
  position: [number, number, number];
  rotation: [number, number, number];
  cameraType?: "Orthographic" | "Perspective";
  bokehScale?: number;
  focusRange?: number;
  controls?: "fly" | "head" | "mouse" | "trackball" | "orbit" | "" | undefined,
  Component: () => JSX.Element;
  postProcessing?: Record<string, Record<string, number>>;
}

const routes = new Map<string, RouteConfig>();

routes.set("home", {
  controls: "head",
  position: [0, -1, 4.75],
  rotation: [0.33, 0, 20.0],
  Component: Home,
  postProcessing: { autoFocus: { focusRange: 0.07, bokehScale: 7 } },
});
routes.set("gradientDescent", {
  controls: "",
  position: [0, 0, 0],
  rotation: [0, 0, 0],
  Component: GradientDescent,
  postProcessing: { autoFocus: { focusRange: 0.07, bokehScale: 17 } },
});

export const useGetViewConfig = (): RouteConfig | undefined => {
  const router = useRouter();
  const slug = router.query.slug as string[];
  const view = slug?.join('.');

  if (view !== null) {
    return routes.get(view);
  } else {
    return <RouteConfig>routes.get("");
  }
};

export default routes;
