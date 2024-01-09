import { Color, Euler, Vector3 } from "@react-three/fiber";

export interface Params {
  position: Vector3 | undefined;
  rotation: Euler | undefined;
  size:
    | [
        width: number | undefined,
        height: number | undefined,
        depth: number | undefined,
        widthSegments: number | undefined,
        heightSegments: number | undefined,
        depthSegments: number | undefined,
      ]
    | undefined;
  color: Color | undefined;
  image?: string;
}
export interface ArtParams extends Params {
  image: string;
}
