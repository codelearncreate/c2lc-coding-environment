// @flow

import React from 'react';
import AriaDisablingButton from './AriaDisablingButton';
import classNames from 'classnames';
import { injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';
import { ReactComponent as StopIcon } from './svg/Stop.svg';
import './StopButton.scss';

type StopButtonProps = {
    intl: IntlShape,
    className: string,
    disabled: boolean,
    onClick: () => void
};

class StopButton extends React.Component<StopButtonProps, {}> {
    render() {
        const classes = classNames(
            this.props.className,
            'StopButton'
        );
        return (
            <AriaDisablingButton
                aria-label={`${this.props.intl.formatMessage({id:'StopButton'})}`}
                className={classes}
                disabledClassName='StopButton--disabled'
                disabled={this.props.disabled}
                onClick={this.props.onClick}
            >
                <StopIcon className='StopButton-svg' />
            </AriaDisablingButton>
        );
    }
}

export default injectIntl(StopButton);
