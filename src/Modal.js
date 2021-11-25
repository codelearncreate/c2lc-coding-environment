// @flow

import React from 'react';
import classNames from 'classnames';
import './Modal.scss';

// This software or document includes material copied from or derived from
// WAI-ARIA Authoring Practices 1.1 Modal Dialog Example
// https://www.w3.org/TR/wai-aria-practices-1.1/examples/dialog-modal/dialog.html
// Copyright © 2019 W3C® (MIT, ERCIM, Keio, Beihang).
// Source code: https://www.w3.org/TR/wai-aria-practices-1.1/examples/dialog-modal/js/dialog.js
// License: https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document

type ModalProps = {
    show: boolean,
    focusOnOpenSelector: string,
    focusOnCloseSelector: string,
    ariaLabel?: string,
    ariaLabelledById?: string,
    ariaDescribedById?: string,
    children?: any,
    onClose: () => void
};

class Modal extends React.Component<ModalProps, {}> {
    modalRef: { current: null | Element };
    lastFocus: any;
    ignoreFocusChanges: boolean;

    constructor(props: ModalProps) {
        super(props);
        this.modalRef = React.createRef();
        this.lastFocus = document.querySelector(this.props.focusOnOpenSelector);
        this.ignoreFocusChanges = false;
    }

    querySelectorInModal(selectors: string) {
        if (this.modalRef.current) {
            return this.modalRef.current.querySelector(selectors);
        } else {
            return null;
        }
    }

    focusFirstDescendant = (element: any) => {
        for (let i = 0; i < element.childNodes.length; i++) {
            const child = element.childNodes[i];
            if (this.attemptFocus(child) ||
                this.focusFirstDescendant(child)
            ) {
                return true;
            }
        }
        return false;
    };

    focusLastDescendant = (element: any) => {
        for (let i = element.childNodes.length - 1; i >= 0; i--) {
            const child = element.childNodes[i];
            if (this.attemptFocus(child) ||
                this.focusLastDescendant(child)
            ) {
                return true;
            }
        }
        return false;
    };

    attemptFocus = (element: HTMLElement): boolean => {
        this.ignoreFocusChanges = true;
        // $FlowFixMe: properties type and checked is missing in HTMLElement
        if (element.type === 'radio' && !element.checked) {
            return false;
        }
        if (element.focus) {
            element.focus();
        }
        this.ignoreFocusChanges = false;
        return (document.activeElement === element);
    };

    handleFocusTrap = (event: Event) => {
        if (this.ignoreFocusChanges) {
            return;
        }
        if (this.modalRef.current) {
            // $FlowIgnore: EventTarget is incompatible with Node
            if (this.modalRef.current.contains(event.target)) {
                this.lastFocus = event.target;
            } else {
                this.focusFirstDescendant(this.modalRef.current);
                if (this.lastFocus === document.activeElement) {
                    this.focusLastDescendant(this.modalRef.current);
                }
                this.lastFocus = document.activeElement;
            }
        }
    }

    handleOnClose = () => {
        // $FlowFixMe: flow thinks document.body can be null
        document.body.classList.remove('modal-opened');
        this.props.onClose();
    }

    // rename it to be handleKeyDown
    handleKeyDown = (event: Event) => {
        // $FlowFixMe: flow doesn't know key property
        if (event.key === 'Escape') {
            this.handleOnClose();
        } else {
            // Ignore all other key presses than the escape key to prevent
            // keyboard shortcuts to be fired
            // $FlowFixMe event target doesn't know nativeEvent
            event.nativeEvent.stopImmediatePropagation();
        }
    }

    handleOnClickBackdrop = (event: Event) => {
        if (this.modalRef.current) {
            // $FlowIgnore: EventTarget is incompatible with Node
            if (!this.modalRef.current.contains(event.target)) {
                this.handleOnClose();
            }
        }
    }

    render() {
        const containerClass = classNames(
            'Modal__container',
            this.props.show && 'active'
        );
        return (
            <div
                className={containerClass}
                onFocus={this.handleFocusTrap}
                onKeyDown={this.handleKeyDown}
                onClick={this.handleOnClickBackdrop}>
                <div className='Modal__focusTrap' tabIndex='0' />
                <div
                    ref={this.modalRef}
                    className="Modal"
                    role='dialog'
                    aria-label={this.props.ariaLabel}
                    aria-labelledby={this.props.ariaLabelledById}
                    aria-describedby={this.props.ariaDescribedById}
                    aria-modal='true'>
                    {this.props.children}
                </div>
                <div className='Modal__focusTrap' tabIndex='0' />
            </div>
        );
    }

    componentDidUpdate(prevProps: ModalProps) {
        if (this.props.show !== prevProps.show) {
            if (this.props.show) {
                // $FlowFixMe: flow thinks document.body can be null
                document.body.classList.add('modal-opened');
                const focusElement = this.querySelectorInModal(this.props.focusOnOpenSelector);
                if (focusElement && focusElement.focus) {
                    // When using VoiceOver in Chrome browser, setting focus on componentDidUpdate
                    // makes VoiceOver navigation stuck. Using setTimeout to detach setting focus from
                    // componentDidUpdate appears to work around the issue.
                    setTimeout(() => {
                        focusElement.focus();
                        this.lastFocus = focusElement;
                    }, 0);
                } else {
                    /* eslint-disable no-console */
                    console.log('Modal.componentDidUpdate: Focus first focusable element');
                    /* eslint-enable no-console */
                    this.focusFirstDescendant(this.modalRef.current);
                }
            } else {
                const focusElementOnClose = document.querySelector(this.props.focusOnCloseSelector);
                if (focusElementOnClose) {
                    focusElementOnClose.focus();
                }
            }
        }
    }
}

export default Modal;
