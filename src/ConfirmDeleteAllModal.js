// @flow

import React from 'react';
import ModalBody from './ModalBody';
import ModalHeader from './ModalHeader';
import ModalWithFooter from './ModalWithFooter';
import { injectIntl, FormattedMessage } from 'react-intl';
import type {IntlShape} from 'react-intl';
import { ReactComponent as DeleteIcon } from './svg/Delete.svg';
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
            <ModalWithFooter
                show={this.props.show}
                focusOnOpenSelector={'#ConformDeleteAllModal-confirm'}
                focusOnCloseSelector={'.ProgramBlockEditor__program-deleteAll-button'}
                ariaLabel={this.props.intl.formatMessage({ id: 'ConfirmDeleteAllModal.title' })}
                onClose={this.props.onCancel}
                buttonProperties={
                    [
                        {label: this.props.intl.formatMessage({id: 'ConfirmDeleteAllModal.cancelButton'}), onClick: this.props.onCancel},
                        {id: 'ConformDeleteAllModal-confirm', label: this.props.intl.formatMessage({id: 'ConfirmDeleteAllModal.confirmButton'}), onClick: this.props.onConfirm, isPrimary: true}
                    ]
                }>
                <ModalHeader
                    id='ConfirmDeleteAllModal'
                    title={this.props.intl.formatMessage({
                        id: 'ConfirmDeleteAllModal.title'
                    })}>
                    <DeleteIcon aria-hidden='true' />
                </ModalHeader>
                <ModalBody>
                    <div className='ConfirmDeleteAllModal__content'>
                        <FormattedMessage id='ConfirmDeleteAllModal.content' />
                    </div>
                </ModalBody>
            </ModalWithFooter>
        );
    }
}

export default injectIntl(ConfirmDeleteAllModal);
