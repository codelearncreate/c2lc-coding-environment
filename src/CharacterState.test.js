// @flow

import CharacterState from './CharacterState';
import * as C2lcMath from './C2lcMath';
import SceneDimensions from './SceneDimensions';

// TODO: Figure out a better mechanism for using Jest expect.extend()
//       with Flow than casting the expect() result to 'any'.

expect.extend({
    toHaveCharacterState(received, xPos, yPos, direction, path) {
        const pass =
            C2lcMath.approxEqual(received.xPos, xPos, 0.0001)
            && C2lcMath.approxEqual(received.yPos, yPos, 0.0001)
            && received.direction === direction
            && received.pathEquals(path, 0.0001);
        if (pass) {
            return {
                message: () => {
                    return 'Expected not:\n'
                        + `    xPos: ${xPos}\n`
                        + `    yPos: ${yPos}\n`
                        + `    direction: ${direction}\n`
                        + `    path: ${JSON.stringify(path)}\n`
                        + `Received: ${this.utils.printReceived(received)}`;
                },
                pass: true
            };
        } else {
            return {
                message: () => {
                    return 'Expected:\n'
                        + `    xPos: ${xPos}\n`
                        + `    yPos: ${yPos}\n`
                        + `    direction: ${direction}\n`
                        + `    path: ${JSON.stringify(path)}\n`
                        + `Received: ${this.utils.printReceived(received)}`;
                },
                pass: false
            };
        }
    }
});

test('CharacterState.pathEquals', () => {
    const oneSegment = [{x1: 100, y1: 200, x2: 300, y2: 400}];
    const twoSegments = [
        {x1: 100, y1: 200, x2: 300, y2: 400},
        {x1: 500, y1: 600, x2: 700, y2: 800}
    ];
    const sceneDimensions = new SceneDimensions(1, 1000, 1, 1000);

    expect(new CharacterState(0, 0, 0, [], sceneDimensions).pathEquals([], 1)).toBeTruthy();

    expect(new CharacterState(0, 0, 0, [], sceneDimensions).pathEquals(oneSegment, 1)).toBeFalsy();
    expect(new CharacterState(0, 0, 0, [], sceneDimensions).pathEquals(twoSegments, 1)).toBeFalsy();
    expect(new CharacterState(0, 0, 0, oneSegment, sceneDimensions).pathEquals([], 1)).toBeFalsy();
    expect(new CharacterState(0, 0, 0, oneSegment, sceneDimensions).pathEquals(twoSegments, 1)).toBeFalsy();
    expect(new CharacterState(0, 0, 0, twoSegments, sceneDimensions).pathEquals([], 1)).toBeFalsy();
    expect(new CharacterState(0, 0, 0, twoSegments, sceneDimensions).pathEquals(oneSegment, 1)).toBeFalsy();

    expect(new CharacterState(0, 0, 0, oneSegment, sceneDimensions).pathEquals([
        {x1: 100, y1: 200, x2: 300, y2: 400}
    ], 1)).toBeTruthy();

    expect(new CharacterState(0, 0, 0, twoSegments, sceneDimensions).pathEquals([
        {x1: 100, y1: 200, x2: 300, y2: 400},
        {x1: 500, y1: 600, x2: 700, y2: 800}
    ], 1)).toBeTruthy();

    expect(new CharacterState(0, 0, 0, twoSegments, sceneDimensions).pathEquals([
        {x1: 100, y1: 200, x2: 300, y2: 400},
        {x1: 501, y1: 600, x2: 700, y2: 800}
    ], 1)).toBeFalsy();

    expect(new CharacterState(0, 0, 0, twoSegments, sceneDimensions).pathEquals([
        {x1: 100, y1: 200, x2: 300, y2: 400},
        {x1: 500, y1: 601, x2: 700, y2: 800}
    ], 1)).toBeFalsy();

    expect(new CharacterState(0, 0, 0, twoSegments, sceneDimensions).pathEquals([
        {x1: 100, y1: 200, x2: 300, y2: 400},
        {x1: 500, y1: 600, x2: 701, y2: 800}
    ], 1)).toBeFalsy();

    expect(new CharacterState(0, 0, 0, twoSegments, sceneDimensions).pathEquals([
        {x1: 100, y1: 200, x2: 300, y2: 400},
        {x1: 500, y1: 600, x2: 700, y2: 801}
    ], 1)).toBeFalsy();
});

test('CharacterState.getDirectionDegrees() should return the direction in degrees', () => {
    const sceneDimensions = new SceneDimensions(1, 10, 1, 10);
    expect(new CharacterState(1, 1, 0, [], sceneDimensions).getDirectionDegrees()).toBe(0);
    expect(new CharacterState(1, 1, 1, [], sceneDimensions).getDirectionDegrees()).toBe(45);
    expect(new CharacterState(1, 1, 2, [], sceneDimensions).getDirectionDegrees()).toBe(90);
    expect(new CharacterState(1, 1, 3, [], sceneDimensions).getDirectionDegrees()).toBe(135);
    expect(new CharacterState(1, 1, 4, [], sceneDimensions).getDirectionDegrees()).toBe(180);
    expect(new CharacterState(1, 1, 5, [], sceneDimensions).getDirectionDegrees()).toBe(225);
    expect(new CharacterState(1, 1, 6, [], sceneDimensions).getDirectionDegrees()).toBe(270);
    expect(new CharacterState(1, 1, 7, [], sceneDimensions).getDirectionDegrees()).toBe(315);
});

test('The character can move in 8 directions (N, NE, E, SE, S, SW, W, NW)', () => {
    const sceneDimensions = new SceneDimensions(1, 5, 1, 5);
    // N
    (expect(new CharacterState(2, 2, 0, [], sceneDimensions).forward(1, true)): any)
        .toHaveCharacterState(2, 1, 0, [{x1: 2, y1: 2, x2: 2, y2: 1}]);
    (expect(new CharacterState(2, 2, 4, [], sceneDimensions).backward(1, true)): any)
        .toHaveCharacterState(2, 1, 4, [{x1: 2, y1: 2, x2: 2, y2: 1}]);
    // NE
    (expect(new CharacterState(1, 2, 1, [], sceneDimensions).forward(1, true)): any)
        .toHaveCharacterState(2, 1, 1, [{x1: 1, y1: 2, x2: 2, y2: 1}]);
    (expect(new CharacterState(1, 2, 5, [], sceneDimensions).backward(1, true)): any)
        .toHaveCharacterState(2, 1, 5, [{x1: 1, y1: 2, x2: 2, y2: 1}]);
    // E
    (expect(new CharacterState(1, 1, 2, [], sceneDimensions).forward(1, true)): any)
        .toHaveCharacterState(2, 1, 2, [{x1: 1, y1: 1, x2: 2, y2: 1}]);
    (expect(new CharacterState(1, 1, 6, [], sceneDimensions).backward(1, true)): any)
        .toHaveCharacterState(2, 1, 6, [{x1: 1, y1: 1, x2: 2, y2: 1}]);
    // SE
    (expect(new CharacterState(1, 1, 3, [], sceneDimensions).forward(1, true)): any)
        .toHaveCharacterState(2, 2, 3, [{x1: 1, y1: 1, x2: 2, y2: 2}]);
    (expect(new CharacterState(1, 1, 7, [], sceneDimensions).backward(1, true)): any)
        .toHaveCharacterState(2, 2, 7, [{x1: 1, y1: 1, x2: 2, y2: 2}]);
    // S
    (expect(new CharacterState(1, 1, 4, [], sceneDimensions).forward(1, true)): any)
        .toHaveCharacterState(1, 2, 4, [{x1: 1, y1: 1, x2: 1, y2: 2}]);
    (expect(new CharacterState(1, 1, 0, [], sceneDimensions).backward(1, true)): any)
        .toHaveCharacterState(1, 2, 0, [{x1: 1, y1: 1, x2: 1, y2: 2}]);
    // SW
    (expect(new CharacterState(2, 1, 5, [], sceneDimensions).forward(1, true)): any)
        .toHaveCharacterState(1, 2, 5, [{x1: 2, y1: 1, x2: 1, y2: 2}]);
    (expect(new CharacterState(2, 1, 1, [], sceneDimensions).backward(1, true)): any)
        .toHaveCharacterState(1, 2, 1, [{x1: 2, y1: 1, x2: 1, y2: 2}]);
    // W
    (expect(new CharacterState(2, 1, 6, [], sceneDimensions).forward(1, true)): any)
        .toHaveCharacterState(1, 1, 6, [{x1: 2, y1: 1, x2: 1, y2: 1}]);
    (expect(new CharacterState(2, 1, 2, [], sceneDimensions).backward(1, true)): any)
        .toHaveCharacterState(1, 1, 2, [{x1: 2, y1: 1, x2: 1, y2: 1}]);
    // NW
    (expect(new CharacterState(2, 2, 7, [], sceneDimensions).forward(1, true)): any)
        .toHaveCharacterState(1, 1, 7, [{x1: 2, y1: 2, x2: 1, y2: 1}]);
    (expect(new CharacterState(2, 2, 3, [], sceneDimensions).backward(1, true)): any)
        .toHaveCharacterState(1, 1, 3, [{x1: 2, y1: 2, x2: 1, y2: 1}]);
});

test('Turn Left moves anti-clockwise and wraps at N', () => {
    const sceneDimensions = new SceneDimensions(1, 10, 1, 10);
    (expect(new CharacterState(1, 1, 3, [], sceneDimensions).turnLeft(1)): any)
        .toHaveCharacterState(1, 1, 2, []);
    (expect(new CharacterState(1, 1, 3, [], sceneDimensions).turnLeft(3)): any)
        .toHaveCharacterState(1, 1, 0, []);
    (expect(new CharacterState(1, 1, 3, [], sceneDimensions).turnLeft(4)): any)
        .toHaveCharacterState(1, 1, 7, []);
});

test('Turn Right moves clockwise and wraps at N', () => {
    const sceneDimensions = new SceneDimensions(1, 10, 1, 10);
    (expect(new CharacterState(1, 1, 5, [], sceneDimensions).turnRight(1)): any)
        .toHaveCharacterState(1, 1, 6, []);
    (expect(new CharacterState(1, 1, 5, [], sceneDimensions).turnRight(3)): any)
        .toHaveCharacterState(1, 1, 0, []);
    (expect(new CharacterState(1, 1, 5, [], sceneDimensions).turnRight(4)): any)
        .toHaveCharacterState(1, 1, 1, []);
});

test('Given an empty path, then moving Forward should add a new path segment', () => {
    const sceneDimensions = new SceneDimensions(1, 5, 1, 5);
    (expect(new CharacterState(1, 1, 2, [], sceneDimensions).forward(1, true)): any)
        .toHaveCharacterState(2, 1, 2, [
            {x1: 1, y1: 1, x2: 2, y2: 1}
        ]);
});

test('When moving Forward in the same direction, the path segment should be extended', () => {
    const sceneDimensions = new SceneDimensions(1, 5, 1, 5);
    (expect(new CharacterState(2, 1, 2, [{x1: 1, y1: 1, x2: 2, y2: 1}], sceneDimensions).forward(1, true)): any)
        .toHaveCharacterState(3, 1, 2, [
            {x1: 1, y1: 1, x2: 3, y2: 1}
        ]);
});

test('When moving Forward in a different direction, a new path segment should be added', () => {
    const sceneDimensions = new SceneDimensions(1, 5, 1, 5);
    (expect(new CharacterState(1, 2, 2, [], sceneDimensions).forward(1, true).turnLeft(2).forward(1, true)): any)
        .toHaveCharacterState(2, 1, 0, [
            {x1: 1, y1: 2, x2: 2, y2: 2},
            {x1: 2, y1: 2, x2: 2, y2: 1}
        ]);
    (expect(new CharacterState(1, 1, 2, [], sceneDimensions).forward(1, true).turnRight(2).forward(1, true)): any)
        .toHaveCharacterState(2, 2, 4, [
            {x1: 1, y1: 1, x2: 2, y2: 1},
            {x1: 2, y1: 1, x2: 2, y2: 2}
        ]);
});

test('When Forward is retracing the last path segment, no path segment should be added', () => {
    const sceneDimensions = new SceneDimensions(1, 5, 1, 5);
    (expect(new CharacterState(1, 1, 2, [{x1: 2, y1: 1, x2: 1, y2: 1}], sceneDimensions).forward(1, true)): any)
        .toHaveCharacterState(2, 1, 2, [
            {x1: 2, y1: 1, x2: 1, y2: 1}
        ]);
});

test('Given an empty path, then moving Backward should add a new path segment', () => {
    const sceneDimensions = new SceneDimensions(1, 5, 1, 5);
    (expect(new CharacterState(1, 1, 6, [], sceneDimensions).backward(1, true)): any)
        .toHaveCharacterState(2, 1, 6, [
            {x1: 1, y1: 1, x2: 2, y2: 1}
        ]);
});

test('When moving Backward in the same direction, the path segment should be extended', () => {
    const sceneDimensions = new SceneDimensions(1, 5, 1, 5);
    (expect(new CharacterState(2, 1, 6, [{x1: 1, y1: 1, x2: 2, y2: 1}], sceneDimensions).backward(1, true)): any)
        .toHaveCharacterState(3, 1, 6, [
            {x1: 1, y1: 1, x2: 3, y2: 1}
        ]);
});

test('When moving Backward in a different direction, a new path segment should be added', () => {
    const sceneDimensions = new SceneDimensions(1, 5, 1, 5);
    (expect(new CharacterState(1, 2, 6, [], sceneDimensions).backward(1, true).turnLeft(2).backward(1, true)): any)
        .toHaveCharacterState(2, 1, 4, [
            {x1: 1, y1: 2, x2: 2, y2: 2},
            {x1: 2, y1: 2, x2: 2, y2: 1}
        ]);
    (expect(new CharacterState(1, 1, 6, [], sceneDimensions).backward(1, true).turnRight(2).backward(1, true)): any)
        .toHaveCharacterState(2, 2, 0, [
            {x1: 1, y1: 1, x2: 2, y2: 1},
            {x1: 2, y1: 1, x2: 2, y2: 2}
        ]);
});

test('When Backward is retracing the last path segment, no path segment should be added', () => {
    const sceneDimensions = new SceneDimensions(1, 5, 1, 5);
    (expect(new CharacterState(2, 1, 2, [{x1: 1, y1: 1, x2: 2, y2: 1}], sceneDimensions).backward(1, true)): any)
        .toHaveCharacterState(1, 1, 2, [
            {x1: 1, y1: 1, x2: 2, y2: 1}
        ]);
});

test('Forward move should not create a path segment, when drawingEnabled is false', () => {
    const sceneDimensions = new SceneDimensions(1, 5, 1, 5);
    (expect(new CharacterState(1, 1, 2, [], sceneDimensions).forward(1, false)): any)
        .toHaveCharacterState(2, 1, 2, []);
    (expect(new CharacterState(1, 1, 2, [], sceneDimensions).forward(1, false).forward(2, true)): any)
        .toHaveCharacterState(4, 1, 2, [
            {x1: 2, y1: 1, x2: 4, y2: 1}
        ]);
    (expect(new CharacterState(1, 1, 2, [], sceneDimensions).forward(1, true).forward(2, false)): any)
        .toHaveCharacterState(4, 1, 2, [
            {x1: 1, y1: 1, x2: 2, y2: 1}
        ]);
    (expect(new CharacterState(1, 1, 2, [], sceneDimensions).forward(1, false).forward(2, false)): any)
        .toHaveCharacterState(4, 1, 2, []);
});

test('Backward move should not create a path segment, when drawingEnabled is false', () => {
    const sceneDimensions = new SceneDimensions(1, 5, 1, 5);
    (expect(new CharacterState(2, 1, 2, [], sceneDimensions).backward(1, false)): any)
        .toHaveCharacterState(1, 1, 2, []);
    (expect(new CharacterState(4, 1, 2, [], sceneDimensions).backward(1, false).backward(2, true)): any)
        .toHaveCharacterState(1, 1, 2, [
            {x1: 3, y1: 1, x2: 1, y2: 1}
        ]);
    (expect(new CharacterState(4, 1, 2, [], sceneDimensions).backward(1, true).backward(2, false)): any)
        .toHaveCharacterState(1, 1, 2, [
            {x1: 4, y1: 1, x2: 3, y2: 1}
        ]);
    (expect(new CharacterState(4, 1, 2, [], sceneDimensions).backward(1, false).backward(2, false)): any)
        .toHaveCharacterState(1, 1, 2, []);
});

test('Forward move is limited to the sceneDimensions', () => {
    const sceneDimensions = new SceneDimensions(1, 10, 1, 10);
    (expect(new CharacterState(1, 1, 0, [], sceneDimensions).forward(2, false)): any)
        .toHaveCharacterState(1, 1, 0, []);
    (expect(new CharacterState(9, 3, 1, [], sceneDimensions).forward(3, false)): any)
        .toHaveCharacterState(10, 1, 1, []);
    (expect(new CharacterState(10, 1, 2, [], sceneDimensions).forward(2, false)): any)
        .toHaveCharacterState(10, 1, 2, []);
    (expect(new CharacterState(9, 8, 3, [], sceneDimensions).forward(3, false)): any)
        .toHaveCharacterState(10, 10, 3, []);
    (expect(new CharacterState(1, 10, 4, [], sceneDimensions).forward(2, false)): any)
        .toHaveCharacterState(1, 10, 4, []);
    (expect(new CharacterState(2, 8, 5, [], sceneDimensions).forward(3, false)): any)
        .toHaveCharacterState(1, 10, 5, []);
    (expect(new CharacterState(1, 1, 6, [], sceneDimensions).forward(2, false)): any)
        .toHaveCharacterState(1, 1, 6, []);
    (expect(new CharacterState(2, 3, 7, [], sceneDimensions).forward(3, false)): any)
        .toHaveCharacterState(1, 1, 7, []);
});

test('Backward move is limited to the sceneDimensions', () => {
    const sceneDimensions = new SceneDimensions(1, 10, 1, 10);
    (expect(new CharacterState(1, 10, 0, [], sceneDimensions).backward(2, false)): any)
        .toHaveCharacterState(1, 10, 0, []);
    (expect(new CharacterState(2, 8, 1, [], sceneDimensions).backward(3, false)): any)
        .toHaveCharacterState(1, 10, 1, []);
    (expect(new CharacterState(1, 1, 2, [], sceneDimensions).backward(2, false)): any)
        .toHaveCharacterState(1, 1, 2, []);
    (expect(new CharacterState(2, 3, 3, [], sceneDimensions).backward(3, false)): any)
        .toHaveCharacterState(1, 1, 3, []);
    (expect(new CharacterState(1, 1, 4, [], sceneDimensions).backward(2, false)): any)
        .toHaveCharacterState(1, 1, 4, []);
    (expect(new CharacterState(9, 3, 5, [], sceneDimensions).backward(3, false)): any)
        .toHaveCharacterState(10, 1, 5, []);
    (expect(new CharacterState(10, 1, 6, [], sceneDimensions).backward(2, false)): any)
        .toHaveCharacterState(10, 1, 6, []);
    (expect(new CharacterState(9, 8, 7, [], sceneDimensions).backward(3, false)): any)
        .toHaveCharacterState(10, 10, 7, []);
});

test('Moving diagonally out of the scene will only move parallel to the edges of the scene', () => {
    const sceneDimensions = new SceneDimensions(1, 10, 1, 10);
    (expect(new CharacterState(2, 1, 1, [], sceneDimensions).forward(1, true)): any)
        .toHaveCharacterState(3, 1, 1, [
            {x1: 2, y1: 1, x2: 3, y2: 1}
        ]);
    (expect(new CharacterState(9, 3, 1, [], sceneDimensions).forward(2, true)): any)
        .toHaveCharacterState(10, 1, 1, [
            {x1: 9, y1: 3, x2: 10, y2: 2},
            {x1: 10, y1: 2, x2: 10, y2: 1}
        ]);
    (expect(new CharacterState(2, 2, 1, [], sceneDimensions).backward(2, true)): any)
        .toHaveCharacterState(1, 4, 1, [
            {x1: 2, y1: 2, x2: 1, y2: 3},
            {x1: 1, y1: 3, x2: 1, y2: 4}
        ]);
    (expect(new CharacterState(10, 2, 3, [], sceneDimensions).forward(1, true)): any)
        .toHaveCharacterState(10, 3, 3, [
            {x1: 10, y1: 2, x2: 10, y2: 3}
        ]);
    (expect(new CharacterState(9, 3, 3, [], sceneDimensions).forward(2, true)): any)
        .toHaveCharacterState(10, 5, 3, [
            {x1: 9, y1: 3, x2: 10, y2: 4},
            {x1: 10, y1: 4, x2: 10, y2: 5}
        ]);
    (expect(new CharacterState(3, 2, 3, [], sceneDimensions).backward(2, true)): any)
        .toHaveCharacterState(1, 1, 3, [
            {x1: 3, y1: 2, x2: 2, y2: 1},
            {x1: 2, y1: 1, x2: 1, y2: 1}
        ]);
    (expect(new CharacterState(2, 10, 5, [], sceneDimensions).forward(1, true)): any)
        .toHaveCharacterState(1, 10, 5, [
            {x1: 2, y1: 10, x2: 1, y2: 10}
        ]);
    (expect(new CharacterState(2, 2, 5, [], sceneDimensions).forward(2, true)): any)
        .toHaveCharacterState(1, 4, 5, [
            {x1: 2, y1: 2, x2: 1, y2: 3},
            {x1: 1, y1: 3, x2: 1, y2: 4}
        ]);
    (expect(new CharacterState(2, 2, 5, [], sceneDimensions).backward(2, true)): any)
        .toHaveCharacterState(4, 1, 5, [
            {x1: 2, y1: 2, x2: 3, y2: 1},
            {x1: 3, y1: 1, x2: 4, y2: 1}
        ]);
    (expect(new CharacterState(1, 2, 7, [], sceneDimensions).forward(1, true)): any)
        .toHaveCharacterState(1, 1, 7, [
            {x1: 1, y1: 2, x2: 1, y2: 1}
        ]);
    (expect(new CharacterState(3, 2, 7, [], sceneDimensions).forward(2, true)): any)
        .toHaveCharacterState(1, 1, 7, [
            {x1: 3, y1: 2, x2: 2, y2: 1},
            {x1: 2, y1: 1, x2: 1, y2: 1}
        ]);
    (expect(new CharacterState(9, 3, 7, [], sceneDimensions).backward(2, true)): any)
        .toHaveCharacterState(10, 5, 7, [
            {x1: 9, y1: 3, x2: 10, y2: 4},
            {x1: 10, y1: 4, x2: 10, y2: 5}
        ]);
})


test('When direction is not an integer in range 0-7, forward() and backward() should throw an Error', () => {
    expect.assertions(6);
    const sceneDimensions = new SceneDimensions(1, 200, 1, 200);

    expect(() => {
        (new CharacterState(1, 1, -1, [], sceneDimensions)).forward(1, false);
    }).toThrowError(/^CharacterState direction must be an integer in range 0-7 inclusive$/);

    expect(() => {
        (new CharacterState(1, 1, 8, [], sceneDimensions)).forward(1, false);
    }).toThrowError(/^CharacterState direction must be an integer in range 0-7 inclusive$/);

    expect(() => {
        (new CharacterState(1, 1, 0.5, [], sceneDimensions)).forward(1, false);
    }).toThrowError(/^CharacterState direction must be an integer in range 0-7 inclusive$/);

    expect(() => {
        (new CharacterState(0, 0, 8.5, [], sceneDimensions)).backward(1, false);
    }).toThrowError(/^CharacterState direction must be an integer in range 0-7 inclusive$/);

    expect(() => {
        (new CharacterState(0, 0, 3.5, [], sceneDimensions)).backward(1, false);
    }).toThrowError(/^CharacterState direction must be an integer in range 0-7 inclusive$/);

    expect(() => {
        (new CharacterState(0, 0, 0.5, [], sceneDimensions)).backward(1, false);
    }).toThrowError(/^CharacterState direction must be an integer in range 0-7 inclusive$/);
});

test('The number of path segments should be limited to maxPathLength', () => {
    const sceneDimensions = new SceneDimensions(1, 10, 1, 10);
    const characterState = new CharacterState(1, 4, 2, [
        {x1: 1, y1: 1, x2: 2, y2: 1},
        {x1: 1, y1: 2, x2: 2, y2: 2},
        {x1: 1, y1: 3, x2: 2, y2: 3}
    ], sceneDimensions);

    characterState.maxPathLength = 3;

    (expect(characterState.forward(1, true)): any)
        .toHaveCharacterState(2, 4, 2, [
            {x1: 1, y1: 2, x2: 2, y2: 2},
            {x1: 1, y1: 3, x2: 2, y2: 3},
            {x1: 1, y1: 4, x2: 2, y2: 4}
        ]);
});

test('MoveUpPosition moves the character up one unit within the scene', () => {
    const sceneDimensions = new SceneDimensions(1, 10, 1, 10);
    (expect(new CharacterState(2, 3, 2, [], sceneDimensions).moveUpPosition()): any)
        .toHaveCharacterState(2, 2, 2, []);
    (expect(new CharacterState(2, 1, 2, [], sceneDimensions).moveUpPosition()): any)
        .toHaveCharacterState(2, 1, 2, []);
});

test('MoveRightPosition moves the character right one unit within the scene', () => {
    const sceneDimensions = new SceneDimensions(1, 10, 1, 10);
    (expect(new CharacterState(2, 3, 2, [], sceneDimensions).moveRightPosition()): any)
        .toHaveCharacterState(3, 3, 2, []);
    (expect(new CharacterState(10, 1, 2, [], sceneDimensions).moveRightPosition()): any)
        .toHaveCharacterState(10, 1, 2, []);
});

test('MoveDownPosition moves the character down one unit within the scene', () => {
    const sceneDimensions = new SceneDimensions(1, 10, 1, 10);
    (expect(new CharacterState(2, 3, 2, [], sceneDimensions).moveDownPosition()): any)
        .toHaveCharacterState(2, 4, 2, []);
    (expect(new CharacterState(2, 10, 2, [], sceneDimensions).moveDownPosition()): any)
        .toHaveCharacterState(2, 10, 2, []);
});

test('MoveLeftPosition moves the character Left one unit within the scene', () => {
    const sceneDimensions = new SceneDimensions(1, 10, 1, 10);
    (expect(new CharacterState(2, 3, 2, [], sceneDimensions).moveLeftPosition()): any)
        .toHaveCharacterState(1, 3, 2, []);
    (expect(new CharacterState(1, 1, 2, [], sceneDimensions).moveLeftPosition()): any)
        .toHaveCharacterState(1, 1, 2, []);
});

test('ChangeXPosition gets column label and updates xPosition', () => {
    const sceneDimensions = new SceneDimensions(1, 26, 1, 16);
    (expect(new CharacterState(2, 3, 2, [], sceneDimensions).changeXPosition('Z')): any)
        .toHaveCharacterState(26, 3, 2, []);
    (expect(new CharacterState(2, 3, 2, [], sceneDimensions).changeXPosition('z')): any)
        .toHaveCharacterState(26, 3, 2, []);
    (expect(new CharacterState(2, 3, 2, [], sceneDimensions).changeXPosition('A')): any)
        .toHaveCharacterState(1, 3, 2, []);
    (expect(new CharacterState(2, 3, 2, [], sceneDimensions).changeXPosition('a')): any)
        .toHaveCharacterState(1, 3, 2, []);
    (expect(new CharacterState(2, 3, 2, [], sceneDimensions).changeXPosition('3')): any)
        .toHaveCharacterState(2, 3, 2, []);
    (expect(new CharacterState(2, 3, 2, [], sceneDimensions).changeXPosition('Zz')): any)
        .toHaveCharacterState(2, 3, 2, []);
});

test('ChangeYPosition gets row label and updates yPosition', () => {
    const sceneDimensions = new SceneDimensions(1, 26, 1, 16);
    (expect(new CharacterState(2, 3, 2, [], sceneDimensions).changeYPosition(16)): any)
        .toHaveCharacterState(2, 16, 2, []);
    (expect(new CharacterState(2, 3, 2, [], sceneDimensions).changeYPosition(1)): any)
        .toHaveCharacterState(2, 1, 2, []);
    (expect(new CharacterState(2, 3, 2, [], sceneDimensions).changeYPosition(0)): any)
        .toHaveCharacterState(2, 3, 2, []);
    (expect(new CharacterState(2, 3, 2, [], sceneDimensions).changeYPosition(17)): any)
        .toHaveCharacterState(2, 3, 2, []);
});

test('getRowLabel returns current yPosition in string', () => {
    const sceneDimensions = new SceneDimensions(1, 26, 1, 16);
    expect(new CharacterState(2, 16, 2, [], sceneDimensions).getRowLabel()).toBe('16');
    expect(new CharacterState(2, 1, 2, [], sceneDimensions).getRowLabel()).toBe('1');
})

test('getColumnLabel returns current xPosition in string', () => {
    const sceneDimensions = new SceneDimensions(1, 26, 1, 16);
    expect(new CharacterState(26, 3, 2, [], sceneDimensions).getColumnLabel()).toBe('Z');
    expect(new CharacterState(1, 3, 2, [], sceneDimensions).getColumnLabel()).toBe('A');
});
