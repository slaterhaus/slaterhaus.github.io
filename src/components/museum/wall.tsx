import React, { useRef } from "react";
import { Mesh } from "three";
import { Params } from "@/components/museum/interfaces";

export function Wall(props: Params) {
  const wall = useRef<Mesh>(null!);

  return (
    <mesh ref={wall} position={props.position} rotation={props.rotation}>
      <boxGeometry args={props.size} />
      <meshStandardMaterial color={props.color} />
    </mesh>
  );
}
