// @flow

import * as React from 'react';
import classNames from 'classnames';
import './IconButton.scss';

type IconButtonProps = {
    className?: string,
    children: any,
    disabled?: boolean,
    disabledClassName?: string,
    ariaLabel: string,
    onClick: () => void
};

class IconButton extends React.Component<IconButtonProps, {}> {
    handleKeyDown = (event: KeyboardEvent) => {
        if (!this.props.disabled && (event.key === "Enter" || event.key === " ")) {
            event.preventDefault();
            this.props.onClick();
        }
    }

    handleClick = () => {
        if (!this.props.disabled) {
            this.props.onClick();
        }
    }

    render() {
        const classes = classNames(
            "IconButton",
            this.props.disabled && "IconButton--disabled",
            this.props.disabled && this.props.disabledClassName,
            this.props.className
        );
        return (
            <div
                aria-disabled={this.props.disabled}
                aria-label={this.props.ariaLabel}
                className={classes}
                role='button'
                tabIndex={0}
                onClick={this.handleClick}
                onKeyDown={this.handleKeyDown}
            >
                {this.props.children}
            </div>
        );
    }
};

export default IconButton;
