// @flow

function degrees2radians(degrees: number): number {
    return degrees * Math.PI / 180;
}

function getNormalizedCorrelation(x: Array<number>, y: Array<number>): number {

    if (x.length !== y.length) throw 'Length of x and y should be equal';

    let sumXY = 0, sumX2 = 0, sumY2 = 0;
    for (let i =0, numSamples = x.length; i<numSamples;i++) {
        sumXY += (x[i] * y[i]);
        sumX2 += Math.pow(y[i],2);
        sumY2 += Math.pow(x[i],2);
    }
    let denominator = Math.sqrt(sumX2*sumY2);
    let normalizedCorrelation = sumXY/denominator;

    return normalizedCorrelation;
}

function wrap(start: number, stop: number, val: number): number {
    return val - (Math.floor((val - start) / (stop - start)) * (stop - start));
}

export { degrees2radians, getNormalizedCorrelation, wrap };
