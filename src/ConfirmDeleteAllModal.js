// @flow

import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import { injectIntl, FormattedMessage } from 'react-intl';
import type {IntlShape} from 'react-intl';
import { ReactComponent as ErrorIcon } from './svg/Error.svg';
import './ConfirmDeleteAllModal.scss';

type ConfirmDeleteAllModalProps = {
    intl: IntlShape,
    show: boolean,
    onCancel: () => void,
    onConfirm: () => void
};

class ConfirmDeleteAllModal extends React.Component<ConfirmDeleteAllModalProps, {}> {
    render() {
        return (
            <Modal
                show={this.props.show}
                onHide={this.props.onCancel}
                size='lg'
                dialogClassName='ConfirmDeleteAllModal'
                centered>
                <Modal.Body className='ConfirmDeleteAllModal__content'>
                    <div className='ConfirmDeleteAllModal__header'>
                        <span role='img' aria-label={this.props.intl.formatMessage({id:'ConfirmDeleteAllModal.warning'})} >
                            <ErrorIcon className='ConfirmDeleteAllModal__warning-svg' />
                        </span>
                        <FormattedMessage id='ConfirmDeleteAllModal.title' />
                    </div>
                    <div className='ConfirmDeleteAllModal__footer'>
                        <Button
                            className='ConfirmDeleteAllModal__option-button ConfirmDeleteAllModal__option-button-cancel'
                            onClick={this.props.onCancel}>
                            <FormattedMessage id='ConfirmDeleteAllModal.cancelButton' />
                        </Button>
                        <Button
                            className='ConfirmDeleteAllModal__option-button'
                            onClick={this.props.onConfirm}>
                            <FormattedMessage id='ConfirmDeleteAllModal.confirmButton' />
                        </Button>
                    </div>
                </Modal.Body>
            </Modal>
        );
    }
}

export default injectIntl(ConfirmDeleteAllModal);
