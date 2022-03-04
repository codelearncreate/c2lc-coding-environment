// @flow

import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, mount } from 'enzyme';
import { IntlProvider } from 'react-intl';
import messages from './messages.json';
import SoundOptionsModal from './SoundOptionsModal';
import ToggleSwitch from './ToggleSwitch';

configure({ adapter: new Adapter() });

const defaultSoundOptionsModalProps = {
    audioEnabled: true,
    announcementsEnabled: true,
    sonificationEnabled: true,
    show: true
};

function createMountSoundOptionsModal(props) {
    const mockOnCancel = jest.fn();
    const mockOnSave = jest.fn();
    const wrapper = mount(
        React.createElement(
            SoundOptionsModal,
            Object.assign(
                {},
                defaultSoundOptionsModalProps,
                {
                    onCancel: mockOnCancel,
                    onChangeSoundOptions: mockOnSave
                },
                props
            )
        ),
        {
            wrappingComponent: IntlProvider,
            wrappingComponentProps: {
                locale: 'en',
                defaultLocale: 'en',
                messages: messages.en
            }
        }
    );

    return {
        wrapper,
        mockOnCancel,
        mockOnSave
    };
}

function getAudioToggleSwitches(wrapper) {
    return wrapper.find(ToggleSwitch);
}

function getAudioToggleSwitchContainer(wrapper) {
    return wrapper.find('.SoundOptions__option-container');
}

function getCancelButton(wrapper) {
    return wrapper.find('.TextButton--secondaryButton');
}

function getSaveButton(wrapper) {
    return wrapper.find('.TextButton--primaryButton');
}

function getWrapperState(wrapper) {
    return wrapper.children().at(0).instance().state;
}

test('When the show property of the modal is changed from false to true, update state of audio options from corresponding properties', () => {
    expect.assertions(6);
    const { wrapper } = createMountSoundOptionsModal({ show: false });
    expect(getWrapperState(wrapper).audioEnabled).toBe(true);
    expect(getWrapperState(wrapper).announcementsEnabled).toBe(true);
    expect(getWrapperState(wrapper).sonificationEnabled).toBe(true);
    wrapper.setProps({
        audioEnabled: false,
        announcementsEnabled: true,
        sonificationEnabled: false,
        show: true
    });
    expect(getWrapperState(wrapper).audioEnabled).toBe(false);
    expect(getWrapperState(wrapper).announcementsEnabled).toBe(true);
    expect(getWrapperState(wrapper).sonificationEnabled).toBe(false);
})

describe('When rendering audio toggles', () => {
    test('Three toggle switches should render in following order: "All Sounds", "Musical Sounds" and "Audio Announcements"', () => {
        expect.assertions(8);
        const { wrapper } = createMountSoundOptionsModal();
        // No options should have disabled class when allSound toggle is on
        expect(wrapper.find('.SoundOptions__option--disabled').length).toBe(0);
        const audioToggleSwitches = getAudioToggleSwitches(wrapper);
        expect(audioToggleSwitches.length).toBe(3);
        expect(audioToggleSwitches.get(0).props.id).toBe('sound-options-allsounds');
        expect(audioToggleSwitches.get(0).props.value).toBe(true);
        expect(audioToggleSwitches.get(1).props.id).toBe('sound-options-musicalSounds');
        expect(audioToggleSwitches.get(1).props.value).toBe(true);
        expect(audioToggleSwitches.get(2).props.id).toBe('sound-options-announcements');
        expect(audioToggleSwitches.get(2).props.value).toBe(true);
    });
    test('When the audioEnabled, announcementsEnabled, and sonificationEnabled properties are false, the corresponding toggle switches should be off', () => {
        expect.assertions(10);
        const { wrapper } = createMountSoundOptionsModal({ audioEnabled: false, announcementsEnabled: false, sonificationEnabled: false });
        // Other options than allSounds should have disabled class when audioEnabled is false
        expect(wrapper.find('.SoundOptions__option--disabled').length).toBe(2);
        const audioToggleSwitches = getAudioToggleSwitches(wrapper);
        expect(audioToggleSwitches.length).toBe(3);
        expect(audioToggleSwitches.get(0).props.id).toBe('sound-options-allsounds');
        expect(audioToggleSwitches.get(0).props.value).toBe(false);
        expect(audioToggleSwitches.get(1).props.id).toBe('sound-options-musicalSounds');
        expect(getAudioToggleSwitchContainer(wrapper).get(1).props.className.includes('SoundOptions__option--disabled')).toBe(true);
        expect(audioToggleSwitches.get(1).props.value).toBe(false);
        expect(audioToggleSwitches.get(2).props.id).toBe('sound-options-announcements');
        expect(getAudioToggleSwitchContainer(wrapper).get(2).props.className.includes('SoundOptions__option--disabled')).toBe(true);
        expect(audioToggleSwitches.get(2).props.value).toBe(false);
    });
});

describe('When interacting with the toggle switches', () => {
    test('Toggling each toggle switch should update the corresponding state value ', () => {
        expect.assertions(12);

        const { wrapper } = createMountSoundOptionsModal();
        expect(getWrapperState(wrapper).audioEnabled).toBe(true);
        expect(getWrapperState(wrapper).sonificationEnabled).toBe(true);
        expect(getWrapperState(wrapper).announcementsEnabled).toBe(true);

        const sonificationToggle = getAudioToggleSwitches(wrapper).at(1);
        sonificationToggle.simulate('click');
        expect(getWrapperState(wrapper).audioEnabled).toBe(true);
        expect(getWrapperState(wrapper).sonificationEnabled).toBe(false);
        expect(getWrapperState(wrapper).announcementsEnabled).toBe(true);

        const announcementsToggle = getAudioToggleSwitches(wrapper).at(2);
        announcementsToggle.simulate('click');
        expect(getWrapperState(wrapper).audioEnabled).toBe(true);
        expect(getWrapperState(wrapper).sonificationEnabled).toBe(false);
        expect(getWrapperState(wrapper).announcementsEnabled).toBe(false);

        const allSoundsToggle = getAudioToggleSwitches(wrapper).at(0);
        allSoundsToggle.simulate('click');
        expect(getWrapperState(wrapper).audioEnabled).toBe(false);
        expect(getWrapperState(wrapper).sonificationEnabled).toBe(false);
        expect(getWrapperState(wrapper).announcementsEnabled).toBe(false);
    });
});

describe('When interacting with footer buttons', () => {
    test('Pressing the cancel button should close the modal without calling the save callback', () => {
        expect.assertions(2);
        const { wrapper, mockOnCancel, mockOnSave } = createMountSoundOptionsModal();
        const cancelButton = getCancelButton(wrapper);
        cancelButton.at(0).simulate('click');
        expect(mockOnCancel.mock.calls.length).toBe(1);
        expect(mockOnSave.mock.calls.length).toBe(0);
    });
    test('Pressing the save button should call the save callback', () => {
        expect.assertions(8);
        const { wrapper, mockOnCancel, mockOnSave } = createMountSoundOptionsModal({
            audioEnabled: true,
            sonificationEnabled: false,
            announcementsEnabled: true
        });

        const sonificationToggle = getAudioToggleSwitches(wrapper).at(1);
        const announcementsToggle = getAudioToggleSwitches(wrapper).at(2);
        sonificationToggle.simulate('click');
        announcementsToggle.simulate('click');

        const expectedAudioEnabled = true;
        const expectedSonificationEnabled = true;
        const expectedAnnouncementsEnabled = false;

        expect(getWrapperState(wrapper).audioEnabled).toBe(expectedAudioEnabled);
        expect(getWrapperState(wrapper).sonificationEnabled).toBe(expectedSonificationEnabled);
        expect(getWrapperState(wrapper).announcementsEnabled).toBe(expectedAnnouncementsEnabled);

        const saveButton = getSaveButton(wrapper);
        saveButton.at(0).simulate('click');

        expect(mockOnSave.mock.calls.length).toBe(1);
        // audioEnabled
        expect(mockOnSave.mock.calls[0][0]).toBe(expectedAudioEnabled);
        // announcementsEnabled
        expect(mockOnSave.mock.calls[0][1]).toBe(expectedAnnouncementsEnabled);
        // sonificationEnabled
        expect(mockOnSave.mock.calls[0][2]).toBe(expectedSonificationEnabled);

        expect(mockOnCancel.mock.calls.length).toBe(0);
    });
});
