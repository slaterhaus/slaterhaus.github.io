import {Slide, slides} from "@/views/gradient-descent/slides";
import React, {useEffect, useState} from "react";
import {useFrame, useThree} from "@react-three/fiber";
import {Vector3} from "three";

export default function GradientDescent() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const {camera} = useThree();
    const cameraOffset = new Vector3(0, 0, 3); // Adjust as needed

    useEffect(() => {
        const handleKeyDown = (event: { key: string; }) => {
            if (event.key === 'ArrowRight') {
                setCurrentSlide((s) => Math.min(s + 1, slides.length - 1));
            } else if (event.key === 'ArrowLeft') {
                setCurrentSlide((s) => Math.max(s - 1, 0));
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []); // Dependencies can be added here if needed

    useFrame(() => {
        const basePosition = new Vector3(...slides[currentSlide].position);

        // Calculate the desired position by adding the offset
        const desiredPosition = basePosition.add(cameraOffset);

        // Smoothly interpolate the camera's position
        camera.position.lerp(desiredPosition, 0.1);

        const baseRotation = slides[currentSlide].rotation;
        camera.rotation.set(...slides[currentSlide].rotation);

        // Look at the base position of the slide
        // camera.lookAt(basePosition);
    });

    return (
        <>
            {slides.map((slide, index) => (
                <Slide key={index} position={slide.position} content={slide.content} rotation={slide.rotation}/>
            ))}
        </>
    );
}
