// @flow
import React from 'react';
import ModalHeader from './ModalHeader';
import ModalBody from './ModalBody';
import ModalWithFooter from './ModalWithFooter';
import { injectIntl, FormattedMessage } from 'react-intl';
import type {IntlShape} from 'react-intl';

import type {KeyDef, KeyboardInputScheme, KeyboardInputSchemeName} from './KeyboardInputSchemes';
import {KeyboardInputSchemes, getLabelMessageKeyFromKeyDef, getIconMessageKeyFromKeyDef} from './KeyboardInputSchemes';

import ToggleSwitch from './ToggleSwitch';
import { isAppleDevice } from './Utils';

import { ReactComponent as KeyboardIcon} from './svg/Keyboard.svg'


import './KeyboardInputModal.scss';

type KeyboardInputModalProps = {
    intl: IntlShape,
    keyBindingsEnabled: boolean,
    keyboardInputSchemeName: KeyboardInputSchemeName,
    onChangeKeyBindingsEnabled: Function,
    onChangeKeyboardInputScheme: Function,
    onHide: Function,
    show: boolean
};

type KeyboardInputModalState = {
    keyBindingsEnabled: boolean,
    keyboardInputSchemeName: KeyboardInputSchemeName
}

class KeyboardInputModal extends React.Component<KeyboardInputModalProps, KeyboardInputModalState> {
    static defaultProps = {
        show: false,
        // Istanbul doesn't understand that we test these by passing them in and
        // Don't care about the default functions.
        onChangeKeyBindingsEnabled: /* istanbul ignore next */ () => {},
        onChangeKeyboardInputScheme: /* istanbul ignore next */ () => {},
        onHide: /* istanbul ignore next */ () => {}
    }

    constructor(props: KeyboardInputModalProps) {
        super(props);
        this.state = {
            keyBindingsEnabled: props.keyBindingsEnabled,
            keyboardInputSchemeName: props.keyboardInputSchemeName
        };
    }

    handleChangeKeyboardInputSchemeName = (event: Event) => {
        // $FlowFixMe: Find a more specific event type.
        if (event.target.value) {
            // $FlowFixMe: Figure out how to properly gate this to disallow nonsensical values.
            this.setState({keyboardInputSchemeName: event.target.value});
        }
    }

    handleChangeKeyBindingsEnabled = (keyBindingsEnabled: boolean) => {
        this.setState({keyBindingsEnabled: keyBindingsEnabled});
    }

    cancelChanges = () => {
        this.setState({
            keyBindingsEnabled: this.props.keyBindingsEnabled,
            keyboardInputSchemeName: this.props.keyboardInputSchemeName
        });
        this.props.onHide();
    }

    saveChanges =  () => {
        this.props.onChangeKeyBindingsEnabled(this.state.keyBindingsEnabled);
        this.props.onChangeKeyboardInputScheme(this.state.keyboardInputSchemeName);
        this.props.onHide();
    }

    renderKeyBindings = () => {
        // TODO: Make this configurable and store the options in a separate file.
        // This controls which keys are displayed but also determines the order in which they are displayed.
        const keyBindings = [
            "showHide",
            "addCommandToBeginning",
            "addCommandToEnd",
            "deleteCurrentStep",
            "announceScene",
            "playPauseProgram",
            "refreshScene",
            "stopProgram",
            "decreaseProgramSpeed",
            "increaseProgramSpeed"
        ];

        const keyboardInputScheme: KeyboardInputScheme = KeyboardInputSchemes[this.state.keyboardInputSchemeName];

        const keyBindingElements = [];
        const altSuffix = isAppleDevice() ? "Option" : "Alt";

        keyBindings.forEach((key, index) => {
            const itemKey = "binding-" + index;
            const keyDef: KeyDef = keyboardInputScheme[key].keyDef;
            // This only works for single-step key bindings. If we ever have
            // "sequences" that are not hidden, we will need to write code to
            // display them.
            if (!keyDef.hidden) {
                const labelKeySegments = [];
                const icons  = [];

                const labelMessageKey = getLabelMessageKeyFromKeyDef(keyDef);
                labelKeySegments.push(this.props.intl.formatMessage({ id: labelMessageKey }));

                const iconMessageKey = getIconMessageKeyFromKeyDef(keyDef);
                const singleKeyString = this.props.intl.formatMessage({ id: iconMessageKey});
                icons.push(<div key="unmodified" className="KeyboardInputModal__binding__icon">
                    {singleKeyString}
                </div>);

                if (keyDef.altKey) {
                    const altKeyLabel = this.props.intl.formatMessage(
                        { id: "KeyboardInputModal.KeyLabels." + altSuffix }
                    );
                    labelKeySegments.unshift(altKeyLabel);

                    const altKeyIcon = this.props.intl.formatMessage(
                        { id: "KeyboardInputModal.KeyIcons." + altSuffix }
                    );
                    icons.unshift(<div key="alt-modifier" className="KeyboardInputModal__binding__icon">
                        {altKeyIcon}
                    </div>);
                }

                if (keyDef.ctrlKey) {
                    const controlKeyLabel = this.props.intl.formatMessage(
                        { id: "KeyboardInputModal.KeyLabels.Control" }
                    );
                    labelKeySegments.unshift(controlKeyLabel);

                    const controlKeyIcon = this.props.intl.formatMessage(
                        { id: "KeyboardInputModal.KeyIcons.Control" }
                    );
                    icons.unshift(<div key="ctrl-modifier" className="KeyboardInputModal__binding__icon">
                        {controlKeyIcon}
                    </div>);
                }

                let labelKeyString = labelKeySegments[0];
                if (labelKeySegments.length > 1) {
                    if (labelKeySegments.length > 2) {
                        labelKeyString += ", " + labelKeySegments.slice(1, labelKeySegments.length - 1).join(", ") + ",";
                    }

                    labelKeyString += " and " + labelKeySegments[labelKeySegments.length - 1];
                }

                const descriptionMessageKey = "KeyboardInputModal.Description." + key;
                const descriptionMessageId = "key-binding-description-" + index;
                keyBindingElements.push(<li className="KeyboardInputModal__binding" key={itemKey}>
                    <div className="KeyboardInputModal__binding__keyCombo"  aria-hidden={true}  aria-labelledby={descriptionMessageId}>
                        {icons}
                    </div>
                    <div className="KeyboardInputModal__binding__label" id={descriptionMessageId}>
                        <FormattedMessage
                            className="KeyboardInputModal__binding__label" id={descriptionMessageKey}
                            values={{
                                key: labelKeyString
                            }}
                        />
                    </div>
                </li>);
            }
        });
        return keyBindingElements;
    }

    renderKeyboardSchemeMenu () {
        const altSuffix = isAppleDevice() ? "Option" : "Alt";
        const altKeyLabel = this.props.intl.formatMessage(
            { id: "KeyboardInputModal.KeyLabels." + altSuffix }
        );

        const selectOptionElements = [];
        Object.keys(KeyboardInputSchemes).forEach((schemeName) => {
            const messageId = "KeyboardInputModal.Scheme.Descriptions." + schemeName;
            const optionText = this.props.intl.formatMessage({ id: messageId }, { alt: altKeyLabel });
            selectOptionElements.push(<option key={schemeName} value={schemeName}>
                {optionText}
            </option>);
        })

        return (<select
            className="KeyboardInputModal__content__schemeDropdown"
            value={this.state.keyboardInputSchemeName}
            onChange={this.handleChangeKeyboardInputSchemeName}>
            {selectOptionElements}
        </select>);
    }

    render () {
        const cancelButtonProperties = {
            label: this.props.intl.formatMessage({id: 'KeyboardInputModal.Cancel'}),
            onClick: this.cancelChanges
        };

        const doneButtonProperties = {
            id: 'KeyboardInputModal-done',
            label: this.props.intl.formatMessage({id: 'KeyboardInputModal.Save'}),
            onClick: this.saveChanges,
            isPrimary: true
        };

        return(
            <ModalWithFooter
                ariaLabel={this.props.intl.formatMessage({ id: 'KeyboardInputModal.Title' })}
                onClose={this.cancelChanges}
                show={this.props.show}
                focusOnOpenSelector={'#keyboardInputModal__toggle'}
                focusOnCloseSelector={'.focus-keyboardMenuIcon'}
                buttonProperties={[cancelButtonProperties, doneButtonProperties]}
            >
                <ModalHeader
                    id='KeyboardInputModal'
                    title={this.props.intl.formatMessage({ id: 'KeyboardInputModal.Title' })}>
                    <KeyboardIcon aria-hidden='true'/>
                </ModalHeader>

                <ModalBody>
                    <div className='KeyboardInputModal__content'>
                        <div className="KeyboardInputModal__content__toggleBar">
                            <div className="KeyboardInputModal__content__toggleBar__label">
                                <FormattedMessage id='KeyboardInputModal.Toggle.Label'/>
                            </div>
                            <div className="KeyboardInputModal__content__toggleBar__toggle">
                                <div>
                                    <FormattedMessage id='KeyboardInputModal.Toggle.Off'/>
                                </div>
                                <ToggleSwitch
                                    id='keyboardInputModal__toggle'
                                    ariaLabel={this.props.intl.formatMessage({id: "KeyboardInputModal.Toggle.AriaLabel"})}
                                    className="KeyboardInputModal__content__toggle"
                                    contentsTrue=""
                                    contentsFalse=""
                                    value={this.state.keyBindingsEnabled}
                                    onChange={this.handleChangeKeyBindingsEnabled}
                                />
                                <div>
                                    <FormattedMessage id='KeyboardInputModal.Toggle.On'/>
                                </div>
                            </div>
                        </div>

                        {this.renderKeyboardSchemeMenu()}

                        <ul className="KeyboardInputModal__content__list">
                            {this.renderKeyBindings()}
                        </ul>
                    </div>
                </ModalBody>
            </ModalWithFooter>);
    }

    // Required to avoid a phantom state where we persist the defaults even after they are updated from local storage.
    componentDidUpdate (prevProps: KeyboardInputModalProps) {
        if (prevProps.keyBindingsEnabled !== this.props.keyBindingsEnabled || prevProps.keyboardInputSchemeName !== this.props.keyboardInputSchemeName) {
            this.setState({
                keyBindingsEnabled: this.props.keyBindingsEnabled,
                keyboardInputSchemeName: this.props.keyboardInputSchemeName
            });
        }
    }
}

export default injectIntl(KeyboardInputModal);
