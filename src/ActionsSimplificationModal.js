// @flow
import React from 'react';
import { injectIntl } from 'react-intl';
import type {IntlShape} from 'react-intl';
import ModalHeader from './ModalHeader';
import ModalBody from './ModalBody';
import ModalWithFooter from './ModalWithFooter';

import ActionsMenuItem from './ActionsMenuItem';
import ProgramSequence from './ProgramSequence';

import type {ActionToggleRegister, CommandName} from './types';
import {extend} from './Utils';
import {ReactComponent as SimplificationIcon} from './svg/Simplification.svg'

import './ActionsSimplificationModal.scss';

type ActionsSimplificationModalProps = {
    intl: IntlShape,
    onCancel: () => void,
    onConfirm: (disallowedActions: ActionToggleRegister) => void,
    // TODO: Flesh this definition out.
    menuItems: Array<CommandName>,
    programSequence: ProgramSequence,
    disallowedActions: ActionToggleRegister,
    show: boolean
};

type ActionsSimplificationModalState = {
    disallowedActions: ActionToggleRegister
}

class ActionsSimplificationModal extends React.Component<ActionsSimplificationModalProps, ActionsSimplificationModalState> {
    static defaultProps = {
        menuItems: [
            'forward1',
            'forward2',
            'forward3',
            'backward1',
            'backward2',
            'backward3',
            'left45',
            'left90',
            'left180',
            'right45',
            'right90',
            'right180'
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
                    {this.generateMenu()}
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

    generateMenu = () => {
        const actionsMenuItems = [];
        // TODO: Discuss how to evolve this into a deeper structure when we add groups and things other than actions.
        for (const itemKey of this.props.menuItems) {
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
