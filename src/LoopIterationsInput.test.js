// @flow

import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, mount } from 'enzyme';
import LoopIterationsInput from './LoopIterationsInput';

configure({ adapter: new Adapter() });

const defaultLoopIterationsInputProps = {
    loopIterationsAriaLabel: 'Number of iterations for loop A',
    loopIterationsStr: '2',
    loopLabel: 'A',
    stepNumber: 2,
    runningState: 'stopped',
    keyboardInputSchemeName: 'controlalt'
};

function createMountLoopIterationsInput(props) {
    const mockOnChangeLoopIterations = jest.fn();
    const wrapper = mount(
        React.createElement(
            LoopIterationsInput,
            Object.assign(
                {},
                defaultLoopIterationsInputProps,
                { onChangeLoopIterations: mockOnChangeLoopIterations },
                props
            )
        )
    );
    return { wrapper, mockOnChangeLoopIterations };
}

function getLoopIterationsInput(wrapper) {
    return wrapper.find('.command-block-loop-iterations');
}

function getLoopIterationsInputValue(wrapper): string {
    return ((wrapper.find('.command-block-loop-iterations').getDOMNode(): any): HTMLInputElement).value;
}

test('Number of iterations should be rendered', () => {
    expect.assertions(1);
    const {wrapper} = createMountLoopIterationsInput();
    expect(getLoopIterationsInputValue(wrapper)).toBe('2');
});

test('Blur should call the registered callback if the user changed the value', () => {
    expect.assertions(4);
    const {wrapper, mockOnChangeLoopIterations} = createMountLoopIterationsInput();
    expect(getLoopIterationsInputValue(wrapper)).toBe('2');

    // Change the value and check that the callback is called on blur

    const loopIterationsInput = getLoopIterationsInput(wrapper);
    ((loopIterationsInput.getDOMNode(): any): HTMLInputElement).value = '3';
    loopIterationsInput.simulate('change');
    expect(wrapper.instance().state.loopIterationsStr).toBe('3');

    loopIterationsInput.simulate('blur');
    expect(mockOnChangeLoopIterations.mock.calls.length).toBe(1);
    expect(mockOnChangeLoopIterations.mock.calls[0][2]).toBe(3);
});

test('Blur should not call the registered callback if the user has not changed the value', () => {
    expect.assertions(2);
    const {wrapper, mockOnChangeLoopIterations} = createMountLoopIterationsInput();
    expect(getLoopIterationsInputValue(wrapper)).toBe('2');

    const loopIterationsInput = getLoopIterationsInput(wrapper);
    loopIterationsInput.simulate('blur');
    expect(mockOnChangeLoopIterations.mock.calls.length).toBe(0);
});

test('Pressing Enter should call the registered callback', () => {
    expect.assertions(4);
    const {wrapper, mockOnChangeLoopIterations} = createMountLoopIterationsInput();
    expect(getLoopIterationsInputValue(wrapper)).toBe('2');

    // Change the value and check that the callback is called on press Enter

    const loopIterationsInput = getLoopIterationsInput(wrapper);
    ((loopIterationsInput.getDOMNode(): any): HTMLInputElement).value = '3';
    loopIterationsInput.simulate('change');
    expect(wrapper.instance().state.loopIterationsStr).toBe('3');

    loopIterationsInput.getDOMNode().dispatchEvent(new KeyboardEvent('keydown', {key: 'Enter'}));
    expect(mockOnChangeLoopIterations.mock.calls.length).toBe(1);
    expect(mockOnChangeLoopIterations.mock.calls[0][2]).toBe(3);
});

const shortcutKeyboardEvents = [
    new KeyboardEvent('keydown', {key: 'a', ctrlKey: true, altKey: true}), // addCommand
    new KeyboardEvent('keydown', {key: 'b', ctrlKey: true, altKey: true}), // addCommandToBeginning
    new KeyboardEvent('keydown', {key: ']', ctrlKey: true, altKey: true}), // moveToNextStep
    new KeyboardEvent('keydown', {key: '[', ctrlKey: true, altKey: true}), // moveToPreviousStep
    new KeyboardEvent('keydown', {key: 'p', ctrlKey: true, altKey: true})  // playPauseProgram
];

test.each(shortcutKeyboardEvents)('Shortcuts that cause an update should call the registered callback if the user changed the value', (keyboardEvent) => {
    expect.assertions(4);
    const {wrapper, mockOnChangeLoopIterations} = createMountLoopIterationsInput();
    expect(getLoopIterationsInputValue(wrapper)).toBe('2');

    // Change the value, send the keyboard event, and check that the callback is called

    const loopIterationsInput = getLoopIterationsInput(wrapper);
    ((loopIterationsInput.getDOMNode(): any): HTMLInputElement).value = '3';
    loopIterationsInput.simulate('change');
    expect(wrapper.instance().state.loopIterationsStr).toBe('3');

    loopIterationsInput.getDOMNode().dispatchEvent(keyboardEvent);

    expect(mockOnChangeLoopIterations.mock.calls.length).toBe(1);
    expect(mockOnChangeLoopIterations.mock.calls[0][2]).toBe(3);
});

test.each(shortcutKeyboardEvents)('Shortcuts that cause an update should not call the registered callback if the user has not changed the value', (keyboardEvent) => {
    expect.assertions(2);
    const {wrapper, mockOnChangeLoopIterations} = createMountLoopIterationsInput();
    expect(getLoopIterationsInputValue(wrapper)).toBe('2');

    const loopIterationsInput = getLoopIterationsInput(wrapper);
    loopIterationsInput.getDOMNode().dispatchEvent(keyboardEvent);
    expect(mockOnChangeLoopIterations.mock.calls.length).toBe(0);
});

test('Other shortcuts should not cause the registered callback to be called', () => {
    expect.assertions(3);
    const {wrapper, mockOnChangeLoopIterations} = createMountLoopIterationsInput();
    expect(getLoopIterationsInputValue(wrapper)).toBe('2');

    // Change the value, send the keyboard event, and check that the callback is not called

    const loopIterationsInput = getLoopIterationsInput(wrapper);
    ((loopIterationsInput.getDOMNode(): any): HTMLInputElement).value = '3';
    loopIterationsInput.simulate('change');
    expect(wrapper.instance().state.loopIterationsStr).toBe('3');

    loopIterationsInput.getDOMNode().dispatchEvent(new KeyboardEvent('keydown',
        {key: 'x', ctrlKey: true, altKey: true}));

    expect(mockOnChangeLoopIterations.mock.calls.length).toBe(0);
});
