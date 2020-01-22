// @flow

import * as React from 'react';
import { Button } from 'react-bootstrap';
import classNames from 'classnames';

type AriaDisablingButtonProps = {
    onClick: (evt: any) => void,
    disabled: boolean,
    className?: string,
    disabledClassName: string,
    children: React.Node
};

export default class AriaDisablingButton extends React.Component<AriaDisablingButtonProps, {}> {
    handleClick = (evt: any) => {
        if (!this.props.disabled) {
            this.props.onClick(evt);
        }
    };

    render() {
        const {
            onClick,
            disabled,
            className,
            disabledClassName,
            children,
            ...otherProps
        } = this.props;

        const classes = classNames(
            className,
            disabled && disabledClassName
        );

        return React.createElement(
            Button,
            Object.assign({
                "onClick": this.handleClick,
                "aria-disabled": disabled,
                "className": classes
            }, otherProps),
            children
        );
    }
};
