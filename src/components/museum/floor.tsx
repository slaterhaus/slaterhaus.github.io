import { useRef } from "react";
import { Mesh } from "three";
import { Params } from "@/components/museum/interfaces";

export function Floor(props: Params) {
  const floor = useRef<Mesh>(null!);

  return (
      <mesh ref={floor} position={props.position} rotation={props.rotation}>
        <boxGeometry args={props.size} />
        <meshStandardMaterial color={props.color} />
      </mesh>
  );
}