// @flow

import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, mount } from 'enzyme';
import { IntlProvider } from 'react-intl';
import messages from './messages.json';
import WorldSelector from './WorldSelector';

configure({ adapter: new Adapter() });

const defaultWorldSelectorProps = {
    currentWorld: 'Sketchpad',
    theme: 'default',
    show: true
};

function createMountWorldSelector(props) {
    const mockOnSelect = jest.fn();
    const mockOnChange = jest.fn();
    const wrapper = mount(
        React.createElement(
            WorldSelector,
            Object.assign(
                {},
                defaultWorldSelectorProps,
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

function getWorldSelectorRadioButton(wrapper) {
    return wrapper.find('.WorldSelector__option-radio');
}

function getWorldSelectorThumbnailIcon(wrapper) {
    return wrapper.find('.WorldSelector__option-image');
}

function getCancelButton(wrapper) {
    return wrapper.find('.TextButton--secondaryButton');
}

function getDoneButton(wrapper) {
    return wrapper.find('.TextButton--primaryButton');
}

describe('When rendering selector options', () => {
    test('All worlds should be displayed as options and only one is checked', () => {
        expect.assertions(8);
        const { wrapper } = createMountWorldSelector();
        const selectorOptions = getWorldSelectorRadioButton(wrapper);

        // Sketchpad world
        expect(selectorOptions.get(0).props.value).toBe('Sketchpad');
        expect(selectorOptions.get(0).props.checked).toBe(true);

        // Space world
        expect(selectorOptions.get(1).props.value).toBe('Space');
        expect(selectorOptions.get(1).props.checked).toBe(false);

        // Jungle world
        expect(selectorOptions.get(2).props.value).toBe('Jungle');
        expect(selectorOptions.get(2).props.checked).toBe(false);

        // Deep Ocean world
        expect(selectorOptions.get(3).props.value).toBe('DeepOcean');
        expect(selectorOptions.get(3).props.checked).toBe(false);
    });
    test('Thumbnail icons get rendered with the selector options', () => {
        const { wrapper } = createMountWorldSelector();
        let selectorThumbnails = getWorldSelectorThumbnailIcon(wrapper);

        expect(selectorThumbnails.get(0).props.children.type.render().props.children).toBe('SketchpadThumbnail.svg');
        expect(selectorThumbnails.get(1).props.children.type.render().props.children).toBe('SpaceThumbnail.svg');
        expect(selectorThumbnails.get(2).props.children.type.render().props.children).toBe('JungleThumbnail.svg');
        expect(selectorThumbnails.get(3).props.children.type.render().props.children).toBe('DeepOceanThumbnail.svg');

        // Grayscale theme
        wrapper.setProps({theme: 'gray'});
        selectorThumbnails = getWorldSelectorThumbnailIcon(wrapper);

        expect(selectorThumbnails.get(1).props.children.type.render().props.children).toBe('SpaceThumbnail-gray.svg');
        expect(selectorThumbnails.get(2).props.children.type.render().props.children).toBe('JungleThumbnail-gray.svg');
        expect(selectorThumbnails.get(3).props.children.type.render().props.children).toBe('DeepOceanThumbnail-gray.svg');

        // High contrast theme
        wrapper.setProps({theme: 'contrast'});
        selectorThumbnails = getWorldSelectorThumbnailIcon(wrapper);

        expect(selectorThumbnails.get(1).props.children.type.render().props.children).toBe('SpaceThumbnail-contrast.svg');
        expect(selectorThumbnails.get(2).props.children.type.render().props.children).toBe('JungleThumbnail-contrast.svg');
        expect(selectorThumbnails.get(3).props.children.type.render().props.children).toBe('DeepOceanThumbnail-contrast.svg');
    });
});

describe('When selecting a world', () => {
    test('should call onSelect prop', () => {
        expect.assertions(8);
        const { wrapper, mockOnSelect } = createMountWorldSelector();
        const selectorOptions = getWorldSelectorRadioButton(wrapper);

        const sketchpadWorldSelector = selectorOptions.at(0);
        const spaceWorldSelector = selectorOptions.at(1);
        const jungleWorldSelector = selectorOptions.at(2);
        const deepOceanWorldSelector = selectorOptions.at(3);

        // Space World
        spaceWorldSelector.simulate('change');
        expect(mockOnSelect.mock.calls.length).toBe(1);
        expect(mockOnSelect.mock.calls[0][0]).toBe('Space');

        // Jungle World
        jungleWorldSelector.simulate('change');
        expect(mockOnSelect.mock.calls.length).toBe(2);
        expect(mockOnSelect.mock.calls[1][0]).toBe('Jungle');

        // Deep Ocean World
        deepOceanWorldSelector.simulate('change');
        expect(mockOnSelect.mock.calls.length).toBe(3);
        expect(mockOnSelect.mock.calls[2][0]).toBe('DeepOcean');

        // Sketchpad World
        sketchpadWorldSelector.simulate('change');
        expect(mockOnSelect.mock.calls.length).toBe(4);
        expect(mockOnSelect.mock.calls[3][0]).toBe('Sketchpad');
    })
});

describe('When the cancel button is clicked', () => {
    test('The world stays the same as when the modal is opened', () => {
        expect.assertions(2);
        const { wrapper, mockOnChange } = createMountWorldSelector({currentWorld: 'Space'});
        const cancelButton = getCancelButton(wrapper).at(0);
        wrapper.setProps({currentWorld: 'Jungle'});
        cancelButton.simulate('click');
        expect(mockOnChange.mock.calls.length).toBe(1);
        expect(mockOnChange.mock.calls[0][0]).toBe('Space');
    })
});

describe('When the done button is clicked', () => {
    test('The world changed to the selected world', () => {
        expect.assertions(2);
        const { wrapper, mockOnChange } = createMountWorldSelector({currentWorld: 'Sketchpad'});
        const doneButton = getDoneButton(wrapper).at(0);
        wrapper.setProps({currentWorld: 'Space'});
        doneButton.simulate('click');
        expect(mockOnChange.mock.calls.length).toBe(1);
        expect(mockOnChange.mock.calls[0][0]).toBe('Space');
    })
});

test('When one of the thumbnail images is clicked, onSelect prop gets called', () => {
    expect.assertions(4);
    const { wrapper, mockOnSelect } = createMountWorldSelector();
    const selectorThumbnails = getWorldSelectorThumbnailIcon(wrapper);
    const sketchPadThumbnailImage = selectorThumbnails.at(0);
    const spaceThumbnailImage = selectorThumbnails.at(1);
    const jungleThumbnailImage = selectorThumbnails.at(2);
    const deepOceanThumbnailImage = selectorThumbnails.at(3);

    sketchPadThumbnailImage.simulate('click');
    expect(mockOnSelect.mock.calls[0][0]).toBe('Sketchpad');
    spaceThumbnailImage.simulate('click');
    expect(mockOnSelect.mock.calls[1][0]).toBe('Space');
    jungleThumbnailImage.simulate('click');
    expect(mockOnSelect.mock.calls[2][0]).toBe('Jungle');
    deepOceanThumbnailImage.simulate('click');
    expect(mockOnSelect.mock.calls[3][0]).toBe('DeepOcean');
});
