// @flow

import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { mount, configure } from 'enzyme';
import { Button } from 'react-bootstrap';
import { IntlProvider } from 'react-intl';
import messages from './messages.json';
import ConfirmDeleteAllModal from './ConfirmDeleteAllModal';

configure({ adapter: new Adapter()});

function getDeleteAllButton(confirmDeleteAllModalWrapper) {
    return confirmDeleteAllModalWrapper.find(Button)
        .filter('.ModalWithFooter__primaryButton').at(0);
}

function getCancelButton(confirmDeleteAllModalWrapper) {
    return confirmDeleteAllModalWrapper.find(Button)
        .filter('.ModalWithFooter__secondaryButton').at(0);
}

function createMountDeleteAllModal() {
    const mockCancelHandler = jest.fn();
    const mockConfirmHandler = jest.fn();
    const wrapper = mount(
        React.createElement(
            ConfirmDeleteAllModal,
            {
                show: true,
                onCancel: mockCancelHandler,
                onConfirm: mockConfirmHandler
            }
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
        mockCancelHandler,
        mockConfirmHandler
    };
}

test('Check if buttons are calling right function from the props', () => {
    expect.assertions(2);
    const { wrapper, mockCancelHandler, mockConfirmHandler } = createMountDeleteAllModal();

    const cancelButton = getCancelButton(wrapper);
    const confirmButton = getDeleteAllButton(wrapper);

    cancelButton.simulate('click');
    expect(mockCancelHandler.mock.calls.length).toBe(1);

    confirmButton.simulate('click');
    expect(mockConfirmHandler.mock.calls.length).toBe(1);
});

