import {useFrame} from "@react-three/fiber";
import {useRef} from "react";
import {DoubleSide, Mesh} from "three";

export function TimeIndicator({ timeFactor }: {timeFactor: number}) {
    const meshRef = useRef<Mesh>(null);

    useFrame(() => {
        // Rotate the mesh every frame, but adjusted by the time dilation factor
        // This makes the ring's rotation represent the planet's "local time"
        if (meshRef.current) {
            meshRef.current.rotation.y += 0.02 * timeFactor; // Adjust rotation speed as needed
        }
    });

    return (
        <mesh ref={meshRef} rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[1.2, 1.5, 32]} /> {/* Adjust size as needed */}
            <meshStandardMaterial color="cyan" side={DoubleSide} />
        </mesh>
    );
}
export default TimeIndicator;