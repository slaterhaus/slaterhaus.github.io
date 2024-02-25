"use client";
import React, {useCallback, useEffect, useState} from 'react';
import {Line} from 'react-chartjs-2';
import {ChartData, ChartOptions} from "chart.js";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import {BlockMath} from 'react-katex';
import 'katex/dist/katex.min.css'; // Ensure this is imported

import {Box, ChakraProvider, Container, FormControl, FormLabel, Input, VStack, Text, HStack} from "@chakra-ui/react";
import {debounce} from "chart.js/helpers"; // Import the react-latex-next library


// Register the components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

interface Props {
    baseInvestment: number;
    percentageDiff: number;
    a: number;
    b: number;
    c: number;
    minMultiplier: number;
    maxMultiplier: number;
}

const initialChartData: ChartData<'line'> = {
    labels: [],
    datasets: [
        {
            label: 'Investment Amount',
            data: [],
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
        }
    ]
};
const chartOptions: ChartOptions<'line'> = {
    scales: {
        x: {
            type: 'linear', // Specify linear scale for numerical data
            position: 'bottom',
            title: {
                display: true,
                text: 'Percentage Difference (%)'
            }
        },
        y: {
            beginAtZero: true,
            title: {
                display: true,
                text: 'Investment Amount'
            }
        }
    }
};

function calculateInvestment({
                                 baseInvestment,
                                 percentageDiff,
                                 a = 1,
                                 b = 0.05,
                                 c = 0.05,
                                 minMultiplier = .5,
                                 maxMultiplier = 4
                             }: Props): number {
    // Ensure base parameters for the exponential model are suitable

    // Calculate the raw multiplier using an adjusted exponential decay formula
    // Adjust 'b' to control the sensitivity of the investment to percentage_diff
    if (!percentageDiff) return baseInvestment
    let multiplier: number = a * Math.exp(-b * Math.abs(percentageDiff)) + c;

    // Modify multiplier based on the direction of percentage_diff
    if (percentageDiff > 0) {
        multiplier += (4 - 1.0) * (1 - Math.exp(b * percentageDiff)); // Scale up towards 4x for positive diffs
    } else if (percentageDiff < 0) {
        multiplier = 1.0 - (.5 * (1 - Math.exp(-b * percentageDiff))); // Scale down towards 0.5x for negative diffs
    }

    // Calculate the actual investment amount
    let actualInvestment: number = baseInvestment * multiplier;

    // Ensure the investment is within the specified range
    actualInvestment = Math.max(baseInvestment * minMultiplier, Math.min(baseInvestment * maxMultiplier, actualInvestment));

    return actualInvestment;
}

const InvestmentPage = () => {
    // State hooks for each input
    const [baseInvestment, setBaseInvestment] = useState<number>(100); // Example default value

    const [a, setA] = useState<number>(1);
    const [b, setB] = useState<number>(0.0875);
    const [c, setC] = useState<number>(0);
    const [minMultiplier, setMinimumMultiplier] = useState<number>(0.1);
    const [maxMultiplier, setMaximumMultiplier] = useState<number>(4);
    const [chartData, setChartData] = useState<ChartData<'line'>>(initialChartData);
    const [ticker, setTicker] = useState<string>(''); // New state hook for ticker input
    const [investmentAmount, setInvestmentAmount] = useState<number>(0); // State hook to store the calculated investment amount
    const [percentageDiff, setPercentageDiff] = useState<number>(0);
    const [currentPrice, setCurrentPrice] = useState<number>(0)

    const fetchStockData = async (ticker: string) => {
        try {
            const response = await fetch(`https://vantage-proxy.vercel.app/api/stocks/price-and-average/?symbol=${ticker}`);
            const data = await response.json();
            const {percentDifference, latestPrice, movingAverage} = data;
            setCurrentPrice(latestPrice);
            setPercentageDiff(percentDifference);
            const investment = calculateInvestment({
                baseInvestment,
                percentageDiff: percentDifference,
                a,
                b,
                c,
                minMultiplier,
                maxMultiplier
            });
            setInvestmentAmount(investment);
        } catch (error) {
            console.error('Error fetching stock data:', error);
        }
    };

    // Debounced version of fetchStockData to limit API calls
    const debouncedFetchStockData = useCallback(debounce(fetchStockData, 500), []);

    // Effect hook to call the API when the ticker value changes
    useEffect(() => {
        if (ticker) {
            debouncedFetchStockData(ticker);
        }
    }, [ticker, debouncedFetchStockData]);


// Construct the LaTeX string
    const lead = "The investment amount is caulcated as: "
    let equation = `m(p) = `;
    equation += a === 1 ? "" : `${a} \\cdot `
    equation += `e^{-${b}p}`
    equation += c ? ` + ${c}` : ""


// The rest of your component code remains the same


    const updateChart = () => {
        const labels = [];
        const data = [];
        for (let i = -20; i <= 20; i++) {
            labels.push(i.toString());
            const investment = calculateInvestment({
                baseInvestment,
                percentageDiff: i,
                a,
                b,
                c,
                minMultiplier,
                maxMultiplier
            });
            data.push(investment);
        }

        setChartData({
            ...chartData,
            labels,
            datasets: [
                {
                    ...chartData.datasets[0],
                    data
                }
            ]
        });
    };


    useEffect(() => {
        updateChart();
    }, [baseInvestment, a, b, c, minMultiplier, maxMultiplier]);

    return (
        <ChakraProvider>
            <Container maxW="container.lg">
                <VStack spacing={1} align="stretch">
                    <FormControl>
                        <FormLabel>Base Investment:</FormLabel>
                        <Input type="number" value={baseInvestment}
                               onChange={(e) => setBaseInvestment(Number(e.target.value))}
                               placeholder="Base Investment"/>
                    </FormControl>
                    <FormControl>
                        <FormLabel>A:</FormLabel>
                        <Input type="number" value={a} onChange={(e) => setA(Number(e.target.value))} step={0.01}
                               placeholder="A"/>
                    </FormControl>
                    <FormControl>
                        <FormLabel>B:</FormLabel>
                        <Input type="number" value={b} onChange={(e) => setB(Number(e.target.value))} placeholder="B"
                               step={0.01}/>
                    </FormControl>
                    <FormControl>
                        <FormLabel>C:</FormLabel>
                        <Input type="number" value={c} onChange={(e) => setC(Number(e.target.value))} placeholder="C"
                               step={0.01}/>
                    </FormControl>
                    <HStack>
                        <FormControl>
                            <FormLabel>Minimum Multiplier:</FormLabel>
                            <Input type="number" value={minMultiplier}
                                   onChange={(e) => setMinimumMultiplier(Number(e.target.value))}
                                   placeholder="Minimum Multiplier"/>
                        </FormControl>
                        <FormControl>
                            <FormLabel>Maximum Multiplier:</FormLabel>
                            <Input type="number" value={maxMultiplier}
                                   onChange={(e) => setMaximumMultiplier(Number(e.target.value))}
                                   placeholder="Maximum Multiplier"/>
                        </FormControl>
                    </HStack>
                    <HStack>
                        <FormControl>
                            <FormLabel>Ticker:</FormLabel>
                            <Input
                                type="text"
                                value={ticker}
                                onChange={(e) => setTicker(e.target.value)}
                                placeholder="Enter stock ticker"
                            />
                        </FormControl>

                    </HStack>

                    <HStack>
                    <Box p={6} shadow="md" borderWidth="1px" width={"50%"}>
                        <Text mb={4}>Investment Equation:</Text>
                        <BlockMath math={equation}/>
                    </Box>
                        <Box p={6} shadow="md" borderWidth="1px" width={"50%"}>
                        <VStack>
                            <Text>Current Price: ${currentPrice.toFixed(2)}</Text>
                            <Text>Percentage Difference: {percentageDiff.toFixed(2)}%</Text>
                            <Text>Calculated Investment Amount: ${investmentAmount.toFixed(2)}</Text>
                        </VStack>
                        </Box>
                    </HStack>

                    <Box p={5} shadow="md" borderWidth="1px">
                        <Line data={chartData} options={chartOptions}/>
                    </Box>
                </VStack>
            </Container>
        </ChakraProvider>
    );
};

export default InvestmentPage;

