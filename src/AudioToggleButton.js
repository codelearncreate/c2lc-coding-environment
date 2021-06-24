// @flow

import * as React from 'react';
import classNames from 'classnames';
import { injectIntl } from 'react-intl';

type AudioToggleButtonProps = {
    className: string,
    toggleOn: boolean,
    onClick: (evt: SyntheticEvent<HTMLButtonElement>) => void
};

class AudioToggleButton extends React.Component<AudioToggleButtonProps, {}> {
    render() {
        const classes = classNames(
            this.props.toggleOn && 'AudioToggleButton--disabled',
            'AudioToggleButton'
        );
        return (
            <button
                aria-label={`${this.props.intl.formatMessage({id:'StopButton'})}`}
                className={classes}
                disabled={this.props.disabled}
                onClick={this.props.onClick}
            >
                preview
            </button>
        );
    }
}

export default injectIntl(AudioToggleButton);
