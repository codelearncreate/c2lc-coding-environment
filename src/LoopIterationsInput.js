// @flow

import type { RunningState } from './types';
import React from 'react';

type LoopIterationsInputProps = {
    loopIterationsStr: string,
    loopLabel: string,
    stepNumber: number,
    runningState: RunningState,
    onChangeLoopIterations: (stepNumber: number, loopLabel: string, loopIterations: number) => void
};

type LoopIterationsInputState = {
    loopIterationsStr: string
};

export default class LoopIterationsInput extends React.Component<LoopIterationsInputProps, LoopIterationsInputState> {
    constructor(props: LoopIterationsInputProps) {
        super(props);
        this.state = {
            loopIterationsStr: this.props.loopIterationsStr
        }
    }

    isValidLoopIterations(value: number) {
        return value >= 0 && value <= 99;
    }

    handleChange = (e: SyntheticKeyboardEvent<HTMLInputElement>) => {
        this.setState({loopIterationsStr: e.currentTarget.value});
    }

    handleClick = (e: Event) => {
        e.stopPropagation();
    }

    handleKeyDown = (e: SyntheticKeyboardEvent<HTMLInputElement>) => {
        const enterKey = 'Enter';
        if (e.key === enterKey) {
            e.preventDefault();
            const loopIterationsValue = parseInt(e.currentTarget.value, 10);
            if (this.isValidLoopIterations(loopIterationsValue)) {
                this.props.onChangeLoopIterations(this.props.stepNumber, this.props.loopLabel, loopIterationsValue);
            } else {
                this.setState({loopIterationsStr: this.props.loopIterationsStr});
            }
        }
    }

    handleBlur = (e: SyntheticEvent<HTMLInputElement>) => {
        const loopIterationsValue = parseInt(e.currentTarget.value, 10);
        if (this.isValidLoopIterations(loopIterationsValue)) {
            this.props.onChangeLoopIterations(this.props.stepNumber, this.props.loopLabel, loopIterationsValue);
        } else {
            this.setState({loopIterationsStr: this.props.loopIterationsStr});
        }
    }

    componentDidUpdate(prevProps: LoopIterationsInputProps) {
        if (this.props.runningState !== prevProps.runningState && this.props.runningState === 'stopped') {
            this.setState({loopIterationsStr: this.props.loopIterationsStr});
        }
    }

    render() {
        return (
            <input
                // TODO: ARIA label
                className='command-block-loop-iterations'
                maxLength='2'
                size='2'
                type='text'
                inputmode='decimal'
                value={this.state.loopIterationsStr}
                onChange={this.handleChange}
                onClick={this.handleClick}
                onKeyDown={this.handleKeyDown}
                onBlur={this.handleBlur}
            />
        );
    }
}
