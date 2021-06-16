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
    world: 'default'
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
        expect(document.getElementById('someAriaLiveRegionId').innerText).toBe('Robot character at column A, row 1 facing right');
        wrapper.setProps({runningState: 'stopped', world: 'forest', characterState: new CharacterState(2, 1, 2, [], new SceneDimensions(1, 100, 1, 100))});
        // $FlowFixMe: Flow doesn't know about character-position div
        expect(document.getElementById('someAriaLiveRegionId').innerText).toBe('Rabbit character at column B, row 1 facing right');
        wrapper.setProps({runningState: 'stopped', world: 'space', characterState: new CharacterState(3, 1, 2, [], new SceneDimensions(1, 100, 1, 100))});
        // $FlowFixMe: Flow doesn't know about character-position div
        expect(document.getElementById('someAriaLiveRegionId').innerText).toBe('Space Ship character at column C, row 1 facing right');
    });
    test('When runningState prop is changed', () => {
        const wrapper = createMountCharacterAriaLive();
        wrapper.setProps({ runningState: 'pauseRequested', world: 'forest' });
        // $FlowFixMe: Flow doesn't know about character-position div
        expect(document.getElementById('someAriaLiveRegionId').innerText).toBe('Rabbit character at column A, row 1 facing right');
        wrapper.setProps({ runningState: 'stopRequested', world: 'space' });
        // $FlowFixMe: Flow doesn't know about character-position div
        expect(document.getElementById('someAriaLiveRegionId').innerText).toBe('Space Ship character at column A, row 1 facing right');
        wrapper.setProps({ runningState: 'running', world: 'default' });
        // $FlowFixMe: Flow doesn't know about character-position div
        expect(document.getElementById('someAriaLiveRegionId').innerText).toBe('Robot character is moving');
        wrapper.setProps({ runningState: 'stopped' });
        // $FlowFixMe: Flow doesn't know about character-position div
        expect(document.getElementById('someAriaLiveRegionId').innerText).toBe('Robot character at column A, row 1 facing right');
    })
});
