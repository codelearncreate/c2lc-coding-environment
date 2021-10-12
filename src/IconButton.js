// @flow

import * as React from 'react';
import classNames from 'classnames';
import './IconButton.scss';

// TODO: Rename the IconButton 'disabled' property
//       The name 'disabled' suggests that the property determines the
//       enabled/disabled state of the button, whereas it styles the
//       button to indicate if the feature that the button refers to
//       is enabled or disabled (such as the keyboard shortcuts being
//       enabled or disabled).

type IconButtonProps = {
    className?: string,
    children: any,
    disabled?: boolean,
    ariaLabel: string,
    onClick: () => void,
    onKeyDown: (e: KeyboardEvent) => void
};

class IconButton extends React.Component<IconButtonProps, {}> {
    render() {
        const classes = classNames(
            "IconButton",
            this.props.disabled && "IconButton--disabled",
            this.props.className
        );
        return (
            <div
                aria-label={this.props.ariaLabel}
                className={classes}
                role='button'
                tabIndex={0}
                onClick={this.props.onClick}
                onKeyDown={this.props.onKeyDown}
            >
                {this.props.children}
            </div>
        );
    }
};

export default IconButton;
