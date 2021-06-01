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
import CommandPaletteCommand from './CommandPaletteCommand';
import C2lcURLParams from './C2lcURLParams';
import DashConnectionErrorModal from './DashConnectionErrorModal';
import DashDriver from './DashDriver';
import * as FeatureDetection from './FeatureDetection';
import FakeAudioManager from './FakeAudioManager';
import FocusTrapManager from './FocusTrapManager';
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
import ActionsMenu from './ActionsMenu';
import type { ActionToggleRegister, AudioManager, CommandName, DeviceConnectionStatus, RobotDriver, RunningState, ThemeName, WorldName } from './types';
import WorldSelector from './WorldSelector';
import * as Utils from './Utils';
import './App.scss';
import './Themes.scss';
import './vendor/dragdroptouch/DragDropTouch.js';
import ThemeSelector from './ThemeSelector';
import { ReactComponent as HiddenBlock } from './svg/Hidden.svg';

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
    usedActions: ActionToggleRegister
};

export class App extends React.Component<AppProps, AppState> {
    version: string;
    appContext: AppContext;
    sceneDimensions: SceneDimensions;
    dashDriver: RobotDriver;
    interpreter: Interpreter;
    audioManager: AudioManager;
    focusTrapManager: FocusTrapManager;
    startingCharacterState: CharacterState;
    programSerializer: ProgramSerializer;
    characterStateSerializer: CharacterStateSerializer;
    allowedActionsSerializer: AllowedActionsSerializer;
    speedLookUp: Array<number>;
    pushStateTimeoutID: ?TimeoutID;

    constructor(props: any) {
        super(props);

        this.version = '0.8';

        this.appContext = {
            bluetoothApiIsAvailable: FeatureDetection.bluetoothApiIsAvailable()
        };

        this.sceneDimensions = new SceneDimensions(1, 26, 1, 16);

        // Begin facing East
        this.startingCharacterState = new CharacterState(1, 1, 2, [], this.sceneDimensions);

        this.interpreter = new Interpreter(1000, this);

        this.speedLookUp = [2000, 1500, 1000, 500, 250];

        this.programSerializer = new ProgramSerializer();

        this.characterStateSerializer = new CharacterStateSerializer(this.sceneDimensions);

        this.allowedActionsSerializer = new AllowedActionsSerializer();

        this.pushStateTimeoutID = null;

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
            characterState: this.startingCharacterState,
            settings: {
                language: 'en',
                addNodeExpandedMode: true,
                theme: 'mixed',
                world: 'default'
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
            usedActions: {}
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

    incrementProgramCounter(callback: () => void): void {
        this.setState((state) => {
            return {
                programSequence: state.programSequence.incrementProgramCounter()
            }
        }, callback);
    }


    calculateUsedActions = (programSequence: ProgramSequence): ActionToggleRegister => {
        // Calculate  "used actions".
        const usedActions = {};
        programSequence.program.forEach((commandName) => {
            usedActions[commandName] = true;
        });
        return usedActions;
    }

    // Handlers

    handleProgramSequenceChange = (programSequence: ProgramSequence) => {
        const usedActions: ActionToggleRegister = this.calculateUsedActions(programSequence);
        this.setState({
            programSequence: programSequence,
            usedActions: usedActions
        });
    }

    handleClickPlay = () => {
        switch (this.state.runningState) {
            case 'running':
                this.setState({ runningState: 'pauseRequested' });
                break;
            case 'pauseRequested': // Fall through
            case 'paused':
                this.setState({ runningState: 'running' });
                break;
            case 'stopRequested': // Fall through
            case 'stopped':
                this.setState((state) => {
                    return {
                        programSequence: state.programSequence.updateProgramCounter(0),
                        runningState: 'running'
                    };
                });
                break;
            default:
                break;
        }
    };

    handleClickStop = () => {
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

    handleRootKeyDown = (e: SyntheticKeyboardEvent<HTMLInputElement>) => {
        this.focusTrapManager.handleKeyDown(e);
    };

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

    handleToggleAllowedCommand = (event: Event, commandName: string) => {
        if (this.state.usedActions[commandName]) {
            event.preventDefault();
        }
        else {
            const newAllowedActions= Object.assign({}, this.state.allowedActions);
            const currentIsAllowed = this.state.allowedActions[commandName];
            newAllowedActions[commandName] = !currentIsAllowed;
            this.setState({ allowedActions: newAllowedActions})
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

    handleRefresh = () => {
        this.setState({
            characterState: this.startingCharacterState
        });
    }

    handleChangeTheme = (theme: ThemeName) => {
        this.setStateSettings({ theme });
    }

    handleChangeWorld = (world: WorldName) => {
        this.setStateSettings({ world });
    }

    handleChangeCharacterPosition = (positionName: ?string) => {
        const currentCharacterState = this.state.characterState;
        switch(positionName) {
            case 'turnLeft':
                this.setState({
                    characterState: currentCharacterState.turnLeft(1)
                });
                break;
            case 'turnRight':
                this.setState({
                    characterState: currentCharacterState.turnRight(1)
                });
                break;
            case 'up':
                this.setState({
                    characterState: currentCharacterState.moveUpPosition()
                });
                break;
            case 'right':
                this.setState({
                    characterState: currentCharacterState.moveRightPosition()
                });
                break;
            case 'down':
                this.setState({
                    characterState: currentCharacterState.moveDownPosition()
                });
                break;
            case 'left':
                this.setState({
                    characterState: currentCharacterState.moveLeftPosition()
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
                                <FormattedMessage id='App.appHeading'/>
                            </h1>
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
                    <div className='App__command-palette'>
                        <ActionsMenu
                            allowedActions={this.state.allowedActions}
                            changeHandler={this.handleToggleAllowedCommand}
                            editingDisabled={this.state.runningState === 'running'}
                            intl={this.props.intl}
                            usedActions={this.state.usedActions}
                        />
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
                    <div className='App__scene-container'>
                        <h2 className='sr-only' >
                            <FormattedMessage id='Scene.heading' />
                        </h2>
                        <Scene
                            dimensions={this.state.sceneDimensions}
                            characterState={this.state.characterState}
                            world={this.state.settings.world}
                        />
                        <div className='App__scene-controls'>
                            <div className='App__scene-controls-group'>
                                <PenDownToggleSwitch
                                    className='App__penDown-toggle-switch'
                                    value={this.state.drawingEnabled}
                                    onChange={this.handleTogglePenDown}/>
                                <div className='App__refreshButton-container'>
                                    <RefreshButton
                                        disabled={
                                            !(this.state.runningState === 'stopped'
                                            || this.state.runningState === 'paused')
                                        }
                                        onClick={this.handleRefresh}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="App__world-selector-container">
                        <h2 className='sr-only' >
                            <FormattedMessage id='WorldSelector.heading' />
                        </h2>
                        <WorldSelector
                            disabled={
                                !(this.state.runningState === 'stopped'
                                || this.state.runningState === 'paused')
                            }
                            world={this.state.settings.world}
                            onSelect={this.handleChangeWorld}
                        />
                    </div>
                    <div className='App__program-block-editor'>
                        <ProgramBlockEditor
                            actionPanelStepIndex={this.state.actionPanelStepIndex}
                            characterState={this.state.characterState}
                            editingDisabled={
                                !(this.state.runningState === 'stopped'
                                || this.state.runningState === 'paused')}
                            programSequence={this.state.programSequence}
                            runningState={this.state.runningState}
                            selectedAction={this.state.selectedAction}
                            isDraggingCommand={this.state.isDraggingCommand}
                            audioManager={this.audioManager}
                            focusTrapManager={this.focusTrapManager}
                            addNodeExpandedMode={this.state.settings.addNodeExpandedMode}
                            world={this.state.settings.world}
                            onChangeCharacterPosition={this.handleChangeCharacterPosition}
                            onChangeCharacterXPosition={this.handleChangeCharacterXPosition}
                            onChangeCharacterYPosition={this.handleChangeCharacterYPosition}
                            onChangeProgramSequence={this.handleProgramSequenceChange}
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
                                <PlayButton
                                    className='App__playControlButton'
                                    interpreterIsRunning={this.state.runningState === 'running'}
                                    disabled={this.state.programSequence.getProgramLength() === 0}
                                    onClick={this.handleClickPlay}
                                />
                                <StopButton
                                    className='App__playControlButton'
                                    disabled={
                                        this.state.runningState === 'stopped'
                                        || this.state.runningState === 'stopRequested'}
                                    onClick={this.handleClickStop}/>
                                <ProgramSpeedController
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
                    characterState={this.state.characterState}
                    runningState={this.state.runningState}
                    world={this.state.settings.world}/>
                <DashConnectionErrorModal
                    show={this.state.showDashConnectionError}
                    onCancel={this.handleCancelDashConnection}
                    onRetry={this.handleClickConnectDash}/>
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
                    const usedActions: ActionToggleRegister = this.calculateUsedActions(programSequence);

                    this.setState({
                        programSequence: programSequence,
                        usedActions: usedActions
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
                world: Utils.getWorldFromString(worldQuery, 'default')
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
                    const usedActions: ActionToggleRegister = this.calculateUsedActions(programSequence);
                    this.setState({
                        programSequence: programSequence,
                        usedActions: usedActions
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
                world: Utils.getWorldFromString(localWorld, 'default')
            });
        }
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
}

export default injectIntl(App);
