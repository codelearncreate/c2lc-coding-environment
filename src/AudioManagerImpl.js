// @flow

// $FlowFixMe: We need to add a type definition for more stuff.
import {Filter, FMSynth, Instrument, MembraneSynth, MetalSynth, NoiseSynth, Panner, Reverb, Sequence, Synth, Transport} from 'tone';
import CharacterState from './CharacterState';
import type {IntlShape} from 'react-intl';
import {AudioManager} from './types';
import SceneDimensions from './SceneDimensions';

import tuning from './tuning.json';

// We use pentatonic tuning, C D F G A. The "center" note is the highest
// point in the row, all other notes descend from there. Every other row
// is unplayed, so we have tunings for a total of 8 rows.
export function getNoteForState (characterState: CharacterState) : string {
    const noteName = (tuning[characterState.yPos - 1] && tuning[characterState.yPos - 1][characterState.xPos - 1]) || "C-1";
    return noteName;
}

// TODO: Convert to Array<StepDef> once we have that.
const sequences = {
    forward1:  [{ instrumentKey: "drum", note: "C1"}],
    forward2:  [{ instrumentKey: "drum", note: "C1"}, { instrumentKey: "drum", note: "C4"}],
    forward3:  [{ instrumentKey: "drum", note: "C1"}, { instrumentKey: "drum", note: "C4"}, { instrumentKey: "cymbal", note: "C3"}],
    backward1: [{ instrumentKey: "cymbal", note: "C3"}],
    backward2: [{ instrumentKey: "cymbal", note: "C3"}, { instrumentKey: "drum", note: "C4"}],
    backward3: [{ instrumentKey: "cymbal", note: "C3"}, { instrumentKey: "drum", note: "C4"}, { instrumentKey: "drum", note: "C1"}],
    left45: [{ instrumentKey: "drum", note: "C6"}],
    left90: [{ instrumentKey: "drum", note: "C6"}, { instrumentKey: "drum", note: "C5"}],
    left180: [{ instrumentKey: "drum", note: "C6"}, { instrumentKey: "drum", note: "C5"}, { instrumentKey: "drum", note: "C4"}],
    right45:  [{ instrumentKey: "shaker"}],
    right90:  [{ instrumentKey: "shaker"}, {}, { instrumentKey: "shaker"}],
    right180: [{ instrumentKey: "shaker"}, {}, { instrumentKey: "shaker"}, {}, { instrumentKey: "shaker"}]
};

export default class AudioManagerImpl implements AudioManager {
    audioEnabled: boolean;
    announcementsEnabled: boolean;
    panner: Panner;
    // $FlowFixMe: Add a type for sequence.
    sequence: boolean | Sequence;

    orchestra: {
        // $FlowFixMe: we need to add type definitions for yet another thing.
        bell: Instrument,
        // $FlowFixMe: we need to add type definitions for yet another thing.
        cymbal: Instrument,
        // $FlowFixMe: we need to add type definitions for yet another thing.
        drum: Instrument,
        // $FlowFixMe: we need to add type definitions for yet another thing.
        marimba: Instrument
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

        const highPass = new Filter({
            frequency: 9000, type:"highpass"
        }).connect(this.panner);

        const lowPass = new Filter({
            frequency: 2000, type:"lowpass"
        }).connect(this.panner);

        const bellVerb = new Reverb({
            preDelay:0 , decay:2, wet:0.25
        }).connect(lowPass);

        const bell = new Synth({
            oscillator: {
                type: 'fmsine',
                modulationType: 'sine',
                harmonicity: 2,
                modulationIndex: 8,
            }
        }).connect(bellVerb);

        const drum = new MembraneSynth({
            octaves:4, pitchDecay:0.2
        }).connect(this.panner);

        const otherDrum = new MembraneSynth({
            octaves: 1, pitchDecay: 0.2
        }).connect(this.panner);

        const cymbal = new MetalSynth().connect(lowPass);

        // const feedbackDelay = new FeedbackDelay({
        //     delayTime:0.1, feedback:0.25
        // }).connect(highPass);

        const shaker = new NoiseSynth().connect(highPass);

        this.orchestra = {
            bell: bell,
            cymbal: cymbal,
            drum: drum,
            otherDrum: otherDrum,
            marimba: marimba,
            shaker: shaker
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
        // We only play "positional" sounds when the location (and not
        // orientation) changes.
        const isTurn = ["left45","leftt90","left180", "right45","right90","right180"].indexOf(actionKey) !== -1;

        // There are no "movement" sounds for even rows.
        if (this.audioEnabled) {
            if ((characterState.yPos % 2) && !isTurn) {
                const noteName = getNoteForState(characterState);

                // Use the marimba for the "pitched note".
                const noteDuration = stepTimeInMs / 4000;
                // TODO: We need something more sophisticated here so that we don't
                // need to use the same instrument across the whole range.  We might
                // also choose to use a different instrument per action.
                this.playPitchedNote(this.orchestra.marimba, noteName, noteDuration);
            }

            // Pan left/right to suggest the relative horizontal position.
            // We can discuss adjusting this once we have multiple
            // sound-producing elements in the environment.

            // Limit the deviation from the centre so that there is always some sound in each speaker.
            const midPoint = (sceneDimensions.getMinX() + sceneDimensions.getMaxX()) / 2;
            const panningLevel = 0.75 * ((characterState.xPos - midPoint) / midPoint);

            // TODO: Consider making the timing configurable or tying it to the movement timing.
            this.panner.pan.rampTo(panningLevel, 0);

            const stepTimeInSeconds = stepTimeInMs / 1000;
            this.playSequence(actionKey, stepTimeInSeconds);
        }
    }

    playSequence = (actionKey: string, stepTimeInSeconds: number) => {
        if (this.sequence) {
            // $FlowFixMe: Add a type for sequence.
            this.sequence.stop();
            Transport.stop();
        }

        // $FlowFixMe: Define types for sequences (array of step defs).
        const sequenceDef = sequences[actionKey];
        if (sequenceDef) {
            const fullBeatTime = (stepTimeInSeconds / sequenceDef.length);
            const noteTime = fullBeatTime * 0.5;
            const betweenNoteTime = fullBeatTime - noteTime;
            // $FlowFixMe: Define a type for step definitions.
            const stepCallbackFn = (time: number, stepDef) => {
                if (stepDef.instrumentKey) {
                    const instrument = this.orchestra[stepDef.instrumentKey];
                    // Some Tone synths don't allow a note, so we construct an
                    // array of the common arguments supported by all
                    // synths, i.e. note duration, and start time, and then
                    // choose to add the note if the instrument supports it.
                    const attackReleaseArgs = [noteTime, time];
                    if (stepDef.note) {
                        attackReleaseArgs.unshift(stepDef.note);
                    }

                    instrument.triggerAttackRelease.apply(instrument, attackReleaseArgs);
                }
            };

            this.sequence = new Sequence({
                callback: stepCallbackFn,
                events: sequenceDef,
                subdivision: betweenNoteTime,
                loop: false
            });

            this.sequence.start(0);
            Transport.start();
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
