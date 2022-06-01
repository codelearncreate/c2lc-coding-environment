// @flow

import type {AppState} from './App';
import type {IntlShape} from 'react-intl';
import type {AudioManager} from './types';
import AnnouncementBuilder from './AnnouncementBuilder';
import {App} from './App';
import {ProgramBlockEditor} from './ProgramBlockEditor';
import ProgramSequence from './ProgramSequence';
import {isLoopBlock, moveToNextStepDisabled, moveToPreviousStepDisabled} from './Utils';

// The ProgramChangeController is responsible for making changes to the
// App 'state.programSequence' and coordinating any user interface
// activities associated with the change, such as making announcements,
// setting focus, or setting up animations.

type FocusAfterMoveEnum = 'focusBlockMoved' | 'focusActionPanel';

export default class ProgramChangeController {
    app: App;
    intl: IntlShape;
    audioManager: AudioManager;
    announcementBuilder: AnnouncementBuilder;

    constructor(app: App, intl: IntlShape, audioManager: AudioManager) {
        this.app = app;
        this.intl = intl;
        this.audioManager = audioManager;
        this.announcementBuilder = new AnnouncementBuilder(intl);
    }

    insertSelectedActionIntoProgram(programBlockEditor: ?ProgramBlockEditor,
        index: number, selectedAction: ?string) {

        this.app.setState((state) => {
            if (selectedAction) {
                this.playAnnouncementForAdd(selectedAction);
                this.doActivitiesForAdd(programBlockEditor, index);
                return {
                    programSequence: state.programSequence.insertStep(index,
                        selectedAction)
                };
            } else {
                return {};
            }
        });
    }

    addSelectedActionToProgramEnd(programBlockEditor: ?ProgramBlockEditor,
        selectedAction: ?string) {

        this.app.setState((state) => {
            if (selectedAction) {
                this.playAnnouncementForAdd(selectedAction);
                const index = state.programSequence.getProgramLength();
                this.doActivitiesForAdd(programBlockEditor, index);
                return {
                    programSequence: state.programSequence.insertStep(index,
                        selectedAction)
                };
            } else {
                return {};
            }
        });
    }

    deleteProgramStep(programBlockEditor: ?ProgramBlockEditor,
        index: number, command: string) {

        this.app.setState((state) => {
            // Check that the step to delete hasn't changed since the
            // user made the deletion
            const currentStep = state.programSequence.getProgramStepAt(index);
            if (command === currentStep.block) {
                // Play the announcement
                const announcementData = this.announcementBuilder.buildDeleteStepAnnouncement(currentStep);
                this.audioManager.playAnnouncement(announcementData.messageIdSuffix,
                    this.intl, announcementData.values);

                if (programBlockEditor) {
                    // If there are steps following the one being deleted, focus
                    // the next step. Otherwise, focus the final add node.
                    if (currentStep.block === 'startLoop') {
                        // On delete of a startLoop, we need to aware of its endLoop block position
                        if (index < state.programSequence.getProgramLength() - 2) {
                            programBlockEditor.focusCommandBlockAfterUpdate(index);
                        } else {
                            programBlockEditor.focusAddNodeAfterUpdate(index);
                        }
                    } else if (currentStep.block === 'endLoop') {
                        // On delete of an endLoop, we lose one more index from deleting its startLoop block
                        if (index < state.programSequence.getProgramLength() - 1) {
                            programBlockEditor.focusCommandBlockAfterUpdate(index - 1);
                        } else {
                            programBlockEditor.focusAddNodeAfterUpdate(index - 1);
                        }
                    } else {
                        if (index < state.programSequence.getProgramLength() - 1) {
                            programBlockEditor.focusCommandBlockAfterUpdate(index);
                        } else {
                            programBlockEditor.focusAddNodeAfterUpdate(index);
                        }
                    }
                }

                return {
                    programSequence: state.programSequence.deleteStep(index)
                };
            } else {
                // If the step to delete has changed, make no changes to the
                // program
                return {};
            }
        });
    }

    replaceProgramStep(programBlockEditor: ?ProgramBlockEditor,
        index: number, selectedAction: ?string) {

        this.app.setState((state) => {
            const currentStep = state.programSequence.getProgramStepAt(index);
            if (isLoopBlock(currentStep.block)) {
                this.audioManager.playAnnouncement('cannotReplaceLoopBlocks', this.intl);
                return {};
            } else if (selectedAction) {
                // Play the announcement
                const announcementData = this.announcementBuilder.buildReplaceStepAnnouncement(
                    currentStep, selectedAction);
                this.audioManager.playAnnouncement(announcementData.messageIdSuffix,
                    this.intl, announcementData.values);

                // Set up focus, scrolling, and animation
                if (programBlockEditor) {
                    programBlockEditor.focusCommandBlockAfterUpdate(index);
                    programBlockEditor.scrollToAddNodeAfterUpdate(index + 1);
                    programBlockEditor.setUpdatedCommandBlock(index);
                }

                return {
                    programSequence: state.programSequence.overwriteStep(index, selectedAction)
                };
            } else {
                this.audioManager.playAnnouncement('noActionSelected', this.intl);
                return {};
            }
        });
    }

    moveProgramStepNext(programBlockEditor: ?ProgramBlockEditor,
        indexFrom: number, commandAtIndexFrom: string,
        focusAfterMove: FocusAfterMoveEnum) {

        this.app.setState((state) => {
            // Check that the step at indexFrom has not changed
            const stepAtIndexFrom = state.programSequence.getProgramStepAt(indexFrom);
            if (commandAtIndexFrom === stepAtIndexFrom.block) {
                if (moveToNextStepDisabled(state.programSequence, indexFrom)) {
                    // Move next is not possible:
                    // Play an announcement and do not change the program
                    this.audioManager.playAnnouncement('cannotMoveNext', this.intl);
                    return {};
                } else {
                    // Play the announcement
                    this.audioManager.playAnnouncement('moveToNext', this.intl);

                    const program = state.programSequence.getProgram();
                    let indexTo = null;

                    if (program[indexFrom].block === 'startLoop') {
                        const label = program[indexFrom].label;
                        for (let i = indexFrom; i < program.length; i++) {
                            if (program[i].block === 'endLoop' && program[i].label === label) {
                                indexTo = i + 1;
                                break;
                            }
                        }
                    } else {
                        indexTo = indexFrom + 1;
                    }

                    if (indexTo != null) {
                        return this.doMove(
                            programBlockEditor,
                            state,
                            state.programSequence.swapStep(indexFrom, indexTo),
                            focusAfterMove,
                            indexFrom + 1,
                            'moveToNextStep'
                        );
                    }
                }
            } else {
                // If the step to move has changed, make no changes to the program
                return {};
            }
        });
    }

    moveProgramStepPrevious(programBlockEditor: ?ProgramBlockEditor,
        indexFrom: number, commandAtIndexFrom: string,
        focusAfterMove: FocusAfterMoveEnum) {

        this.app.setState((state) => {
            // Check that the step at indexFrom has not changed
            const stepAtIndexFrom = state.programSequence.getProgramStepAt(indexFrom);
            if (commandAtIndexFrom === stepAtIndexFrom.block) {
                if (moveToPreviousStepDisabled(state.programSequence, indexFrom)) {
                    // Move previous is not possible:
                    // Play an announcement and do not change the program
                    this.audioManager.playAnnouncement('cannotMovePrevious', this.intl);
                    return {};
                } else {
                    // Play the announcement
                    this.audioManager.playAnnouncement('moveToPrevious', this.intl);

                    const program = state.programSequence.getProgram();
                    let indexTo = null;

                    if (program[indexFrom].block === 'endLoop') {
                        const label = program[indexFrom].label;
                        for (let i = 0; i < indexFrom; i++) {
                            if (program[i].block === 'startLoop' && program[i].label === label) {
                                indexTo = i - 1;
                                break;
                            }
                        }
                    } else {
                        indexTo = indexFrom - 1;
                    }

                    if (indexTo != null) {
                        return this.doMove(
                            programBlockEditor,
                            state,
                            state.programSequence.swapStep(indexFrom, indexTo),
                            focusAfterMove,
                            indexFrom - 1,
                            'moveToPreviousStep'
                        );
                    }
                }
            } else {
                // If the step to move has changed, make no changes to the program
                return {};
            }
        });
    }

    // Internal methods

    playAnnouncementForAdd(action: string) {
        const announcementData = this.announcementBuilder.buildAddStepAnnouncement(action);
        this.audioManager.playAnnouncement(announcementData.messageIdSuffix,
            this.intl, announcementData.values);
    }

    doActivitiesForAdd(programBlockEditor: ?ProgramBlockEditor, index: number) {
        // Set up focus, scrolling, and animation
        if (programBlockEditor) {
            programBlockEditor.focusCommandBlockAfterUpdate(index);
            programBlockEditor.scrollToAddNodeAfterUpdate(index + 1);
            programBlockEditor.setUpdatedCommandBlock(index);
        }
    }

    // Performs activities on the programBlockEditor and returns the
    // new state for App
    doMove(programBlockEditor: ?ProgramBlockEditor, appState: AppState,
        newProgramSequence: ProgramSequence, focusAfterMove: FocusAfterMoveEnum,
        indexAfterMove: number, focusedActionPanelOptionName: string) {

        // Case 1: move via action panel button
        //     - keep action panel open, focus on button used
        // Case 2: move via shortcut, action panel closed
        //     - focus moved block, keep action panel closed
        // Case 3: move via shortcut, action panel open
        //     - focus moved block, keep action panel open

        if (focusAfterMove === 'focusActionPanel') {
            return {
                programSequence: newProgramSequence,
                actionPanelStepIndex: indexAfterMove,
                actionPanelFocusedOptionName: focusedActionPanelOptionName
            };
        } else if (focusAfterMove === 'focusBlockMoved' && appState.actionPanelStepIndex == null) {
            if (programBlockEditor != null) {
                programBlockEditor.focusCommandBlockAfterUpdate(indexAfterMove);
            }
            return {
                programSequence: newProgramSequence,
                actionPanelStepIndex: null,
                actionPanelFocusedOptionName: null
            };
        } else if (focusAfterMove === 'focusBlockMoved' && appState.actionPanelStepIndex != null) {
            if (programBlockEditor != null) {
                programBlockEditor.focusCommandBlockAfterUpdate(indexAfterMove);
            }
            return {
                programSequence: newProgramSequence,
                actionPanelStepIndex: indexAfterMove,
                actionPanelFocusedOptionName: null
            };
        }
    }
};
