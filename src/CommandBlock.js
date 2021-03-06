// @flow

import * as React from 'react';
import AriaDisablingButton from './AriaDisablingButton';
import { Button } from 'react-bootstrap';
import classNames from 'classnames';
import { ReactComponent as Forward1 } from './svg/Forward1.svg';
import { ReactComponent as Forward2 } from './svg/Forward2.svg';
import { ReactComponent as Forward3 } from './svg/Forward3.svg';
import { ReactComponent as Left45 } from './svg/Left45.svg';
import { ReactComponent as Left90 } from './svg/Left90.svg';
import { ReactComponent as Left180 } from './svg/Left180.svg';
import { ReactComponent as Right45 } from './svg/Right45.svg';
import { ReactComponent as Right90 } from './svg/Right90.svg';
import { ReactComponent as Right180 } from './svg/Right180.svg';

type CommandBlockProps = {
    commandName: string,
    onClick: (evt: SyntheticEvent<HTMLButtonElement>) => void,
    disabled: boolean,
    className?: string
};

// TODO: Revise this once there is a proper strategy for typing SVG-backed
//       components.
const commandBlockIconTypes = new Map<string, any>([
    ['forward1', Forward1],
    ['forward2', Forward2],
    ['forward3', Forward3],
    ['left45', Left45],
    ['left90', Left90],
    ['left180', Left180],
    ['right45', Right45],
    ['right90', Right90],
    ['right180', Right180]
]);

export default React.forwardRef<CommandBlockProps, Button>(
    (props, ref) => {
        const {
            commandName,
            onClick,
            disabled,
            className,
            ...otherProps
        } = props;

        let icon = null;
        const iconType = commandBlockIconTypes.get(commandName);
        if (iconType) {
            icon = React.createElement(
                iconType,
                {
                    className: 'command-block-svg'
                }
            );
        }

        const classes = classNames(
            'command-block',
            className
        );

        return React.createElement(
            AriaDisablingButton,
            Object.assign({
                'variant': `command-block--${commandName}`,
                'className': classes,
                'onClick': onClick,
                'disabled': disabled,
                'ref': ref
            }, otherProps),
            icon
        );
    }
);
