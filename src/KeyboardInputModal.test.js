// @flow
import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { createIntl, IntlProvider } from 'react-intl';
import messages from './messages.json';
import { configure, mount } from 'enzyme';
import KeyboardInputModal from './KeyboardInputModal';

configure({ adapter: new Adapter()});

function createShallowKeyboardInputModal(props) {
    const intl = createIntl({
        locale: 'en',
        defaultLocale: 'en',
        messages: messages.en
    });

    const onChangeKeyBindingsEnabled = jest.fn();
    const onChangeKeyboardInputScheme = jest.fn();
    const onHide = jest.fn();

    const defaultWrapperProps = {
        keyBindingsEnabled: true,
        keyboardInputSchemeName: "controlshift",
        onChangeKeyBindingsEnabled: onChangeKeyBindingsEnabled,
        onChangeKeyboardInputScheme: onChangeKeyboardInputScheme,
        onHide: onHide,
        show: true
    }

    const wrapper = mount(
        React.createElement(
            KeyboardInputModal,
            Object.assign(
                {},
                defaultWrapperProps,
                { intl: intl },
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

    const wrappedModal = wrapper.children().at(0).instance();

    return {
        wrappedModal,
        onChangeKeyBindingsEnabled,
        onChangeKeyboardInputScheme,
        onHide
    };
}

it('should be able to save keyboardInputSchemeName changes', () => {
    const {wrappedModal, onChangeKeyboardInputScheme, onHide} = createShallowKeyboardInputModal();
    wrappedModal.handleChangeKeyboardInputSchemeName({
        target: {
            value: "controlalt"
        }
    });
    expect(wrappedModal.state.keyboardInputSchemeName).toBe("controlalt");

    wrappedModal.saveChanges();

    expect(onChangeKeyboardInputScheme.mock.calls.length).toBe(1);
    expect(onChangeKeyboardInputScheme.mock.calls[0][0]).toBe('controlalt');
    expect(onHide.mock.calls.length).toBe(1);
});


it('should be able to save keyBindingsEnabled changes', () => {
    const {wrappedModal, onChangeKeyBindingsEnabled, onHide} = createShallowKeyboardInputModal();
    wrappedModal.handleChangeKeyBindingsEnabled(false);
    expect(wrappedModal.state.keyBindingsEnabled).toBe(false);
    wrappedModal.saveChanges();

    expect(onChangeKeyBindingsEnabled.mock.calls.length).toBe(1);
    expect(onChangeKeyBindingsEnabled.mock.calls[0][0]).toBe(false);
    expect(onHide.mock.calls.length).toBe(1);
});

it('should be able to cancel changes.', () => {
    const {wrappedModal, onChangeKeyBindingsEnabled, onChangeKeyboardInputScheme, onHide}  = createShallowKeyboardInputModal();

    wrappedModal.handleChangeKeyboardInputSchemeName({
        target: {
            value: "alt"
        }
    });
    expect(wrappedModal.state.keyboardInputSchemeName).toBe("alt");

    wrappedModal.handleChangeKeyBindingsEnabled(false);
    expect(wrappedModal.state.keyBindingsEnabled).toBe(false);

    wrappedModal.cancelChanges();
    expect(wrappedModal.state.keyboardInputSchemeName).toBe("controlshift");
    expect(wrappedModal.state.keyBindingsEnabled).toBe(true);

    expect(onChangeKeyBindingsEnabled.mock.calls.length).toBe(0);
    expect(onChangeKeyboardInputScheme.mock.calls.length).toBe(0);
    expect(onHide.mock.calls.length).toBe(1);
});

