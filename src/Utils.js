// @flow

import type { ThemeName, WorldName } from './types';

let idCounter: number = 0;

/* istanbul ignore next */
function generateId(prefix: string): string {
    const id = `${prefix}-${idCounter}`;
    idCounter += 1;
    return id;
}

/* istanbul ignore next */
function makeDelayedPromise(timeMs: number): Promise<void> {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, timeMs);
    });
}

function generateEncodedProgramURL(versionString: string, themeString: string, worldString: string, programString: string, characterStateString: string, allowedActionsString: string): string {
    return `?v=${encodeURIComponent(versionString)}&t=${themeString}&w=${worldString}&p=${encodeURIComponent(programString)}&c=${encodeURIComponent(characterStateString)}&a=${encodeURIComponent(allowedActionsString)}`;
}

function getThemeFromString(themeQuery: ?string, defaultThemeName: ThemeName): ThemeName {
    switch (themeQuery) {
        case('space'): return 'space';
        case('forest'): return 'forest';
        default: return defaultThemeName;
    }
}

function getWorldFromString(worldQuery: ?string, defaultWorldName: WorldName): ThemeName {
    switch (worldQuery) {
        case('space'): return 'space';
        case('forest'): return 'forest';
        default: return defaultWorldName;
    }
}

export { generateId, makeDelayedPromise, generateEncodedProgramURL, getThemeFromString, getWorldFromString };
