// @flow

import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, mount } from 'enzyme';
import { IntlProvider } from 'react-intl';
import ActionsSimplificationModal from './ActionsSimplificationModal';

import messages from './messages.json';
import ProgramSequence from './ProgramSequence';

configure({ adapter: new Adapter()});

function createActionsMenu(props) {
    const mockOnCancel = jest.fn();
    const mockOnConfirm = jest.fn();

    const wrapper = mount(
        React.createElement(
            ActionsSimplificationModal,
            Object.assign(
                {
                    show: true,
                    disallowedActions: {},
                    programSequence: new ProgramSequence([], 0, 0, new Map()),
                    onCancel: mockOnCancel,
                    onConfirm: mockOnConfirm
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

    const modal = wrapper.children().at(0).instance();

    return {
        wrapper,
        modal,
        mockOnCancel,
        mockOnConfirm
    };
};

describe("When a checkbox is clicked.", () => {
    test("The associated item should be toggled.", () => {
        expect.assertions(3);

        const {wrapper, modal} = createActionsMenu();

        expect(modal.state.disallowedActions.left90).toBe(undefined);

        const left90Checkbox = wrapper.find('#actions-menu-item-left90');
        left90Checkbox.simulate('click');

        expect(modal.state.disallowedActions.left90).toBe(true);

        left90Checkbox.simulate('click');
        expect(modal.state.disallowedActions.left90).toBe(undefined);

        wrapper.unmount();
    });
});

describe("When the cancel button is clicked.", ()=> {
    test("The proposed changes should be discarded.", () => {
        expect.assertions(3);

        const {wrapper, modal} = createActionsMenu();

        expect(modal.state.disallowedActions.left90).toBe(undefined);

        const left90Checkbox = wrapper.find('#actions-menu-item-left90');
        left90Checkbox.simulate('click');

        expect(modal.state.disallowedActions.left90).toBe(true);

        const cancelButton = wrapper.find(".TextButton--secondaryButton");
        cancelButton.simulate('click');
        expect(modal.state.disallowedActions.left90).toBe(undefined);

        wrapper.unmount();
    });
    test("The supplied callback should be called.", () => {
        expect.assertions(1);

        const {wrapper, mockOnCancel} = createActionsMenu();

        const cancelButton = wrapper.find(".TextButton--secondaryButton");
        cancelButton.simulate('click');

        expect(mockOnCancel.mock.calls.length).toBe(1);

        wrapper.unmount();
    });
});

describe("When the done button is clicked.", ()=> {
    test("The supplied callback should be called with the updated data.", () => {
        expect.assertions(2);

        const {wrapper, mockOnConfirm} = createActionsMenu();

        const left90Checkbox = wrapper.find('#actions-menu-item-left90');
        left90Checkbox.simulate('click');

        const saveButton = wrapper.find(".TextButton--primaryButton");
        saveButton.simulate('click');

        expect(mockOnConfirm.mock.calls.length).toBe(1);
        expect(mockOnConfirm.mock.calls[0][0].left90).toBe(true);

        wrapper.unmount();
    });
});

describe("When an item is toggled", () => {
    test("Toggles the aria-checked property on change.", () => {
        const { wrapper } = createActionsMenu();

        const input = wrapper.find(".ActionsMenuItem").first();
        expect(input.prop('aria-checked')).toBe(true);

        input.simulate("click");

        const updatedInput = wrapper.find(".ActionsMenuItem").first();
        expect(updatedInput.prop('aria-checked')).toBe(false);
    });
})
