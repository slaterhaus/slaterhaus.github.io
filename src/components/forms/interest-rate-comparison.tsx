import React, {useState} from 'react';
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    NumberInput,
    NumberInputField,
    VStack,
} from '@chakra-ui/react';

const InterestRateComparisonForm = ({onSubmit}: any) => {
    const [mortgageAmount, setMortgageAmount] = useState('');
    const [mortgageRate, setMortgageRate] = useState('');
    const [savingsRate, setSavingsRate] = useState('');
    const [investmentAmount, setInvestmentAmount] = useState('');

    const handleSubmit = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        onSubmit({mortgageAmount, mortgageRate, savingsRate, investmentAmount});
    };

    return (
        <Box as="form" onSubmit={handleSubmit}>
            <VStack spacing={4}>
                <FormControl isRequired>
                    <FormLabel>Mortgage Amount</FormLabel>
                    <NumberInput onChange={(valueString) => setMortgageAmount(valueString)}>
                        <NumberInputField/>
                    </NumberInput>
                </FormControl>
                <FormControl isRequired>
                    <FormLabel>Mortgage Interest Rate (%)</FormLabel>
                    <NumberInput onChange={(valueString) => setMortgageRate(valueString)}>
                        <NumberInputField/>
                    </NumberInput>
                </FormControl>
                <FormControl isRequired>
                    <FormLabel>Savings Interest Rate (%)</FormLabel>
                    <NumberInput onChange={(valueString) => setSavingsRate(valueString)}>
                        <NumberInputField/>
                    </NumberInput>
                </FormControl>
                <FormControl isRequired>
                    <FormLabel>Investment Amount in SPY</FormLabel>
                    <NumberInput onChange={(valueString) => setInvestmentAmount(valueString)}>
                        <NumberInputField/>
                    </NumberInput>
                </FormControl>
                <Button type="submit" colorScheme="blue">Calculate</Button>
            </VStack>
        </Box>
    );
};

export default InterestRateComparisonForm;