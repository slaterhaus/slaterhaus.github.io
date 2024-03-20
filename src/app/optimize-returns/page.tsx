"use client";
import React, {useState} from 'react';
import {ChakraProvider, Container} from '@chakra-ui/react';

import {Line} from 'react-chartjs-2';
import InterestRateComparisonForm from "@/components/forms/interest-rate-comparison";
import {calculateChartData} from "@/functions/interest-rates";
import {
    CategoryScale,
    Chart as ChartJS,
    ChartData, Legend,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip
} from "chart.js";
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);
const Page = () => {
    const [chartData, setChartData] = useState<ChartData<'line'>>({datasets: [], labels: [], xLabels: [], yLabels: []});

    const calculateData = (formData: any) => {
        // Perform calculations based on formData
        // For simplicity, this example won't include the actual calculations
        // Assume calculateChartData returns an object suitable for react-chartjs-2

        const data = calculateChartData({formData});
        setChartData(data);
    };

    return (
        <ChakraProvider>
            <Container>
            <InterestRateComparisonForm onSubmit={calculateData}/>
            <Line data={chartData}/>
            </Container>
        </ChakraProvider>
    );
};

export default Page;