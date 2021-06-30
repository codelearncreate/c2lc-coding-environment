// @flow

import * as React from 'react';
import classNames from 'classnames';
import type {IntlShape} from 'react-intl';
import { injectIntl } from 'react-intl';
import { ReactComponent as FeedbackEnabled } from './svg/FeedbackEnabled.svg';
import { ReactComponent as FeedbackDisabled } from './svg/FeedbackDisabled.svg';
import { ReactComponent as PreviewEnabled } from './svg/PreviewEnabled.svg';
import { ReactComponent as PreviewDisabled } from './svg/PreviewDisabled.svg';
import './AudioToggleButton.scss';

type AudioToggleButtonProps = {
    intl: IntlShape,
    audioType: string,
    toggleOn: boolean,
    onClick: (value: boolean) => void
};

class AudioToggleButton extends React.Component<AudioToggleButtonProps, {}> {
    onClickToggleButton = () => {
        const currentToggleState = this.props.toggleOn;
        this.props.onClick(!currentToggleState);
    }

    getDisplayIcon = () => {
        switch(this.props.audioType) {
            case ('feedback') : return this.props.toggleOn ? <FeedbackEnabled /> : <FeedbackDisabled />;
            case ('preview') : return this.props.toggleOn ? <PreviewEnabled /> : <PreviewDisabled />;
            default: return <FeedbackEnabled />;
        }
    }

    render() {
        const classes = classNames(
            !this.props.toggleOn && 'AudioToggleButton--off',
            'AudioToggleButton'
        );
        return (
            <button
                aria-label={this.props.intl.formatMessage({id:`AudioToggle.${this.props.audioType}`})}
                aria-pressed={!this.props.toggleOn}
                className={classes}
                onClick={this.onClickToggleButton}
            >
                {this.getDisplayIcon()}
            </button>
        );
    }
}

export default injectIntl(AudioToggleButton);
