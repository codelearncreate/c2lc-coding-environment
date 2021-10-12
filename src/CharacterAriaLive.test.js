// @flow

import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, mount } from 'enzyme';
import { IntlProvider } from 'react-intl';
import CharacterAriaLive from './CharacterAriaLive';
import CharacterState from './CharacterState';
import SceneDimensions from './SceneDimensions';
import messages from './messages.json';

configure({ adapter: new Adapter()});

const defaultCharacterAriaLiveProps = {
    ariaLiveRegionId: 'someAriaLiveRegionId',
    characterState: new CharacterState(1, 1, 2, [], new SceneDimensions(1, 100, 1, 100)),
    runningState: 'stopped',
    world: 'Sketchpad'
};

function createMountCharacterAriaLive(props) {
    const ariaLiveDiv = document.createElement('div');
    ariaLiveDiv.setAttribute('id', 'someAriaLiveRegionId');
    // $FlowFixMe: Flow doesn't know about document.body
    document.body.appendChild(ariaLiveDiv);

    const wrapper = mount(
        React.createElement(
            CharacterAriaLive,
            Object.assign(
                {},
                defaultCharacterAriaLiveProps,
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

    return wrapper;
}


describe('Character position gets updated on character-position div', () => {
    test('When characterState prop is changed', () => {
        const wrapper = createMountCharacterAriaLive();
        wrapper.setProps({
            characterState: new CharacterState(1, 1, 2, [], new SceneDimensions(1, 100, 1, 100))
        });
        // $FlowFixMe: Flow doesn't know about character-position div
        expect(document.getElementById('someAriaLiveRegionId').innerText).toBe('the robot is at column A, row 1 facing right');
        wrapper.setProps({runningState: 'stopped', world: 'Jungle', characterState: new CharacterState(2, 1, 2, [], new SceneDimensions(1, 100, 1, 100))});
        // $FlowFixMe: Flow doesn't know about character-position div
        expect(document.getElementById('someAriaLiveRegionId').innerText).toBe('the jeep is at column B, row 1 facing right');
        wrapper.setProps({runningState: 'stopped', world: 'Space', characterState: new CharacterState(3, 1, 2, [], new SceneDimensions(1, 100, 1, 100))});
        // $FlowFixMe: Flow doesn't know about character-position div
        expect(document.getElementById('someAriaLiveRegionId').innerText).toBe('the spaceship is at column C, row 1 facing right on the Moon');
    });
    test('When runningState prop is changed', () => {
        const wrapper = createMountCharacterAriaLive();
        wrapper.setProps({ runningState: 'pauseRequested', world: 'Jungle' });
        // $FlowFixMe: Flow doesn't know about character-position div
        expect(document.getElementById('someAriaLiveRegionId').innerText).toBe('the jeep is at column A, row 1 facing right');
        wrapper.setProps({ runningState: 'stopRequested', world: 'Space' });
        // $FlowFixMe: Flow doesn't know about character-position div
        expect(document.getElementById('someAriaLiveRegionId').innerText).toBe('the spaceship is at column A, row 1 facing right on the Earth');
        wrapper.setProps({ runningState: 'running', world: 'Sketchpad' });
        // $FlowFixMe: Flow doesn't know about character-position div
        expect(document.getElementById('someAriaLiveRegionId').innerText).toBe('the robot is moving');
        wrapper.setProps({ runningState: 'stopped' });
        // $FlowFixMe: Flow doesn't know about character-position div
        expect(document.getElementById('someAriaLiveRegionId').innerText).toBe('the robot is at column A, row 1 facing right');
    })
});
