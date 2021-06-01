// @flow

import React from 'react';
import { ReactComponent as RobotIcon } from './svg/Robot.svg';
import { ReactComponent as SpaceShipIcon } from './svg/SpaceShip.svg';
import { ReactComponent as RabbitIcon } from './svg/Rabbit.svg';
import './Character.scss';

type CharacterProps = {
    world: string,
    transform: string,
    width: number,
};

export default class Character extends React.Component<CharacterProps, {}> {
    getThemedCharacter = () => {
        if (this.props.world === 'space') {
            return (
                <SpaceShipIcon
                    className='Character__icon'
                    x={-this.props.width/2}
                    y={-this.props.width/2}
                    width={this.props.width}
                    height={this.props.width} />
            )
        } else if (this.props.world === 'forest') {
            return (
                <RabbitIcon
                    className='Character__icon'
                    x={-this.props.width/2}
                    y={-this.props.width/2}
                    width={this.props.width}
                    height={this.props.width} />
            )
        } else {
            return (
                <RobotIcon
                    className='Character__icon'
                    x={-this.props.width/2}
                    y={-this.props.width/2}
                    width={this.props.width}
                    height={this.props.width} />
            )
        }
    }

    render() {
        return (
            <g
                className='Character'
                transform={this.props.transform}>
                {this.getThemedCharacter()}
            </g>
        );
    }
}
