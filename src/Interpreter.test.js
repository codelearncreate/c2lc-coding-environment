// @flow

import Interpreter from './Interpreter';
import type {CommandHandler} from './Interpreter';

function makeIncrement(varName: string): CommandHandler {
    return (interpreter: Interpreter) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                interpreter.memory[varName] = interpreter.memory[varName] + 1;
                resolve();
            }, 0);
        });
    };
}

test('New Interpreter has an empty program', () => {
    const interpreter = new Interpreter(()=>{}, 1000);
    expect(interpreter.program.length).toBe(0);
    expect(interpreter.programCounter).toBe(0);
});

test('Stepping an empty program leaves the program counter at 0', (done) => {
    const interpreter = new Interpreter(()=>{}, 1000);
    expect(interpreter.programCounter).toBe(0);
    interpreter.step().then(() => {
        expect(interpreter.programCounter).toBe(0);
        done();
    });
});

test('Step a program with 1 command', (done) => {
    const interpreter = new Interpreter(()=>{}, 1000);
    interpreter.addCommandHandler('increment-x', 'test', makeIncrement('x'));
    interpreter.setProgram(['increment-x']);
    interpreter.memory.x = 10;

    expect(interpreter.programCounter).toBe(0);
    expect(interpreter.memory.x).toBe(10);
    interpreter.step().then(() => {
        expect(interpreter.programCounter).toBe(1);
        expect(interpreter.memory.x).toBe(11);
        // Test step at end of program
        interpreter.step().then(() => {
            expect(interpreter.programCounter).toBe(1);
            expect(interpreter.memory.x).toBe(11);
            done();
        });
    });
});

test('Step a program with 2 commands', (done) => {
    const interpreter = new Interpreter(()=>{}, 1000);
    interpreter.addCommandHandler('increment-x', 'test', makeIncrement('x'));
    interpreter.setProgram(['increment-x', 'increment-x']);
    interpreter.memory.x = 10;

    expect(interpreter.programCounter).toBe(0);
    expect(interpreter.memory.x).toBe(10);
    interpreter.step().then(() => {
        expect(interpreter.programCounter).toBe(1);
        expect(interpreter.memory.x).toBe(11);
        interpreter.step().then(() => {
            expect(interpreter.programCounter).toBe(2);
            expect(interpreter.memory.x).toBe(12);
            // Test step at end of program
            interpreter.step().then(() => {
                expect(interpreter.programCounter).toBe(2);
                expect(interpreter.memory.x).toBe(12);
                done();
            });
        });
    });
});

test('Step a program with 2 handlers for the same command', (done) => {
    const interpreter = new Interpreter(()=>{}, 1000);
    interpreter.addCommandHandler('increment', 'x', makeIncrement('x'));
    interpreter.addCommandHandler('increment', 'y', makeIncrement('y'));
    interpreter.setProgram(['increment']);
    interpreter.memory.x = 10;
    interpreter.memory.y = 20;

    expect(interpreter.programCounter).toBe(0);
    expect(interpreter.memory.x).toBe(10);
    expect(interpreter.memory.y).toBe(20);
    interpreter.step().then(() => {
        expect(interpreter.programCounter).toBe(1);
        expect(interpreter.memory.x).toBe(11);
        expect(interpreter.memory.y).toBe(21);
        done();
    });
});

test('Stepping a program with an unknown command rejects with Error', () => {
    const interpreter = new Interpreter(()=>{}, 1000);
    interpreter.setProgram(['unknown-command']);

    return expect(interpreter.step()).rejects.toThrow('Unknown command: unknown-command');
});

test('Do a command without a program', (done) => {
    const interpreter = new Interpreter(()=>{}, 1000);
    interpreter.addCommandHandler('increment-x', 'test', makeIncrement('x'));
    interpreter.setProgram([]);
    interpreter.memory.x = 10;

    expect(interpreter.programCounter).toBe(0);
    expect(interpreter.memory.x).toBe(10);
    interpreter.doCommand('increment-x').then(() => {
        expect(interpreter.programCounter).toBe(0);
        expect(interpreter.memory.x).toBe(11);
        done();
    });
});

test('Do a command with a program', (done) => {
    const interpreter = new Interpreter(()=>{}, 1000);
    interpreter.addCommandHandler('increment-x', 'test', makeIncrement('x'));
    interpreter.addCommandHandler('increment-y', 'test', makeIncrement('y'));
    interpreter.setProgram(['increment-y']);
    interpreter.memory.x = 10;
    interpreter.memory.y = 20;

    expect(interpreter.programCounter).toBe(0);
    expect(interpreter.memory.x).toBe(10);
    expect(interpreter.memory.y).toBe(20);
    // Do a command independently of the program
    interpreter.doCommand('increment-x').then(() => {
        expect(interpreter.programCounter).toBe(0);
        expect(interpreter.memory.x).toBe(11);
        expect(interpreter.memory.y).toBe(20);
        // Then step the program
        interpreter.step().then(() => {
            expect(interpreter.programCounter).toBe(1);
            expect(interpreter.memory.x).toBe(11);
            expect(interpreter.memory.y).toBe(21);
            done();
        });
    });
});

test('Doing an unknown command rejects with Error', () => {
    const interpreter = new Interpreter(()=>{}, 1000);
    return expect(interpreter.doCommand('unknown-command')).rejects.toThrow('Unknown command: unknown-command');
});

test('onRunningStateChange is called on run() empty program', (done) => {
    const mockStateChangeHandler = jest.fn();
    const interpreter = new Interpreter(mockStateChangeHandler, 1000);

    interpreter.run([]).then(() => {
        expect(mockStateChangeHandler.mock.calls.length).toBe(1);
        expect(mockStateChangeHandler.mock.calls[0][0]).toStrictEqual({'isRunning': false, 'activeStep': null});
        done();
    });
});

test('onRunningStateChange is called on run() program with one step', (done) => {
    const mockStateChangeHandler = jest.fn();
    const interpreter = new Interpreter(mockStateChangeHandler, 1000);
    interpreter.addCommandHandler('step1', 'test', (interpreter) => {
        return new Promise((resolve, reject) => {
            expect(mockStateChangeHandler.mock.calls.length).toBe(1);
            expect(mockStateChangeHandler.mock.calls[0][0]).toStrictEqual({'isRunning': true, 'activeStep': 0});
            resolve();
        });
    });
    interpreter.run(['step1']).then(() => {
        expect(mockStateChangeHandler.mock.calls.length).toBe(2);
        expect(mockStateChangeHandler.mock.calls[0][0]).toStrictEqual({'isRunning': true, 'activeStep': 0});
        expect(mockStateChangeHandler.mock.calls[1][0]).toStrictEqual({'isRunning': false, 'activeStep': null});
        done();
    });
});

test('onRunningStateChange is called on run() program with two steps', (done) => {
    const mockStateChangeHandler = jest.fn();
    const interpreter = new Interpreter(mockStateChangeHandler, 1000);
    interpreter.addCommandHandler('step1', 'test', (interpreter) => {
        return new Promise((resolve, reject) => {
            expect(mockStateChangeHandler.mock.calls.length).toBe(1);
            expect(mockStateChangeHandler.mock.calls[0][0]).toStrictEqual({'isRunning': true, 'activeStep': 0});
            resolve();
        });
    });
    interpreter.addCommandHandler('step2', 'test', (interpreter) => {
        return new Promise((resolve, reject) => {
            expect(mockStateChangeHandler.mock.calls.length).toBe(2);
            expect(mockStateChangeHandler.mock.calls[1][0]).toStrictEqual({'isRunning': true, 'activeStep': 1});
            resolve();
        });
    });
    interpreter.run(['step1', 'step2']).then(() => {
        expect(mockStateChangeHandler.mock.calls.length).toBe(3);
        expect(mockStateChangeHandler.mock.calls[0][0]).toStrictEqual({'isRunning': true, 'activeStep': 0});
        expect(mockStateChangeHandler.mock.calls[1][0]).toStrictEqual({'isRunning': true, 'activeStep': 1});
        expect(mockStateChangeHandler.mock.calls[2][0]).toStrictEqual({'isRunning': false, 'activeStep': null});
        done();
    });
});

test('Do not continue through program if stop is called', (done) => {
    const mockStateChangeHandler = jest.fn();
    const interpreter = new Interpreter(mockStateChangeHandler, 1000);
    interpreter.addCommandHandler('step1', 'test', (interpreter) => {
        return new Promise((resolve, reject) => {
            expect(mockStateChangeHandler.mock.calls.length).toBe(1);
            expect(mockStateChangeHandler.mock.calls[0][0]).toStrictEqual({'isRunning': true, 'activeStep': 0});
            // call stop
            interpreter.stop();
            resolve();
        });
    });
    interpreter.addCommandHandler('step2', 'test', (interpreter) => {
        // This step is not executed, as stop is called in step1
        return Promise.reject();
    });
    interpreter.run(['step1', 'step2']).then(() => {
        expect(mockStateChangeHandler.mock.calls.length).toBe(2);
        expect(mockStateChangeHandler.mock.calls[0][0]).toStrictEqual({'isRunning': true, 'activeStep': 0});
        expect(mockStateChangeHandler.mock.calls[1][0]).toStrictEqual({'isRunning': false, 'activeStep': null});
        done();
    });
});

test('run() Promise is rejected on first command error', (done) => {
    const mockStateChangeHandler = jest.fn();
    const interpreter = new Interpreter(mockStateChangeHandler, 1000);
    interpreter.run(['unknown-command1', 'unknown-command2']).then(() => {}, (error: Error) => {
        expect(error.message).toBe('Unknown command: unknown-command1');
        expect(mockStateChangeHandler.mock.calls.length).toBe(2);
        expect(mockStateChangeHandler.mock.calls[0][0]).toStrictEqual({'isRunning': true, 'activeStep': 0});
        expect(mockStateChangeHandler.mock.calls[1][0]).toStrictEqual({'isRunning': false, 'activeStep': null});
        done();
    });
});

test('Should initiallize stepTime value from constructor and update on setStepTime', () => {
    expect.assertions(2);
    const initialStepTimeValue = 1000;
    const interpreter = new Interpreter(() => {}, initialStepTimeValue);
    expect(interpreter.stepTimeMs).toBe(initialStepTimeValue);

    const newStepTimeValue = 2000;
    interpreter.setStepTime(newStepTimeValue);
    expect(interpreter.stepTimeMs).toBe(newStepTimeValue);
});

test('Each command handler get called with step time specified in the class property', () => {
    const mockCommandHandler = jest.fn();
    const interpreter = new Interpreter(()=>{}, 1000);
    interpreter.addCommandHandler('test', 'test', mockCommandHandler);
    interpreter.doCommand('test');
    expect(mockCommandHandler.mock.calls.length).toBe(1);
    expect(mockCommandHandler.mock.calls[0][1]).toBe(interpreter.stepTimeMs);

    const newStepTimeValue = 2000;
    interpreter.setStepTime(newStepTimeValue);
    expect(interpreter.stepTimeMs).toBe(newStepTimeValue);
    interpreter.doCommand('test');
    expect(mockCommandHandler.mock.calls.length).toBe(2);
    expect(mockCommandHandler.mock.calls[1][1]).toBe(interpreter.stepTimeMs);
})
