// @flow

import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, mount } from 'enzyme';
import Character from './Character';

configure({ adapter: new Adapter() });

const defaultCharacterProps = {
    world: 'default',
    transform: '',
    width: 3
};

function createMountCharacter(props) {
    const wrapper = mount(
        React.createElement(
            Character,
            Object.assign(
                {},
                defaultCharacterProps,
                props
            )
        )
    );

    return wrapper;
}

function findCharacter(wrapper) {
    return wrapper.find('.Character__icon');
}

describe('Right character should render based on theme props', () => {
    test('default', () => {
        expect.assertions(1);
        const wrapper = createMountCharacter();
        expect(findCharacter(wrapper).get(0).type.render().props.children).toBe('Robot.svg');
    });
    test('forest', () => {
        expect.assertions(1);
        const wrapper = createMountCharacter({world: 'forest'});
        expect(findCharacter(wrapper).get(0).type.render().props.children).toBe('Rabbit.svg');
    });
    test('space', () => {
        expect.assertions(1);
        const wrapper = createMountCharacter({world: 'space'});
        expect(findCharacter(wrapper).get(0).type.render().props.children).toBe('SpaceShip.svg');
    });
})

test('Scene area scrolls so the character is visible on mount and transform propert changes', () => {
    expect.assertions(4);
    const mockScrollIntoView = jest.fn();

    window.HTMLElement.prototype.scrollIntoView = mockScrollIntoView;

    const wrapper = createMountCharacter();

    // When the component mounts, call scrollIntoView
    expect(mockScrollIntoView.mock.calls.length).toBe(1);
    expect(mockScrollIntoView.mock.calls[0][0]).toStrictEqual({
        behavior: 'auto',
        block: 'nearest',
        inline: 'nearest'
    });

    wrapper.setProps(
        {transform: 'translate(0 0 rotate(90 0 0)'}
    );
    expect(mockScrollIntoView.mock.calls.length).toBe(2);
    expect(mockScrollIntoView.mock.calls[1][0]).toStrictEqual({
        behavior: 'auto',
        block: 'nearest',
        inline: 'nearest'
    });
});
