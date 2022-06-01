// @flow

import {createIntl} from 'react-intl';
import {App} from './App';
import AudioManagerImpl from './AudioManagerImpl';
import {ProgramBlockEditor} from './ProgramBlockEditor';
import ProgramChangeController from './ProgramChangeController';
import ProgramSequence from './ProgramSequence';
import type { Program } from './types';
import messages from './messages.json';

const intl = createIntl({
    locale: 'en',
    defaultLocale: 'en',
    messages: messages.en
});

jest.mock('./App');
jest.mock('./AudioManagerImpl');
jest.mock('./ProgramBlockEditor');

function createProgramChangeController() {
    // $FlowFixMe: Jest mock API
    App.mockClear();
    // $FlowFixMe: Jest mock API
    AudioManagerImpl.mockClear();

    // $FlowFixMe: Jest mock API
    const controller = new ProgramChangeController(new App(), intl, new AudioManagerImpl());

    // $FlowFixMe: Jest mock API
    const appMock = App.mock.instances[0];
    // $FlowFixMe: Jest mock API
    const audioManagerMock = AudioManagerImpl.mock.instances[0];

    return {
        controller,
        appMock,
        audioManagerMock
    };
}

describe('Test insertSelectedActionIntoProgram()', () => {
    test('When there is a selectedAction, then the program should be updated and all expected activities invoked', (done) => {
        expect.assertions(10);

        const { controller, appMock, audioManagerMock } = createProgramChangeController();

        appMock.setState.mockImplementation((callback) => {
            const newState = callback({
                programSequence: new ProgramSequence([{block: 'forward1'}, {block: 'forward2'}], 0, 0, new Map())
            });

            // The program should be updated
            expect(newState.programSequence.getProgram()).toStrictEqual(
                [{block: 'forward1'}, {block: 'forward3'}, {block: 'forward2'}]);

            // The announcement should be made
            expect(audioManagerMock.playAnnouncement.mock.calls.length).toBe(1);
            expect(audioManagerMock.playAnnouncement.mock.calls[0][0]).toBe('add');
            expect(audioManagerMock.playAnnouncement.mock.calls[0][2]).toStrictEqual({
                commandType: 'movement',
                command: 'forward 3 squares'
            });

            // The focus, scrolling, and animation should be set up
            // $FlowFixMe: Jest mock API
            const programBlockEditorMock = ProgramBlockEditor.mock.instances[0];
            expect(programBlockEditorMock.focusCommandBlockAfterUpdate.mock.calls.length).toBe(1);
            expect(programBlockEditorMock.focusCommandBlockAfterUpdate.mock.calls[0][0]).toBe(1);
            expect(programBlockEditorMock.scrollToAddNodeAfterUpdate.mock.calls.length).toBe(1);
            expect(programBlockEditorMock.scrollToAddNodeAfterUpdate.mock.calls[0][0]).toBe(2);
            expect(programBlockEditorMock.setUpdatedCommandBlock.mock.calls.length).toBe(1);
            expect(programBlockEditorMock.setUpdatedCommandBlock.mock.calls[0][0]).toBe(1);

            done();
        });

        // $FlowFixMe: Jest mock API
        ProgramBlockEditor.mockClear();
        // $FlowFixMe: Jest mock API
        controller.insertSelectedActionIntoProgram(new ProgramBlockEditor(), 1,
            'forward3');
    });

    test('When there is no selectedAction, then no changes should be made', (done) => {
        expect.assertions(5);

        const { controller, appMock, audioManagerMock } = createProgramChangeController();

        appMock.setState.mockImplementation((callback) => {
            const newState = callback({
                programSequence: new ProgramSequence([], 0, 0, new Map())
            });

            // The program should not be updated
            expect(newState).toStrictEqual({});

            // No announcement should be made
            expect(audioManagerMock.playAnnouncement.mock.calls.length).toBe(0);

            // No methods on the ProgramBlockEditor should have been called
            // $FlowFixMe: Jest mock API
            const programBlockEditorMock = ProgramBlockEditor.mock.instances[0];
            expect(programBlockEditorMock.focusCommandBlockAfterUpdate.mock.calls.length).toBe(0);
            expect(programBlockEditorMock.scrollToAddNodeAfterUpdate.mock.calls.length).toBe(0);
            expect(programBlockEditorMock.setUpdatedCommandBlock.mock.calls.length).toBe(0);

            done();
        });

        // $FlowFixMe: Jest mock API
        ProgramBlockEditor.mockClear();
        // $FlowFixMe: Jest mock API
        controller.insertSelectedActionIntoProgram(new ProgramBlockEditor(), 0, null);
    });
});

describe('Test addSelectedActionToProgramEnd()', () => {
    test('When there is a selectedAction, then the program should be updated and all expected activities invoked', (done) => {
        expect.assertions(10);

        const { controller, appMock, audioManagerMock } = createProgramChangeController();

        appMock.setState.mockImplementation((callback) => {
            const newState = callback({
                programSequence: new ProgramSequence([{block: 'forward1'}, {block: 'forward2'}], 0, 0, new Map())
            });

            // The program should be updated
            expect(newState.programSequence.getProgram()).toStrictEqual(
                [{block: 'forward1'}, {block: 'forward2'}, {block: 'forward3'}]);

            // The announcement should be made
            expect(audioManagerMock.playAnnouncement.mock.calls.length).toBe(1);
            expect(audioManagerMock.playAnnouncement.mock.calls[0][0]).toBe('add');
            expect(audioManagerMock.playAnnouncement.mock.calls[0][2]).toStrictEqual({
                commandType: 'movement',
                command: 'forward 3 squares'
            });

            // The focus, scrolling, and animation should be set up
            // $FlowFixMe: Jest mock API
            const programBlockEditorMock = ProgramBlockEditor.mock.instances[0];
            expect(programBlockEditorMock.focusCommandBlockAfterUpdate.mock.calls.length).toBe(1);
            expect(programBlockEditorMock.focusCommandBlockAfterUpdate.mock.calls[0][0]).toBe(2);
            expect(programBlockEditorMock.scrollToAddNodeAfterUpdate.mock.calls.length).toBe(1);
            expect(programBlockEditorMock.scrollToAddNodeAfterUpdate.mock.calls[0][0]).toBe(3);
            expect(programBlockEditorMock.setUpdatedCommandBlock.mock.calls.length).toBe(1);
            expect(programBlockEditorMock.setUpdatedCommandBlock.mock.calls[0][0]).toBe(2);

            done();
        });

        // $FlowFixMe: Jest mock API
        ProgramBlockEditor.mockClear();
        // $FlowFixMe: Jest mock API
        controller.addSelectedActionToProgramEnd(new ProgramBlockEditor(), 'forward3');
    });

    test('When there is no selectedAction, then no changes should be made', (done) => {
        expect.assertions(5);

        const { controller, appMock, audioManagerMock } = createProgramChangeController();

        appMock.setState.mockImplementation((callback) => {
            const newState = callback({
                programSequence: new ProgramSequence([{block: 'forward1'}, {block: 'forward2'}], 0, 0, new Map())
            });

            // The program should not be updated
            expect(newState).toStrictEqual({});

            // No announcement should be made
            expect(audioManagerMock.playAnnouncement.mock.calls.length).toBe(0);

            // No methods on the ProgramBlockEditor should have been called
            // $FlowFixMe: Jest mock API
            const programBlockEditorMock = ProgramBlockEditor.mock.instances[0];
            expect(programBlockEditorMock.focusCommandBlockAfterUpdate.mock.calls.length).toBe(0);
            expect(programBlockEditorMock.scrollToAddNodeAfterUpdate.mock.calls.length).toBe(0);
            expect(programBlockEditorMock.setUpdatedCommandBlock.mock.calls.length).toBe(0);

            done();
        });

        // $FlowFixMe: Jest mock API
        ProgramBlockEditor.mockClear();
        // $FlowFixMe: Jest mock API
        controller.addSelectedActionToProgramEnd(new ProgramBlockEditor(), null);
    });
});

type DeleteStepTestCase = {
    program: Program,
    deleteStepIndex: number,
    deleteStepName: string,
    expectedAnnouncementCommandType: string,
    expectedAnnouncementCommand: string
};

describe('Test deleteProgramStep()', () => {
    test.each(([
        {
            program: [
                {block: 'forward1'},
                {block: 'forward2'}
            ],
            deleteStepIndex: 0,
            deleteStepName: 'forward1',
            expectedAnnouncementCommandType: 'movement',
            expectedAnnouncementCommand: 'forward 1 square'
        },
        {
            program: [
                {block: 'startLoop', label: 'A', iterations: 1},
                {block: 'forward2'},
                {block: 'endLoop', label: 'A'}
            ],
            deleteStepIndex: 0,
            deleteStepName: 'startLoop',
            expectedAnnouncementCommandType: 'control',
            expectedAnnouncementCommand: 'loop A'
        },
        {
            program: [
                {block: 'startLoop', label: 'A', iterations: 1},
                {block: 'endLoop', label: 'A'},
                {block: 'forward2'}
            ],
            deleteStepIndex: 1,
            deleteStepName: 'endLoop',
            expectedAnnouncementCommandType: 'control',
            expectedAnnouncementCommand: 'loop A'
        }
    ]: Array<DeleteStepTestCase>))('When deleting a step not at the end, then focus is set to the step now at the deleted index',
        (testData: DeleteStepTestCase, done) => {
            expect.assertions(7);

            const { controller, appMock, audioManagerMock } = createProgramChangeController();

            appMock.setState.mockImplementation((callback) => {
                const newState = callback({
                    programSequence: new ProgramSequence(testData.program, 0, 0, new Map())
                });

                // The program should be updated
                expect(newState.programSequence.getProgram()).toStrictEqual(
                    [{block: 'forward2'}]);

                // The announcement should be made
                expect(audioManagerMock.playAnnouncement.mock.calls.length).toBe(1);
                expect(audioManagerMock.playAnnouncement.mock.calls[0][0]).toBe('delete');
                expect(audioManagerMock.playAnnouncement.mock.calls[0][2]).toStrictEqual({
                    commandType: testData.expectedAnnouncementCommandType,
                    command: testData.expectedAnnouncementCommand
                });

                // The add-node after the program should be focused
                // $FlowFixMe: Jest mock API
                const programBlockEditorMock = ProgramBlockEditor.mock.instances[0];
                expect(programBlockEditorMock.focusCommandBlockAfterUpdate.mock.calls.length).toBe(1);
                expect(programBlockEditorMock.focusCommandBlockAfterUpdate.mock.calls[0][0]).toBe(0);
                expect(programBlockEditorMock.focusAddNodeAfterUpdate.mock.calls.length).toBe(0);

                done();
            });

            // $FlowFixMe: Jest mock API
            ProgramBlockEditor.mockClear();
            // $FlowFixMe: Jest mock API
            controller.deleteProgramStep(new ProgramBlockEditor(), testData.deleteStepIndex, testData.deleteStepName);
        });

    test.each(([
        {
            program: [
                {block: 'forward1'},
                {block: 'forward2'}
            ],
            deleteStepIndex: 1,
            deleteStepName: 'forward2',
            expectedAnnouncementCommandType: 'movement',
            expectedAnnouncementCommand: 'forward 2 squares'
        },
        {
            program: [
                {block: 'forward1'},
                {block: 'startLoop', label: 'A', iterations: 1},
                {block: 'endLoop', label: 'A'}
            ],
            deleteStepIndex: 1,
            deleteStepName: 'startLoop',
            expectedAnnouncementCommandType: 'control',
            expectedAnnouncementCommand: 'loop A'
        },
        {
            program: [
                {block: 'forward1'},
                {block: 'startLoop', label: 'A', iterations: 1},
                {block: 'endLoop', label: 'A'}
            ],
            deleteStepIndex: 2,
            deleteStepName: 'endLoop',
            expectedAnnouncementCommandType: 'control',
            expectedAnnouncementCommand: 'loop A'
        }
    ]: Array<DeleteStepTestCase>))('When deleting the step at the end, then focus is set to the add-node after the program',
        (testData: DeleteStepTestCase, done) => {
            expect.assertions(7);

            const { controller, appMock, audioManagerMock } = createProgramChangeController();

            appMock.setState.mockImplementation((callback) => {
                const newState = callback({
                    programSequence: new ProgramSequence(testData.program, 0, 0, new Map())
                });

                // The program should be updated
                expect(newState.programSequence.getProgram()).toStrictEqual(
                    [{block: 'forward1'}]);

                // The announcement should be made
                expect(audioManagerMock.playAnnouncement.mock.calls.length).toBe(1);
                expect(audioManagerMock.playAnnouncement.mock.calls[0][0]).toBe('delete');
                expect(audioManagerMock.playAnnouncement.mock.calls[0][2]).toStrictEqual({
                    commandType: testData.expectedAnnouncementCommandType,
                    command: testData.expectedAnnouncementCommand
                });

                // The add-node after the program should be focused
                // $FlowFixMe: Jest mock API
                const programBlockEditorMock = ProgramBlockEditor.mock.instances[0];
                expect(programBlockEditorMock.focusCommandBlockAfterUpdate.mock.calls.length).toBe(0);
                expect(programBlockEditorMock.focusAddNodeAfterUpdate.mock.calls.length).toBe(1);
                expect(programBlockEditorMock.focusAddNodeAfterUpdate.mock.calls[0][0]).toBe(1);

                done();
            });

            // $FlowFixMe: Jest mock API
            ProgramBlockEditor.mockClear();
            // $FlowFixMe: Jest mock API
            controller.deleteProgramStep(new ProgramBlockEditor(), testData.deleteStepIndex, testData.deleteStepName);
        });

    test('When the step to delete has changed, then no changes to the program should be made', (done) => {
        expect.assertions(4);

        const { controller, appMock, audioManagerMock } = createProgramChangeController();

        appMock.setState.mockImplementation((callback) => {
            const newState = callback({
                programSequence: new ProgramSequence([{block: 'forward1'}, {block: 'forward2'}], 0, 0, new Map())
            });

            // The program should not be updated
            expect(newState).toStrictEqual({});

            // No announcement should be made
            expect(audioManagerMock.playAnnouncement.mock.calls.length).toBe(0);

            // No methods on the ProgramBlockEditor should have been called
            // $FlowFixMe: Jest mock API
            const programBlockEditorMock = ProgramBlockEditor.mock.instances[0];
            expect(programBlockEditorMock.focusCommandBlockAfterUpdate.mock.calls.length).toBe(0);
            expect(programBlockEditorMock.focusAddNodeAfterUpdate.mock.calls.length).toBe(0);

            done();
        });

        // $FlowFixMe: Jest mock API
        ProgramBlockEditor.mockClear();
        // $FlowFixMe: Jest mock API
        controller.deleteProgramStep(new ProgramBlockEditor(), 1, 'forward3');
    });

});

describe('Test replaceProgramStep()', () => {
    test('When there is no selectedAction, then an announcement should be made', (done) => {
        expect.assertions(3);

        const { controller, appMock, audioManagerMock } = createProgramChangeController();

        appMock.setState.mockImplementation((callback) => {
            const newState = callback({
                programSequence: new ProgramSequence([{block: 'forward1'}, {block: 'left45'}], 0, 0, new Map())
            });

            // The program should not be updated
            expect(newState).toStrictEqual({});

            // The announcement should be made
            expect(audioManagerMock.playAnnouncement.mock.calls.length).toBe(1);
            expect(audioManagerMock.playAnnouncement.mock.calls[0][0]).toBe('noActionSelected');

            done();
        });

        // $FlowFixMe: Jest mock API
        ProgramBlockEditor.mockClear();
        // $FlowFixMe: Jest mock API
        controller.replaceProgramStep(new ProgramBlockEditor(), 1, null);
    });

    test('When the block to replace is a loop block, then an announcement should be made', (done) => {
        expect.assertions(3);

        const { controller, appMock, audioManagerMock } = createProgramChangeController();

        appMock.setState.mockImplementation((callback) => {
            const newState = callback({
                programSequence: new ProgramSequence([{block: 'startLoop'}, {block: 'endLoop'}], 0, 0, new Map())
            });

            // The program should not be updated
            expect(newState).toStrictEqual({});

            // The announcement should be made
            expect(audioManagerMock.playAnnouncement.mock.calls.length).toBe(1);
            expect(audioManagerMock.playAnnouncement.mock.calls[0][0]).toBe('cannotReplaceLoopBlocks');

            done();
        });

        // $FlowFixMe: Jest mock API
        ProgramBlockEditor.mockClear();
        // $FlowFixMe: Jest mock API
        controller.replaceProgramStep(new ProgramBlockEditor(), 1, 'right45');
    });

    test('When there is a selectedAction, then the program should be updated and all expected activities invoked', (done) => {
        expect.assertions(10);

        const { controller, appMock, audioManagerMock } = createProgramChangeController();

        appMock.setState.mockImplementation((callback) => {
            const newState = callback({
                programSequence: new ProgramSequence([{block: 'forward1'}, {block: 'left45'}], 0, 0, new Map())
            });

            // The program should be updated
            expect(newState.programSequence.getProgram()).toStrictEqual(
                [{block: 'forward1'}, {block: 'right45'}]);

            // The announcement should be made
            expect(audioManagerMock.playAnnouncement.mock.calls.length).toBe(1);
            expect(audioManagerMock.playAnnouncement.mock.calls[0][0]).toBe('replace');
            expect(audioManagerMock.playAnnouncement.mock.calls[0][2]).toStrictEqual({
                oldCommand: "turn left 45 degrees",
                newCommand: "turn right 45 degrees"
            });

            // The focus, scrolling, and animation should be set up
            // $FlowFixMe: Jest mock API
            const programBlockEditorMock = ProgramBlockEditor.mock.instances[0];
            expect(programBlockEditorMock.focusCommandBlockAfterUpdate.mock.calls.length).toBe(1);
            expect(programBlockEditorMock.focusCommandBlockAfterUpdate.mock.calls[0][0]).toBe(1);
            expect(programBlockEditorMock.scrollToAddNodeAfterUpdate.mock.calls.length).toBe(1);
            expect(programBlockEditorMock.scrollToAddNodeAfterUpdate.mock.calls[0][0]).toBe(2);
            expect(programBlockEditorMock.setUpdatedCommandBlock.mock.calls.length).toBe(1);
            expect(programBlockEditorMock.setUpdatedCommandBlock.mock.calls[0][0]).toBe(1);

            done();
        });

        // $FlowFixMe: Jest mock API
        ProgramBlockEditor.mockClear();
        // $FlowFixMe: Jest mock API
        controller.replaceProgramStep(new ProgramBlockEditor(), 1, 'right45');
    });
});

describe('Test moveProgramStepNext()', () => {
    test.each(([
        {
            program: [
                {block: 'forward1'},
                {block: 'forward2'}
            ],
            indexFrom: 0,
            commandAtIndexFrom: 'forward1',
            focusAfterMove: 'focusBlockMoved',
            expectedProgram: [
                {block: 'forward2'},
                {block: 'forward1'}
            ],
            expectedAnnouncementCommand: 'moveToNext',
            expectedFocusCommandBlockAfterUpdateCall: 1
        },
        {
            program: [
                {block: 'forward1'},
                {block: 'startLoop', label: 'A', iterations: 1},
                {block: 'endLoop', label: 'A'},
                {block: 'forward2'}
            ],
            indexFrom: 1,
            commandAtIndexFrom: 'startLoop',
            focusAfterMove: 'focusActionPanel',
            expectedProgram: [
                {block: 'forward1'},
                {block: 'forward2'},
                {block: 'startLoop', label: 'A', iterations: 1},
                {block: 'endLoop', label: 'A'},
            ],
            expectedAnnouncementCommand: 'moveToNext',
            expectedFocusCommandBlockAfterUpdateCall: 0
        }
    ]))('When movement is possible, then the program should be updated and all expected activities invoked', (testData, done) => {
        const { controller, appMock, audioManagerMock } = createProgramChangeController();
        appMock.setState.mockImplementation((callback) => {
            const newState = callback({
                programSequence: new ProgramSequence(testData.program, 0, 0, new Map())
            });

            // The program should be updated
            expect(newState.programSequence.getProgram()).toStrictEqual(testData.expectedProgram);

            // The announcement should be made
            expect(audioManagerMock.playAnnouncement.mock.calls.length).toBe(1);
            expect(audioManagerMock.playAnnouncement.mock.calls[0][0]).toBe(testData.expectedAnnouncementCommand);

            // $FlowFixMe: Jest mock API
            const programBlockEditorMock = ProgramBlockEditor.mock.instances[0];
            expect(programBlockEditorMock.focusCommandBlockAfterUpdate.mock.calls.length).toBe(testData.expectedFocusCommandBlockAfterUpdateCall);

            done();
        });

        // $FlowFixMe: Jest mock API
        ProgramBlockEditor.mockClear();
        // $FlowFixMe: Jest mock API
        controller.moveProgramStepNext(new ProgramBlockEditor(),
            testData.indexFrom, testData.commandAtIndexFrom,
            testData.focusAfterMove);
    });

    test('When move next is not possible, then an announcement should be made', (done) => {
        expect.assertions(3);

        const { controller, appMock, audioManagerMock } = createProgramChangeController();

        appMock.setState.mockImplementation((callback) => {
            const newState = callback({
                programSequence: new ProgramSequence([{block: 'forward1'}, {block: 'right45'}], 0, 0, new Map())
            });

            // The program should not be updated
            expect(newState).toStrictEqual({});

            // The announcement should be made
            expect(audioManagerMock.playAnnouncement.mock.calls.length).toBe(1);
            expect(audioManagerMock.playAnnouncement.mock.calls[0][0]).toBe('cannotMoveNext');

            done();
        });

        // $FlowFixMe: Jest mock API
        ProgramBlockEditor.mockClear();
        // $FlowFixMe: Jest mock API
        controller.moveProgramStepNext(new ProgramBlockEditor(), 1, 'right45', 'focusBlockMoved');
    });
});

describe('Test moveProgramStepPrevious()', () => {
    test.each(([
        {
            program: [
                {block: 'forward1'},
                {block: 'forward2'}
            ],
            indexFrom: 1,
            commandAtIndexFrom: 'forward2',
            focusAfterMove: 'focusBlockMoved',
            expectedProgram: [
                {block: 'forward2'},
                {block: 'forward1'}
            ],
            expectedAnnouncementCommand: 'moveToPrevious',
            expectedFocusCommandBlockAfterUpdateCall: 1
        },
        {
            program: [
                {block: 'forward1'},
                {block: 'startLoop', label: 'A', iterations: 1},
                {block: 'endLoop', label: 'A'},
                {block: 'forward2'}
            ],
            indexFrom: 2,
            commandAtIndexFrom: 'endLoop',
            focusAfterMove: 'focusActionPanel',
            expectedProgram: [
                {block: 'startLoop', label: 'A', iterations: 1},
                {block: 'endLoop', label: 'A'},
                {block: 'forward1'},
                {block: 'forward2'}
            ],
            expectedAnnouncementCommand: 'moveToPrevious',
            expectedFocusCommandBlockAfterUpdateCall: 0
        },
    ]))('When movement is possible, then the program should be updated and all expected activities invoked', (testData, done) => {
        const { controller, appMock, audioManagerMock } = createProgramChangeController();
        appMock.setState.mockImplementation((callback) => {
            const newState = callback({
                programSequence: new ProgramSequence(testData.program, 0, 0, new Map())
            });

            // The program should be updated
            expect(newState.programSequence.getProgram()).toStrictEqual(testData.expectedProgram);

            // The announcement should be made
            expect(audioManagerMock.playAnnouncement.mock.calls.length).toBe(1);
            expect(audioManagerMock.playAnnouncement.mock.calls[0][0]).toBe(testData.expectedAnnouncementCommand);

            // $FlowFixMe: Jest mock API
            const programBlockEditorMock = ProgramBlockEditor.mock.instances[0];
            expect(programBlockEditorMock.focusCommandBlockAfterUpdate.mock.calls.length).toBe(testData.expectedFocusCommandBlockAfterUpdateCall);

            done();
        });

        // $FlowFixMe: Jest mock API
        ProgramBlockEditor.mockClear();
        // $FlowFixMe: Jest mock API
        controller.moveProgramStepPrevious(new ProgramBlockEditor(),
            testData.indexFrom, testData.commandAtIndexFrom,
            testData.focusAfterMove);
    });

    test('When move previous is not possible, then an announcement should be made', (done) => {
        expect.assertions(3);

        const { controller, appMock, audioManagerMock } = createProgramChangeController();

        appMock.setState.mockImplementation((callback) => {
            const newState = callback({
                programSequence: new ProgramSequence([{block: 'forward1'}, {block: 'right45'}], 0, 0, new Map())
            });

            // The program should not be updated
            expect(newState).toStrictEqual({});

            // The announcement should be made
            expect(audioManagerMock.playAnnouncement.mock.calls.length).toBe(1);
            expect(audioManagerMock.playAnnouncement.mock.calls[0][0]).toBe('cannotMovePrevious');

            done();
        });

        // $FlowFixMe: Jest mock API
        ProgramBlockEditor.mockClear();
        // $FlowFixMe: Jest mock API
        controller.moveProgramStepPrevious(new ProgramBlockEditor(), 0, 'forward1', 'focusBlockMoved');
    });
});
