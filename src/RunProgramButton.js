// @flow

import type { Program } from './types';
import * as React from 'react';
import { injectIntl } from 'react-intl';
import { Button } from 'react-bootstrap';
import { ReactComponent as PlayIcon } from './svg/Play.svg';
import './RunProgramButton.css';

type RunProgramButtonProps = {
    intl: any,
    disabled: boolean,
    program: Program,
    onClick: () => void,

};

class RunProgramButton extends React.Component<RunProgramButtonProps, {}> {
    render() {
        return (
            <Button
                className='RunProgramButton__run-button'
                disabled={this.props.disabled}
                onClick={this.props.onClick}
                aria-label={`${this.props.intl.formatMessage({id:'PlayButton.run'})} ${this.props.program.join(' ')}`}>
                <span role='img' aria-label={this.props.intl.formatMessage({id:'PlayButton.run'})}>
                    <PlayIcon className='RunProgramButton__play-svg'/>
                </span>
            </Button>
        );
    }
}

export default injectIntl(RunProgramButton);
