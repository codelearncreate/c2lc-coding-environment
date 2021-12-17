// @flow

import { injectIntl } from 'react-intl';
import type {IntlShape} from 'react-intl';
import React from 'react';
import CharacterState from './CharacterState';
import classNames from 'classnames';
import { getWorldCharacter } from './Worlds';
import { ReactComponent as MovePositionUp } from './svg/MovePositionUp.svg';
import { ReactComponent as MovePositionRight } from './svg/MovePositionRight.svg';
import { ReactComponent as MovePositionDown } from './svg/MovePositionDown.svg';
import { ReactComponent as MovePositionLeft } from './svg/MovePositionLeft.svg';
import { ReactComponent as TurnPositionRight } from './svg/TurnPositionRight.svg';
import { ReactComponent as TurnPositionLeft } from './svg/TurnPositionLeft.svg';
import type { ThemeName } from './types';
import type { WorldName } from './Worlds';
import './CharacterPositionController.scss';

type CharacterPositionControllerProps = {
    intl: IntlShape,
    characterState: CharacterState,
    editingDisabled: boolean,
    theme: ThemeName,
    world: WorldName,
    onChangeCharacterPosition: (direction: ?string) => void,
    onChangeCharacterXPosition: (columnLabel: string) => void,
    onChangeCharacterYPosition: (rowLabel: string) => void
};

type CharacterPositionControllerState = {
    prevPropsCharacterState: CharacterState,
    characterColumnLabel: string,
    characterRowLabel: string
};

class CharacterPositionController extends React.Component<CharacterPositionControllerProps, CharacterPositionControllerState> {
    constructor(props: CharacterPositionControllerProps) {
        super(props);
        this.state = {
            prevPropsCharacterState: this.props.characterState,
            characterColumnLabel: this.props.characterState.getColumnLabel(),
            characterRowLabel: this.props.characterState.getRowLabel()
        }
    }

    static getDerivedStateFromProps(props: CharacterPositionControllerProps, state: CharacterPositionControllerState) {
        if (props.characterState !== state.prevPropsCharacterState) {
            const currentCharacterState = props.characterState;
            return {
                prevPropsCharacterState: currentCharacterState,
                characterColumnLabel: currentCharacterState.getColumnLabel(),
                characterRowLabel: currentCharacterState.getRowLabel()
            };
        } else {
            return null;
        }
    }

    handleClickCharacterPositionButton = (e: SyntheticEvent<HTMLElement>) => {
        this.props.onChangeCharacterPosition(e.currentTarget.getAttribute('value'));
    }

    handleKeyDownCharacterPositionButton = (e: SyntheticKeyboardEvent<HTMLInputElement>) => {
        if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            this.props.onChangeCharacterPosition(e.currentTarget.getAttribute('value'));
        }
    }

    handleChangeCharacterPositionLabel = (e: SyntheticKeyboardEvent<HTMLInputElement>) => {
        if (e.currentTarget.name === 'xPosition') {
            this.setState({
                characterColumnLabel: e.currentTarget.value
            });
        } else if (e.currentTarget.name === 'yPosition'){
            this.setState({
                characterRowLabel: e.currentTarget.value
            });
        }
    }

    handleBlurCharacterPositionLabel = (e: SyntheticEvent<HTMLInputElement>) => {
        if (e.currentTarget.name === 'xPosition') {
            this.props.onChangeCharacterXPosition(this.state.characterColumnLabel);
        } else if (e.currentTarget.name === 'yPosition'){
            this.props.onChangeCharacterYPosition(this.state.characterRowLabel);
        }
    }

    handleKeyDownCharacterPositionLabel = (e: SyntheticKeyboardEvent<HTMLInputElement>) => {
        const enterKey = 'Enter';
        if (e.key === enterKey) {
            e.preventDefault();
            if (e.currentTarget.name === 'xPosition') {
                this.props.onChangeCharacterXPosition(this.state.characterColumnLabel);
            } else if (e.currentTarget.name === 'yPosition'){
                this.props.onChangeCharacterYPosition(this.state.characterRowLabel);
            }
        }
    }

    getWorldCharacter() {
        // We use a CSS approach because Safari doesn't support scale transforms whole svgs (and ignores the rotation
        // if you include scaling in the transform).  See:
        // https://stackoverflow.com/questions/48248512/svg-transform-rotate180-does-not-work-in-safari-11
        const worldCharacterClassName = classNames(
            'CharacterPositionController__character-column-character',
            'CharacterPositionController__character-column-character--angle' + this.props.characterState.direction
        );

        const character = getWorldCharacter(this.props.theme, this.props.world);
        return React.createElement(character, {
            className: worldCharacterClassName,
            transform: ""
        });
    }

    render() {
        const characterPositionButtonClassName = classNames(
            'CharacterPositionController__character-position-button',
            this.props.editingDisabled && 'CharacterPositionController__character-position-button--disabled'
        );

        const characterPositionColumnTextInputClassName = classNames(
            'ProgramBlock__character-position-coordinate-box',
            'ProgramBlock__character-position-coordinate-box-column',
            this.props.editingDisabled && 'ProgramBlock__character-position-coordinate-box--disabled'
        );


        const characterPositionRowTextInputClassName = classNames(
            'ProgramBlock__character-position-coordinate-box',
            'ProgramBlock__character-position-coordinate-box-row',
            this.props.editingDisabled && 'ProgramBlock__character-position-coordinate-box--disabled'
        );

        return (
            <div className='CharacterPositionController__character-column'>
                <div className='CharacterPositionController__character-turn-positions'>
                    <TurnPositionLeft
                        className={characterPositionButtonClassName}
                        aria-label={this.props.intl.formatMessage({id:'CharacterPositionController.editPosition.turnLeft'})}
                        aria-disabled={this.props.editingDisabled}
                        role='button'
                        tabIndex='0'
                        value='turnLeft'
                        onKeyDown={!this.props.editingDisabled ? this.handleKeyDownCharacterPositionButton : undefined}
                        onClick={!this.props.editingDisabled ? this.handleClickCharacterPositionButton : undefined} />
                    <TurnPositionRight
                        className={characterPositionButtonClassName}
                        aria-label={this.props.intl.formatMessage({id:'CharacterPositionController.editPosition.turnRight'})}
                        aria-disabled={this.props.editingDisabled}
                        role='button'
                        tabIndex='0'
                        value='turnRight'
                        onKeyDown={!this.props.editingDisabled ? this.handleKeyDownCharacterPositionButton : undefined}
                        onClick={!this.props.editingDisabled ? this.handleClickCharacterPositionButton : undefined} />
                </div>
                <div className='CharacterPositionController__character-move-position-top'>
                    <MovePositionUp
                        className={characterPositionButtonClassName}
                        aria-label={this.props.intl.formatMessage({id:'CharacterPositionController.editPosition.moveUp'})}
                        aria-disabled={this.props.editingDisabled}
                        role='button'
                        tabIndex='0'
                        value='up'
                        onKeyDown={!this.props.editingDisabled ? this.handleKeyDownCharacterPositionButton : undefined}
                        onClick={!this.props.editingDisabled ? this.handleClickCharacterPositionButton : undefined} />
                </div>
                <div className='CharacterPositionController__character-move-position-sides'>
                    <MovePositionLeft
                        className={characterPositionButtonClassName}
                        aria-label={this.props.intl.formatMessage({id:'CharacterPositionController.editPosition.moveLeft'})}
                        aria-disabled={this.props.editingDisabled}
                        role='button'
                        tabIndex='0'
                        value='left'
                        onKeyDown={!this.props.editingDisabled ? this.handleKeyDownCharacterPositionButton : undefined}
                        onClick={!this.props.editingDisabled ? this.handleClickCharacterPositionButton : undefined} />
                    <div
                        aria-hidden='true'
                        className={`CharacterPositionController__character-column-character-container
                            CharacterPositionController__character-column-character-container--${this.props.world}`}
                        role='img'>
                        {this.getWorldCharacter()}
                    </div>
                    <MovePositionRight
                        className={characterPositionButtonClassName}
                        aria-label={this.props.intl.formatMessage({id:'CharacterPositionController.editPosition.moveRight'})}
                        aria-disabled={this.props.editingDisabled}
                        role='button'
                        tabIndex='0'
                        value='right'
                        onKeyDown={!this.props.editingDisabled ? this.handleKeyDownCharacterPositionButton : undefined}
                        onClick={!this.props.editingDisabled ? this.handleClickCharacterPositionButton : undefined} />
                </div>
                <div className='CharacterPositionController__character-move-position-bottom'>
                    <MovePositionDown
                        className={characterPositionButtonClassName}
                        aria-label={this.props.intl.formatMessage({id:'CharacterPositionController.editPosition.moveDown'})}
                        aria-disabled={this.props.editingDisabled}
                        role='button'
                        tabIndex='0'
                        value='down'
                        onKeyDown={!this.props.editingDisabled ? this.handleKeyDownCharacterPositionButton : undefined}
                        onClick={!this.props.editingDisabled ? this.handleClickCharacterPositionButton : undefined} />
                </div>
                <div className='CharacterPositionController__character-move-position-coordinate'>
                    <input
                        name='xPosition'
                        className={characterPositionColumnTextInputClassName}
                        aria-label={this.props.intl.formatMessage({id:'CharacterPositionController.editPosition.columnPosition'})}
                        aria-disabled={this.props.editingDisabled}
                        maxLength='1'
                        size='2'
                        type='text'
                        value={this.state.characterColumnLabel}
                        onChange={!this.props.editingDisabled ? this.handleChangeCharacterPositionLabel : () => {}}
                        onKeyDown={this.handleKeyDownCharacterPositionLabel}
                        onBlur={this.handleBlurCharacterPositionLabel} />
                    <input
                        name='yPosition'
                        className={characterPositionRowTextInputClassName}
                        aria-label={this.props.intl.formatMessage({id:'CharacterPositionController.editPosition.rowPosition'})}
                        aria-disabled={this.props.editingDisabled}
                        maxLength='2'
                        size='2'
                        type='text'
                        value={this.state.characterRowLabel}
                        onChange={!this.props.editingDisabled ? this.handleChangeCharacterPositionLabel : () => {}}
                        onKeyDown={this.handleKeyDownCharacterPositionLabel}
                        onBlur={this.handleBlurCharacterPositionLabel} />
                </div>
            </div>
        )
    }
}

export default injectIntl(CharacterPositionController);
