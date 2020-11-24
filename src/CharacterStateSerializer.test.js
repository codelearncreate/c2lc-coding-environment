// @flow

import CharacterStateSerializer from './CharacterStateSerializer';
import CharacterState from './CharacterState';

test('Serialize character state', () => {
    expect.assertions(5);
    const serializer = new CharacterStateSerializer();
    expect(serializer.serialize(
        new CharacterState(0, 1, 2, [])
    )).toBe('0ab');
    expect(serializer.serialize(
        new CharacterState(1, 0, 4, [{x1: 0, y1: 1, x2: 2, y2: 3}])
    )).toBe('a0d0abc');
    expect(serializer.serialize(
        new CharacterState(-1, -1, 7, [{x1: 0, y1: 0, x2: -1, y2: -1}])
    )).toBe('AAg00AA');
    expect(serializer.serialize(
        new CharacterState(-29, -29, 0, [])
    )).toBe('ZZ0');
    expect(serializer.serialize(
        new CharacterState(29, 1000, 3, [])
    )).toBe('zzc');
});

test('Deserialize character state', () => {
    expect.assertions(5);
    const serializer = new CharacterStateSerializer();
    expect(serializer.deserialize('0ab')).toStrictEqual(new CharacterState(0,1,2,[]));
    expect(serializer.deserialize('a0d0abc')).toStrictEqual(new CharacterState(1,0,4,[{x1:0,y1:1,x2:2,y2:3}]));
    expect(serializer.deserialize('AAc00AA')).toStrictEqual(new CharacterState(-1,-1,3,[{x1:0,y1:0,x2:-1,y2:-1}]));
    expect(() => {
        serializer.deserialize('3ac00AA')
    }).toThrowError(/^Unrecognized position character: '3'$/);
    expect(() => {
        serializer.deserialize('aab3322')
    }).toThrowError(/^Unrecognized position character: '3'$/);
});

test('encodeDirection', () => {
    expect.assertions(10);
    const serializer = new CharacterStateSerializer();
    expect(serializer.encodeDirection(0)).toBe('0');
    expect(serializer.encodeDirection(1)).toBe('a');
    expect(serializer.encodeDirection(2)).toBe('b');
    expect(serializer.encodeDirection(3)).toBe('c');
    expect(serializer.encodeDirection(4)).toBe('d');
    expect(serializer.encodeDirection(5)).toBe('e');
    expect(serializer.encodeDirection(6)).toBe('f');
    expect(serializer.encodeDirection(7)).toBe('g');
    expect(() => {
        serializer.encodeDirection(8)
    }).toThrowError(/^Unrecognized direction 8$/);
    expect(() => {
        serializer.encodeDirection(-1)
    }).toThrowError(/^Unrecognized direction -1$/);
});

test('decodeDirection', () => {
    expect.assertions(9);
    const serializer = new CharacterStateSerializer();
    expect(serializer.decodeDirection('0')).toBe(0);
    expect(serializer.decodeDirection('a')).toBe(1);
    expect(serializer.decodeDirection('b')).toBe(2);
    expect(serializer.decodeDirection('c')).toBe(3);
    expect(serializer.decodeDirection('d')).toBe(4);
    expect(serializer.decodeDirection('e')).toBe(5);
    expect(serializer.decodeDirection('f')).toBe(6);
    expect(serializer.decodeDirection('g')).toBe(7);
    expect(() => {
        serializer.decodeDirection('3')
    }).toThrowError(/^Unrecognized direction character 3$/);
});

test('encodePosition', () => {
    expect.assertions(9);
    const serializer = new CharacterStateSerializer();
    expect(serializer.encodePosition(0)).toBe('0');
    expect(serializer.encodePosition(-1)).toBe('A');
    expect(serializer.encodePosition(1)).toBe('a');
    expect(serializer.encodePosition(-26)).toBe('Z');
    expect(serializer.encodePosition(26)).toBe('z');
    expect(serializer.encodePosition(-130)).toBe('Z');
    expect(serializer.encodePosition(34)).toBe('z');
    expect(serializer.encodePosition(2.8)).toBe('b');
    expect(() => {
        serializer.encodePosition(NaN)
    }).toThrowError(/^Position out of the range: NaN$/);
});

test('decodePosition', () => {
    expect.assertions(7);
    const serializer = new CharacterStateSerializer();
    expect(serializer.decodePosition('0')).toBe(0);
    expect(serializer.decodePosition('A')).toBe(-1);
    expect(serializer.decodePosition('a')).toBe(1);
    expect(serializer.decodePosition('Z')).toBe(-26);
    expect(serializer.decodePosition('z')).toBe(26);
    expect(() => {
        serializer.decodePosition('')
    }).toThrowError(/^Unrecognized position character: ''$/);
    expect(() => {
        serializer.decodePosition('!')
    }).toThrowError(/^Unrecognized position character: '!'$/);
});
