// @flow

import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, shallow } from 'enzyme';
import ToggleSwitch from './ToggleSwitch';

configure({ adapter: new Adapter()});

function createShallowToggleSwitch(props) {
    const mockChangeHandler = jest.fn();

    const wrapper = shallow(
        React.createElement(
            ToggleSwitch,
            Object.assign(
                {
                    disabled: false,
                    ariaLabel: '',
                    value: false,
                    className: undefined,
                    contentsTrue: '',
                    contentsFalse: '',
                    onChange: mockChangeHandler
                },
                props
            )
        )
    );

    return {
        wrapper,
        mockChangeHandler
    };
}

function getToggleSwitch(toggleSwitchWrapper) {
    return toggleSwitchWrapper.find('.ToggleSwitch').at(0);
}

describe('Given value property is false', () => {
    let wrapper, mockChangeHandler;
    const toggleValue = false;

    beforeEach(() => {
        ({ wrapper, mockChangeHandler } = createShallowToggleSwitch({
            value: toggleValue,
            contentsTrue: 'contentsTrue',
            contentsFalse: 'contentsFalse'
        }));
    });

    test('It should be unchecked', () => {
        expect.assertions(2);
        const toggleSwitch = getToggleSwitch(wrapper);
        expect(toggleSwitch.prop('aria-checked')).toBe(false);
        expect(toggleSwitch.hasClass('ToggleSwitch--checked')).toBe(false);
    });

    test('When the value property is false, contentsFalse should be rendered', () => {
        expect.assertions(1);
        const toggleSwitch = getToggleSwitch(wrapper);
        expect(toggleSwitch.children().props().children).toBe('contentsFalse');
    });

    test('When clicked, then onChange handler should be called with negation of the value property', () => {
        expect.assertions(2);
        const toggleSwitch = getToggleSwitch(wrapper);
        toggleSwitch.simulate('click');
        expect(mockChangeHandler.mock.calls.length).toBe(1);
        expect(mockChangeHandler.mock.calls[0][0]).toBe(!toggleValue);
    });

    test('When space key is pressed, then onChange handler should be called with negation of the value property', () => {
        expect.assertions(2);
        const toggleSwitch = getToggleSwitch(wrapper);
        toggleSwitch.simulate('keyDown', {key: ' ', preventDefault: ()=>{}});
        expect(mockChangeHandler.mock.calls.length).toBe(1);
        expect(mockChangeHandler.mock.calls[0][0]).toBe(!toggleValue);
    });

    test('When enter key is pressed, then onChange handler should be called with negation of the value property', () => {
        expect.assertions(2);
        const toggleSwitch = getToggleSwitch(wrapper);
        toggleSwitch.simulate('keyDown', {key: 'Enter', preventDefault: ()=>{}});
        expect(mockChangeHandler.mock.calls.length).toBe(1);
        expect(mockChangeHandler.mock.calls[0][0]).toBe(!toggleValue);
    });
});

describe('Given value property is true', () => {
    let wrapper, mockChangeHandler;
    const toggleValue = true;

    beforeEach(() => {
        ({ wrapper, mockChangeHandler } = createShallowToggleSwitch({
            value: toggleValue,
            contentsTrue: 'contentsTrue',
            contentsFalse: 'contentsFalse'
        }));
    });

    test('It should be checked', () => {
        expect.assertions(2);
        const toggleSwitch = getToggleSwitch(wrapper);
        expect(toggleSwitch.prop('aria-checked')).toBe(true);
        expect(toggleSwitch.hasClass('ToggleSwitch--checked')).toBe(true);
    });

    test('When the value property is true, contentsTrue should be rendered', () => {
        expect.assertions(1);
        const toggleSwitch = getToggleSwitch(wrapper);
        expect(toggleSwitch.children().props().children).toBe('contentsTrue');
    });

    test('When clicked, then onChange handler should be called with negation of the value property', () => {
        expect.assertions(2);
        const toggleSwitch = getToggleSwitch(wrapper);
        toggleSwitch.simulate('click');
        expect(mockChangeHandler.mock.calls.length).toBe(1);
        expect(mockChangeHandler.mock.calls[0][0]).toBe(!toggleValue);
    });

    test('When space key is pressed, then onChange handler should be called with negation of the value property', () => {
        expect.assertions(2);
        const toggleSwitch = getToggleSwitch(wrapper);
        toggleSwitch.simulate('keyDown', {key: ' ', preventDefault: ()=>{}});
        expect(mockChangeHandler.mock.calls.length).toBe(1);
        expect(mockChangeHandler.mock.calls[0][0]).toBe(!toggleValue);
    });
});

describe('When there is className property', () => {
    test('className should include the property', () => {
        expect.assertions(1);
        const className = 'testing';
        const { wrapper } = createShallowToggleSwitch({ className: className });
        const toggleSwitch = getToggleSwitch(wrapper);
        expect(toggleSwitch.prop('className').includes(className)).toBe(true);
    });
});

describe('Given the ToggleSwitch is disabed', () => {
    let wrapper, mockChangeHandler;

    beforeEach(() => {
        ({ wrapper, mockChangeHandler } = createShallowToggleSwitch({
            disabled: true
        }));
    });

    test('Then aria-disabled should be set to true', () => {
        expect.assertions(2);
        const toggleSwitch = getToggleSwitch(wrapper);
        expect(toggleSwitch.props()['aria-disabled']).toBe(true);
        expect(toggleSwitch.props().tabIndex).toBe('0');
    });

    test('When clicked, then the onChange handler should not be called', () => {
        expect.assertions(1);
        const toggleSwitch = getToggleSwitch(wrapper);
        toggleSwitch.simulate('click');
        expect(mockChangeHandler.mock.calls.length).toBe(0);
    });

    test('When the space key is pressed, then the onChange handler should not be called', () => {
        expect.assertions(1);
        const toggleSwitch = getToggleSwitch(wrapper);
        toggleSwitch.simulate('keyDown', {key: ' ', preventDefault: ()=>{}});
        expect(mockChangeHandler.mock.calls.length).toBe(0);
    });
});
