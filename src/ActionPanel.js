// @flow

import React from 'react';
import AriaDisablingButton from './AriaDisablingButton';
import ProgramSequence from './ProgramSequence';
import { injectIntl } from 'react-intl';
import type {IntlShape} from 'react-intl';
import {ReactComponent as ActionPanelBackground} from './svg/ActionPanel.svg';
import { ReactComponent as MovePreviousIcon } from './svg/MovePrevious.svg';
import { ReactComponent as MoveNextIcon } from './svg/MoveNext.svg';
import { ReactComponent as DeleteIcon } from './svg/Delete.svg';
import { ReactComponent as ReplaceIcon } from './svg/replace.svg';
import { focusByQuerySelector } from './Utils';
import './ActionPanel.scss';

type ActionPanelProps = {
    focusedOptionName: ?string,
    selectedCommandName: ?string,
    programSequence: ProgramSequence,
    pressedStepIndex: number,
    intl: IntlShape,
    onDelete: (index: number) => void,
    onReplace: (index: number) => void,
    onMoveToPreviousStep: (index: number) => void,
    onMoveToNextStep: (index: number) => void
};

class ActionPanel extends React.Component<ActionPanelProps, {}> {
    actionPanelRef: { current: null | HTMLDivElement };

    constructor(props: ActionPanelProps) {
        super(props);
        this.actionPanelRef = React.createRef();
    }

    makeStepInfoMessage() {
        const currentStepName = this.props.programSequence.getProgramStepAt(this.props.pressedStepIndex);

        const ariaLabelObj = {
            'stepNumber': this.props.pressedStepIndex + 1,
            'stepName': this.props.intl.formatMessage({id:`Command.${currentStepName}`}),
            'selectedCommandName': '',
            'previousStepInfo': '',
            'nextStepInfo': ''
        };

        if (this.props.selectedCommandName) {
            ariaLabelObj['selectedCommandName'] =
                this.props.intl.formatMessage(
                    { id: 'ActionPanel.selectedCommandName' },
                    { selectedCommandName:
                        this.props.intl.formatMessage({id: `Command.${this.props.selectedCommandName}`})
                    }
                );
        }

        if (this.props.pressedStepIndex > 0) {
            const prevStepName = this.props.programSequence.getProgramStepAt(this.props.pressedStepIndex - 1);
            ariaLabelObj['previousStepInfo'] =
                this.props.intl.formatMessage(
                    { id: 'CommandInfo.previousStep'},
                    {
                        previousStepNumber: this.props.pressedStepIndex,
                        command: this.props.intl.formatMessage({id: `Command.${prevStepName}`})
                    }
                );
        }

        if (this.props.pressedStepIndex < (this.props.programSequence.getProgramLength() - 1)) {
            const nextStepName = this.props.programSequence.getProgramStepAt(this.props.pressedStepIndex + 1);
            ariaLabelObj['nextStepInfo'] =
                this.props.intl.formatMessage(
                    { id: 'CommandInfo.nextStep'},
                    {
                        nextStepNumber: this.props.pressedStepIndex + 2,
                        command: this.props.intl.formatMessage({id: `Command.${nextStepName}`})
                    }
                );
        }

        return ariaLabelObj;
    }

    // handlers

    handleClickDelete = () => {
        this.props.onDelete(this.props.pressedStepIndex);
    };

    handleClickReplace = () => {
        this.props.onReplace(this.props.pressedStepIndex);
    };

    handleClickMoveToPreviousStep = () => {
        this.props.onMoveToPreviousStep(this.props.pressedStepIndex);
    };

    handleClickMoveToNextStep = () => {
        this.props.onMoveToNextStep(this.props.pressedStepIndex);
    };

    render() {
        const stepInfoMessage = this.makeStepInfoMessage();
        return (
            <React.Fragment>
                <div className="ActionPanel__background">
                    <ActionPanelBackground/>
                </div>
                <div
                    id='ActionPanel'
                    className={'ActionPanel__panel'}
                    data-actionpanelgroup={true}
                    ref={this.actionPanelRef}>
                    <AriaDisablingButton
                        name='deleteCurrentStep'
                        disabled={false}
                        aria-label={this.props.intl.formatMessage({id:'ActionPanel.action.delete'}, stepInfoMessage)}
                        className='ActionPanel__action-buttons focus-trap-action-panel__action-panel-button'
                        onClick={this.handleClickDelete}>
                        <DeleteIcon className='ActionPanel__action-button-svg' />
                    </AriaDisablingButton>
                    <AriaDisablingButton
                        name='replaceCurrentStep'
                        disabled={false}
                        aria-label={this.props.intl.formatMessage({id:'ActionPanel.action.replace'}, stepInfoMessage)}
                        className='ActionPanel__action-buttons focus-trap-action-panel__action-panel-button focus-trap-action-panel-replace__replace_button'
                        onClick={this.handleClickReplace}>
                        <ReplaceIcon className='ActionPanel__action-button-svg' />
                    </AriaDisablingButton>
                    <AriaDisablingButton
                        name='moveToPreviousStep'
                        disabled={this.props.pressedStepIndex === 0}
                        disabledClassName='ActionPanel__action-buttons--disabled'
                        aria-label={this.props.intl.formatMessage({id:'ActionPanel.action.moveToPreviousStep'}, stepInfoMessage)}
                        className='ActionPanel__action-buttons focus-trap-action-panel__action-panel-button'
                        onClick={this.handleClickMoveToPreviousStep}>
                        <MovePreviousIcon className='ActionPanel__action-button-svg' />
                    </AriaDisablingButton>
                    <AriaDisablingButton
                        name='moveToNextStep'
                        disabled={this.props.pressedStepIndex === this.props.programSequence.getProgramLength()-1}
                        disabledClassName='ActionPanel__action-buttons--disabled'
                        aria-label={this.props.intl.formatMessage({id:'ActionPanel.action.moveToNextStep'}, stepInfoMessage)}
                        className='ActionPanel__action-buttons focus-trap-action-panel__action-panel-button'
                        onClick={this.handleClickMoveToNextStep}>
                        <MoveNextIcon className='ActionPanel__action-button-svg' />
                    </AriaDisablingButton>
                </div>
            </React.Fragment>

        )
    }

    componentDidMount() {
        const element = this.actionPanelRef.current;
        if (element && element.scrollIntoView) {
            element.scrollIntoView({ behavior: 'auto', block: 'nearest', inline: 'nearest' });
            if (this.props.focusedOptionName != null) {
                focusByQuerySelector(`[name="${this.props.focusedOptionName}"]`);
            }
        }
    }
}

export default injectIntl(ActionPanel);
