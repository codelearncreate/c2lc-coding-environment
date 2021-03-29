// @flow
// These are just a rudimentary sanity check of the AllowedActionsSerializer, the underlying serializer is tested in
// depth elsewhere.
import AllowedActionsSerializer from './AllowedActionsSerializer';

test("Serialize allowed actions", () => {
    const serializer = new AllowedActionsSerializer();

    expect(serializer.serialize({})).toStrictEqual('');
    expect(serializer.serialize({ forward1: true })).toStrictEqual('1');
    expect(serializer.serialize({ forward2: false})).toStrictEqual('');
});

test("Deserialize allowed actions.", () => {
    const serializer = new AllowedActionsSerializer();
    expect(serializer.deserialize('')).toStrictEqual({});
    expect(serializer.deserialize('2')).toStrictEqual({ forward2: true });
});
