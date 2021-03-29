// @flow
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import type {IntlShape} from 'react-intl';

import ActionsMenuToggle from './ActionsMenuToggle';
import ActionsMenuItem from './ActionsMenuItem';
import FocusTrapManager from './FocusTrapManager';

import './ActionsMenu.scss';

import type {ActionToggleRegister} from './types';

type ActionsMenuProps = {
    intl: IntlShape,
    changeHandler?: (event: Event, commandName: string) => void,
    editingDisabled?: boolean,
    // TODO: Flesh this definition out.
    menuItems: {},
    allowedActions: ActionToggleRegister,
    usedActions: ActionToggleRegister
};

type ActionsMenuState = {
    showMenu: boolean
};

class ActionsMenu extends React.Component<ActionsMenuProps, ActionsMenuState> {
    focusTrapManager: FocusTrapManager;

    static defaultProps = {
        changeHandler: () => {},
        editingDisabled: false,
        usedActions: {},
        menuItems: {
            backward1: {
                isAllowed: true,
                labelKey: "Command.backward1"
            },
            backward2: {
                isAllowed: true,
                labelKey: "Command.backward2"
            },
            backward3: {
                isAllowed: true,
                labelKey: "Command.backward3"
            },
            forward1: {
                isAllowed: true,
                labelKey: "Command.forward1"
            },
            forward2: {
                isAllowed: true,
                labelKey: "Command.forward2"
            },
            forward3: {
                isAllowed: true,
                labelKey: "Command.forward3"
            },
            left45: {
                isAllowed: true,
                labelKey: "Command.left45"
            },
            left90: {
                isAllowed: true,
                labelKey: "Command.left90"
            },
            left180: {
                isAllowed: true,
                labelKey: "Command.left180"
            },
            right45: {
                isAllowed: true,
                labelKey: "Command.right45"
            },
            right90: {
                isAllowed: true,
                labelKey: "Command.right90"
            },
            right180: {
                isAllowed: true,
                labelKey: "Command.right180"
            }
        }
    }
    constructor (props: ActionsMenuProps) {
        super(props);
        this.state = { showMenu: false };
        this.focusTrapManager = new FocusTrapManager();
        this.focusTrapManager.setFocusTrap(this.handleCloseActionMenuFocusTrap, [".ActionsMenu__toggle-button", ".ActionsMenuItem__checkbox"], ".ActionsMenu__toggle-button");
    }

    render() {
        return (
            <React.Fragment>
                <div className='ActionsMenu__header' onKeyDown={this.focusTrapManager.handleKeyDown}>
                    <h2 className='ActionsMenu__header-heading'>
                        <FormattedMessage id='ActionsMenu.title' />
                    </h2>
                    <ActionsMenuToggle
                        className='ActionsMenu__header-toggle'
                        intl={this.props.intl}
                        editingDisabled={!!this.props.editingDisabled}
                        handleShowHideMenu={this.showHideMenu}
                        showMenu={this.state.showMenu}
                    />

                    { (!this.props.editingDisabled && this.state.showMenu) ? this.generateMenu(): undefined}
                </div>

            </React.Fragment>
        );
    }

    /* istanbul ignore next */
    handleClick = (event: SyntheticEvent<HTMLElement>) => {
        event.preventDefault();
        this.showHideMenu();
    };

    /* istanbul ignore next */
    handleKeyDown = (event: SyntheticKeyboardEvent<HTMLElement>) => {
        if (event.key === 'Escape') {
            event.preventDefault();
            this.showHideMenu();
        }
    }

    /* istanbul ignore next */
    handleCloseActionMenuFocusTrap = () => {
        this.setState({ showMenu: false });
    }

    showHideMenu = () => {
        if (!this.props.editingDisabled) {
            this.setState((state) => {
                return { showMenu: !(state.showMenu)}
            });
        }
    }

    generateMenu = () => {
        const actionsMenuItems = [];
        // TODO: Discuss how to evolve this into a deeper structure when we add groups and things other than actions.
        Object.keys(this.props.menuItems).forEach((itemKey) => {
            const isAllowed: boolean = !!this.props.allowedActions[itemKey];
            const isUsed: boolean = !!this.props.usedActions[itemKey];
            // TODO: Add a mechanism for values to come back to us.
            const itemChangeHandler = (event: Event) => {
                /* istanbul ignore next */
                if (this.props.changeHandler) {
                    this.props.changeHandler(event, itemKey);
                }
            };
            actionsMenuItems.push(
                <ActionsMenuItem
                    intl={this.props.intl}
                    isAllowed={isAllowed}
                    isUsed={isUsed}
                    itemKey={itemKey}
                    key={itemKey}
                    onChange={itemChangeHandler}
                />
            );
        });
        return (<div
            id="ActionsMenu"
            className="ActionsMenu__menu"
            onKeyDown={this.handleKeyDown}
        >
            {actionsMenuItems}
        </div>);
    }
}

export default injectIntl(ActionsMenu);
