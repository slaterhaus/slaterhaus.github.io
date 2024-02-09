import React, {useRef} from 'react';
import {Text} from '@react-three/drei';
import {Group, Object3DEventMap} from "three";

interface Props {
    position: [number, number, number],
    rotation: [number, number, number]
    content: string
}

export const Slide = ({position, content, rotation}: Props) => {
    const ref = useRef<Group<Object3DEventMap>>(null!);
    // Animation logic can be added here

    return (
        <>
        <spotLight position={position}/>
            <group ref={ref} position={position} rotation={rotation}>
                <Text color="white" fontSize={0.25}>
                    {content}
                </Text>
            </group>
        </>
    );
};

export const slides: { content: string, position: [number, number, number], rotation: [number, number, number] }[] = [
    {
        content: `                 Gradient descent 
                      is an optimization algorithm used 
                           to minimize a function by 
                     iteratively moving towards the 
                steepest descent as defined by the 
                negative of the gradient.`,
        position: [0, 0, 0],
        rotation: [0, 0, 2],
    },
    {
        content: `The Gradient Descent Equation: {'\\n'}
      θ = θ - α * ∇J(θ) {'\\n'}
      Where: {'\\n'}
      θ: Parameters {'\\n'}
      α: Learning Rate {'\\n'}
      ∇J(θ): Gradient of the Objective Function`,
        position: [200, 0, 0],
        rotation: [0, 0, 0]
    },
    {
        content: `     def gradient_descent(alpha, theta, gradient_func, iterations):
        for i in range(iterations):
            theta = theta - alpha * gradient_func(theta)
        return theta`,
        position: [300, 0, 0],
        rotation: [0, 0, 0]
    },
];