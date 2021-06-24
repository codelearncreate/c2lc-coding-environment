// @flow

import React from 'react';
import {Button} from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';

import ShareCompleteModal from './ShareCompleteModal';

import './ShareButton.scss';

type ShareButtonProps = {
    intl: IntlShape,
    onShowModal?: Function
};

type ShareButtonState = {
    showShareComplete: boolean
}

class ShareButton extends React.Component<ShareButtonProps, ShareButtonState> {
    constructor (props: ShareButtonProps) {
        super(props);
        this.state = {
            showShareComplete: false
        }
    }

    handleClickShareButton = () => {
        // Get the current URL, which represents the current program state.
        const currentUrl = document.location.href;

        // Copy the URL to the clipboard, see:
        // https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/writeText
        navigator.clipboard.writeText(currentUrl).then(() => {
            this.setState({ showShareComplete: true})
        });
    }

    handleModalClose = () => {
        this.setState({showShareComplete: false});
    }

    render() {
        return (
            <React.Fragment>
                <Button
                    variant="light"
                    className='ShareButton'
                    onClick={this.handleClickShareButton}
                >
                    {this.props.intl.formatMessage({id:'ShareButton'})}
                </Button>
                <ShareCompleteModal
                    show={this.state.showShareComplete}
                    onHide={this.handleModalClose}
                />
            </React.Fragment>
        );
    }

    componentDidUpdate(prevProps: ShareButtonProps, prevState: ShareButtonState) {
        if ((this.state.showShareComplete !== prevState.showShareComplete)
                && this.state.showShareComplete) {
            if (this.props.onShowModal) {
                this.props.onShowModal();
            }
        }
    }
}

export default injectIntl(ShareButton);

