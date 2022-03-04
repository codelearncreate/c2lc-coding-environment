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

    makeStepMessageData() {
        const currentStep = this.props.programSequence.getProgramStepAt(this.props.pressedStepIndex);

        let stepNumber = this.props.pressedStepIndex + 1;
        const cachedCurrentStepLoopData = currentStep.cache;
        if (cachedCurrentStepLoopData != null && cachedCurrentStepLoopData.get('containingLoopPosition') != null) {
            stepNumber = cachedCurrentStepLoopData.get('containingLoopPosition');
        }

        let stepName = '';
        if (currentStep.block === 'startLoop' || currentStep.block === 'endLoop') {
            stepName = this.props.intl.formatMessage(
                { id: 'Command.loop.label' },
                { loopLabel: currentStep.label }
            );
        } else {
            stepName = this.props.intl.formatMessage(
                { id: `Command.${currentStep.block}` }
            );
        }

        let selectedCommandName = '';
        if (this.props.selectedCommandName != null) {
            selectedCommandName = this.props.intl.formatMessage(
                { id: 'ActionPanel.selectedCommandName' },
                { selectedCommandName:
                    this.props.intl.formatMessage({id: `Command.${this.props.selectedCommandName}`})
                }
            );
        }

        return {
            'stepNumber': stepNumber,
            'stepName': stepName,
            'selectedCommandName': selectedCommandName,
            'previousStepInfo': this.makePreviousStepInfo(),
            'nextStepInfo': this.makeNextStepInfo()
        };
    }

    makePreviousStepInfo(): ?string {
        const currentStep = this.props.programSequence.getProgramStepAt(this.props.pressedStepIndex);
        if (this.props.pressedStepIndex > 0) {
            const prevStep = this.props.programSequence.getProgramStepAt(this.props.pressedStepIndex - 1);
            const cachedPreviousStepLoopData = prevStep.cache;
            const prevStepName = prevStep.block;
            // When previous step is startLoop, aria-label communicates that movePrevious will move out of the current loop
            if (prevStepName === 'startLoop' && currentStep.block !== 'endLoop') {
                return this.props.intl.formatMessage(
                    { id: 'CommandInfo.previousStep.startLoop' },
                    { loopLabel: prevStep.label }
                );
            // When previous step is endLoop, aria-label communicates that movePrevious will move into a loop
            } else if (prevStepName === 'endLoop') {
                return this.props.intl.formatMessage(
                    { id: 'CommandInfo.previousStep.endLoop'},
                    { loopLabel: prevStep.label }
                );
            } else {
                // When previous step is not loops and current step is endLoop, calculate the index the loop will move by
                // finding its pair startLoop block
                if (currentStep.block === 'endLoop') {
                    const startLoopIndex = this.props.programSequence.getMatchingLoopBlockIndex(this.props.pressedStepIndex);
                    const program = this.props.programSequence.getProgram();
                    if (startLoopIndex != null && program[startLoopIndex - 1] != null) {
                        return this.props.intl.formatMessage(
                            { id: 'CommandInfo.previousStep.loop' },
                            {
                                previousStepNumber: startLoopIndex,
                                command: this.props.intl.formatMessage({id: `Command.${program[startLoopIndex - 1].block}`})
                            }
                        )
                    }
                // When previous step is wrapped in a loop, aria-label communicates position within a loop
                } else if (cachedPreviousStepLoopData != null &&
                    cachedPreviousStepLoopData.get('containingLoopPosition') != null &&
                    cachedPreviousStepLoopData.get('containingLoopLabel') != null) {
                    return this.props.intl.formatMessage(
                        { id: 'CommandInfo.previousStep.inLoop'},
                        {
                            previousStepNumber: cachedPreviousStepLoopData.get('containingLoopPosition'),
                            command: this.props.intl.formatMessage({id: `Command.${prevStepName}`}),
                            loopLabel: cachedPreviousStepLoopData.get('containingLoopLabel')
                        }
                    )
                // When previous step is a movements step and not in a loop, aria-label communicates position within the program
                } else {
                    return this.props.intl.formatMessage(
                        { id: 'CommandInfo.previousStep'},
                        {
                            previousStepNumber: this.props.pressedStepIndex,
                            command: this.props.intl.formatMessage({id: `Command.${prevStepName}`})
                        }
                    );
                }
            }
        }
    }

    makeNextStepInfo(): ?string {
        const currentStep = this.props.programSequence.getProgramStepAt(this.props.pressedStepIndex);
        if (this.props.pressedStepIndex < (this.props.programSequence.getProgramLength() - 1)) {
            const nextStep = this.props.programSequence.getProgramStepAt(this.props.pressedStepIndex + 1);
            const cachedNextStepLoopData = nextStep.cache;
            const nextStepName = nextStep.block;
            // When next step is startLoop, aria-label communicates that moveNext will move into a loop
            if (nextStepName === 'startLoop') {
                return this.props.intl.formatMessage(
                    { id: 'CommandInfo.nextStep.startLoop'},
                    { loopLabel: nextStep.label }
                );
            // When next step is endLoop, aria-label communicates that moveNext will move out of the current loop
            } else if (nextStepName === 'endLoop' && currentStep.block !== 'startLoop') {
                return this.props.intl.formatMessage(
                    { id: 'CommandInfo.nextStep.endLoop'},
                    { loopLabel: nextStep.label }
                );
            } else {
                // When next step is not loops and current step is startLoop, calculate the index the loop will move by
                // finding its pair endLoop block
                if (currentStep.block === 'startLoop') {
                    const endLoopIndex = this.props.programSequence.getMatchingLoopBlockIndex(this.props.pressedStepIndex);
                    const program = this.props.programSequence.getProgram();
                    if (endLoopIndex != null && program[endLoopIndex + 1] != null) {
                        return this.props.intl.formatMessage(
                            { id: 'CommandInfo.nextStep.loop' },
                            {
                                nextStepNumber: endLoopIndex + 2,
                                command: this.props.intl.formatMessage({id: `Command.${program[endLoopIndex + 1].block}`})
                            }
                        );
                    }
                // When next step is wrapped in a loop, aria-label communicates position within a loop
                } else if (cachedNextStepLoopData != null &&
                    cachedNextStepLoopData.get('containingLoopPosition') != null &&
                    cachedNextStepLoopData.get('containingLoopLabel') != null) {
                    return this.props.intl.formatMessage(
                        { id: 'CommandInfo.nextStep.inLoop'},
                        {
                            nextStepNumber: cachedNextStepLoopData.get('containingLoopPosition'),
                            command: this.props.intl.formatMessage({id: `Command.${nextStepName}`}),
                            loopLabel: cachedNextStepLoopData.get('containingLoopLabel')
                        }
                    );
                // When next step is a movements step and not in a loop, aria-label communicates position within the program
                } else {
                    return this.props.intl.formatMessage(
                        { id: 'CommandInfo.nextStep'},
                        {
                            nextStepNumber: this.props.pressedStepIndex + 2,
                            command: this.props.intl.formatMessage({id: `Command.${nextStep.block}`})
                        }
                    );
                }
            }
        }
    }

    getReplaceIsVisible(): boolean {
        const currentStepName = this.props.programSequence.getProgramStepAt(this.props.pressedStepIndex).block;
        return currentStepName !== 'startLoop' && currentStepName !== 'endLoop';
    }

    getMoveToNextStepDisabled(): boolean {
        const programSequence = this.props.programSequence;
        const programLastIndex = programSequence.getProgramLength() - 1;
        const { block, label } = programSequence.getProgramStepAt(this.props.pressedStepIndex);
        if (block === 'startLoop') {
            const lastProgramStep = programSequence.getProgramStepAt(programLastIndex);
            if (lastProgramStep.block === 'endLoop' && lastProgramStep.label === label) {
                return true;
            }
        }
        return this.props.pressedStepIndex === programLastIndex;
    }

    getMoveToPreviousStepDisabled(): boolean {
        const programSequence = this.props.programSequence;
        const { block, label } = programSequence.getProgramStepAt(this.props.pressedStepIndex);
        if (block === 'endLoop') {
            const firstProgramStep = programSequence.getProgramStepAt(0);
            if (firstProgramStep.block === 'startLoop' && firstProgramStep.label === label) {
                return true;
            }
        }
        return this.props.pressedStepIndex === 0;
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
        const stepMessageData = this.makeStepMessageData();
        const moveToNextStepIsDisabled = this.getMoveToNextStepDisabled();
        const moveToPreviousStepIsDisabled = this.getMoveToPreviousStepDisabled();
        const replaceIsVisible = this.getReplaceIsVisible();
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
                        aria-label={this.props.intl.formatMessage({id:'ActionPanel.action.delete'}, stepMessageData)}
                        className='ActionPanel__action-buttons focus-trap-action-panel__action-panel-button'
                        onClick={this.handleClickDelete}>
                        <DeleteIcon className='ActionPanel__action-button-svg' />
                    </AriaDisablingButton>
                    {replaceIsVisible &&
                        <AriaDisablingButton
                            name='replaceCurrentStep'
                            disabled={false}
                            aria-label={this.props.intl.formatMessage({id:'ActionPanel.action.replace'}, stepMessageData)}
                            className='ActionPanel__action-buttons focus-trap-action-panel__action-panel-button focus-trap-action-panel-replace__replace_button'
                            onClick={this.handleClickReplace}>
                            <ReplaceIcon className='ActionPanel__action-button-svg' />
                        </AriaDisablingButton>
                    }
                    <AriaDisablingButton
                        name='moveToPreviousStep'
                        disabled={moveToPreviousStepIsDisabled}
                        disabledClassName='ActionPanel__action-buttons--disabled'
                        aria-label={this.props.intl.formatMessage({id:'ActionPanel.action.moveToPreviousStep'}, stepMessageData)}
                        className='ActionPanel__action-buttons focus-trap-action-panel__action-panel-button'
                        onClick={this.handleClickMoveToPreviousStep}>
                        <MovePreviousIcon className='ActionPanel__action-button-svg' />
                    </AriaDisablingButton>
                    <AriaDisablingButton
                        name='moveToNextStep'
                        disabled={moveToNextStepIsDisabled}
                        disabledClassName='ActionPanel__action-buttons--disabled'
                        aria-label={this.props.intl.formatMessage({id:'ActionPanel.action.moveToNextStep'}, stepMessageData)}
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
