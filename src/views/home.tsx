"use client";
import {CubeGrid} from "@/components/cube-grid";
import {useThree} from "@react-three/fiber";
import {Text3D} from "@react-three/drei";
import {Color, Vector3} from "three";
import {useMemo, useState} from "react";

export default function Home() {

    const [color, setColor] =
        useState<Color>(new Color(255, 255, 255));
    const cubes = useMemo(() =>
            Array(10).fill(0).map((_, i) => (
                <CubeGrid z={-i + 2} key={`cube-grid-${i}`}/>
            )), // No dependencies, so this array is created only once
        []
    );
    return (
        <>
            <directionalLight color="blue" position={[0, 5, -5]} intensity={25}/>

            {cubes}
            <ambientLight intensity={5}/>
            <Text3D
                size={1}
                lineHeight={1}
                letterSpacing={0.02}
                font="/fonts/battlesbridge.json"
                position={new Vector3(-6, 0, -5)}
                castShadow
                onClick={() => {
                    setColor(new Color(Math.random(), Math.random(), Math.random()))
                }}
            >
                Greetings
                <meshStandardMaterial
                    attach="material" color={color}/>
            </Text3D>
        </>
    );
}
