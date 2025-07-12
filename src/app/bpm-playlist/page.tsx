"use client"
import {useState} from "react";
import {
    Box,
    VStack,
    Heading,
    FormControl,
    FormLabel,
    Button,
    Switch,
    Text,
    Container,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    Select,
    Alert,
    AlertIcon, ChakraProvider,
} from "@chakra-ui/react";

import {calculateRunningCadence} from "@/functions/calculate-running-cadence";

export default function BPMPlaylist() {
    const [inseam, setInseam] = useState('');
    const [speed, setSpeed] = useState('');
    const [bpm, setBPM] = useState<number>();
    const [useImperial, setUseImperial] = useState(false);
    const [selectedGenre, setSelectedGenre] = useState('workout');
    const [adjustmentMessage, setAdjustmentMessage] = useState<string>();
    const [error, setError] = useState<string | null>(null);

    const handleCalculate = () => {
        try {
            const inseamMeters = useImperial
                ? (Number(inseam) * 2.54) / 100
                : Number(inseam) / 100;

            const {bpm: calculatedBpm, originalBpm, adjustmentMade} = calculateRunningCadence(
                inseamMeters,
                Number(speed),
                useImperial
            );

            setBPM(calculatedBpm);
            setAdjustmentMessage(
                adjustmentMade
                    ? `Original cadence (${originalBpm} BPM) adjusted to match musical tempo range`
                    : undefined
            );
            setError(null);
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Calculation error');
        }
    };

    const genres = [
        'workout', 'running', 'dance', 'electronic', 'pop',
        'rock', 'hip-hop', 'metal', 'classical', 'jazz'
    ];

    return (
        <ChakraProvider>
            <Container maxW="container.sm" py={8}>
                <VStack spacing={6} align="stretch">
                    <Heading as="h1" size="xl" textAlign="center">
                        BPM Playlist Calculator
                    </Heading>

                    <FormControl display="flex" alignItems="center">
                        <FormLabel htmlFor="imperial-switch" mb="0">
                            Use Imperial Units (inches & mph)
                        </FormLabel>
                        <Switch
                            id="imperial-switch"
                            isChecked={useImperial}
                            onChange={(e) => setUseImperial(e.target.checked)}
                        />
                    </FormControl>

                    <FormControl>
                        <FormLabel>
                            Inseam {useImperial ? '(inches)' : '(cm)'}
                        </FormLabel>
                        <NumberInput
                            value={inseam}
                            onChange={(valueString) => setInseam(valueString)}
                            min={0}
                        >
                            <NumberInputField/>
                            <NumberInputStepper>
                                <NumberIncrementStepper/>
                                <NumberDecrementStepper/>
                            </NumberInputStepper>
                        </NumberInput>
                    </FormControl>

                    <FormControl>
                        <FormLabel>
                            Speed {useImperial ? '(mph)' : '(km/h)'}
                        </FormLabel>
                        <NumberInput
                            value={speed}
                            onChange={(valueString) => setSpeed(valueString)}
                            min={0}
                            precision={1}
                        >
                            <NumberInputField/>
                            <NumberInputStepper>
                                <NumberIncrementStepper/>
                                <NumberDecrementStepper/>
                            </NumberInputStepper>
                        </NumberInput>
                    </FormControl>

                    {/*<FormControl>*/}
                    {/*    <FormLabel>Genre</FormLabel>*/}
                    {/*    <Select*/}
                    {/*        value={selectedGenre}*/}
                    {/*        onChange={(e) => setSelectedGenre(e.target.value)}*/}
                    {/*    >*/}
                    {/*        {genres.map((genre) => (*/}
                    {/*            <option key={genre} value={genre}>*/}
                    {/*                {genre.charAt(0).toUpperCase() + genre.slice(1)}*/}
                    {/*            </option>*/}
                    {/*        ))}*/}
                    {/*    </Select>*/}
                    {/*</FormControl>*/}

                    <Button
                        colorScheme="blue"
                        size="lg"
                        onClick={handleCalculate}
                        isDisabled={!inseam || !speed}
                    >
                        Calculate BPM
                    </Button>

                    {error && (
                        <Alert status="error">
                            <AlertIcon/>
                            {error}
                        </Alert>
                    )}

                    {bpm && (
                        <Box
                            p={4}
                            borderRadius="md"
                            bg="blue.50"
                            borderWidth="1px"
                            borderColor="blue.200"
                        >
                            <Text fontSize="xl" fontWeight="bold" textAlign="center">
                                Your Target BPM: {bpm}
                            </Text>
                            {adjustmentMessage && (
                                <Text fontSize="sm" color="blue.600" mt={2} textAlign="center">
                                    Note: {adjustmentMessage}
                                </Text>
                            )}
                        </Box>
                    )}
                </VStack>
            </Container>
        </ChakraProvider>
    );
}