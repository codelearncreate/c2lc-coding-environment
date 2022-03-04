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
            // $FlowFixMe: Flow is confused about the optional isDisallowed parameter.
            Object.assign(
                {
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

it('Renders without crashing when it is flag as disallowed.', () => {
    createActionsMenuItem({ isDisallowed: true });
});

it("Changes on click.", () => {
    const { wrapper, mockChangeHandler } = createActionsMenuItem();

    const input = wrapper.find(".ActionsMenuItem");
    input.simulate('click');

    expect(mockChangeHandler.mock.calls.length).toBe(1);
});

it("Changes on appropriate keydown.", () => {
    const { wrapper, mockChangeHandler } = createActionsMenuItem();

    const preventDefault = jest.fn();
    const input = wrapper.find(".ActionsMenuItem");
    input.simulate("keydown", { key: 'Enter', preventDefault: preventDefault});

    expect(mockChangeHandler.mock.calls.length).toBe(1);
    expect(preventDefault.mock.calls.length).toBe(1);

    input.simulate("keydown", { key: ' ', preventDefault: preventDefault});
    expect(mockChangeHandler.mock.calls.length).toBe(2);
    expect(preventDefault.mock.calls.length).toBe(2);
});

it("Does not respond to irrelevant keydown.", () => {
    const { wrapper, mockChangeHandler } = createActionsMenuItem();

    const input = wrapper.find(".ActionsMenuItem");

    const preventDefault = jest.fn();
    input.simulate("keydown", { key: 'Tab', preventDefault: preventDefault});

    expect(mockChangeHandler.mock.calls.length).toBe(0);
    expect(preventDefault.mock.calls.length).toBe(0);
});

it("Does not allow hiding 'used' items.", () => {
    const { wrapper, mockChangeHandler } = createActionsMenuItem({ isUsed: true });

    const input = wrapper.find(".ActionsMenuItem");

    const preventDefault = jest.fn();
    input.simulate("keydown", { key: 'Enter', preventDefault: preventDefault});

    expect(mockChangeHandler.mock.calls.length).toBe(0);
    expect(preventDefault.mock.calls.length).toBe(0);
});

it("Allows reenabling 'used' items that are hidden.", () => {
    const { wrapper, mockChangeHandler } = createActionsMenuItem({ isUsed: true, isDisallowed: true });

    const input = wrapper.find(".ActionsMenuItem");

    input.simulate("click");

    expect(mockChangeHandler.mock.calls.length).toBe(1);
});

test.each([
    // disallowed, used , expectedDisabled
    [  false, false, false  ],
    [  false, true , true   ],
    [  true , false, false  ],
    [  true , true , false  ],
])("The menu item is disabled when 'allowed' and 'used'.",
    (disallowed: boolean, used: boolean, expectedDisabled: boolean) => {
        expect.assertions(2);
        const { wrapper } = createActionsMenuItem({ isDisallowed: disallowed, isUsed: used });

        const input = wrapper.find(".ActionsMenuItem");
        expect(input.prop("aria-disabled")).toBe(expectedDisabled);

        const checkbox = wrapper.find(".ActionsMenuItem__checkbox");
        expect(checkbox.prop("disabled")).toBe(expectedDisabled);
    }
);
