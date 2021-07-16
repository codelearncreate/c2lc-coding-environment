//@flow
import {extend} from './Utils';

export type KeyboardInputSchemeName = "nvda" | "voiceover";

export type KeyDef = {
    code?: string,
    key?: string,
    altKey?: boolean,
    ctrlKey?: boolean,
    hidden?: boolean
};

export type ActionName =
    // Single Key Commands
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

    // Select World Character
    | "selectRobotCharacter"
    | "selectRabbitCharacter"
    | "selectRocketCharacter"

    // Update Program
    | "deleteAll"
    ;

type ActionKeyStep = {
    actionName: ActionName,
    keyDef: KeyDef
};

type KeySequenceStep = {
    keyDef: KeyDef,
    [string]: KeySequenceStep | ActionKeyStep
};

export type KeyboardInputScheme = {
    [string]: KeySequenceStep | ActionKeyStep
};

export type KeyboardInputSchemesType = {
    "nvda": KeyboardInputScheme,
    "voiceover":  KeyboardInputScheme
};

const ExtendedKeyboardSequences: KeyboardInputScheme = {
    extraSettings: {
        keyDef: { code: "KeyX", key: "x", altKey: true, hidden: true},
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
                    keyDef: { key: "1"},
                    actionName: "selectForward1"
                },
                forward2: {
                    keyDef: { key: "2"},
                    actionName: "selectForward2"
                },
                forward3: {
                    keyDef: { key: "3"},
                    actionName: "selectForward3"
                }
            },
            backward: {
                keyDef: { code: "KeyB", key: "b" },
                backward1: {
                    keyDef: { key: "1"},
                    actionName: "selectBackward1"
                },
                backward2: {
                    keyDef: { key: "2"},
                    actionName: "selectBackward2"
                },
                backward3: {
                    keyDef: { key: "3"},
                    actionName: "selectBackward3"
                }
            },
            left: {
                keyDef: { code: "KeyL", key: "l" },
                left45: {
                    keyDef: { key: "1"},
                    actionName: "selectLeft45"
                },
                left90: {
                    keyDef: { key: "2"},
                    actionName: "selectLeft90"
                },
                left180: {
                    keyDef: { key: "3"},
                    actionName: "selectLeft180"
                }
            },
            right: {
                keyDef: { code: "KeyR", key: "r" },
                right45: {
                    keyDef: { key: "1"},
                    actionName: "selectRight45"
                },
                right90: {
                    keyDef: { key: "2"},
                    actionName: "selectRight90"
                },
                right180: {
                    keyDef: { key: "3"},
                    actionName: "selectRight180"
                }
            }
        },

        selectWorldCharacter: {
            keyDef: { code: "KeyW", key: "w"},
            robotCharacter: {
                keyDef: { key: "1"},
                actionName: "selectRobotCharacter"
            },
            rabbitCharacter: {
                keyDef: { key: "2"},
                actionName: "selectRabbitCharacter"
            },
            rocketCharacter: {
                keyDef: { key: "3"},
                actionName: "selectRocketCharacter"
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

        deleteAll: {
            keyDef: { code: "KeyD", key: "d" },
            actionName: "deleteAll"
        }
    }
}

const VoiceOverInputScheme: KeyboardInputScheme = Object.assign({
    addCommandToBeginning: {
        keyDef: { code: "KeyB", key: "b", altKey: true},
        actionName: "addCommandToBeginning"
    },
    addCommandToEnd: {
        keyDef: { code: "KeyE", key: "e", altKey: true},
        actionName: "addCommandToEnd"
    },
    deleteCurrentStep: {
        keyDef: { code: "KeyD", key: "d", altKey: true},
        actionName: "deleteCurrentStep"
    },
    announceScene: {
        keyDef: { code: "KeyI", key: "i", altKey: true},
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
        keyDef: { code: "KeyP", key: "p", altKey: true},
        actionName: "playPauseProgram"
    },
    refreshScene: {
        keyDef: { code: "KeyR", key: "r", altKey: true},
        actionName: "refreshScene"
    },
    showHide: {
        keyDef: { key: "?"},
        actionName: "showHide"
    },
    stopProgram: {
        keyDef: { code: "KeyS", key: "s", altKey: true},
        actionName: "stopProgram"
    }
}, ExtendedKeyboardSequences);

const NvdaExtendedKeyboardSequences = extend(ExtendedKeyboardSequences, {
    extraSettings: {
        keyDef: { ctrlKey: true }
    },

    focusChange: {
        keyDef: {ctrlKey: true }
    },

    selectedActionChange: {
        keyDef: { ctrlKey: true }
    },

    characterPosition: {
        keyDef: { ctrlKey: true }
    }
});

const NvdaInputScheme = Object.assign({
    addCommandToBeginning: {
        keyDef: { code: "KeyB", key: "b", altKey: true, ctrlKey: true},
        actionName: "addCommandToBeginning"
    },
    addCommandToEnd: {
        keyDef: { code: "KeyE", key: "e", altKey: true, ctrlKey: true},
        actionName: "addCommandToEnd"
    },
    deleteCurrentStep: {
        keyDef: { code: "KeyD", key: "d", altKey: true, ctrlKey: true},
        actionName: "deleteCurrentStep"
    },
    announceScene: {
        keyDef: {code: "KeyI", key: "i", altKey: true, ctrlKey: true},
        actionName: "announceScene"
    },
    decreaseProgramSpeed: {
        keyDef: { key: "<", shiftKey: true, hidden: true},
        actionName: "decreaseProgramSpeed"
    },
    increaseProgramSpeed: {
        keyDef: { key: ">", shiftKey: true, hidden: true},
        actionName: "increaseProgramSpeed"
    },
    playPauseProgram: {
        keyDef: { code: "KeyP", key: "p", altKey: true, ctrlKey: true},
        actionName: "playPauseProgram"
    },
    refreshScene: {
        keyDef: { code: "KeyR", key: "r", altKey: true, ctrlKey: true },
        actionName: "refreshScene"
    },
    showHide: {
        keyDef: { key: "?", shiftKey: true },
        actionName: "showHide"
    },
    stopProgram: {
        keyDef: {code: "KeyS", key: "s", altKey: true, ctrlKey: true},
        actionName: "stopProgram"
    },
}, NvdaExtendedKeyboardSequences);

export const KeyboardInputSchemes:KeyboardInputSchemesType = {
    "nvda": NvdaInputScheme,
    "voiceover": VoiceOverInputScheme
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
        return true;
    }

    return false;
};

export function findKeyboardEventSequenceMatches (events: Array<KeyboardEvent>, keyboardInputSchemeName: KeyboardInputSchemeName):ActionName | false | "partial" {
    const keyboardInputScheme = KeyboardInputSchemes[keyboardInputSchemeName];
    let match = false;

    for (const singleKeySequence of Object.values(keyboardInputScheme)) {
        if (match === false || match === "partial") {
            // $FlowFixMe: Flow doesn't believe this matches our "or"ed set of allowed inputs.
            const keySequenceMatch = matchSingleInputSchemeLevel(events, singleKeySequence, 0);
            if (keySequenceMatch !== false) {
                match = keySequenceMatch;
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
