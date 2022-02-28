// @flow

import React from 'react';
import Modal from './Modal';
import TextButton from './TextButton';
import type {TextButtonProps} from './TextButton'
import './ModalWithFooter.scss';

type ModalWithFooterProps = {
    show: boolean,
    focusOnOpenSelector: string,
    focusOnCloseSelector: string,
    ariaLabel?: string,
    ariaLabelledById?: string,
    ariaDescribedById?: string,
    children?: any,
    onClose: () => void,
    buttonProperties: Array<TextButtonProps>
};

class ModalWithFooter extends React.Component<ModalWithFooterProps, {}> {
    renderFooterButtons = () => {
        const footerButtons = [];
        for (const buttonProps of this.props.buttonProperties) {
            const buttonPropsWithKey = Object.assign(
                {},
                buttonProps,
                {
                    key: `footerButton-${footerButtons.length}`
                }
            );
            footerButtons.push(React.createElement(TextButton, buttonPropsWithKey));
        }
        return footerButtons;
    }
    render() {
        return (
            <Modal
                show={this.props.show}
                focusOnOpenSelector={this.props.focusOnOpenSelector}
                focusOnCloseSelector={this.props.focusOnCloseSelector}
                ariaLabel={this.props.ariaLabel}
                ariaLabelledById={this.props.ariaLabelledById}
                ariaDescribedById={this.props.ariaDescribedById}
                onClose={this.props.onClose}>
                {this.props.children}
                <div className="ModalWithFooter__footer">
                    {this.renderFooterButtons()}
                </div>
            </Modal>
        );
    }
}

export default ModalWithFooter;
