import React, {useRef} from 'react';
import {Text} from '@react-three/drei';
import {Group, Object3DEventMap} from "three";

type Triple = [number, number, number]
interface SlideProps {
    position: Triple,
    rotation: Triple
    content: string,
    activeProps?: Record<string, any>,
    inActiveProps?: Record<string, any>
}

interface SlideViewProps extends SlideProps{
    active: boolean
}

const defaults = {
    fontSize: .25,
    color: "white",
    fillOpacity: 1,
}

function getDisplayProps({active, activeProps, inActiveProps}: Partial<SlideViewProps>) {
    return {
        ...defaults,
        ...(active ? activeProps : inActiveProps)
    }
}
export const Slide = ({position, content, rotation, ...props}: SlideViewProps) => {
    const ref = useRef<Group<Object3DEventMap>>(null!);
    const displayProps = getDisplayProps(props);
    return (
        <>
        <spotLight position={position}/>
            <group ref={ref} position={position} rotation={rotation}>
                <Text {...displayProps}>
                    {content}
                </Text>
            </group>
        </>
    );
};

export const slides: SlideProps[] = [
    {
        content: `Can you believe it? 
        (press the right arrow)`,
        position: [0,0,10],
        rotation: [0,0,0],
        inActiveProps: {
            fillOpacity: 0.01,
        },
        activeProps: {
            fontSize: .25
        }
    },
    {
        content: "This is a slideshow",
        position: [0,0,0],
        rotation: [0,0,.25],
        inActiveProps: {
            fillOpacity: 0.01,
            color: "red"
        },
        activeProps: {
            color: "red"
        }
    },
    {
        content: "Pretty far out, I know",
        position: [0,0,0],
        rotation: [0,.1,.5],
        inActiveProps: {
            fillOpacity: 0.01,
            color: "blue"
        },
        activeProps: {
            color: "lightblue",
        }
    },
    {
        content: "TODO: fix Euler angles so camera.tsx tracks rotation better",
        position: [10,0,0],
        rotation: [.22,.1,.5],
        inActiveProps: {
            fillOpacity: 0.01,
            color: "blue"
        },
        activeProps: {
            color: "orange",
            fontSize: 0.2,
        }
    },
    {
        content: "Works a bit oddly but still readible",
        position: [11,0,0],
        rotation: [-.22,.1,.5],
        inActiveProps: {
            fillOpacity: 0.01,
            color: "blue"
        },
        activeProps: {
            color: "yellow",
            fontSize: 0.25,
        }
    },
    {
        content: `For the next slides
        you'll want to just hold down the right arrow
        `,
        position: [101,0,0],
        rotation: [.22,.1,.5],
        inActiveProps: {
            fillOpacity: 0.01,
            color: "blue"
        },
        activeProps: {
            color: "pink",
            fontSize: 0.25,
        }
    },
    ...Array(100).fill(0).map((_, i) => ({
        content: `Wow * ${i}`,
        position: [0,0,-i/2] as Triple,
        rotation: [0,0,0] as Triple,
        inActiveProps: {
            fillOpacity: Math.random() * i * 0.0001,
            fontSize: Math.random() * 2
        },
        activeProps: {
            color: "red",
            fontSize: i * 0.01
        },
    })),
    ...Array(200).fill(0).map((_, i) => ({
        content: `That was some crazy zoom`,
        position: [Math.sin(i)/100,Math.cos(i)/100,100] as Triple,
        rotation: [0,0,i/100] as Triple,
        inActiveProps: {
            fillOpacity: Math.random() * i * 0.0001,
            fontSize: Math.random() * 2
        },
        activeProps: {
            color: "violet",
            fontSize: i * 0.001
        },
    })),
    ...Array(200).fill(0).map((_, i) => ({
        content: "Would also like to post-processing per slide",
        position: [100, 100, 100] as Triple,
        rotation: [0,0,i/100] as Triple,
        inActiveProps: {
            fillOpacity: Math.random() * i * 0.0001,
            fontSize: .25
        },
        activeProps: {
            color: "green",
            fontSize: i * 0.001
        },
    })),
    ...Array(200).fill(0).map((_, i) => ({
        content: "This has been a presentation of MovieSlides",
        position: [300, 200, 100 + (i/10000)] as Triple,
        rotation: [0,0, 100] as Triple,
        inActiveProps: {
            fillOpacity: Math.random() * i * 0.0001,
            fontSize: .25,
        },
        activeProps: {
            color: "green",
            fontSize: i / 0.01
        },
    })),

];