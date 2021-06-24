// @flow

import React from 'react';
import { Form } from 'react-bootstrap';
import type { IntlShape } from 'react-intl';
import { injectIntl } from 'react-intl';
import { ReactComponent as SlowIcon } from './svg/Slow.svg';
import { ReactComponent as FastIcon } from './svg/Fast.svg';
import './ProgramSpeedController.scss';

type ProgramSpeedControllerProps = {
    intl: IntlShape,
    values: Array<number>,
    onChange: (value: number) => void
};

class ProgramSpeedController extends React.Component<ProgramSpeedControllerProps, {}> {
    onChangeInput = (e: SyntheticInputEvent<HTMLInputElement>) => {
        this.props.onChange(this.props.values[parseInt(e.target.value) - 1]);
    }
    render() {
        return (
            <div className='ProgramSpeedController__container'>
                <SlowIcon />
                {
                    /* $FlowFixMe
                        Cannot get Form.Control because property Control is missing in statics of Form
                    */
                    <Form.Control
                        aria-label={`${this.props.intl.formatMessage({id:'ProgramSpeedController.slider'})}`}
                        className='ProgramSpeedController__slider'
                        type='range'
                        min='1'
                        max={this.props.values.length}
                        onChange={this.onChangeInput} />
                }
                <FastIcon />
            </div>
        );
    }
}

export default injectIntl(ProgramSpeedController);
