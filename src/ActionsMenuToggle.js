// @flow
import * as React from 'react';
import { injectIntl } from 'react-intl';
import type {IntlShape} from 'react-intl';

import { ReactComponent as EllipsisIcon } from './svg/Ellipsis.svg';

import './ActionsMenuToggle.scss';

type ActionsMenuToggleProps = {
    intl: IntlShape,
    editingDisabled: boolean,
    showMenu: boolean;
    handleShowHideMenu: () => void
};

class ActionsMenuToggle extends React.Component<ActionsMenuToggleProps, {}> {
    /* istanbul ignore next */
    handleKeyDown = (e: SyntheticKeyboardEvent<HTMLInputElement>) => {
        if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            this.props.handleShowHideMenu();
        }
    }

    onClick = (e: SyntheticEvent<HTMLElement>) => {
        e.preventDefault();
        this.props.handleShowHideMenu();
    }

    render() {
        return (
            <div
                role='button'
                aria-controls='ActionsMenu'
                aria-label={this.props.intl.formatMessage({id:'ActionsMenu.toggleActionsMenu'})}
                aria-expanded={this.props.showMenu}
                tabIndex='0'
                className='ActionsMenu__toggle-button'
                disabled={this.props.editingDisabled}
                onClick={this.onClick}
                onKeyDown={this.handleKeyDown}
            >
                <EllipsisIcon className='ActionsMenu__toggle-button-svg'/>
            </div>
        );
    }
};

export default injectIntl(ActionsMenuToggle);
