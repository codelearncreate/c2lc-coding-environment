// @flow

import * as ProgramUtils from './ProgramUtils';
import type {Program, ProgramCommand} from './types';

function checkProgramEdit(inputBefore: Program, expected: Program,
                          inputAfter: Program, result: Program) {
    expect(inputAfter).toEqual(inputBefore);
    expect(result).toEqual(expected);
};

test.each([
    [[], 0, []],
    [[], 2, []],
    [[{commandName:'foo', commandParameters:{}}], 0, []],
    [[{commandName:'foo', commandParameters:{}}], 1, [{commandName:'foo', commandParameters:{}}]],
    [[{commandName:'foo', commandParameters:{}}], 2, [{commandName:'foo', commandParameters:{}}]],
    [
        [
            {commandName:'foo', commandParameters:{}},
            {commandName:'bar', commandParameters:{}},
            {commandName:'baz', commandParameters:{}}
        ], 0, [
            {commandName:'bar', commandParameters:{}},
            {commandName:'baz', commandParameters:{}}
        ]
    ],
    [
        [
            {commandName:'foo', commandParameters:{}},
            {commandName:'bar', commandParameters:{}},
            {commandName:'baz', commandParameters:{}}
        ], 1, [
            {commandName:'foo', commandParameters:{}},
            {commandName:'baz', commandParameters:{}}
        ]
    ]
])('deleteStep',
    (input: Array<ProgramCommand>, index: number, expected: Array<ProgramCommand>) => {
        expect.assertions(2);
        const inputValues = input.slice();
        const result = ProgramUtils.deleteStep(inputValues, index);
        checkProgramEdit(input, expected, inputValues, result);
    }
);

test.each([
    [[], 0, []],
    [[], 1, [{commandName:'fill1', commandParameters:{}}]],
    [[], 2, [{commandName:'fill1', commandParameters:{}}, {commandName:'fill1', commandParameters:{}}]],
    [[{commandName:'foo', commandParameters:{}}], 0, [{commandName:'foo', commandParameters:{}}]],
    [[{commandName:'foo', commandParameters:{}}], 1, [{commandName:'foo', commandParameters:{}}]],
    [[{commandName:'foo', commandParameters:{}}], 2,
        [
            {commandName:'foo', commandParameters:{}},
            {commandName:'fill1', commandParameters:{}}
        ]
    ],
    [[{commandName:'foo', commandParameters:{}}], 3,
        [
            {commandName:'foo', commandParameters:{}},
            {commandName:'fill1', commandParameters:{}},
            {commandName:'fill1', commandParameters:{}}
        ]
    ]
])('expandProgram',
    (input: Array<ProgramCommand>, length: number, expected: Array<ProgramCommand>) => {
        expect.assertions(2);
        const inputValues = input.slice();
        const result = ProgramUtils.expandProgram(inputValues, length, {commandName:'fill1', commandParameters:{}});
        checkProgramEdit(input, expected, inputValues, result);
    }
);

test.each([
    [[], 0, [{commandName:'command1', commandParameters:{}}]],
    [[], 2,
        [
            {commandName:'fill1', commandParameters:{}},
            {commandName:'fill1', commandParameters:{}},
            {commandName:'command1', commandParameters:{}}
        ]
    ],
    [[{commandName:'foo', commandParameters:{}}], 0,
        [
            {commandName:'command1', commandParameters:{}},
            {commandName:'foo', commandParameters:{}}
        ]
    ],
    [[{commandName:'foo', commandParameters:{}}], 1,
        [
            {commandName:'foo', commandParameters:{}},
            {commandName:'command1', commandParameters:{}}
        ]
    ],
    [[{commandName:'foo', commandParameters:{}}], 2,
        [
            {commandName:'foo', commandParameters:{}},
            {commandName:'fill1', commandParameters:{}},
            {commandName:'command1', commandParameters:{}}
        ]
    ],
    [[{commandName:'foo', commandParameters:{}}, {commandName:'bar', commandParameters:{}}], 1,
        [
            {commandName:'foo', commandParameters:{}},
            {commandName:'command1', commandParameters:{}},
            {commandName:'bar', commandParameters:{}}
        ]
    ]
])('insert',
    (input: Array<ProgramCommand>, index: number, expected: Array<ProgramCommand>) => {
        expect.assertions(2);
        const inputValues = input.slice();
        const result = ProgramUtils.insert(inputValues, index,
            {commandName:'command1', commandParameters:{}},
            {commandName:'fill1', commandParameters:{}});
        checkProgramEdit(input, expected, inputValues, result);
    }
);

test.each([
    [[], 0, [{commandName:'command1', commandParameters:{}}]],
    [[], 2,
        [
            {commandName:'fill1', commandParameters:{}},
            {commandName:'fill1', commandParameters:{}},
            {commandName:'command1', commandParameters:{}}
        ]
    ],
    [[{commandName:'foo', commandParameters:{}}], 0, [{commandName:'command1', commandParameters:{}}]],
    [[{commandName:'foo', commandParameters:{}}], 1,
        [
            {commandName:'foo', commandParameters:{}},
            {commandName:'command1', commandParameters:{}}
        ]
    ],
    [[{commandName:'foo', commandParameters:{}}], 2,
        [
            {commandName:'foo', commandParameters:{}},
            {commandName:'fill1', commandParameters:{}},
            {commandName:'command1', commandParameters:{}}
        ]
    ],
    [
        [
            {commandName:'foo', commandParameters:{}},
            {commandName:'bar', commandParameters:{}},
            {commandName:'baz', commandParameters:{}}
        ], 1,
        [
            {commandName:'foo', commandParameters:{}},
            {commandName:'command1', commandParameters:{}},
            {commandName:'baz', commandParameters:{}}
        ]
    ]
])('overwrite',
    (input: Array<ProgramCommand>, index: number, expected: Array<ProgramCommand>) => {
        expect.assertions(2);
        const inputValues = input.slice();
        const result = ProgramUtils.overwrite(inputValues, index,
            {commandName:'command1', commandParameters:{}},
            {commandName:'fill1', commandParameters:{}});
        checkProgramEdit(input, expected, inputValues, result);
    }
);

test.each([
    [[], []],
    [[{commandName:'foo', commandParameters:{}}], [{commandName:'foo', commandParameters:{}}]],
    [[{commandName:'trim1', commandParameters:{}}], []],
    [
        [{commandName:'foo', commandParameters:{}}, {commandName:'trim1', commandParameters:{}}],
        [{commandName:'foo', commandParameters:{}}]
    ],
    [[{commandName:'trim1', commandParameters:{}}, {commandName:'trim1', commandParameters:{}}], []],
    [
        [
            {commandName:'trim1', commandParameters:{}},
            {commandName:'foo', commandParameters:{}}
        ],
        [
            {commandName:'trim1', commandParameters:{}},
            {commandName:'foo', commandParameters:{}}
        ]
    ],
    [
        [
            {commandName:'trim1', commandParameters:{}},
            {commandName:'foo', commandParameters:{}},
            {commandName:'trim1', commandParameters:{}}
        ],
        [
            {commandName:'trim1', commandParameters:{}},
            {commandName:'foo', commandParameters:{}}
        ]
    ]
])('trimEnd',
    (input: Array<ProgramCommand>, expected: Array<ProgramCommand>) => {
        expect.assertions(2);
        const inputValues = input.slice();
        const result = ProgramUtils.trimEnd(inputValues, {commandName:'trim1', commandParameters:{}});
        checkProgramEdit(input, expected, inputValues, result);
    }
);

test.each([
    [[], true],
    [
        [
            {commandName:'command1', commandParameters: {}},
            {commandName:'none', commandParameters: {}}
        ],
        false
    ],
    [
        [
            {commandName:'none', commandParameters: {}},
            {commandName:'none', commandParameters: {}},
            {commandName:'command1', commandParameters: {}}
        ],
        false
    ],
    [
        [
            {commandName:'command1', commandParameters: {}},
            {commandName:'none', commandParameters: {}},
            {commandName:'command1', commandParameters: {}}
        ],
        false
    ]
])('programIsEmpty',
    (input: Array<ProgramCommand>, expected: Array<ProgramCommand>) => {
        expect.assertions(1);
        const result = ProgramUtils.programIsEmpty(input);
        expect(result).toBe(expected);
    }
);

test.each([
    [[], 0, 2, []],
    [[{commandName:'command1', commandParameters: {}}], 0, 1, [{commandName:'command1', commandParameters: {}}]],
    [
        [
            {commandName:'command1', commandParameters: {}},
            {commandName:'command2', commandParameters: {}},
            {commandName:'command3', commandParameters: {}}
        ], 1, 2,
        [
            {commandName:'command1', commandParameters: {}},
            {commandName:'command3', commandParameters: {}},
            {commandName:'command2', commandParameters: {}}
        ]
    ],
    [
        [
            {commandName:'command1', commandParameters: {}},
            {commandName:'command2', commandParameters: {}},
            {commandName:'command3', commandParameters: {}}
        ], 0, 2,
        [
            {commandName:'command3', commandParameters: {}},
            {commandName:'command2', commandParameters: {}},
            {commandName:'command1', commandParameters: {}}
        ]
    ]
]) ('swapPosition',
    (input: Array<ProgramCommand>, indexFrom: number, indexTo: number,  expected: Array<ProgramCommand>) => {
        expect.assertions(2);
        const inputValues = input.slice();
        const result = ProgramUtils.swapPosition(inputValues, indexFrom, indexTo);
        checkProgramEdit(input, expected, inputValues, result);
    }
);
