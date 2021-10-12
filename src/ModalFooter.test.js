// @flow
import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { IntlProvider } from 'react-intl';
import messages from './messages.json';
import { configure, mount } from 'enzyme';
import ModalFooter from './ModalFooter';

configure({ adapter: new Adapter()});

function createMountModalFooter(props) {
    const mockOnClickCancel = jest.fn();
    const mockOnClickDone = jest.fn();

    const defaultWrapperProps = {
        hasCancel: true
    };

    const wrapper = mount(
        React.createElement(
            ModalFooter,
            Object.assign(
                {},
                defaultWrapperProps,
                {
                    onClickCancel: mockOnClickCancel,
                    onClickDone: mockOnClickDone
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
        mockOnClickCancel,
        mockOnClickDone
    };
}

function getCancelButton(wrapper) {
    return wrapper.find('.ModalFooter__cancelButton').at(0);
}

function getDoneButton(wrapper) {
    return wrapper.find('.ModalFooter__doneButton').at(0);
}

describe('Rendering the component', () => {
    test('When hasCancel property is true, the cancel button should render', () => {
        const { wrapper } = createMountModalFooter();
        expect(wrapper.exists('.ModalFooter__cancelButton')).toBe(true);
    });
    test('When hasCancel property is false, the cancel button should not render', () => {
        const { wrapper } = createMountModalFooter({hasCancel: false});
        expect(wrapper.exists('.ModalFooter__cancelButton')).toBe(false);

    });
});

test('When the cancel button is clicked, clickCancel function should be called', () => {
    const { wrapper, mockOnClickCancel } = createMountModalFooter();
    const cancelButton = getCancelButton(wrapper);
    cancelButton.simulate('click');
    expect(mockOnClickCancel.mock.calls.length).toBe(1);
});

test('When the done button is clicked, clickDone function should be called', () => {
    const { wrapper, mockOnClickDone } = createMountModalFooter();
    const doneButton = getDoneButton(wrapper);
    doneButton.simulate('click');
    expect(mockOnClickDone.mock.calls.length).toBe(1);
});

