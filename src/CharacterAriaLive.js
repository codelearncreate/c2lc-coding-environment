// @flow

import React from 'react';
import CharacterState from './CharacterState';
import { injectIntl } from 'react-intl';
import type {IntlShape} from 'react-intl';
import type { RunningState, WorldName } from './types';

type CharacterAriaLiveProps = {
    intl: IntlShape,
    ariaLiveRegionId: string,
    characterState: CharacterState,
    runningState: RunningState,
    world: WorldName
};

class CharacterAriaLive extends React.Component<CharacterAriaLiveProps, {}> {
    getCharacterAriaLabel() {
        if (this.props.world === 'space') {
            return this.props.intl.formatMessage(
                {id:'CharacterAriaLive.spaceShipCharacter'}
            );
        } else if (this.props.world === 'forest') {
            return this.props.intl.formatMessage(
                {id:'CharacterAriaLive.rabbitCharacter'}
            );
        } else {
            return this.props.intl.formatMessage(
                {id:'CharacterAriaLive.robotCharacter'}
            );
        }
    }

    setCharacterMovingAriaLive() {
        const ariaLiveRegion = document.getElementById(this.props.ariaLiveRegionId);
        const character = this.getCharacterAriaLabel();

        // $FlowFixMe: Flow doesn't know that elements have innerText.
        ariaLiveRegion.innerText=this.props.intl.formatMessage(
            {id:'CharacterAriaLive.movementAriaLabel'},
            { character }
        );
    }

    updateCharacterPositionAriaLive() {
        const characterState = this.props.characterState;
        const xPos = characterState.getColumnLabel();
        const yPos = characterState.getRowLabel();
        const direction = this.props.intl.formatMessage({id: `Direction.${characterState.direction}`});
        const ariaLiveRegion = document.getElementById(this.props.ariaLiveRegionId);
        const character = this.getCharacterAriaLabel();
        // $FlowFixMe: Flow doesn't know that elements have innerText.
        ariaLiveRegion.innerText=this.props.intl.formatMessage(
            {id:'CharacterAriaLive.positionAriaLabel'},
            {
                character,
                xPos,
                yPos,
                direction
            }
        );
    }

    render() {
        return (
            <React.Fragment />
        );
    }

    componentDidUpdate(prevProps: CharacterAriaLiveProps) {
        // Ensure updateCharacterPositionAriaLive gets called only once
        if (prevProps.characterState !== this.props.characterState) {
            if (this.props.runningState !== 'running') {
                this.updateCharacterPositionAriaLive();
            }
        }  else if (prevProps.runningState !== this.props.runningState) {
            if (this.props.runningState === 'pauseRequested' ||
                this.props.runningState === 'stopRequested' ||
                (prevProps.runningState === 'running' && this.props.runningState === 'stopped')) {
                this.updateCharacterPositionAriaLive();
            }
            else if (this.props.runningState === "running") {
                this.setCharacterMovingAriaLive();
            }
        }
    }

}

export default injectIntl(CharacterAriaLive);
