"use client"

import React, { useState, useEffect, useRef, useCallback } from 'react'
import {
    Box, Button, Text, VStack, HStack, Heading, Container, useColorModeValue, IconButton, ChakraProvider
} from '@chakra-ui/react'
import { ChevronUpIcon, ChevronDownIcon } from '@chakra-ui/icons'

type SubdivisionType = 'quarter' | 'eighth' | 'sixteenth' | 'dotted_eighth' | 'triplet' | 'swing_triplet';

const subdivisions: SubdivisionType[] = ['quarter', 'eighth', 'sixteenth', 'dotted_eighth', 'triplet', 'swing_triplet'];

type Interval = number | number[]
interface MetronomeState {
    isPlaying: boolean;
    bpm: number;
    subdivision: SubdivisionType;
    // any added here because typescript sucks sometimes
    interval: any | Interval;
}

const Metronome: React.FC = () => {
    const [state, setState] = useState<MetronomeState>({
        isPlaying: false,
        bpm: 100,
        subdivision: 'quarter',
        interval: 600, // 60000 / 100 bpm
    });

    const audioContextRef = useRef<AudioContext | null>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const tapTimesRef = useRef<number[]>([]);

    const bgColor = useColorModeValue('gray.100', 'gray.700');
    const textColor = useColorModeValue('gray.800', 'white');

    useEffect(() => {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
            if (audioContextRef.current) audioContextRef.current.close();
        };
    }, []);

    const calculateSubdivisionInterval = useCallback((bpm: number, subdivisionType: SubdivisionType): number | [number, number] => {
        const quarterNoteInterval = 60000 / bpm;
        switch (subdivisionType) {
            case 'eighth':
                return quarterNoteInterval / 2;
            case 'sixteenth':
                return quarterNoteInterval / 4;
            case 'dotted_eighth':
                return [quarterNoteInterval * 0.75, quarterNoteInterval * 0.25];
            case 'triplet':
                return quarterNoteInterval / 3;
            case 'swing_triplet':
                return [quarterNoteInterval * 2/3, quarterNoteInterval / 3];
            default:
                return quarterNoteInterval;
        }
    }, []);


    const updateState = useCallback((updates: Partial<MetronomeState>) => {
        setState(prevState => {
            const newState = { ...prevState, ...updates };
            if (newState.bpm !== prevState.bpm || newState.subdivision !== prevState.subdivision) {
                newState.interval = calculateSubdivisionInterval(newState.bpm, newState.subdivision) as Interval;
            }
            return newState;
        });
    }, [calculateSubdivisionInterval]);


    const playSound = useCallback((duration: number) => {
        if (audioContextRef.current) {
            const oscillator = audioContextRef.current.createOscillator();
            const gainNode = audioContextRef.current.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContextRef.current.destination);

            oscillator.frequency.setValueAtTime(1000, audioContextRef.current.currentTime);
            gainNode.gain.setValueAtTime(0, audioContextRef.current.currentTime);
            gainNode.gain.linearRampToValueAtTime(1, audioContextRef.current.currentTime + 0.001);
            gainNode.gain.linearRampToValueAtTime(0, audioContextRef.current.currentTime + 0.001 + duration / 5000);

            oscillator.start();
            oscillator.stop(audioContextRef.current.currentTime + duration / 1000);
        }
    }, []);

    const playTick = useCallback(() => {
        // add possible emphasis logic here?
        playSound(state.interval);
    }, [state.interval, playSound]);

    const startMetronome = useCallback(() => {
        if (intervalRef.current) clearInterval(intervalRef.current);

        const baseInterval = 60000 / state.bpm; // Quarter note interval

        if (Array.isArray(state.interval)) {
            intervalRef.current = setInterval(() => {
                playSound(state.interval[0]);
                setTimeout(() => playSound(state.interval[1]), state.interval[0]);
            }, baseInterval);
        } else {
            intervalRef.current = setInterval(playTick, state.interval);
        }

        updateState({ isPlaying: true });
    }, [state.bpm, state.interval, playTick, playSound, updateState]);


    const stopMetronome = useCallback(() => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        updateState({ isPlaying: false });
    }, [updateState]);

    const adjustBpm = useCallback((increment: number) => {
        updateState({ bpm: Math.max(40, Math.min(220, state.bpm + increment)) });
    }, [state.bpm, updateState]);

    const handleTap = useCallback(() => {
        const now = Date.now();
        tapTimesRef.current.push(now);

        if (tapTimesRef.current.length > 4) {
            tapTimesRef.current.shift();
        }

        if (tapTimesRef.current.length >= 2) {
            const intervals = [];
            for (let i = 1; i < tapTimesRef.current.length; i++) {
                intervals.push(tapTimesRef.current[i] - tapTimesRef.current[i-1]);
            }
            const averageInterval = intervals.reduce((a, b) => a + b) / intervals.length;
            const newBpm = Math.round(60000 / averageInterval);
            updateState({ bpm: Math.max(40, Math.min(220, newBpm)) });
        }
    }, [updateState]);

    const cycleSubdivision = useCallback(() => {
        const currentIndex = subdivisions.indexOf(state.subdivision);
        const nextIndex = (currentIndex + 1) % subdivisions.length;
        updateState({ subdivision: subdivisions[nextIndex] });
    }, [state.subdivision, updateState]);

    useEffect(() => {
        if (state.isPlaying) {
            stopMetronome();
            startMetronome();
        }
    }, [state.bpm, state.subdivision, startMetronome, stopMetronome]);


    return (
        <ChakraProvider>
            <Container centerContent maxW="100%" h="100vh" bg={bgColor}>
                <VStack spacing={8} justify="center" h="100%" w="100%">
                    <Box borderWidth="1px" borderRadius="lg" p={6} width="80%" maxWidth="300px">
                        <VStack spacing={4}>
                            <Text fontSize="6xl" fontWeight="bold" color={textColor}>
                                {state.bpm}
                            </Text>
                            <Text fontSize="2xl" color={textColor}>
                                BPM
                            </Text>
                            <HStack spacing={4}>
                                <IconButton
                                    aria-label="Decrease BPM"
                                    icon={<ChevronDownIcon />}
                                    onClick={() => adjustBpm(-4)}
                                    size="lg"
                                    colorScheme="blue"
                                />
                                <IconButton
                                    aria-label="Increase BPM"
                                    icon={<ChevronUpIcon />}
                                    onClick={() => adjustBpm(4)}
                                    size="lg"
                                    colorScheme="blue"
                                />
                            </HStack>
                            <Button
                                onClick={state.isPlaying ? stopMetronome : startMetronome}
                                size="lg"
                                width="100%"
                                height="60px"
                                fontSize="2xl"
                                colorScheme={state.isPlaying ? "red" : "green"}
                            >
                                {state.isPlaying ? 'Stop' : 'Start'}
                            </Button>
                            <Button
                                onClick={handleTap}
                                size="lg"
                                width="100%"
                                height="60px"
                                fontSize="2xl"
                                colorScheme="purple"
                            >
                                Tap Tempo
                            </Button>
                            <Button
                                onClick={cycleSubdivision}
                                size="lg"
                                width="100%"
                                height="60px"
                                fontSize="2xl"
                                colorScheme="teal"
                            >
                                {state.subdivision.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                            </Button>
                        </VStack>
                    </Box>
                </VStack>
            </Container>
        </ChakraProvider>
    );
};

export default Metronome;
