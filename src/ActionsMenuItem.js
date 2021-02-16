// @flow
import React from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

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
            <Row className="ActionsMenuItem__row">
                <Col sm={12} md={6} className={'ActionsMenuItem__text' + (this.props.isAllowed ? '' : '--disabled')}>
                    {commandNameShort}
                </Col>
                <Col sm={12} md={6}>
                    <button className="ActionsMenuItem__button" aria-label={showHideAriaLabel}>
                        <input type="checkbox" onChange={this.props.onChange} checked={this.props.isAllowed} disabled={this.props.isUsed}/>
                        <span className="ActionsMenuItem__button-label">
                            {showHideLabel}
                        </span>
                    </button>
                </Col>
            </Row>
        );
    };
};

export default injectIntl(ActionsMenuItem);