// @flow

import { injectIntl, FormattedMessage } from 'react-intl';
import type {IntlShape} from 'react-intl';
import type {KeyboardInputSchemeName} from './KeyboardInputSchemes';
import type {AudioManager, RunningState, ThemeName, ProgramBlock, ProgramStepMovementDirection} from './types';
import type { WorldName } from './Worlds';
import * as React from 'react';
import CharacterState from './CharacterState';
import ConfirmDeleteAllModal from './ConfirmDeleteAllModal';
import AddNode from './AddNode';
import ActionPanel from './ActionPanel';
import FocusTrapManager from './FocusTrapManager';
import CommandBlock from './CommandBlock';
import classNames from 'classnames';
import IconButton from './IconButton';
import ProgramSequence from './ProgramSequence';
import ToggleSwitch from './ToggleSwitch';
import { ReactComponent as AddIcon } from './svg/Add.svg';
import { ReactComponent as DeleteAllIcon } from './svg/DeleteAll.svg';
import { getWorldCharacter } from './Worlds';
import './ProgramBlockEditor.scss';

// TODO: Send focus to Delete toggle button on close of Delete All confirmation
//       dialog

type ProgramBlockEditorProps = {
    intl: IntlShape,
    actionPanelStepIndex: ?number,
    actionPanelFocusedOptionName: ?string,
    characterState: CharacterState,
    editingDisabled: boolean,
    programSequence: ProgramSequence,
    runningState: RunningState,
    keyboardInputSchemeName: KeyboardInputSchemeName,
    selectedAction: ?string,
    isDraggingCommand: boolean,
    audioManager: AudioManager,
    focusTrapManager: FocusTrapManager,
    addNodeExpandedMode: boolean,
    theme: ThemeName,
    world: WorldName,
    // TODO: Remove onChangeProgramSequence once we have callbacks
    //       for each specific change
    onChangeProgramSequence: (programSequence: ProgramSequence) => void,
    onInsertSelectedActionIntoProgram: (index: number, selectedAction: ?string) => void,
    onDeleteProgramStep: (index: number, command: string) => void,
    onMoveProgramStep: (indexFrom: number, direction: ProgramStepMovementDirection, commandAtIndexFrom: string) => void,
    onChangeActionPanelStepIndexAndOption: (index: ?number, focusedOptionName: ?string) => void,
    onChangeAddNodeExpandedMode: (boolean) => void
};

type ProgramBlockEditorState = {
    showConfirmDeleteAll: boolean,
    replaceIsActive: boolean,
    closestAddNodeIndex: number
};

export class ProgramBlockEditor extends React.Component<ProgramBlockEditorProps, ProgramBlockEditorState> {
    commandBlockRefs: Map<number, HTMLElement>;
    addNodeRefs: Map<number, HTMLElement>;
    loopContainerRefs: Map<string, HTMLElement>;
    focusCommandBlockIndex: ?number;
    focusAddNodeIndex: ?number;
    scrollToAddNodeIndex: ?number;
    updatedCommandBlockIndex: ?number;
    programSequenceContainerRef: { current: null | HTMLDivElement };
    lastCalculatedClosestAddNode: number;

    constructor(props: ProgramBlockEditorProps) {
        super(props);
        this.commandBlockRefs = new Map();
        this.addNodeRefs = new Map();
        this.loopContainerRefs = new Map();
        this.focusCommandBlockIndex = null;
        this.focusAddNodeIndex = null;
        this.scrollToAddNodeIndex = null;
        this.updatedCommandBlockIndex = null;
        this.programSequenceContainerRef = React.createRef();
        this.lastCalculatedClosestAddNode = Date.now();
        this.state = {
            showConfirmDeleteAll : false,
            focusedActionPanelOptionName: null,
            replaceIsActive: false,
            closestAddNodeIndex: -1
        }
    }

    scrollProgramSequenceContainer(toElement: HTMLElement) {
        if (this.programSequenceContainerRef.current) {
            const containerElem = this.programSequenceContainerRef.current;
            if (toElement != null && toElement.dataset.stepnumber === '0') {
                try {
                    containerElem.scrollTo(0, 0);
                } catch {
                    // eslint-disable-next-line no-console
                    console.log('Error auto scrolling program sequence container');
                }
            } else if (toElement != null){
                const containerLeft = containerElem.getBoundingClientRect().left;
                const containerWidth = containerElem.clientWidth;
                const toElementLeft = toElement.getBoundingClientRect().left;
                const toElementRight = toElement.getBoundingClientRect().right;

                if (toElementRight > containerLeft + containerWidth) {
                    // toElement is outside of the container, on the right
                    containerElem.scrollLeft += toElementRight - containerLeft - containerWidth;
                } else if (toElementLeft < containerLeft) {
                    // toElement is outside of the container, on the left
                    containerElem.scrollLeft -= containerLeft - toElementLeft;
                }
            }
        }
    }

    commandIsSelected() {
        return this.props.selectedAction != null;
    }

    setUpdatedCommandBlock(index: number) {
        this.updatedCommandBlockIndex = index;
        // Remove the animation class, if it exists, from the current
        // block at the index, to ensure that the animation (re)starts from
        // the beginning.
        const element = this.commandBlockRefs.get(index);
        if (element) {
            element.classList.remove('ProgramBlockEditor__program-block--updated');
        }
    }

    focusCommandBlockAfterUpdate(index: number) {
        this.focusCommandBlockIndex = index;
    }

    focusAddNodeAfterUpdate(index: number) {
        this.focusAddNodeIndex = index;
    }

    scrollToAddNodeAfterUpdate(index: number) {
        this.scrollToAddNodeIndex = index;
    }

    isPausedOnLastLoopBlock(programStepNumber: number) {
        if (this.props.runningState === 'paused') {
            const programCounter = this.props.programSequence.getProgramCounter();
            const nextProgramStep = this.props.programSequence.getProgramStepAt(programCounter + 1);
            if (nextProgramStep != null && nextProgramStep.block === 'endLoop') {
                const currentStep = this.props.programSequence.getProgramStepAt(programStepNumber);
                if (currentStep.cache) {
                    const containingLoopPosition = currentStep.cache.get('containingLoopPosition');
                    if (containingLoopPosition != null && containingLoopPosition === 1) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    programStepIsActive(programStepNumber: number) {
        if (this.props.runningState === 'running'
            || this.props.runningState === 'stopRequested'
            || this.props.runningState === 'pauseRequested') {
            return (this.props.programSequence.getProgramCounter()) === programStepNumber;
        } else {
            return false;
        }
    }

    closeActionPanel() {
        this.props.onChangeActionPanelStepIndexAndOption(null, null);
    }

    setCommandBlockRef(programStepNumber: number, element: ?HTMLElement) {
        if (element) {
            this.commandBlockRefs.set(programStepNumber, element);
        } else {
            this.commandBlockRefs.delete(programStepNumber);
        }
    }

    setAddNodeRef(programStepNumber: number, element: ?HTMLElement) {
        if (element) {
            this.addNodeRefs.set(programStepNumber, element);
        }
    }

    setLoopContainerRef(loopLabel: string, element: ?HTMLElement) {
        if (element) {
            this.loopContainerRefs.set(loopLabel, element);
        }
    }

    // TODO: Discuss removing this once we have a good way to test drag and drop.
    /* istanbul ignore next */
    findAddNodeClosestToEvent = (event: DragEvent): number => {
        // Find the nearest add node.
        let closestDistance = 100000;
        let closestAddNodeIndex = 0;

        this.addNodeRefs.forEach((addNode, index) => {
            const addNodeBounds = addNode.getBoundingClientRect();
            const nodeCenterX = addNodeBounds.left + (addNodeBounds.width / 2);
            const nodeCenterY = addNodeBounds.top + (addNodeBounds.height / 2);

            // TODO: Figure out how to make flow aware of this.
            const xDistanceSquared = Math.pow((event.clientX - nodeCenterX), 2);
            const yDistanceSquared = Math.pow((event.clientY - nodeCenterY), 2);;
            const distance = Math.sqrt(xDistanceSquared + yDistanceSquared);
            if (distance < closestDistance) {
                closestDistance = distance;
                closestAddNodeIndex = index;
            }
        });
        return closestAddNodeIndex;
    }

    // Handlers

    handleClickDeleteAll = () => {
        this.props.audioManager.playAnnouncement('deleteAll', this.props.intl);
        this.setState({
            showConfirmDeleteAll : true
        });
    };

    handleCancelDeleteAll = () => {
        this.setState({
            showConfirmDeleteAll : false
        });
    };

    handleConfirmDeleteAll = () => {
        this.props.onChangeProgramSequence(
            this.props.programSequence.updateProgram([])
        );
        this.setState({
            showConfirmDeleteAll : false
        });
    };

    handleActionPanelDeleteStep = (index: number) => {
        this.props.onDeleteProgramStep(index,
            this.props.programSequence.getProgramStepAt(index).block);
        this.closeActionPanel();
    };

    handleActionPanelReplaceStep = (index: number) => {
        if (this.props.selectedAction) {
            const programStep = this.props.programSequence.getProgramStepAt(index);
            if (programStep.block !== this.props.selectedAction) {
                const oldCommandString = this.props.intl.formatMessage({ id: "Announcement." + programStep.block});
                //$FlowFixMe: Flow thinks `this.props.selectedAction` might be null even though we check it above.
                const newCommandString = this.props.intl.formatMessage({ id: "Announcement." + this.props.selectedAction});

                this.props.audioManager.playAnnouncement('replace', this.props.intl, { oldCommand: oldCommandString, newCommand: newCommandString});

                this.props.onChangeProgramSequence(
                    //$FlowFixMe: Flow thinks `this.props.selectedAction` might be null even though we check it above.
                    this.props.programSequence.overwriteStep(index, this.props.selectedAction)
                );
                this.setState({
                    replaceIsActive: false
                });
                this.focusCommandBlockIndex = index;
                this.scrollToAddNodeIndex = index + 1;
                this.setUpdatedCommandBlock(index);
            } else {
                this.setState({
                    replaceIsActive: true
                });
            }
        } else {
            this.props.audioManager.playAnnouncement('noActionSelected', this.props.intl);

            this.setState({
                replaceIsActive: true
            });
        }
    };

    handleActionPanelMoveToPreviousStep = (index: number) => {
        this.props.onMoveProgramStep(
            index,
            'previous',
            this.props.programSequence.getProgramStepAt(index).block
        );
    };

    handleActionPanelMoveToNextStep = (index: number) => {
        this.props.onMoveProgramStep(
            index,
            'next',
            this.props.programSequence.getProgramStepAt(index).block
        );
    };

    handleClickStep = (e: SyntheticEvent<HTMLButtonElement>) => {
        const index = parseInt(e.currentTarget.dataset.stepnumber, 10);
        // Open or close the ActionPanel
        if (this.props.actionPanelStepIndex === index) {
            // The ActionPanel is already open for this program step, close it
            this.closeActionPanel();
        } else {
            // Otherwise, open it
            this.props.onChangeActionPanelStepIndexAndOption(index, null);
        }
    };

    handleChangeLoopIterations = (stepNumber: number, loopLabel: string, loopIterations: number) => {
        const programSequence = this.props.programSequence;
        if (programSequence.getProgram()[stepNumber].label === loopLabel) {
            const program = programSequence.getProgram().slice();
            const loopIterationsLeft = new Map(programSequence.getLoopIterationsLeft());
            program[stepNumber] = Object.assign(
                {},
                program[stepNumber],
                { iterations: loopIterations }
            );
            if (this.props.runningState !== 'stopped') {
                loopIterationsLeft.set(loopLabel, loopIterations);
            }
            this.props.onChangeProgramSequence(programSequence.updateProgramAndLoopIterationsLeft(program, loopIterationsLeft));
        }
    }

    handleFocusProgramBlock = (e: Event) => {
        // $FlowFixMe: Not all elements have dataset property
        if (e.currentTarget.dataset.command === 'startLoop' || e.currentTarget.dataset.command === 'endLoop') {
            const loopLabel = this.props.programSequence.getProgramStepAt(
                parseInt(e.currentTarget.dataset.stepnumber, 10)
            ).label;
            if (loopLabel != null && this.loopContainerRefs.get(loopLabel) != null) {
                this.loopContainerRefs.get(loopLabel)?.classList.add('ProgramBlockEditor__loopContainer--focused');
            }
        }
    }

    handleBlurProgramBlock = (e: Event) => {
        // $FlowFixMe: Not all elements have dataset property
        if (e.currentTarget.dataset.command === 'startLoop' || e.currentTarget.dataset.command === 'endLoop') {
            const stepNumber = parseInt(e.currentTarget.dataset.stepnumber, 10);
            const loopLabel = this.props.programSequence.getProgramStepAt(stepNumber).label;
            if (loopLabel != null && this.loopContainerRefs.get(loopLabel) != null && this.props.actionPanelStepIndex !== stepNumber) {
                this.loopContainerRefs.get(loopLabel)?.classList.remove('ProgramBlockEditor__loopContainer--focused');
            }
        }
    }

    handleProgramCommandBlockAnimationEnd = (e: SyntheticEvent<HTMLButtonElement>) => {
        e.currentTarget.classList.remove('ProgramBlockEditor__program-block--updated');
    };

    handleClickAddNode = (stepNumber: number) => {
        this.props.onInsertSelectedActionIntoProgram(stepNumber,
            this.props.selectedAction);
    };

    // TODO: Discuss removing this once we have a good way to test drag and drop.
    /* istanbul ignore next */
    handleDragCommandOverProgramArea = (event: DragEvent) => {
        if (!this.props.editingDisabled) {
            event.preventDefault();

            // Only attempt to recalculate the closest node every 100ms.
            const timeStamp = Date.now();
            if (timeStamp - this.lastCalculatedClosestAddNode > 100) {
                const closestAddNodeIndex = this.findAddNodeClosestToEvent(event);
                this.lastCalculatedClosestAddNode = timeStamp;

                this.setState({
                    closestAddNodeIndex: closestAddNodeIndex
                });
            }
        }
    }

    // TODO: Discuss removing this once we have a good way to test drag and drop.
    /* istanbul ignore next */
    handleDragLeaveOnProgramArea = (event: DragEvent) => {
        if (!this.props.editingDisabled) {
            // Ignore drag leave events triggered by entering anything that we "contain".
            // We have to use two strategies depending on the browser (see below).

            // If the related target is null or undefined (hi, Safari!),
            // use the element bounds instead.
            // See: https://bugs.webkit.org/show_bug.cgi?id=66547
            if (event.relatedTarget == null) {
                // $FlowFixMe: Flow doesn't understand how we access the client bounds.
                const myBounds = this.programSequenceContainerRef.current.getBoundingClientRect();
                if (event.clientX <= myBounds.left ||
                    event.clientX >= (myBounds.left + myBounds.width) ||
                    event.clientY <= myBounds.top ||
                    event.clientY >= (myBounds.top + myBounds.height)) {
                    this.setState({
                        closestAddNodeIndex: -1
                    });
                }
            }
            // For everything else, we can just check to see if the element triggering the dragLeave event is one of
            // our descendents.
            // $FlowFixMe: Flow doesn't recognise the relatedTarget property.
            else if (!this.programSequenceContainerRef.current.contains(event.relatedTarget)) {
                this.setState({
                    closestAddNodeIndex: -1
                });
            }
        }
    }

    // TODO: Discuss removing this once we have a good way to test drag and drop.
    /* istanbul ignore next */
    handleDropCommandOnProgramArea = (event: DragEvent) => {
        if (!this.props.editingDisabled) {
            event.preventDefault();

            // Nothing should be highlighted once the drop completes.
            this.setState({
                closestAddNodeIndex: -1
            });

            const closestAddNodeIndex = this.findAddNodeClosestToEvent(event);
            this.props.onInsertSelectedActionIntoProgram(closestAddNodeIndex,
                this.props.selectedAction);
        }
    }

    /* istanbul ignore next */
    handleCloseActionPanelFocusTrap = () => {
        this.closeActionPanel();
    };

    /* istanbul ignore next */
    handleCloseReplaceFocusTrap = () => {
        this.setState({
            replaceIsActive: false
        });
    };

    // Rendering

    makeProgramBlock(programStepNumber: number, programBlock: ProgramBlock) {
        const active = this.programStepIsActive(programStepNumber);
        // When the runningState is 'paused', show the pause indicator on
        // programSequence.getProgramCounter(). And when the runningState is
        // 'pauseRequested', show the pause indicator on
        // programSequence.getProgramCounter() + 1, to indicate where the
        // program will pause when the running state transitions to 'paused'.
        // Showing the pause indicator on
        // programSequence.getProgramCounter() + 1 when in 'pauseRequested'
        // works because the next step after programSequence.getProgramCounter()
        // is the one with index programCounter + 1. This is currently true but
        // we will need to revisit this logic when we introduce control flow or
        // blocks into the language.
        const paused = (this.props.runningState === 'paused'
            && programStepNumber === this.props.programSequence.getProgramCounter())
            || (this.props.runningState === 'pauseRequested'
            && programStepNumber === this.props.programSequence.getProgramCounter() + 1
            && !this.props.programSequence.currentStepIsControlBlock());
        const hasActionPanelControl = this.props.actionPanelStepIndex === programStepNumber;
        const command = programBlock.block;
        const loopLabel = programBlock.label;
        const cachedLoopData = programBlock.cache;
        let loopIterations = programBlock.iterations;
        // Show loopItertionsLeft when program is not stopped, or else, show iterations
        if (this.props.runningState !== 'stopped') {
            if (loopLabel != null && this.props.programSequence.getLoopIterationsLeft().get(loopLabel) != null) {
                loopIterations = this.props.programSequence.getLoopIterationsLeft().get(loopLabel);
            }
        }

        let ariaLabel = this.props.intl.formatMessage(
            { id: 'ProgramBlockEditor.command' },
            {
                index: programStepNumber + 1,
                command: this.props.intl.formatMessage(
                    {id: `Command.${command}`},
                    {loopLabel}
                )
            }
        );
        let pauseOnTheEndLoop = false;
        if (cachedLoopData != null &&
            cachedLoopData.get('containingLoopPosition') != null &&
            cachedLoopData.get('containingLoopLabel')) {
            ariaLabel = this.props.intl.formatMessage(
                { id: 'ProgramBlockEditor.nestedCommand' },
                {
                    index: cachedLoopData.get('containingLoopPosition'),
                    parentLoopLabel: cachedLoopData.get('containingLoopLabel'),
                    command: this.props.intl.formatMessage(
                        {id: `Command.${command}`},
                        {loopLabel}
                    )
                },
            );
            if (this.props.runningState === 'paused' &&
                cachedLoopData.get('containingLoopPosition') === 1 &&
                cachedLoopData.get('containingLoopLabel') != null &&
                this.props.programSequence.getCurrentProgramStep().block === 'endLoop') {
                const containingLoopLabel = cachedLoopData.get('containingLoopLabel');
                if (containingLoopLabel != null) {
                    const containingLoopIterationsLeft = this.props.programSequence.getLoopIterationsLeft().get(`${containingLoopLabel}`);
                    if (containingLoopIterationsLeft != null && containingLoopIterationsLeft > 1) {
                        pauseOnTheEndLoop = true;
                    }
                }
            }
        }


        const classes = classNames(
            'ProgramBlockEditor__program-block',
            active && 'ProgramBlockEditor__program-block--active',
            hasActionPanelControl && 'focus-trap-action-panel__program-block',
            ((paused && command !== 'endLoop') || pauseOnTheEndLoop) && 'ProgramBlockEditor__program-block--paused'
        );

        let key = `${programStepNumber}-${command}`;
        if ((command === 'startLoop' || command === 'endLoop') && loopLabel != null) {
            key=`${programStepNumber}-${command}-${loopLabel}`;
        }

        return (
            <CommandBlock
                commandName={command}
                // $FlowFixMe: Limit to specific types of ref.
                ref={ (element) => { this.setCommandBlockRef(programStepNumber, element) } }
                key={key}
                data-stepnumber={programStepNumber}
                data-controltype='programStep'
                data-command={command}
                data-actionpanelgroup={true}
                className={classes}
                loopLabel={programBlock.label}
                loopIterations={loopIterations}
                stepNumber={programStepNumber}
                aria-label={ariaLabel}
                aria-controls={hasActionPanelControl ? 'ActionPanel' : undefined}
                aria-expanded={hasActionPanelControl}
                disabled={this.props.editingDisabled}
                runningState={this.props.runningState}
                keyboardInputSchemeName={this.props.keyboardInputSchemeName}
                onClick={this.handleClickStep}
                onFocus={this.handleFocusProgramBlock}
                onBlur={this.handleBlurProgramBlock}
                onChangeLoopIterations={this.handleChangeLoopIterations}
                onAnimationEnd={this.handleProgramCommandBlockAnimationEnd}
            />
        );
    }

    makeAddNodeAriaLabel(programStepNumber: number, isEndOfProgramAddNode: boolean) {
        const selectedAction = this.props.selectedAction;
        if (selectedAction != null) {
            if (isEndOfProgramAddNode) {
                return this.props.intl.formatMessage(
                    { id: 'ProgramBlockEditor.lastBlock' },
                    { command: this.props.intl.formatMessage({id: `Command.${selectedAction}`}) }
                );
            } else if (programStepNumber === 0) {
                // The add node before the start of the program
                return this.props.intl.formatMessage(
                    { id: 'ProgramBlockEditor.beginningBlock' },
                    { command: this.props.intl.formatMessage({id: `Command.${selectedAction}`}) }
                );
            } else {
                const prevCommand = this.props.programSequence.getProgramStepAt(programStepNumber - 1);
                const postCommand = this.props.programSequence.getProgramStepAt(programStepNumber);
                const prevCommandLabel = prevCommand.label ? prevCommand.label : null;
                const postCommandLabel = postCommand.label ? postCommand.label : null;
                return this.props.intl.formatMessage(
                    { id: 'ProgramBlockEditor.betweenBlocks' },
                    {
                        command: this.props.intl.formatMessage({id: `Command.${selectedAction}`}),
                        prevCommand: `${programStepNumber}, ${this.props.intl.formatMessage({id: `Command.${prevCommand.block}`}, {loopLabel: prevCommandLabel})}`,
                        postCommand: `${programStepNumber+1}, ${this.props.intl.formatMessage({id: `Command.${postCommand.block}`}, {loopLabel: postCommandLabel})}`
                    }
                );
            }
        } else {
            return this.props.intl.formatMessage(
                { id: 'ProgramBlockEditor.blocks.noCommandSelected'}
            );
        }
    }

    makeProgramBlockSection(programStepNumber: number, programBlock: ProgramBlock) {
        const showActionPanel = (this.props.actionPanelStepIndex === programStepNumber);
        return (
            <React.Fragment key={programStepNumber}>
                <div className='ProgramBlockEditor__program-block-with-panel'>
                    <div className='ProgramBlockEditor__action-panel-container-outer'>
                        {showActionPanel &&
                            <div className='ProgramBlockEditor__action-panel-container-inner'>
                                <ActionPanel
                                    focusedOptionName={this.props.actionPanelFocusedOptionName}
                                    selectedCommandName={this.props.selectedAction}
                                    programSequence={this.props.programSequence}
                                    pressedStepIndex={programStepNumber}
                                    onDelete={this.handleActionPanelDeleteStep}
                                    onReplace={this.handleActionPanelReplaceStep}
                                    onMoveToPreviousStep={this.handleActionPanelMoveToPreviousStep}
                                    onMoveToNextStep={this.handleActionPanelMoveToNextStep}/>
                            </div>
                        }
                    </div>
                    {this.makeProgramBlock(programStepNumber, programBlock)}
                </div>
            </React.Fragment>
        );
    }

    makeAddNodeSection(programStepNumber: number) {
        return (
            <React.Fragment>
                <div className='ProgramBlockEditor__program-block-connector'/>
                <AddNode
                    aria-label={this.makeAddNodeAriaLabel(programStepNumber, false)}
                    ref={ (element) => this.setAddNodeRef(programStepNumber, element) }
                    expandedMode={this.props.addNodeExpandedMode}
                    isDraggingCommand={this.props.isDraggingCommand}
                    programStepNumber={programStepNumber}
                    closestAddNodeIndex={this.state.closestAddNodeIndex}
                    disabled={
                        this.props.editingDisabled ||
                        (!this.commandIsSelected() && !this.props.isDraggingCommand)}
                    onClick={this.handleClickAddNode}
                />
                <div className='ProgramBlockEditor__program-block-connector' />
            </React.Fragment>
        );
    }

    makeEndOfProgramAddNodeSection(programStepNumber: number) {
        const isEmptyProgram = this.props.programSequence.getProgramLength() === 0;
        return (
            <React.Fragment key={'endOfProgramAddNodeSection'}>
                <div className='ProgramBlockEditor__program-block-connector'/>
                <AddNode
                    aria-label={this.makeAddNodeAriaLabel(programStepNumber, !isEmptyProgram)}
                    ref={ (element) => this.setAddNodeRef(programStepNumber, element) }
                    expandedMode={true}
                    isDraggingCommand={this.props.isDraggingCommand}
                    programStepNumber={programStepNumber}
                    closestAddNodeIndex={this.state.closestAddNodeIndex}
                    disabled={
                        this.props.editingDisabled ||
                        (!this.commandIsSelected() && !this.props.isDraggingCommand)}
                    onClick={this.handleClickAddNode}
                />
            </React.Fragment>
        )
    }

    renderProgramBlocks() {
        const loopContainers = {};
        const programBlocks = this.props.programSequence.getProgram().map<React.Element<any>>((programBlock, stepNumber) => {
            if (programBlock.block === 'startLoop') {
                const loopLabel = programBlock.label;
                if (loopLabel != null) {
                    loopContainers[loopLabel] = {
                        content: [],
                        startingIndex: stepNumber
                    };
                    loopContainers[loopLabel].content.push(
                        <React.Fragment key={`loop-content-startLoop-${loopLabel}`}>
                            {this.makeProgramBlockSection(stepNumber, programBlock)}
                        </React.Fragment>);
                }
            } else if (programBlock.cache != null && programBlock.block !== 'startLoop' && programBlock.block !== 'endLoop') {
                const containingLoopLabel = programBlock.cache.get('containingLoopLabel');
                if (containingLoopLabel != null) {
                    if (loopContainers[containingLoopLabel] != null) {
                        loopContainers[containingLoopLabel].content.push(
                            <React.Fragment key={`loop-content-${programBlock.block}-${stepNumber}`}>
                                {this.makeAddNodeSection(stepNumber)}
                                {this.makeProgramBlockSection(stepNumber, programBlock)}
                            </React.Fragment>
                        );
                    }
                }
            } else if (programBlock.block === 'endLoop') {
                const loopLabel = programBlock.label;
                if (loopLabel != null) {
                    loopContainers[loopLabel].content.push(
                        <React.Fragment key={`loop-content-endLoop-${loopLabel}`}>
                            {this.makeAddNodeSection(stepNumber)}
                            {this.makeProgramBlockSection(stepNumber, programBlock)}
                        </React.Fragment>
                    );
                    if (programBlock.cache != null) {
                        const containingLoopLabel = programBlock.cache.get('containingLoopLabel');
                        if (containingLoopLabel != null) {
                            const addNodeIndex = loopContainers[loopLabel].startingIndex;
                            loopContainers[containingLoopLabel].content.push(
                                <React.Fragment key={`loop-content-loop-${loopLabel}`}>
                                    {this.makeAddNodeSection(addNodeIndex)}
                                    <div
                                        className='ProgramBlockEditor__loopContainer ProgramBlockEditor__loopContainer--nested'
                                        ref={ (element) => this.setLoopContainerRef(loopLabel, element) }>
                                        <div className='ProgramBlockEditor__program-block-connector-loop' />
                                        {loopContainers[loopLabel].content}
                                        <div className='ProgramBlockEditor__program-block-connector-loop' />
                                    </div>
                                </React.Fragment>
                            );
                            delete loopContainers[loopLabel];
                        }
                    }
                    if (loopContainers[loopLabel] != null) {
                        const addNodeIndex = loopContainers[loopLabel].startingIndex;
                        return <React.Fragment key={`loop-container-${loopLabel}`}>
                            {this.makeAddNodeSection(addNodeIndex)}
                            <div
                                className='ProgramBlockEditor__loopContainer'
                                ref={ (element) => this.setLoopContainerRef(loopLabel, element) }>
                                <div className='ProgramBlockEditor__program-block-connector-loop' />
                                {loopContainers[loopLabel].content}
                                <div className='ProgramBlockEditor__program-block-connector-loop' />
                            </div>
                        </React.Fragment>
                    }
                }
            } else {
                return <React.Fragment key={`program-block-section-${stepNumber}`}>
                    {this.makeAddNodeSection(stepNumber)}
                    {this.makeProgramBlockSection(stepNumber, programBlock)}
                </React.Fragment>
            }
            return <React.Fragment key={`loop-content-Fragment-${stepNumber}`}></React.Fragment>
        });

        return programBlocks;
    }

    render() {
        const contents = this.renderProgramBlocks();
        contents.push(this.makeEndOfProgramAddNodeSection(this.props.programSequence.getProgramLength()));

        const character = getWorldCharacter(this.props.theme, this.props.world);

        return (
            <div className='ProgramBlockEditor__container'>
                <div className='ProgramBlockEditor__header'>
                    <h2 className='ProgramBlockEditor__heading'>
                        <FormattedMessage id='ProgramBlockEditor.programHeading' />
                    </h2>
                    <div className='ProgramBlockEditor__options'>
                        <ToggleSwitch
                            ariaLabel={this.props.intl.formatMessage({id:'ProgramBlockEditor.toggleAddNodeExpandMode'})}
                            value={this.props.addNodeExpandedMode}
                            onChange={this.props.onChangeAddNodeExpandedMode}
                            contentsTrue={<AddIcon />}
                            contentsFalse={<AddIcon />}
                            className='ProgramBlockEditor__add-node-toggle-switch'
                        />
                        <span className='ProgramBlockEditor__program-deleteAll'>
                            <IconButton
                                ariaLabel={this.props.intl.formatMessage({id:'ProgramBlockEditor.program.deleteAll'})}
                                className='ProgramBlockEditor__program-deleteAll-button'
                                disabledClassName='ProgramBlockEditor__program-deleteAll-button--disabled'
                                disabled={this.props.editingDisabled}
                                onClick={this.handleClickDeleteAll}
                                key='deleteButton'
                            >
                                <DeleteAllIcon className='ProgramBlockEditor__program-deleteAll-button-svg'/>
                            </IconButton>
                        </span>
                    </div>
                </div>
                <div className='ProgramBlockEditor__character-column'>
                    <div
                        aria-hidden='true'
                        className={`ProgramBlockEditor__character-column-character-container
                            ProgramBlockEditor__character-column-character-container--${this.props.world}`}
                        role='img'>
                        {React.createElement(
                            character,
                            { className: 'ProgramBlockEditor__character-column-character' }
                        )}
                    </div>
                </div>
                <div
                    className={'ProgramBlockEditor__program-sequence-scroll-container' + (!this.props.editingDisabled && this.props.isDraggingCommand ? ' ProgramBlockEditor__program-sequence-scroll-container--isDragging': '') }
                    ref={this.programSequenceContainerRef}
                    onDragOver={this.handleDragCommandOverProgramArea}
                    onDragLeave={this.handleDragLeaveOnProgramArea}
                    onDrop={this.handleDropCommandOnProgramArea}
                >
                    <div className='ProgramBlockEditor__program-sequence'>
                        <h3 className='sr-only' >
                            <FormattedMessage id='ProgramSequence.heading' />
                        </h3>
                        <div className='ProgramBlockEditor__start-indicator'></div>
                        {contents}
                    </div>
                </div>
                <ConfirmDeleteAllModal
                    show={this.state.showConfirmDeleteAll}
                    onCancel={this.handleCancelDeleteAll}
                    onConfirm={this.handleConfirmDeleteAll}/>
            </div>
        );
    }

    componentDidUpdate() {
        if (this.scrollToAddNodeIndex != null) {
            const element = this.addNodeRefs.get(this.scrollToAddNodeIndex);
            if (element && element.scrollIntoView) {
                element.scrollIntoView({ behavior: 'auto', block: 'nearest', inline: 'nearest' });
            }
            this.scrollToAddNodeIndex = null;
        }
        if (this.focusCommandBlockIndex != null) {
            const element = this.commandBlockRefs.get(this.focusCommandBlockIndex);
            if (element) {
                element.focus();
            }
            this.focusCommandBlockIndex = null;
        }
        if (this.focusAddNodeIndex != null) {
            const addNode = this.addNodeRefs.get(this.focusAddNodeIndex);
            if (addNode) {
                addNode.focus();
            }
            this.focusAddNodeIndex = null;
        }
        if (this.updatedCommandBlockIndex != null) {
            const element = this.commandBlockRefs.get(this.updatedCommandBlockIndex);
            if (element) {
                element.classList.add('ProgramBlockEditor__program-block--updated');
            }
            this.updatedCommandBlockIndex = null;
        }
        if (this.props.runningState === 'running') {
            const activeProgramStepNum = this.props.programSequence.getProgramCounter();

            const activeProgramStep = this.commandBlockRefs.get(activeProgramStepNum);
            const nextProgramStep = this.commandBlockRefs.get(activeProgramStepNum + 1);
            const lastAddNode = this.addNodeRefs.get(this.props.programSequence.getProgramLength());
            if (activeProgramStep && activeProgramStepNum === 0) {
                this.scrollProgramSequenceContainer(activeProgramStep);
            } else if (nextProgramStep) {
                this.scrollProgramSequenceContainer(nextProgramStep);
            } else if (lastAddNode){
                this.scrollProgramSequenceContainer(lastAddNode);
            }
        }
        if (this.props.runningState === 'running'
            || this.props.runningState === 'stopRequested'
            || this.props.runningState === 'pauseRequested') {
            const activeProgramStep = this.props.programSequence.getCurrentProgramStep();
            if (activeProgramStep && activeProgramStep.block === 'startLoop') {
                const loopLabel = activeProgramStep.label;
                if (loopLabel != null && this.loopContainerRefs.get(loopLabel) != null) {
                    this.loopContainerRefs.get(loopLabel)?.classList.add('ProgramBlockEditor__loopContainer--active');
                }
            } else if (activeProgramStep && activeProgramStep.block === 'endLoop') {
                const loopLabel = activeProgramStep.label;
                const loopIterationsLeft = loopLabel ? this.props.programSequence.getLoopIterationsLeft().get(loopLabel) : null;
                if (loopLabel != null &&
                    this.loopContainerRefs.get(loopLabel) != null &&
                    loopIterationsLeft != null &&
                    loopIterationsLeft === 1) {
                    this.loopContainerRefs.get(loopLabel)?.classList.remove('ProgramBlockEditor__loopContainer--active');
                }
            } else {
                if (activeProgramStep && activeProgramStep.cache) {
                    const containingLoopLabel = activeProgramStep.cache.get('containingLoopLabel');
                    // $FlowFixMe: key should be string, but loopContainerRefs.get returns type string | number
                    if (containingLoopLabel != null && this.loopContainerRefs.get(containingLoopLabel) != null) {
                        // $FlowFixMe: key should be string, but loopContainerRefs.get returns type string | number
                        this.loopContainerRefs.get(containingLoopLabel)?.classList.add('ProgramBlockEditor__loopContainer--active');
                    }
                }
            }
        } else {
            for (const loopContainer of this.loopContainerRefs.values()) {
                loopContainer.classList.remove('ProgramBlockEditor__loopContainer--active');
            }
        }
        if (this.props.actionPanelStepIndex != null) {
            if (this.state.replaceIsActive) {
                this.props.focusTrapManager.setFocusTrap(
                    this.handleCloseReplaceFocusTrap,
                    [
                        '.focus-trap-action-panel-replace__replace_button',
                        '.focus-trap-action-panel-replace__command_button'
                    ],
                    '.focus-trap-action-panel-replace__replace_button'
                );
            } else {
                this.props.focusTrapManager.setFocusTrap(
                    this.handleCloseActionPanelFocusTrap,
                    [
                        '.focus-trap-action-panel__program-block',
                        '.focus-trap-action-panel__action-panel-button'
                    ],
                    '.focus-trap-action-panel__program-block'
                );
            }
        } else {
            this.props.focusTrapManager.unsetFocusTrap();
        }
    }
}

export default injectIntl(ProgramBlockEditor, { forwardRef: true });
