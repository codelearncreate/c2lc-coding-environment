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
                aria-labelledby='deleteAll-button'
                show={this.props.show}
                onHide={this.props.onCancel}
                size='lg'
                dialogClassName='ConfirmDeleteAllModal'
                centered>
                <Modal.Body className='ConfirmDeleteAllModal__content'>
                    <div className='ConfirmDeleteAllModal__header'>
                        <span role='img' aria-hidden='true' >
                            <ErrorIcon className='ConfirmDeleteAllModal__warning-svg' />
                        </span>
                        <FormattedMessage id='ConfirmDeleteAllModal.title' />
                    </div>
                    <div className='ConfirmDeleteAllModal__footer'>
                        <Button
                            className='ConfirmDeleteAllModal__option-button cancel'
                            onClick={this.props.onCancel}>
                            <FormattedMessage id='ConfirmDeleteAllModal.cancelButton' />
                        </Button>
                        <Button
                            id='deleteAll-button'
                            className='ConfirmDeleteAllModal__option-button confirm'
                            onClick={this.props.onConfirm}>
                            <FormattedMessage id='ConfirmDeleteAllModal.confirmButton' />
                        </Button>
                    </div>
                </Modal.Body>
            </Modal>
        );
    }

    componentDidUpdate (prevProps: ConfirmDeleteAllModalProps) {
        if (prevProps.show !== this.props.show && this.props.show) {
            // TODO: Implement a common function to set focus on an element with an id in Untils.js
            const deleteAllButton = document.getElementById('deleteAll-button');
            if (deleteAllButton) {
                deleteAllButton.focus();
            }
        }
    }
}

export default injectIntl(ConfirmDeleteAllModal);
