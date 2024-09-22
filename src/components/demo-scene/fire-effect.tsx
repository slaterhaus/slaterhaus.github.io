// components/FireEffect.js
import { motion } from 'framer-motion';
import styles from './fire-effect.module.scss';

const FireEffect = () => {
    return (
        <div className={styles.candleContainer}>
            <div className={styles.glow}></div>
            <div className={styles.candle}>
                <div className={styles.candleBody}></div>
                <div className={styles.candleBase}></div>
            </div>
            <div className={styles.fireContainer}>
                {[...Array(50)].map((_, i) => (
                    <motion.div
                        key={i}
                        className={styles.flame}
                        initial={{ y: 0, opacity: 1 }}
                        animate={{
                            y: [-20, -40, -60],
                            opacity: [0.8, 0.4, 0],
                            scale: [1, 1.2, 0.8],
                        }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            repeatType: 'loop',
                            ease: 'easeOut',
                            delay: Math.random() * 1.5,
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

export default FireEffect;