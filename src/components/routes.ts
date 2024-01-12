export interface RouteConfig {
  position: [number, number, number];
  rotation: [number, number, number];
  cameraType?: "Orthographic" | "Perspective";
  bokehScale?: number;
  focusRange?: number;
  controls?: "fly" | "head" | "mouse" | "trackball" | "orbit";
}

const routes = new Map<string, RouteConfig>();

routes.set("", {
  position: [0, -1, 4.75],
  rotation: [.33, 0, .0],
  controls: "head"
});
/**
 Vector3 {x: -0.04467460926730768, y: -1.5053767911344715, z: 4.7677924552145186}
 Euler {isEuler: true, _x: 0.30583273925180315, _y: -0.008935040741079972, _z: 0.002821093500416786, _order: 'XYZ', …}
 */

export default routes;
