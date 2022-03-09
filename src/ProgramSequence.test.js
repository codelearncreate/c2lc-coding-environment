// @flow

import ProgramSequence from './ProgramSequence';
import type { Program } from './types';

test('ProgramSequence constructor', () => {
    expect.assertions(3);
    const program = [{block: 'forward1'}, {block: 'loopStart', label: 'A', iterations: 3}];
    const programCounter = 0;
    const loopIterationsLeft = new Map([[ 'A', 3 ]]);
    const programSequence = new ProgramSequence(program, programCounter, 0, loopIterationsLeft);
    expect(programSequence.getProgram()).toBe(program);
    expect(programSequence.getProgramCounter()).toBe(programCounter);
    expect(programSequence.getLoopIterationsLeft()).toBe(loopIterationsLeft);
});

test('getMatchingLoopBlockIndex retuns index of corresponding endLoop or startLoop pair', () => {
    const program = [
        {block: 'startLoop', iterations: 3, label: 'A'},
        {block: 'startLoop', iterations: 2, label: 'B'},
        {block: 'forward3'},
        {block: 'startLoop', iterations: 1, label: 'C'},
        {block: 'forward1'},
        {block: 'forward2'},
        {block: 'endLoop', label: 'C'},
        {block: 'forward3'},
        {block: 'endLoop', label: 'B'},
        {block: 'endLoop', label: 'A'}
    ];
    const programSequence = new ProgramSequence(program, 0, 0, new Map());
    // Finding endLoop pair
    expect(programSequence.getMatchingLoopBlockIndex(0)).toBe(9);
    expect(programSequence.getMatchingLoopBlockIndex(1)).toBe(8);
    expect(programSequence.getMatchingLoopBlockIndex(3)).toBe(6);

    // Finding startLoop pair
    expect(programSequence.getMatchingLoopBlockIndex(6)).toBe(3);
    expect(programSequence.getMatchingLoopBlockIndex(8)).toBe(1);
    expect(programSequence.getMatchingLoopBlockIndex(9)).toBe(0);
});

test('calculateCachedLoopData returns a program with additional loop data', () => {
    const program = [
        {block: 'startLoop', iterations: 3, label: 'A'},
        {block: 'startLoop', iterations: 2, label: 'B'},
        {block: 'forward3'},
        {block: 'startLoop', iterations: 1, label: 'C'},
        {block: 'forward1'},
        {block: 'forward2'},
        {block: 'endLoop', label: 'C'},
        {block: 'forward3'},
        {block: 'endLoop', label: 'B'},
        {block: 'endLoop', label: 'A'}
    ];

    const expectedProgram = [
        {
            block: 'startLoop',
            iterations: 3,
            label: 'A'
        },
        {
            block: 'startLoop',
            iterations: 2,
            label: 'B',
            cache: new Map([
                ['containingLoopPosition', 1],
                ['containingLoopLabel', 'A']
            ])
        },
        {
            block: 'forward3',
            cache: new Map([
                ['containingLoopPosition', 1],
                ['containingLoopLabel', 'B']
            ])
        },
        {
            block: 'startLoop',
            iterations: 1,
            label: 'C',
            cache: new Map([
                ['containingLoopPosition', 2],
                ['containingLoopLabel', 'B']
            ])
        },
        {
            block: 'forward1',
            cache: new Map([
                ['containingLoopPosition', 1],
                ['containingLoopLabel', 'C']
            ])
        },
        {
            block: 'forward2',
            cache: new Map([
                ['containingLoopPosition', 2],
                ['containingLoopLabel', 'C']
            ])
        },
        {
            block: 'endLoop',
            label: 'C',
            cache: new Map([
                ['containingLoopPosition', 5],
                ['containingLoopLabel', 'B']
            ])
        },
        {
            block: 'forward3',
            cache: new Map([
                ['containingLoopPosition', 6],
                ['containingLoopLabel', 'B']
            ])
        },
        {
            block: 'endLoop',
            label: 'B',
            cache: new Map([
                ['containingLoopPosition', 8],
                ['containingLoopLabel', 'A']
            ])
        },
        {
            block: 'endLoop',
            label: 'A'
        }
    ];

    expect(ProgramSequence.calculateCachedLoopData(program))
        .toStrictEqual(expectedProgram);
});

test('calculateCachedLoopData replaces existing cached loop data and removes cached loop data when a block is no longer in a loop', () => {
    const program = [
        {
            block: 'startLoop',
            iterations: 3,
            label: 'A'
        },
        {
            block: 'forward1',
            cache: new Map([
                ['containingLoopPosition', 2],
                ['containingLoopLabel', 'B']
            ])
        },
        {
            block: 'endLoop',
            label: 'A'
        },
        {
            block: 'forward2',
            cache: new Map([
                ['containingLoopPosition', 2],
                ['containingLoopLabel', 'B']
            ])
        }
    ];

    const expectedProgram = [
        {
            block: 'startLoop',
            iterations: 3,
            label: 'A'
        },
        {
            block: 'forward1',
            cache: new Map([
                ['containingLoopPosition', 1],
                ['containingLoopLabel', 'A']
            ])
        },
        {
            block: 'endLoop',
            label: 'A'
        },
        {
            block: 'forward2'
        }
    ];

    expect(ProgramSequence.calculateCachedLoopData(program))
        .toStrictEqual(expectedProgram);
});

test('updateProgramCounter should only update programCounter', () => {
    expect.assertions(3);
    const program = [{block: 'forward1'}];
    const loopIterationsLeft = new Map();
    let programSequence = new ProgramSequence(program, 0, 0, loopIterationsLeft);
    const newProgramCounter = 1;
    programSequence = programSequence.updateProgramCounter(newProgramCounter);
    expect(programSequence.getProgram()).toBe(program);
    expect(programSequence.getProgramCounter()).toBe(newProgramCounter);
    expect(programSequence.getLoopIterationsLeft()).toBe(loopIterationsLeft);
});

test('incrementProgramCounter should increment programCounter by 1', () => {
    expect.assertions(1);
    let programSequence = new ProgramSequence([], 0, 0, new Map());
    programSequence = programSequence.incrementProgramCounter();
    expect(programSequence.getProgramCounter()).toBe(1);
});

test('usesAction should return false for any action when the sequence is empty.', () => {
    expect.assertions(4);
    const program = [];
    const programSequence = new ProgramSequence(program, 0, 0, new Map());
    expect(programSequence.usesAction('forward1')).toBe(false);
    expect(programSequence.usesAction('backward3')).toBe(false);
    expect(programSequence.usesAction('left90')).toBe(false);
    expect(programSequence.usesAction('loop')).toBe(false);
});

test('usesAction should return true when an action is part of the sequence.', () => {
    expect.assertions(3);
    const program = [{block: 'forward1'}, {block: 'backward3'}, {block: 'left90'}];
    const programSequence = new ProgramSequence(program, 0, 0, new Map());
    expect(programSequence.usesAction('forward1')).toBe(true);
    expect(programSequence.usesAction('backward3')).toBe(true);
    expect(programSequence.usesAction('left90')).toBe(true);
});

test('usesAction should return true for loops when a loop is used.', () => {
    expect.assertions(1);
    const program = [
        { block: 'startLoop', label: 'A', iterations: 3},
        { block: 'backward3'},
        { block: 'endLoop', label: 'A'},
    ];
    const programSequence = new ProgramSequence(program, 0, 0, new Map());
    expect(programSequence.usesAction('loop')).toBe(true);
});

test('usesAction should return false when an action is not part of the sequence.', () => {
    expect.assertions(2);
    const program = [{block: 'backward3'}];
    const programSequence = new ProgramSequence(program, 0, 0, new Map());
    expect(programSequence.usesAction('forward1')).toBe(false);
    expect(programSequence.usesAction('loop')).toBe(false);
});

type DeleteStepTestCase = {
    program: Program,
    programCounter: number,
    index: number,
    expectedProgram: Program,
    expectedProgramCounter: number
};

test.each(([
    {
        program: [],
        programCounter: 0,
        index: 0,
        expectedProgram: [],
        expectedProgramCounter: 0
    },
    {
        program: [
            { block: 'forward1' }
        ],
        programCounter: 0,
        index: 0,
        expectedProgram: [],
        expectedProgramCounter: 0
    },
    {
        program: [
            { block: 'forward1' },
            { block: 'forward2' }
        ],
        programCounter: 0,
        index: 0,
        expectedProgram: [
            { block: 'forward2' }
        ],
        expectedProgramCounter: 0
    },
    {
        program: [
            { block: 'forward1' },
            { block: 'forward2' }
        ],
        programCounter: 0,
        index: 1,
        expectedProgram: [
            { block: 'forward1' }
        ],
        expectedProgramCounter: 0
    },
    {
        program: [
            { block: 'forward1' },
            { block: 'forward2' }
        ],
        programCounter: 1,
        index: 0,
        expectedProgram: [
            { block: 'forward2' }
        ],
        expectedProgramCounter: 0
    },
    {
        program: [
            { block: 'forward1' },
            { block: 'forward2' }
        ],
        programCounter: 1,
        index: 1,
        expectedProgram: [
            { block: 'forward1' }
        ],
        expectedProgramCounter: 1
    },
    {
        program: [
            { block: 'forward1' },
            { block: 'forward2' },
            { block: 'forward3' }
        ],
        programCounter: 1,
        index: 0,
        expectedProgram: [
            { block: 'forward2' },
            { block: 'forward3' }
        ],
        expectedProgramCounter: 0
    },
    {
        program: [
            { block: 'forward1' },
            { block: 'forward2' },
            { block: 'forward3' }
        ],
        programCounter: 1,
        index: 1,
        expectedProgram: [
            { block: 'forward1' },
            { block: 'forward3' }
        ],
        expectedProgramCounter: 1
    },
    {
        program: [
            { block: 'forward1' },
            { block: 'forward2' },
            { block: 'forward3' }
        ],
        programCounter: 1,
        index: 2,
        expectedProgram: [
            { block: 'forward1' },
            { block: 'forward2' }
        ],
        expectedProgramCounter: 1
    },
    {
        program: [
            {
                block: 'forward1'
            },
            {
                block: 'startLoop',
                label: 'A',
                iterations: 1
            },
            {
                block: 'endLoop',
                label: 'A'
            }
        ],
        programCounter: 1,
        index: 1,
        expectedProgram: [
            { block: 'forward1' }
        ],
        expectedProgramCounter: 1
    },
    {
        program: [
            {
                block: 'startLoop',
                label: 'A',
                iterations: 1
            },
            {
                block: 'endLoop',
                label: 'A'
            },
            {
                block: 'forward1'
            }
        ],
        programCounter: 1,
        index: 1,
        expectedProgram: [
            { block: 'forward1' }
        ],
        expectedProgramCounter: 1
    }
]: Array<DeleteStepTestCase>))('deleteStep', (testData: DeleteStepTestCase) => {
    expect.assertions(3);
    const programBefore = testData.program.slice();
    const programSequence = new ProgramSequence(testData.program, testData.programCounter, 0, new Map());
    const result = programSequence.deleteStep(testData.index);
    expect(result.getProgram()).toStrictEqual(testData.expectedProgram);
    expect(result.getProgramCounter()).toBe(testData.expectedProgramCounter);
    expect(programSequence.getProgram()).toStrictEqual(programBefore);
});

type InsertStepTestCase = {
    program: Program,
    programCounter: number,
    loopIterationsLeft: Map<string, number>,
    index: number,
    commandName: string,
    expectedProgram: Program,
    expectedProgramCounter: number,
    expectedLoopIterationsLeft: Map<string, number>
};

test.each(([
    {
        program: [],
        programCounter: 0,
        loopIterationsLeft: new Map(),
        index: 0,
        commandName: 'left45',
        expectedProgram: [{block: 'left45'}],
        expectedProgramCounter: 1,
        expectedLoopIterationsLeft: new Map()
    },
    {
        program: [{block: 'forward1'}],
        programCounter: 0,
        loopIterationsLeft: new Map(),
        index: 0,
        commandName: 'left45',
        expectedProgram: [{block: 'left45'}, {block: 'forward1'}],
        expectedProgramCounter: 1,
        expectedLoopIterationsLeft: new Map()
    },
    {
        program: [{block: 'forward1'}, {block: 'forward2'}, {block: 'forward3'}],
        programCounter: 1,
        loopIterationsLeft: new Map(),
        index: 0,
        commandName: 'left45',
        expectedProgram: [{block: 'left45'}, {block: 'forward1'}, {block: 'forward2'}, {block: 'forward3'}],
        expectedProgramCounter: 2,
        expectedLoopIterationsLeft: new Map()
    },
    {
        program: [{block: 'forward1'}, {block: 'forward2'}, {block: 'forward3'}],
        programCounter: 1,
        loopIterationsLeft: new Map(),
        index: 1,
        commandName: 'left45',
        expectedProgram: [{block: 'forward1'}, {block: 'left45'}, {block: 'forward2'}, {block: 'forward3'}],
        expectedProgramCounter: 2,
        expectedLoopIterationsLeft: new Map()
    },
    {
        program: [{block: 'forward1'}, {block: 'forward2'}, {block: 'forward3'}],
        programCounter: 1,
        loopIterationsLeft: new Map(),
        index: 2,
        commandName: 'left45',
        expectedProgram: [{block: 'forward1'}, {block: 'forward2'}, {block: 'left45'}, {block: 'forward3'}],
        expectedProgramCounter: 1,
        expectedLoopIterationsLeft: new Map()
    },
    {
        program: [],
        programCounter: 0,
        loopIterationsLeft: new Map(),
        index: 0,
        commandName: 'loop',
        expectedProgram: [{block: 'startLoop', iterations: 1, label: 'A'}, {block: 'endLoop', label: 'A'}],
        expectedProgramCounter: 2,
        expectedLoopIterationsLeft: new Map([['A', 1]])
    },
    {
        program: [{block: 'forward1'}],
        programCounter: 0,
        loopIterationsLeft: new Map(),
        index: 0,
        commandName: 'loop',
        expectedProgram: [
            {block: 'startLoop', iterations: 1, label: 'A'},
            {block: 'endLoop', label: 'A'},
            {block: 'forward1'}
        ],
        expectedProgramCounter: 2,
        expectedLoopIterationsLeft: new Map([['A', 1]])
    }
]: Array<DeleteStepTestCase>))('insertStep', (testData: InsertStepTestCase) => {
    expect.assertions(4);
    const programBefore = testData.program.slice();
    const programSequence = new ProgramSequence(
        testData.program,
        testData.programCounter,
        0,
        testData.loopIterationsLeft
    );
    const result = programSequence.insertStep(testData.index, testData.commandName);
    expect(result.getProgram()).toStrictEqual(testData.expectedProgram);
    expect(result.getProgramCounter()).toBe(testData.expectedProgramCounter);
    expect(result.getLoopIterationsLeft()).toStrictEqual(testData.expectedLoopIterationsLeft);
    expect(programSequence.getProgram()).toStrictEqual(programBefore);
});

type OverwriteStepTestCase = {
    program: Program,
    programCounter: number,
    loopCounter: number,
    loopIterationsLeft: Map<string, number>,
    index: number,
    overwriteStepName: string,
    expectedProgram: Program,
    expectedProgramCounter: number,
    expectedLoopIterationsLeft: Map<string, number>
};

test.each(([
    {
        program: [{block: 'forward1'}, {block: 'forward2'}],
        programCounter: 0,
        loopCounter: 0,
        loopIterationsLeft: new Map(),
        index: 0,
        overwriteStepName: 'left45',
        expectedProgram: [{block: 'left45'}, {block: 'forward2'}],
        expectedProgramCounter: 0,
        expectedLoopIterationsLeft: new Map()
    },
    {
        program: [{block: 'forward1'}, {block: 'forward2'}],
        programCounter: 0,
        loopCounter: 0,
        loopIterationsLeft: new Map(),
        index: 1,
        overwriteStepName: 'left45',
        expectedProgram: [{block: 'forward1'}, {block: 'left45'}],
        expectedProgramCounter: 0,
        expectedLoopIterationsLeft: new Map()
    },
    {
        program: [{block: 'forward1'}, {block: 'forward2'}],
        programCounter: 1,
        loopCounter: 0,
        loopIterationsLeft: new Map(),
        index: 0,
        overwriteStepName: 'left45',
        expectedProgram: [{block: 'left45'}, {block: 'forward2'}],
        expectedProgramCounter: 1,
        expectedLoopIterationsLeft: new Map()
    },
    {
        program: [{block: 'forward1'}, {block: 'forward2'}],
        programCounter: 1,
        loopCounter: 0,
        loopIterationsLeft: new Map(),
        index: 1,
        overwriteStepName: 'left45',
        expectedProgram: [{block: 'forward1'}, {block: 'left45'}],
        expectedProgramCounter: 1,
        expectedLoopIterationsLeft: new Map()
    },
    {
        program: [{block: 'forward1'}],
        programCounter: 0,
        loopCounter: 0,
        loopIterationsLeft: new Map(),
        index: 0,
        overwriteStepName: 'loop',
        expectedProgram: [
            {block: 'startLoop', iterations: 1, label: 'A'},
            {block: 'endLoop', label: 'A'}
        ],
        expectedProgramCounter: 0,
        expectedLoopIterationsLeft: new Map([['A', 1]])
    },
    {
        program: [
            {
                block: 'startLoop',
                iterations: 4,
                label: 'A'
            },
            {
                block: 'forward1'
            },
            {
                block: 'endLoop',
                label: 'A'
            }
        ],
        programCounter: 2,
        loopCounter: 1,
        loopIterationsLeft: new Map([['A', 3]]),
        index: 1,
        overwriteStepName: 'loop',
        expectedProgram: [
            {
                block: 'startLoop',
                iterations: 4,
                label: 'A'
            },
            {
                block: 'startLoop',
                iterations: 1,
                label: 'B',
                cache: new Map([
                    ['containingLoopLabel', 'A'],
                    ['containingLoopPosition', 1]
                ]),
            },
            {
                block: 'endLoop',
                label: 'B',
                cache: new Map([
                    ['containingLoopLabel', 'A'],
                    ['containingLoopPosition', 2]
                ]),
            },
            {
                block: 'endLoop',
                label: 'A'
            }
        ],
        expectedProgramCounter: 3,
        expectedLoopIterationsLeft: new Map([['A', 3], ['B', 1]])
    }
]: Array<OverwriteStepTestCase>))('overwriteStep', (testData: OverwriteStepTestCase) => {
    expect.assertions(4);
    const programBefore = testData.program.slice();
    const programSequence = new ProgramSequence(
        testData.program,
        testData.programCounter,
        testData.loopCounter,
        testData.loopIterationsLeft
    );
    const result = programSequence.overwriteStep(testData.index, testData.overwriteStepName);
    expect(result.getProgram()).toStrictEqual(testData.expectedProgram);
    expect(result.getProgramCounter()).toBe(testData.expectedProgramCounter);
    expect(result.getLoopIterationsLeft()).toStrictEqual(testData.expectedLoopIterationsLeft);
    expect(programSequence.getProgram()).toStrictEqual(programBefore);
});

type SwapStepTestCase = {
    program: Program,
    programCounter: number,
    indexFrom: number,
    indexTo: number,
    expectedProgram: Program,
    expectedProgramCounter: number
};

test.each(([
    {
        program: [
            { block: 'forward1' },
            { block: 'forward2' },
            { block: 'forward3' }
        ],
        programCounter: 1,
        indexFrom: 0,
        indexTo: 0,
        expectedProgram: [
            { block: 'forward1' },
            { block: 'forward2' },
            { block: 'forward3' }
        ],
        expectedProgramCounter: 1
    },
    {
        program: [
            { block: 'forward1' },
            { block: 'forward2' },
            { block: 'forward3' }
        ],
        programCounter: 1,
        indexFrom: 0,
        indexTo: 1,
        expectedProgram: [
            { block: 'forward2' },
            { block: 'forward1' },
            { block: 'forward3' }
        ],
        expectedProgramCounter: 1
    },
    {
        program: [
            { block: 'forward1' },
            { block: 'forward2' },
            { block: 'forward3' }
        ],
        programCounter: 1,
        indexFrom: 0,
        indexTo: 2,
        expectedProgram: [
            { block: 'forward3' },
            { block: 'forward2' },
            { block: 'forward1' }
        ],
        expectedProgramCounter: 1
    },
    {
        program: [
            { block: 'forward1' },
            { block: 'startLoop', label: 'A' },
            { block: 'forward2' },
            { block: 'endLoop', label: 'A' }
        ],
        programCounter: 1,
        indexFrom: 1,
        indexTo: 0,
        expectedProgram: [
            { block: 'startLoop', label: 'A'},
            {
                block: 'forward2',
                cache: new Map([
                    ['containingLoopLabel', 'A'],
                    ['containingLoopPosition', 1]
                ])
            },
            { block: 'endLoop', label: 'A' },
            { block: 'forward1' }
        ],
        expectedProgramCounter: 1
    },
    {
        program: [
            { block: 'forward1' },
            { block: 'startLoop', label: 'A' },
            { block: 'forward2' },
            { block: 'endLoop', label: 'A' }
        ],
        programCounter: 1,
        indexFrom: 3,
        indexTo: 0,
        expectedProgram: [
            { block: 'startLoop', label: 'A'},
            {
                block: 'forward2',
                cache: new Map([
                    ['containingLoopLabel', 'A'], ['containingLoopPosition', 1]
                ])
            },
            { block: 'endLoop', label: 'A' },
            { block: 'forward1' }
        ],
        expectedProgramCounter: 1
    },
    {
        program: [
            { block: 'forward1' },
            { block: 'startLoop', label: 'A' },
            { block: 'forward2' },
            { block: 'endLoop', label: 'A' }
        ],
        programCounter: 1,
        indexFrom: 2,
        indexTo: 1,
        expectedProgram: [
            { block: 'forward1' },
            { block: 'forward2' },
            { block: 'startLoop', label: 'A' },
            { block: 'endLoop', label: 'A' }
        ],
        expectedProgramCounter: 1
    },
    {
        program: [
            { block: 'startLoop', label: 'A'},
            { block: 'forward2' },
            { block: 'endLoop', label: 'A' },
            { block: 'forward1' }
        ],
        programCounter: 1,
        indexFrom: 0,
        indexTo: 3,
        expectedProgram: [
            { block: 'forward1' },
            { block: 'startLoop', label: 'A'},
            {
                block: 'forward2',
                cache: new Map([
                    ['containingLoopLabel', 'A'],
                    ['containingLoopPosition', 1]
                ])
            },
            { block: 'endLoop', label: 'A' }
        ],
        expectedProgramCounter: 1
    },
    {
        program: [
            { block: 'startLoop', label: 'A' },
            { block: 'forward2' },
            { block: 'endLoop', label: 'A' },
            { block: 'forward1' }
        ],
        programCounter: 1,
        indexFrom: 2,
        indexTo: 3,
        expectedProgram: [
            { block: 'forward1' },
            { block: 'startLoop', label: 'A' },
            {
                block: 'forward2',
                cache: new Map([
                    ['containingLoopLabel', 'A'],
                    ['containingLoopPosition', 1]
                ])
            },
            { block: 'endLoop', label: 'A' }
        ],
        expectedProgramCounter: 1
    },
    {
        program: [
            { block: 'forward1' },
            { block: 'startLoop', label: 'A' },
            { block: 'forward2' },
            { block: 'endLoop', label: 'A' }
        ],
        programCounter: 1,
        indexFrom: 2,
        indexTo: 3,
        expectedProgram: [
            { block: 'forward1' },
            { block: 'startLoop', label: 'A' },
            { block: 'endLoop', label: 'A' },
            { block: 'forward2' }
        ],
        expectedProgramCounter: 1
    }
]: Array<SwapStepTestCase>))('swapStep', (testData: SwapStepTestCase) => {
    expect.assertions(3);
    const programBefore = testData.program.slice();
    const programSequence = new ProgramSequence(testData.program, testData.programCounter, 0, new Map());
    const result = programSequence.swapStep(testData.indexFrom, testData.indexTo);
    expect(result.getProgram()).toStrictEqual(testData.expectedProgram);
    expect(result.getProgramCounter()).toBe(testData.expectedProgramCounter);
    expect(programSequence.getProgram()).toStrictEqual(programBefore);
});

test('initiateProgramRun should set iterationsLeft for loops, as well as set programCounter to 0', () => {
    expect.assertions(2);
    const program = [
        {block: 'startLoop', iterations: 3, label: 'A'},
        {block: 'startLoop', iterations: 2, label: 'B'},
        {block: 'endLoop', label: 'B'},
        {block: 'endLoop', label: 'A'}
    ];
    const expectedLoopIterationsLeft = new Map([
        [ 'A', 3 ],
        [ 'B', 2 ]
    ]);
    const programSequence = new ProgramSequence(program, 3, 2, new Map());
    const updatedProgramSequence = programSequence.initiateProgramRun();
    expect(updatedProgramSequence.getLoopIterationsLeft()).toStrictEqual(expectedLoopIterationsLeft);
    expect(updatedProgramSequence.getProgramCounter()).toBe(0);
});
