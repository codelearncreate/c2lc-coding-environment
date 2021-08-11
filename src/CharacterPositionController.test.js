// @flow

import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, mount, shallow } from 'enzyme';
import { createIntl, IntlProvider } from 'react-intl';
import CharacterState from './CharacterState';
import SceneDimensions from './SceneDimensions';
import messages from './messages.json';
import CharacterPositionController from './CharacterPositionController';
import * as TestUtils from './TestUtils';

configure({ adapter: new Adapter()});

const defaultCharacterPositionControllerProps = {
    interpreterIsRunning: false,
    characterState: new CharacterState(1, 1, 2, [], new SceneDimensions(1, 100, 1, 100)),
    editingDisabled: false,
    world: 'default'
};

function createShallowCharacterPositionController(props) {
    const intl = createIntl({
        locale: 'en',
        defaultLocale: 'en',
        messages: messages.en
    });

    const mockChangeCharacterPosition = jest.fn();
    const mockChangeCharacterXPosition = jest.fn();
    const mockChangeCharacterYPosition = jest.fn();

    const wrapper: $FlowIgnoreType = shallow(
        React.createElement(
            CharacterPositionController.WrappedComponent,
            Object.assign(
                {},
                defaultCharacterPositionControllerProps,
                {
                    intl: intl,
                    onChangeCharacterPosition: mockChangeCharacterPosition,
                    onChangeCharacterXPosition: mockChangeCharacterXPosition,
                    onChangeCharacterYPosition: mockChangeCharacterYPosition
                },
                props
            )
        )
    );

    return {
        wrapper,
        mockChangeCharacterPosition,
        mockChangeCharacterXPosition,
        mockChangeCharacterYPosition,
    };
}

function createMountCharacterPositionController(props) {
    const mockChangeCharacterPosition = jest.fn();
    const mockChangeCharacterXPosition = jest.fn();
    const mockChangeCharacterYPosition = jest.fn();

    const wrapper = mount(
        React.createElement(
            CharacterPositionController,
            Object.assign(
                {},
                defaultCharacterPositionControllerProps,
                {
                    onChangeCharacterPosition: mockChangeCharacterPosition,
                    onChangeCharacterXPosition: mockChangeCharacterXPosition,
                    onChangeCharacterYPosition: mockChangeCharacterYPosition
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
        mockChangeCharacterPosition,
        mockChangeCharacterXPosition,
        mockChangeCharacterYPosition
    };
}

function getCharacterPositionButton(characterPositionControllerWrapper, directionName) {
    return characterPositionControllerWrapper.find('.CharacterPositionController__character-position-button').filter({value: directionName}).at(0);
}

function getCharacterPositionCoordinateBoxes(characterPositionControllerWrapper) {
    return characterPositionControllerWrapper.find('.ProgramBlock__character-position-coordinate-box');
}

function getCharacterIcon(characterPositionControllerWrapper) {
    return characterPositionControllerWrapper.find('.CharacterPositionController__character-column-character');
}

describe('Using change character position buttons', () => {
    test.each([
        'turnLeft', 'turnRight', 'up', 'right', 'down', 'left'
    ])('Click/Press %s button ', (directionName) => {
        expect.assertions(4);
        const { wrapper, mockChangeCharacterPosition } = createMountCharacterPositionController();
        const characterPositionButton = getCharacterPositionButton(wrapper, directionName);

        characterPositionButton.simulate('click');
        expect(mockChangeCharacterPosition.mock.calls.length).toBe(1);
        expect(mockChangeCharacterPosition.mock.calls[0][0]).toBe(directionName);

        characterPositionButton.simulate('keydown', { key: ' ' });
        expect(mockChangeCharacterPosition.mock.calls.length).toBe(2);
        expect(mockChangeCharacterPosition.mock.calls[1][0]).toBe(directionName);
    });
    test.each([
        'turnLeft', 'turnRight', 'up', 'right', 'down', 'left'
    ])('Click/Press %s button when editingDisabled Prop is true', (directionName) => {
        expect.assertions(3);
        const { wrapper, mockChangeCharacterPosition } = createMountCharacterPositionController({editingDisabled: true});
        const characterPositionButton = getCharacterPositionButton(wrapper, directionName);
        expect(characterPositionButton.get(0).props.className.includes('--disabled')).toBe(true);

        characterPositionButton.simulate('click');
        expect(mockChangeCharacterPosition.mock.calls.length).toBe(0);
        characterPositionButton.simulate('keydown', { key: ' ' });
        expect(mockChangeCharacterPosition.mock.calls.length).toBe(0);
    });
});

describe('Using change character position by column/row labels', () => {
    test('Changing x position', () => {
        expect.assertions(6);
        const { wrapper, mockChangeCharacterXPosition } = createShallowCharacterPositionController();
        const characterXPositionCoordinateBox = getCharacterPositionCoordinateBoxes(wrapper).at(0);
        const sampleXPosition = 'X';
        const secondSampleXPosition = 'A';
        const currentTarget = (value: string) => ({
            name: 'xPosition',
            value
        });

        characterXPositionCoordinateBox.simulate('change',
            TestUtils.makeChangeEvent(currentTarget(sampleXPosition)));
        wrapper.update();
        expect(wrapper.instance().state.characterColumnLabel).toBe(sampleXPosition);

        characterXPositionCoordinateBox.simulate('blur',
            TestUtils.makeBlurEvent(currentTarget(sampleXPosition)));
        expect(mockChangeCharacterXPosition.mock.calls.length).toBe(1);
        expect(mockChangeCharacterXPosition.mock.calls[0][0]).toBe(sampleXPosition);

        characterXPositionCoordinateBox.simulate('change',
            TestUtils.makeChangeEvent(currentTarget(secondSampleXPosition)));
        wrapper.update();
        expect(wrapper.instance().state.characterColumnLabel).toBe(secondSampleXPosition);

        characterXPositionCoordinateBox.simulate('keyDown',
            TestUtils.makeKeyDownEvent(currentTarget(secondSampleXPosition), 'Enter'));
        expect(mockChangeCharacterXPosition.mock.calls.length).toBe(2);
        expect(mockChangeCharacterXPosition.mock.calls[1][0]).toBe(secondSampleXPosition);
    });
    test('Changing y position', () => {
        expect.assertions(6);
        const { wrapper, mockChangeCharacterYPosition } = createShallowCharacterPositionController();
        const characterYPositionCoordinateBox = getCharacterPositionCoordinateBoxes(wrapper).at(1);
        const sampleYPosition = '2';
        const secondSampleYPosition = '8';
        const currentTarget = (value: string) => ({
            name: 'yPosition',
            value
        });

        characterYPositionCoordinateBox.simulate('change',
            TestUtils.makeChangeEvent(currentTarget(sampleYPosition)));
        wrapper.update();
        expect(wrapper.instance().state.characterRowLabel).toBe(sampleYPosition);

        characterYPositionCoordinateBox.simulate('blur',
            TestUtils.makeBlurEvent(currentTarget(sampleYPosition)));
        expect(mockChangeCharacterYPosition.mock.calls.length).toBe(1);
        expect(mockChangeCharacterYPosition.mock.calls[0][0]).toBe(sampleYPosition);

        characterYPositionCoordinateBox.simulate('change',
            TestUtils.makeChangeEvent(currentTarget(secondSampleYPosition)));
        wrapper.update();
        expect(wrapper.instance().state.characterRowLabel).toBe(secondSampleYPosition);

        characterYPositionCoordinateBox.simulate('keyDown',
            TestUtils.makeKeyDownEvent(currentTarget(secondSampleYPosition), 'Enter'));
        expect(mockChangeCharacterYPosition.mock.calls.length).toBe(2);
        expect(mockChangeCharacterYPosition.mock.calls[1][0]).toBe(secondSampleYPosition);
    });
    test('Changing world changes the character icon', () => {
        expect.assertions(2);
        const { wrapper } = createShallowCharacterPositionController();
        wrapper.setProps({world: 'space'});
        expect(getCharacterIcon(wrapper).get(0).type.render().props.children).toBe('SpaceShip.svg');
        wrapper.setProps({world: 'forest'});
        expect(getCharacterIcon(wrapper).get(0).type.render().props.children).toBe('Rabbit.svg');
    });
    test('Character icon gets transform value to match the character in the scene', () => {
        expect.assertions(3);
        const { wrapper } = createShallowCharacterPositionController();
        // With default character facing right
        expect(getCharacterIcon(wrapper).get(0).props.transform).toBe('rotate(0 0 0)');
        // Set characterState prop to make the character face down
        wrapper.setProps({characterState: new CharacterState(1, 1, 4, [], new SceneDimensions(1, 100, 1, 100))});
        expect(getCharacterIcon(wrapper).get(0).props.transform).toBe('rotate(90 0 0)');
        // Set characterState prop to make the character face up
        wrapper.setProps({characterState: new CharacterState(1, 1, 0, [], new SceneDimensions(1, 100, 1, 100))});
        expect(getCharacterIcon(wrapper).get(0).props.transform).toBe('rotate(-90 0 0)');
    })
});
