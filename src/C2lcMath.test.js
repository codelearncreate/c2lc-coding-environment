// @flow

import * as C2lcMath from './C2lcMath';

test('C2lcMath.approxEqual', () => {
    expect(C2lcMath.approxEqual(1.0, 1.05, 0.001)).toBeFalsy();
    expect(C2lcMath.approxEqual(1.0, 1.05, 0.01)).toBeFalsy();
    expect(C2lcMath.approxEqual(1.0, 1.05, 0.1)).toBeTruthy();
});

test('C2lcMath.clamp', () => {
    expect(C2lcMath.clamp(100, 200, 50)).toBe(100);
    expect(C2lcMath.clamp(100, 200, 100)).toBe(100);
    expect(C2lcMath.clamp(100, 200, 150)).toBe(150);
    expect(C2lcMath.clamp(100, 200, 200)).toBe(200);
    expect(C2lcMath.clamp(100, 200, 250)).toBe(200);
});

test('C2lcMath.distance', () => {
    expect(C2lcMath.distance(0, 0, 0, 0)).toBe(0);
    expect(C2lcMath.distance(0, 0, 2, 0)).toBe(2);
    expect(C2lcMath.distance(0, 0, -2, 0)).toBe(2);
    expect(C2lcMath.distance(0, 0, 0, 2)).toBe(2);
    expect(C2lcMath.distance(0, 0, 0, -2)).toBe(2);
    expect(C2lcMath.distance(0, 0, 3, 4)).toBe(5);
});

test('C2lcMath.isOppositeDirection', () => {
    // N/S
    expect(C2lcMath.isOppositeDirection(Math.PI * -0.5, Math.PI * 0.5)).toBe(true);
    // NE/SW
    expect(C2lcMath.isOppositeDirection(Math.PI * -0.25, Math.PI * 0.75)).toBe(true);
    // E/W
    expect(C2lcMath.isOppositeDirection(0, Math.PI)).toBe(true);
    // SE/NW
    expect(C2lcMath.isOppositeDirection(Math.PI * 0.25, Math.PI * -0.75)).toBe(true);
    // S/N
    expect(C2lcMath.isOppositeDirection(Math.PI * 0.5, Math.PI * -0.5)).toBe(true);
    // SW/NE
    expect(C2lcMath.isOppositeDirection(Math.PI * 0.75, Math.PI * -0.25)).toBe(true);
    // W/E
    expect(C2lcMath.isOppositeDirection(Math.PI, 0)).toBe(true);
    // NW/SE
    expect(C2lcMath.isOppositeDirection(Math.PI * -0.75, Math.PI * 0.25)).toBe(true);
});

test('C2lcMath.pathSegmentDirection', () => {
    // N
    expect(C2lcMath.pathSegmentDirection({x1: 0, y1: 0, x2: 0, y2: -1})).toBe(Math.PI * -0.5);
    // NE
    expect(C2lcMath.pathSegmentDirection({x1: 0, y1: 0, x2: 1, y2: -1})).toBe(Math.PI * -0.25);
    // E
    expect(C2lcMath.pathSegmentDirection({x1: 0, y1: 0, x2: 1, y2: 0})).toBe(0);
    // SE
    expect(C2lcMath.pathSegmentDirection({x1: 0, y1: 0, x2: 1, y2: 1})).toBe(Math.PI * 0.25);
    // S
    expect(C2lcMath.pathSegmentDirection({x1: 0, y1: 0, x2: 0, y2: 1})).toBe(Math.PI * 0.5);
    // SW
    expect(C2lcMath.pathSegmentDirection({x1: 0, y1: 0, x2: -1, y2: 1})).toBe(Math.PI * 0.75);
    // W
    expect(C2lcMath.pathSegmentDirection({x1: 0, y1: 0, x2: -1, y2: 0})).toBe(Math.PI);
    // NW
    expect(C2lcMath.pathSegmentDirection({x1: 0, y1: 0, x2: -1, y2: -1})).toBe(Math.PI * -0.75);
});

test('C2lcMath.pathSegmentLiesWithin', () =>  {
    const target = {
        x1: 0,
        y1: 0,
        x2: 3,
        y2: 0
    };

    // Equal path segments
    expect(C2lcMath.pathSegmentLiesWithin(target, target)).toBe(true);

    // Inverse path segment
    expect(C2lcMath.pathSegmentLiesWithin({
        x1: 3,
        y1: 0,
        x2: 0,
        y2: 0
    }, target)).toBe(true);

    // At the start
    expect(C2lcMath.pathSegmentLiesWithin({
        x1: 0,
        y1: 0,
        x2: 1,
        y2: 0
    }, target)).toBe(true);

    // At the end
    expect(C2lcMath.pathSegmentLiesWithin({
        x1: 3,
        y1: 0,
        x2: 2,
        y2: 0
    }, target)).toBe(true);

    // Within, forward
    expect(C2lcMath.pathSegmentLiesWithin({
        x1: 1,
        y1: 0,
        x2: 2,
        y2: 0
    }, target)).toBe(true);

    // Within, backwards
    expect(C2lcMath.pathSegmentLiesWithin({
        x1: 2,
        y1: 0,
        x2: 1,
        y2: 0
    }, target)).toBe(true);

    // Extending at the end
    expect(C2lcMath.pathSegmentLiesWithin({
        x1: 3,
        y1: 0,
        x2: 4,
        y2: 0
    }, target)).toBe(false);

    // Extending at the start
    expect(C2lcMath.pathSegmentLiesWithin({
        x1: 0,
        y1: 0,
        x2: -1,
        y2: 0
    }, target)).toBe(false);

    // Overlapping forwards
    expect(C2lcMath.pathSegmentLiesWithin({
        x1: 2,
        y1: 0,
        x2: 4,
        y2: 0
    }, target)).toBe(false);

    // Overlapping backwards
    expect(C2lcMath.pathSegmentLiesWithin({
        x1: 1,
        y1: 0,
        x2: -1,
        y2: 0
    }, target)).toBe(false);

    // Parallel
    expect(C2lcMath.pathSegmentLiesWithin({
        x1: 0,
        y1: 1,
        x2: 3,
        y2: 1
    }, target)).toBe(false);
});

test('C2lcMath.wrap', () => {
    // [0, 10]

    expect(C2lcMath.wrap(0, 10, 0)).toBe(0);
    expect(C2lcMath.wrap(0, 10, 10)).toBe(0);
    expect(C2lcMath.wrap(0, 10, 8)).toBe(8);
    expect(C2lcMath.wrap(0, 10, 12)).toBe(2);
    expect(C2lcMath.wrap(0, 10, 20)).toBe(0);
    expect(C2lcMath.wrap(0, 10, 23)).toBe(3);
    expect(C2lcMath.wrap(0, 10, -2)).toBe(8);
    expect(C2lcMath.wrap(0, 10, -10)).toBe(0);
    expect(C2lcMath.wrap(0, 10, -13)).toBe(7);

    // [-20, -10]

    expect(C2lcMath.wrap(-20, -10, -20)).toBe(-20);
    expect(C2lcMath.wrap(-20, -10, -10)).toBe(-20);
    expect(C2lcMath.wrap(-20, -10, -12)).toBe(-12);
    expect(C2lcMath.wrap(-20, -10, -8)).toBe(-18);
    expect(C2lcMath.wrap(-20, -10, 0)).toBe(-20);
    expect(C2lcMath.wrap(-20, -10, 3)).toBe(-17);
    expect(C2lcMath.wrap(-20, -10, -22)).toBe(-12);
    expect(C2lcMath.wrap(-20, -10, -30)).toBe(-20);
    expect(C2lcMath.wrap(-20, -10, -33)).toBe(-13);
});
