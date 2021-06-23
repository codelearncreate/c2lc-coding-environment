// @flow

import React from 'react';
import AriaDisablingButton from './AriaDisablingButton';
import { injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';
import { ReactComponent as RefreshIcon } from './svg/Refresh.svg';
import './RefreshButton.scss';

type RefreshButtonProps = {
    intl: IntlShape,
    disabled: boolean,
    onClick: () => void
};

class RefreshButton extends React.Component<RefreshButtonProps, {}> {
    render() {
        return (
            <AriaDisablingButton
                aria-label={this.props.intl.formatMessage({id:'RefreshButton'})}
                className='RefreshButton focus-announcement'
                disabledClassName='RefreshButton--disabled'
                disabled={this.props.disabled}
                onClick={this.props.onClick}
            >
                <RefreshIcon className='RefreshButton-svg' />
            </AriaDisablingButton>
        );
    }
}

export default injectIntl(RefreshButton);
