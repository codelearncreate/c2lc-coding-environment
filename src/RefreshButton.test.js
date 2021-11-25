// @flow

import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, shallow } from 'enzyme';
import { createIntl } from 'react-intl';
import IconButton from './IconButton';
import messages from './messages.json';
import RefreshButton from './RefreshButton';

configure({ adapter: new Adapter()});

const defaultRefreshButtonProps = {
    disabled: false
};

function createShallowRefreshButton(props) {
    const intl = createIntl({
        locale: 'en',
        defaultLocale: 'en',
        messages: messages.en
    });

    const wrapper = shallow(
        React.createElement(
            RefreshButton.WrappedComponent,
            Object.assign(
                {},
                defaultRefreshButtonProps,
                {
                    intl: intl
                },
                props
            )
        )
    );

    return wrapper;
}

function getRefreshButton(refreshButtonWrapper) {
    return refreshButtonWrapper.find(IconButton)
        .filter('.RefreshButton');
}

describe('The Refresh button can be disabled', () => {
    describe('Given disabled is true', () => {
        test('Then the Refresh button should be disabled', () => {
            expect.assertions(1);
            const wrapper = createShallowRefreshButton({
                disabled: true
            });
            expect(getRefreshButton(wrapper).props().disabled).toBe(true);
        })
    });

    describe('Given disabled is false', () => {
        test('Then the Refresh button should not be disabled', () => {
            expect.assertions(1);
            const wrapper = createShallowRefreshButton({
                disabled: false
            });
            expect(getRefreshButton(wrapper).props().disabled).toBe(false);
        })
    });
});
