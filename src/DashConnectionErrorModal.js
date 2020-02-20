// @flow

import React from 'react';
import Modal from 'react-modal';
import { Button } from 'react-bootstrap';
import { injectIntl, FormattedMessage } from 'react-intl';
import { ReactComponent as ErrorIcon } from './svg/Error.svg';
import './DashConnectionErrorModal.scss';

type DashConnectionErrorModalProps = {
    intl: any,
    show: boolean,
    onCancel: () => void,
    onRetry: () => void
};

const customStyles = {
    content : {
        top                   : '50%',
        left                  : '50%',
        right                 : 'auto',
        bottom                : 'auto',
        marginRight           : '-50%',
        transform             : 'translate(-50%, -50%)'
    },
    overlay: {zIndex: 1000}
};

class DashConnectionErrorModal extends React.Component<DashConnectionErrorModalProps, {}> {
    render() {
        return (
            <Modal
                ariaHideApp={false}
                isOpen={this.props.show}
                onRequestClose={this.props.onCancel}
                style={customStyles}
                contentLabel="Dash Connection Error Modal">
                    <div role='alert' className='DashConnectionErrorModal__content'>
                        <div className='DashConnectionErrorModal__header'>
                            <span role='img' aria-label={this.props.intl.formatMessage({id:'DashConnectionErrorModal.error'})} >
                                <ErrorIcon className='DashConnectionErrorModal__error-svg' />
                            </span>
                            <FormattedMessage id='DashConnectionErrorModal.title' />
                        </div>
                        <div className='DashConnectionErrorModal__body'>
                            <ul>
                                <li>
                                    <FormattedMessage id='DashConnectionErrorModal.firstMessage' />
                                </li>
                                <li>
                                    <FormattedMessage id='DashConnectionErrorModal.secondMessage' />
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className='DashConnectionErrorModal__footer'>
                        <Button
                            className='DashConnectionErrorModal__option-button mr-4'
                            onClick={this.props.onCancel}>
                            <FormattedMessage id='DashConnectionErrorModal.cancelButton' />
                        </Button>
                        <Button
                            className='DashConnectionErrorModal__option-button'
                            onClick={this.props.onRetry}>
                            <FormattedMessage id='DashConnectionErrorModal.retryButton' />
                        </Button>
                    </div>
            </Modal>
        );
    }
}

export default injectIntl(DashConnectionErrorModal);
