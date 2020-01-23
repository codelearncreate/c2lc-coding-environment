// @flow

import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import type { $npm$ReactIntl$IntlShape } from 'react-intl';
import { ReactComponent as ErrorIcon } from './svg/Error.svg';
import './BluetoothApiWarning.scss';

type BluetoothApiWarningProps = {
    intl: $npm$ReactIntl$IntlShape
};

class BluetoothApiWarning extends React.Component<BluetoothApiWarningProps, {}> {
    render() {
        return (
            <div className='BluetoothApiWarning'>
                <span
                    role='img'
                    aria-label={this.props.intl.formatMessage({ id: 'BluetoothApiWarning.errorIconLabel' })}>
                    <ErrorIcon className='BluetoothApiWarning__error-icon-svg' />
                </span>
                <FormattedMessage id='BluetoothApiWarning.message' />
            </div>
        );
    }
}

export default injectIntl(BluetoothApiWarning);
