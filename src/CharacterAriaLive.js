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
    updateCharacterPositionAriaLive() {
        const characterState = this.props.characterState;
        const xPos = characterState.getColumnLabel();
        const yPos = characterState.getRowLabel();
        const direction = this.props.intl.formatMessage({id: `Direction.${characterState.direction}`});
        const ariaLiveRegion = document.getElementById(this.props.ariaLiveRegionId);
        if (this.props.world === 'space') {
            // $FlowFixMe: Flow doesn't know about character-position div
            ariaLiveRegion.innerText=this.props.intl.formatMessage(
                {id:'ProgramBlockEditor.spaceShipCharacter'},
                {
                    xPos,
                    yPos,
                    direction
                }
            );
        } else if (this.props.world === 'forest') {
            // $FlowFixMe: Flow doesn't know about character-position div
            ariaLiveRegion.innerText=this.props.intl.formatMessage(
                {id:'ProgramBlockEditor.rabbitCharacter'},
                {
                    xPos,
                    yPos,
                    direction
                }
            );
        } else {
            // $FlowFixMe: Flow doesn't know about character-position div
            ariaLiveRegion.innerText=this.props.intl.formatMessage(
                {id:'ProgramBlockEditor.robotCharacter'},
                {
                    xPos,
                    yPos,
                    direction
                }
            );
        }
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
        }
    }

}

export default injectIntl(CharacterAriaLive);
