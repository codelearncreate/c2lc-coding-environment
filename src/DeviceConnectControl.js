// @flow

import * as React from 'react';
import { injectIntl } from 'react-intl';
import { Button, Spinner } from 'react-bootstrap';
import type {DeviceConnectionStatus} from './types';
import { ReactComponent as StatusConnectedIcon } from './svg/Status_Connected.svg';
import { ReactComponent as StatusNotConnectedIcon } from './svg/Status_NotConnected.svg';
import './DeviceConnectControl.scss';

type DeviceConnectControlProps = {
    intl: any,
    children: React.Element<any>, // Button contents
    disabled: boolean,
    connectionStatus: DeviceConnectionStatus,
    onClickConnect: () => void
};

class DeviceConnectControl extends React.Component<DeviceConnectControlProps, {}> {
    connectionStatusIcon() {
        switch (this.props.connectionStatus) {
            case 'connected':
                return (
                    <span
                        role='img'
                        aria-label={this.props.intl.formatMessage({id:'DeviceConnectControl.connected'})}>
                        <StatusConnectedIcon className='DeviceConnectControl__status-icon'/>
                    </span>
                );
            case 'connecting':
                return (
                    <Spinner
                        animation='border'
                        role='status'
                        className='DeviceConnectControl__status-icon'>
                        <span className="sr-only">
                            {this.props.intl.formatMessage({id:'DeviceConnectControl.connecting'})}
                        </span>
                    </Spinner>
                );
            case 'notConnected':
                return (
                    <span
                        role='img'
                        aria-label={this.props.intl.formatMessage({id:'DeviceConnectControl.notConnected'})}>
                        <StatusNotConnectedIcon className='DeviceConnectControl__status-icon' />
                    </span>
                );
            default:
                return null;
        }

    }

    render() {
        let classNames = ['DeviceConnectControl'];
        if (this.props.disabled) {
            classNames.push('DeviceConnectControl--disabled')
        }
        return (
            <div className={classNames.join(' ')}>
                <Button
                    className='DeviceConnectControl__button'
                    disabled={this.props.disabled}
                    onClick={this.props.onClickConnect}>
                    {this.props.children}
                </Button>
                <span className='DeviceConnectControl__status-icon-container'>
                    {this.connectionStatusIcon()}
                </span>
            </div>
        );
    }
}

export default injectIntl(DeviceConnectControl);
