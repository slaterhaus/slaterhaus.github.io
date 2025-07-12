export interface CadenceResult {
    bpm: number;
    originalBpm: number;
    adjustmentMade: boolean;
}

const MUSICAL_LIMITS = {
    MAX_BPM: 200,
    DIVISION_FACTOR: 2
};

const CONVERSIONS = {
    MPH_TO_METERS_PER_MIN: 26.8224,
    KPH_TO_METERS_PER_MIN: 16.6667
};

/**
 * Calculates running cadence based on inseam length and speed
 * @param inseamMeters - runner's inseam in meters
 * @param speed - speed in miles per hour or kilometers per hour
 * @param isImperial - whether the speed is in mph (true) or km/h (false)
 */
export function calculateRunningCadence(
    inseamMeters: number,
    speed: number,
    isImperial: boolean
): CadenceResult {
    if (inseamMeters <= 0 || speed <= 0) {
        throw new Error("Inputs must be positive numbers");
    }
    const strideLength = inseamMeters * 2.3;
    const speedMetersPerMinute = speed * (
        isImperial
            ? CONVERSIONS.MPH_TO_METERS_PER_MIN
            : CONVERSIONS.KPH_TO_METERS_PER_MIN
    );
    const rawCadence = Math.round((speedMetersPerMinute / strideLength) * 2);
    let finalBpm = rawCadence;
    let adjustmentMade = false;

    while (finalBpm > MUSICAL_LIMITS.MAX_BPM) {
        finalBpm = Math.round(finalBpm / MUSICAL_LIMITS.DIVISION_FACTOR);
        adjustmentMade = true;
    }

    return {
        bpm: finalBpm,
        originalBpm: rawCadence,
        adjustmentMade
    };
}