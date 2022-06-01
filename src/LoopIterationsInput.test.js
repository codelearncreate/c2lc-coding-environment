// @flow

import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, mount } from 'enzyme';
import LoopIterationsInput from './LoopIterationsInput';

configure({ adapter: new Adapter() });

const defaultLoopIterationsInputProps = {
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

test('Number of iterations should be rendered', () => {
    expect.assertions(1);
    const {wrapper} = createMountLoopIterationsInput();
    const loopIterationsInput = getLoopIterationsInput(wrapper);
    expect(((loopIterationsInput.getDOMNode(): any): HTMLInputElement).value).toBe('2');
});

test('Blur should call the registered callback', () => {
    expect.assertions(4);
    const {wrapper, mockOnChangeLoopIterations} = createMountLoopIterationsInput();
    const loopIterationsInput = getLoopIterationsInput(wrapper);
    expect(((loopIterationsInput.getDOMNode(): any): HTMLInputElement).value).toBe('2');

    // Change the value and check that the callback is called on blur

    ((loopIterationsInput.getDOMNode(): any): HTMLInputElement).value = '3';
    loopIterationsInput.simulate('change');
    expect(wrapper.instance().state.loopIterationsStr).toBe('3');

    loopIterationsInput.simulate('blur');
    expect(mockOnChangeLoopIterations.mock.calls.length).toBe(1);
    expect(mockOnChangeLoopIterations.mock.calls[0][2]).toBe(3);
});

test('Pressing Enter should call the registered callback', () => {
    expect.assertions(4);
    const {wrapper, mockOnChangeLoopIterations} = createMountLoopIterationsInput();
    const loopIterationsInput = getLoopIterationsInput(wrapper);
    expect(((loopIterationsInput.getDOMNode(): any): HTMLInputElement).value).toBe('2');

    // Change the value and check that the callback is called on press Enter

    ((loopIterationsInput.getDOMNode(): any): HTMLInputElement).value = '3';
    loopIterationsInput.simulate('change');
    expect(wrapper.instance().state.loopIterationsStr).toBe('3');

    loopIterationsInput.getDOMNode().dispatchEvent(new KeyboardEvent('keydown', {key: 'Enter'}));
    expect(mockOnChangeLoopIterations.mock.calls.length).toBe(1);
    expect(mockOnChangeLoopIterations.mock.calls[0][2]).toBe(3);
});

test.each(([
    new KeyboardEvent('keydown', {key: 'a', ctrlKey: true, altKey: true}), // addCommand
    new KeyboardEvent('keydown', {key: 'b', ctrlKey: true, altKey: true}), // addCommandToBeginning
    new KeyboardEvent('keydown', {key: ']', ctrlKey: true, altKey: true}), // moveToNextStep
    new KeyboardEvent('keydown', {key: '[', ctrlKey: true, altKey: true}), // moveToPreviousStep
    new KeyboardEvent('keydown', {key: 'p', ctrlKey: true, altKey: true})  // playPauseProgram
]))('Shortcuts that cause an update should call the registered callback', (keyboardEvent) => {
    expect.assertions(4);
    const {wrapper, mockOnChangeLoopIterations} = createMountLoopIterationsInput();
    const loopIterationsInput = getLoopIterationsInput(wrapper);
    expect(((loopIterationsInput.getDOMNode(): any): HTMLInputElement).value).toBe('2');

    // Change the value, send the keyboard event, and check that the callback is called

    ((loopIterationsInput.getDOMNode(): any): HTMLInputElement).value = '3';
    loopIterationsInput.simulate('change');
    expect(wrapper.instance().state.loopIterationsStr).toBe('3');

    loopIterationsInput.getDOMNode().dispatchEvent(keyboardEvent);

    expect(mockOnChangeLoopIterations.mock.calls.length).toBe(1);
    expect(mockOnChangeLoopIterations.mock.calls[0][2]).toBe(3);
});

test('Other shortcuts should not cause the registered callback to be called', () => {
    expect.assertions(3);
    const {wrapper, mockOnChangeLoopIterations} = createMountLoopIterationsInput();
    const loopIterationsInput = getLoopIterationsInput(wrapper);
    expect(((loopIterationsInput.getDOMNode(): any): HTMLInputElement).value).toBe('2');

    // Change the value, send the keyboard event, and check that the callback is not called

    ((loopIterationsInput.getDOMNode(): any): HTMLInputElement).value = '3';
    loopIterationsInput.simulate('change');
    expect(wrapper.instance().state.loopIterationsStr).toBe('3');

    loopIterationsInput.getDOMNode().dispatchEvent(new KeyboardEvent('keydown',
        {key: 'x', ctrlKey: true, altKey: true}));

    expect(mockOnChangeLoopIterations.mock.calls.length).toBe(0);
});
