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
    ariaHidden: false,
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

function getAriaHidden() {
    // $FlowFixMe: getElementById might return null, no need to handle as the test will fail
    return document.getElementById('someAriaLiveRegionId').getAttribute('aria-hidden');
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

test('Given ariaHidden is initially false, then the live region has aria-hidden false', () => {
    expect.assertions(1);
    createMountCharacterAriaLive({
        ariaHidden: false
    });
    expect(getAriaHidden()).toBe('false');
});

test('Given ariaHidden is initially true, then the live region has aria-hidden true', () => {
    expect.assertions(1);
    createMountCharacterAriaLive({
        ariaHidden: true
    });
    expect(getAriaHidden()).toBe('true');
});

test('When the ariaHidden property is changed, then the live region is updated', () => {
    expect.assertions(3);
    const wrapper = createMountCharacterAriaLive({
        ariaHidden: false
    });
    expect(getAriaHidden()).toBe('false');
    wrapper.setProps({ ariaHidden: true });
    expect(getAriaHidden()).toBe('true');
    wrapper.setProps({ ariaHidden: false });
    expect(getAriaHidden()).toBe('false');
});
