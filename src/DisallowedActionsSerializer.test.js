// @flow

import DisallowedActionsSerializer from './DisallowedActionsSerializer';

test("Serialize disallowed actions", () => {
    const serializer = new DisallowedActionsSerializer();

    expect(serializer.serialize({})).toStrictEqual('');
    expect(serializer.serialize({ forward1: true })).toStrictEqual('1');
    expect(serializer.serialize({ backward1: true})).toStrictEqual('4');
    expect(serializer.serialize({ left45: true})).toStrictEqual('A');
    expect(serializer.serialize({ left90: true})).toStrictEqual('B');
    expect(serializer.serialize({ right45: true})).toStrictEqual('a');
    expect(serializer.serialize({ right90: true})).toStrictEqual('b');
    expect(serializer.serialize({ loop: true})).toStrictEqual('l');
    expect(serializer.serialize({
        forward1: false,
        backward1: true,
        left45: false,
        left90: true,
        right45: true,
        right90: false,
        loop: true
    })).toStrictEqual('4Bal');
});

test("Deserialize disallowed actions.", () => {
    const serializer = new DisallowedActionsSerializer();
    expect(serializer.deserialize('')).toStrictEqual({});
    expect(serializer.deserialize('1')).toStrictEqual({ forward1: true });
    expect(serializer.deserialize('4')).toStrictEqual({ backward1: true });
    expect(serializer.deserialize('A')).toStrictEqual({ left45: true });
    expect(serializer.deserialize('B')).toStrictEqual({ left90: true });
    expect(serializer.deserialize('a')).toStrictEqual({ right45: true });
    expect(serializer.deserialize('b')).toStrictEqual({ right90: true });
    expect(serializer.deserialize('l')).toStrictEqual({ loop: true });
    expect(serializer.deserialize('14ABabl')).toStrictEqual({
        forward1: true,
        backward1: true,
        left45: true,
        left90: true,
        right45: true,
        right90: true,
        loop: true
    });
});

test('Deserializing an unsupported actionKey should throw an Error', () => {
    expect(() => {
        (new DisallowedActionsSerializer()).deserialize('9');
    }).toThrowError(/^Unrecognized disallowedActions text when deserialize text: 9$/);
});
