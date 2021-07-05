// @flow

import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, shallow } from 'enzyme';
import { createIntl } from 'react-intl';
import messages from './messages.json';
import AudioToggleButton from './AudioToggleButton';

configure({ adapter: new Adapter()});

const defaultAudioToggleButtonProps = {
    audioType: 'preview',
    toggleOn: true
};

function createShallowAudioToggleButton(props) {
    const intl = createIntl({
        locale: 'en',
        defaultLocale: 'en',
        messages: messages.en
    });
    const mockOnClick = jest.fn();

    const wrapper = shallow(
        React.createElement(
            AudioToggleButton.WrappedComponent,
            Object.assign(
                {},
                defaultAudioToggleButtonProps,
                {
                    intl: intl,
                    onClick: mockOnClick
                },
                props
            )
        )
    );

    return {
        wrapper,
        mockOnClick
    }
}

function getAudioToggleButton(wrapper) {
    return wrapper.find('.AudioToggleButton');
}

describe('The AudioToggleButton renders different svgs', () => {
    test('Renders preview svg when audioType property is preview', () => {
        const { wrapper } = createShallowAudioToggleButton({
            audioType: 'preview'
        });
        expect(getAudioToggleButton(wrapper).get(0).props['aria-label']).toBe('Audio preview toggle');
        expect(getAudioToggleButton(wrapper).get(0).props['aria-checked']).toBe(true);
        expect(getAudioToggleButton(wrapper).get(0).props.children.type.render().props.children).toBe('PreviewEnabled.svg');
        wrapper.setProps({ toggleOn: false });
        expect(getAudioToggleButton(wrapper).get(0).props.children.type.render().props.children).toBe('PreviewDisabled.svg');
    });

    test('Renders feedback svg when audioType property is feedback', () => {
        const { wrapper } = createShallowAudioToggleButton({
            audioType: 'feedback'
        });
        expect(getAudioToggleButton(wrapper).get(0).props['aria-label']).toBe('Audio feedback toggle');
        expect(getAudioToggleButton(wrapper).get(0).props['aria-checked']).toBe(true);
        expect(getAudioToggleButton(wrapper).get(0).props.children.type.render().props.children).toBe('FeedbackEnabled.svg');
        wrapper.setProps({ toggleOn: false });
        expect(getAudioToggleButton(wrapper).get(0).props.children.type.render().props.children).toBe('FeedbackDisabled.svg');
    });
})

describe('When AudioToggleButton is clicked', () => {
    test('calls onClick handler with negation of toggleOn property', () => {
        const { wrapper, mockOnClick } = createShallowAudioToggleButton();
        wrapper.simulate('click');
        expect(mockOnClick.mock.calls.length).toBe(1);
        expect(mockOnClick.mock.calls[0][0]).toBe(false);
        wrapper.setProps({ toggleOn: false });
        wrapper.simulate('click');
        expect(mockOnClick.mock.calls.length).toBe(2);
        expect(mockOnClick.mock.calls[1][0]).toBe(true);
    })
});
