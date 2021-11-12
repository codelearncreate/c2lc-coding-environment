// @flow
import { focusByQuerySelector } from "./Utils";

const tabKey = 'Tab';
const escKey = 'Escape';

export default class FocusTrapManager {
    active: boolean;
    onFocusTrapClosed: () => void;
    elementSelectors: Array<string>;
    returnElementSelector: string | null;

    constructor() {
        this.active = false;
        this.onFocusTrapClosed = () => {};
        this.elementSelectors = [];
        this.returnElementSelector = null;
    }

    setFocusTrap(onFocusTrapClosed: () => void, elementSelectors: Array<string>, returnElementSelector: ?string) {
        this.active = true;
        this.onFocusTrapClosed = onFocusTrapClosed;
        this.elementSelectors = elementSelectors;
        this.returnElementSelector = returnElementSelector ? returnElementSelector : null;
    }

    unsetFocusTrap() {
        this.active = false;
        this.onFocusTrapClosed = () => {};
        this.elementSelectors = [];
        this.returnElementSelector = null;
    }

    handleKeyDown = (e: SyntheticKeyboardEvent<HTMLInputElement>) => {
        if (this.active) {
            if (e.key === tabKey) {
                // Find the elements in our focus trap
                const elements: Array<HTMLElement> = [];
                for (const elementSelector of this.elementSelectors) {
                    Array.prototype.push.apply(elements, document.querySelectorAll(elementSelector));
                }
                // Is document.activeElement in our focus trap?
                const index = elements.indexOf(document.activeElement);
                if (index !== -1) {
                    // document.activeElement is in the focus trap
                    e.preventDefault();
                    if (e.shiftKey) {
                        // Backwards
                        if (index === 0) {
                            elements[elements.length - 1].focus();
                        } else {
                            elements[index - 1].focus();
                        }
                    } else {
                        // Forwards
                        if (index === (elements.length - 1)) {
                            elements[0].focus();
                        } else {
                            elements[index + 1].focus();
                        }
                    }
                }
            } else if (e.key === escKey) {
                e.preventDefault();
                this.onFocusTrapClosed();
                if (this.returnElementSelector) {
                    focusByQuerySelector(this.returnElementSelector);
                }
            }
        }
    }
};
