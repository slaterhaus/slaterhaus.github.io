import { Mesh, TextureLoader } from "three";
import { useRef } from "react";
import { ArtParams } from "@/components/museum/interfaces";

export function ArtPanel(props: ArtParams) {
  const artwork = useRef<Mesh>(null!);
  const texture = new TextureLoader().load(props.image);

  return (
    <mesh ref={artwork} position={props.position}>
      <planeGeometry />
      <meshBasicMaterial map={texture} />
    </mesh>
  );
}
