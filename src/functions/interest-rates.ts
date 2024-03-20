/**
 * Calculates the future value using compound interest formula.
 * @param {number} principal - The initial amount of money.
 * @param {number} annualRate - The annual interest rate (as a decimal).
 * @param {number} years - The number of years.
 * @returns {number} - The future value.
 */
const calculateFutureValue = (principal: number, annualRate: number, years: number): number => {
    return principal * Math.pow(1 + annualRate, years);
};

/**
 * Calculates the total mortgage interest paid over the life of the loan.
 * This simplification assumes fixed interest for the entire period.
 * @param {number} loanAmount - The total amount of the mortgage.
 * @param {number} annualRate - The annual interest rate (as a decimal).
 * @param {number} years - The number of years.
 * @returns {number} - The total interest paid.
 */
const calculateMortgageInterest = (loanAmount: number, annualRate: number, years: number) => {
    const monthlyRate = annualRate / 12;
    const totalPayments = years * 12;
    const monthlyPayment = loanAmount * monthlyRate / (1 - Math.pow(1 + monthlyRate, -totalPayments));
    return (monthlyPayment * totalPayments) - loanAmount;
};

export interface ChartData {
    formData: { mortgageAmount: string; mortgageRate: string; investmentAmount: string; savingsRate: string };
}

/**
 * Prepares chart data for mortgage interest, savings interest, and SPY investment returns.
 * @param {Object} formData - The user input data.
 * @returns {Object} - The data object for react-chartjs-2.
 */
export const calculateChartData = ({formData}: ChartData) => {
    const years = 30; // Example: 30-year period
    const labels = Array.from({length: years}, (_, i) => `Month ${i + 1}`);

    const mortgageInterestData = [];
    const savingsInterestData = [];
    const spyData = [];

    for (let year = 1; year <= years; year++) {
        // Mortgage interest (cumulative)
        const mortgageInterest = calculateMortgageInterest(parseFloat(formData.mortgageAmount), parseFloat(formData.mortgageRate) / 100, year);
        mortgageInterestData.push(mortgageInterest);

        // Savings interest (future value)
        const savingsInterest = calculateFutureValue(parseFloat(formData.investmentAmount), parseFloat(formData.savingsRate) / 100, year) - parseFloat(formData.investmentAmount);
        savingsInterestData.push(savingsInterest);

        // SPY investment return (future value)
        const spyReturn = calculateFutureValue(parseFloat(formData.investmentAmount), 0.10, year) - parseFloat(formData.investmentAmount); // Assuming 10% average return for SPY
        spyData.push(spyReturn);
    }

    return {
        datasetIdKey: '1',
        labels,
        datasets: [
            {
                label: 'Mortgage Interest',
                data: mortgageInterestData,
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
            {
                label: 'Savings Interest',
                data: savingsInterestData,
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
            {
                label: 'SPY Investment Return',
                data: spyData,
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
            },
        ],
    };
};