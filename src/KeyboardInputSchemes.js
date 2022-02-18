//@flow
import {overlayModifierKeys} from './Utils';

export type KeyboardInputSchemeName = "controlshift" | "controlalt" | "alt";

export function isKeyboardInputSchemeName(str: ?string): boolean {
    return str === 'controlalt' || str === 'alt' || str === 'controlshift';
}

export type KeyDef = {
    code?: string,
    key?: string,
    altKey?: boolean,
    ctrlKey?: boolean,
    shiftKey?: boolean,
    hidden?: boolean
};

export type ActionName =
    // Single Key Commands
    | "addCommand"
    | "addCommandToBeginning"
    | "addCommandToEnd"
    | "deleteCurrentStep"
    | "announceScene"
    | "decreaseProgramSpeed"
    | "increaseProgramSpeed"
    | "playPauseProgram"
    | "refreshScene"
    | "showHide"
    | "stopProgram"
    | "toggleFeedbackAnnouncements"

    // Select Command Sequences
    | "selectForward1"
    | "selectForward2"
    | "selectForward3"
    | "selectBackward1"
    | "selectBackward2"
    | "selectBackward3"
    | "selectLeft45"
    | "selectLeft90"
    | "selectLeft180"
    | "selectRight45"
    | "selectRight90"
    | "selectRight180"

    // Focus Sequences
    | "focusActions"
    | "focusAppHeader"
    | "focusAddNodeToggle"
    | "focusCharacterPositionControls"
    | "focusCharacterColumnInput"
    | "focusCharacterRowInput"
    | "focusPlayShare"
    | "focusProgramSequence"
    | "focusScene"
    | "focusWorldSelector"

    // Character Position Sequences
    | "moveCharacterLeft"
    | "moveCharacterRight"
    | "moveCharacterUp"
    | "moveCharacterDown"
    | "turnCharacterLeft"
    | "turnCharacterRight"

    // Change Theme
    | "changeToDefaultTheme"
    | "changeToLightTheme"
    | "changeToDarkTheme"
    | "changeToGrayscaleTheme"
    | "changeToHighContrastTheme"

    // Update Program
    | "deleteAll"
    ;

export type ActionKeyStep = {
    actionName: ActionName,
    keyDef: KeyDef
};

export type KeySequenceStep = {
    keyDef: KeyDef,
    [subDefKey: string]: KeySequenceStep | ActionKeyStep
};

export type KeyboardInputScheme = {
    [subDefKey: string]: KeySequenceStep | ActionKeyStep
};

export type KeyboardInputSchemesType = {
    "controlshift": KeyboardInputScheme,
    "controlalt": KeyboardInputScheme,
    "alt":  KeyboardInputScheme
};

const BaseKeyboardSequences: KeyboardInputScheme = {
    addCommand: {
        keyDef: { code: "KeyA", key: "a"},
        actionName: "addCommand"
    },
    addCommandToBeginning: {
        keyDef: { code: "KeyB", key: "b"},
        actionName: "addCommandToBeginning"
    },
    addCommandToEnd: {
        keyDef: { code: "KeyE", key: "e"},
        actionName: "addCommandToEnd"
    },
    deleteCurrentStep: {
        keyDef: { code: "KeyD", key: "d"},
        actionName: "deleteCurrentStep"
    },
    announceScene: {
        keyDef: { code: "KeyI", key: "i"},
        actionName: "announceScene"
    },
    decreaseProgramSpeed: {
        keyDef: { key: "<", hidden: true},
        actionName: "decreaseProgramSpeed"
    },
    increaseProgramSpeed: {
        keyDef: { key: ">", hidden: true},
        actionName: "increaseProgramSpeed"
    },
    playPauseProgram: {
        keyDef: { code: "KeyP", key: "p"},
        actionName: "playPauseProgram"
    },
    refreshScene: {
        keyDef: { code: "KeyR", key: "r"},
        actionName: "refreshScene"
    },
    showHide: {
        keyDef: { key: "?"},
        actionName: "showHide"
    },
    stopProgram: {
        keyDef: { code: "KeyS", key: "s"},
        actionName: "stopProgram"
    },
    extraSettings: {
        keyDef: { code: "KeyX", key: "x"},
        audioFeedback: {
            keyDef: { code: "KeyX", key: "x"},
            actionName: "toggleFeedbackAnnouncements"
        },
        focusChange: {
            keyDef: {
                code: "KeyF",
                key: "f"
            },
            actions: {
                keyDef: { code: "KeyA", key: "a" },
                actionName: "focusActions"
            },
            appHeader: {
                keyDef: { code: "KeyH", key: "h" },
                actionName: "focusAppHeader"
            },
            addNodeToggle: {
                keyDef: { code: "KeyT", key: "t" },
                actionName: "focusAddNodeToggle"
            },
            characterPositionControls: {
                keyDef: { code: "KeyC", key: "c" },
                actionName: "focusCharacterPositionControls"
            },
            characterPositionColumnInput: {
                keyDef: { code: "KeyX", key: "x" },
                actionName: "focusCharacterColumnInput"
            },
            characterPositionRowInput: {
                keyDef: { code: "KeyX", key: "y" },
                actionName: "focusCharacterRowInput"
            },
            playShare: {
                keyDef: { code: "KeyP", key: "p" },
                actionName: "focusPlayShare"
            },
            programSequence: {
                keyDef: { code: "KeyQ", key: "q" },
                actionName: "focusProgramSequence"
            },
            scene: {
                keyDef: { code: "KeyS", key: "s" },
                actionName: "focusScene"
            },
            worldSelector: {
                keyDef: { code: "KeyW", key: "w" },
                actionName: "focusWorldSelector"
            }
        },

        selectedActionChange: {
            keyDef: { code: "KeyA", key: "a" },
            forward: {
                keyDef: { code: "KeyF", key: "f" },
                forward1: {
                    keyDef: { key: "1", keyCode: "49"},
                    actionName: "selectForward1"
                },
                forward2: {
                    keyDef: { key: "2", keyCode: "50"},
                    actionName: "selectForward2"
                },
                forward3: {
                    keyDef: { key: "3", keyCode: "51"},
                    actionName: "selectForward3"
                }
            },
            backward: {
                keyDef: { code: "KeyB", key: "b" },
                backward1: {
                    keyDef: { key: "1", keyCode: "49"},
                    actionName: "selectBackward1"
                },
                backward2: {
                    keyDef: { key: "2", keyCode: "50"},
                    actionName: "selectBackward2"
                },
                backward3: {
                    keyDef: { key: "3", keyCode: "51"},
                    actionName: "selectBackward3"
                }
            },
            left: {
                keyDef: { code: "KeyL", key: "l" },
                left45: {
                    keyDef: { key: "1", keyCode: "49"},
                    actionName: "selectLeft45"
                },
                left90: {
                    keyDef: { key: "2", keyCode: "50"},
                    actionName: "selectLeft90"
                },
                left180: {
                    keyDef: { key: "3", keyCode: "51"},
                    actionName: "selectLeft180"
                }
            },
            right: {
                keyDef: { code: "KeyR", key: "r" },
                right45: {
                    keyDef: { key: "1", keyCode: "49"},
                    actionName: "selectRight45"
                },
                right90: {
                    keyDef: { key: "2", keyCode: "50"},
                    actionName: "selectRight90"
                },
                right180: {
                    keyDef: { key: "3", keyCode: "51"},
                    actionName: "selectRight180"
                }
            }
        },

        characterPosition: {
            keyDef: { code: "KeyC", key: "c" },
            move: {
                keyDef: { code: "KeyM", key: "m" },
                left: {
                    keyDef: { code: "KeyL", key: "l" },
                    actionName: "moveCharacterLeft"
                },
                right: {
                    keyDef: { code: "KeyR", key: "r" },
                    actionName: "moveCharacterRight"
                },
                up: {
                    keyDef: { code: "KeyU", key: "u" },
                    actionName: "moveCharacterUp"
                },
                down: {
                    keyDef: { code: "KeyD", key: "d" },
                    actionName: "moveCharacterDown"
                }
            },
            turn: {
                keyDef: { code: "KeyT", key: "t" },
                left: {
                    keyDef: { code: "KeyL", key: "l" },
                    actionName: "turnCharacterLeft"
                },
                right: {
                    keyDef: { code: "KeyR", key: "r" },
                    actionName: "turnCharacterRight"
                }
            }
        },

        changeTheme: {
            keyDef: { code: "KeyT", key: "t" },
            default: {
                keyDef: { key: "1", keyCode: "49"},
                actionName: "changeToDefaultTheme"
            },
            light: {
                keyDef: { key: "2", keyCode: "50"},
                actionName: "changeToLightTheme"
            },
            dark: {
                keyDef: { key: "3", keyCode: "51"},
                actionName: "changeToDarkTheme"
            },
            grayscale: {
                keyDef: { key: "4", keyCode: "52"},
                actionName: "changeToGrayscaleTheme"
            },
            highContrast: {
                keyDef: { key: "5", keyCode: "53"},
                actionName: "changeToHighContrastTheme"
            }
        },

        deleteAll: {
            keyDef: { code: "KeyD", key: "d" },
            actionName: "deleteAll"
        }
    }
}

const AltInputScheme: KeyboardInputScheme = overlayModifierKeys(BaseKeyboardSequences, { altKey: true });

const ControlAltInputScheme: KeyboardInputScheme = overlayModifierKeys(BaseKeyboardSequences, { altKey: true, ctrlKey: true });

const CtrlShiftInputScheme: KeyboardInputScheme = overlayModifierKeys(BaseKeyboardSequences, { shiftKey: true, ctrlKey: true }, true);

export const KeyboardInputSchemes:KeyboardInputSchemesType = {
    "controlshift": CtrlShiftInputScheme,
    "controlalt": ControlAltInputScheme,
    "alt": AltInputScheme
};

const labelMessageKeysByCode = {
    "KeyA": "KeyboardInputModal.KeyLabels.A",
    "KeyB": "KeyboardInputModal.KeyLabels.B",
    "KeyD": "KeyboardInputModal.KeyLabels.D",
    "KeyE": "KeyboardInputModal.KeyLabels.E",
    "KeyI": "KeyboardInputModal.KeyLabels.I",
    "KeyP": "KeyboardInputModal.KeyLabels.P",
    "KeyS": "KeyboardInputModal.KeyLabels.S",
    "KeyR": "KeyboardInputModal.KeyLabels.R"
};

const labelMessageKeysByKey = {
    "?": "KeyboardInputModal.KeyLabels.QuestionMark",
    ">": "KeyboardInputModal.KeyLabels.GreaterThan",
    "<": "KeyboardInputModal.KeyLabels.LessThan"
};

export function getLabelMessageKeyFromKeyDef (keyDef: KeyDef) {
    if (keyDef.code && labelMessageKeysByCode[keyDef.code]) {
        return labelMessageKeysByCode[keyDef.code];
    }
    else if (keyDef.key && labelMessageKeysByKey[keyDef.key]) {
        return labelMessageKeysByKey[keyDef.key];
    }
    else {
        return "";
    }
};

const iconMessageKeysByCode = {
    "KeyA": "KeyboardInputModal.KeyIcons.A",
    "KeyB": "KeyboardInputModal.KeyIcons.B",
    "KeyD": "KeyboardInputModal.KeyIcons.D",
    "KeyE": "KeyboardInputModal.KeyIcons.E",
    "KeyI": "KeyboardInputModal.KeyIcons.I",
    "KeyP": "KeyboardInputModal.KeyIcons.P",
    "KeyS": "KeyboardInputModal.KeyIcons.S",
    "KeyR": "KeyboardInputModal.KeyIcons.R"
};

const iconMessageKeysByKey = {
    "?": "KeyboardInputModal.KeyIcons.QuestionMark",
    ">": "KeyboardInputModal.KeyIcons.GreaterThan",
    "<": "KeyboardInputModal.KeyIcons.LessThan"
};

export function getIconMessageKeyFromKeyDef (keyDef: KeyDef) {
    if (keyDef.code && iconMessageKeysByCode[keyDef.code]) {
        return iconMessageKeysByCode[keyDef.code];
    }
    else if (keyDef.key && iconMessageKeysByKey[keyDef.key]) {
        return iconMessageKeysByKey[keyDef.key];
    }
    else {
        return "";
    }
};

export function keyboardEventMatchesKeyDef (e: KeyboardEvent, keyDef: KeyDef) {
    if (e.code === keyDef.code || e.key === keyDef.key) {
        if (!!(keyDef.altKey) !== !!(e.altKey)) {
            return false;
        }
        if (!!(keyDef.ctrlKey) !== !!(e.ctrlKey)) {
            return false;
        }
        // We are more flexible about shift, which is only required if it's
        // specified in the keydef.
        if (keyDef.shiftKey && !e.shiftKey) {
            return false
        }
        return true;
    }

    return false;
};

export function findKeyboardEventSequenceMatches (events: Array<KeyboardEvent>, keyboardInputSchemeName: KeyboardInputSchemeName):ActionName | false | "partial" {
    const keyboardInputScheme = KeyboardInputSchemes[keyboardInputSchemeName];
    let match = false;

    if (events.length) {
        for (const singleKeySequence of Object.values(keyboardInputScheme)) {
            if (match === false || match === "partial") {
                // $FlowFixMe: Flow doesn't believe this matches our "or"ed set of allowed inputs.
                const keySequenceMatch = matchSingleInputSchemeLevel(events, singleKeySequence, 0);
                if (keySequenceMatch !== false) {
                    match = keySequenceMatch;
                }
            }
        }
    }

    return match;
}

function matchSingleInputSchemeLevel (events: Array<KeyboardEvent>, inputSchemeLevel: KeySequenceStep | ActionKeyStep, scanLevel:number): ActionName | false | "partial" {
    const eventToEvaluate = events[scanLevel];
    if (keyboardEventMatchesKeyDef(eventToEvaluate, inputSchemeLevel.keyDef)) {
        if (events.length === (scanLevel + 1)) {
            if (inputSchemeLevel.actionName) {
                // $FlowFixMe: Flow doesn't get that this is one of the things we can return, i.e. an ActionName;
                return inputSchemeLevel.actionName;
            }
            else {
                return "partial";
            }
        }
        else if (events.length > (scanLevel + 1)) {
            let subMatch = false;
            for (const [key, nextInputSchemeLevel] of Object.entries(inputSchemeLevel)) {
                if (key !== "keyDef" && subMatch === false) {
                    // $FlowFixMe: Flow doesn't get our "or"ed list of acceptable inputs.
                    subMatch = matchSingleInputSchemeLevel(events, nextInputSchemeLevel, scanLevel + 1);
                }
            };
            return subMatch;
        }
    }
    return false;
}

export function isRepeatedEvent (firstKeyboardEvent: KeyboardEvent, secondKeyboardEvent: KeyboardEvent) {
    for (const property of ["key", "code", "altKey", "ctrlKey"]) {
        // $FlowFixMe: Flow is confused about the structure of a keyboard event.
        if (firstKeyboardEvent[property] !== secondKeyboardEvent[property]) {
            return false;
        }
    }
    return true;
}
