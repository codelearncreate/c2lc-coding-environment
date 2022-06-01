// @flow

import type { PathSegment } from './types';

function approxEqual(a: number, b: number, epsilon: number): boolean {
    return Math.abs(a - b) < epsilon;
}

function clamp(lower: number, upper: number, val: number): number {
    if (val < lower) {
        return lower;
    }
    else if (val > upper) {
        return upper;
    }
    return val;
}

function degrees2radians(degrees: number): number {
    return degrees * Math.PI / 180;
}

function distance(x1: number, y1: number, x2: number, y2: number) {
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}

function isOppositeDirection(dir1: number, dir2: number): boolean {
    if (dir1 === 0) {
        return dir2 === Math.PI;
    } else {
        return wrap(Math.PI * -1, Math.PI, dir1 + Math.PI) === dir2;
    }
}

function pathSegmentDirection(pathSegment: PathSegment): number {
    return Math.atan2(pathSegment.y2 - pathSegment.y1,
        pathSegment.x2 - pathSegment.x1);
}

function pathSegmentLiesWithin(pathSegment: PathSegment, target: PathSegment): boolean {
    // When we compare distances below we are using floating point values
    // and will need to do inexact comparison; we select an epsilon value
    // of 0.01 which is small relative to our grid cell unit size of 1
    const epsilon = 0.01;
    const targetLength = distance(target.x1, target.y1, target.x2, target.y2);
    // Is pathSegment point 1 on the target?
    const distPathSegment1ToTarget1 = distance(pathSegment.x1, pathSegment.y1, target.x1, target.y1);
    const distPathSegment1ToTarget2 = distance(pathSegment.x1, pathSegment.y1, target.x2, target.y2);
    if (Math.abs(targetLength - distPathSegment1ToTarget1 - distPathSegment1ToTarget2) > epsilon) {
        return false;
    }
    // Is pathSegment point 2 on the target?
    const distPathSegment2ToTarget1 = distance(pathSegment.x2, pathSegment.y2, target.x1, target.y1);
    const distPathSegment2ToTarget2 = distance(pathSegment.x2, pathSegment.y2, target.x2, target.y2);
    if (Math.abs(targetLength - distPathSegment2ToTarget1 - distPathSegment2ToTarget2) > epsilon) {
        return false;
    }
    return true;
}

function wrap(start: number, stop: number, val: number): number {
    return val - (Math.floor((val - start) / (stop - start)) * (stop - start));
}

export {
    approxEqual,
    clamp,
    degrees2radians,
    distance,
    isOppositeDirection,
    pathSegmentDirection,
    pathSegmentLiesWithin,
    wrap
};
