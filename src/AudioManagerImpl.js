// @flow

// $FlowFixMe: We need to add a type definition for more stuff.
import { FMSynth, Panner} from 'tone';
import CharacterState from './CharacterState';
import type {IntlShape} from 'react-intl';
import {AudioManager} from './types';
import SceneDimensions from './SceneDimensions';

import tuning from './tuning.json';
import { Instrument } from 'tone/build/esm/instrument/Instrument';

// We use pentatonic tuning, C D F G A. The "center" note is the highest
// point in the row, all other notes descend from there. Every other row
// is unplayed, so we have tunings for a total of 8 rows.
export function getNoteForState (characterState: CharacterState) : string {
    const noteName = (tuning[characterState.yPos - 1] && tuning[characterState.yPos - 1][characterState.xPos - 1]) || "C-1";
    return noteName;
}

export default class AudioManagerImpl implements AudioManager {
    audioEnabled: boolean;
    announcementsEnabled: boolean;
    panner: Panner;
    orchestra: {
        // $FlowFixMe: we need to add type definitions for yet another thing.
        forward1: Instrument,
        // $FlowFixMe: we need to add type definitions for yet another thing.
        forward2: Instrument,
        // $FlowFixMe: we need to add type definitions for yet another thing.
        forward3: Instrument
    };

    constructor(audioEnabled: boolean, announcementsEnabled: boolean) {
        this.audioEnabled = audioEnabled;
        this.announcementsEnabled = announcementsEnabled;

        this.panner = new Panner();
        this.panner.toDestination();

        const marimba = new FMSynth({
            harmonicity: 8,
            envelope :  {attack:0, decay:0, Sustain:1, Release:1 }
        }).connect(this.panner);

        this.orchestra = {
            "forward1": marimba,
            "forward2": marimba,
            "forward3": marimba
        };

    }

    playAnnouncement(messageIdSuffix: string, intl: IntlShape, messagePayload: any) {
        if (this.announcementsEnabled) {
            if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
                window.speechSynthesis.cancel();
            }
            const messageId = "Announcement." + messageIdSuffix;
            const toAnnounce = intl.formatMessage({ id: messageId}, messagePayload);
            const utterance = new SpeechSynthesisUtterance(toAnnounce);
            window.speechSynthesis.speak(utterance);
        }
    }

    // TODO: Add a better type for pitch.
    // $FlowFixMe: Add a type for instrument.
    playPitchedNote(instrument: Instrument, pitch: string, releaseTime: number) {
        if (this.audioEnabled) {
            instrument.triggerAttackRelease(pitch, releaseTime);
        }
    }

    playSoundForCharacterState(actionKey: string, stepTimeInMs: number, characterState: CharacterState, sceneDimensions: SceneDimensions) {
        // There are no sounds for "even" rows.
        if (this.audioEnabled && (characterState.yPos % 2)) {
            const releaseTime = stepTimeInMs / 4000;
            const noteName = getNoteForState(characterState);

            const instrument = this.orchestra[actionKey];
            if (instrument) {
                this.playPitchedNote(instrument, noteName, releaseTime);
            }

            // Pan left/right to suggest the relative horizontal position.
            // We can discuss adjusting this once we have multiple
            // sound-producing elements in the environment.

            // TODO: Update this to use maxX - minX once the scene properly exposes the minimum width.
            const midPoint = ((sceneDimensions.getWidth() + 1 )/ 2)

            // Limit the deviation from the centre so that there is always some sound in each speaker.
            const panningLevel = 0.65 * ((characterState.xPos - midPoint) / midPoint);

            // TODO: Consider making the timing configurable or tying it to the movement timing.
            this.panner.pan.rampTo(panningLevel, 0);
        }
    }

    setAnnouncementsEnabled(announcementsEnabled: boolean) {
        this.announcementsEnabled = announcementsEnabled;

        if (!announcementsEnabled) {
            if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
                window.speechSynthesis.cancel();
            }
        }
    }

    setAudioEnabled(value: boolean) {
        this.audioEnabled = value;
    }
};
