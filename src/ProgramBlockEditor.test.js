// @flow

import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, mount, shallow } from 'enzyme';
import { Button } from 'react-bootstrap';
import { createIntl, IntlProvider } from 'react-intl';
import App from './App';
import AriaDisablingButton from './AriaDisablingButton';
import messages from './messages.json';
import ConfirmDeleteAllModal from './ConfirmDeleteAllModal';
import ProgramBlockEditor from './ProgramBlockEditor';

configure({ adapter: new Adapter()});

const defaultProgramBlockEditorProps = {
    program: ['forward', 'left', 'forward', 'left'],
    interpreterIsRunning: false,
    activeProgramStepNum: null,
    minVisibleSteps: 6,
    selectedAction: null,
    editingDisabled: false,
    runButtonDisabled: false,
    addModeDescriptionId: 'someAddModeDescriptionId',
    deleteModeDescriptionId: 'someDeleteModeDescriptionId'
};

const addAction = {
    type: 'editorAction',
    action: 'add'
};

const deleteAction = {
    type: 'editorAction',
    action: 'delete'
}

const rightCommandAction = {
    type: 'command',
    commandName: 'right'
}

function createShallowProgramBlockEditor(props) {
    const intl = createIntl({
        locale: 'en',
        defaultLocale: 'en',
        messages: messages.en
    });

    const mockClickRunButtonHandler = jest.fn();
    const mockSelectActionHandler = jest.fn();
    const mockChangeHandler = jest.fn();

    const wrapper = shallow(
        React.createElement(
            ProgramBlockEditor.WrappedComponent,
            Object.assign(
                {},
                defaultProgramBlockEditorProps,
                {
                    intl: intl,
                    onClickRunButton: mockClickRunButtonHandler,
                    onSelectAction: mockSelectActionHandler,
                    onChange: mockChangeHandler
                },
                props
            )
        )
    );

    return {
        wrapper,
        mockClickRunButtonHandler,
        mockSelectActionHandler,
        mockChangeHandler
    };
}

function createMountProgramBlockEditor(props) {
    const mockClickRunButtonHandler = jest.fn();
    const mockSelectActionHandler = jest.fn();
    const mockChangeHandler = jest.fn();

    const wrapper = mount(
        React.createElement(
            ProgramBlockEditor,
            Object.assign(
                {},
                defaultProgramBlockEditorProps,
                {
                    onClickRunButton: mockClickRunButtonHandler,
                    onSelectAction: mockSelectActionHandler,
                    onChange: mockChangeHandler
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
        mockClickRunButtonHandler,
        mockSelectActionHandler,
        mockChangeHandler
    };
}

function getEditorActionButtons(programBlockEditorWrapper) {
    return programBlockEditorWrapper.find(AriaDisablingButton)
        .filter('.ProgramBlockEditor__editor-action-button');
}

function hasPressedClass(button) {
    return button.hasClass('ProgramBlockEditor__editor-action-button--pressed');
}

function getDeleteAllButton(programBlockEditorWrapper) {
    return programBlockEditorWrapper.find(Button)
        .filter('.ProgramBlockEditor__delete-all-button');
}

function getProgramBlocks(programBlockEditorWrapper) {
    return programBlockEditorWrapper.find(Button)
        .filter('.ProgramBlockEditor__program-block');
}

function getProgramBlockAtPosition(programBlockEditorWrapper, index: number) {
    return getProgramBlocks(programBlockEditorWrapper).at(index)
}

function getRunButton(programBlockEditorWrapper) {
    return programBlockEditorWrapper.find(AriaDisablingButton)
        .filter('.ProgramBlockEditor__run-button');
}

describe('Editor buttons', () => {
    describe('Given no selected action', () => {
        let wrapper, mockSelectActionHandler;

        beforeEach(() => {
            ({ wrapper, mockSelectActionHandler } = createShallowProgramBlockEditor({
                selectedAction: null
            }));
        });

        test('Then no editor buttons should have presssed state', () => {
            expect.assertions(7);

            expect(getEditorActionButtons(wrapper).length).toBe(2);

            expect(getEditorActionButtons(wrapper).get(0).key).toBe('addButton');
            expect(getEditorActionButtons(wrapper).get(0).props['aria-pressed']).toBe('false');
            expect(hasPressedClass(getEditorActionButtons(wrapper).at(0))).toBe(false);

            expect(getEditorActionButtons(wrapper).get(1).key).toBe('deleteButton');
            expect(getEditorActionButtons(wrapper).get(1).props['aria-pressed']).toBe('false');
            expect(hasPressedClass(getEditorActionButtons(wrapper).at(1))).toBe(false);
        });

        test('When Add is clicked, then selected action should be set to Add', () => {
            expect.assertions(2);
            getEditorActionButtons(wrapper).at(0).simulate('click');
            expect(mockSelectActionHandler.mock.calls.length).toBe(1);
            expect(mockSelectActionHandler.mock.calls[0][0]).toStrictEqual({
                type: 'editorAction',
                action: 'add'
            });
        });

        test('When Delete is clicked, then selected action should be set to Delete', () => {
            expect.assertions(2);
            getEditorActionButtons(wrapper).at(1).simulate('click');
            expect(mockSelectActionHandler.mock.calls.length).toBe(1);
            expect(mockSelectActionHandler.mock.calls[0][0]).toStrictEqual({
                'type': 'editorAction',
                'action': 'delete'
            });
        });
    });

    describe('Given selected action is Add', () => {
        let wrapper, mockSelectActionHandler;

        beforeEach(() => {
            ({ wrapper, mockSelectActionHandler } = createShallowProgramBlockEditor({
                selectedAction: addAction
            }));
        });

        test('Then the Add button should have pressed state', () => {
            expect.assertions(4);
            expect(getEditorActionButtons(wrapper).get(0).props['aria-pressed']).toBe('true');
            expect(hasPressedClass(getEditorActionButtons(wrapper).at(0))).toBe(true);
            expect(getEditorActionButtons(wrapper).get(1).props['aria-pressed']).toBe('false');
            expect(hasPressedClass(getEditorActionButtons(wrapper).at(1))).toBe(false);
        });

        test('When Add is clicked, then it should be toggled off', () => {
            expect.assertions(2);
            getEditorActionButtons(wrapper).at(0).simulate('click');
            expect(mockSelectActionHandler.mock.calls.length).toBe(1);
            expect(mockSelectActionHandler.mock.calls[0][0]).toBeNull();
        });

        test('When Delete is clicked, then selected action should be set to Delete', () => {
            expect.assertions(2);
            getEditorActionButtons(wrapper).at(1).simulate('click');
            expect(mockSelectActionHandler.mock.calls.length).toBe(1);
            expect(mockSelectActionHandler.mock.calls[0][0]).toStrictEqual({
                'type': 'editorAction',
                'action': 'delete'
            });
        });
    });

    describe('Given selected action is Delete', () => {
        let wrapper, mockSelectActionHandler;

        beforeEach(() => {
            ({ wrapper, mockSelectActionHandler } = createShallowProgramBlockEditor({
                selectedAction: deleteAction
            }));
        });

        test('Then the Delete button should have pressed state', () => {
            expect.assertions(4);
            expect(getEditorActionButtons(wrapper).get(0).props['aria-pressed']).toBe('false');
            expect(hasPressedClass(getEditorActionButtons(wrapper).at(0))).toBe(false);
            expect(getEditorActionButtons(wrapper).get(1).props['aria-pressed']).toBe('true');
            expect(hasPressedClass(getEditorActionButtons(wrapper).at(1))).toBe(true);
        });

        test('When Delete is clicked, then it should be toggled off', () => {
            expect.assertions(2);
            getEditorActionButtons(wrapper).at(1).simulate('click');
            expect(mockSelectActionHandler.mock.calls.length).toBe(1);
            expect(mockSelectActionHandler.mock.calls[0][0]).toBeNull();
        });

        test('When Add is clicked, then selected action should be set to Add', () => {
            expect.assertions(2);
            getEditorActionButtons(wrapper).at(0).simulate('click');
            expect(mockSelectActionHandler.mock.calls.length).toBe(1);
            expect(mockSelectActionHandler.mock.calls[0][0]).toStrictEqual({
                'type': 'editorAction',
                'action': 'add'
            });
        });
    });
});

describe('Editor buttons aria-describedby', () => {
    test('Should be set to the provided ids', () => {
        expect.assertions(2);
        const { wrapper } = createMountProgramBlockEditor();
        expect(getEditorActionButtons(wrapper).get(0).props['aria-describedby']).toBe('someAddModeDescriptionId');
        expect(getEditorActionButtons(wrapper).get(1).props['aria-describedby']).toBe('someDeleteModeDescriptionId');
    });
});

describe('Delete All button', () => {
    describe('Given selected action is Delete', () => {
        test('When the Delete All button is clicked, then the dialog should be shown', () => {
            expect.assertions(2);

            const { wrapper } = createShallowProgramBlockEditor({
                    selectedAction: deleteAction
            });

            // Initially, check that the modal is not showing
            expect(wrapper.state().showConfirmDeleteAll).toBe(false);
            // When the Delete All button is clicked
            const deleteAllButton = getDeleteAllButton(wrapper).at(0);
            deleteAllButton.simulate('click');
            // Then the dialog should be shown
            expect(wrapper.state().showConfirmDeleteAll).toBe(true);
        });
    });
});

describe('Add, Delete, and replace program steps', () => {
    describe('Given a program of 4 steps and minVisibleSteps of 6', () => {
        test('Then blocks should be rendered for the program, with 2 none blocks at the end', () => {
            expect.assertions(7);
            const { wrapper } = createMountProgramBlockEditor();
            expect(getProgramBlocks(wrapper).length).toBe(6);
            expect(getProgramBlocks(wrapper).get(0).key.includes('forward')).toBe(true);
            expect(getProgramBlocks(wrapper).get(1).key.includes('left')).toBe(true);
            expect(getProgramBlocks(wrapper).get(2).key.includes('forward')).toBe(true);
            expect(getProgramBlocks(wrapper).get(3).key.includes('left')).toBe(true);
            expect(getProgramBlocks(wrapper).get(4).key.includes('none')).toBe(true);
            expect(getProgramBlocks(wrapper).get(5).key.includes('none')).toBe(true);
        });
    });

    test.each([
        ['Add', 0, ['none', 'forward', 'left', 'forward', 'left'], addAction],
        ['Add', 3, ['forward', 'left', 'forward', 'none', 'left'], addAction],
        ['Delete', 0, ['left', 'forward', 'left'], deleteAction],
        ['Delete', 3, ['forward', 'left', 'forward'], deleteAction],
        ['Right command', 0, ['right', 'left', 'forward', 'left'], rightCommandAction],
        ['Right command', 3, ['forward', 'left', 'forward', 'right'], rightCommandAction]
    ])('Given selected action is %s, when block %i is clicked, then program should be updated',
        (actionName, stepNum, expectedProgram, action) => {

            expect.assertions(4);

            const { wrapper, mockSelectActionHandler, mockChangeHandler } =
                createMountProgramBlockEditor({
                    selectedAction: action
                });

            getProgramBlockAtPosition(wrapper, stepNum).simulate('click');

            // The program should be updated
            expect(mockChangeHandler.mock.calls.length).toBe(1);
            expect(mockChangeHandler.mock.calls[0][0]).toStrictEqual(expectedProgram);
            wrapper.setProps({program: expectedProgram});

            // And focus should remain on the clicked block
            expect(document.activeElement).toBe(getProgramBlockAtPosition(wrapper, stepNum).getDOMNode());

            // And the selected action should not have changed
            expect(mockSelectActionHandler.mock.calls.length).toBe(0);
        }
    );
});

describe('Editing can be disabled', () => {
    describe('Given editing is enabled', () => {
        test('Then the buttons should not be disabled', () => {
            expect.assertions(2);
            const { wrapper } = createMountProgramBlockEditor({
                editingDisabled: false
            });
            expect(getEditorActionButtons(wrapper).get(0).props.disabled).toBe(false);
            expect(getEditorActionButtons(wrapper).get(1).props.disabled).toBe(false);
        });
    });

    describe('Given editing is disabled', () => {
        test('Then the buttons should be disabled', () => {
            expect.assertions(2);
            const { wrapper } = createMountProgramBlockEditor({
                editingDisabled: true
            });
            expect(getEditorActionButtons(wrapper).get(0).props.disabled).toBe(true);
            expect(getEditorActionButtons(wrapper).get(1).props.disabled).toBe(true);
        });
    });
});

describe('Scroll to show the active program step', () => {
    test.each([
        1,
        2
    ])('When active program step number is set to %i, then the editor should scroll to the step',
        (stepNum) => {
            expect.assertions(4);

            const mockScrollIntoView = jest.fn();

            window.HTMLElement.prototype.scrollIntoView = mockScrollIntoView;

            const { wrapper } = createMountProgramBlockEditor();

            wrapper.setProps({
                activeProgramStepNum: stepNum
            });

            expect(mockScrollIntoView.mock.calls.length).toBe(1);
            expect(mockScrollIntoView.mock.calls[0][0]).toStrictEqual({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'nearest'
            });

            expect(mockScrollIntoView.mock.instances.length).toBe(1);
            expect(mockScrollIntoView.mock.instances[0]).toBe(getProgramBlockAtPosition(wrapper, stepNum).getDOMNode());
        }
    );
});

describe('The Run button class is changed when the program is running', () => {
    describe('Given the program is running', () => {
        test('Then the Run button should have the pressed class', () => {
            expect.assertions(1);
            const { wrapper } = createShallowProgramBlockEditor({
                interpreterIsRunning: true
            });
            expect(getRunButton(wrapper).hasClass('ProgramBlockEditor__run-button--pressed')).toBe(true);
        })
    });

    describe('Given the program is not running', () => {
        test('Then the Run button should not have the pressed class', () => {
            expect.assertions(1);
            const { wrapper } = createShallowProgramBlockEditor({
                interpreterIsRunning: false
            });
            expect(getRunButton(wrapper).hasClass('ProgramBlockEditor__run-button--pressed')).toBe(false);
        })
    });
});

describe('The Run button can be disabled', () => {
    describe('Given runButtonDisabled is true', () => {
        test('Then the Run button should be disabled', () => {
            expect.assertions(1);
            const { wrapper } = createShallowProgramBlockEditor({
                runButtonDisabled: true
            });
            expect(getRunButton(wrapper).props().disabled).toBe(true);
        })
    });

    describe('Given runButtonDisabled is false', () => {
        test('Then the Run button should not be disabled', () => {
            expect.assertions(1);
            const { wrapper } = createShallowProgramBlockEditor({
                runButtonDisabled: false
            });
            expect(getRunButton(wrapper).props().disabled).toBe(false);
        })
    });
});
