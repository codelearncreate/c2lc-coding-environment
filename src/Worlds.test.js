// @flow

import { getBackgroundInfo, getWorldCharacter, getWorldProperties, isWorldName } from './Worlds';

import { ReactComponent as Submarine } from './svg/Submarine.svg';
import { ReactComponent as SubmarineGray } from './svg/Submarine-gray.svg';
import { ReactComponent as SubmarineContrast } from './svg/Submarine-contrast.svg';

test('isWorldName', () => {
    expect.assertions(7);
    expect(isWorldName('DeepOcean')).toBe(true);
    expect(isWorldName('Jungle')).toBe(true);
    expect(isWorldName('Sketchpad')).toBe(true)
    expect(isWorldName('Space')).toBe(true);
    expect(isWorldName('')).toBe(false);
    expect(isWorldName(null)).toBe(false);
    expect(isWorldName('UNKNOWN')).toBe(false);
});

test('getWorldProperties', () => {
    expect.assertions(4);
    expect(getWorldProperties('DeepOcean')).not.toBeUndefined();
    expect(getWorldProperties('Jungle')).not.toBeUndefined();
    expect(getWorldProperties('Sketchpad')).not.toBeUndefined();
    expect(getWorldProperties('Space')).not.toBeUndefined();
});

test('getWorldCharacter', () => {
    expect.assertions(3);
    expect(getWorldCharacter('light', 'DeepOcean')).toBe(Submarine);
    expect(getWorldCharacter('gray', 'DeepOcean')).toBe(SubmarineGray);
    expect(getWorldCharacter('contrast', 'DeepOcean')).toBe(SubmarineContrast);
});

test('getBackgroundInfo', () => {
    expect.assertions(5);
    expect(getBackgroundInfo('Sketchpad', 'B', '1')).toBe(null);
    expect(getBackgroundInfo('Jungle', 'G', '1')).toBe('giraffe');
    expect(getBackgroundInfo('DeepOcean', 'I', '7')).toBe('treasure');
    expect(getBackgroundInfo('Space', 'A', '1')).toBe('earth');
    expect(getBackgroundInfo('Space', 'G', '1')).toBeUndefined();
});
