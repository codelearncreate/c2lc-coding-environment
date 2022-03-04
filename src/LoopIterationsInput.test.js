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
    runningState: 'stopped'
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

test('Blur and press Enter should call the registered callback', () => {
    expect.assertions(7);
    const {wrapper, mockOnChangeLoopIterations} = createMountLoopIterationsInput();
    const loopIterationsInput = getLoopIterationsInput(wrapper);
    expect(((loopIterationsInput.getDOMNode(): any): HTMLInputElement).value).toBe('2');

    // Change the value and check that the callback is called on blur

    ((loopIterationsInput.getDOMNode(): any): HTMLInputElement).value = '4';

    loopIterationsInput.simulate('change');
    expect(wrapper.instance().state.loopIterationsStr).toBe('4');

    loopIterationsInput.simulate('blur');
    expect(mockOnChangeLoopIterations.mock.calls.length).toBe(1);
    expect(mockOnChangeLoopIterations.mock.calls[0][2]).toBe(4);

    // Change the value and check that the callback is called on press Enter

    ((loopIterationsInput.getDOMNode(): any): HTMLInputElement).value = '3';

    loopIterationsInput.simulate('change');
    expect(wrapper.instance().state.loopIterationsStr).toBe('3');

    loopIterationsInput.simulate('keyDown', {key: 'Enter'});
    expect(mockOnChangeLoopIterations.mock.calls.length).toBe(2);
    expect(mockOnChangeLoopIterations.mock.calls[1][2]).toBe(3);
});
