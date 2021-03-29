// @flow
import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, mount } from 'enzyme';
import { IntlProvider } from 'react-intl';
import ActionsMenuItem from './ActionsMenuItem';

import messages from './messages.json';

configure({ adapter: new Adapter()});

function createActionsMenuItem(props) {
    const mockChangeHandler = jest.fn();

    const wrapper = mount(
        React.createElement(
            ActionsMenuItem,
            Object.assign(
                {
                    isAllowed: true,
                    isUsed: false,
                    itemKey: 'forward1',
                    onChange: mockChangeHandler
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
        mockChangeHandler
    };
};

it('Renders without crashing.', () => {
    createActionsMenuItem();
});

it('Renders without crashing when it is flag as "used".', () => {
    createActionsMenuItem({ isUsed: true });
});

it('Renders without crashing when it is flag as "not allowed".', () => {
    createActionsMenuItem({ isAllowed: false });
});

it("Passes along changes.", () => {
    const { wrapper, mockChangeHandler } = createActionsMenuItem();

    const input = wrapper.find("input");
    input.simulate("change");

    expect(mockChangeHandler.mock.calls.length).toBe(1);
});