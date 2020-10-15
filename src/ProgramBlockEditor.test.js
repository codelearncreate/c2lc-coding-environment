// @flow

import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, mount, shallow } from 'enzyme';
import { Button } from 'react-bootstrap';
import { createIntl, IntlProvider } from 'react-intl';
import AudioManager from './AudioManager';
import ActionPanel from './ActionPanel';
import AriaDisablingButton from './AriaDisablingButton';
import FocusTrapManager from './FocusTrapManager';
import messages from './messages.json';
import ProgramBlockEditor from './ProgramBlockEditor';
import ToggleSwitch from './ToggleSwitch';

// Mocks
jest.mock('./AudioManager');

configure({ adapter: new Adapter()});

// TODO: Mock the FocusTrapManager

const defaultProgramBlockEditorProps = {
    program: [
        {commandName:'forward', commandParameters: {distance: 100}},
        {commandName:'left', commandParameters: {angle: 90}},
        {commandName:'forward', commandParameters: {distance: 100}},
        {commandName:'left', commandParameters: {angle: 90}}],
    interpreterIsRunning: false,
    activeProgramStepNum: null,
    actionPanelStepIndex: null,
    selectedAction: null,
    editingDisabled: false,
    replaceIsActive: false,
    isDraggingCommand: false,
    focusTrapManager: new FocusTrapManager(),
    addNodeExpandedMode: false,
    sceneGridCellWidth: 100
};

function createShallowProgramBlockEditor(props) {
    const intl = createIntl({
        locale: 'en',
        defaultLocale: 'en',
        messages: messages.en
    });

    // $FlowFixMe: Flow doesn't know about the Jest mock API
    AudioManager.mockClear();
    const audioManagerInstance = new AudioManager(true);
    // $FlowFixMe: Flow doesn't know about the Jest mock API
    const audioManagerMock: any = AudioManager.mock.instances[0];

    const mockChangeProgramHandler = jest.fn();

    const mockChangeAddNodeExpandedModeHandler = jest.fn();

    const wrapper: $FlowIgnoreType = shallow(
        React.createElement(
            ProgramBlockEditor.WrappedComponent,
            Object.assign(
                {},
                defaultProgramBlockEditorProps,
                {
                    intl: intl,
                    audioManager: audioManagerInstance,
                    onChangeProgram: mockChangeProgramHandler,
                    onChangeAddNodeExpandedMode: mockChangeAddNodeExpandedModeHandler
                },
                props
            )
        )
    );

    return {
        wrapper,
        audioManagerMock,
        mockChangeProgramHandler,
        mockChangeAddNodeExpandedModeHandler
    };
}

function createMountProgramBlockEditor(props) {
    // $FlowFixMe: Flow doesn't know about the Jest mock API
    AudioManager.mockClear();
    const audioManagerInstance = new AudioManager(true);
    // $FlowFixMe: Flow doesn't know about the Jest mock API
    const audioManagerMock = AudioManager.mock.instances[0];

    const mockChangeProgramHandler = jest.fn();
    const mockChangeActionPanelStepIndex = jest.fn();
    const mockChangeAddNodeExpandedModeHandler = jest.fn();

    const wrapper = mount(
        React.createElement(
            ProgramBlockEditor,
            Object.assign(
                {},
                defaultProgramBlockEditorProps,
                {
                    audioManager: audioManagerInstance,
                    onChangeProgram: mockChangeProgramHandler,
                    onChangeActionPanelStepIndex: mockChangeActionPanelStepIndex,
                    onChangeAddNodeExpandedMode: mockChangeAddNodeExpandedModeHandler
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
        mockChangeProgramHandler,
        mockChangeActionPanelStepIndex,
        mockChangeAddNodeExpandedModeHandler
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

describe('Program rendering', () => {
    test('Blocks should be rendered for the test program', () => {
        expect.assertions(5);
        const { wrapper } = createMountProgramBlockEditor();
        expect(getProgramBlocks(wrapper).length).toBe(4);
        expect(getProgramBlocks(wrapper).at(0).prop('data-command')).toBe('forward');
        expect(getProgramBlocks(wrapper).at(1).prop('data-command')).toBe('left');
        expect(getProgramBlocks(wrapper).at(2).prop('data-command')).toBe('forward');
        expect(getProgramBlocks(wrapper).at(3).prop('data-command')).toBe('left');
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
            program: [
                {commandName:'forward', commandParameters: {distance: 100}},
                {commandName:'right', commandParameters: {angle: 90}}
            ],
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
            program: [
                {commandName:'forward', commandParameters: {distance: 100}},
                {commandName:'right', commandParameters: {angle: 90}}
            ],
            selectedAction: 'left',
            addNodeExpandedMode: true
        });

        const leadingAddButton  = getAddNodeButtonAtPosition(wrapper, 0);
        const middleAddButton   = getAddNodeButtonAtPosition(wrapper, 1);
        const trailingAddButton = getAddNodeButtonAtPosition(wrapper, 2);

        // Add to the begining when an action is selected
        const addAtBeginningLabel = leadingAddButton.getDOMNode().getAttribute('aria-label');
        expect(addAtBeginningLabel).toBe("Add selected action left to the beginning of the program");

        // Add in the middle when an action is selected
        const addAtMiddleLabel = middleAddButton.getDOMNode().getAttribute('aria-label');
        expect(addAtMiddleLabel).toBe("Add selected action left between position 1, forward and position 2, right");

        // Add to the end when an action is selected
        const addAtEndLabel = trailingAddButton.getDOMNode().getAttribute('aria-label');
        expect(addAtEndLabel).toBe("Add selected action left to the end of the program");
    });

    test("The aria label for the add button should be correct when there are no program blocks and an action is selected.", () => {
        expect.assertions(1);

        const { wrapper } = createMountProgramBlockEditor({
            program: [],
            selectedAction: 'left'
        });

        const soleAddButton  = getAddNodeButtonAtPosition(wrapper, 0);

        // Add to the end when an action is selected
        const addButtonLabel = soleAddButton.getDOMNode().getAttribute('aria-label');
        expect(addButtonLabel).toBe("Add selected action left to the end of the program");
    });


    test("The aria label for the add button should be correct when there are no program blocks and no action is selected.", () => {
        expect.assertions(1);

        const { wrapper } = createMountProgramBlockEditor({
            program: []
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
        // Then the 'deleteAll' sound should be played
        expect(audioManagerMock.playSound.mock.calls.length).toBe(1);
        expect(audioManagerMock.playSound.mock.calls[0][0]).toBe('deleteAll');
        // And the dialog should be shown
        expect(wrapper.state().showConfirmDeleteAll).toBe(true);
    });
});

describe("Add program steps", () => {
    test('We should be able to add a step at the end of the program', () => {
        expect.assertions(4);

        // Given a program of 5 forwards and 'left' as the selected command
        const { wrapper, audioManagerMock, mockChangeProgramHandler } = createMountProgramBlockEditor({
            program: [
                {commandName:'forward', commandParameters: {distance: 100}},
                {commandName:'forward', commandParameters: {distance: 100}},
                {commandName:'forward', commandParameters: {distance: 100}},
                {commandName:'forward', commandParameters: {distance: 100}},
                {commandName:'forward', commandParameters: {distance: 100}}
            ],
            selectedAction: 'left'
        });

        // When 'left' is added to the end of the program
        // (The index is zero because the add nodes aren't expanded).
        const addNode = getAddNodeButtonAtPosition(wrapper, 0);
        addNode.simulate('click');

        // Then the 'add' sound should be played
        expect(audioManagerMock.playSound.mock.calls.length).toBe(1);
        expect(audioManagerMock.playSound.mock.calls[0][0]).toBe('add');

        // And the program should be changed
        expect(mockChangeProgramHandler.mock.calls.length).toBe(1);
        expect(mockChangeProgramHandler.mock.calls[0][0]).toStrictEqual(
            [
                {commandName:'forward', commandParameters: {distance: 100}},
                {commandName:'forward', commandParameters: {distance: 100}},
                {commandName:'forward', commandParameters: {distance: 100}},
                {commandName:'forward', commandParameters: {distance: 100}},
                {commandName:'forward', commandParameters: {distance: 100}},
                {commandName:'left', commandParameters: {angle: 90}}
            ]);
    });

    test('We should be able to add a step at the beginning of the program', () => {
        expect.assertions(4);

        // Given a program of 5 forwards and 'left' as the selected command
        const { wrapper, audioManagerMock, mockChangeProgramHandler } = createMountProgramBlockEditor({
            program: [
                {commandName:'forward', commandParameters: {distance: 100}},
                {commandName:'forward', commandParameters: {distance: 100}},
                {commandName:'forward', commandParameters: {distance: 100}},
                {commandName:'forward', commandParameters: {distance: 100}},
                {commandName:'forward', commandParameters: {distance: 100}}
            ],
            selectedAction: 'left',
            addNodeExpandedMode: true
        });

        // When 'left' is added to the beginning of the program
        // (The index is zero because the add nodes aren't expanded).
        const addNode = getAddNodeButtonAtPosition(wrapper, 0);
        addNode.simulate('click');

        // Then the 'add' sound should be played
        expect(audioManagerMock.playSound.mock.calls.length).toBe(1);
        expect(audioManagerMock.playSound.mock.calls[0][0]).toBe('add');

        // And the program should be changed
        expect(mockChangeProgramHandler.mock.calls.length).toBe(1);
        expect(mockChangeProgramHandler.mock.calls[0][0]).toStrictEqual(
            [
                {commandName:'left', commandParameters: {angle: 90}},
                {commandName:'forward', commandParameters: {distance: 100}},
                {commandName:'forward', commandParameters: {distance: 100}},
                {commandName:'forward', commandParameters: {distance: 100}},
                {commandName:'forward', commandParameters: {distance: 100}},
                {commandName:'forward', commandParameters: {distance: 100}}
            ]);
    });

    test('We should be able to add a step in the middle of the program', () => {
        expect.assertions(4);

        // Given a program of 5 forwards and 'left' as the selected command
        const { wrapper, audioManagerMock, mockChangeProgramHandler } = createMountProgramBlockEditor({
            program: [
                {commandName:'forward', commandParameters: {distance: 100}},
                {commandName:'forward', commandParameters: {distance: 100}},
                {commandName:'forward', commandParameters: {distance: 100}},
                {commandName:'forward', commandParameters: {distance: 100}},
                {commandName:'forward', commandParameters: {distance: 100}}
            ],
            selectedAction: 'left',
            addNodeExpandedMode: true
        });

        // When 'left' is added to the middle of the program
        const addNode = getAddNodeButtonAtPosition(wrapper, 3);
        addNode.simulate('click');

        // Then the 'add' sound should be played
        expect(audioManagerMock.playSound.mock.calls.length).toBe(1);
        expect(audioManagerMock.playSound.mock.calls[0][0]).toBe('add');

        // And the program should be changed
        expect(mockChangeProgramHandler.mock.calls.length).toBe(1);
        expect(mockChangeProgramHandler.mock.calls[0][0]).toStrictEqual(
            [
                {commandName:'forward', commandParameters: {distance: 100}},
                {commandName:'forward', commandParameters: {distance: 100}},
                {commandName:'forward', commandParameters: {distance: 100}},
                {commandName:'left', commandParameters: {angle: 90}},
                {commandName:'forward', commandParameters: {distance: 100}},
                {commandName:'forward', commandParameters: {distance: 100}}
            ]);
    });
});


describe('Delete program steps', () => {
    test.each([
        [ 0, [
            {commandName:'left', commandParameters: {angle: 90}},
            {commandName:'forward', commandParameters: {distance: 100}},
            {commandName:'left', commandParameters: {angle: 90}}
        ]],
        [ 3, [
            {commandName:'forward', commandParameters: {distance: 100}},
            {commandName:'left', commandParameters: {angle: 90}},
            {commandName:'forward', commandParameters: {distance: 100}}
        ]]
    ])('While the action panel is open, when block %i is clicked, then program should be updated',
        (stepNum, expectedProgram) => {
            const { wrapper, audioManagerMock, mockChangeProgramHandler, mockChangeActionPanelStepIndex } = createMountProgramBlockEditor();
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

            // The 'delete' sound should be played
            expect(audioManagerMock.playSound.mock.calls.length).toBe(1);
            expect(audioManagerMock.playSound.mock.calls[0][0]).toBe('delete');

            // The program should be updated
            expect(mockChangeProgramHandler.mock.calls.length).toBe(1);
            expect(mockChangeProgramHandler.mock.calls[0][0]).toStrictEqual(expectedProgram);
        }
    );
});

describe('Replace program steps', () => {
    test.each([
        [ 0, [
            {commandName:'right', commandParameters: {angle: 90}},
            {commandName:'left', commandParameters: {angle: 90}},
            {commandName:'forward', commandParameters: {distance: 100}},
            {commandName:'left', commandParameters: {angle: 90}}],
        'right'],
        [ 0, [
            {commandName:'forward', commandParameters: {distance: 100}},
            {commandName:'left', commandParameters: {angle: 90}},
            {commandName:'forward', commandParameters: {distance: 100}},
            {commandName:'left', commandParameters: {angle: 90}}],
        null]
    ]) ('Replace a program if selectedAction is not null',
        (stepNum, expectedProgram, selectedAction) => {
            expect.assertions(7);
            const { wrapper, audioManagerMock, mockChangeProgramHandler, mockChangeActionPanelStepIndex } = createMountProgramBlockEditor({
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

            // The 'replace' sound should be played
            expect(audioManagerMock.playSound.mock.calls.length).toBe(1);
            expect(audioManagerMock.playSound.mock.calls[0][0]).toBe('replace');

            // The program should be updated
            if (selectedAction) {
                expect(mockChangeProgramHandler.mock.calls.length).toBe(1);
                expect(mockChangeProgramHandler.mock.calls[0][0]).toStrictEqual(expectedProgram);
            } else {
                expect(mockChangeProgramHandler.mock.calls.length).toBe(0);
                expect(wrapper.props().program).toStrictEqual(expectedProgram);
            }
        }
    );
});

describe('Move to previous program step', () => {
    test.each([
        [ 0, [
            {commandName:'forward', commandParameters: {distance: 100}},
            {commandName:'left', commandParameters: {angle: 90}},
            {commandName:'forward', commandParameters: {distance: 100}},
            {commandName:'left', commandParameters: {angle: 90}}]],
        [ 2, [
            {commandName:'forward', commandParameters: {distance: 100}},
            {commandName:'forward', commandParameters: {distance: 100}},
            {commandName:'left', commandParameters: {angle: 90}},
            {commandName:'left', commandParameters: {angle: 90}}]]
    ]) ('Changes position with a step before, if there is a step',
        (stepNum, expectedProgram) => {
            const { wrapper, audioManagerMock, mockChangeProgramHandler, mockChangeActionPanelStepIndex } = createMountProgramBlockEditor();
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
                // The 'mockToPrevious' sound should be played
                expect(audioManagerMock.playSound.mock.calls.length).toBe(1);
                expect(audioManagerMock.playSound.mock.calls[0][0]).toBe('moveToPrevious');
                // The program should be updated
                expect(mockChangeProgramHandler.mock.calls.length).toBe(1);
                expect(mockChangeProgramHandler.mock.calls[0][0]).toStrictEqual(expectedProgram);
            } else {
                // No sound should be played
                expect(audioManagerMock.playSound.mock.calls.length).toBe(0);
                // The program should not be updated
                expect(mockChangeProgramHandler.mock.calls.length).toBe(0);
                expect(wrapper.props().program).toStrictEqual(expectedProgram);
            }
        }
    )
});

describe('Move to next program step', () => {
    test.each([
        [ 0, [
            {commandName:'left', commandParameters: {angle: 90}},
            {commandName:'forward', commandParameters: {distance: 100}},
            {commandName:'forward', commandParameters: {distance: 100}},
            {commandName:'left', commandParameters: {angle: 90}}]],
        [ 3, [
            {commandName:'forward', commandParameters: {distance: 100}},
            {commandName:'left', commandParameters: {angle: 90}},
            {commandName:'forward', commandParameters: {distance: 100}},
            {commandName:'left', commandParameters: {angle: 90}}]]
    ]) ('Changes position with a step after, if there is a step',
        (stepNum, expectedProgram) => {
            const { wrapper, audioManagerMock, mockChangeProgramHandler, mockChangeActionPanelStepIndex } = createMountProgramBlockEditor();
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
                // The 'mockToNext' sound should be played
                expect(audioManagerMock.playSound.mock.calls.length).toBe(1);
                expect(audioManagerMock.playSound.mock.calls[0][0]).toBe('moveToNext');
                // The program should be updated
                expect(mockChangeProgramHandler.mock.calls.length).toBe(1);
                expect(mockChangeProgramHandler.mock.calls[0][0]).toStrictEqual(expectedProgram);
            } else {
                // No sound should be played
                expect(audioManagerMock.playSound.mock.calls.length).toBe(0);
                // The program should not be updated
                expect(mockChangeProgramHandler.mock.calls.length).toBe(0);
                expect(wrapper.props().program).toStrictEqual(expectedProgram);
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

describe('Autoscroll to show the active program step', () => {
    test('When active program step number is 0, scroll to the beginning of the container', () => {
        expect.assertions(3);
        const mockScrollTo = jest.fn();
        const { wrapper } = createMountProgramBlockEditor();
        getProgramSequenceContainer(wrapper).ref.current.scrollTo = mockScrollTo;

        wrapper.setProps({
            activeProgramStepNum: 0
        });

        expect(mockScrollTo.mock.calls.length).toBe(1);
        // mock.calls[0][0] for x position, [0][1] for y position
        expect(mockScrollTo.mock.calls[0][0]).toBe(0);
        expect(mockScrollTo.mock.calls[0][1]).toBe(0);
    });
    test('When active program block is outside of the container, on the right', () => {
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
            scrollLeft: 200
        };

        // Set the active block location
        const activeProgramBlock = getProgramBlockAtPosition(wrapper, 3);
        // $FlowFixMe: Flow complains that getBoundingClientRect is not writable
        activeProgramBlock.getDOMNode().getBoundingClientRect = () => {
            return {
                left: 2000,
                right: 2300
            };
        };

        // Trigger a scroll
        wrapper.setProps({
            activeProgramStepNum: 3
        });

        expect(programSequenceContainer.ref.current.scrollLeft).toBe(200 + 2300 - 100 - 1000);
    });
    test('When active program block is outside of the container, on the left', () => {
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

        // Set the active block location
        const activeProgramBlock = getProgramBlockAtPosition(wrapper, 3);
        // $FlowFixMe: Flow complains that getBoundingClientRect is not writable
        activeProgramBlock.getDOMNode().getBoundingClientRect = () => {
            return {
                left: -200,
                right: -100
            };
        };

        // Trigger a scroll
        wrapper.setProps({
            activeProgramStepNum: 3
        });

        expect(programSequenceContainer.ref.current.scrollLeft).toBe(2000 - 100 - 200);
    });
});

test('The editor scrolls when a step is added to the end of the program', () => {
    expect.assertions(8);

    const mockScrollIntoView = jest.fn();

    window.HTMLElement.prototype.scrollIntoView = mockScrollIntoView;

    // Given a program of 5 forwards and 'left' as the selected command
    const { wrapper, audioManagerMock, mockChangeProgramHandler } = createMountProgramBlockEditor({
        program: [
            {commandName:'forward', commandParameters: {distance: 100}},
            {commandName:'forward', commandParameters: {distance: 100}},
            {commandName:'forward', commandParameters: {distance: 100}},
            {commandName:'forward', commandParameters: {distance: 100}},
            {commandName:'forward', commandParameters: {distance: 100}}],
        selectedAction: 'left'
    });

    // When 'forward' is added to the end of the program
    // (The index is zero because the add nodes aren't expanded).
    const addNode = getAddNodeButtonAtPosition(wrapper, 0);
    addNode.simulate('click');

    // Then the 'add' sound should be played
    expect(audioManagerMock.playSound.mock.calls.length).toBe(1);
    expect(audioManagerMock.playSound.mock.calls[0][0]).toBe('add');

    // And the program should be changed
    expect(mockChangeProgramHandler.mock.calls.length).toBe(1);
    expect(mockChangeProgramHandler.mock.calls[0][0]).toStrictEqual(
        [
            {commandName:'forward', commandParameters: {distance: 100}},
            {commandName:'forward', commandParameters: {distance: 100}},
            {commandName:'forward', commandParameters: {distance: 100}},
            {commandName:'forward', commandParameters: {distance: 100}},
            {commandName:'forward', commandParameters: {distance: 100}},
            {commandName:'left', commandParameters: {angle: 90}}]);

    // And updating the program triggers auto scroll
    wrapper.setProps({ program: mockChangeProgramHandler.mock.calls[0][0] });
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
