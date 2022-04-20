// @flow

import React from 'react';
import { getWorldCharacter } from './Worlds';
import type { ThemeName } from './types';
import type { WorldName } from './Worlds';

type CharacterProps = {
    world: WorldName,
    theme: ThemeName,
    transform: string,
    width: number,
};

// $FlowFixMe: Flow doesn't know about SVG g element
export default React.forwardRef<CharacterProps, any>(
    (props, ref) => {
        const character = getWorldCharacter(props.theme, props.world);
        return (
            React.createElement(
                'g',
                {
                    ref,
                    className: 'Character',
                    transform: props.transform,
                },
                React.createElement(
                    character,
                    {
                        className: 'Character__icon',
                        x: -props.width/2,
                        y: -props.width/2,
                        width: props.width,
                        height: props.width
                    }
                )
            )
        );
    }
)
