// @flow

import React from 'react';
import classNames from 'classnames';
import { injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';
import IconButton from './IconButton';
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
            <IconButton
                ariaLabel={`${this.props.intl.formatMessage({id:'StopButton'})}`}
                className={classes}
                disabledClassName='StopButton--disabled'
                disabled={this.props.disabled}
                onClick={this.props.onClick}
            >
                <StopIcon className='StopButton-svg' />
            </IconButton>
        );
    }
}

export default injectIntl(StopButton);
