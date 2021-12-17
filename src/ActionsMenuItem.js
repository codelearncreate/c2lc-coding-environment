// @flow
import React from 'react';

import { injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';

import classNames from 'classnames';
import {commandBlockIconTypes} from './CommandBlock';

import './ActionsMenuItem.scss';

type ActionsMenuItemProps = {
    intl: IntlShape,
    isAllowed?: boolean,
    isSelected?: boolean,
    isUsed?: boolean,
    itemKey: string,
    onChange: (event: Event) => void
}

export class ActionsMenuItem extends React.Component< ActionsMenuItemProps, {} > {
    handleKeydown = (event: KeyboardEvent) => {
        if (event.key === ' ' || event.key === 'Enter') {
            this.handleChange(event);
        }
    }

    handleChange = (event: Event) => {
        // Always reenabled disallowed commands, but do not disable used ones.
        if (!this.props.isAllowed || !(this.props.isSelected || this.props.isUsed)) {
            event.preventDefault();
            this.props.onChange(event);
        }
    }

    render () {
        // We don't use FormattedMessage as we are working with a complex chain of templates.
        let commandName = this.props.intl.formatMessage({ id: `ActionsMenuItem.command.${this.props.itemKey}` });
        const usedLabel = this.props.intl.formatMessage({ id: 'ActionsMenuItem.usedItemToggleLabel' });
        if (this.props.isUsed) {
            commandName += " " + usedLabel;
        }
        if (this.props.isSelected) {
            const selectedLabel = this.props.intl.formatMessage({ id: 'ActionsMenuItem.selectedActionToggleLabel' });
            commandName += " " + selectedLabel
        }

        const checkboxId = `actions-menu-item-${this.props.itemKey}`;

        const iconClassNames = classNames(
            'ActionsMenuItem__icon',
            'ActionsMenuItem__icon--' + this.props.itemKey
        );

        // $FlowFixMe: Flow is confused about what itemKey is.
        let icon = null;
        const iconType = commandBlockIconTypes.get(this.props.itemKey);
        if (iconType) {
            icon = React.createElement(iconType);
        }

        // Disable the checkbox if the button is allowed and used.
        const isCheckboxDisabled = (this.props.isAllowed && (this.props.isUsed || this.props.isSelected));

        return (
            <div
                className="ActionsMenuItem"
                role="checkbox"
                aria-checked={this.props.isAllowed}
                aria-label={commandName}
                aria-disabled={isCheckboxDisabled}
                tabIndex={0}
                onKeyDown={this.handleKeydown}
                onClick={this.handleChange}
            >
                <div className="ActionsMenuItem__option">
                    <input
                        className="ActionsMenuItem__checkbox"
                        type="checkbox"
                        id={checkboxId}
                        aria-hidden={true}
                        checked={this.props.isAllowed}
                        disabled={isCheckboxDisabled}
                        readOnly={true}
                        tabIndex={-1}
                    />
                </div>
                <div className="ActionsMenuItem__text">
                    {commandName}
                </div>
                <div className={iconClassNames}>
                    {icon}
                </div>
            </div>
        );
    };
};

export default injectIntl(ActionsMenuItem);
