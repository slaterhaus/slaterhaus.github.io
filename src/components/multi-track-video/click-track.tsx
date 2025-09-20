"use client";
import React, { useEffect, useRef, useState } from 'react';

interface ClickTrackProps {
    bpm: number;
    isPlaying: boolean;
    onBpmChange: (bpm: number) => void;
    countOff: number;
    onCountOffChange: (countOff: number) => void;
    onCountOffComplete?: () => void;
}

const ClickTrack = ({ bpm, isPlaying, onBpmChange, countOff, onCountOffChange, onCountOffComplete }: ClickTrackProps) => {
    const audioContextRef = useRef<AudioContext | null>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const [volume, setVolume] = useState(0.3);
    const [currentCount, setCurrentCount] = useState(0);
    const [isCountingOff, setIsCountingOff] = useState(false);

    useEffect(() => {
        // Initialize AudioContext
        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    const playClick = (isAccent = false) => {
        if (!audioContextRef.current) return;

        const oscillator = audioContextRef.current.createOscillator();
        const gainNode = audioContextRef.current.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContextRef.current.destination);

        // Higher pitch for accent clicks (count-off), normal pitch for regular clicks
        oscillator.frequency.setValueAtTime(isAccent ? 1200 : 800, audioContextRef.current.currentTime);
        gainNode.gain.setValueAtTime(volume, audioContextRef.current.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + 0.1);

        oscillator.start(audioContextRef.current.currentTime);
        oscillator.stop(audioContextRef.current.currentTime + 0.1);
    };

    useEffect(() => {
        if (isPlaying) {
            const intervalTime = (60 / bpm) * 1000; // Convert BPM to milliseconds

            // Start count-off
            setIsCountingOff(true);
            setCurrentCount(1);

            // Play first count-off click
            playClick(true);

            let clickCount = 1;
            intervalRef.current = setInterval(() => {
                clickCount++;

                if (clickCount <= countOff) {
                    // Still in count-off
                    playClick(true);
                    setCurrentCount(clickCount);
                } else if (clickCount === countOff + 1) {
                    // Count-off complete, notify parent and switch to regular clicks
                    setIsCountingOff(false);
                    setCurrentCount(0);
                    if (onCountOffComplete) {
                        onCountOffComplete();
                    }
                    playClick(false);
                } else {
                    // Regular clicks
                    playClick(false);
                }
            }, intervalTime);
        } else {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
            setIsCountingOff(false);
            setCurrentCount(0);
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isPlaying, bpm, volume, countOff, onCountOffComplete]);

    return (
        <div style={{
            padding: '20px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '12px',
            marginBottom: '25px',
            color: 'white',
            boxShadow: '0 6px 20px rgba(102, 126, 234, 0.3)'
        }}>
            <h3 style={{
                margin: '0 0 20px 0',
                fontSize: '1.3rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
            }}>
                🥁 Click Track
                {isCountingOff && (
                    <span style={{
                        background: 'rgba(255, 255, 255, 0.2)',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '0.8rem',
                        fontWeight: '700'
                    }}>
                        COUNTING OFF
                    </span>
                )}
            </h3>
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '20px',
                marginBottom: '20px'
            }}>
                <div style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    padding: '15px',
                    borderRadius: '8px'
                }}>
                    <label style={{ display: 'block', marginBottom: '10px', fontWeight: '500' }}>
                        🎵 BPM
                    </label>
                    <input
                        type="range"
                        min={60}
                        max={200}
                        value={bpm}
                        onChange={(e) => onBpmChange(parseInt(e.target.value))}
                        style={{
                            width: '100%',
                            marginBottom: '8px',
                            accentColor: '#fff'
                        }}
                    />
                    <div style={{ textAlign: 'center', fontSize: '1.2rem', fontWeight: '700' }}>
                        {bpm}
                    </div>
                </div>

                <div style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    padding: '15px',
                    borderRadius: '8px'
                }}>
                    <label style={{ display: 'block', marginBottom: '10px', fontWeight: '500' }}>
                        📊 Count-off
                    </label>
                    <select
                        value={countOff}
                        onChange={(e) => onCountOffChange(parseInt(e.target.value))}
                        style={{
                            width: '100%',
                            padding: '8px',
                            borderRadius: '6px',
                            border: 'none',
                            fontSize: '16px',
                            marginBottom: '8px'
                        }}
                    >
                        <option value={2}>2 clicks</option>
                        <option value={3}>3 clicks</option>
                        <option value={4}>4 clicks</option>
                        <option value={5}>5 clicks</option>
                        <option value={6}>6 clicks</option>
                    </select>
                </div>

                <div style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    padding: '15px',
                    borderRadius: '8px'
                }}>
                    <label style={{ display: 'block', marginBottom: '10px', fontWeight: '500' }}>
                        🔊 Volume
                    </label>
                    <input
                        type="range"
                        min={0}
                        max={1}
                        step={0.1}
                        value={volume}
                        onChange={(e) => setVolume(parseFloat(e.target.value))}
                        style={{
                            width: '100%',
                            marginBottom: '8px',
                            accentColor: '#fff'
                        }}
                    />
                    <div style={{ textAlign: 'center', fontSize: '1.2rem', fontWeight: '700' }}>
                        {Math.round(volume * 100)}%
                    </div>
                </div>
            </div>

            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '15px',
                background: 'rgba(255, 255, 255, 0.1)',
                padding: '15px',
                borderRadius: '8px'
            }}>
                <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: isPlaying ? '#28a745' : 'rgba(255, 255, 255, 0.3)',
                    transition: 'all 0.3s ease',
                    boxShadow: isPlaying ? '0 0 15px rgba(40, 167, 69, 0.6)' : 'none'
                }} />
                <div style={{ fontSize: '16px', fontWeight: '500' }}>
                    {isPlaying ? 'Playing' : 'Ready'}
                </div>
                {isCountingOff && (
                    <div style={{
                        fontSize: '18px',
                        fontWeight: '700',
                        background: 'rgba(255, 255, 255, 0.2)',
                        padding: '6px 12px',
                        borderRadius: '6px',
                        animation: 'pulse 1s infinite'
                    }}>
                        Count-off: {currentCount}/{countOff}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ClickTrack;