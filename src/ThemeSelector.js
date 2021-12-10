// @flow

import React from 'react';
import ModalBody from './ModalBody';
import ModalWithFooter from './ModalWithFooter';
import ModalHeader from './ModalHeader';
import { focusByQuerySelector } from './Utils';
import type { ThemeName } from './types';
import type { IntlShape } from 'react-intl';
import { injectIntl, FormattedMessage } from 'react-intl';
import { ReactComponent as ThemeIcon } from './svg/Theme.svg';
import './ThemeSelector.scss';

type ThemeSelectorProps = {
    intl: IntlShape,
    show: boolean,
    currentTheme: ThemeName,
    onSelect: (value: ThemeName) => void,
    onChange: (value: ThemeName) => void
};

type ThemeSelectorStates = {
    themeAtOpen: ThemeName
};

class ThemeSelector extends React.Component<ThemeSelectorProps, ThemeSelectorStates> {
    themeOptions: Array<any>;
    constructor (props: ThemeSelectorProps) {
        super(props);
        this.state = {
            themeAtOpen: props.currentTheme
        };
        this.themeOptions = ['default', 'light', 'dark', 'gray', 'contrast'];
    };

    handleClick = (e: Event) => {
        // $FlowFixMe: value is missing in EventTarget
        this.props.onSelect(e.target.dataset.theme);
    };

    selectPreviousThemeAndFocus = () => {
        const currentIndex = this.themeOptions.indexOf(this.props.currentTheme);
        const previousTheme = currentIndex === 0 ?
            this.themeOptions[this.themeOptions.length - 1] :
            this.themeOptions[currentIndex - 1];
        focusByQuerySelector(`.ThemeSelector__option.${previousTheme}`);
        this.props.onSelect(previousTheme);
    }

    selectNextThemeAndFocus = () => {
        const currentIndex = this.themeOptions.indexOf(this.props.currentTheme);
        const nextTheme = currentIndex === this.themeOptions.length - 1 ?
            this.themeOptions[0] :
            this.themeOptions[currentIndex + 1];
        focusByQuerySelector(`.ThemeSelector__option.${nextTheme}`);
        this.props.onSelect(nextTheme);
    }

    handleKeyDown = (event: KeyboardEvent) => {
        switch(event.key) {
            case('ArrowUp'):
                event.preventDefault();
                this.selectPreviousThemeAndFocus();
                break;
            case('ArrowLeft'):
                event.preventDefault();
                this.selectPreviousThemeAndFocus();
                break;
            case('ArrowDown'):
                event.preventDefault();
                this.selectNextThemeAndFocus();
                break;
            case('ArrowRight'):
                event.preventDefault();
                this.selectNextThemeAndFocus();
                break;
            default: break;
        }
    }

    handleCancel = () => {
        // Reinstate the theme that was active when the dialog was opened
        this.props.onChange(this.state.themeAtOpen);
    }

    handleSave = () => {
        this.props.onChange(this.props.currentTheme);
    };

    renderThemeOptions = () => {
        const themeGroup = [];
        for (const theme of this.themeOptions) {
            const isChecked = this.props.currentTheme === theme;
            themeGroup.push(
                <div
                    role='radio'
                    aria-checked={isChecked}
                    className={`ThemeSelector__option ${theme}`}
                    key={`ThemeSelector__option-${theme}`}
                    data-theme={theme}
                    tabIndex={isChecked ? 0 : -1}
                    onClick={this.handleClick}
                    onKeyDown={this.handleKeyDown}>
                    <input className='ThemeSelector__option-radio' type='radio' name='theme-option' value={theme}
                        aria-hidden={true}
                        checked={isChecked}
                        readOnly={true}
                        tabIndex={-1}/>
                    <FormattedMessage id={`ThemeSelector.option.${theme}`} />
                </div>
            );
        }
        return themeGroup;
    }

    componentDidUpdate(prevProps: ThemeSelectorProps) {
        // When the modal first open up, remember the theme at that time
        if (prevProps.show !== this.props.show && this.props.show) {
            this.setState({
                themeAtOpen: this.props.currentTheme
            });
        }
    }

    render() {
        return (
            <ModalWithFooter
                show={this.props.show}
                focusOnOpenSelector={`.ThemeSelector__option.${this.props.currentTheme}`}
                focusOnCloseSelector='.IconButton.App__header-themeSelectorIcon'
                ariaLabelledById='ThemeSelector'
                onClose={this.handleCancel}
                buttonProperties={[
                    {label: this.props.intl.formatMessage({id: 'ThemeSelector.cancelButton'}), onClick: this.handleCancel},
                    {label: this.props.intl.formatMessage({id: 'ThemeSelector.saveButton'}), onClick: this.handleSave, isPrimary: true}
                ]}>
                <ModalHeader
                    id='ThemeSelector'
                    title={this.props.intl.formatMessage({
                        id: 'ThemeSelector.title'
                    })}>
                    <ThemeIcon aria-hidden='true' />
                </ModalHeader>
                <ModalBody>
                    <div
                        role='radiogroup'
                        className='ThemeSelector__body'>
                        {this.renderThemeOptions()}
                    </div>
                </ModalBody>
            </ModalWithFooter>
        );
    }
}

export default injectIntl(ThemeSelector);
