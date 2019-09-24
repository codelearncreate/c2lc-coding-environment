// @flow

export type Program = Array<string>;

export type CommandHandler = { (Interpreter): Promise<void> };

// TODO: I don't think that Interpreter having memory is quite the right
//       factoring. But this will evolve. Maybe something like a parameterized
//       Project<T> that contains program and memory.

export default class Interpreter {
    commands: { [command: string]: { [namespace: string]: CommandHandler } };
    program: Program;
    programCounter: number;
    memory: { [string]: any };
    isRunning: boolean;

    constructor() {
        this.commands = {};
        this.program = [];
        this.programCounter = 0;
        this.memory = {};
        this.isRunning = false;
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

    run(program: Program): void {
        this.program = program;
        this.programCounter = 0;
        this.isRunning = true;
        this.continueRun();
    }

    continueRun(): void {
        if (this.isRunning) {
            if (this.atEnd()) {
                this.isRunning = false;
            } else {
                this.step().then(() => {
                    this.continueRun();
                });
            }
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
                const command = this.program[this.programCounter];
                const handlers = this.lookUpCommandHandlers(command);
                if (handlers.length === 0) {
                    reject(new Error(`Unknown command: ${command}`));
                } else {
                    // When the command handlers have completed,
                    // increment the programCounter and resolve the step Promise
                    this.callCommandHandlers(handlers).then(() => {
                        this.programCounter = this.programCounter + 1;
                        resolve();
                    }, (error) => {
                        console.log(error.name);
                        console.log(error.message);
                        reject(error);
                    });
                }
            }
        });
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
