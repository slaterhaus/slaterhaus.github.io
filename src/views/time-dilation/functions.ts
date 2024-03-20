export function gravitationalTimeDilationFactor(G: number, M: number, r: number, c: number): number {
    // Ensure that we do not get an invalid value due to too small r, negative square root, etc.
    const underRoot = 1 - (2 * G * M) / (r * c * c);

    if (underRoot <= 0) {
        // Return some minimum factor to avoid invalid (imaginary) time dilation factors
        return 0.1; // This is arbitrary and should be adjusted based on your simulation needs.
    }

    // The time dilation factor; note that for distant r, this approaches 1 (no dilation).
    return Math.sqrt(underRoot);
}
export function calculateVelocityFromConstants(G: number, M: number, r: number): number {
    // We'll manually implement the square root using the Newton-Raphson method
    // for educational purposes, as requested to avoid built-in methods.

    // The function to find the root for: f(x) = x^2 - S (where S is the number we want the square root of).
    // We're finding the square root of (G * M / r), so S = (G * M / r).
    const S = G * M / r;

    // Initial guess for the square root of S. We can use any positive number,
    // but a reasonable first guess can speed up convergence.
    let x = S / 2;

    // Tolerance for the difference in successive values of x to decide when to stop iterating.
    // This can be adjusted for more or less precision.
    const tolerance = 1e-6;

    // Maximum number of iterations to avoid infinite loops in case of non-convergence.
    const maxIterations = 1000;
    let iteration = 0;

    while (iteration < maxIterations) {
        const nextX = (x + S / x) / 2; // Newton-Raphson formula: x_n+1 = (x_n + S / x_n) / 2

        if (Math.abs(x - nextX) < tolerance) {
            break; // The value has converged enough.
        }

        x = nextX;
        iteration++;
    }

    return x; // This x is the square root of (G * M / r), which equals the orbital velocity.
}

export function calculateVelocity(distance: number, period: number): number {
    // Calculate the circumference of the orbit
    const circumference = 2 * Math.PI * distance;

    // Calculate the velocity: distance per time (circumference divided by period)
    return circumference / period;
}

export function colorShift(velocity: number, c: number): string {
    // The proportion of the speed to the speed of light
    const proportion = velocity / c;
    // console.log(proportion)

    // Determine the shift type based on the velocity direction
    if (proportion < 0) { // Moving towards the observer
        // Blueshift: More blue means less red and green.
        // We limit the change so it doesn't go full blue or invisible.
        const blueAmount = Math.max(0, Math.min(255, 255 * (1 + proportion))); // Proportion is negative here
        return `rgb(255, ${blueAmount}, 255)`;
    } else { // Moving away from the observer
        // Redshift: More red means less blue and green.
        const redAmount = Math.max(0, Math.min(255, 255 * (1 - proportion))); // Proportion is positive here
        return `rgb(${redAmount}, ${redAmount}, 255)`;
    }
}

export function colorShift2(velocity: number): string {
    // Constants for redshift and blueshift effects
    const redShiftVelocity = 3000; // Threshold for redshift, in m/s
    const blueShiftVelocity = -3000; // Threshold for blueshift, in m/s

    if (velocity > redShiftVelocity) {
        return "#ff8080"; // Redshifted color (this is arbitrary and can be adjusted)
    } else if (velocity < blueShiftVelocity) {
        return "#8080ff"; // Blueshifted color (also arbitrary)
    } else {
        return "#ffffff"; // Neutral color, no significant shift
    }
}
