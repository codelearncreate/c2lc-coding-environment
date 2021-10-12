// @flow

import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, mount } from 'enzyme';
import { IntlProvider } from 'react-intl';
import ProgramSpeedController from './ProgramSpeedController';
import messages from './messages.json';

configure({ adapter: new Adapter()});

const defaultSpeedControllerProps = {
    rangeControlRef: React.createRef()
};

function createMountProgramSpeedController(props) {
    const wrapper = mount(
        React.createElement(
            ProgramSpeedController,
            Object.assign(
                {},
                defaultSpeedControllerProps,
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
        wrapper
    };
}

function getProgramSpeedController(programSpeedControllerWrapper) {
    return programSpeedControllerWrapper.find('.ProgramSpeedController__slider').at(0);
}

describe('When value from the controller changes', () => {
    test('Should call onChange callback with value from speedLookUp at index value-1', () => {
        expect.assertions(2);
        const mockOnChange = jest.fn();
        const values = [2000, 1500, 1000, 500, 250];
        const { wrapper } = createMountProgramSpeedController({
            onChange: mockOnChange,
            values
        });
        const programSpeedController = getProgramSpeedController(wrapper);
        const targetValue = 4;
        programSpeedController.simulate('change', { target: { value: targetValue}});
        expect(mockOnChange.mock.calls.length).toBe(1);
        expect(mockOnChange.mock.calls[0][0]).toBe(values[targetValue-1]);
    })
});

test('Maximum value of the controller should be equal to the length of values property', () => {
    expect.assertions(1);
    const values = [2000, 1500, 1000, 500, 250];
    const { wrapper } = createMountProgramSpeedController({
        onChange: () => {},
        values
    });
    const programSpeedController = getProgramSpeedController(wrapper);
    expect(programSpeedController.get(0).props.max).toBe(values.length);
})
