"use client";
import {motion} from 'framer-motion';
import {useEffect, useState} from 'react';
import styles from './demo-scene.module.scss';
import FireEffect from './fire-effect';
import TripyText from "@/components/demo-scene/trippy-text";

const DemoScene = () => {
    const [time, setTime] = useState(0);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const interval = setInterval(() => {
            setTime((prevTime) => prevTime + 0.01);
        }, 10);

        // Get message from URL
        const urlParams = new URLSearchParams(window.location.search);
        const urlMessage = urlParams.get('msg');
        setMessage(urlMessage || 'Hello');

        return () => clearInterval(interval);
    }, []);

    return (
        <div className={styles.container}>
            <TripyText text={message}/>
        </div>
    );
};

export default DemoScene;