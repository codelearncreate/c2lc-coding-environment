// @flow

import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, shallow } from 'enzyme';
import { createIntl } from 'react-intl';
import IconButton from './IconButton';
import messages from './messages.json';
import StopButton from './StopButton';

configure({ adapter: new Adapter()});

const defaultStopButtonProps = {
    interpreterIsRunning: true,
    disabled: false
};

function createShallowStopButton(props) {
    const intl = createIntl({
        locale: 'en',
        defaultLocale: 'en',
        messages: messages.en
    });

    const wrapper = shallow(
        React.createElement(
            StopButton.WrappedComponent,
            Object.assign(
                {},
                defaultStopButtonProps,
                {
                    intl: intl
                },
                props
            )
        )
    );

    return wrapper;
}

function getStopButton(stopButtonWrapper) {
    return stopButtonWrapper.find(IconButton)
        .filter('.StopButton');
}

describe('The Stop button can be disabled', () => {
    describe('Given disabled is true', () => {
        test('Then the Stop button should be disabled', () => {
            expect.assertions(1);
            const wrapper = createShallowStopButton({
                disabled: true
            });
            expect(getStopButton(wrapper).props().disabled).toBe(true);
        })
    });

    describe('Given disabled is false', () => {
        test('Then the Stop button should not be disabled', () => {
            expect.assertions(1);
            const wrapper = createShallowStopButton({
                disabled: false
            });
            expect(getStopButton(wrapper).props().disabled).toBe(false);
        })
    });
});
