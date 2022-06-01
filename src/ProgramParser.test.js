//@flow

import ProgramParser from './ProgramParser';

test('Parse empty string', () => {
    expect((new ProgramParser()).parse('')).toStrictEqual({
        program: [],
        highestLoopNumber: 0
    });
});

test('Parse unsupported character', () => {
    expect(() => {
        (new ProgramParser()).parse('f');
    }).toThrowError(/^Unexpected character: f$/);
});

test('Parse 1', () => {
    expect((new ProgramParser()).parse('1')).toStrictEqual({
        program: [{block: 'forward1'}],
        highestLoopNumber: 0
    });
});

test('Parse 2', () => {
    expect((new ProgramParser()).parse('2')).toStrictEqual({
        program: [{block: 'forward2'}],
        highestLoopNumber: 0
    });
});

test('Parse 3', () => {
    expect((new ProgramParser()).parse('3')).toStrictEqual({
        program: [{block: 'forward3'}],
        highestLoopNumber: 0
    });
});

test('Parse 4', () => {
    expect((new ProgramParser()).parse('4')).toStrictEqual({
        program: [{block: 'backward1'}],
        highestLoopNumber: 0
    });
});

test('Parse 5', () => {
    expect((new ProgramParser()).parse('5')).toStrictEqual({
        program: [{block: 'backward2'}],
        highestLoopNumber: 0
    });
});

test('Parse 6', () => {
    expect((new ProgramParser()).parse('6')).toStrictEqual({
        program: [{block: 'backward3'}],
        highestLoopNumber: 0
    });
});

test('Parse A', () => {
    expect((new ProgramParser()).parse('A')).toStrictEqual({
        program: [{block: 'left45'}],
        highestLoopNumber: 0
    });
});

test('Parse B', () => {
    expect((new ProgramParser()).parse('B')).toStrictEqual({
        program: [{block: 'left90'}],
        highestLoopNumber: 0
    });
});

test('Parse D', () => {
    expect((new ProgramParser()).parse('D')).toStrictEqual({
        program: [{block: 'left180'}],
        highestLoopNumber: 0
    });
});

test('Parse a', () => {
    expect((new ProgramParser()).parse('a')).toStrictEqual({
        program: [{block: 'right45'}],
        highestLoopNumber: 0
    });
});

test('Parse b', () => {
    expect((new ProgramParser()).parse('b')).toStrictEqual({
        program: [{block: 'right90'}],
        highestLoopNumber: 0
    });
});

test('Parse d', () => {
    expect((new ProgramParser()).parse('d')).toStrictEqual({
        program: [{block: 'right180'}],
        highestLoopNumber: 0
    });
});

test('Parse startLoop', () => {
    expect((new ProgramParser()).parse('sA1sz')).toStrictEqual({
        program: [
            {
                block: 'startLoop',
                iterations: 1,
                label: 'A'
            },
            {
                block: 'endLoop',
                label: 'A'
            }
        ],
        highestLoopNumber: 1
    });

    expect((new ProgramParser()).parse('sA99sz')).toStrictEqual({
        program: [
            {
                block: 'startLoop',
                iterations: 99,
                label: 'A'
            },
            {
                block: 'endLoop',
                label: 'A'
            }
        ],
        highestLoopNumber: 1
    });

    expect((new ProgramParser()).parse('sAA12sz')).toStrictEqual({
        program: [
            {
                block: 'startLoop',
                iterations: 12,
                label: 'AA'
            },
            {
                block: 'endLoop',
                label: 'AA'
            }
        ],
        highestLoopNumber: 27
    });

    expect(() => {
        (new ProgramParser()).parse('s');
    }).toThrowError(/^Missing loop label$/);

    expect(() => {
        (new ProgramParser()).parse('ss');
    }).toThrowError(/^Missing loop label$/);

    expect(() => {
        (new ProgramParser()).parse('s1');
    }).toThrowError(/^Missing loop label$/);

    expect(() => {
        (new ProgramParser()).parse('sAAA');
    }).toThrowError(/^Loop label too long: AAA$/);

    expect(() => {
        (new ProgramParser()).parse('sA1ssA1s');
    }).toThrowError(/^Duplicate loop label: A$/);

    expect(() => {
        (new ProgramParser()).parse('sA');
    }).toThrowError(/^Missing loop number of iterations$/);

    expect(() => {
        (new ProgramParser()).parse('sAs');
    }).toThrowError(/^Missing loop number of iterations$/);

    expect(() => {
        (new ProgramParser()).parse('sA0s');
    }).toThrowError(/^Loop iterations must be in the range 1-99: 0$/);

    expect(() => {
        (new ProgramParser()).parse('sA00s');
    }).toThrowError(/^Loop iterations must be in the range 1-99: 0$/);

    expect(() => {
        (new ProgramParser()).parse('sA100s');
    }).toThrowError(/^Loop iterations must be in the range 1-99: 100$/);

    expect(() => {
        (new ProgramParser()).parse('sA1');
    }).toThrowError(/^Missing startLoop terminating 's'$/);

    expect(() => {
        (new ProgramParser()).parse('sA1x');
    }).toThrowError(/^Missing startLoop terminating 's'$/);
});

test('Parse unbalanced startLoop and endLoop', () => {
    expect(() => {
        (new ProgramParser()).parse('sA1szz');
    }).toThrowError(/^endLoop without startLoop$/);

    expect(() => {
        (new ProgramParser()).parse('sA1szsB2s');
    }).toThrowError(/^startLoop without endLoop$/);
});

test('Parse program with multiple loops', () => {
    expect((new ProgramParser()).parse('sA1szsB1sz')).toStrictEqual({
        program: [
            {block: 'startLoop', iterations: 1, label: 'A'},
            {block: 'endLoop', label: 'A'},
            {block: 'startLoop', iterations: 1, label: 'B'},
            {block: 'endLoop', label: 'B'},
        ],
        highestLoopNumber: 2
    });
});

test('Parse program with nested loops', () => {
    expect((new ProgramParser()).parse('sA1ssB2szz')).toStrictEqual({
        program: [
            {block: 'startLoop', iterations: 1, label: 'A'},
            {block: 'startLoop', iterations: 2, label: 'B'},
            {block: 'endLoop', label: 'B'},
            {block: 'endLoop', label: 'A'}
        ],
        highestLoopNumber: 2
    });
});

test('Parse program with all blocks', () => {
    expect((new ProgramParser()).parse('123456ABDabdsA1sz')).toStrictEqual({
        program: [
            {block: 'forward1'},
            {block: 'forward2'},
            {block: 'forward3'},
            {block: 'backward1'},
            {block: 'backward2'},
            {block: 'backward3'},
            {block: 'left45'},
            {block: 'left90'},
            {block: 'left180'},
            {block: 'right45'},
            {block: 'right90'},
            {block: 'right180'},
            {block: 'startLoop', iterations: 1, label: 'A'},
            {block: 'endLoop', label: 'A'}
        ],
        highestLoopNumber: 1
    });
});
