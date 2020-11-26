declare module "tone" {
    // https://tonejs.github.io/docs/14.7.39/fn/start
    declare export function start(): Promise<void>;

    // There are two things called "Frequency" in Tone.js
    //
    //       https://tonejs.github.io/docs/14.7.58/type/Frequency
    //       https://tonejs.github.io/docs/14.7.58/fn/Frequency
    // 
    // To avoid confusion, we call the type `FrequencyType` and reserve `Frequency` for the function.
    declare type FrequencyType = string;

    // https://tonejs.github.io/docs/14.7.58/FrequencyClass
    declare export class FrequencyClass {
        toMidi: any
    }

    declare export function Frequency(value: TimeValue | FrequencyType ): FrequencyClass;
    
    // https://tonejs.github.io/docs/14.7.58/type/InputNode
    declare type InputNode = ToneAudioNode;

    // https://tonejs.github.io/docs/14.7.58/type/Note
    declare type Note = string;

    // https://tonejs.github.io/docs/14.7.58/type/Seconds
    declare type Seconds = number;

    // https://tonejs.github.io/docs/14.7.58/type/Time
    declare type Time = Seconds;

    // https://tonejs.github.io/docs/14.7.58/type/TimeValue
    declare type TimeValue = Time;

    // https://tonejs.github.io/docs/14.7.58/Param
    declare interface Param {
        rampTo(value: any, rampTime: Time): void
    }

    // https://tonejs.github.io/docs/14.7.58/Instrument
    declare class Instrument extends ToneAudioNode {
    }

    // https://tonejs.github.io/docs/14.7.58/MidiClass
    declare class MidiClass {
        toNote(): Note
    }

    // https://tonejs.github.io/docs/14.7.58/fn/Midi
    declare export function Midi(value: TimeValue): MidiClass;

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
        triggerAttackRelease(notes: Array<FrequencyType>, duration: Time): void
    }

    // https://tonejs.github.io/docs/14.7.58/Source
    declare class Source extends ToneAudioNode {
        start(): void
    }

    // https://tonejs.github.io/docs/14.7.58/ToneAudioNode
    declare class ToneAudioNode {
        connect(destination: InputNode): void,
        toDestination(): void
    }
}
