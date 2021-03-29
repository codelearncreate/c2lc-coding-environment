// @flow
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { injectIntl } from 'react-intl';
import type {IntlShape} from 'react-intl';
import AudioManagerImpl from './AudioManagerImpl';
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
import WorldSelector from './WorldSelector';
import type { AudioManager, DeviceConnectionStatus, RobotDriver, RunningState, ThemeName, WorldName, SceneMode } from './types';
import * as Utils from './Utils';
import './App.scss';
import './Themes.css';
import './vendor/dragdroptouch/DragDropTouch.js';
/* Put ThemeSelector back in C2LC-289
import ThemeSelector from './ThemeSelector';
*/
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
    sceneMode: SceneMode,
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
    actionPanelStepIndex: ?number,
    sceneDimensions: SceneDimensions,
    drawingEnabled: boolean,
    runningState: RunningState
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
    speedLookUp: Array<number>;

    constructor(props: any) {
        super(props);

        this.version = '0.6';

        this.appContext = {
            bluetoothApiIsAvailable: FeatureDetection.bluetoothApiIsAvailable()
        };

        this.sceneDimensions = new SceneDimensions(26, 16);

        // Begin facing East
        this.startingCharacterState = new CharacterState(1, 1, 2, [], this.sceneDimensions);

        this.state = {
            programSequence: new ProgramSequence([], 0),
            characterState: this.startingCharacterState,
            settings: {
                language: 'en',
                addNodeExpandedMode: true,
                theme: 'default',
                sceneMode: 'default',
                world: 'default'
            },
            dashConnectionStatus: 'notConnected',
            showDashConnectionError: false,
            selectedAction: null,
            isDraggingCommand: false,
            audioEnabled: true,
            actionPanelStepIndex: null,
            sceneDimensions: this.sceneDimensions,
            drawingEnabled: true,
            runningState: 'stopped'
        };

        this.interpreter = new Interpreter(1000, this);

        this.speedLookUp = [2000, 1500, 1000, 500, 250];

        this.programSerializer = new ProgramSerializer();

        this.characterStateSerializer = new CharacterStateSerializer(this.sceneDimensions);

        this.interpreter.addCommandHandler(
            'forward1',
            'moveCharacter',
            (interpreter, stepTimeMs) => {
                // TODO: Enable announcements again.
                // this.audioManager.playAnnouncement('forward1', this.props.intl);
                this.setState((state) => {
                    const newCharacterState = state.characterState.forward(1, state.drawingEnabled);

                    // We have to start the sound here because this is where we know the new character state.
                    this.audioManager.playSoundForCharacterState("forward", stepTimeMs, newCharacterState);

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
            (interpreter, stepTimeMs) => {
                // TODO: Enable announcements again.
                // this.audioManager.playAnnouncement('forward2', this.props.intl);
                this.setState((state) => {
                    const newCharacterState = state.characterState.forward(2, state.drawingEnabled);

                    // We have to start the sound here because this is where we know the new character state.
                    this.audioManager.playSoundForCharacterState("forward", stepTimeMs, newCharacterState);

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
            (interpreter, stepTimeMs) => {
                // TODO: Enable announcements again.
                // this.audioManager.playAnnouncement('forward3', this.props.intl);
                this.setState((state) => {
                    const newCharacterState = state.characterState.forward(3, state.drawingEnabled);

                    // We have to start the sound here because this is where we know the new character state.
                    this.audioManager.playSoundForCharacterState("forward", stepTimeMs, newCharacterState);
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
            (interpreter, stepTimeMs) => {
                // TODO: Enable announcements again.
                // this.audioManager.playAnnouncement('backward1');
                this.setState((state) => {
                    const newCharacterState = state.characterState.backward(1, state.drawingEnabled);

                    // We have to start the sound here because this is where we know the new character state.
                    this.audioManager.playSoundForCharacterState("backward", stepTimeMs, newCharacterState);
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
            (interpreter, stepTimeMs) => {
                // TODO: Enable announcements again.
                // this.audioManager.playAnnouncement('backward2');
                this.setState((state) => {
                    const newCharacterState = state.characterState.backward(2, state.drawingEnabled);

                    // We have to start the sound here because this is where we know the new character state.
                    this.audioManager.playSoundForCharacterState("backward", stepTimeMs, newCharacterState);
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
            (interpreter, stepTimeMs) => {
                // TODO: Enable announcements again.
                // this.audioManager.playAnnouncement('backward3');
                this.setState((state) => {
                    const newCharacterState = state.characterState.backward(3, state.drawingEnabled);

                    // We have to start the sound here because this is where we know the new character state.
                    this.audioManager.playSoundForCharacterState("backward", stepTimeMs, newCharacterState);
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
            (interpreter, stepTimeMs) => {
                // We want for a 180 degree turn to take the whole movement delay, and for a 45 degree to take 1/4 of that.
                const soundTime = stepTimeMs / 4;

                // TODO: Enable announcements again.
                // this.audioManager.playAnnouncement('left45', this.props.intl);
                this.setState((state) => {
                    const newCharacterState = state.characterState.turnLeft(1);

                    // We have to start the sound here because this is where we know the new character state.
                    this.audioManager.playSoundForCharacterState("left", soundTime, newCharacterState);

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
            (interpreter, stepTimeMs) => {
                // We want for a 180 degree turn to take the whole movement delay, and for a 90 degree turn to take 1/2 of that.
                const soundTime = stepTimeMs / 2;

                // TODO: Enable announcements again.
                // this.audioManager.playAnnouncement('left90', this.props.intl);
                this.setState((state) => {
                    const newCharacterState = state.characterState.turnLeft(2);

                    // We have to start the sound here because this is where we know the new character state.
                    this.audioManager.playSoundForCharacterState("left", soundTime, newCharacterState);

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
            (interpreter, stepTimeMs) => {
                // TODO: Enable announcements again.
                // this.audioManager.playAnnouncement('left180', this.props.intl);
                this.setState((state) => {
                    const newCharacterState = state.characterState.turnLeft(4);

                    // We have to start the sound here because this is where we know the new character state.
                    this.audioManager.playSoundForCharacterState("left", stepTimeMs,  newCharacterState);

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
            (interpreter, stepTimeMs) => {
                // We want for a 180 degree turn to take the whole movement delay, and for a 45 degree turn to take 1/4 of that.
                const soundTime = stepTimeMs / 2;

                // TODO: Enable announcements again.
                // this.audioManager.playAnnouncement('right45', this.props.intl);
                this.setState((state) => {
                    const newCharacterState = state.characterState.turnRight(1);

                    // We have to start the sound here because this is where we know the new character state.
                    this.audioManager.playSoundForCharacterState("right", soundTime, newCharacterState);

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
            (interpreter, stepTimeMs) => {
                // We want for a 180 degree turn to take the whole movement delay, and for a 90 degree to take 1/2 of that.
                const soundTime = stepTimeMs / 2;

                // TODO: Enable announcements again.
                // this.audioManager.playAnnouncement('right90', this.props.intl);
                this.setState((state) => {
                    const newCharacterState = state.characterState.turnRight(2);

                    // We have to start the sound here because this is where we know the new character state.
                    this.audioManager.playSoundForCharacterState("right", soundTime, newCharacterState);

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
            (interpreter, stepTimeMs) => {
                // TODO: Enable announcements again.
                // this.audioManager.playAnnouncement('right180', this.props.intl);
                this.setState((state) => {
                    const newCharacterState = state.characterState.turnRight(4);

                    // We have to start the sound here because this is where we know the new character state.
                    this.audioManager.playSoundForCharacterState("right", stepTimeMs, newCharacterState);

                    return {
                        characterState: newCharacterState
                    };
                });
                return Utils.makeDelayedPromise(stepTimeMs);
            }
        );

        // For FakeRobotDriver, replace with:
        // this.dashDriver = new FakeRobotDriver();
        this.dashDriver = new DashDriver();

        if (props.audioManager) {
            this.audioManager = props.audioManager
        }
        else if (FeatureDetection.webAudioApiIsAvailable()) {
            this.audioManager = new AudioManagerImpl(this.state.audioEnabled);
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

    // Handlers

    handleProgramSequenceChange = (programSequence: ProgramSequence) => {
        this.setState({ programSequence });
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
            console.log('ERROR');
            console.log(error.name);
            console.log(error.message);
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

    handleToggleAudioFeedback = (audioEnabled: boolean) => {
        this.setState({
            audioEnabled: audioEnabled
        });
    }

    handleTogglePenDown = (drawingEnabled: boolean) => {
        this.setState({
            drawingEnabled: drawingEnabled
        });
    }

    handleChangeProgramSpeed = (stepTimeMs: number) => {
        this.interpreter.setStepTime(stepTimeMs);
    }

    renderCommandBlocks = () => {
        const commandNames = [
            'backward1', 'backward2', 'backward3',
            'left45', 'left90', 'left180',
            'forward1', 'forward2', 'forward3',
            'right45', 'right90', 'right180'
        ];
        const commandBlocks = [];

        for (const [index, value] of commandNames.entries()) {
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
            )
        }

        return commandBlocks;
    }

    handleRefresh = () => {
        this.setState({
            characterState: this.startingCharacterState
        });
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

    handleExpandScene = () => {
        if (this.state.settings.sceneMode === 'collapsed') {
            this.setStateSettings({
                sceneMode: 'default'
            });
        } else if (this.state.settings.sceneMode === 'default') {
            this.setStateSettings({
                sceneMode: 'expanded'
            });
        }
    }

    handleCollapseScene = () => {
        if (this.state.settings.sceneMode === 'expanded') {
            this.setStateSettings({
                sceneMode: 'default'
            });
        } else if (this.state.settings.sceneMode === 'default') {
            this.setStateSettings({
                sceneMode: 'collapsed'
            });
        }
    }

    render() {
        return (
            <React.Fragment>
                <div
                    className='App__container'
                    role='main'
                    onClick={this.handleRootClick}
                    onKeyDown={this.handleRootKeyDown}>
                    <div className='App__header-background' />
                    <header className='App__header'>
                        <div className='App__header-row'>
                            <h1 className='App__app-heading'>
                                <FormattedMessage id='App.appHeading'/>
                            </h1>
                            <div className='App__header-audio-toggle'>
                                <div className='App__audio-toggle-switch'>
                                    <AudioFeedbackToggleSwitch
                                        value={this.state.audioEnabled}
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
                                {/* Put ThemeSelector back in C2LC-289
                                <ThemeSelector onSelect={this.handleChangeTheme} />
                                */}
                            </div>
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
                        <h2 className='App__command-palette-heading App__commandpalette-heading-long'>
                            <FormattedMessage id='CommandPalette.movementsTitle' />
                        </h2>
                        <h2 className='App__command-palette-heading App__commandpalette-heading-short'>
                            <FormattedMessage id='CommandPalette.shortMovementsTitle' />
                        </h2>
                        <div className='App__command-palette-command-container'>
                            <div className='App__command-palette-commands'>
                                {this.renderCommandBlocks()}
                            </div>
                        </div>
                    </div>
                    <div className='App__scene-container'>
                        <Scene
                            dimensions={this.state.sceneDimensions}
                            characterState={this.state.characterState}
                            onClickExpandScene={this.handleExpandScene}
                            onClickCollapseScene={this.handleCollapseScene}
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
                                        disabled={this.state.runningState === 'running'}
                                        onClick={this.handleRefresh}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="App__world-selector-container">
                        <WorldSelector
                            disabled={this.state.runningState === 'running'}
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
                <DashConnectionErrorModal
                    show={this.state.showDashConnectionError}
                    onCancel={this.handleCancelDashConnection}
                    onRetry={this.handleClickConnectDash}/>
            </React.Fragment>
        );
    }

    componentDidMount() {
        if (window.location.search != null && window.location.search !== '') {
            const params = new C2lcURLParams(window.location.search);
            const programQuery = params.getProgram();
            const characterStateQuery = params.getCharacterState();
            // const themeQuery = params.getTheme();
            const worldQuery = params.getWorld();
            if (programQuery != null && characterStateQuery != null) {
                try {
                    this.setState({
                        programSequence: new ProgramSequence(this.programSerializer.deserialize(programQuery), 0),
                        characterState: this.characterStateSerializer.deserialize(characterStateQuery)
                    });
                } catch(err) {
                    console.log(`Error parsing program: ${programQuery} or characterState: ${characterStateQuery}`);
                    console.log(err.toString());
                }
            }
            // this.setStateSettings({ theme: Utils.getThemeFromString(themeQuery, 'default') });
            this.setStateSettings({ world: Utils.getThemeFromString(worldQuery, 'default') });
        } else {
            const localProgram = window.localStorage.getItem('c2lc-program');
            const localCharacterState = window.localStorage.getItem('c2lc-characterState');
            // const localTheme = window.localStorage.getItem('c2lc-theme');
            const localWorld = window.localStorage.getItem('c2lc-world');
            if (localProgram != null && localCharacterState != null) {
                try {
                    this.setState({
                        programSequence: new ProgramSequence(this.programSerializer.deserialize(localProgram), 0),
                        characterState: this.characterStateSerializer.deserialize(localCharacterState)
                    });
                } catch(err) {
                    console.log(`Error parsing program: ${localProgram} or characterState: ${localCharacterState}`);
                    console.log(err.toString());
                }
            }
            this.setStateSettings({ world: Utils.getWorldFromString(localWorld, 'default') });
            // this.setStateSettings({ theme: Utils.getThemeFromString(localTheme, 'default') });
        }
    }

    componentDidUpdate(prevProps: {}, prevState: AppState) {
        if (this.state.programSequence !== prevState.programSequence
            || this.state.characterState !== prevState.characterState
            || this.state.settings.theme !== prevState.settings.theme
            || this.state.settings.world !== prevState.settings.world) {
            const serializedProgram = this.programSerializer.serialize(this.state.programSequence.getProgram());
            const serializedCharacterState = this.characterStateSerializer.serialize(this.state.characterState);
            window.history.pushState(
                {
                    p: serializedProgram,
                    c: serializedCharacterState,
                    // t: this.state.settings.theme,
                    w: this.state.settings.world
                },
                '',
                Utils.generateEncodedProgramURL(this.version, this.state.settings.theme, this.state.settings.world, serializedProgram, serializedCharacterState)
            );
            window.localStorage.setItem('c2lc-version', this.version);
            window.localStorage.setItem('c2lc-program', serializedProgram);
            window.localStorage.setItem('c2lc-characterState', serializedCharacterState);
            // window.localStorage.setItem('c2lc-theme', this.state.settings.theme);
            window.localStorage.setItem('c2lc-world', this.state.settings.world)
        }
        if (this.state.audioEnabled !== prevState.audioEnabled) {
            this.audioManager.setAudioEnabled(this.state.audioEnabled);
        }
        if (this.state.runningState !== prevState.runningState
                && this.state.runningState === 'running') {
            this.interpreter.startRun();
        }
        // if (this.state.settings.theme !== prevState.settings.theme) {
        //     if (document.body) {
        //         if (this.state.settings.theme === 'default') {
        //             document.body.className = '';
        //         } else {
        //             document.body.className = `${this.state.settings.theme}-theme`;
        //         }
        //     }
        // }
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

        if (this.state.settings.sceneMode !== prevState.settings.sceneMode) {
            if (document.body) {
                if (this.state.settings.sceneMode === 'default') {
                    document.body.className = '';
                } else {
                    document.body.className = `Scene-${this.state.settings.sceneMode}`;
                }
            }
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
