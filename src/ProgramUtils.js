// @flow

import type {Program, ProgramCommand} from './types';

function deleteStep(program: Program, index: number): Program {
    // Make a shallow copy before we modify it with splice()
    program = program.slice();
    program.splice(index, 1);
    return program;
};

function expandProgram(program: Program, length: number, fill: ProgramCommand): Program {
    // Make a shallow copy before we add to the program
    program = program.slice();
    while (program.length < length) {
        program.push(fill);
    }
    return program;
};

function insert(program: Program, index: number, command: ProgramCommand, fill: ProgramCommand): Program {
    program = expandProgram(program, index, fill);
    program.splice(index, 0, command);
    return program;
};

function overwrite(program: Program, index: number, command: ProgramCommand, fill: ProgramCommand): Program {
    program = expandProgram(program, index + 1, fill);
    program[index] = command;
    return program;
};

function trimEnd(program: Program, commandToTrim: ProgramCommand): Program {
    // Make a shallow copy before we trim
    program = program.slice();
    while ((program.length > 0)
            && (program[program.length - 1].commandName === commandToTrim.commandName)) {
        program.pop();
    }
    return program;
};

function programIsEmpty(program: Program): boolean {
    for (let i=0; i<program.length; i++) {
        if (program[i] !== 'none') {
            return false;
        }
    }
    return true;
};

function swapPosition(program: Program, indexFrom: number, indexTo: number): Program {
    // Make a shallow copy before we add to the program
    program = program.slice();
    if (program[indexFrom] == null || program[indexTo] == null) {
        return program;
    }
    const currentStep = program[indexFrom];
    program[indexFrom] = program[indexTo];
    program[indexTo] = currentStep;
    return program;
}

export {
    deleteStep,
    expandProgram,
    insert,
    overwrite,
    trimEnd,
    programIsEmpty,
    swapPosition
};
