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
    const sceneDimensions = new SceneDimensions(1000, 1000);

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
    const sceneDimensions = new SceneDimensions(10, 10);
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
    const sceneDimensions = new SceneDimensions(500, 500);
    // N
    (expect(new CharacterState(200, 200, 0, [], sceneDimensions).forward(100, true)): any)
        .toHaveCharacterState(200, 100, 0, [{x1: 200, y1: 200, x2: 200, y2: 100}]);
    (expect(new CharacterState(200, 200, 4, [], sceneDimensions).backward(100, true)): any)
        .toHaveCharacterState(200, 100, 4, [{x1: 200, y1: 200, x2: 200, y2: 100}]);
    // NE
    (expect(new CharacterState(100, 200, 1, [], sceneDimensions).forward(100, true)): any)
        .toHaveCharacterState(200, 100, 1, [{x1: 100, y1: 200, x2: 200, y2: 100}]);
    (expect(new CharacterState(100, 200, 5, [], sceneDimensions).backward(100, true)): any)
        .toHaveCharacterState(200, 100, 5, [{x1: 100, y1: 200, x2: 200, y2: 100}]);
    // E
    (expect(new CharacterState(100, 100, 2, [], sceneDimensions).forward(100, true)): any)
        .toHaveCharacterState(200, 100, 2, [{x1: 100, y1: 100, x2: 200, y2: 100}]);
    (expect(new CharacterState(100, 100, 6, [], sceneDimensions).backward(100, true)): any)
        .toHaveCharacterState(200, 100, 6, [{x1: 100, y1: 100, x2: 200, y2: 100}]);
    // SE
    (expect(new CharacterState(100, 100, 3, [], sceneDimensions).forward(100, true)): any)
        .toHaveCharacterState(200, 200, 3, [{x1: 100, y1: 100, x2: 200, y2: 200}]);
    (expect(new CharacterState(100, 100, 7, [], sceneDimensions).backward(100, true)): any)
        .toHaveCharacterState(200, 200, 7, [{x1: 100, y1: 100, x2: 200, y2: 200}]);
    // S
    (expect(new CharacterState(100, 100, 4, [], sceneDimensions).forward(100, true)): any)
        .toHaveCharacterState(100, 200, 4, [{x1: 100, y1: 100, x2: 100, y2: 200}]);
    (expect(new CharacterState(100, 100, 0, [], sceneDimensions).backward(100, true)): any)
        .toHaveCharacterState(100, 200, 0, [{x1: 100, y1: 100, x2: 100, y2: 200}]);
    // SW
    (expect(new CharacterState(200, 100, 5, [], sceneDimensions).forward(100, true)): any)
        .toHaveCharacterState(100, 200, 5, [{x1: 200, y1: 100, x2: 100, y2: 200}]);
    (expect(new CharacterState(200, 100, 1, [], sceneDimensions).backward(100, true)): any)
        .toHaveCharacterState(100, 200, 1, [{x1: 200, y1: 100, x2: 100, y2: 200}]);
    // W
    (expect(new CharacterState(200, 100, 6, [], sceneDimensions).forward(100, true)): any)
        .toHaveCharacterState(100, 100, 6, [{x1: 200, y1: 100, x2: 100, y2: 100}]);
    (expect(new CharacterState(200, 100, 2, [], sceneDimensions).backward(100, true)): any)
        .toHaveCharacterState(100, 100, 2, [{x1: 200, y1: 100, x2: 100, y2: 100}]);
    // NW
    (expect(new CharacterState(200, 200, 7, [], sceneDimensions).forward(100, true)): any)
        .toHaveCharacterState(100, 100, 7, [{x1: 200, y1: 200, x2: 100, y2: 100}]);
    (expect(new CharacterState(200, 200, 3, [], sceneDimensions).backward(100, true)): any)
        .toHaveCharacterState(100, 100, 3, [{x1: 200, y1: 200, x2: 100, y2: 100}]);
});

test('Turn Left moves anti-clockwise and wraps at N', () => {
    const sceneDimensions = new SceneDimensions(10, 10);
    (expect(new CharacterState(1, 1, 3, [], sceneDimensions).turnLeft(1)): any)
        .toHaveCharacterState(1, 1, 2, []);
    (expect(new CharacterState(1, 1, 3, [], sceneDimensions).turnLeft(3)): any)
        .toHaveCharacterState(1, 1, 0, []);
    (expect(new CharacterState(1, 1, 3, [], sceneDimensions).turnLeft(4)): any)
        .toHaveCharacterState(1, 1, 7, []);
});

test('Turn Right moves clockwise and wraps at N', () => {
    const sceneDimensions = new SceneDimensions(10, 10);
    (expect(new CharacterState(1, 1, 5, [], sceneDimensions).turnRight(1)): any)
        .toHaveCharacterState(1, 1, 6, []);
    (expect(new CharacterState(1, 1, 5, [], sceneDimensions).turnRight(3)): any)
        .toHaveCharacterState(1, 1, 0, []);
    (expect(new CharacterState(1, 1, 5, [], sceneDimensions).turnRight(4)): any)
        .toHaveCharacterState(1, 1, 1, []);
});

test('Each Forward move should create a path segment', () => {
    const sceneDimensions = new SceneDimensions(500, 500);
    (expect(new CharacterState(100, 100, 2, [], sceneDimensions).forward(100, true).forward(100, true)): any)
        .toHaveCharacterState(300, 100, 2, [
            {x1: 100, y1: 100, x2: 200, y2: 100},
            {x1: 200, y1: 100, x2: 300, y2: 100}
        ]);
    (expect(new CharacterState(100, 200, 2, [], sceneDimensions).forward(100, true).turnLeft(2).forward(100, true)): any)
        .toHaveCharacterState(200, 100, 0, [
            {x1: 100, y1: 200, x2: 200, y2: 200},
            {x1: 200, y1: 200, x2: 200, y2: 100}
        ]);
    (expect(new CharacterState(100, 100, 2, [], sceneDimensions).forward(100, true).turnRight(2).forward(100, true)): any)
        .toHaveCharacterState(200, 200, 4, [
            {x1: 100, y1: 100, x2: 200, y2: 100},
            {x1: 200, y1: 100, x2: 200, y2: 200}
        ]);
});

test('Each Backward move should create a path segment', () => {
    const sceneDimensions = new SceneDimensions(500, 500);
    (expect(new CharacterState(100, 100, 6, [], sceneDimensions).backward(100, true).backward(100, true)): any)
        .toHaveCharacterState(300, 100, 6, [
            {x1: 100, y1: 100, x2: 200, y2: 100},
            {x1: 200, y1: 100, x2: 300, y2: 100}
        ]);
    (expect(new CharacterState(100, 200, 6, [], sceneDimensions).backward(100, true).turnLeft(2).backward(100, true)): any)
        .toHaveCharacterState(200, 100, 4, [
            {x1: 100, y1: 200, x2: 200, y2: 200},
            {x1: 200, y1: 200, x2: 200, y2: 100}
        ]);
    (expect(new CharacterState(100, 100, 6, [], sceneDimensions).backward(100, true).turnRight(2).backward(100, true)): any)
        .toHaveCharacterState(200, 200, 0, [
            {x1: 100, y1: 100, x2: 200, y2: 100},
            {x1: 200, y1: 100, x2: 200, y2: 200}
        ]);
});


test('Forward move should not create a path segment, when drawingEnabled is false', () => {
    const sceneDimensions = new SceneDimensions(500, 500);
    (expect(new CharacterState(100, 100, 2, [], sceneDimensions).forward(100, false)): any)
        .toHaveCharacterState(200, 100, 2, []);
    (expect(new CharacterState(100, 100, 2, [], sceneDimensions).forward(100, false).forward(200, true)): any)
        .toHaveCharacterState(400, 100, 2, [
            {x1: 200, y1: 100, x2: 400, y2: 100}
        ]);
    (expect(new CharacterState(100, 100, 2, [], sceneDimensions).forward(100, true).forward(200, false)): any)
        .toHaveCharacterState(400, 100, 2, [
            {x1: 100, y1: 100, x2: 200, y2: 100}
        ]);
    (expect(new CharacterState(100, 100, 2, [], sceneDimensions).forward(100, false).forward(200, false)): any)
        .toHaveCharacterState(400, 100, 2, []);
});

test('Backward move should not create a path segment, when drawingEnabled is false', () => {
    const sceneDimensions = new SceneDimensions(500, 500);
    (expect(new CharacterState(200, 100, 2, [], sceneDimensions).backward(100, false)): any)
        .toHaveCharacterState(100, 100, 2, []);
    (expect(new CharacterState(400, 100, 2, [], sceneDimensions).backward(100, false).backward(200, true)): any)
        .toHaveCharacterState(100, 100, 2, [
            {x1: 300, y1: 100, x2: 100, y2: 100}
        ]);
    (expect(new CharacterState(400, 100, 2, [], sceneDimensions).backward(100, true).backward(200, false)): any)
        .toHaveCharacterState(100, 100, 2, [
            {x1: 400, y1: 100, x2: 300, y2: 100}
        ]);
    (expect(new CharacterState(400, 100, 2, [], sceneDimensions).backward(100, false).backward(200, false)): any)
        .toHaveCharacterState(100, 100, 2, []);
});

test('Forward move is limited to the sceneDimensions', () => {
    const sceneDimensions = new SceneDimensions(10, 10);
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
    const sceneDimensions = new SceneDimensions(10, 10);
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
    const sceneDimensions = new SceneDimensions(10, 10);
    (expect(new CharacterState(2, 1, 1, [], sceneDimensions).forward(1, false)): any)
        .toHaveCharacterState(3, 1, 1, []);
    (expect(new CharacterState(9, 3, 1, [], sceneDimensions).forward(2, true)): any)
        .toHaveCharacterState(10, 1, 1, [
            {x1: 9, y1: 3, x2: 10, y2: 2},
            {x1: 10, y1: 2, x2: 10, y2: 1}
        ]);
    (expect(new CharacterState(10, 2, 3, [], sceneDimensions).forward(1, false)): any)
        .toHaveCharacterState(10, 3, 3, []);
    (expect(new CharacterState(9, 3, 3, [], sceneDimensions).forward(2, true)): any)
        .toHaveCharacterState(10, 5, 3, [
            {x1: 9, y1: 3, x2: 10, y2: 4},
            {x1: 10, y1: 4, x2: 10, y2: 5}
        ]);
    (expect(new CharacterState(2, 10, 5, [], sceneDimensions).forward(1, false)): any)
        .toHaveCharacterState(1, 10, 5, []);
    (expect(new CharacterState(2, 2, 5, [], sceneDimensions).forward(2, true)): any)
        .toHaveCharacterState(1, 4, 5, [
            {x1: 2, y1: 2, x2: 1, y2: 3},
            {x1: 1, y1: 3, x2: 1, y2: 4}
        ]);
    (expect(new CharacterState(1, 2, 7, [], sceneDimensions).forward(1, false)): any)
        .toHaveCharacterState(1, 1, 7, []);
    (expect(new CharacterState(3, 2, 7, [], sceneDimensions).forward(2, true)): any)
        .toHaveCharacterState(1, 1, 7, [
            {x1: 3, y1: 2, x2: 2, y2: 1},
            {x1: 2, y1: 1, x2: 1, y2: 1}
        ]);
})


test('When direction is not an integer in range 0-7, forward() and backward() should throw an Error', () => {
    expect.assertions(6);
    const sceneDimensions = new SceneDimensions(200, 200);

    expect(() => {
        (new CharacterState(100, 100, -1, [], sceneDimensions)).forward(1, false);
    }).toThrowError(/^CharacterState direction must be an integer in range 0-7 inclusive$/);

    expect(() => {
        (new CharacterState(1, 1, 8, [], sceneDimensions)).forward(1, false);
    }).toThrowError(/^CharacterState direction must be an integer in range 0-7 inclusive$/);

    expect(() => {
        (new CharacterState(1, 1, 0.5, [], sceneDimensions)).forward(1, false);
    }).toThrowError(/^CharacterState direction must be an integer in range 0-7 inclusive$/);

    expect(() => {
        (new CharacterState(0, 0, -1, [], sceneDimensions)).backward(1, false);
    }).toThrowError(/^CharacterState direction must be an integer in range 0-7 inclusive$/);

    expect(() => {
        (new CharacterState(0, 0, 8, [], sceneDimensions)).backward(1, false);
    }).toThrowError(/^CharacterState direction must be an integer in range 0-7 inclusive$/);

    expect(() => {
        (new CharacterState(0, 0, 0.5, [], sceneDimensions)).backward(1, false);
    }).toThrowError(/^CharacterState direction must be an integer in range 0-7 inclusive$/);
});

test('MoveUpPosition moves the character up one unit within the scene', () => {
    const sceneDimensions = new SceneDimensions(10, 10);
    (expect(new CharacterState(2, 3, 2, [], sceneDimensions).moveUpPosition()): any)
        .toHaveCharacterState(2, 2, 2, []);
    (expect(new CharacterState(2, 1, 2, [], sceneDimensions).moveUpPosition()): any)
        .toHaveCharacterState(2, 1, 2, []);
});

test('MoveRightPosition moves the character right one unit within the scene', () => {
    const sceneDimensions = new SceneDimensions(10, 10);
    (expect(new CharacterState(2, 3, 2, [], sceneDimensions).moveRightPosition()): any)
        .toHaveCharacterState(3, 3, 2, []);
    (expect(new CharacterState(10, 1, 2, [], sceneDimensions).moveRightPosition()): any)
        .toHaveCharacterState(10, 1, 2, []);
});

test('MoveDownPosition moves the character down one unit within the scene', () => {
    const sceneDimensions = new SceneDimensions(10, 10);
    (expect(new CharacterState(2, 3, 2, [], sceneDimensions).moveDownPosition()): any)
        .toHaveCharacterState(2, 4, 2, []);
    (expect(new CharacterState(2, 10, 2, [], sceneDimensions).moveDownPosition()): any)
        .toHaveCharacterState(2, 10, 2, []);
});

test('MoveLeftPosition moves the character Left one unit within the scene', () => {
    const sceneDimensions = new SceneDimensions(10, 10);
    (expect(new CharacterState(2, 3, 2, [], sceneDimensions).moveLeftPosition()): any)
        .toHaveCharacterState(1, 3, 2, []);
    (expect(new CharacterState(1, 1, 2, [], sceneDimensions).moveLeftPosition()): any)
        .toHaveCharacterState(1, 1, 2, []);
});

test('ChangeXPosition gets column label and updates xPosition', () => {
    const sceneDimensions = new SceneDimensions(26, 16);
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
    const sceneDimensions = new SceneDimensions(26, 16);
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
    const sceneDimensions = new SceneDimensions(26, 16);
    expect(new CharacterState(2, 16, 2, [], sceneDimensions).getRowLabel()).toBe('16');
    expect(new CharacterState(2, 1, 2, [], sceneDimensions).getRowLabel()).toBe('1');
})

test('getColumnLabel returns current xPosition in string', () => {
    const sceneDimensions = new SceneDimensions(26, 16);
    expect(new CharacterState(26, 3, 2, [], sceneDimensions).getColumnLabel()).toBe('Z');
    expect(new CharacterState(1, 3, 2, [], sceneDimensions).getColumnLabel()).toBe('A');
})

test('drawEdgeDiagonalPath', () => {
    const sceneDimensions = new SceneDimensions(26, 16);
    // NE
    expect(new CharacterState(17, 2, 1, [], sceneDimensions)
        .drawEdgeDiagonalPath([], 1, 1)).toStrictEqual(
            [{ x1: 17, y1: 2, x2: 18, y2: 1 }]
    );
    expect(new CharacterState(17, 3, 1, [], sceneDimensions)
        .drawEdgeDiagonalPath([], 2, 1)).toStrictEqual(
            [
                { x1: 17, y1: 3, x2: 18, y2: 2 },
                { x1: 18, y1: 2, x2: 19, y2: 1}
            ]
    );
    // SE
    expect(new CharacterState(17, 15, 3, [], sceneDimensions)
        .drawEdgeDiagonalPath([], 1, 3)).toStrictEqual(
            [{ x1: 17, y1: 15, x2: 18, y2: 16 }]
    );
    expect(new CharacterState(17, 14, 3, [], sceneDimensions)
        .drawEdgeDiagonalPath([], 2, 3)).toStrictEqual(
            [
                { x1: 17, y1: 14, x2: 18, y2: 15 },
                { x1: 18, y1: 15, x2: 19, y2: 16}
            ]
    );
    // SW
    expect(new CharacterState(17, 15, 5, [], sceneDimensions)
        .drawEdgeDiagonalPath([], 1, 5)).toStrictEqual(
            [{ x1: 17, y1: 15, x2: 16, y2: 16 }]
    );
    expect(new CharacterState(17, 14, 5, [], sceneDimensions)
        .drawEdgeDiagonalPath([], 2, 5)).toStrictEqual(
            [
                { x1: 17, y1: 14, x2: 16, y2: 15 },
                { x1: 16, y1: 15, x2: 15, y2: 16}
            ]
    );
    // NW
    expect(new CharacterState(2, 4, 7, [], sceneDimensions)
        .drawEdgeDiagonalPath([], 1, 7)).toStrictEqual(
            [{ x1: 2, y1: 4, x2: 1, y2: 3 }]
    );
    expect(new CharacterState(3, 4, 7, [], sceneDimensions)
        .drawEdgeDiagonalPath([], 2, 7)).toStrictEqual(
            [
                { x1: 3, y1: 4, x2: 2, y2: 3 },
                { x1: 2, y1: 3, x2: 1, y2: 2}
            ]
    );
    // N
    expect(new CharacterState(2, 2, 0, [], sceneDimensions)
        .drawEdgeDiagonalPath([], 1, 0)).toStrictEqual([]);
    // E
    expect(new CharacterState(25, 2, 2, [], sceneDimensions)
        .drawEdgeDiagonalPath([], 1, 2)).toStrictEqual([]);
    // S
    expect(new CharacterState(2, 15, 4, [], sceneDimensions)
        .drawEdgeDiagonalPath([], 1, 4)).toStrictEqual([]);
    // W
    expect(new CharacterState(2, 15, 6, [], sceneDimensions)
        .drawEdgeDiagonalPath([], 1, 6)).toStrictEqual([]);
})
