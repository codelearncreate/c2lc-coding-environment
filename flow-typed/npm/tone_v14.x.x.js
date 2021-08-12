import { Filter } from "tone";
import { Effect } from "tone/build/esm/effect/Effect";

declare module "tone" {
    // https://github.com/Tonejs/Tone.js/blob/053b5d4397b595ea804b5d6baf6108158c8e0696/Tone/component/filter/BiquadFilter.ts#L117
    declare type BiquadFilterType =
        "lowpass" | "highpass" | "bandpass" | "lowshelf" | "highshelf" | "notch"
        | "allpass" | "peaking";

    // https://tonejs.github.io/docs/14.7.77/interface/EnvelopeOptions
    declare type EnvelopeOptions = {
        attack : Time,
        decay : Time,
        release : Time,
        sustain : NormalRange
    }

    // https://tonejs.github.io/docs/14.7.77/FMSynth
    declare export function FMSynth (FMSynthOptions) : ToneAudioNode;

    // https://tonejs.github.io/docs/14.7.77/interface/FMSynthOptions
    declare type FMSynthOptions = {
        harmonicity: number,
        envelope: EnvelopeOptions
    }

    // https://tonejs.github.io/docs/14.7.77/Filter
    declare export class Filter extends ToneAudioNode {
        frequency: FrequencyType;
        constructor(FilterOptions): Filter;
    }

    // https://tonejs.github.io/docs/14.7.77/type/FilterOptions
    declare type FilterOptions = {
        frequency?: FrequencyType,
        type?: BiquadFilterType,
        rolloff?: FilterRollOff
    }

    // https://tonejs.github.io/docs/14.7.77/type/FilterRollOff
    declare type FilterRollOff = -12 | -24 | -48 | -96;

    // There are two things called "Frequency" in Tone.js
    //
    //       https://tonejs.github.io/docs/14.7.58/type/Frequency
    //       https://tonejs.github.io/docs/14.7.58/fn/Frequency
    // 
    // To avoid confusion, we call the type `FrequencyType` and reserve `Frequency` for the function.
    declare type FrequencyType = string | number;

    // https://tonejs.github.io/docs/14.7.58/FrequencyClass
    declare export class FrequencyClass {
        toMidi: any
    }

    declare export function Frequency(value: TimeValue | FrequencyType ): FrequencyClass;

    // https://tonejs.github.io/docs/14.7.77/Gain
    declare export function Gain(gain?: number) : ToneAudioNode;

    // https://tonejs.github.io/docs/14.7.58/type/InputNode
    declare type InputNode = ToneAudioNode;

    // https://tonejs.github.io/docs/14.7.77/Noise
    declare export class Noise extends ToneAudioNode {
        constructor(NoiseOptions): Noise;
        start(time?: number|string): void;
        stop(time:? number|string): void;
    }

    // https://tonejs.github.io/docs/14.7.77/interface/NoiseOptions
    declare type NoiseOptions = {
        type: NoiseType
    }

    // https://tonejs.github.io/docs/14.7.77/type/NoiseType
    declare type NoiseType = "white" | "brown" | "pink";

    // https://tonejs.github.io/docs/14.7.58/type/Note
    declare type Note = string;

    // https://tonejs.github.io/docs/14.7.58/Param
    declare interface Param {
        rampTo(value: any, rampTime: Time): void
    }

    // https://tonejs.github.io/docs/14.7.58/Instrument
    declare export class Instrument extends ToneAudioNode {
        triggerAttackRelease (note: Note, time?: number): void;
    }

    declare export class MembraneSynth extends Instrument {
        constructor(MembraneSynthOptions) : MembraneSynth
    }

    declare type MembraneSynthOptions =  {
        octaves: number,
        pitchDecay: number
    }

    declare export class MetalSynth extends Instrument {}

    // https://tonejs.github.io/docs/14.7.58/MidiClass
    declare class MidiClass {
        toNote(): Note
    }

    // https://tonejs.github.io/docs/14.7.58/fn/Midi
    declare export function Midi(value: TimeValue): MidiClass;

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

    // https://tonejs.github.io/docs/14.7.77/Reverb
    declare export class Reverb extends ToneAudioNode {
        constructor(ReverbOptions): Reverb;
    }

    // https://tonejs.github.io/docs/14.7.77/interface/ReverbOptions
    declare type ReverbOptions = {
        decay : Seconds,
        preDelay : Seconds,
        wet : NormalRange
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

    // https://tonejs.github.io/docs/14.7.77/Signal
    declare export class Signal extends ToneAudioNode {
        constructor(options: SignalOptions): Signal;
        rampTo(value: any, rampTime: Time): void;
    }

    // https://tonejs.github.io/docs/14.7.77/interface/SignalOptions
    declare type SignalOptions = {
        units: FrequencyType,
        value: number
    }

    // https://tonejs.github.io/docs/14.7.58/Source
    declare class Source extends ToneAudioNode {
        start(): void
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
