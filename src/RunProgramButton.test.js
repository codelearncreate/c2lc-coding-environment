// @flow

import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { shallow, configure } from 'enzyme';
import { Col, Button } from 'react-bootstrap';
import { createIntl } from 'react-intl';
import type {DeviceConnectionStatus} from './types';
import messages from './messages.json';
import RunProgramButton from './RunProgramButton';

configure({ adapter: new Adapter()});

function getRunButton(wrapper) {
    return wrapper.find('.RunProgramButton__run-button').getElement();
}

const intl = createIntl({
    locale: 'en',
    defaultLocale: 'en',
    messages: messages.en
});

test('Run button should not be disabled when disabled prop is false', () => {
    const program = ['forward', 'left', 'forward', 'left'];
    const wrapper = shallow(
        <RunProgramButton.WrappedComponent
            intl={intl}
            disabled={false}
            program={program}
            onClick={() => {}}/>
    );
    expect(getRunButton(wrapper).props.disabled).toBe(false);
    expect(getRunButton(wrapper).props['aria-label']).toBe(`${intl.messages['PlayButton.run']} ${program.join(' ')}`);
    expect(getRunButton(wrapper).props.children.props.role).toBe('img');
    expect(getRunButton(wrapper).props.children.props['aria-label']).toBe(intl.messages['PlayButton.run']);
    expect(getRunButton(wrapper).props.children.props.children.type.render.name).toBe('SvgPlay');
});

test('Run Button should be disabled when disabled prop is true', () => {
    const wrapper = shallow(
        <RunProgramButton.WrappedComponent
            intl={intl}
            disabled={true}
            program={['forward', 'left', 'forward', 'left']}
            onClick={() => {}}/>
    );
    expect(getRunButton(wrapper).props.disabled).toBe(true);
});
