// @flow

import type { Program } from './types';
import * as React from 'react';
import { injectIntl } from 'react-intl';
import { Button } from 'react-bootstrap';
import { ReactComponent as PlayIcon } from './svg/Play.svg';
import './PlayButton.css';

type PlayButtonProps = {
    intl: any,
    disabled: boolean,
    program: Program,
    onClick: () => void,

};

class PlayButton extends React.Component<PlayButtonProps, {}> {
    render() {
        return (
            <Button
                className='PlayButton__run-block'
                disabled={this.props.disabled}
                onClick={this.props.onClick}
                aria-label={`${this.props.intl.formatMessage({id:'PlayButton.run'})} ${this.props.program.join(' ')}`}>
                <span role='img' aria-label={this.props.intl.formatMessage({id:'PlayButton.run'})}>
                    <PlayIcon className='play-svg'/>
                </span>
            </Button>
        );
    }
}

export default injectIntl(PlayButton);
