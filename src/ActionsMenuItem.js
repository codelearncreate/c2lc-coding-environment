// @flow
import React from 'react';

import { injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';

import './ActionsMenuItem.scss';

type ActionsMenuItemProps = {
    intl: IntlShape,
    isAllowed?: boolean,
    isUsed?: boolean,
    itemKey: string,
    onChange: (event: Event) => void
}

export class ActionsMenuItem extends React.Component< ActionsMenuItemProps, {} > {
    render () {
        // We don't use FormattedMessage as we are working with a complex chain of templates.
        const commandName = this.props.intl.formatMessage({ id: `Command.${this.props.itemKey}` });
        const commandNameShort = this.props.intl.formatMessage({ id: `Command.short.${this.props.itemKey}` });

        const actionNameKey = this.props.isAllowed ? "ActionsMenu.item.action.show" : "ActionsMenu.item.action.hide";
        const actionName = this.props.intl.formatMessage({ id: actionNameKey });

        // If we're used, show one message. If we're not, show another that differs based on `isAllowed`.
        const showHideLabelKey = this.props.isUsed ? "ActionsMenu.item.usedItemToggleLabel" : "ActionsMenu.item.unusedItemToggleLabel";
        const showHideLabel = this.props.intl.formatMessage(
            { id: showHideLabelKey },
            { action: actionName, commandName: commandName }
        );

        const showHideAriaLabelKey = this.props.isUsed ? "ActionsMenu.item.usedItemToggleAriaLabel" : "ActionsMenu.item.unusedItemToggleAriaLabel";
        const showHideAriaLabel = this.props.intl.formatMessage(
            { id: showHideAriaLabelKey },
            { action: actionName, commandName: commandName }
        );

        return (
            <div className="ActionsMenuItem">
                <div className={'ActionsMenuItem__text' + (this.props.isAllowed ? '' : ' ActionsMenuItem__text--disabled')}>
                    {commandNameShort}
                </div>
                <div className="ActionsMenuItem__option">
                    <input
                        className="ActionsMenuItem__checkbox"
                        type="checkbox"
                        aria-label={showHideAriaLabel}
                        id={commandNameShort}
                        checked={this.props.isAllowed}
                        aria-disabled={this.props.isUsed}
                        onChange={this.props.onChange}
                    />
                    <label htmlFor={commandNameShort} className="ActionsMenuItem__option-label">
                        {showHideLabel}
                    </label>
                </div>
            </div>
        );
    };
};

export default injectIntl(ActionsMenuItem);
