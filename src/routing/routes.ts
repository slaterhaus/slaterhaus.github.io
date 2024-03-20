import Home from "@/views/home";
import {useSearchParams} from "next/navigation";
import Immutable from "immutable";
import GradientDescent from "@/views/gradient-descent/gradient-descent";
import {useRouter} from "next/router";
import {AutoFocusProps} from "react-focus-lock/interfaces";
import Spheres from "@/views/spheres/spheres";
import TimeDilation from "@/views/time-dilation/time-dilation";

interface DepthOfFieldProps {
    bokehScale?: number,
    focusDistance?: number,
    focusRange?: number
}

export interface RouteConfig {
    position: [number, number, number];
    rotation: [number, number, number];
    cameraType?: "Orthographic" | "Perspective";
    bokehScale?: number;
    focusRange?: number;
    controls?: "fly" | "head" | "mouse" | "trackball" | "orbit" | "" | undefined,
    Component: () => JSX.Element;
    postProcessing?: {
        depthOfField?: DepthOfFieldProps | true,
        bloom?: boolean
    };
}

const routes = new Map<string, RouteConfig>();
const depthOfFieldDefaults = {
    focusRange: 1,
    bokehScale: 5,
    focusDistance: 2
}

export function getDof(obj: DepthOfFieldProps | undefined | true): DepthOfFieldProps | undefined {
    if (obj === true) return depthOfFieldDefaults;
    if (!obj) return
    return {
        ...depthOfFieldDefaults,
        ...obj
    }
}

routes.set("home", {
    controls: "head",
    position: [0, -1, 0],
    rotation: [0.0, 10, 0],
    Component: Home,
    postProcessing: {
        depthOfField: {
            focusDistance: 35,
            focusRange: 100,
            bokehScale: 5
        },
        bloom: false
    },
});
routes.set("slides", {
    controls: "",
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    Component: GradientDescent,
    postProcessing: {
        bloom: false,
        depthOfField: {
            focusDistance: 7,
            focusRange: 20,
            bokehScale: 10
        },
    }
});
routes.set("spheres", {
    controls: "mouse",
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    Component: Spheres,
});
routes.set("time-dilation", {
    controls: 'orbit',
    position: [-20, 0, 0],
    rotation: [0, 0, 0],
    Component: TimeDilation

})
export const useGetViewConfig = (): RouteConfig | undefined => {
    const view = useRouter()?.query?.view;
    return view !== null ? routes.get(<string>view) : <RouteConfig>routes.get("");
};

export default routes;
