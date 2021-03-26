import ProgramSerializer from './ProgramSerializer';

test('Serialize program', () => {
    const programSerializer = new ProgramSerializer();

    expect(programSerializer.serialize([])).toStrictEqual('');
    expect(programSerializer.serialize(['forward1'])).toStrictEqual('1');
    expect(programSerializer.serialize(['forward2'])).toStrictEqual('2');
    expect(programSerializer.serialize(['forward3'])).toStrictEqual('3');
    expect(programSerializer.serialize(['backward1'])).toStrictEqual('4');
    expect(programSerializer.serialize(['backward2'])).toStrictEqual('5');
    expect(programSerializer.serialize(['backward3'])).toStrictEqual('6');
    expect(programSerializer.serialize(['left45'])).toStrictEqual('A');
    expect(programSerializer.serialize(['left90'])).toStrictEqual('B');
    expect(programSerializer.serialize(['left180'])).toStrictEqual('D');
    expect(programSerializer.serialize(['right45'])).toStrictEqual('a');
    expect(programSerializer.serialize(['right90'])).toStrictEqual('b');
    expect(programSerializer.serialize(['right180'])).toStrictEqual('d');
    expect(programSerializer.serialize([
        'forward1', 'forward2', 'forward3',
        'backward1', 'backward2', 'backward3',
        'left45', 'left90', 'left180',
        'right45', 'right90', 'right180'
    ])).toStrictEqual('123456ABDabd');
});

test('Serializing an unsupported command should throw an Error', () => {
    expect(() => {
        (new ProgramSerializer()).serialize(['unsupported-command']);
    }).toThrowError(/^Unrecognized program command when serializing program: unsupported-command$/);
});

test('Deserialize program', () => {
    const programSerializer = new ProgramSerializer();
    expect(programSerializer.deserialize('')).toStrictEqual([]);
    expect(programSerializer.deserialize('21a')).toStrictEqual(['forward2', 'forward1', 'right45']);
});

test('Roundtrip program', () => {
    const programSerializer = new ProgramSerializer();
    const program = [
        'forward1', 'forward2', 'forward3',
        'left45', 'left90', 'left180',
        'right45', 'right90', 'right180'
    ];
    expect(programSerializer.deserialize(programSerializer.serialize(program))).toStrictEqual(program);
});
