import Home from "@/views/home";
import {useSearchParams} from "next/navigation";
import Immutable from "immutable";
import GradientDescent from "@/views/gradient-descent/gradient-descent";
import {useRouter} from "next/router";
import {AutoFocusProps} from "react-focus-lock/interfaces";
import Spheres from "@/views/spheres/spheres";

export interface RouteConfig {
    position: [number, number, number];
    rotation: [number, number, number];
    cameraType?: "Orthographic" | "Perspective";
    bokehScale?: number;
    focusRange?: number;
    controls?: "fly" | "head" | "mouse" | "trackball" | "orbit" | "" | undefined,
    Component: () => JSX.Element;
    postProcessing?: {
        autoFocus: {
            focusRange?: number,
            bokehScale?: number,
            focusDistance?: number
        },
        bloom?: boolean
    };
}

const routes = new Map<string, RouteConfig>();

routes.set("home", {
    controls: "head",
    position: [0, -1, 0],
    rotation: [0.0, 10, 0],
    Component: Home,
    postProcessing: {
        autoFocus: {
            focusDistance: 1,
            focusRange: 0,
            bokehScale: 5
        },
        bloom: true
    },
});
routes.set("gradientDescent", {
    controls: "",
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    Component: GradientDescent,
    postProcessing: {autoFocus: {focusRange: 0.07, bokehScale: 17}},
});
routes.set("spheres", {
    controls: "mouse",
    position: [0,0,0],
    rotation: [0,0,0],
    Component: Spheres
})
export const useGetViewConfig = (): RouteConfig | undefined => {
    const view = useRouter()?.query?.view;
    return view !== null ? routes.get(<string>view) : <RouteConfig>routes.get("");
};

export default routes;
