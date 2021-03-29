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

it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<IntlContainer />, div);
    ReactDOM.unmountComponentAtNode(div);
});

it('Should play a sound when selectedCommandName changes', () => {
    const audioManagerInstance = new AudioManagerImpl(true, true);
    // $FlowFixMe: Flow doesn't know about the Jest mock API
    const audioManagerMock = AudioManagerImpl.mock.instances[0];

    const wrapper = mount(
        <App audioManager={audioManagerInstance}/>,
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
