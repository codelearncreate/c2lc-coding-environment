// @flow

import ProgramSequence from './ProgramSequence';
import { isWorldName } from './Worlds';
import type { ThemeName } from './types';
import type { WorldName } from './Worlds';

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

function generateEncodedProgramURL(versionString: string, themeString: string, worldString: string, programString: string, characterStateString: string, disallowedActionsString: string, startingPositionString: string): string {
    return `?v=${encodeURIComponent(versionString)}&t=${themeString}&w=${worldString}&p=${encodeURIComponent(programString)}&c=${encodeURIComponent(characterStateString)}&d=${encodeURIComponent(disallowedActionsString)}&s=${encodeURIComponent(startingPositionString)}`;
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

function getStartingPositionFromString(startingPositionQuery: ?string, maxX: number, maxY: number, defaultX: number, defaultY: number, defaultDirection: number): {| x: number, y: number, direction: number |} {
    let x = defaultX;
    let y = defaultY;
    let direction = defaultDirection
    if (startingPositionQuery && startingPositionQuery.length === 3) {
        try {
            const startingX = decodeCoordinate(startingPositionQuery.charAt(0));
            const startingY = decodeCoordinate(startingPositionQuery.charAt(1));
            const startingDirection = decodeDirection(startingPositionQuery.charAt(2));
            if (startingX >= 0 && startingX <= maxX
                    && startingY >= 0 && startingY <= maxY
                    && startingDirection >= 0 && startingDirection <= 7) {
                x = startingX;
                y = startingY;
                direction = startingDirection;
            }
        } catch(err) {
            x = defaultX;
            y = defaultY;
            direction = defaultDirection;
        }
    }
    return { x, y, direction };
}

function encodeCoordinate(value: number): string {
    // Remove any fractional digits, to make sure we have an integer
    value = Math.trunc(value);
    if (value === 0) {
        return '0';
    } else if (value > 0 && value <= 26) {
        return String.fromCharCode('a'.charCodeAt(0) - 1 + value);
    } else if (value > 26) {
        return 'z';
    } else if (value < 0 && value >= -26) {
        return String.fromCharCode('A'.charCodeAt(0) - 1 + Math.abs(value));
    } else if (value < -26) {
        return 'Z';
    }
    throw new Error(`Bad co-ordinate value: ${value}`);
}

function decodeCoordinate(character: string): number {
    if (character === '0') {
        return 0;
    }
    const charCode = character.charCodeAt(0);
    if (charCode >= 'a'.charCodeAt(0) && charCode <= 'z'.charCodeAt(0)) {
        return charCode - 'a'.charCodeAt(0) + 1;
    } else if (charCode >= 'A'.charCodeAt(0) && charCode <= 'Z'.charCodeAt(0)) {
        return (charCode - 'A'.charCodeAt(0) + 1) * -1;
    }
    throw new Error(`Bad co-ordinate character: '${character}'`);
}

function encodeDirection(direction: number): string {
    switch(direction) {
        case(0): return '0';
        case(1): return 'a';
        case(2): return 'b';
        case(3): return 'c';
        case(4): return 'd';
        case(5): return 'e';
        case(6): return 'f';
        case(7): return 'g';
        default: throw new Error(`Unrecognized direction ${direction}`);
    }
}

function decodeDirection(character: string): number {
    switch(character) {
        case('0'): return 0;
        case('a'): return 1;
        case('b'): return 2;
        case('c'): return 3;
        case('d'): return 4;
        case('e'): return 5;
        case('f'): return 6;
        case('g'): return 7;
        default: throw new Error(`Unrecognized direction character ${character}`);
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

function focusFirstInNodeList(elements: NodeList<HTMLElement>) {
    if (elements.length > 0) {
        const firstElem = elements[0];
        if (firstElem && firstElem.focus) {
            firstElem.focus();
        }
    }
}

function focusLastInNodeList(elements: NodeList<HTMLElement>) {
    if (elements.length > 0) {
        const lastElem = elements[elements.length - 1];
        if (lastElem && lastElem.focus) {
            lastElem.focus();
        }
    }
}

function generateLoopLabel(n: number): string {
    let label = '';
    while (n > 0) {
        label = String.fromCharCode('A'.charCodeAt(0) + ((n - 1) % 26)) + label;
        n = Math.floor((n - 1) / 26);
    }
    return label;
}

function parseLoopLabel(label: string): number {
    let n = 0;
    while (label.length > 0) {
        n *= 26;
        n += label.charCodeAt(0) - 'A'.charCodeAt(0) + 1;
        label = label.substring(1);
    }
    return n;
}

function isLoopBlock(blockType: string): boolean {
    return blockType === 'startLoop' || blockType === 'endLoop';
}

function moveToNextStepDisabled(programSequence: ProgramSequence, stepIndex: number): boolean {
    const programLastIndex = programSequence.getProgramLength() - 1;
    const { block, label } = programSequence.getProgramStepAt(stepIndex);
    if (block === 'startLoop') {
        const lastProgramStep = programSequence.getProgramStepAt(programLastIndex);
        if (lastProgramStep.block === 'endLoop' && lastProgramStep.label === label) {
            return true;
        }
    }
    return stepIndex === programLastIndex;
}

function moveToPreviousStepDisabled(programSequence: ProgramSequence, stepIndex: number): boolean {
    const { block, label } = programSequence.getProgramStepAt(stepIndex);
    if (block === 'endLoop') {
        const firstProgramStep = programSequence.getProgramStepAt(0);
        if (firstProgramStep.block === 'startLoop' && firstProgramStep.label === label) {
            return true;
        }
    }
    return stepIndex === 0;
}

export {
    decodeCoordinate,
    decodeDirection,
    encodeCoordinate,
    encodeDirection,
    extend,
    focusByQuerySelector,
    focusFirstInNodeList,
    focusLastInNodeList,
    generateEncodedProgramURL,
    generateId,
    generateLoopLabel,
    getThemeFromString,
    getWorldFromString,
    getStartingPositionFromString,
    isLoopBlock,
    makeDelayedPromise,
    moveToNextStepDisabled,
    moveToPreviousStepDisabled,
    parseLoopLabel
};
