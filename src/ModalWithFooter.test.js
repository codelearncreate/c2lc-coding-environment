// @flow
import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, mount } from 'enzyme';
import ModalWithFooter from './ModalWithFooter';

configure({ adapter: new Adapter()});

function createMountModalWithFooter(props) {
    const defaultModalWithFooterProps = {
        show: true,
        focusOnOpenSelector: 'focusOnOpen',
        focusOnCloseSelector: 'focusOnClose',
        onClose: () => {}
    };
    const wrapper = mount(
        React.createElement(
            ModalWithFooter,
            Object.assign(
                {},
                defaultModalWithFooterProps,
                props
            )
        )
    );

    return wrapper;
}

function hasPrimaryButton(wrapper) {
    return wrapper.exists('.TextButton--primaryButton');
}

function hasSecondaryButton(wrapper) {
    return wrapper.exists('.TextButton--secondaryButton');
}

function getFooterButtons(wrapper) {
    return wrapper.find("button");
}

describe('ModalWithFooter renders buttons with properties specified in buttonProperties properties', () => {
    test('Modal with secondary and primary buttons', () => {
        expect.assertions(7);
        const secondaryButtonLabel = 'cancel';
        const primaryButtonLabel = 'done';
        const secondaryButtonOnClick = jest.fn();
        const primaryButtonOnClick = jest.fn();
        const wrapper = createMountModalWithFooter({
            buttonProperties: [
                {label: secondaryButtonLabel, onClick: secondaryButtonOnClick},
                {label: primaryButtonLabel, onClick: primaryButtonOnClick, isPrimary: true}
            ]
        });

        expect(hasPrimaryButton(wrapper)).toBe(true);
        expect(hasSecondaryButton(wrapper)).toBe(true);

        const footerButtons = getFooterButtons(wrapper);
        expect(footerButtons.length).toBe(2);

        const secondaryButton = footerButtons.at(0);
        expect(secondaryButton.get(0).props.children).toBe(secondaryButtonLabel);
        secondaryButton.simulate('click');
        expect(secondaryButtonOnClick.mock.calls.length).toBe(1);

        const primaryButton = footerButtons.at(1);
        expect(primaryButton.get(0).props.children).toBe(primaryButtonLabel);
        primaryButton.simulate('click');
        expect(primaryButtonOnClick.mock.calls.length).toBe(1);
    });
    test('Modal with only secondary button', () => {
        expect.assertions(5);
        const secondaryButtonLabel = 'cancel';
        const secondaryButtonOnClick = jest.fn();
        const wrapper = createMountModalWithFooter({
            buttonProperties: [
                {label: secondaryButtonLabel, onClick: secondaryButtonOnClick}
            ]
        });

        expect(hasPrimaryButton(wrapper)).toBe(false);
        expect(hasSecondaryButton(wrapper)).toBe(true);

        const footerButtons = getFooterButtons(wrapper);
        expect(footerButtons.length).toBe(1);

        const secondaryButton = footerButtons.at(0);
        expect(secondaryButton.get(0).props.children).toBe(secondaryButtonLabel);
        secondaryButton.simulate('click');
        expect(secondaryButtonOnClick.mock.calls.length).toBe(1);
    });
    test('Modal with only primary button', () => {
        expect.assertions(5);
        const primaryButtonLabel = 'done';
        const primaryButtonOnClick = jest.fn();
        const wrapper = createMountModalWithFooter({
            buttonProperties: [
                {label: primaryButtonLabel, onClick: primaryButtonOnClick, isPrimary: true}
            ]
        });

        expect(hasPrimaryButton(wrapper)).toBe(true);
        expect(hasSecondaryButton(wrapper)).toBe(false);

        const footerButtons = getFooterButtons(wrapper);
        expect(footerButtons.length).toBe(1);

        const primaryButton = footerButtons.at(0);
        expect(primaryButton.get(0).props.children).toBe(primaryButtonLabel);
        primaryButton.simulate('click');
        expect(primaryButtonOnClick.mock.calls.length).toBe(1);
    });
    test('Modal with 2 secondary and 2 primary buttons', () => {
        expect.assertions(11);
        const firstPrimaryButtonLabel = 'done';
        const firstPrimaryButtonOnClick = jest.fn();
        const firstSecondaryButtonLabel = 'cancel';
        const firstSecondaryButtonOnClick = jest.fn();
        const secondSecondaryButtonLabel = 'confirm';
        const secondSecondaryButtonOnClick = jest.fn();
        const secondPrimaryButtonLabel = 'save';
        const secondPrimaryButtonOnClick = jest.fn();

        const wrapper = createMountModalWithFooter({
            buttonProperties: [
                {label: firstPrimaryButtonLabel, onClick: firstPrimaryButtonOnClick, isPrimary: true},
                {label: firstSecondaryButtonLabel, onClick: firstSecondaryButtonOnClick},
                {label: secondSecondaryButtonLabel, onClick: secondSecondaryButtonOnClick},
                {label: secondPrimaryButtonLabel, onClick: secondPrimaryButtonOnClick, isPrimary: true}
            ]
        });

        expect(hasPrimaryButton(wrapper)).toBe(true);
        expect(hasSecondaryButton(wrapper)).toBe(true);

        const footerButtons = getFooterButtons(wrapper);
        expect(footerButtons.length).toBe(4);

        const firstPrimaryButton = footerButtons.at(0);
        expect(firstPrimaryButton.get(0).props.children).toBe(firstPrimaryButtonLabel);
        firstPrimaryButton.simulate('click');
        expect(firstPrimaryButtonOnClick.mock.calls.length).toBe(1);

        const firstSecondaryButton = footerButtons.at(1);
        expect(firstSecondaryButton.get(0).props.children).toBe(firstSecondaryButtonLabel);
        firstSecondaryButton.simulate('click');
        expect(firstSecondaryButtonOnClick.mock.calls.length).toBe(1);

        const secondSecondaryButton = footerButtons.at(2);
        expect(secondSecondaryButton.get(0).props.children).toBe(secondSecondaryButtonLabel);
        secondSecondaryButton.simulate('click');
        expect(secondSecondaryButtonOnClick.mock.calls.length).toBe(1);

        const secondPrimaryButton = footerButtons.at(3);
        expect(secondPrimaryButton.get(0).props.children).toBe(secondPrimaryButtonLabel);
        secondPrimaryButton.simulate('click');
        expect(secondPrimaryButtonOnClick.mock.calls.length).toBe(1);
    });
});

