// @flow

import * as React from 'react';
import classNames from 'classnames';
import './TextButton.scss';

export type TextButtonProps = {
    id?: string,
    key?: string,
    className?: string,
    label: string,
    isPrimary?: boolean,
    onClick: () => void
};

class TextButton extends React.Component<TextButtonProps, {}> {
    static defaultProps = {
        isPrimary: false
    };

    handleClick = (event: Event) => {
        event.preventDefault();
        this.props.onClick();
    }

    render() {
        const classes = classNames(
            "TextButton",
            this.props.className,
            this.props.isPrimary ? "TextButton--primaryButton" : "TextButton--secondaryButton"
        );
        return (
            <button
                id={this.props.id}
                className={classes}
                onClick={this.handleClick}
            >
                {this.props.label}
            </button>
        );
    }
};

export default TextButton;
