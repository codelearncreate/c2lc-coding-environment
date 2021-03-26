// @flow

import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, mount } from 'enzyme';
// $FlowFixMe: Flow doesn't know that the RawIntlProvider exists.
import { createIntl, RawIntlProvider } from 'react-intl';
import messages from './messages.json';
import WorldSelector from './WorldSelector';
import type {WorldName} from './types';

configure({ adapter: new Adapter() });

const intl = createIntl({
    locale: 'en',
    defaultLocale: 'en',
    messages: messages.en
});

type WorldSelectorTestWrapperProps = {
    onSelect: (value: WorldName) => void
}

type WorldSelectorTestWrapperState = {
    world: WorldName
}

class WorldSelectorTestWrapper extends React.Component<WorldSelectorTestWrapperProps, WorldSelectorTestWrapperState> {
    constructor (props) {
        super(props);
        this.state = {
            world: 'default'
        }
    }

    onSelect = (worldName: WorldName) => {
        this.setState({ world: worldName});
        this.props.onSelect(worldName);
    };

    render () {
        return (<RawIntlProvider value={intl}>
            <WorldSelector
                world={this.state.world}
                onSelect={this.onSelect}
            />
        </RawIntlProvider>);
    }
}

function createMountWorldSelector(props) {
    const mockOnSelectHandler = jest.fn();
    const worldSelectorTestWrapper = mount(<WorldSelectorTestWrapper onSelect={mockOnSelectHandler}/>);
    const worldSelector = worldSelectorTestWrapper.find(WorldSelector).childAt(0);

    return { worldSelector, worldSelectorTestWrapper, mockOnSelectHandler };
}

describe('When rendering the WorldSelector', () => {
    test('it should be possible to select a world using mouse input.', () => {
        const {worldSelector, worldSelectorTestWrapper, mockOnSelectHandler} = createMountWorldSelector();

        const robotIcon = worldSelector.childAt(0).childAt(1);
        const rabbitIcon = worldSelector.childAt(0).childAt(2);
        const spaceShipIcon = worldSelector.childAt(0).childAt(3);

        rabbitIcon.simulate('click');

        expect(mockOnSelectHandler.mock.calls.length).toBe(1);
        expect(mockOnSelectHandler.mock.calls[0][0]).toBe('forest');
        expect(worldSelectorTestWrapper.state('world')).toBe('forest');


        spaceShipIcon.simulate('click');

        expect(mockOnSelectHandler.mock.calls.length).toBe(2);
        expect(mockOnSelectHandler.mock.calls[1][0]).toBe('space');
        expect(worldSelectorTestWrapper.state('world')).toBe('space');

        robotIcon.simulate('click');

        expect(mockOnSelectHandler.mock.calls.length).toBe(3);
        expect(mockOnSelectHandler.mock.calls[2][0]).toBe('default');
        expect(worldSelectorTestWrapper.state('world')).toBe('default');
    });

    test('it should be possible to select a world using keyboard input.', () => {
        const {worldSelector, worldSelectorTestWrapper, mockOnSelectHandler} = createMountWorldSelector();

        const robotIcon = worldSelector.childAt(0).childAt(1);
        const rabbitIcon = worldSelector.childAt(0).childAt(2);
        const spaceShipIcon = worldSelector.childAt(0).childAt(3);

        rabbitIcon.simulate('keyDown', {key: ' '});

        expect(mockOnSelectHandler.mock.calls.length).toBe(1);
        expect(mockOnSelectHandler.mock.calls[0][0]).toBe('forest');
        expect(worldSelectorTestWrapper.state('world')).toBe('forest');


        spaceShipIcon.simulate('keyDown', {key: ' '});

        expect(mockOnSelectHandler.mock.calls.length).toBe(2);
        expect(mockOnSelectHandler.mock.calls[1][0]).toBe('space');
        expect(worldSelectorTestWrapper.state('world')).toBe('space');

        robotIcon.simulate('keyDown', {key: ' '});

        expect(mockOnSelectHandler.mock.calls.length).toBe(3);
        expect(mockOnSelectHandler.mock.calls[2][0]).toBe('default');
        expect(worldSelectorTestWrapper.state('world')).toBe('default');
    });

    test('all icons should have ARIA labels.', () => {
        const {worldSelector} = createMountWorldSelector();

        const worldIcon = worldSelector.childAt(0).childAt(0)
        expect(worldIcon.prop('aria-label')).toBe("World");

        const robotIcon = worldSelector.childAt(0).childAt(1);
        expect(robotIcon.prop('aria-label')).toBe(intl.messages['WorldSelector.world.default']);

        const rabbitIcon = worldSelector.childAt(0).childAt(2);
        expect(rabbitIcon.prop('aria-label')).toBe(intl.messages['WorldSelector.world.forest']);

        const spaceShipIcon = worldSelector.childAt(0).childAt(3);
        expect(spaceShipIcon.prop('aria-label')).toBe(intl.messages['WorldSelector.world.space']);
    });
});
