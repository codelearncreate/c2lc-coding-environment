// @flow

import React from 'react';
import { IntlProvider, FormattedMessage } from 'react-intl';
import { Col, Container, Row } from 'react-bootstrap';
import CommandPaletteCommand from './CommandPaletteCommand';
import DashDriver from './DashDriver';
import DeviceConnectControl from './DeviceConnectControl';
import * as FeatureDetection from './FeatureDetection';
import Interpreter from './Interpreter';
import RunProgramButton from './RunProgramButton';
import ProgramBlockEditor from './ProgramBlockEditor';
import type {DeviceConnectionStatus, Program, SelectedAction} from './types';
import messages from './messages.json';
import './App.css';
import { ReactComponent as ArrowForward } from './svg/ArrowForward.svg';
import { ReactComponent as ArrowTurnLeft } from './svg/ArrowTurnLeft.svg';
import { ReactComponent as ArrowTurnRight } from './svg/ArrowTurnRight.svg';

type AppContext = {
    bluetoothApiIsAvailable: boolean
};

type AppSettings = {
    language: string
};

type AppState = {
    program: Program,
    settings: AppSettings,
    dashConnectionStatus: DeviceConnectionStatus,
    selectedAction: SelectedAction
};

export default class App extends React.Component<{}, AppState> {
    appContext: AppContext;
    dashDriver: DashDriver;
    interpreter: Interpreter;

    constructor(props: {}) {
        super(props);

        this.appContext = {
            bluetoothApiIsAvailable: FeatureDetection.bluetoothApiIsAvailable()
        };

        this.state = {
            program: [
                'forward',
                'left',
                'forward',
                'left',
                'forward',
                'left',
                'forward',
                'left'
            ],
            settings: {
                language: 'en'
            },
            dashConnectionStatus: 'notConnected',
            selectedAction: null
        };

        this.interpreter = new Interpreter();

        this.interpreter.addCommandHandler(
            'none',
            'noneHandler',
            () => {
                return Promise.resolve();
            }
        );

        this.dashDriver = new DashDriver();
    }

    setStateSettings(settings: $Shape<AppSettings>) {
        this.setState((state) => {
            return {
                settings: Object.assign({}, state.settings, settings)
            }
        });
    }

    getSelectedCommandName() {
        if (this.state.selectedAction !== null
                && this.state.selectedAction.type === 'command') {
            return this.state.selectedAction.commandName;
        } else {
            return null;
        }
    }

    handleChangeProgram = (program: Program) => {
        this.setState({
            program: program
        });
    };

    handleClickRun = () => {
        this.interpreter.run(this.state.program);
    };

    handleClickConnectDash = () => {
        this.setState({
            dashConnectionStatus: 'connecting'
        });
        this.dashDriver.connect(this.handleDashDisconnect).then(() => {
            this.setState({
                dashConnectionStatus: 'connected'
            });
        }, (error) => {
            console.log('ERROR');
            console.log(error.name);
            console.log(error.message);
            this.setState({
                dashConnectionStatus: 'notConnected'
            });
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
                selectedAction: {
                    type: 'command',
                    commandName: command
                }
            });
        } else {
            this.setState({
                selectedAction: null
            });
        }
    };

    handleSelectAction = (action: SelectedAction) => {
        this.setState({
            selectedAction: action
        });
    };

    render() {
        return (
            <IntlProvider
                    locale={this.state.settings.language}
                    messages={messages[this.state.settings.language]}>
                <Container>
                    <Row className='App__mode-and-robots-section'>
                        <DeviceConnectControl
                                bluetoothApiIsAvailable={this.appContext.bluetoothApiIsAvailable}
                                onClickConnect={this.handleClickConnectDash}
                                connectionStatus={this.state.dashConnectionStatus}>
                            <FormattedMessage id='App.connectToDash' />
                        </DeviceConnectControl>
                    </Row>
                    <Row className='App__program-block-editor'>
                        <Col className='App__command-palette'>
                            <FormattedMessage id='CommandPalette.movementsTitle' />
                            <CommandPaletteCommand
                                commandName='forward'
                                icon={React.createElement(
                                    ArrowForward,
                                    {className:'command-block-svg'}
                                )}
                                selectedCommandName={this.getSelectedCommandName()}
                                onChange={this.handleCommandFromCommandPalette}/>
                            <CommandPaletteCommand
                                commandName='right'
                                icon={React.createElement(
                                    ArrowTurnRight,
                                    {className:'command-block-svg'}
                                )}
                                selectedCommandName={this.getSelectedCommandName()}
                                onChange={this.handleCommandFromCommandPalette}/>
                            <CommandPaletteCommand
                                commandName='left'
                                icon={React.createElement(
                                    ArrowTurnLeft,
                                    {className:'command-block-svg'}
                                )}
                                selectedCommandName={this.getSelectedCommandName()}
                                onChange={this.handleCommandFromCommandPalette}/>
                        </Col>
                        <Col>
                            <ProgramBlockEditor
                                minVisibleSteps={6}
                                program={this.state.program}
                                selectedAction={this.state.selectedAction}
                                onSelectAction={this.handleSelectAction}
                                onChange={this.handleChangeProgram}
                                playButton={
                                    <RunProgramButton
                                        disabled={this.state.dashConnectionStatus !== 'connected'}
                                        program={this.state.program}
                                        onClick={this.handleClickRun}/>}
                            />
                        </Col>
                    </Row>
                </Container>
            </IntlProvider>
        );
    }

    componentDidUpdate(prevProps: {}, prevState: AppState) {
        if (this.state.dashConnectionStatus !== prevState.dashConnectionStatus) {
            console.log(this.state.dashConnectionStatus);

            // TODO: Handle Dash disconnection

            if (this.state.dashConnectionStatus === 'connected') {
                this.interpreter.addCommandHandler('forward', 'dash',
                    this.dashDriver.forward.bind(this.dashDriver));
                this.interpreter.addCommandHandler('left', 'dash',
                    this.dashDriver.left.bind(this.dashDriver));
                this.interpreter.addCommandHandler('right', 'dash',
                    this.dashDriver.right.bind(this.dashDriver));
            }
        }
    }
}
