// @flow

import { Button, Col, Container, Row } from 'react-bootstrap';
import { injectIntl, FormattedMessage } from 'react-intl';
import RunProgramButton from './RunProgramButton';
import * as ProgramUtils from './ProgramUtils';
import type {Program, SelectedAction} from './types';
import React from 'react';
import { ReactComponent as ArrowTurnLeft } from './svg/ArrowTurnLeft.svg';
import { ReactComponent as ArrowTurnRight } from './svg/ArrowTurnRight.svg';
import { ReactComponent as ArrowForward } from './svg/ArrowForward.svg';
import { ReactComponent as AddIcon } from './svg/Add.svg';
import { ReactComponent as DeleteIcon } from './svg/Delete.svg';
import './ProgramBlockEditor.css';

type ProgramBlockEditorProps = {
    intl: any,
    activeProgramStepNum: ?number,
    editingDisabled: boolean,
    minVisibleSteps: number,
    program: Program,
    selectedAction: SelectedAction,
    runButtonDisabled: boolean,
    onClickRunButton: () => void,
    onSelectAction: (selectedAction: SelectedAction) => void,
    onChange: (Program) => void
};

class ProgramBlockEditor extends React.Component<ProgramBlockEditorProps, {}> {
    commandBlock: Button;

    constructor(props: ProgramBlockEditorProps) {
        super(props);
        this.commandBlock = null;
    }

    toggleAction(action: 'add' | 'delete') {
        if (this.props.selectedAction
                && this.props.selectedAction.type === 'editorAction'
                && this.props.selectedAction.action === action) {
            this.props.onSelectAction(null);
        } else {
            this.props.onSelectAction({
                type: 'editorAction',
                action: action
            });
        }
    };

    actionIsSelected(action: string) {
        return (this.props.selectedAction
            && this.props.selectedAction.type === 'editorAction'
            && this.props.selectedAction.action === action);
    }

    addIsSelected() {
        return this.actionIsSelected('add');
    }

    deleteIsSelected() {
        return this.actionIsSelected('delete');
    }

    handleClickAdd = () => {
        this.toggleAction('add');
    };

    handleClickDelete = () => {
        this.toggleAction('delete');
    };

    handleClickStep = (e: SyntheticEvent<HTMLButtonElement>) => {
        const index = parseInt(e.currentTarget.dataset.stepnumber, 10);

        if (this.props.selectedAction && this.props.selectedAction.type === 'editorAction') {
            if (this.props.selectedAction.action === 'add') {
                this.props.onChange(ProgramUtils.insert(this.props.program,
                    index, 'none', 'none'));
            } else if (this.props.selectedAction.action === 'delete') {
                this.props.onChange(ProgramUtils.trimEnd(
                    ProgramUtils.deleteStep(this.props.program, index),
                    'none'));
            }
        } else if (this.props.selectedAction && this.props.selectedAction.type === 'command'){
            this.props.onChange(ProgramUtils.overwrite(this.props.program,
                    index, this.props.selectedAction.commandName, 'none'));
        }
    };

    setActiveCommandBlockRef = (block) => {
        this.commandBlock = block;
    };

    makeProgramBlock(programStepNumber: number, command: string) {
        const active = this.props.activeProgramStepNum === programStepNumber;
        let classNames = [
            'ProgramBlockEditor__program-block',
            'command-block'
        ];
        if (active) {
            classNames.push('ProgramBlockEditor__program-block--active');
        }
        switch(command) {
            case 'forward':
                return (
                    <Button
                        ref={active ? this.setActiveCommandBlockRef : null}
                        key={`${programStepNumber}-forward`}
                        data-stepnumber={programStepNumber}
                        className={classNames.join(' ')}
                        variant='command-block--forward'
                        aria-label={
                            this.addIsSelected() ?
                            `${this.props.intl.formatMessage({id:'ProgramBlockEditor.commandForward'}, {index: programStepNumber + 1})}. ${this.props.intl.formatMessage({id:'ProgramBlockEditor.commandOnAdd'})}` :
                            this.deleteIsSelected() ?
                            `${this.props.intl.formatMessage({id:'ProgramBlockEditor.commandForward'}, {index: programStepNumber + 1})}. ${this.props.intl.formatMessage({id:'ProgramBlockEditor.commandOnDelete'})}` :
                            this.props.intl.formatMessage({id:'ProgramBlockEditor.commandForward'}, {index: programStepNumber + 1})
                        }
                        onClick={this.handleClickStep}>
                        <ArrowForward className='command-block-svg'/>
                    </Button>
                );
            case 'left':
                return (
                    <Button
                        ref={active ? this.setActiveCommandBlockRef : null}
                        key={`${programStepNumber}-left`}
                        data-stepnumber={programStepNumber}
                        className={classNames.join(' ')}
                        variant='command-block--left'
                        aria-label={
                            this.addIsSelected() ?
                            `${this.props.intl.formatMessage({id:'ProgramBlockEditor.commandLeft'}, {index: programStepNumber + 1})}. ${this.props.intl.formatMessage({id:'ProgramBlockEditor.commandOnAdd'})}` :
                            this.deleteIsSelected() ?
                            `${this.props.intl.formatMessage({id:'ProgramBlockEditor.commandLeft'}, {index: programStepNumber + 1})}. ${this.props.intl.formatMessage({id:'ProgramBlockEditor.commandOnDelete'})}` :
                            this.props.intl.formatMessage({id:'ProgramBlockEditor.commandLeft'}, {index: programStepNumber + 1})
                        }
                        onClick={this.handleClickStep}>
                        <ArrowTurnLeft className='command-block-svg'/>
                    </Button>
                );
            case 'right':
                return (
                    <Button
                        ref={active ? this.setActiveCommandBlockRef : null}
                        key={`${programStepNumber}-right`}
                        data-stepnumber={programStepNumber}
                        className={classNames.join(' ')}
                        variant='command-block--right'
                        aria-label={
                            this.addIsSelected() ?
                            `${this.props.intl.formatMessage({id:'ProgramBlockEditor.commandRight'}, {index: programStepNumber + 1})}. ${this.props.intl.formatMessage({id:'ProgramBlockEditor.commandOnAdd'})}` :
                            this.deleteIsSelected() ?
                            `${this.props.intl.formatMessage({id:'ProgramBlockEditor.commandRight'}, {index: programStepNumber + 1})}. ${this.props.intl.formatMessage({id:'ProgramBlockEditor.commandOnDelete'})}` :
                            this.props.intl.formatMessage({id:'ProgramBlockEditor.commandRight'}, {index: programStepNumber + 1})
                        }
                        onClick={this.handleClickStep}>
                        <ArrowTurnRight className='command-block-svg'/>
                    </Button>
                );
            case 'none':
                return (
                    <Button
                        ref={active ? this.setActiveCommandBlockRef : null}
                        key={`${programStepNumber}-none`}
                        data-stepnumber={programStepNumber}
                        className={classNames.join(' ')}
                        variant='command-block--none'
                        aria-label={
                            this.addIsSelected() ?
                            `${this.props.intl.formatMessage({id:'ProgramBlockEditor.commandNone'}, {index: programStepNumber + 1})}. ${this.props.intl.formatMessage({id:'ProgramBlockEditor.commandOnAdd'})}` :
                            this.deleteIsSelected() ?
                            `${this.props.intl.formatMessage({id:'ProgramBlockEditor.commandNone'}, {index: programStepNumber + 1})}. ${this.props.intl.formatMessage({id:'ProgramBlockEditor.commandOnDelete'})}` :
                            this.props.intl.formatMessage({id:'ProgramBlockEditor.commandNone'}, {index: programStepNumber + 1})
                        }
                        onClick={this.handleClickStep}>
                    </Button>
                );
            default:
                return (
                    <div key={`${programStepNumber}-unknown`}/>
                );
        }
    }

    render() {
        var noneAtEnd = this.props.program[this.props.program.length - 1] === 'none';

        const programBlocks = this.props.program.map((command, stepNumber) => {
            return this.makeProgramBlock(stepNumber, command);
        });

        // Ensure that we have at least props.minVisibleSteps
        for (var i = this.props.program.length; i < this.props.minVisibleSteps; i++) {
            programBlocks.push(this.makeProgramBlock(i, 'none'));
            noneAtEnd = true;
        }

        // Ensure that the last block is 'none'
        if (!noneAtEnd) {
            programBlocks.push(this.makeProgramBlock(programBlocks.length, 'none'));
        }

        // Clear commandBlock before we render
        this.commandBlock = null;

        return (
            <Container className='ProgramBlockEditor__container'>
                <Row className='ProgramBlockEditor__header'>
                    <Col>
                        <h2 className='ProgramBlockEditor__heading'>
                            <FormattedMessage id='ProgramBlockEditor.programHeading' />
                        </h2>
                    </Col>
                    <div className='ProgramBlockEditor__editor-actions'>
                        <Button
                            disabled={this.props.editingDisabled}
                            key='addButton'
                            className={this.addIsSelected() ?
                                        'ProgramBlockEditor__editor-action-button ProgramBlockEditor__editor-action-button--pressed' :
                                        'ProgramBlockEditor__editor-action-button'}
                            aria-pressed={this.addIsSelected() ? 'true' : 'false'}
                            aria-label={this.props.intl.formatMessage({id:'ProgramBlockEditor.editorAction.add'})}
                            onClick={this.handleClickAdd}>
                            <AddIcon className='ProgramBlockEditor__editor-action-button-svg'/>
                        </Button>
                        <Button
                            disabled={this.props.editingDisabled}
                            key='deleteButton'
                            className={this.deleteIsSelected() ?
                                        'ProgramBlockEditor__editor-action-button ProgramBlockEditor__editor-action-button--pressed' :
                                        'ProgramBlockEditor__editor-action-button'}
                            aria-pressed={this.deleteIsSelected() ? 'true' : 'false'}
                            aria-label={this.props.intl.formatMessage({id:'ProgramBlockEditor.editorAction.delete'})}
                            onClick={this.handleClickDelete}>
                            <DeleteIcon className='ProgramBlockEditor__editor-action-button-svg'/>
                        </Button>
                    </div>
                </Row>
                <Row>
                    <Col className='ProgramBlockEditor__program-sequence-scroll-container'>
                        <div className='ProgramBlockEditor__program-sequence'>
                            <div className='ProgramBlockEditor__start-indicator'>
                                {this.props.intl.formatMessage({id:'ProgramBlockEditor.startIndicator'})}
                            </div>
                            {programBlocks}
                        </div>
                    </Col>
                </Row>
                <Row className='ProgramBlockEditor__footer'>
                    <Col>
                        <RunProgramButton
                            disabled={this.props.runButtonDisabled}
                            program={this.props.program}
                            onClick={this.props.onClickRunButton}
                        />
                    </Col>
                </Row>
            </Container>
        );
    }

    componentDidUpdate() {
        if (this.commandBlock !== null) {
            this.commandBlock.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' })
        }
    }
}

export default injectIntl(ProgramBlockEditor);
