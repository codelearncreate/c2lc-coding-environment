declare module "tone" {
    // There are two things called "Frequency" in Tone.js
    //
    //       https://tonejs.github.io/docs/14.7.58/type/Frequency
    //       https://tonejs.github.io/docs/14.7.58/fn/Frequency
    // 
    // To avoid confusion, we call the type `FrequencyType` and reserve `Frequency` for the function.
    declare type FrequencyType = string | number;

    // https://tonejs.github.io/docs/14.7.58/FrequencyClass
    declare export class FrequencyClass {
        toMidi: any,
        toNote: any
    }

    declare export function Frequency(value: TimeValue | FrequencyType, units?: string ): FrequencyClass;

    // https://tonejs.github.io/docs/14.7.77/Gain
    declare export function Gain(gain?: number) : ToneAudioNode;

    // https://tonejs.github.io/docs/14.7.58/type/InputNode
    declare type InputNode = ToneAudioNode;

    // https://tonejs.github.io/docs/14.7.58/type/Note
    declare type Note = string;

    // https://tonejs.github.io/docs/14.7.58/Param
    declare interface Param {
        rampTo(value: any, rampTime: Time): void
    }

    // https://tonejs.github.io/docs/14.7.58/Instrument
    declare export class Instrument extends ToneAudioNode {
        triggerAttackRelease (note: Note, time: number): void;
    }

    // https://tonejs.github.io/docs/14.7.58/MidiClass
    declare class MidiClass {
        toMidi(): number,
        toNote(): Note
    }

    // https://tonejs.github.io/docs/14.7.58/fn/Midi
    declare export function Midi(value: Note|number): MidiClass;

    declare export class NoiseSynth extends Instrument {}

    // https://tonejs.github.io/docs/14.7.58/Panner
    declare export class Panner extends ToneAudioNode {
        pan: Param
    }

    // https://tonejs.github.io/docs/14.7.58/Player
    declare export class Player extends Source {
        constructor(url: string): Player,
        loaded: boolean
    }

    // https://tonejs.github.io/docs/14.7.58/interface/SamplerOptions
    declare type SamplerOptions = {
        baseUrl: string,
        urls: SamplesMap
    }

    declare type SamplesMap = {
        [note: string]: string;
    }

    // https://tonejs.github.io/docs/14.7.58/Sampler
    declare export class Sampler extends Instrument {
        constructor(samples: SamplerOptions): Sampler,
        loaded: boolean,
        triggerAttackRelease(notes: FrequencyType | Array<FrequencyType>, duration: Time): void
    }

    // https://tonejs.github.io/docs/14.7.58/type/Seconds
    declare type Seconds = number;

    // https://tonejs.github.io/docs/14.7.77/Sequence
    declare export function Sequence(SequenceOptions) : SequenceType;

    // https://tonejs.github.io/docs/14.7.77/interface/SequenceOptions
    declare type SequenceOptions = {
        events: SequenceEventDescription<T>,
        loop?: boolean,
        subdivision?: Time
    }

    // https://tonejs.github.io/docs/14.7.77/Sequence
    declare export type SequenceType = {
        start(time?: number): void,
        stop(time:? number): void
    }

    // https://tonejs.github.io/docs/14.7.39/fn/start
    declare export function start(): Promise<void>;

    declare export class Synth extends Instrument {
        constructor(SynthOptions): Synth;
    }

    declare type SynthOptions = {
        oscillator: {
            type: string,
            modulationType: string,
            harmonicity: number,
            modulationIndex: number,
        }
    }

    // https://tonejs.github.io/docs/14.7.58/type/Time
    declare type Time = Seconds;

    // https://tonejs.github.io/docs/14.7.58/type/TimeValue
    declare type TimeValue = Time;

    // https://tonejs.github.io/docs/14.7.58/ToneAudioNode
    declare class ToneAudioNode {
        connect(destination: InputNode): void,
        toDestination(): void
    }

    // https://tonejs.github.io/docs/14.7.77/Transport
    declare export class Transport  {
        static start(): void,
        static stop(): void
    }
}
