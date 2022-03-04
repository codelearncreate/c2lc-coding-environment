// @flow

import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, shallow } from 'enzyme';
import TextButton from './TextButton';

configure({ adapter: new Adapter()});

function createShallowIconButton(props) {
    const clickHandler = jest.fn();
    const wrapper = shallow(
        React.createElement(
            TextButton,
            Object.assign(
                {
                    label: "X marks the spot",
                    onClick: clickHandler
                },
                props
            )
        )
    );
    return { wrapper, clickHandler };
}

test('A TextButton can be clicked', () => {
    expect.assertions(2);
    const {wrapper, clickHandler} = createShallowIconButton();
    const preventDefault = jest.fn();

    const button = wrapper.find('button');
    button.simulate('click', { preventDefault: preventDefault });
    expect(clickHandler.mock.calls.length).toBe(1);
    expect(preventDefault.mock.calls.length).toBe(1);
});
