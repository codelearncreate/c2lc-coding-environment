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
    const audioManagerInstance = new AudioManagerImpl(true, true);

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
        expect(audioManagerMock.playFeedbackAnnouncement.mock.calls.length).toBe(1);
        expect(audioManagerMock.playFeedbackAnnouncement.mock.calls[0][0]).toBe('movement forward 1 square selected');
    });

    app.setState({ selectedAction: null}, function () {
        expect(audioManagerMock.playFeedbackAnnouncement.mock.calls.length).toBe(2);
        expect(audioManagerMock.playFeedbackAnnouncement.mock.calls[1][0]).toBe('no movement selected');
    });
});

it('Should change showKeyboardModal when key bindings are enabled and question mark is pressed.', () => {
    const { app } = mountApp({});

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
});
