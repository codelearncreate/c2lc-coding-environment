// @flow

import SceneDimensions from './SceneDimensions';

test('SceneDimensions properties', () => {
    const dimensions = new SceneDimensions(5, 3);
    expect(dimensions.getWidth()).toBe(5);
    expect(dimensions.getHeight()).toBe(3);
    expect(dimensions.getMinX()).toBe(0.5);
    expect(dimensions.getMinY()).toBe(0.5);
    expect(dimensions.getMaxX()).toBe(5.5);
    expect(dimensions.getMaxY()).toBe(3.5);
});

test('SceneDimensions.getBoundsStateX()', () => {
    const dimensions = new SceneDimensions(5, 3);
    expect(dimensions.getBoundsStateX(1)).toBe('inBounds');
    expect(dimensions.getBoundsStateX(2.5)).toBe('inBounds');
    expect(dimensions.getBoundsStateX(3)).toBe('inBounds');
    expect(dimensions.getBoundsStateX(6.5)).toBe('outOfBoundsAbove');
    expect(dimensions.getBoundsStateX(-2.51)).toBe('outOfBoundsBelow');
});

test('SceneDimensions.getBoundsStateY()', () => {
    const dimensions = new SceneDimensions(5, 3);
    expect(dimensions.getBoundsStateY(1)).toBe('inBounds');
    expect(dimensions.getBoundsStateY(1.5)).toBe('inBounds');
    expect(dimensions.getBoundsStateY(2.5)).toBe('inBounds');
    expect(dimensions.getBoundsStateY(4)).toBe('outOfBoundsAbove');
    expect(dimensions.getBoundsStateY(-1.51)).toBe('outOfBoundsBelow');
});

test('SceneDimensions.isSceneEdgeX()', () => {
    const dimensions = new SceneDimensions(5, 3);
    expect(dimensions.isSceneEdgeX(1)).toBe(true);
    expect(dimensions.isSceneEdgeX(5)).toBe(true);
    expect(dimensions.isSceneEdgeX(2)).toBe(false);
});

test('SceneDimensions.isSceneEdgeY()', () => {
    const dimensions = new SceneDimensions(5, 3);
    expect(dimensions.isSceneEdgeY(1)).toBe(true);
    expect(dimensions.isSceneEdgeY(3)).toBe(true);
    expect(dimensions.isSceneEdgeY(2)).toBe(false);
});
