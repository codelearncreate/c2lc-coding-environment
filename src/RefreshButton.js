// @flow

import React from 'react';
import { injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';
import IconButton from './IconButton';
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
            <IconButton
                ariaLabel={this.props.intl.formatMessage({id:'RefreshButton'})}
                className='RefreshButton'
                disabledClassName='RefreshButton--disabled'
                disabled={this.props.disabled}
                onClick={this.props.onClick}
            >
                <RefreshIcon className='RefreshButton-svg' />
            </IconButton>
        );
    }
}

export default injectIntl(RefreshButton);
