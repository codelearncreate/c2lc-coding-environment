// @flow

import React from 'react';
import Modal from './Modal';
import classNames from 'classnames';
import { Button } from 'react-bootstrap';
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
    buttonProperties: Array<{id?: string, label: string, onClick: () => void, isPrimary?: boolean}>
};

class ModalWithFooter extends React.Component<ModalWithFooterProps, {}> {
    renderFooterButtons = () => {
        const footerButtons = [];
        for (const buttonProp of this.props.buttonProperties) {
            const buttonClassName = classNames(
                buttonProp.isPrimary && 'ModalWithFooter__primaryButton',
                !buttonProp.isPrimary && 'ModalWithFooter__secondaryButton'
            );
            footerButtons.push(
                <Button
                    id={buttonProp.id}
                    key={`footerButton-${footerButtons.length}`}
                    className={buttonClassName}
                    onClick={buttonProp.onClick}>
                    {buttonProp.label}
                </Button>
            )
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
