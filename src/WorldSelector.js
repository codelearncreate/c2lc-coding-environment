// @flow

import React from 'react';
import type { WorldName } from './types';
import type { IntlShape } from 'react-intl';
import { injectIntl } from 'react-intl';

import AriaDisablingButton from './AriaDisablingButton';
import {ReactComponent as HeaderIcon} from './svg/SelectWorld.svg'
import {ReactComponent as RabbitIcon} from './svg/Rabbit.svg';
import {ReactComponent as RobotIcon} from './svg/Robot.svg';
import { ReactComponent as SpaceShipIcon } from './svg/SpaceShip.svg';

import './WorldSelector.scss';

type WorldSelectorProps = {
    intl: IntlShape,
    world: WorldName,
    disabled: boolean,
    onSelect: (value: WorldName) => void
};


class WorldSelector extends React.Component<WorldSelectorProps, {}> {
    static defaultProps = {
        disabled: false
    };

    handleCharacterClick = (event: Event) => {
        event.preventDefault();
        // $FlowFixMe: Flow doesn't get what we're doing stashing a value on the element.
        this.props.onSelect(event.currentTarget.value);
    }

    handleCharacterKeyDown = (event: KeyboardEvent) => {
        const toggleKeys = [' ', 'Enter'];

        if (toggleKeys.indexOf(event.key) !== -1) {
            event.preventDefault();
            // $FlowFixMe: Flow doesn't get what we're doing stashing a value on the element.
            this.props.onSelect(event.currentTarget.value);
        }
    }

    render() {
        return (
            <div className='WorldSelector'>
                <HeaderIcon
                    aria-label={this.props.intl.formatMessage({id:'WorldSelector.world'})}
                    className="HeaderIcon"
                />
                <AriaDisablingButton
                    aria-label={this.props.intl.formatMessage({id:'WorldSelector.world.default'})}
                    aria-pressed={this.props.world === 'default'}
                    className={"WorldIcon" + (this.props.world === 'default' ? " WorldIcon--selected" : "") }
                    disabled={this.props.disabled}
                    onClick={this.handleCharacterClick}
                    onKeyDown={this.handleCharacterKeyDown}
                    value="default"
                >
                    <RobotIcon/>
                </AriaDisablingButton>
                <AriaDisablingButton
                    aria-label={this.props.intl.formatMessage({id:'WorldSelector.world.forest'})}
                    aria-pressed={this.props.world === 'forest'}
                    className={"WorldIcon" + (this.props.world === 'forest' ? " WorldIcon--selected" : "") }
                    disabled={this.props.disabled}
                    onClick={this.handleCharacterClick}
                    onKeyDown={this.handleCharacterKeyDown}
                    value="forest"
                >
                    <RabbitIcon/>
                </AriaDisablingButton>
                <AriaDisablingButton
                    aria-label={this.props.intl.formatMessage({id:'WorldSelector.world.space'})}
                    aria-pressed={this.props.world === 'space'}
                    className={"WorldIcon" + (this.props.world === 'space' ? " WorldIcon--selected" : "") }
                    disabled={this.props.disabled}
                    onClick={this.handleCharacterClick}
                    onKeyDown={this.handleCharacterKeyDown}
                    value="space"
                >
                    <SpaceShipIcon/>
                </AriaDisablingButton>
            </div>
        );
    }
}

export default injectIntl(WorldSelector);
