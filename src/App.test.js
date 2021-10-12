// @flow
import React from 'react';
import ReactDOM from 'react-dom';
import Adapter from 'enzyme-adapter-react-16';
import IntlContainer from './IntlContainer';
import App from './App';
import { IntlProvider } from 'react-intl';
import messages from './messages.json';
import { mount, configure } from 'enzyme';
import AudioManagerImpl from './AudioManagerImpl';

// Mocks
jest.mock('./AudioManagerImpl');

configure({ adapter: new Adapter()});

function mountApp(props) {
    // $FlowFixMe: Flow doesn't know about the Jest mock API
    AudioManagerImpl.mockClear();
    const audioManagerInstance = new AudioManagerImpl(true, true, 'Sketchpad');

    // $FlowFixMe: Flow doesn't know about the Jest mock API
    const audioManagerMock = AudioManagerImpl.mock.instances[0];

    const wrapper = mount(
        React.createElement(
            App,
            Object.assign(
                { audioManager: audioManagerInstance},
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

    const app = wrapper.children().at(0);

    return {app, audioManagerMock};
};

it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<IntlContainer />, div);
    ReactDOM.unmountComponentAtNode(div);
});

it('Should play a sound when selectedCommandName changes', () => {
    const { app, audioManagerMock} = mountApp({});

    // Update the selectedAction
    app.setState({ selectedAction: "forward1"}, function () {
        expect(audioManagerMock.playAnnouncement.mock.calls.length).toBe(1);
        expect(audioManagerMock.playAnnouncement.mock.calls[0][0]).toBe('movementSelected');
        expect(audioManagerMock.playAnnouncement.mock.calls[0][2]).toStrictEqual({
            "command": "forward 1 square"
        });
    });

    app.setState({ selectedAction: null}, function () {
        expect(audioManagerMock.playAnnouncement.mock.calls.length).toBe(2);
        expect(audioManagerMock.playAnnouncement.mock.calls[1][0]).toBe('noMovementSelected');
    });
});

it('Should change showKeyboardModal when key bindings are enabled and question mark is pressed.', () => {
    const { app } = mountApp({});

    app.setState({ keyBindingsEnabled: true});

    // window.document lacks a simulate method, so we trigger a keypress this way.
    window.document.dispatchEvent(new KeyboardEvent('keydown', { key: "?"}))

    expect(app.state().showKeyboardModal).toBe(true);

    window.document.dispatchEvent(new KeyboardEvent('keydown', { key: "?"}))

    expect(app.state().showKeyboardModal).toBe(false);
});

it('Should not change showKeyboardModal when key bindings are disabled and question mark is pressed.', () => {
    const { app } = mountApp({});

    app.setState({ keyBindingsEnabled: false});

    window.document.dispatchEvent(new KeyboardEvent('keydown', { key: "?"}))

    expect(app.state().showKeyboardModal).toBe(false);

    // With the persistence, it seems like we have to manually reset this to avoid breaking the next test.
    app.setState({ keyBindingsEnabled: true});
});

it('Should be able to handle escaping out of a sequence', () => {
    const { app } = mountApp({});

    app.setState({ keyBindingsEnabled: true});

    expect(app.state().announcementsEnabled).toBe(true);

    const sequenceWithEscape = [
        new KeyboardEvent('keydown', { code: "KeyX", ctrlKey: true, altKey: true }),
        new KeyboardEvent('keydown', { code: "KeyA" }),
        // At this point our sequence of (Ctrl+Alt+x, a) matches the beginning
        // part of the 'select action' group of sequences.
        // Sending an Escape will break us out of the in-progress sequence.
        new KeyboardEvent('keydown', { key: "Escape" }),
        // So that we can send the key sequence to toggle the announcements
        new KeyboardEvent('keydown', { code: "KeyX", ctrlKey: true, altKey: true }),
        new KeyboardEvent('keydown', { code: "KeyX" }),
    ];

    for (const keyboardEvent of sequenceWithEscape) {
        window.document.dispatchEvent(keyboardEvent);
    }

    expect(app.state().announcementsEnabled).toBe(false);
});
