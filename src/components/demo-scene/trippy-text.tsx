import React, { useState, useEffect } from 'react';
import { motion, Variants } from 'framer-motion';

interface TripyTextProps {
    text: string;
}

const TrippyText: React.FC<TripyTextProps> = ({ text }) => {
    const [randomSeed, setRandomSeed] = useState(0);

    const letters = Array.from(text);

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 100.03,
                delayChildren: 10.04,
            },
        },
    };

    const letterVariants: Variants = {
        hidden: {
            opacity: 0,
            // y: 50,
            // x: -50,
            scale: 0.5,
            // position: 'relative'
            // rotate: -180,
        },
        visible: {
            opacity: [0.1, 1, 0.1],
            filter: ["blur(0px)", "blur(0)", "blur(1px)","blur(5px)", "blur(7px)"],
            y: [0, 0, -50],
            x: [-500, -250, 0],
            scale: [1, 1.1, 1.2, 1.4, 1.8, 3.6, 7.2, 10.1, 15, 20],
            letterSpacing: [1, 1.1, 1.2, 1.4, 1.8, 3.6, 7.2, 10.1, 15, 20],
            // rotate: [-180, 0, 180],
            transition: {
                duration: 20,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
            },
        },
    };

    return (
        <motion.h1
            style={{
                translateX: "100%",
                alignContent: 'center',
            }}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            key={randomSeed}
        >
            {letters.map((letter, index) => (
                <motion.h1
                    key={index}
                    variants={letterVariants}
                    style={{
                        display: 'inline-flex',
                        color: `hsl(${Math.random() * 360}, 100%, 50%)`,
                        filter: `blur(${Math.random() * 2}px)`,
                    }}
                >
                    {letter === ' ' ? '\u00A0' : letter}
                </motion.h1>
            ))}
        </motion.h1>
    );
};

export default TrippyText;