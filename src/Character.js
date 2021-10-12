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

export default class Character extends React.Component<CharacterProps, {}> {
    render() {
        const character = getWorldCharacter(this.props.theme, this.props.world);
        return (
            <g
                className='Character'
                transform={this.props.transform}>
                {React.createElement(character,
                    {
                        className: 'Character__icon',
                        x: -this.props.width/2,
                        y: -this.props.width/2,
                        width: this.props.width,
                        height: this.props.width
                    }
                )}
            </g>
        );
    }
}
