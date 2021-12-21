// @flow
import React from 'react';
import { Modal } from 'react-bootstrap';
import { injectIntl, FormattedMessage } from 'react-intl';
import type {IntlShape} from 'react-intl';
import { focusByQuerySelector } from './Utils';

import './ShareCompleteModal.scss';

type ShareCompleteModalProps = {
    intl: IntlShape,
    show: boolean,
    onHide: Function
};

class ShareCompleteModal extends React.Component<ShareCompleteModalProps, {}> {
    static defaultProps = {
        show: false,
        onHide: () => {}
    }

    render () {
        return(
            <Modal
                onHide={this.props.onHide}
                show={this.props.show}
                dialogClassName='ShareCompleteModal'
            >
                <Modal.Body className='ShareCompleteModal__content'>
                    <FormattedMessage id='ShareCompleteModal.shareComplete' />
                </Modal.Body>

                <div className="ShareCompleteModal__footer">
                    <button id="ShareCompleteModal__confirmButton" onClick={this.props.onHide}>
                        <FormattedMessage id='ShareCompleteModal.confirmButton' />
                    </button>
                </div>
            </Modal>);
    }

    componentDidUpdate(prevProps: ShareCompleteModalProps) {
        /* istanbul ignore next */
        if (prevProps.show !== this.props.show && this.props.show) {
            focusByQuerySelector("#ShareCompleteModal__confirmButton");
        }
    }
}

export default injectIntl(ShareCompleteModal);