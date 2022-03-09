// @flow
import React from 'react';
import { injectIntl, FormattedMessage} from 'react-intl';
import type {IntlShape} from 'react-intl';
import ModalHeader from './ModalHeader';
import ModalBody from './ModalBody';
import ModalWithFooter from './ModalWithFooter';

import ActionsMenuItem from './ActionsMenuItem';
import ProgramSequence from './ProgramSequence';

import type {ActionToggleRegister, DisplayedCommandName} from './types';
import {extend} from './Utils';
import {ReactComponent as SimplificationIcon} from './svg/Simplification.svg'

import './ActionsSimplificationModal.scss';

type ActionsSimplificationModalProps = {
    intl: IntlShape,
    onCancel: () => void,
    onConfirm: (disallowedActions: ActionToggleRegister) => void,
    commandMenuItems: Array<DisplayedCommandName>,
    controlMenuItems: Array<DisplayedCommandName>,
    programSequence: ProgramSequence,
    disallowedActions: ActionToggleRegister,
    show: boolean
};

type ActionsSimplificationModalState = {
    disallowedActions: ActionToggleRegister
}

class ActionsSimplificationModal extends React.Component<ActionsSimplificationModalProps, ActionsSimplificationModalState> {
    static defaultProps = {
        commandMenuItems: [
            'forward1',
            'backward1',
            'left45',
            'left90',
            'right45',
            'right90'
        ],
        controlMenuItems: [
            'loop'
        ]
    }

    constructor(props: ActionsSimplificationModalProps) {
        super(props);
        this.state = {
            disallowedActions: this.props.disallowedActions
        }
    }

    render() {
        const cancelButtonProperties = {
            label: this.props.intl.formatMessage({ id: 'ActionsSimplificationModal.cancel'} ),
            isPrimary: false,
            onClick: this.handleOnCancel
        };
        const saveButtonProperties = {
            id: 'ActionSimplificationModal-done',
            isPrimary: true,
            label: this.props.intl.formatMessage({ id: 'ActionsSimplificationModal.save'} ),
            onClick: this.saveChanges
        };
        return (
            <ModalWithFooter
                show={this.props.show}
                focusOnOpenSelector={'.ActionsMenuItem:first-of-type'}
                focusOnCloseSelector={'.App__ActionsMenu__toggle-button'}
                ariaLabelledById='ActionsSimplificationModal__header'
                onClose={this.handleOnCancel}
                buttonProperties={[cancelButtonProperties, saveButtonProperties]}
            >
                <ModalHeader
                    id='ActionsSimplificationModal__header'
                    title={this.props.intl.formatMessage({ id: 'ActionsSimplificationModal.title'})}
                >
                    <SimplificationIcon aria-hidden='true'/>
                </ModalHeader>

                <ModalBody>
                    <h3 className='ActionsSimplificationModal__section-heading'>
                        <FormattedMessage id="CommandPalette.movementsTitle"/>
                    </h3>

                    <div className='ActionsSimplificationModal__section'>
                        {this.generateMenu(this.props.commandMenuItems)}
                    </div>


                    <h3 className='ActionsSimplificationModal__section-heading'>
                        <FormattedMessage id="CommandPalette.controlsTitle"/>
                    </h3>

                    <div className='ActionsSimplificationModal__section'>
                        {this.generateMenu(this.props.controlMenuItems)}
                    </div>
                </ModalBody>
            </ModalWithFooter>

        );
    }

    handleOnCancel = () => {
        this.setState({
            disallowedActions: this.props.disallowedActions
        });
        this.props.onCancel();
    }

    saveChanges = () => {
        this.props.onConfirm(this.state.disallowedActions);
    }

    toggleSingleItem = (itemKey: string) => {
        this.setState((prevState) => {
            const newDisallowedActions = extend({}, prevState.disallowedActions);
            if (prevState.disallowedActions[itemKey]) {
                delete newDisallowedActions[itemKey];
            }
            else {
                newDisallowedActions[itemKey] = true;
            }
            return { disallowedActions: newDisallowedActions};
        });
    }

    generateMenu = (menuItems: Array<DisplayedCommandName>) => {
        const actionsMenuItems = [];
        // TODO: Discuss how to evolve this into a deeper structure when we add groups and things other than actions.
        for (const itemKey of menuItems) {
            const isDisallowed: boolean = !!this.state.disallowedActions[itemKey];
            const isUsed: boolean = this.props.programSequence.usesAction(itemKey);
            const itemChangeHandler = () => {
                this.toggleSingleItem(itemKey);
            };
            actionsMenuItems.push(
                <ActionsMenuItem
                    intl={this.props.intl}
                    isDisallowed={isDisallowed}
                    isUsed={isUsed}
                    itemKey={itemKey}
                    key={itemKey}
                    onChange={itemChangeHandler}
                />
            );
        }

        return (
            <div
                className="ActionsSimplificationModal__menu"
            >
                {actionsMenuItems}
            </div>
        );
    }

    // Required to avoid a phantom state where we persist the defaults even after they are updated from local storage.
    componentDidUpdate (prevProps: ActionsSimplificationModalProps) {
        if (prevProps.disallowedActions !== this.props.disallowedActions) {
            this.setState({
                disallowedActions: this.props.disallowedActions
            });
        }
    }
}

export default injectIntl(ActionsSimplificationModal);
