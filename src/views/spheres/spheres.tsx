import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';


// Balloon component
const Balloon = ({ position, color }: {[key: string]: any}) => {
    const ref = useRef<any>();

    // UseFrame loop for animation
    useFrame((state) => {
        if (!ref.current) return;
        const { x, y } = state.pointer;
        const mouseX = x * 0.5; // Adjust these values based on your needs
        const mouseY = y * 0.5;
        ref.current.position.x += (mouseX - ref.current.position.x) * 0.1;
        ref.current.position.y += (-mouseY - ref.current.position.y) * 0.1;
    });

    return (
        <Sphere ref={ref} position={position} args={[0.5, 32, 32]}>
            <meshStandardMaterial attach="material" color={color} />
        </Sphere>
    );
};

// Main component with a bunch of balloons
const BalloonClump = () => {
    // Generate random positions for the balloons
    const balloons = useMemo(() => {
        return [...Array(10)].map(() => ({
            position: [Math.random() * 10, Math.random() * 10, Math.random() * 10],
            color: `hsl(${Math.random() * 360}, 100%, 70%)`,
        }));
    }, []);


    return (
        <>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            {balloons.map((balloon, index) => (
                <Balloon key={index} position={balloon.position} color={balloon.color} />
            ))}
        </>
    );
};

export default BalloonClump;
