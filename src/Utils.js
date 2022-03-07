// @flow

import { isWorldName } from './Worlds';
import type { ThemeName } from './types';
import type { WorldName } from './Worlds';
import type { KeyDef, KeyboardInputScheme} from './KeyboardInputSchemes';

let idCounter: number = 0;

/* istanbul ignore next */
function generateId(prefix: string): string {
    const id = `${prefix}-${idCounter}`;
    idCounter += 1;
    return id;
}

/* istanbul ignore next */
function makeDelayedPromise(timeMs: number): Promise<void> {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, timeMs);
    });
}

function generateEncodedProgramURL(versionString: string, themeString: string, worldString: string, programString: string, characterStateString: string, disallowedActionsString: string): string {
    return `?v=${encodeURIComponent(versionString)}&t=${themeString}&w=${worldString}&p=${encodeURIComponent(programString)}&c=${encodeURIComponent(characterStateString)}&d=${encodeURIComponent(disallowedActionsString)}`;
}


/*
    "default"    => A mixture of light and dark elements, with colour.
    "light"    => A light theme, with colour.
    "dark"     => A dark theme, with colour.
    "gray"     => A grayscale theme, without colour.
    "contrast" => A high-contrast black and white theme.
*/
function getThemeFromString(themeQuery: ?string, defaultThemeName: ThemeName): ThemeName {
    switch (themeQuery) {
        case('default'): return 'default';
        case('dark'): return 'dark';
        case('light'): return 'light';
        case('gray'): return 'gray';
        case('contrast'): return 'contrast';
        default: return defaultThemeName;
    }
}

function getWorldFromString(worldQuery: ?string, defaultWorldName: WorldName): WorldName {
    switch (worldQuery) {
        // Convert old world names to the new world names
        case('space'):
            return 'Space';
        case('forest'):
            return 'Jungle';
        // If 'worldQuery' is a known world name, use it,
        // otherwise return 'defaultWorldName'
        default:
            if (isWorldName(worldQuery)) {
                return ((worldQuery: any): WorldName);
            } else {
                return defaultWorldName;
            }
    }
}

/**
 * A simplified pure JS equivalent of jQuery.extend that always performs a
 * "deep" merge.
 *
 * @param  {...Object} toMerge - One or more objects to be merged together from left to right.
 * @returns {Object} - The merged object.
 *
 */
function extend(...toMerge:Object) {
    const merged = {};
    for (const singleEntryToMerge of toMerge) {
        for (const [key, value] of Object.entries(singleEntryToMerge)) {
            if (typeof value === "object" && !Array.isArray(value) && (typeof merged[key] === "object" && !Array.isArray(merged[key]) && merged[key] !== null)) {
                merged[key] = extend(merged[key], value);
            }
            else {
                merged[key] = value;
            }
        }
    }
    return merged;
}

function focusByQuerySelector(selectors: string) {
    const element = document.querySelector(selectors);
    if (element && element.focus) {
        element.focus();
    }
}

function generateLoopLabel(n: number): string {
    let label = '';
    while (n > 0) {
        label = String.fromCharCode('A'.charCodeAt(0) + ((n - 1) % 26)) + label;
        n = Math.floor((n - 1) / 26);
    }
    return label;
};

function parseLoopLabel(label: string): number {
    let n = 0;
    while (label.length > 0) {
        n *= 26;
        n += label.charCodeAt(0) - 'A'.charCodeAt(0) + 1;
        label = label.substring(1);
    }
    return n;
};

function overlayModifierKeys (originalBindings: KeyboardInputScheme, modifiers: KeyDef, deep: ?boolean): KeyboardInputScheme {
    const modifiedBindings = {};
    const excludedBindingKeys = ["showHide", "decreaseProgramSpeed", "increaseProgramSpeed"];

    for (const key in originalBindings) {
        const value = originalBindings[key]
        const isExcluded = excludedBindingKeys.indexOf(key) !== -1;
        // $FlowFixMe: Flow doesn't understand that shiftKey shouldn't have to match the [string] rules.
        modifiedBindings[key] = isExcluded ? value : overlaySingleLevel(value, modifiers, deep);
    }
    return modifiedBindings;
}

function overlaySingleLevel (originalLevel: KeyDef, modifiers: KeyDef, deep: ?boolean ): KeyDef {
    const modifiedLevel = {};

    for (const key in originalLevel) {
        const originalValue = originalLevel[key];
        if (key === "keyDef") {
            modifiedLevel[key] = extend({}, originalValue, modifiers);
        }
        else {
            modifiedLevel[key] = originalValue;
        }

        if (deep && typeof originalValue === "object" && !Array.isArray(originalValue)) {
            modifiedLevel[key] = overlaySingleLevel(modifiedLevel[key], modifiers, deep);
        }
    }

    return modifiedLevel;
}

export { extend, focusByQuerySelector, generateId, makeDelayedPromise, generateEncodedProgramURL, getThemeFromString, getWorldFromString, generateLoopLabel, parseLoopLabel, overlayModifierKeys };
