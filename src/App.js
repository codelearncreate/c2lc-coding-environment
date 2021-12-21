// @flow
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { injectIntl } from 'react-intl';
import type {IntlShape} from 'react-intl';
import AllowedActionsSerializer from './AllowedActionsSerializer';
import AudioManagerImpl from './AudioManagerImpl';
import CharacterAriaLive from './CharacterAriaLive';
import CharacterState from './CharacterState';
import CharacterStateSerializer from './CharacterStateSerializer';
import CharacterPositionController from './CharacterPositionController';
import CommandPaletteCommand from './CommandPaletteCommand';
import C2lcURLParams from './C2lcURLParams';
import DashConnectionErrorModal from './DashConnectionErrorModal';
import DashDriver from './DashDriver';
import * as FeatureDetection from './FeatureDetection';
import FakeAudioManager from './FakeAudioManager';
import FocusTrapManager from './FocusTrapManager';
import IconButton from './IconButton';
import Interpreter from './Interpreter';
import PlayButton from './PlayButton';
import ProgramBlockEditor from './ProgramBlockEditor';
import RefreshButton from './RefreshButton';
import Scene from './Scene';
import SceneDimensions from './SceneDimensions';
import StopButton from './StopButton';
import AudioFeedbackToggleSwitch from './AudioFeedbackToggleSwitch';
import PenDownToggleSwitch from './PenDownToggleSwitch';
import ProgramSequence from './ProgramSequence';
import ProgramSpeedController from './ProgramSpeedController';
import ProgramSerializer from './ProgramSerializer';
import ShareButton from './ShareButton';
import ActionsSimplificationModal from './ActionsSimplificationModal';
import type { ActionToggleRegister, AudioManager, CommandName, DeviceConnectionStatus, RobotDriver, RunningState, ThemeName } from './types';
import type { WorldName } from './Worlds';
import { getWorldProperties } from './Worlds';
import WorldSelector from './WorldSelector';
import * as Utils from './Utils';
import './App.scss';
import './Themes.scss';
import './vendor/dragdroptouch/DragDropTouch.js';
import ThemeSelector from './ThemeSelector';
import { ReactComponent as HiddenBlock } from './svg/Hidden.svg';
import KeyboardInputModal from './KeyboardInputModal';

import type {ActionName, KeyboardInputSchemeName} from './KeyboardInputSchemes';
import {findKeyboardEventSequenceMatches, isRepeatedEvent, isKeyboardInputSchemeName} from './KeyboardInputSchemes';
import { ReactComponent as KeyboardModalToggleIcon} from './svg/Keyboard.svg';
import { ReactComponent as WorldIcon } from './svg/World.svg';
import { ReactComponent as ActionsMenuToggleIcon } from './svg/ActionsMenuToggle.svg'
import ProgramChangeController from './ProgramChangeController';

/* Dash connection removed for version 0.5
import BluetoothApiWarning from './BluetoothApiWarning';
import DeviceConnectControl from './DeviceConnectControl';
*/

// Uncomment to use the FakeRobotDriver (see driver construction below also)
//import FakeRobotDriver from './FakeRobotDriver';

type AppContext = {
    bluetoothApiIsAvailable: boolean
};

type AppSettings = {
    language: string,
    addNodeExpandedMode: boolean,
    theme: ThemeName,
    world: WorldName
};

type AppProps = {
    intl: IntlShape,
    audioManager?: AudioManager
};

type AppState = {
    programSequence: ProgramSequence,
    characterState: CharacterState,
    settings: AppSettings,
    dashConnectionStatus: DeviceConnectionStatus,
    showDashConnectionError: boolean,
    selectedAction: ?string,
    isDraggingCommand: boolean,
    audioEnabled: boolean,
    announcementsEnabled: boolean,
    actionPanelStepIndex: ?number,
    sceneDimensions: SceneDimensions,
    drawingEnabled: boolean,
    runningState: RunningState,
    allowedActions: ActionToggleRegister,
    keyBindingsEnabled: boolean,
    keyboardInputSchemeName: KeyboardInputSchemeName;
    showKeyboardModal: boolean,
    showWorldSelector: boolean,
    showActionsSimplificationMenu: boolean
};

export class App extends React.Component<AppProps, AppState> {
    version: string;
    appContext: AppContext;
    sceneDimensions: SceneDimensions;
    dashDriver: RobotDriver;
    interpreter: Interpreter;
    audioManager: AudioManager;
    focusTrapManager: FocusTrapManager;
    programSerializer: ProgramSerializer;
    characterStateSerializer: CharacterStateSerializer;
    allowedActionsSerializer: AllowedActionsSerializer;
    speedLookUp: Array<number>;
    pushStateTimeoutID: ?TimeoutID;
    speedControlRef: { current: null | HTMLElement };
    programBlockEditorRef: { current: any };
    sequenceInProgress: Array<KeyboardEvent>;
    programChangeController: ProgramChangeController;
    defaultWorld: WorldName;

    constructor(props: any) {
        super(props);

        this.version = '1.0';

        this.appContext = {
            bluetoothApiIsAvailable: FeatureDetection.bluetoothApiIsAvailable()
        };

        this.sceneDimensions = new SceneDimensions(1, 12, 1, 8);

        this.interpreter = new Interpreter(1000, this);

        this.speedLookUp = [2000, 1500, 1000, 500, 250];

        this.programSerializer = new ProgramSerializer();

        this.characterStateSerializer = new CharacterStateSerializer(this.sceneDimensions);

        this.allowedActionsSerializer = new AllowedActionsSerializer();

        this.pushStateTimeoutID = null;

        this.sequenceInProgress = [];

        this.defaultWorld = 'Sketchpad';

        this.interpreter.addCommandHandler(
            'forward1',
            'moveCharacter',
            (stepTimeMs) => {
                // TODO: Enable announcements again.
                // this.audioManager.playAnnouncement('forward1', this.props.intl);
                this.setState((state) => {
                    const newCharacterState = state.characterState.forward(1, state.drawingEnabled);

                    // We have to start the sound here because this is where we know the new character state.
                    this.audioManager.playSoundForCharacterState("forward1", stepTimeMs, newCharacterState, this.sceneDimensions);

                    return {
                        characterState: newCharacterState
                    };
                });
                return Utils.makeDelayedPromise(stepTimeMs);
            }
        );

        this.interpreter.addCommandHandler(
            'forward2',
            'moveCharacter',
            (stepTimeMs) => {
                // TODO: Enable announcements again.
                // this.audioManager.playAnnouncement('forward2', this.props.intl);
                this.setState((state) => {
                    const newCharacterState = state.characterState.forward(2, state.drawingEnabled);

                    // We have to start the sound here because this is where we know the new character state.
                    this.audioManager.playSoundForCharacterState("forward2", stepTimeMs, newCharacterState, this.sceneDimensions);

                    return {
                        characterState: newCharacterState
                    };
                });
                return Utils.makeDelayedPromise(stepTimeMs);
            }
        );

        this.interpreter.addCommandHandler(
            'forward3',
            'moveCharacter',
            (stepTimeMs) => {
                // TODO: Enable announcements again.
                // this.audioManager.playAnnouncement('forward3', this.props.intl);
                this.setState((state) => {
                    const newCharacterState = state.characterState.forward(3, state.drawingEnabled);

                    // We have to start the sound here because this is where we know the new character state.
                    this.audioManager.playSoundForCharacterState("forward3", stepTimeMs, newCharacterState, this.sceneDimensions);
                    return {
                        characterState: newCharacterState
                    };
                });
                return Utils.makeDelayedPromise(stepTimeMs);
            }
        );

        this.interpreter.addCommandHandler(
            'backward1',
            'moveCharacter',
            (stepTimeMs) => {
                // TODO: Enable announcements again.
                // this.audioManager.playAnnouncement('backward1');
                this.setState((state) => {
                    const newCharacterState = state.characterState.backward(1, state.drawingEnabled);

                    // We have to start the sound here because this is where we know the new character state.
                    this.audioManager.playSoundForCharacterState("backward1", stepTimeMs, newCharacterState, this.sceneDimensions);
                    return {
                        characterState: newCharacterState
                    };
                });
                return Utils.makeDelayedPromise(stepTimeMs);
            }
        );

        this.interpreter.addCommandHandler(
            'backward2',
            'moveCharacter',
            (stepTimeMs) => {
                // TODO: Enable announcements again.
                // this.audioManager.playAnnouncement('backward2');
                this.setState((state) => {
                    const newCharacterState = state.characterState.backward(2, state.drawingEnabled);

                    // We have to start the sound here because this is where we know the new character state.
                    this.audioManager.playSoundForCharacterState("backward2", stepTimeMs, newCharacterState, this.sceneDimensions);
                    return {
                        characterState: newCharacterState
                    };
                });
                return Utils.makeDelayedPromise(stepTimeMs);
            }
        );

        this.interpreter.addCommandHandler(
            'backward3',
            'moveCharacter',
            (stepTimeMs) => {
                // TODO: Enable announcements again.
                // this.audioManager.playAnnouncement('backward3');
                this.setState((state) => {
                    const newCharacterState = state.characterState.backward(3, state.drawingEnabled);

                    // We have to start the sound here because this is where we know the new character state.
                    this.audioManager.playSoundForCharacterState("backward3", stepTimeMs, newCharacterState, this.sceneDimensions);
                    return {
                        characterState: newCharacterState
                    };
                });
                return Utils.makeDelayedPromise(stepTimeMs);
            }
        );

        this.interpreter.addCommandHandler(
            'left45',
            'moveCharacter',
            (stepTimeMs) => {
                // TODO: Enable announcements again.
                // this.audioManager.playAnnouncement('left45', this.props.intl);
                this.setState((state) => {
                    const newCharacterState = state.characterState.turnLeft(1);

                    // We have to start the sound here because this is where we know the new character state.
                    this.audioManager.playSoundForCharacterState("left45", stepTimeMs, newCharacterState, this.sceneDimensions);

                    return {
                        characterState: newCharacterState
                    };
                });
                return Utils.makeDelayedPromise(stepTimeMs);
            }
        );

        this.interpreter.addCommandHandler(
            'left90',
            'moveCharacter',
            (stepTimeMs) => {
                // TODO: Enable announcements again.
                // this.audioManager.playAnnouncement('left90', this.props.intl);
                this.setState((state) => {
                    const newCharacterState = state.characterState.turnLeft(2);

                    // We have to start the sound here because this is where we know the new character state.
                    this.audioManager.playSoundForCharacterState("left90", stepTimeMs, newCharacterState, this.sceneDimensions);

                    return {
                        characterState: newCharacterState
                    };
                });
                return Utils.makeDelayedPromise(stepTimeMs);
            }
        );

        this.interpreter.addCommandHandler(
            'left180',
            'moveCharacter',
            (stepTimeMs) => {
                // TODO: Enable announcements again.
                // this.audioManager.playAnnouncement('left180', this.props.intl);
                this.setState((state) => {
                    const newCharacterState = state.characterState.turnLeft(4);

                    // We have to start the sound here because this is where we know the new character state.
                    this.audioManager.playSoundForCharacterState("left180", stepTimeMs,  newCharacterState, this.sceneDimensions);

                    return {
                        characterState: newCharacterState
                    };
                });
                return Utils.makeDelayedPromise(stepTimeMs);
            }
        );

        this.interpreter.addCommandHandler(
            'right45',
            'moveCharacter',
            (stepTimeMs) => {
                // TODO: Enable announcements again.
                // this.audioManager.playAnnouncement('right45', this.props.intl);
                this.setState((state) => {
                    const newCharacterState = state.characterState.turnRight(1);

                    // We have to start the sound here because this is where we know the new character state.
                    this.audioManager.playSoundForCharacterState("right45", stepTimeMs, newCharacterState, this.sceneDimensions);

                    return {
                        characterState: newCharacterState
                    };
                });
                return Utils.makeDelayedPromise(stepTimeMs);
            }
        );

        this.interpreter.addCommandHandler(
            'right90',
            'moveCharacter',
            (stepTimeMs) => {
                // TODO: Enable announcements again.
                // this.audioManager.playAnnouncement('right90', this.props.intl);
                this.setState((state) => {
                    const newCharacterState = state.characterState.turnRight(2);

                    // We have to start the sound here because this is where we know the new character state.
                    this.audioManager.playSoundForCharacterState("right90", stepTimeMs, newCharacterState, this.sceneDimensions);

                    return {
                        characterState: newCharacterState
                    };
                });
                return Utils.makeDelayedPromise(stepTimeMs);
            }
        );

        this.interpreter.addCommandHandler(
            'right180',
            'moveCharacter',
            (stepTimeMs) => {
                // TODO: Enable announcements again.
                // this.audioManager.playAnnouncement('right180', this.props.intl);
                this.setState((state) => {
                    const newCharacterState = state.characterState.turnRight(4);

                    // We have to start the sound here because this is where we know the new character state.
                    this.audioManager.playSoundForCharacterState("right180", stepTimeMs, newCharacterState, this.sceneDimensions);

                    return {
                        characterState: newCharacterState
                    };
                });
                return Utils.makeDelayedPromise(stepTimeMs);
            }
        );

        // We have to calculate the allowed commands and initialise the state here because this is the point at which
        // the interpreter's commands are populated.

        // TODO: Make this persist in the URL.
        const allowedActions = {};
        Object.keys(this.interpreter.commands).forEach((commandName) => {
            allowedActions[commandName] = true;
        });

        this.state = {
            programSequence: new ProgramSequence([], 0),
            characterState: this.makeStartingCharacterState(this.defaultWorld),
            settings: {
                language: 'en',
                addNodeExpandedMode: true,
                theme: 'mixed',
                world: this.defaultWorld
            },
            dashConnectionStatus: 'notConnected',
            showDashConnectionError: false,
            selectedAction: null,
            isDraggingCommand: false,
            audioEnabled: true,
            announcementsEnabled: true,
            actionPanelStepIndex: null,
            sceneDimensions: this.sceneDimensions,
            drawingEnabled: true,
            runningState: 'stopped',
            allowedActions: allowedActions,
            keyBindingsEnabled: false,
            showKeyboardModal: false,
            showWorldSelector: false,
            showActionsSimplificationMenu: false,
            keyboardInputSchemeName: "controlalt"
        };

        // For FakeRobotDriver, replace with:
        // this.dashDriver = new FakeRobotDriver();
        this.dashDriver = new DashDriver();

        if (props.audioManager) {
            this.audioManager = props.audioManager
        }
        else if (FeatureDetection.webAudioApiIsAvailable()) {
            this.audioManager = new AudioManagerImpl(this.state.audioEnabled, this.state.announcementsEnabled);
        }
        else {
            this.audioManager = new FakeAudioManager();
        }

        this.focusTrapManager = new FocusTrapManager();

        this.programChangeController = new ProgramChangeController(this,
            this.props.intl, this.audioManager);

        this.speedControlRef = React.createRef();
        this.programBlockEditorRef = React.createRef();
    }

    setStateSettings(settings: $Shape<AppSettings>) {
        this.setState((state) => {
            return {
                settings: Object.assign({}, state.settings, settings)
            }
        });
    }

    getSelectedCommandName() {
        if (this.state.selectedAction !== null) {
            return this.state.selectedAction;
        } else {
            return null;
        }
    }

    setRunningState(runningState: RunningState): void {
        this.setState((state) => {
            // If stop is requested when we are in the 'paused' state,
            // then go straight to 'stopped'
            if (runningState === 'stopRequested' && state.runningState === 'paused') {
                return { runningState: 'stopped' };
            } else {
                return { runningState };
            }
        });
    }

    // API for Interpreter

    getProgramSequence(): ProgramSequence {
        return this.state.programSequence;
    }

    getRunningState(): RunningState {
        return this.state.runningState;
    }

    editingIsDisabled(): boolean {
        return !(this.state.runningState === 'stopped'
            || this.state.runningState === 'paused');
    }

    incrementProgramCounter(callback: () => void): void {
        this.setState((state) => {
            return {
                programSequence: state.programSequence.incrementProgramCounter()
            }
        }, callback);
    }

    // Handlers

    handleProgramSequenceChange = (programSequence: ProgramSequence) => {
        this.setState({
            programSequence: programSequence
        });
    }

    handleProgramBlockEditorInsertSelectedAction = (index: number, selectedAction: ?string) => {
        this.programChangeController.insertSelectedActionIntoProgram(
            this.programBlockEditorRef.current,
            index,
            selectedAction
        );
    }

    handleProgramBlockEditorDeleteStep = (index: number, command: string) => {
        this.programChangeController.deleteProgramStep(
            this.programBlockEditorRef.current,
            index,
            command
        );
    }

    handlePlay = () => {
        switch (this.state.runningState) {
            case 'running':
                this.setState({
                    runningState: 'pauseRequested',
                    actionPanelStepIndex: null
                });
                break;
            case 'pauseRequested': // Fall through
            case 'paused':
                this.setState({
                    runningState: 'running',
                    actionPanelStepIndex: null
                });
                break;
            case 'stopRequested': // Fall through
            case 'stopped':
                this.setState((state) => {
                    return {
                        programSequence: state.programSequence.updateProgramCounter(0),
                        runningState: 'running',
                        actionPanelStepIndex: null
                    };
                });
                break;
            default:
                break;
        }
    };

    handleStop = () => {
        this.setRunningState('stopRequested');
    }

    handleClickConnectDash = () => {
        this.setState({
            dashConnectionStatus: 'connecting',
            showDashConnectionError: false
        });
        this.dashDriver.connect(this.handleDashDisconnect).then(() => {
            this.setState({
                dashConnectionStatus: 'connected'
            });
        }, (error: Error) => {
            /* eslint-disable no-console */
            console.log('ERROR');
            console.log(error.name);
            console.log(error.message);
            /* eslint-enable no-console */
            this.setState({
                dashConnectionStatus: 'notConnected',
                showDashConnectionError: true
            });
        });
    };

    handleCancelDashConnection = () => {
        this.setState({
            showDashConnectionError: false
        });
    };

    handleDashDisconnect = () => {
        this.setState({
            dashConnectionStatus : 'notConnected'
        });
    };

    handleCommandFromCommandPalette = (command: ?string) => {
        if (command) {
            this.setState({
                selectedAction: command
            });
        } else {
            this.setState({
                selectedAction: null
            });
        }
    };

    handleDragStartCommand = (command: string) => {
        this.setState({
            isDraggingCommand: true,
            selectedAction: command,
            actionPanelStepIndex: null
        });
    };

    handleDragEndCommand = () => {
        this.setState({ isDraggingCommand: false });
    };

    handleChangeActionPanelStepIndex = (index: ?number) => {
        this.setState({
            actionPanelStepIndex: index
        });
    };

    handleChangeAddNodeExpandedMode = (isAddNodeExpandedMode: boolean) => {
        this.setStateSettings({
            addNodeExpandedMode: isAddNodeExpandedMode
        });
    };

    handleRootClick = (e: SyntheticInputEvent<HTMLInputElement>) => {
        let element = e.target;
        // Walk up the document tree until we hit the top, or we find that
        // we are within an action panel group area
        while (element != null && element.dataset) {
            if (element.dataset.actionpanelgroup) {
                // We are within an action panel group area, stop looking
                return;
            }
            element = element.parentElement;
        }
        // We hit the top, close the action panel
        this.setState({
            actionPanelStepIndex: null
        });
    };

    // Global shortcut handling.
    // TODO: Convert to use keyboardEventMatchesKeyDef for each command in turn.
    handleDocumentKeyDown = (e: KeyboardEvent) => {
        if (this.state.keyBindingsEnabled) {
            if (e.key === 'Escape') {
                this.sequenceInProgress = [];
                return;
            }

            const isOnlyModifier = ["Shift", "Control", "Alt"].indexOf(e.key) !== -1;
            let isRepeat = false;
            if (this.sequenceInProgress.length) {
                isRepeat = isRepeatedEvent(this.sequenceInProgress[this.sequenceInProgress.length - 1], e);
            }

            if (!isOnlyModifier && !isRepeat) {
                this.sequenceInProgress.push(e);

                const matchingKeyboardAction: ActionName | "partial" | false = findKeyboardEventSequenceMatches(this.sequenceInProgress, this.state.keyboardInputSchemeName);
                if (matchingKeyboardAction === false || matchingKeyboardAction !== "partial") {
                    this.sequenceInProgress = [];
                }

                if (matchingKeyboardAction !== false) {
                    e.preventDefault();
                    switch (matchingKeyboardAction) {
                        case("showHide"):
                            this.setState((currentState) => {
                                return { showKeyboardModal: !(currentState.showKeyboardModal) };
                            });
                            break;
                        case("toggleFeedbackAnnouncements"):
                            // We have to use the function form here as our change is based on the current state.
                            this.setState((currentState) => {
                                return { announcementsEnabled: !(currentState.announcementsEnabled) };
                            });
                            break;
                        case("addCommand"): {
                            if (!this.editingIsDisabled()) {
                                const currentElement = document.activeElement;
                                if (currentElement) {
                                    if (currentElement.dataset.controltype === 'programStep' ||
                                        currentElement.dataset.controltype === 'addNode') {
                                        const index = currentElement.dataset.controltype === 'programStep' ?
                                            parseInt(currentElement.dataset.stepnumber, 10) + 1:
                                            parseInt(currentElement.dataset.stepnumber, 10);
                                        if (index != null) {
                                            this.programChangeController.insertSelectedActionIntoProgram(
                                                this.programBlockEditorRef.current,
                                                index,
                                                this.state.selectedAction
                                            );
                                        }
                                    }
                                }
                            }
                            break;
                        }
                        case("addCommandToBeginning"):
                            if (!this.editingIsDisabled()) {
                                this.programChangeController.insertSelectedActionIntoProgram(
                                    this.programBlockEditorRef.current,
                                    0,
                                    this.state.selectedAction
                                );
                            }
                            break;
                        case("addCommandToEnd"):
                            if (!this.editingIsDisabled()) {
                                this.programChangeController.addSelectedActionToProgramEnd(
                                    this.programBlockEditorRef.current,
                                    this.state.selectedAction
                                );
                            }
                            break;
                        case("deleteCurrentStep"):
                            if (!this.editingIsDisabled()) {
                                const currentElement = document.activeElement;
                                if (currentElement) {
                                    if (currentElement.dataset.controltype === 'programStep') {
                                        const index = parseInt(currentElement.dataset.stepnumber, 10);
                                        if (index != null) {
                                            this.programChangeController.deleteProgramStep(
                                                this.programBlockEditorRef.current,
                                                index,
                                                currentElement.dataset.command
                                            );
                                        }
                                    }
                                }
                            }
                            break;
                        case("deleteAll"): {
                            if (!this.editingIsDisabled()) {
                                const newProgramSequence = this.state.programSequence.updateProgram([]);
                                this.handleProgramSequenceChange(newProgramSequence);
                            }
                            break;
                        }
                        case("announceScene"):
                            const ariaLiveRegion = document.getElementById('character-position');
                            if (ariaLiveRegion) {
                                if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
                                    window.speechSynthesis.cancel();
                                }
                                const utterance = new SpeechSynthesisUtterance(ariaLiveRegion.innerText);
                                window.speechSynthesis.speak(utterance);
                            }
                            break;
                        case("playPauseProgram"):
                            if (this.state.programSequence.getProgramLength() > 0) {
                                this.handlePlay();
                            }
                            break;
                        case("refreshScene"):
                            if (!this.editingIsDisabled()) {
                                this.handleRefresh();
                            }
                            break;
                        case("stopProgram"):
                            if (this.state.runningState !== 'stopped' && this.state.runningState !== 'stopRequested') {
                                this.handleStop();
                            }
                            break;
                        case("decreaseProgramSpeed"):
                            this.changeProgramSpeedIndex(this.speedLookUp.indexOf(this.interpreter.stepTimeMs) - 1);
                            break;
                        case("increaseProgramSpeed"):
                            this.changeProgramSpeedIndex(this.speedLookUp.indexOf(this.interpreter.stepTimeMs) + 1);
                            break;
                        case("selectForward1"):
                            this.setState({ "selectedAction": "forward1" });
                            break;
                        case("selectForward2"):
                            this.setState({ "selectedAction": "forward2" });
                            break;
                        case("selectForward3"):
                            this.setState({ "selectedAction": "forward3" });
                            break;
                        case("selectBackward1"):
                            this.setState({ "selectedAction": "backward1" });
                            break;
                        case("selectBackward2"):
                            this.setState({ "selectedAction": "backward2" });
                            break;
                        case("selectBackward3"):
                            this.setState({ "selectedAction": "backward3" });
                            break;
                        case("selectLeft45"):
                            this.setState({ "selectedAction": "left45" });
                            break;
                        case("selectLeft90"):
                            this.setState({ "selectedAction": "left90" });
                            break;
                        case("selectLeft180"):
                            this.setState({ "selectedAction": "left180" });
                            break;
                        case("selectRight45"):
                            this.setState({ "selectedAction": "right45" });
                            break;
                        case("selectRight90"):
                            this.setState({ "selectedAction": "right90" });
                            break;
                        case("selectRight180"):
                            this.setState({ "selectedAction": "right180" });
                            break;
                        case("focusActions"):
                            Utils.focusByQuerySelector(".command-block");
                            break;
                        case("focusAppHeader"):
                            Utils.focusByQuerySelector(".keyboard-shortcut-focus__app-header");
                            break;
                        case("focusAddNodeToggle"):
                            Utils.focusByQuerySelector(".ProgramBlockEditor__add-node-toggle-switch");
                            break;
                        case("focusCharacterPositionControls"):
                            Utils.focusByQuerySelector(".CharacterPositionController__character-position-button");
                            break;
                        case("focusCharacterColumnInput"):
                            Utils.focusByQuerySelector(".ProgramBlock__character-position-coordinate-box-column");
                            break;
                        case("focusCharacterRowInput"):
                            Utils.focusByQuerySelector(".ProgramBlock__character-position-coordinate-box-row");
                            break;
                        case("focusPlayShare"):
                            Utils.focusByQuerySelector(".PlayButton--play");
                            break;
                        case("focusProgramSequence"):
                            Utils.focusByQuerySelector(".AddNode__expanded-button");
                            break;
                        case("focusScene"):
                            Utils.focusByQuerySelector(".PenDownToggleSwitch");
                            break;
                        case("focusWorldSelector"):
                            Utils.focusByQuerySelector(".keyboard-shortcut-focus__world-selector");
                            break;
                        case("moveCharacterLeft"):
                            if (!this.editingIsDisabled()) {
                                this.handleChangeCharacterPosition('left');
                            }
                            break;
                        case("moveCharacterRight"):
                            if (!this.editingIsDisabled()) {
                                this.handleChangeCharacterPosition('right');
                            }
                            break;
                        case("moveCharacterUp"):
                            if (!this.editingIsDisabled()) {
                                this.handleChangeCharacterPosition('up');
                            }
                            break;
                        case("moveCharacterDown"):
                            if (!this.editingIsDisabled()) {
                                this.handleChangeCharacterPosition('down');
                            }
                            break;
                        case("turnCharacterLeft"):
                            if (!this.editingIsDisabled()) {
                                this.handleChangeCharacterPosition('turnLeft');
                            }
                            break;
                        case("turnCharacterRight"):
                            if (!this.editingIsDisabled()) {
                                this.handleChangeCharacterPosition('turnRight');
                            }
                            break;
                        case("penDownToggle"):
                            const currentPendownState = this.state.drawingEnabled;
                            this.handleTogglePenDown(!currentPendownState);
                            break;
                        case("changeToDefaultTheme"):
                            this.setStateSettings({theme: "mixed"});
                            break;
                        case("changeToLightTheme"):
                            this.setStateSettings({theme: "light"});
                            break;
                        case("changeToDarkTheme"):
                            this.setStateSettings({theme: "dark"});
                            break;
                        case("changeToGrayscaleTheme"):
                            this.setStateSettings({theme: "gray"});
                            break;
                        case("changeToHighContrastTheme"):
                            this.setStateSettings({theme: "contrast"});
                            break;
                        default:
                            break;
                    }
                }
            }
            else if (isRepeat) {
                e.preventDefault();
            }
        }
    };

    handleKeyboardModalClose = () => {
        this.setState({showKeyboardModal: false});
    };

    handleClickKeyboardIcon = () => {
        this.setState({ showKeyboardModal: true});
    };

    // Focus trap escape key handling.
    handleRootKeyDown = (e: SyntheticKeyboardEvent<HTMLInputElement>) => {
        this.focusTrapManager.handleKeyDown(e);
    }

    handleToggleAudioFeedback = (announcementsEnabled: boolean) => {
        this.setState({
            announcementsEnabled: announcementsEnabled
        });
    }

    handleTogglePenDown = (drawingEnabled: boolean) => {
        this.setState({
            drawingEnabled: drawingEnabled
        });
    }

    handleToggleAllowedCommand = (event: Event, commandName: CommandName) => {
        // TODO: Use the function form of setState() as the new state
        //       depends on the current state
        const currentIsAllowed = this.state.allowedActions[commandName];
        if (this.state.programSequence.usesAction(commandName) && currentIsAllowed) {
            event.preventDefault();
        }
        else {
            const newAllowedActions= Object.assign({}, this.state.allowedActions);
            newAllowedActions[commandName] = !currentIsAllowed;
            this.setState({ allowedActions: newAllowedActions})
        }
    }

    changeProgramSpeedIndex = (newSpeedIndex: number) => {
        if (newSpeedIndex >= 0 && newSpeedIndex <= (this.speedLookUp.length - 1)) {
            this.interpreter.setStepTime(this.speedLookUp[newSpeedIndex]);
            if (this.speedControlRef.current) {
                // $FlowFixMe: Flow doesn't believe that we have sufficiently ensured that current !== null.
                this.speedControlRef.current.value = (newSpeedIndex + 1).toString();
            }
        }
    }

    handleChangeProgramSpeed = (stepTimeMs: number) => {
        this.interpreter.setStepTime(stepTimeMs);
    }

    renderCommandBlocks = (commands: Array<CommandName>) => {
        const commandBlocks = [];

        for (const [index, value] of commands.entries()) {
            const isAllowed = this.state.allowedActions[value];
            if (isAllowed) {
                commandBlocks.push(
                    <CommandPaletteCommand
                        key={`CommandBlock-${index}`}
                        commandName={value}
                        selectedCommandName={this.getSelectedCommandName()}
                        audioManager={this.audioManager}
                        isDraggingCommand={this.state.isDraggingCommand}
                        onChange={this.handleCommandFromCommandPalette}
                        onDragStart={this.handleDragStartCommand}
                        onDragEnd={this.handleDragEndCommand}/>
                );
            } else {
                commandBlocks.push(
                    <div
                        className='command-block--hidden'
                        key={`CommandBlock-${index}`}
                        aria-hidden='true'>
                        <HiddenBlock />
                    </div>
                );
            }
        }

        return commandBlocks;
    }

    makeStartingCharacterState(world: WorldName): CharacterState {
        const worldProperties = getWorldProperties(world);
        return new CharacterState(
            worldProperties.startingX,
            worldProperties.startingY,
            worldProperties.startingDirection,
            [],
            this.sceneDimensions
        );
    }

    handleRefresh = () => {
        const currentWorld = this.state.settings.world;
        this.setState({
            characterState: this.makeStartingCharacterState(currentWorld)
        });
    }

    handleChangeTheme = (theme: ThemeName) => {
        this.setStateSettings({ theme });
    }

    handleChangeCharacterPosition = (positionName: ?string) => {
        switch(positionName) {
            case 'turnLeft':
                this.setState((state) => {
                    return {
                        characterState: state.characterState.turnLeft(1)
                    }
                });
                break;
            case 'turnRight':
                this.setState((state) => {
                    return {
                        characterState: state.characterState.turnRight(1)
                    }
                });
                break;
            case 'up':
                this.setState((state) => {
                    return {
                        characterState: state.characterState.moveUpPosition()
                    }
                });
                break;
            case 'right':
                this.setState((state) => {
                    return {
                        characterState: state.characterState.moveRightPosition()
                    }
                });
                break;
            case 'down':
                this.setState((state) => {
                    return {
                        characterState: state.characterState.moveDownPosition()
                    }
                });
                break;
            case 'left':
                this.setState((state) => {
                    return {
                        characterState: state.characterState.moveLeftPosition()
                    }
                });
                break;
            default:
                break;
        }
    }

    handleChangeCharacterXPosition = (columnLabel: string) => {
        const currentCharacterState = this.state.characterState;
        this.setState({
            characterState: currentCharacterState.changeXPosition(columnLabel)
        });
    }

    handleChangeCharacterYPosition = (rowLabel: string) => {
        const currentCharacterState = this.state.characterState;
        this.setState({
            characterState: currentCharacterState.changeYPosition(parseInt(rowLabel, 10))
        });
    }

    handleChangeKeyboardInputScheme = (keyboardInputSchemeName: KeyboardInputSchemeName) => {
        this.setState({keyboardInputSchemeName});
    }

    handleChangeKeyBindingsEnabled = (keyBindingsEnabled: boolean) => {
        this.setState({keyBindingsEnabled: keyBindingsEnabled});
    }

    handleClickActionsSimplificationIcon = () => {
        if (!this.editingIsDisabled()) {
            this.setState({
                showActionsSimplificationMenu: true
            });
        }
    }

    handleKeyDownActionsSimplificationIcon = (event: KeyboardEvent) => {
        if (!this.editingIsDisabled()) {
            if (event.key === "Enter" || event.key === " ") {
                this.setState({
                    showActionsSimplificationMenu: true
                });
            }
        }
    }

    handleChangeAllowedActions = (allowedActions: ActionToggleRegister) => {
        this.setState({
            showActionsSimplificationMenu: false,
            allowedActions: allowedActions
        });
    }

    handleCancelActionsSimplificationMenu = () => {
        this.setState({ showActionsSimplificationMenu: false});
    }

    //World handlers

    handleClickWorldIcon = () => {
        this.setState({
            showWorldSelector: true
        });
    }

    handleSelectWorld = (world: WorldName) => {
        this.setStateSettings({world});
    }

    handleChangeWorld = (world: WorldName) => {
        this.setState((state) => {
            return {
                showWorldSelector: false,
                settings: Object.assign({}, state.settings, {world})
            };
        });
    }

    render() {
        return (
            <React.Fragment>
                <div
                    className='App__container'
                    role='main'
                    onClick={this.handleRootClick}
                    onKeyDown={this.handleRootKeyDown}>
                    <header className='App__header'>
                        <div className='App__header-row'>
                            <h1 className='App__app-heading'>
                                <a
                                    className='keyboard-shortcut-focus__app-header'
                                    href='https://weavly.org'
                                    aria-label={this.props.intl.formatMessage({id: 'App.appHeading.link'})}
                                    target='_blank'
                                    rel='noopener noreferrer'>
                                    <FormattedMessage id='App.appHeading'/>
                                </a>
                            </h1>
                            <IconButton
                                className="App__header-keyboardMenuIcon focus-keyboardMenuIcon"
                                ariaLabel={this.props.intl.formatMessage({ id: 'KeyboardInputModal.ShowHide.AriaLabel' })}
                                onClick={this.handleClickKeyboardIcon}
                            >
                                <KeyboardModalToggleIcon className='App__header-keyboard-icon'/>
                            </IconButton>
                            <div className='App__header-audio-toggle'>
                                <div className='App__audio-toggle-switch'>
                                    <AudioFeedbackToggleSwitch
                                        value={this.state.announcementsEnabled}
                                        onChange={this.handleToggleAudioFeedback} />
                                </div>
                                {/* Dash connection removed for version 0.5
                                <DeviceConnectControl
                                    disabled={
                                        !this.appContext.bluetoothApiIsAvailable ||
                                        this.state.dashConnectionStatus === 'connected' }
                                    connectionStatus={this.state.dashConnectionStatus}
                                    onClickConnect={this.handleClickConnectDash}>
                                    <FormattedMessage id='App.connectToDash' />
                                </DeviceConnectControl>
                                */}
                            </div>
                            <ThemeSelector onSelect={this.handleChangeTheme} />
                        </div>
                    </header>
                    {/* Dash connection removed for version 0.5
                    {!this.appContext.bluetoothApiIsAvailable &&
                        <Row className='App__bluetooth-api-warning-section'>
                            <Col>
                                <BluetoothApiWarning/>
                            </Col>
                        </Row>
                    }
                    */}
                    <div className='App__scene-container'>
                        <h2 className='sr-only' >
                            <FormattedMessage id='Scene.heading' />
                        </h2>
                        <Scene
                            dimensions={this.state.sceneDimensions}
                            characterState={this.state.characterState}
                            theme={this.state.settings.theme}
                            world={this.state.settings.world}
                        />
                    </div>
                    <div className="App__world-container">
                        <h2 className='sr-only' >
                            <FormattedMessage id='WorldSelector.heading' />
                        </h2>
                        <div className="App__world-selector">
                            <IconButton
                                className='keyboard-shortcut-focus__world-selector'
                                ariaLabel={this.props.intl.formatMessage({ id: 'WorldSelector' })}
                                onClick={this.handleClickWorldIcon}
                            >
                                <WorldIcon className='App__world-selector-icon'/>
                            </IconButton>
                        </div>

                        <div className='App__PenDownToggleSwitch-container'>
                            <PenDownToggleSwitch
                                className='App__penDown-toggle-switch'
                                value={this.state.drawingEnabled}
                                onChange={this.handleTogglePenDown}/>
                        </div>

                        <CharacterPositionController
                            characterState={this.state.characterState}
                            editingDisabled={this.editingIsDisabled()}
                            theme={this.state.settings.theme}
                            world={this.state.settings.world}
                            onChangeCharacterPosition={this.handleChangeCharacterPosition}
                            onChangeCharacterXPosition={this.handleChangeCharacterXPosition}
                            onChangeCharacterYPosition={this.handleChangeCharacterYPosition} />
                    </div>
                    <div className='App__command-palette'>
                        <div className='App__ActionsMenu__header'>
                            <h2 className='App__ActionsMenu__header-heading'>
                                <FormattedMessage id='ActionsMenu.title' />
                            </h2>

                            <div className="App__ActionsMenu__toggle-button"
                                aria-label={this.props.intl.formatMessage({ id: 'ActionsMenu.toggleActionsMenu' })}
                                aria-disabled={this.editingIsDisabled()}
                                role="button"
                                onClick={this.handleClickActionsSimplificationIcon}
                                onKeyDown={this.handleKeyDownActionsSimplificationIcon}
                                tabIndex={0}
                            >
                                <ActionsMenuToggleIcon/>
                            </div>
                        </div>
                        <div className='App__command-palette-command-container'>
                            <div className='App__command-palette-commands'>
                                {this.renderCommandBlocks([
                                    'forward1', 'forward2', 'forward3',
                                    'backward1', 'backward2', 'backward3'
                                ])}
                            </div>
                            <div className='App__command-palette-commands'>
                                {this.renderCommandBlocks([
                                    'left45', 'left90', 'left180',
                                    'right45', 'right90', 'right180'
                                ])}
                            </div>
                        </div>
                    </div>
                    <div className='App__program-block-editor'>
                        <ProgramBlockEditor
                            ref={this.programBlockEditorRef}
                            actionPanelStepIndex={this.state.actionPanelStepIndex}
                            characterState={this.state.characterState}
                            editingDisabled={this.editingIsDisabled()}
                            programSequence={this.state.programSequence}
                            runningState={this.state.runningState}
                            selectedAction={this.state.selectedAction}
                            isDraggingCommand={this.state.isDraggingCommand}
                            audioManager={this.audioManager}
                            focusTrapManager={this.focusTrapManager}
                            addNodeExpandedMode={this.state.settings.addNodeExpandedMode}
                            theme={this.state.settings.theme}
                            world={this.state.settings.world}
                            onChangeProgramSequence={this.handleProgramSequenceChange}
                            onInsertSelectedActionIntoProgram={this.handleProgramBlockEditorInsertSelectedAction}
                            onDeleteProgramStep={this.handleProgramBlockEditorDeleteStep}
                            onChangeActionPanelStepIndex={this.handleChangeActionPanelStepIndex}
                            onChangeAddNodeExpandedMode={this.handleChangeAddNodeExpandedMode}
                        />
                    </div>
                    <div className='App__playAndShare-background' />
                    <div className='App__playAndShare-container'>
                        <h2 className='sr-only' >
                            <FormattedMessage id='PlayControls.heading' />
                        </h2>
                        <div className='App__playControl-container'>
                            <div className='App__playButton-container'>
                                <RefreshButton
                                    className='App__playControlButton'
                                    disabled={this.editingIsDisabled()}
                                    onClick={this.handleRefresh}
                                />
                                <PlayButton
                                    className='App__playControlButton'
                                    interpreterIsRunning={this.state.runningState === 'running'}
                                    disabled={this.state.programSequence.getProgramLength() === 0}
                                    onClick={this.handlePlay}
                                />
                                <StopButton
                                    className='App__playControlButton'
                                    disabled={
                                        this.state.runningState === 'stopped'
                                        || this.state.runningState === 'stopRequested'}
                                    onClick={this.handleStop}/>
                                <ProgramSpeedController
                                    rangeControlRef={this.speedControlRef}
                                    values={this.speedLookUp}
                                    onChange={this.handleChangeProgramSpeed}
                                />
                            </div>
                        </div>
                        <div className='App__shareButton-container'>
                            <ShareButton/>
                        </div>
                    </div>
                </div>
                <CharacterAriaLive
                    ariaLiveRegionId='character-position'
                    ariaHidden={this.state.showWorldSelector}
                    characterState={this.state.characterState}
                    runningState={this.state.runningState}
                    world={this.state.settings.world}/>
                <DashConnectionErrorModal
                    show={this.state.showDashConnectionError}
                    onCancel={this.handleCancelDashConnection}
                    onRetry={this.handleClickConnectDash}/>
                <KeyboardInputModal
                    show={this.state.showKeyboardModal}
                    keyBindingsEnabled={this.state.keyBindingsEnabled}
                    keyboardInputSchemeName={this.state.keyboardInputSchemeName}
                    onChangeKeyboardInputScheme={this.handleChangeKeyboardInputScheme}
                    onChangeKeyBindingsEnabled={this.handleChangeKeyBindingsEnabled}
                    onHide={this.handleKeyboardModalClose}
                />
                <WorldSelector
                    show={this.state.showWorldSelector}
                    currentWorld={this.state.settings.world}
                    theme={this.state.settings.theme}
                    onChange={this.handleChangeWorld}
                    onSelect={this.handleSelectWorld}/>
                <ActionsSimplificationModal
                    show={this.state.showActionsSimplificationMenu}
                    onCancel={this.handleCancelActionsSimplificationMenu}
                    onConfirm={this.handleChangeAllowedActions}
                    allowedActions={this.state.allowedActions}
                    programSequence={this.state.programSequence}
                />
            </React.Fragment>
        );
    }

    componentDidMount() {
        // As long as we have no underlying "default" theme styles, we need to always set this to ensure that the default theme is applied on startup.
        if (document.body) {
            document.body.className = `${this.state.settings.theme}-theme`;
        }

        if (window.location.search != null && window.location.search !== '') {
            const params = new C2lcURLParams(window.location.search);
            const programQuery = params.getProgram();
            const characterStateQuery = params.getCharacterState();
            const themeQuery = params.getTheme();
            const allowedActionsQuery = params.getAllowedActions();
            const worldQuery = params.getWorld();

            if (programQuery != null) {
                try {
                    const programSequence: ProgramSequence = new ProgramSequence(this.programSerializer.deserialize(programQuery), 0);
                    this.setState({
                        programSequence: programSequence
                    });
                } catch(err) {
                    /* eslint-disable no-console */
                    console.log(`Error parsing program: ${programQuery}`);
                    console.log(err.toString());
                    /* eslint-enable no-console */
                }
            }

            if (characterStateQuery != null) {
                try {
                    this.setState({
                        characterState: this.characterStateSerializer.deserialize(characterStateQuery)
                    });
                } catch(err) {
                    /* eslint-disable no-console */
                    console.log(`Error parsing characterState: ${characterStateQuery}`);
                    console.log(err.toString());
                    /* eslint-enable no-console */
                }
            }

            if (allowedActionsQuery != null) {
                try {
                    this.setState({
                        allowedActions: this.allowedActionsSerializer.deserialize(allowedActionsQuery)
                    });
                } catch(err) {
                    /* eslint-disable no-console */
                    console.log(`Error parsing allowed actions: ${allowedActionsQuery}`);
                    console.log(err.toString());
                    /* eslint-enable no-console */
                }
            }

            this.setStateSettings({
                theme: Utils.getThemeFromString(themeQuery, 'mixed'),
                world: Utils.getWorldFromString(worldQuery, this.defaultWorld)
            });
        } else {
            const localProgram = window.localStorage.getItem('c2lc-program');
            const localCharacterState = window.localStorage.getItem('c2lc-characterState');
            const localTheme = window.localStorage.getItem('c2lc-theme');
            const localAllowedActions = window.localStorage.getItem('c2lc-allowedActions');
            const localWorld = window.localStorage.getItem('c2lc-world');

            if (localProgram != null) {
                try {
                    const programSequence: ProgramSequence = new ProgramSequence(this.programSerializer.deserialize(localProgram), 0);
                    this.setState({
                        programSequence: programSequence
                    });
                } catch(err) {
                    /* eslint-disable no-console */
                    console.log(`Error parsing program: ${localProgram}`);
                    console.log(err.toString());
                    /* eslint-enable no-console */
                }
            }

            if (localCharacterState != null) {
                try {
                    this.setState({
                        characterState: this.characterStateSerializer.deserialize(localCharacterState)
                    });
                } catch(err) {
                    /* eslint-disable no-console */
                    console.log(`Error parsing characterState: ${localCharacterState}`);
                    console.log(err.toString());
                    /* eslint-enable no-console */
                }
            }


            if (localAllowedActions != null) {
                try {
                    this.setState({
                        allowedActions: this.allowedActionsSerializer.deserialize(localAllowedActions)
                    });
                } catch(err) {
                    /* eslint-disable no-console */
                    console.log(`Error parsing allowed actions: ${localAllowedActions}`);
                    console.log(err.toString());
                    /* eslint-enable no-console */
                }
            }

            this.setStateSettings({
                theme: Utils.getThemeFromString(localTheme, 'mixed'),
                world: Utils.getWorldFromString(localWorld, this.defaultWorld)
            });
        }

        // Keyboard settings are read from local storage whether or not we have URL content.
        const localKeyBindingsEnabled = window.localStorage.getItem('c2lc-keyBindingsEnabled');
        const localKeyboardInputSchemeName = window.localStorage.getItem('c2lc-keyboardInputSchemeName');

        if (localKeyBindingsEnabled != null) {
            try {
                this.setState({
                    keyBindingsEnabled: !!(JSON.parse(localKeyBindingsEnabled))
                });
            }
            catch(err) {
                /* eslint-disable no-console */
                console.log(`Error parsing key bindings toggle: ${localKeyBindingsEnabled}`);
                console.log(err.toString());
                /* eslint-enable no-console */
            }
        }

        if (isKeyboardInputSchemeName(localKeyboardInputSchemeName)) {
            this.setState({
                keyboardInputSchemeName: localKeyboardInputSchemeName
            });
        }

        document.addEventListener('keydown', this.handleDocumentKeyDown);
    }

    componentDidUpdate(prevProps: {}, prevState: AppState) {
        if (this.state.programSequence !== prevState.programSequence
            || this.state.characterState !== prevState.characterState
            || this.state.settings.theme !== prevState.settings.theme
            || this.state.allowedActions !== prevState.allowedActions
            || this.state.settings.world !== prevState.settings.world) {
            const serializedProgram = this.programSerializer.serialize(this.state.programSequence.getProgram());
            const serializedCharacterState = this.characterStateSerializer.serialize(this.state.characterState);
            const serializedAllowedActions = this.allowedActionsSerializer.serialize(this.state.allowedActions);

            // Use setTimeout() to limit how often we call history.pushState().
            // Safari will throw an error if calls to history.pushState() are
            // too frequent: "SecurityError: Attempt to use history.pushState()
            // more than 100 times per 30 seconds".
            const pushStateDelayMs = 350;
            clearTimeout(this.pushStateTimeoutID);
            this.pushStateTimeoutID = setTimeout(() => {
                window.history.pushState(
                    {
                        p: serializedProgram,
                        c: serializedCharacterState,
                        t: this.state.settings.theme,
                        a: serializedAllowedActions,
                        w: this.state.settings.world
                    },
                    '',
                    Utils.generateEncodedProgramURL(this.version, this.state.settings.theme, this.state.settings.world, serializedProgram, serializedCharacterState, serializedAllowedActions),
                    '',
                );
            }, pushStateDelayMs);

            window.localStorage.setItem('c2lc-version', this.version);
            window.localStorage.setItem('c2lc-program', serializedProgram);
            window.localStorage.setItem('c2lc-characterState', serializedCharacterState);
            window.localStorage.setItem('c2lc-theme', this.state.settings.theme);
            window.localStorage.setItem('c2lc-allowedActions', serializedAllowedActions);
            window.localStorage.setItem('c2lc-world', this.state.settings.world)
        }

        if (this.state.keyBindingsEnabled !== prevState.keyBindingsEnabled
            || this.state.keyboardInputSchemeName !== prevState.keyboardInputSchemeName) {
            window.localStorage.setItem('c2lc-keyBindingsEnabled', this.state.keyBindingsEnabled);
            window.localStorage.setItem('c2lc-keyboardInputSchemeName', this.state.keyboardInputSchemeName);
        }

        if (this.state.announcementsEnabled !== prevState.announcementsEnabled) {
            this.audioManager.setAnnouncementsEnabled(this.state.announcementsEnabled);
        }
        if (this.state.audioEnabled !== prevState.audioEnabled) {
            this.audioManager.setAudioEnabled(this.state.audioEnabled);
        }
        if (this.state.runningState !== prevState.runningState
                && this.state.runningState === 'running') {
            this.interpreter.startRun();
        }

        if (this.state.selectedAction !== prevState.selectedAction) {
            const messagePayload = {};
            const announcementKey = this.state.selectedAction ?
                "movementSelected" : "noMovementSelected";
            if (this.state.selectedAction) {
                const commandString = this.props.intl.formatMessage({
                    id: "Announcement." + this.state.selectedAction
                });
                messagePayload.command = commandString;
            }
            this.audioManager.playAnnouncement(announcementKey,
                    this.props.intl, messagePayload);
        }

        if (this.state.programSequence !== prevState.programSequence) {
            if (this.state.programSequence.getProgramLength() === 0) {
                // All steps have been deleted
                this.setState({ runningState: 'stopped' });
            } else if (this.state.programSequence.getProgramCounter()
                    >= this.state.programSequence.getProgramLength()) {
                // All steps from the programCounter onward have been deleted
                this.setState({ runningState: 'stopped' });
            }
        }

        if (this.state.settings.theme !== prevState.settings.theme && document.body) {
            document.body.className = `${this.state.settings.theme}-theme`;
        }

        /* Dash connection removed for version 0.5
        if (this.state.dashConnectionStatus !== prevState.dashConnectionStatus) {
            console.log(this.state.dashConnectionStatus);

            if (this.state.dashConnectionStatus === 'connected') {
                this.interpreter.addCommandHandler('forward', 'dash',
                    this.dashDriver.forward.bind(this.dashDriver));
                this.interpreter.addCommandHandler('left', 'dash',
                    this.dashDriver.left.bind(this.dashDriver));
                this.interpreter.addCommandHandler('right', 'dash',
                    this.dashDriver.right.bind(this.dashDriver));
            } else if (this.state.dashConnectionStatus === 'notConnected') {
                // TODO: Remove Dash handlers

                if (this.state.runningState === 'running) {
                    this.interpreter.stop();
                }
            }
        }
        */
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.handleDocumentKeyDown);
    }
}

export default injectIntl(App);
