// @flow

import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, mount } from 'enzyme';
import { IntlProvider } from 'react-intl';
import ActionPanel from './ActionPanel';
import ProgramSequence from './ProgramSequence';
import messages from './messages.json';

configure({ adapter: new Adapter()});

function createMountActionPanel(props) {
    const mockDeleteHandler = jest.fn();
    const mockReplaceHandler = jest.fn();
    const mockMoveToPreviousStep = jest.fn();
    const mockMoveToNextStep = jest.fn();

    const wrapper = mount(
        React.createElement(
            ActionPanel,
            Object.assign(
                {
                    focusedOptionName: null,
                    selectedCommandName: 'right45',
                    programSequence: new ProgramSequence(
                        [
                            {block: 'forward1'},
                            {block: 'left45'},
                            {block: 'right45'}
                        ],
                        0,
                        0,
                        new Map()
                    ),
                    pressedStepIndex: 1,
                    position: {
                        top: 0,
                        right: 0
                    },
                    onDelete: mockDeleteHandler,
                    onReplace: mockReplaceHandler,
                    onMoveToPreviousStep: mockMoveToPreviousStep,
                    onMoveToNextStep: mockMoveToNextStep
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
        mockDeleteHandler,
        mockReplaceHandler,
        mockMoveToPreviousStep,
        mockMoveToNextStep
    };
}

function getActionPanelOptionButtons(actionPanelWrapper, controlName) {
    return actionPanelWrapper.find({name: controlName}).at(0);
}

describe('ActionPanel options', () => {
    test('When the deleteCurrentStep option is selected on second step turn left 45 of the program', () => {
        const pressedStepIndex = 1;
        const { wrapper, mockDeleteHandler } = createMountActionPanel({
            pressedStepIndex: pressedStepIndex
        });
        const deleteButton = getActionPanelOptionButtons(wrapper, 'deleteCurrentStep');
        const expectedAriaLabel = 'Delete Step 2 turn left 45 degrees';
        expect(deleteButton.get(0).props['aria-label']).toBe(expectedAriaLabel);
        deleteButton.simulate('click');
        expect(mockDeleteHandler.mock.calls.length).toBe(1);
        expect(mockDeleteHandler.mock.calls[0][0]).toBe(pressedStepIndex);
    });

    test('When the replaceCurrentStep option is selected on second step turn left 45 of the program', () => {
        const pressedStepIndex = 1;
        const { wrapper, mockReplaceHandler } = createMountActionPanel({
            pressedStepIndex: pressedStepIndex
        });
        const replaceCurrentStepButton = getActionPanelOptionButtons(wrapper, 'replaceCurrentStep');
        const expectedAriaLabel = 'Replace Step 2 turn left 45 degrees with selected action turn right 45 degrees';
        expect(replaceCurrentStepButton.get(0).props['aria-label']).toBe(expectedAriaLabel);
        replaceCurrentStepButton.simulate('click');
        expect(mockReplaceHandler.mock.calls.length).toBe(1);
        expect(mockReplaceHandler.mock.calls[0][0]).toBe(pressedStepIndex);
    });

    test('When the moveToPreviousStep option is selected on second step turn left 45 of the program', () => {
        const pressedStepIndex = 1;
        const { wrapper, mockMoveToPreviousStep } = createMountActionPanel({
            pressedStepIndex: pressedStepIndex
        });
        const moveToPreviousStepButton = getActionPanelOptionButtons(wrapper, 'moveToPreviousStep');
        const expectedAriaLabel = 'Move Step 2 turn left 45 degrees before step 1 forward 1 square';
        expect(moveToPreviousStepButton.get(0).props['aria-label']).toBe(expectedAriaLabel);
        moveToPreviousStepButton.simulate('click');
        expect(mockMoveToPreviousStep.mock.calls.length).toBe(1);
        expect(mockMoveToPreviousStep.mock.calls[0][0]).toBe(pressedStepIndex);
    });

    test('When the moveToPreviousStep option is selected on first step of the program', () => {
        const { wrapper, mockMoveToPreviousStep } = createMountActionPanel({
            pressedStepIndex: 0
        });
        const moveToPreviousStepButton = getActionPanelOptionButtons(wrapper, 'moveToPreviousStep');
        const expectedAriaLabel = 'Move Step 1 forward 1 square ';
        expect(moveToPreviousStepButton.get(0).props['aria-label']).toBe(expectedAriaLabel);
        expect(moveToPreviousStepButton.get(0).props['disabled']).toBe(true);
        moveToPreviousStepButton.simulate('click');
        // Move to previous button is disabled when a block is the first block, clicking doesn't do anything
        expect(mockMoveToPreviousStep.mock.calls.length).toBe(0);
    });

    test('When the moveToPreviousStep option is selected on a startLoop block at the beginning', () => {
        const { wrapper, mockMoveToPreviousStep } = createMountActionPanel({
            programSequence: new ProgramSequence(
                [
                    {block: 'startLoop', label: 'A', iterations: 1},
                    {block: 'forward1'},
                    {block: 'endLoop', label: 'A' }
                ],
                0,
                1,
                new Map()
            ),
            pressedStepIndex: 0
        });
        const moveToPreviousStepButton = getActionPanelOptionButtons(wrapper, 'moveToPreviousStep');
        const expectedAriaLabel = "Move Step 1 loop A ";
        expect(moveToPreviousStepButton.get(0).props['disabled']).toBe(true);
        moveToPreviousStepButton.simulate('click');
        expect(moveToPreviousStepButton.get(0).props['aria-label']).toBe(expectedAriaLabel);
        // Move to previous button is disabled when a block is the first block, clicking doesn't do anything
        expect(mockMoveToPreviousStep.mock.calls.length).toBe(0);
    });

    test('When the moveToPreviousStep option is selected on an endLoop block with its pair startLoop block at the beginning', () => {
        const { wrapper, mockMoveToPreviousStep } = createMountActionPanel({
            programSequence: new ProgramSequence(
                [
                    {block: 'startLoop', label: 'A', iterations: 1},
                    {block: 'forward1'},
                    {block: 'endLoop', label: 'A' }
                ],
                0,
                1,
                new Map()
            ),
            pressedStepIndex: 2
        });
        const moveToPreviousStepButton = getActionPanelOptionButtons(wrapper, 'moveToPreviousStep');
        const expectedAriaLabel = "Move Step 3 loop A ";
        expect(moveToPreviousStepButton.get(0).props['disabled']).toBe(true);
        moveToPreviousStepButton.simulate('click');
        expect(moveToPreviousStepButton.get(0).props['aria-label']).toBe(expectedAriaLabel);
        // Move to previous button is disabled when a block is the first block, clicking doesn't do anything
        expect(mockMoveToPreviousStep.mock.calls.length).toBe(0);
    });

    test('When the moveToPreviousStep option is selected on a startLoop block on second step of a program', () => {
        const { wrapper, mockMoveToPreviousStep } = createMountActionPanel({
            programSequence: new ProgramSequence(
                [
                    {block: 'forward1'},
                    {block: 'startLoop', label: 'A', iterations: 1},
                    {block: 'endLoop', label: 'A' }
                ],
                0,
                1,
                new Map()
            ),
            pressedStepIndex: 1
        });
        const moveToPreviousStepButton = getActionPanelOptionButtons(wrapper, 'moveToPreviousStep');
        const expectedAriaLabel = "Move Step 2 loop A before step 1 forward 1 square";
        moveToPreviousStepButton.simulate('click');
        expect(moveToPreviousStepButton.get(0).props['aria-label']).toBe(expectedAriaLabel);
        expect(mockMoveToPreviousStep.mock.calls.length).toBe(1);
    });

    test('When the moveToPreviousStep option is selected on a endLoop block on third step of a program', () => {
        const { wrapper, mockMoveToPreviousStep } = createMountActionPanel({
            programSequence: new ProgramSequence(
                [
                    {block: 'forward1'},
                    {block: 'startLoop', label: 'A', iterations: 1},
                    {block: 'endLoop', label: 'A' }
                ],
                0,
                1,
                new Map()
            ),
            pressedStepIndex: 2
        });
        const moveToPreviousStepButton = getActionPanelOptionButtons(wrapper, 'moveToPreviousStep');
        const expectedAriaLabel = "Move Step 3 loop A before step 1 forward 1 square";
        moveToPreviousStepButton.simulate('click');
        expect(moveToPreviousStepButton.get(0).props['aria-label']).toBe(expectedAriaLabel);
        expect(mockMoveToPreviousStep.mock.calls.length).toBe(1);
    });

    test('When the moveToPreviousStep option is selected on a step next to a startLoop', () => {
        const { wrapper, mockMoveToPreviousStep } = createMountActionPanel({
            programSequence: new ProgramSequence(
                [
                    {
                        block: 'startLoop',
                        label: 'A',
                        iterations: 1
                    },
                    {
                        block: 'forward1',
                        cache: new Map([
                            ['containingLoopPosition', 1],
                            ['containingLoopLabel', 'A']
                        ])
                    },
                    {
                        block: 'endLoop',
                        label: 'A'
                    }
                ],
                0,
                1,
                new Map()
            ),
            pressedStepIndex: 1
        });
        const moveToPreviousStepButton = getActionPanelOptionButtons(wrapper, 'moveToPreviousStep');
        const expectedAriaLabel = "Move Step 1 forward 1 square out before loop A";
        moveToPreviousStepButton.simulate('click');
        expect(moveToPreviousStepButton.get(0).props['aria-label']).toBe(expectedAriaLabel);
        expect(mockMoveToPreviousStep.mock.calls.length).toBe(1);
    });

    test('When the moveToPreviousStep option is selected on a step next to a endLoop', () => {
        const { wrapper, mockMoveToPreviousStep } = createMountActionPanel({
            programSequence: new ProgramSequence(
                [
                    {block: 'startLoop', label: 'A', iterations: 1},
                    {block: 'endLoop', label: 'A' },
                    {block: 'forward1'}
                ],
                0,
                1,
                new Map()
            ),
            pressedStepIndex: 2
        });
        const moveToPreviousStepButton = getActionPanelOptionButtons(wrapper, 'moveToPreviousStep');
        const expectedAriaLabel = "Move Step 3 forward 1 square into the end of loop A";
        moveToPreviousStepButton.simulate('click');
        expect(moveToPreviousStepButton.get(0).props['aria-label']).toBe(expectedAriaLabel);
        expect(mockMoveToPreviousStep.mock.calls.length).toBe(1);
    });

    test('When the moveToPreviousStep option is selected on second step in a loop', () => {
        const { wrapper, mockMoveToPreviousStep } = createMountActionPanel({
            programSequence: new ProgramSequence(
                [
                    {
                        block: 'startLoop',
                        label: 'A',
                        iterations: 1
                    },
                    {
                        block: 'forward1',
                        cache: new Map([
                            ['containingLoopPosition', 1],
                            ['containingLoopLabel', 'A']
                        ])
                    },
                    {
                        block: 'forward2',
                        cache: new Map([
                            ['containingLoopPosition', 2],
                            ['containingLoopLabel', 'A']
                        ])
                    },
                    {
                        block: 'endLoop',
                        label: 'A'
                    }
                ],
                0,
                1,
                new Map()
            ),
            pressedStepIndex: 2
        });
        const moveToPreviousStepButton = getActionPanelOptionButtons(wrapper, 'moveToPreviousStep');
        const expectedAriaLabel = "Move Step 2 forward 2 squares before step 1 forward 1 square of loop A";
        moveToPreviousStepButton.simulate('click');
        expect(moveToPreviousStepButton.get(0).props['aria-label']).toBe(expectedAriaLabel);
        expect(mockMoveToPreviousStep.mock.calls.length).toBe(1);
    });

    test('When the moveToNextStep option is selected on second step turn left 45 of the program', () => {
        const pressedStepIndex = 1;
        const { wrapper, mockMoveToNextStep } = createMountActionPanel({
            pressedStepIndex: pressedStepIndex
        });
        const moveToNextStepButton = getActionPanelOptionButtons(wrapper, 'moveToNextStep');
        const expectedAriaLabel = 'Move Step 2 turn left 45 degrees after step 3 turn right 45 degrees';
        expect(moveToNextStepButton.get(0).props['aria-label']).toBe(expectedAriaLabel);
        moveToNextStepButton.simulate('click');
        expect(mockMoveToNextStep.mock.calls.length).toBe(1);
        expect(mockMoveToNextStep.mock.calls[0][0]).toBe(pressedStepIndex);
    });

    test('When the moveToNextStep option is selected on last step of the program', () => {
        const { wrapper, mockMoveToNextStep } = createMountActionPanel({
            pressedStepIndex: 2
        });
        const moveToNextStepButton = getActionPanelOptionButtons(wrapper, 'moveToNextStep');
        const expectedAriaLabel = 'Move Step 3 turn right 45 degrees ';
        expect(moveToNextStepButton.get(0).props['aria-label']).toBe(expectedAriaLabel);
        expect(moveToNextStepButton.get(0).props['disabled']).toBe(true);
        moveToNextStepButton.simulate('click');
        // Move to next button is disabled when a block is the last block, clicking doesn't do anything
        expect(mockMoveToNextStep.mock.calls.length).toBe(0);
    });

    test('When the moveToNextStep option is selected on a startLoop block at the beginning with its pair endLoop block at the end', () => {
        const { wrapper, mockMoveToNextStep } = createMountActionPanel({
            programSequence: new ProgramSequence(
                [
                    {block: 'startLoop', label: 'A', iterations: 1},
                    {block: 'forward1'},
                    {block: 'endLoop', label: 'A' }
                ],
                0,
                1,
                new Map()
            ),
            pressedStepIndex: 0
        });
        const moveToNextStepButton = getActionPanelOptionButtons(wrapper, 'moveToNextStep');
        const expectedAriaLabel = "Move Step 1 loop A ";
        expect(moveToNextStepButton.get(0).props['disabled']).toBe(true);
        moveToNextStepButton.simulate('click');
        expect(moveToNextStepButton.get(0).props['aria-label']).toBe(expectedAriaLabel);
        // Move to previous button is disabled when a block is the first block, clicking doesn't do anything
        expect(mockMoveToNextStep.mock.calls.length).toBe(0);
    });

    test('When the moveToNextStep option is selected on an endLoop block with its pair startLoop block at the beginning', () => {
        const { wrapper, mockMoveToNextStep } = createMountActionPanel({
            programSequence: new ProgramSequence(
                [
                    {block: 'startLoop', label: 'A', iterations: 1},
                    {block: 'forward1'},
                    {block: 'endLoop', label: 'A' }
                ],
                0,
                1,
                new Map()
            ),
            pressedStepIndex: 2
        });
        const moveToNextStepButton = getActionPanelOptionButtons(wrapper, 'moveToNextStep');
        const expectedAriaLabel = "Move Step 3 loop A ";
        expect(moveToNextStepButton.get(0).props['disabled']).toBe(true);
        moveToNextStepButton.simulate('click');
        expect(moveToNextStepButton.get(0).props['aria-label']).toBe(expectedAriaLabel);
        // Move to previous button is disabled when a block is the first block, clicking doesn't do anything
        expect(mockMoveToNextStep.mock.calls.length).toBe(0);
    });

    test('When the moveToNextStep option is selected on a startLoop block on first step of a program', () => {
        const { wrapper, mockMoveToNextStep } = createMountActionPanel({
            programSequence: new ProgramSequence(
                [
                    {block: 'startLoop', label: 'A', iterations: 1},
                    {block: 'endLoop', label: 'A' },
                    {block: 'forward1'}
                ],
                0,
                1,
                new Map()
            ),
            pressedStepIndex: 0
        });
        const moveToNextStepButton = getActionPanelOptionButtons(wrapper, 'moveToNextStep');
        const expectedAriaLabel = "Move Step 1 loop A after step 3 forward 1 square";
        moveToNextStepButton.simulate('click');
        expect(moveToNextStepButton.get(0).props['aria-label']).toBe(expectedAriaLabel);
        expect(mockMoveToNextStep.mock.calls.length).toBe(1);
    });

    test('When the moveToNextStep option is selected on a endLoop block on third step of a program', () => {
        const { wrapper, mockMoveToNextStep } = createMountActionPanel({
            programSequence: new ProgramSequence(
                [
                    {block: 'startLoop', label: 'A', iterations: 1},
                    {block: 'endLoop', label: 'A' },
                    {block: 'forward1'}
                ],
                0,
                1,
                new Map()
            ),
            pressedStepIndex: 1
        });
        const moveToNextStepButton = getActionPanelOptionButtons(wrapper, 'moveToNextStep');
        const expectedAriaLabel = "Move Step 2 loop A after step 3 forward 1 square";
        moveToNextStepButton.simulate('click');
        expect(moveToNextStepButton.get(0).props['aria-label']).toBe(expectedAriaLabel);
        expect(mockMoveToNextStep.mock.calls.length).toBe(1);
    });

    test('When the moveToNextStep option is selected on a step next to a endLoop', () => {
        const { wrapper, mockMoveToNextStep } = createMountActionPanel({
            programSequence: new ProgramSequence(
                [
                    {
                        block: 'startLoop',
                        label: 'A',
                        iterations: 1
                    },
                    {
                        block: 'forward1',
                        cache: new Map([
                            ['containingLoopPosition', 1],
                            ['containingLoopLabel', 'A']
                        ])
                    },
                    {
                        block: 'endLoop',
                        label: 'A'
                    }
                ],
                0,
                1,
                new Map()
            ),
            pressedStepIndex: 1
        });
        const moveToNextStepButton = getActionPanelOptionButtons(wrapper, 'moveToNextStep');
        const expectedAriaLabel = "Move Step 1 forward 1 square out after loop A";
        moveToNextStepButton.simulate('click');
        expect(moveToNextStepButton.get(0).props['aria-label']).toBe(expectedAriaLabel);
        expect(mockMoveToNextStep.mock.calls.length).toBe(1);
    });

    test('When the moveToNextStep option is selected on a step next to a startLoop', () => {
        const { wrapper, mockMoveToNextStep } = createMountActionPanel({
            programSequence: new ProgramSequence(
                [
                    {block: 'forward1'},
                    {block: 'startLoop', label: 'A', iterations: 1},
                    {block: 'endLoop', label: 'A' }
                ],
                0,
                1,
                new Map()
            ),
            pressedStepIndex: 0
        });
        const moveToNextStepButton = getActionPanelOptionButtons(wrapper, 'moveToNextStep');
        const expectedAriaLabel = "Move Step 1 forward 1 square into the beginning of loop A";
        moveToNextStepButton.simulate('click');
        expect(moveToNextStepButton.get(0).props['aria-label']).toBe(expectedAriaLabel);
        expect(mockMoveToNextStep.mock.calls.length).toBe(1);
    });

    test('When the moveToNextStep option is selected on first step in a loop', () => {
        const { wrapper, mockMoveToNextStep } = createMountActionPanel({
            programSequence: new ProgramSequence(
                [
                    {
                        block: 'startLoop',
                        label: 'A',
                        iterations: 1
                    },
                    {
                        block: 'forward1',
                        cache: new Map([
                            ['containingLoopPosition', 1],
                            ['containingLoopLabel', 'A']
                        ])
                    },
                    {
                        block: 'forward2',
                        cache: new Map([
                            ['containingLoopPosition', 2],
                            ['containingLoopLabel', 'A']
                        ])
                    },
                    {
                        block: 'endLoop',
                        label: 'A'
                    }
                ],
                0,
                1,
                new Map()
            ),
            pressedStepIndex: 1
        });
        const moveToNextStepButton = getActionPanelOptionButtons(wrapper, 'moveToNextStep');
        const expectedAriaLabel = "Move Step 1 forward 1 square after step 2 forward 2 squares of loop A";
        moveToNextStepButton.simulate('click');
        expect(moveToNextStepButton.get(0).props['aria-label']).toBe(expectedAriaLabel);
        expect(mockMoveToNextStep.mock.calls.length).toBe(1);
    });
});

test('When ActionPanel renders, auto scroll to show full ActionPanel', () => {
    const mockScrollIntoView = jest.fn();
    window.HTMLElement.prototype.scrollIntoView = mockScrollIntoView
    expect(mockScrollIntoView.mock.calls.length).toBe(0);
    createMountActionPanel();
    expect(mockScrollIntoView.mock.calls.length).toBe(1);
    expect(mockScrollIntoView.mock.calls[0][0]).toStrictEqual({
        behavior: 'auto',
        block: 'nearest',
        inline: 'nearest'
    });
});
