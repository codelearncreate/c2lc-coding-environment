// @flow

import type {Program} from './types';

/* eslint-disable no-use-before-define */
export type CommandHandler = { (Interpreter): Promise<void> };
/* eslint-enable no-use-before-define */

export type InterpreterRunningState = { isRunning: boolean, activeStep: ?number }
// TODO: I don't think that Interpreter having memory is quite the right
//       factoring. But this will evolve. Maybe something like a parameterized
//       Project<T> that contains program and memory.

export default class Interpreter {
    commands: { [command: string]: { [namespace: string]: CommandHandler } };
    program: Program;
    programCounter: number;
    memory: { [string]: any };
    isRunning: boolean;
    onRunningStateChange: (InterpreterRunningState) => void;

    constructor(onRunningStateChange: (InterpreterRunningState) => void) {
        this.commands = {};
        this.program = [];
        this.programCounter = 0;
        this.memory = {};
        this.isRunning = false;
        this.onRunningStateChange = onRunningStateChange;
    }

    addCommandHandler(command: string, namespace: string, handler: CommandHandler) {
        let commandNamespaces = this.commands[command];
        if (!commandNamespaces) {
            commandNamespaces = {};
            this.commands[command] = commandNamespaces;
        }
        commandNamespaces[namespace] = handler;
    }

    setProgram(program: Program): void {
        this.program = program;
        this.programCounter = 0;
    }

    run(program: Program): Promise<void> {
        this.program = program;
        this.programCounter = 0;
        this.isRunning = true;
        return new Promise((resolve, reject) => {
            this.continueRun(resolve, reject);
        });
    }

    continueRun(resolve: any, reject: any): void {
        if (this.isRunning) {
            if (this.atEnd()) {
                this.isRunning = false;
                this.onRunningStateChange({isRunning: this.isRunning, activeStep: null});
                resolve();
            } else {
                this.onRunningStateChange({isRunning: this.isRunning, activeStep: this.programCounter});
                this.step().then(() => {
                    this.continueRun(resolve, reject);
                }, (error) => {
                    // Reject the run Promise when the step Promise is rejected
                    this.isRunning = false;
                    this.onRunningStateChange({isRunning: this.isRunning, activeStep: null});
                    reject(error);
                });
            }
        } else {
            resolve();
        }
    }

    atEnd(): boolean {
        return this.programCounter >= this.program.length;
    }

    step(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (this.atEnd()) {
                // We're at the end, nothing to do
                resolve();
            } else {
                this.doCommand(this.program[this.programCounter]).then(() => {
                    // When the command has completed, increment
                    // the programCounter and resolve the step Promise
                    this.programCounter = this.programCounter + 1;
                    resolve();
                }, (error) => {
                    reject(error);
                });
            }
        });
    }

    stop(): void {
        this.isRunning = false;
        this.onRunningStateChange({isRunning: this.isRunning, activeStep: null});
    }

    doCommand(command: string): Promise<any> {
        const handlers = this.lookUpCommandHandlers(command);
        if (handlers.length === 0) {
            return Promise.reject(new Error(`Unknown command: ${command}`));
        } else {
            return this.callCommandHandlers(handlers);
        }
    }

    callCommandHandlers(handlers: Array<CommandHandler>): Promise<any> {
        const promises = [];
        for (const handler of handlers) {
            promises.push(handler(this));
        }
        return Promise.all(promises);
    };

    lookUpCommandHandlers(command: string): Array<CommandHandler> {
        const commandNamespaces = this.commands[command];
        if (commandNamespaces) {
            const handlers = [];
            for (const namespace in commandNamespaces) {
                handlers.push(commandNamespaces[namespace]);
            }
            return handlers;
        } else {
            return [];
        }
    }
}
