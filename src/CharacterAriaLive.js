// @flow

import React from 'react';
import CharacterState from './CharacterState';
import { getBackgroundInfo } from './Worlds';
import { injectIntl } from 'react-intl';
import type {IntlShape} from 'react-intl';
import type { RunningState } from './types';
import type { WorldName } from './Worlds';

type CharacterAriaLiveProps = {
    intl: IntlShape,
    ariaLiveRegionId: string,
    characterState: CharacterState,
    runningState: RunningState,
    world: WorldName
};

class CharacterAriaLive extends React.Component<CharacterAriaLiveProps, {}> {
    setCharacterMovingAriaLive() {
        const ariaLiveRegion = document.getElementById(this.props.ariaLiveRegionId);

        const characterLabel = this.props.intl.formatMessage({id: this.props.world + ".character"});

        // $FlowFixMe: Flow doesn't know that elements have innerText.
        ariaLiveRegion.innerText=this.props.intl.formatMessage(
            {id:'CharacterAriaLive.movementAriaLabel'},
            {character: characterLabel}
        );
    }

    updateCharacterPositionAriaLive() {
        const characterState = this.props.characterState;
        const columnLabel = characterState.getColumnLabel();
        const rowLabel = characterState.getRowLabel();
        const characterLabel = this.props.intl.formatMessage({id: this.props.world + ".character"});
        const direction = this.props.intl.formatMessage({id: `Direction.${characterState.direction}`});
        const ariaLiveRegion = document.getElementById(this.props.ariaLiveRegionId);
        const backgroundInfo = getBackgroundInfo(this.props.world, columnLabel, rowLabel);
        if (backgroundInfo) {
            const itemOnGridCell = this.props.intl.formatMessage({ id: `${this.props.world}.${backgroundInfo}` });
            // $FlowFixMe: Flow doesn't know that elements have innerText.
            ariaLiveRegion.innerText = this.props.intl.formatMessage(
                {id:'CharacterAriaLive.positionAriaLabelWithItem'},
                {
                    columnLabel,
                    rowLabel,
                    direction,
                    item: itemOnGridCell,
                    character: characterLabel
                }
            )
        } else {
            // $FlowFixMe: Flow doesn't know that elements have innerText.
            ariaLiveRegion.innerText=this.props.intl.formatMessage(
                {id:'CharacterAriaLive.positionAriaLabel'},
                {
                    columnLabel,
                    rowLabel,
                    direction,
                    character: characterLabel
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
            else if (this.props.runningState === "running") {
                this.setCharacterMovingAriaLive();
            }
        } else if (prevProps.world !== this.props.world) {
            this.updateCharacterPositionAriaLive();
        }
    }

}

export default injectIntl(CharacterAriaLive);
