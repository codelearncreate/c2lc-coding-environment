// @flow

import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, mount, shallow } from 'enzyme';
import { Button } from 'react-bootstrap';
import { createIntl, IntlProvider } from 'react-intl';
import AudioManagerImpl from './AudioManagerImpl';
import ActionPanel from './ActionPanel';
import AriaDisablingButton from './AriaDisablingButton';
import CharacterState from './CharacterState';
import FocusTrapManager from './FocusTrapManager';
import ProgramSequence from './ProgramSequence';
import SceneDimensions from './SceneDimensions';
import messages from './messages.json';
import ProgramBlockEditor from './ProgramBlockEditor';
import ToggleSwitch from './ToggleSwitch';

// Mocks
jest.mock('./AudioManagerImpl');

configure({ adapter: new Adapter()});

// TODO: Mock the FocusTrapManager

const mockAllowedActions = {
    "forward1": true,
    "forward2": true,
    "forward3": true,
    "left45": true,
    "left90": true,
    "left180": true,
    "right45": true,
    "right90": true,
    "right180": true
};

const defaultProgramBlockEditorProps = {
    interpreterIsRunning: false,
    characterState: new CharacterState(1, 1, 2, [], new SceneDimensions(100, 100)),
    programSequence: new ProgramSequence(['forward1', 'left45', 'forward1', 'left45'], 0),
    runningState: 'stopped',
    actionPanelStepIndex: null,
    selectedAction: null,
    editingDisabled: false,
    replaceIsActive: false,
    isDraggingCommand: false,
    focusTrapManager: new FocusTrapManager(),
    addNodeExpandedMode: false,
    theme: 'default',
    allowedActions: mockAllowedActions,
    world: 'default'
};

function createShallowProgramBlockEditor(props) {
    const intl = createIntl({
        locale: 'en',
        defaultLocale: 'en',
        messages: messages.en
    });

    // $FlowFixMe: Flow doesn't know about the Jest mock API
    AudioManagerImpl.mockClear();
    const audioManagerInstance = new AudioManagerImpl(true, true);
    // $FlowFixMe: Flow doesn't know about the Jest mock API
    const audioManagerMock: any = AudioManagerImpl.mock.instances[0];
    const mockChangeProgramSequenceHandler = jest.fn();
    const mockChangeAddNodeExpandedModeHandler = jest.fn();
    const mockChangeCharacterPosition = jest.fn();
    const mockChangeCharacterXPosition = jest.fn();
    const mockChangeCharacterYPosition = jest.fn();

    const wrapper: $FlowIgnoreType = shallow(
        React.createElement(
            ProgramBlockEditor.WrappedComponent,
            Object.assign(
                {},
                defaultProgramBlockEditorProps,
                {
                    intl: intl,
                    audioManager: audioManagerInstance,
                    onChangeProgramSequence: mockChangeProgramSequenceHandler,
                    onChangeAddNodeExpandedMode: mockChangeAddNodeExpandedModeHandler,
                    onChangeCharacterPosition: mockChangeCharacterPosition,
                    onChangeCharacterXPosition: mockChangeCharacterXPosition,
                    onChangeCharacterYPosition: mockChangeCharacterYPosition
                },
                props
            )
        )
    );

    return {
        wrapper,
        audioManagerMock,
        mockChangeProgramSequenceHandler,
        mockChangeAddNodeExpandedModeHandler,
        mockChangeCharacterXPosition,
        mockChangeCharacterYPosition,
    };
}

function createMountProgramBlockEditor(props) {
    // $FlowFixMe: Flow doesn't know about the Jest mock API
    AudioManagerImpl.mockClear();
    const audioManagerInstance = new AudioManagerImpl(true, true);
    // $FlowFixMe: Flow doesn't know about the Jest mock API
    const audioManagerMock = AudioManagerImpl.mock.instances[0];

    const mockChangeProgramSequenceHandler = jest.fn();
    const mockChangeActionPanelStepIndex = jest.fn();
    const mockChangeAddNodeExpandedModeHandler = jest.fn();
    const mockChangeCharacterPosition = jest.fn();
    const mockChangeCharacterXPosition = jest.fn();
    const mockChangeCharacterYPosition = jest.fn();

    const wrapper = mount(
        React.createElement(
            ProgramBlockEditor,
            Object.assign(
                {},
                defaultProgramBlockEditorProps,
                {
                    audioManager: audioManagerInstance,
                    onChangeProgramSequence: mockChangeProgramSequenceHandler,
                    onChangeActionPanelStepIndex: mockChangeActionPanelStepIndex,
                    onChangeAddNodeExpandedMode: mockChangeAddNodeExpandedModeHandler,
                    world: 'default',
                    onChangeCharacterPosition: mockChangeCharacterPosition,
                    onChangeCharacterXPosition: mockChangeCharacterXPosition,
                    onChangeCharacterYPosition: mockChangeCharacterYPosition
                },
                props
            )
        ),
        {
            wrappingComponent: IntlProvider,
            wrappingComponentProps: {
                locale: 'en',
                defaultLocale: 'en',
                messages: messages.en
            }
        }
    );

    return {
        wrapper,
        audioManagerMock,
        mockChangeProgramSequenceHandler,
        mockChangeActionPanelStepIndex,
        mockChangeAddNodeExpandedModeHandler,
        mockChangeCharacterPosition,
        mockChangeCharacterXPosition,
        mockChangeCharacterYPosition
    };
}

function getProgramDeleteAllButton(programBlockEditorWrapper) {
    return programBlockEditorWrapper.find(AriaDisablingButton)
        .filter('.ProgramBlockEditor__program-deleteAll-button');
}

function getProgramBlockWithActionPanel(programBlockEditorWrapper) {
    return programBlockEditorWrapper.find('div')
        .filter('.ProgramBlockEditor__program-block-with-panel');
}

function getActionPanelActionButtons(programBlockEditorWrapper) {
    return programBlockEditorWrapper.find(Button)
        .filter('.ActionPanel__action-buttons');
}

function getProgramBlocks(programBlockEditorWrapper) {
    return programBlockEditorWrapper.find(AriaDisablingButton)
        .filter('.ProgramBlockEditor__program-block');
}

function getProgramBlockAtPosition(programBlockEditorWrapper, index: number) {
    return getProgramBlocks(programBlockEditorWrapper).at(index);
}

function getAddNodeButtonAtPosition(programBlockEditorWrapper, index: number) {
    const addNodeButton = programBlockEditorWrapper.find(AriaDisablingButton).filter('.AddNode__expanded-button');
    return addNodeButton.at(index);
}

function getExpandAddNodeToggleSwitch(programBlockEditorWrapper) {
    const toggleSwitch = programBlockEditorWrapper.find(ToggleSwitch).filter('.ProgramBlockEditor__add-node-toggle-switch');
    return toggleSwitch.at(0);
}

function getProgramSequenceContainer(programBlockEditorWrapper) {
    return programBlockEditorWrapper.find('.ProgramBlockEditor__program-sequence-scroll-container').get(0);
}

function getCharacterColumnCharacterContainer(programBlockEditorWrapper) {
    return programBlockEditorWrapper.find('.ProgramBlockEditor__character-column-character-container').get(0);
}

function getCharacterColumnCharacter(programBlockEditorWrapper) {
    return programBlockEditorWrapper.find('.ProgramBlockEditor__character-column-character').get(0);
}

function getCharacterPositionButton(programBlockEditorWrapper, directionName) {
    return programBlockEditorWrapper.find('.ProgramBlockEditor__character-position-button').filter({value: directionName}).at(0);
}

function getCharacterPositionCoordinateBoxes(programBlockEditorWrapper) {
    return programBlockEditorWrapper.find('.ProgramBlock__character-position-coordinate-box');
}

describe('Program rendering', () => {
    test('Blocks should be rendered for the test program', () => {
        expect.assertions(5);
        const { wrapper } = createMountProgramBlockEditor();
        expect(getProgramBlocks(wrapper).length).toBe(4);
        expect(getProgramBlocks(wrapper).at(0).prop('data-command')).toBe('forward1');
        expect(getProgramBlocks(wrapper).at(1).prop('data-command')).toBe('left45');
        expect(getProgramBlocks(wrapper).at(2).prop('data-command')).toBe('forward1');
        expect(getProgramBlocks(wrapper).at(3).prop('data-command')).toBe('left45');
    });
});

test('When a step is clicked, action panel should render next to the step', () => {
    expect.assertions(12);
    for (let stepNum = 0; stepNum < 4; stepNum++) {
        const { wrapper, mockChangeActionPanelStepIndex } = createMountProgramBlockEditor();
        const programBlock = getProgramBlockAtPosition(wrapper, stepNum);
        programBlock.simulate('click');
        expect(mockChangeActionPanelStepIndex.mock.calls.length).toBe(1);
        const actionPanelStepIndex = mockChangeActionPanelStepIndex.mock.calls[0][0];
        expect(actionPanelStepIndex).toBe(stepNum);
        wrapper.setProps({actionPanelStepIndex});
        const actionPanelContainer = getProgramBlockWithActionPanel(wrapper).at(stepNum).childAt(1);
        // $FlowFixMe: The flow-typed definitions for enzyme introduce a type-checking error here.
        expect(actionPanelContainer.contains(ActionPanel)).toBe(true);
    }
});

describe('The expand add node toggle switch should be configurable via properties', () => {
    describe('Given that addNodeExpandedMode is false', () => {
        test('Then the toggle switch should be off, and the change handler should be wired up', () => {
            const { wrapper, mockChangeAddNodeExpandedModeHandler } = createMountProgramBlockEditor({
                addNodeExpandedMode: false
            });
            const toggleSwitch = getExpandAddNodeToggleSwitch(wrapper);
            expect(toggleSwitch.props().value).toBe(false);
            expect(toggleSwitch.props().onChange).toBe(mockChangeAddNodeExpandedModeHandler);

            toggleSwitch.simulate('click');
            expect(mockChangeAddNodeExpandedModeHandler.mock.calls.length).toBe(1);
            expect(mockChangeAddNodeExpandedModeHandler.mock.calls[0][0]).toBe(true);
        });
    });
    describe('Given that addNodeExpandedMode is true', () => {
        test('Then the toggle switch should be on, and the change handler should be wired up', () => {
            const { wrapper, mockChangeAddNodeExpandedModeHandler } = createMountProgramBlockEditor({
                addNodeExpandedMode: true
            });
            const toggleSwitch = getExpandAddNodeToggleSwitch(wrapper);
            expect(toggleSwitch.props().value).toBe(true);
            expect(toggleSwitch.props().onChange).toBe(mockChangeAddNodeExpandedModeHandler);

            toggleSwitch.simulate('click');
            expect(mockChangeAddNodeExpandedModeHandler.mock.calls.length).toBe(1);
            expect(mockChangeAddNodeExpandedModeHandler.mock.calls[0][0]).toBe(false);
        });
    });
});


describe("Add nodes", () => {
    test("All aria labels for add buttons should be correct when no action is selected.", () => {
        expect.assertions(3);

        const { wrapper } = createMountProgramBlockEditor({
            programSequence: new ProgramSequence(['forward1', 'right45'], 0),
            addNodeExpandedMode: true
        });

        const leadingAddButton  = getAddNodeButtonAtPosition(wrapper, 0);
        const middleAddButton   = getAddNodeButtonAtPosition(wrapper, 1);
        const trailingAddButton = getAddNodeButtonAtPosition(wrapper, 2);

        [leadingAddButton, middleAddButton, trailingAddButton].forEach((button)=> {
            const ariaLabel = button.getDOMNode().getAttribute('aria-label');
            expect(ariaLabel).toBe("Make sure an action is selected");
        });
    });

    test("All aria labels for add buttons should be correct when an action is selected.", () => {
        expect.assertions(3);

        const { wrapper } = createMountProgramBlockEditor({
            programSequence: new ProgramSequence(['forward1', 'right45'], 0),
            selectedAction: 'left45',
            addNodeExpandedMode: true
        });

        const leadingAddButton  = getAddNodeButtonAtPosition(wrapper, 0);
        const middleAddButton   = getAddNodeButtonAtPosition(wrapper, 1);
        const trailingAddButton = getAddNodeButtonAtPosition(wrapper, 2);

        // Add to the begining when an action is selected
        const addAtBeginningLabel = leadingAddButton.getDOMNode().getAttribute('aria-label');
        expect(addAtBeginningLabel).toBe("Add selected action turn left 45 degrees to the beginning of the program");

        // Add in the middle when an action is selected
        const addAtMiddleLabel = middleAddButton.getDOMNode().getAttribute('aria-label');
        expect(addAtMiddleLabel).toBe("Add selected action turn left 45 degrees between position 1, forward 1 square and position 2, turn right 45 degrees");

        // Add to the end when an action is selected
        const addAtEndLabel = trailingAddButton.getDOMNode().getAttribute('aria-label');
        expect(addAtEndLabel).toBe("Add selected action turn left 45 degrees to the end of the program");
    });

    test("The aria label for the add button should be correct when there are no program blocks and an action is selected.", () => {
        expect.assertions(1);

        const { wrapper } = createMountProgramBlockEditor({
            programSequence: new ProgramSequence([], 0),
            selectedAction: 'left45'
        });

        const soleAddButton  = getAddNodeButtonAtPosition(wrapper, 0);

        // Add to the end when an action is selected
        const addButtonLabel = soleAddButton.getDOMNode().getAttribute('aria-label');
        expect(addButtonLabel).toBe("Add selected action turn left 45 degrees to the end of the program");
    });


    test("The aria label for the add button should be correct when there are no program blocks and no action is selected.", () => {
        expect.assertions(1);

        const { wrapper } = createMountProgramBlockEditor({
            programSequence: new ProgramSequence([], 0)
        });

        const soleAddButton  = getAddNodeButtonAtPosition(wrapper, 0);

        // Add to the end when an action is selected
        const addButtonLabel = soleAddButton.getDOMNode().getAttribute('aria-label');
        expect(addButtonLabel).toBe("Make sure an action is selected");
    });
});

describe('Delete All button', () => {
    test('When the Delete All button is clicked, then the dialog shoud be shown', () => {
        expect.assertions(4);

        const { wrapper, audioManagerMock } = createShallowProgramBlockEditor();

        // Initially, check that the modal is not showing
        expect(wrapper.state().showConfirmDeleteAll).toBe(false);
        // When the Delete All button is clicked
        const deleteAllButton = getProgramDeleteAllButton(wrapper).at(0);
        deleteAllButton.simulate('click');
        // Then the 'deleteAll' announcement should be played
        expect(audioManagerMock.playAnnouncement.mock.calls.length).toBe(1);
        expect(audioManagerMock.playAnnouncement.mock.calls[0][0]).toBe('deleteAll');
        // And the dialog should be shown
        expect(wrapper.state().showConfirmDeleteAll).toBe(true);
    });
});

describe("Add program steps", () => {
    test('We should be able to add a step at the end of the program', () => {
        expect.assertions(4);

        // Given a program of 5 forwards and 'left45' as the selected command
        const { wrapper, audioManagerMock, mockChangeProgramSequenceHandler } = createMountProgramBlockEditor({
            programSequence: new ProgramSequence(['forward1', 'forward1', 'forward1', 'forward1', 'forward1'], 0),
            selectedAction: 'left45'
        });

        // When 'left45' is added to the end of the program
        // (The index is zero because the add nodes aren't expanded).
        const addNode = getAddNodeButtonAtPosition(wrapper, 0);
        addNode.simulate('click');

        // Then the 'add' sound should be played
        expect(audioManagerMock.playAnnouncement.mock.calls.length).toBe(1);
        expect(audioManagerMock.playAnnouncement.mock.calls[0][0]).toBe('add');

        // And the program should be changed
        expect(mockChangeProgramSequenceHandler.mock.calls.length).toBe(1);
        expect(mockChangeProgramSequenceHandler.mock.calls[0][0]).toStrictEqual(
            new ProgramSequence(['forward1', 'forward1', 'forward1', 'forward1', 'forward1', 'left45'], 0)
        );
    });

    test('We should be able to add a step at the beginning of the program', () => {
        expect.assertions(4);

        // Given a program of 5 forwards and 'left45' as the selected command
        const { wrapper, audioManagerMock, mockChangeProgramSequenceHandler } = createMountProgramBlockEditor({
            programSequence: new ProgramSequence(['forward1', 'forward1', 'forward1', 'forward1', 'forward1'], 0),
            selectedAction: 'left45',
            addNodeExpandedMode: true
        });

        // When 'left45' is added to the beginning of the program
        // (The index is zero because the add nodes aren't expanded).
        const addNode = getAddNodeButtonAtPosition(wrapper, 0);
        addNode.simulate('click');

        // Then the 'add' announcement should be played
        expect(audioManagerMock.playAnnouncement.mock.calls.length).toBe(1);
        expect(audioManagerMock.playAnnouncement.mock.calls[0][0]).toBe('add');

        // And the program should be changed
        expect(mockChangeProgramSequenceHandler.mock.calls.length).toBe(1);
        expect(mockChangeProgramSequenceHandler.mock.calls[0][0]).toStrictEqual(
            new ProgramSequence(['left45', 'forward1', 'forward1', 'forward1', 'forward1', 'forward1'], 1)
        );
    });

    test('We should be able to add a step in the middle of the program', () => {
        expect.assertions(4);

        // Given a program of 5 forwards and 'left45' as the selected command
        const { wrapper, audioManagerMock, mockChangeProgramSequenceHandler } = createMountProgramBlockEditor({
            programSequence: new ProgramSequence(['forward1', 'forward1', 'forward1', 'forward1', 'forward1'], 0),
            selectedAction: 'left45',
            addNodeExpandedMode: true
        });

        // When 'left45' is added to the middle of the program
        const addNode = getAddNodeButtonAtPosition(wrapper, 3);
        addNode.simulate('click');

        // Then the 'add' announcement should be played
        expect(audioManagerMock.playAnnouncement.mock.calls.length).toBe(1);
        expect(audioManagerMock.playAnnouncement.mock.calls[0][0]).toBe('add');

        // And the program should be changed
        expect(mockChangeProgramSequenceHandler.mock.calls.length).toBe(1);
        expect(mockChangeProgramSequenceHandler.mock.calls[0][0]).toStrictEqual(
            new ProgramSequence(['forward1', 'forward1', 'forward1', "left45", 'forward1', 'forward1'], 0)
        );
    });
});


describe('Delete program steps', () => {
    test.each([
        [ 0, ['left45', 'forward1', 'left45']],
        [ 3, ['forward1', 'left45', 'forward1']]
    ])('While the action panel is open, when block %i is clicked, then program should be updated',
        (stepNum, expectedProgram) => {
            const { wrapper, audioManagerMock, mockChangeProgramSequenceHandler, mockChangeActionPanelStepIndex } = createMountProgramBlockEditor();
            const programBlock = getProgramBlockAtPosition(wrapper, stepNum);
            programBlock.simulate('click');

            // ActionPanel should be rendered on click of a program block
            expect(mockChangeActionPanelStepIndex.mock.calls.length).toBe(1);
            const actionPanelStepIndex = mockChangeActionPanelStepIndex.mock.calls[0][0];
            expect(actionPanelStepIndex).toBe(stepNum);
            wrapper.setProps({actionPanelStepIndex});
            const actionPanelContainer = getProgramBlockWithActionPanel(wrapper).at(stepNum).childAt(1);
            // $FlowFixMe: The flow-typed definitions for enzyme introduce a type-checking error here.
            expect(actionPanelContainer.containsMatchingElement(ActionPanel)).toBe(true);

            const deleteStepButton = getActionPanelActionButtons(wrapper).at(0);
            deleteStepButton.simulate('click');

            // The 'delete' announcement should be played
            expect(audioManagerMock.playAnnouncement.mock.calls.length).toBe(1);
            expect(audioManagerMock.playAnnouncement.mock.calls[0][0]).toBe('delete');

            // The program should be updated
            expect(mockChangeProgramSequenceHandler.mock.calls.length).toBe(1);
            expect(mockChangeProgramSequenceHandler.mock.calls[0][0].program).toStrictEqual(expectedProgram);
        }
    );
});

describe('Replace program steps', () => {
    test.each([
        [ 0, ['right45', 'left45', 'forward1', 'left45'], 'right45'],
        [ 0, ['forward1', 'left45', 'forward1', 'left45'], null]
    ]) ('Replace a program if selectedAction is not null',
        (stepNum, expectedProgram, selectedAction) => {
            expect.assertions(7);
            const { wrapper, audioManagerMock, mockChangeProgramSequenceHandler, mockChangeActionPanelStepIndex } = createMountProgramBlockEditor({
                selectedAction
            });
            const programBlock = getProgramBlockAtPosition(wrapper, stepNum);
            programBlock.simulate('click');

            // ActionPanel should be rendered on click of a program block
            expect(mockChangeActionPanelStepIndex.mock.calls.length).toBe(1);
            const actionPanelStepIndex = mockChangeActionPanelStepIndex.mock.calls[0][0];
            expect(actionPanelStepIndex).toBe(stepNum);
            wrapper.setProps({actionPanelStepIndex});
            const actionPanelContainer = getProgramBlockWithActionPanel(wrapper).at(stepNum).childAt(1);
            // $FlowFixMe: The flow-typed definitions for enzyme introduce a type-checking error here.
            expect(actionPanelContainer.containsMatchingElement(ActionPanel)).toBe(true);

            const replaceButton = getActionPanelActionButtons(wrapper).at(1);
            replaceButton.simulate('click');

            // The 'replace' announcement should be played
            expect(audioManagerMock.playAnnouncement.mock.calls.length).toBe(1);
            expect(audioManagerMock.playAnnouncement.mock.calls[0][0]).toBe('replace');

            // The program should be updated
            if (selectedAction) {
                expect(mockChangeProgramSequenceHandler.mock.calls.length).toBe(1);
                expect(mockChangeProgramSequenceHandler.mock.calls[0][0].program).toStrictEqual(expectedProgram);
            } else {
                expect(mockChangeProgramSequenceHandler.mock.calls.length).toBe(0);
                expect(wrapper.props().programSequence.getProgram()).toStrictEqual(expectedProgram);
            }
        }
    );
});

describe('Move to previous program step', () => {
    test.each([
        [ 0, ['forward1', 'left45', 'forward1', 'left45']],
        [ 2, ['forward1', 'forward1', 'left45', 'left45']]
    ]) ('Changes position with a step before, if there is a step',
        (stepNum, expectedProgram) => {
            const { wrapper, audioManagerMock, mockChangeProgramSequenceHandler, mockChangeActionPanelStepIndex } = createMountProgramBlockEditor();
            const programBlock = getProgramBlockAtPosition(wrapper, stepNum);
            programBlock.simulate('click');

            // ActionPanel should be rendered on click of a program block
            expect(mockChangeActionPanelStepIndex.mock.calls.length).toBe(1);
            const actionPanelStepIndex = mockChangeActionPanelStepIndex.mock.calls[0][0];
            expect(actionPanelStepIndex).toBe(stepNum);
            wrapper.setProps({actionPanelStepIndex});
            const actionPanelContainer = getProgramBlockWithActionPanel(wrapper).at(stepNum).childAt(1);
            // $FlowFixMe: The flow-typed definitions for enzyme introduce a type-checking error here.
            expect(actionPanelContainer.containsMatchingElement(ActionPanel)).toBe(true);

            const moveToPreviousButton = getActionPanelActionButtons(wrapper).at(2);
            moveToPreviousButton.simulate('click');

            if (stepNum > 0) {
                // The 'mockToPrevious' announcement should be played
                expect(audioManagerMock.playAnnouncement.mock.calls.length).toBe(1);
                expect(audioManagerMock.playAnnouncement.mock.calls[0][0]).toBe('moveToPrevious');
                // The program should be updated
                expect(mockChangeProgramSequenceHandler.mock.calls.length).toBe(1);
                expect(mockChangeProgramSequenceHandler.mock.calls[0][0].program).toStrictEqual(expectedProgram);
            } else {
                // No sound should be played
                expect(audioManagerMock.playAnnouncement.mock.calls.length).toBe(0);
                // The program should not be updated
                expect(mockChangeProgramSequenceHandler.mock.calls.length).toBe(0);
                expect(wrapper.props().programSequence.getProgram()).toStrictEqual(expectedProgram);
            }
        }
    )
});

describe('Move to next program step', () => {
    test.each([
        [ 0, ['left45', 'forward1', 'forward1', 'left45']],
        [ 3, ['forward1', 'left45', 'forward1', 'left45']]
    ]) ('Changes position with a step after, if there is a step',
        (stepNum, expectedProgram) => {
            const { wrapper, audioManagerMock, mockChangeProgramSequenceHandler, mockChangeActionPanelStepIndex } = createMountProgramBlockEditor();
            const programBlock = getProgramBlockAtPosition(wrapper, stepNum);
            programBlock.simulate('click');

            // ActionPanel should be rendered on click of a program block
            expect(mockChangeActionPanelStepIndex.mock.calls.length).toBe(1);
            const actionPanelStepIndex = mockChangeActionPanelStepIndex.mock.calls[0][0];
            expect(actionPanelStepIndex).toBe(stepNum);
            wrapper.setProps({actionPanelStepIndex});
            const actionPanelContainer = getProgramBlockWithActionPanel(wrapper).at(stepNum).childAt(1);
            // $FlowFixMe: The flow-typed definitions for enzyme introduce a type-checking error here.
            expect(actionPanelContainer.containsMatchingElement(ActionPanel)).toBe(true);

            const moveToNextButton = getActionPanelActionButtons(wrapper).at(3);
            moveToNextButton.simulate('click');

            if (stepNum < 3) {
                // The 'mockToNext' announcement should be played
                expect(audioManagerMock.playAnnouncement.mock.calls.length).toBe(1);
                expect(audioManagerMock.playAnnouncement.mock.calls[0][0]).toBe('moveToNext');
                // The program should be updated
                expect(mockChangeProgramSequenceHandler.mock.calls.length).toBe(1);
                expect(mockChangeProgramSequenceHandler.mock.calls[0][0].program).toStrictEqual(expectedProgram);
            } else {
                // No announcement should be played
                expect(audioManagerMock.playAnnouncement.mock.calls.length).toBe(0);
                // The program should not be updated
                expect(mockChangeProgramSequenceHandler.mock.calls.length).toBe(0);
                expect(wrapper.props().programSequence.getProgram()).toStrictEqual(expectedProgram);
            }
        }
    )
});

describe('Delete All button can be disabled', () => {
    describe('Given editing is enabled', () => {
        test('Then the buttons should not be disabled', () => {
            expect.assertions(1);
            const { wrapper } = createMountProgramBlockEditor({
                editingDisabled: false
            });
            expect(getProgramDeleteAllButton(wrapper).get(0).props.disabled).toBe(false);
        });
    });

    describe('Given editing is disabled', () => {
        test('Then the buttons should be disabled', () => {
            expect.assertions(1);
            const { wrapper } = createMountProgramBlockEditor({
                editingDisabled: true
            });
            expect(getProgramDeleteAllButton(wrapper).get(0).props.disabled).toBe(true);
        });
    });
});

describe('Autoscroll to show a step after the active program step', () => {
    test('When active program step number is 0, scroll to the beginning of the container', () => {
        expect.assertions(3);
        const mockScrollTo = jest.fn();
        const { wrapper } = createMountProgramBlockEditor({runningState: 'running'});
        getProgramSequenceContainer(wrapper).ref.current.scrollTo = mockScrollTo;

        wrapper.setProps({
            programSequence: new ProgramSequence(['forward1', 'left45', 'forward1', 'left45'], 0)
        });

        expect(mockScrollTo.mock.calls.length).toBe(1);
        // mock.calls[0][0] for x position, [0][1] for y position
        expect(mockScrollTo.mock.calls[0][0]).toBe(0);
        expect(mockScrollTo.mock.calls[0][1]).toBe(0);
    });
    test('When a step after active program block is outside of the container, on the right', () => {
        expect.assertions(1);

        const { wrapper } = createMountProgramBlockEditor({runningState: 'running'});

        // Set the container ref object to a custom object with just enough
        // of the DOM API implemented to support the scroll logic
        const programSequenceContainer = getProgramSequenceContainer(wrapper);
        programSequenceContainer.ref.current = {
            getBoundingClientRect: () => {
                return {
                    left : 100
                };
            },
            clientWidth: 1000,
            scrollLeft: 200
        };

        // Set the location of the next block
        const nextProgramStep = getProgramBlockAtPosition(wrapper, 3);
        // $FlowFixMe: Flow complains that getBoundingClientRect is not writable
        nextProgramStep.getDOMNode().getBoundingClientRect = () => {
            return {
                left: 2000,
                right: 2300
            };
        };

        // Trigger a scroll
        wrapper.setProps({
            runningState: 'running',
            programSequence: new ProgramSequence(['forward1', 'left45', 'forward1', 'left45'], 2)
        });

        expect(programSequenceContainer.ref.current.scrollLeft).toBe(200 + 2300 - 100 - 1000);
    });
    test('When a step after active program block is outside of the container, on the left', () => {
        expect.assertions(1);

        const { wrapper } = createMountProgramBlockEditor({runningState: 'running'});

        // Set the container ref object to a custom object with just enough
        // of the DOM API implemented to support the scroll logic
        const programSequenceContainer = getProgramSequenceContainer(wrapper);
        programSequenceContainer.ref.current = {
            getBoundingClientRect: () => {
                return {
                    left : 100
                };
            },
            clientWidth: 1000,
            scrollLeft: 2000
        };

        // Set the location of the next block
        const nextProgramStep = getProgramBlockAtPosition(wrapper, 3);
        // $FlowFixMe: Flow complains that getBoundingClientRect is not writable
        nextProgramStep.getDOMNode().getBoundingClientRect = () => {
            return {
                left: -200,
                right: -100
            };
        };

        // Trigger a scroll
        wrapper.setProps({
            runningState: 'running',
            programSequence: new ProgramSequence(['forward1', 'left45', 'forward1', 'left45'], 2)
        });

        expect(programSequenceContainer.ref.current.scrollLeft).toBe(2000 - 100 - 200);
    });
    test('When active program block is the last program block, autoscroll to the last add node', () => {
        expect.assertions(1);

        const { wrapper } = createMountProgramBlockEditor();

        // Set the container ref object to a custom object with just enough
        // of the DOM API implemented to support the scroll logic
        const programSequenceContainer = getProgramSequenceContainer(wrapper);
        programSequenceContainer.ref.current = {
            getBoundingClientRect: () => {
                return {
                    left : 100
                };
            },
            clientWidth: 1000,
            scrollLeft: 2000
        };

        // Set the last add node location
        const lastAddNode = getAddNodeButtonAtPosition(wrapper, 0);
        // $FlowFixMe: Flow complains that getBoundingClientRect is not writable
        lastAddNode.getDOMNode().getBoundingClientRect = () => {
            return {
                left: -200,
                right: -100
            };
        };

        // Trigger a scroll
        wrapper.setProps({
            runningState: 'running',
            programSequence: new ProgramSequence(['forward1', 'left45', 'forward1', 'left45'], 3)
        });

        expect(programSequenceContainer.ref.current.scrollLeft).toBe(2000 - 100 - 200);
    })
});

test('The editor scrolls when a step is added to the end of the program', () => {
    expect.assertions(8);

    const mockScrollIntoView = jest.fn();

    window.HTMLElement.prototype.scrollIntoView = mockScrollIntoView;

    // Given a program of 5 forwards and 'left45' as the selected command
    const { wrapper, audioManagerMock, mockChangeProgramSequenceHandler } = createMountProgramBlockEditor({
        programSequence: new ProgramSequence(['forward1', 'forward1', 'forward1', 'forward1', 'forward1'], 0),
        selectedAction: 'left45'
    });

    // When 'forward1' is added to the end of the program
    // (The index is zero because the add nodes aren't expanded).
    const addNode = getAddNodeButtonAtPosition(wrapper, 0);
    addNode.simulate('click');

    // Then the 'add' announcement should be played
    expect(audioManagerMock.playAnnouncement.mock.calls.length).toBe(1);
    expect(audioManagerMock.playAnnouncement.mock.calls[0][0]).toBe('add');

    // And the program should be changed
    expect(mockChangeProgramSequenceHandler.mock.calls.length).toBe(1);
    expect(mockChangeProgramSequenceHandler.mock.calls[0][0]).toStrictEqual(
        new ProgramSequence(['forward1', 'forward1', 'forward1', 'forward1', 'forward1', 'left45'], 0)
    );

    // And updating the program triggers auto scroll
    wrapper.setProps({ programSequence: mockChangeProgramSequenceHandler.mock.calls[0][0] });
    expect(mockScrollIntoView.mock.calls.length).toBe(1);
    expect(mockScrollIntoView.mock.calls[0][0]).toStrictEqual({
        behavior: 'auto',
        block: 'nearest',
        inline: 'nearest'
    });
    expect(mockScrollIntoView.mock.instances.length).toBe(1);

    // (The index used to get the add note button position is zero because the add nodes aren't expanded).
    expect(mockScrollIntoView.mock.instances[0]).toBe(getAddNodeButtonAtPosition(wrapper, 0).getDOMNode());
});

describe('World-appropriate character icon should be rendered on the character column', () => {
    test('default', () => {
        expect.assertions(2);
        const { wrapper } = createMountProgramBlockEditor();
        expect(getCharacterColumnCharacterContainer(wrapper).props['aria-label']).toBe('Robot character');
        expect(getCharacterColumnCharacter(wrapper).type.render().props.children).toBe('Robot.svg');
    });
    test('forest', () => {
        expect.assertions(2);
        const { wrapper } = createMountProgramBlockEditor({world: 'forest'});
        expect(getCharacterColumnCharacterContainer(wrapper).props['aria-label']).toBe('Rabbit character');
        expect(getCharacterColumnCharacter(wrapper).type.render().props.children).toBe('Rabbit.svg');
    });
    test('space', () => {
        expect.assertions(2);
        const { wrapper } = createMountProgramBlockEditor({world: 'space'});
        expect(getCharacterColumnCharacterContainer(wrapper).props['aria-label']).toBe('Space Ship character');
        expect(getCharacterColumnCharacter(wrapper).type.render().props.children).toBe('SpaceShip.svg');
    });
});

describe('When runningState property is paused and programCounter is 0', () => {
    test('className of step 0 should have --paused', () => {
        expect.assertions(1);
        const { wrapper } = createMountProgramBlockEditor({ runningState: 'paused' });
        const currentStep = getProgramBlockAtPosition(wrapper, 0);

        expect(currentStep.get(0).props.className.includes('ProgramBlockEditor__program-block--paused')).toBe(true);
    });
});

describe('When runningState property is pauseRequested and programCounter is 0', () => {
    test('className of step 1 should have --paused', () => {
        expect.assertions(1);
        const { wrapper } = createMountProgramBlockEditor({ runningState: 'pauseRequested' });
        const pausedStep = getProgramBlockAtPosition(wrapper, 1);

        expect(pausedStep.get(0).props.className.includes('ProgramBlockEditor__program-block--paused')).toBe(true);
    });
});

describe('When runningState is running, stopRequested, or pauseRequested, and programCounter is 0', () => {
    test('className of step 0 should have --active', () => {
        expect.assertions(5);
        const { wrapper } = createMountProgramBlockEditor({ runningState: 'running' });
        let currentStep = getProgramBlockAtPosition(wrapper, 0);

        expect(currentStep.get(0).props.className.includes('ProgramBlockEditor__program-block--active')).toBe(true);

        wrapper.setProps({ runningState: 'stopRequested' });
        currentStep = getProgramBlockAtPosition(wrapper, 0);
        expect(currentStep.get(0).props.className.includes('ProgramBlockEditor__program-block--active')).toBe(true);

        wrapper.setProps({ runningState: 'pauseRequested'});
        currentStep = getProgramBlockAtPosition(wrapper, 0);
        expect(currentStep.get(0).props.className.includes('ProgramBlockEditor__program-block--active')).toBe(true);

        wrapper.setProps({ runningState: 'paused'});
        currentStep = getProgramBlockAtPosition(wrapper, 0);
        expect(currentStep.get(0).props.className.includes('ProgramBlockEditor__program-block--active')).toBe(false);

        wrapper.setProps({ runningState: 'stopped'});
        currentStep = getProgramBlockAtPosition(wrapper, 0);
        expect(currentStep.get(0).props.className.includes('ProgramBlockEditor__program-block--active')).toBe(false);
    });
});

describe('Using change character position buttons', () => {
    test.each([
        'turnLeft', 'turnRight', 'up', 'right', 'down', 'left'
    ])('Click/Press %s button ', (directionName) => {
        expect.assertions(4);
        const { wrapper, mockChangeCharacterPosition } = createMountProgramBlockEditor();
        const characterPositionButton = getCharacterPositionButton(wrapper, directionName);

        characterPositionButton.simulate('click');
        expect(mockChangeCharacterPosition.mock.calls.length).toBe(1);
        expect(mockChangeCharacterPosition.mock.calls[0][0]).toBe(directionName);

        characterPositionButton.simulate('keydown', { key: ' ' });
        expect(mockChangeCharacterPosition.mock.calls.length).toBe(2);
        expect(mockChangeCharacterPosition.mock.calls[1][0]).toBe(directionName);
    });
    test.each([
        'turnLeft', 'turnRight', 'up', 'right', 'down', 'left'
    ])('Click/Press %s button when editingDisabled Prop is true', (directionName) => {
        expect.assertions(3);
        const { wrapper, mockChangeCharacterPosition } = createMountProgramBlockEditor({editingDisabled: true});
        const characterPositionButton = getCharacterPositionButton(wrapper, directionName);
        expect(characterPositionButton.get(0).props.className.includes('--disabled')).toBe(true);

        characterPositionButton.simulate('click');
        expect(mockChangeCharacterPosition.mock.calls.length).toBe(0);
        characterPositionButton.simulate('keydown', { key: ' ' });
        expect(mockChangeCharacterPosition.mock.calls.length).toBe(0);
    });
});

describe('Using change character position by column/row labels', () => {
    test('Changing x position', () => {
        expect.assertions(6);
        const { wrapper, mockChangeCharacterXPosition } = createShallowProgramBlockEditor();
        const characterXPositionCoordinateBox = getCharacterPositionCoordinateBoxes(wrapper).at(0);
        const sampleXPosition = 'X';
        const secondSampleXPosition = 'A';
        const eventObject = (value) => (
            {
                key: 'Enter',
                preventDefault: () =>  {},
                currentTarget:
                    { name: 'xPosition', value }
            }
        );

        characterXPositionCoordinateBox.simulate('change', eventObject(sampleXPosition));
        wrapper.update();
        expect(wrapper.instance().state.characterColumnLabel).toBe(sampleXPosition);

        characterXPositionCoordinateBox.simulate('blur', eventObject());
        expect(mockChangeCharacterXPosition.mock.calls.length).toBe(1);
        expect(mockChangeCharacterXPosition.mock.calls[0][0]).toBe(sampleXPosition);

        characterXPositionCoordinateBox.simulate('change', eventObject(secondSampleXPosition));
        wrapper.update();
        expect(wrapper.instance().state.characterColumnLabel).toBe(secondSampleXPosition);

        characterXPositionCoordinateBox.simulate('keyDown', eventObject());
        expect(mockChangeCharacterXPosition.mock.calls.length).toBe(2);
        expect(mockChangeCharacterXPosition.mock.calls[1][0]).toBe(secondSampleXPosition);
    });
    test('Changing y position', () => {
        expect.assertions(6);
        const { wrapper, mockChangeCharacterYPosition } = createShallowProgramBlockEditor();
        const characterYPositionCoordinateBox = getCharacterPositionCoordinateBoxes(wrapper).at(1);
        const sampleYPosition = '2';
        const secondSampleYPosition = '8';
        const eventObject = (value) => (
            {
                key: 'Enter',
                preventDefault: () =>  {},
                currentTarget:
                    { name: 'yPosition', value }
            }
        );

        characterYPositionCoordinateBox.simulate('change', eventObject(sampleYPosition));
        wrapper.update();
        expect(wrapper.instance().state.characterRowLabel).toBe(sampleYPosition);

        characterYPositionCoordinateBox.simulate('blur', eventObject());
        expect(mockChangeCharacterYPosition.mock.calls.length).toBe(1);
        expect(mockChangeCharacterYPosition.mock.calls[0][0]).toBe(sampleYPosition);

        characterYPositionCoordinateBox.simulate('change', eventObject(secondSampleYPosition));
        wrapper.update();
        expect(wrapper.instance().state.characterRowLabel).toBe(secondSampleYPosition);

        characterYPositionCoordinateBox.simulate('keyDown', eventObject());
        expect(mockChangeCharacterYPosition.mock.calls.length).toBe(2);
        expect(mockChangeCharacterYPosition.mock.calls[1][0]).toBe(secondSampleYPosition);
    });
    test('When editingDisabled prop is true, onChange handler is undefined', () => {
        expect.assertions(4)
        const { wrapper } = createMountProgramBlockEditor({editingDisabled: true});
        const characterXPositionCoordinateBox = getCharacterPositionCoordinateBoxes(wrapper).get(0);
        const characterYPositionCoordinateBox = getCharacterPositionCoordinateBoxes(wrapper).get(1);
        expect(characterXPositionCoordinateBox.props.className.includes('--disabled')).toBe(true);
        expect(characterYPositionCoordinateBox.props.className.includes('--disabled')).toBe(true);
        expect(characterXPositionCoordinateBox.props.onChange).toBe(undefined);
        expect(characterYPositionCoordinateBox.props.onChange).toBe(undefined);
    });
});

describe('Character in the character column updates', () => {
    test('When direction value of charaterState prop changes', () => {
        expect.assertions(2);
        const sceneDimensions = new SceneDimensions(2, 2);
        const { wrapper } = createMountProgramBlockEditor({characterState: new CharacterState(1, 1, 5, [], sceneDimensions)});

        expect(getCharacterColumnCharacter(wrapper).props.transform).toStrictEqual('rotate(135 0 0)');
        wrapper.setProps({ characterState: new CharacterState(1, 1, 2, [], sceneDimensions)});
        expect(getCharacterColumnCharacter(wrapper).props.transform).toStrictEqual('rotate(0 0 0)');
    });
});
