import ProgramSerializer from './ProgramSerializer';

test('Serialize program', () => {
    const programSerializer = new ProgramSerializer();

    expect(programSerializer.serialize([])).toStrictEqual('');
    expect(programSerializer.serialize([{block: 'forward1'}])).toStrictEqual('1');
    expect(programSerializer.serialize([{block: 'forward2'}])).toStrictEqual('2');
    expect(programSerializer.serialize([{block: 'forward3'}])).toStrictEqual('3');
    expect(programSerializer.serialize([{block: 'backward1'}])).toStrictEqual('4');
    expect(programSerializer.serialize([{block: 'backward2'}])).toStrictEqual('5');
    expect(programSerializer.serialize([{block: 'backward3'}])).toStrictEqual('6');
    expect(programSerializer.serialize([{block: 'left45'}])).toStrictEqual('A');
    expect(programSerializer.serialize([{block: 'left90'}])).toStrictEqual('B');
    expect(programSerializer.serialize([{block: 'left180'}])).toStrictEqual('D');
    expect(programSerializer.serialize([{block: 'right45'}])).toStrictEqual('a');
    expect(programSerializer.serialize([{block: 'right90'}])).toStrictEqual('b');
    expect(programSerializer.serialize([{block: 'right180'}])).toStrictEqual('d');
    expect(programSerializer.serialize([
        {block: 'startLoop', iterations: 2, label: 'A'},
        {block: 'endLoop', label: 'A'}
    ])).toStrictEqual('sA2sz');
    expect(programSerializer.serialize([
        {block: 'forward1'}, {block: 'forward2'}, {block: 'forward3'},
        {block: 'backward1'}, {block: 'backward2'}, {block: 'backward3'},
        {block: 'left45'}, {block: 'left90'}, {block: 'left180'},
        {block: 'right45'}, {block: 'right90'}, {block: 'right180'},
        {block: 'startLoop', iterations: 2, label: 'A'},
        {block: 'endLoop', label: 'A'}
    ])).toStrictEqual('123456ABDabdsA2sz');
});

test('Serializing an unsupported command should throw an Error', () => {
    expect(() => {
        (new ProgramSerializer()).serialize([{block: 'unsupported-command'}]);
    }).toThrowError(/^Unrecognized program command when serializing program: unsupported-command$/);
});

test('Deserialize program', () => {
    const programSerializer = new ProgramSerializer();
    expect(programSerializer.deserialize('')).toStrictEqual({
        program: [],
        highestLoopNumber: 0
    });
    expect(programSerializer.deserialize('21a')).toStrictEqual({
        program: [{block: 'forward2'}, {block: 'forward1'}, {block: 'right45'}],
        highestLoopNumber: 0
    });
});

test('Roundtrip program', () => {
    const programSerializer = new ProgramSerializer();
    const program = [
        {block: 'forward1'}, {block: 'forward2'}, {block: 'forward3'},
        {block: 'backward1'}, {block: 'backward2'}, {block: 'backward3'},
        {block: 'left45'}, {block: 'left90'}, {block: 'left180'},
        {block: 'right45'}, {block: 'right90'}, {block: 'right180'},
        {block: 'startLoop', iterations: 2, label: 'A'},
        {block: 'endLoop', label: 'A'}
    ];
    const parseResult = programSerializer.deserialize(programSerializer.serialize(program));
    expect(parseResult.program).toStrictEqual(program);
    expect(parseResult.highestLoopNumber).toEqual(1);
});