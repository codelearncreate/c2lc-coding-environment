// @flow
import React from 'react';

import { injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';

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
    render () {
        // We don't use FormattedMessage as we are working with a complex chain of templates.
        const commandName = this.props.intl.formatMessage({ id: `Command.${this.props.itemKey}` });
        const commandNameShort = this.props.intl.formatMessage({ id: `Command.short.${this.props.itemKey}` });

        const actionNameKey = this.props.isAllowed ? "ActionsMenu.item.action.show" :"ActionsMenu.item.action.hide";
        const actionName = this.props.intl.formatMessage({ id: actionNameKey });

        let showHideLabelKey = "ActionsMenu.item.usedItemToggleLabel";
        if (this.props.isSelected) {
            showHideLabelKey = "ActionsMenu.item.selectedActionToggleLabel";
        }
        else if (!this.props.isUsed) { showHideLabelKey = "ActionsMenu.item.unusedItemToggleLabel"; }
        const showHideLabel = this.props.intl.formatMessage(
            { id: showHideLabelKey },
            { action: actionName, commandName: commandName }
        );

        let showHideAriaLabelKey = "ActionsMenu.item.unusedItemToggleAriaLabel";
        if (this.props.isSelected) {
            showHideAriaLabelKey ="ActionsMenu.item.selectedActionToggleAriaLabel";
        }
        else if (this.props.isUsed) {
            showHideAriaLabelKey = "ActionsMenu.item.usedItemToggleAriaLabel";
        }

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
                        className="ActionsMenuItem__checkbox focus-trap-ActionsMenuItem__checkbox"
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
