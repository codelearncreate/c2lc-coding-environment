// @flow

import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, mount } from 'enzyme';
import AriaDisablingButton from './AriaDisablingButton';
import LoopIterationsInput from './LoopIterationsInput';
import CommandBlock from './CommandBlock';

configure({ adapter: new Adapter() });

const defaultCommandBlockProps = {
    commandName: 'forward1',
    disabled: false,
    onClick: () => {}
};

function createMountCommandBlock(props) {
    const wrapper = mount(
        React.createElement(
            CommandBlock,
            Object.assign(
                {},
                defaultCommandBlockProps,
                props
            )
        )
    );

    return wrapper;
}

function getCommandBlock(wrapper) {
    return wrapper.find('.command-block');
}

function getAriaDiabledButton(wrapper) {
    return wrapper.find(AriaDisablingButton);
}

function getLoopIterationsInput(wrapper) {
    return wrapper.find(LoopIterationsInput);
}

describe('Rendering commands', () => {
    test('forward1', () => {
        const wrapper = createMountCommandBlock();
        expect(getCommandBlock(wrapper).get(0).props.variant).toBe('command-block--forward1');
        expect(getAriaDiabledButton(wrapper).length).toBe(1);
        expect(getLoopIterationsInput(wrapper).length).toBe(0);
    });
    test('backward1', () => {
        const wrapper = createMountCommandBlock({commandName: 'backward1'});
        expect(getCommandBlock(wrapper).get(0).props.variant).toBe('command-block--backward1');
        expect(getAriaDiabledButton(wrapper).length).toBe(1);
        expect(getLoopIterationsInput(wrapper).length).toBe(0);
    });
    test('left45', () => {
        const wrapper = createMountCommandBlock({commandName: 'left45'});
        expect(getCommandBlock(wrapper).get(0).props.variant).toBe('command-block--left45');
        expect(getAriaDiabledButton(wrapper).length).toBe(1);
        expect(getLoopIterationsInput(wrapper).length).toBe(0);
    });
    test('right45', () => {
        const wrapper = createMountCommandBlock({commandName: 'right45'});
        expect(getCommandBlock(wrapper).get(0).props.variant).toBe('command-block--right45');
        expect(getAriaDiabledButton(wrapper).length).toBe(1);
        expect(getLoopIterationsInput(wrapper).length).toBe(0);
    });
    test('startLoop editing not disabled', () => {
        const wrapper = createMountCommandBlock({
            commandName: 'startLoop',
            disabled: false,
            runningState: 'stopped',
            loopLabel: 'A',
            stepNumber: 1,
            onChangeLoopIterations: () => {}
        });
        expect(getCommandBlock(wrapper).get(0).props.variant).toBe('command-block--startLoop');
        expect(getAriaDiabledButton(wrapper).length).toBe(1);
        expect(getLoopIterationsInput(wrapper).length).toBe(1);
    });
    test('startLoop editing disabled', () => {
        const wrapper = createMountCommandBlock({
            commandName: 'startLoop',
            disabled: true
        });
        expect(getCommandBlock(wrapper).get(0).props.variant).toBe('command-block--startLoop');
        expect(getAriaDiabledButton(wrapper).length).toBe(1);
        expect(getLoopIterationsInput(wrapper).length).toBe(0);
    });
    test('endLoop', () => {
        const wrapper = createMountCommandBlock({commandName: 'endLoop'});
        expect(getCommandBlock(wrapper).get(0).props.variant).toBe('command-block--endLoop');
        expect(getAriaDiabledButton(wrapper).length).toBe(1);
        expect(getLoopIterationsInput(wrapper).length).toBe(0);
    });
});
