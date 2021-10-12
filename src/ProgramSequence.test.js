// @flow

import ProgramSequence from './ProgramSequence';
import type { Program } from './types';

test('ProgramSequence constructor should take program and programCounter parameters', () => {
    expect.assertions(2);
    const program = ['forward1'];
    const programCounter = 0;
    const programSequence = new ProgramSequence(program, programCounter);
    expect(programSequence.getProgram()).toBe(program);
    expect(programSequence.getProgramCounter()).toBe(programCounter);
});

test('updateProgramCounter should only update programCounter', () => {
    expect.assertions(2);
    const program = ['forward1'];
    let programSequence = new ProgramSequence(program, 0);
    const newProgramCounter = 1;
    programSequence = programSequence.updateProgramCounter(newProgramCounter);
    expect(programSequence.getProgram()).toBe(program);
    expect(programSequence.getProgramCounter()).toBe(newProgramCounter);
});

test('incrementProgramCounter should increment programCounter by 1', () => {
    expect.assertions(1);
    let programSequence = new ProgramSequence([], 0);
    programSequence = programSequence.incrementProgramCounter();
    expect(programSequence.getProgramCounter()).toBe(1);
});

test('usesAction should return false for any action when the sequence is empty.', () => {
    expect.assertions(3);
    const program = [];
    const programSequence = new ProgramSequence(program, 0);
    expect(programSequence.usesAction('forward1')).toBe(false);
    expect(programSequence.usesAction('backward3')).toBe(false);
    expect(programSequence.usesAction('left90')).toBe(false);
});

test('usesAction should return true when an action is part of the sequence.', () => {
    expect.assertions(3);
    const program = ['forward1', 'backward3', 'left90'];
    const programSequence = new ProgramSequence(program, 0);
    expect(programSequence.usesAction('forward1')).toBe(true);
    expect(programSequence.usesAction('backward3')).toBe(true);
    expect(programSequence.usesAction('left90')).toBe(true);
});

test('usesAction should return false when an action is not part of the sequence.', () => {
    expect.assertions(1);
    const program = ['backward3'];
    const programSequence = new ProgramSequence(program, 0);
    expect(programSequence.usesAction('forward1')).toBe(false);
});

test.each([
    [[], 0, 0, [], 0],
    [['forward1'], 0, 0, [], 0],
    [['forward1', 'forward2'], 0, 0, ['forward2'], 0],
    [['forward1', 'forward2'], 0, 1, ['forward1'], 0],
    [['forward1', 'forward2'], 1, 0, ['forward2'], 0],
    [['forward1', 'forward2'], 1, 1, ['forward1'], 1],
    [['forward1', 'forward2', 'forward3'], 1, 0, ['forward2', 'forward3'], 0],
    [['forward1', 'forward2', 'forward3'], 1, 1, ['forward1', 'forward3'], 1],
    [['forward1', 'forward2', 'forward3'], 1, 2, ['forward1', 'forward2'], 1]
])('deleteStep',
    (program: Program, programCounter: number, index: number,
        expectedProgram: Program, expectedProgramCounter: number) => {
        expect.assertions(3);
        const programBefore = program.slice();
        const programSequence = new ProgramSequence(program, programCounter);
        const result = programSequence.deleteStep(index);
        expect(result.getProgram()).toStrictEqual(expectedProgram);
        expect(result.getProgramCounter()).toBe(expectedProgramCounter);
        expect(programSequence.getProgram()).toStrictEqual(programBefore);
    }
);

test.each([
    [[], 0, 0, ['left45'], 1],
    [['forward1'], 0, 0, ['left45', 'forward1'], 1],
    [['forward1', 'forward2', 'forward3'], 1, 0, ['left45', 'forward1', 'forward2', 'forward3'], 2],
    [['forward1', 'forward2', 'forward3'], 1, 1, ['forward1', 'left45', 'forward2', 'forward3'], 2],
    [['forward1', 'forward2', 'forward3'], 1, 2, ['forward1', 'forward2', 'left45', 'forward3'], 1]
])('insertStep',
    (program: Program, programCounter: number, index: number,
        expectedProgram: Program, expectedProgramCounter: number) => {
        expect.assertions(3);
        const programBefore = program.slice();
        const programSequence = new ProgramSequence(program, programCounter);
        const result = programSequence.insertStep(index, 'left45');
        expect(result.getProgram()).toStrictEqual(expectedProgram);
        expect(result.getProgramCounter()).toBe(expectedProgramCounter);
        expect(programSequence.getProgram()).toStrictEqual(programBefore);
    }
);

test.each([
    [['forward1', 'forward2'], 0, 0, ['left45', 'forward2'], 0],
    [['forward1', 'forward2'], 0, 1, ['forward1', 'left45'], 0],
    [['forward1', 'forward2'], 1, 0, ['left45', 'forward2'], 1],
    [['forward1', 'forward2'], 1, 1, ['forward1', 'left45'], 1]
])('overwriteStep',
    (program: Program, programCounter: number, index: number,
        expectedProgram: Program, expectedProgramCounter: number) => {
        expect.assertions(3);
        const programBefore = program.slice();
        const programSequence = new ProgramSequence(program, programCounter);
        const result = programSequence.overwriteStep(index, 'left45');
        expect(result.getProgram()).toStrictEqual(expectedProgram);
        expect(result.getProgramCounter()).toBe(expectedProgramCounter);
        expect(programSequence.getProgram()).toStrictEqual(programBefore);
    }
);

test.each([
    [['forward1', 'forward2', 'forward3'], 1, 0, 0, ['forward1', 'forward2', 'forward3'], 1],
    [['forward1', 'forward2', 'forward3'], 1, 0, 1, ['forward2', 'forward1', 'forward3'], 1],
    [['forward1', 'forward2', 'forward3'], 1, 0, 2, ['forward3', 'forward2', 'forward1'], 1]
])('swapStep',
    (program: Program, programCounter: number,
        indexFrom: number, indexTo: number,
        expectedProgram: Program, expectedProgramCounter: number) => {
        expect.assertions(3);
        const programBefore = program.slice();
        const programSequence = new ProgramSequence(program, programCounter);
        const result = programSequence.swapStep(indexFrom, indexTo);
        expect(result.getProgram()).toStrictEqual(expectedProgram);
        expect(result.getProgramCounter()).toBe(expectedProgramCounter);
        expect(programSequence.getProgram()).toStrictEqual(programBefore);
    }
);
