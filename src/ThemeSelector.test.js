// @flow

import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, mount } from 'enzyme';
import { IntlProvider } from 'react-intl';
import messages from './messages.json';
import ThemeSelector from './ThemeSelector';

configure({ adapter: new Adapter() });

const defaultThemeSelectorProps = {
    currentTheme: 'default',
    show: true
};

function createMountThemeSelector(props) {
    const mockOnSelect = jest.fn();
    const mockOnChange = jest.fn();
    const wrapper = mount(
        React.createElement(
            ThemeSelector,
            Object.assign(
                {},
                defaultThemeSelectorProps,
                {
                    onSelect: mockOnSelect,
                    onChange: mockOnChange
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
        mockOnSelect,
        mockOnChange
    };
}

function getThemeSelectorOption(wrapper) {
    return wrapper.find('.ThemeSelector__option');
}

function getThemeSelectorRadioButton(wrapper) {
    return wrapper.find('.ThemeSelector__option-radio');
}

function getCancelButton(wrapper) {
    return wrapper.find('.ModalWithFooter__secondaryButton');
}

function getSaveButton(wrapper) {
    return wrapper.find('.ModalWithFooter__primaryButton');
}

describe('When rendering selector options', () => {
    test('All themes should be displayed as options and only one is checked', () => {
        expect.assertions(10);
        const { wrapper } = createMountThemeSelector();
        const selectorOptions = getThemeSelectorOption(wrapper);

        // Default Theme
        expect(selectorOptions.get(0).props.className.includes('default')).toBe(true);
        expect(selectorOptions.get(0).props.children[0].props.checked).toBe(true);

        // Light Theme
        expect(selectorOptions.get(1).props.className.includes('light')).toBe(true);
        expect(selectorOptions.get(1).props.children[0].props.checked).toBe(false);

        // Dark Theme
        expect(selectorOptions.get(2).props.className.includes('dark')).toBe(true);
        expect(selectorOptions.get(2).props.children[0].props.checked).toBe(false);

        // Grayscale Theme
        expect(selectorOptions.get(3).props.className.includes('gray')).toBe(true);
        expect(selectorOptions.get(3).props.children[0].props.checked).toBe(false);

        // High Contrast Theme
        expect(selectorOptions.get(4).props.className.includes('contrast')).toBe(true);
        expect(selectorOptions.get(4).props.children[0].props.checked).toBe(false);
    });
});

describe('When selecting a theme', () => {
    test('should call onSelect prop and update aria-checked property', () => {
        expect.assertions(40);
        const { wrapper, mockOnSelect } = createMountThemeSelector();
        // Light Theme
        const lightThemeSelector = getThemeSelectorOption(wrapper).at(1);
        const lightThemeSelectorRadioButton = getThemeSelectorRadioButton(wrapper).get(1);
        expect(lightThemeSelector.get(0).props['aria-checked']).toBe(false);
        expect(lightThemeSelector.get(0).props.tabIndex).toBe(-1);
        expect(lightThemeSelectorRadioButton.props.checked).toBe(false);
        lightThemeSelector.simulate('click');
        expect(mockOnSelect.mock.calls.length).toBe(1);
        expect(mockOnSelect.mock.calls[0][0]).toBe('light');
        wrapper.setProps({currentTheme: mockOnSelect.mock.calls[0][0]});
        expect(wrapper.find('.ThemeSelector__option').get(1).props['aria-checked']).toBe(true);
        expect(wrapper.find('.ThemeSelector__option').get(1).props.tabIndex).toBe(0);
        expect(wrapper.find('.ThemeSelector__option-radio').get(1).props.checked).toBe(true);

        // Dark Theme
        const darkThemeSelector = getThemeSelectorOption(wrapper).at(2);
        const darkThemeSelectorRadioButton = getThemeSelectorRadioButton(wrapper).get(2);
        expect(darkThemeSelector.get(0).props['aria-checked']).toBe(false);
        expect(darkThemeSelector.get(0).props.tabIndex).toBe(-1);
        expect(darkThemeSelectorRadioButton.props.checked).toBe(false);
        darkThemeSelector.simulate('click');
        expect(mockOnSelect.mock.calls.length).toBe(2);
        expect(mockOnSelect.mock.calls[1][0]).toBe('dark');
        wrapper.setProps({currentTheme: mockOnSelect.mock.calls[1][0]});
        expect(wrapper.find('.ThemeSelector__option').get(2).props['aria-checked']).toBe(true);
        expect(wrapper.find('.ThemeSelector__option').get(2).props.tabIndex).toBe(0);
        expect(wrapper.find('.ThemeSelector__option-radio').get(2).props.checked).toBe(true);

        // Grayscale Theme
        const grayScaleThemeSelector = getThemeSelectorOption(wrapper).at(3);
        const grayScaleThemeSelectorRadioButton = getThemeSelectorRadioButton(wrapper).get(3);
        expect(grayScaleThemeSelector.get(0).props['aria-checked']).toBe(false);
        expect(grayScaleThemeSelectorRadioButton.props.checked).toBe(false);
        expect(grayScaleThemeSelector.get(0).props.tabIndex).toBe(-1);
        grayScaleThemeSelector.simulate('click');
        expect(mockOnSelect.mock.calls.length).toBe(3);
        expect(mockOnSelect.mock.calls[2][0]).toBe('gray');
        wrapper.setProps({currentTheme: mockOnSelect.mock.calls[2][0]});
        expect(wrapper.find('.ThemeSelector__option').get(3).props['aria-checked']).toBe(true);
        expect(wrapper.find('.ThemeSelector__option').get(3).props.tabIndex).toBe(0);
        expect(wrapper.find('.ThemeSelector__option-radio').get(3).props.checked).toBe(true);

        // High Contrast Theme
        const highContrastThemeSelector = getThemeSelectorOption(wrapper).at(4);
        const highContrastThemeSelectorRadioButton = getThemeSelectorRadioButton(wrapper).get(4);
        expect(highContrastThemeSelector.get(0).props['aria-checked']).toBe(false);
        expect(highContrastThemeSelector.get(0).props.tabIndex).toBe(-1);
        expect(highContrastThemeSelectorRadioButton.props.checked).toBe(false);
        highContrastThemeSelector.simulate('click');
        expect(mockOnSelect.mock.calls.length).toBe(4);
        expect(mockOnSelect.mock.calls[3][0]).toBe('contrast');
        wrapper.setProps({currentTheme: mockOnSelect.mock.calls[3][0]});
        expect(wrapper.find('.ThemeSelector__option').get(4).props['aria-checked']).toBe(true);
        expect(wrapper.find('.ThemeSelector__option').get(4).props.tabIndex).toBe(0);
        expect(wrapper.find('.ThemeSelector__option-radio').get(4).props.checked).toBe(true);

        // Default
        const defaultThemeSelector = getThemeSelectorOption(wrapper).at(0);
        const defaultThemeSelectorRadioButton = getThemeSelectorRadioButton(wrapper).get(0);
        expect(defaultThemeSelector.get(0).props['aria-checked']).toBe(false);
        expect(defaultThemeSelector.get(0).props.tabIndex).toBe(-1);
        expect(defaultThemeSelectorRadioButton.props.checked).toBe(false);
        defaultThemeSelector.simulate('click');
        expect(mockOnSelect.mock.calls.length).toBe(5);
        expect(mockOnSelect.mock.calls[4][0]).toBe('default');
        wrapper.setProps({currentTheme: mockOnSelect.mock.calls[4][0]});
        expect(wrapper.find('.ThemeSelector__option').get(0).props['aria-checked']).toBe(true);
        expect(wrapper.find('.ThemeSelector__option').get(0).props.tabIndex).toBe(0);
        expect(wrapper.find('.ThemeSelector__option-radio').get(0).props.checked).toBe(true);
    });

    test('themes can be changed with arrow keys', () => {
        expect.assertions(24);
        const { wrapper, mockOnSelect } = createMountThemeSelector();
        const defaultThemeSelector = getThemeSelectorOption(wrapper).at(0);
        // From the top most item, arrow up and left traps keyboard navigation
        defaultThemeSelector.simulate('keyDown', { key: "ArrowUp", preventDefault: () => {}, nativeEvent: {stopImmediatePropagation: () => {}}});
        expect(mockOnSelect.mock.calls.length).toBe(1);
        expect(mockOnSelect.mock.calls[0][0]).toBe('contrast');
        defaultThemeSelector.simulate('keyDown', { key: "ArrowLeft", preventDefault: () => {}, nativeEvent: {stopImmediatePropagation: () => {}}});
        expect(mockOnSelect.mock.calls.length).toBe(2);
        expect(mockOnSelect.mock.calls[1][0]).toBe('contrast');
        defaultThemeSelector.simulate('keyDown', { key: "ArrowDown", preventDefault: () => {}, nativeEvent: {stopImmediatePropagation: () => {}}});
        expect(mockOnSelect.mock.calls.length).toBe(3);
        expect(mockOnSelect.mock.calls[2][0]).toBe('light');
        defaultThemeSelector.simulate('keyDown', { key: "ArrowRight", preventDefault: () => {}, nativeEvent: {stopImmediatePropagation: () => {}}});
        expect(mockOnSelect.mock.calls.length).toBe(4);
        expect(mockOnSelect.mock.calls[3][0]).toBe('light');

        wrapper.setProps({currentTheme: 'contrast'});
        // From the bottom most item, arrow down and right traps keyboard navigation
        const highContrastThemeSelector = getThemeSelectorOption(wrapper).at(4);
        highContrastThemeSelector.simulate('keyDown', { key: "ArrowUp", preventDefault: () => {}, nativeEvent: {stopImmediatePropagation: () => {}}});
        expect(mockOnSelect.mock.calls.length).toBe(5);
        expect(mockOnSelect.mock.calls[4][0]).toBe('gray');
        highContrastThemeSelector.simulate('keyDown', { key: "ArrowLeft", preventDefault: () => {}, nativeEvent: {stopImmediatePropagation: () => {}}});
        expect(mockOnSelect.mock.calls.length).toBe(6);
        expect(mockOnSelect.mock.calls[5][0]).toBe('gray');
        highContrastThemeSelector.simulate('keyDown', { key: "ArrowDown", preventDefault: () => {}, nativeEvent: {stopImmediatePropagation: () => {}}});
        expect(mockOnSelect.mock.calls.length).toBe(7);
        expect(mockOnSelect.mock.calls[6][0]).toBe('default');
        highContrastThemeSelector.simulate('keyDown', { key: "ArrowRight", preventDefault: () => {}, nativeEvent: {stopImmediatePropagation: () => {}}});
        expect(mockOnSelect.mock.calls.length).toBe(8);
        expect(mockOnSelect.mock.calls[7][0]).toBe('default');

        wrapper.setProps({currentTheme: 'dark'});
        // else, arrow down and right would navigate to the next theme, and arrow up and left navigate to the previous theme
        const darkThemeSelector = getThemeSelectorOption(wrapper).at(2);
        darkThemeSelector.simulate('keyDown', { key: "ArrowUp", preventDefault: () => {}, nativeEvent: {stopImmediatePropagation: () => {}}});
        expect(mockOnSelect.mock.calls.length).toBe(9);
        expect(mockOnSelect.mock.calls[8][0]).toBe('light');
        darkThemeSelector.simulate('keyDown', { key: "ArrowLeft", preventDefault: () => {}, nativeEvent: {stopImmediatePropagation: () => {}}});
        expect(mockOnSelect.mock.calls.length).toBe(10);
        expect(mockOnSelect.mock.calls[9][0]).toBe('light');
        darkThemeSelector.simulate('keyDown', { key: "ArrowDown", preventDefault: () => {}, nativeEvent: {stopImmediatePropagation: () => {}}});
        expect(mockOnSelect.mock.calls.length).toBe(11);
        expect(mockOnSelect.mock.calls[10][0]).toBe('gray');
        darkThemeSelector.simulate('keyDown', { key: "ArrowRight", preventDefault: () => {}, nativeEvent: {stopImmediatePropagation: () => {}}});
        expect(mockOnSelect.mock.calls.length).toBe(12);
        expect(mockOnSelect.mock.calls[11][0]).toBe('gray');
    });
});

describe('When the cancel button is clicked', () => {
    test('The theme stays the same as when the modal is opened', () => {
        expect.assertions(2);
        const { wrapper, mockOnChange } = createMountThemeSelector({currentTheme: 'dark'});
        const cancelButton = getCancelButton(wrapper).at(0);
        wrapper.setProps({currentTheme: 'light'});
        cancelButton.simulate('click');
        expect(mockOnChange.mock.calls.length).toBe(1);
        expect(mockOnChange.mock.calls[0][0]).toBe('dark');
    })
});

describe('When the done button is clicked', () => {
    test('The theme changed to the selected theme', () => {
        expect.assertions(2);
        const { wrapper, mockOnChange } = createMountThemeSelector({currentTheme: 'default'});
        const saveButton = getSaveButton(wrapper).at(0);
        wrapper.setProps({currentTheme: 'dark'});
        saveButton.simulate('click');
        expect(mockOnChange.mock.calls.length).toBe(1);
        expect(mockOnChange.mock.calls[0][0]).toBe('dark');
    })
})
