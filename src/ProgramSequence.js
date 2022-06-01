// @flow

import { generateLoopLabel } from './Utils';
import type { ProgramParserResult } from './ProgramParser';
import type { CommandName, Program, ProgramBlock, ProgramBlockCache } from './types';

// When a new loop is added to the program, initialize the number of
// iterations to this value:
const newLoopNumberOfIterations = 1;

export default class ProgramSequence {
    program: Program;
    programCounter: number;
    loopCounter: number;
    loopIterationsLeft: Map<string, number>;

    constructor(program: Program, programCounter: number, loopCounter: number, loopIterationsLeft: Map<string, number>) {
        this.program = program;
        this.programCounter = programCounter;
        this.loopCounter = loopCounter;
        this.loopIterationsLeft = loopIterationsLeft;
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

    getLoopIterationsLeft(): Map<string, number> {
        return this.loopIterationsLeft;
    }

    getCurrentProgramStep(): ProgramBlock {
        return this.program[this.programCounter];
    }

    getProgramStepAt(index: number): ProgramBlock {
        return this.program[index];
    }

    hasLoopBlock(): boolean {
        for (const programBlock of this.program) {
            if (programBlock.block === 'startLoop') {
                return true;
            }
        }
        return false;
    }

    currentStepIsControlBlock(): boolean {
        const block = this.program[this.programCounter];
        if (block) {
            return block.block === 'startLoop' || block.block === 'endLoop';
        } else {
            return false;
        }
    }

    getMatchingLoopBlockIndex(index: number): ?number {
        const block = this.program[index];
        let matchingBlockIndex = undefined;
        if (block) {
            if (block.block === 'startLoop') {
                for (let i = index + 1; i < this.program.length; i++) {
                    if (this.program[i].block === 'endLoop'
                            && this.program[i].label === block.label) {
                        matchingBlockIndex = i;
                        break;
                    }
                }
            } else if (block.block === 'endLoop') {
                for (let i = index - 1; i > -1; i--) {
                    if (this.program[i].block === 'startLoop'
                            && this.program[i].label === block.label) {
                        matchingBlockIndex = i;
                        break;
                    }
                }
            }
        }
        return matchingBlockIndex;
    }

    static makeProgramSequenceFromParserResult(parserResult: ProgramParserResult) {
        return new ProgramSequence(
            ProgramSequence.calculateCachedLoopData(parserResult.program),
            0,
            parserResult.highestLoopNumber,
            new Map()
        );
    }

    static calculateCachedLoopData(program: Program): Program {
        const resultProgram: Program = [];

        // loopStack is a stack that stores loop labels from startLoop blocks
        // while iterating through the program to keep track of direct parent loop
        const loopStack = [];
        // loopPositionStack is a stack that stores position of a program step within a direct parent loop
        const loopPositionStack = [];
        let containingLoopPosition = 0;

        for (const block of program) {
            if (block.block === 'endLoop') {
                loopStack.pop();
                if (loopPositionStack.length > 0) {
                    containingLoopPosition += loopPositionStack.pop();
                }
            }
            if (loopStack.length > 0) {
                containingLoopPosition++;
                const cache: ProgramBlockCache = new Map();
                cache.set('containingLoopLabel', ((loopStack[loopStack.length - 1]: any): string));
                cache.set('containingLoopPosition', containingLoopPosition);
                resultProgram.push(Object.assign(
                    {},
                    block,
                    {
                        cache
                    }
                ));
            } else {
                resultProgram.push(Object.assign({}, block));
                delete resultProgram[resultProgram.length - 1]['cache'];
            }
            if (block.block === 'startLoop') {
                loopStack.push(block.label);
                if (containingLoopPosition > 0) {
                    loopPositionStack.push(containingLoopPosition);
                }
                containingLoopPosition = 0;
            }
        }

        return resultProgram;
    }

    updateProgram(program: Program): ProgramSequence {
        return new ProgramSequence(
            ProgramSequence.calculateCachedLoopData(program),
            this.programCounter,
            this.loopCounter,
            this.loopIterationsLeft
        );
    }

    updateProgramCounter(programCounter: number): ProgramSequence {
        return new ProgramSequence(this.program, programCounter, this.loopCounter, this.loopIterationsLeft);
    }

    updateProgramAndProgramCounter(program: Program, programCounter: number): ProgramSequence {
        return new ProgramSequence(
            ProgramSequence.calculateCachedLoopData(program),
            programCounter,
            this.loopCounter,
            this.loopIterationsLeft
        );
    }

    updateProgramCounterAndLoopIterationsLeft(programCounter: number, loopIterationsLeft: Map<string, number>) {
        return new ProgramSequence(this.program, programCounter, this.loopCounter, loopIterationsLeft);
    }

    updateProgramAndLoopIterationsLeft(program: Program, loopIterationsLeft: Map<string, number>) {
        return new ProgramSequence(
            ProgramSequence.calculateCachedLoopData(program),
            this.programCounter,
            this.loopCounter,
            loopIterationsLeft
        );
    }

    updateProgramSequence(program: Program,
        programCounter: number,
        loopCounter: number,
        loopIterationsLeft: Map<string, number>): ProgramSequence {
        return new ProgramSequence(
            ProgramSequence.calculateCachedLoopData(program),
            programCounter,
            loopCounter,
            loopIterationsLeft
        );
    }

    incrementProgramCounter(): ProgramSequence {
        return new ProgramSequence(this.program, this.programCounter + 1, this.loopCounter, this.loopIterationsLeft);
    }

    overwriteStep(index: number, command: string): ProgramSequence {
        const program = this.program.slice();
        let programCounter = this.programCounter;
        let loopCounter = this.loopCounter;
        const loopIterationsLeft = new Map(this.loopIterationsLeft);
        if (command === 'loop') {
            if (this.hasLoopBlock()) {
                loopCounter++;
            } else {
                loopCounter = 1;
            }
            const loopLabel = generateLoopLabel(loopCounter);
            const startLoopObject = {
                block: 'startLoop',
                iterations: newLoopNumberOfIterations,
                label: loopLabel
            };
            const endLoopObject = {
                block: 'endLoop',
                label: loopLabel
            };
            program.splice(index, 1, startLoopObject, endLoopObject);
            loopIterationsLeft.set(loopLabel, newLoopNumberOfIterations);
            if (index < programCounter) {
                programCounter++;
            }
        } else {
            const commandObject = {
                block: command
            };
            program.splice(index, 1, commandObject);
        }
        return this.updateProgramSequence(
            program,
            programCounter,
            loopCounter,
            loopIterationsLeft
        );
    }

    insertStep(index: number, command: string): ProgramSequence {
        const program = this.program.slice();
        let programCounter = this.programCounter;
        let loopCounter = this.loopCounter;
        const loopIterationsLeft = new Map(this.loopIterationsLeft);
        if (command === 'loop') {
            if (this.hasLoopBlock()) {
                loopCounter++;
            } else {
                loopCounter = 1;
            }
            const loopLabel = generateLoopLabel(loopCounter);
            const startLoopObject = {
                block: 'startLoop',
                iterations: newLoopNumberOfIterations,
                label: loopLabel
            };
            const endLoopObject = {
                block: 'endLoop',
                label: loopLabel
            };
            program.splice(index, 0, startLoopObject, endLoopObject);
            loopIterationsLeft.set(loopLabel, newLoopNumberOfIterations);
            if (index <= programCounter) {
                programCounter += 2;
            }
        } else {
            const commandObject = {
                block: command
            };
            program.splice(index, 0, commandObject);
            if (index <= programCounter) {
                programCounter++;
            }
        }
        return this.updateProgramSequence(
            program,
            programCounter,
            loopCounter,
            loopIterationsLeft
        );
    }

    deleteStep(index: number): ProgramSequence {
        const program = this.program.slice();
        const programBlock = program[index];
        let programCounter = this.programCounter;
        if (programBlock != null && programBlock.block === 'startLoop') {
            const loopLabel = programBlock.label;
            for (let i = index + 1; i < program.length; i++) {
                // Remove corresponding endLoop block
                if (program[i].block === 'endLoop') {
                    if (program[i].label != null && program[i].label === loopLabel) {
                        program.splice(i, 1);
                        break;
                    }
                }
            }
            program.splice(index, 1);
        } else if (programBlock != null && programBlock.block === 'endLoop') {
            const loopLabel = programBlock.label;
            program.splice(index, 1);
            for (let i = 0; i < index; i++) {
                // Remove corresponding startLoop block
                if (program[i].block === 'startLoop') {
                    if (program[i].label != null && program[i].label === loopLabel) {
                        program.splice(i, 1);
                        programCounter = i;
                        break;
                    }
                }
            }
        } else {
            program.splice(index, 1);
            programCounter--;
        }
        if (index < this.programCounter && this.program.length > 1) {
            return this.updateProgramAndProgramCounter(program, programCounter);
        } else {
            return this.updateProgram(program);
        }
    }

    // Requirements on indexFrom and indexTo:
    //     If moving a startLoop
    //         If moving left
    //             Then indexTo must === indexFrom - 1
    //         If moving right
    //             Then indexTo must === index of endLoop + 1
    //     If moving an EndLoop
    //         If moving left
    //             Then indexTo must === index of startLoop - 1
    //         If moving right
    //             Then indexTo must === indexFrom + 1
    swapStep(indexFrom: number, indexTo: number): ProgramSequence {
        const program = this.program.slice();
        if (program[indexFrom] != null && program[indexTo] != null) {
            const swappedStep = program[indexTo];
            const currentStep = program[indexFrom];
            if (currentStep.block === 'startLoop') {
                const loopLabel = currentStep.label;
                let loopContent = [];
                for (let i = indexFrom + 1; i < program.length; i++) {
                    if (program[i].block === 'endLoop') {
                        if (program[i].label != null && program[i].label === loopLabel) {
                            loopContent = program.slice(indexFrom, i + 1);
                            break;
                        }
                    }
                }
                // Move to left
                if (indexFrom > indexTo) {
                    program.splice(indexTo, loopContent.length, ...loopContent);
                    program[indexTo + loopContent.length] = swappedStep;
                // Move to right
                } else if (indexFrom < indexTo) {
                    program[indexFrom] = swappedStep;
                    program.splice(indexFrom + 1, loopContent.length, ...loopContent);
                }
            } else if (currentStep.block === 'endLoop') {
                const loopLabel = currentStep.label;
                let loopContent = [];
                for (let i = 0; i < indexFrom; i++) {
                    if (program[i].block === 'startLoop') {
                        if (program[i].label != null && program[i].label === loopLabel) {
                            loopContent = program.slice(i, indexFrom + 1);
                            break;
                        }
                    }
                }
                // Move to left
                if (indexFrom > indexTo) {
                    program.splice(indexTo, loopContent.length, ...loopContent);
                    program[indexFrom] = swappedStep;
                // Move to right
                } else if (indexFrom < indexTo) {
                    program[indexFrom - loopContent.length + 1] = swappedStep;
                    program.splice(indexFrom - loopContent.length + 2, loopContent.length, ...loopContent);
                }
            } else {
                program[indexFrom] = program[indexTo];
                program[indexTo] = currentStep;
            }
        }
        return this.updateProgram(program);
    }

    usesAction(action: CommandName): boolean {
        for (let index = 0; index < this.program.length; index++) {
            const stepAction = this.program[index].block;
            if (stepAction === action || (action === "loop" && (stepAction === "startLoop" || stepAction === "endLoop")) ) {
                return true;
            }
        }

        return false;
    }

    initiateProgramRun(): ProgramSequence {
        const loopIterationsLeft = new Map();
        for (let i = 0; i < this.program.length; i++) {
            const { block, label, iterations } = this.program[i];
            if (block === 'startLoop' && label != null && iterations != null) {
                loopIterationsLeft.set(label, iterations);
            }
        }
        return new ProgramSequence(this.program, 0, this.loopCounter, loopIterationsLeft);
    }
}
