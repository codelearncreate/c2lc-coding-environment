// @flow
import React from 'react';
import ModalHeader from './ModalHeader';
import ModalBody from './ModalBody';
import ModalWithFooter from './ModalWithFooter';
import TextButton from './TextButton';
import { injectIntl, FormattedMessage } from 'react-intl';
import type {IntlShape} from 'react-intl';
import {ReactComponent as ShareIcon} from './svg/Share.svg'

import './ShareModal.scss';

type ShareModalProps = {
    intl: IntlShape,
    show: boolean,
    onClose: () => void
};

class ShareModal extends React.Component<ShareModalProps, {}> {
    copyURL = () => {
        // Copy the URL to the clipboard, see:
        // https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/writeText
        if (navigator.clipboard) {
            navigator.clipboard.writeText(document.location.href);
        }
    }

    render () {
        const buttonProperties = [{
            label: this.props.intl.formatMessage({id: 'ShareModal.close'}),
            onClick: this.props.onClose,
            isPrimary: false
        }];

        const copyButtonLabel = this.props.intl.formatMessage({ id: 'ShareModal.copy'});

        return(
            <ModalWithFooter
                show={this.props.show}
                focusOnOpenSelector={'.ShareModal__form__copyButton'}
                focusOnCloseSelector={'.App__ShareButton'}
                ariaLabel={this.props.intl.formatMessage({ id: 'ShareModal.title' })}
                onClose={this.props.onClose}
                buttonProperties={buttonProperties}
            >
                <ModalHeader
                    id='ShareModal'
                    title={this.props.intl.formatMessage({
                        id: 'ShareModal.title'
                    })}
                >
                    <ShareIcon aria-hidden="true"/>
                </ModalHeader>
                <ModalBody>
                    <div className='ShareModal__content'>
                        <p><FormattedMessage id='ShareModal.description1' /></p>
                        <p><FormattedMessage id='ShareModal.description2' /></p>

                        <div className='ShareModal__form'>
                            <input
                                className='ShareModal__form__URL'
                                type="text"
                                value={document.location.href}
                                readOnly={true}
                            />
                            <TextButton
                                className='ShareModal__form__copyButton'
                                label={copyButtonLabel}
                                isPrimary={true}
                                onClick={this.copyURL}
                            />
                        </div>
                    </div>
                </ModalBody>
            </ModalWithFooter>);
    }
}

export default injectIntl(ShareModal);
