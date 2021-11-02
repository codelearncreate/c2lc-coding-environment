// @flow

import React from 'react';
import classNames from 'classnames';
import './Modal.scss';

type ModalProps = {
    show: boolean,
    focusElementSelector: string,
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
        this.lastFocus = document.querySelector(this.props.focusElementSelector);
        this.ignoreFocusChanges = false;
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
        try {
            element.focus();
        }
        catch (e) {
            return false;
        }
        this.ignoreFocusChanges = false;
        return (document.activeElement === element);
    };

    handleFocusTrap = (event: Event) => {
        if (this.ignoreFocusChanges) {
            return;
        }
        // Add guard cases to check if properties exist
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
    handleOnPressEscapeKey = (event: Event) => {
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
                onKeyDown={this.handleOnPressEscapeKey}
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
                const focusElement = document.querySelector(this.props.focusElementSelector);
                if (focusElement) {
                    try {
                        focusElement.focus();
                        this.lastFocus = focusElement;
                    } catch (e) {
                        /* eslint-disable no-console */
                        console.log('Modal.componentDidUpdate: Unable to focus focusElement');
                        console.log(e.name);
                        console.log(e.message);
                        /* eslint-enable no-console */
                    }
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
