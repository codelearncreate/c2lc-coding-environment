// @flow

import type { CommandName, Program } from './types';

export default class ProgramSequence {
    program: Program;
    programCounter: number;

    constructor(program: Program, programCounter: number) {
        this.program = program;
        this.programCounter = programCounter;
    }

    getProgram(): Program {
        return this.program;
    }

    getProgramLength(): number {
        return this.program.length;
    }

    getProgramCounter(): number {
        return this.programCounter;
    }

    getCurrentProgramStep(): string {
        return this.program[this.programCounter];
    }

    getProgramStepAt(index: number): string {
        return this.program[index];
    }

    updateProgram(program: Program): ProgramSequence {
        return new ProgramSequence(program, this.programCounter);
    }

    updateProgramCounter(programCounter: number): ProgramSequence {
        return new ProgramSequence(this.program, programCounter);
    }

    updateProgramAndProgramCounter(program: Program, programCounter: number): ProgramSequence {
        return new ProgramSequence(program, programCounter);
    }

    incrementProgramCounter(): ProgramSequence {
        return new ProgramSequence(this.program, this.programCounter + 1);
    }

    overwriteStep(index: number, command: string): ProgramSequence {
        const program = this.program.slice();
        program[index] = command;
        return this.updateProgram(program);
    }

    insertStep(index: number, command: string): ProgramSequence {
        const program = this.program.slice();
        program.splice(index, 0, command);
        if (index <= this.programCounter) {
            return this.updateProgramAndProgramCounter(program, this.programCounter + 1);
        } else {
            return this.updateProgram(program);
        }
    }

    deleteStep(index: number): ProgramSequence {
        const program = this.program.slice();
        program.splice(index, 1);
        if (index < this.programCounter && this.program.length > 1) {
            return this.updateProgramAndProgramCounter(program, this.programCounter - 1);
        } else {
            return this.updateProgram(program);
        }
    }

    swapStep(indexFrom: number, indexTo: number): ProgramSequence {
        const program = this.program.slice();
        if (program[indexFrom] != null && program[indexTo] != null) {
            const currentStep = program[indexFrom];
            program[indexFrom] = program[indexTo];
            program[indexTo] = currentStep;
        }
        return this.updateProgram(program);
    }

    usesAction(action: CommandName): boolean {
        for (let index = 0; index < this.program.length; index++) {
            if (this.program[index] === action) { return true; }
        }

        return false;
    }
}
