// @flow

import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, mount, shallow } from 'enzyme';
import { Button } from 'react-bootstrap';
import { createIntl, IntlProvider } from 'react-intl';
import App from './App';
import messages from './messages.json';
import ProgramBlockEditor from './ProgramBlockEditor';

configure({ adapter: new Adapter()});

function hasPressedClass(button) {
    return button.hasClass('ProgramBlockEditor__editor-action-button--pressed');
}

function getProgramBlocks(programBlockEditorWrapper) {
    return programBlockEditorWrapper.find(Button)
        .filter('.ProgramBlockEditor__program-block');
}

function getProgramBlockAtPosition(programBlockEditorWrapper, index: number) {
    return getProgramBlocks(programBlockEditorWrapper).at(index)
}

function getEditorActionButtons(programBlockEditorWrapper) {
    return programBlockEditorWrapper.find(Button)
        .filter('.ProgramBlockEditor__editor-action-button');
}

test('onSelect property of ProgramBlockEditor component should change action buttons class and aria-pressed according to selectedAction property', () => {
    const mockSelectHandler = jest.fn();
    const intl = createIntl({
        locale: 'en',
        defaultLocale: 'en',
        messages: messages.en
    });

    const wrapper = shallow(
        <ProgramBlockEditor.WrappedComponent
            intl={intl}
            minVisibleSteps={6}
            program={['forward', 'left', 'forward', 'left']}
            selectedAction={null}
            onSelectAction={mockSelectHandler} />
    );

    const getEditorActionButtons = () => (wrapper.find('.ProgramBlockEditor__editor-action-button'));
    // check if two buttons for editor action add and delete are rendered
    expect(getEditorActionButtons().length).toBe(2);
    expect(getEditorActionButtons().get(0).key).toBe('addButton');
    expect(getEditorActionButtons().get(1).key).toBe('deleteButton');

    // aira-pressed should be false, and pressed class should not be present before a click event
    expect(getEditorActionButtons().get(0).props['aria-pressed']).toBe('false');
    expect(hasPressedClass(getEditorActionButtons().at(0))).toBe(false);
    expect(getEditorActionButtons().get(1).props['aria-pressed']).toBe('false');
    expect(hasPressedClass(getEditorActionButtons().at(1))).toBe(false);

    const addButton = wrapper.find('.ProgramBlockEditor__editor-action-button').at(0);
    const deleteButton = wrapper.find('.ProgramBlockEditor__editor-action-button').at(1);

    addButton.simulate('click');
    expect(mockSelectHandler.mock.calls.length).toBe(1);
    expect(mockSelectHandler.mock.calls[0][0]).toStrictEqual({'action': 'add', 'type': 'editorAction'});
    wrapper.setProps({selectedAction : mockSelectHandler.mock.calls[0][0]});

    // addButton -- aria-pressed should be true and pressed class should be
    // present with a click event for a selected action,
    // and the other action remains its state
    expect(getEditorActionButtons().get(0).props['aria-pressed']).toBe('true');
    expect(hasPressedClass(getEditorActionButtons().at(0))).toBe(true);
    expect(getEditorActionButtons().get(1).props['aria-pressed']).toBe('false');
    expect(hasPressedClass(getEditorActionButtons().at(1))).toBe(false);

    addButton.simulate('click');
    expect(mockSelectHandler.mock.calls.length).toBe(2);
    expect(mockSelectHandler.mock.calls[1][0]).toBeNull();
    wrapper.setProps({selectedAction : mockSelectHandler.mock.calls[1][0]});

    // addButton -- when same action button is clicked,
    // aria-pressed and pressed class of the action should reset to initial state
    expect(getEditorActionButtons().get(0).props['aria-pressed']).toBe('false');
    expect(hasPressedClass(getEditorActionButtons().at(0))).toBe(false);
    expect(getEditorActionButtons().get(1).props['aria-pressed']).toBe('false');
    expect(hasPressedClass(getEditorActionButtons().at(1))).toBe(false);

    addButton.simulate('click');
    expect(mockSelectHandler.mock.calls.length).toBe(3);
    expect(mockSelectHandler.mock.calls[2][0]).toStrictEqual({'action': 'add', 'type': 'editorAction'});
    wrapper.setProps({selectedAction : mockSelectHandler.mock.calls[2][0]});
    deleteButton.simulate('click');
    expect(mockSelectHandler.mock.calls.length).toBe(4);
    expect(mockSelectHandler.mock.calls[3][0]).toStrictEqual({'action': 'delete', 'type': 'editorAction'});
    wrapper.setProps({selectedAction : mockSelectHandler.mock.calls[3][0]});

    // addButton -- when an action is selected and different action button is
    // clicked, aria-pressed and pressed class of previous action before the
    // click should reset to initial state and newly selected action's
    // aria-pressed and pressed class should change to be true and present
    expect(getEditorActionButtons().get(0).props['aria-pressed']).toBe('false');
    expect(hasPressedClass(getEditorActionButtons().at(0))).toBe(false);
    expect(getEditorActionButtons().get(1).props['aria-pressed']).toBe('true');
    expect(hasPressedClass(getEditorActionButtons().at(1))).toBe(true);

    wrapper.setProps({selectedAction : null});

    deleteButton.simulate('click');
    expect(mockSelectHandler.mock.calls.length).toBe(5);
    expect(mockSelectHandler.mock.calls[4][0]).toStrictEqual({'action': 'delete', 'type': 'editorAction'});
    wrapper.setProps({selectedAction : mockSelectHandler.mock.calls[4][0]});

    // deleteButton -- aria-pressed should be true and pressed class should be
    // present with a click event for a selected action, and the other action
    // remains its state
    expect(getEditorActionButtons().get(0).props['aria-pressed']).toBe('false');
    expect(hasPressedClass(getEditorActionButtons().at(0))).toBe(false);
    expect(getEditorActionButtons().get(1).props['aria-pressed']).toBe('true');
    expect(hasPressedClass(getEditorActionButtons().at(1))).toBe(true);

    deleteButton.simulate('click');
    expect(mockSelectHandler.mock.calls.length).toBe(6);
    expect(mockSelectHandler.mock.calls[5][0]).toBeNull();
    wrapper.setProps({selectedAction : mockSelectHandler.mock.calls[5][0]});

    // deleteButton -- when same action button is clicked, aria-pressed and
    // pressed class of the action should reset to initial state
    expect(getEditorActionButtons().get(0).props['aria-pressed']).toBe('false');
    expect(hasPressedClass(getEditorActionButtons().at(0))).toBe(false);
    expect(getEditorActionButtons().get(1).props['aria-pressed']).toBe('false');
    expect(hasPressedClass(getEditorActionButtons().at(1))).toBe(false);

    deleteButton.simulate('click');
    expect(mockSelectHandler.mock.calls.length).toBe(7);
    expect(mockSelectHandler.mock.calls[6][0]).toStrictEqual({'action': 'delete', 'type': 'editorAction'});
    wrapper.setProps({selectedAction : mockSelectHandler.mock.calls[6][0]});
    addButton.simulate('click');
    expect(mockSelectHandler.mock.calls.length).toBe(8);
    expect(mockSelectHandler.mock.calls[7][0]).toStrictEqual({'action': 'add', 'type': 'editorAction'});
    wrapper.setProps({selectedAction : mockSelectHandler.mock.calls[7][0]});

    // deleteButton -- when an action is selected and different action button
    // is clicked, aria-pressed and pressed class of previous action before the
    // click should reset to initial state and newly selected action's
    // aria-pressed and pressed state should change to be true and present
    expect(getEditorActionButtons().get(0).props['aria-pressed']).toBe('true');
    expect(hasPressedClass(getEditorActionButtons().at(0))).toBe(true);
    expect(getEditorActionButtons().get(1).props['aria-pressed']).toBe('false');
    expect(hasPressedClass(getEditorActionButtons().at(1))).toBe(false);
});

test('blocks', () => {
    const mockChangeHandler = jest.fn();
    const mockSelectHandler = jest.fn();

    const wrapper = mount(
        <ProgramBlockEditor
            activeProgramStepNum={null}
            editingDisabled={false}
            minVisibleSteps={6}
            program={['forward', 'left', 'forward', 'left']}
            selectedAction={null}
            runButtonDisabled={false}
            onClickRunButton={()=>{}}
            onSelectAction={mockSelectHandler}
            onChange={mockChangeHandler} />,
        {
            wrappingComponent: IntlProvider,
            wrappingComponentProps: {
                locale: 'en',
                defaultLocale: 'en',
                messages: messages.en
            }
        }
    );

    // number of blocks getting rendered should be equal to minVisibleSteps
    // as minVisibleSteps is greater than the number of program steps
    expect(getProgramBlocks(wrapper).length).toBe(6);
    expect(getProgramBlocks(wrapper).get(0).key.includes('forward')).toBe(true);
    expect(getProgramBlocks(wrapper).get(1).key.includes('left')).toBe(true);
    expect(getProgramBlocks(wrapper).get(2).key.includes('forward')).toBe(true);
    expect(getProgramBlocks(wrapper).get(3).key.includes('left')).toBe(true);
    expect(getProgramBlocks(wrapper).get(4).key.includes('none')).toBe(true);
    expect(getProgramBlocks(wrapper).get(5).key.includes('none')).toBe(true);

    wrapper.setProps({selectedAction: {'action': 'add', 'type': 'editorAction'}});
    // when selected Action is add, when you press any program blocks, an empty block (none command) will be added to the previous index and set selectedCommand to null
    getProgramBlockAtPosition(wrapper, 0).simulate('click');
    expect(mockChangeHandler.mock.calls.length).toBe(1);
    expect(mockChangeHandler.mock.calls[0][0]).toStrictEqual(['none', 'forward', 'left', 'forward', 'left']);
    // No onSelectAction calls should have been made
    expect(mockSelectHandler.mock.calls.length).toBe(0);

    wrapper.setProps({program : mockChangeHandler.mock.calls[0][0]});
    wrapper.setProps({selectedAction: {'commandName' : 'right', 'type': 'command'}});
    // when selected Action is a command, change existing command at a clicked block to be selected command and set selected action back to null
    getProgramBlockAtPosition(wrapper, 0).simulate('click');
    expect(mockChangeHandler.mock.calls.length).toBe(2);
    expect(mockChangeHandler.mock.calls[1][0]).toStrictEqual(['right', 'forward', 'left', 'forward', 'left']);
    // No onSelectAction calls should have been made
    expect(mockSelectHandler.mock.calls.length).toBe(0);

    wrapper.setProps({program : mockChangeHandler.mock.calls[1][0]});
    wrapper.setProps({selectedAction: {'action' : 'delete', 'type': 'editorAction'}});
    // when selected Action is delete, when you press any program blocks, the block and its command will be removed from the program
    getProgramBlockAtPosition(wrapper, 0).simulate('click');
    expect(mockChangeHandler.mock.calls.length).toBe(3);
    expect(mockChangeHandler.mock.calls[2][0]).toStrictEqual(['forward', 'left', 'forward', 'left']);
    // No onSelectAction calls should have been made
    expect(mockSelectHandler.mock.calls.length).toBe(0);

    // repeat the test cases for the last command in the program

    wrapper.setProps({program : mockChangeHandler.mock.calls[2][0]});
    wrapper.setProps({selectedAction: {'action': 'add', 'type': 'editorAction'}});
    // when selected Action is add, when you press any program blocks, an empty block (none command) will be added to the previous index and set selectedCommand to null
    getProgramBlockAtPosition(wrapper, 3).simulate('click');
    expect(mockChangeHandler.mock.calls.length).toBe(4);
    expect(mockChangeHandler.mock.calls[3][0]).toStrictEqual(['forward', 'left', 'forward', 'none', 'left']);
    // No onSelectAction calls should have been made
    expect(mockSelectHandler.mock.calls.length).toBe(0);

    wrapper.setProps({program : mockChangeHandler.mock.calls[3][0]});
    wrapper.setProps({selectedAction: {'commandName' : 'right', 'type': 'command'}});
    // when selected Action is a command, change existing command at a clicked block to be selected command and set selected action back to null
    getProgramBlockAtPosition(wrapper, 3).simulate('click');
    expect(mockChangeHandler.mock.calls.length).toBe(5);
    expect(mockChangeHandler.mock.calls[4][0]).toStrictEqual(['forward', 'left', 'forward', 'right', 'left']);
    // No onSelectAction calls should have been made
    expect(mockSelectHandler.mock.calls.length).toBe(0);

    wrapper.setProps({program : mockChangeHandler.mock.calls[4][0]});
    wrapper.setProps({selectedAction: {'action' : 'delete', 'type': 'editorAction'}});
    // when selected Action is delete, when you press any program blocks, the block and its command will be removed from the program
    getProgramBlockAtPosition(wrapper, 3).simulate('click');
    expect(mockChangeHandler.mock.calls.length).toBe(6);
    expect(mockChangeHandler.mock.calls[5][0]).toStrictEqual(['forward', 'left', 'forward', 'left']);
    // No onSelectAction calls should have been made
    expect(mockSelectHandler.mock.calls.length).toBe(0);
})


test('Whenever active program step number updates, auto scroll to the step', () => {
    const mockScrollInto = jest.fn();

    window.HTMLElement.prototype.scrollIntoView = mockScrollInto;

    const wrapper = mount(
        <ProgramBlockEditor
            activeProgramStepNum={0}
            editingDisabled={true}
            minVisibleSteps={6}
            program={['forward', 'left', 'forward', 'left']}
            selectedAction={null}
            runButtonDisabled={false}
            onClickRunButton={()=>{}}
            onSelectAction={()=>{}}
            onChange={()=>{}} />,
        {
            wrappingComponent: IntlProvider,
            wrappingComponentProps: {
                locale: 'en',
                defaultLocale: 'en',
                messages: messages.en
            }
        }
    );

    wrapper.setProps({ activeProgramStepNum: 1 });
    expect(mockScrollInto.mock.calls.length).toBe(1);
    expect(mockScrollInto.mock.calls[0][0]).toStrictEqual({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });

    wrapper.setProps({ activeProgramStepNum: 2});

    expect(mockScrollInto.mock.calls.length).toBe(2);
    expect(mockScrollInto.mock.calls[1][0]).toStrictEqual({ behavior: 'smooth', block: 'nearest', inline: 'nearest'});

});

test('The editor action buttons disabled states are set according to the editingDisabled property', () => {
    const mockRunHandler = jest.fn();

    const wrapper = mount(
        <ProgramBlockEditor
            activeProgramStepNum={null}
            editingDisabled={false}
            minVisibleSteps={6}
            program={['forward', 'left', 'forward', 'left']}
            selectedAction={null}
            runButtonDisabled={false}
            onClickRunButton={mockRunHandler}
            onSelectAction={()=>{}}
            onChange={()=>{}} />,
        {
            wrappingComponent: IntlProvider,
            wrappingComponentProps: {
                locale: 'en',
                defaultLocale: 'en',
                messages: messages.en
            }
        }
    );

    // editingDisabled is false
    expect(getEditorActionButtons(wrapper).get(0).props.disabled).toBe(false);
    expect(getEditorActionButtons(wrapper).get(1).props.disabled).toBe(false);

    wrapper.setProps({editingDisabled: true});

    expect(getEditorActionButtons(wrapper).get(0).props.disabled).toBe(true);
    expect(getEditorActionButtons(wrapper).get(1).props.disabled).toBe(true);
});

