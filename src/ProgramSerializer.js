// @flow

import type {Program} from './types';
import ProgramParser from './ProgramParser';

export default class ProgramSerializer {
    programParser: ProgramParser;

    constructor() {
        this.programParser = new ProgramParser();
    }

    serialize(program: Program): string {
        let programText = '';
        for (let i=0; i<program.length; i++) {
            switch(program[i]) {
                case ('forward1') :
                    programText += '1';
                    break;
                case ('forward2') :
                    programText += '2';
                    break;
                case ('forward3') :
                    programText += '3';
                    break;
                case ('backward1') :
                    programText += '4';
                    break;
                case ('backward2') :
                    programText += '5';
                    break;
                case ('backward3') :
                    programText += '6';
                    break;
                case ('left45') :
                    programText += 'A'
                    break;
                case ('left90') :
                    programText += 'B'
                    break;
                case ('left180') :
                    programText += 'D'
                    break;
                case ('right45') :
                    programText += 'a'
                    break;
                case ('right90') :
                    programText += 'b'
                    break;
                case ('right180') :
                    programText += 'd'
                    break;
                default:
                    throw new Error(`Unrecognized program command when serializing program: ${program[i]}`);
            }
        }
        return programText;
    }

    deserialize(programText: string): Program {
        return this.programParser.parse(programText);
    }
};
