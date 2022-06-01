// @flow

import CharacterStateSerializer from './CharacterStateSerializer';
import CharacterState from './CharacterState';
import SceneDimensions from './SceneDimensions';

test('Serialize character state', () => {
    expect.assertions(5);
    const sceneDimensions = new SceneDimensions(1, 1000, 1, 1000);
    const serializer = new CharacterStateSerializer(sceneDimensions);
    expect(serializer.serialize(
        new CharacterState(0, 1, 2, [], sceneDimensions)
    )).toBe('0ab');
    expect(serializer.serialize(
        new CharacterState(1, 0, 4, [{x1: 0, y1: 1, x2: 2, y2: 3}], sceneDimensions)
    )).toBe('a0d0abc');
    expect(serializer.serialize(
        new CharacterState(-1, -1, 7, [{x1: 0, y1: 0, x2: -1, y2: -1}], sceneDimensions)
    )).toBe('AAg00AA');
    expect(serializer.serialize(
        new CharacterState(-29, -29, 0, [], sceneDimensions)
    )).toBe('ZZ0');
    expect(serializer.serialize(
        new CharacterState(29, 1000, 3, [], sceneDimensions)
    )).toBe('zzc');
});

test('Deserialize character state', () => {
    expect.assertions(5);
    const sceneDimensions = new SceneDimensions(1, 1000, 1, 1000);
    const serializer = new CharacterStateSerializer(sceneDimensions);
    expect(serializer.deserialize('0ab')).toStrictEqual(new CharacterState(0,1,2,[], sceneDimensions));
    expect(serializer.deserialize('a0d0abc')).toStrictEqual(new CharacterState(1,0,4,[{x1:0,y1:1,x2:2,y2:3}], sceneDimensions));
    expect(serializer.deserialize('AAc00AA')).toStrictEqual(new CharacterState(-1,-1,3,[{x1:0,y1:0,x2:-1,y2:-1}], sceneDimensions));
    expect(() => {
        serializer.deserialize('3ac00AA')
    }).toThrowError(/^Bad co-ordinate character: '3'$/);
    expect(() => {
        serializer.deserialize('aab3322')
    }).toThrowError(/^Bad co-ordinate character: '3'$/);
});
