// @flow

import React from 'react';
import AriaDisablingButton from './AriaDisablingButton';
import classNames from 'classnames';
import { injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';
import { ReactComponent as PlayIcon } from './svg/Play.svg';
import { ReactComponent as PauseIcon } from './svg/Pause.svg';
import './PlayButton.scss';

type PlayButtonProps = {
    intl: IntlShape,
    className: string,
    interpreterIsRunning: boolean,
    disabled: boolean,
    onClick: () => void
};

class PlayButton extends React.Component<PlayButtonProps, {}> {
    render() {
        const classes = classNames(
            this.props.className,
            'PlayButton',
            this.props.interpreterIsRunning && 'PlayButton--pause',
            !this.props.interpreterIsRunning && 'PlayButton--play',
            'focus-announcement'
        );
        return (
            <AriaDisablingButton
                aria-label={
                    this.props.interpreterIsRunning ?
                        this.props.intl.formatMessage({id:'PlayButton.pause'}) :
                        this.props.intl.formatMessage({id:'PlayButton.play'})}
                className={classes}
                disabledClassName='PlayButton--disabled'
                disabled={this.props.disabled}
                onClick={this.props.onClick}
            >
                {this.props.interpreterIsRunning ?
                    <PauseIcon /> :
                    <PlayIcon />
                }
            </AriaDisablingButton>
        );
    }
}

export default injectIntl(PlayButton);
