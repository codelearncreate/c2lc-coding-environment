// @flow

import {Panner, Sampler, Sequence, start as ToneStart, Transport} from 'tone';
import CharacterState from './CharacterState';
import type {IntlShape} from 'react-intl';
import {AudioManager} from './types';
import type {CommandName} from './types';
import type {WorldName} from './Worlds';
import SceneDimensions from './SceneDimensions';
import {soundscapes, instrumentDefs} from './Soundscapes';

export default class AudioManagerImpl implements AudioManager {
    announcementsEnabled: boolean;
    audioEnabled: boolean;

    // TODO: Look up flow typing for object properties and make these use an instrument type.
    instruments: {}

    panner: Panner;
    // $FlowFixMe: Add a type for sequence.
    playingSequence: boolean | Sequence;

    worldName: WorldName;

    constructor(audioEnabled: boolean, announcementsEnabled: boolean, worldName: WorldName) {
        this.audioEnabled = audioEnabled;
        this.announcementsEnabled = announcementsEnabled;

        this.panner = new Panner();
        this.panner.toDestination();

        this.worldName = worldName;

        this.instruments = {};

        this.constructSoundscape(worldName);
    }

    constructSoundscape = (worldName: WorldName) => {
        const soundscape = soundscapes[worldName];
        if (soundscape) {
            // Scan the defined sequences and make a note of all instruments used.
            const usedInstrumentMap = {};
            for (const sequence of Object.values(soundscape.sequences)) {
                // $FlowFixMe: Need to add types for all new structures.
                for (const sequenceStep of Object.values(sequence)) {
                    // $FlowFixMe: Need to add types for all new structures.
                    if (sequenceStep.instrumentKey) {
                        usedInstrumentMap[sequenceStep.instrumentKey] = true;
                    }
                }

            }
            for (const instrumentKey of Object.keys(usedInstrumentMap)) {
                // If another world has loaded this instrument, we don't need to.
                if (!this.instruments[instrumentKey]) {
                    // TODO: Evolve this to use a custom class that plays sounds in phases.
                    this.instruments[instrumentKey] = new Sampler(instrumentDefs[instrumentKey]);
                    this.instruments[instrumentKey].connect(this.panner);
                }
            }
        }
    };

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

    playSoundForCharacterState(commandName: CommandName, stepTimeInMs: number, characterState: CharacterState, sceneDimensions: SceneDimensions) {
        const stepTimeInSeconds = stepTimeInMs / 1000;

        if (this.audioEnabled) {
            const soundscape = soundscapes[this.worldName];
            const sequence = soundscape.sequences[commandName];

            // Pan left/right to suggest the relative horizontal position.
            // We can discuss adjusting this once we have multiple
            // sound-producing elements in the environment.

            // Limit the deviation from the centre so that there is always some sound in each speaker.
            const midPoint = (sceneDimensions.getMinX() + sceneDimensions.getMaxX()) / 2;
            const panningLevel = 0.75 * ((characterState.xPos - midPoint) / midPoint);

            // TODO: Consider making the timing configurable or tying it to the movement timing.
            this.panner.pan.rampTo(panningLevel, 0);
            this.playSequence(sequence, characterState, stepTimeInSeconds);
        }
    }

    // $FlowFixMe: Add a type for arrays of stepdefs.
    playSequence = (sequenceDef, characterState: CharacterState, stepTimeInSeconds: number) => {
        if (this.playingSequence) {
            // $FlowFixMe: Add a type for sequence.
            this.playingSequence.stop(0);
            Transport.stop();
        }

        const fullBeatTime = (stepTimeInSeconds / sequenceDef.length);
        const noteTime = fullBeatTime * 0.5;
        const betweenNoteTime = fullBeatTime - noteTime;
        // $FlowFixMe: Define a type for step definitions.
        const stepCallbackFn = (time: number, stepDef) => {
            if (stepDef.instrumentKey) {
                const soundscape = soundscapes[this.worldName];
                const instrument = this.instruments[stepDef.instrumentKey];
                const note = soundscape.getNoteForState(characterState, stepDef.offset);
                if (instrument && instrument.loaded) {
                    instrument.triggerAttackRelease(note, noteTime, time);
                }
            }
        };

        this.playingSequence = new Sequence({
            callback: stepCallbackFn,
            events: sequenceDef,
            subdivision: betweenNoteTime,
            loop: false
        });

        this.playingSequence.start(0);
        Transport.start();
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

    setWorld = (worldName: WorldName) => {
        if (this.worldName !== worldName) {
            this.worldName = worldName;
            this.constructSoundscape(worldName);
        }
    }

    startTone() {
        ToneStart();
    }
};
