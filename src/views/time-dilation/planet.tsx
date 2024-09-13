import {useFrame, useThree} from '@react-three/fiber';
import {useRef, useState} from 'react';
import {Mesh, Vector3} from "three";
import {calculateVelocity, colorShift, gravitationalTimeDilationFactor} from './functions';
import TimeIndicator from "@/views/time-dilation/time-indicator";

interface PlanetInterface {
    distance: number;
    period: number;
    G: 6.67430e-11; // Gravitational constant in m^3 kg^-1 s^-2
    M: 1.989e30; // Mass of the Sun in kg, as an example
    c: 299792458; // Speed of light in m/s
}


export function Planet({ distance, period, G, M, c }: PlanetInterface) {
    const meshRef = useRef<Mesh>(null!);
    const [color, setColor] = useState<string>()
    const { camera } = useThree();  // Access the camera.tsx


    useFrame(({ clock }) => {
        // Calculate gravitational time dilation based on the current distance from the central mass.
        const timeDilationFactor = gravitationalTimeDilationFactor(G, M, distance, c);
        const directionToCamera = new Vector3().subVectors(camera.position, meshRef.current.position);
        // const relativeVelocity = directionToCamera.normalize().dot(new Vector3(velocity.x, velocity.y, velocity.z));
        // const newColor = colorShift(relativeVelocity, c); // Using speed of light in m/s


        // Adjusted time accounting for gravitational time dilation.
        const adjustedTime = clock.getElapsedTime() * timeDilationFactor;

        // Calculate the current angle of the planet based on the adjusted time and its period.
        const angle = (adjustedTime / period) * 2 * Math.PI;

        // Update the planet's position based on the adjusted angle.
        const x = Math.cos(angle) * distance;
        const z = Math.sin(angle) * distance;

        // Now, calculate the planet's velocity for use in the color shift.
        // Note: In a real application, this might also consider time dilation,
        // but here we use the simplified orbital mechanics approach.
        const velocity = calculateVelocity(distance, period);

        // Update the planet's position.
        if (meshRef.current) {
            meshRef.current.position.set(x, 0, z);
            // console.log(velocity)
            // Apply the color shift based on the planet's velocity.
            const newColor = colorShift(velocity, c); // Assuming this returns a color like '#ff0000'.
            // meshRef.current.material.color.set(newColor); // Assuming this returns a hex color
            setColor(newColor)

        }
    });

    return (
        <mesh ref={meshRef}>
            <sphereGeometry args={[1, 16, 16]} />
            <meshStandardMaterial color={color} />
            <TimeIndicator timeFactor={.05 / gravitationalTimeDilationFactor(G, M, distance, c)} />
        </mesh>
    );
}
export default Planet;