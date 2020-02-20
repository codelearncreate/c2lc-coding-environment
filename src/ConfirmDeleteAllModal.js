// @flow

import React from 'react';
import Modal from 'react-modal';
import { Button } from 'react-bootstrap';
import { injectIntl, FormattedMessage } from 'react-intl';
import { ReactComponent as ErrorIcon } from './svg/Error.svg';
import './ConfirmDeleteAllModal.css';

type ConfrimDeleteAllModalProps = {
    intl: any,
    show: boolean,
    onCancel: () => void,
    onConfirm: () => void
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

class ConfrimDeleteAllModal extends React.Component<ConfrimDeleteAllModalProps, {}> {
    render() {
        return (
            <Modal
                ariaHideApp={false}
                isOpen={this.props.show}
                onRequestClose={this.props.onCancel}
                style={customStyles}
                contentLabel="Confirm Delete All">
                    <div role='alert' className='ConfrimDeleteAllModal__content'>
                        <div tabIndex='-1' className='ConfrimDeleteAllModal__header'>
                            <span role='img' aria-label={this.props.intl.formatMessage({id:'ConfrimDeleteAllModal.warning'})} >
                                <ErrorIcon className='ConfrimDeleteAllModal__warning-svg' />
                            </span>
                            <FormattedMessage id='ConfrimDeleteAllModal.title' />
                        </div>
                    </div>
                    <div className='ConfrimDeleteAllModal__footer'>
                        <Button
                            className='ConfrimDeleteAllModal__option-button mr-4'
                            onClick={this.props.onCancel}>
                            <FormattedMessage id='ConfrimDeleteAllModal.cancelButton' />
                        </Button>
                        <Button
                            className='ConfrimDeleteAllModal__option-button'
                            onClick={this.props.onConfirm}>
                            <FormattedMessage id='ConfrimDeleteAllModal.confirmButton' />
                        </Button>
                    </div>
            </Modal>
        );
    }
}

export default injectIntl(ConfrimDeleteAllModal);
