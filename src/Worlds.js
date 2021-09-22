// @flow

import * as React from 'react';
import type { ThemeName } from './types';

// DeepOcean
import { ReactComponent as DeepOcean } from './svg/DeepOcean.svg';
import { ReactComponent as DeepOceanGray } from './svg/DeepOcean-gray.svg';
import { ReactComponent as DeepOceanContrast } from './svg/DeepOcean-contrast.svg';
import { ReactComponent as DeepOceanThumbnail } from './svg/DeepOceanThumbnail.svg';
import { ReactComponent as DeepOceanThumbnailGray } from './svg/DeepOceanThumbnail-gray.svg';
import { ReactComponent as DeepOceanThumbnailContrast } from './svg/DeepOceanThumbnail-contrast.svg';
import { ReactComponent as Submarine } from './svg/Submarine.svg';
import { ReactComponent as SubmarineGray } from './svg/Submarine-gray.svg';
import { ReactComponent as SubmarineContrast } from './svg/Submarine-contrast.svg';

// Jungle
import { ReactComponent as Jungle } from './svg/Jungle.svg';
import { ReactComponent as JungleGray } from './svg/Jungle-gray.svg';
import { ReactComponent as JungleContrast } from './svg/Jungle-contrast.svg';
import { ReactComponent as JungleThumbnail } from './svg/JungleThumbnail.svg';
import { ReactComponent as JungleThumbnailGray } from './svg/JungleThumbnail-gray.svg';
import { ReactComponent as JungleThumbnailContrast } from './svg/JungleThumbnail-contrast.svg';
import { ReactComponent as SafariJeep } from './svg/SafariJeep.svg';
import { ReactComponent as SafariJeepGray } from './svg/SafariJeep-gray.svg';
import { ReactComponent as SafariJeepContrast } from './svg/SafariJeep-contrast.svg';

// Sketchpad
import { ReactComponent as SketchpadThumbnail } from './svg/SketchpadThumbnail.svg';
import { ReactComponent as Robot } from './svg/Robot.svg';

// Space
import { ReactComponent as Space } from './svg/Space.svg';
import { ReactComponent as SpaceGray } from './svg/Space-gray.svg';
import { ReactComponent as SpaceContrast } from './svg/Space-contrast.svg';
import { ReactComponent as SpaceThumbnail } from './svg/SpaceThumbnail.svg';
import { ReactComponent as SpaceThumbnailGray } from './svg/SpaceThumbnail-gray.svg';
import { ReactComponent as SpaceThumbnailContrast } from './svg/SpaceThumbnail-contrast.svg';
import { ReactComponent as SpaceShip } from './svg/SpaceShip.svg';
import { ReactComponent as SpaceShipGray } from './svg/SpaceShip-gray.svg';
import { ReactComponent as SpaceShipContrast } from './svg/SpaceShip-contrast.svg';

export type WorldProperties = {|
    background: ?React.ComponentType<{}>,
    backgroundGray: ?React.ComponentType<{}>,
    backgroundContrast: ?React.ComponentType<{}>,
    backgroundInfo: ?{ [string]: string },
    thumbnail: React.ComponentType<{}>,
    thumbnailGray: React.ComponentType<{}>,
    thumbnailContrast: React.ComponentType<{}>,
    character: React.ComponentType<{}>,
    characterGray: React.ComponentType<{}>,
    characterContrast: React.ComponentType<{}>,
    startingX: number,
    startingY: number,
    startingDirection: number
|};

const worlds: {|
    'DeepOcean': WorldProperties,
    'Jungle': WorldProperties,
    'Sketchpad': WorldProperties,
    'Space': WorldProperties
|} = {
    'DeepOcean': {
        background: DeepOcean,
        backgroundGray: DeepOceanGray,
        backgroundContrast: DeepOceanContrast,
        backgroundInfo: {
            J2: 'fishGroup',
            K2: 'fishGroup',
            J3: 'fishGroup',
            K3: 'fishGroup',
            B4: 'babyJellyfish',
            C4: 'jellyfish',
            G4: 'shark',
            H4: 'shark',
            K4: 'shark',
            L4: 'coral',
            B5: 'babyJellyfish',
            C5: 'jellyfish',
            E5: 'shark',
            F5: 'shark',
            G5: 'shark',
            H5: 'shark',
            I5: 'shark',
            J5: 'shark',
            K5: 'shark',
            L5: 'coral',
            F6: 'shark',
            G6: 'shark',
            H6: 'shark',
            I6: 'shark',
            A7: 'fish',
            B7: 'coral',
            H7: 'treasure',
            I7: 'treasure',
            J7: 'treasure',
            A8: 'coral',
            B8: 'fish',
            H8: 'treasure',
            I8: 'treasure',
            J8: 'treasure',
            L8: 'fish'
        },
        thumbnail: DeepOceanThumbnail,
        thumbnailGray: DeepOceanThumbnailGray,
        thumbnailContrast: DeepOceanThumbnailContrast,
        character: Submarine,
        characterGray: SubmarineGray,
        characterContrast: SubmarineContrast,
        startingX: 1,
        startingY: 2,
        startingDirection: 2 // East
    },
    'Jungle': {
        background: Jungle,
        backgroundGray: JungleGray,
        backgroundContrast: JungleContrast,
        backgroundInfo: {
            G1: 'giraffe',
            J1: 'lion',
            F2: 'giraffe',
            G2: 'babyGiraffe',
            A4: 'tree',
            B4: 'tree',
            C4: 'tree',
            E4: 'bush',
            F4: 'bush',
            K4: 'tree',
            L4: 'tree',
            A5: 'tree',
            B5: 'tree',
            H5: 'flamingo',
            E6: 'babyAlligator',
            F6: 'babyAlligator',
            G6: 'pond',
            H6: 'flamingo',
            I6: 'pond',
            J6: 'hipo',
            K6: 'hipo',
            C7: 'alligator',
            D7: 'alligator',
            E7: 'alligator',
            F7: 'alligator',
            G7: 'pond',
            H7: 'pond',
            I7: 'pond',
            J7: 'pond',
            K7: 'bush',
            L7: 'bush',
            A8: 'bush',
            B8: 'bush',
            J8: 'bush',
            K8: 'bush',
            L8: 'bush'
        },
        thumbnail: JungleThumbnail,
        thumbnailGray: JungleThumbnailGray,
        thumbnailContrast: JungleThumbnailContrast,
        character: SafariJeep,
        characterGray: SafariJeepGray,
        characterContrast: SafariJeepContrast,
        startingX: 1,
        startingY: 2,
        startingDirection: 2 // East
    },
    'Sketchpad': {
        background: null,
        backgroundGray: null,
        backgroundContrast: null,
        backgroundInfo: null,
        thumbnail: SketchpadThumbnail,
        thumbnailGray: SketchpadThumbnail,
        thumbnailContrast: SketchpadThumbnail,
        character: Robot,
        characterGray: Robot,
        characterContrast: Robot,
        startingX: 1,
        startingY: 1,
        startingDirection: 2 // East
    },
    'Space': {
        background: Space,
        backgroundGray: SpaceGray,
        backgroundContrast: SpaceContrast,
        backgroundInfo: {
            A1: 'earth',
            C1: 'moon',
            F1: 'meteor',
            L1: 'aliens',
            A2: 'earth',
            B2: 'earth',
            H2: 'saturn',
            I2: 'saturn',
            J2: 'saturn',
            A3: 'earth',
            F3: 'asteroid',
            G3: 'asteroid',
            I3: 'saturn',
            J3: 'saturn',
            L3: 'star',
            B4: 'meteor',
            J5: 'asteroid',
            K5: 'asteroid',
            D6: 'mars',
            G6: 'meteor',
            A7: 'asteroid',
            B7: 'asteroid',
            I7: 'satellite',
            E8: 'star'
        },
        thumbnail: SpaceThumbnail,
        thumbnailGray: SpaceThumbnailGray,
        thumbnailContrast: SpaceThumbnailContrast,
        character: SpaceShip,
        characterGray: SpaceShipGray,
        characterContrast: SpaceShipContrast,
        startingX: 1,
        startingY: 2,
        startingDirection: 2 // East
    }
};

export type WorldName = $Keys<typeof worlds>;

export function isWorldName(str: ?string): boolean {
    return worlds.hasOwnProperty(str);
}

export function getWorldProperties(world: WorldName): WorldProperties {
    return worlds[world];
}

export function getBackgroundInfo(world: WorldName, columnLabel: string, rowLabel: string): ?string {
    const worldBackgroundInfo = worlds[world].backgroundInfo;
    if (worldBackgroundInfo) {
        const cellKey = columnLabel + rowLabel;
        if (worldBackgroundInfo.hasOwnProperty(cellKey)) {
            return worldBackgroundInfo[cellKey];
        } else {
            return null;
        }
    }
    return null;
}

export function getWorldCharacter(theme: ThemeName, world: WorldName): React.ComponentType<{}> {
    const worldProperties = worlds[world];
    if (theme === 'gray') {
        return worldProperties.characterGray;
    } else if (theme === 'contrast') {
        return worldProperties.characterContrast;
    } else {
        return worldProperties.character;
    }
}

export function getWorldThumbnail(theme: ThemeName, world: WorldName): React.ComponentType<{}> {
    const worldProperties = worlds[world];
    if (theme === 'gray') {
        return worldProperties.thumbnailGray;
    } else if (theme === 'contrast') {
        return worldProperties.thumbnailContrast;
    } else {
        return worldProperties.thumbnail;
    }
}
