"use client";
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import styles from './demo-scene.module.scss';
import {useSearchParams} from "next/navigation";


const DemoScene = () => {
    const [time, setTime] = useState(0);
    const params = useSearchParams();
    const msg = params?.get('msg') ?? "Hey!"

    useEffect(() => {
        const interval = setInterval(() => {
            setTime((prevTime) => prevTime + 0.01);
        }, 10);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className={styles.container}>
            <motion.div
                className={styles.content}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 5 }}
            >
                <motion.h1
                    className={styles.title}
                    animate={{
                        scale: [1, 1.2, 2, 1.5, 3, 1.1],
                        rotateZ: [0, 360],
                        // y: [0, -50, 0],
                        x: Math.sin(time) * 200,
                        y: Math.cos(time) * 200,
                    }}
                    transition={{
                        duration: 40,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                >
                    {msg || "Hey!"}
                </motion.h1>

                {[...Array(50)].map((_, index) => (
                    <motion.div
                        key={index}
                        className={styles.particle}
                        animate={{
                            x: Math.sin(time + index) * 500,
                            y: Math.cos(time + index) * 500,
                            scale: [1, 1.2, 2, 1.5, 3, 1.1],
                            background: `rgb(${Math.random() * 255}, 0, ${-index})`,
                            opacity: [1, 1.2, 2, 1.5, 3, 1.1].map(n => n/3)
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            repeatType: "reverse",
                        }}
                    />
                ))}
            </motion.div>
        </div>
    );
};

export default DemoScene;