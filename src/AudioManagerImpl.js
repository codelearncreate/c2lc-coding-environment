// @flow

import { Midi, Panner, Sampler} from 'tone';
import CharacterState from './CharacterState';
import {AudioManager} from './types';
import SceneDimensions from './SceneDimensions';

const SamplerDefs = {
    // The percussion instruments we use actually don't vary their pitch, so we use the same sample at different
    // pitches so that we can scale relative to the octave without ending up with wildy different tempos.
    left45: {
        urls: {
            "C0": "C6.mp3",
            "C1": "C6.mp3",
            "C2": "C6.mp3",
            "C3": "C6.mp3",
            "C4": "C6.mp3",
            "C5": "C6.mp3",
            "C6": "C6.mp3"
        },
        baseUrl: "/audio/left/45/"
    },
    left90: {
        urls: {
            "C0": "C6.mp3",
            "C1": "C6.mp3",
            "C2": "C6.mp3",
            "C3": "C6.mp3",
            "C4": "C6.mp3",
            "C5": "C6.mp3",
            "C6": "C6.mp3"
        },
        baseUrl: "/audio/left/90/"
    },
    left180: {
        urls: {
            "C0": "C6.mp3",
            "C1": "C6.mp3",
            "C2": "C6.mp3",
            "C3": "C6.mp3",
            "C4": "C6.mp3",
            "C5": "C6.mp3",
            "C6": "C6.mp3"
        },
        baseUrl: "/audio/left/180/"
    },
    right45: {
        urls: {
            "C0": "C6.mp3",
            "C1": "C6.mp3",
            "C2": "C6.mp3",
            "C3": "C6.mp3",
            "C4": "C6.mp3",
            "C5": "C6.mp3",
            "C6": "C6.mp3"
        },
        baseUrl: "/audio/right/45/"
    },
    right90: {
        urls: {
            "C0": "C6.mp3",
            "C1": "C6.mp3",
            "C2": "C6.mp3",
            "C3": "C6.mp3",
            "C4": "C6.mp3",
            "C5": "C6.mp3",
            "C6": "C6.mp3"
        },
        baseUrl: "/audio/right/90/"
    },
    right180: {
        urls: {
            "C0": "C6.mp3",
            "C1": "C6.mp3",
            "C2": "C6.mp3",
            "C3": "C6.mp3",
            "C4": "C6.mp3",
            "C5": "C6.mp3",
            "C6": "C6.mp3"
        },
        baseUrl: "/audio/right/180/"
    },
    backward1: {
        urls: {
            "C0": "C0.mp3",
            "C1": "C1.mp3",
            "C2": "C2.mp3",
            "C3": "C3.mp3",
            "C4": "C4.mp3",
            "C5": "C5.mp3",
            "C6": "C6.mp3"
        },
        baseUrl: "/audio/backward/1/"
    },
    backward2: {
        urls: {
            "C0": "C0.mp3",
            "C1": "C1.mp3",
            "C2": "C2.mp3",
            "C3": "C3.mp3",
            "C4": "C4.mp3",
            "C5": "C5.mp3",
            "C6": "C6.mp3"
        },
        baseUrl: "/audio/backward/2/"
    },
    backward3: {
        urls: {
            "C0": "C0.mp3",
            "C1": "C1.mp3",
            "C2": "C2.mp3",
            "C3": "C3.mp3",
            "C4": "C4.mp3",
            "C5": "C5.mp3",
            "C6": "C6.mp3"
        },
        baseUrl: "/audio/backward/3/"
    },
    forward1: {
        urls: {
            "C0": "C0.mp3",
            "C1": "C1.mp3",
            "C2": "C2.mp3",
            "C3": "C3.mp3",
            "C4": "C4.mp3",
            "C5": "C5.mp3",
            "C6": "C6.mp3"
        },
        baseUrl: "/audio/forward/1/"
    },
    forward2: {
        urls: {
            "C0": "C0.mp3",
            "C1": "C1.mp3",
            "C2": "C2.mp3",
            "C3": "C3.mp3",
            "C4": "C4.mp3",
            "C5": "C5.mp3",
            "C6": "C6.mp3"
        },
        baseUrl: "/audio/forward/2/"
    },
    forward3: {
        urls: {
            "C0": "C0.mp3",
            "C1": "C1.mp3",
            "C2": "C2.mp3",
            "C3": "C3.mp3",
            "C4": "C4.mp3",
            "C5": "C5.mp3",
            "C6": "C6.mp3"
        },
        baseUrl: "/audio/forward/3/"
    }
}

function octaveModulo (rawPitch: number) : number {
    const adjustedPitch = rawPitch % 12;
    return adjustedPitch < 0 ? adjustedPitch + 12 : adjustedPitch;
}

// Modified "Tonnetz" tuning, see https://en.wikipedia.org/wiki/Tonnetz for explanation and diagrams.
export function getNoteForState (characterState: CharacterState) : string {
    // Every "column" is 7 tones from the next but stays within the same octave.  This results in a pattern that
    // cycles through the full octave range every 12 squares.
    const xPitchOffset = octaveModulo(7 * characterState.xPos);


    // Every "row" is 4 tones from the next.
    const yPitchOffset = octaveModulo(4 * characterState.yPos);

    const combinedPitchOffset = octaveModulo(xPitchOffset + yPitchOffset);

    // To vary the range of notes without going too high or low, we use the repeating nature of the "row" pattern
    // to divide the tuning into "octave bands" every three rows.  The top band (yPos of 1, 2, or 3) is C5, the bottom
    // band (yPos of 16) is C0.
    const octaveOffset = (Math.floor((characterState.yPos - 1)/ 3));
    const octave = 6 - octaveOffset;

    // const midiNote = (12 * octave);
    const midiNote = combinedPitchOffset + (12 * octave);
    const noteName: string = Midi(midiNote).toNote();

    return noteName;
}

export default class AudioManagerImpl implements AudioManager {
    audioEnabled: boolean;
    announcementsEnabled: boolean;
    feedbackIsPlaying: boolean;
    previousFeedbackUtterance: ?SpeechSynthesisUtterance;
    queuedPreviewAnnouncement: ?string;
    panner: Panner;
    samplers: {
        backward1: Sampler,
        backward2: Sampler,
        backward3: Sampler,
        forward1: Sampler,
        forward2: Sampler,
        forward3: Sampler,
        left45: Sampler,
        left90: Sampler,
        left180: Sampler,
        right45: Sampler,
        right90: Sampler,
        right180: Sampler
    };

    constructor(audioEnabled: boolean, announcementsEnabled: boolean) {
        this.audioEnabled = audioEnabled;
        this.announcementsEnabled = announcementsEnabled;
        this.feedbackIsPlaying = false;
        this.previousFeedbackUtterance = null;
        this.queuedPreviewAnnouncement = null;

        this.panner = new Panner();
        this.panner.toDestination();

        this.samplers = {};

        Object.keys(SamplerDefs).forEach((samplerKey) => {
            const samplerDef = SamplerDefs[samplerKey];
            const sampler = new Sampler(samplerDef);
            sampler.connect(this.panner);
            this.samplers[samplerKey] = sampler;
        });
    }

    playFeedbackAnnouncement(message: string) {
        if (this.announcementsEnabled) {
            if (this.previousFeedbackUtterance) {
                // Remove the event handlers for the previous utterance so that they are not fired when we cancel the existing speech
                this.previousFeedbackUtterance.onerror = null;
                this.previousFeedbackUtterance.onend = null;
            }
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(message);
            utterance.onend = () => {
                this.feedbackIsPlaying = false;
                if (this.queuedPreviewAnnouncement) {
                    const utterance = new SpeechSynthesisUtterance(this.queuedPreviewAnnouncement);
                    window.speechSynthesis.speak(utterance);
                }
                this.queuedPreviewAnnouncement = null;
            }

            // In Safari, utterance onend is often not get fired, and throws an error
            utterance.onerror = () => {
                // When error occurs, onend event is not going to be fired, and currently we are
                // unsure of why the error occurs in Safari. So let the feedback announcement play
                // for a second without interruption on error to somewhat match the onend event handler
                // to provide expected announcement behaviour.
                setTimeout(() => {
                    this.feedbackIsPlaying = false;
                    if (this.queuedPreviewAnnouncement) {
                        const utterance = new SpeechSynthesisUtterance(this.queuedPreviewAnnouncement);
                        window.speechSynthesis.speak(utterance);
                    }
                    this.queuedPreviewAnnouncement = null;
                }, 1000);
            };
            this.previousFeedbackUtterance = utterance;
            this.feedbackIsPlaying = true;
            window.speechSynthesis.speak(utterance);
        }
    }

    playPreviewAnnouncement(message: string) {
        if (!this.feedbackIsPlaying) {
            if (this.announcementsEnabled) {
                window.speechSynthesis.cancel();
                const utterance = new SpeechSynthesisUtterance(message);
                window.speechSynthesis.speak(utterance);
            }
        } else {
            this.queuedPreviewAnnouncement = message;
        }
    }

    // TODO: Add a better type for pitch.
    // TODO: Make this private, as it doesn't respect the audioEnabled setting.
    playPitchedSample(sampler: Sampler, pitch: string, releaseTime: number) {
        if (this.audioEnabled) {
            // We can only play the sound if it's already loaded.
            if (sampler.loaded) {
                sampler.triggerAttackRelease([pitch], releaseTime);
            }
        }
    }

    playSoundForCharacterState(samplerKey: string, releaseTimeInMs: number, characterState: CharacterState, sceneDimensions: SceneDimensions) {
        if (this.audioEnabled) {
            const releaseTime = releaseTimeInMs / 1000;
            const noteName = getNoteForState(characterState);

            const sampler: Sampler = this.samplers[samplerKey];

            this.playPitchedSample(sampler, noteName, releaseTime);

            // Pan left/right to suggest the relative horizontal position.
            // As we use a single Sampler grade, our best option for panning is
            // to pan all sounds.  We can discuss adjusting this once we have
            // multiple sound-producing elements in the environment.

            // Limit the deviation from the centre so that there is always some sound in each speaker.
            const midPoint = (sceneDimensions.getMinX() + sceneDimensions.getMaxX()) / 2;
            const panningLevel = 0.75 * ((characterState.xPos - midPoint) / midPoint);

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
