// @flow

import React from 'react';
import classNames from 'classnames';
import './ToggleSwitch.scss';

type ToggleSwitchProps = {
    id?: string,
    ariaLabel: string,
    value: boolean,
    className?: string,
    contentsTrue: any,
    contentsFalse: any,
    onChange: (value: boolean) => void
};

export default class ToggleSwitch extends React.Component<ToggleSwitchProps, {}> {
    handleClick = () => {
        this.toggleStateChange();
    }

    handleKeyDown = (e: SyntheticKeyboardEvent<HTMLInputElement>) => {
        if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            this.toggleStateChange();
        }
    }

    toggleStateChange() {
        this.props.onChange(!this.props.value);
    }

    render() {
        const classes = classNames(
            this.props.className,
            'ToggleSwitch',
            { 'ToggleSwitch--checked': this.props.value }
        );
        return (
            <div
                id={this.props.id}
                className={classes}
                role='switch'
                aria-label={this.props.ariaLabel}
                aria-checked={this.props.value}
                tabIndex='0'
                onClick={this.handleClick}
                onKeyDown={this.handleKeyDown}>
                <div className='ToggleSwitch__switch-inner-circle' >
                    {this.props.value ?
                        this.props.contentsTrue :
                        this.props.contentsFalse
                    }
                </div>
            </div>
        )
    }
}
