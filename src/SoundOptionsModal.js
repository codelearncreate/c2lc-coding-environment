// @flow

import React from 'react';
import classNames from 'classnames';
import ModalBody from './ModalBody';
import ModalHeader from './ModalHeader';
import ModalWithFooter from './ModalWithFooter';
import ToggleSwitch from './ToggleSwitch';
import { injectIntl } from 'react-intl';
import type {IntlShape} from 'react-intl';
import { ReactComponent as AudioIcon } from './svg/AudioOn.svg';
import './SoundOptionsModal.scss';

type SoundOptionsModalProps = {
    intl: IntlShape,
    audioEnabled: boolean,
    announcementsEnabled: boolean,
    sonificationEnabled: boolean,
    show: boolean,
    onCancel: () => void,
    onChangeSoundOptions: ( audioEnabled: boolean, announcementsEnabled: boolean, sonificationEnabled: boolean ) => void
};

type SoundOptionsModalState = {
    audioEnabled: boolean,
    announcementsEnabled: boolean,
    sonificationEnabled: boolean
};

class SoundOptionsModal extends React.Component<SoundOptionsModalProps, SoundOptionsModalState> {
    constructor (props: SoundOptionsModalProps) {
        super(props);
        this.state = {
            audioEnabled: this.props.audioEnabled,
            announcementsEnabled: this.props.announcementsEnabled,
            sonificationEnabled: this.props.sonificationEnabled
        };
    };

    handleToggleAudioEnabled = (value: boolean) => {
        this.setState({ audioEnabled: value });
    };

    handleToggleAnnouncementsEnabled = (value: boolean) => {
        this.setState({ announcementsEnabled: value });
    };

    handleToggleSonificationEnabled = (value: boolean) => {
        this.setState({ sonificationEnabled: value });
    };

    handleOnSave = () => {
        this.props.onChangeSoundOptions(this.state.audioEnabled, this.state.announcementsEnabled, this.state.sonificationEnabled );
    }

    handleOnCancel = () => {
        this.props.onCancel();
    }

    renderSoundOptions = () => {
        const soundOptions = [];
        const soundOptionsProps = [
            {
                id:'sound-options-allsounds',
                label: this.props.intl.formatMessage({ id: 'SoundOptionsModal.allSounds' }),
                toggleState: this.state.audioEnabled,
                onChange: this.handleToggleAudioEnabled
            },
            {
                id:'sound-options-musicalSounds',
                label: this.props.intl.formatMessage({ id: 'SoundOptionsModal.musicalSounds' }),
                toggleState: this.state.sonificationEnabled,
                onChange: this.handleToggleSonificationEnabled
            },
            {
                id:'sound-options-announcements',
                label: this.props.intl.formatMessage({ id: 'SoundOptionsModal.announcements' }),
                toggleState: this.state.announcementsEnabled,
                onChange: this.handleToggleAnnouncementsEnabled
            }
        ];

        for (let i=0; i< soundOptionsProps.length; i++) {
            const soundOptionProps = soundOptionsProps[i];
            const isDisabled = soundOptionProps.id !== 'sound-options-allsounds' && !this.state.audioEnabled;
            const optionContainerClassName = classNames(
                'SoundOptions__option-container',
                isDisabled && 'SoundOptions__option--disabled'
            )
            soundOptions.push(
                <div className={optionContainerClassName} key={soundOptionProps.id}>
                    <div aria-hidden={true}>
                        {soundOptionProps.label}
                    </div>
                    <div className='SoundOptions__toggle-container'>
                        <div aria-hidden={true}>
                            {this.props.intl.formatMessage({ id: 'SoundOptionsModal.toggleOff' })}
                        </div>
                        <ToggleSwitch
                            disabled={isDisabled}
                            className='SoundOptionsToggle'
                            id={soundOptionProps.id}
                            ariaLabel={soundOptionProps.label}
                            value={soundOptionProps.toggleState}
                            contentsTrue={null}
                            contentsFalse={null}
                            onChange={soundOptionProps.onChange}
                        />
                        <div aria-hidden={true}>
                            {this.props.intl.formatMessage({ id: 'SoundOptionsModal.toggleOn' })}
                        </div>
                    </div>
                </div>
            )
        }
        return soundOptions;
    }

    render() {
        return (
            <ModalWithFooter
                show={this.props.show}
                focusOnOpenSelector={'#sound-options-allsounds'}
                focusOnCloseSelector={'.App__header-soundOptions'}
                ariaLabelledById={'SoundOptionsModal'}
                onClose={this.handleOnCancel}
                buttonProperties={
                    [
                        {label: this.props.intl.formatMessage({id: 'SoundOptionsModal.cancelButton'}), onClick: this.handleOnCancel},
                        {id: 'SoundOptionsModal-save', label: this.props.intl.formatMessage({id: 'SoundOptionsModal.saveButton'}), onClick: this.handleOnSave, isPrimary: true}
                    ]
                }>
                <ModalHeader
                    id='SoundOptionsModal'
                    title={this.props.intl.formatMessage({
                        id: 'SoundOptionsModal.title'
                    })}>
                    <AudioIcon aria-hidden='true' />
                </ModalHeader>
                <ModalBody>
                    <div className='SoundOptionsModal__body'>
                        {this.renderSoundOptions()}
                    </div>
                </ModalBody>
            </ModalWithFooter>
        );
    }

    componentDidUpdate(prevProps: SoundOptionsModalProps) {
        if (prevProps.show !== this.props.show && this.props.show) {
            this.setState({
                audioEnabled: this.props.audioEnabled,
                announcementsEnabled: this.props.announcementsEnabled,
                sonificationEnabled: this.props.sonificationEnabled
            });
        }
    }
}

export default injectIntl(SoundOptionsModal);
