// @flow
import CharacterState from './CharacterState';
import type {IntlShape} from 'react-intl';
import SceneDimensions from './SceneDimensions';

export type CommandName =
    'forward1' | 'forward2' | 'forward3' |
    'backward1' | 'backward2' | 'backward3' |
    'left45' | 'left90' | 'left180' |
    'right45' | 'right90' | 'right180';

export type DeviceConnectionStatus = 'notConnected' | 'connecting' | 'connected';

export type EditorMode = 'text' | 'block';

/*

    These theme names are shorthand for:

    "mixed"    => A mixture of light and dark elements, with colour.
    "light"    => A light theme, with colour.
    "dark"     => A dark theme, with colour.
    "gray"     => A grayscale theme, without colour.
    "contrast" => A high-contrast black and white theme.

*/
export type ThemeName = 'mixed' | 'light' | 'dark' | 'gray' | 'contrast';

export type WorldName = 'default' | 'forest' | 'space';

export type Program = Array<string>;

// use running, paused, stopped
export type RunningState = 'running' | 'stopRequested' | 'stopped' | 'pauseRequested' | 'paused';

export interface RobotDriver {
    connect(onDisconnected: () => void): Promise<void>;
    forward(): Promise<void>;
    left(): Promise<void>;
    right(): Promise<void>;
};

// Flow lacks its own types for the Speech Recognition API, so we define our own
// TODO: remove when https://github.com/facebook/flow/issues/7361 is resolved.

export type ArrayLike<T> = {
    length: number,
    item: (number:number) => T
};

// TODO: Discuss how far to go in mocking this up.
export type AudioContext = any;

export interface AudioManager {
    playAnnouncement(messageIdSuffix: string, intl: IntlShape, messagePayload?: any) : void;
    playSoundForCharacterState(samplerKey: string, releaseTimeInMs: number, characterState: CharacterState, sceneDimension: SceneDimensions) : void;
    setAnnouncementsEnabled(value: boolean) : void;
    setAudioEnabled(value: boolean) : void;
    startTone(): void;
}

// https://developer.mozilla.org/en-US/docs/Web/API/SpeechGrammar
export type SpeechGrammar = {
    src: string,
    weight: number
};

// https://developer.mozilla.org/en-US/docs/Web/API/SpeechGrammarList
export type SpeechGrammarList = ArrayLike<SpeechGrammar> & {
    addFromURI: (string:string) => null,
    addFromString: (string:string) => null
};

// https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognitionAlternative
export type SpeechRecognitionAlternative = {
    transcript: string,
    confidence: number
};

// https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognitionResult
export type SpeechRecognitionResult = ArrayLike<SpeechRecognitionAlternative> & {
    isFinal: boolean
};

// https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognitionResultList
export type SpeechRecognitionResultsList = ArrayLike<SpeechRecognitionResult>;

// https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognitionEvent
export type SpeechRecognitionEvent = {
    emma?: string,
    interpretation?: string,
    resultIndex: number,
    results: SpeechRecognitionResultsList
};

// https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition
export type SpeechRecognition = {
    // props
    grammars: SpeechGrammarList,
    lang: string,
    continuous: boolean,
    interimResults: boolean,
    maxAlternatives: number,
    serviceURI: string,

    // methods
    // TODO: Add inherited methods from the parent interface, EventTarget.
    abort: () => null,
    start: () => null,
    stop: () => SpeechRecognitionResult,

    // Event handling methods
    onresult: (SpeechRecognitionEvent) => null
    // TODO: Add remaining supported events.
    //       https://developer.mozilla.org/docs/Web/API/SpeechRecognition#Events
};

export type ActionToggleRegister = {
    backward1?: boolean,
    backward2?: boolean,
    backward3?: boolean,
    forward1?: boolean,
    forward2?: boolean,
    forward3?: boolean,
    left45?: boolean,
    left90?: boolean,
    left180?: boolean,
    right45?: boolean,
    right90?: boolean,
    right180?: boolean
};
