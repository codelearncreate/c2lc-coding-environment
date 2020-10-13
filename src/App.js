// @flow

import React from 'react';
import { IntlProvider, FormattedMessage } from 'react-intl';
import { Col, Container, Row } from 'react-bootstrap';
import AudioManager from './AudioManager';
import BluetoothApiWarning from './BluetoothApiWarning';
import CharacterState from './CharacterState';
import CommandPaletteCommand from './CommandPaletteCommand';
import DashConnectionErrorModal from './DashConnectionErrorModal';
import DashDriver from './DashDriver';
import DeviceConnectControl from './DeviceConnectControl';
import * as FeatureDetection from './FeatureDetection';
import FocusTrapManager from './FocusTrapManager';
import Interpreter from './Interpreter';
import type { InterpreterRunningState } from './Interpreter';
import PlayButton from './PlayButton';
import ProgramBlockEditor from './ProgramBlockEditor';
import Scene from './Scene';
import AudioFeedbackToggleSwitch from './AudioFeedbackToggleSwitch';
import PenDownToggleSwitch from './PenDownToggleSwitch';
import { programIsEmpty } from './ProgramUtils';
import * as Utils from './Utils';
import type { DeviceConnectionStatus, Program, RobotDriver } from './types';
import messages from './messages.json';
import './App.scss';
import './vendor/dragdroptouch/DragDropTouch.js';

// Uncomment to use the FakeRobotDriver (see driver construction below also)
//import FakeRobotDriver from './FakeRobotDriver';

type AppContext = {
    bluetoothApiIsAvailable: boolean
};

type AppSettings = {
    language: string,
    addNodeExpandedMode: boolean
};

type AppState = {
    program: Program,
    characterState: CharacterState,
    settings: AppSettings,
    dashConnectionStatus: DeviceConnectionStatus,
    activeProgramStepNum: ?number,
    interpreterIsRunning: boolean,
    showDashConnectionError: boolean,
    selectedAction: ?string,
    isDraggingCommand: boolean,
    audioEnabled: boolean,
    actionPanelStepIndex: ?number,
    sceneNumRows: number,
    sceneNumColumns: number,
    sceneGridCellWidth: number,
    drawingEnabled: boolean
};

export default class App extends React.Component<{}, AppState> {
    appContext: AppContext;
    dashDriver: RobotDriver;
    interpreter: Interpreter;
    toCommandPaletteNoticeId: string;
    audioManager: AudioManager;
    focusTrapManager: FocusTrapManager;

    constructor(props: {}) {
        super(props);

        this.appContext = {
            bluetoothApiIsAvailable: FeatureDetection.bluetoothApiIsAvailable()
        };

        this.state = {
            program: [],
            characterState: new CharacterState(0, 0, 90, []), // Begin facing East
            settings: {
                language: 'en',
                addNodeExpandedMode: true
            },
            dashConnectionStatus: 'notConnected',
            activeProgramStepNum: null,
            interpreterIsRunning: false,
            showDashConnectionError: false,
            selectedAction: null,
            isDraggingCommand: false,
            audioEnabled: true,
            actionPanelStepIndex: null,
            sceneNumRows: 5,
            sceneNumColumns: 9,
            sceneGridCellWidth: 100,
            drawingEnabled: true
        };

        this.interpreter = new Interpreter(this.handleRunningStateChange);

        this.interpreter.addCommandHandler(
            'forward',
            'moveCharacter',
            (interpreter, command) => {
                this.handleCommandExecution(command);
                return new Promise((resolve, reject) => {
                    setTimeout(() => {
                        resolve();
                    }, 1750);
                });
            }
        );

        this.interpreter.addCommandHandler(
            'left',
            'moveCharacter',
            (interpreter, command) => {
                this.handleCommandExecution(command);
                return new Promise((resolve, reject) => {
                    setTimeout(() => {
                        resolve();
                    }, 1750);
                });
            }
        );

        this.interpreter.addCommandHandler(
            'right',
            'moveCharacter',
            (interpreter, command) => {
                this.handleCommandExecution(command);
                return new Promise((resolve, reject) => {
                    setTimeout(() => {
                        resolve();
                    }, 1750);
                });
            }
        );

        // For FakeRobotDriver, replace with:
        // this.dashDriver = new FakeRobotDriver();
        this.dashDriver = new DashDriver();

        this.toCommandPaletteNoticeId = Utils.generateId('toCommandPaletteNotice');

        this.audioManager = new AudioManager(this.state.audioEnabled);

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

    handleChangeProgram = (program: Program) => {
        this.setState({
            program: program
        });
    };

    handleClickPlay = () => {
        this.interpreter.run(this.state.program).then(
            () => {}, // Do nothing on successful resolution
            (error: Error) => {
                console.log(error.name);
                console.log(error.message);
            }
        );
    };

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

    handleRunningStateChange = ( interpreterRunningState : InterpreterRunningState) => {
        this.setState({
            activeProgramStepNum: interpreterRunningState.activeStep,
            interpreterIsRunning: interpreterRunningState.isRunning
        });
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

    handleCommandExecution = (command: any) => {
        const commandName = command.commandName;
        if (commandName === 'forward') {
            this.audioManager.playSound('forward');
            this.setState((state) => {
                return {
                    characterState: state.characterState.forward(
                        command.commandParameters.distance,
                        state.drawingEnabled
                    )
                };
            });
        } else if (commandName === 'right') {
            this.audioManager.playSound('right');
            this.setState((state) => {
                return {
                    characterState: state.characterState.turnRight(
                        command.commandParameters.angle
                    )
                };
            });
        } else if (commandName === 'left') {
            this.audioManager.playSound('left');
            this.setState((state) => {
                return {
                    characterState: state.characterState.turnLeft(
                        command.commandParameters.angle
                    )
                };
            });
        }
    }

    render() {
        return (
            <IntlProvider
                    locale={this.state.settings.language}
                    messages={messages[this.state.settings.language]}>
                <div
                    onClick={this.handleRootClick}
                    onKeyDown={this.handleRootKeyDown}>
                    <header className='App__header'>
                        <Container>
                            <Row className='App__header-row'>
                                <h1 className='App__app-heading'>
                                    <FormattedMessage id='App.appHeading'/>
                                </h1>
                                <div className='App__header-right'>
                                    <div className='App__audio-toggle-switch'>
                                        <AudioFeedbackToggleSwitch
                                            value={this.state.audioEnabled}
                                            onChange={this.handleToggleAudioFeedback} />
                                    </div>
                                    <DeviceConnectControl
                                        disabled={
                                            !this.appContext.bluetoothApiIsAvailable ||
                                            this.state.dashConnectionStatus === 'connected' }
                                        connectionStatus={this.state.dashConnectionStatus}
                                        onClickConnect={this.handleClickConnectDash}>
                                        <FormattedMessage id='App.connectToDash' />
                                    </DeviceConnectControl>
                                </div>
                            </Row>
                        </Container>
                    </header>
                    <Container role='main' className='mb-5'>
                        {!this.appContext.bluetoothApiIsAvailable &&
                            <Row className='App__bluetooth-api-warning-section'>
                                <Col>
                                    <BluetoothApiWarning/>
                                </Col>
                            </Row>
                        }
                        <div className='App__scene-container'>
                            <Scene
                                numRows={this.state.sceneNumRows}
                                numColumns={this.state.sceneNumColumns}
                                gridCellWidth={this.state.sceneGridCellWidth}
                                characterState={this.state.characterState}
                            />
                            <div className='App__scene-controls'>
                                <div className='App__playButton-container'>
                                    <PlayButton
                                        interpreterIsRunning={this.state.interpreterIsRunning}
                                        disabled={
                                                this.state.interpreterIsRunning ||
                                                programIsEmpty(this.state.program)}
                                        onClick={this.handleClickPlay}
                                    />
                                </div>
                                <div className='App__penDown-toggle-switch-container'>
                                    <PenDownToggleSwitch
                                        className='App__penDown-toggle-switch'
                                        value={this.state.drawingEnabled}
                                        onChange={this.handleTogglePenDown}/>
                                </div>
                            </div>
                        </div>
                        <Row className='App__program-section' noGutters={true}>
                            <Col md={4} lg={3} className='pr-md-3 mb-3 mb-md-0'>
                                <div className='App__command-palette'>
                                    <h2 className='App__command-palette-heading'>
                                        <FormattedMessage id='CommandPalette.movementsTitle' />
                                    </h2>
                                    <div className='App__command-palette-command'>
                                        <CommandPaletteCommand
                                            commandName='forward'
                                            selectedCommandName={this.getSelectedCommandName()}
                                            audioManager={this.audioManager}
                                            onChange={this.handleCommandFromCommandPalette}
                                            onDragStart={this.handleDragStartCommand}
                                            onDragEnd={this.handleDragEndCommand}/>
                                    </div>
                                    <div className='App__command-palette-command'>
                                        <CommandPaletteCommand
                                            commandName='right'
                                            selectedCommandName={this.getSelectedCommandName()}
                                            audioManager={this.audioManager}
                                            onChange={this.handleCommandFromCommandPalette}
                                            onDragStart={this.handleDragStartCommand}
                                            onDragEnd={this.handleDragEndCommand}/>
                                    </div>
                                    <div className='App__command-palette-command'>
                                        <CommandPaletteCommand
                                            commandName='left'
                                            selectedCommandName={this.getSelectedCommandName()}
                                            audioManager={this.audioManager}
                                            onChange={this.handleCommandFromCommandPalette}
                                            onDragStart={this.handleDragStartCommand}
                                            onDragEnd={this.handleDragEndCommand}/>
                                    </div>
                                </div>
                            </Col>
                            <Col md={8} lg={9}>
                                <ProgramBlockEditor
                                    activeProgramStepNum={this.state.activeProgramStepNum}
                                    actionPanelStepIndex={this.state.actionPanelStepIndex}
                                    editingDisabled={this.state.interpreterIsRunning === true}
                                    interpreterIsRunning={this.state.interpreterIsRunning}
                                    program={this.state.program}
                                    selectedAction={this.state.selectedAction}
                                    isDraggingCommand={this.state.isDraggingCommand}
                                    audioManager={this.audioManager}
                                    focusTrapManager={this.focusTrapManager}
                                    addNodeExpandedMode={this.state.settings.addNodeExpandedMode}
                                    sceneGridCellWidth={this.state.sceneGridCellWidth}
                                    onChangeProgram={this.handleChangeProgram}
                                    onChangeActionPanelStepIndex={this.handleChangeActionPanelStepIndex}
                                    onChangeAddNodeExpandedMode={this.handleChangeAddNodeExpandedMode}
                                />
                            </Col>
                        </Row>
                    </Container>
                </div>
                <DashConnectionErrorModal
                    show={this.state.showDashConnectionError}
                    onCancel={this.handleCancelDashConnection}
                    onRetry={this.handleClickConnectDash}/>
            </IntlProvider>
        );
    }

    componentDidUpdate(prevProps: {}, prevState: AppState) {
        if (this.state.audioEnabled !== prevState.audioEnabled) {
            this.audioManager.setAudioEnabled(this.state.audioEnabled);
        }
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

                if (this.state.interpreterIsRunning) {
                    this.interpreter.stop();
                }
            }
        }
    }
}
